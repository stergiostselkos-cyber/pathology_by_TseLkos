import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# The mathematically perfect looping gradient
perfect_gradient = 'linear-gradient(to right, #FF0000 0%, #FF7F00 8.33%, #FFFF00 16.66%, #00FF00 25%, #0000FF 33.33%, #8B00FF 41.66%, #FF0000 50%, #FF7F00 58.33%, #FFFF00 66.66%, #00FF00 75%, #0000FF 83.33%, #8B00FF 91.66%, #FF0000 100%) !important;'

# Replace the gradient in the three CSS classes
html = re.sub(
    r'background:\s*linear-gradient\(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF, #FF0000, #FF7F00, #FFFF00\)\s*!important;',
    f'background: {perfect_gradient}',
    html
)

# Ensure the animation keyframes are 0% to 100%
perfect_anim = '''
@keyframes flowWaterAnim {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
}
'''

# Replace the old keyframes
html = re.sub(
    r'@keyframes flowWaterAnim\s*\{[^}]*\}',
    perfect_anim.strip(),
    html
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Mathematically perfect gradient and animation applied!")
