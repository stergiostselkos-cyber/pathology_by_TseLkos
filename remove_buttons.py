import codecs
import re
import os

def remove_theme_toggle(path):
    if not os.path.exists(path): return
    with codecs.open(path, 'r', 'utf-8') as f:
        html = f.read()
    
    # Remove the entire button block
    html = re.sub(r'<button[^>]*id="theme-toggle"[^>]*>.*?</button>', '', html, flags=re.DOTALL)
    
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(html)

remove_theme_toggle(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html')
remove_theme_toggle(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\study_new_book.html')
print('Removed theme toggle buttons.')
