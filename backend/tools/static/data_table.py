"""
Data Table Tool

Displays data in a formatted table with columns and rows.
Use for: lists of users, products, transactions, inventory, etc.
"""

from typing import Dict, Any, List, Optional
from autogen_core.tools import FunctionTool, Tool

from tools.base_tool import BaseTool, StaticUIResult


class DataTableTool(BaseTool):
    """Tool for displaying tabular data."""
    
    @property
    def name(self) -> str:
        return "show_data_table"
    
    @property
    def description(self) -> str:
        return "Display data in a formatted table. Use for tabular data like lists of users, products, transactions, inventory items."
    
    @property
    def component(self) -> str:
        return "data_table"
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "properties": {
                "columns": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of column headers (e.g., ['Name', 'Email', 'Role'])"
                },
                "rows": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "description": "List of rows, each row is a list of cell values"
                },
                "title": {
                    "type": "string",
                    "description": "Optional title for the table"
                }
            },
            "required": ["columns", "rows"]
        }
    
    def execute(
        self,
        columns: List[str],
        rows: List[List[Any]],
        title: Optional[str] = None
    ) -> StaticUIResult:
        return StaticUIResult(
            component=self.component,
            data={
                "columns": columns,
                "rows": rows,
                "title": title
            }
        )
    
    def as_function_tool(self) -> Tool:
        """Return an Autogen FunctionTool for this tool."""
        def show_data_table(
            columns: List[str],
            rows: List[List[Any]],
            title: Optional[str] = None
        ) -> str:
            """Display data in a formatted table. Use for tabular data like lists of users, products, transactions."""
            result = self.execute(columns=columns, rows=rows, title=title)
            return result.to_json()
        
        return FunctionTool(show_data_table, description=self.description)


# Singleton instance
data_table_tool = DataTableTool()
