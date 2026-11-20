
from pathlib import Path

# مسار صفحة index
file_path = Path(__file__).parent / "index.html"

# قراءة الملف
content = file_path.read_text(encoding="utf-8")

# التصحيحات
corrections = {
    "معاً": "معًا",
    "جيلاً": "جيلًا",
    "تعليمياً": "تعليميًا",
    "عملياً": "عمليًا",
    "تقنياً": "تقنيًا",
}

# تطبيق التصحيحات
changes = 0

for old, new in corrections.items():
    count = content.count(old)

    if count:
        content = content.replace(old, new)
        changes += count
        print(f"[FIXED] {old} -> {new} ({count})")

# حفظ الملف
file_path.write_text(content, encoding="utf-8")

print("-" * 40)
print(f"Completed: {changes} replacements")
print(f"File: {file_path}")
