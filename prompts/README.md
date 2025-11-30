# 📚 Prompt Templates Library

مكتبة شاملة من قوالب Prompts لجميع integrations مع دعم Python و Node.js

## 📦 المحتويات

- **prompt-templates.json** - 28 قالب جاهز للاستخدام
- **template_loader.py** - Python loader مع أمثلة
- **template-loader.js** - Node.js loader مع أمثلة
- **library.md** - مكتبة prompts نصية

## 🎯 الميزات

✅ **28 قالباً جاهزاً** عبر 8 integrations
✅ **تقدير التوكنات** لكل قالب
✅ **نصائح توفير التوكنات** لكل حالة استخدام
✅ **أمثلة كود Python و Node.js** لكل قالب
✅ **استبدال تلقائي للمتغيرات** (placeholders)
✅ **أمثلة إدخال وإخراج** لكل قالب

## 🚀 الاستخدام السريع

### Python

```python
from prompts.template_loader import PromptTemplateLoader

# تهيئة
loader = PromptTemplateLoader()

# تطبيق قالب
rendered = loader.render_prompt(
    'gw_send_email_draft',
    to='client@example.com',
    subject='متابعة الاجتماع',
    body='شكراً للاجتماع اليوم...',
    cc='manager@company.com'
)

print(rendered['user'])  # الـ prompt جاهز للإرسال

# أو تنفيذ مباشر
response = loader.execute_template(
    'gw_send_email_draft',
    to='client@example.com',
    subject='متابعة',
    body='شكراً للاجتماع',
    cc=''
)
```

### Node.js

```javascript
import PromptTemplateLoader from './prompts/template-loader.js';
import { AIAgent } from './src/index.js';

// تهيئة
const loader = new PromptTemplateLoader();
await loader.loadTemplates();

// تطبيق قالب
const rendered = loader.renderPrompt('notion_create_page', {
  database: 'المشاريع',
  title: 'تطبيق الموبايل',
  status: 'قيد التنفيذ',
  priority: 'عالية',
  content: '## الأهداف\n- تطوير UI'
});

console.log(rendered.user);

// أو تنفيذ مباشر مع Agent
const agent = new AIAgent();
await agent.initialize();

const response = await loader.executeTemplate(
  'notion_create_page',
  agent,
  {
    database: 'المشاريع',
    title: 'مشروع جديد',
    status: 'قيد التنفيذ',
    priority: 'عالية',
    content: 'محتوى المشروع'
  }
);
```

## 📋 القوالب المتاحة

### Google Workspace (4 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `gw_create_calendar_event` | إنشاء حدث تقويم | ~250 |
| `gw_send_email_draft` | إرسال بريد Gmail | ~200 |
| `gw_summarize_drive_doc` | تلخيص مستند Drive | ~800 |
| `gw_search_emails` | البحث وتصنيف Gmail | ~300 |

### Notion (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `notion_create_page` | إنشاء صفحة Notion | ~220 |
| `notion_update_property` | تحديث خاصية | ~150 |
| `notion_query_database` | استعلام قاعدة بيانات | ~400 |

### Airtable (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `airtable_search_records` | البحث عن سجلات | ~300 |
| `airtable_update_record` | تحديث سجل | ~180 |
| `airtable_create_record` | إنشاء سجل جديد | ~200 |

### Telegram (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `telegram_send_message` | إرسال رسالة | ~150 |
| `telegram_send_media` | إرسال وسائط | ~170 |
| `telegram_handle_inbound` | معالجة رسالة واردة | ~250 |

### WhatsApp (2 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `whatsapp_send_message` | إرسال رسالة | ~140 |
| `whatsapp_send_template` | إرسال قالب معتمد | ~180 |

### Twitter/X (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `twitter_fetch_tweets` | جلب تغريدات | ~350 |
| `twitter_create_thread` | إنشاء thread | ~450 |
| `twitter_sentiment_analysis` | تحليل المشاعر | ~600 |

### Reddit (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `reddit_fetch_thread` | جلب تعليقات thread | ~500 |
| `reddit_summarize_subreddit` | تلخيص subreddit | ~550 |
| `reddit_post_content` | نشر محتوى | ~220 |

### Filesystem (3 قوالب)

| ID | الوصف | تقدير التوكن |
|----|-------|-------------|
| `filesystem_read_summary` | قراءة وتلخيص ملف | ~400 |
| `filesystem_write_template` | كتابة من template | ~280 |
| `filesystem_extract_metadata` | استخراج metadata | ~350 |

## 💡 نصائح توفير التوكنات

كل قالب يتضمن نصائح محددة لتقليل استهلاك التوكنات:

### عامة
- حدد حد أقصى للنتائج (limit)
- استخدم ملخصات بدلاً من نصوص كاملة
- استخدم placeholders للبيانات الكبيرة
- اطلب bullet points بدلاً من فقرات

### خاصة بكل Integration
كل قالب له نصائح محددة في حقل `token_saving_tips`

## 🔧 API Reference

### Python

#### `PromptTemplateLoader`

**Methods:**

```python
# تحميل القوالب (يتم تلقائياً عند التهيئة)
loader = PromptTemplateLoader(templates_path='prompts/prompt-templates.json')

# الحصول على قالب
template = loader.get_template('template_id')

# عرض القوالب
all_templates = loader.list_templates()
gw_templates = loader.list_templates('google-workspace')

# تطبيق قالب
rendered = loader.render_prompt('template_id', var1='value1', var2='value2')

# تنفيذ مباشر
response = loader.execute_template(
    'template_id',
    api_key='...',
    model='claude-sonnet-4-5',
    max_tokens=4096,
    var1='value1'
)

# الحصول على تقدير التوكنات
estimate = loader.get_token_estimate('template_id')

# الحصول على نصائح
tips = loader.get_tips('template_id')
```

### Node.js

#### `PromptTemplateLoader`

**Methods:**

```javascript
// تهيئة وتحميل
const loader = new PromptTemplateLoader('prompts/prompt-templates.json');
await loader.loadTemplates();

// الحصول على قالب
const template = loader.getTemplate('template_id');

// عرض القوالب
const allTemplates = loader.listTemplates();
const gwTemplates = loader.listTemplates('google-workspace');

// تطبيق قالب
const rendered = loader.renderPrompt('template_id', {
  var1: 'value1',
  var2: 'value2'
});

// تنفيذ مباشر
const response = await loader.executeTemplate(
  'template_id',
  agent,
  { var1: 'value1', var2: 'value2' }
);

// الحصول على تقدير التوكنات
const estimate = loader.getTokenEstimate('template_id');

// الحصول على نصائح
const tips = loader.getTips('template_id');

// عرض معلومات قالب
loader.showTemplateInfo('template_id');
```

## 📖 أمثلة متقدمة

### مثال 1: Workflow متعدد الخطوات

```python
loader = PromptTemplateLoader()

# 1. البحث في Gmail
emails = loader.execute_template(
    'gw_search_emails',
    query='project X',
    days=7,
    criteria='الأولوية والموعد النهائي'
)

# 2. إنشاء صفحة في Notion
notion_page = loader.execute_template(
    'notion_create_page',
    database='Email Summaries',
    title='ملخص رسائل مشروع X',
    status='مراجعة',
    priority='عالية',
    content=emails
)

# 3. إرسال إشعار Telegram
loader.execute_template(
    'telegram_send_message',
    chat_id='123456789',
    text=f'تم إنشاء ملخص: {notion_page}',
    format='Markdown'
)
```

### مثال 2: معالجة batch

```javascript
const loader = new PromptTemplateLoader();
await loader.loadTemplates();

const tasks = [
  { title: 'مهمة 1', status: 'قيد التنفيذ', priority: 'عالية' },
  { title: 'مهمة 2', status: 'قيد التنفيذ', priority: 'متوسطة' },
  { title: 'مهمة 3', status: 'قيد التنفيذ', priority: 'منخفضة' }
];

// إنشاء صفحات Notion لكل مهمة
for (const task of tasks) {
  await loader.executeTemplate('notion_create_page', agent, {
    database: 'المهام',
    ...task,
    content: `## التفاصيل\n- الحالة: ${task.status}`
  });
}
```

## 🎓 Best Practices

### 1. التحقق من التوكنات
```python
# تحقق قبل التنفيذ
estimate = loader.get_token_estimate('template_id')
if estimate > 1000:
    print(f"تحذير: القالب يستهلك ~{estimate} توكن")
    tips = loader.get_tips('template_id')
    print("نصائح لتقليل التوكنات:", tips)
```

### 2. إعادة استخدام القوالب
```javascript
// حفظ القوالب المطبقة للاستخدام المتكرر
const emailTemplate = loader.renderPrompt('gw_send_email_draft', {
  subject: 'تحديث أسبوعي',
  cc: 'manager@company.com'
});

// استخدم نفس القالب مع محتوى مختلف
await agent.processMessage(
  emailTemplate.user.replace('{{to}}', 'team@company.com')
                     .replace('{{body}}', 'محتوى الأسبوع 1')
);
```

### 3. Error Handling
```python
try:
    response = loader.execute_template(
        'notion_create_page',
        database='المشاريع',
        title='مشروع جديد'
    )
except ValueError as e:
    print(f"خطأ: {e}")
except Exception as e:
    print(f"فشل التنفيذ: {e}")
```

## 🔐 الأمان

- لا تضع API keys في الكود
- استخدم environment variables
- لا تشارك ملفات تحتوي على بيانات حساسة
- راجع `notes` في كل قالب للتحذيرات الأمنية

## 📊 إحصائيات

- **إجمالي القوالب**: 28
- **Integrations**: 8
- **متوسط التوكنات**: ~300 توكن/قالب
- **أقل قالب**: 140 توكن (whatsapp_send_message)
- **أكبر قالب**: 800 توكن (gw_summarize_drive_doc)

## 🆕 إضافة قوالب جديدة

لإضافة قالب جديد، أضف entry في `prompt-templates.json`:

```json
{
  "id": "new_template_id",
  "integration": "integration-name",
  "intent": "وصف الاستخدام",
  "system_message": "رسالة النظام",
  "user_message": "قالب بـ {{placeholders}}",
  "assistant_instructions": "تعليمات للنموذج",
  "example_input": {},
  "example_output": {},
  "token_estimate": 200,
  "python_wrapper": "...",
  "node_wrapper": "...",
  "token_saving_tips": [],
  "notes": "ملاحظات"
}
```

## 📚 موارد إضافية

- [MCP Setup Guide](../docs/MCP_SETUP_GUIDE.md)
- [Prompt Library](library.md)
- [Python SDK](../python/README.md)

---

**🎉 استمتع بالإنتاجية العالية مع القوالب الجاهزة!**
