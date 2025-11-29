#!/usr/bin/env node
/**
 * Prompt Template Loader for Node.js
 * تحميل واستخدام قوالب Prompts بسهولة
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * محمّل قوالب Prompts مع دعم الاستبدال التلقائي
 */
export class PromptTemplateLoader {
  constructor(templatesPath = 'prompts/prompt-templates.json') {
    this.templatesPath = templatesPath;
    this.templates = null;
    this.agent = null;
  }

  /**
   * تحميل القوالب من الملف
   */
  async loadTemplates() {
    const data = await fs.readFile(this.templatesPath, 'utf-8');
    const parsed = JSON.parse(data);
    this.templates = {};

    for (const template of parsed.templates) {
      this.templates[template.id] = template;
    }

    return this.templates;
  }

  /**
   * الحصول على قالب بواسطة ID
   */
  getTemplate(templateId) {
    if (!this.templates) {
      throw new Error('Templates not loaded. Call loadTemplates() first.');
    }
    return this.templates[templateId] || null;
  }

  /**
   * عرض جميع القوالب أو القوالب الخاصة بـ integration معين
   */
  listTemplates(integration = null) {
    if (!this.templates) {
      throw new Error('Templates not loaded. Call loadTemplates() first.');
    }

    const allTemplates = Object.values(this.templates);

    if (integration) {
      return allTemplates.filter(t => t.integration === integration);
    }

    return allTemplates;
  }

  /**
   * تطبيق القالب مع استبدال المتغيرات
   */
  renderPrompt(templateId, variables = {}) {
    const template = this.getTemplate(templateId);

    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    let systemMessage = template.system_message;
    let userMessage = template.user_message;

    // استبدال placeholders
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      userMessage = userMessage.replaceAll(placeholder, String(value));
    }

    return {
      system: systemMessage,
      user: userMessage,
      template_id: templateId,
      integration: template.integration
    };
  }

  /**
   * تنفيذ قالب مباشرة مع Agent
   */
  async executeTemplate(templateId, agent, variables = {}) {
    const template = this.getTemplate(templateId);

    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    // إضافة الـ MCP server المطلوب
    const integration = template.integration;
    const serverUrl = this.getSkillUrl(integration);

    await agent.addMCPServer({
      name: integration,
      url: serverUrl,
      type: 'url'
    });

    // تطبيق القالب
    const rendered = this.renderPrompt(templateId, variables);

    // تنفيذ
    const response = await agent.processMessage(rendered.user);

    return response;
  }

  /**
   * الحصول على URL الخاص بـ integration
   */
  getSkillUrl(integration) {
    const urls = {
      'google-workspace': 'http://localhost:3001',
      'notion': 'http://localhost:3002',
      'airtable': 'http://localhost:3003',
      'telegram': 'http://localhost:3004',
      'whatsapp': 'http://localhost:3005',
      'twitter': 'http://localhost:3006',
      'reddit': 'http://localhost:3007',
      'filesystem': 'http://localhost:3008'
    };

    return urls[integration] || 'http://localhost:3001';
  }

  /**
   * الحصول على تقدير التوكنات للقالب
   */
  getTokenEstimate(templateId) {
    const template = this.getTemplate(templateId);
    return template ? template.token_estimate || 0 : 0;
  }

  /**
   * الحصول على نصائح توفير التوكنات
   */
  getTips(templateId) {
    const template = this.getTemplate(templateId);
    return template ? template.token_saving_tips || [] : [];
  }

  /**
   * عرض معلومات القالب
   */
  showTemplateInfo(templateId) {
    const template = this.getTemplate(templateId);

    if (!template) {
      console.log(`❌ Template '${templateId}' not found`);
      return;
    }

    console.log(`\n📋 Template: ${template.id}`);
    console.log(`🔷 Integration: ${template.integration}`);
    console.log(`📝 Intent: ${template.intent}`);
    console.log(`💡 Token Estimate: ~${template.token_estimate} tokens`);
    console.log(`\n🎯 Token Saving Tips:`);
    template.token_saving_tips.forEach(tip => {
      console.log(`  • ${tip}`);
    });

    if (template.notes) {
      console.log(`\n⚠️  Notes: ${template.notes}`);
    }
  }
}

// أمثلة للاستخدام
async function examples() {
  const loader = new PromptTemplateLoader();
  await loader.loadTemplates();

  // مثال 1: عرض جميع قوالب Google Workspace
  console.log('📧 Google Workspace Templates:');
  const gwTemplates = loader.listTemplates('google-workspace');
  gwTemplates.forEach(t => {
    console.log(`  - ${t.id}: ${t.intent}`);
  });

  console.log('\n' + '='.repeat(50) + '\n');

  // مثال 2: تطبيق قالب
  const rendered = loader.renderPrompt('gw_create_calendar_event', {
    title: 'اجتماع الفريق',
    date: '2025-12-01',
    time: '14:00',
    duration: '60min',
    attendees: 'team@company.com',
    description: 'مراجعة Q1'
  });

  console.log('📋 Rendered Prompt:');
  console.log(`System: ${rendered.system}`);
  console.log(`User: ${rendered.user}`);

  console.log('\n' + '='.repeat(50) + '\n');

  // مثال 3: معلومات القالب
  loader.showTemplateInfo('notion_create_page');

  console.log('\n' + '='.repeat(50) + '\n');

  // مثال 4: قائمة جميع الـ integrations
  const integrations = [...new Set(
    loader.listTemplates().map(t => t.integration)
  )];

  console.log('🔌 Available Integrations:');
  integrations.forEach(i => {
    const count = loader.listTemplates(i).length;
    console.log(`  • ${i}: ${count} templates`);
  });
}

// تشغيل الأمثلة إذا تم تنفيذ الملف مباشرة
if (import.meta.url === `file://${process.argv[1]}`) {
  examples().catch(console.error);
}

export default PromptTemplateLoader;
