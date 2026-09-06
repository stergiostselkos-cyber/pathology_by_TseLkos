import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove ALL .main-title and .main-title span.quiz definitions (including media queries, we'll restore them)
html = re.sub(r'\.main-title\s*\{.*?\}', '', html, flags=re.DOTALL)
html = re.sub(r'\.main-title span\.quiz\s*\{.*?\}', '', html, flags=re.DOTALL)

# 2. Add them back cleanly at the end of the <style> block
clean_css = '''
        .main-title {
            font-size: 4.5rem !important;
            font-weight: 900 !important;
            margin-bottom: 10px !important;
            letter-spacing: -1px !important;
            
            /* Darker jewel-tone gradient requested by user */
            background: linear-gradient(to right, #990000, #b34700, #b3b300, #008000, #000099, #330066, #6600b3) !important;
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* The blue outline */
            -webkit-text-stroke: 3px #001f3f !important;
            
            animation: rainbowGlow 5s linear infinite !important;
        }

        .main-title span.quiz {
            background: linear-gradient(to right, #990000, #b34700, #b3b300, #008000, #000099, #330066, #6600b3) !important;
            background-size: 200% auto !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            
            /* The blue outline */
            -webkit-text-stroke: 3px #001f3f !important;
            
            animation: rainbowGlow 5s linear infinite reverse !important;
        }

        /* Responsive design to prevent letters overlapping on mobile */
        @media (max-width: 768px) {
            .main-title {
                font-size: 2.8rem !important;
                line-height: 1.2 !important;
                word-wrap: break-word !important;
            }
        }
'''

html = html.replace('</style>', clean_css + '\n</style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
