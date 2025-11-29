import Anthropic from '@anthropic-ai/sdk';
import { EventEmitter } from 'events';
import { MemoryManager } from './memory.js';
import { TaskExecutor } from './executor.js';
import { MCPManager } from './mcp.js';
import { logger } from '../utils/logger.js';

/**
 * Core AI Agent Class
 * Main orchestrator for all agent operations
 */
export class AIAgent extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
      model: config.model || process.env.AGENT_MODEL || 'claude-sonnet-4-5',
      name: config.name || process.env.AGENT_NAME || 'Digital Assistant',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 1.0,
      enableMCP: config.enableMCP !== false, // MCP enabled by default
    };

    if (!this.config.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }

    this.client = new Anthropic({ apiKey: this.config.apiKey });
    this.memory = new MemoryManager();
    this.executor = new TaskExecutor(this);
    this.mcp = new MCPManager();
    this.conversationHistory = [];
    this.isRunning = false;
  }

  /**
   * Initialize the agent
   */
  async initialize() {
    try {
      await this.memory.initialize();
      await this.executor.initialize();

      // Load MCP servers from preferences if available
      if (this.config.enableMCP) {
        await this._loadMCPServers();
      }

      logger.info(`🤖 ${this.config.name} initialized successfully`);
      this.emit('initialized');

      return true;
    } catch (error) {
      logger.error('Failed to initialize agent:', error);
      throw error;
    }
  }

  /**
   * Load MCP servers from memory
   */
  async _loadMCPServers() {
    try {
      const savedServers = await this.memory.getPreference('mcp_servers', []);

      for (const server of savedServers) {
        this.mcp.addServer(server);
      }

      if (savedServers.length > 0) {
        logger.info(`Loaded ${savedServers.length} MCP server(s)`);
      }
    } catch (error) {
      logger.warn('Failed to load MCP servers:', error.message);
    }
  }

  /**
   * Process a user message and generate response
   */
  async processMessage(message, options = {}) {
    try {
      this.isRunning = true;
      this.emit('processing', { message });

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Build system prompt with context
      const systemPrompt = this._buildSystemPrompt(options);

      // Get relevant memories for context
      const relevantMemories = await this.memory.searchMemories(message, 5);
      const contextMessages = this._buildContextMessages(relevantMemories);

      // Call Claude API (with MCP if enabled and servers available)
      const apiParams = {
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [...contextMessages, ...this._formatConversationHistory()],
      };

      const response = this.config.enableMCP && this.mcp.getAllServers().length > 0
        ? await this.mcp.callWithMCP(this.client, apiParams)
        : await this.client.messages.create(apiParams);

      const assistantMessage = response.content[0].text;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      });

      // Save to memory
      await this.memory.saveInteraction(message, assistantMessage);

      // Check if task execution is needed
      const task = this._extractTask(assistantMessage);
      if (task) {
        const result = await this.executor.executeTask(task);
        this.emit('taskExecuted', { task, result });
      }

      this.emit('responseGenerated', {
        message: assistantMessage,
        usage: response.usage
      });

      this.isRunning = false;
      return {
        response: assistantMessage,
        usage: response.usage,
        task: task,
      };

    } catch (error) {
      this.isRunning = false;
      logger.error('Error processing message:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Execute a specific task
   */
  async executeTask(taskDescription) {
    try {
      logger.info(`📋 Executing task: ${taskDescription}`);

      const result = await this.executor.executeTask({
        description: taskDescription,
        type: 'general',
      });

      return result;
    } catch (error) {
      logger.error('Task execution failed:', error);
      throw error;
    }
  }

  /**
   * Schedule a recurring task
   */
  scheduleTask(taskDescription, cronExpression) {
    return this.executor.scheduleTask(taskDescription, cronExpression);
  }

  /**
   * Get agent status and stats
   */
  getStatus() {
    return {
      name: this.config.name,
      model: this.config.model,
      isRunning: this.isRunning,
      conversationCount: this.conversationHistory.length / 2,
      memoryStats: this.memory.getStats(),
      scheduledTasks: this.executor.getScheduledTasks(),
      mcpServers: this.config.enableMCP ? this.mcp.getStats() : null,
    };
  }

  /**
   * Add an MCP server
   */
  async addMCPServer(serverConfig) {
    try {
      this.mcp.addServer(serverConfig);

      // Save to memory
      const currentServers = await this.memory.getPreference('mcp_servers', []);
      currentServers.push(serverConfig);
      await this.memory.savePreference('mcp_servers', currentServers);

      logger.info(`Added MCP server: ${serverConfig.name}`);

      return {
        success: true,
        message: `MCP server '${serverConfig.name}' added successfully`,
      };
    } catch (error) {
      logger.error('Failed to add MCP server:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Remove an MCP server
   */
  async removeMCPServer(name) {
    try {
      this.mcp.removeServer(name);

      // Update memory
      const currentServers = await this.memory.getPreference('mcp_servers', []);
      const updated = currentServers.filter(s => s.name !== name);
      await this.memory.savePreference('mcp_servers', updated);

      logger.info(`Removed MCP server: ${name}`);

      return {
        success: true,
        message: `MCP server '${name}' removed successfully`,
      };
    } catch (error) {
      logger.error('Failed to remove MCP server:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Discover tools from MCP servers
   */
  async discoverMCPTools() {
    if (!this.config.enableMCP) {
      return {
        success: false,
        message: 'MCP is not enabled',
      };
    }

    return await this.mcp.discoverTools(this.client);
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
    logger.info('Conversation history cleared');
  }

  /**
   * Build system prompt with agent capabilities
   */
  _buildSystemPrompt(options = {}) {
    const currentDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    return `You are ${this.config.name}, an AI assistant specialized in automating digital life tasks.

Current Date/Time: ${currentDate}

Your capabilities include:
- 📧 Email management (sending, organizing, filtering)
- 📅 Calendar management (scheduling, reminders)
- 📁 File operations (organizing, searching, backing up)
- 🔍 Web research and information gathering
- 📊 Data analysis and reporting
- ⏰ Task scheduling and automation
- 💾 Remembering context and user preferences
- 🏈 Fantasy football analysis (player comparisons, lineup optimization, trade analysis, matchup analysis, injury impact, waiver wire recommendations)

Guidelines:
- Be proactive in suggesting task automation
- Ask clarifying questions when needed
- Execute tasks step by step
- Provide clear feedback on task completion
- Remember user preferences and context
- Be concise but thorough
- Use Arabic or English based on user's language

${options.additionalContext || ''}`;
  }

  /**
   * Build context messages from memories
   */
  _buildContextMessages(memories) {
    if (memories.length === 0) return [];

    const contextContent = memories
      .map(m => `[${m.timestamp}] User: ${m.userMessage}\nAssistant: ${m.agentResponse}`)
      .join('\n\n');

    return [{
      role: 'user',
      content: `Previous relevant context:\n${contextContent}`,
    }];
  }

  /**
   * Format conversation history for API
   */
  _formatConversationHistory() {
    // Keep only last 10 messages to avoid context overflow
    const recentHistory = this.conversationHistory.slice(-10);

    return recentHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Extract task from assistant response
   */
  _extractTask(response) {
    // Look for task markers in response
    const taskPatterns = [
      /TASK:\s*(.+)/i,
      /I will (.+)/i,
      /Let me (.+)/i,
    ];

    for (const pattern of taskPatterns) {
      const match = response.match(pattern);
      if (match) {
        return {
          description: match[1].trim(),
          type: 'auto-detected',
        };
      }
    }

    return null;
  }

  /**
   * Shutdown agent gracefully
   */
  async shutdown() {
    logger.info('Shutting down agent...');
    this.isRunning = false;
    await this.executor.shutdown();
    await this.memory.close();
    this.emit('shutdown');
  }
}
