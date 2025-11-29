# 🔧 Troubleshooting Guide - دليل حل المشاكل

## 📧 مشكلة: رسائل "operation CLI failed"

### السبب:
Scripts تحاول الاتصال بـ MCP servers غير شغالة

### الحل:

#### ✅ الحل الصحيح:

**لا تشغل السكريبتات إلا لو محتاجها فعلاً!**

1. **للاستخدام العادي (Git, Development):**
   - لا تحتاج أي MCP servers
   - اشتغل عادي بدون Replit

2. **لاستخدام Google Drive Upload:**
   ```bash
   # Terminal 1: شغّل MCP Server أولاً
   node mcp-servers/google-workspace/server.js

   # Terminal 2: بعدين شغّل Upload
   python scripts/upload-to-drive.py
   ```

3. **لاستخدام أي Integration:**
   - شغّل الـ MCP server المطلوب فقط
   - مش لازم تشغل كلهم!

---

## ⚙️ المشاكل الشائعة:

### 1. "Connection refused" أو "MCP Server not running"

**السبب:** الـ server المطلوب مش شغال

**الحل:**
```bash
# شغّل السيرفر المطلوب فقط:
node mcp-servers/google-workspace/server.js   # للـ Google
node mcp-servers/notion/server.js              # للـ Notion
node mcp-servers/telegram/server.js            # للـ Telegram
# إلخ...
```

### 2. "Module not found" في Python

**الحل:**
```bash
cd python
pip install -r requirements.txt
```

### 3. "Cannot find module" في Node.js

**الحل:**
```bash
npm install
cd mcp-servers/google-workspace
npm install
```

### 4. "Authentication failed" في Google APIs

**الحل:**
1. تأكد من `.env` محدث:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   ```

2. احصل على credentials من: https://console.cloud.google.com/

3. فعّل APIs المطلوبة:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - Google Docs API
   - Google Sheets API

---

## 🎯 Best Practices لتجنب المشاكل:

### ✅ افعل:

1. **شغّل MCP servers عند الحاجة فقط**
2. **تأكد من الـ .env قبل استخدام APIs**
3. **استخدم `git status` قبل الـ commit**
4. **اقرأ رسائل الأخطاء بعناية**

### ❌ لا تفعل:

1. **لا تشغل كل الـ MCP servers مع بعض** (إلا لو محتاجهم)
2. **لا تحط API keys في الكود** (استخدم .env)
3. **لا تشارك .env file** مع أي حد
4. **لا تستخدم scripts بدون قراءة التعليمات**

---

## 🆘 حل سريع للمشاكل:

### مشكلة عامة:

```bash
# 1. تحقق من Git
git status

# 2. لو فيه تغييرات، commit
git add .
git commit -m "your message"
git push

# 3. لو مش محتاج MCP، متشغلوش!

# 4. لو محتاج MCP:
#    أ. شغّل السيرفر المطلوب فقط
#    ب. تأكد من .env
#    ج. جرب السكريبت
```

---

## 📊 متى تشغل كل MCP Server:

| Server | متى تشغله |
|--------|-----------|
| Google Workspace | لما تحتاج Gmail/Drive/Calendar |
| Notion | لما تحتاج Notion operations |
| Telegram | لما تحتاج Telegram bot |
| Twitter | لما تحتاج Twitter posts |
| Reddit | لما تحتاج Reddit operations |
| Airtable | لما تحتاج Airtable data |
| WhatsApp | لما تحتاج WhatsApp messages |
| Filesystem | لما تحتاج file operations |

**💡 القاعدة الذهبية:** شغّل بس اللي محتاجه!

---

## 🔍 Debug Mode:

لو عايز تفهم إيه اللي بيحصل:

### Python:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
# ثم شغّل السكريبت
```

### Node.js:
```bash
DEBUG=* node your-script.js
```

---

## 📞 الدعم:

إذا المشكلة استمرت:

1. ✅ تأكد من قراءة هذا الدليل كاملاً
2. ✅ راجع [MCP Setup Guide](MCP_SETUP_GUIDE.md)
3. ✅ افتح issue على GitHub مع:
   - وصف المشكلة
   - رسالة الخطأ كاملة
   - الخطوات اللي عملتها
   - environment info (OS, Node version, إلخ)

---

**💪 بالتوفيق!**
