# 🔌 MCP Servers Collection

**Complete MCP (Model Context Protocol) servers for integrating Claude with popular services**

## 📦 Available Servers

| Server | Description | Port | Status |
|--------|-------------|------|--------|
| 🔷 Google Workspace | Gmail, Calendar, Drive, Docs, Sheets, Tasks | 3001 | ✅ Ready |
| 📝 Notion | Pages, Databases, Blocks | 3002 | ✅ Ready |
| 📊 Airtable | Records, Webhooks | 3003 | ✅ Ready |
| 💬 Telegram | Bot, Messages, Media | 3004 | ✅ Ready |
| 📱 WhatsApp | Business API, Templates | 3005 | ✅ Ready |
| 🐦 Twitter/X | Tweets, Search, Engagement | 3006 | ✅ Ready |
| 🔴 Reddit | Posts, Comments, Subreddits | 3007 | ✅ Ready |
| 📁 Filesystem | Files, Directories, Search | 3008 | ✅ Ready |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all server dependencies
cd mcp-servers
npm install

# Or install individually
cd google-workspace && npm install
cd ../notion && npm install
# ... and so on
```

### 2. Configure Environment

```bash
# Copy and configure .env
cp ../.env.example ../.env
# Edit .env with your API keys
```

### 3. Start All Servers

```bash
node start-all.js
```

Or start individual servers:

```bash
# Google Workspace
node google-workspace/server.js

# Notion
node notion/server.js

# etc...
```

## 📚 Documentation

- **[Setup Guide](../docs/MCP_SETUP_GUIDE.md)** - Complete setup instructions
- **[Prompt Library](../prompts/library.md)** - Ready-to-use prompts
- **[Python SDK](../python/README.md)** - Python integration guide

## 🎯 Usage Examples

### From Node.js

```javascript
import { AIAgent } from '../src/index.js';

const agent = new AIAgent();
await agent.initialize();

// Add MCP servers
await agent.addMCPServer({
  name: 'google-workspace',
  url: 'http://localhost:3001',
  type: 'url'
});

// Use the agent
const response = await agent.processMessage(
  'Check my Gmail and create a summary in Notion'
);
```

### From Python

```python
from anthropic_skills import AnthropicSkills

claude = AnthropicSkills()
claude.add_skill({
    'name': 'google-workspace',
    'type': 'url',
    'url': 'http://localhost:3001'
})

response = claude.chat("Show me my calendar for today")
```

### Direct HTTP Calls

```bash
# Get available tools
curl http://localhost:3001/tools

# Execute a tool
curl -X POST http://localhost:3001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sendEmail",
    "params": {
      "to": "user@example.com",
      "subject": "Hello",
      "body": "Test email"
    }
  }'
```

## 🔑 API Keys Setup

Each service requires API credentials. Get them from:

- **Google Workspace**: https://console.cloud.google.com/
- **Notion**: https://www.notion.so/my-integrations
- **Airtable**: https://airtable.com/account
- **Telegram**: https://t.me/BotFather
- **WhatsApp**: https://developers.facebook.com/
- **Twitter**: https://developer.twitter.com/
- **Reddit**: https://www.reddit.com/prefs/apps

## 🛠️ Server Architecture

Each MCP server follows this structure:

```
server-name/
├── index.js        # Main MCP class with tools
├── server.js       # HTTP server wrapper
├── package.json    # Dependencies
└── README.md       # Service-specific docs
```

### Common Endpoints

All servers expose these endpoints:

- `GET /health` - Health check
- `GET /tools` - List available tools
- `POST /execute` - Execute a tool

## 🔧 Development

### Create a New MCP Server

1. Create directory in `mcp-servers/`
2. Implement MCP class with `initialize()` and `getTools()`
3. Create server using template:

```javascript
import { createMCPServer } from '../server-template.js';
import YourMCP from './index.js';

createMCPServer(YourMCP, 'Service Name', PORT);
```

### Testing

```bash
# Test health
curl http://localhost:300X/health

# Test tools list
curl http://localhost:300X/tools

# Test execution
curl -X POST http://localhost:300X/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"toolName","params":{}}'
```

## 📊 Monitoring

```bash
# Check all servers
for port in {3001..3008}; do
  echo "Port $port:"
  curl -s http://localhost:$port/health | jq
done
```

## 🐛 Troubleshooting

### Port already in use

```bash
lsof -i :3001  # Find process
kill -9 [PID]  # Kill it
```

### Module not found

```bash
cd [server-name]
npm install
```

### Authentication errors

- Verify API keys in `.env`
- Check token expiration
- Review service-specific permissions

## 🔐 Security

- Never commit `.env` files
- Use secure tokens
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production

## 📈 Performance Tips

1. **Caching**: Implement caching for frequent requests
2. **Rate Limiting**: Respect API rate limits
3. **Batching**: Batch similar operations
4. **Error Handling**: Implement retry logic

## 🌟 Features

✅ **Complete Integration**: All major productivity services
✅ **Unified API**: Consistent interface across all servers
✅ **Easy Setup**: Simple configuration
✅ **Python Support**: Use from Python applications
✅ **Extensible**: Easy to add new servers
✅ **Production Ready**: Error handling & logging

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

- GitHub Issues: [Report bugs](https://github.com/mhdessouky-creator/claude-code/issues)
- Documentation: [Full docs](../docs/)
- Examples: [Usage examples](../examples/)

---

**Made with ❤️ for the Claude Code community**
