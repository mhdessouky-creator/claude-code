#!/usr/bin/env node
import { createMCPServer } from '../server-template.js';
import FilesystemMCP from './index.js';

const PORT = process.env.FILESYSTEM_MCP_PORT || 3008;
createMCPServer(FilesystemMCP, 'Filesystem', PORT);
