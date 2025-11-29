#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import WhatsAppMCP from './index.js';

const PORT = process.env.WHATSAPP_MCP_PORT || 3005;
createMCPServer(WhatsAppMCP, 'WhatsApp Business', PORT);
