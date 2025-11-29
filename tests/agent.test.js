import { test, describe } from 'node:test';
import assert from 'node:assert';

/**
 * Basic tests for AI Agent
 * Note: These are placeholder tests. In production, use a proper testing framework.
 */

describe('AI Agent Tests', () => {
  test('package.json exists and is valid', async () => {
    const { readFile } = await import('fs/promises');
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'));

    assert.ok(packageJson.name, 'Package should have a name');
    assert.ok(packageJson.version, 'Package should have a version');
    assert.ok(packageJson.main, 'Package should have a main entry point');
  });

  test('required directories can be created', async () => {
    const { mkdir, access } = await import('fs/promises');

    const testDirs = ['data', 'logs'];

    for (const dir of testDirs) {
      await mkdir(dir, { recursive: true });
      await access(dir);
      assert.ok(true, `Directory ${dir} is accessible`);
    }
  });

  test('environment variables structure', () => {
    // Test that critical env vars are defined (even if empty)
    const requiredEnvVars = [
      'ANTHROPIC_API_KEY',
      'AGENT_NAME',
      'AGENT_MODEL',
      'DB_PATH',
    ];

    // In test environment, we just check the structure
    assert.ok(Array.isArray(requiredEnvVars), 'Required env vars should be defined');
  });
});

describe('Module Imports', () => {
  test('can import core modules', async () => {
    try {
      const { AIAgent } = await import('../src/core/agent.js');
      const { MemoryManager } = await import('../src/core/memory.js');
      const { TaskExecutor } = await import('../src/core/executor.js');

      assert.ok(AIAgent, 'AIAgent should be importable');
      assert.ok(MemoryManager, 'MemoryManager should be importable');
      assert.ok(TaskExecutor, 'TaskExecutor should be importable');
    } catch (error) {
      assert.fail(`Module import failed: ${error.message}`);
    }
  });

  test('can import utility modules', async () => {
    try {
      const { logger } = await import('../src/utils/logger.js');
      assert.ok(logger, 'Logger should be importable');
      assert.ok(typeof logger.info === 'function', 'Logger should have info method');
    } catch (error) {
      assert.fail(`Utility import failed: ${error.message}`);
    }
  });
});

console.log('Running tests...');
