import json
import os
from pathlib import Path
from typing import List, Dict, Any
from autogen_core.tools import FunctionTool

class JiraTools:
    """
    Class to manage Jira-related tools and data.
    Fetches data from jira_data.json in the backend root.
    """
    def __init__(self):
        # Data file is in backend root, tools/data/jira.py is 3 levels deep from backend/
        self.data_path = Path(__file__).resolve().parent.parent.parent / "jira_data.json"
        self.tickets = self._load_data()

    def _load_data(self) -> List[Dict[str, Any]]:
        if not self.data_path.exists():
            return []
        try:
            with open(self.data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def get_jira_projects(self) -> List[str]:
        """
        Get a list of unique Jira project names (e.g., PROJ, OPS, DATA).
        """
        return list(set(t["project"] for t in self.tickets))

    def get_jira_tickets(self, projects: List[str]) -> List[Dict[str, Any]]:
        """
        Get a list of Jira ticket ids for multiple projects.
        """
        return [t["id"] for t in self.tickets if t["project"].upper() in [p.upper() for p in projects]]

    def get_jira_ticket_details(self, ticket_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get a list of full details for a list of Jira ticket ids.
        """
        tickets = []
        for t in self.tickets:
            if t["id"].upper() in [tid.upper() for tid in ticket_ids]:
                tickets.append(t)
        return tickets

    def get_tools(self) -> List[FunctionTool]:
        """
        Returns a list of Autogen FunctionTools for Jira operations.
        """
        return [
            FunctionTool(
                self.get_jira_projects,
                name="get_jira_projects",
                description="Get a list of all available Jira project categories (e.g., PROJ, OPS, DATA)."
            ),
            FunctionTool(
                self.get_jira_tickets,
                name="get_jira_tickets",
                description="Get a list of all ticket ids for multiple Jira projects (e.g., PROJ-101, PROJ-102, etc.)."
            ),
            FunctionTool(
                self.get_jira_ticket_details,
                name="get_jira_ticket_details",
                description="Get a list of full details for a list of Jira ticket ids for multiple projects."
            )
        ]

def get_jira_tools() -> List[FunctionTool]:
    """Helper function to get Jira tools without managing the class instance."""
    return JiraTools().get_tools()