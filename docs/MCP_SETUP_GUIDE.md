# 🚀 MCP Setup Guide - دليل إعداد MCP الشامل

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إعداد واستخدام جميع MCP Servers المتاحة في المشروع.

---

## 🎯 المتطلبات الأساسية

### Node.js & npm
```bash
node --version  # v18.0.0 أو أحدث
npm --version   # v9.0.0 أو أحدث
```

### Python (اختياري - للـ Python SDK)
```bash
python --version  # Python 3.8 أو أحدث
```

---

## 📦 التثبيت

### 1. تثبيت Dependencies الأساسية

```bash
# في المجلد الرئيسي للمشروع
npm install
```

### 2. تثبيت Dependencies لكل MCP Server

```bash
# Google Workspace
cd mcp-servers/google-workspace
npm install

# Notion
cd ../notion
npm install

# Airtable
cd ../airtable
npm install

# Telegram
cd ../telegram
npm install

# WhatsApp
cd ../whatsapp
npm install

# Twitter/X
cd ../twitter
npm install

# Reddit
cd ../reddit
npm install

# Filesystem
cd ../filesystem
npm install

# العودة للمجلد الرئيسي
cd ../..
```

### 3. تثبيت Python SDK (اختياري)

```bash
cd python
pip install -r requirements.txt
cd ..
```

---

## ⚙️ الإعداد

### 1. إنشاء ملف .env

```bash
cp .env.example .env
```

### 2. إعداد API Keys

افتح ملف `.env` وأضف المفاتيح التالية:

#### 🔑 Anthropic API Key
```env
ANTHROPIC_API_KEY=sk-ant-...
```
احصل عليه من: https://console.anthropic.com/

#### 🔑 Google Workspace
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

**خطوات الحصول على Google Credentials:**

1. اذهب إلى: https://console.cloud.google.com/
2. أنشئ مشروع جديد
3. فعّل APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Tasks API
4. أنشئ OAuth 2.0 credentials
5. احصل على refresh token

#### 🔑 Notion
```env
NOTION_API_KEY=secret_...
```
احصل عليه من: https://www.notion.so/my-integrations

**خطوات:**
1. اذهب للرابط أعلاه
2. اضغط "+ New integration"
3. اختر workspace
4. انسخ "Internal Integration Token"

#### 🔑 Airtable
```env
AIRTABLE_API_KEY=key...
AIRTABLE_BASE_ID=app...
```
احصل عليه من: https://airtable.com/account

**خطوات:**
1. اذهب للرابط أعلاه
2. انسخ API key من "API" section
3. احصل على Base ID من URL الخاص بـ base

#### 🔑 Telegram
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
```

**خطوات:**
1. ابحث عن @BotFather في Telegram
2. أرسل `/newbot`
3. اتبع التعليمات
4. انسخ token المُعطى

#### 🔑 WhatsApp Business
```env
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
```
احصل عليه من: https://developers.facebook.com/

**خطوات:**
1. أنشئ Facebook App
2. أضف WhatsApp product
3. احصل على Phone Number ID و Access Token

#### 🔑 Twitter/X
```env
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...
```
احصل عليه من: https://developer.twitter.com/

**خطوات:**
1. أنشئ Developer account
2. أنشئ App
3. احصل على API keys و tokens

#### 🔑 Reddit
```env
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USERNAME=...
REDDIT_PASSWORD=...
```
احصل عليه من: https://www.reddit.com/prefs/apps

**خطوات:**
1. اذهب للرابط أعلاه
2. اضغط "create another app"
3. اختر "script"
4. انسخ client ID و secret

---

## 🚀 التشغيل

### تشغيل جميع MCP Servers معاً

```bash
node mcp-servers/start-all.js
```

هذا سيشغل جميع الخوادم على البورتات التالية:
- Google Workspace: http://localhost:3001
- Notion: http://localhost:3002
- Airtable: http://localhost:3003
- Telegram: http://localhost:3004
- WhatsApp: http://localhost:3005
- Twitter/X: http://localhost:3006
- Reddit: http://localhost:3007
- Filesystem: http://localhost:3008

### تشغيل سيرفر واحد

```bash
# مثال: Google Workspace فقط
node mcp-servers/google-workspace/server.js

# أو Notion
node mcp-servers/notion/server.js
```

---

## 🧪 الاختبار

### اختبار Health Check

```bash
# اختبر Google Workspace
curl http://localhost:3001/health

# اختبر Notion
curl http://localhost:3002/health
```

### اختبار الأدوات المتاحة

```bash
# عرض أدوات Google Workspace
curl http://localhost:3001/tools

# عرض أدوات Telegram
curl http://localhost:3004/tools
```

### اختبار تنفيذ أداة

```bash
# مثال: إرسال رسالة Telegram
curl -X POST http://localhost:3004/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sendMessage",
    "params": {
      "chatId": "YOUR_CHAT_ID",
      "text": "Hello from MCP!"
    }
  }'
```

---

## 💻 استخدام الأدوات

### من Node.js

```javascript
import { AIAgent } from './src/index.js';

const agent = new AIAgent();
await agent.initialize();

// إضافة MCP servers
await agent.addMCPServer({
  name: 'google-workspace',
  url: 'http://localhost:3001',
  type: 'url'
});

await agent.addMCPServer({
  name: 'telegram',
  url: 'http://localhost:3004',
  type: 'url'
});

// استخدام Agent
const response = await agent.processMessage(
  'Check my Gmail and send a summary to Telegram'
);

console.log(response.response);
```

### من Python

```python
from anthropic_skills import AnthropicSkills

# Initialize
claude = AnthropicSkills()

# Add skills
claude.add_skill({
    'name': 'google-workspace',
    'type': 'url',
    'url': 'http://localhost:3001'
})

claude.add_skill({
    'name': 'telegram',
    'type': 'url',
    'url': 'http://localhost:3004'
})

# Use
response = claude.chat("Check my emails and notify me on Telegram")
print(response)
```

---

## 📚 أمثلة متقدمة

### مثال 1: Email to Notion Automation

```javascript
const response = await agent.processMessage(`
  1. Check my Gmail for unread emails from the last 24 hours
  2. Create a summary in Notion with:
     - Sender
     - Subject
     - Priority (High/Medium/Low)
     - Action required
`);
```

### مثال 2: Social Media Cross-posting

```javascript
const response = await agent.processMessage(`
  Post this content to Twitter and Reddit:

  "🚀 Just launched a new AI automation tool!
  Check it out at [link]"

  - Twitter: as a single tweet
  - Reddit: to r/programming with appropriate formatting
`);
```

### مثال 3: Daily Briefing

```javascript
const response = await agent.processMessage(`
  Create my daily briefing:
  1. Unread Gmail count and important emails
  2. Today's calendar events
  3. Pending tasks from Notion
  4. Trending topics from my Twitter feed

  Send the summary to my Telegram
`);
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: "Server not responding"

**الحل:**
```bash
# تأكد من تشغيل السيرفر
ps aux | grep node

# أعد التشغيل
node mcp-servers/start-all.js
```

### المشكلة: "Authentication failed"

**الحل:**
1. تحقق من صحة API keys في `.env`
2. تأكد من عدم انتهاء صلاحية tokens
3. راجع permissions في كل خدمة

### المشكلة: "Port already in use"

**الحل:**
```bash
# ابحث عن العملية
lsof -i :3001

# أوقف العملية
kill -9 [PID]

# أو غيّر البورت في .env
GOOGLE_WORKSPACE_MCP_PORT=3101
```

### المشكلة: "Module not found"

**الحل:**
```bash
# أعد تثبيت dependencies
cd mcp-servers/[server-name]
npm install
```

---

## 🔐 الأمان

### Best Practices

1. **لا تشارك .env file أبداً**
2. **استخدم .gitignore للملفات الحساسة**
3. **جدد tokens بانتظام**
4. **استخدم environment-specific configs**

### Recommended .gitignore

```
.env
.env.local
*.log
node_modules/
```

---

## 📊 المراقبة

### Log Files

جميع السيرفرات تكتب logs في console. لحفظها:

```bash
# تشغيل مع حفظ logs
node mcp-servers/start-all.js > mcp-servers.log 2>&1 &
```

### Health Monitoring

```bash
# مراقبة صحة جميع السيرفرات
for port in 3001 3002 3003 3004 3005 3006 3007 3008; do
  echo "Checking port $port:"
  curl -s http://localhost:$port/health | jq
  echo ""
done
```

---

## 🎓 الخطوات التالية

1. ✅ راجع [Prompt Library](../prompts/library.md)
2. ✅ اطلع على [Examples](../examples/)
3. ✅ ابدأ التجربة مع الأدوات
4. ✅ أنشئ workflows مخصصة

---

## 🆘 الدعم

إذا واجهت مشاكل:

1. راجع [Troubleshooting](#-استكشاف-الأخطاء)
2. تحقق من [GitHub Issues](https://github.com/mhdessouky-creator/claude-code/issues)
3. راجع [Documentation](../docs/)

---

## 📖 موارد إضافية

- [MCP Protocol](https://modelcontextprotocol.io)
- [Anthropic Documentation](https://docs.anthropic.com)
- [Google APIs](https://developers.google.com)
- [Notion API](https://developers.notion.com)

---

**🎉 مبروك! أنت الآن جاهز لاستخدام جميع MCP Servers!**
