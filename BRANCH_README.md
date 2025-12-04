# Branch: claude/integrations 🔗

## الغرض من هذا الـ Branch

هذا الـ branch يحتوي على **التكاملات مع خدمات خارجية** للوكيل الذكي.

## المحتويات

### Gmail Integration
- `agents/gmail_agent.py` - وكيل Gmail الذكي
- `integrations/gmail_integration.py` - تكامل Gmail API
- `docs/GMAIL_SETUP_GUIDE.md` - دليل إعداد Gmail

### Modules Integration (Node.js)
- `src/modules/email.js` - وحدة البريد الإلكتروني
- `src/modules/fantasy-football.js` - وحدة Fantasy Football
- `docs/FANTASY_FOOTBALL.md` - دليل Fantasy Football

## البنية

```
agents/
└── gmail_agent.py

integrations/
└── gmail_integration.py

src/modules/
├── email.js
└── fantasy-football.js

docs/
├── GMAIL_SETUP_GUIDE.md
└── FANTASY_FOOTBALL.md
```

## كيفية الاستخدام

### Gmail Integration

#### 1. الإعداد
```bash
# تثبيت المتطلبات
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

# تكوين OAuth
# راجع docs/GMAIL_SETUP_GUIDE.md للتفاصيل
```

#### 2. الاستخدام
```python
from agents.gmail_agent import GmailAgent

agent = GmailAgent(
    credentials_file='credentials.json',
    token_file='token.pickle'
)

# قراءة الرسائل
messages = agent.read_unread_emails(10)

# إرسال رسالة
agent.send_email(
    to='user@example.com',
    subject='Hello',
    body='Message body'
)
```

### Email Module (Node.js)
```javascript
const { sendEmail } = require('./src/modules/email');

await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'Message body'
});
```

## المميزات

### Gmail Agent
- ✉️ قراءة الرسائل غير المقروءة
- 🔍 البحث في الرسائل
- ✍️ كتابة وإرسال رسائل بمساعدة AI
- 📝 تلخيص الرسائل
- 📊 تحليل المشاعر
- 🧹 تنظيف ذكي للبريد

### Fantasy Football
- 📊 تحليل اللاعبين
- 🎯 توصيات الفريق
- 📈 تتبع الأداء

## الإعداد

راجع الأدلة التفصيلية:
- [GMAIL_SETUP_GUIDE.md](./docs/GMAIL_SETUP_GUIDE.md)
- [FANTASY_FOOTBALL.md](./docs/FANTASY_FOOTBALL.md)

## الـ Branches الأخرى

- `claude/agent-setup` - إعدادات الوكيل
- `claude/documentation` - التوثيق الكامل
- `claude/mcp` - MCP servers
- `claude/tools` - الأدوات المساعدة
- `claude/skills` - المهارات والأمثلة

---

**ملاحظة:** هذا الـ branch يحتوي فقط على ملفات التكاملات. للكود الرئيسي، راجع الـ branch الأساسي.
