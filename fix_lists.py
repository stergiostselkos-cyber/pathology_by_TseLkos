import re

css_filepath = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\modern-theme.css'
with open(css_filepath, 'r', encoding='utf-8') as f:
    css = f.read()

list_css = '''
/* =====================================================================
   UNIVERSAL NESTED LIST & BULLET FORMATTING (Fix for lost hierarchies)
   ===================================================================== */
ul, ol {
    padding-left: 28px !important;
    margin: 12px 0 !important;
}

li {
    margin-bottom: 8px !important;
    line-height: 1.65 !important;
    text-align: left !important;
}

/* Explicit Indentation for Nested Lists (Level 2+) */
ul ul, ol ul, ul ol, ol ol {
    padding-left: 32px !important;
    margin: 8px 0 8px 0 !important;
    border-left: 2px solid rgba(0, 0, 0, 0.1) !important; /* Subtle left line to group nested items visually */
}

/* Further Indentation for Level 3+ */
ul ul ul, ol ol ol, ul ol ul, ol ul ol {
    padding-left: 32px !important;
    border-left: 2px solid rgba(0, 0, 0, 0.05) !important;
}

/* Distinct Bullet Shapes for Hierarchy */
ul { list-style-type: disc !important; }
ul ul { list-style-type: circle !important; }
ul ul ul { list-style-type: square !important; }

/* Distinct Numbers/Letters for Ordered Hierarchy */
ol { list-style-type: decimal !important; }
ol ol { list-style-type: lower-alpha !important; }
ol ol ol { list-style-type: lower-roman !important; }

/* Ensure text inside content areas stays dark and readable */
.explanation-content ul, 
.explanation-content ol, 
.explanation-content li,
.study-content ul,
.study-content ol,
.study-content li,
#cases-view ul,
#cases-view ol,
#cases-view li {
    color: #0f172a !important;
    font-weight: 500 !important;
}
'''

if 'UNIVERSAL NESTED LIST' not in css:
    css += '\n' + list_css

with open(css_filepath, 'w', encoding='utf-8') as f:
    f.write(css)

# Also let's cache bust the HTML files to ensure it's loaded!
import glob
import time
timestamp = str(int(time.time()))
html_files = glob.glob(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    html = re.sub(r'modern-theme\.css\?v=\d+', f'modern-theme.css?v={timestamp}', html)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

print("List CSS formatting applied and cache busted!")
