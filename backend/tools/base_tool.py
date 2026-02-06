"""
Base Tool Contract

All static UI tools inherit from this base class to ensure consistency.
Each tool defines its schema, which is passed to the LLM for function calling.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import json


class ToolSchema(BaseModel):
    """Schema definition for a tool parameter."""
    type: str
    description: str
    enum: Optional[List[str]] = None
    items: Optional[Dict[str, Any]] = None


class ToolDefinition(BaseModel):
    """Complete tool definition for LLM function calling."""
    name: str
    description: str
    parameters: Dict[str, Any]
    
    @classmethod
    def create(
        cls,
        name: str,
        description: str,
        properties: Dict[str, Dict[str, Any]],
        required: List[str]
    ) -> "ToolDefinition":
        """Helper to create a tool definition with proper schema format."""
        return cls(
            name=name,
            description=description,
            parameters={
                "type": "object",
                "properties": properties,
                "required": required
            }
        )


class StaticUIResult(BaseModel):
    """Standard result format for static UI tools."""
    type: str = "static_ui"
    component: str
    data: Dict[str, Any]
    
    def to_json(self) -> str:
        return self.model_dump_json()


class BaseTool(ABC):
    """
    Base class for all static UI tools.
    
    Each tool must implement:
    - name: Tool identifier
    - description: Description for LLM
    - get_schema(): Returns parameter schema
    - execute(**kwargs): Executes the tool and returns StaticUIResult
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Unique tool name used for function calling."""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Description shown to the LLM."""
        pass
    
    @property
    @abstractmethod
    def component(self) -> str:
        """Frontend component identifier (e.g., 'data_table')."""
        pass
    
    @abstractmethod
    def get_schema(self) -> Dict[str, Any]:
        """
        Return the parameter schema for this tool.
        
        Format:
        {
            "properties": {
                "param_name": {
                    "type": "string",
                    "description": "Param description"
                },
                ...
            },
            "required": ["param1", "param2"]
        }
        """
        pass
    
    @abstractmethod
    def execute(self, **kwargs) -> StaticUIResult:
        """Execute the tool and return a StaticUIResult."""
        pass
    
    def get_definition(self) -> ToolDefinition:
        """Get the complete tool definition for LLM function calling."""
        schema = self.get_schema()
        return ToolDefinition(
            name=self.name,
            description=self.description,
            parameters={
                "type": "object",
                "properties": schema.get("properties", {}),
                "required": schema.get("required", [])
            }
        )
    
    def __call__(self, **kwargs) -> str:
        """Make the tool callable, returns JSON string for Autogen."""
        result = self.execute(**kwargs)
        return result.to_json()


def create_autogen_tool(tool: BaseTool):
    """
    Create an Autogen-compatible tool function from a BaseTool instance.
    Returns the tool's execute method directly, which has proper type annotations.
    """
    # Return the execute method directly - it has proper type hints
    func = tool.execute
    
    # Create a wrapper that returns JSON string
    import functools
    
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.to_json()
    
    # Copy over the proper annotations
    wrapper.__name__ = tool.name
    wrapper.__doc__ = tool.description
    
    return wrapper
