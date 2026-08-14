# Psychology Clinic Webapp - Project Context

This repository contains the distilled context, architecture decisions, and technical specifications for the psychology clinic webapp project. It serves as a persistent memory that can be shared across different AI tools (Claude Code, ChatGPT, Hermes, etc.) and team members.

## Files in this Repository

- `SESSION_CONTEXT.md` - High-level summary of discussions and key decisions
- `ARCHITECTURE.md` - Detailed technical architecture and infrastructure plan
- `TECH_STACK.md` - Specific technology choices and rationale
- `NEXT_STEPS.md` - Prioritized action items for implementation
- `DECISIONS_LOG.md` - Architecture Decision Records (ADR) format
- `OPENAI_FUNCTIONS.json` - Pre-formatted context for ChatGPT function calling
- `README.md` - Overview of the repository
- `USAGE.md` - Guide on how to use this context with different AI tools

## Usage

### With Claude Code / Cursor
These tools can read files directly from the repository or via a local MCP server.

### With ChatGPT
Copy and paste relevant sections from the Markdown files, or use the `OPENAI_FUNCTIONS.json` as a reference for function calling.

### With Hermes / Other LLMs
Same as ChatGPT - paste content or use file upload features.

### Programmatic Access
Access raw files via GitHub URL (when network is available):
```
https://raw.githubusercontent.com/raim93-ai/psychology-clinic-context/main/SESSION_CONTEXT.md
```

## Updating This Context
As the project evolves, update these files and commit changes:
```bash
git add .
git commit -m "Update context: [brief description]"
git push
```