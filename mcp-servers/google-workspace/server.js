#!/usr/bin/env node
import http from 'http';
import GoogleWorkspaceMCP from './index.js';

const mcp = new GoogleWorkspaceMCP();
const PORT = process.env.GOOGLE_WORKSPACE_MCP_PORT || 3001;

// Initialize MCP
await mcp.initialize();

// Create HTTP server for MCP
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
    res.end(JSON.stringify(mcp.getTools()));
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
    res.end(JSON.stringify({ status: 'ok', service: 'Google Workspace MCP' }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Google Workspace MCP Server running on port ${PORT}`);
  console.log(`📧 Gmail, 📅 Calendar, 📁 Drive, 📄 Docs, 📊 Sheets, ✅ Tasks`);
});
