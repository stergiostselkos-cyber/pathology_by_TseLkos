import fitz, re, sys, unicodedata, json

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)

COL_LEFT_BOUNDS = [50.0, 257.0, 497.0, 704.0]

def col_from_y(y):
    if y < 250: return 0
    elif y < 480: return 1
    elif y < 695: return 2
    else: return 3

def clean_greek(text):
    if not text: return ""
    decomposed = unicodedata.normalize('NFD', text)
    cleaned = []
    for char in decomposed:
        if char in ['\u0313', '\u0314', '\u0343', '\u0345']:
            continue
        if char in ['\u0300', '\u0302', '\u0303', '\u0342']:
            cleaned.append('\u0301')
        else:
            cleaned.append(char)
    res = unicodedata.normalize('NFC', ''.join(cleaned))
    
    common_swaps = [
        (r'\bκαὶι\b', 'και'), (r'\bκαίι\b', 'και'), (r'\bκαὶ\b', 'και'),
        (r'\bούὔρων\b', 'ούρων'), (r'\bούύρων\b', 'ούρων'),
        (r'\boto\b', 'στο'), (r'\bpe\b', 'με'), (r'\bue\b', 'με'),
        (r'\bgivat\b', 'είναι'), (r'\b1010\b', 'πιο'), (r'\bMo\b', 'Ποια'),
        (r'\bKOt\b', 'και'), (r'\bKat\b', 'και'), (r'\bTou\b', 'του'),
        (r'\btou\b', 'του'), (r'\bTng\b', 'της'), (r'\btng\b', 'της'),
        (r'\bTNV\b', 'την'), (r'\bTa\b', 'τα'), (r'\bOi\b', 'Οι'), (r'\bot\b', 'οι'),
        (r'\bEXEL\b', 'έχει'), (r'\bapopd\b', 'αφορά'), (r'\b1o\b', 'το'),
        (r'\bGy\b', 'άνω'), (r'\bam\b', 'cm'), (r'\bTV\b', 'ετών'),
        (r'\bo€\b', 'σε'), (r'\bkeital\b', 'πρόκειται'), (r'\bva\b', 'να'),
        (r'\bEiote\b', 'Είστε'), (r'\bEMPEANTAC\b', 'επιμελητής'),
        (r'\bLU\b', 'μυ'), (r'\bcog\b', 'σας'), (r'\bTEM\b', 'ΤΕΠ'),
        (r'\boTa\b', 'στα'), (r'\bBl\b', 'ΤΕΠ'), (r'\bEL\b', 'ΤΕΠ'),
        (r'\bOTN\b', 'στη'), (r'\bTlowoc\b', 'Ποιος'), (r'\bToog\b', 'Ποιος'),
        (r'\bΠῶοια\b', 'Ποια'), (r'\bΠοιὸ\b', 'Ποιο'), (r'\bΠοιῖο\b', 'Ποιο'),
        (r'[-‐¬]\s+', '')
    ]
    for pat, repl in common_swaps:
        res = re.sub(pat, repl, res)
    return re.sub(r'[ \t]+', ' ', res).strip()

def strip_opt_prefix(txt):
    t = re.sub(r'^(?:[^\w\s]?\s*)?(?:[α-εΑ-Εa-eA-E8Οo0-9]{1,2}|oo|γν|y|v|m|g|Ξ|Θ|\-|\))\s*[\.\)\:\}\]\-]\s*', '', txt)
    return t.strip()

def extract_all_lines(start_p, end_p):
    all_lines = []
    all_annots = []
    for pno in range(start_p, end_p + 1):
        page = doc.load_page(pno)
        words = page.get_text('words')
        annot = page.first_annot
        while annot:
            r = annot.rect
            all_annots.append({
                'page': pno, 'col': col_from_y((r.y0+r.y1)/2),
                'x': (r.x0+r.x1)/2, 'y': (r.y0+r.y1)/2
            })
            annot = annot.next
            
        cols = {0: [], 1: [], 2: [], 3: []}
        for w in words:
            cols[col_from_y((w[1]+w[3])/2)].append(w)
            
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
                all_lines.append({
                    'page': pno, 'col': c, 'x': lx, 'y': ly, 'text': txt,
                    'is_left': (abs(ly - COL_LEFT_BOUNDS[c]) <= 9.0)
                })
    return all_lines, all_annots

lines, annots = extract_all_lines(3, 15)
print(f"Extracted {len(lines)} lines and {len(annots)} annots.")

# State machine parser

questions = []
curr_q = None
state = 'STEM' # 'STEM' or 'OPTS'
expected_k = 1

opt_letters_re = re.compile(r'^\s*(?:\([α-εΑ-Εa-eA-E8Οo0-9]\)|[α-εΑ-Εa-eA-E8Οo0-9][\.\)\:\}\]\-]|\b(?:oo|γν|y|v|m|g|Ξ|Θ|\-)\b[\)\.\:\-])\s*(.*)$', re.IGNORECASE)

for it in lines:
    txt = it['text'].strip()
    if not txt: continue
    
    # Check if this line is explicitly starting a new question (starts with number close to expected_k)
    m_num = re.match(r'^(\d+|[BΒ]8|ᾷ9)\s+(.*)', txt)
    explicit_next_q = False
    if m_num:
        val_str = m_num.group(1).replace('B8', '58').replace('Β8', '58').replace('ᾷ9', '49')
        if val_str.isdigit() and int(val_str) == expected_k:
            explicit_next_q = True
            
    if curr_q is None or explicit_next_q:
        if curr_q:
            questions.append(curr_q)
        stem_start = m_num.group(2) if m_num else txt
        curr_q = {
            'id': expected_k,
            'stem_lines': [stem_start],
            'options': [],
            'page': it['page'],
            'col': it['col']
        }
        state = 'STEM'
        expected_k += 1
        continue
        
    m_opt = opt_letters_re.match(txt)
    
    opt_start_a_re = re.compile(r'^\s*(?:\([αΑaAΟo1]\)|[αΑaAΟo1][\.\)\:\}\]\-]|\b[αΑaAΟo1]\b[\)\.\:\-])\s*(.*)$', re.IGNORECASE)

    if state == 'STEM':
        # Option 0 MUST match alpha marker
        m_opt_a = opt_start_a_re.match(txt)
        if m_opt_a or (len(curr_q['options']) == 0 and any(curr_q['stem_lines'][-1].strip().endswith(p) for p in [';', '?', ':'])):
            state = 'OPTS'
            opt_txt = m_opt_a.group(1).strip() if m_opt_a else strip_opt_prefix(txt)
            curr_q['options'].append({
                'idx': 0, 'page': it['page'], 'col': it['col'], 'x': it['x'], 'text': opt_txt
            })

        else:
            curr_q['stem_lines'].append(txt)


            
    elif state == 'OPTS':
        if it['is_left']:
            if len(curr_q['options']) == 5 or (m_num and explicit_next_q):
                # Start of next question!
                questions.append(curr_q)
                stem_start = m_num.group(2) if m_num else txt
                curr_q = {
                    'id': expected_k,
                    'stem_lines': [stem_start],
                    'options': [],
                    'page': it['page'],
                    'col': it['col']
                }
                state = 'STEM'
                expected_k += 1
            else:
                opt_txt = m_opt.group(1) if m_opt else strip_opt_prefix(txt)
                curr_q['options'].append({
                    'idx': len(curr_q['options']), 'page': it['page'], 'col': it['col'], 'x': it['x'], 'text': opt_txt
                })
        else:
            # continuation line
            if curr_q['options']:
                curr_q['options'][-1]['text'] += ' ' + txt
            else:
                curr_q['stem_lines'].append(txt)

if curr_q:
    questions.append(curr_q)

print(f"Total Questions parsed: {len(questions)}")
q5 = sum(1 for q in questions if len(q['options']) == 5)
print(f"Questions with exactly 5 options: {q5} / {len(questions)}")

# Match annotations
OPT_PREFIXES = ['Α. ', 'Β. ', 'Γ. ', 'Δ. ', 'Ε. ']
for q in questions:
    q['stem'] = clean_greek(' '.join(q['stem_lines']))
    best_opt = 0
    min_dist = 9999.0
    for opt in q['options']:
        for a in annots:
            if a['page'] == opt['page'] and a['col'] == opt['col']:
                d = abs(a['x'] - opt['x'])
                if d < min_dist:
                    min_dist = d
                    best_opt = opt['idx']
    q['correctAnswer'] = best_opt
    q['bookAnswerLetter'] = ['Α', 'Β', 'Γ', 'Δ', 'Ε'][best_opt] if best_opt < 5 else 'Α'

print(f"Done matching. Sample preview Q1..Q5:")
for q in questions[:5]:
    print(f"Q{q['id']}: {q['stem'][:70]} -> Ans: {q['bookAnswerLetter']} ({len(q['options'])} opts)")


