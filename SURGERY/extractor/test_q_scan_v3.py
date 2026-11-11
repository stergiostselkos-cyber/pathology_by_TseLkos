from parse_chapters import parse_chapter_1, fitz, re, sys, clean_greek

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
stream, annots = parse_chapter_1(doc)

detected_questions = []
k = 1

KNOWN_OCR_MAP = {
    26: [36],
    49: ['ᾷ9', 'q9', '49'],
    58: ['B8', 'Β8', 58, 88],
    59: ['§9', 59],
    92: [82, 92],
    107: [1097, 107],
    136: [126, 136],
    140: [14809, 140, '14809']
}

fake_q_starts = ['το', 'του', 'της', 'την', 'τα', 'των', 'κερκιδικό', 'έσω', 'παρακάτω', 'σύμβαμα', 'αποτέλεσμα']

for idx, item in enumerate(stream):
    txt = item['text'].strip()
    m = re.match(r'^([0-9\u0370-\u03FFa-zA-Z]{1,6})\s+(.*)', txt)
    if not m: continue
    
    first_word = m.group(1)
    rest = m.group(2).strip()
    first_rest_word = rest.split()[0].lower() if rest.split() else ''
    
    # Only filter '10' if k != 10
    if k != 10 and first_word in ['10', '1o', 'Io'] and (first_rest_word in fake_q_starts or first_rest_word.islower()):
        continue
        
    is_match = False
    if first_word.isdigit():
        val = int(first_word)
        if val == k:
            is_match = True
        elif k in KNOWN_OCR_MAP and val in KNOWN_OCR_MAP[k]:
            is_match = True
    elif k in KNOWN_OCR_MAP and first_word in KNOWN_OCR_MAP[k]:
        is_match = True
    elif k in [54, 55, 56, 57] and '54' in first_word and '65' in txt:
        is_match = True
        
    if is_match:
        detected_questions.append({
            'q': k,
            'raw_word': first_word,
            'line_idx': idx,
            'page': item['page']+1,
            'col': item['col'],
            'text': rest[:50]
        })
        k += 1

print(f"Total sequentially detected questions: {len(detected_questions)} / 204")
if len(detected_questions) < 204:
    print(f"Next expected was Q{k}")
    last_line = detected_questions[-1]['line_idx'] if detected_questions else 0
    print(f"Context after line {last_line}:")
    for j in range(last_line+1, min(last_line+15, len(stream))):
        print(f"  Line {j} (P{stream[j]['page']+1} C{stream[j]['col']}): {stream[j]['text']}")
