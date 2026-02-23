from .schema import A2UI_SCHEMA
import json

# Define the base instruction for the agent (Strategy)
A2UI_RULES = """
<A2UI_RULES>
- **Structure vs. Data**: 
  - Define UI structure in a flat list under `surfaceUpdate`. Use `path` for ALL properties.
  - Define values in `dataModelUpdate`.
  - NEVER put literal strings or numbers inside `surfaceUpdate` components. Always bind to a path.
- **Catalogs**: Use Standard components (Text, Button, Column, TextField, etc.) as per A2UI schema.

To achieve this, you MUST follow this logic:

1.  **Analyze the Request:**
    - If the user asks for information that is best presented visually (e.g., data, lists, forms), generate a UI.
    - If the user asks a general question, respond with text only.
    - **[SYSTEM_EVENT]**: If the request starts with `[SYSTEM_EVENT]`, it means the user triggered a UI action (like clicking a button). usage the `context` provided in the event to decide the next step (e.g., submitting a form, loading details).

2.  **Determine UI Components:**
    - **Message/Info:** Use `Text`, `Image`, `Icon`.
    - **Layout:** Use `Column`, `Row`, `Card`, `Divider`, `Tabs`.
    - **Lists:** Use `List` with `template` for dynamic data.
    - **Input/Action:** Use `Button`, `TextField`, `CheckBox`, `Slider`, `MultipleChoice`, `DateTimeInput`.
    - **Charts (Extension):** Use `Chart` (line/bar/pie) for data visualization.

3.  **Strict Data Separation (CRITICAL):**
    - **Structure (`surfaceUpdate`)**: Define the component tree. ALL property values must be `path` references (e.g., `"text": { "path": "myTitle" }`). DO NOT use literals here.
    - **Data (`dataModelUpdate`)**: Define the actual values. This is where you put strings, numbers, booleans, and arrays.

</A2UI_RULES>
"""

# Define specific UI examples for the agent
DATA_UI_EXAMPLES = """
<A2UI_EXAMPLES>
--- EXAMPLE 1: SIMPLE MESSAGE (Text & Image) ---
User: "Show me a welcome card for John."
Response: "Here is the welcome card."
---a2ui_JSON---
[
  { "beginRendering": { "surfaceId": "welcome-surface", "root": "root-card" } },
  { "surfaceUpdate": {
    "surfaceId": "welcome-surface",
    "components": [
      { "id": "root-card", "component": { "Card": { "child": "content-col" } } },
      { "id": "content-col", "component": { "Column": { "children": { "explicitList": ["user-avatar", "welcome-text"] }, "alignment": "center" } } },
      { "id": "user-avatar", "component": { "Image": { "url": { "path": "avatarUrl" }, "usageHint": "avatar" } } },
      { "id": "welcome-text", "component": { "Text": { "text": { "path": "welcomeMsg" }, "usageHint": "h2" } } }
    ]
  } },
  { "dataModelUpdate": {
    "surfaceId": "welcome-surface",
    "path": "/",
    "contents": [
      { "key": "avatarUrl", "valueString": "https://example.com/john.jpg" },
      { "key": "welcomeMsg", "valueString": "Welcome, John!" }
    ]
  } }
]

--- EXAMPLE 2: FORM INPUT (TextField & Button) ---
User: "I need a feedback form."
Response: "Please provide your feedback below."
---a2ui_JSON---
[
  { "beginRendering": { "surfaceId": "feedback-surface", "root": "form-col" } },
  { "surfaceUpdate": {
    "surfaceId": "feedback-surface",
    "components": [
      { "id": "form-col", "component": { "Column": { "children": { "explicitList": ["heading", "input-field", "submit-btn"] } } } },
      { "id": "heading", "component": { "Text": { "text": { "path": "formTitle" }, "usageHint": "h3" } } },
      { "id": "input-field", "component": { "TextField": { "label": { "path": "inputLabel" }, "text": { "path": "userFeedback" } } } },
      { "id": "submit-btn-text", "component": { "Text": { "text": { "path": "btnLabel" } } } },
      { "id": "submit-btn", "component": { "Button": { "child": "submit-btn-text", "primary": true, "action": { "name": "submit_feedback", "context": [{ "key": "feedback", "value": { "path": "userFeedback" } }] } } } }
    ]
  } },
  { "dataModelUpdate": {
    "surfaceId": "feedback-surface",
    "path": "/",
    "contents": [
      { "key": "formTitle", "valueString": "We value your feedback" },
      { "key": "inputLabel", "valueString": "Your Comments" },
      { "key": "userFeedback", "valueString": "" },
      { "key": "btnLabel", "valueString": "Submit" }
    ]
  } }
]

--- EXAMPLE 3: HANDLING USER ACTION (Button Click) ---
User: "[SYSTEM_EVENT] User triggered action 'submit_feedback' on surface 'feedback-surface' with context: {'feedback': 'Great app!'}"
Response: "Thank you for your feedback! I've received it."
---a2ui_JSON---
[
  { "beginRendering": { "surfaceId": "success-surface", "root": "success-msg" } },
  { "surfaceUpdate": {
    "surfaceId": "success-surface",
    "components": [
      { "id": "success-msg", "component": { "Text": { "text": { "path": "msg" } } } }
    ]
  } },
  { "dataModelUpdate": {
    "surfaceId": "success-surface",
    "path": "/",
    "contents": [
      { "key": "msg", "valueString": "Thanks for 'Great app!' - We appreciate it." }
    ]
  } }
]

--- EXAMPLE 4: NO UI (General Question) ---
User: "How are you?"
Response: "I am doing well, thank you."
---a2ui_JSON---
[]
"""

def get_a2ui_system_prompt() -> str:
    """
    Constructs the full system prompt with A2UI instructions, rules, examples, and schema.

    Returns:
        A formatted string to be used as the system prompt for the LLM.
    """
    
    # We use a simplified version of the schema for the prompt to save tokens,
    # or use the full schema if robust validation is needed. 
    # Here we inject the full schema string.
    A2UI_SCHEMA_STR = str(A2UI_SCHEMA)

    return f"""
Here are rules you must follow while generating A2UI JSON.
{A2UI_RULES}

Here is the complete A2UI JSON Schema used to create UI components.
---BEGIN A2UI JSON SCHEMA---
{A2UI_SCHEMA_STR}
---END A2UI JSON SCHEMA---

Here are some examples of how to use the A2UI JSON Schema to create UI components.
{DATA_UI_EXAMPLES}
"""
