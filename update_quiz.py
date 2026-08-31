import codecs

path = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\quiz.html'
with codecs.open(path, 'r', 'utf-8') as f:
    html = f.read()

# Replace the hardcoded script tag with a dynamic script loader
old_script = '<script charset="UTF-8" src="questions_v3.js"></script>'
new_script = '''
<script>
    // Dynamically load the requested MCQ bank
    const urlParams = new URLSearchParams(window.location.search);
    const bank = urlParams.get('bank') || 'old_book';
    
    const script = document.createElement('script');
    script.charset = "UTF-8";
    if (bank === 'bank_1') {
        script.src = "questions_bank_1.js?v=" + new Date().getTime();
    } else {
        script.src = "questions_v3.js?v=" + new Date().getTime();
    }
    
    // We must ensure the data is loaded before app.js runs.
    document.write('<script charset="UTF-8" src="' + script.src + '"><\\/script>');
</script>
'''

if old_script in html:
    html = html.replace(old_script, new_script)
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(html)
