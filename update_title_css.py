import re

filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# The user wants darker gradient tones and a blue outline for .main-title and .main-title span.quiz
# Darker tones: #b30000, #b35900, #b3b300, #00b300, #0000b3, #330066, #6600b3
# Blue outline: -webkit-text-stroke: 2px #003366;

old_css = r'''
        .main-title \{
            font-size: 4\.5rem !important;
            font-weight: 900 !important;
            background: linear-gradient\(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff\);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbowGlow 5s linear infinite;
        \}

        \.main-title span\.quiz \{
            background: linear-gradient\(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff\);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbowGlow 5s linear infinite reverse;
        \}'''

new_css = '''
        .main-title {
            font-size: 4.5rem !important;
            font-weight: 900 !important;
            background: linear-gradient(to right, #b30000, #b35900, #999900, #009900, #0000b3, #330066, #6600b3);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 2px #002244; /* Dark blue outline */
            animation: rainbowGlow 5s linear infinite;
        }

        .main-title span.quiz {
            background: linear-gradient(to right, #b30000, #b35900, #999900, #009900, #0000b3, #330066, #6600b3);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 2px #002244; /* Dark blue outline */
            animation: rainbowGlow 5s linear infinite reverse;
        }'''

# Replace all matching occurrences
html = re.sub(r'\.main-title\s*\{[^}]*background:\s*linear-gradient\(to right, #ff0000[^}]*\}', '', html, flags=re.DOTALL)
html = re.sub(r'\.main-title span\.quiz\s*\{[^}]*background:\s*linear-gradient\(to right, #ff0000[^}]*\}', '', html, flags=re.DOTALL)

# Insert the new CSS right after @keyframes rainbowGlow
html = re.sub(r'(@keyframes rainbowGlow\s*\{[^}]*\})', r'\1\n' + new_css, html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
