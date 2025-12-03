"""
Gmail Integration - وحدة تكامل Gmail
توفر وظائف قراءة وكتابة البريد الإلكتروني عبر Gmail API
"""
import os
import base64
import pickle
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Dict, Optional, Any
from datetime import datetime
import re

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("⚠️  Warning: Google API libraries not installed.")
    print("Install with: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client")


# نطاقات الصلاحيات المطلوبة
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose'
]


class GmailIntegration:
    """فئة تكامل Gmail"""

    def __init__(self, credentials_file: str = 'credentials.json', token_file: str = 'token.pickle'):
        """
        تهيئة تكامل Gmail

        Args:
            credentials_file: ملف بيانات اعتماد OAuth 2.0
            token_file: ملف حفظ التوكن
        """
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.service = None
        self.user_email = None

    def authenticate(self) -> bool:
        """
        مصادقة المستخدم مع Gmail API

        Returns:
            True إذا نجحت المصادقة، False خلاف ذلك
        """
        creds = None

        # تحميل التوكن المحفوظ إن وُجد
        if os.path.exists(self.token_file):
            with open(self.token_file, 'rb') as token:
                creds = pickle.load(token)

        # إذا لم يكن هناك بيانات اعتماد صالحة، قم بتسجيل الدخول
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                except Exception as e:
                    print(f"⚠️  Error refreshing token: {e}")
                    creds = None

            if not creds:
                if not os.path.exists(self.credentials_file):
                    print(f"❌ Credentials file not found: {self.credentials_file}")
                    print("Please download OAuth 2.0 credentials from Google Cloud Console")
                    return False

                try:
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.credentials_file, SCOPES)
                    creds = flow.run_local_server(port=0)
                except Exception as e:
                    print(f"❌ Authentication failed: {e}")
                    return False

            # حفظ التوكن للاستخدام المستقبلي
            with open(self.token_file, 'wb') as token:
                pickle.dump(creds, token)

        try:
            self.service = build('gmail', 'v1', credentials=creds)
            # الحصول على البريد الإلكتروني للمستخدم
            profile = self.service.users().getProfile(userId='me').execute()
            self.user_email = profile.get('emailAddress')
            return True
        except Exception as e:
            print(f"❌ Failed to build Gmail service: {e}")
            return False

    # ================== قراءة البريد ==================

    def list_messages(self, query: str = '', max_results: int = 10,
                     label_ids: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        قائمة الرسائل بناءً على استعلام

        Args:
            query: استعلام البحث (مثل: "is:unread", "from:example@gmail.com")
            max_results: الحد الأقصى لعدد الرسائل
            label_ids: قائمة معرفات التصنيفات (مثل: ['INBOX', 'UNREAD'])

        Returns:
            قائمة الرسائل
        """
        if not self.service:
            print("❌ Not authenticated. Call authenticate() first.")
            return []

        try:
            params = {
                'userId': 'me',
                'maxResults': max_results,
            }

            if query:
                params['q'] = query

            if label_ids:
                params['labelIds'] = label_ids

            results = self.service.users().messages().list(**params).execute()
            messages = results.get('messages', [])

            detailed_messages = []
            for msg in messages:
                detailed_msg = self.get_message(msg['id'])
                if detailed_msg:
                    detailed_messages.append(detailed_msg)

            return detailed_messages

        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return []

    def get_message(self, msg_id: str) -> Optional[Dict[str, Any]]:
        """
        الحصول على تفاصيل رسالة معينة

        Args:
            msg_id: معرف الرسالة

        Returns:
            تفاصيل الرسالة
        """
        if not self.service:
            print("❌ Not authenticated. Call authenticate() first.")
            return None

        try:
            message = self.service.users().messages().get(
                userId='me', id=msg_id, format='full'
            ).execute()

            # استخراج المعلومات المهمة
            headers = message['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'].lower() == 'date'), '')
            to = next((h['value'] for h in headers if h['name'].lower() == 'to'), '')

            # استخراج نص الرسالة
            body = self._get_message_body(message)

            return {
                'id': msg_id,
                'threadId': message.get('threadId'),
                'subject': subject,
                'from': sender,
                'to': to,
                'date': date,
                'snippet': message.get('snippet', ''),
                'body': body,
                'labels': message.get('labelIds', []),
            }

        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return None

    def _get_message_body(self, message: Dict) -> str:
        """استخراج نص الرسالة من البيانات"""
        try:
            if 'parts' in message['payload']:
                parts = message['payload']['parts']
                body = ''
                for part in parts:
                    if part['mimeType'] == 'text/plain':
                        if 'data' in part['body']:
                            body = base64.urlsafe_b64decode(
                                part['body']['data']
                            ).decode('utf-8')
                            break
                    elif part['mimeType'] == 'text/html' and not body:
                        if 'data' in part['body']:
                            html_body = base64.urlsafe_b64decode(
                                part['body']['data']
                            ).decode('utf-8')
                            # إزالة علامات HTML
                            body = re.sub('<[^<]+?>', '', html_body)
                return body
            else:
                if 'data' in message['payload']['body']:
                    return base64.urlsafe_b64decode(
                        message['payload']['body']['data']
                    ).decode('utf-8')
        except Exception as e:
            print(f"⚠️  Error extracting body: {e}")

        return message.get('snippet', '')

    def get_unread_messages(self, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        الحصول على الرسائل غير المقروءة

        Args:
            max_results: الحد الأقصى لعدد الرسائل

        Returns:
            قائمة الرسائل غير المقروءة
        """
        return self.list_messages(query='is:unread', max_results=max_results)

    def search_messages(self, search_term: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        البحث في الرسائل

        Args:
            search_term: مصطلح البحث
            max_results: الحد الأقصى لعدد النتائج

        Returns:
            قائمة الرسائل المطابقة
        """
        return self.list_messages(query=search_term, max_results=max_results)

    # ================== كتابة وإرسال البريد ==================

    def send_message(self, to: str, subject: str, body: str,
                    cc: Optional[str] = None, bcc: Optional[str] = None,
                    html: bool = False) -> Optional[Dict]:
        """
        إرسال رسالة بريد إلكتروني

        Args:
            to: البريد الإلكتروني للمستلم
            subject: موضوع الرسالة
            body: نص الرسالة
            cc: نسخة كربونية
            bcc: نسخة كربونية مخفية
            html: True إذا كان النص بصيغة HTML

        Returns:
            معلومات الرسالة المُرسلة أو None
        """
        if not self.service:
            print("❌ Not authenticated. Call authenticate() first.")
            return None

        try:
            message = MIMEMultipart() if html else MIMEText(body)

            if html:
                message.attach(MIMEText(body, 'html'))

            message['to'] = to
            message['subject'] = subject

            if cc:
                message['cc'] = cc
            if bcc:
                message['bcc'] = bcc

            raw_message = base64.urlsafe_b64encode(
                message.as_bytes()
            ).decode('utf-8')

            sent_message = self.service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()

            print(f"✅ Message sent successfully! ID: {sent_message['id']}")
            return sent_message

        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return None

    def reply_to_message(self, msg_id: str, body: str,
                        reply_all: bool = False) -> Optional[Dict]:
        """
        الرد على رسالة

        Args:
            msg_id: معرف الرسالة المراد الرد عليها
            body: نص الرد
            reply_all: الرد على الجميع

        Returns:
            معلومات الرد المُرسل
        """
        if not self.service:
            print("❌ Not authenticated. Call authenticate() first.")
            return None

        try:
            # الحصول على الرسالة الأصلية
            original = self.get_message(msg_id)
            if not original:
                return None

            message = MIMEText(body)
            message['to'] = original['from']
            message['subject'] = f"Re: {original['subject']}"
            message['In-Reply-To'] = msg_id
            message['References'] = msg_id

            if reply_all and original.get('to'):
                # إضافة المستلمين الآخرين
                message['cc'] = original['to']

            raw_message = base64.urlsafe_b64encode(
                message.as_bytes()
            ).decode('utf-8')

            sent_message = self.service.users().messages().send(
                userId='me',
                body={
                    'raw': raw_message,
                    'threadId': original['threadId']
                }
            ).execute()

            print(f"✅ Reply sent successfully!")
            return sent_message

        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return None

    # ================== إدارة الرسائل ==================

    def mark_as_read(self, msg_id: str) -> bool:
        """
        وضع علامة مقروء على رسالة

        Args:
            msg_id: معرف الرسالة

        Returns:
            True إذا نجحت العملية
        """
        if not self.service:
            return False

        try:
            self.service.users().messages().modify(
                userId='me',
                id=msg_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
            return True
        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return False

    def mark_as_unread(self, msg_id: str) -> bool:
        """
        وضع علامة غير مقروء على رسالة

        Args:
            msg_id: معرف الرسالة

        Returns:
            True إذا نجحت العملية
        """
        if not self.service:
            return False

        try:
            self.service.users().messages().modify(
                userId='me',
                id=msg_id,
                body={'addLabelIds': ['UNREAD']}
            ).execute()
            return True
        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return False

    def delete_message(self, msg_id: str, permanent: bool = False) -> bool:
        """
        حذف رسالة

        Args:
            msg_id: معرف الرسالة
            permanent: حذف نهائي (True) أو نقل إلى المهملات (False)

        Returns:
            True إذا نجحت العملية
        """
        if not self.service:
            return False

        try:
            if permanent:
                self.service.users().messages().delete(
                    userId='me', id=msg_id
                ).execute()
            else:
                self.service.users().messages().trash(
                    userId='me', id=msg_id
                ).execute()

            print(f"✅ Message {'permanently deleted' if permanent else 'moved to trash'}")
            return True
        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return False

    def add_label(self, msg_id: str, label_id: str) -> bool:
        """
        إضافة تصنيف لرسالة

        Args:
            msg_id: معرف الرسالة
            label_id: معرف التصنيف

        Returns:
            True إذا نجحت العملية
        """
        if not self.service:
            return False

        try:
            self.service.users().messages().modify(
                userId='me',
                id=msg_id,
                body={'addLabelIds': [label_id]}
            ).execute()
            return True
        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return False

    def get_labels(self) -> List[Dict[str, Any]]:
        """
        الحصول على جميع التصنيفات

        Returns:
            قائمة التصنيفات
        """
        if not self.service:
            return []

        try:
            results = self.service.users().labels().list(userId='me').execute()
            return results.get('labels', [])
        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return []

    # ================== إحصائيات ==================

    def get_statistics(self) -> Dict[str, int]:
        """
        الحصول على إحصائيات البريد

        Returns:
            قاموس بالإحصائيات
        """
        if not self.service:
            return {}

        try:
            profile = self.service.users().getProfile(userId='me').execute()

            stats = {
                'total_messages': profile.get('messagesTotal', 0),
                'total_threads': profile.get('threadsTotal', 0),
            }

            # عدد الرسائل غير المقروءة
            unread = self.service.users().messages().list(
                userId='me', q='is:unread', maxResults=1
            ).execute()
            stats['unread_count'] = unread.get('resultSizeEstimate', 0)

            return stats

        except HttpError as error:
            print(f"❌ An error occurred: {error}")
            return {}
