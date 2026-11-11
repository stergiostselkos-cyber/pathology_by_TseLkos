import fitz, re, sys, unicodedata, json

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)

from parse_chapters import parse_chapter_1, clean_greek

stream, annots = parse_chapter_1(doc)

def normalize_q_token(tok):
    # normalize polytonic
    t = unicodedata.normalize('NFKD', tok)
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = t.replace('α9', '49').replace('a9', '49').replace('ᾷ9', '49')
    t = t.replace('B8', '58').replace('Β8', '58').replace('b8', '58')
    t = t.replace('§9', '59')
    return t

print(f"Stream lines: {len(stream)}")
# Let's inspect all lines where questions start in pages 4 to 17
for idx, it in enumerate(stream):
    raw = it['text'].strip()
    norm = normalize_q_token(raw)
    m = re.match(r'^(\d+)\s+(.*)', norm)
    if m:
        val = int(m.group(1))
        if val in [48, 49, 50, 51, 52, 53, 54, 58, 59, 92, 107, 136, 140, 203, 204]:
            print(f"Line {idx} (P{it['page']+1} C{it['col']}): Q{val} -> {raw[:45]}")
