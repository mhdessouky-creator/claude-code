# 📱 دليل تشغيل الوكيل الذكي على Termux

<div dir="rtl">

## 🎯 نظرة عامة

هذا الدليل يشرح كيفية تثبيت وتشغيل **Digital Life AI Agent** على Termux (Android).

## ⚙️ التثبيت الأولي

### الخطوة 1: تثبيت المتطلبات الأساسية

```bash
# تحديث الحزم
pkg update && pkg upgrade

# تثبيت Node.js و Git
pkg install nodejs git

# تثبيت Python (اختياري - للوكيل Python)
pkg install python

# السماح بالوصول إلى التخزين (اختياري)
termux-setup-storage
```

### الخطوة 2: استنساخ المشروع

```bash
# استنساخ المشروع
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# منح صلاحيات التنفيذ للسكريبتات
chmod +x start-agent.sh
chmod +x termux-recovery.sh
```

### الخطوة 3: تثبيت المتطلبات

```bash
# تثبيت متطلبات Node.js
npm install

# تثبيت متطلبات Python (إذا كنت تريد استخدام الوكيل Python)
pip install -r requirements.txt
```

### الخطوة 4: إعداد البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env

# تعديل الإعدادات
nano .env
```

**أضف المفاتيح التالية في `.env`:**

```bash
# Anthropic API Key (مطلوب)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# اسم الوكيل (اختياري)
AGENT_NAME=MyAssistant

# النموذج (اختياري)
AGENT_MODEL=claude-3-5-sonnet-20241022
```

**للحصول على API Key:**
1. سجل في [Anthropic Console](https://console.anthropic.com)
2. اذهب إلى API Keys
3. أنشئ مفتاح جديد
4. الصقه في `.env`

### الخطوة 5: حفظ الملف

في محرر nano:
- اضغط `Ctrl + X` للخروج
- اضغط `Y` للحفظ
- اضغط `Enter` للتأكيد

## 🚀 تشغيل الوكيل

### الطريقة 1: السكريبت التفاعلي (موصى به)

```bash
./start-agent.sh
```

السكريبت سيعرض لك قائمة تفاعلية:
- اختيار بين Node.js أو Python Agent
- تثبيت المتطلبات تلقائياً
- إعداد ملف البيئة
- اختيار وضع التشغيل (محادثة، مهمة واحدة، إلخ)

### الطريقة 2: تشغيل مباشر - Node.js Agent

```bash
# وضع المحادثة التفاعلي
node src/cli.js chat

# تنفيذ مهمة واحدة
node src/cli.js task "نظم الملفات في Downloads"

# عرض الحالة
node src/cli.js status
```

### الطريقة 3: تشغيل مباشر - Python Agent

```bash
python main.py
```

## 💡 أمثلة الاستخدام

### مثال 1: وضع المحادثة

```bash
./start-agent.sh
# اختر: 1 (Node.js Agent)
# اختر: 1 (وضع المحادثة)

You: مرحباً! ما الذي يمكنك مساعدتي به؟
Agent: أهلاً! يمكنني مساعدتك في إدارة الملفات، البريد الإلكتروني...

You: نظم الملفات في مجلد Downloads
Agent: سأقوم بتنظيم الملفات حسب النوع...
```

### مثال 2: مهمة سريعة

```bash
node src/cli.js task "ابحث عن أحدث أخبار الذكاء الاصطناعي"
```

### مثال 3: Python Agent

```bash
python main.py
# ستظهر قائمة تفاعلية:
# 1. محادثة مع الوكيل
# 2. إدارة المهام
# 3. عرض الإعدادات
# 4. خروج
```

## 🔧 حل المشاكل الشائعة

### 🚑 أداة الإصلاح التلقائي (Recovery Tool)

**استخدم السكريبت التلقائي لإصلاح المشاكل:**
```bash
./termux-recovery.sh
```

هذه الأداة تقوم بـ:
- ✅ تشخيص المشاكل تلقائياً
- ✅ إصلاح الأخطاء الشائعة
- ✅ التحقق من المتطلبات
- ✅ تثبيت الحزم المفقودة
- ✅ إعداد البيئة

**الاستخدام السريع:**
```bash
# التشخيص فقط
./termux-recovery.sh --diagnose

# الإصلاح التلقائي
./termux-recovery.sh --fix

# عرض معلومات النظام
./termux-recovery.sh --info
```

### المشكلة 1: `bash: ./start-agent.sh: Permission denied`

**الحل:**
```bash
chmod +x start-agent.sh termux-recovery.sh
./start-agent.sh
```

### المشكلة 2: `No command y found`

هذا خطأ شائع عندما تكتب `y` بدون أمر. في Termux، الصق النص كاملاً أو اكتب الأوامر يدوياً.

**الحل:**
- اكتب الأمر كاملاً بدلاً من محاولة إكمال أمر سابق
- أو اضغط Enter لإكمال الأمر الحالي أولاً

### المشكلة 3: `ANTHROPIC_API_KEY is required`

**الحل:**
```bash
# تحقق من وجود .env
ls -la .env

# إذا لم يكن موجوداً
cp .env.example .env

# عدّل الملف وأضف API key
nano .env
```

### المشكلة 4: `node: command not found`

**الحل:**
```bash
pkg install nodejs
```

### المشكلة 5: `python: command not found`

**الحل:**
```bash
pkg install python
```

### المشكلة 6: مشاكل في تثبيت الحزم

**الحل:**
```bash
# تحديث مصادر الحزم
pkg update

# اختيار مرآة أخرى إذا كانت المرآة الحالية بطيئة
termux-change-repo

# محاولة التثبيت مجدداً
npm install
```

### المشكلة 7: `sqlite3` فشل التثبيت

**الحل:**
```bash
# تثبيت أدوات البناء المطلوبة
pkg install build-essential

# إعادة محاولة التثبيت
npm install
```

## 📁 هيكل المشروع

```
claude-code/
├── start-agent.sh        ← السكريبت الرئيسي للتشغيل في Termux
├── main.py              ← وكيل Python
├── src/
│   ├── cli.js           ← واجهة Node.js
│   ├── index.js         ← نقطة البداية Node.js
│   └── ...
├── .env                 ← إعدادات البيئة (أنشئه من .env.example)
├── .env.example         ← مثال إعدادات البيئة
├── package.json         ← متطلبات Node.js
└── requirements.txt     ← متطلبات Python
```

## ⚡ نصائح للأداء في Termux

### 1. استخدام Wake Lock

لمنع Termux من التوقف في الخلفية:

```bash
# في جلسة Termux منفصلة
termux-wake-lock
```

### 2. استخدام tmux للجلسات المستمرة

```bash
# تثبيت tmux
pkg install tmux

# بدء جلسة جديدة
tmux new -s agent

# تشغيل الوكيل
./start-agent.sh

# الانفصال عن الجلسة: Ctrl+B ثم D
# العودة للجلسة: tmux attach -t agent
```

### 3. تشغيل في الخلفية

```bash
# تشغيل في الخلفية
nohup ./start-agent.sh > agent.log 2>&1 &

# عرض السجلات
tail -f agent.log

# إيقاف العملية
pkill -f "start-agent.sh"
```

## 🔒 أمان البيانات

- ✅ جميع البيانات مخزنة محلياً على جهازك
- ✅ `.env` يحتوي على المفاتيح الحساسة - لا تشاركه
- ⚠️ لا تدفع `.env` إلى Git (موجود في `.gitignore`)
- ⚠️ استخدم اتصال إنترنت آمن عند استخدام API

## 📚 موارد إضافية

- 📖 [الدليل الشامل](./AGENT_GUIDE.md)
- 📖 [README الرئيسي](./README.md)
- 🌐 [Termux Wiki](https://wiki.termux.com)
- 🤖 [Anthropic Documentation](https://docs.anthropic.com)

## 💬 الدعم

إذا واجهت مشاكل:

1. **تحقق من السجلات:**
   ```bash
   cat logs/agent.log
   ```

2. **اختبر الاتصال بالإنترنت:**
   ```bash
   ping -c 4 google.com
   ```

3. **تحقق من الإعدادات:**
   ```bash
   node src/cli.js status
   ```

4. **افتح Issue على GitHub:**
   [https://github.com/mhdessouky-creator/claude-code/issues](https://github.com/mhdessouky-creator/claude-code/issues)

## 🎉 نصائح استخدام

### للمبتدئين

1. ابدأ بوضع المحادثة التفاعلي لفهم قدرات الوكيل
2. جرب مهام بسيطة أولاً مثل "نظم الملفات"
3. اقرأ الدليل الشامل [AGENT_GUIDE.md](./AGENT_GUIDE.md)

### للمتقدمين

1. خصص الوكيل عبر تعديل `.env`
2. أضف وحدات جديدة في `src/modules/`
3. استخدم Python Agent للمهام المعقدة
4. اجدول مهام متكررة

## 🔄 التحديثات

للحصول على آخر التحديثات:

```bash
cd claude-code
git pull origin main
npm install
pip install -r requirements.txt
```

---

**صُنع بـ ❤️ لمجتمع Termux**

</div>

---

# 📱 Running AI Agent on Termux - English Guide

## 🚀 Quick Start

```bash
# 1. Install requirements
pkg update && pkg upgrade
pkg install nodejs git

# 2. Clone project
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code

# 3. Setup
chmod +x start-agent.sh
npm install
cp .env.example .env
nano .env  # Add your ANTHROPIC_API_KEY

# 4. Run
./start-agent.sh
```

## 📖 Full Documentation

See the Arabic section above for detailed instructions.

## ⚡ Quick Commands

```bash
# Interactive menu
./start-agent.sh

# Direct run - Node.js
node src/cli.js chat

# Direct run - Python
python main.py
```

## 🐛 Common Issues

1. **Permission denied**: `chmod +x start-agent.sh`
2. **Node not found**: `pkg install nodejs`
3. **Python not found**: `pkg install python`
4. **Missing API key**: Edit `.env` and add `ANTHROPIC_API_KEY`

## 💬 Support

Open an issue: https://github.com/mhdessouky-creator/claude-code/issues

---

**Made with ❤️ for the Termux community**
