import re

with open('books.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the specific option styling to be explicitly black on white
html = re.sub(
    r'\.dropdown-select option \{[^}]*\}',
    '.dropdown-select option { background-color: #ffffff; color: #000000; font-weight: normal; }',
    html
)

with open('books.html', 'w', encoding='utf-8') as f:
    f.write(html)