from parse_chapters import parse_chapter_1, fitz, re, sys, clean_greek

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
stream, annots = parse_chapter_1(doc)

# Sequential question tracker
detected_questions = []
k = 1

def is_ocr_variant_of(val, expected):
    if val == expected: return True
    s_val = str(val)
    s_exp = str(expected)
    if len(s_exp) == 2 and len(s_val) == 2:
        # 1 digit diff e.g. 36 vs 26, 82 vs 92, 63 vs 62
        diffs = sum(1 for a, b in zip(s_val, s_exp) if a != b)
        if diffs == 1: return True
    if len(s_val) == 3 and len(s_exp) == 2 and s_val.endswith(s_exp):
        return True
    return False

# Stop words that start with 10 (which is OCR for 'το')
fake_q_starts = ['το', 'του', 'της', 'την', 'τα', 'των', 'κερκιδικό', 'έσω', 'παρακάτω', 'σύμβαμα', 'αποτέλεσμα']

for idx, item in enumerate(stream):
    txt = item['text'].strip()
    m = re.match(r'^([0-9\u0370-\u03FFa-zA-Z]{1,5})\s+(.*)', txt)
    if not m: continue
    
    first_word = m.group(1)
    rest = m.group(2).strip()
    first_rest_word = rest.split()[0].lower() if rest.split() else ''
    
    # Check if this could be 'το'
    if first_word in ['10', '1o', 'Io'] and (first_rest_word in fake_q_starts or first_rest_word.islower()):
        continue
        
    # Check if number matches k
    is_match = False
    if first_word.isdigit():
        val = int(first_word)
        if val == k or is_ocr_variant_of(val, k):
            is_match = True
    elif first_word in ['ᾷ9', 'q9', '49'] and k == 49:
        is_match = True
    elif first_word in ['B8', 'Β8'] and k == 58:
        is_match = True
    elif first_word in ['§9', '59'] and k == 59:
        is_match = True
    elif '54' in first_word and '65' in txt and (54 <= k <= 65):
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
    # print context around where it stopped
    last_line = detected_questions[-1]['line_idx'] if detected_questions else 0
    print(f"Context after line {last_line}:")
    for j in range(last_line+1, min(last_line+25, len(stream))):
        print(f"  Line {j} (P{stream[j]['page']+1} C{stream[j]['col']}): {stream[j]['text']}")
