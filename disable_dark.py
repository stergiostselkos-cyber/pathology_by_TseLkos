import codecs

def disable_dark_theme(path):
    with codecs.open(path, 'r', 'utf-8') as f:
        text = f.read()
    
    text = text.replace("document.body.classList.add('dark-theme');", "document.body.classList.remove('dark-theme');")
    text = text.replace("localStorage.getItem('theme') || 'dark'", "'light'")
    
    # Just in case, also forcibly remove it
    text = text.replace("document.body.classList.toggle('dark-theme');", "document.body.classList.remove('dark-theme');")

    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(text)

disable_dark_theme(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\study_new_book.js')
disable_dark_theme(r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html')
print("Dark theme disabled")
