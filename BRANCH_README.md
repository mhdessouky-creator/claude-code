# Branch: claude/skills 🎯

## الغرض من هذا الـ Branch

هذا الـ branch يحتوي على **المهارات والأمثلة** للوكيل الذكي.

## المحتويات

### python/
مهارات Python:
- `anthropic_skills.py` - مهارات Anthropic Claude
- `README.md` - دليل المهارات

### examples/
أمثلة تطبيقية:

#### Web Development
- `web-development/simple-todo-app.js` - تطبيق Todo بسيط

#### Automation
- `automation/git-automation.js` - أتمتة Git

#### Data Processing
- `data-processing/data-analyzer.py` - محلل البيانات

#### Fantasy Football
- `fantasy-football-example.js` - مثال Fantasy Football

## البنية

```
python/
├── anthropic_skills.py
└── README.md

examples/
├── web-development/
│   └── simple-todo-app.js
├── automation/
│   └── git-automation.js
├── data-processing/
│   └── data-analyzer.py
└── fantasy-football-example.js
```

## كيفية الاستخدام

### Anthropic Skills

```python
from python.anthropic_skills import AnthropicSkill

skill = AnthropicSkill(api_key="your-api-key")
result = skill.process("Hello, Claude!")
print(result)
```

### Examples

#### Todo App
```bash
node examples/web-development/simple-todo-app.js
```

#### Git Automation
```bash
node examples/automation/git-automation.js
```

#### Data Analyzer
```bash
python examples/data-processing/data-analyzer.py
```

#### Fantasy Football
```bash
node examples/fantasy-football-example.js
```

## المميزات

### Anthropic Skills
- 🤖 تكامل مباشر مع Claude API
- 💬 معالجة نصوص متقدمة
- 🧠 تحليل ذكي للبيانات
- 📝 توليد محتوى

### Examples
- ✅ Todo App - إدارة المهام البسيطة
- 🔄 Git Automation - أتمتة عمليات Git
- 📊 Data Analyzer - تحليل البيانات
- 🏈 Fantasy Football - تحليل ومتابعة الفرق

## الإضافة والتطوير

### إضافة مهارة جديدة
1. أنشئ ملف في `python/`
2. اتبع نمط `anthropic_skills.py`
3. وثق المهارة في `python/README.md`

### إضافة مثال جديد
1. أنشئ مجلد في `examples/`
2. أضف الكود والتوثيق
3. أضف README للمثال

## الـ Branches الأخرى

- `claude/agent-setup` - إعدادات الوكيل
- `claude/documentation` - التوثيق الكامل
- `claude/mcp` - MCP servers
- `claude/tools` - الأدوات المساعدة
- `claude/integrations` - التكاملات

---

**ملاحظة:** هذا الـ branch يحتوي فقط على المهارات والأمثلة. للكود الرئيسي، راجع الـ branch الأساسي.
