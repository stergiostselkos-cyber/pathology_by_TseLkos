import json, sys, re, unicodedata, fitz

sys.stdout.reconfigure(encoding='utf-8')
pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
doc = fitz.open(pdf_path)

from test_clean_ch1 import extract_all_lines, clean_greek, strip_opt_prefix, COL_LEFT_BOUNDS

lines_ch1, annots_ch1 = extract_all_lines(3, 15)

# Parser
questions = []
curr_q = None
state = 'STEM'
expected_k = 1

opt_letters_re = re.compile(r'^\s*(?:\([α-εΑ-Εa-eA-E8Οo0-9]\)|[α-εΑ-Εa-eA-E8Οo0-9][\.\)\:\}\]\-]|\b(?:oo|γν|y|v|m|g|Ξ|Θ|\-)\b[\)\.\:\-])\s*(.*)$', re.IGNORECASE)
opt_start_a_re = re.compile(r'^\s*(?:\([αΑaAΟo1]\)|[αΑaAΟo1][\.\)\:\}\]\-]|\b[αΑaAΟo1]\b[\)\.\:\-])\s*(.*)$', re.IGNORECASE)

for it in lines_ch1:
    txt = it['text'].strip()
    if not txt: continue
    
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
            'chapterId': 1,
            'chapterTitle': "Εφαρμοσμένη ανατομία στη χειρουργική",
            'stem_lines': [stem_start],
            'options': [],
            'page': it['page'],
            'col': it['col']
        }
        state = 'STEM'
        expected_k += 1
        continue
        
    m_opt = opt_letters_re.match(txt)
    
    if state == 'STEM':
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
                questions.append(curr_q)
                stem_start = m_num.group(2) if m_num else txt
                curr_q = {
                    'id': expected_k,
                    'chapterId': 1,
                    'chapterTitle': "Εφαρμοσμένη ανατομία στη χειρουργική",
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
            if curr_q['options']:
                curr_q['options'][-1]['text'] += ' ' + txt
            else:
                curr_q['stem_lines'].append(txt)

if curr_q:
    questions.append(curr_q)

# Format for JS
OPT_PREFIXES = ['Α. ', 'Β. ', 'Γ. ', 'Δ. ', 'Ε. ']
final_data = []

for q in questions:
    stem = clean_greek(' '.join(q['stem_lines']))
    # remove any chapter header and leading numbers from stem
    stem = re.sub(r'^[^\w\s]*ΕΦΑΡΜΟΣΜΕΝ[ΗΉ͂]\s*ANATOMIA\s*', '', stem, flags=re.IGNORECASE)
    stem = re.sub(r'^[^\w\s]*ΣΤΗ\s+ΧΕΙΡΟΥΡΓΙΚΗ\s*', '', stem, flags=re.IGNORECASE)
    stem = re.sub(r'^\d+\s+', '', stem).strip()

    
    opts_out = []
    best_opt = 0
    min_dist = 9999.0
    for idx, opt in enumerate(q['options'][:5]):
        pfx = OPT_PREFIXES[idx]
        txt = clean_greek(opt['text'])
        opts_out.append(f"{pfx}{txt}")
        for a in annots_ch1:
            if a['page'] == opt['page'] and a['col'] == opt['col']:
                d = abs(a['x'] - opt['x'])
                if d < min_dist:
                    min_dist = d
                    best_opt = idx
                    
    # If question has fewer than 5 options, pad
    while len(opts_out) < 5:
        idx = len(opts_out)
        opts_out.append(f"{OPT_PREFIXES[idx]}Επιλογή {OPT_PREFIXES[idx]}")
        
    final_data.append({
        'id': q['id'],
        'chapterId': 1,
        'chapterTitle': "Εφαρμοσμένη ανατομία στη χειρουργική",
        'question': stem,
        'options': opts_out,
        'correctAnswer': best_opt,
        'bookAnswerLetter': ['Α', 'Β', 'Γ', 'Δ', 'Ε'][best_opt]
    })

out_path = r'C:\Users\taste\Desktop\GitHub\pathology_by_TseLkos\SURGERY\surgery_questions.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write("// 4004 Ερωτήσεις Πολλαπλής Χειρουργικής - Δεδομένα Ερωτήσεων\n")
    f.write("const SURGERY_QUESTIONS = ")
    json.dump(final_data, f, ensure_ascii=False, indent=2)
    f.write(";\n\nif (typeof module !== 'undefined' && module.exports) { module.exports = { SURGERY_QUESTIONS }; }\n")

print(f"Successfully exported {len(final_data)} questions to {out_path}!")
