"""
Static UI Tools Package

Exports all static UI tools following the BaseTool contract.
Each tool has an as_function_tool() method for Autogen integration.
"""

from typing import List
from autogen_core.tools import Tool

from tools.static.data_table import data_table_tool, DataTableTool
from tools.static.time_series import time_series_tool, TimeSeriesTool
from tools.static.stat_card import stat_card_tool, StatCardTool

# All tool instances
ALL_STATIC_TOOLS = [
    data_table_tool,
    time_series_tool,
    stat_card_tool,
]


def get_static_ui_tools() -> List[Tool]:
    """
    Get all static UI tools as Autogen FunctionTools.
    Each tool class provides its own as_function_tool() method.
    """
    return [tool.as_function_tool() for tool in ALL_STATIC_TOOLS]


# Export
__all__ = [
    "data_table_tool",
    "time_series_tool",
    "stat_card_tool",
    "DataTableTool",
    "TimeSeriesTool",
    "StatCardTool",
    "ALL_STATIC_TOOLS",
    "get_static_ui_tools",
]
