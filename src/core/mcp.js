import Anthropic from '@anthropic-ai/sdk';

/**
 * MCP (Model Context Protocol) Manager
 * Handles connections to MCP servers for extended capabilities
 */
export class MCPManager {
  constructor(config = {}) {
    this.servers = new Map();
    this.config = config;
  }

  /**
   * Add an MCP server
   */
  addServer(serverConfig) {
    const { name, url, type = 'url', authorization_token } = serverConfig;

    if (!name || !url) {
      throw new Error('Server name and URL are required');
    }

    this.servers.set(name, {
      name,
      url,
      type,
      authorization_token,
      enabled: true,
    });

    return true;
  }

  /**
   * Remove an MCP server
   */
  removeServer(name) {
    return this.servers.delete(name);
  }

  /**
   * Get server configuration
   */
  getServer(name) {
    return this.servers.get(name);
  }

  /**
   * Get all servers
   */
  getAllServers() {
    return Array.from(this.servers.values()).filter(s => s.enabled);
  }

  /**
   * Enable/disable a server
   */
  toggleServer(name, enabled) {
    const server = this.servers.get(name);
    if (server) {
      server.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Build MCP servers array for API request
   */
  buildMCPServersForAPI() {
    return this.getAllServers().map(server => ({
      type: server.type,
      url: server.url,
      name: server.name,
      ...(server.authorization_token && { authorization_token: server.authorization_token }),
    }));
  }

  /**
   * Call Claude API with MCP servers
   */
  async callWithMCP(client, params) {
    const mcpServers = this.buildMCPServersForAPI();

    const apiParams = {
      ...params,
      ...(mcpServers.length > 0 && { mcp_servers: mcpServers }),
    };

    return await client.messages.create(apiParams);
  }

  /**
   * Discover available tools from MCP servers
   */
  async discoverTools(client) {
    try {
      const mcpServers = this.buildMCPServersForAPI();

      if (mcpServers.length === 0) {
        return {
          success: false,
          message: 'No MCP servers configured',
          tools: [],
        };
      }

      const response = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: 'What tools do you have available?' }],
        mcp_servers: mcpServers,
      });

      return {
        success: true,
        message: 'Tools discovered successfully',
        response: response.content[0].text,
        tools: response.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        tools: [],
      };
    }
  }

  /**
   * Get server statistics
   */
  getStats() {
    const allServers = Array.from(this.servers.values());
    return {
      total: allServers.length,
      enabled: allServers.filter(s => s.enabled).length,
      disabled: allServers.filter(s => !s.enabled).length,
      servers: allServers.map(s => ({
        name: s.name,
        url: s.url,
        type: s.type,
        enabled: s.enabled,
      })),
    };
  }
}
