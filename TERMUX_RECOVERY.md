# 🔄 دليل استعادة Termux - Termux Recovery Guide

<div dir="rtl">

## 📋 نظرة عامة

هذا الدليل مصمم لمساعدتك في استعادة إعداد **Digital Life AI Agent** على Termux بعد حدوث مشاكل أو تثبيتات خاطئة (مثل code-server).

---

## 🚨 المشكلة

إذا قمت بتشغيل أوامر غير مقصودة مثل:
```bash
curl https://code-server.dev/install.sh | sh
```

فقد يؤدي ذلك إلى:
- تثبيت برامج غير مرغوبة (code-server)
- تعديل ملفات البيئة (.bashrc, .profile)
- تضارب مع إعداد claude-code الأصلي
- استهلاك موارد النظام

---

## ✅ الحل السريع (3 خطوات)

### **الطريقة 1: استخدام سكريبتات الاستعادة الجاهزة**

```bash
# 1. انتقل لمجلد المشروع
cd ~/claude-code

# 2. شغل سكريبت التنظيف (يزيل code-server)
chmod +x termux-cleanup.sh
./termux-cleanup.sh

# 3. شغل سكريبت الاستعادة (يرجع الإعداد الأصلي)
chmod +x termux-recovery.sh
./termux-recovery.sh
```

**انتهى!** السكريبتات ستعمل كل شيء أوتوماتيكياً.

---

## 🔧 الحل التفصيلي (يدوي)

إذا لم تعمل السكريبتات أو تريد فهم كل خطوة:

### **الخطوة 1: تنظيف code-server**

```bash
# إيقاف code-server إذا كان يعمل
pkill -9 code-server

# حذف الملفات التنفيذية
rm -f ~/.local/bin/code-server
rm -f ~/bin/code-server

# حذف مجلدات الإعداد
rm -rf ~/.config/code-server
rm -rf ~/.local/share/code-server
rm -rf ~/.cache/code-server

# حذف الملفات المؤقتة
rm -f ~/install.sh
rm -f /tmp/code-server*
```

### **الخطوة 2: تنظيف ملفات البيئة**

```bash
# نسخ احتياطية قبل التعديل
cp ~/.bashrc ~/.bashrc.backup
cp ~/.bash_profile ~/.bash_profile.backup 2>/dev/null
cp ~/.profile ~/.profile.backup 2>/dev/null

# إزالة أي إشارات لـ code-server
nano ~/.bashrc
# احذف أي سطور تحتوي على "code-server"

# أعد تحميل البيئة
source ~/.bashrc
```

### **الخطوة 3: التحقق من النظافة**

```bash
# يجب ألا يجد code-server
which code-server

# إذا أرجع شيء، احذفه:
rm -f $(which code-server)
```

### **الخطوة 4: استعادة المشروع**

#### **أ. إذا كان المشروع موجوداً:**

```bash
cd ~/claude-code

# تحديث من GitHub
git fetch origin
git checkout claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn
git pull origin claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn
```

#### **ب. إذا لم يكن موجوداً (استنساخ جديد):**

```bash
cd ~
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code
git checkout claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn
```

### **الخطوة 5: إعادة الإعداد**

```bash
cd ~/claude-code

# منح صلاحيات التنفيذ
chmod +x start-agent.sh
chmod +x termux-cleanup.sh
chmod +x termux-recovery.sh

# إعداد ملف البيئة
cp .env.example .env
nano .env
# أضف ANTHROPIC_API_KEY=your-key-here

# تثبيت المتطلبات
npm install

# (اختياري) تثبيت متطلبات Python
pip install -r requirements.txt
```

### **الخطوة 6: اختبار التشغيل**

```bash
# تشغيل تفاعلي
./start-agent.sh

# أو تشغيل مباشر
node src/cli.js chat
```

---

## 📊 جدول مقارنة الطرق

| الميزة | السكريبتات الجاهزة | الطريقة اليدوية |
|--------|-------------------|----------------|
| السرعة | ⚡ سريعة جداً | 🐌 بطيئة نسبياً |
| السهولة | ✅ سهلة | 🔧 تحتاج خبرة |
| الأمان | ✅ آمنة | ⚠️ احتمال خطأ |
| الفهم | 📦 تلقائي | 📚 تفصيلي |
| النسخ الاحتياطية | ✅ تلقائي | 🔧 يدوي |

**التوصية:** استخدم السكريبتات الجاهزة ما لم تواجه مشكلة.

---

## 🔍 التحقق من نجاح الاستعادة

شغل الأوامر التالية للتأكد من نجاح الاستعادة:

```bash
# 1. التحقق من عدم وجود code-server
which code-server
# يجب أن يرجع: not found

# 2. التحقق من وجود المشروع
ls -la ~/claude-code/start-agent.sh
# يجب أن يكون موجود

# 3. التحقق من Node.js
node --version
# يجب أن يرجع رقم إصدار

# 4. التحقق من .env
cat ~/claude-code/.env | grep ANTHROPIC_API_KEY
# يجب أن يظهر المفتاح

# 5. اختبار npm packages
cd ~/claude-code && npm list --depth=0
# يجب أن تظهر الحزم المثبتة
```

✅ **إذا مرت جميع الاختبارات، فالاستعادة نجحت!**

---

## ❓ حل المشاكل الشائعة

### **مشكلة 1: code-server لا يزال موجوداً بعد التنظيف**

```bash
# ابحث عن جميع نسخ code-server
find ~ -name "*code-server*" -type f 2>/dev/null

# احذفها يدوياً
rm -rf [المسار]

# ابحث في PATH
echo $PATH | tr ':' '\n' | while read dir; do ls -la "$dir"/code-server 2>/dev/null; done
```

### **مشكلة 2: git pull يفشل بسبب تعديلات محلية**

```bash
# احفظ التغييرات مؤقتاً
git stash

# حدّث المشروع
git pull origin claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn

# (اختياري) استعد التغييرات
git stash pop
```

### **مشكلة 3: npm install يفشل**

```bash
# نظّف cache
npm cache clean --force

# احذف node_modules
rm -rf node_modules package-lock.json

# أعد التثبيت
npm install

# إذا فشل sqlite3:
pkg install build-essential python
npm install
```

### **مشكلة 4: Permission denied عند التشغيل**

```bash
chmod +x start-agent.sh
chmod +x termux-cleanup.sh
chmod +x termux-recovery.sh
```

### **مشكلة 5: ANTHROPIC_API_KEY مفقود**

```bash
# تحقق من وجود .env
ls -la ~/claude-code/.env

# إذا لم يكن موجوداً
cd ~/claude-code
cp .env.example .env
nano .env
# أضف: ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### **مشكلة 6: Termux يتوقف في الخلفية**

```bash
# استخدم wake lock
termux-wake-lock

# أو استخدم tmux
pkg install tmux
tmux new -s agent
./start-agent.sh
# للانفصال: Ctrl+B ثم D
# للعودة: tmux attach -t agent
```

---

## 🛡️ الوقاية من المشاكل المستقبلية

### **1. لا تشغل أوامر curl | sh مباشرة**

❌ **خطأ:**
```bash
curl https://example.com/install.sh | sh
```

✅ **صحيح:**
```bash
# احفظ السكريبت أولاً
curl https://example.com/install.sh -o install.sh

# افحصه
cat install.sh
less install.sh

# ثم شغله إذا كان آمن
bash install.sh
```

### **2. استخدم بيئات منعزلة**

```bash
# للمشاريع الجديدة
cd ~/projects
mkdir test-project
cd test-project

# لا تثبت أشياء globally
```

### **3. احتفظ بنسخ احتياطية**

```bash
# احتفظ بنسخة من .env
cp ~/claude-code/.env ~/claude-code/.env.backup.$(date +%Y%m%d)

# احتفظ بنسخة من .bashrc
cp ~/.bashrc ~/.bashrc.backup.$(date +%Y%m%d)
```

### **4. استخدم git بانتظام**

```bash
cd ~/claude-code
git status
git log --oneline -5

# إذا عملت تغييرات مهمة، احفظها
git stash push -m "My local changes"
```

---

## 📚 الملفات المهمة في المشروع

| الملف | الوصف | الأهمية |
|------|-------|--------|
| `start-agent.sh` | السكريبت الرئيسي للتشغيل | ⭐⭐⭐ |
| `.env` | إعدادات البيئة و API keys | ⭐⭐⭐ |
| `package.json` | قائمة متطلبات Node.js | ⭐⭐⭐ |
| `TERMUX_GUIDE.md` | دليل Termux الكامل | ⭐⭐ |
| `termux-cleanup.sh` | سكريبت التنظيف | ⭐⭐ |
| `termux-recovery.sh` | سكريبت الاستعادة | ⭐⭐ |
| `requirements.txt` | متطلبات Python | ⭐ |

---

## 🎯 الخطوات التالية بعد الاستعادة

1. **تشغيل الوكيل:**
   ```bash
   cd ~/claude-code
   ./start-agent.sh
   ```

2. **قراءة الأدلة:**
   - `TERMUX_GUIDE.md` - للاستخدام اليومي
   - `AGENT_GUIDE.md` - لفهم قدرات الوكيل
   - `README.md` - نظرة عامة

3. **تخصيص الإعدادات:**
   ```bash
   nano ~/claude-code/.env
   ```

4. **إضافة مهام:**
   - استخدم وضع المحادثة للتجربة
   - جدول مهام متكررة
   - دمج مع خدمات أخرى

---

## 💬 الدعم والمساعدة

### **إذا واجهت مشاكل:**

1. **راجع هذا الدليل** - معظم الحلول موجودة
2. **افحص الـ logs:**
   ```bash
   cat ~/claude-code/logs/agent.log
   ```
3. **افتح issue على GitHub:**
   [https://github.com/mhdessouky-creator/claude-code/issues](https://github.com/mhdessouky-creator/claude-code/issues)

### **معلومات مفيدة عند طلب المساعدة:**

```bash
# معلومات النظام
uname -a
pkg list-installed | grep -E "(node|git|python)"

# معلومات المشروع
cd ~/claude-code
git branch
git log --oneline -3

# حالة الملفات
ls -la ~/claude-code/.env
ls -la ~/claude-code/start-agent.sh
```

---

## ✨ نصائح إضافية

### **للحصول على أفضل أداء:**

```bash
# 1. استخدم tmux للجلسات المستمرة
pkg install tmux
tmux new -s agent
./start-agent.sh

# 2. منع Termux من التوقف
termux-wake-lock

# 3. استخدم storage-access للوصول للملفات
termux-setup-storage

# 4. حدّث الحزم بانتظام
pkg update && pkg upgrade
```

### **لتحسين تجربة الاستخدام:**

```bash
# اختصارات في .bashrc
echo 'alias agent="cd ~/claude-code && ./start-agent.sh"' >> ~/.bashrc
echo 'alias agent-chat="cd ~/claude-code && node src/cli.js chat"' >> ~/.bashrc
source ~/.bashrc

# الآن يمكنك استخدام:
agent        # لتشغيل القائمة التفاعلية
agent-chat   # لتشغيل المحادثة مباشرة
```

---

## 📊 Checklist الاستعادة الكامل

استخدم هذا للتأكد من إكمال كل الخطوات:

- [ ] حذف code-server من النظام
- [ ] تنظيف ملفات البيئة (.bashrc, .profile)
- [ ] تحديث/استنساخ المشروع من GitHub
- [ ] إنشاء/تحديث ملف .env
- [ ] إضافة ANTHROPIC_API_KEY في .env
- [ ] منح صلاحيات التنفيذ للسكريبتات
- [ ] تثبيت npm packages
- [ ] (اختياري) تثبيت Python packages
- [ ] اختبار التشغيل بـ ./start-agent.sh
- [ ] التحقق من عدم وجود أخطاء
- [ ] إنشاء نسخة احتياطية من .env
- [ ] قراءة TERMUX_GUIDE.md

---

## 🎉 النهاية

إذا وصلت لهنا وكل شيء يعمل، **مبروك!** 🎊

أنت الآن جاهز لاستخدام الوكيل الذكي الخاص بك.

**استمتع بأتمتة حياتك الرقمية! 🤖✨**

</div>

---

# English Version - Quick Reference

## Quick Recovery (3 Steps)

```bash
# 1. Navigate to project
cd ~/claude-code

# 2. Cleanup (remove code-server)
chmod +x termux-cleanup.sh
./termux-cleanup.sh

# 3. Recover (restore original setup)
chmod +x termux-recovery.sh
./termux-recovery.sh
```

## Manual Recovery

```bash
# 1. Remove code-server
pkill -9 code-server
rm -rf ~/.config/code-server ~/.local/share/code-server

# 2. Update project
cd ~/claude-code
git fetch origin
git checkout claude/recover-termux-setup-01UpqbZfD81hLQEjDSqwe3tn

# 3. Reinstall
chmod +x start-agent.sh
cp .env.example .env
nano .env  # Add ANTHROPIC_API_KEY
npm install

# 4. Run
./start-agent.sh
```

## Verification

```bash
which code-server  # Should return: not found
node --version     # Should show version
npm list --depth=0 # Should show packages
```

---

**Created with ❤️ for the Termux community**

**Last updated:** 2025-12-05
