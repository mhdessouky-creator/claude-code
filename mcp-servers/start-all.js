#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Master MCP Server Launcher
 * Starts all MCP servers in parallel
 */

const servers = [
  { name: 'Google Workspace', path: './google-workspace/server.js', port: 3001 },
  { name: 'Notion', path: './notion/server.js', port: 3002 },
  { name: 'Airtable', path: './airtable/server.js', port: 3003 },
  { name: 'Telegram', path: './telegram/server.js', port: 3004 },
  { name: 'WhatsApp', path: './whatsapp/server.js', port: 3005 },
  { name: 'Twitter', path: './twitter/server.js', port: 3006 },
  { name: 'Reddit', path: './reddit/server.js', port: 3007 },
  { name: 'Filesystem', path: './filesystem/server.js', port: 3008 },
];

const processes = [];

console.log('🚀 Starting all MCP servers...\n');

servers.forEach(server => {
  const serverPath = path.join(__dirname, server.path);
  const proc = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: process.env,
  });

  proc.on('error', err => {
    console.error(`❌ Failed to start ${server.name}: ${err.message}`);
  });

  proc.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`❌ ${server.name} exited with code ${code}`);
    }
  });

  processes.push({ name: server.name, process: proc });
});

console.log('\n✨ All MCP servers started!\n');
console.log('📋 Running servers:');
servers.forEach(server => {
  console.log(`  - ${server.name}: http://localhost:${server.port}`);
});

console.log('\n⚠️  Press Ctrl+C to stop all servers\n');

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all servers...');
  processes.forEach(({ name, process: proc }) => {
    console.log(`  Stopping ${name}...`);
    proc.kill('SIGTERM');
  });
  process.exit(0);
});
