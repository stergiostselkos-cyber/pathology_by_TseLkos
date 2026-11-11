import fitz, re, sys, unicodedata, json

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)

from parse_chapters import clean_greek

COL_LEFT_BOUNDS = [50.0, 257.0, 497.0, 704.0]

def col_from_y(y):
    if y < 250: return 0
    elif y < 480: return 1
    elif y < 695: return 2
    else: return 3

def get_page_lines_and_annots(doc, pno):
    page = doc.load_page(pno)
    words = page.get_text('words')
    annots = []
    annot = page.first_annot
    while annot:
        r = annot.rect
        annots.append({
            'page': pno, 'col': col_from_y((r.y0+r.y1)/2),
            'x': (r.x0+r.x1)/2, 'y': (r.y0+r.y1)/2
        })
        annot = annot.next
        
    cols = {0: [], 1: [], 2: [], 3: []}
    for w in words:
        cols[col_from_y((w[1]+w[3])/2)].append(w)
        
    lines = []
    for c in range(4):
        if pno == 3 and c < 2: continue
        cw = cols[c]
        if not cw: continue
        cw.sort(key=lambda w: -w[0])
        col_lines = []
        for w in cw:
            if not col_lines or abs(col_lines[-1][0][0] - w[0]) > 4:
                col_lines.append([w])
            else:
                col_lines[-1].append(w)
        for cl in col_lines:
            cl.sort(key=lambda w: w[1])
            lx = cl[0][0]
            ly = cl[0][1]
            txt = ' '.join(w[4] for w in cl).strip()
            if lx > 620 and any(h in txt for h in ['4004', '4604', 'ΕΦΑΡΜΟΣΜΕΝΗ', 'ΧΕΙΡΟΥΡΓΙΚΗ', 'ΕΡΩΤΗΣΕΙΣ', 'ΑΝΑΤΟΜΙΑ', 'ΦΥΣΙΟΛΟΓΙΑ']):
                continue
            lines.append({'page': pno, 'col': c, 'x': lx, 'y': ly, 'text': txt})
    return lines, annots

# Test on page 4
p4_lines, p4_annots = get_page_lines_and_annots(doc, 3)
for l in p4_lines:
    is_left = abs(l['y'] - COL_LEFT_BOUNDS[l['col']]) <= 8.0
    print(f"Col {l['col']} x={l['x']:.1f} y={l['y']:.1f} (left={is_left}): {l['text'][:40]}")
