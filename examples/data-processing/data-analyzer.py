"""
Data Analyzer - محلل البيانات
مثال على معالجة وتحليل البيانات باستخدام Python
Example of data processing and analysis using Python
Created with Claude Code
"""

import json
from datetime import datetime
from collections import Counter
from typing import List, Dict, Any


class DataAnalyzer:
    """فئة لتحليل البيانات - Class for data analysis"""

    def __init__(self, data: List[Dict[str, Any]] = None):
        """تهيئة المحلل - Initialize analyzer"""
        self.data = data or []

    def load_from_json(self, filepath: str):
        """تحميل البيانات من ملف JSON - Load data from JSON file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"تم تحميل {len(self.data)} سجل")
            return True
        except Exception as e:
            print(f"خطأ في تحميل البيانات: {e}")
            return False

    def save_to_json(self, filepath: str):
        """حفظ البيانات في ملف JSON - Save data to JSON file"""
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            print(f"تم حفظ {len(self.data)} سجل")
            return True
        except Exception as e:
            print(f"خطأ في حفظ البيانات: {e}")
            return False

    def filter_by_key(self, key: str, value: Any) -> List[Dict]:
        """تصفية البيانات بناءً على مفتاح وقيمة
        Filter data by key and value
        """
        return [item for item in self.data if item.get(key) == value]

    def group_by_key(self, key: str) -> Dict[Any, List[Dict]]:
        """تجميع البيانات بناءً على مفتاح - Group data by key"""
        groups = {}
        for item in self.data:
            value = item.get(key)
            if value not in groups:
                groups[value] = []
            groups[value].append(item)
        return groups

    def count_by_key(self, key: str) -> Dict[Any, int]:
        """عد القيم الفريدة لمفتاح معين
        Count unique values for a given key
        """
        values = [item.get(key) for item in self.data if key in item]
        return dict(Counter(values))

    def get_statistics(self, key: str) -> Dict[str, float]:
        """حساب الإحصائيات لمفتاح رقمي
        Calculate statistics for a numeric key
        """
        values = [item.get(key) for item in self.data
                 if key in item and isinstance(item.get(key), (int, float))]

        if not values:
            return {}

        return {
            'count': len(values),
            'sum': sum(values),
            'mean': sum(values) / len(values),
            'min': min(values),
            'max': max(values),
            'median': sorted(values)[len(values) // 2]
        }

    def search(self, search_term: str, keys: List[str] = None) -> List[Dict]:
        """البحث في البيانات - Search in data"""
        results = []
        search_term = str(search_term).lower()

        for item in self.data:
            if keys:
                search_fields = {k: v for k, v in item.items() if k in keys}
            else:
                search_fields = item

            for value in search_fields.values():
                if search_term in str(value).lower():
                    results.append(item)
                    break

        return results

    def sort_by_key(self, key: str, reverse: bool = False) -> List[Dict]:
        """ترتيب البيانات بناءً على مفتاح - Sort data by key"""
        return sorted(self.data,
                     key=lambda x: x.get(key, ''),
                     reverse=reverse)

    def transform(self, transform_func):
        """تطبيق دالة تحويل على جميع العناصر
        Apply transformation function to all items
        """
        self.data = [transform_func(item) for item in self.data]
        return self.data

    def summary(self) -> Dict[str, Any]:
        """ملخص البيانات - Data summary"""
        if not self.data:
            return {'message': 'لا توجد بيانات'}

        # جمع جميع المفاتيح الفريدة
        all_keys = set()
        for item in self.data:
            all_keys.update(item.keys())

        return {
            'total_records': len(self.data),
            'fields': list(all_keys),
            'field_count': len(all_keys),
            'sample': self.data[0] if self.data else None
        }


# مثال الاستخدام - Usage Example
if __name__ == '__main__':
    # إنشاء بيانات تجريبية - Create sample data
    sample_data = [
        {'name': 'أحمد', 'age': 25, 'city': 'القاهرة', 'score': 85},
        {'name': 'فاطمة', 'age': 30, 'city': 'الرياض', 'score': 92},
        {'name': 'محمد', 'age': 28, 'city': 'القاهرة', 'score': 78},
        {'name': 'سارة', 'age': 26, 'city': 'دبي', 'score': 88},
        {'name': 'علي', 'age': 32, 'city': 'الرياض', 'score': 95},
    ]

    # تهيئة المحلل - Initialize analyzer
    analyzer = DataAnalyzer(sample_data)

    print("=== ملخص البيانات - Data Summary ===")
    print(json.dumps(analyzer.summary(), ensure_ascii=False, indent=2))

    print("\n=== إحصائيات الأعمار - Age Statistics ===")
    print(json.dumps(analyzer.get_statistics('age'), ensure_ascii=False, indent=2))

    print("\n=== عدد الأشخاص في كل مدينة - People per City ===")
    print(json.dumps(analyzer.count_by_key('city'), ensure_ascii=False, indent=2))

    print("\n=== أعلى الدرجات - Top Scores ===")
    top_scores = analyzer.sort_by_key('score', reverse=True)[:3]
    for person in top_scores:
        print(f"{person['name']}: {person['score']}")
