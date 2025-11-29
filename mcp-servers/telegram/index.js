import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Telegram Bot MCP Server
 */
class TelegramMCP {
  constructor() {
    this.bot = null;
    this.messageHandlers = new Map();
  }

  /**
   * Initialize Telegram Bot
   */
  async initialize() {
    try {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
        polling: true,
      });

      // Setup default message handler
      this.bot.on('message', msg => {
        this.handleMessage(msg);
      });

      return { success: true, message: 'Telegram Bot initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle incoming messages
   */
  handleMessage(msg) {
    for (const [id, handler] of this.messageHandlers.entries()) {
      try {
        handler(msg);
      } catch (error) {
        console.error(`Handler ${id} error:`, error);
      }
    }
  }

  /**
   * Send a message
   */
  async sendMessage({ chatId, text, options = {} }) {
    try {
      const result = await this.bot.sendMessage(chatId, text, options);
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a photo
   */
  async sendPhoto({ chatId, photo, caption, options = {} }) {
    try {
      const result = await this.bot.sendPhoto(chatId, photo, {
        caption,
        ...options,
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a document
   */
  async sendDocument({ chatId, document, caption, options = {} }) {
    try {
      const result = await this.bot.sendDocument(chatId, document, {
        caption,
        ...options,
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a location
   */
  async sendLocation({ chatId, latitude, longitude, options = {} }) {
    try {
      const result = await this.bot.sendLocation(chatId, latitude, longitude, options);
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Edit a message
   */
  async editMessage({ chatId, messageId, text, options = {} }) {
    try {
      const result = await this.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...options,
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage({ chatId, messageId }) {
    try {
      await this.bot.deleteMessage(chatId, messageId);
      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get chat
   */
  async getChat({ chatId }) {
    try {
      const chat = await this.bot.getChat(chatId);
      return { success: true, chat };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get chat members count
   */
  async getChatMembersCount({ chatId }) {
    try {
      const count = await this.bot.getChatMembersCount(chatId);
      return { success: true, count };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send poll
   */
  async sendPoll({ chatId, question, options, settings = {} }) {
    try {
      const result = await this.bot.sendPoll(chatId, question, options, settings);
      return { success: true, poll: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Register message handler
   */
  async registerHandler({ handlerId, callback }) {
    try {
      this.messageHandlers.set(handlerId, callback);
      return { success: true, message: 'Handler registered successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Unregister message handler
   */
  async unregisterHandler({ handlerId }) {
    try {
      this.messageHandlers.delete(handlerId);
      return { success: true, message: 'Handler unregistered successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return [
      'sendMessage',
      'sendPhoto',
      'sendDocument',
      'sendLocation',
      'editMessage',
      'deleteMessage',
      'getChat',
      'getChatMembersCount',
      'sendPoll',
      'registerHandler',
      'unregisterHandler',
    ];
  }
}

export default TelegramMCP;
