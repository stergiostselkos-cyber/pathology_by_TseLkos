import re

with open('books.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make the body colors more vibrant purple/fuchsia
html = html.replace(
    '--c1: #4A235A; --c2: #9B59B6; --c3: #D2B4DE; --c4: #8E44AD;',
    '--c1: #7e22ce; --c2: #d946ef; --c3: #a855f7; --c4: #f472b6;'
)

# Fix the dropdown options to be elegant dark, so it matches the theme but remains visible
html = re.sub(
    r'\.dropdown-select option \{[^}]*\}',
    '.dropdown-select option { background-color: #1e293b; color: #f8fafc; font-weight: 500; }',
    html
)

with open('books.html', 'w', encoding='utf-8') as f:
    f.write(html)