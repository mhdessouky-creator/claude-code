#!/usr/bin/env python3
"""
Upload Prompt Library to Google Drive
رفع مكتبة Prompts إلى Google Drive

IMPORTANT: This script requires Google Workspace MCP Server to be running!
Start it first: node mcp-servers/google-workspace/server.js
"""

import sys
import os
import socket

# Add parent directory to path to import anthropic_skills
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_mcp_server(host='localhost', port=3001, timeout=2):
    """تحقق من أن MCP Server شغال"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

def upload_to_drive():
    """رفع مكتبة Prompts إلى Google Drive"""

    print("🚀 بدء رفع Prompt Library إلى Google Drive...")

    # التحقق من MCP Server
    print("\n🔍 التحقق من Google Workspace MCP Server...")
    if not check_mcp_server('localhost', 3001):
        print("\n❌ خطأ: Google Workspace MCP Server غير شغال!")
        print("\n💡 الحل:")
        print("   1. افتح terminal جديد")
        print("   2. شغّل: node mcp-servers/google-workspace/server.js")
        print("   3. انتظر حتى ترى: '🚀 Google Workspace MCP Server running on port 3001'")
        print("   4. ارجع هنا وشغّل السكريبت مرة تانية\n")
        return False

    print("✅ MCP Server شغال!\n")

    # تهيئة Claude مع Google Workspace skill
    try:
        from python.anthropic_skills import AnthropicSkills
    except ImportError:
        print("❌ خطأ: لم يتم العثور على anthropic_skills")
        print("💡 تأكد من تثبيت المتطلبات: pip install -r python/requirements.txt")
        return False

    claude = AnthropicSkills()
    claude.add_skill({
        'name': 'google-workspace',
        'type': 'url',
        'url': 'http://localhost:3001'
    })

    # 1. إنشاء مجلد "Prompt Library" في Drive
    print("\n📁 إنشاء مجلد 'Prompt Library' في Google Drive...")

    create_folder_prompt = """
    أنشئ مجلد جديد في Google Drive اسمه "Prompt Library".

    إذا كان المجلد موجود بالفعل، أعطني الـ folder ID.
    إذا لم يكن موجود، أنشئه وأعطني الـ folder ID.
    """

    folder_response = claude.chat(
        prompt=create_folder_prompt,
        system="أنت مساعد Google Drive. أنشئ وأدر المجلدات بدقة."
    )

    print(f"✅ النتيجة: {folder_response}")

    # 2. رفع الملفات
    print("\n📤 رفع ملفات Prompt Library...")

    files_to_upload = [
        {
            'name': 'README.md',
            'description': 'دليل شامل لمكتبة Prompt Templates',
            'path': 'prompt-library/README.md'
        },
        {
            'name': 'prompt-templates.json',
            'description': '28 قالب Prompt جاهز بصيغة JSON',
            'path': 'prompt-library/prompt-templates.json'
        },
        {
            'name': 'template_loader.py',
            'description': 'Python loader للقوالب',
            'path': 'prompt-library/template_loader.py'
        },
        {
            'name': 'template-loader.js',
            'description': 'Node.js loader للقوالب',
            'path': 'prompt-library/template-loader.js'
        },
        {
            'name': 'library.md',
            'description': 'مكتبة Prompts نصية شاملة',
            'path': 'prompt-library/library.md'
        }
    ]

    upload_prompt = f"""
    ارفع الملفات التالية إلى مجلد "Prompt Library" في Google Drive:

    الملفات:
    """

    for file in files_to_upload:
        upload_prompt += f"\n- {file['name']}: {file['description']}"
        upload_prompt += f"\n  المسار: {file['path']}"

    upload_prompt += """

    لكل ملف:
    1. اقرأ محتوى الملف من المسار المحدد
    2. ارفعه إلى مجلد "Prompt Library"
    3. أعطني رابط المشاركة للملف

    أرجع قائمة بالملفات المرفوعة مع روابطها.
    """

    upload_response = claude.chat(
        prompt=upload_prompt,
        system="أنت مساعد رفع ملفات Google Drive. ارفع الملفات بدقة وأعطِ الروابط.",
        max_tokens=4096
    )

    print(f"\n✅ النتيجة:\n{upload_response}")

    # 3. إنشاء ملف فهرس
    print("\n📋 إنشاء ملف فهرس في Drive...")

    index_content = """
# 📚 Prompt Library - مكتبة القوالب

## 📦 المحتويات

هذا المجلد يحتوي على مكتبة شاملة من قوالب Prompts لاستخدام Claude مع 8 integrations مختلفة.

### الملفات:

1. **README.md** - دليل كامل للاستخدام (Python & Node.js)
2. **prompt-templates.json** - 28 قالباً جاهزاً بصيغة JSON
3. **template_loader.py** - Python class لتحميل واستخدام القوالب
4. **template-loader.js** - Node.js class لتحميل واستخدام القوالب
5. **library.md** - مكتبة نصية بأكثر من 50 prompt جاهز

### الـ Integrations المدعومة:

- 🔷 Google Workspace (Gmail, Calendar, Drive, Docs, Sheets, Tasks)
- 📝 Notion (Pages, Databases, Blocks)
- 📊 Airtable (Records, Webhooks)
- 💬 Telegram Bot
- 📱 WhatsApp Business
- 🐦 Twitter/X
- 🔴 Reddit
- 📁 Filesystem

### الإحصائيات:

- 📚 28 قالباً منظماً
- 🎯 تقدير توكنات لكل قالب
- 💡 نصائح توفير التوكنات
- 🐍 دعم Python كامل
- 📜 دعم Node.js كامل
- 📖 أمثلة شاملة

### للاستخدام:

راجع ملف README.md للتفاصيل الكاملة.

---

**تم إنشاؤه بواسطة:** Claude Code MCP Integration
**التاريخ:** 2025-11-29
**الإصدار:** 1.0.0
"""

    index_prompt = f"""
    أنشئ ملف Google Doc في مجلد "Prompt Library" باسم "INDEX - الفهرس".

    المحتوى:
    {index_content}

    استخدم formatting جميل مع:
    - Headers واضحة
    - Bullet points منظمة
    - Emojis للتوضيح

    أعطني رابط المستند عند الانتهاء.
    """

    index_response = claude.chat(
        prompt=index_prompt,
        system="أنت منشئ مستندات Google Docs احترافي."
    )

    print(f"\n✅ ملف الفهرس:\n{index_response}")

    print("\n🎉 تم رفع Prompt Library بنجاح إلى Google Drive! 🎉")
    print("\nيمكنك الآن الوصول إلى المكتبة من Google Drive.")

if __name__ == '__main__':
    print("=" * 60)
    print("📚 Prompt Library → Google Drive Uploader")
    print("=" * 60)

    try:
        result = upload_to_drive()
        if result is False:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n❌ تم الإلغاء بواسطة المستخدم")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ حدث خطأ: {e}")
        print("\nتأكد من:")
        print("1. تشغيل Google Workspace MCP Server")
        print("2. إعداد Google API credentials في .env")
        print("3. منح الصلاحيات المناسبة للـ API")
        import traceback
        traceback.print_exc()
        sys.exit(1)
