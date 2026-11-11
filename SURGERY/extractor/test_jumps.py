from parse_chapters import parse_chapter_1, fitz, re, sys, clean_greek

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
stream, annots = parse_chapter_1(doc)

# Let's inspect where all questions from 1 to 204 appear in stream by checking lines starting with numbers
q_lines = []
for idx, item in enumerate(stream):
    txt = item['text']
    m = re.match(r'^(\d{1,4})\s+(.*)', txt)
    if m:
        val = int(m.group(1))
        if 1 <= val <= 210:
            q_lines.append((val, idx, item['page']+1, item['col'], txt[:40]))

print(f"Total q_lines: {len(q_lines)}")
for i in range(len(q_lines)-1):
    curr_v = q_lines[i][0]
    next_v = q_lines[i+1][0]
    if next_v != curr_v + 1 and next_v <= 204:
        print(f"Jump from Q{curr_v} (P{q_lines[i][2]} C{q_lines[i][3]} L{q_lines[i][1]}) to Q{next_v} (P{q_lines[i+1][2]} C{q_lines[i+1][3]} L{q_lines[i+1][1]})")
