#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import AirtableMCP from './index.js';

const PORT = process.env.AIRTABLE_MCP_PORT || 3003;
createMCPServer(AirtableMCP, 'Airtable', PORT);
