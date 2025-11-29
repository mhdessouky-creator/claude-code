#!/usr/bin/env node

import dotenv from 'dotenv';
import { AIAgent } from './core/agent.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the AI Agent
 */
async function main() {
  logger.info('🤖 Starting AI Agent...');

  const agent = new AIAgent({
    name: process.env.AGENT_NAME || 'Digital Life Assistant',
    model: process.env.AGENT_MODEL,
  });

  try {
    // Initialize the agent
    await agent.initialize();
    logger.info('✅ Agent initialized successfully');

    // Example: Process a message
    const exampleMessage = 'Hello! What can you help me with today?';
    logger.info(`Sending example message: ${exampleMessage}`);

    const response = await agent.processMessage(exampleMessage);
    logger.info('Response received:');
    console.log('\n' + response.response + '\n');

    // Show agent status
    const status = agent.getStatus();
    logger.info('Agent Status:', status);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('\n🛑 Shutting down agent...');
      await agent.shutdown();
      process.exit(0);
    });

    // Keep the process running for scheduled tasks
    if (process.env.ENABLE_SCHEDULER === 'true') {
      logger.info('🔄 Agent is running in daemon mode with scheduler enabled');
      logger.info('Press Ctrl+C to stop');
    } else {
      // Exit after example
      await agent.shutdown();
      logger.info('👋 Example completed. Use CLI for interactive mode.');
    }

  } catch (error) {
    logger.error('❌ Agent failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AIAgent };
