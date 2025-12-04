# CLAUDE.md - AI Assistant Guide for Digital Life AI Agent

> **Last Updated:** 2025-12-04
> **Project:** Digital Life AI Agent
> **Repository:** github.com/mhdessouky-creator/claude-code
> **Purpose:** Comprehensive guide for AI assistants working with this codebase

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Core Architecture](#core-architecture)
4. [Development Workflows](#development-workflows)
5. [Module System](#module-system)
6. [MCP Integration](#mcp-integration)
7. [Memory & Context Management](#memory--context-management)
8. [Task Execution System](#task-execution-system)
9. [Testing Guidelines](#testing-guidelines)
10. [Code Conventions](#code-conventions)
11. [Common Tasks](#common-tasks)
12. [Bilingual Support](#bilingual-support)
13. [Troubleshooting](#troubleshooting)
14. [Git Workflow](#git-workflow)

---

## Repository Overview

### What is This Project?

**Digital Life AI Agent** is a comprehensive automation framework that uses Claude API (Anthropic) to automate digital life tasks. It provides:

- **AI Agent System** - Conversational AI agent with persistent memory
- **Task Automation** - Email, file management, web operations, fantasy football analysis
- **MCP Ecosystem** - Model Context Protocol servers for external integrations
- **Dual Runtime** - Both Node.js (primary) and Python implementations
- **CLI Interface** - Interactive and command-based interfaces
- **Bilingual Support** - Full Arabic and English documentation

### Technology Stack

**Node.js (Primary Runtime):**
- Runtime: Node.js 18+ with ES modules
- AI: Anthropic Claude API (claude-sonnet-4-5)
- Database: SQLite3 for persistent memory
- CLI: Commander.js, Inquirer, Chalk, Ora
- Scheduling: node-cron

**Python (Secondary Runtime):**
- AI: Groq API, Ollama (local LLMs)
- Gmail Integration: Google API Python Client
- Data Validation: Pydantic

### Key Features

- Automated email management (send, organize, schedule)
- Intelligent file organization (by type, date)
- Web search and content monitoring
- Fantasy football analysis and recommendations
- Persistent conversational memory
- Task scheduling with cron
- MCP server ecosystem (8+ integrations)
- Interactive CLI with multiple modes

---

## Codebase Structure

### Directory Layout

```
claude-code/
├── src/                        # JavaScript source (Node.js - PRIMARY)
│   ├── core/                  # Core system components
│   │   ├── agent.js           # Main AIAgent class
│   │   ├── memory.js          # MemoryManager (SQLite)
│   │   ├── executor.js        # TaskExecutor (module router)
│   │   └── mcp.js             # MCPManager (protocol handler)
│   ├── modules/               # Feature modules (plugins)
│   │   ├── email.js           # Email operations
│   │   ├── files.js           # File management
│   │   ├── web.js             # Web operations
│   │   └── fantasy-football.js # FF analysis
│   ├── utils/                 # Utilities
│   │   └── logger.js          # Logging system
│   ├── cli.js                 # CLI interface (Commander)
│   └── index.js               # Main entry point
│
├── agents/                     # Python AI agents (SECONDARY)
│   ├── brain.py               # Base agent (Groq/Ollama)
│   ├── gmail_agent.py         # Gmail integration
│   └── tasks_agent.py         # Task management
│
├── mcp-servers/               # MCP server implementations
│   ├── google-workspace/      # Gmail, Calendar, Drive
│   ├── notion/                # Notion integration
│   ├── airtable/              # Airtable integration
│   ├── telegram/              # Telegram bot
│   ├── whatsapp/              # WhatsApp business
│   ├── twitter/               # Twitter/X API
│   ├── reddit/                # Reddit API
│   ├── filesystem/            # Local filesystem
│   ├── server-template.js     # MCP server utility
│   └── start-all.js           # Launch all servers
│
├── integrations/              # External service wrappers
│   └── gmail_integration.py   # Gmail API wrapper
│
├── config/                    # Configuration modules
│   └── settings.py            # Centralized settings
│
├── prompts/                   # Prompt templates
│   ├── prompt-templates.json  # Template library
│   ├── template_loader.py     # Python loader
│   └── template-loader.js     # JS loader
│
├── docs/                      # Specialized documentation
│   ├── MCP_GUIDE.md           # MCP protocol guide
│   ├── MCP_SETUP_GUIDE.md     # MCP server setup
│   ├── GMAIL_SETUP_GUIDE.md   # Gmail API setup
│   └── FANTASY_FOOTBALL.md    # FF module guide
│
├── guides/                    # User guides
│   ├── best-practices.md
│   ├── faq.md
│   └── tools.md
│
├── examples/                  # Code examples
│   ├── automation/
│   ├── data-processing/
│   ├── web-development/
│   └── fantasy-football-example.js
│
├── tests/                     # Test suite
│   ├── agent.test.js
│   └── fantasy-football.test.js
│
├── scripts/                   # Build and setup scripts
│   ├── build.js               # Build automation
│   └── project-setup.sh       # Project initialization
│
├── data/                      # SQLite database (gitignored)
├── logs/                      # Application logs (gitignored)
├── README.md                  # Main project documentation (bilingual)
├── AGENT_GUIDE.md             # Comprehensive user guide (Arabic)
├── TERMUX_GUIDE.md            # Termux setup guide
├── package.json               # Node.js dependencies
├── requirements.txt           # Python dependencies
├── .env.example               # Environment template
└── .env.agent                 # Agent configuration template
```

### Important Files for AI Assistants

**Always Read First:**
- `src/core/agent.js` - Understanding agent behavior
- `src/core/executor.js` - Task routing logic
- `src/core/memory.js` - Memory system
- `package.json` - Dependencies and scripts
- `.env.example` - Configuration options

**For Specific Tasks:**
- Adding features → Read relevant module in `src/modules/`
- MCP integration → `mcp-servers/README.md` and `src/core/mcp.js`
- CLI changes → `src/cli.js`
- Testing → `tests/*.test.js`

---

## Core Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI (cli.js)                          │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────────────┐  │
│  │  chat   │  │   task   │  │schedule│  │  mcp:* cmds   │  │
│  └─────────┘  └──────────┘  └────────┘  └───────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    AIAgent (agent.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - Conversation management                           │   │
│  │  - Claude API integration                            │   │
│  │  - Event-driven architecture (EventEmitter)          │   │
│  │  - MCP server coordination                           │   │
│  │  - System prompt building                            │   │
│  └──────────────────────────────────────────────────────┘   │
└───────┬─────────────┬─────────────┬────────────────┬────────┘
        │             │             │                │
        ▼             ▼             ▼                ▼
┌───────────┐ ┌──────────┐  ┌──────────┐  ┌──────────────────┐
│  Memory   │ │ TaskExec │  │   MCP    │  │  Logger (utils)  │
│ (memory)  │ │(executor)│  │  (mcp)   │  │                  │
└─────┬─────┘ └─────┬────┘  └────┬─────┘  └──────────────────┘
      │             │             │
      │             │             │
      ▼             ▼             ▼
┌──────────┐  ┌──────────────┐  ┌─────────────────────────────┐
│ SQLite3  │  │   Modules    │  │    MCP Servers (HTTP)       │
│ Database │  │              │  │  ┌───────┐  ┌──────────┐    │
└──────────┘  │ ┌──────────┐ │  │  │Gmail  │  │ Notion   │    │
              │ │  email   │ │  │  ├───────┤  ├──────────┤    │
              │ ├──────────┤ │  │  │Airtble│  │Telegram  │    │
              │ │  files   │ │  │  ├───────┤  ├──────────┤    │
              │ ├──────────┤ │  │  │Twitter│  │WhatsApp  │    │
              │ │   web    │ │  │  ├───────┤  ├──────────┤    │
              │ ├──────────┤ │  │  │Reddit │  │Filesystem│    │
              │ │fantasy-fb│ │  │  └───────┘  └──────────┘    │
              │ └──────────┘ │  └─────────────────────────────┘
              └──────────────┘
```

### Component Responsibilities

**AIAgent** (`src/core/agent.js`)
- **Purpose:** Main orchestrator for all agent operations
- **Responsibilities:**
  - Process user messages with Claude API
  - Manage conversation history
  - Coordinate task execution
  - Handle MCP server integration
  - Maintain agent state
  - Emit events for lifecycle hooks
- **Key Methods:**
  - `processMessage(message)` - Main message processing
  - `executeTask(taskDescription)` - Execute a task
  - `addMCPServer(config)` - Register MCP server
  - `_buildSystemPrompt()` - Construct system prompt
- **Events:** initialized, processing, responseGenerated, taskExecuted, error, shutdown

**MemoryManager** (`src/core/memory.js`)
- **Purpose:** Persistent storage and retrieval
- **Responsibilities:**
  - SQLite database management
  - Store/retrieve conversations
  - User preferences storage
  - Task history tracking
  - Semantic search (keyword-based)
  - Memory cleanup
- **Key Methods:**
  - `saveConversation(message, sender)` - Store message
  - `getRecentConversations(limit)` - Retrieve history
  - `searchMemories(query)` - Search conversations
  - `savePreference(key, value)` - Store preference
  - `getTaskHistory()` - Get task logs

**TaskExecutor** (`src/core/executor.js`)
- **Purpose:** Route and execute tasks across modules
- **Responsibilities:**
  - Determine task type from description
  - Load appropriate module dynamically
  - Execute tasks with proper error handling
  - Schedule recurring tasks (cron)
  - Track task execution
- **Key Methods:**
  - `executeTask(taskDescription)` - Main task execution
  - `scheduleTask(taskDescription, cronExpression)` - Schedule task
  - `_determineTaskType(description)` - Route to module
  - `_loadModule(taskType)` - Dynamic module import

**MCPManager** (`src/core/mcp.js`)
- **Purpose:** Manage Model Context Protocol servers
- **Responsibilities:**
  - Register/remove MCP servers
  - Store server configurations
  - Discover available tools
  - Build MCP parameters for Claude API
  - Track server statistics
- **Key Methods:**
  - `addServer(config)` - Add MCP server
  - `removeServer(name)` - Remove server
  - `discoverTools()` - Fetch available tools
  - `buildMCPParams()` - Create API params
  - `getServerStats()` - Usage statistics

### Event-Driven Architecture

The AIAgent uses Node.js EventEmitter pattern:

```javascript
agent.on('initialized', () => {
  console.log('Agent ready');
});

agent.on('processing', (message) => {
  console.log('Processing:', message);
});

agent.on('responseGenerated', (response) => {
  console.log('Response:', response);
});

agent.on('taskExecuted', (result) => {
  console.log('Task completed:', result);
});

agent.on('error', (error) => {
  console.error('Error:', error);
});

agent.on('shutdown', () => {
  console.log('Agent shutting down');
});
```

**When to Use Events:**
- Add logging or monitoring
- Implement custom lifecycle hooks
- Integrate with external systems
- Track agent behavior

---

## Development Workflows

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# 2. Install Node.js dependencies
npm install

# 3. Install Python dependencies (optional)
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY

# 5. Build project (creates directories)
npm run build

# 6. Run tests
npm test
```

### Development Mode

```bash
# Start with hot reload
npm run dev

# Run specific commands
npm run cli chat              # Interactive mode
npm run cli task "do something"  # Single task
npm run cli status            # Show status
```

### Available NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `node src/index.js` | Run agent |
| `dev` | `node --watch src/index.js` | Development with hot reload |
| `cli` | `node src/cli.js` | CLI interface |
| `test` | `node --test tests/**/*.test.js` | Run tests |
| `lint` | `eslint src/**/*.js` | Lint code |
| `build` | `node scripts/build.js` | Setup project |

### CLI Command Reference

**Basic Commands:**
```bash
npm run cli chat               # Start interactive chat
npm run cli task "organize files"  # Execute single task
npm run cli schedule "clean temp" "0 9 * * *"  # Schedule task
npm run cli status             # Show agent status
npm run cli clear              # Clear conversation history
```

**MCP Commands:**
```bash
npm run cli mcp:add gmail http://localhost:3001  # Add MCP server
npm run cli mcp:remove gmail                     # Remove server
npm run cli mcp:list                             # List all servers
npm run cli mcp:discover                         # Discover tools
```

### Build Process

The `npm run build` script (`scripts/build.js`):
1. Creates `data/` directory for SQLite database
2. Creates `logs/` directory for log files
3. Creates `backups/` directory for file backups
4. Checks for `.env` file
5. Copies `.env.example` to `.env` if missing
6. Validates `package.json`
7. Displays next steps

### Testing Workflow

```bash
# Run all tests
npm test

# Run specific test file
node --test tests/agent.test.js
```

**Test Structure:**
- Uses Node.js built-in test runner (`node:test`)
- ES module imports
- Async/await patterns
- No external test framework

**What Tests Cover:**
- Package.json validation
- Directory structure
- Module imports
- Core functionality
- Fantasy football module

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npx eslint src/**/*.js --fix
```

---

## Module System

### How Modules Work

Modules are self-contained feature implementations in `src/modules/`. Each module:

1. Exports an `execute(task)` function
2. Handles specific task types (email, files, web, etc.)
3. Returns structured results
4. Manages its own dependencies

### Module Structure

**Template:**
```javascript
// src/modules/example.js
import logger from '../utils/logger.js';

/**
 * Execute example task
 * @param {Object} task - Task details
 * @returns {Object} Result
 */
export async function execute(task) {
  logger.info('[ExampleModule] Executing task');

  try {
    // Task logic here
    const result = await doSomething(task);

    return {
      success: true,
      message: 'Task completed',
      data: result
    };
  } catch (error) {
    logger.error('[ExampleModule] Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}
```

### Existing Modules

**Email Module** (`src/modules/email.js`)
- **Triggers:** Keywords: email, mail, send, رسالة, بريد
- **Capabilities:**
  - Send emails via SMTP
  - Schedule email sending
  - Parse email parameters from natural language
- **Configuration:** Requires EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in `.env`

**Files Module** (`src/modules/files.js`)
- **Triggers:** Keywords: file, folder, organize, backup, ملف, مجلد
- **Capabilities:**
  - Organize files by type (images, documents, etc.)
  - Organize by date
  - Recursive file search
  - Directory backup
  - Delete old files
- **Methods:** `organizeByType()`, `organizeByDate()`, `findFiles()`, `backupDirectory()`, `deleteOldFiles()`

**Web Module** (`src/modules/web.js`)
- **Triggers:** Keywords: web, search, url, website, بحث, موقع
- **Capabilities:**
  - Web search
  - Fetch URL content
  - Monitor websites for changes
- **Methods:** `searchWeb(query)`, `fetchURL(url)`, `monitorWebsite(url, interval)`

**Fantasy Football Module** (`src/modules/fantasy-football.js`)
- **Triggers:** Keywords: fantasy, football, player, lineup, trade
- **Capabilities:**
  - Compare players
  - Optimize lineups
  - Analyze trades
  - Evaluate matchups
  - Assess injury impact
  - Waiver wire recommendations
  - Rest of season rankings
  - Scenario simulation
- **Comprehensive scoring system** for accurate player evaluation

### Adding a New Module

**Step 1: Create Module File**
```javascript
// src/modules/calendar.js
import logger from '../utils/logger.js';

export async function execute(task) {
  logger.info('[CalendarModule] Task:', task);

  // Implementation
  const result = await handleCalendarTask(task);

  return {
    success: true,
    message: 'Calendar operation completed',
    data: result
  };
}

async function handleCalendarTask(task) {
  // Task logic
}
```

**Step 2: Update TaskExecutor**

Edit `src/core/executor.js` in `_determineTaskType()`:

```javascript
_determineTaskType(description) {
  const lowerDesc = description.toLowerCase();

  // Add calendar keywords
  if (lowerDesc.includes('calendar') ||
      lowerDesc.includes('event') ||
      lowerDesc.includes('meeting')) {
    return 'calendar';
  }

  // ... existing conditions
}
```

**Step 3: Test Module**
```javascript
// tests/calendar.test.js
import { test } from 'node:test';
import assert from 'node:assert';
import { execute } from '../src/modules/calendar.js';

test('Calendar module - create event', async () => {
  const result = await execute({
    description: 'Create meeting tomorrow at 2pm'
  });
  assert.strictEqual(result.success, true);
});
```

**Step 4: Document Module**

Add usage example to `examples/` and update relevant guides.

---

## MCP Integration

### What is MCP?

**Model Context Protocol (MCP)** is Anthropic's standard for connecting Claude to external tools and services. This project implements MCP servers for:

- Google Workspace (Gmail, Calendar, Drive, Docs, Sheets, Tasks)
- Notion (Pages, Databases, Blocks)
- Airtable (Records, Webhooks)
- Telegram (Bot, Messages, Media)
- WhatsApp (Business API, Templates)
- Twitter/X (Tweets, Search, Engagement)
- Reddit (Posts, Comments, Subreddits)
- Filesystem (Files, Directories, Search)

### MCP Server Architecture

**Port Allocation:**
- 3001: Google Workspace
- 3002: Notion
- 3003: Airtable
- 3004: Telegram
- 3005: WhatsApp
- 3006: Twitter
- 3007: Reddit
- 3008: Filesystem

**Server Structure:**
```
mcp-servers/service-name/
├── index.js          # MCP class with initialize() and getTools()
├── server.js         # HTTP server (Express)
├── package.json      # Dependencies
└── README.md         # Documentation
```

**Standard Endpoints:**
- `GET /health` - Health check
- `GET /tools` - List available tools
- `POST /execute` - Execute a tool

### Using MCP Servers

**Start All Servers:**
```bash
node mcp-servers/start-all.js
```

**Start Individual Server:**
```bash
node mcp-servers/google-workspace/server.js
```

**Add Server to Agent:**
```javascript
await agent.addMCPServer({
  name: 'gmail',
  url: 'http://localhost:3001',
  type: 'url',
  authorization_token: 'optional-token'
});
```

**Via CLI:**
```bash
npm run cli mcp:add gmail http://localhost:3001
npm run cli mcp:list
npm run cli mcp:discover
```

### Creating New MCP Server

**Use Template:**
```javascript
// mcp-servers/myservice/index.js
export class MyServiceMCP {
  async initialize(config) {
    this.apiKey = config.apiKey;
    // Setup service client
  }

  async getTools() {
    return [
      {
        name: 'myservice_action',
        description: 'Perform action in MyService',
        parameters: {
          type: 'object',
          properties: {
            param1: { type: 'string', description: 'Parameter 1' }
          },
          required: ['param1']
        }
      }
    ];
  }

  async executeTool(toolName, params) {
    if (toolName === 'myservice_action') {
      return await this.performAction(params);
    }
    throw new Error(`Unknown tool: ${toolName}`);
  }

  async performAction(params) {
    // Implementation
  }
}
```

**Create Server Wrapper:**
```javascript
// mcp-servers/myservice/server.js
import { createMCPServer } from '../server-template.js';
import { MyServiceMCP } from './index.js';

const PORT = 3009; // Use next available port
const mcp = new MyServiceMCP();

await mcp.initialize({
  apiKey: process.env.MYSERVICE_API_KEY
});

const server = createMCPServer(mcp, PORT, 'myservice');
```

**Update Environment:**
```bash
# .env
MYSERVICE_API_KEY=your-api-key
MCP_MYSERVICE_PORT=3009
```

**Add to start-all.js:**
```javascript
const servers = [
  // ... existing servers
  { name: 'myservice', port: 3009, path: './myservice/server.js' }
];
```

### MCP Best Practices

1. **Always implement health checks** - Allows monitoring
2. **Validate parameters** - Check required fields
3. **Return structured responses** - Consistent format
4. **Handle errors gracefully** - Return error details
5. **Log operations** - Use logger for debugging
6. **Document tools clearly** - Good descriptions help Claude
7. **Use environment variables** - Keep secrets out of code
8. **Test independently** - Verify server before integration

---

## Memory & Context Management

### How Memory Works

The agent uses **SQLite3** for persistent memory storage via `MemoryManager` (`src/core/memory.js`).

**Database Schema:**
```sql
-- Conversations table
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  sender TEXT NOT NULL,  -- 'user' or 'agent'
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Preferences table
CREATE TABLE preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  type TEXT,
  result TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Memory Operations

**Save Conversation:**
```javascript
await memory.saveConversation(
  'Organize my files',
  'user'
);
```

**Retrieve History:**
```javascript
const recent = await memory.getRecentConversations(10);
// Returns last 10 messages with sender info
```

**Search Memories:**
```javascript
const results = await memory.searchMemories('email');
// Returns all conversations containing 'email'
```

**Store Preference:**
```javascript
await memory.savePreference('user_name', 'Ahmed');
await memory.savePreference('language', 'ar');
```

**Get Preference:**
```javascript
const name = await memory.getPreference('user_name');
```

**Task History:**
```javascript
const tasks = await memory.getTaskHistory();
// Returns all executed tasks with results
```

### Context Management in Agent

**System Prompt Building:**

The agent constructs a comprehensive system prompt in `_buildSystemPrompt()`:

```javascript
_buildSystemPrompt() {
  return `You are ${this.name}, an AI agent...

Your capabilities:
- Execute tasks (email, files, web, fantasy football)
- Access to memory and preferences
${this.mcpEnabled ? '- Connected to MCP servers' : ''}

Current memory:
${this.recentMemories.map(m => `${m.sender}: ${m.message}`).join('\n')}

User preferences:
${JSON.stringify(this.preferences)}

Guidelines:
- Be conversational and helpful
- Use tools when needed
- Remember context from previous conversations
...
`;
}
```

**Conversation History:**

The agent maintains sliding window context:
- Keeps last 10 messages in memory
- Includes both user and agent messages
- Automatically truncates old messages
- Available in `this.conversationHistory`

**Preferences:**

User preferences are loaded on initialization and available throughout the session:
```javascript
this.preferences = await this.memory.getAllPreferences();
```

### Memory Best Practices

1. **Always save important interactions** - Call `saveConversation()` for user inputs
2. **Use preferences for personalization** - Store user info, settings
3. **Clean up old data** - Implement memory cleanup tasks
4. **Search efficiently** - Use keyword search for relevant context
5. **Limit context size** - Truncate to most recent/relevant messages
6. **Track task history** - Helps with debugging and learning

---

## Task Execution System

### Task Flow

```
User Input
    │
    ▼
CLI (cli.js)
    │
    ▼
AIAgent.executeTask(description)
    │
    ▼
TaskExecutor.executeTask(description)
    │
    ├─► Determine task type (keywords)
    │
    ├─► Load appropriate module
    │
    ├─► Execute module.execute(task)
    │
    ├─► Store in task history
    │
    └─► Return result
```

### Task Type Detection

**Keyword-Based Routing** (`executor.js` - `_determineTaskType()`):

```javascript
const keywords = {
  'email': ['email', 'mail', 'send', 'رسالة', 'بريد'],
  'files': ['file', 'folder', 'organize', 'backup', 'ملف', 'مجلد'],
  'web': ['web', 'search', 'url', 'website', 'بحث', 'موقع'],
  'fantasy-football': ['fantasy', 'football', 'player', 'lineup', 'trade']
};

// Check description against keywords
for (const [type, words] of Object.entries(keywords)) {
  if (words.some(word => description.toLowerCase().includes(word))) {
    return type;
  }
}

return 'general'; // Default
```

### Task Scheduling

**Cron-Based Scheduling:**

```javascript
// Schedule recurring task
await agent.executor.scheduleTask(
  'Clean temp files',
  '0 9 * * *'  // Every day at 9 AM
);
```

**Cron Format:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0=Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples:**
- `0 9 * * *` - Daily at 9 AM
- `*/30 * * * *` - Every 30 minutes
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 0 1 * *` - Monthly on 1st at midnight

### Task Result Format

**Standard Result Object:**
```javascript
{
  success: true,           // Boolean: operation success
  message: 'Description',  // String: human-readable result
  data: { ... }            // Object: additional data (optional)
}
```

**Error Result:**
```javascript
{
  success: false,
  message: 'Error description',
  error: errorObject       // Optional: full error for debugging
}
```

### Adding New Task Types

1. **Create module** in `src/modules/newtask.js`
2. **Add keywords** to `_determineTaskType()` in `executor.js`
3. **Test routing** with sample descriptions
4. **Document usage** in examples and guides

---

## Testing Guidelines

### Test Structure

**Location:** `tests/` directory

**Framework:** Node.js built-in test runner (`node:test`)

**Test File Naming:** `*.test.js`

### Writing Tests

**Template:**
```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { myFunction } from '../src/mymodule.js';

test('MyModule - should do something', async () => {
  const result = await myFunction('input');

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data, 'expected');
});

test('MyModule - should handle errors', async () => {
  const result = await myFunction('invalid');

  assert.strictEqual(result.success, false);
  assert.ok(result.message.includes('error'));
});
```

### Test Categories

**Unit Tests:**
- Test individual functions/methods
- Mock external dependencies
- Fast execution

**Integration Tests:**
- Test module interactions
- Use real database (test DB)
- Verify end-to-end flows

**Structure Tests:**
- Validate file existence
- Check configuration
- Verify directory structure

### Running Tests

```bash
# All tests
npm test

# Specific file
node --test tests/agent.test.js

# Watch mode
node --test --watch tests/**/*.test.js
```

### Testing Best Practices

1. **Test both success and failure cases**
2. **Use descriptive test names** - Describe what's being tested
3. **Mock external services** - Don't hit real APIs in tests
4. **Clean up after tests** - Remove test data
5. **Test edge cases** - Empty inputs, nulls, etc.
6. **Keep tests independent** - Each test should run alone
7. **Use async/await** - For asynchronous operations
8. **Assert specific values** - Not just truthy/falsy

### Testing Examples

**Testing a Module:**
```javascript
test('Email module - send email', async () => {
  const task = {
    description: 'Send email to test@example.com'
  };

  const result = await emailModule.execute(task);

  assert.strictEqual(result.success, true);
  assert.ok(result.message.includes('sent'));
});
```

**Testing Agent:**
```javascript
test('Agent - process message', async () => {
  const agent = new AIAgent('TestAgent', apiKey);
  await agent.initialize();

  const response = await agent.processMessage('Hello');

  assert.ok(response);
  assert.ok(typeof response === 'string');
});
```

**Testing Memory:**
```javascript
test('Memory - save and retrieve', async () => {
  const memory = new MemoryManager(':memory:'); // In-memory DB
  await memory.initialize();

  await memory.saveConversation('Test message', 'user');
  const recent = await memory.getRecentConversations(1);

  assert.strictEqual(recent.length, 1);
  assert.strictEqual(recent[0].message, 'Test message');
});
```

---

## Code Conventions

### Naming Conventions

**Files:**
- kebab-case: `fantasy-football.js`, `task-executor.js`
- Lowercase for utilities: `logger.js`, `memory.js`

**Classes:**
- PascalCase: `AIAgent`, `MemoryManager`, `TaskExecutor`

**Functions/Methods:**
- camelCase: `processMessage()`, `executeTask()`, `getRecentConversations()`
- Private methods: `_buildSystemPrompt()`, `_determineTaskType()`

**Variables:**
- camelCase: `conversationHistory`, `taskResult`, `mcpManager`
- Constants: UPPER_SNAKE_CASE: `MAX_RETRIES`, `DEFAULT_MODEL`

**Environment Variables:**
- SCREAMING_SNAKE_CASE: `ANTHROPIC_API_KEY`, `EMAIL_HOST`, `DB_PATH`

### Code Style

**ES Modules:**
```javascript
// Use ES6 imports
import { something } from './module.js';

// Always include .js extension
import logger from './utils/logger.js';

// Export named functions
export function myFunction() { }

// Export default classes
export default class MyClass { }
```

**Async/Await:**
```javascript
// Always use async/await (not .then())
async function fetchData() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    logger.error('Error:', error);
    throw error;
  }
}
```

**Error Handling:**
```javascript
// Always wrap async operations in try/catch
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('[Module] Error:', error);
  return { success: false, message: error.message };
}
```

**Logging:**
```javascript
import logger from './utils/logger.js';

// Use logger instead of console.log
logger.info('[Module] Starting operation');
logger.debug('[Module] Debug info:', data);
logger.error('[Module] Error occurred:', error);

// Include module name in brackets
logger.info('[EmailModule] Sending email');
```

**Comments:**
```javascript
/**
 * Process user message with Claude API
 * @param {string} message - User input message
 * @returns {Promise<string>} Agent response
 */
async function processMessage(message) {
  // Implementation
}

// Use JSDoc for public APIs
// Use inline comments for complex logic
// Don't comment obvious code
```

### Project Patterns

**Module Pattern:**
```javascript
// Modules export execute function
export async function execute(task) {
  // Task logic
  return { success: true, message: 'Done' };
}
```

**Constructor Pattern:**
```javascript
// Classes initialize in constructor
class MyClass {
  constructor(config) {
    this.config = config;
    // Synchronous initialization only
  }

  // Async initialization in separate method
  async initialize() {
    await this.setupAsync();
  }
}
```

**Event Pattern:**
```javascript
// Emit events for lifecycle hooks
this.emit('processing', message);
await doWork();
this.emit('completed', result);
```

**Error Pattern:**
```javascript
// Return structured errors, don't throw in modules
return {
  success: false,
  message: 'User-friendly error',
  error: originalError  // For debugging
};
```

### Bilingual Code

**String Handling:**
```javascript
// Check for both English and Arabic keywords
const keywords = {
  email: ['email', 'mail', 'رسالة', 'بريد'],
  files: ['file', 'folder', 'ملف', 'مجلد']
};

// Use Unicode-safe operations
const lowerDesc = description.toLowerCase();
```

**UI Text:**
```javascript
// Support both languages in output
const messages = {
  en: 'Task completed successfully',
  ar: 'تم إنجاز المهمة بنجاح'
};

// Detect language from input
const lang = detectLanguage(input); // ar or en
console.log(messages[lang]);
```

---

## Common Tasks

### Adding a New Feature

1. **Identify module type** - Does it fit existing module or need new one?
2. **Read relevant code** - Check `src/modules/` and `src/core/`
3. **Create/modify module** - Add implementation
4. **Update executor** - Add keywords for routing
5. **Write tests** - Add to `tests/`
6. **Document** - Update guides and examples
7. **Test manually** - Use CLI to verify

### Modifying Existing Code

1. **Always read the file first** - Use Read tool
2. **Understand context** - Read related files if needed
3. **Check for dependencies** - Search for imports of the file
4. **Make minimal changes** - Don't refactor unless necessary
5. **Preserve functionality** - Don't break existing features
6. **Test changes** - Run relevant tests
7. **Update comments** - If changing public APIs

### Adding Configuration Options

1. **Add to .env.example** - Document the option
2. **Load in code** - Use `process.env.YOUR_OPTION`
3. **Provide defaults** - Handle missing values gracefully
4. **Document** - Update README and relevant guides
5. **Test with different values** - Verify behavior

### Fixing Bugs

1. **Reproduce the issue** - Understand what's failing
2. **Read error logs** - Check `logs/` directory
3. **Locate the code** - Find the relevant module/function
4. **Understand the logic** - Read surrounding code
5. **Identify root cause** - Don't just patch symptoms
6. **Fix minimally** - Smallest change that solves it
7. **Test thoroughly** - Verify fix and no regressions
8. **Add test case** - Prevent future regressions

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all (careful!)
npm update

# Verify tests still pass
npm test

# Commit changes
git add package.json package-lock.json
git commit -m "Update dependencies"
```

### Working with MCP

**Adding MCP Server:**
1. Create directory: `mcp-servers/service-name/`
2. Implement MCP class in `index.js`
3. Create HTTP server in `server.js`
4. Add to `start-all.js`
5. Document in `README.md`
6. Test independently
7. Register with agent

**Debugging MCP Issues:**
1. Check server is running: `curl http://localhost:PORT/health`
2. List tools: `curl http://localhost:PORT/tools`
3. Check agent logs for MCP errors
4. Verify environment variables
5. Test tool execution directly

### Database Operations

**View Database:**
```bash
sqlite3 data/agent-memory.db

# List tables
.tables

# Query conversations
SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 10;

# Query preferences
SELECT * FROM preferences;

# Exit
.quit
```

**Backup Database:**
```bash
cp data/agent-memory.db data/agent-memory-backup-$(date +%Y%m%d).db
```

**Reset Database:**
```bash
rm data/agent-memory.db
# Will be recreated on next run
```

---

## Bilingual Support

### Overview

This project provides full bilingual support for **Arabic** and **English**:
- All documentation available in both languages
- CLI supports both languages
- Natural language processing for both
- Right-to-Left (RTL) support in documentation

### Handling Arabic Text

**In Code:**
```javascript
// Use Unicode normalization for Arabic
const normalized = text.normalize('NFKC');

// Case-insensitive comparison
const lower = text.toLowerCase(); // Works for Arabic

// Regular expressions
const arabicPattern = /[\u0600-\u06FF]/; // Arabic Unicode range
const hasArabic = arabicPattern.test(text);
```

**In Keywords:**
```javascript
// Always include both languages
const emailKeywords = ['email', 'mail', 'send', 'رسالة', 'بريد', 'إرسال'];

// Check both
if (emailKeywords.some(kw => description.includes(kw))) {
  // Handle email task
}
```

### Documentation Guidelines

**File Naming:**
- English: `README.md`, `GUIDE.md`
- Bilingual: Include both in same file with clear sections
- Use RTL directives for Arabic sections

**Markdown RTL:**
```markdown
<div dir="rtl">

## العنوان بالعربي

النص العربي هنا...

</div>

## English Title

English text here...
```

**Translation Checklist:**
- [ ] README sections (both languages)
- [ ] Error messages
- [ ] CLI help text
- [ ] Log messages (keep English for debugging)
- [ ] User-facing responses
- [ ] Documentation examples

### Language Detection

**Simple Detection:**
```javascript
function detectLanguage(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? 'ar' : 'en';
}
```

**Usage:**
```javascript
const userLang = detectLanguage(userInput);
const response = responses[userLang];
```

### Best Practices

1. **Keep code comments in English** - For international developers
2. **User-facing text bilingual** - CLI output, errors
3. **Log in English** - Easier debugging and searching
4. **Document in both** - Critical for user adoption
5. **Test with Arabic input** - Verify proper handling
6. **Use UTF-8 encoding** - In all files

---

## Troubleshooting

### Common Issues

**Issue: "Cannot find module"**
```bash
# Solution: Check file extension
import { something } from './file.js'; // Include .js

# Verify file exists
ls -la src/core/agent.js
```

**Issue: "ANTHROPIC_API_KEY not set"**
```bash
# Solution: Check .env file
cat .env | grep ANTHROPIC

# Or set directly
export ANTHROPIC_API_KEY=sk-ant-...

# Verify
echo $ANTHROPIC_API_KEY
```

**Issue: "Database locked"**
```bash
# Solution: Close other connections
pkill -f "node src"

# Or use lsof to find process
lsof data/agent-memory.db
kill <PID>
```

**Issue: "MCP server not responding"**
```bash
# Check if server is running
curl http://localhost:3001/health

# Check logs
tail -f logs/mcp-server.log

# Restart server
pkill -f "mcp-servers"
node mcp-servers/start-all.js
```

**Issue: "Module not found" for new module**
```javascript
// Solution: Use dynamic import with full path
const modulePath = `./modules/${taskType}.js`;
const module = await import(modulePath);
```

**Issue: "Syntax error in .env"**
```bash
# Solution: Check for quotes
# Bad:
API_KEY=sk-ant-"key"

# Good:
API_KEY=sk-ant-key

# Or:
API_KEY="sk-ant-key"
```

### Debugging Tips

**Enable Debug Logging:**
```bash
# In .env
LOG_LEVEL=debug

# Or runtime
export LOG_LEVEL=debug
npm start
```

**View Logs:**
```bash
# Tail logs
tail -f logs/agent.log

# Search logs
grep "ERROR" logs/agent.log

# Recent errors
tail -100 logs/agent.log | grep "ERROR"
```

**Inspect Database:**
```bash
sqlite3 data/agent-memory.db "SELECT * FROM conversations ORDER BY timestamp DESC LIMIT 5;"
```

**Test Individual Module:**
```javascript
// Create test script
import { execute } from './src/modules/email.js';

const result = await execute({
  description: 'Send test email to test@example.com'
});

console.log(result);
```

**Check API Connection:**
```javascript
// Test Claude API
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Test' }]
});

console.log(response);
```

### Performance Issues

**Slow Agent Responses:**
1. Check API latency - Network issues?
2. Reduce conversation history - Lower limit in memory
3. Disable unused MCP servers - Less overhead
4. Check disk I/O - Database on slow drive?

**High Memory Usage:**
1. Truncate conversation history more aggressively
2. Clean up old logs: `rm logs/*.log`
3. Vacuum database: `sqlite3 data/agent-memory.db "VACUUM;"`
4. Restart agent periodically

**Database Performance:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX idx_tasks_timestamp ON tasks(timestamp);

-- Analyze tables
ANALYZE;
```

---

## Git Workflow

### Branch Strategy

**Main Branch:** `main`
- Production-ready code
- Protected branch
- Requires PR review

**Feature Branches:** `feature/feature-name`
- New features
- Bug fixes
- Documentation updates

**Format:** `type/description`
- `feature/add-calendar-module`
- `fix/email-sending-issue`
- `docs/update-readme`
- `refactor/improve-task-routing`

### Commit Guidelines

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Build, dependencies, etc.

**Examples:**
```bash
git commit -m "feat(email): Add support for attachments"

git commit -m "fix(memory): Resolve database locking issue"

git commit -m "docs(mcp): Update MCP integration guide"

git commit -m "refactor(executor): Improve task type detection"
```

### Development Workflow

**1. Create Branch:**
```bash
git checkout -b feature/my-feature
```

**2. Make Changes:**
```bash
# Edit files
vim src/modules/new-feature.js

# Test
npm test

# Lint
npm run lint
```

**3. Commit Changes:**
```bash
git add .
git commit -m "feat(module): Add new feature"
```

**4. Push Branch:**
```bash
git push -u origin feature/my-feature
```

**5. Create Pull Request:**
```bash
# Use GitHub CLI if available
gh pr create --title "Add new feature" --body "Description"

# Or manually via GitHub web interface
```

### Pull Request Guidelines

**PR Title:** Follow commit convention
```
feat(email): Add attachment support
```

**PR Description Template:**
```markdown
## Summary
Brief description of changes

## Changes
- Item 1
- Item 2

## Testing
- How to test
- Test results

## Documentation
- Updated README
- Added examples

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Pre-Commit Checklist

Before committing:
- [ ] Code runs without errors
- [ ] Tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] No console.log() left (use logger)
- [ ] Comments updated
- [ ] Documentation updated
- [ ] No sensitive data (API keys, etc.)
- [ ] .env.example updated if needed

### Merging

**Fast-Forward Merge (preferred):**
```bash
git checkout main
git merge --ff-only feature/my-feature
```

**Squash Merge (multiple commits):**
```bash
git checkout main
git merge --squash feature/my-feature
git commit -m "feat(module): Add feature"
```

**After Merge:**
```bash
# Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

---

## Appendix

### Useful Commands

**Project Management:**
```bash
npm start                          # Run agent
npm run dev                        # Development mode
npm run cli chat                   # Interactive chat
npm test                           # Run tests
npm run lint                       # Lint code
npm run build                      # Setup project
```

**MCP Operations:**
```bash
node mcp-servers/start-all.js     # Start all MCP servers
npm run cli mcp:list               # List MCP servers
npm run cli mcp:discover           # Discover tools
```

**Database:**
```bash
sqlite3 data/agent-memory.db      # Open database
.tables                            # List tables
.schema conversations              # Show schema
SELECT * FROM conversations LIMIT 5;  # Query
.quit                              # Exit
```

**Logs:**
```bash
tail -f logs/agent.log            # Follow logs
grep ERROR logs/agent.log          # Find errors
cat logs/agent.log | less          # Browse logs
```

**Git:**
```bash
git status                         # Check status
git log --oneline                  # View commits
git diff                           # See changes
git branch -a                      # List branches
```

### Environment Variables Reference

**Required:**
```bash
ANTHROPIC_API_KEY=sk-ant-...      # Claude API key
```

**Optional:**
```bash
# Agent Configuration
AGENT_NAME=MyAgent                # Agent persona name
AGENT_MODEL=claude-sonnet-4-5     # Claude model to use
ENABLE_MCP=true                   # Enable MCP servers

# Database
DB_PATH=./data/agent-memory.db    # SQLite database path

# Email (for email module)
EMAIL_HOST=smtp.gmail.com         # SMTP server
EMAIL_PORT=587                    # SMTP port
EMAIL_USER=your-email@gmail.com   # Email address
EMAIL_PASS=app-password           # App password

# Scheduling
ENABLE_SCHEDULER=true             # Enable cron scheduler

# Logging
LOG_LEVEL=info                    # Log level (debug, info, warn, error)

# MCP Server Ports
MCP_GOOGLE_WORKSPACE_PORT=3001
MCP_NOTION_PORT=3002
MCP_AIRTABLE_PORT=3003
MCP_TELEGRAM_PORT=3004
MCP_WHATSAPP_PORT=3005
MCP_TWITTER_PORT=3006
MCP_REDDIT_PORT=3007
MCP_FILESYSTEM_PORT=3008

# Service API Keys (for MCP servers)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NOTION_API_KEY=...
AIRTABLE_API_KEY=...
TELEGRAM_BOT_TOKEN=...
WHATSAPP_API_KEY=...
TWITTER_API_KEY=...
REDDIT_CLIENT_ID=...
```

### File Locations

**Source Code:**
- Main entry: `src/index.js`
- CLI: `src/cli.js`
- Agent: `src/core/agent.js`
- Memory: `src/core/memory.js`
- Executor: `src/core/executor.js`
- MCP: `src/core/mcp.js`
- Modules: `src/modules/*.js`
- Utils: `src/utils/*.js`

**Configuration:**
- Environment: `.env`
- Package: `package.json`
- Agent config: `.env.agent`

**Data:**
- Database: `data/agent-memory.db`
- Logs: `logs/agent.log`
- Backups: `backups/`

**Documentation:**
- Main: `README.md`
- User guide: `AGENT_GUIDE.md`
- This file: `CLAUDE.md`
- Termux: `TERMUX_GUIDE.md`
- MCP: `docs/MCP_GUIDE.md`

### Quick Reference Links

**Official Documentation:**
- Anthropic Claude API: https://docs.anthropic.com/claude/reference
- Model Context Protocol: https://github.com/anthropics/anthropic-sdk-typescript

**Dependencies:**
- Node.js: https://nodejs.org/
- SQLite3: https://www.sqlite.org/
- Commander.js: https://github.com/tj/commander.js
- Inquirer: https://github.com/SBoudrias/Inquirer.js

**Tools:**
- Termux: https://termux.com/
- tmux: https://github.com/tmux/tmux

---

## Summary for AI Assistants

When working with this codebase:

1. **Always read files before modifying** - Use Read tool first
2. **Understand the module system** - Check `src/core/executor.js` for routing
3. **Follow ES module conventions** - Include `.js` extensions
4. **Use logger, not console.log** - Import from `src/utils/logger.js`
5. **Handle both languages** - Include Arabic keywords
6. **Test your changes** - Run `npm test`
7. **Check for errors gracefully** - Return structured results
8. **Document new features** - Update guides and examples
9. **Use environment variables** - Keep secrets in `.env`
10. **Commit with clear messages** - Follow commit convention

**Most Important Files:**
- `src/core/agent.js` - Agent behavior
- `src/core/executor.js` - Task routing
- `src/core/memory.js` - Memory management
- `src/cli.js` - CLI interface
- `package.json` - Dependencies and scripts

**Common Operations:**
- Add module → Create in `src/modules/`, update `executor.js`
- Add MCP server → Create in `mcp-servers/`, update `start-all.js`
- Fix bug → Read relevant file, make minimal change, test
- Add config → Update `.env.example`, document in README

**When Stuck:**
- Check logs: `tail -f logs/agent.log`
- Test module directly: Import and run `execute()`
- Verify environment: Check `.env` values
- Read documentation: This file, README, guides
- Search codebase: Use Grep tool

---

**Version:** 1.0.0
**Last Updated:** 2025-12-04
**Maintainer:** mhdessouky-creator
**License:** MIT

For questions or issues, open an issue in the repository.
