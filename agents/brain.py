"""
الوكيل الأساسي الذي يتولى معالجة المعلومات والمنطق
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from colorama import Fore, Style
import sys
import os

# إضافة المسار للوصول إلى config
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import config


class Message(BaseModel):
    """نموذج الرسالة"""
    role: str  # "user" أو "assistant"
    content: str


class BaseAgent:
    """الوكيل الأساسي الذي يتعامل مع الاتصال بنموذج اللغة"""

    def __init__(self, provider: Optional[str] = None):
        """
        تهيئة الوكيل الأساسي

        Args:
            provider: مزود الخدمة ("groq" أو "ollama")
        """
        self.provider = provider or config.AI_PROVIDER
        self.conversation_history: List[Message] = []
        self.model = None

        if self.provider == "groq":
            self._init_groq()
        elif self.provider == "ollama":
            self._init_ollama()
        else:
            raise ValueError(f"مزود غير معروف: {self.provider}")

    def _init_groq(self):
        """تهيئة Groq API"""
        try:
            from groq import Groq
            self.model = Groq(api_key=config.GROQ_API_KEY)
            print(f"{Fore.GREEN}✓ تم الاتصال بـ Groq بنجاح{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}✗ خطأ في الاتصال بـ Groq: {e}{Style.RESET_ALL}")
            raise

    def _init_ollama(self):
        """تهيئة Ollama"""
        try:
            import ollama
            self.model = ollama
            print(f"{Fore.GREEN}✓ تم الاتصال بـ Ollama بنجاح{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}✗ خطأ في الاتصال بـ Ollama: {e}{Style.RESET_ALL}")
            raise

    def add_to_history(self, role: str, content: str):
        """إضافة رسالة إلى السجل"""
        self.conversation_history.append(Message(role=role, content=content))

    def get_history_for_api(self) -> List[Dict[str, str]]:
        """الحصول على السجل بصيغة API"""
        return [{"role": msg.role, "content": msg.content} for msg in self.conversation_history]

    def process_with_groq(self, prompt: str) -> str:
        """معالجة الطلب باستخدام Groq"""
        try:
            self.add_to_history("user", prompt)

            response = self.model.chat.completions.create(
                model=config.GROQ_MODEL,
                messages=self.get_history_for_api(),
                max_tokens=config.MAX_TOKENS,
                temperature=config.TEMPERATURE,
            )

            assistant_message = response.choices[0].message.content
            self.add_to_history("assistant", assistant_message)
            return assistant_message

        except Exception as e:
            error_msg = f"خطأ في معالجة الطلب: {str(e)}"
            print(f"{Fore.RED}{error_msg}{Style.RESET_ALL}")
            return error_msg

    def process_with_ollama(self, prompt: str) -> str:
        """معالجة الطلب باستخدام Ollama"""
        try:
            self.add_to_history("user", prompt)

            response = self.model.chat(
                model=config.OLLAMA_MODEL,
                messages=self.get_history_for_api(),
                stream=False,
            )

            assistant_message = response.get("message", {}).get("content", "")
            self.add_to_history("assistant", assistant_message)
            return assistant_message

        except Exception as e:
            error_msg = f"خطأ في معالجة الطلب: {str(e)}"
            print(f"{Fore.RED}{error_msg}{Style.RESET_ALL}")
            return error_msg

    def process(self, prompt: str) -> str:
        """
        معالجة الطلب الأساسي

        Args:
            prompt: الرسالة المراد معالجتها

        Returns:
            الرد من النموذج
        """
        if self.provider == "groq":
            return self.process_with_groq(prompt)
        else:
            return self.process_with_ollama(prompt)

    def clear_history(self):
        """مسح السجل"""
        self.conversation_history.clear()

    def get_response(self, prompt: str) -> str:
        """الحصول على رد من النموذج"""
        return self.process(prompt)
