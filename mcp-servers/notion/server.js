#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import NotionMCP from './index.js';

const PORT = process.env.NOTION_MCP_PORT || 3002;
createMCPServer(NotionMCP, 'Notion', PORT);
