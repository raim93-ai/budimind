# Usage Guide

This guide explains how to use the psychology-clinic-context repository with various AI tools including Claude Code, ChatGPT, and Hermes.

## Overview

The context repository contains structured information about the psychology clinic webapp project that can be used to provide persistent memory and context to AI assistants.

## File Descriptions

- `SESSION_CONTEXT.md` - High-level summary of discussions and key decisions
- `ARCHITECTURE.md` - Detailed technical architecture and infrastructure plan
- `TECH_STACK.md` - Specific technology choices and rationale
- `NEXT_STEPS.md` - Prioritized action items for implementation
- `DECISIONS_LOG.md` - Architecture Decision Records (ADR) format
- `OPENAI_FUNCTIONS.json` - Pre-formatted context for ChatGPT function calling
- `README.md` - Overview of the repository
- `USAGE.md` - This usage guide

## Using with Different AI Tools

### 1. Claude Code / Cursor

#### Option A: Direct File Access
These tools can read files directly from the repository:

```bash
# Navigate to the directory
cd /home/raim/budimind

# View any file
cat SESSION_CONTEXT.md
# or
less ARCHITECTURE.md
```

#### Option B: MCP Server (Recommended for Claude Code)
For a more integrated experience with Claude Code, you can use the MCP server approach:

1. Create a simple MCP server file (`mcp_context_server.py`):
```python
from mcp.server.fastmcp import FastMCP
import os

mcp = FastMCP("psychology-clinic-context")

@mcp.tool()
def get_session_context() -> str:
    """Get the high-level session context summary"""
    with open("SESSION_CONTEXT.md", "r") as f:
        return f.read()

@mcp.tool()
def get_architecture() -> str:
    """Get the technical architecture details"""
    with open("ARCHITECTURE.md", "r") as f:
        return f.read()

@mcp.tool()
def get_tech_stack() -> str:
    """Get the technology stack rationale"""
    with open("TECH_STACK.md", "r") as f:
        return f.read()

@mcp.tool()
def get_next_steps() -> str:
    """Get the prioritized implementation plan"""
    with open("NEXT_STEPS.md", "r") as f:
        return f.read()

@mcp.tool()
def get_decisions() -> str:
    """Get the architecture decision log"""
    with open("DECISIONS_LOG.md", "r") as f:
        return f.read()

if __name__ == "__main__":
    mcp.run()
```

2. Install required dependencies:
```bash
pip install "mcp[cli]"
```

3. Install the MCP server with Claude Code:
```bash
mcp install mcp_context_server.py
```

4. Now you can use tools like:
   - `get_session_context`
   - `get_architecture`
   - `get_tech_stack`
   - `get_next_steps`
   - `get_decisions`

### 2. ChatGPT

#### Option A: Manual Copy-Paste
The simplest approach is to copy and paste relevant sections into your ChatGPT conversation:

1. Open the file you want to share
2. Copy the relevant content
3. Paste it into your ChatGPT conversation

#### Option B: Using the Functions Format
The `OPENAI_FUNCTIONS.json` file provides a structured format that can be used with ChatGPT's function calling capabilities:

1. If you're building a custom ChatGPT interface or using the API, you can import the functions from `OPENAI_FUNCTIONS.json`
2. The functions allow retrieving specific sections of context programmatically
3. Example function calls:
   - `get_session_context` - Get overall project summary
   - `get_architecture_details` - Get specific architecture details
   - `get_technology_choices` - Get tech stack rationales
   - `get_next_steps` - Get implementation plan
   - `get_decision_log` - Get architecture decisions
   - `search_context` - Search for specific information

#### Option C: File Upload
ChatGPT Plus and Enterprise users can upload files directly:

1. In ChatGPT, click the upload button (paperclip icon)
2. Select one or more context files
3. Ask questions about the content

### 3. Hermes and Other Local LLMs

#### Option A: Manual Copy-Paste
Similar to ChatGPT, you can copy and paste content into your Hermes conversation:

1. Open the file you want to share
2. Copy the relevant content
3. Paste it into your Hermes conversation

#### Option B: File Upload/Ingestion
Depending on your Hermes setup:

1. If Hermes supports file upload, use that feature
2. If Hermes supports document ingestion, add the context files to your knowledge base
3. If using a RAG (Retrieval Augmented Generation) setup, index the context files for semantic search

#### Option C: API Access
If you have API access to your Hermes instance:
1. Upload the context files via the API
2. Use the API to query the context when needed

## Best Practices for Using Context

1. **Start with the Summary**: Begin with `SESSION_CONTEXT.md` to get the big picture
2. **Drill Down as Needed**: Use the more detailed files when you need specific information
3. **Use Search for Specifics**: If you're looking for something specific, use the search function or grep
4. **Keep it Updated**: As the project evolves, update these files and push changes
5. **Version Control**: Leverage Git history to see how decisions and plans have evolved
6. **Tool-Specific Integration**: Take advantage of each tool's unique features:
   - Claude Code: MCP server for seamless integration
   - ChatGPT: Function calling or file upload
   - Hermes: File upload or RAG integration

## Updating the Context

As the project progresses, keep this context up to date:

```bash
# Make changes to the files
# ...

# Commit and push
git add .
git commit -m "Update context: [brief description of changes]"
git push
```

## Example Workflows

### Starting a New Conversation
1. "Let me load the context for the psychology clinic webapp project"
2. Paste or load `SESSION_CONTEXT.md`
3. Ask specific questions about any aspect

### Deep Dive on Architecture
1. "I want to understand the technical architecture in detail"
2. Load `ARCHITECTURE.md`
3. Ask follow-up questions about specific components

### Planning Next Steps
1. "What should we work on next?"
2. Load `NEXT_STEPS.md`
3. Discuss priorities and dependencies

### Understanding Technology Choices
1. "Why did we choose FastAPI for the backend?"
2. Load `TECH_STACK.md`
3. Find the backend section for detailed rationale

### Reviewing Decisions
1. "Why did we choose AWS over other cloud providers?"
2. Load `DECISIONS_LOG.md`
3. Look for ADR 001: Infrastructure Provider Selection

## Troubleshooting

### "I can't find the information I need"
- Try the search function in your editor or use `grep`
- Check if the information might be in a different file
- Consider if the context needs to be updated with new information

### "The context is too large for my AI's context window"
- Start with the most relevant file (`SESSION_CONTEXT.md` is usually best to begin with)
- Use the search functions to find specific information
- Consider creating a more focused summary for your immediate needs

### "I'm not sure how to apply this information to my current task"
- Explain what you're trying to accomplish
- Reference the relevant part of the context
- Ask for specific guidance on how to apply the principles or decisions

## Feedback and Improvements

If you find ways to improve how this context works with your AI tools, please:
1. Update the relevant files
2. Commit your changes
3. Consider sharing improvements that might help others

---
*Last updated: Sat Aug 15 2026*