"""
UI Agent

Agent that generates UI components - both static pre-built components 
and dynamic A2UI. Supports conversation history for context-aware responses.
"""

import os
import re
import json
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel
from typing import Dict, Any

from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from autogen_core.model_context import HeadAndTailChatCompletionContext
from autogen_core.models import SystemMessage, UserMessage, AssistantMessage

from a2ui.prompt_builder import get_a2ui_system_prompt
from core.logger import configure_logger
from tools.static import get_static_ui_tools, ALL_STATIC_TOOLS

logger = configure_logger("agents.ui_agent")

# Prompt file path
PROMPT_FILE = Path(__file__).parent / "prompts" / "ui_agent.txt"


class ChatMessage(BaseModel):
    """A single chat message for history."""
    role: str  # "user" or "assistant"
    content: str


class AgentResponse(BaseModel):
    """Parsed response from the agent."""
    response: str
    a2ui_payload: Optional[List[Dict[str, Any]]] = None
    static_ui_payload: Optional[List[Dict[str, Any]]] = None


def get_model_client() -> AzureOpenAIChatCompletionClient:
    """Get Azure OpenAI model client."""
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if api_key:
        api_key = api_key.strip('"').strip("'")
    
    opts = {
        "azure_deployment": os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini").strip('"').strip("'"),
        "model": os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini").strip('"').strip("'"),
        "api_key": api_key,
        "azure_endpoint": os.getenv("AZURE_OPENAI_ENDPOINT").strip('"').strip("'"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview").strip('"').strip("'"),
    }
    logger.info(f"Model client initialized: {opts['model']}")
    return AzureOpenAIChatCompletionClient(**opts)


def parse_a2ui_response(response_text: str) -> AgentResponse:
    """
    Parse agent response for A2UI JSON payload.
    Format: [Text Response] ---a2ui_JSON--- [JSON Payload]
    """
    delimiter = "---a2ui_JSON---"
    parts = response_text.split(delimiter)
    
    text_part = parts[0].strip()
    json_part = "[]"
    
    if len(parts) > 1:
        json_part = parts[1].strip()
        json_part = re.sub(r"^```json", "", json_part)
        json_part = re.sub(r"^```", "", json_part)
        json_part = re.sub(r"```$", "", json_part)
        json_part = json_part.strip()

    a2ui_payload = []
    try:
        if json_part:
            a2ui_payload = json.loads(json_part)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode A2UI JSON: {e}")

    return AgentResponse(
        response=text_part,
        a2ui_payload=a2ui_payload
    )


def _load_prompt_file() -> str:
    """Load the system prompt from the external file."""
    try:
        with open(PROMPT_FILE, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        logger.warning(f"Prompt file not found: {PROMPT_FILE}")
        return ""


def _get_system_prompt() -> str:
    """Build the complete system prompt from file + A2UI base prompt."""
    ui_agent_prompt = _load_prompt_file()
    base_prompt = get_a2ui_system_prompt()
    return ui_agent_prompt + "\n\n" + base_prompt


class UIAgent:
    """
    UI Agent for generating UI components with conversation history support.
    """
    
    def __init__(self):
        self._model_client = get_model_client()
        self._tools = get_static_ui_tools()
        self._system_prompt = _get_system_prompt()
        
        logger.info(f"UIAgent initialized with {len(self._tools)} tools")
    
    async def run(self, user_message: str, history: Optional[List[ChatMessage]] = None):
        """
        Run one chat turn with optional conversation history.
        
        Args:
            user_message: Current user message
            history: Optional list of previous messages for context
            
        Returns:
            Agent run result with messages
        """
        # Build initial messages from history
        initial_messages: List = [
            SystemMessage(content=self._system_prompt, source="system")
        ]
        
        # Add conversation history
        if history:
            for msg in history:
                if msg.role == "assistant":
                    initial_messages.append(
                        AssistantMessage(content=msg.content, source="ui_agent")
                    )
                else:
                    initial_messages.append(
                        UserMessage(content=msg.content, source="user")
                    )
        
        # Create model context with head/tail to manage token usage
        model_context = HeadAndTailChatCompletionContext(
            initial_messages=initial_messages,
            head_size=5,
            tail_size=10,
        )
        
        # Create agent with context
        agent = AssistantAgent(
            name="ui_agent",
            model_client=self._model_client,
            tools=self._tools,
            model_context=model_context,
            reflect_on_tool_use=True,
        )
        
        # Run the agent
        result = await agent.run(task=user_message)
        
        return result


# Convenience function
def create_ui_agent() -> UIAgent:
    """Create a new UIAgent instance."""
    return UIAgent()
