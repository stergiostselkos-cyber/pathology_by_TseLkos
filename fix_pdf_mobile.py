import re

# Update books.html to add the external PDF button
html_file = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\books.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

btn_html = '''
    <!-- PDF Viewer -->
    <div class="pdf-viewer-container" id="pdf-container" style="display: none; position: relative;">
        <a id="external-pdf-btn" href="#" target="_blank" class="btn btn-primary" style="position: absolute; top: 15px; right: 15px; z-index: 10; font-size: 0.9rem; padding: 10px 18px; background: rgba(217, 70, 239, 0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-radius: 8px; backdrop-filter: blur(5px);">
            Άνοιγμα PDF (για Κινητά)
        </a>
        <iframe id="pdf-iframe" src=""></iframe>
    </div>
'''

html = re.sub(r'<!-- PDF Viewer -->.*?</div>', btn_html, html, flags=re.DOTALL)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)


# Update books.js to set the href of the external PDF button
js_file = r'C:\Users\taste\Desktop\pathologia-quiz-FINAL-FIX\books.js'
with open(js_file, 'r', encoding='utf-8') as f:
    js = f.read()

# Add externalPdfBtn to const declarations
if 'const externalPdfBtn' not in js:
    js = js.replace("const pdfPlaceholder = document.getElementById('pdf-placeholder');", 
                    "const pdfPlaceholder = document.getElementById('pdf-placeholder');\nconst externalPdfBtn = document.getElementById('external-pdf-btn');")

# Update logic
js = js.replace("pdfIframe.src = '';", "pdfIframe.src = '';\n    if(externalPdfBtn) externalPdfBtn.href = '#';")
js = js.replace("pdfIframe.src = selectedPart.file;", "pdfIframe.src = selectedPart.file;\n        if(externalPdfBtn) externalPdfBtn.href = selectedPart.file;")
js = js.replace("pdfIframe.src = selectedSubchapter.file;", "pdfIframe.src = selectedSubchapter.file;\n        if(externalPdfBtn) externalPdfBtn.href = selectedSubchapter.file;")

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js)

print("Added external PDF button for mobile!")
