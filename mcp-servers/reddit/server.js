#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import RedditMCP from './index.js';

const PORT = process.env.REDDIT_MCP_PORT || 3007;
createMCPServer(RedditMCP, 'Reddit', PORT);
