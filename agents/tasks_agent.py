"""
وكيل المهام - يتولى تنفيذ المهام المحددة
"""
from typing import Optional, Dict, List, Any
from enum import Enum
from colorama import Fore, Style
import sys
import os

# إضافة المسار للوصول إلى modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.brain import BaseAgent


class TaskStatus(str, Enum):
    """حالات المهام"""
    PENDING = "قيد الانتظار"
    IN_PROGRESS = "جاري التنفيذ"
    COMPLETED = "مكتملة"
    FAILED = "فشلت"


class Task:
    """نموذج المهمة"""

    def __init__(self, task_id: str, description: str, priority: int = 1):
        """
        تهيئة المهمة

        Args:
            task_id: معرف فريد للمهمة
            description: وصف المهمة
            priority: الأولوية (1-10)
        """
        self.task_id = task_id
        self.description = description
        self.priority = priority
        self.status = TaskStatus.PENDING
        self.result = None

    def __str__(self):
        return f"[{self.status}] {self.description} (الأولوية: {self.priority})"


class TasksAgent(BaseAgent):
    """وكيل المهام الذي يدير تنفيذ المهام"""

    def __init__(self, provider: Optional[str] = None):
        """تهيئة وكيل المهام"""
        super().__init__(provider)
        self.tasks: Dict[str, Task] = {}
        self.completed_tasks: List[str] = []

    def add_task(self, task_id: str, description: str, priority: int = 1) -> Task:
        """إضافة مهمة جديدة"""
        task = Task(task_id, description, priority)
        self.tasks[task_id] = task
        print(f"{Fore.CYAN}✓ تمت إضافة المهمة: {description}{Style.RESET_ALL}")
        return task

    def list_tasks(self) -> List[Task]:
        """عرض قائمة المهام"""
        tasks = list(self.tasks.values())
        tasks.sort(key=lambda x: x.priority, reverse=True)
        return tasks

    def get_next_task(self) -> Optional[Task]:
        """الحصول على المهمة التالية حسب الأولوية"""
        pending_tasks = [t for t in self.tasks.values() if t.status == TaskStatus.PENDING]
        if not pending_tasks:
            return None
        pending_tasks.sort(key=lambda x: x.priority, reverse=True)
        return pending_tasks[0]

    def execute_task(self, task_id: str) -> str:
        """تنفيذ مهمة محددة"""
        if task_id not in self.tasks:
            return f"{Fore.RED}✗ المهمة غير موجودة{Style.RESET_ALL}"

        task = self.tasks[task_id]
        task.status = TaskStatus.IN_PROGRESS
        print(f"{Fore.YELLOW}⟳ جاري تنفيذ: {task.description}{Style.RESET_ALL}")

        try:
            # إنشاء prompt لتنفيذ المهمة
            prompt = f"""
أنت وكيل مساعد ذكي. قم بتنفيذ المهمة التالية:

المهمة: {task.description}

قدم حلاً منطقياً وعملياً لهذه المهمة.
"""
            result = self.process(prompt)
            task.result = result
            task.status = TaskStatus.COMPLETED
            self.completed_tasks.append(task_id)

            print(f"{Fore.GREEN}✓ تم إكمال المهمة{Style.RESET_ALL}")
            return result

        except Exception as e:
            task.status = TaskStatus.FAILED
            task.result = str(e)
            print(f"{Fore.RED}✗ فشل تنفيذ المهمة: {e}{Style.RESET_ALL}")
            return f"خطأ: {str(e)}"

    def process_all_tasks(self) -> Dict[str, str]:
        """معالجة جميع المهام المعلقة"""
        results = {}
        while True:
            task = self.get_next_task()
            if not task:
                break
            print(f"\n{Fore.BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Style.RESET_ALL}")
            result = self.execute_task(task.task_id)
            results[task.task_id] = result
            print(f"{Fore.BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Style.RESET_ALL}\n")

        return results

    def get_statistics(self) -> Dict[str, Any]:
        """الحصول على إحصائيات المهام"""
        total = len(self.tasks)
        completed = sum(1 for t in self.tasks.values() if t.status == TaskStatus.COMPLETED)
        pending = sum(1 for t in self.tasks.values() if t.status == TaskStatus.PENDING)
        failed = sum(1 for t in self.tasks.values() if t.status == TaskStatus.FAILED)

        return {
            "إجمالي المهام": total,
            "المهام المكتملة": completed,
            "المهام المعلقة": pending,
            "المهام الفاشلة": failed,
            "نسبة الإكمال": f"{(completed/total*100) if total > 0 else 0:.1f}%"
        }

    def print_statistics(self):
        """طباعة الإحصائيات"""
        stats = self.get_statistics()
        print(f"\n{Fore.MAGENTA}╔══════════════════════════════════════╗{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}║       إحصائيات المهام{Style.RESET_ALL}            {Fore.MAGENTA}║{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}╚══════════════════════════════════════╝{Style.RESET_ALL}")
        for key, value in stats.items():
            print(f"  {Fore.CYAN}{key}:{Style.RESET_ALL} {value}")
        print()
