# Python Support for Anthropic Skills

## 🐍 Overview
This module provides Python integration with Anthropic Claude Code Skills API, allowing you to use all MCP servers from Python applications.

## 📦 Installation

```bash
pip install -r requirements.txt
```

## 🚀 Quick Start

```python
from anthropic_skills import AnthropicSkills

# Initialize
claude = AnthropicSkills(api_key="your-api-key")

# Add skills
claude.add_skill({
    'name': 'google-workspace',
    'type': 'url',
    'url': 'http://localhost:3001'
})

# Use skills
response = claude.chat("Check my Gmail for unread emails")
print(response)
```

## 📋 Complete Example

```python
from anthropic_skills import AnthropicSkills
import os

# Initialize with API key from environment
claude = AnthropicSkills()

# Add multiple skills
claude.add_skill({
    'name': 'google-workspace',
    'type': 'url',
    'url': 'http://localhost:3001'
}).add_skill({
    'name': 'notion',
    'type': 'url',
    'url': 'http://localhost:3002'
}).add_skill({
    'name': 'airtable',
    'type': 'url',
    'url': 'http://localhost:3003'
})

# Complex task
response = claude.chat(
    prompt="""
    1. Check my Gmail for emails from the last 24 hours
    2. Create a summary in Notion
    3. Add important tasks to Airtable
    """,
    system="You are a productivity assistant with access to various tools."
)

print(response)
```

## 🎯 Advanced Usage

### With Message History

```python
messages = [
    {'role': 'user', 'content': 'What emails do I have?'},
]

response = claude.create_message(
    messages=messages,
    model='claude-sonnet-4-5',
    max_tokens=4096
)

# Add assistant response to history
messages.append({
    'role': 'assistant',
    'content': response.content[0].text
})

# Continue conversation
messages.append({
    'role': 'user',
    'content': 'Create a summary of the most important ones'
})

response = claude.create_message(messages=messages)
```

### Custom System Prompts

```python
system_prompt = """
You are an AI assistant specialized in email management and task organization.
You have access to Gmail, Notion, and Airtable.
Always be concise and actionable.
"""

response = claude.chat(
    prompt="Organize my inbox",
    system=system_prompt
)
```

## 🔧 API Reference

### `AnthropicSkills(api_key=None)`
Initialize the skills client.

### `add_skill(skill_config)`
Add a skill to the session.
- Returns: self (for chaining)

### `create_message(messages, model, max_tokens, **kwargs)`
Create a message with skills enabled.
- Returns: Anthropic message response

### `chat(prompt, system, model, max_tokens)`
Simple chat interface.
- Returns: str (response text)

### `clear_skills()`
Remove all configured skills.
- Returns: self

## 🌐 Available MCP Servers

All these servers should be running before using skills:

| Service | URL | Port |
|---------|-----|------|
| Google Workspace | http://localhost:3001 | 3001 |
| Notion | http://localhost:3002 | 3002 |
| Airtable | http://localhost:3003 | 3003 |
| Telegram | http://localhost:3004 | 3004 |
| WhatsApp | http://localhost:3005 | 3005 |
| Twitter/X | http://localhost:3006 | 3006 |
| Reddit | http://localhost:3007 | 3007 |
| Filesystem | http://localhost:3008 | 3008 |

## 📚 Examples

### Email Management

```python
claude.add_skill({
    'name': 'gmail',
    'type': 'url',
    'url': 'http://localhost:3001'
})

response = claude.chat("Show me unread emails and categorize them by importance")
```

### Social Media Automation

```python
claude.add_skill({
    'name': 'twitter',
    'type': 'url',
    'url': 'http://localhost:3006'
}).add_skill({
    'name': 'reddit',
    'type': 'url',
    'url': 'http://localhost:3007'
})

response = claude.chat("""
Post this content to Twitter and relevant subreddits:
[your content here]
""")
```

## 🔐 Environment Variables

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## 🐛 Troubleshooting

### Skills not working?
1. Ensure MCP servers are running
2. Check server URLs are correct
3. Verify API key is set
4. Check server health endpoints

### Connection errors?
```bash
# Test server health
curl http://localhost:3001/health
```

## 📖 More Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Claude Code Skills](https://docs.anthropic.com/claude/docs/skills)
- [MCP Protocol](https://modelcontextprotocol.io)
