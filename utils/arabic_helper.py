"""
أدوات مساعدة لعرض النص العربي بشكل صحيح في Termux
"""
import sys


def fix_arabic_text(text: str) -> str:
    """
    إصلاح عرض النص العربي في Termux

    يستخدم arabic_reshaper و python-bidi لضمان عرض النص العربي بشكل صحيح
    في الأطراف الطرفية التي لا تدعم RTL

    Args:
        text: النص المراد إصلاحه

    Returns:
        النص المصلح
    """
    try:
        import arabic_reshaper
        from bidi.algorithm import get_display

        # إعادة تشكيل النص العربي لربط الحروف
        reshaped_text = arabic_reshaper.reshape(text)

        # تطبيق خوارزمية BiDi للعرض الصحيح
        bidi_text = get_display(reshaped_text)

        return bidi_text
    except ImportError:
        # إذا لم تكن المكتبات متوفرة، أعد النص كما هو
        return text
    except Exception:
        # في حالة حدوث أي خطأ، أعد النص الأصلي
        return text


def is_termux() -> bool:
    """
    التحقق من أن البرنامج يعمل في Termux

    Returns:
        True إذا كان في Termux، False خلاف ذلك
    """
    return 'com.termux' in sys.executable or 'TERMUX_VERSION' in sys.prefix


def print_arabic(text: str, **kwargs):
    """
    طباعة نص عربي مع إصلاح تلقائي في Termux

    Args:
        text: النص المراد طباعته
        **kwargs: معاملات إضافية لدالة print
    """
    if is_termux():
        text = fix_arabic_text(text)

    print(text, **kwargs)
