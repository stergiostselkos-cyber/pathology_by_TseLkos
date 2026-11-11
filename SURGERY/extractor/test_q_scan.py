from parse_chapters import parse_chapter_1, fitz, re, sys

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
stream, _ = parse_chapter_1(doc)

missing = [26, 49, 53, 58, 59, 65, 92, 107, 136, 140]

for m_q in missing:
    # find where m_q-1 was found
    prev_idx = None
    for idx, item in enumerate(stream):
        txt = item['text']
        m = re.match(r'^(\d+)\s+(.*)', txt)
        if m and int(m.group(1)) == m_q - 1:
            prev_idx = idx
            break
    if prev_idx is not None:
        print(f"\n=== Context for missing Q{m_q} (around line {prev_idx}) ===")
        for j in range(prev_idx + 1, min(prev_idx + 18, len(stream))):
            it = stream[j]
            print(f"  Line {j:4d} (P{it['page']+1} C{it['col']}): {it['text'][:60]}")
            # stop if we see m_q + 1
            m_next = re.match(r'^(\d+)\s+(.*)', it['text'])
            if m_next and int(m_next.group(1)) == m_q + 1:
                break
