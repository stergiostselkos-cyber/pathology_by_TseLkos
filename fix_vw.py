import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Change background-size to 200vw
html = re.sub(r'background-size:\s*200%\s*auto\s*!important;', 'background-size: 200vw auto !important;', html)

# Change keyframes to use vw
perfect_anim = '''
@keyframes flowWaterAnim {
    0% { background-position: 0vw 50%; }
    100% { background-position: -100vw 50%; }
}
'''
html = re.sub(
    r'@keyframes flowWaterAnim\s*\{[^}]*\}',
    perfect_anim.strip(),
    html
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated to vw units!")
