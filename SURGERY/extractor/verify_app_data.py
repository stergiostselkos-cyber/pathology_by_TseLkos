import json, sys

sys.stdout.reconfigure(encoding='utf-8')


with open(r'C:\Users\taste\Desktop\GitHub\pathology_by_TseLkos\SURGERY\surgery_questions.js', 'r', encoding='utf-8') as f:
    text = f.read()

raw_json = text.split('const SURGERY_QUESTIONS = ')[1].split(';\n\nif')[0]
data = json.loads(raw_json)

# Check statistics
total = len(data)
with_5_opts = sum(1 for q in data if len(q['options']) == 5)
with_valid_answer = sum(1 for q in data if 0 <= q['correctAnswer'] <= 4)

print(f"Total Questions: {total}")
print(f"With 5 options: {with_5_opts} / {total}")
print(f"With valid answer: {with_valid_answer} / {total}")

# Print first 5 questions preview
for q in data[:5]:
    print(f"\n--- Q{q['id']} ({q['chapterTitle']}) ---")
    print("Stem:", q['question'][:100])
    for opt in q['options']:
        print(" ", opt[:60])
    print("Correct:", q['correctAnswer'], "->", q['bookAnswerLetter'])
