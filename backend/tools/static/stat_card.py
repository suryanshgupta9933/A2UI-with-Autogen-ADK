"""
Stat Card Tool

Displays a single statistic/KPI card with optional change indicator.
Use for: totals, counts, conversion rates, revenue, key metrics.
"""

from typing import Dict, Any, Optional, Literal
from autogen_core.tools import FunctionTool, Tool

from tools.base_tool import BaseTool, StaticUIResult


class StatCardTool(BaseTool):
    """Tool for displaying stat/KPI cards."""
    
    @property
    def name(self) -> str:
        return "show_stat_card"
    
    @property
    def description(self) -> str:
        return "Display a statistic/KPI card showing a single important metric. Use for totals, counts, conversion rates, revenue figures, or any key performance indicator."
    
    @property
    def component(self) -> str:
        return "stat_card"
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The metric name (e.g., 'Total Revenue', 'Active Users')"
                },
                "value": {
                    "type": "string",
                    "description": "The metric value (e.g., '$1,234,567', '42', '98.5%')"
                },
                "subtitle": {
                    "type": "string",
                    "description": "Optional context (e.g., 'vs last month', 'this quarter')"
                },
                "change_value": {
                    "type": "number",
                    "description": "Optional percentage change (e.g., 12.5 for +12.5%)"
                },
                "change_direction": {
                    "type": "string",
                    "enum": ["up", "down", "neutral"],
                    "description": "Direction of change - 'up', 'down', or 'neutral'"
                },
                "icon": {
                    "type": "string",
                    "description": "Optional emoji icon (e.g., '💰', '👥', '📈')"
                }
            },
            "required": ["title", "value"]
        }
    
    def execute(
        self,
        title: str,
        value: str,
        subtitle: Optional[str] = None,
        change_value: Optional[float] = None,
        change_direction: Optional[Literal["up", "down", "neutral"]] = None,
        icon: Optional[str] = None
    ) -> StaticUIResult:
        data: Dict[str, Any] = {
            "title": title,
            "value": value
        }
        
        if subtitle:
            data["subtitle"] = subtitle
        
        if change_value is not None and change_direction:
            data["change"] = {
                "value": change_value,
                "direction": change_direction
            }
        
        if icon:
            data["icon"] = icon
        
        return StaticUIResult(
            component=self.component,
            data=data
        )
    
    def as_function_tool(self) -> Tool:
        """Return an Autogen FunctionTool for this tool."""
        def show_stat_card(
            title: str,
            value: str,
            subtitle: Optional[str] = None,
            change_value: Optional[float] = None,
            change_direction: Optional[str] = None,
            icon: Optional[str] = None
        ) -> str:
            """Display a stat/KPI card. Use for totals, counts, metrics, or key performance indicators."""
            result = self.execute(
                title=title, value=value, subtitle=subtitle,
                change_value=change_value, change_direction=change_direction, icon=icon
            )
            return result.to_json()
        
        return FunctionTool(show_stat_card, description=self.description)


# Singleton instance
stat_card_tool = StatCardTool()
