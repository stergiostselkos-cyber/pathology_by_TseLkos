import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# The keyframes were never inserted! Let's insert them right before </style>
water_anim = '''
@keyframes flowWaterAnim {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
}
'''

if '@keyframes flowWaterAnim' not in html:
    html = html.replace('</style>', water_anim + '\n</style>')

# Also, background-position: 200% is safe for looping if size is 200%? 
# Actually, background-position: 200% on a 200% sized background is perfect for a full loop!

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
print("Keyframes injected!")
