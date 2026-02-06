# A2UI Autogen Backend

Python backend using Microsoft Autogen for A2UI Generative UI.

## Setup

1. **Install Dependencies**:
   ```bash
   cd poc/backend-autogen
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI or Azure OpenAI credentials
   ```

3. **Run Server**:
   ```bash
   python main.py
   ```
   Server runs on `http://localhost:8000`.

## Architecture

```
poc/backend-autogen/
├── main.py              # FastAPI server
├── agents/
│   └── data_agent.py      # Autogen agent with A2UI tools
└── tools/
    ├── show_line_chart.py   # Line chart A2UI generator
    └── show_bar_chart.py    # Bar chart A2UI generator
```

## API

### POST /chat
Receives chat messages, processes with Autogen agent, returns A2UI JSONL.

**Request**:
```json
{
  "message": "Create a weather widget for New York city"
}
```

**Response**:
```json
{
  "text": "Here's the weather widget for New York city.",
  "a2ui": [
    {"surfaceUpdate": {...}},
    {"beginRendering": {"root": "root"}}
  ]
}
```

## Tools

- `show_line_chart(title, labels, values)`: Generate line chart A2UI
- `show_bar_chart(title, labels, values)`: Generate bar chart A2UI
