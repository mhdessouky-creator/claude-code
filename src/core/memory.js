import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { logger } from '../utils/logger.js';

/**
 * Memory Manager - Handles persistent storage of conversations and context
 */
export class MemoryManager {
  constructor(dbPath = process.env.DB_PATH || './data/agent-memory.db') {
    this.dbPath = dbPath;
    this.db = null;
  }

  /**
   * Initialize database
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          logger.error('Failed to connect to database:', err);
          reject(err);
          return;
        }

        logger.info('Connected to memory database');
        this._createTables()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  /**
   * Create database tables
   */
  async _createTables() {
    const run = promisify(this.db.run.bind(this.db));

    // Conversations table
    await run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT NOT NULL,
        agent_response TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        tokens_used INTEGER,
        context_tags TEXT
      )
    `);

    // User preferences table
    await run(`
      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks history table
    await run(`
      CREATE TABLE IF NOT EXISTS tasks_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      )
    `);

    // Create indexes for better search performance
    await run(`
      CREATE INDEX IF NOT EXISTS idx_conversations_timestamp
      ON conversations(timestamp DESC)
    `);

    await run(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status
      ON tasks_history(status, created_at DESC)
    `);

    logger.info('Database tables initialized');
  }

  /**
   * Save an interaction to memory
   */
  async saveInteraction(userMessage, agentResponse, metadata = {}) {
    const run = promisify(this.db.run.bind(this.db));

    try {
      await run(
        `INSERT INTO conversations (user_message, agent_response, tokens_used, context_tags)
         VALUES (?, ?, ?, ?)`,
        [
          userMessage,
          agentResponse,
          metadata.tokensUsed || null,
          metadata.tags ? JSON.stringify(metadata.tags) : null,
        ]
      );

      logger.debug('Interaction saved to memory');
    } catch (error) {
      logger.error('Failed to save interaction:', error);
      throw error;
    }
  }

  /**
   * Search for relevant memories based on query
   */
  async searchMemories(query, limit = 5) {
    const all = promisify(this.db.all.bind(this.db));

    try {
      // Simple keyword-based search (can be enhanced with embeddings)
      const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
      const searchPattern = `%${keywords.join('%')}%`;

      const memories = await all(
        `SELECT * FROM conversations
         WHERE LOWER(user_message) LIKE ? OR LOWER(agent_response) LIKE ?
         ORDER BY timestamp DESC
         LIMIT ?`,
        [searchPattern, searchPattern, limit]
      );

      return memories.map(m => ({
        userMessage: m.user_message,
        agentResponse: m.agent_response,
        timestamp: m.timestamp,
        tags: m.context_tags ? JSON.parse(m.context_tags) : [],
      }));
    } catch (error) {
      logger.error('Failed to search memories:', error);
      return [];
    }
  }

  /**
   * Get recent conversations
   */
  async getRecentConversations(limit = 10) {
    const all = promisify(this.db.all.bind(this.db));

    try {
      const conversations = await all(
        `SELECT * FROM conversations
         ORDER BY timestamp DESC
         LIMIT ?`,
        [limit]
      );

      return conversations.map(c => ({
        id: c.id,
        userMessage: c.user_message,
        agentResponse: c.agent_response,
        timestamp: c.timestamp,
        tokensUsed: c.tokens_used,
      }));
    } catch (error) {
      logger.error('Failed to get recent conversations:', error);
      return [];
    }
  }

  /**
   * Save user preference
   */
  async savePreference(key, value) {
    const run = promisify(this.db.run.bind(this.db));

    try {
      await run(
        `INSERT OR REPLACE INTO preferences (key, value, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, JSON.stringify(value)]
      );

      logger.debug(`Preference saved: ${key}`);
    } catch (error) {
      logger.error('Failed to save preference:', error);
      throw error;
    }
  }

  /**
   * Get user preference
   */
  async getPreference(key, defaultValue = null) {
    const get = promisify(this.db.get.bind(this.db));

    try {
      const row = await get(
        'SELECT value FROM preferences WHERE key = ?',
        [key]
      );

      return row ? JSON.parse(row.value) : defaultValue;
    } catch (error) {
      logger.error('Failed to get preference:', error);
      return defaultValue;
    }
  }

  /**
   * Save task to history
   */
  async saveTask(task, result = null) {
    const run = promisify(this.db.run.bind(this.db));

    try {
      await run(
        `INSERT INTO tasks_history (description, type, status, result, completed_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          task.description,
          task.type,
          result ? 'completed' : 'pending',
          result ? JSON.stringify(result) : null,
          result ? new Date().toISOString() : null,
        ]
      );

      logger.debug('Task saved to history');
    } catch (error) {
      logger.error('Failed to save task:', error);
      throw error;
    }
  }

  /**
   * Get tasks history
   */
  async getTasksHistory(limit = 20) {
    const all = promisify(this.db.all.bind(this.db));

    try {
      const tasks = await all(
        `SELECT * FROM tasks_history
         ORDER BY created_at DESC
         LIMIT ?`,
        [limit]
      );

      return tasks.map(t => ({
        id: t.id,
        description: t.description,
        type: t.type,
        status: t.status,
        result: t.result ? JSON.parse(t.result) : null,
        createdAt: t.created_at,
        completedAt: t.completed_at,
      }));
    } catch (error) {
      logger.error('Failed to get tasks history:', error);
      return [];
    }
  }

  /**
   * Get memory statistics
   */
  getStats() {
    const get = promisify(this.db.get.bind(this.db));

    return Promise.all([
      get('SELECT COUNT(*) as count FROM conversations'),
      get('SELECT COUNT(*) as count FROM tasks_history'),
      get('SELECT COUNT(*) as count FROM preferences'),
    ]).then(([conversations, tasks, preferences]) => ({
      totalConversations: conversations.count,
      totalTasks: tasks.count,
      totalPreferences: preferences.count,
    }));
  }

  /**
   * Clear old memories (keep last N days)
   */
  async clearOldMemories(daysToKeep = 30) {
    const run = promisify(this.db.run.bind(this.db));

    try {
      const result = await run(
        `DELETE FROM conversations
         WHERE timestamp < datetime('now', '-' || ? || ' days')`,
        [daysToKeep]
      );

      logger.info(`Cleared ${result.changes} old conversations`);
      return result.changes;
    } catch (error) {
      logger.error('Failed to clear old memories:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Error closing database:', err);
          } else {
            logger.info('Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
