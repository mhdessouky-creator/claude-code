import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * File Module - Handles file operations
 */
export class FileModule {
  constructor(agent) {
    this.agent = agent;
  }

  /**
   * Execute file task
   */
  async execute(task) {
    const action = this._determineAction(task.description);

    switch (action) {
      case 'organize':
        return await this._organizeFiles(task);
      case 'search':
        return await this._searchFiles(task);
      case 'backup':
        return await this._backupFiles(task);
      case 'clean':
        return await this._cleanFiles(task);
      default:
        return {
          success: false,
          message: 'File action not recognized',
        };
    }
  }

  /**
   * Determine file action
   */
  _determineAction(description) {
    if (description.match(/organize|sort/i)) return 'organize';
    if (description.match(/search|find/i)) return 'search';
    if (description.match(/backup/i)) return 'backup';
    if (description.match(/clean|delete|remove/i)) return 'clean';
    return 'unknown';
  }

  /**
   * Organize files in a directory
   */
  async _organizeFiles(task) {
    try {
      const targetDir = await this._extractPath(task.description) || './Downloads';

      // Get all files in directory
      const files = await fs.readdir(targetDir);
      let organized = 0;

      for (const file of files) {
        const filePath = path.join(targetDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          // Organize by file extension
          const ext = path.extname(file).slice(1) || 'other';
          const categoryDir = path.join(targetDir, ext.toUpperCase());

          // Create category directory if it doesn't exist
          await fs.mkdir(categoryDir, { recursive: true });

          // Move file
          const newPath = path.join(categoryDir, file);
          await fs.rename(filePath, newPath);
          organized++;
        }
      }

      logger.info(`Organized ${organized} files in ${targetDir}`);

      return {
        success: true,
        message: `Organized ${organized} files by extension`,
        filesOrganized: organized,
      };
    } catch (error) {
      logger.error('Failed to organize files:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Search for files
   */
  async _searchFiles(task) {
    try {
      const searchTerm = await this._extractSearchTerm(task.description);
      const searchDir = await this._extractPath(task.description) || './';

      const results = await this._recursiveSearch(searchDir, searchTerm);

      logger.info(`Found ${results.length} files matching "${searchTerm}"`);

      return {
        success: true,
        message: `Found ${results.length} matching files`,
        files: results,
      };
    } catch (error) {
      logger.error('Failed to search files:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Recursive file search
   */
  async _recursiveSearch(dir, searchTerm, results = []) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await this._recursiveSearch(fullPath, searchTerm, results);
        } else if (entry.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(fullPath);
        }
      }

      return results;
    } catch (error) {
      // Skip directories we don't have permission to read
      return results;
    }
  }

  /**
   * Backup files
   */
  async _backupFiles(task) {
    try {
      const sourceDir = await this._extractPath(task.description);
      const backupDir = `./backups/${path.basename(sourceDir)}_${Date.now()}`;

      await this._copyDirectory(sourceDir, backupDir);

      logger.info(`Backup created: ${backupDir}`);

      return {
        success: true,
        message: 'Backup created successfully',
        backupPath: backupDir,
      };
    } catch (error) {
      logger.error('Failed to backup files:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Copy directory recursively
   */
  async _copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this._copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Clean old/temporary files
   */
  async _cleanFiles(task) {
    try {
      const targetDir = await this._extractPath(task.description) || './temp';
      let deleted = 0;

      // Delete files older than 30 days
      const files = await fs.readdir(targetDir);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

      for (const file of files) {
        const filePath = path.join(targetDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile() && stats.mtimeMs < thirtyDaysAgo) {
          await fs.unlink(filePath);
          deleted++;
        }
      }

      logger.info(`Deleted ${deleted} old files from ${targetDir}`);

      return {
        success: true,
        message: `Deleted ${deleted} old files`,
        filesDeleted: deleted,
      };
    } catch (error) {
      logger.error('Failed to clean files:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract file path from description
   */
  async _extractPath(description) {
    const pathMatch = description.match(/(?:in|from|at)\s+([^\s]+)/i);
    return pathMatch ? pathMatch[1] : null;
  }

  /**
   * Extract search term from description
   */
  async _extractSearchTerm(description) {
    const searchMatch = description.match(/(?:search|find)\s+(?:for\s+)?["']?([^"'\s]+)["']?/i);
    return searchMatch ? searchMatch[1] : '';
  }
}
