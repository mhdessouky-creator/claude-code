# 🤖 Claude Code - AI Agent

<div align="center">

**وكيل ذكاء اصطناعي متقدم يدعم Claude, Groq, و Ollama**  
**مع دعم كامل للغة العربية في Termux**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

</div>

---

<div dir="rtl">

## 🌟 نظرة عامة

**Claude Code** هو وكيل ذكاء اصطناعي شامل ومتطور يجمع بين قوة Claude من Anthropic، وسرعة Groq، ومرونة Ollama. مصمم خصيصاً ليكون قابلاً للتوسع وسهل الاستخدام في مختلف البيئات.

### ✨ المميزات الرئيسية

- 🤖 **دعم 3 مزودي AI** - Claude (Anthropic), Groq, Ollama
- 🌍 **دعم كامل للعربية** - عرض صحيح في Termux مع إصلاح الحروف
- 🔄 **تبديل سهل** - غير المزود من القائمة مباشرة
- 📋 **إدارة مهام** - نظام ذكي لترتيب وتنفيذ المهام
- 🧠 **ذاكرة محادثة** - يحتفظ بسياق الحوار
- 🎯 **بنية نظيفة** - core فقط في main branch

</div>

---

## 📚 البنية المنظمة

هذا المستودع منظم في **branches متخصصة** لسهولة التطوير والصيانة:

| Branch | الوصف | الرابط |
|--------|-------|--------|
| 🚀 **agent-setup** | إعدادات وتعليمات البدء | [انتقل →](../../tree/claude/agent-setup-018KhLuAfdHGeTb1AztytU5d) |
| 📚 **documentation** | التوثيق الكامل | [انتقل →](../../tree/claude/documentation-018KhLuAfdHGeTb1AztytU5d) |
| 🔌 **mcp** | MCP Servers | [انتقل →](../../tree/claude/mcp-018KhLuAfdHGeTb1AztytU5d) |
| 🛠️ **tools** | الأدوات المساعدة | [انتقل →](../../tree/claude/tools-018KhLuAfdHGeTb1AztytU5d) |
| 🔗 **integrations** | التكاملات (Gmail, etc.) | [انتقل →](../../tree/claude/integrations-018KhLuAfdHGeTb1AztytU5d) |
| 🎯 **skills** | المهارات والأمثلة | [انتقل →](../../tree/claude/skills-018KhLuAfdHGeTb1AztytU5d) |

**📖 دليل شامل:** [BRANCHES_GUIDE.md](./BRANCHES_GUIDE.md)

---

## 🚀 البدء السريع

### المتطلبات

- **Python 3.10+** أو **Node.js 18+**
- مفتاح API من أحد المزودين:
  - [Anthropic (Claude)](https://console.anthropic.com)
  - [Groq](https://console.groq.com)
  - Ollama (محلي، بدون مفتاح)

### التثبيت

<div dir="rtl">

#### 1. استنساخ المستودع
\`\`\`bash
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code
\`\`\`

#### 2. للحصول على تعليمات الإعداد الكاملة
\`\`\`bash
# انتقل لـ branch الإعداد
git checkout claude/agent-setup-018KhLuAfdHGeTb1AztytU5d

# اقرأ الدليل
cat AGENT_GUIDE.md  # دليل شامل
cat TERMUX_GUIDE.md # للاستخدام في Termux
\`\`\`

#### 3. التثبيت السريع

**Python:**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

**Node.js:**
\`\`\`bash
npm install
\`\`\`

</div>

---

## 🎯 الاستخدام

### Python Agent

\`\`\`bash
# تشغيل مباشر
python main.py
\`\`\`

**الميزات:**
- ✅ محادثة تفاعلية
- ✅ إدارة مهام
- ✅ تكامل Gmail
- ✅ اختيار المزود من القائمة

---

## 🏗️ بنية المشروع (Main Branch)

\`\`\`
claude-code/
├── agents/              # Core AI agents
│   ├── brain.py        # AI provider handler
│   ├── tasks_agent.py  # Task management
│   └── gmail_agent.py  # Gmail operations
├── config/              # Configuration
│   └── settings.py     # Settings
├── src/                 # Node.js implementation
│   └── core/           # Core functionality
├── tests/               # Tests
├── utils/               # Utilities
│   └── arabic_helper.py # Arabic support
├── main.py              # Entry point
└── README.md            # This file
\`\`\`

---

## 📖 التوثيق

- 🚀 [Setup Guide](../../tree/claude/agent-setup-018KhLuAfdHGeTb1AztytU5d)
- 📚 [Full Documentation](../../tree/claude/documentation-018KhLuAfdHGeTb1AztytU5d)
- 📋 [Branches Guide](./BRANCHES_GUIDE.md)
- 🔍 [Repository Analysis](./REPOSITORY_ANALYSIS.md)

---

## 🤝 المساهمة

نرحب بمساهماتك! اختر الـ branch المناسب من [BRANCHES_GUIDE.md](./BRANCHES_GUIDE.md)

---

## 📝 الرخصة

MIT License - استخدم بحرية!

---

<div align="center">

**صُنع بـ ❤️ للمجتمع العربي والعالمي**

[Report Bug](https://github.com/mhdessouky-creator/claude-code/issues) ·
[Request Feature](https://github.com/mhdessouky-creator/claude-code/issues) ·
[Documentation](../../tree/claude/documentation-018KhLuAfdHGeTb1AztytU5d)

</div>
