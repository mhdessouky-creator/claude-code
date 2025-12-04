# Branch: claude/tools 🛠️

## الغرض من هذا الـ Branch

هذا الـ branch يحتوي على **الأدوات المساعدة والقوالب** للوكيل الذكي.

## المحتويات

### utilities/
أدوات JavaScript مساعدة:
- `code-generator.js` - مولد الكود التلقائي

### scripts/
سكريبتات مساعدة:
- `build.js` - سكريبت البناء
- `project-setup.sh` - سكريبت إعداد المشروع

### templates/
قوالب جاهزة:
- `api-endpoint-template.js` - قالب API endpoint

### utils/
أدوات Python مساعدة:
- `arabic_helper.py` - مساعد عرض النص العربي في Termux

### prompts/
قوالب Prompts:
- `prompt-templates.json` - قوالب جاهزة
- `template_loader.py` - محمل القوالب Python
- `template-loader.js` - محمل القوالب JavaScript
- `library.md` - مكتبة الـ prompts

## البنية

```
utilities/
└── code-generator.js

scripts/
├── build.js
└── project-setup.sh

templates/
└── api-endpoint-template.js

utils/
└── arabic_helper.py

prompts/
├── prompt-templates.json
├── template_loader.py
├── template-loader.js
├── library.md
└── README.md
```

## كيفية الاستخدام

### استخدام Code Generator
```bash
node utilities/code-generator.js
```

### تشغيل Project Setup
```bash
chmod +x scripts/project-setup.sh
./scripts/project-setup.sh
```

### استخدام Arabic Helper
```python
from utils.arabic_helper import fix_arabic_text
text = fix_arabic_text("مرحبا بك")
print(text)
```

## الـ Branches الأخرى

- `claude/agent-setup` - إعدادات الوكيل
- `claude/documentation` - التوثيق الكامل
- `claude/mcp` - MCP servers
- `claude/integrations` - التكاملات
- `claude/skills` - المهارات والأمثلة

---

**ملاحظة:** هذا الـ branch يحتوي فقط على الأدوات المساعدة. للكود الرئيسي، راجع الـ branch الأساسي.
