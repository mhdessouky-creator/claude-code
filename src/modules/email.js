import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

/**
 * Email Module - Handles email-related tasks
 */
export class EmailModule {
  constructor(agent) {
    this.agent = agent;
    this.transporter = null;
    this._initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  _initializeTransporter() {
    const emailConfig = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    if (emailConfig.host && emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransporter(emailConfig);
      logger.info('Email transporter initialized');
    } else {
      logger.warn('Email configuration incomplete - email features disabled');
    }
  }

  /**
   * Execute email task
   */
  async execute(task) {
    const action = this._determineAction(task.description);

    switch (action) {
      case 'send':
        return await this._sendEmail(task);
      case 'schedule':
        return await this._scheduleEmail(task);
      default:
        return {
          success: false,
          message: 'Email action not recognized',
        };
    }
  }

  /**
   * Determine email action from task description
   */
  _determineAction(description) {
    if (description.match(/send|compose|write/i)) return 'send';
    if (description.match(/schedule/i)) return 'schedule';
    return 'unknown';
  }

  /**
   * Send an email
   */
  async _sendEmail(task) {
    if (!this.transporter) {
      return {
        success: false,
        message: 'Email not configured',
      };
    }

    try {
      // Extract email details from task description
      // In a real implementation, you'd parse the description more intelligently
      const emailDetails = await this._parseEmailDetails(task.description);

      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailDetails.to,
        subject: emailDetails.subject,
        text: emailDetails.body,
        html: emailDetails.html,
      });

      logger.info(`Email sent: ${info.messageId}`);

      return {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Parse email details from task description
   * This is a placeholder - in production, use AI to extract details
   */
  async _parseEmailDetails(description) {
    // Use the agent to parse email details
    const prompt = `Extract email details from this request: "${description}"

Return a JSON object with:
- to: recipient email
- subject: email subject
- body: email body text

If any field is not specified, use sensible defaults.`;

    const response = await this.agent.processMessage(prompt, {
      additionalContext: 'You are parsing an email task. Return only valid JSON.',
    });

    try {
      // Extract JSON from response
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.error('Failed to parse email details:', error);
    }

    // Fallback
    return {
      to: 'user@example.com',
      subject: 'Message from AI Agent',
      body: description,
    };
  }

  /**
   * Schedule an email for later
   */
  async _scheduleEmail(task) {
    // This would integrate with the task scheduler
    return {
      success: true,
      message: 'Email scheduled (not implemented yet)',
    };
  }
}
