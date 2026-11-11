import sys
sys.stdout.reconfigure(encoding='utf-8')
from test_clean_ch1 import questions

q2 = questions[1]
print(f"Q2 ID={q2['id']}, stem={q2['stem'][:60]}")
for o in q2['options']:
    print(f"  opt {o['idx']} (x={o['x']:.1f}): {o['text'][:60]}")
