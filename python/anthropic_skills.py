#!/usr/bin/env python3
"""
Anthropic Skills Integration for Python
Provides integration with Claude Code Skills API
"""

import os
from anthropic import Anthropic

class AnthropicSkills:
    """
    Anthropic Skills wrapper for Python
    Enables using Claude Code skills from Python applications
    """

    def __init__(self, api_key=None):
        """Initialize Anthropic client with skills support"""
        self.api_key = api_key or os.environ.get('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is required")

        self.client = Anthropic(api_key=self.api_key)
        self.skills = []

    def add_skill(self, skill_config):
        """
        Add a skill to the session

        Args:
            skill_config (dict): Skill configuration
                {
                    'name': 'skill-name',
                    'type': 'url' or 'command',
                    'url': 'https://...' (for url type),
                    'command': 'command to run' (for command type),
                    'authorization_token': 'token' (optional)
                }
        """
        self.skills.append(skill_config)
        return self

    def create_message(self, messages, model="claude-sonnet-4-5", max_tokens=4096, **kwargs):
        """
        Create a message with skills enabled

        Args:
            messages (list): List of message dictionaries
            model (str): Model to use
            max_tokens (int): Maximum tokens in response
            **kwargs: Additional parameters

        Returns:
            Response from Claude with skills support
        """
        params = {
            'model': model,
            'max_tokens': max_tokens,
            'messages': messages,
            **kwargs
        }

        # Add skills if configured
        if self.skills:
            params['betas'] = ['skills-2025-05-14']
            params['skills'] = self.skills

        return self.client.messages.create(**params)

    def chat(self, prompt, system=None, model="claude-sonnet-4-5", max_tokens=4096):
        """
        Simple chat interface with skills

        Args:
            prompt (str): User prompt
            system (str): Optional system prompt
            model (str): Model to use
            max_tokens (int): Maximum tokens

        Returns:
            str: Response text
        """
        messages = [{'role': 'user', 'content': prompt}]

        params = {
            'messages': messages,
            'model': model,
            'max_tokens': max_tokens
        }

        if system:
            params['system'] = system

        response = self.create_message(**params)
        return response.content[0].text

    def clear_skills(self):
        """Clear all configured skills"""
        self.skills = []
        return self


# Example usage
if __name__ == '__main__':
    # Initialize with skills
    claude = AnthropicSkills()

    # Example 1: Add MCP skills
    claude.add_skill({
        'name': 'google-workspace',
        'type': 'url',
        'url': 'http://localhost:3001'
    })

    claude.add_skill({
        'name': 'notion',
        'type': 'url',
        'url': 'http://localhost:3002'
    })

    # Example 2: Use skills in conversation
    response = claude.chat(
        prompt="Check my Gmail for unread emails and create a summary in Notion",
        system="You are a helpful AI assistant with access to various productivity tools."
    )

    print(response)

    # Example 3: Advanced usage with message history
    messages = [
        {'role': 'user', 'content': 'What tools do you have available?'},
    ]

    response = claude.create_message(messages=messages)
    print(response.content[0].text)
