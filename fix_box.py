import re

with open('books.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Change the text color of the select box itself to a bright purple
html = re.sub(
    r'(\.dropdown-select \{[^}]*?color:\s*)var\(--text-primary\)(;)',
    r'\1#d946ef !important\2',
    html
)
# Ensure it's extra bold for better visibility on any background
html = re.sub(
    r'(\.dropdown-select \{[^}]*?font-weight:\s*)600(;)',
    r'\1 800\2',
    html
)

with open('books.html', 'w', encoding='utf-8') as f:
    f.write(html)