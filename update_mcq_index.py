import codecs
import re

path = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\index.html'
with codecs.open(path, 'r', 'utf-8') as f:
    html = f.read()

new_code = '''
<div style="display: flex; gap: 10px;">
    <select id="mcq-selector" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-size: 0.95rem; font-weight: bold; cursor: pointer; outline: none; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <option value="old_book">Παλαιό Βιβλίο</option>
        <option value="bank_1">Τράπεζα Θεμάτων 1</option>
    </select>
    <a class="portal-card-btn quiz-btn" id="mcq-start-btn" href="#" onclick="startMCQ(event)" style="font-weight: 700; border: none; padding: 12px 20px; text-align: center; white-space: nowrap;">📚 Έναρξη</a>
</div>'''

html = re.sub(r'<a class="portal-card-btn quiz-btn" href="quiz\.html".*?</a>', new_code, html, flags=re.DOTALL)

script = '''
    <script>
        function startMCQ(e) {
            e.preventDefault();
            const selector = document.getElementById('mcq-selector');
            const book = selector.value;
            window.location.href = 'quiz.html?bank=' + book;
        }
    </script>
</body>
'''
html = html.replace('</body>', script)

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(html)
