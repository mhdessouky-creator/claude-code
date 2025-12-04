"""
إعدادات المشروع الأساسية
"""
import os
from dotenv import load_dotenv

# تحميل متغيرات البيئة
load_dotenv()

class Config:
    """إعدادات المشروع"""

    # Anthropic Claude API Settings
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20241022")

    # Groq API Settings
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")

    # Ollama Settings
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")

    # Agent Settings
    AI_PROVIDER = os.getenv("AI_PROVIDER", "claude")  # "claude" أو "groq" أو "ollama"
    MAX_TOKENS = int(os.getenv("MAX_TOKENS", "2048"))
    TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))

    # Project Settings
    PROJECT_NAME = "ذكي الوكيل - Intelligent Agent"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # Gmail Settings
    GMAIL_CREDENTIALS_FILE = os.getenv("GMAIL_CREDENTIALS_FILE", "credentials.json")
    GMAIL_TOKEN_FILE = os.getenv("GMAIL_TOKEN_FILE", "token.pickle")

# إنشاء نسخة واحدة من الإعدادات
config = Config()
