"""
Gmail Agent - وكيل Gmail الذكي
يستخدم الذكاء الاصطناعي لإدارة البريد الإلكتروني
"""
import sys
import os
from typing import List, Dict, Optional, Any
from colorama import Fore, Style

# إضافة المسار للوصول إلى modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.brain import BaseAgent
from integrations.gmail_integration import GmailIntegration


class GmailAgent(BaseAgent):
    """وكيل ذكي لإدارة Gmail"""

    def __init__(self, credentials_file: str = 'credentials.json',
                 token_file: str = 'token.pickle'):
        """
        تهيئة وكيل Gmail

        Args:
            credentials_file: ملف بيانات اعتماد OAuth 2.0
            token_file: ملف حفظ التوكن
        """
        super().__init__()
        self.gmail = GmailIntegration(credentials_file, token_file)
        self.authenticated = False

        # تخصيص System Prompt للوكيل
        self.system_prompt = """أنت وكيل ذكي متخصص في إدارة البريد الإلكتروني على Gmail.
مهامك تشمل:
- قراءة وتحليل الرسائل
- كتابة وإرسال الرسائل
- تنظيم البريد الإلكتروني
- الرد على الرسائل بشكل احترافي
- تلخيص الرسائل المهمة
- تصفية وتصنيف الرسائل

تعامل بطريقة احترافية وودية. قدم إجابات واضحة ومفيدة."""

    def authenticate(self) -> bool:
        """مصادقة مع Gmail"""
        print(f"{Fore.CYAN}🔐 Authenticating with Gmail...{Style.RESET_ALL}")
        self.authenticated = self.gmail.authenticate()

        if self.authenticated:
            print(f"{Fore.GREEN}✅ Successfully authenticated as: {self.gmail.user_email}{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}❌ Authentication failed{Style.RESET_ALL}")

        return self.authenticated

    def ensure_authenticated(self) -> bool:
        """التأكد من المصادقة"""
        if not self.authenticated:
            return self.authenticate()
        return True

    # ================== قراءة البريد ==================

    def read_unread_emails(self, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        قراءة الرسائل غير المقروءة

        Args:
            max_results: عدد الرسائل

        Returns:
            قائمة الرسائل
        """
        if not self.ensure_authenticated():
            return []

        print(f"{Fore.CYAN}📧 Fetching unread emails...{Style.RESET_ALL}")
        messages = self.gmail.get_unread_messages(max_results)

        if messages:
            print(f"{Fore.GREEN}✅ Found {len(messages)} unread messages{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}ℹ️  No unread messages{Style.RESET_ALL}")

        return messages

    def search_emails(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        البحث في الرسائل

        Args:
            query: استعلام البحث
            max_results: عدد النتائج

        Returns:
            قائمة الرسائل
        """
        if not self.ensure_authenticated():
            return []

        print(f"{Fore.CYAN}🔍 Searching for: {query}{Style.RESET_ALL}")
        messages = self.gmail.search_messages(query, max_results)

        if messages:
            print(f"{Fore.GREEN}✅ Found {len(messages)} messages{Style.RESET_ALL}")
        else:
            print(f"{Fore.YELLOW}ℹ️  No messages found{Style.RESET_ALL}")

        return messages

    def get_email_by_id(self, msg_id: str) -> Optional[Dict[str, Any]]:
        """
        الحصول على رسالة معينة

        Args:
            msg_id: معرف الرسالة

        Returns:
            تفاصيل الرسالة
        """
        if not self.ensure_authenticated():
            return None

        return self.gmail.get_message(msg_id)

    # ================== تحليل البريد بالذكاء الاصطناعي ==================

    def summarize_email(self, msg_id: str) -> str:
        """
        تلخيص رسالة بالذكاء الاصطناعي

        Args:
            msg_id: معرف الرسالة

        Returns:
            ملخص الرسالة
        """
        if not self.ensure_authenticated():
            return "Failed to authenticate"

        message = self.gmail.get_message(msg_id)
        if not message:
            return "Failed to retrieve message"

        prompt = f"""لخص هذه الرسالة بشكل موجز ومفيد:

من: {message['from']}
الموضوع: {message['subject']}
التاريخ: {message['date']}

النص:
{message['body'][:1000]}

قدم ملخصاً يتضمن:
1. الفكرة الرئيسية
2. النقاط المهمة
3. أي إجراءات مطلوبة"""

        return self.get_response(prompt)

    def analyze_emails_sentiment(self, messages: List[Dict[str, Any]]) -> str:
        """
        تحليل المشاعر في مجموعة من الرسائل

        Args:
            messages: قائمة الرسائل

        Returns:
            تحليل المشاعر
        """
        if not messages:
            return "No messages to analyze"

        emails_text = "\n\n".join([
            f"From: {msg['from']}\nSubject: {msg['subject']}\nSnippet: {msg['snippet']}"
            for msg in messages[:5]  # تحليل أول 5 رسائل
        ])

        prompt = f"""حلل المشاعر العامة في هذه الرسائل:

{emails_text}

قدم:
1. المشاعر السائدة (إيجابية/سلبية/محايدة)
2. المواضيع المشتركة
3. مستوى الأهمية/الاستعجال"""

        return self.get_response(prompt)

    def categorize_emails(self, messages: List[Dict[str, Any]]) -> Dict[str, List[Dict]]:
        """
        تصنيف الرسائل حسب الموضوع

        Args:
            messages: قائمة الرسائل

        Returns:
            رسائل مصنفة
        """
        categories = {
            'urgent': [],
            'work': [],
            'personal': [],
            'newsletters': [],
            'spam': [],
            'other': []
        }

        for msg in messages:
            subject = msg['subject'].lower()
            sender = msg['from'].lower()
            snippet = msg['snippet'].lower()

            # تصنيف بسيط
            if any(word in subject or word in snippet for word in ['urgent', 'important', 'asap', 'عاجل', 'مهم']):
                categories['urgent'].append(msg)
            elif any(word in subject or word in snippet for word in ['meeting', 'project', 'work', 'عمل', 'اجتماع']):
                categories['work'].append(msg)
            elif 'unsubscribe' in sender or 'newsletter' in subject:
                categories['newsletters'].append(msg)
            else:
                categories['other'].append(msg)

        return categories

    # ================== كتابة وإرسال البريد ==================

    def compose_email_with_ai(self, to: str, subject: str, context: str,
                             tone: str = 'professional') -> str:
        """
        صياغة رسالة بالذكاء الاصطناعي

        Args:
            to: المستلم
            subject: الموضوع
            context: السياق أو المحتوى المطلوب
            tone: نبرة الرسالة (professional, friendly, formal)

        Returns:
            نص الرسالة
        """
        tone_instructions = {
            'professional': 'احترافية ورسمية',
            'friendly': 'ودية وغير رسمية',
            'formal': 'رسمية جداً',
        }

        prompt = f"""اكتب رسالة بريد إلكتروني بنبرة {tone_instructions.get(tone, 'احترافية')}:

إلى: {to}
الموضوع: {subject}

السياق/المحتوى المطلوب:
{context}

اكتب رسالة كاملة جاهزة للإرسال، مع:
- تحية مناسبة
- نص واضح ومنظم
- خاتمة مهذبة
- توقيع بسيط"""

        return self.get_response(prompt)

    def send_email(self, to: str, subject: str, body: str,
                  cc: Optional[str] = None, bcc: Optional[str] = None) -> bool:
        """
        إرسال رسالة

        Args:
            to: المستلم
            subject: الموضوع
            body: النص
            cc: نسخة
            bcc: نسخة مخفية

        Returns:
            True إذا تم الإرسال بنجاح
        """
        if not self.ensure_authenticated():
            return False

        result = self.gmail.send_message(to, subject, body, cc, bcc)
        return result is not None

    def reply_with_ai(self, msg_id: str, context: Optional[str] = None,
                     reply_all: bool = False) -> bool:
        """
        الرد على رسالة بالذكاء الاصطناعي

        Args:
            msg_id: معرف الرسالة
            context: سياق إضافي للرد
            reply_all: الرد على الجميع

        Returns:
            True إذا تم الإرسال بنجاح
        """
        if not self.ensure_authenticated():
            return False

        message = self.gmail.get_message(msg_id)
        if not message:
            return False

        prompt = f"""اكتب رداً احترافياً على هذه الرسالة:

من: {message['from']}
الموضوع: {message['subject']}

الرسالة الأصلية:
{message['body'][:500]}

{'سياق إضافي: ' + context if context else ''}

اكتب رداً مناسباً ومهذباً."""

        reply_text = self.get_response(prompt)

        result = self.gmail.reply_to_message(msg_id, reply_text, reply_all)
        return result is not None

    # ================== إدارة متقدمة ==================

    def smart_inbox_cleanup(self) -> Dict[str, int]:
        """
        تنظيف ذكي للبريد الوارد

        Returns:
            إحصائيات التنظيف
        """
        if not self.ensure_authenticated():
            return {}

        print(f"{Fore.CYAN}🧹 Starting smart inbox cleanup...{Style.RESET_ALL}")

        # جلب رسائل النشرات والبريد الترويجي
        newsletters = self.gmail.search_messages('category:promotions OR unsubscribe', max_results=50)

        stats = {
            'newsletters_found': len(newsletters),
            'moved_to_trash': 0,
        }

        # نقل الرسائل القديمة إلى المهملات
        for msg in newsletters:
            # يمكن إضافة منطق أكثر ذكاءً هنا
            pass

        print(f"{Fore.GREEN}✅ Cleanup completed!{Style.RESET_ALL}")
        return stats

    def get_email_statistics(self) -> Dict[str, Any]:
        """
        الحصول على إحصائيات البريد

        Returns:
            قاموس بالإحصائيات
        """
        if not self.ensure_authenticated():
            return {}

        stats = self.gmail.get_statistics()

        # إضافة تحليل إضافي
        unread = self.gmail.get_unread_messages(max_results=100)
        if unread:
            categories = self.categorize_emails(unread)
            stats['unread_by_category'] = {
                cat: len(msgs) for cat, msgs in categories.items() if msgs
            }

        return stats

    def print_email(self, message: Dict[str, Any], show_body: bool = False):
        """
        طباعة رسالة بشكل منسق

        Args:
            message: الرسالة
            show_body: عرض النص الكامل
        """
        print(f"\n{Fore.CYAN}{'='*70}{Style.RESET_ALL}")
        print(f"{Fore.GREEN}From:{Style.RESET_ALL} {message['from']}")
        print(f"{Fore.GREEN}Subject:{Style.RESET_ALL} {message['subject']}")
        print(f"{Fore.GREEN}Date:{Style.RESET_ALL} {message['date']}")
        print(f"{Fore.GREEN}Labels:{Style.RESET_ALL} {', '.join(message.get('labels', []))}")

        if show_body:
            print(f"\n{Fore.YELLOW}Body:{Style.RESET_ALL}")
            print(message['body'][:500] + ('...' if len(message['body']) > 500 else ''))
        else:
            print(f"\n{Fore.YELLOW}Preview:{Style.RESET_ALL}")
            print(message['snippet'])

        print(f"{Fore.CYAN}{'='*70}{Style.RESET_ALL}")

    # ================== أوامر صوتية/نصية متقدمة ==================

    def process_command(self, command: str) -> str:
        """
        معالجة أمر نصي معقد

        Args:
            command: الأمر (مثل: "أرسل رسالة شكر لأحمد", "لخص آخر 5 رسائل")

        Returns:
            النتيجة
        """
        command_lower = command.lower()

        # أوامر القراءة
        if any(word in command_lower for word in ['اقرأ', 'عرض', 'أظهر', 'read', 'show']):
            if 'غير مقروء' in command_lower or 'unread' in command_lower:
                messages = self.read_unread_emails(10)
                if messages:
                    for i, msg in enumerate(messages[:5], 1):
                        print(f"\n{i}. ", end='')
                        self.print_email(msg)
                    return f"Found {len(messages)} unread messages"
                return "No unread messages"

        # أوامر التلخيص
        elif any(word in command_lower for word in ['لخص', 'summarize', 'summary']):
            messages = self.read_unread_emails(5)
            if messages:
                return self.analyze_emails_sentiment(messages)
            return "No messages to summarize"

        # أوامر الإرسال
        elif any(word in command_lower for word in ['أرسل', 'send', 'اكتب', 'write']):
            return "Please use the compose_email_with_ai() method or provide: recipient, subject, and context"

        # أوامر البحث
        elif any(word in command_lower for word in ['ابحث', 'search', 'find']):
            # استخراج مصطلح البحث
            query = command.split('عن')[-1].strip() if 'عن' in command else command
            messages = self.search_emails(query, 10)
            return f"Found {len(messages)} messages"

        # أمر عام - استخدام الذكاء الاصطناعي
        else:
            return self.get_response(f"""أنت وكيل Gmail ذكي. المستخدم طلب:
{command}

كيف يمكنك مساعدته؟ اشرح الخطوات أو نفذ المهمة إن أمكن.""")
