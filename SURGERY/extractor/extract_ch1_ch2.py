import fitz, re, sys, unicodedata, json, os

pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'

def col_from_y(y):
    if y < 250: return 0
    elif y < 480: return 1
    elif y < 695: return 2
    else: return 3

def clean_greek(text):
    if not text: return ""
    text = unicodedata.normalize('NFC', text)
    polytonic_map = {
        'ὰ': 'ά', 'ὲ': 'έ', 'ὴ': 'ή', 'ὶ': 'ί', 'ὸ': 'ό', 'ὺ': 'ύ', 'ὼ': 'ώ',
        'Ὰ': 'Ά', 'Ὲ': 'Έ', 'Ὴ': 'Ή', 'Ὶ': 'Ί', 'Ὸ': 'Ό', 'Ὺ': 'Ύ', 'Ώ': 'Ώ',
        'ᾶ': 'ά', 'ῆ': 'ή', 'ῖ': 'ί', 'ῦ': 'ύ', 'ῶ': 'ώ',
        'ἀ': 'α', 'ἁ': 'α', 'ἂ': 'ά', 'ἃ': 'ά', 'ἄ': 'ά', 'ἅ': 'ά', 'ἆ': 'ά', 'ἇ': 'ά',
        'ἐ': 'ε', 'ἑ': 'ε', 'ἒ': 'έ', 'ἓ': 'έ', 'ἔ': 'έ', 'ἕ': 'έ',
        'ἠ': 'η', 'ἡ': 'η', 'ἢ': 'ή', 'ἣ': 'ή', 'ἤ': 'ή', 'ἥ': 'ή', 'ἦ': 'ή', 'ἧ': 'ή',
        'ἰ': 'ι', 'ἱ': 'ι', 'ἲ': 'ί', 'ἳ': 'ί', 'ἴ': 'ί', 'ἵ': 'ί', 'ἶ': 'ί', 'ἷ': 'ί',
        'ὀ': 'ο', 'ὁ': 'ο', 'ὂ': 'ό', 'ὃ': 'ό', 'ὄ': 'ό', 'ὅ': 'ό',
        'ὐ': 'υ', 'ὑ': 'υ', 'ὒ': 'ύ', 'ὓ': 'ύ', 'ὔ': 'ύ', 'ὕ': 'ύ', 'ὖ': 'ύ', 'ὗ': 'ύ',
        'ὠ': 'ω', 'ὡ': 'ω', 'ὢ': 'ώ', 'ὣ': 'ώ', 'ὤ': 'ώ', 'ὥ': 'ώ', 'ὦ': 'ώ', 'ὧ': 'ώ',
        'ᾄ': 'ά', 'ᾅ': 'ά', 'ᾔ': 'ή', 'ᾕ': 'ή', 'ᾤ': 'ώ', 'ᾥ': 'ώ',
        'ᾀ': 'α', 'ᾁ': 'α', 'ᾐ': 'η', 'ᾑ': 'η', 'ᾠ': 'ω', 'ᾡ': 'ω',
        'ᾱ': 'α', 'ᾰ': 'α', 'ῑ': 'ι', 'ῐ': 'ι', 'ῡ': 'υ', 'ῠ': 'υ',
        'ῥ': 'ρ', 'ῤ': 'ρ', 'Ῥ': 'Ρ',
        'ϊ': 'ϊ', 'ϋ': 'ϋ', 'ΐ': 'ΐ', 'ΰ': 'ΰ',
        'Ἀ': 'Α', 'Ἁ': 'Α', 'Ἂ': 'Ά', 'Ἃ': 'Ά', 'Ἄ': 'Ά', 'Ἅ': 'Ά',
        'Ἐ': 'Ε', 'Ἑ': 'Ε', 'Ἒ': 'Έ', 'Ἓ': 'Έ', 'Ἔ': 'Έ', 'Ἕ': 'Έ',
        'Ἠ': 'Η', 'Ἡ': 'Η', 'Ἢ': 'Ή', 'Ἣ': 'Ή', 'Ἤ': 'Ή', 'Ἥ': 'Ή',
        'Ἰ': 'Ι', 'Ἱ': 'Ι', 'Ἲ': 'Ί', 'Ἳ': 'Ί', 'Ἴ': 'Ί', 'Ἵ': 'Ί',
        'Ὀ': 'Ο', 'Ὁ': 'Ο', 'Ὂ': 'Ό', 'Ὃ': 'Ό', 'Ὄ': 'Ό', 'Ὅ': 'Ό',
        'Ὑ': 'Υ', 'Ὕ': 'Ύ', 'Ὗ': 'Ύ',
        'Ὠ': 'Ω', 'Ὡ': 'Ω', 'Ὢ': 'Ώ', 'Ὣ': 'Ώ', 'Ὤ': 'Ώ', 'Ὥ': 'Ώ',
    }
    for p_char, m_char in polytonic_map.items():
        text = text.replace(p_char, m_char)

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
        text = re.sub(pat, repl, text)

    return re.sub(r'[ \t]+', ' ', text).strip()

def get_stream_and_annots(doc, start_page, end_page):
    all_stream = []
    all_annots = []
    for pno in range(start_page, end_page + 1):
        page = doc.load_page(pno)
        words = page.get_text('words')
        annot = page.first_annot
        while annot:
            r = annot.rect
            all_annots.append({
                'page': pno,
                'col': col_from_y((r.y0 + r.y1) / 2),
                'x': (r.x0 + r.x1) / 2,
                'y': (r.y0 + r.y1) / 2
            })
            annot = annot.next
            
        cols = {0: [], 1: [], 2: [], 3: []}
        for w in words:
            cols[col_from_y((w[1] + w[3]) / 2)].append(w)
            
        for c in range(4):
            if pno == 3 and c < 2: continue # skip title side
            c_words = cols[c]
            if not c_words: continue
            c_words.sort(key=lambda w: -w[0])
            lines = []
            for w in c_words:
                if not lines or abs(lines[-1][0][0] - w[0]) > 4:
                    lines.append([w])
                else:
                    lines[-1].append(w)
            for l in lines:
                l.sort(key=lambda w: w[1])
                lx = l[0][0]
                ly = l[0][1]
                txt = ' '.join(w[4] for w in l).strip()
                if lx > 620 and any(h in txt for h in ['4004', '4604', 'ΕΦΑΡΜΟΣΜΕΝΗ', 'ΧΕΙΡΟΥΡΓΙΚΗ', 'ΕΡΩΤΗΣΕΙΣ', 'ΑΝΑΤΟΜΙΑ', 'ΦΥΣΙΟΛΟΓΙΑ']):
                    continue
                all_stream.append({'page': pno, 'col': c, 'x': lx, 'y': ly, 'text': txt})
    return all_stream, all_annots

opt_start_re = re.compile(r'^\s*([α-εΑ-Εa-eA-E8Οo0-9]+|oo|γν|y|v|m)[\s]*([\)\.\}\]\:\-])\s*(.*)$')
opt_code_map = {
    'α': 0, 'a': 0, 'Α': 0, 'A': 0, 'Ο': 0, 'o': 0, '1': 0,
    'β': 1, 'b': 1, 'Β': 1, 'B': 1, 'oo': 1, '6': 1,
    'γ': 2, 'c': 2, 'Γ': 2, 'C': 2, 'γν': 2, 'y': 2, 'v': 2,
    'δ': 3, 'd': 3, 'Δ': 3, 'D': 3, '8': 3,
    'ε': 4, 'e': 4, 'Ε': 4, 'E': 4, 'g': 4, 'm': 4
}
OPT_PREFIXES = ['Α. ', 'Β. ', 'Γ. ', 'Δ. ', 'Ε. ']

def extract_chapter_questions(doc, start_p, end_p, start_qid, end_qid, chapter_id, chapter_title):
    stream, annots = get_stream_and_annots(doc, start_p, end_p)
    
    questions = []
    curr_q = None
    expected_qid = start_qid
    
    for item in stream:
        txt = item['text'].strip()
        if not txt: continue
        
        # Check if line is an option marker
        m_opt = opt_start_re.match(txt)
        detected_opt = None
        opt_text = ""
        if m_opt:
            code = m_opt.group(1).lower()
            if code in opt_code_map:
                detected_opt = opt_code_map[code]
                opt_text = m_opt.group(3).strip()
                
        # Check if line starts a question
        # Condition:
        # starts with a number or OCR variant, or curr_q has 5 options and this line is a stem start
        m_num = re.match(r'^([0-9\u0370-\u03FFa-zA-Z]{1,6})\s+(.*)', txt)
        is_q_start = False
        stem_start = ""
        
        if m_num:
            w = m_num.group(1)
            # if w is digit
            if w.isdigit():
                val = int(w)
                if val == expected_qid or (abs(val - expected_qid) <= 2 and val >= expected_qid):
                    is_q_start = True
                    expected_qid = val
                    stem_start = m_num.group(2)
            elif expected_qid in [49, 58, 59, 92, 107, 136, 140]:
                # known OCR swaps
                is_q_start = True
                stem_start = m_num.group(2)
        elif curr_q and len(curr_q['options']) == 5 and detected_opt is None:
            # Stem start after 5 options
            if txt.startswith(('Ποιο', 'Ποια', 'Ποιος', 'Ασθενής', 'Γυναίκα', 'Άνδρας', 'Ανδρας', 'Παιδί', 'Είστε', 'Εἰστε', 'Κατά', 'Σε', 'Από')) or (txt[0].isupper() and len(txt) > 25):
                is_q_start = True
                expected_qid += 1
                stem_start = txt
                
        if is_q_start:
            if curr_q:
                questions.append(curr_q)
            curr_q = {
                'id': expected_qid,
                'chapterId': chapter_id,
                'chapterTitle': chapter_title,
                'stem_lines': [stem_start],
                'options': [],
                'page': item['page'],
                'col': item['col']
            }
            expected_qid += 1
            continue
            
        if curr_q is None:
            continue
            
        # If in question:
        expected_opt_idx = len(curr_q['options'])
        if detected_opt is not None and (detected_opt == expected_opt_idx or (expected_opt_idx < 5 and detected_opt >= expected_opt_idx)):
            curr_q['options'].append({
                'idx': len(curr_q['options']),
                'page': item['page'],
                'col': item['col'],
                'x': item['x'],
                'y': item['y'],
                'text': opt_text
            })
        elif curr_q['options']:
            curr_q['options'][-1]['text'] += ' ' + txt
        else:
            curr_q['stem_lines'].append(txt)
            
    if curr_q:
        questions.append(curr_q)
        
    # Format and match annotations
    final_questions = []
    for q in questions:
        stem = clean_greek(' '.join(q['stem_lines']))
        # format options
        opts_formatted = []
        for i, opt in enumerate(q['options'][:5]):
            prefix = OPT_PREFIXES[i]
            cleaned_opt = clean_greek(opt['text'])
            opts_formatted.append(f"{prefix}{cleaned_opt}")
            
        # Match annotation
        best_opt_idx = 0
        min_dist = 9999.0
        for opt in q['options'][:5]:
            for a in annots:
                if a['page'] == opt['page'] and a['col'] == opt['col']:
                    d = abs(a['x'] - opt['x'])
                    if d < min_dist:
                        min_dist = d
                        best_opt_idx = opt['idx']
                        
        letter = ['Α', 'Β', 'Γ', 'Δ', 'Ε'][best_opt_idx]
        final_questions.append({
            'id': q['id'],
            'chapterId': q['chapterId'],
            'chapterTitle': q['chapterTitle'],
            'question': stem,
            'options': opts_formatted,
            'correctAnswer': best_opt_idx,
            'bookAnswerLetter': letter
        })
    return final_questions

if __name__ == '__main__':
    doc = fitz.open(pdf_path)
    # Chapter 1: pages 4-17 (0-indexed 3-16), questions 1-204
    ch1_qs = extract_chapter_questions(doc, 3, 16, 1, 204, 1, "Εφαρμοσμένη ανατομία στη χειρουργική")
    # Chapter 2: pages 17-26 (0-indexed 16-25), questions 205-381
    ch2_qs = extract_chapter_questions(doc, 16, 25, 205, 381, 2, "Εφαρμοσμένη φυσιολογία στη χειρουργική")
    
    all_qs = ch1_qs + ch2_qs
    print(f"Extracted Chapter 1: {len(ch1_qs)} questions")
    print(f"Extracted Chapter 2: {len(ch2_qs)} questions")
    print(f"Total extracted: {len(all_qs)} questions")
    
    out_file = r'C:\Users\taste\Desktop\GitHub\pathology_by_TseLkos\SURGERY\surgery_questions.js'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("// 4004 Ερωτήσεις Πολλαπλής Χειρουργικής - Δεδομένα Ερωτήσεων\n")
        f.write("const SURGERY_QUESTIONS = ")
        json.dump(all_qs, f, ensure_ascii=False, indent=2)
        f.write(";\n\nif (typeof module !== 'undefined' && module.exports) { module.exports = { SURGERY_QUESTIONS }; }\n")
    print(f"Successfully saved to {out_file}")
