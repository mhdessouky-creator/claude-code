#!/usr/bin/env python3
"""
اختبار بسيط للوكيل الذكي
"""
import sys
import os

# إضافة المسار للوصول إلى modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.brain import BaseAgent
from agents.tasks_agent import TasksAgent
from config.settings import config


def test_imports():
    """اختبار الاستيرادات"""
    print("✓ جميع الاستيرادات نجحت")


def test_config():
    """اختبار الإعدادات"""
    print(f"✓ مزود الخدمة: {config.AI_PROVIDER}")
    print(f"✓ النموذج: {config.GROQ_MODEL if config.AI_PROVIDER == 'groq' else config.OLLAMA_MODEL}")


def test_base_agent():
    """اختبار الوكيل الأساسي"""
    try:
        agent = BaseAgent()
        print("✓ تم إنشاء الوكيل الأساسي بنجاح")

        # اختبار إضافة رسالة للسجل
        agent.add_to_history("user", "مرحبا")
        agent.add_to_history("assistant", "أهلا وسهلا")
        print(f"✓ سجل المحادثة: {len(agent.conversation_history)} رسائل")

        # اختبار مسح السجل
        agent.clear_history()
        print(f"✓ تم مسح السجل: {len(agent.conversation_history)} رسائل")

        return True
    except Exception as e:
        print(f"✗ خطأ في اختبار الوكيل الأساسي: {e}")
        return False


def test_tasks_agent():
    """اختبار وكيل المهام"""
    try:
        tasks_agent = TasksAgent()
        print("✓ تم إنشاء وكيل المهام بنجاح")

        # إضافة مهام
        tasks_agent.add_task("test1", "مهمة اختبار 1", priority=5)
        tasks_agent.add_task("test2", "مهمة اختبار 2", priority=8)
        print(f"✓ تمت إضافة المهام: {len(tasks_agent.tasks)} مهام")

        # عرض المهام
        tasks = tasks_agent.list_tasks()
        print(f"✓ المهام المرتبة حسب الأولوية: {len(tasks)} مهام")

        # الحصول على الإحصائيات
        stats = tasks_agent.get_statistics()
        print(f"✓ الإحصائيات: {stats}")

        return True
    except Exception as e:
        print(f"✗ خطأ في اختبار وكيل المهام: {e}")
        return False


def main():
    """الدالة الرئيسية للاختبار"""
    print("\n" + "=" * 50)
    print("اختبار الوكيل الذكي")
    print("=" * 50 + "\n")

    try:
        # الاختبارات
        test_imports()
        test_config()

        agent_ok = test_base_agent()
        tasks_ok = test_tasks_agent()

        print("\n" + "=" * 50)
        if agent_ok and tasks_ok:
            print("✓ جميع الاختبارات نجحت!")
        else:
            print("✗ بعض الاختبارات فشلت")
        print("=" * 50 + "\n")

    except Exception as e:
        print(f"\n✗ خطأ في الاختبار: {e}\n")
        return False

    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
