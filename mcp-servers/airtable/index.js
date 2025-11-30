import Airtable from 'airtable';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

/**
 * Airtable MCP Server with Webhooks Support
 */
class AirtableMCP {
  constructor() {
    this.base = null;
    this.webhooks = new Map();
  }

  /**
   * Initialize Airtable
   */
  async initialize() {
    try {
      Airtable.configure({
        apiKey: process.env.AIRTABLE_API_KEY,
      });

      this.base = Airtable.base(process.env.AIRTABLE_BASE_ID);

      return { success: true, message: 'Airtable initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * List records from a table
   */
  async listRecords({ tableName, maxRecords = 100, view, filterByFormula }) {
    try {
      const records = [];
      const query = {
        maxRecords,
      };

      if (view) query.view = view;
      if (filterByFormula) query.filterByFormula = filterByFormula;

      await this.base(tableName)
        .select(query)
        .eachPage((pageRecords, fetchNextPage) => {
          records.push(...pageRecords.map(r => ({ id: r.id, fields: r.fields })));
          fetchNextPage();
        });

      return { success: true, records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a single record
   */
  async getRecord({ tableName, recordId }) {
    try {
      const record = await this.base(tableName).find(recordId);
      return { success: true, record: { id: record.id, fields: record.fields } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a record
   */
  async createRecord({ tableName, fields }) {
    try {
      const record = await this.base(tableName).create(fields);
      return { success: true, record: { id: record.id, fields: record.fields } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create multiple records
   */
  async createRecords({ tableName, records }) {
    try {
      const created = await this.base(tableName).create(records);
      return {
        success: true,
        records: created.map(r => ({ id: r.id, fields: r.fields })),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update a record
   */
  async updateRecord({ tableName, recordId, fields }) {
    try {
      const record = await this.base(tableName).update(recordId, fields);
      return { success: true, record: { id: record.id, fields: record.fields } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a record
   */
  async deleteRecord({ tableName, recordId }) {
    try {
      await this.base(tableName).destroy(recordId);
      return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search records
   */
  async searchRecords({ tableName, fieldName, value }) {
    try {
      const filterByFormula = `{${fieldName}} = '${value}'`;
      return this.listRecords({ tableName, filterByFormula });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Register a webhook
   */
  async registerWebhook({ tableName, url, events = ['create', 'update', 'delete'] }) {
    try {
      const webhookId = crypto.randomUUID();
      this.webhooks.set(webhookId, {
        tableName,
        url,
        events,
        active: true,
      });

      return {
        success: true,
        webhookId,
        message: 'Webhook registered successfully',
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Unregister a webhook
   */
  async unregisterWebhook({ webhookId }) {
    try {
      if (this.webhooks.has(webhookId)) {
        this.webhooks.delete(webhookId);
        return { success: true, message: 'Webhook unregistered successfully' };
      }
      return { success: false, error: 'Webhook not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * List webhooks
   */
  async listWebhooks() {
    try {
      const webhooks = Array.from(this.webhooks.entries()).map(([id, config]) => ({
        id,
        ...config,
      }));

      return { success: true, webhooks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Trigger webhook (internal use)
   */
  async triggerWebhook(tableName, event, data) {
    const webhooks = Array.from(this.webhooks.values()).filter(
      w => w.tableName === tableName && w.events.includes(event) && w.active
    );

    for (const webhook of webhooks) {
      try {
        await fetch(webhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, tableName, data }),
        });
      } catch (error) {
        console.error(`Webhook error: ${error.message}`);
      }
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'listRecords',
      'getRecord',
      'createRecord',
      'createRecords',
      'updateRecord',
      'deleteRecord',
      'searchRecords',
      'registerWebhook',
      'unregisterWebhook',
      'listWebhooks',
    ];
  }
}

export default AirtableMCP;
