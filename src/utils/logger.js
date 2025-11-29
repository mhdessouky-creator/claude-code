import fs from 'fs';
import path from 'path';

/**
 * Simple logger utility
 */
class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logFile = process.env.LOG_FILE || './logs/agent.log';
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    // Ensure logs directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  _shouldLog(level) {
    return this.levels[level] >= this.levels[this.logLevel];
  }

  _formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');

    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${formattedArgs}`;
  }

  _writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  debug(message, ...args) {
    if (this._shouldLog('debug')) {
      const formatted = this._formatMessage('debug', message, ...args);
      console.debug(formatted);
      this._writeToFile(formatted);
    }
  }

  info(message, ...args) {
    if (this._shouldLog('info')) {
      const formatted = this._formatMessage('info', message, ...args);
      console.log(formatted);
      this._writeToFile(formatted);
    }
  }

  warn(message, ...args) {
    if (this._shouldLog('warn')) {
      const formatted = this._formatMessage('warn', message, ...args);
      console.warn(formatted);
      this._writeToFile(formatted);
    }
  }

  error(message, ...args) {
    if (this._shouldLog('error')) {
      const formatted = this._formatMessage('error', message, ...args);
      console.error(formatted);
      this._writeToFile(formatted);
    }
  }
}

export const logger = new Logger();
