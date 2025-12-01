"""
إعدادات المشروع الأساسية
"""
import os
from dotenv import load_dotenv

# تحميل متغيرات البيئة
load_dotenv()

class Config:
    """إعدادات المشروع"""

    # Groq API Settings
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")

    # Ollama Settings
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")

    # Agent Settings
    AI_PROVIDER = os.getenv("AI_PROVIDER", "groq")  # "groq" أو "ollama"
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2048"))
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))

    # Project Settings
    PROJECT_NAME = "ذكي الوكيل - Intelligent Agent"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# إنشاء نسخة واحدة من الإعدادات
config = Config()
