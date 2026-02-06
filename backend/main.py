"""
A2UI Autogen Backend - Modular Architecture
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import uvicorn
import traceback

# Core Imports
from core.logger import configure_logger
from core.exceptions import A2UIValidationError

# A2UI Imports
from a2ui.validator import validate_a2ui_payload

# Agent Imports
from agents.data_agent import create_data_agent, parse_a2ui_response, AgentResponse

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

# Request/Response Models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str
    a2ui_json: Optional[List[Dict[str, Any]]] = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    logger.info(f"Received chat request: {request.message}")
    
    try:
        # Create and run agent
        agent = create_data_agent()
        
        # We assume single-turn chat for this POC
        # processing the stream to get the final message content
        final_text_content = ""
        
        # Run agent and capture the result
        # Note: autogen_agentchat 0.4.x run() returns a TaskResult
        result = await agent.run(task=request.message)
        
        # The agent is using our custom prompt strategy, so the output is in the last message content
        if result.messages:
            last_msg = result.messages[-1]
            if hasattr(last_msg, 'content') and isinstance(last_msg.content, str):
                final_text_content = last_msg.content
        
        if not final_text_content:
            raise ValueError("Agent produced no output content.")

        # Parse the custom response format (Text ---a2ui_JSON--- JSON)
        agent_response = parse_a2ui_response(final_text_content)
        
        logger.info(f"Agent Text Response: {agent_response.response[:50]}...")
        if agent_response.a2ui_payload:
            logger.info(f"Agent generated {len(agent_response.a2ui_payload)} A2UI messages.")
            
            # VALIDATE A2UI PAYLOAD
            try:
                validate_a2ui_payload(agent_response.a2ui_payload)
            except A2UIValidationError as e:
                logger.error(f"A2UI Validation Error: {e}")
                # We can choose to return an error, or just return text without UI
                # For this demo, let's include the error in thoughts or log it
                agent_response.thoughts += f"\n[System Error]: Generated UI failed validation: {str(e)}"
                agent_response.a2ui_payload = [] # Clear invalid payload
        
        return ChatResponse(
            text=agent_response.response,
            a2ui_json=agent_response.a2ui_payload
        )

    except Exception as e:
        logger.error(f"Error processing chat request: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
