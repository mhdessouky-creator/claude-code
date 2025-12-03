# 📧 دليل إعداد Gmail Integration - Gmail Setup Guide

## 🌟 نظرة عامة - Overview

هذا الدليل يشرح كيفية إعداد وكيل Gmail الذكي الذي يمكنه قراءة وكتابة الرسائل باستخدام الذكاء الاصطناعي.

This guide explains how to set up the intelligent Gmail agent that can read and write emails using AI.

---

## 📋 المتطلبات - Prerequisites

### 1. Python Dependencies
قم بتثبيت المكتبات المطلوبة:
```bash
pip install -r requirements.txt
```

أو قم بتثبيتها يدوياً:
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
pip install groq ollama pydantic colorama python-dotenv
```

### 2. Google Cloud Project
تحتاج إلى مشروع Google Cloud وتمكين Gmail API.

---

## 🔧 خطوات الإعداد - Setup Steps

### الخطوة 1: إنشاء مشروع Google Cloud

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروعاً جديداً أو اختر مشروعاً موجوداً
3. قم بتمكين Gmail API:
   - اذهب إلى **APIs & Services** > **Library**
   - ابحث عن "Gmail API"
   - انقر على **Enable**

**English:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Gmail API:
   - Navigate to **APIs & Services** > **Library**
   - Search for "Gmail API"
   - Click **Enable**

### الخطوة 2: إنشاء OAuth 2.0 Credentials

1. اذهب إلى **APIs & Services** > **Credentials**
2. انقر على **Create Credentials** > **OAuth client ID**
3. إذا لم تكن قد أنشأت OAuth consent screen:
   - انقر على **Configure Consent Screen**
   - اختر **External** (أو Internal إذا كنت تستخدم Google Workspace)
   - املأ المعلومات المطلوبة:
     - App name: "AI Gmail Agent"
     - User support email: بريدك الإلكتروني
     - Developer contact: بريدك الإلكتروني
   - انقر **Save and Continue**
   - في صفحة Scopes، انقر **Add or Remove Scopes** وأضف:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.compose`
   - احفظ واستمر
4. عد إلى **Credentials** وأنشئ OAuth client ID:
   - Application type: **Desktop app**
   - Name: "Gmail Agent Desktop"
   - انقر **Create**
5. قم بتنزيل ملف JSON (انقر على أيقونة التنزيل)
6. أعد تسمية الملف إلى `credentials.json` وضعه في المجلد الرئيسي للمشروع

**English:**
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If you haven't created OAuth consent screen:
   - Click **Configure Consent Screen**
   - Choose **External** (or Internal if using Google Workspace)
   - Fill required information:
     - App name: "AI Gmail Agent"
     - User support email: your email
     - Developer contact: your email
   - Click **Save and Continue**
   - On Scopes page, click **Add or Remove Scopes** and add:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.compose`
   - Save and continue
4. Return to **Credentials** and create OAuth client ID:
   - Application type: **Desktop app**
   - Name: "Gmail Agent Desktop"
   - Click **Create**
5. Download the JSON file (click download icon)
6. Rename the file to `credentials.json` and place it in the project root directory

### الخطوة 3: إعداد ملف البيئة

أنشئ ملف `.env` في المجلد الرئيسي:

```bash
# AI Provider Settings
GROQ_API_KEY=your_groq_api_key_here
AI_PROVIDER=groq
GROQ_MODEL=mixtral-8x7b-32768

# Gmail Settings
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.pickle
```

**ملاحظة:** احصل على Groq API key من [console.groq.com](https://console.groq.com)

**English Note:** Get Groq API key from [console.groq.com](https://console.groq.com)

---

## 🚀 الاستخدام - Usage

### تشغيل البرنامج - Run the Program

```bash
python main.py
```

ثم اختر الخيار `3` من القائمة الرئيسية لإدارة Gmail.

Then select option `3` from the main menu for Gmail management.

### المصادقة الأولى - First-Time Authentication

عند تشغيل وضع Gmail لأول مرة:
1. سيفتح متصفحك تلقائياً
2. سجل الدخول بحساب Google الخاص بك
3. اسمح للتطبيق بالوصول إلى Gmail
4. سيتم حفظ التوكن في `token.pickle` للاستخدام المستقبلي

**English:**
When running Gmail mode for the first time:
1. Your browser will open automatically
2. Sign in with your Google account
3. Allow the app to access Gmail
4. The token will be saved in `token.pickle` for future use

---

## 🎯 الميزات المتاحة - Available Features

### 1. 📧 قراءة الرسائل غير المقروءة - Read Unread Emails
- عرض الرسائل غير المقروءة
- تفاصيل كاملة لكل رسالة

### 2. 🔍 البحث في الرسائل - Search Emails
أمثلة على استعلامات البحث:
- `from:example@gmail.com` - من مرسل معين
- `subject:meeting` - بموضوع معين
- `is:unread` - غير مقروءة
- `has:attachment` - تحتوي على مرفقات
- `after:2024/01/01` - بعد تاريخ معين

**Search query examples:**
- `from:example@gmail.com` - from specific sender
- `subject:meeting` - with specific subject
- `is:unread` - unread messages
- `has:attachment` - has attachments
- `after:2024/01/01` - after specific date

### 3. ✍️ كتابة وإرسال رسالة بمساعدة AI - Compose Email with AI
الذكاء الاصطناعي سيساعدك في:
- صياغة رسالة احترافية
- اختيار النبرة المناسبة (رسمية، ودية، احترافية)
- تنظيم المحتوى بشكل جيد

**AI will help you:**
- Draft professional emails
- Choose appropriate tone (formal, friendly, professional)
- Organize content well

### 4. 📝 تلخيص الرسائل - Summarize Emails
- تلخيص رسالة واحدة
- تحليل مجموعة من الرسائل
- استخراج النقاط المهمة والإجراءات المطلوبة

### 5. 📊 الإحصائيات - Statistics
عرض معلومات عن:
- إجمالي الرسائل
- الرسائل غير المقروءة
- تصنيف الرسائل حسب الفئة

### 6. 🤖 الأوامر المخصصة - Custom Commands
أمثلة:
- "اقرأ آخر 5 رسائل من أحمد"
- "ابحث عن رسائل الاجتماعات"
- "لخص الرسائل المهمة"

**Examples:**
- "Read last 5 messages from Ahmed"
- "Search for meeting emails"
- "Summarize important messages"

### 7. 🧹 التنظيف الذكي - Smart Cleanup
- تحديد النشرات الإخبارية والبريد الترويجي
- اقتراحات لتنظيم البريد الوارد

---

## 🔐 الأمان والخصوصية - Security & Privacy

### حماية البيانات
- ✅ جميع البيانات مخزنة محلياً
- ✅ لا تُشارك بياناتك مع أي طرف ثالث
- ✅ التوكن مشفر ومحفوظ بشكل آمن
- ✅ يمكنك إلغاء الوصول في أي وقت من [Google Account Settings](https://myaccount.google.com/permissions)

### نصائح الأمان
- ⚠️ لا تشارك ملف `credentials.json` أو `token.pickle`
- ⚠️ أضف هذه الملفات إلى `.gitignore`
- ⚠️ استخدم مشروع Google Cloud منفصل للاختبار

**English:**
### Data Protection
- ✅ All data stored locally
- ✅ No data shared with third parties
- ✅ Token is encrypted and securely saved
- ✅ You can revoke access anytime from [Google Account Settings](https://myaccount.google.com/permissions)

### Security Tips
- ⚠️ Don't share `credentials.json` or `token.pickle` files
- ⚠️ Add these files to `.gitignore`
- ⚠️ Use separate Google Cloud project for testing

---

## 🐛 حل المشاكل الشائعة - Troubleshooting

### المشكلة 1: `credentials.json not found`
**الحل:**
- تأكد من وجود ملف `credentials.json` في المجلد الرئيسي
- تحقق من اسم الملف (يجب أن يكون بالضبط `credentials.json`)

### المشكلة 2: `Authentication failed`
**الحل:**
- احذف ملف `token.pickle` وحاول مرة أخرى
- تأكد من تمكين Gmail API في Google Cloud Console
- تحقق من Scopes الصحيحة في OAuth consent screen

### المشكلة 3: `Google API libraries not installed`
**الحل:**
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### المشكلة 4: `403 Forbidden Error`
**الحل:**
- تأكد من إضافة Scopes الصحيحة
- تحقق من تفعيل Gmail API
- احذف `token.pickle` وأعد المصادقة

### المشكلة 5: AI responses not working
**الحل:**
- تأكد من إضافة `GROQ_API_KEY` في `.env`
- تحقق من اتصالك بالإنترنت
- جرب نموذج AI مختلف

---

## 📖 أمثلة الاستخدام - Usage Examples

### مثال 1: قراءة الرسائل غير المقروءة
```
اختر خياراً: 3 (Gmail mode)
قائمة Gmail > اختر: 1 (قراءة غير المقروءة)
عدد الرسائل: 10
```

### مثال 2: إرسال رسالة شكر
```
قائمة Gmail > اختر: 3 (كتابة رسالة)
إلى: colleague@example.com
الموضوع: شكر على المساعدة
المحتوى: أريد شكر زميلي على مساعدته في المشروع
النبرة: friendly
```

### مثال 3: تلخيص الرسائل المهمة
```
قائمة Gmail > اختر: 4 (تلخيص)
اضغط Enter (لتلخيص آخر 5 رسائل غير مقروءة)
```

### مثال 4: البحث عن رسائل الاجتماعات
```
قائمة Gmail > اختر: 2 (بحث)
استعلام البحث: subject:meeting OR subject:اجتماع
```

---

## 🎓 نصائح متقدمة - Advanced Tips

### 1. استخدام الأوامر المخصصة
يمكنك استخدام اللغة الطبيعية:
- "أرسل رسالة شكر لمديري على الترقية"
- "لخص جميع الرسائل من العميل س"
- "أظهر الرسائل العاجلة"

### 2. تحسين النتائج
- استخدم استعلامات بحث محددة
- قم بتصنيف الرسائل بانتظام
- استخدم التنظيف الذكي دورياً

### 3. الأتمتة
يمكنك إضافة مهام مجدولة لـ:
- فحص الرسائل غير المقروءة يومياً
- تنظيف البريد الوارد أسبوعياً
- تلخيص الرسائل المهمة

---

## 📞 الدعم والمساعدة - Support

إذا واجهت أي مشاكل:
1. راجع قسم حل المشاكل أعلاه
2. تحقق من [Gmail API Documentation](https://developers.google.com/gmail/api)
3. افتح issue في المستودع

---

## 📄 الترخيص - License

MIT License - استخدم بحرية!

---

**صُنع بـ ❤️ للمجتمع - Made with ❤️ for the community**
