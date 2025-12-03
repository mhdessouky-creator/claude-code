import axios from 'axios';
import { logger } from '../utils/logger.js';

/**
 * Web Module - Handles web-related tasks
 */
export class WebModule {
  constructor(agent) {
    this.agent = agent;
  }

  /**
   * Execute web task
   */
  async execute(task) {
    const action = this._determineAction(task.description);

    switch (action) {
    case 'search':
      return await this._webSearch(task);
    case 'fetch':
      return await this._fetchUrl(task);
    case 'monitor':
      return await this._monitorWebsite(task);
    default:
      return {
        success: false,
        message: 'Web action not recognized',
      };
    }
  }

  /**
   * Determine web action
   */
  _determineAction(description) {
    if (description.match(/search/i)) return 'search';
    if (description.match(/fetch|get|download|scrape/i)) return 'fetch';
    if (description.match(/monitor|watch|check/i)) return 'monitor';
    return 'unknown';
  }

  /**
   * Perform web search
   */
  async _webSearch(task) {
    try {
      const searchQuery = this._extractSearchQuery(task.description);

      logger.info(`Performing web search: ${searchQuery}`);

      // In a real implementation, integrate with a search API
      // For now, return a placeholder response
      return {
        success: true,
        message: `Web search completed for: ${searchQuery}`,
        query: searchQuery,
        note: 'Integrate with a search API (e.g., Google, DuckDuckGo) for actual results',
      };
    } catch (error) {
      logger.error('Web search failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Fetch content from URL
   */
  async _fetchUrl(task) {
    try {
      const url = this._extractUrl(task.description);

      if (!url) {
        return {
          success: false,
          message: 'No URL found in task description',
        };
      }

      logger.info(`Fetching URL: ${url}`);

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AI-Agent/1.0',
        },
      });

      return {
        success: true,
        message: 'URL fetched successfully',
        url: url,
        statusCode: response.status,
        contentType: response.headers['content-type'],
        contentLength: response.data.length,
        preview: response.data.substring(0, 200),
      };
    } catch (error) {
      logger.error('Failed to fetch URL:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Monitor a website for changes
   */
  async _monitorWebsite(task) {
    try {
      const url = this._extractUrl(task.description);

      if (!url) {
        return {
          success: false,
          message: 'No URL found in task description',
        };
      }

      // Fetch current state
      const response = await axios.get(url, { timeout: 10000 });

      // Save current state to memory for future comparison
      await this.agent.memory.savePreference(`monitor_${url}`, {
        lastChecked: new Date().toISOString(),
        contentHash: this._hashContent(response.data),
      });

      logger.info(`Started monitoring: ${url}`);

      return {
        success: true,
        message: `Website monitoring started for: ${url}`,
        url: url,
        note: 'Schedule regular checks to detect changes',
      };
    } catch (error) {
      logger.error('Failed to setup monitoring:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract search query from description
   */
  _extractSearchQuery(description) {
    const searchMatch = description.match(/search\s+(?:for\s+)?["']?([^"']+)["']?/i);
    return searchMatch ? searchMatch[1].trim() : description;
  }

  /**
   * Extract URL from description
   */
  _extractUrl(description) {
    const urlMatch = description.match(/https?:\/\/[^\s]+/i);
    return urlMatch ? urlMatch[0] : null;
  }

  /**
   * Simple content hash for change detection
   */
  _hashContent(content) {
    let hash = 0;
    const str = content.toString();

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return hash.toString(36);
  }
}
