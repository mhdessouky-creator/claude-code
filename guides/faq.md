# الأسئلة الشائعة - FAQ

<div dir="rtl">

## ❓ أسئلة عامة

### ما هو Claude Code؟
Claude Code هو أداة سطر أوامر تفاعلية من Anthropic تساعدك في مهام البرمجة باستخدام الذكاء الاصطناعي. يمكنه كتابة الكود، مراجعته، إصلاح الأخطاء، وأكثر من ذلك بكثير.

### هل Claude Code مجاني؟
يتطلب Claude Code اشتراك في خدمة Claude API من Anthropic. راجع [الموقع الرسمي](https://www.anthropic.com) للتفاصيل.

### ما اللغات البرمجية المدعومة؟
Claude Code يدعم جميع اللغات البرمجية الشائعة:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- والمزيد!

## 🔧 الاستخدام

### كيف أبدأ جلسة Claude Code؟
```bash
# طريقة 1: جلسة تفاعلية
claude

# طريقة 2: أمر مباشر
claude "طلبك هنا"
```

### هل يمكن لClaude قراءة ملفاتي؟
نعم! Claude يمكنه قراءة وتحليل الملفات في مشروعك. فقط اطلب منه ذلك:
```bash
claude "اقرأ ملف app.js واشرح ماذا يفعل"
```

### هل يمكن لClaude تعديل الملفات؟
نعم! يمكنه:
- تعديل ملفات موجودة
- إنشاء ملفات جديدة
- حذف أجزاء من الكود
- إعادة تنظيم الكود

### كيف أحفظ التغييرات؟
Claude يحفظ التغييرات تلقائياً. لكن يجب عليك عمل commit:
```bash
claude "أنشئ commit للتغييرات الأخيرة"
```

## 💻 البرمجة

### هل يمكن لClaude كتابة مشروع كامل؟
نعم! لكن من الأفضل تقسيم المشروع لمراحل:
```bash
claude "أنشئ مشروع Express.js كامل مع:
1. بنية المشروع
2. نظام المصادقة
3. API endpoints
4. قاعدة بيانات MongoDB"
```

### هل الكود الذي يكتبه Claude آمن؟
Claude يحاول كتابة كود آمن، لكن يجب عليك دائماً:
- مراجعة الكود
- اختباره جيداً
- طلب من Claude مراجعة الأمان

### كيف أختبر الكود؟
```bash
# طلب كتابة الاختبارات
claude "اكتب unit tests لملف utils.js"

# تشغيل الاختبارات
claude "شغل الاختبارات وأصلح أي أخطاء"
```

## 🐛 حل المشاكل

### Claude لا يفهم طلبي، ماذا أفعل؟
- كن أكثر تحديداً
- قدم أمثلة
- اشرح السياق
- قسم الطلب لأجزاء أصغر

### الكود لا يعمل!
```bash
# اطلب من Claude إصلاحه
claude "الكود لا يعمل، هذا الخطأ الذي أحصل عليه:
[نسخ رسالة الخطأ هنا]
أصلح المشكلة"
```

### كيف أتراجع عن التغييرات؟
```bash
# إذا كنت تستخدم Git
git checkout -- filename

# أو اطلب من Claude
claude "تراجع عن آخر تغيير في file.js"
```

## 🚀 نصائح وحيل

### أفضل طريقة للحصول على نتائج جيدة؟
1. كن واضحاً ومحدداً
2. قدم السياق الكافي
3. قسم المهام الكبيرة
4. راجع النتائج
5. اطلب التحسينات

### هل يمكن استخدام Claude للتعلم؟
بالتأكيد! استخدمه لـ:
- شرح مفاهيم برمجية
- مقارنة حلول مختلفة
- الحصول على أمثلة عملية
- فهم كود معقد

### كيف أستخدم Claude مع Git؟
```bash
# إنشاء commits
claude "أنشئ commit برسالة واضحة"

# إدارة branches
claude "أنشئ branch جديد باسم feature/new-api"

# مراجعة PRs
claude "راجع التغييرات في PR #42"
```

## 📚 موارد إضافية

### أين أجد مزيد من الأمثلة؟
- مجلد [examples](../examples/) في هذا المستودع
- [التوثيق الرسمي](https://github.com/anthropics/claude-code)
- [دليل أفضل الممارسات](./best-practices.md)

### كيف أبلغ عن مشكلة؟
افتح issue في [المستودع الرسمي](https://github.com/anthropics/claude-code/issues)

### هل هناك مجتمع لمستخدمي Claude Code؟
نعم! يمكنك:
- الانضمام للمناقشات على GitHub
- متابعة Anthropic على Twitter
- المشاركة في المنتديات التقنية

</div>

---

# Frequently Asked Questions

## ❓ General Questions

### What is Claude Code?
Claude Code is an interactive CLI tool from Anthropic that helps with programming tasks using AI. It can write code, review it, fix bugs, and much more.

### Is Claude Code free?
Claude Code requires a subscription to Claude API from Anthropic.

### Which programming languages are supported?
Claude Code supports all popular programming languages including JavaScript, Python, Java, C/C++, Go, Rust, PHP, Ruby, and more!

## 🔧 Usage

### How do I start a Claude Code session?
```bash
# Method 1: Interactive session
claude

# Method 2: Direct command
claude "your request here"
```

### Can Claude read my files?
Yes! Just ask:
```bash
claude "Read app.js and explain what it does"
```

### Can Claude modify files?
Yes! It can:
- Edit existing files
- Create new files
- Delete code sections
- Reorganize code

## 💻 Programming

### Can Claude write a complete project?
Yes! But it's better to divide the project into phases.

### Is the code Claude writes secure?
Claude tries to write secure code, but you should always:
- Review the code
- Test it thoroughly
- Ask Claude to review security

### How do I test the code?
```bash
# Request test writing
claude "Write unit tests for utils.js"

# Run tests
claude "Run tests and fix any errors"
```

## 🐛 Troubleshooting

### Claude doesn't understand my request, what do I do?
- Be more specific
- Provide examples
- Explain context
- Break request into smaller parts

### The code doesn't work!
```bash
claude "The code doesn't work, this is the error I get:
[paste error message here]
Fix the problem"
```

## 🚀 Tips & Tricks

### Best way to get good results?
1. Be clear and specific
2. Provide sufficient context
3. Divide large tasks
4. Review results
5. Ask for improvements

### Can I use Claude for learning?
Absolutely! Use it to:
- Explain programming concepts
- Compare different solutions
- Get practical examples
- Understand complex code

---

**Have more questions?** Open an issue in the repository!
