import codecs
import os

def process_file(path):
    if not os.path.exists(path): return
    with codecs.open(path, 'r', 'utf-8') as f:
        html = f.read()
    
    html = html.replace('class="dark-theme"', '')
    html = html.replace("classList.add('dark-theme')", "classList.remove('dark-theme')")
    
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(html)

process_file(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html')
process_file(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\study_new_book.html')
print("Removed dark mode logic from HTML files.")
