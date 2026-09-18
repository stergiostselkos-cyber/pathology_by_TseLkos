import re

with open('books.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Force standard black text on white background for the dropdown options
html = re.sub(
    r'\.dropdown-select option \{[^}]*\}',
    '.dropdown-select option { background-color: #ffffff !important; color: #000000 !important; font-weight: bold !important; }',
    html
)

with open('books.html', 'w', encoding='utf-8') as f:
    f.write(html)