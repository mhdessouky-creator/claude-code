# 🚨 إصلاح طوارئ Termux - Emergency Fix

<div dir="rtl">

## 🔴 المشكلة التي تواجهها

بيئة Termux معطوبة! الأدوات الأساسية مفقودة:
- ❌ `chmod` غير موجود
- ❌ `pkg` غير موجود
- ❌ `coreutils` غير مثبت

---

## ✅ الحل الفوري (اختر واحد)

### **الحل 1: استخدام apt بدلاً من pkg** ⭐ (جرب هذا أولاً)

```bash
# apt هو البديل الأساسي لـ pkg في Termux
apt update
apt upgrade -y
apt install termux-tools coreutils -y
```

بعدها جرب:
```bash
pkg update
pkg install nodejs git python -y
```

---

### **الحل 2: تغيير مستودع Termux**

```bash
# استخدم الأمر المقترح في الرسالة
termux-change-repo
```

اختر مستودع (مرآة) مختلفة، ثم:
```bash
apt update
apt install termux-tools coreutils -y
pkg update
```

---

### **الحل 3: إعادة تثبيت Termux بالكامل** 🔄

هذا الحل الأقوى لكن ستفقد جميع البيانات في Termux:

**الخطوات:**
1. احفظ أي بيانات مهمة (خارج Termux)
2. امسح تطبيق Termux من إعدادات Android:
   - Settings → Apps → Termux → Clear Data
   - أو امسح التطبيق وأعد تثبيته
3. افتح Termux من جديد
4. شغل الأوامر الأساسية:

```bash
# تحديث Termux
pkg update && pkg upgrade -y

# تثبيت الأدوات الأساسية
pkg install termux-tools coreutils -y
pkg install nodejs git python -y

# السماح بالوصول للتخزين
termux-setup-storage
```

---

## 🔧 بعد إصلاح Termux

عندما يعمل `pkg` بشكل صحيح، شغل:

### **خطوة 1: استنساخ المشروع**

```bash
cd ~
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code
```

### **خطوة 2: تشغيل سكريبت الاستعادة**

```bash
# منح صلاحيات (الآن chmod يجب أن يعمل)
chmod +x termux-recovery.sh termux-cleanup.sh start-agent.sh

# تشغيل الاستعادة
./termux-recovery.sh
```

---

## 🆘 إذا لم يعمل أي شيء

### **جرب الأوامر البديلة:**

```bash
# بدلاً من pkg، استخدم apt
apt update
apt install termux-tools

# بدلاً من chmod، استخدم install
install -m 755 termux-recovery.sh ~/termux-recovery-executable.sh
~/termux-recovery-executable.sh
```

### **أو استخدم Termux Boot:**

إذا كان عندك Termux:Boot مثبت، يمكنك إنشاء سكريبت boot:
```bash
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/fix-termux.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
apt update
apt install termux-tools coreutils -y
EOF
```

---

## 📱 تشخيص المشكلة

شغل الأوامر دي وابعتلي النتيجة:

```bash
# تحقق من البيئة
echo $PREFIX
echo $PATH

# تحقق من وجود apt
which apt
ls -la /data/data/com.termux/files/usr/bin/apt*

# تحقق من الأدوات الموجودة
ls /data/data/com.termux/files/usr/bin/ | head -20

# معلومات Termux
cat $PREFIX/etc/apt/sources.list
```

---

## 🎯 سكريبت إصلاح بسيط (بدون chmod)

إذا لم يعمل chmod، استخدم هذا:

```bash
# إنشاء ملف إصلاح
cat > ~/fix-termux.sh << 'FIXEOF'
#!/data/data/com.termux/files/usr/bin/sh

echo "🔧 Fixing Termux..."

# محاولة 1: استخدام apt
if command -v apt > /dev/null 2>&1; then
    echo "✓ apt found, updating..."
    apt update
    apt install -y termux-tools coreutils
else
    echo "✗ apt not found!"
fi

# محاولة 2: استخدام dpkg
if command -v dpkg > /dev/null 2>&1; then
    echo "✓ dpkg found"
else
    echo "✗ dpkg not found!"
fi

# التحقق
if command -v pkg > /dev/null 2>&1; then
    echo "✓ pkg is now working!"
    pkg update
    pkg install nodejs git python -y
else
    echo "✗ pkg still not working"
    echo "Please reinstall Termux"
fi

echo "Done!"
FIXEOF

# تشغيله بدون chmod
sh ~/fix-termux.sh
```

---

## ⚡ الحل الأسرع (نسخ ولصق)

```bash
# جرب هذا الأمر الواحد
apt update && apt install -y termux-tools coreutils && pkg update && pkg install -y nodejs git python && cd ~ && git clone https://github.com/mhdessouky-creator/claude-code.git && cd claude-code && sh termux-recovery.sh
```

إذا نجح، ممتاز! وإلا، اتبع الحلول أعلاه.

---

## 📊 أسباب المشكلة المحتملة

| السبب | الاحتمال | الحل |
|-------|----------|------|
| تثبيت code-server خرب البيئة | عالي | الحل 1 أو 2 |
| مستودع Termux معطل | متوسط | termux-change-repo |
| Termux قديم جداً | متوسط | تحديث/إعادة تثبيت |
| مسح ملفات نظام عن طريق الخطأ | عالي | إعادة تثبيت |
| صلاحيات Android معطلة | منخفض | إعادة منح الصلاحيات |

---

## 💡 نصائح مهمة

### **بعد الإصلاح:**
1. ✅ لا تشغل أوامر `curl | sh` بدون فحص
2. ✅ استخدم `termux-change-repo` إذا كانت المستودعات بطيئة
3. ✅ احتفظ بنسخة احتياطية من `.bashrc` و `.env`
4. ✅ استخدم `pkg` بدلاً من تثبيت أشياء يدوياً

### **للوقاية:**
```bash
# إنشاء نسخة احتياطية من Termux
pkg install tar
tar -czf ~/termux-backup.tar.gz -C $PREFIX ../usr

# لاستعادتها لاحقاً (في حالة الطوارئ)
cd /
tar -xzf ~/termux-backup.tar.gz
```

---

## 🔗 روابط مفيدة

- **Termux Wiki**: https://wiki.termux.com
- **Termux GitHub**: https://github.com/termux/termux-app
- **Report Issues**: https://github.com/termux/termux-app/issues
- **Claude Code Issues**: https://github.com/mhdessouky-creator/claude-code/issues

---

## ✉️ اتصل للمساعدة

إذا جربت كل الحلول ولم ينجح شيء:

1. افتح issue على GitHub:
   https://github.com/mhdessouky-creator/claude-code/issues

2. ضمّن المعلومات التالية:
   ```bash
   echo "PREFIX: $PREFIX"
   echo "PATH: $PATH"
   which apt
   which pkg
   ls -la $PREFIX/bin/pkg
   cat $PREFIX/etc/apt/sources.list
   ```

---

</div>

# English Version

## 🚨 Quick Fix

Your Termux is broken! Try these:

### **Option 1: Use apt instead of pkg**
```bash
apt update
apt install termux-tools coreutils -y
pkg update
```

### **Option 2: Change repository**
```bash
termux-change-repo
# Select a different mirror
apt update
apt install termux-tools -y
```

### **Option 3: Reinstall Termux**
1. Settings → Apps → Termux → Clear Data
2. Reopen Termux
3. Run: `pkg update && pkg upgrade -y`

### **After fixing:**
```bash
cd ~
git clone https://github.com/mhdessouky-creator/claude-code.git
cd claude-code
sh termux-recovery.sh
```

---

**Created for emergency Termux recovery**
**Last updated:** 2025-12-05
