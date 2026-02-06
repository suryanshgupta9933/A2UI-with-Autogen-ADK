# A2UI Autogen Backend - Modular Architecture

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import uvicorn
import traceback
import json

# Core Imports
from core.logger import configure_logger
from core.exceptions import A2UIValidationError

# A2UI Imports
from a2ui.validator import validate_a2ui_payload
from a2ui.types import JsonRpcRequest, JsonRpcResponse, MessagePart

# Agent Imports
from agents.ui_agent import UIAgent, parse_a2ui_response, ChatMessage

# Load environment variables
load_dotenv()

# Initialize Logger
logger = configure_logger("main")

app = FastAPI(title="A2UI Autogen Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store agent instance and conversation history per session
_agent_instance: Optional[UIAgent] = None
_conversation_history: List[ChatMessage] = []


def get_agent() -> UIAgent:
    """Get or create the agent instance."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = UIAgent()
    return _agent_instance


@app.post("/", response_model=JsonRpcResponse)
async def chat_root(request: JsonRpcRequest):
    return await chat(request)


@app.post("/chat", response_model=JsonRpcResponse)
async def chat(request: JsonRpcRequest):
    global _conversation_history
    
    logger.info(f"Received request: {request}")
    
    try:
        # 1. Get prompt from request
        prompt = request.get_query_text()
        logger.info(f"User Prompt: {prompt}")

        # 2. Get agent and run with history
        agent = get_agent()
        result = await agent.run(user_message=prompt, history=_conversation_history)
        
        # 3. Process result messages
        static_ui_payloads = []
        agent_text_responses = []  # Collect ALL agent text messages
        
        if result.messages:
            # Log all messages for debugging
            logger.info(f"=== Processing {len(result.messages)} messages ===")
            
            for i, msg in enumerate(result.messages):
                msg_type = type(msg).__name__
                msg_source = getattr(msg, 'source', '')
                content_preview = ""
                
                if hasattr(msg, 'content'):
                    if isinstance(msg.content, str):
                        content_preview = msg.content[:100] + "..." if len(msg.content) > 100 else msg.content
                    elif isinstance(msg.content, list):
                        content_preview = f"[list with {len(msg.content)} items]"
                
                logger.info(f"  [{i}] type={msg_type}, source={msg_source}, content={content_preview}")
                
                # Skip user messages
                if msg_source == 'user':
                    continue
                
                # Extract static UI from tool results (FunctionExecutionResultMessage)
                if hasattr(msg, 'content') and isinstance(msg.content, list):
                    for content_item in msg.content:
                        if hasattr(content_item, 'content') and isinstance(content_item.content, str):
                            try:
                                parsed = json.loads(content_item.content)
                                if isinstance(parsed, dict) and parsed.get("type") == "static_ui":
                                    static_ui_payloads.append(parsed)
                                    logger.info(f"  → Found static UI: {parsed.get('component')}")
                            except (json.JSONDecodeError, TypeError):
                                pass
                
                # Collect text response from agent (source should be 'ui_agent')
                if msg_source == 'ui_agent' and hasattr(msg, 'content') and isinstance(msg.content, str):
                    content = msg.content.strip()
                    
                    # Skip raw static_ui JSON
                    if content.startswith('{"type"') or content.startswith('[{"'):
                        continue
                    
                    # Remove any embedded JSON
                    if '"static_ui"' in content:
                        json_start = content.find('{"type"')
                        if json_start > 0:
                            content = content[:json_start].strip()
                        else:
                            continue
                    
                    if content:
                        agent_text_responses.append(content)
                        logger.info(f"  → Collected agent text: {content[:50]}...")
        
        # Use the LAST agent text response (after tool reflection)
        agent_text_response = agent_text_responses[-1] if agent_text_responses else ""
        logger.info(f"Final text response: {agent_text_response[:100] if agent_text_response else '(empty)'}...")
        
        # Default message if we have UI but no text
        if static_ui_payloads and not agent_text_response:
            component_names = [p.get('component', 'unknown') for p in static_ui_payloads]
            agent_text_response = f"Here's the {', '.join(component_names)} you requested:"
        
        if not agent_text_response and not static_ui_payloads:
            agent_text_response = "I processed your request."

        # 4. Update conversation history
        _conversation_history.append(ChatMessage(role="user", content=prompt))
        _conversation_history.append(ChatMessage(role="assistant", content=agent_text_response))
        
        # Keep history manageable
        if len(_conversation_history) > 20:
            _conversation_history = _conversation_history[-20:]


        # 5. Parse for dynamic A2UI
        parsed_response = parse_a2ui_response(agent_text_response)
        
        if parsed_response.a2ui_payload:
            logger.info(f"Found {len(parsed_response.a2ui_payload)} A2UI messages")
            try:
                validate_a2ui_payload(parsed_response.a2ui_payload)
            except A2UIValidationError as e:
                logger.error(f"A2UI Validation Error: {e}")
                parsed_response.a2ui_payload = []
        
        # 6. Build response parts
        response_parts = []
        
        if parsed_response.response:
            response_parts.append({"kind": "text", "text": parsed_response.response})
        
        for static_payload in static_ui_payloads:
            response_parts.append({
                "kind": "data",
                "data": static_payload,
                "mimeType": "application/json+static-ui"
            })
            logger.info(f"Added static UI: {static_payload.get('component')}")
        
        if parsed_response.a2ui_payload:
            for item in parsed_response.a2ui_payload:
                response_parts.append({
                    "kind": "data",
                    "data": item,
                    "mimeType": "application/json+a2ui"
                })

        task_result = {
            "kind": "task",
            "status": {
                "message": {
                    "parts": response_parts,
                    "role": "model",
                    "kind": "message"
                }
            }
        }

        return JsonRpcResponse(id=request.id, result=task_result)

    except Exception as e:
        logger.error(f"Error processing chat request: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/clear-history")
async def clear_history():
    """Clear conversation history."""
    global _conversation_history
    _conversation_history = []
    return {"status": "ok", "message": "History cleared"}


from fastapi.responses import FileResponse

@app.get("/.well-known/agent-card.json")
async def get_agent_card():
    return FileResponse("agent_card.json", media_type="application/json")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
