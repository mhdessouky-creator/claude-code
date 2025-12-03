# 🔧 حل مشكلة sqlite3 و gyp في Termux

## المشكلة

```
gyp ERR! find Python
gyp ERR! stack Error: Could not find any Python installation to use
```

هذا الخطأ يحدث لأن حزمة `sqlite3` تحتاج إلى:
1. **Python** - لتشغيل node-gyp
2. **أدوات البناء** - لبناء الحزم الأصلية (native modules)

---

## ✅ الحل السريع (3 خطوات)

### الخطوة 1: تثبيت Python وأدوات البناء

```bash
# تثبيت Python
pkg install -y python python-pip

# تثبيت أدوات البناء
pkg install -y build-essential clang make binutils
```

### الخطوة 2: تكوين npm

```bash
# ربط Python مع npm
npm config set python "$(which python)"

# تأكيد التكوين
npm config get python
```

### الخطوة 3: إعادة التثبيت

```bash
# مسح التثبيت القديم
rm -rf node_modules package-lock.json

# تنظيف الذاكرة المؤقتة
npm cache clean --force

# إعادة التثبيت
npm install
```

---

## 🚀 الحل الأسرع: استخدام السكريبت التلقائي

```bash
# تشغيل سكريبت الإعداد (يقوم بكل شيء تلقائياً)
chmod +x setup-termux.sh
./setup-termux.sh

# ثم إعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

---

## ✔️ التحقق من نجاح الحل

بعد التثبيت، يجب أن ترى:

```bash
✓ sqlite3@5.1.6
```

وليس:

```bash
npm ERR! code 1
npm ERR! path .../node_modules/sqlite3
```

---

## 🔍 إذا استمرت المشكلة

### الحل 1: إعادة بناء sqlite3 مباشرة

```bash
npm rebuild sqlite3
```

### الحل 2: تثبيت sqlite3 بشكل منفصل

```bash
npm install sqlite3 --build-from-source
```

### الحل 3: التحقق من Python

```bash
# تحقق من وجود Python
which python

# تحقق من الإصدار
python --version

# تحقق من تكوين npm
npm config get python
```

يجب أن تكون النتيجة:
```
/data/data/com.termux/files/usr/bin/python
```

---

## 📋 معلومات إضافية

### لماذا تحتاج sqlite3 إلى Python؟

`sqlite3` هي حزمة **native addon** لـ Node.js، مما يعني:
- تحتوي على كود C/C++
- تحتاج إلى **node-gyp** للبناء
- node-gyp يحتاج إلى **Python** لتشغيل سكريبتات البناء

### ما هي الحزم التي يثبتها الحل؟

| الحزمة | الوصف |
|--------|-------|
| `python` | لغة Python (مطلوبة لـ node-gyp) |
| `python-pip` | مدير حزم Python |
| `build-essential` | أدوات البناء الأساسية |
| `clang` | مترجم C/C++ |
| `make` | أداة البناء |
| `binutils` | أدوات ثنائية (linker, assembler) |

---

## 🎯 الأوامر الكاملة (نسخ ولصق)

```bash
# 1. تثبيت المتطلبات
pkg install -y python python-pip build-essential clang make binutils

# 2. تكوين npm
npm config set python "$(which python)"

# 3. إعادة التثبيت النظيف
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 4. التحقق
npm list sqlite3
```

---

## 💡 نصائح

1. **استخدم السكريبت التلقائي** (`setup-termux.sh`) لتجنب هذه المشاكل في المستقبل
2. **لا تحذف** حزم البناء بعد التثبيت - قد تحتاجها لتحديثات أخرى
3. **احتفظ بنسخة** من تكوين npm في حال احتجت إعادة الإعداد

---

# 🔧 Fix sqlite3 & gyp Error in Termux (English)

## Quick Fix (3 Steps)

### Step 1: Install Python and Build Tools

```bash
pkg install -y python python-pip
pkg install -y build-essential clang make binutils
```

### Step 2: Configure npm

```bash
npm config set python "$(which python)"
npm config get python
```

### Step 3: Reinstall

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Fastest Solution: Use Setup Script

```bash
chmod +x setup-termux.sh
./setup-termux.sh
rm -rf node_modules package-lock.json
npm install
```

---

**Made with ❤️ for Termux users experiencing sqlite3 build errors**
