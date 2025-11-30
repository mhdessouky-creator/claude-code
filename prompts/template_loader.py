#!/usr/bin/env python3
"""
Prompt Template Loader for Python
تحميل واستخدام قوالب Prompts بسهولة
"""

import json
import os
from typing import Dict, List, Optional, Any
from anthropic_skills import AnthropicSkills


class PromptTemplateLoader:
    """محمّل قوالب Prompts مع دعم الاستبدال التلقائي"""

    def __init__(self, templates_path: str = "prompts/prompt-templates.json"):
        """
        تهيئة المحمّل

        Args:
            templates_path: مسار ملف القوالب
        """
        self.templates_path = templates_path
        self.templates = self._load_templates()
        self.claude = None

    def _load_templates(self) -> Dict[str, Any]:
        """تحميل القوالب من الملف"""
        with open(self.templates_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return {t['id']: t for t in data['templates']}

    def get_template(self, template_id: str) -> Optional[Dict]:
        """
        الحصول على قالب بواسطة ID

        Args:
            template_id: معرّف القالب

        Returns:
            القالب أو None
        """
        return self.templates.get(template_id)

    def list_templates(self, integration: Optional[str] = None) -> List[Dict]:
        """
        عرض جميع القوالب أو القوالب الخاصة بـ integration معين

        Args:
            integration: اسم الـ integration (اختياري)

        Returns:
            قائمة القوالب
        """
        if integration:
            return [t for t in self.templates.values() if t['integration'] == integration]
        return list(self.templates.values())

    def render_prompt(self, template_id: str, **kwargs) -> Dict[str, str]:
        """
        تطبيق القالب مع استبدال المتغيرات

        Args:
            template_id: معرّف القالب
            **kwargs: المتغيرات للاستبدال

        Returns:
            dict مع system_message و user_message جاهزين
        """
        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template '{template_id}' not found")

        system_message = template['system_message']
        user_message = template['user_message']

        # استبدال placeholders
        for key, value in kwargs.items():
            placeholder = f"{{{{{key}}}}}"
            user_message = user_message.replace(placeholder, str(value))

        return {
            'system': system_message,
            'user': user_message,
            'template_id': template_id,
            'integration': template['integration']
        }

    def execute_template(
        self,
        template_id: str,
        api_key: Optional[str] = None,
        model: str = "claude-sonnet-4-5",
        max_tokens: int = 4096,
        **kwargs
    ) -> str:
        """
        تنفيذ قالب مباشرة مع Claude

        Args:
            template_id: معرّف القالب
            api_key: مفتاح Anthropic API (اختياري)
            model: النموذج المستخدم
            max_tokens: حد التوكنات
            **kwargs: متغيرات القالب

        Returns:
            رد Claude
        """
        # تهيئة Claude إذا لم يكن مهيأً
        if not self.claude:
            self.claude = AnthropicSkills(api_key=api_key)

        template = self.get_template(template_id)
        if not template:
            raise ValueError(f"Template '{template_id}' not found")

        # إضافة الـ skill المطلوب
        integration = template['integration']
        skill_url = self._get_skill_url(integration)

        self.claude.add_skill({
            'name': integration,
            'type': 'url',
            'url': skill_url
        })

        # تطبيق القالب
        rendered = self.render_prompt(template_id, **kwargs)

        # تنفيذ
        response = self.claude.chat(
            prompt=rendered['user'],
            system=rendered['system'],
            model=model,
            max_tokens=max_tokens
        )

        return response

    def _get_skill_url(self, integration: str) -> str:
        """الحصول على URL الخاص بـ integration"""
        urls = {
            'google-workspace': 'http://localhost:3001',
            'notion': 'http://localhost:3002',
            'airtable': 'http://localhost:3003',
            'telegram': 'http://localhost:3004',
            'whatsapp': 'http://localhost:3005',
            'twitter': 'http://localhost:3006',
            'reddit': 'http://localhost:3007',
            'filesystem': 'http://localhost:3008'
        }
        return urls.get(integration, 'http://localhost:3001')

    def get_token_estimate(self, template_id: str) -> int:
        """الحصول على تقدير التوكنات للقالب"""
        template = self.get_template(template_id)
        return template.get('token_estimate', 0) if template else 0

    def get_tips(self, template_id: str) -> List[str]:
        """الحصول على نصائح توفير التوكنات"""
        template = self.get_template(template_id)
        return template.get('token_saving_tips', []) if template else []


# أمثلة للاستخدام
if __name__ == '__main__':
    # تهيئة المحمّل
    loader = PromptTemplateLoader()

    # مثال 1: عرض جميع قوالب Google Workspace
    print("📧 Google Workspace Templates:")
    for template in loader.list_templates('google-workspace'):
        print(f"  - {template['id']}: {template['intent']}")

    print("\n" + "="*50 + "\n")

    # مثال 2: تطبيق قالب
    rendered = loader.render_prompt(
        'gw_create_calendar_event',
        title='اجتماع الفريق',
        date='2025-12-01',
        time='14:00',
        duration='60min',
        attendees='team@company.com',
        description='مراجعة Q1'
    )

    print("📋 Rendered Prompt:")
    print(f"System: {rendered['system']}")
    print(f"User: {rendered['user']}")

    print("\n" + "="*50 + "\n")

    # مثال 3: تقدير التوكنات
    estimate = loader.get_token_estimate('gw_create_calendar_event')
    print(f"💡 Token Estimate: ~{estimate} tokens")

    # مثال 4: نصائح توفير التوكنات
    tips = loader.get_tips('gw_create_calendar_event')
    print("\n🎯 Token Saving Tips:")
    for tip in tips:
        print(f"  • {tip}")

    print("\n" + "="*50 + "\n")

    # مثال 5: تنفيذ مباشر (يحتاج API key)
    # response = loader.execute_template(
    #     'gw_send_email_draft',
    #     to='client@example.com',
    #     subject='متابعة',
    #     body='شكراً للاجتماع',
    #     cc=''
    # )
    # print(f"Response: {response}")
