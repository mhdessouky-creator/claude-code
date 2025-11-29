import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * WhatsApp Business API MCP Server
 */
class WhatsAppMCP {
  constructor() {
    this.apiUrl = 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  /**
   * Initialize WhatsApp
   */
  async initialize() {
    try {
      if (!this.phoneNumberId || !this.accessToken) {
        throw new Error('WhatsApp credentials not configured');
      }
      return { success: true, message: 'WhatsApp initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a text message
   */
  async sendMessage({ to, text }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a template message
   */
  async sendTemplate({ to, templateName, languageCode = 'en', components = [] }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send media (image, video, document, audio)
   */
  async sendMedia({ to, type, url, caption }) {
    try {
      const mediaObject = { link: url };
      if (caption && (type === 'image' || type === 'video')) {
        mediaObject.caption = caption;
      }

      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type,
          [type]: mediaObject,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send location
   */
  async sendLocation({ to, latitude, longitude, name, address }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'location',
          location: {
            latitude,
            longitude,
            name,
            address,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send interactive button message
   */
  async sendButtons({ to, bodyText, buttons }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
              buttons: buttons.map((btn, idx) => ({
                type: 'reply',
                reply: {
                  id: btn.id || `btn_${idx}`,
                  title: btn.title,
                },
              })),
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send interactive list message
   */
  async sendList({ to, bodyText, buttonText, sections }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'list',
            body: { text: bodyText },
            action: {
              button: buttonText,
              sections,
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead({ messageId }) {
    try {
      await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return { success: true, message: 'Message marked as read' };
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
      'sendTemplate',
      'sendMedia',
      'sendLocation',
      'sendButtons',
      'sendList',
      'markAsRead',
    ];
  }
}

export default WhatsAppMCP;
