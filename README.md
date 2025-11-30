# 🤖 Digital Life AI Agent - وكيل ذكاء اصطناعي لأتمتة حياتك الرقمية

<div dir="rtl">

## 📋 نظرة عامة

**Digital Life AI Agent** هو وكيل ذكاء اصطناعي متقدم مبني باستخدام Claude API من Anthropic. يقوم بأتمتة المهام الرقمية اليومية، ويتعلم من تفاعلاتك، ويساعدك في إدارة بريدك الإلكتروني، ملفاتك، وكل جوانب حياتك الرقمية.

## ✨ المميزات الرئيسية

- 🤖 **وكيل ذكي متكامل** يستخدم Claude 3.5 Sonnet
- 📧 **إدارة البريد الإلكتروني** تلقائياً (إرسال، تنظيم، تصفية)
- 📁 **تنظيم الملفات الذكي** حسب النوع والتاريخ
- 🌐 **البحث على الويب** وجمع المعلومات
- 💾 **ذاكرة دائمة** تحفظ السياق والتفضيلات
- ⏰ **جدولة المهام** المتكررة تلقائياً
- 🎯 **واجهة CLI تفاعلية** سهلة الاستخدام
- 🔒 **آمن وخاص** - جميع البيانات محلية

## 🚀 البدء السريع

### التثبيت والإعداد

```bash
# 1. استنساخ المشروع
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# 2. تثبيت المكتبات
npm install

# 3. إعداد البيئة
cp .env.example .env
# عدّل .env وأضف Anthropic API key

# 4. بناء المشروع
npm run build

# 5. تشغيل الوكيل
npm start
```

### الحصول على API Key

1. سجل في [Anthropic Console](https://console.anthropic.com)
2. أنشئ API key جديد
3. أضفه في ملف `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 💡 أمثلة الاستخدام

### الوضع التفاعلي

```bash
npm run cli chat
```

```
You: نظم ملفات Downloads حسب النوع
🤖 Agent: سأقوم بتنظيم الملفات...
✅ تم تنظيم 45 ملف

You: ابحث عن أحدث أخبار الذكاء الاصطناعي
🤖 Agent: إليك ملخص الأخبار...
```

### تنفيذ مهمة مباشرة

```bash
npm run cli task "اعمل نسخة احتياطية من مجلد Documents"
```

### جدولة مهام متكررة

```bash
# كل يوم الساعة 9 صباحاً
npm run cli schedule "تنظيف الملفات المؤقتة" "0 9 * * *"
```

## 📁 هيكل المشروع

```
digital-life-ai-agent/
├── src/
│   ├── core/          # النظام الأساسي
│   │   ├── agent.js   # الوكيل الرئيسي
│   │   ├── memory.js  # إدارة الذاكرة
│   │   └── executor.js # تنفيذ المهام
│   ├── modules/       # وحدات المهام
│   │   ├── email.js   # إدارة البريد
│   │   ├── files.js   # إدارة الملفات
│   │   └── web.js     # عمليات الويب
│   ├── utils/         # أدوات مساعدة
│   ├── cli.js         # واجهة CLI
│   └── index.js       # نقطة البداية
├── tests/             # الاختبارات
├── data/              # قاعدة البيانات
├── examples/          # أمثلة توضيحية
└── AGENT_GUIDE.md     # دليل المستخدم الشامل
```

## 🎯 حالات الاستخدام

### ✉️ إدارة البريد الإلكتروني
- إرسال رسائل تلقائية
- تنظيم الرسائل حسب الموضوع
- جدولة إرسال الرسائل

### 📂 إدارة الملفات
- تنظيم الملفات حسب النوع أو التاريخ
- البحث عن الملفات
- إنشاء نسخ احتياطية
- حذف الملفات القديمة

### 🌐 عمليات الويب
- البحث عن معلومات
- جمع البيانات من مواقع محددة
- مراقبة المواقع للتغييرات

### ⏰ الأتمتة
- جدولة مهام يومية/أسبوعية
- تنفيذ مهام متكررة
- إدارة العمليات الروتينية

## 🔧 الأوامر المتاحة

### الأوامر الأساسية

| الأمر | الوصف | مثال |
|-------|-------|------|
| `chat` | بدء محادثة تفاعلية | `npm run cli chat` |
| `task` | تنفيذ مهمة واحدة | `npm run cli task "نظم الملفات"` |
| `schedule` | جدولة مهمة متكررة | `npm run cli schedule "تنظيف" "0 9 * * *"` |
| `status` | عرض حالة الوكيل | `npm run cli status` |
| `clear` | مسح السجلات | `npm run cli clear` |

### أوامر MCP (Model Context Protocol)

| الأمر | الوصف | مثال |
|-------|-------|------|
| `mcp:add` | إضافة MCP server | `npm run cli mcp:add name url` |
| `mcp:remove` | حذف MCP server | `npm run cli mcp:remove name` |
| `mcp:list` | عرض الخوادم | `npm run cli mcp:list` |
| `mcp:discover` | اكتشاف الأدوات | `npm run cli mcp:discover` |

📖 [دليل MCP الكامل](./docs/MCP_GUIDE.md)

## 🔐 الأمان والخصوصية

- ✅ جميع البيانات مخزنة محلياً في جهازك
- ✅ لا تُرسل معلومات إلا لـ Claude API للمعالجة
- ✅ يمكن حذف جميع البيانات في أي وقت
- ⚠️ لا تشارك API key مع أحد
- ⚠️ استخدم App Passwords للبريد الإلكتروني

## 🛣️ خارطة الطريق

- [x] النظام الأساسي للوكيل
- [x] إدارة الذاكرة والسياق
- [x] وحدات المهام الأساسية
- [x] واجهة CLI تفاعلية
- [x] جدولة المهام
- [x] 🆕 دعم MCP (Model Context Protocol)
- [x] 🏈 وحدة تحليل Fantasy Football
- [ ] واجهة ويب
- [ ] تكامل مع Google Calendar
- [ ] دعم الأوامر الصوتية
- [ ] نظام Plugins للإضافات
- [ ] تحسين الذاكرة باستخدام Embeddings

## 📚 التوثيق الإضافي

- 📖 [دليل المستخدم الشامل](./AGENT_GUIDE.md)
- 🔌 [دليل MCP Integration](./docs/MCP_GUIDE.md)
- 🏈 [دليل Fantasy Football Module](./docs/FANTASY_FOOTBALL.md)
- 🔧 [أمثلة متقدمة](./examples/)
- 🎯 [دليل التطوير](./guides/)

## 🐛 حل المشاكل الشائعة

### المشكلة: فشل التثبيت
```bash
# الحل: استخدم Node.js 18+
node --version  # تحقق من الإصدار
```

### المشكلة: API Key غير صحيح
```bash
# الحل: تأكد من إضافة المفتاح في .env
echo $ANTHROPIC_API_KEY  # للتحقق
```

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# تشغيل Build
npm run build

# التحقق من حالة الوكيل
npm run cli status
```

## 🤝 المساهمة

نرحب بمساهماتك! يرجى:
1. Fork المستودع
2. إنشاء branch جديد للميزة
3. Commit التغييرات
4. Push إلى branch
5. فتح Pull Request

## 📝 الرخصة

MIT License - استخدم بحرية!

## 📧 التواصل

للأسئلة والاقتراحات، افتح issue في المستودع.

---

</div>

# 🤖 Claude Code - Comprehensive Guide

## 📋 Overview

A comprehensive repository containing examples, utilities, and best practices for using Claude Code - Anthropic's interactive CLI tool for software engineering tasks.

## ✨ Features

- 📚 Practical examples for various Claude Code use cases
- 🛠️ Ready-to-use utilities
- 📖 Bilingual documentation (Arabic & English)
- 🎯 Best practices and tips
- 🚀 Ready-made project templates

## 🎯 How to Benefit from Claude Code?

### 1. Programming & Development
- **Automated Code Writing**: Ask Claude to write functions, classes, or entire projects
- **Code Review**: Get analysis and improvements for existing code
- **Bug Fixing**: Quickly discover and fix programming errors
- **Refactoring**: Improve and restructure legacy code

### 2. Automation & Productivity
- **Script Creation**: Automate repetitive tasks
- **Git Management**: Create commits, pull requests, and manage branches
- **Testing**: Write and run unit tests automatically
- **Documentation**: Generate READMEs, comments, and API docs

### 3. Learning & Exploration
- **Code Understanding**: Explain complex code in simple terms
- **Learn New Technologies**: Get examples and explanations
- **Project Exploration**: Understand large project structures

## 📁 Repository Contents

```
claude-code/
├── examples/          # Practical examples
├── utilities/         # Helper utilities
├── templates/         # Ready-made templates
├── guides/            # Detailed guides
└── scripts/           # Useful scripts
```

## 🚀 Quick Start

### Installation
```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Or using yarn
yarn global add @anthropic-ai/claude-code
```

### Basic Usage
```bash
# Start Claude Code session
claude

# Run direct command
claude "Write me a function to calculate prime numbers"

# Work on specific file
claude "Review the code in src/app.js"
```

## 💡 Usage Examples

### Example 1: Create Web Project
```bash
claude "Create a simple React project with TypeScript"
```

### Example 2: Fix Errors
```bash
claude "Find errors in utils.js and fix them"
```

### Example 3: Write Tests
```bash
claude "Write unit tests for all functions in services/api.js"
```

### Example 4: Review Pull Request
```bash
claude "Review changes in PR #123 and give me feedback"
```

## 🎓 Best Practices

### 1. Be Clear and Specific
❌ Bad: "Make a website"
✅ Good: "Create a simple landing page using HTML/CSS with a contact form"

### 2. Use Context
```bash
# Read files first
claude "Read config.js then create a similar file for production"
```

### 3. Ask for Review
```bash
claude "Review the code you wrote and check for security and performance"
```

### 4. Use Git Smartly
```bash
claude "Create a commit with clear message for recent changes"
```

## 🛠️ Available Tools

Claude Code provides powerful tools:
- 📖 **Read**: Read files
- ✏️ **Edit**: Modify files
- 📝 **Write**: Create new files
- 🔍 **Grep**: Search in code
- 🌐 **WebSearch**: Search the web
- 💻 **Bash**: Execute terminal commands
- 🔧 **Task**: Execute complex tasks

## 📚 Additional Resources

- [Official Documentation](https://github.com/anthropics/claude-code)
- [Advanced Examples](./examples/)
- [Tools Guide](./guides/tools.md)
- [FAQ](./guides/faq.md)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a new feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

MIT License - Use freely!

## 📧 Contact

For questions and suggestions, open an issue in the repository.

---

**Made with ❤️ for the Claude Code community**
