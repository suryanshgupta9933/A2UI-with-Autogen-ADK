import os
import re
import json
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient

from a2ui.prompt_builder import get_a2ui_system_prompt
from core.logger import configure_logger

logger = configure_logger("agents.data_agent")

class AgentResponse(BaseModel):
    response: str
    a2ui_payload: Optional[List[Dict[str, Any]]] = None

def get_model_client():
    """Get Azure OpenAI model client."""
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    if api_key: api_key = api_key.strip('"').strip("'")
    
    opts = {
        "azure_deployment": os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini").strip('"').strip("'"),
        "model": os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4.1-mini").strip('"').strip("'"),
        "api_key": api_key,
        "azure_endpoint": os.getenv("AZURE_OPENAI_ENDPOINT").strip('"').strip("'"),
        "api_version": os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview").strip('"').strip("'"),
    }
    logger.info(f"Agents initialized with model: {opts['model']}")
    return AzureOpenAIChatCompletionClient(**opts)

def parse_a2ui_response(response_text: str) -> AgentResponse:
    """
    Parses the raw text response from the agent into an AgentResponse object.
    Expects the format: [Text Response] ---a2ui_JSON--- [JSON Payload]
    """
    delimiter = "---a2ui_JSON---"
    parts = response_text.split(delimiter)
    
    text_part = parts[0].strip()
    json_part = "[]"
    
    if len(parts) > 1:
        json_part = parts[1].strip()
        # Handle cases where the model might output markdown code blocks
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
        # We don't crash, just return empty UI
        pass

    return AgentResponse(
        response=text_part,
        a2ui_payload=a2ui_payload
    )

def create_data_agent() -> AssistantAgent:
    """Create the main data visualization agent."""
    model_client = get_model_client()
    system_prompt = get_a2ui_system_prompt()
    
    return AssistantAgent(
        name="DataVisualizationAgent",
        model_client=model_client,
        tools=[], # No tools, direct generation via prompt strategy
        system_message=system_prompt,
    )
