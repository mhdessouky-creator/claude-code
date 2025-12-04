# Branch: claude/mcp 🔌

## الغرض من هذا الـ Branch

هذا الـ branch يحتوي على **MCP (Model Context Protocol) servers والتوثيق** للوكيل الذكي.

## المحتويات

### MCP Servers
مجلد `mcp-servers/` يحتوي على:

- **Google Workspace** - تكامل مع Gmail, Calendar, Drive
- **Notion** - تكامل مع Notion
- **Airtable** - تكامل مع Airtable
- **Telegram** - بوت Telegram
- **WhatsApp** - WhatsApp Business API
- **Twitter/X** - تكامل مع Twitter
- **Reddit** - تكامل مع Reddit
- **Filesystem** - عمليات الملفات المحلية

### التوثيق
- `docs/MCP_GUIDE.md` - دليل شامل لـ MCP
- `docs/MCP_SETUP_GUIDE.md` - دليل الإعداد خطوة بخطوة
- `mcp-servers/README.md` - نظرة عامة على الـ servers

## البنية

```
mcp-servers/
├── google-workspace/
│   ├── index.js
│   ├── server.js
│   └── package.json
├── notion/
├── airtable/
├── telegram/
├── whatsapp/
├── twitter/
├── reddit/
├── filesystem/
├── server-template.js
├── start-all.js
└── README.md

docs/
├── MCP_GUIDE.md
└── MCP_SETUP_GUIDE.md
```

## كيفية الاستخدام

### تثبيت المتطلبات
```bash
cd mcp-servers/<server-name>
npm install
```

### تشغيل server واحد
```bash
cd mcp-servers/google-workspace
node server.js
```

### تشغيل جميع الـ servers
```bash
cd mcp-servers
node start-all.js
```

## الإعداد

1. انسخ `.env.example` إلى `.env`
2. أضف API keys المطلوبة
3. شغل الـ server

راجع `docs/MCP_SETUP_GUIDE.md` للتفاصيل.

## الـ Branches الأخرى

- `claude/agent-setup` - إعدادات الوكيل
- `claude/documentation` - التوثيق الكامل
- `claude/tools` - الأدوات المساعدة
- `claude/integrations` - التكاملات
- `claude/skills` - المهارات والأمثلة

---

**ملاحظة:** هذا الـ branch يحتوي فقط على MCP servers. للكود الرئيسي، راجع الـ branch الأساسي.
