from parse_chapters import parse_chapter_1, fitz, re, sys, clean_greek

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)
stream, annots = parse_chapter_1(doc)

# Option marker detector
# Matches (α), α), α., A., A), etc.
opt_marker_re = re.compile(r'^\s*(?:\([α-εΑ-Εa-eA-E8Οo0-9]\)|[α-εΑ-Εa-eA-E8Οo0-9][\.\)\:\}\]\-]|\b(?:oo|γν|y|v|m|g)\b[\)\.\:\-])\s*(.*)$', re.IGNORECASE)

# Mapping of marker to index 0..4
def detect_opt_idx(txt, expected_idx):
    m = opt_marker_re.match(txt)
    if not m:
        # Check special OCR markers
        if txt.startswith(('α)', 'α.', '(α)', 'a)', 'A.', 'A)', 'Ο)', 'o)')): return 0, m.group(1) if m else txt[2:].strip()
        if txt.startswith(('β)', 'β.', '(β)', 'b)', 'B.', 'B)', 'oo)', '6)')): return 1, m.group(1) if m else txt[2:].strip()
        if txt.startswith(('γ)', 'γ.', '(γ)', 'c)', 'C.', 'C)', 'γν)', 'y)', 'v)')): return 2, m.group(1) if m else txt[2:].strip()
        if txt.startswith(('δ)', 'δ.', '(δ)', 'd)', 'D.', 'D)', '8)', '8.')): return 3, m.group(1) if m else txt[2:].strip()
        if txt.startswith(('ε)', 'ε.', '(ε)', 'e)', 'E.', 'E)', 'g)', 'm)')): return 4, m.group(1) if m else txt[2:].strip()
        return None, txt
    
    prefix = m.group(0).split()[0].lower().strip('().:-}]')
    rem = m.group(1)
    
    letter_map = {
        'α': 0, 'a': 0, 'ο': 0, 'o': 0, '1': 0,
        'β': 1, 'b': 1, 'oo': 1, '6': 1,
        'γ': 2, 'c': 2, 'γν': 2, 'y': 2, 'v': 2,
        'δ': 3, 'd': 3, '8': 3,
        'ε': 4, 'e': 4, 'g': 4, 'm': 4
    }
    idx = letter_map.get(prefix)
    if idx is not None:
        return idx, rem
    return None, txt

# Parser loop
questions = []
curr_q = None

for line_idx, item in enumerate(stream):
    txt = item['text'].strip()
    if not txt: continue
    
    # Check if this line is an option marker
    expected_opt = len(curr_q['options']) if curr_q else 0
    opt_idx, opt_rem = detect_opt_idx(txt, expected_opt)
    
    # Check if this line is a question header
    # e.g. starts with digits or when curr_q has 5 options
    is_q_header = False
    m_num = re.match(r'^(\d+|[BΒ]8|ᾷ9)\s+(.*)', txt)
    if curr_q is None:
        if m_num: is_q_header = True
    elif len(curr_q['options']) >= 4:
        # If curr_q already has 4 or 5 options, any non-option line or digit line starts next question
        if m_num or opt_idx is None:
            # But wait, could it be continuation of option 4?
            # Continuation of option 4 does not start with a digit or capitalized clinical stem
            if m_num:
                is_q_header = True
            elif len(curr_q['options']) == 5 and (txt.startswith(('Ποιο', 'Ποια', 'Ποιος', 'Ασθενής', 'Γυναίκα', 'Άνδρας', 'Ανδρας', 'Παιδί', 'Είστε', 'Εἰστε', 'Κατά', 'Σε', 'Από')) or txt[0].isupper() and len(txt) > 20):
                is_q_header = True
    
    if is_q_header:
        if curr_q is not None:
            questions.append(curr_q)
        q_num = len(questions) + 1
        stem = m_num.group(2) if m_num else txt
        curr_q = {
            'id': q_num,
            'chapter': 1,
            'stem_lines': [stem],
            'options': [],
            'page': item['page'],
            'col': item['col']
        }
        continue
        
    if curr_q is None:
        continue
        
    # If we are inside a question:
    # Are we seeing an option?
    if opt_idx is not None and (opt_idx == len(curr_q['options']) or (len(curr_q['options']) < 5 and opt_idx == len(curr_q['options']))):
        curr_q['options'].append({
            'idx': len(curr_q['options']),
            'page': item['page'],
            'col': item['col'],
            'x': item['x'],
            'y': item['y'],
            'text': opt_rem
        })
    elif curr_q['options']:
        # append to last option
        curr_q['options'][-1]['text'] += ' ' + txt
    else:
        # append to stem
        curr_q['stem_lines'].append(txt)

if curr_q:
    questions.append(curr_q)

print(f"Total questions parsed: {len(questions)}")
correct_opt_count = sum(1 for q in questions if len(q['options']) == 5)
print(f"Questions with exactly 5 options: {correct_opt_count}/{len(questions)}")

# Match annotations
matched_annots = 0
OPT_LABELS = ['Α', 'Β', 'Γ', 'Δ', 'Ε']

for q in questions:
    q['question'] = clean_greek(' '.join(q['stem_lines']))
    # match each option with nearest annot
    if not q['options']: continue
    
    best_opt = None
    min_dist = 9999.0
    for opt in q['options']:
        # find annots on same page and col
        for a in annots:
            if a['page'] == opt['page'] and a['col'] == opt['col']:
                dist = abs(a['x'] - opt['x'])
                if dist < min_dist:
                    min_dist = dist
                    best_opt = opt['idx']
                    
    if min_dist <= 8.0:
        q['correct_idx'] = best_opt
        matched_annots += 1
    else:
        q['correct_idx'] = 0 # fallback
        
print(f"Questions with securely matched answer annot (dist <= 8pt): {matched_annots}/{len(questions)}")

