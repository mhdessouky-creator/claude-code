#!/usr/bin/env python3
"""
برنامج الوكيل الذكي - نقطة الدخول الرئيسية
"""
import sys
import os
from colorama import Fore, Back, Style

# إضافة المسار للوصول إلى modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.brain import BaseAgent
from agents.tasks_agent import TasksAgent
from config.settings import config


def print_banner():
    """طباعة البانر الترحيبي"""
    banner = f"""
{Fore.CYAN}╔════════════════════════════════════════════════════════════╗
║         {Fore.MAGENTA}ذكي الوكيل - Intelligent Agent{Fore.CYAN}           ║
║          مساعد ذكي قائم على الذكاء الاصطناعي            ║
╚════════════════════════════════════════════════════════════╝{Style.RESET_ALL}
"""
    print(banner)


def print_menu():
    """طباعة القائمة الرئيسية"""
    print(f"\n{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")
    print(f"{Fore.GREEN}القائمة الرئيسية:{Style.RESET_ALL}")
    print(f"  {Fore.CYAN}1{Style.RESET_ALL}. محادثة مع الوكيل (Chat)")
    print(f"  {Fore.CYAN}2{Style.RESET_ALL}. إدارة المهام (Tasks)")
    print(f"  {Fore.CYAN}3{Style.RESET_ALL}. عرض الإعدادات (Settings)")
    print(f"  {Fore.CYAN}4{Style.RESET_ALL}. خروج (Exit)")
    print(f"{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")


def chat_mode(agent: BaseAgent):
    """وضع المحادثة التفاعلي"""
    print(f"\n{Fore.GREEN}مرحباً! أنت الآن في وضع المحادثة. اكتب 'خروج' أو 'exit' للعودة{Style.RESET_ALL}")

    while True:
        try:
            user_input = input(f"\n{Fore.CYAN}أنت:{Style.RESET_ALL} ").strip()

            if user_input.lower() in ["خروج", "exit", "quit"]:
                break

            if not user_input:
                continue

            print(f"{Fore.MAGENTA}⟳ جاري المعالجة...{Style.RESET_ALL}")
            response = agent.get_response(user_input)
            print(f"\n{Fore.GREEN}الوكيل:{Style.RESET_ALL}\n{response}")

        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}تم الإيقاف من قبل المستخدم{Style.RESET_ALL}")
            break
        except Exception as e:
            print(f"{Fore.RED}خطأ: {e}{Style.RESET_ALL}")


def tasks_mode():
    """وضع إدارة المهام"""
    print(f"\n{Fore.GREEN}مرحباً بك في وضع إدارة المهام{Style.RESET_ALL}")

    try:
        tasks_agent = TasksAgent()
    except Exception as e:
        print(f"{Fore.RED}خطأ في إنشاء وكيل المهام: {e}{Style.RESET_ALL}")
        return

    # إضافة بعض المهام التجريبية
    tasks_agent.add_task("task1", "اشرح مفهوم الذكاء الاصطناعي بشكل مبسط", priority=9)
    tasks_agent.add_task("task2", "اقترح 3 طرق لتحسين الإنتاجية", priority=8)
    tasks_agent.add_task("task3", "ما هي أفضل الممارسات في البرمجة؟", priority=7)

    while True:
        print(f"\n{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")
        print(f"{Fore.GREEN}قائمة المهام:{Style.RESET_ALL}")
        print(f"  {Fore.CYAN}1{Style.RESET_ALL}. عرض المهام")
        print(f"  {Fore.CYAN}2{Style.RESET_ALL}. تنفيذ المهمة التالية")
        print(f"  {Fore.CYAN}3{Style.RESET_ALL}. معالجة جميع المهام")
        print(f"  {Fore.CYAN}4{Style.RESET_ALL}. عرض الإحصائيات")
        print(f"  {Fore.CYAN}5{Style.RESET_ALL}. إضافة مهمة جديدة")
        print(f"  {Fore.CYAN}6{Style.RESET_ALL}. العودة للقائمة الرئيسية")
        print(f"{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")

        choice = input(f"{Fore.CYAN}اختر خياراً:{Style.RESET_ALL} ").strip()

        if choice == "1":
            tasks = tasks_agent.list_tasks()
            if tasks:
                print(f"\n{Fore.MAGENTA}المهام المتاحة:{Style.RESET_ALL}")
                for task in tasks:
                    print(f"  • {task}")
            else:
                print(f"{Fore.YELLOW}لا توجد مهام{Style.RESET_ALL}")

        elif choice == "2":
            task = tasks_agent.get_next_task()
            if task:
                print(f"\nجاري تنفيذ المهمة: {task.description}")
                result = tasks_agent.execute_task(task.task_id)
                print(f"\n{Fore.GREEN}النتيجة:{Style.RESET_ALL}\n{result}")
            else:
                print(f"{Fore.YELLOW}لا توجد مهام معلقة{Style.RESET_ALL}")

        elif choice == "3":
            print(f"\n{Fore.MAGENTA}جاري معالجة جميع المهام...{Style.RESET_ALL}")
            results = tasks_agent.process_all_tasks()
            print(f"\n{Fore.GREEN}تمت معالجة {len(results)} مهام{Style.RESET_ALL}")

        elif choice == "4":
            tasks_agent.print_statistics()

        elif choice == "5":
            task_desc = input(f"{Fore.CYAN}أدخل وصف المهمة:{Style.RESET_ALL} ").strip()
            priority = input(f"{Fore.CYAN}أدخل الأولوية (1-10):{Style.RESET_ALL} ").strip()
            try:
                priority = int(priority) if priority else 1
                task_id = f"task_{len(tasks_agent.tasks) + 1}"
                tasks_agent.add_task(task_id, task_desc, priority)
            except ValueError:
                print(f"{Fore.RED}أولوية غير صحيحة{Style.RESET_ALL}")

        elif choice == "6":
            break

        else:
            print(f"{Fore.RED}خيار غير صحيح{Style.RESET_ALL}")


def show_settings():
    """عرض الإعدادات"""
    print(f"\n{Fore.MAGENTA}╔══════════════════════════════════════╗{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}║         الإعدادات الحالية{Style.RESET_ALL}         {Fore.MAGENTA}║{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}╚══════════════════════════════════════╝{Style.RESET_ALL}")
    print(f"  {Fore.CYAN}مزود الخدمة:{Style.RESET_ALL} {config.AI_PROVIDER}")
    if config.AI_PROVIDER == "groq":
        print(f"  {Fore.CYAN}النموذج:{Style.RESET_ALL} {config.GROQ_MODEL}")
    else:
        print(f"  {Fore.CYAN}النموذج:{Style.RESET_ALL} {config.OLLAMA_MODEL}")
        print(f"  {Fore.CYAN}العنوان:{Style.RESET_ALL} {config.OLLAMA_BASE_URL}")
    print(f"  {Fore.CYAN}درجة الحرارة:{Style.RESET_ALL} {config.TEMPERATURE}")
    print(f"  {Fore.CYAN}الحد الأقصى للرموز:{Style.RESET_ALL} {config.MAX_TOKENS}")


def main():
    """الدالة الرئيسية"""
    print_banner()

    # التحقق من الإعدادات
    if config.AI_PROVIDER == "groq" and not config.GROQ_API_KEY:
        print(f"{Fore.YELLOW}⚠️  تحذير: مفتاح Groq API لم يتم تعيينه. اضبط GROQ_API_KEY في .env{Style.RESET_ALL}")

    # إنشاء الوكيل الأساسي
    try:
        agent = BaseAgent()
    except Exception as e:
        print(f"{Fore.RED}خطأ في إنشاء الوكيل: {e}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}يرجى التحقق من الإعدادات والمفاتيح{Style.RESET_ALL}")
        sys.exit(1)

    # حلقة البرنامج الرئيسية
    while True:
        print_menu()
        choice = input(f"{Fore.CYAN}اختر خياراً:{Style.RESET_ALL} ").strip()

        if choice == "1":
            chat_mode(agent)
        elif choice == "2":
            tasks_mode()
        elif choice == "3":
            show_settings()
        elif choice == "4":
            print(f"\n{Fore.GREEN}شكراً لاستخدامك الوكيل الذكي. وداعاً!{Style.RESET_ALL}\n")
            break
        else:
            print(f"{Fore.RED}خيار غير صحيح{Style.RESET_ALL}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}\nتم الإيقاف من قبل المستخدم{Style.RESET_ALL}")
        sys.exit(0)
    except Exception as e:
        print(f"{Fore.RED}خطأ غير متوقع: {e}{Style.RESET_ALL}")
        sys.exit(1)
