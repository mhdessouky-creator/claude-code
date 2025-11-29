#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { AIAgent } from './core/agent.js';
import { logger } from './utils/logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('ai-agent')
  .description('🤖 AI Agent for automating digital life tasks')
  .version(packageJson.version);

/**
 * Interactive chat mode
 */
program
  .command('chat')
  .description('Start interactive chat with the AI agent')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🤖 AI Agent - Interactive Chat\n'));

    const agent = new AIAgent();
    const spinner = ora('Initializing agent...').start();

    try {
      await agent.initialize();
      spinner.succeed(chalk.green('Agent initialized!'));

      console.log(chalk.gray('Type your messages below. Use /exit to quit.\n'));

      let running = true;

      while (running) {
        const { message } = await inquirer.prompt([
          {
            type: 'input',
            name: 'message',
            message: chalk.blue('You:'),
            prefix: '',
          },
        ]);

        if (message.toLowerCase() === '/exit') {
          running = false;
          continue;
        }

        if (!message.trim()) continue;

        const thinkingSpinner = ora('Thinking...').start();

        try {
          const response = await agent.processMessage(message);
          thinkingSpinner.stop();

          console.log(chalk.green('\n🤖 Agent:'), response.response);

          if (response.task) {
            console.log(chalk.yellow('\n📋 Task executed:'), response.task.description);
          }

          console.log(chalk.gray(`\n(Tokens: ${response.usage.input_tokens + response.usage.output_tokens})\n`));
        } catch (error) {
          thinkingSpinner.fail(chalk.red('Error processing message'));
          console.error(chalk.red(error.message));
        }
      }

      await agent.shutdown();
      console.log(chalk.cyan('\n👋 Goodbye!\n'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize agent'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

/**
 * Execute a single task
 */
program
  .command('task <description>')
  .description('Execute a specific task')
  .action(async (description) => {
    const agent = new AIAgent();
    const spinner = ora('Initializing agent...').start();

    try {
      await agent.initialize();
      spinner.text = 'Executing task...';

      const result = await agent.executeTask(description);

      if (result.success) {
        spinner.succeed(chalk.green('Task completed!'));
        console.log(chalk.white('\nResult:'), result.message);
      } else {
        spinner.fail(chalk.red('Task failed'));
        console.error(chalk.red(result.error || result.message));
      }

      await agent.shutdown();
    } catch (error) {
      spinner.fail(chalk.red('Error executing task'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

/**
 * Schedule a recurring task
 */
program
  .command('schedule <description> <cron>')
  .description('Schedule a recurring task (cron format)')
  .action(async (description, cron) => {
    const agent = new AIAgent();
    const spinner = ora('Initializing agent...').start();

    try {
      await agent.initialize();
      spinner.text = 'Scheduling task...';

      const result = agent.scheduleTask(description, cron);

      if (result.success) {
        spinner.succeed(chalk.green('Task scheduled!'));
        console.log(chalk.white('Task ID:'), result.taskId);
        console.log(chalk.white('Schedule:'), cron);
      } else {
        spinner.fail(chalk.red('Failed to schedule task'));
        console.error(chalk.red(result.error));
      }

      // Keep agent running for scheduled tasks
      console.log(chalk.cyan('\n🔄 Agent is running with scheduled tasks...'));
      console.log(chalk.gray('Press Ctrl+C to stop\n'));

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\nShutting down...'));
        await agent.shutdown();
        process.exit(0);
      });
    } catch (error) {
      spinner.fail(chalk.red('Error scheduling task'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

/**
 * Show agent status
 */
program
  .command('status')
  .description('Show agent status and statistics')
  .action(async () => {
    const agent = new AIAgent();
    const spinner = ora('Loading status...').start();

    try {
      await agent.initialize();
      const status = agent.getStatus();

      spinner.stop();

      console.log(chalk.cyan.bold('\n📊 Agent Status\n'));
      console.log(chalk.white('Name:'), status.name);
      console.log(chalk.white('Model:'), status.model);
      console.log(chalk.white('Status:'), status.isRunning ? chalk.green('Running') : chalk.gray('Idle'));
      console.log(chalk.white('Conversations:'), status.conversationCount);

      if (status.memoryStats) {
        console.log(chalk.cyan('\n💾 Memory:'));
        console.log(chalk.white('  Total Conversations:'), status.memoryStats.totalConversations);
        console.log(chalk.white('  Total Tasks:'), status.memoryStats.totalTasks);
        console.log(chalk.white('  Preferences:'), status.memoryStats.totalPreferences);
      }

      if (status.scheduledTasks && status.scheduledTasks.length > 0) {
        console.log(chalk.cyan('\n⏰ Scheduled Tasks:'));
        status.scheduledTasks.forEach(task => {
          console.log(chalk.white(`  - ${task.description}`));
          console.log(chalk.gray(`    ${task.cronExpression} (Created: ${task.createdAt})`));
        });
      }

      console.log();

      await agent.shutdown();
    } catch (error) {
      spinner.fail(chalk.red('Error loading status'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

/**
 * Clear conversation history
 */
program
  .command('clear')
  .description('Clear conversation history and old memories')
  .action(async () => {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clear all history?',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelled'));
      return;
    }

    const agent = new AIAgent();
    const spinner = ora('Clearing history...').start();

    try {
      await agent.initialize();
      agent.clearHistory();
      await agent.memory.clearOldMemories(0); // Clear all

      spinner.succeed(chalk.green('History cleared!'));
      await agent.shutdown();
    } catch (error) {
      spinner.fail(chalk.red('Error clearing history'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Parse commands
program.parse(process.argv);

// Show help if no command specified
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
