#!/bin/bash
# 🚀 سكريبت تشغيل الوكيل الذكي

echo "🤖 مرحباً بك في Digital Life AI Agent"
echo "========================================"
echo ""

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت!"
    echo "📥 ثبت Node.js أولاً من: https://nodejs.org"
    exit 1
fi

# التحقق من API Key
if ! grep -q "sk-ant-" .env 2>/dev/null; then
    echo "⚠️  تحذير: API Key غير موجود أو غير صحيح!"
    echo ""
    echo "📝 خطوات الحصول على API Key:"
    echo "   1. سجل في https://console.anthropic.com"
    echo "   2. اذهب إلى API Keys"
    echo "   3. أنشئ مفتاح جديد"
    echo "   4. عدل ملف .env وأضف المفتاح:"
    echo "      ANTHROPIC_API_KEY=sk-ant-your-key-here"
    echo ""
    read -p "هل تريد المتابعة بدون API key؟ (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# التحقق من تثبيت المكتبات
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت المكتبات المطلوبة..."
    npm install
fi

echo ""
echo "🎯 اختر وضع التشغيل:"
echo "1) محادثة تفاعلية (Interactive Chat)"
echo "2) تنفيذ مهمة واحدة (Single Task)"
echo "3) عرض حالة الوكيل (Status)"
echo "4) تشغيل مثال تجريبي (Demo)"
echo ""
read -p "اختر (1-4): " choice

case $choice in
    1)
        echo "🗣️  بدء المحادثة التفاعلية..."
        npm run cli chat
        ;;
    2)
        echo ""
        read -p "📝 اكتب المهمة التي تريد تنفيذها: " task
        npm run cli task "$task"
        ;;
    3)
        echo "📊 جاري عرض حالة الوكيل..."
        npm run cli status
        ;;
    4)
        echo "🎬 تشغيل المثال التجريبي..."
        npm start
        ;;
    *)
        echo "❌ اختيار غير صحيح!"
        exit 1
        ;;
esac
