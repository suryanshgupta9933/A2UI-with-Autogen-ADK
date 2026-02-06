"""
Time Series Chart Tool

Displays a time series/trend chart with data points over time.
Use for: sales trends, metrics over time, analytics, historical data.
"""

from typing import Dict, Any, List, Optional
from autogen_core.tools import FunctionTool, Tool

from tools.base_tool import BaseTool, StaticUIResult


class TimeSeriesTool(BaseTool):
    """Tool for displaying time series charts."""
    
    @property
    def name(self) -> str:
        return "show_time_series"
    
    @property
    def description(self) -> str:
        return "Display a time series chart showing data over time. Use for sales trends, metrics, analytics, or any historical data visualization."
    
    @property
    def component(self) -> str:
        return "time_series"
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "properties": {
                "points": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "timestamp": {"type": "string", "description": "Date or time label"},
                            "value": {"type": "number", "description": "Numeric value"}
                        },
                        "required": ["timestamp", "value"]
                    },
                    "description": "List of data points with timestamp and value"
                },
                "title": {
                    "type": "string",
                    "description": "Optional chart title"
                },
                "x_axis_label": {
                    "type": "string",
                    "description": "Optional label for x-axis"
                },
                "y_axis_label": {
                    "type": "string",
                    "description": "Optional label for y-axis"
                }
            },
            "required": ["points"]
        }
    
    def execute(
        self,
        points: List[Dict[str, Any]],
        title: Optional[str] = None,
        x_axis_label: Optional[str] = None,
        y_axis_label: Optional[str] = None
    ) -> StaticUIResult:
        return StaticUIResult(
            component=self.component,
            data={
                "points": points,
                "title": title,
                "xAxisLabel": x_axis_label,
                "yAxisLabel": y_axis_label
            }
        )
    
    def as_function_tool(self) -> Tool:
        """Return an Autogen FunctionTool for this tool."""
        def show_time_series(
            points: List[Dict[str, Any]],
            title: Optional[str] = None,
            x_axis_label: Optional[str] = None,
            y_axis_label: Optional[str] = None
        ) -> str:
            """Display a time series chart. Use for trends, analytics, or historical data over time."""
            result = self.execute(points=points, title=title, x_axis_label=x_axis_label, y_axis_label=y_axis_label)
            return result.to_json()
        
        return FunctionTool(show_time_series, description=self.description)


# Singleton instance
time_series_tool = TimeSeriesTool()
