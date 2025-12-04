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
from agents.gmail_agent import GmailAgent
from config.settings import config
from utils.arabic_helper import fix_arabic_text, is_termux


def print_text(text: str, **kwargs):
    """طباعة نص مع إصلاح العربي في Termux"""
    if is_termux():
        text = fix_arabic_text(text)
    print(text, **kwargs)


def print_banner():
    """طباعة البانر الترحيبي"""
    banner = f"""
{Fore.CYAN}╔════════════════════════════════════════════════════════════╗
║         {Fore.MAGENTA}ذكي الوكيل - Intelligent Agent{Fore.CYAN}           ║
║          مساعد ذكي قائم على الذكاء الاصطناعي            ║
╚════════════════════════════════════════════════════════════╝{Style.RESET_ALL}
"""
    print_text(banner)


def print_menu():
    """طباعة القائمة الرئيسية"""
    print_text(f"\n{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")
    print_text(f"{Fore.GREEN}القائمة الرئيسية:{Style.RESET_ALL}")
    print_text(f"  {Fore.CYAN}1{Style.RESET_ALL}. محادثة مع الوكيل (Chat)")
    print_text(f"  {Fore.CYAN}2{Style.RESET_ALL}. إدارة المهام (Tasks)")
    print_text(f"  {Fore.CYAN}3{Style.RESET_ALL}. 📧 إدارة Gmail (Gmail)")
    print_text(f"  {Fore.CYAN}4{Style.RESET_ALL}. تغيير مزود الذكاء الاصطناعي (Change AI Provider)")
    print_text(f"  {Fore.CYAN}5{Style.RESET_ALL}. عرض الإعدادات (Settings)")
    print_text(f"  {Fore.CYAN}6{Style.RESET_ALL}. خروج (Exit)")
    print_text(f"{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")


def chat_mode(agent: BaseAgent):
    """وضع المحادثة التفاعلي"""
    print_text(f"\n{Fore.GREEN}مرحباً! أنت الآن في وضع المحادثة. اكتب 'خروج' أو 'exit' للعودة{Style.RESET_ALL}")

    while True:
        try:
            user_input = input(f"\n{Fore.CYAN}أنت:{Style.RESET_ALL} ").strip()

            if user_input.lower() in ["خروج", "exit", "quit"]:
                break

            if not user_input:
                continue

            print_text(f"{Fore.MAGENTA}⟳ جاري المعالجة...{Style.RESET_ALL}")
            response = agent.get_response(user_input)
            print_text(f"\n{Fore.GREEN}الوكيل:{Style.RESET_ALL}\n{response}")

        except KeyboardInterrupt:
            print_text(f"\n{Fore.YELLOW}تم الإيقاف من قبل المستخدم{Style.RESET_ALL}")
            break
        except Exception as e:
            print_text(f"{Fore.RED}خطأ: {e}{Style.RESET_ALL}")


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


def gmail_mode():
    """وضع إدارة Gmail"""
    print(f"\n{Fore.GREEN}مرحباً بك في وضع إدارة Gmail{Style.RESET_ALL}")

    try:
        gmail_agent = GmailAgent(
            credentials_file=config.GMAIL_CREDENTIALS_FILE,
            token_file=config.GMAIL_TOKEN_FILE
        )
    except Exception as e:
        print(f"{Fore.RED}خطأ في إنشاء وكيل Gmail: {e}{Style.RESET_ALL}")
        return

    # المصادقة
    if not gmail_agent.authenticate():
        print(f"{Fore.RED}فشلت المصادقة. يرجى التحقق من الإعدادات{Style.RESET_ALL}")
        return

    while True:
        print(f"\n{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")
        print(f"{Fore.GREEN}قائمة Gmail:{Style.RESET_ALL}")
        print(f"  {Fore.CYAN}1{Style.RESET_ALL}. 📧 قراءة الرسائل غير المقروءة")
        print(f"  {Fore.CYAN}2{Style.RESET_ALL}. 🔍 البحث في الرسائل")
        print(f"  {Fore.CYAN}3{Style.RESET_ALL}. ✍️  كتابة وإرسال رسالة (بمساعدة AI)")
        print(f"  {Fore.CYAN}4{Style.RESET_ALL}. 📝 تلخيص رسالة")
        print(f"  {Fore.CYAN}5{Style.RESET_ALL}. 📊 عرض الإحصائيات")
        print(f"  {Fore.CYAN}6{Style.RESET_ALL}. 🤖 أمر مخصص (AI Command)")
        print(f"  {Fore.CYAN}7{Style.RESET_ALL}. 🧹 تنظيف ذكي للبريد")
        print(f"  {Fore.CYAN}8{Style.RESET_ALL}. العودة للقائمة الرئيسية")
        print(f"{Fore.YELLOW}═══════════════════════════════════════════════════════════{Style.RESET_ALL}")

        choice = input(f"{Fore.CYAN}اختر خياراً:{Style.RESET_ALL} ").strip()

        if choice == "1":
            # قراءة الرسائل غير المقروءة
            num = input(f"{Fore.CYAN}عدد الرسائل (افتراضي 10):{Style.RESET_ALL} ").strip()
            max_results = int(num) if num.isdigit() else 10

            messages = gmail_agent.read_unread_emails(max_results)
            if messages:
                for i, msg in enumerate(messages[:5], 1):
                    print(f"\n{Fore.MAGENTA}── رسالة {i} ──{Style.RESET_ALL}")
                    gmail_agent.print_email(msg, show_body=False)

                # عرض خيارات إضافية
                action = input(f"\n{Fore.CYAN}عرض رسالة كاملة؟ (أدخل الرقم أو enter للتخطي):{Style.RESET_ALL} ").strip()
                if action.isdigit() and 1 <= int(action) <= len(messages):
                    gmail_agent.print_email(messages[int(action) - 1], show_body=True)

        elif choice == "2":
            # البحث
            query = input(f"{Fore.CYAN}أدخل استعلام البحث:{Style.RESET_ALL} ").strip()
            if query:
                messages = gmail_agent.search_emails(query, 10)
                if messages:
                    for i, msg in enumerate(messages[:5], 1):
                        print(f"\n{Fore.MAGENTA}── نتيجة {i} ──{Style.RESET_ALL}")
                        gmail_agent.print_email(msg, show_body=False)

        elif choice == "3":
            # كتابة وإرسال رسالة
            print(f"\n{Fore.GREEN}── كتابة رسالة جديدة بمساعدة AI ──{Style.RESET_ALL}")
            to = input(f"{Fore.CYAN}إلى (البريد الإلكتروني):{Style.RESET_ALL} ").strip()
            subject = input(f"{Fore.CYAN}الموضوع:{Style.RESET_ALL} ").strip()
            context = input(f"{Fore.CYAN}المحتوى أو السياق:{Style.RESET_ALL} ").strip()
            tone = input(f"{Fore.CYAN}النبرة (professional/friendly/formal):{Style.RESET_ALL} ").strip() or 'professional'

            if to and subject and context:
                print(f"\n{Fore.MAGENTA}⟳ جاري صياغة الرسالة...{Style.RESET_ALL}")
                email_body = gmail_agent.compose_email_with_ai(to, subject, context, tone)

                print(f"\n{Fore.GREEN}── الرسالة المُصاغة ──{Style.RESET_ALL}")
                print(email_body)

                confirm = input(f"\n{Fore.CYAN}إرسال الرسالة؟ (y/n):{Style.RESET_ALL} ").strip().lower()
                if confirm == 'y':
                    if gmail_agent.send_email(to, subject, email_body):
                        print(f"{Fore.GREEN}✅ تم إرسال الرسالة بنجاح!{Style.RESET_ALL}")
                    else:
                        print(f"{Fore.RED}❌ فشل إرسال الرسالة{Style.RESET_ALL}")
            else:
                print(f"{Fore.YELLOW}يرجى ملء جميع الحقول{Style.RESET_ALL}")

        elif choice == "4":
            # تلخيص رسالة
            msg_id = input(f"{Fore.CYAN}أدخل معرف الرسالة (أو ابحث أولاً):{Style.RESET_ALL} ").strip()
            if msg_id:
                print(f"\n{Fore.MAGENTA}⟳ جاري التلخيص...{Style.RESET_ALL}")
                summary = gmail_agent.summarize_email(msg_id)
                print(f"\n{Fore.GREEN}── الملخص ──{Style.RESET_ALL}")
                print(summary)
            else:
                # تلخيص الرسائل غير المقروءة
                messages = gmail_agent.read_unread_emails(5)
                if messages:
                    print(f"\n{Fore.MAGENTA}⟳ جاري تحليل الرسائل...{Style.RESET_ALL}")
                    analysis = gmail_agent.analyze_emails_sentiment(messages)
                    print(f"\n{Fore.GREEN}── التحليل ──{Style.RESET_ALL}")
                    print(analysis)

        elif choice == "5":
            # الإحصائيات
            print(f"\n{Fore.MAGENTA}⟳ جاري جمع الإحصائيات...{Style.RESET_ALL}")
            stats = gmail_agent.get_email_statistics()
            print(f"\n{Fore.GREEN}── إحصائيات Gmail ──{Style.RESET_ALL}")
            for key, value in stats.items():
                print(f"  {Fore.CYAN}{key}:{Style.RESET_ALL} {value}")

        elif choice == "6":
            # أمر مخصص
            command = input(f"{Fore.CYAN}أدخل الأمر:{Style.RESET_ALL} ").strip()
            if command:
                print(f"\n{Fore.MAGENTA}⟳ جاري المعالجة...{Style.RESET_ALL}")
                result = gmail_agent.process_command(command)
                print(f"\n{Fore.GREEN}── النتيجة ──{Style.RESET_ALL}")
                print(result)

        elif choice == "7":
            # تنظيف ذكي
            confirm = input(f"{Fore.YELLOW}⚠️  هل أنت متأكد من التنظيف الذكي؟ (y/n):{Style.RESET_ALL} ").strip().lower()
            if confirm == 'y':
                stats = gmail_agent.smart_inbox_cleanup()
                print(f"\n{Fore.GREEN}تم التنظيف:{Style.RESET_ALL}")
                for key, value in stats.items():
                    print(f"  {Fore.CYAN}{key}:{Style.RESET_ALL} {value}")

        elif choice == "8":
            break

        else:
            print(f"{Fore.RED}خيار غير صحيح{Style.RESET_ALL}")


def change_ai_provider():
    """تغيير مزود الذكاء الاصطناعي"""
    print_text(f"\n{Fore.MAGENTA}╔══════════════════════════════════════╗{Style.RESET_ALL}")
    print_text(f"{Fore.MAGENTA}║    اختر مزود الذكاء الاصطناعي{Style.RESET_ALL}      {Fore.MAGENTA}║{Style.RESET_ALL}")
    print_text(f"{Fore.MAGENTA}╚══════════════════════════════════════╝{Style.RESET_ALL}")
    print_text(f"  {Fore.CYAN}1{Style.RESET_ALL}. Claude (Anthropic) - الأفضل للمحادثة والتفكير")
    print_text(f"  {Fore.CYAN}2{Style.RESET_ALL}. Groq - سريع جداً")
    print_text(f"  {Fore.CYAN}3{Style.RESET_ALL}. Ollama - محلي ومجاني")

    choice = input(f"\n{Fore.CYAN}اختر خياراً (1-3):{Style.RESET_ALL} ").strip()

    if choice == "1":
        config.AI_PROVIDER = "claude"
        print_text(f"{Fore.GREEN}✓ تم اختيار Claude{Style.RESET_ALL}")
    elif choice == "2":
        config.AI_PROVIDER = "groq"
        print_text(f"{Fore.GREEN}✓ تم اختيار Groq{Style.RESET_ALL}")
    elif choice == "3":
        config.AI_PROVIDER = "ollama"
        print_text(f"{Fore.GREEN}✓ تم اختيار Ollama{Style.RESET_ALL}")
    else:
        print_text(f"{Fore.RED}خيار غير صحيح{Style.RESET_ALL}")
        return None

    try:
        return BaseAgent(provider=config.AI_PROVIDER)
    except Exception as e:
        print_text(f"{Fore.RED}خطأ في الاتصال: {e}{Style.RESET_ALL}")
        print_text(f"{Fore.YELLOW}يرجى التحقق من إعداد API key في .env{Style.RESET_ALL}")
        return None


def show_settings():
    """عرض الإعدادات"""
    print_text(f"\n{Fore.MAGENTA}╔══════════════════════════════════════╗{Style.RESET_ALL}")
    print_text(f"{Fore.MAGENTA}║         الإعدادات الحالية{Style.RESET_ALL}         {Fore.MAGENTA}║{Style.RESET_ALL}")
    print_text(f"{Fore.MAGENTA}╚══════════════════════════════════════╝{Style.RESET_ALL}")
    print_text(f"  {Fore.CYAN}مزود الخدمة:{Style.RESET_ALL} {config.AI_PROVIDER}")
    if config.AI_PROVIDER == "claude":
        print_text(f"  {Fore.CYAN}النموذج:{Style.RESET_ALL} {config.CLAUDE_MODEL}")
    elif config.AI_PROVIDER == "groq":
        print_text(f"  {Fore.CYAN}النموذج:{Style.RESET_ALL} {config.GROQ_MODEL}")
    else:
        print_text(f"  {Fore.CYAN}النموذج:{Style.RESET_ALL} {config.OLLAMA_MODEL}")
        print_text(f"  {Fore.CYAN}العنوان:{Style.RESET_ALL} {config.OLLAMA_BASE_URL}")
    print_text(f"  {Fore.CYAN}درجة الحرارة:{Style.RESET_ALL} {config.TEMPERATURE}")
    print_text(f"  {Fore.CYAN}الحد الأقصى للرموز:{Style.RESET_ALL} {config.MAX_TOKENS}")
    print_text(f"  {Fore.CYAN}Gmail Credentials:{Style.RESET_ALL} {config.GMAIL_CREDENTIALS_FILE}")
    print_text(f"  {Fore.CYAN}Gmail Token:{Style.RESET_ALL} {config.GMAIL_TOKEN_FILE}")


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
            gmail_mode()
        elif choice == "4":
            new_agent = change_ai_provider()
            if new_agent:
                agent = new_agent
        elif choice == "5":
            show_settings()
        elif choice == "6":
            print_text(f"\n{Fore.GREEN}شكراً لاستخدامك الوكيل الذكي. وداعاً!{Style.RESET_ALL}\n")
            break
        else:
            print_text(f"{Fore.RED}خيار غير صحيح{Style.RESET_ALL}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}\nتم الإيقاف من قبل المستخدم{Style.RESET_ALL}")
        sys.exit(0)
    except Exception as e:
        print(f"{Fore.RED}خطأ غير متوقع: {e}{Style.RESET_ALL}")
        sys.exit(1)
