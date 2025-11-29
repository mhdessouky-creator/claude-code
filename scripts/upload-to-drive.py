#!/usr/bin/env python3
"""
Upload Prompt Library to Google Drive
رفع مكتبة Prompts إلى Google Drive
"""

import sys
import os

# Add parent directory to path to import anthropic_skills
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python.anthropic_skills import AnthropicSkills

def upload_to_drive():
    """رفع مكتبة Prompts إلى Google Drive"""

    print("🚀 بدء رفع Prompt Library إلى Google Drive...")

    # تهيئة Claude مع Google Workspace skill
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

    # تحقق من تشغيل MCP server
    print("\n⚠️  تأكد من تشغيل Google Workspace MCP Server على المنفذ 3001")
    print("   يمكنك تشغيله بـ: node mcp-servers/google-workspace/server.js")

    input("\nاضغط Enter للمتابعة أو Ctrl+C للإلغاء...")

    try:
        upload_to_drive()
    except KeyboardInterrupt:
        print("\n\n❌ تم الإلغاء بواسطة المستخدم")
    except Exception as e:
        print(f"\n\n❌ حدث خطأ: {e}")
        print("\nتأكد من:")
        print("1. تشغيل Google Workspace MCP Server")
        print("2. إعداد Google API credentials في .env")
        print("3. منح الصلاحيات المناسبة للـ API")
