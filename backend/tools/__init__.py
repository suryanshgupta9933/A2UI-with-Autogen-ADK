"""
Tools Package

Exports all tools and the base tool contract.
"""

from tools.base_tool import BaseTool, StaticUIResult, ToolDefinition, create_autogen_tool
from tools.static import (
    ALL_STATIC_TOOLS,
    data_table_tool,
    time_series_tool,
    stat_card_tool,
)

__all__ = [
    # Base classes
    "BaseTool",
    "StaticUIResult",
    "ToolDefinition",
    "create_autogen_tool",
    # Tool instances
    "ALL_STATIC_TOOLS",
    "data_table_tool",
    "time_series_tool",
    "stat_card_tool",
]
