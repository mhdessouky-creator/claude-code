import fs from 'fs/promises';
import path from 'path';
import { existsSync, createReadStream, createWriteStream } from 'fs';
import { glob } from 'glob';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Filesystem MCP Server
 * Provides safe filesystem operations
 */
class FilesystemMCP {
  constructor() {
    this.basePath = process.env.FILESYSTEM_BASE_PATH || process.cwd();
  }

  /**
   * Initialize filesystem
   */
  async initialize() {
    try {
      return { success: true, message: 'Filesystem initialized successfully', basePath: this.basePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Resolve and validate path
   */
  resolvePath(filePath) {
    const resolved = path.resolve(this.basePath, filePath);
    if (!resolved.startsWith(this.basePath)) {
      throw new Error('Access denied: Path outside base directory');
    }
    return resolved;
  }

  /**
   * Read a file
   */
  async readFile({ filePath, encoding = 'utf8' }) {
    try {
      const resolved = this.resolvePath(filePath);
      const content = await fs.readFile(resolved, encoding);
      return { success: true, content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Write a file
   */
  async writeFile({ filePath, content, encoding = 'utf8' }) {
    try {
      const resolved = this.resolvePath(filePath);
      await fs.writeFile(resolved, content, encoding);
      return { success: true, message: 'File written successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Append to a file
   */
  async appendFile({ filePath, content, encoding = 'utf8' }) {
    try {
      const resolved = this.resolvePath(filePath);
      await fs.appendFile(resolved, content, encoding);
      return { success: true, message: 'Content appended successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a file
   */
  async deleteFile({ filePath }) {
    try {
      const resolved = this.resolvePath(filePath);
      await fs.unlink(resolved);
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * List directory contents
   */
  async listDirectory({ dirPath = '.', recursive = false }) {
    try {
      const resolved = this.resolvePath(dirPath);

      if (recursive) {
        const files = await glob('**/*', { cwd: resolved, nodir: false });
        return { success: true, files };
      } else {
        const entries = await fs.readdir(resolved, { withFileTypes: true });
        const files = entries.map(entry => ({
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file',
        }));
        return { success: true, files };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a directory
   */
  async createDirectory({ dirPath, recursive = true }) {
    try {
      const resolved = this.resolvePath(dirPath);
      await fs.mkdir(resolved, { recursive });
      return { success: true, message: 'Directory created successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a directory
   */
  async deleteDirectory({ dirPath, recursive = false }) {
    try {
      const resolved = this.resolvePath(dirPath);
      await fs.rm(resolved, { recursive, force: false });
      return { success: true, message: 'Directory deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Copy a file
   */
  async copyFile({ source, destination }) {
    try {
      const resolvedSource = this.resolvePath(source);
      const resolvedDest = this.resolvePath(destination);
      await fs.copyFile(resolvedSource, resolvedDest);
      return { success: true, message: 'File copied successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Move/rename a file
   */
  async moveFile({ source, destination }) {
    try {
      const resolvedSource = this.resolvePath(source);
      const resolvedDest = this.resolvePath(destination);
      await fs.rename(resolvedSource, resolvedDest);
      return { success: true, message: 'File moved successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file stats
   */
  async getStats({ filePath }) {
    try {
      const resolved = this.resolvePath(filePath);
      const stats = await fs.stat(resolved);
      return {
        success: true,
        stats: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if path exists
   */
  async exists({ filePath }) {
    try {
      const resolved = this.resolvePath(filePath);
      const exists = existsSync(resolved);
      return { success: true, exists };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search files by pattern
   */
  async search({ pattern, cwd = '.' }) {
    try {
      const resolved = this.resolvePath(cwd);
      const files = await glob(pattern, { cwd: resolved });
      return { success: true, files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Read JSON file
   */
  async readJSON({ filePath }) {
    try {
      const result = await this.readFile({ filePath });
      if (result.success) {
        const data = JSON.parse(result.content);
        return { success: true, data };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Write JSON file
   */
  async writeJSON({ filePath, data, pretty = true }) {
    try {
      const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
      return this.writeFile({ filePath, content });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'readFile',
      'writeFile',
      'appendFile',
      'deleteFile',
      'listDirectory',
      'createDirectory',
      'deleteDirectory',
      'copyFile',
      'moveFile',
      'getStats',
      'exists',
      'search',
      'readJSON',
      'writeJSON',
    ];
  }
}

export default FilesystemMCP;
