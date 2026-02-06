"""
A2UI Tool: Generate Bar Chart

This tool generates A2UI JSONL messages for rendering a bar chart.
"""
import json
from typing import List, Dict, Any


def generate_bar_chart_a2ui(title: str, data: List[Dict[str, Any]]) -> str:
    """
    Generate A2UI JSONL for a bar chart.
    
    Args:
        title: Chart title
        data: List of {"label": str, "value": number} objects
        
    Returns:
        JSONL string with A2UI messages
    """
    messages = []
    
    # Root container
    messages.append({
        "surfaceUpdate": {
            "components": [{
                "id": "root",
                "component": {
                    "Column": {
                        "children": {"explicitList": ["chart_title", "chart1"]}
                    }
                }
            }]
        }
    })
    
    # Title text
    messages.append({
        "surfaceUpdate": {
            "components": [{
                "id": "chart_title",
                "component": {
                    "Text": {
                        "usageHint": "h2",
                        "text": {"literalString": title}
                    }
                }
            }]
        }
    })
    
    # Chart component
    chart_data = [{"label": item.get("label", ""), "value": item.get("value", 0)} for item in data]
    messages.append({
        "surfaceUpdate": {
            "components": [{
                "id": "chart1",
                "component": {
                    "Chart": {
                        "type": "bar",
                        "title": {"literalString": title},
                        "chartData": {"literalArray": chart_data}
                    }
                }
            }]
        }
    })
    
    # Data model
    messages.append({"dataModelUpdate": {"contents": {}}})
    
    # Begin rendering
    messages.append({"beginRendering": {"root": "root"}})
    
    # Convert to JSONL
    return "\n".join(json.dumps(msg) for msg in messages)


# Autogen tool definition
def show_bar_chart(title: str, labels: List[str], values: List[float]) -> str:
    """
    Display a bar chart with the given data.
    
    Args:
        title: The title of the chart
        labels: List of x-axis labels (e.g., categories)
        values: List of y-axis values
        
    Returns:
        A2UI JSON for rendering the chart
    """
    data = [{"label": l, "value": v} for l, v in zip(labels, values)]
    return generate_bar_chart_a2ui(title, data)
