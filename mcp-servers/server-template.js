#!/usr/bin/env node
import http from 'http';

/**
 * Generic MCP Server Template
 * Creates an HTTP server for any MCP class
 */
export function createMCPServer(MCPClass, serviceName, port) {
  const mcp = new MCPClass();

  // Initialize MCP
  mcp.initialize().then(result => {
    if (!result.success) {
      console.error(`❌ Failed to initialize ${serviceName}:`, result.error);
      process.exit(1);
    }
  });

  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // Handle GET - list available tools
    if (req.method === 'GET' && req.url === '/tools') {
      res.writeHead(200);
      res.end(JSON.stringify({ service: serviceName, tools: mcp.getTools() }));
      return;
    }

    // Handle POST - execute tool
    if (req.method === 'POST' && req.url === '/execute') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { tool, params } = JSON.parse(body);

          if (typeof mcp[tool] !== 'function') {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid tool name' }));
            return;
          }

          const result = await mcp[tool](params);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }

    // Handle health check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', service: serviceName }));
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(port, () => {
    console.log(`🚀 ${serviceName} MCP Server running on port ${port}`);
    console.log(`📋 Available tools: ${mcp.getTools().length || Object.keys(mcp.getTools()).length}`);
  });

  return server;
}
