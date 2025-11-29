#!/usr/bin/env node
/**
 * Upload Prompt Library to Google Drive
 * رفع مكتبة Prompts إلى Google Drive
 */

import { AIAgent } from '../src/index.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function uploadToDrive() {
  console.log('🚀 بدء رفع Prompt Library إلى Google Drive...\n');

  // تهيئة Agent
  const agent = new AIAgent();
  await agent.initialize();

  // إضافة Google Workspace MCP
  await agent.addMCPServer({
    name: 'google-workspace',
    url: 'http://localhost:3001',
    type: 'url'
  });

  // 1. إنشاء مجلد
  console.log('📁 إنشاء مجلد "Prompt Library" في Google Drive...\n');

  const createFolderResponse = await agent.processMessage(`
    أنشئ مجلد جديد في Google Drive اسمه "Prompt Library".

    إذا كان المجلد موجود بالفعل، أعطني الـ folder ID.
    إذا لم يكن موجود، أنشئه وأعطني الـ folder ID.
  `);

  console.log('✅ النتيجة:', createFolderResponse.response);

  // 2. رفع الملفات
  console.log('\n📤 رفع ملفات Prompt Library...\n');

  const uploadResponse = await agent.processMessage(`
    ارفع الملفات التالية إلى مجلد "Prompt Library" في Google Drive:

    الملفات من مجلد prompt-library/:
    1. README.md - دليل شامل للاستخدام
    2. prompt-templates.json - 28 قالب جاهز
    3. template_loader.py - Python loader
    4. template-loader.js - Node.js loader
    5. library.md - مكتبة نصية شاملة

    لكل ملف:
    - اقرأه من مجلد prompt-library/
    - ارفعه إلى مجلد "Prompt Library" في Drive
    - أعطني رابط المشاركة

    أرجع قائمة منظمة بالملفات المرفوعة مع روابطها.
  `);

  console.log('✅ الملفات المرفوعة:\n', uploadResponse.response);

  // 3. إنشاء ملف فهرس
  console.log('\n📋 إنشاء ملف فهرس...\n');

  const indexContent = `
# 📚 Prompt Library - مكتبة القوالب

## 📦 المحتويات

هذا المجلد يحتوي على مكتبة شاملة من قوالب Prompts لاستخدام Claude مع 8 integrations.

### الملفات:

1. **README.md** - دليل كامل (Python & Node.js)
2. **prompt-templates.json** - 28 قالباً بصيغة JSON
3. **template_loader.py** - Python loader
4. **template-loader.js** - Node.js loader
5. **library.md** - مكتبة نصية شاملة

### الـ Integrations:

- 🔷 Google Workspace
- 📝 Notion
- 📊 Airtable
- 💬 Telegram
- 📱 WhatsApp
- 🐦 Twitter/X
- 🔴 Reddit
- 📁 Filesystem

### الإحصائيات:

- 📚 28 قالباً
- 🎯 تقدير توكنات
- 💡 نصائح توفير
- 🐍 Python support
- 📜 Node.js support

---

**تاريخ الإنشاء:** ${new Date().toISOString().split('T')[0]}
**الإصدار:** 1.0.0
  `;

  const indexResponse = await agent.processMessage(`
    أنشئ Google Doc في مجلد "Prompt Library" باسم "INDEX - الفهرس".

    المحتوى:
    ${indexContent}

    استخدم formatting جميل مع headers و bullet points.
    أعطني رابط المستند.
  `);

  console.log('✅ ملف الفهرس:', indexResponse.response);

  console.log('\n🎉 تم رفع Prompt Library بنجاح إلى Google Drive! 🎉');
  console.log('\nيمكنك الوصول للمكتبة من Google Drive الآن.');

  await agent.shutdown();
  rl.close();
}

// Main
console.log('='.repeat(60));
console.log('📚 Prompt Library → Google Drive Uploader');
console.log('='.repeat(60));
console.log('\n⚠️  تأكد من تشغيل Google Workspace MCP Server على المنفذ 3001');
console.log('   يمكنك تشغيله بـ: node mcp-servers/google-workspace/server.js\n');

const answer = await question('اضغط Enter للمتابعة أو Ctrl+C للإلغاء...');

uploadToDrive()
  .catch(error => {
    console.error('\n❌ حدث خطأ:', error.message);
    console.log('\nتأكد من:');
    console.log('1. تشغيل Google Workspace MCP Server');
    console.log('2. إعداد Google API credentials في .env');
    console.log('3. منح الصلاحيات المناسبة');
    rl.close();
    process.exit(1);
  });
