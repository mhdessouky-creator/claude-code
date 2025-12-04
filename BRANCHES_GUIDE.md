# 📚 دليل Branches المستودع

## نظرة عامة

تم تنظيم المستودع في branches متخصصة، كل واحد يحتوي على جزء محدد من المشروع. هذا يسهل التطوير والصيانة والفهم.

## 🌳 البنية التنظيمية

```
claude-code/
├── claude/fix-arabic-support       ← الـ branch الرئيسي (الكود الكامل)
├── claude/agent-setup              ← إعدادات وتعليمات الوكيل
├── claude/documentation            ← التوثيق والأدلة
├── claude/mcp                      ← MCP servers
├── claude/tools                    ← الأدوات المساعدة
├── claude/integrations             ← التكاملات
└── claude/skills                   ← المهارات والأمثلة
```

---

## 📋 الـ Branches المتاحة

### 1️⃣ claude/agent-setup 🚀
**إعدادات وتعليمات الوكيل الذكي**

**المحتويات:**
- `AGENT_GUIDE.md` - دليل شامل
- `TERMUX_GUIDE.md` - دليل Termux
- `.env.example` - مثال البيئة
- `start-agent.sh` - سكريبت البدء
- `config/` - الإعدادات
- `requirements.txt` - متطلبات Python
- `package.json` - متطلبات Node.js

**متى تستخدمه:**
- عند البدء في إعداد الوكيل لأول مرة
- لفهم كيفية تكوين البيئة
- للحصول على التعليمات خطوة بخطوة

**الأمر:**
```bash
git checkout claude/agent-setup-018KhLuAfdHGeTb1AztytU5d
```

---

### 2️⃣ claude/documentation 📚
**التوثيق الكامل للمشروع**

**المحتويات:**
- `README.md` - نظرة عامة
- `AGENT_GUIDE.md` - دليل الوكيل
- `TERMUX_GUIDE.md` - دليل Termux
- `docs/` - توثيق إضافي
  - `MCP_GUIDE.md`
  - `GMAIL_SETUP_GUIDE.md`
  - `FANTASY_FOOTBALL.md`
- `guides/` - أدلة متنوعة
  - `best-practices.md`
  - `faq.md`
  - `tools.md`

**متى تستخدمه:**
- للقراءة والتعلم عن المشروع
- للمساهمة في التوثيق
- لفهم المميزات المختلفة

**الأمر:**
```bash
git checkout claude/documentation-018KhLuAfdHGeTb1AztytU5d
```

---

### 3️⃣ claude/mcp 🔌
**MCP (Model Context Protocol) Servers**

**المحتويات:**
- `mcp-servers/` - جميع الـ servers
  - Google Workspace
  - Notion
  - Airtable
  - Telegram
  - WhatsApp
  - Twitter/X
  - Reddit
  - Filesystem
- `docs/MCP_GUIDE.md` - دليل MCP
- `docs/MCP_SETUP_GUIDE.md` - دليل الإعداد

**متى تستخدمه:**
- للعمل على MCP servers
- لإضافة server جديد
- لتطوير التكاملات مع الخدمات

**الأمر:**
```bash
git checkout claude/mcp-018KhLuAfdHGeTb1AztytU5d
```

---

### 4️⃣ claude/tools 🛠️
**الأدوات المساعدة والقوالب**

**المحتويات:**
- `utilities/` - أدوات JavaScript
  - `code-generator.js`
- `scripts/` - سكريبتات
  - `build.js`
  - `project-setup.sh`
- `templates/` - قوالب
  - `api-endpoint-template.js`
- `utils/` - أدوات Python
  - `arabic_helper.py`
- `prompts/` - قوالب Prompts

**متى تستخدمه:**
- لاستخدام الأدوات المساعدة
- لإضافة أداة جديدة
- للحصول على القوالب الجاهزة

**الأمر:**
```bash
git checkout claude/tools-018KhLuAfdHGeTb1AztytU5d
```

---

### 5️⃣ claude/integrations 🔗
**التكاملات مع الخدمات الخارجية**

**المحتويات:**
- `agents/gmail_agent.py` - وكيل Gmail
- `integrations/gmail_integration.py` - تكامل Gmail
- `src/modules/email.js` - وحدة البريد
- `src/modules/fantasy-football.js` - وحدة Fantasy Football
- `docs/GMAIL_SETUP_GUIDE.md` - دليل Gmail
- `docs/FANTASY_FOOTBALL.md` - دليل Fantasy Football

**متى تستخدمه:**
- للعمل على تكاملات Gmail
- لإضافة تكامل جديد
- لتطوير وحدات الخدمات

**الأمر:**
```bash
git checkout claude/integrations-018KhLuAfdHGeTb1AztytU5d
```

---

### 6️⃣ claude/skills 🎯
**المهارات والأمثلة التطبيقية**

**المحتويات:**
- `python/` - مهارات Python
  - `anthropic_skills.py`
- `examples/` - أمثلة
  - `web-development/` - تطوير الويب
  - `automation/` - الأتمتة
  - `data-processing/` - معالجة البيانات
  - `fantasy-football-example.js`

**متى تستخدمه:**
- للحصول على أمثلة جاهزة
- لإضافة مهارة جديدة
- للتعلم من الأمثلة

**الأمر:**
```bash
git checkout claude/skills-018KhLuAfdHGeTb1AztytU5d
```

---

## 🎯 سيناريوهات الاستخدام

### السيناريو 1: بداية جديدة
**أريد إعداد الوكيل لأول مرة**

```bash
# 1. انتقل لـ agent-setup
git checkout claude/agent-setup-018KhLuAfdHGeTb1AztytU5d

# 2. اقرأ التعليمات
cat AGENT_GUIDE.md

# 3. نفذ الإعداد
cp .env.example .env
# عدل .env بمفاتيحك

# 4. شغل الوكيل
./start-agent.sh
```

### السيناريو 2: تطوير MCP Server جديد
**أريد إضافة server لـ Discord**

```bash
# 1. انتقل لـ mcp branch
git checkout claude/mcp-018KhLuAfdHGeTb1AztytU5d

# 2. أنشئ المجلد
mkdir mcp-servers/discord
cd mcp-servers/discord

# 3. أنشئ الملفات
# (استخدم server-template.js كقالب)

# 4. اختبر وارفع
git add .
git commit -m "Add Discord MCP server"
git push
```

### السيناريو 3: كتابة مثال جديد
**أريد إضافة مثال لاستخدام database**

```bash
# 1. انتقل لـ skills branch
git checkout claude/skills-018KhLuAfdHGeTb1AztytU5d

# 2. أنشئ المجلد
mkdir -p examples/database
cd examples/database

# 3. أكتب الكود
# database-example.js

# 4. ارفع
git add .
git commit -m "Add database usage example"
git push
```

### السيناريو 4: تحديث التوثيق
**أريد تحسين الـ FAQ**

```bash
# 1. انتقل لـ documentation branch
git checkout claude/documentation-018KhLuAfdHGeTb1AztytU5d

# 2. عدل الملف
nano guides/faq.md

# 3. ارفع التحديث
git add guides/faq.md
git commit -m "Update FAQ with new questions"
git push
```

---

## 🔄 دمج التغييرات

عند الحاجة لدمج التغييرات من branch متخصص للـ main:

```bash
# 1. انتقل للـ main branch
git checkout claude/fix-arabic-support-018KhLuAfdHGeTb1AztytU5d

# 2. ادمج التغييرات
git merge claude/mcp-018KhLuAfdHGeTb1AztytU5d

# 3. حل التعارضات إن وجدت
# 4. ارفع
git push
```

---

## 📝 أفضل الممارسات

### ✅ افعل:
- استخدم الـ branch المناسب للمهمة
- اقرأ `BRANCH_README.md` في كل branch
- اختبر التغييرات قبل الرفع
- اكتب commit messages واضحة

### ❌ لا تفعل:
- لا تخلط الملفات بين الـ branches
- لا تحذف branches بدون إذن
- لا ترفع changes كبيرة دون مراجعة
- لا تنسى تحديث التوثيق

---

## 🆘 المساعدة

### عرض جميع الـ Branches:
```bash
git branch -a
```

### التبديل بين الـ Branches:
```bash
git checkout <branch-name>
```

### إنشاء branch جديد من الحالي:
```bash
git checkout -b new-feature-branch
```

### حذف branch محلي:
```bash
git branch -d <branch-name>
```

---

## 🔗 روابط مفيدة

- [GitHub Repository](https://github.com/mhdessouky-creator/claude-code)
- [Anthropic Console](https://console.anthropic.com)
- [Groq Console](https://console.groq.com)

---

**آخر تحديث:** 2025-12-04
**النسخة:** 1.0.0

تم إنشاء هذا التنظيم لتسهيل التطوير والصيانة. إذا كان لديك اقتراحات، افتح Issue في GitHub! 🚀
