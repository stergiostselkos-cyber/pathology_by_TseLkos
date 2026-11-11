import fitz, re, sys, unicodedata, json, os

CHAPTERS = [
    (1, 204, "Εφαρμοσμένη ανατομία στη χειρουργική"),
    (205, 381, "Εφαρμοσμένη φυσιολογία στη χειρουργική"),
    (382, 616, "Εφαρμοσμένη παθολογία και παθολογική ανατομία στη χειρουργική"),
    (617, 746, "Αρχές χειρουργικής ογκολογίας"),
    (747, 950, "Προεγχειρητική ετοιμασία - Αναισθησιολογία - Χειρουργική τεχνική"),
    (951, 1115, "Μετεγχειρητική φροντίδα - Επιπλοκές - Καταπληξία"),
    (1116, 1328, "Υγρά & ηλεκτρολύτες - Οξεοβασική ισορροπία - Θρέψη - Πήξη"),
    (1329, 1519, "Φλεγμονή - Λοίμωξη - Χειρουργική ανοσολογία & μικροβιολογία"),
    (1520, 1697, "Χειρουργική οισοφάγου"),
    (1698, 1880, "Χειρουργική στομάχου - δωδεκαδακτύλου"),
    (1881, 1987, "Χειρουργική λεπτού εντέρου"),
    (1988, 2296, "Χειρουργική παχέος εντέρου"),
    (2297, 2817, "Χειρουργική ήπατος - χοληφόρων - παγκρέατος - σπληνός"),
    (2818, 2979, "Χειρουργική ενδοκρινών αδένων"),
    (2980, 3132, "Χειρουργική μαστού"),
    (3133, 3174, "Χειρουργικές παθήσεις δέρματος και υποδορίου"),
    (3175, 3256, "Χειρουργική θώρακος"),
    (3257, 3337, "Οξεία κοιλία - Αιμορραγία πεπτικού"),
    (3338, 3441, "Χειρουργική κοιλιακού τοιχώματος"),
    (3442, 3790, "Τραύμα"),
    (3791, 3802, "Τράχηλος"),
    (3803, 3843, "Μεταμοσχεύσεις"),
    (3844, 3964, "Αγγειοχειρουργική"),
    (3965, 4004, "Πυρηνική ιατρική στη χειρουργική")
]

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
        (r'[-‐¬]\s+', '') # recombine hyphenated words at line wraps
    ]
    for pat, repl in common_swaps:
        text = re.sub(pat, repl, text)

    return re.sub(r'[ \t]+', ' ', text).strip()

def col_from_y(y):
    if y < 250: return 0
    elif y < 480: return 1
    elif y < 695: return 2
    else: return 3

def get_page_stream_and_annots(doc, pno):
    page = doc.load_page(pno)
    words = page.get_text('words')
    
    # Safe annots
    annots = []
    annot = page.first_annot
    while annot:
        r = annot.rect
        ax = (r.x0 + r.x1) / 2
        ay = (r.y0 + r.y1) / 2
        annots.append({
            'page': pno,
            'col': col_from_y(ay),
            'x': ax,
            'y': ay
        })
        annot = annot.next
        
    cols = {0: [], 1: [], 2: [], 3: []}
    for w in words:
        mid_y = (w[1] + w[3]) / 2
        cols[col_from_y(mid_y)].append(w)
        
    stream = []
    for c in range(4):
        # On page 3 (first question page), cols 0 & 1 are title page
        if pno == 3 and c < 2: continue
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
            # filter running headers
            if lx > 620 and any(h in txt for h in ['4004', '4604', 'ΕΦΑΡΜΟΣΜΕΝΗ', 'ΧΕΙΡΟΥΡΓΙΚΗ', 'ΕΡΩΤΗΣΕΙΣ', 'ΑΝΑΤΟΜΙΑ', 'ΦΥΣΙΟΛΟΓΙΑ']):
                continue
            stream.append({'page': pno, 'col': c, 'x': lx, 'y': ly, 'text': txt})
            
    return stream, annots

def parse_chapter_1(doc):
    all_stream = []
    all_annots = []
    # Chapter 1 is on pages 4 to 17 (0-indexed 3 to 16)
    for pno in range(3, 17):
        s, a = get_page_stream_and_annots(doc, pno)
        all_stream.extend(s)
        all_annots.extend(a)
        
    print(f"Total stream lines: {len(all_stream)}, Annots: {len(all_annots)}")
    return all_stream, all_annots

if __name__ == '__main__':
    pdf_path = r'D:\OneDrive\ΜΑΘΗΜΑΤΑ ΙΑΤΡΙΚΗΣ\8ΟΥ ΕΞΑΜΗΝΟ\ΧΕΙΡΟΥΡΓΙΚΗ Ι\pollaplis\4004_ocred_answered.pdf'
    doc = fitz.open(pdf_path)
    stream, annots = parse_chapter_1(doc)

