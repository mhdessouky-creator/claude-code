#!/data/data/com.termux/files/usr/bin/bash

# حل مباشر للمشكلة
echo "جاري الإصلاح..."

# تثبيت المتطلبات
pkg install -y python python-pip build-essential clang make binutils

# تكوين npm
npm config set python "$(which python)"

# مسح وإعادة تثبيت
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

echo "✓ تم الإصلاح"
