import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Google Workspace MCP Server
 * Provides tools for Gmail, Calendar, Drive, Docs, Sheets, Keep, Tasks
 */
class GoogleWorkspaceMCP {
  constructor() {
    this.auth = null;
    this.gmail = null;
    this.calendar = null;
    this.drive = null;
    this.docs = null;
    this.sheets = null;
    this.tasks = null;
    this.keep = null;
  }

  /**
   * Initialize Google Workspace services
   */
  async initialize() {
    try {
      // Initialize OAuth2 client
      this.auth = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
      });

      // Set credentials if available
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        this.auth.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
      }

      // Initialize Google services
      this.gmail = google.gmail({ version: 'v1', auth: this.auth });
      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      this.docs = google.docs({ version: 'v1', auth: this.auth });
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.tasks = google.tasks({ version: 'v1', auth: this.auth });

      return { success: true, message: 'Google Workspace initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Gmail Tools
   */
  async sendEmail({ to, subject, body, cc, bcc }) {
    try {
      const message = [
        `To: ${to}`,
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        `Subject: ${subject}`,
        '',
        body,
      ]
        .filter(Boolean)
        .join('\n');

      const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return { success: true, messageId: result.data.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchEmails({ query, maxResults = 10 }) {
    try {
      const result = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults,
      });

      const messages = [];
      if (result.data.messages) {
        for (const msg of result.data.messages) {
          const details = await this.gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
          });
          messages.push(details.data);
        }
      }

      return { success: true, messages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUnreadEmails({ maxResults = 10 }) {
    return this.searchEmails({ query: 'is:unread', maxResults });
  }

  /**
   * Calendar Tools
   */
  async listEvents({ maxResults = 10, timeMin, timeMax }) {
    try {
      const result = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return { success: true, events: result.data.items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createEvent({ summary, description, start, end, attendees, location }) {
    try {
      const event = {
        summary,
        description,
        location,
        start: {
          dateTime: start,
          timeZone: 'UTC',
        },
        end: {
          dateTime: end,
          timeZone: 'UTC',
        },
        attendees: attendees ? attendees.map(email => ({ email })) : [],
      };

      const result = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return { success: true, event: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Drive Tools
   */
  async listFiles({ query, maxResults = 10 }) {
    try {
      const result = await this.drive.files.list({
        q: query,
        pageSize: maxResults,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, size)',
      });

      return { success: true, files: result.data.files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async uploadFile({ name, content, mimeType, folderId }) {
    try {
      const fileMetadata = {
        name,
        parents: folderId ? [folderId] : [],
      };

      const media = {
        mimeType,
        body: content,
      };

      const result = await this.drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, webViewLink',
      });

      return { success: true, file: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async searchDrive({ query, maxResults = 10 }) {
    return this.listFiles({ query, maxResults });
  }

  /**
   * Docs Tools
   */
  async createDoc({ title, content }) {
    try {
      const result = await this.docs.documents.create({
        requestBody: {
          title,
        },
      });

      if (content) {
        await this.docs.documents.batchUpdate({
          documentId: result.data.documentId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: content,
                },
              },
            ],
          },
        });
      }

      return { success: true, document: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getDoc({ documentId }) {
    try {
      const result = await this.docs.documents.get({ documentId });
      return { success: true, document: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sheets Tools
   */
  async createSheet({ title, headers }) {
    try {
      const result = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title,
          },
          sheets: [
            {
              properties: {
                title: 'Sheet1',
              },
            },
          ],
        },
      });

      if (headers && headers.length > 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: result.data.spreadsheetId,
          range: 'Sheet1!A1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }

      return { success: true, spreadsheet: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async appendToSheet({ spreadsheetId, range, values }) {
    try {
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      return { success: true, result: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async readSheet({ spreadsheetId, range }) {
    try {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return { success: true, values: result.data.values };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Tasks Tools
   */
  async listTasks({ maxResults = 10 }) {
    try {
      const taskLists = await this.tasks.tasklists.list();
      const defaultList = taskLists.data.items[0].id;

      const result = await this.tasks.tasks.list({
        tasklist: defaultList,
        maxResults,
      });

      return { success: true, tasks: result.data.items };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createTask({ title, notes, due }) {
    try {
      const taskLists = await this.tasks.tasklists.list();
      const defaultList = taskLists.data.items[0].id;

      const task = {
        title,
        notes,
        due,
      };

      const result = await this.tasks.tasks.insert({
        tasklist: defaultList,
        requestBody: task,
      });

      return { success: true, task: result.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get available tools
   */
  getTools() {
    return {
      gmail: [
        'sendEmail',
        'searchEmails',
        'getUnreadEmails',
      ],
      calendar: [
        'listEvents',
        'createEvent',
      ],
      drive: [
        'listFiles',
        'uploadFile',
        'searchDrive',
      ],
      docs: [
        'createDoc',
        'getDoc',
      ],
      sheets: [
        'createSheet',
        'appendToSheet',
        'readSheet',
      ],
      tasks: [
        'listTasks',
        'createTask',
      ],
    };
  }
}

export default GoogleWorkspaceMCP;
