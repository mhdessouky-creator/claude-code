#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import TelegramMCP from './index.js';

const PORT = process.env.TELEGRAM_MCP_PORT || 3004;
createMCPServer(TelegramMCP, 'Telegram Bot', PORT);
