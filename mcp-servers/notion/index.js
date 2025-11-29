import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Notion MCP Server
 * Provides tools for Notion pages, databases, and blocks
 */
class NotionMCP {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize Notion client
   */
  async initialize() {
    try {
      this.client = new Client({
        auth: process.env.NOTION_API_KEY,
      });

      return { success: true, message: 'Notion initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search Notion
   */
  async search({ query, filter }) {
    try {
      const response = await this.client.search({
        query,
        filter,
      });

      return { success: true, results: response.results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a page
   */
  async createPage({ parent, properties, children }) {
    try {
      const response = await this.client.pages.create({
        parent,
        properties,
        children,
      });

      return { success: true, page: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a page
   */
  async getPage({ pageId }) {
    try {
      const response = await this.client.pages.retrieve({
        page_id: pageId,
      });

      return { success: true, page: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a page
   */
  async updatePage({ pageId, properties }) {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties,
      });

      return { success: true, page: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Query a database
   */
  async queryDatabase({ databaseId, filter, sorts }) {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
        sorts,
      });

      return { success: true, results: response.results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a database
   */
  async createDatabase({ parent, title, properties }) {
    try {
      const response = await this.client.databases.create({
        parent,
        title,
        properties,
      });

      return { success: true, database: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get database
   */
  async getDatabase({ databaseId }) {
    try {
      const response = await this.client.databases.retrieve({
        database_id: databaseId,
      });

      return { success: true, database: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Append blocks to a page
   */
  async appendBlocks({ blockId, children }) {
    try {
      const response = await this.client.blocks.children.append({
        block_id: blockId,
        children,
      });

      return { success: true, blocks: response.results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get block children
   */
  async getBlockChildren({ blockId }) {
    try {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
      });

      return { success: true, blocks: response.results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'search',
      'createPage',
      'getPage',
      'updatePage',
      'queryDatabase',
      'createDatabase',
      'getDatabase',
      'appendBlocks',
      'getBlockChildren',
    ];
  }
}

export default NotionMCP;
