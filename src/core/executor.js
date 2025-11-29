import cron from 'node-cron';
import { logger } from '../utils/logger.js';

/**
 * Task Executor - Handles execution of various tasks
 */
export class TaskExecutor {
  constructor(agent) {
    this.agent = agent;
    this.scheduledTasks = new Map();
    this.taskModules = new Map();
  }

  /**
   * Initialize executor and load task modules
   */
  async initialize() {
    try {
      // Load task modules dynamically
      await this._loadTaskModules();
      logger.info('Task executor initialized');
    } catch (error) {
      logger.error('Failed to initialize executor:', error);
      throw error;
    }
  }

  /**
   * Load all task modules
   */
  async _loadTaskModules() {
    try {
      // Import task modules
      const { EmailModule } = await import('../modules/email.js').catch(() => ({ EmailModule: null }));
      const { FileModule } = await import('../modules/files.js').catch(() => ({ FileModule: null }));
      const { WebModule } = await import('../modules/web.js').catch(() => ({ WebModule: null }));

      // Register modules
      if (EmailModule) this.taskModules.set('email', new EmailModule(this.agent));
      if (FileModule) this.taskModules.set('file', new FileModule(this.agent));
      if (WebModule) this.taskModules.set('web', new WebModule(this.agent));

      logger.info(`Loaded ${this.taskModules.size} task modules`);
    } catch (error) {
      logger.warn('Some task modules failed to load:', error.message);
    }
  }

  /**
   * Execute a task
   */
  async executeTask(task) {
    try {
      logger.info(`Executing task: ${task.description}`);

      // Determine task type and route to appropriate module
      const taskType = this._determineTaskType(task);
      const module = this.taskModules.get(taskType);

      if (!module) {
        logger.warn(`No module found for task type: ${taskType}`);
        return {
          success: false,
          message: `Task type '${taskType}' not supported yet`,
        };
      }

      // Execute task with module
      const result = await module.execute(task);

      // Save to memory
      await this.agent.memory.saveTask(task, result);

      return result;
    } catch (error) {
      logger.error('Task execution failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Determine task type from description
   */
  _determineTaskType(task) {
    const description = task.description.toLowerCase();

    // Email-related keywords
    if (description.match(/email|mail|send message|compose/i)) {
      return 'email';
    }

    // File-related keywords
    if (description.match(/file|folder|directory|organize|backup/i)) {
      return 'file';
    }

    // Web-related keywords
    if (description.match(/search|browse|website|url|download/i)) {
      return 'web';
    }

    return task.type || 'general';
  }

  /**
   * Schedule a recurring task
   */
  scheduleTask(taskDescription, cronExpression) {
    try {
      if (!cron.validate(cronExpression)) {
        throw new Error('Invalid cron expression');
      }

      const taskId = `task_${Date.now()}`;

      const scheduledTask = cron.schedule(cronExpression, async () => {
        logger.info(`Running scheduled task: ${taskDescription}`);

        try {
          await this.executeTask({
            description: taskDescription,
            type: 'scheduled',
          });
        } catch (error) {
          logger.error('Scheduled task failed:', error);
        }
      });

      this.scheduledTasks.set(taskId, {
        id: taskId,
        description: taskDescription,
        cronExpression,
        task: scheduledTask,
        createdAt: new Date(),
      });

      logger.info(`Task scheduled: ${taskDescription} (${cronExpression})`);

      return {
        success: true,
        taskId,
        message: `Task scheduled successfully`,
      };
    } catch (error) {
      logger.error('Failed to schedule task:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Cancel a scheduled task
   */
  cancelScheduledTask(taskId) {
    const scheduledTask = this.scheduledTasks.get(taskId);

    if (!scheduledTask) {
      return {
        success: false,
        message: 'Task not found',
      };
    }

    scheduledTask.task.stop();
    this.scheduledTasks.delete(taskId);

    logger.info(`Cancelled scheduled task: ${taskId}`);

    return {
      success: true,
      message: 'Task cancelled',
    };
  }

  /**
   * Get all scheduled tasks
   */
  getScheduledTasks() {
    return Array.from(this.scheduledTasks.values()).map(t => ({
      id: t.id,
      description: t.description,
      cronExpression: t.cronExpression,
      createdAt: t.createdAt,
    }));
  }

  /**
   * Shutdown executor
   */
  async shutdown() {
    // Stop all scheduled tasks
    for (const [taskId, scheduledTask] of this.scheduledTasks) {
      scheduledTask.task.stop();
      logger.info(`Stopped scheduled task: ${taskId}`);
    }

    this.scheduledTasks.clear();
    logger.info('Task executor shutdown complete');
  }
}
