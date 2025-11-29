#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import TwitterMCP from './index.js';

const PORT = process.env.TWITTER_MCP_PORT || 3006;
createMCPServer(TwitterMCP, 'X (Twitter)', PORT);
