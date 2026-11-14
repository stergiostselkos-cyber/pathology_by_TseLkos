/**
 * PathologiaQuiz - Pharmacology Database: Φάρμακα Οστεοπόρωσης
 * Ίδιο σχήμα με το data/pharma_database.js (substance / category / guide_summary).
 * Σκευάσματα: Γαληνός (galinos.gr), Νοέμβριος 2026.
 * Φόρτωση: <script src="data/pharma_osteoporosi.js"></script> ΜΕΤΑ το pharma_database.js.
 */
const pharmaOsteoporosi = [
  {
    "id": "pharma-ost-s1-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s1",
    "url": "pharmaka/osteoporosi.html#s1",
    "category": "1. Βασική θεραπεία: ασβέστιο και βιταμίνη D",
    "substance": "Ανθρακικό ασβέστιο (σε συνδυασμό με βιταμίνη D3)",
    "inn": "Calcium carbonate + Colecalciferol",
    "note": "Τα περισσότερα σκευάσματα του εμπορίου είναι σταθεροί συνδυασμοί ανθρακικού ασβεστίου και χοληκαλσιφερόλης (π.χ. 600 mg Ca + 400–1000 IU D3 ή 1000–1200 mg Ca + 800–880 IU D3).",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcium",
    "brands": [
      "CALCIORAL D3",
      "CALCIFORM D3",
      "MEGACALCIUM-D",
      "CADELIUS",
      "CALDE-VIT",
      "NATECAL D3",
      "IDEOS",
      "ORBICAL D3",
      "CALVIDIN",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "CALCIORAL D3",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "CALCIFORM D3",
        "tag": "1000 mg Ca + 880 IU D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "MEGACALCIUM-D",
        "tag": "αναβράζοντα δισκία",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "CADELIUS",
        "tag": "διασπειρόμενα στο στόμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "CALDE-VIT",
        "tag": "μασώμενα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "NATECAL D3",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "IDEOS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "ORBICAL D3",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "CALVIDIN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      }
    ],
    "brands_str": "CALCIORAL D3, CALCIFORM D3, MEGACALCIUM-D, CADELIUS, CALDE-VIT, NATECAL D3, IDEOS, ORBICAL D3, CALVIDIN, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Ανθρακικό ασβέστιο → στο όξινο περιβάλλον του στομάχου απελευθερώνει Ca²⁺ → απορρόφηση 20–30% στο λεπτό έντερο (ενεργός μεταφορά εξαρτώμενη από την καλσιτριόλη).",
      "Η βιταμίνη D3 του συνδυασμού αυξάνει την εντερική απορρόφηση του ασβεστίου → ↓ PTH → ↓ οστική απορρόφηση."
    ],
    "indications": [
      "Συμπλήρωμα ασβεστίου και βιταμίνης D μαζί με την ειδική αντιοστεοπορωτική θεραπεία.",
      "Πρόληψη και θεραπεία της ανεπάρκειας ασβεστίου και βιταμίνης D στους ηλικιωμένους.",
      "Το ανθρακικό ασβέστιο χρησιμοποιείται επίσης ως αντιόξινο και ως δεσμευτικό φωσφόρου στη χρόνια νεφρική νόσο."
    ],
    "contraindications": [
      "Υπερασβεστιαιμία, υπερασβεστιουρία, νεφρολιθίαση από ασβέστιο.",
      "Υπερευαισθησία στα έκδοχα (π.χ. σογιέλαιο σε ορισμένα σκευάσματα)."
    ],
    "adverse_effects": [
      "Δυσκοιλιότητα, μετεωρισμός, ναυτία.",
      "Αρτηριακή αποτιτάνωση σε χρόνια νεφρική νόσο."
    ],
    "pearls": [
      "Το ανθρακικό ασβέστιο χρειάζεται γαστρικό οξύ → λαμβάνεται μαζί με το φαγητό. Σε αχλωρυδρία ή υπό αναστολείς αντλίας πρωτονίων απορροφάται καλύτερα το κιτρικό ασβέστιο.",
      "Δόσεις έως ~500–600 mg στοιχειακού ασβεστίου κάθε φορά. Μεγαλύτερες δόσεις χωρίζονται μέσα στην ημέρα, γιατί η απορρόφηση κορέννυται.",
      "Τουλάχιστον 30 λεπτά μετά το από του στόματος διφωσφονικό (30 λεπτά για αλενδρονάτη και ρισεδρονάτη, 60 λεπτά για ιβανδρονάτη): το ασβέστιο δεσμεύει το διφωσφονικό στο έντερο και το αδρανοποιεί.",
      "Ελαττώνει την απορρόφηση σιδήρου, ψευδαργύρου, λεβοθυροξίνης, τετρακυκλινών, κινολονών και ρανελικού στροντίου → απόσταση αρκετών ωρών.",
      "Τα άλατα ασβεστίου δεν χορηγούνται ενδομυϊκά: προκαλούν τοπική νέκρωση."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · IU : διεθνείς μονάδες · ΧΝΝ : χρόνια νεφρική νόσος · 25(OH)D : 25-υδροξυβιταμίνη D · 1,25(OH)₂D : καλσιτριόλη (1,25-διυδροξυβιταμίνη D)",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s1-2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s1",
    "url": "pharmaka/osteoporosi.html#s1",
    "category": "1. Βασική θεραπεία: ασβέστιο και βιταμίνη D",
    "substance": "Χοληκαλσιφερόλη (βιταμίνη D3)",
    "inn": "Colecalciferol",
    "note": "Συνήθης δόση συντήρησης 800–1000 IU ημερησίως ή ισοδύναμη εβδομαδιαία ή μηνιαία δόση. Σε ανεπάρκεια χρησιμοποιούνται υψηλότερες δόσεις εφόδου.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3",
    "brands": [
      "DEFILL",
      "LECALCIF",
      "FOSAVANCE",
      "ADROVANCE",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "DEFILL",
        "tag": "10.000 και 20.000 IU",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "LECALCIF",
        "tag": "5.600, 12.500 και 25.000 IU",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "FOSAVANCE",
        "tag": "σε συνδυασμό με αλενδρονάτη",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "ADROVANCE",
        "tag": "σε συνδυασμό με αλενδρονάτη",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/vitamin-d3/marketing"
      }
    ],
    "brands_str": "DEFILL, LECALCIF, FOSAVANCE, ADROVANCE, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "D3 (σχηματίζεται στο δέρμα με την υπεριώδη ακτινοβολία ή λαμβάνεται από το στόμα) → 25-υδροξυλίωση στο ήπαρ → 25(OH)D (αποθηκευτική μορφή, αυτή που μετράμε) → 1α-υδροξυλίωση στον νεφρό → καλσιτριόλη (ενεργός ορμόνη).",
      "Καλσιτριόλη → πυρηνικός υποδοχέας βιταμίνης D στο εντερικό επιθήλιο → ↑ σύνθεση πρωτεϊνών μεταφοράς Ca²⁺ → ↑ απορρόφηση ασβεστίου και φωσφόρου.",
      "Επαρκές ασβέστιο ορού → αναστολή της έκκρισης PTH → ↓ οστική απορρόφηση."
    ],
    "indications": [
      "Πρόληψη και θεραπεία της ανεπάρκειας βιταμίνης D.",
      "Συμπλήρωμα σε κάθε αντιοστεοπορωτική αγωγή.",
      "Διόρθωση της ανεπάρκειας πριν από ζολεδρονικό οξύ ή δενοσουμάμπη."
    ],
    "contraindications": [
      "Υπερασβεστιαιμία, υπερβιταμίνωση D.",
      "Προσοχή σε σαρκοείδωση και νεφρολιθίαση."
    ],
    "adverse_effects": [
      "Σε υπερδοσολογία: υπερασβεστιαιμία (ναυτία, πολυουρία, δυσκοιλιότητα, σύγχυση), υπερασβεστιουρία, νεφρολιθίαση."
    ],
    "pearls": [
      "Στη σοβαρή νεφρική νόσο η 1α-υδροξυλίωση είναι ελλιπής → εκεί χρειάζονται ενεργοί μεταβολίτες (καλσιτριόλη, αλφακαλσιδόλη), όχι απλή D3.",
      "Οι μεγάλες εφάπαξ ετήσιες δόσεις δεν προτιμώνται. Προτιμώνται οι ημερήσιες, εβδομαδιαίες ή μηνιαίες δόσεις.",
      "Οι σταθεροί συνδυασμοί αλενδρονάτης + D3 (FOSAVANCE, ADROVANCE, COVED, DIFOCIDOL, ACLONIA) δεν διορθώνουν μια υπάρχουσα ανεπάρκεια. Δίνουν μόνο δόση συντήρησης."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · IU : διεθνείς μονάδες · ΧΝΝ : χρόνια νεφρική νόσος · 25(OH)D : 25-υδροξυβιταμίνη D · 1,25(OH)₂D : καλσιτριόλη (1,25-διυδροξυβιταμίνη D)",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s1",
    "url": "pharmaka/osteoporosi.html#s1",
    "category": "1. Βασική θεραπεία: ασβέστιο και βιταμίνη D",
    "substance": "1. Βασική θεραπεία: ασβέστιο και βιταμίνη D",
    "inn": "",
    "note": "Κατηγορία: 1. Βασική θεραπεία: ασβέστιο και βιταμίνη D",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Ανεπαρκές ασβέστιο ή βιταμίνη D → ↓ εντερική απορρόφηση Ca²⁺ → ↓ ασβέστιο ορού → ↑ PTH (παραθορμόνη, δευτεροπαθής υπερπαραθυρεοειδισμός) → ↑ οστεοκλαστική απορρόφηση → απώλεια οστικής μάζας.",
      "Χοληκαλσιφερόλη (D3) → 25-υδροξυλίωση στο ήπαρ → 1α-υδροξυλίωση στον νεφρό → καλσιτριόλη → ↑ απορρόφηση Ca²⁺ και φωσφόρου από το έντερο → επαρκές υλικό για την επιμετάλλωση του οστεοειδούς.",
      "Το ασβέστιο και η βιταμίνη D δεν είναι αντιοστεοπορωτικά φάρμακα από μόνα τους. Είναι το υπόβαθρο πάνω στο οποίο δρουν όλα τα υπόλοιπα."
    ],
    "indications": [
      "«Θεραπεία: Βήμα 1ο» για κάθε ασθενή με οστεοπόρωση ή υψηλό κίνδυνο κατάγματος.",
      "Υποχρεωτική συγχορήγηση με κάθε αντιοστεοπορωτικό φάρμακο όταν η πρόσληψη από τη διατροφή δεν επαρκεί.",
      "Διόρθωση της ανεπάρκειας βιταμίνης D πριν από παρεντερική αντιαπορροφητική αγωγή (ζολεδρονικό οξύ, δενοσουμάμπη), ώστε να μην προκληθεί υπασβεστιαιμία."
    ],
    "contraindications": [
      "Υπερασβεστιαιμία και υπερασβεστιουρία οποιασδήποτε αιτίας.",
      "Νεφρολιθίαση από ασβέστιο: προσοχή.",
      "Σαρκοείδωση και άλλα κοκκιώματα (έκτοπη παραγωγή καλσιτριόλης → υπερασβεστιαιμία): προσοχή στη βιταμίνη D."
    ],
    "adverse_effects": [
      "Δυσκοιλιότητα, μετεωρισμός, δυσπεψία (κυρίως το ανθρακικό ασβέστιο).",
      "Υπερασβεστιαιμία και υπερασβεστιουρία σε υπερδοσολογία.",
      "Αρτηριακή αποτιτάνωση σε ασθενείς με χρόνια νεφρική νόσο."
    ],
    "pearls": [
      "Γενικά μέτρα του «Βήματος 1»: επαρκής πρόσληψη πρωτεΐνης (όχι κατάχρηση), διακοπή καπνίσματος, αποφυγή κατάχρησης αλκοόλ και καφέ, άσκηση.",
      "Προτιμάται το ασβέστιο από τη διατροφή. Το συμπλήρωμα καλύπτει μόνο τη διαφορά."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · IU : διεθνείς μονάδες · ΧΝΝ : χρόνια νεφρική νόσος · 25(OH)D : 25-υδροξυβιταμίνη D · 1,25(OH)₂D : καλσιτριόλη (1,25-διυδροξυβιταμίνη D)",
    "type": "category"
  },
  {
    "id": "pharma-ost-s2-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s2",
    "url": "pharmaka/osteoporosi.html#s2",
    "category": "2. Θεραπεία ορμονικής υποκατάστασης (ΘΟΥ)",
    "substance": "Οιστραδιόλη",
    "inn": "Estradiol",
    "note": "Στη διαφάνεια του μαθήματος τίθεται το ερώτημα «Tab ή TTS?»: δισκίο ή διαδερμικό έμπλαστρο. Η διαδερμική οδός παρακάμπτει το ήπαρ.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol",
    "brands": [
      "ESTRADOT",
      "OESTROGEL",
      "DERMESTRIL",
      "ESTRAMON",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "ESTRADOT",
        "tag": "διαδερμικό έμπλαστρο 25–100 μg/24 h",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol/marketing"
      },
      {
        "name": "OESTROGEL",
        "tag": "διαδερμική γέλη",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol/marketing"
      },
      {
        "name": "DERMESTRIL",
        "tag": "έμπλαστρο, μέσω ΙΦΕΤ",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol/marketing"
      },
      {
        "name": "ESTRAMON",
        "tag": "μέσω ΙΦΕΤ",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/estradiol/marketing"
      }
    ],
    "brands_str": "ESTRADOT, OESTROGEL, DERMESTRIL, ESTRAMON, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "17β-οιστραδιόλη → σύνδεση με τους οιστρογονικούς υποδοχείς των οστεοβλαστών και των οστεοκυττάρων → ↓ RANKL, ↑ οστεοπροτεγερίνη → ↓ οστεοκλαστογένεση → ↓ οστική απορρόφηση."
    ],
    "indications": [
      "Συμπτώματα εμμηνόπαυσης. Πρόληψη της οστεοπόρωσης σε μετεμμηνοπαυσιακές γυναίκες με υψηλό κίνδυνο κατάγματος, όταν άλλα φάρμακα δεν είναι ανεκτά ή αντενδείκνυνται."
    ],
    "contraindications": [
      "Καρκίνος μαστού ή ενδομητρίου, φλεβική θρομβοεμβολή, πρόσφατο έμφραγμα ή ΑΕΕ, αδιάγνωστη κολπική αιμορραγία, ενεργός ηπατοπάθεια, κύηση."
    ],
    "adverse_effects": [
      "Κολπική αιμόρροια, μαστοδυνία, κεφαλαλγία, ναυτία.",
      "Φλεβική θρομβοεμβολή, καρκίνος μαστού, ΑΕΕ."
    ],
    "pearls": [
      "Διαδερμικά (έμπλαστρο, γέλη): χωρίς φαινόμενο πρώτης διόδου → μικρότερη επίδραση στην ηπατική σύνθεση παραγόντων πήξης → μικρότερος θρομβοεμβολικός κίνδυνος από τα δισκία, και λιγότερη επίδραση των ενζυμικών επαγωγέων.",
      "Το έμπλαστρο ESTRADOT αλλάζεται δύο φορές την εβδομάδα (κάθε 3–4 ημέρες).",
      "Όταν η ΘΟΥ διακοπεί, η οστική απώλεια ξαναρχίζει → χρειάζεται εκτίμηση για άλλο αντιοστεοπορωτικό φάρμακο."
    ],
    "abbreviations": "Συντομογραφίες ΘΟΥ : θεραπεία ορμονικής υποκατάστασης · TTS : διαδερμικό θεραπευτικό σύστημα (έμπλαστρο) · RANKL : συνδέτης του ενεργοποιητή του υποδοχέα του πυρηνικού παράγοντα κΒ · IL-6 : ιντερλευκίνη 6 · WHI : Women's Health Initiative · ΙΦΕΤ : Ινστιτούτο Φαρμακευτικής Έρευνας και Τεχνολογίας",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s2",
    "url": "pharmaka/osteoporosi.html#s2",
    "category": "2. Θεραπεία ορμονικής υποκατάστασης (ΘΟΥ)",
    "substance": "2. Θεραπεία ορμονικής υποκατάστασης (ΘΟΥ)",
    "inn": "",
    "note": "Κατηγορία: 2. Θεραπεία ορμονικής υποκατάστασης (ΘΟΥ)",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Εμμηνόπαυση → απότομη ↓ οιστρογόνων → ↑ έκφραση RANKL και κυτταροκινών (IL-6) → ↑ στρατολόγηση, διαφοροποίηση και επιβίωση οστεοκλαστών → ταχεία οστική απώλεια (κυρίως σπογγώδες οστό, σπόνδυλοι).",
      "Χορήγηση οιστρογόνων → αναστολή της μεταγραφής του RANKL και της IL-6 → ↓ οστεοκλαστογένεση + ↑ απόπτωση οστεοκλαστών + ↓ απόπτωση οστεοβλαστών και οστεοκυττάρων → ↓ οστική απορρόφηση."
    ],
    "indications": [
      "Πρόληψη της μετεμμηνοπαυσιακής οστεοπόρωσης σε γυναίκες με υψηλό κίνδυνο κατάγματος, ιδίως όταν συνυπάρχουν συμπτώματα εμμηνόπαυσης (εξάψεις, ξηρότητα κόλπου).",
      "Δεν αποτελεί θεραπεία πρώτης γραμμής για την οστεοπόρωση μόνη της."
    ],
    "contraindications": [
      "Καρκίνος μαστού ή άλλος οιστρογονοεξαρτώμενος όγκος (γνωστός ή ύποπτος).",
      "Ιστορικό φλεβικής θρομβοεμβολής ή θρομβοφιλία. Πρόσφατο αρτηριακό θρομβοεμβολικό επεισόδιο (έμφραγμα, ΑΕΕ).",
      "Αδιάγνωστη κολπική αιμορραγία. Ενεργός ηπατοπάθεια."
    ],
    "adverse_effects": [
      "Κολπική αιμόρροια, μαστοδυνία (συχνή αιτία διακοπής).",
      "Φλεβική θρομβοεμβολή: τα από του στόματος οιστρογόνα → φαινόμενο πρώτης διόδου → ↑ ηπατική σύνθεση παραγόντων πήξης.",
      "Καρκίνος μαστού (μακροχρόνια) και ΑΕΕ. Καρκίνος ενδομητρίου, αν χορηγηθεί οιστρογόνο χωρίς προγεσταγόνο σε γυναίκα με μήτρα."
    ],
    "pearls": [
      "Η μελέτη WHI (2002) έδειξε ότι ο κίνδυνος καρκίνου του μαστού και ΑΕΕ υπερτερεί του οστικού οφέλους στις μεγαλύτερες γυναίκες → η ΘΟΥ έπαψε να είναι η κύρια θεραπεία της οστεοπόρωσης.",
      "Σε γυναίκα με μήτρα το οιστρογόνο συνδυάζεται πάντα με προγεσταγόνο (προστασία ενδομητρίου)."
    ],
    "abbreviations": "Συντομογραφίες ΘΟΥ : θεραπεία ορμονικής υποκατάστασης · TTS : διαδερμικό θεραπευτικό σύστημα (έμπλαστρο) · RANKL : συνδέτης του ενεργοποιητή του υποδοχέα του πυρηνικού παράγοντα κΒ · IL-6 : ιντερλευκίνη 6 · WHI : Women's Health Initiative · ΙΦΕΤ : Ινστιτούτο Φαρμακευτικής Έρευνας και Τεχνολογίας",
    "type": "category"
  },
  {
    "id": "pharma-ost-s3-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s3",
    "url": "pharmaka/osteoporosi.html#s3",
    "category": "3. Εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων (SERMs)",
    "substance": "Ραλοξιφαίνη",
    "inn": "Raloxifene",
    "note": "60 mg μία φορά την ημέρα από το στόμα, οποιαδήποτε ώρα, ανεξάρτητα από τα γεύματα.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene",
    "brands": [
      "EVISTA",
      "RAZYLAN",
      "OSTIRAL",
      "RATNAL",
      "RALOXIFENE/TEVA",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "EVISTA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      },
      {
        "name": "RAZYLAN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      },
      {
        "name": "OSTIRAL",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      },
      {
        "name": "RATNAL",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      },
      {
        "name": "RALOXIFENE/TEVA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/raloxifene/marketing"
      }
    ],
    "brands_str": "EVISTA, RAZYLAN, OSTIRAL, RATNAL, RALOXIFENE/TEVA, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αγωνιστής του ER στο οστό → ↓ οστική απορρόφηση και ↓ οστικός ανασχηματισμός → ↑ σπονδυλική BMD και ↓ σπονδυλικά κατάγματα.",
      "Ανταγωνιστής του ER στον μαστό και στο ενδομήτριο → ↓ επίπτωση διηθητικού, οιστρογονοεξαρτώμενου καρκίνου του μαστού, χωρίς υπερπλασία ενδομητρίου.",
      "Φαρμακοκινητική: εκτεταμένος μεταβολισμός πρώτης διόδου (γλυκουρονιδίωση) → απέκκριση κυρίως με τα κόπρανα."
    ],
    "indications": [
      "Θεραπεία και πρόληψη της οστεοπόρωσης σε μετεμμηνοπαυσιακές γυναίκες.",
      "Πιθανώς προτιμότερη για πρόληψη της οστεοπόρωσης σε γυναίκες με οικογενειακό ιστορικό καρκίνου του μαστού."
    ],
    "contraindications": [
      "Ενεργό ή ιστορικό φλεβικής θρομβοεμβολής.",
      "Γυναίκες με δυνατότητα τεκνοποίησης. Ηπατική δυσλειτουργία, σοβαρή νεφρική δυσλειτουργία, αδιάγνωστη αιμορραγία από τη μήτρα, καρκίνος ενδομητρίου."
    ],
    "adverse_effects": [
      "Φλεβική θρομβοεμβολή (εν τω βάθει φλεβοθρόμβωση, πνευμονική εμβολή).",
      "Εξάψεις, κράμπες κάτω άκρων, περιφερικό οίδημα, γριππώδη συμπτώματα.",
      "Αυξημένη θνητότητα από ΑΕΕ σε γυναίκες με υψηλό καρδιαγγειακό κίνδυνο."
    ],
    "pearls": [
      "Διακόπτεται έγκαιρα (ιδανικά 3 ημέρες πριν) σε κάθε κατάσταση παρατεταμένης ακινητοποίησης: χειρουργείο, νοσηλεία, πολύωρο ταξίδι.",
      "Δεν μειώνει τα μη σπονδυλικά κατάγματα σε επαρκώς ισχυρές μελέτες → δεν αρκεί σε ασθενή που έχει ήδη σπονδυλικό κάταγμα και υψηλό κίνδυνο κατάγματος ισχίου.",
      "Δεν μειώνει ούτε αυξάνει τη στεφανιαία νόσο, παρότι βελτιώνει την LDL."
    ],
    "abbreviations": "Συντομογραφίες SERMs : εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων · ER : οιστρογονικός υποδοχέας · LDL : λιποπρωτεΐνη χαμηλής πυκνότητας · VTE : φλεβική θρομβοεμβολή · ΑΕΕ : αγγειακό εγκεφαλικό επεισόδιο",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s3-2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s3",
    "url": "pharmaka/osteoporosi.html#s3",
    "category": "3. Εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων (SERMs)",
    "substance": "Βαζεδοξιφένη",
    "inn": "Bazedoxifene",
    "note": "20 mg μία φορά την ημέρα. Δεύτερος εκπρόσωπος των SERMs στη διαφάνεια του μαθήματος.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/bazedoxifene",
    "brands": [
      "CONBRIZA",
      "Κυκλοφορεί μόνο 1 σκεύασμα",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "CONBRIZA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/conbriza"
      },
      {
        "name": "Κυκλοφορεί μόνο 1 σκεύασμα",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/bazedoxifene"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/conbriza"
      }
    ],
    "brands_str": "CONBRIZA, Κυκλοφορεί μόνο 1 σκεύασμα, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αγωνιστής του ER στο οστό → ↓ οστική απορρόφηση και ↓ δείκτες οστικού μεταβολισμού στα προεμμηνοπαυσιακά επίπεδα → ↑ BMD → ↓ σπονδυλικά κατάγματα.",
      "Ανταγωνιστής του ER στη μήτρα και στον μαστό."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή οστεοπόρωση με αυξημένο κίνδυνο κατάγματος. Μειώνει σημαντικά τα σπονδυλικά κατάγματα. Η αποτελεσματικότητα στα κατάγματα ισχίου δεν έχει τεκμηριωθεί."
    ],
    "contraindications": [
      "Ενεργό ή ιστορικό φλεβικής θρομβοεμβολής. Αδιάγνωστη αιμορραγία από τη μήτρα, καρκίνος ενδομητρίου, γυναίκες με δυνατότητα τεκνοποίησης."
    ],
    "adverse_effects": [
      "Φλεβική θρομβοεμβολή, εξάψεις, κράμπες κάτω άκρων, περιφερικό οίδημα."
    ],
    "pearls": [
      "Όπως και η ραλοξιφαίνη: διακοπή πριν από παρατεταμένη ακινητοποίηση. Δεν είναι επιλογή για ασθενή με υψηλό κίνδυνο κατάγματος ισχίου."
    ],
    "abbreviations": "Συντομογραφίες SERMs : εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων · ER : οιστρογονικός υποδοχέας · LDL : λιποπρωτεΐνη χαμηλής πυκνότητας · VTE : φλεβική θρομβοεμβολή · ΑΕΕ : αγγειακό εγκεφαλικό επεισόδιο",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s3",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s3",
    "url": "pharmaka/osteoporosi.html#s3",
    "category": "3. Εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων (SERMs)",
    "substance": "3. Εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων (SERMs)",
    "inn": "",
    "note": "Κατηγορία: 3. Εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων (SERMs)",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "SERM → σύνδεση με τον οιστρογονικό υποδοχέα (ER) → το σύμπλοκο SERM-ER αλλάζει διαμόρφωση → προσλαμβάνει διαφορετικούς συνενεργοποιητές ή συγκαταστολείς σε κάθε ιστό → αγωνιστική δράση σε κάποιους ιστούς, ανταγωνιστική σε άλλους.",
      "Οστό: αγωνιστής → ↓ οστική απορρόφηση. Λιπίδια: αγωνιστής → ↓ ολική και LDL χοληστερόλη. Μαστός και ενδομήτριο: ανταγωνιστής → ↓ καρκίνος μαστού, χωρίς διέγερση του ενδομητρίου.",
      "Ήπαρ (πήξη): αγωνιστής → ↑ παράγοντες πήξης → φλεβική θρομβοεμβολή, όπως με τα οιστρογόνα."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή οστεοπόρωση με κίνδυνο κυρίως σπονδυλικών καταγμάτων, ιδίως σε νεότερες μετεμμηνοπαυσιακές γυναίκες.",
      "Ιδιαίτερα χρήσιμα σε γυναίκες με αυξημένο κίνδυνο καρκίνου του μαστού (ραλοξιφαίνη)."
    ],
    "contraindications": [
      "Ιστορικό ή ενεργός φλεβική θρομβοεμβολή (εν τω βάθει φλεβοθρόμβωση, πνευμονική εμβολή, θρόμβωση φλεβών αμφιβληστροειδούς).",
      "Γυναίκες σε αναπαραγωγική ηλικία. Ηπατική ανεπάρκεια, σοβαρή νεφρική ανεπάρκεια, αδιάγνωστη αιμορραγία από τη μήτρα, καρκίνος ενδομητρίου."
    ],
    "adverse_effects": [
      "Φλεβική θρομβοεμβολή (η σημαντικότερη ανεπιθύμητη ενέργεια).",
      "Εξάψεις, κράμπες στα κάτω άκρα, περιφερικό οίδημα, γριππώδης συνδρομή."
    ],
    "pearls": [
      "Δεν αποδείχθηκε μείωση των καταγμάτων του ισχίου → δεν είναι επαρκής επιλογή όταν ο κίνδυνος μη σπονδυλικού ή ισχιακού κατάγματος είναι υψηλός.",
      "Δεν μειώνουν τις εξάψεις, αντίθετα μπορεί να τις επιδεινώσουν."
    ],
    "abbreviations": "Συντομογραφίες SERMs : εκλεκτικοί τροποποιητές των οιστρογονικών υποδοχέων · ER : οιστρογονικός υποδοχέας · LDL : λιποπρωτεΐνη χαμηλής πυκνότητας · VTE : φλεβική θρομβοεμβολή · ΑΕΕ : αγγειακό εγκεφαλικό επεισόδιο",
    "type": "category"
  },
  {
    "id": "pharma-ost-s4-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "Αλενδρονικό οξύ (αλενδρονάτη)",
    "inn": "Alendronic acid",
    "note": "70 mg μία φορά την εβδομάδα (ή 10 mg ημερησίως) από το στόμα. Ο πιο φθηνός και ο πιο μελετημένος εκπρόσωπος, συνήθως η πρώτη επιλογή.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic",
    "brands": [
      "FOSAMAX",
      "FOSALEN",
      "RIDON",
      "ALEFOS",
      "LOZOSTUN",
      "ZULGAR",
      "BINOSTO",
      "BONASOL",
      "FOSAVANCE",
      "ADROVANCE",
      "COVED",
      "DIFOCIDOL",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "FOSAMAX",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "FOSALEN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "RIDON",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "ALEFOS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "LOZOSTUN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "ZULGAR",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "BINOSTO",
        "tag": "αναβράζον δισκίο",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "BONASOL",
        "tag": "πόσιμο διάλυμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "FOSAVANCE",
        "tag": "σε συνδυασμό με βιταμίνη D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "ADROVANCE",
        "tag": "σε συνδυασμό με βιταμίνη D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "COVED",
        "tag": "σε συνδυασμό με βιταμίνη D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "DIFOCIDOL",
        "tag": "σε συνδυασμό με βιταμίνη D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/alendronic/marketing"
      }
    ],
    "brands_str": "FOSAMAX, FOSALEN, RIDON, ALEFOS, LOZOSTUN, ZULGAR, BINOSTO, BONASOL, FOSAVANCE, ADROVANCE, COVED, DIFOCIDOL, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αζωτούχο διφωσφονικό → ενσωμάτωση στον υδροξυαπατίτη → πρόσληψη από τον οστεοκλάστη → αναστολή της συνθάσης του FPP → ↓ πρενυλίωση → απόπτωση οστεοκλαστών → ↓ οστική απορρόφηση.",
      "Βιοδιαθεσιμότητα < 1% (~0,6%), που σχεδόν μηδενίζεται με την τροφή, τον καφέ, τον χυμό, το γάλα ή το μεταλλικό νερό → απόλυτη ανάγκη για λήψη νηστική μόνο με νερό βρύσης."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή οστεοπόρωση: μειώνει σπονδυλικά, μη σπονδυλικά και ισχιακά κατάγματα.",
      "Οστεοπόρωση στους άνδρες. Πρόληψη και θεραπεία της οστεοπόρωσης από γλυκοκορτικοειδή.",
      "Νόσος Paget."
    ],
    "contraindications": [
      "Ανωμαλίες του οισοφάγου που καθυστερούν την κένωση (στένωση, αχαλασία).",
      "Αδυναμία να παραμείνει ο ασθενής όρθιος ή καθιστός για τουλάχιστον 30 λεπτά.",
      "Υπασβεστιαιμία. Δεν συνιστάται με CrCl < 35 ml/min."
    ],
    "adverse_effects": [
      "Οισοφαγίτιδα, έλκη και διαβρώσεις οισοφάγου (σπάνια στένωση), δυσπεψία, παλινδρόμηση, κοιλιακό άλγος.",
      "Μυοσκελετικός πόνος.",
      "Σπάνια ONJ και άτυπα κατάγματα του μηριαίου."
    ],
    "pearls": [
      "Τρόπος λήψης: το πρωί αμέσως μετά το ξύπνημα, με άδειο στομάχι, με ένα γεμάτο ποτήρι νερό βρύσης (τουλάχιστον 200 ml). Όχι με γάλα, καφέ, χυμό ή μεταλλικό νερό.",
      "Για 30 λεπτά μετά: καμία τροφή, κανένα άλλο υγρό ή φάρμακο, και ο ασθενής μένει όρθιος ή καθιστός. Δεν ξαπλώνει πριν φάει το πρωινό.",
      "Το δισκίο καταπίνεται ολόκληρο. Δεν μασιέται και δεν αφήνεται να διαλυθεί στο στόμα (εξέλκωση του στοματοφάρυγγα). Δεν λαμβάνεται το βράδυ πριν από τον ύπνο.",
      "Αν παραλειφθεί η εβδομαδιαία δόση: λαμβάνεται το επόμενο πρωί που θα το θυμηθεί ο ασθενής, και μετά συνεχίζει την ίδια ημέρα της εβδομάδας όπως πριν. Ποτέ δύο δισκία την ίδια ημέρα.",
      "Νέα δυσφαγία, οδυνοφαγία, οπισθοστερνικό άλγος ή καύσος → διακοπή και ιατρική εκτίμηση.",
      "Η συγχορήγηση με τεριπαρατίδη μειώνει το αναβολικό αποτέλεσμα της τεριπαρατίδης."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s4-2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "Ρισεδρονικό οξύ (ρισεδρονάτη)",
    "inn": "Risedronic acid",
    "note": "35 mg μία φορά την εβδομάδα, ή 75 mg δύο συνεχόμενες ημέρες τον μήνα, ή 5 mg ημερησίως. Στη νόσο Paget 30 mg ημερησίως για 2 μήνες.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic",
    "brands": [
      "ACTONEL",
      "MOTIVUS",
      "BONMATE",
      "CLADRONATE",
      "ACTORID",
      "OSTORIS",
      "RISELIB",
      "RISEDRONATE+CALCIUM CARBONATE+VIT D3",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "ACTONEL",
        "tag": "5 mg και 30 mg",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "MOTIVUS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "BONMATE",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "CLADRONATE",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "ACTORID",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "OSTORIS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "RISELIB",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "RISEDRONATE+CALCIUM CARBONATE+VIT D3",
        "tag": "σε συνδυασμό με ασβέστιο και βιταμίνη D3",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/risedronic/marketing"
      }
    ],
    "brands_str": "ACTONEL, MOTIVUS, BONMATE, CLADRONATE, ACTORID, OSTORIS, RISELIB, RISEDRONATE+CALCIUM CARBONATE+VIT D3, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αζωτούχο (πυριδινικό) διφωσφονικό → αναστολή της συνθάσης του FPP στον οστεοκλάστη → αδυναμία λειτουργίας της αντλίας πρωτονίων που διαλύει τον υδροξυαπατίτη → ↓ σχηματισμός και ενεργοποίηση οστεοκλαστών, ↑ απόπτωση."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή οστεοπόρωση: μειώνει σπονδυλικά και ισχιακά κατάγματα.",
      "Οστεοπόρωση στους άνδρες. Πρόληψη της οστεοπόρωσης από γλυκοκορτικοειδή (5 mg ημερησίως).",
      "Νόσος Paget."
    ],
    "contraindications": [
      "Υπασβεστιαιμία. Σοβαρή νεφρική ανεπάρκεια (CrCl < 30 ml/min).",
      "Ανωμαλίες του οισοφάγου, αδυναμία παραμονής σε όρθια θέση 30 λεπτά. Κύηση, γαλουχία."
    ],
    "adverse_effects": [
      "Κοιλιακό άλγος, δυσπεψία, ναυτία, δυσκοιλιότητα ή διάρροια, αρθραλγία, μυοσκελετικός πόνος, κεφαλαλγία.",
      "Σπάνια ONJ, άτυπα κατάγματα, ραγοειδίτιδα."
    ],
    "pearls": [
      "Ίδιοι κανόνες με την αλενδρονάτη: με άδειο στομάχι, τουλάχιστον 30 λεπτά πριν από την πρώτη τροφή, ποτό ή φάρμακο της ημέρας, μόνο με σκέτο νερό, σε όρθια θέση. Ο ασθενής δεν ξαπλώνει για 30 λεπτά.",
      "Η απορρόφηση επηρεάζεται από την τροφή. Αν δεν γίνεται πριν από το πρωινό, το δισκίο λαμβάνεται ανάμεσα στα γεύματα ή το βράδυ, τουλάχιστον 2 ώρες πριν και 2 ώρες μετά από κάθε τροφή, φάρμακο ή υγρό εκτός από νερό, και τουλάχιστον 30 λεπτά πριν από την κατάκλιση.",
      "Στο σχήμα των 75 mg, τα δύο δισκία λαμβάνονται δύο συνεχόμενες ημέρες, την ίδια ημερομηνία κάθε μήνα.",
      "Τα σκευάσματα ελεγχόμενης αποδέσμευσης (εκτός Ελλάδας) λαμβάνονται αμέσως μετά το πρωινό. Αυτό δεν ισχύει για τα κοινά δισκία."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s4-3",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "Ιβανδρονικό οξύ (ιβανδρονάτη)",
    "inn": "Ibandronic acid",
    "note": "Για την οστεοπόρωση: 150 mg μία φορά τον μήνα από το στόμα ή 3 mg ενδοφλεβίως κάθε 3 μήνες. Τα 50 mg (δισκία) και τα 6 mg (έγχυση) είναι ογκολογικές μορφές.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic",
    "brands": [
      "BONVIVA",
      "AXIBAL",
      "IBANATE",
      "SEDROPOR",
      "VOLIRAN",
      "OZILEN",
      "NUCODRAN",
      "BONDRONAT",
      "IASIBON",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "BONVIVA",
        "tag": "150 mg/μήνα δισκίο, 3 mg ενδοφλεβίως",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "AXIBAL",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "IBANATE",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "SEDROPOR",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "VOLIRAN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "OZILEN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "NUCODRAN",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "BONDRONAT",
        "tag": "50 mg και 6 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "IASIBON",
        "tag": "ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/ibandronic/marketing"
      }
    ],
    "brands_str": "BONVIVA, AXIBAL, IBANATE, SEDROPOR, VOLIRAN, OZILEN, NUCODRAN, BONDRONAT, IASIBON, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αζωτούχο διφωσφονικό με μεγάλη ισχύ → αναστολή της συνθάσης του FPP → απόπτωση οστεοκλαστών → ↓ οστική απορρόφηση. Η μεγάλη ισχύς επιτρέπει μηνιαία ή τριμηνιαία χορήγηση."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή οστεοπόρωση: μειώνει τα σπονδυλικά κατάγματα.",
      "Ογκολογικές μορφές: πρόληψη σκελετικών συμβαμάτων σε οστικές μεταστάσεις καρκίνου του μαστού, υπερασβεστιαιμία κακοήθειας."
    ],
    "contraindications": [
      "Υπασβεστιαιμία. Ανωμαλίες του οισοφάγου, αδυναμία παραμονής σε όρθια θέση για 60 λεπτά. Δεν συνιστάται με CrCl < 30 ml/min."
    ],
    "adverse_effects": [
      "Δυσπεψία, ναυτία, κοιλιακό άλγος, διάρροια, μυαλγίες, οσφυαλγία, κεφαλαλγία.",
      "Ενδοφλέβια: γριππώδης αντίδραση οξείας φάσης.",
      "Σπάνια ONJ, άτυπα κατάγματα."
    ],
    "pearls": [
      "Από του στόματος: μετά από ολονύκτια νηστεία, με ένα ποτήρι σκέτο νερό, τουλάχιστον 60 λεπτά πριν από την πρώτη τροφή, ποτό ή φάρμακο. Ο ασθενής μένει όρθιος ή καθιστός για 60 λεπτά (όχι 30 όπως με την αλενδρονάτη).",
      "Το μηνιαίο δισκίο λαμβάνεται την ίδια ημερομηνία κάθε μήνα.",
      "Στη δόση που κυκλοφορεί δεν αποδείχθηκε μείωση των μη σπονδυλικών και ισχιακών καταγμάτων → δεν είναι η κατάλληλη επιλογή όταν ο κίνδυνος κατάγματος ισχίου είναι υψηλός.",
      "Το ενδοφλέβιο των 3 mg (κάθε 3 μήνες) είναι λύση για ασθενείς που δεν ανέχονται ή δεν μπορούν να τηρήσουν τους κανόνες λήψης από το στόμα. Έλεγχος κρεατινίνης πριν από κάθε δόση."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s4-4",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "Ζολεδρονικό οξύ (ζολεδρονάτη)",
    "inn": "Zoledronic acid",
    "note": "Για την οστεοπόρωση: 5 mg/100 ml ενδοφλεβίως μία φορά τον χρόνο (ACLASTA, νοσοκομειακή χρήση). Το πιο ισχυρό διφωσφονικό. Τα 4 mg (ZOMETA κ.ά.) είναι ογκολογική μορφή κάθε 3–4 εβδομάδες.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid",
    "brands": [
      "ACLASTA",
      "ZOLMESTAT",
      "ZOLEDRONIC ACID/TEVA",
      "ZOLEDRONIC ACID/HOSPIRA",
      "ZOMETA",
      "ZOXALON",
      "NORDELOZ",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "ACLASTA",
        "tag": "5 mg/100 ml ετησίως, νοσοκομειακή χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "ZOLMESTAT",
        "tag": "5 mg/100 ml και 4 mg",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "ZOLEDRONIC ACID/TEVA",
        "tag": "5 mg/100 ml",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "ZOLEDRONIC ACID/HOSPIRA",
        "tag": "5 mg και 4 mg/100 ml",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "ZOMETA",
        "tag": "4 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "ZOXALON",
        "tag": "4 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "NORDELOZ",
        "tag": "4 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/zolendronic-acid/marketing"
      }
    ],
    "brands_str": "ACLASTA, ZOLMESTAT, ZOLEDRONIC ACID/TEVA, ZOLEDRONIC ACID/HOSPIRA, ZOMETA, ZOXALON, NORDELOZ, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αζωτούχο (ιμιδαζολικό) διφωσφονικό με τη μεγαλύτερη συγγένεια για τον υδροξυαπατίτη → ισχυρή και παρατεταμένη αναστολή της συνθάσης του FPP στους οστεοκλάστες → μία έγχυση καλύπτει 12 μήνες."
    ],
    "indications": [
      "Μετεμμηνοπαυσιακή και ανδρική οστεοπόρωση: μειώνει σπονδυλικά, μη σπονδυλικά και ισχιακά κατάγματα.",
      "Οστεοπόρωση από γλυκοκορτικοειδή. Μετά από χαμηλής ενέργειας κάταγμα ισχίου.",
      "Νόσος Paget: εφάπαξ έγχυση, φάρμακο εκλογής σε εκτεταμένη νόσο.",
      "Ογκολογικές μορφές (4 mg): υπερασβεστιαιμία κακοήθειας, οστικές μεταστάσεις, πολλαπλό μυέλωμα."
    ],
    "contraindications": [
      "Υπασβεστιαιμία. CrCl < 35 ml/min (ACLASTA).",
      "Κύηση και γαλουχία."
    ],
    "adverse_effects": [
      "Αντίδραση οξείας φάσης: πυρετός, μυαλγίες, αρθραλγίες, κεφαλαλγία, γριππώδης συνδρομή, συνήθως τις πρώτες 3 ημέρες μετά την πρώτη έγχυση. Υποχωρεί με παρακεταμόλη και είναι σπανιότερη στις επόμενες εγχύσεις.",
      "Υπασβεστιαιμία. Νεφρική δυσλειτουργία, κυρίως με ταχεία έγχυση ή αφυδάτωση.",
      "Φλεγμονή του οφθαλμού (ραγοειδίτιδα, επισκληρίτιδα). Σπάνια ONJ (κυρίως στις ογκολογικές δόσεις) και άτυπα κατάγματα."
    ],
    "pearls": [
      "Πριν από την έγχυση: επαρκής ενυδάτωση (ιδίως ηλικιωμένοι και ασθενείς υπό διουρητικά), μέτρηση κρεατινίνης και ασβεστίου, διόρθωση της ανεπάρκειας βιταμίνης D.",
      "Έγχυση σε τουλάχιστον 15 λεπτά. Η ταχύτερη έγχυση αυξάνει τη νεφροτοξικότητα.",
      "Μετά την έγχυση: επαρκές ασβέστιο και βιταμίνη D, ώστε να μην προκληθεί υπασβεστιαιμία.",
      "Μετά από κάταγμα ισχίου η πρώτη έγχυση γίνεται τουλάχιστον 2 εβδομάδες μετά τη χειρουργική αποκατάσταση.",
      "Ο ασθενής που παίρνει ACLASTA δεν παίρνει ταυτόχρονα ZOMETA ή άλλο ζολεδρονικό (ίδια ουσία).",
      "Είναι η συνήθης επιλογή για τη «γεφύρωση» μετά τη διακοπή της δενοσουμάμπης."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s4-5",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "Παμιδρονικό οξύ (παμιδρονάτη)",
    "inn": "Pamidronic acid",
    "note": "Μόνο ενδοφλέβια. Στη διαφάνεια του μαθήματος αναφέρεται μαζί με τα υπόλοιπα διφωσφονικά, αλλά δεν έχει ένδειξη για την οστεοπόρωση.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/atccodes/M05BA03",
    "brands": [
      "PAMIDRONATE/HOSPIRA",
      "PAMERIT",
      "Κυκλοφορούν μόνο 2 σκευάσματα",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "PAMIDRONATE/HOSPIRA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/atccodes/M05BA03"
      },
      {
        "name": "PAMERIT",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/atccodes/M05BA03"
      },
      {
        "name": "Κυκλοφορούν μόνο 2 σκευάσματα",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/atccodes/M05BA03"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/atccodes/M05BA03"
      }
    ],
    "brands_str": "PAMIDRONATE/HOSPIRA, PAMERIT, Κυκλοφορούν μόνο 2 σκευάσματα, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αζωτούχο διφωσφονικό 2ης γενιάς → καταστέλλει την εγκατάσταση των πρόδρομων οστεοκλαστών στο οστό και τη μετατροπή τους σε ώριμους απορροφητικούς οστεοκλάστες → ταχεία αναστολή της επιταχυνόμενης οστικής απορρόφησης."
    ],
    "indications": [
      "Υπερασβεστιαιμία κακοήθειας.",
      "Οστεολυτικές μεταστάσεις και πολλαπλό μυέλωμα (↓ οστικός πόνος και κατάγματα).",
      "Νόσος Paget."
    ],
    "contraindications": [
      "Υπερευαισθησία στα διφωσφονικά. Κύηση, γαλουχία. Προσοχή σε νεφρική ανεπάρκεια."
    ],
    "adverse_effects": [
      "Αντίδραση οξείας φάσης (πυρετός, γριππώδη συμπτώματα), υπασβεστιαιμία, υποφωσφαταιμία.",
      "Νεφροτοξικότητα (σπειραματοσκλήρυνση) με ταχεία έγχυση. ONJ στις ογκολογικές χρήσεις."
    ],
    "pearls": [
      "Δεν χορηγείται ποτέ ως ταχεία ενδοφλέβια ένεση. Αραιώνεται και χορηγείται ως βραδεία έγχυση σε ώρες.",
      "Στην υπερασβεστιαιμία η δράση αρχίζει σε 2–3 ημέρες → αρχικά χρειάζονται ενυδάτωση με φυσιολογικό ορό και καλσιτονίνη."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s4",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s4",
    "url": "pharmaka/osteoporosi.html#s4",
    "category": "4. Διφωσφονικά",
    "substance": "4. Διφωσφονικά",
    "inn": "",
    "note": "Κατηγορία: 4. Διφωσφονικά",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Ανάλογα του πυροφωσφορικού: ο υδρολύσιμος δεσμός P-O-P αντικαθίσταται από μη υδρολύσιμο P-C-P → δεν διασπώνται από ένζυμα → μεγάλη συγγένεια για τον υδροξυαπατίτη → ενσωματώνονται στο οστό, κυρίως στις επιφάνειες ενεργού ανασχηματισμού.",
      "Ο οστεοκλάστης απορροφά οστό → το όξινο περιβάλλον κάτω από αυτόν απελευθερώνει το διφωσφονικό → προσλαμβάνεται από τον ίδιο τον οστεοκλάστη.",
      "Αζωτούχα (αλενδρονάτη, ρισεδρονάτη, ιβανδρονάτη, παμιδρονάτη, ζολεδρονάτη): αναστολή της συνθάσης του FPP στην οδό του μεβαλονικού → ↓ πρενυλίωση μικρών GTPασών → οι πρωτεΐνες δεν αγκυροβολούνται στη μεμβράνη → ο οστεοκλάστης δεν προσκολλάται στο οστό και χάνει τη λειτουργία της H⁺-ATPάσης → απόπτωση.",
      "Μη αζωτούχα (1ης γενιάς, π.χ. ετιδρονάτη, κλοδρονάτη): ενσωματώνονται σε μη υδρολύσιμα ανάλογα ATP → συσσώρευση στον οστεοκλάστη → απόπτωση. Λιγότερο ισχυρά.",
      "Παραμονή στον σκελετό για μήνες ή χρόνια → η δράση συνεχίζεται και μετά τη διακοπή (βάση της «φαρμακευτικής διακοπής»)."
    ],
    "indications": [
      "Οστεοπόρωση μετεμμηνοπαυσιακή, ανδρική και από γλυκοκορτικοειδή: πρωτογενής πρόληψη καταγμάτων και δευτερογενής πρόληψη μετά από κάταγμα.",
      "Νόσος Paget των οστών.",
      "Κακοήθης νόσος των οστών (υπερασβεστιαιμία κακοήθειας, οστικές μεταστάσεις, πολλαπλό μυέλωμα): ενδοφλέβια, σε πολύ μεγαλύτερες δόσεις (ζολεδρονάτη 4 mg, παμιδρονάτη, ιβανδρονάτη 6 mg, κλοδρονάτη)."
    ],
    "contraindications": [
      "Υπασβεστιαιμία (πρέπει να διορθωθεί πριν από την έναρξη).",
      "Σοβαρή νεφρική ανεπάρκεια: δεν συνιστώνται με CrCl < 30–35 ml/min (αποβάλλονται αμετάβλητα από τον νεφρό).",
      "Από του στόματος: ανωμαλίες του οισοφάγου που καθυστερούν την κένωσή του (στένωση, αχαλασία) και αδυναμία παραμονής σε όρθια ή καθιστή θέση για 30–60 λεπτά.",
      "Κύηση και γαλουχία."
    ],
    "adverse_effects": [
      "Από του στόματος: οισοφαγίτιδα, διαβρώσεις και έλκη οισοφάγου, δυσπεψία, κοιλιακό άλγος, ναυτία.",
      "Ενδοφλέβια: αντίδραση οξείας φάσης (πυρετός, μυαλγίες, γριππώδης συνδρομή), κυρίως μετά την πρώτη έγχυση. Υπασβεστιαιμία. Νεφροτοξικότητα με ταχεία έγχυση.",
      "Μυοσκελετικός πόνος (οστά, αρθρώσεις, μύες).",
      "Σπάνιες αλλά σοβαρές: οστεονέκρωση της γνάθου (ONJ/MRONJ) και άτυπα κατάγματα του μηριαίου (AFF). Επίσης οστεονέκρωση του έξω ακουστικού πόρου και φλεγμονή του οφθαλμού (ραγοειδίτιδα, σκληρίτιδα)."
    ],
    "pearls": [
      "Οδοντιατρικός έλεγχος και αποκατάσταση πριν από την έναρξη, καλή στοματική υγιεινή κατά τη θεραπεία. Οι επεμβατικές οδοντιατρικές πράξεις είναι ο κύριος παράγοντας κινδύνου για ONJ.",
      "Ο κίνδυνος ONJ είναι πολύ μικρός στις δόσεις της οστεοπόρωσης. Οι ογκολογικές δόσεις είναι περίπου 9–10 φορές μεγαλύτερες.",
      "Πόνος στον μηρό ή στη βουβωνική χώρα υπό χρόνια θεραπεία → απεικόνιση και των δύο μηριαίων (τα άτυπα κατάγματα είναι συχνά αμφοτερόπλευρα).",
      "Η μακροχρόνια καταστολή του ανασχηματισμού μπορεί να εμποδίσει την επιδιόρθωση των μικρορωγμών → πιθανή βάση των άτυπων καταγμάτων.",
      "Επανεκτίμηση μετά από 5 χρόνια από του στόματος ή 3 χρόνια ενδοφλέβιας θεραπείας: πιθανή «φαρμακευτική διακοπή» μόνο σε ασθενείς χαμηλότερου κινδύνου."
    ],
    "abbreviations": "Συντομογραφίες ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · FPP : φαρνεσυλοπυροφωσφορικό · GTPάσες : υδρολάσες τριφωσφορικής γουανοσίνης · ATP : τριφωσφορική αδενοσίνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · ΣΜΣΚ : σκελετικά συμβάματα",
    "type": "category"
  },
  {
    "id": "pharma-ost-s5-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s5",
    "url": "pharmaka/osteoporosi.html#s5",
    "category": "5. Αναστολείς του RANKL (δενοσουμάμπη)",
    "substance": "Δενοσουμάμπη",
    "inn": "Denosumab",
    "note": "60 mg υποδορίως κάθε 6 μήνες (μηρός, κοιλιά ή άνω βραχίονας). Κυκλοφορούν πολλά βιοομοειδή του PROLIA. Τα σκευάσματα των 120 mg είναι μόνο για ογκολογική χρήση.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab",
    "brands": [
      "PROLIA",
      "JUBBONTI",
      "STOBOCLO",
      "OSVYRTI",
      "PONLIMSI",
      "EVFRAXY",
      "KEFDENSIS",
      "OBODENCE",
      "XGEVA",
      "WYOST",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "PROLIA",
        "tag": "60 mg, πρωτότυπο",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "JUBBONTI",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "STOBOCLO",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "OSVYRTI",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "PONLIMSI",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "EVFRAXY",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "KEFDENSIS",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "OBODENCE",
        "tag": "60 mg, βιοομοειδές",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "XGEVA",
        "tag": "120 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "WYOST",
        "tag": "120 mg, ογκολογική χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/denosumab/marketing"
      }
    ],
    "brands_str": "PROLIA, JUBBONTI, STOBOCLO, OSVYRTI, PONLIMSI, EVFRAXY, KEFDENSIS, OBODENCE, XGEVA, WYOST, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Αντίσωμα κατά του RANKL → ο RANKL δεν δεσμεύει τον RANK των πρόδρομων οστεοκλαστών → ↓ οστεοκλαστογένεση, ↓ λειτουργία, ↑ απόπτωση οστεοκλαστών → ↓ οστική απορρόφηση → ↑ BMD επί > 10 χρόνια χωρίς «πλατό».",
      "Μετά τη διακοπή: συσσωρευμένη «δεξαμενή» πρόδρομων οστεοκλαστών + απότομη άρση της αναστολής → εκρηκτική οστεοκλαστογένεση → πολύ υψηλός ανασχηματισμός → γρήγορη απώλεια της BMD που κερδήθηκε και πολλαπλά σπονδυλικά κατάγματα."
    ],
    "indications": [
      "Οστεοπόρωση μετεμμηνοπαυσιακή και ανδρική με αυξημένο κίνδυνο καταγμάτων.",
      "Οστική απώλεια από ορμονικό αποκλεισμό σε καρκίνο του προστάτη. Οστική απώλεια από μακροχρόνια συστηματικά γλυκοκορτικοειδή.",
      "Χρήσιμη επιλογή όταν τα διφωσφονικά αντενδείκνυνται (νεφρική ανεπάρκεια, προβλήματα οισοφάγου) ή δεν είναι ανεκτά."
    ],
    "contraindications": [
      "Υπασβεστιαιμία. Υπερευαισθησία. Παιδιά < 18 ετών (σοβαρή υπερασβεστιαιμία, αναστολή ανάπτυξης οστών και ανατολής δοντιών)."
    ],
    "adverse_effects": [
      "Μυοσκελετικός πόνος και πόνος στα άκρα (> 1/10).",
      "Υπασβεστιαιμία (ο κίνδυνος αυξάνει όσο χειροτερεύει η νεφρική λειτουργία), υποφωσφαταιμία.",
      "Κυτταρίτιδα, λοιμώξεις ουροποιητικού και ανώτερου αναπνευστικού, εξάνθημα, έκζεμα, δύσπνοια.",
      "Σπάνια ONJ, άτυπα κατάγματα του μηριαίου (συχνά αμφοτερόπλευρα, ελέγχεται και ο άλλος μηρός), οστεονέκρωση του έξω ακουστικού πόρου (σκέψη σε ασθενή με ωτικά συμπτώματα ή χρόνια ωτίτιδα)."
    ],
    "pearls": [
      "Πριν από την έναρξη: οδοντιατρικός έλεγχος, μέτρηση ασβεστίου και βιταμίνης D και διόρθωσή τους.",
      "Υπό θεραπεία: επαρκές ασβέστιο και βιταμίνη D σε όλους. Σε CrCl < 30 ml/min ή αιμοκάθαρση: μέτρηση ασβεστίου πριν από κάθε δόση και 1–2 εβδομάδες μετά.",
      "Η δόση γίνεται ακριβώς κάθε 6 μήνες. Καθυστέρηση πάνω από 1 μήνα αρχίζει να «ξεκλειδώνει» την οστική απορρόφηση. Ο ασθενής παίρνει κάρτα υπενθύμισης.",
      "Όταν αποφασιστεί διακοπή: διφωσφονικό (συνήθως ζολεδρονικό οξύ) περίπου 6 μήνες μετά την τελευταία ένεση, με έλεγχο των δεικτών ανασχηματισμού και πιθανή επανάληψη.",
      "Δεν συγχορηγείται με άλλο σκεύασμα δενοσουμάμπης (π.χ. XGEVA στον ογκολογικό ασθενή): ίδια ουσία.",
      "Επεμβατικές οδοντιατρικές πράξεις: αν χρειαστούν, γίνονται μακριά από τη δόση (κοντά στο τέλος του 6μήνου).",
      "Η ένεση γίνεται από τον ίδιο τον ασθενή ή επαγγελματία υγείας. Η σύριγγα φυλάσσεται στο ψυγείο και αφήνεται σε θερμοκρασία δωματίου πριν από τη χορήγηση."
    ],
    "abbreviations": "Συντομογραφίες RANKL : συνδέτης του ενεργοποιητή του υποδοχέα του πυρηνικού παράγοντα κΒ · RANK : ενεργοποιητής του υποδοχέα του πυρηνικού παράγοντα κΒ · OPG : οστεοπροτεγερίνη · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · ΧΝΝ : χρόνια νεφρική νόσος",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s5",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s5",
    "url": "pharmaka/osteoporosi.html#s5",
    "category": "5. Αναστολείς του RANKL (δενοσουμάμπη)",
    "substance": "5. Αναστολείς του RANKL (δενοσουμάμπη)",
    "inn": "",
    "note": "Κατηγορία: 5. Αναστολείς του RANKL (δενοσουμάμπη)",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Οστεοβλάστες και οστεοκύτταρα εκφράζουν RANKL → σύνδεση με τον υποδοχέα RANK στους πρόδρομους οστεοκλάστες → διαφοροποίηση, ενεργοποίηση και επιβίωση οστεοκλαστών. Φυσικός ανταγωνιστής: η οστεοπροτεγερίνη (OPG).",
      "Δενοσουμάμπη = πλήρως ανθρώπινο μονοκλωνικό αντίσωμα IgG2 που «μιμείται» την OPG → δεσμεύει τον RANKL → εμποδίζει τη σύνδεση RANKL-RANK → ↓ σχηματισμός, λειτουργία και επιβίωση οστεοκλαστών → ταχεία και ισχυρή ↓ οστικής απορρόφησης σε σπογγώδες και φλοιώδες οστό.",
      "Διαφορά από τα διφωσφονικά: δεν ενσωματώνεται στο οστό → η δράση είναι πλήρως αναστρέψιμη και χάνεται 6 μήνες μετά την τελευταία δόση."
    ],
    "indications": [
      "Οστεοπόρωση σε μετεμμηνοπαυσιακές γυναίκες και σε άνδρες με αυξημένο κίνδυνο καταγμάτων: μειώνει σπονδυλικά, μη σπονδυλικά και ισχιακά κατάγματα.",
      "Οστική απώλεια από ορμονικό αποκλεισμό σε καρκίνο του προστάτη και από αναστολείς της αρωματάσης. Οστεοπόρωση από γλυκοκορτικοειδή.",
      "Ογκολογική μορφή (120 mg κάθε 4 εβδομάδες): πρόληψη σκελετικών συμβαμάτων σε οστικές μεταστάσεις, γιγαντοκυτταρικός όγκος των οστών."
    ],
    "contraindications": [
      "Υπασβεστιαιμία (διορθώνεται πριν από την έναρξη).",
      "Υπερευαισθησία (και στο λάτεξ ορισμένων συριγγών)."
    ],
    "adverse_effects": [
      "Υπασβεστιαιμία, κυρίως σε σοβαρή νεφρική νόσο (CrCl < 30 ml/min) και σε αιμοκάθαρση. Υποφωσφαταιμία.",
      "Μυοσκελετικός πόνος και πόνος στα άκρα (οι πιο συχνές).",
      "Λοιμώξεις: κυτταρίτιδα, λοίμωξη ουροποιητικού και αναπνευστικού, ωτίτιδα. Εξάνθημα, έκζεμα.",
      "Σπάνια: ONJ, άτυπα κατάγματα του μηριαίου, οστεονέκρωση του έξω ακουστικού πόρου.",
      "Μετά τη διακοπή: απότομη αύξηση της οστικής απορρόφησης με πολλαπλά σπονδυλικά κατάγματα (rebound)."
    ],
    "pearls": [
      "ΠΟΤΕ απότομη διακοπή χωρίς σχέδιο. Η στρατηγική εξόδου αποφασίζεται πριν από την έναρξη.",
      "Δεν αποβάλλεται από τον νεφρό → μπορεί να δοθεί σε νεφρική ανεπάρκεια όπου τα διφωσφονικά αντενδείκνυνται, αλλά με στενή παρακολούθηση του ασβεστίου."
    ],
    "abbreviations": "Συντομογραφίες RANKL : συνδέτης του ενεργοποιητή του υποδοχέα του πυρηνικού παράγοντα κΒ · RANK : ενεργοποιητής του υποδοχέα του πυρηνικού παράγοντα κΒ · OPG : οστεοπροτεγερίνη · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης · ΧΝΝ : χρόνια νεφρική νόσος",
    "type": "category"
  },
  {
    "id": "pharma-ost-s6-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s6",
    "url": "pharmaka/osteoporosi.html#s6",
    "category": "6. Αναβολικά: ανάλογα της παραθορμόνης (PTH) και του PTHrP",
    "substance": "Τεριπαρατίδη",
    "inn": "Teriparatide",
    "note": "20 μg υποδορίως μία φορά την ημέρα (μηρός ή κοιλιά) με προγεμισμένη πένα 28 δόσεων. Μέγιστη διάρκεια 24 μήνες σε όλη τη ζωή του ασθενούς.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide",
    "brands": [
      "FORSTEO",
      "MOVYMIA",
      "SONDELBAY",
      "TETRIDAR",
      "OSTEOREL",
      "BONAMENS",
      "TERIPARATIDE/TEVA",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "FORSTEO",
        "tag": "πρωτότυπο",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "MOVYMIA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "SONDELBAY",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "TETRIDAR",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "OSTEOREL",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "BONAMENS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "TERIPARATIDE/TEVA",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/teriparatide/marketing"
      }
    ],
    "brands_str": "FORSTEO, MOVYMIA, SONDELBAY, TETRIDAR, OSTEOREL, BONAMENS, TERIPARATIDE/TEVA, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Ανασυνδυασμένο ενεργό τμήμα 1–34 της ανθρώπινης PTH (rhPTH 1–34) → διαλείπουσα διέγερση του PTH1R στους οστεοβλάστες → ↑ cAMP → ↑ αριθμός και δραστηριότητα οστεοβλαστών, ↓ απόπτωση → ↑ οστική μάζα και αντοχή.",
      "Χρόνος ημίσειας ζωής ~1 ώρα μετά την υποδόρια ένεση → σύντομη αιχμή → καθαρά αναβολικό σήμα."
    ],
    "indications": [
      "Οστεοπόρωση σε μετεμμηνοπαυσιακές γυναίκες και σε άνδρες με αυξημένο κίνδυνο κατάγματος: μειώνει σπονδυλικά και μη σπονδυλικά κατάγματα (όχι αποδεδειγμένα του ισχίου).",
      "Οστεοπόρωση από μακροχρόνια γλυκοκορτικοειδή: ανώτερη της αλενδρονάτης στην αύξηση της BMD και στη μείωση των σπονδυλικών καταγμάτων.",
      "Μελέτη VERO: ανώτερη της ρισεδρονάτης στη μείωση σπονδυλικών και κλινικών καταγμάτων σε ασθενείς πολύ υψηλού κινδύνου."
    ],
    "contraindications": [
      "Υπερασβεστιαιμία, σοβαρή νεφρική ανεπάρκεια, μεταβολικές νόσοι των οστών εκτός από την οστεοπόρωση (υπερπαραθυρεοειδισμός, νόσος Paget), ανεξήγητη αύξηση της αλκαλικής φωσφατάσης.",
      "Προηγούμενη ακτινοθεραπεία του σκελετού, κακοήθεια ή μεταστάσεις των οστών.",
      "Κύηση, γαλουχία, ανοικτές επιφύσεις."
    ],
    "adverse_effects": [
      "Ναυτία, πόνος στα άκρα, κεφαλαλγία, ζάλη (οι πιο συχνές). Κράμπες κάτω άκρων.",
      "Παροδική ορθοστατική υπόταση με τις πρώτες δόσεις.",
      "Παροδική υπερασβεστιαιμία (μέγιστη 4–6 ώρες μετά την ένεση, επάνοδος σε 16–24 ώρες), υπερασβεστιουρία, ↑ ουρικό οξύ."
    ],
    "pearls": [
      "Οι πρώτες ενέσεις γίνονται με τον ασθενή καθιστό ή ξαπλωμένο, ώστε να μην πέσει από ορθοστατική υπόταση.",
      "Το ασβέστιο ορού μετριέται τουλάχιστον 16 ώρες μετά την τελευταία ένεση, αλλιώς βρίσκεται ψευδώς αυξημένο.",
      "Προσοχή με τη διγοξίνη: η παροδική υπερασβεστιαιμία προδιαθέτει σε τοξικότητα από δακτυλίτιδα. Προσοχή σε ενεργό ή πρόσφατη ουρολιθίαση.",
      "Η πένα φυλάσσεται στο ψυγείο (2–8 °C), επιστρέφει στο ψυγείο αμέσως μετά τη χρήση και δεν καταψύχεται.",
      "Ο κύκλος των 24 μηνών δεν επαναλαμβάνεται ποτέ στη ζωή του ασθενούς.",
      "Η ταυτόχρονη αλενδρονάτη μειώνει το αναβολικό αποτέλεσμα → τα διφωσφονικά δίνονται ΜΕΤΑ, όχι μαζί."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · PTH1R : υποδοχέας τύπου 1 της παραθορμόνης · cAMP : κυκλική μονοφωσφορική αδενοσίνη · ALP : αλκαλική φωσφατάση · VERO : μελέτη σύγκρισης τεριπαρατίδης και ρισεδρονάτης · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s6-2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s6",
    "url": "pharmaka/osteoporosi.html#s6",
    "category": "6. Αναβολικά: ανάλογα της παραθορμόνης (PTH) και του PTHrP",
    "substance": "Αμπαλοπαρατίδη",
    "inn": "Abaloparatide",
    "note": "80 μg υποδορίως μία φορά την ημέρα. Μέγιστη διάρκεια 18 μήνες. Αναφέρεται στη διαφάνεια του μαθήματος ως ABL.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/abaloparatide",
    "brands": [
      "ELADYNOS",
      "Κυκλοφορεί μόνο 1 σκεύασμα",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "ELADYNOS",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/abaloparatide"
      },
      {
        "name": "Κυκλοφορεί μόνο 1 σκεύασμα",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/abaloparatide"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/abaloparatide"
      }
    ],
    "brands_str": "ELADYNOS, Κυκλοφορεί μόνο 1 σκεύασμα, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Πεπτίδιο 34 αμινοξέων με 41% ομολογία με την PTH(1–34) και 76% με το PTHrP(1–34) → ενεργοποιεί τον PTH1R, κυρίως σε διαμόρφωση με παροδική σηματοδότηση → διέγερση σχηματισμού νέου οστού με παροδική και περιορισμένη αύξηση της απορρόφησης."
    ],
    "indications": [
      "Οστεοπόρωση σε μετεμμηνοπαυσιακές γυναίκες με αυξημένο κίνδυνο κατάγματος."
    ],
    "contraindications": [
      "Υπερασβεστιαιμία, σοβαρή νεφρική ανεπάρκεια, ανεξήγητη αύξηση αλκαλικής φωσφατάσης, προηγούμενη ακτινοθεραπεία του σκελετού, κακοήθεια των οστών.",
      "Γυναίκες σε αναπαραγωγική ηλικία, κύηση, γαλουχία."
    ],
    "adverse_effects": [
      "Υπερασβεστιουρία (η πιο συχνή), ζάλη, αίσθημα παλμών, κεφαλαλγία, ναυτία, αντιδράσεις στο σημείο της ένεσης.",
      "Ορθοστατική υπόταση και παροδική ταχυκαρδία, συνήθως μέσα σε 4 ώρες από την ένεση."
    ],
    "pearls": [
      "Προσοχή σε καρδιαγγειακή νόσο: η ταχυκαρδία μπορεί να επιβαρύνει ασθενή με στεφανιαία νόσο ή αρρυθμίες.",
      "Πριν από την πρώτη χρήση η πένα φυλάσσεται στο ψυγείο. Μετά την πρώτη χρήση φυλάσσεται κάτω από 25 °C και χρησιμοποιείται μέσα σε 30 ημέρες.",
      "Μετά το τέλος της θεραπείας ακολουθεί αντιαπορροφητικό φάρμακο."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · PTH1R : υποδοχέας τύπου 1 της παραθορμόνης · cAMP : κυκλική μονοφωσφορική αδενοσίνη · ALP : αλκαλική φωσφατάση · VERO : μελέτη σύγκρισης τεριπαρατίδης και ρισεδρονάτης · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s6",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s6",
    "url": "pharmaka/osteoporosi.html#s6",
    "category": "6. Αναβολικά: ανάλογα της παραθορμόνης (PTH) και του PTHrP",
    "substance": "6. Αναβολικά: ανάλογα της παραθορμόνης (PTH) και του PTHrP",
    "inn": "",
    "note": "Κατηγορία: 6. Αναβολικά: ανάλογα της παραθορμόνης (PTH) και του PTHrP",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Το «παράδοξο» της PTH: συνεχής έκθεση (υπερπαραθυρεοειδισμός) → ↑ RANKL → απορρόφηση > σχηματισμός → καταβολισμός. Διαλείπουσα έκθεση (μία ένεση την ημέρα) → σχηματισμός > απορρόφηση → αναβολισμός.",
      "Ένεση → σύντομη αιχμή → σύνδεση με τον PTH1R (υποδοχέας συζευγμένος με πρωτεΐνη G) των οστεοβλαστών → αδενυλική κυκλάση και φωσφολιπάσες → ↑ cAMP και ↑ ενδοκυττάριο Ca²⁺ → ↑ διαφοροποίηση και δραστηριότητα οστεοβλαστών, ↓ απόπτωση οστεοβλαστών, ενεργοποίηση των επενδυτικών κυττάρων του οστού → νέο οστό σε σπογγώδεις και φλοιώδεις επιφάνειες.",
      "Ο σχηματισμός αυξάνει πρώτος και η απορρόφηση ακολουθεί αργότερα → «αναβολικό παράθυρο». Με τον χρόνο αυξάνει και η απορρόφηση → ένας λόγος για το χρονικό όριο της θεραπείας."
    ],
    "indications": [
      "Σοβαρή οστεοπόρωση και ασθενείς πολύ υψηλού κινδύνου: πρόσφατο σοβαρό κάταγμα, πολλαπλά σπονδυλικά κατάγματα, πολύ χαμηλή BMD, κάταγμα παρά την αντιαπορροφητική θεραπεία.",
      "Οστεοπόρωση από γλυκοκορτικοειδή (τεριπαρατίδη)."
    ],
    "contraindications": [
      "Προϋπάρχουσα υπερασβεστιαιμία, υπερπαραθυρεοειδισμός.",
      "Ανεξήγητη αύξηση της αλκαλικής φωσφατάσης, νόσος Paget, προηγούμενη ακτινοθεραπεία του σκελετού, πρωτοπαθείς όγκοι ή μεταστάσεις των οστών (↑ βασικός κίνδυνος οστεοσαρκώματος).",
      "Σοβαρή νεφρική ανεπάρκεια. Κύηση, γαλουχία, ανοικτές επιφύσεις."
    ],
    "adverse_effects": [
      "Ναυτία, κεφαλαλγία, ζάλη, κράμπες κάτω άκρων, πόνος στα άκρα.",
      "Παροδική ορθοστατική υπόταση τις πρώτες ώρες μετά την ένεση.",
      "Παροδική ήπια υπερασβεστιαιμία, υπερασβεστιουρία, αύξηση ουρικού οξέος.",
      "Οστεοσάρκωμα σε επίμυες με υψηλές δόσεις. Στον άνθρωπο δεν έχει αποδειχθεί αυξημένος κίνδυνος."
    ],
    "pearls": [
      "Μετά το τέλος της αναβολικής θεραπείας ακολουθεί ΥΠΟΧΡΕΩΤΙΚΑ αντιαπορροφητικό φάρμακο (διφωσφονικό ή δενοσουμάμπη): αλλιώς το νέο οστό χάνεται γρήγορα.",
      "Η σειρά «πρώτα αναβολικό, μετά αντιαπορροφητικό» δίνει μεγαλύτερο κέρδος BMD από την αντίστροφη."
    ],
    "abbreviations": "Συντομογραφίες PTH : παραθορμόνη · PTHrP : πεπτίδιο σχετιζόμενο με την παραθορμόνη · PTH1R : υποδοχέας τύπου 1 της παραθορμόνης · cAMP : κυκλική μονοφωσφορική αδενοσίνη · ALP : αλκαλική φωσφατάση · VERO : μελέτη σύγκρισης τεριπαρατίδης και ρισεδρονάτης · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης",
    "type": "category"
  },
  {
    "id": "pharma-ost-s7-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s7",
    "url": "pharmaka/osteoporosi.html#s7",
    "category": "7. Φάρμακα διπλής δράσης: αναστολέας της σκληροστίνης (ρομοσοζουμάμπη)",
    "substance": "Ρομοσοζουμάμπη",
    "inn": "Romosozumab",
    "note": "210 mg υποδορίως μία φορά τον μήνα (δύο ενέσεις των 105 mg τη μία μετά την άλλη) για 12 μήνες. Στην Ελλάδα: νοσοκομειακή χρήση.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/romosozumab",
    "brands": [
      "EVENITY",
      "Κυκλοφορεί μόνο 1 σκεύασμα",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "EVENITY",
        "tag": "νοσοκομειακή χρήση",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/evenity"
      },
      {
        "name": "Κυκλοφορεί μόνο 1 σκεύασμα",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/romosozumab"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/evenity"
      }
    ],
    "brands_str": "EVENITY, Κυκλοφορεί μόνο 1 σκεύασμα, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Εξανθρωποποιημένο μονοκλωνικό αντίσωμα IgG2 κατά της σκληροστίνης → άρση της αναστολής της οδού Wnt → ↑ σχηματισμός οστού + μεταβολή στους μεσολαβητές των οστεοκλαστών → ↓ απορρόφηση.",
      "Αποτέλεσμα: η μεγαλύτερη και ταχύτερη αύξηση της BMD από όλα τα διαθέσιμα φάρμακα μέσα σε 12 μήνες."
    ],
    "indications": [
      "Σοβαρή οστεοπόρωση σε μετεμμηνοπαυσιακές γυναίκες με υψηλό κίνδυνο κατάγματος. Η θεραπεία ξεκινά και παρακολουθείται από ειδικό."
    ],
    "contraindications": [
      "Ιστορικό εμφράγματος του μυοκαρδίου ή ΑΕΕ.",
      "Υπασβεστιαιμία. Γυναίκες σε αναπαραγωγική ηλικία, κύηση, γαλουχία."
    ],
    "adverse_effects": [
      "Καρδιαγγειακά συμβάματα (έμφραγμα, ΑΕΕ).",
      "Αρθραλγία, ρινοφαρυγγίτιδα, κεφαλαλγία, αντιδράσεις στο σημείο της ένεσης, αντιδράσεις υπερευαισθησίας.",
      "Υπασβεστιαιμία, σπάνια ONJ και άτυπα κατάγματα."
    ],
    "pearls": [
      "Πριν από την έναρξη: εκτίμηση καρδιαγγειακού κινδύνου. Αν εμφανιστεί έμφραγμα ή ΑΕΕ κατά τη θεραπεία, το φάρμακο διακόπτεται.",
      "Διόρθωση της υπασβεστιαιμίας πριν από την έναρξη, ασβέστιο και βιταμίνη D κατά τη θεραπεία. Παρακολούθηση ασβεστίου σε σοβαρή νεφρική νόσο.",
      "Μετά τους 12 μήνες: αντιαπορροφητικό φάρμακο (διφωσφονικό ή δενοσουμάμπη), αλλιώς το κέρδος χάνεται.",
      "Η πένα φυλάσσεται στο ψυγείο. Αν βγει, μπορεί να μείνει σε θερμοκρασία δωματίου έως 30 ημέρες, αλλά δεν ξαναμπαίνει στο ψυγείο."
    ],
    "abbreviations": "Συντομογραφίες Wnt : οδός σηματοδότησης Wnt · LRP5/6 : πρωτεΐνες 5 και 6 σχετιζόμενες με τον υποδοχέα LDL · GSK-3β : κινάση 3β της συνθάσης του γλυκογόνου · DKK-1 : Dickkopf-1 · ARCH : μελέτη σύγκρισης ρομοσοζουμάμπης και αλενδρονάτης · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s7",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s7",
    "url": "pharmaka/osteoporosi.html#s7",
    "category": "7. Φάρμακα διπλής δράσης: αναστολέας της σκληροστίνης (ρομοσοζουμάμπη)",
    "substance": "7. Φάρμακα διπλής δράσης: αναστολέας της σκληροστίνης (ρομοσοζουμάμπη)",
    "inn": "",
    "note": "Κατηγορία: 7. Φάρμακα διπλής δράσης: αναστολέας της σκληροστίνης (ρομοσοζουμάμπη)",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Οστεοκύτταρα → παράγουν σκληροστίνη → η σκληροστίνη δεσμεύει τους συνυποδοχείς LRP5/6 → αναστολή της οδού Wnt → η GSK-3β φωσφορυλιώνει τη β-κατενίνη → πρωτεασωμική αποδόμηση → ↓ σχηματισμός οστού.",
      "Ρομοσοζουμάμπη → δεσμεύει τη σκληροστίνη → η Wnt δρα ελεύθερα → η β-κατενίνη σταθεροποιείται και περνά στον πυρήνα → μεταγραφή γονιδίων-στόχων → ↑ σχηματισμός οστού (ενεργοποίηση επενδυτικών κυττάρων, ↑ παραγωγή θεμέλιας ουσίας από οστεοβλάστες).",
      "Ταυτόχρονα: ↑ OPG και ↓ RANKL → ↓ οστική απορρόφηση. Άρα διπλή δράση: αναβολική και αντιαπορροφητική."
    ],
    "indications": [
      "Σοβαρή οστεοπόρωση σε μετεμμηνοπαυσιακές γυναίκες με υψηλό κίνδυνο κατάγματος."
    ],
    "contraindications": [
      "Ιστορικό εμφράγματος του μυοκαρδίου ή αγγειακού εγκεφαλικού επεισοδίου.",
      "Υπασβεστιαιμία. Υπερευαισθησία."
    ],
    "adverse_effects": [
      "Αύξηση σοβαρών καρδιαγγειακών συμβαμάτων (έμφραγμα, ΑΕΕ) σε σύγκριση με την αλενδρονάτη (μελέτη ARCH).",
      "Αρθραλγία, ρινοφαρυγγίτιδα, κεφαλαλγία, αντιδράσεις στο σημείο της ένεσης, υπασβεστιαιμία.",
      "Σπάνια ONJ και άτυπα κατάγματα του μηριαίου."
    ],
    "pearls": [
      "Περιορισμένη διάρκεια: 12 μήνες (12 μηνιαίες δόσεις) και μετά υποχρεωτικά αντιαπορροφητικό φάρμακο.",
      "Το αναβολικό αποτέλεσμα μειώνεται μετά από περίπου 6–12 μήνες, γιατί αυξάνονται αντιρροπιστικά άλλοι αναστολείς της Wnt (π.χ. DKK-1)."
    ],
    "abbreviations": "Συντομογραφίες Wnt : οδός σηματοδότησης Wnt · LRP5/6 : πρωτεΐνες 5 και 6 σχετιζόμενες με τον υποδοχέα LDL · GSK-3β : κινάση 3β της συνθάσης του γλυκογόνου · DKK-1 : Dickkopf-1 · ARCH : μελέτη σύγκρισης ρομοσοζουμάμπης και αλενδρονάτης · ONJ/MRONJ : οστεονέκρωση της γνάθου (σχετιζόμενη με φάρμακα) · AFF : άτυπο κάταγμα του μηριαίου · BMD : οστική πυκνότητα · eGFR : εκτιμώμενος ρυθμός σπειραματικής διήθησης · CrCl : κάθαρση κρεατινίνης",
    "type": "category"
  },
  {
    "id": "pharma-ost-s8-1",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s8",
    "url": "pharmaka/osteoporosi.html#s8",
    "category": "8. Φάρμακα που αποσύρθηκαν την τελευταία 10ετία",
    "substance": "Καλσιτονίνη (σολομού)",
    "inn": "Calcitonin (salmon synthetic)",
    "note": "Η καλσιτονίνη του σολομού έχει μεγαλύτερη συγγένεια για τον ανθρώπινο υποδοχέα και μεγαλύτερο χρόνο ημίσειας ζωής από την ανθρώπινη. Ενέσιμη (υποδόρια, ενδομυϊκή, ενδοφλέβια) και ρινικό εκνέφωμα.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin",
    "brands": [
      "MIACALCIC",
      "MIADENIL",
      "CALCIPHAR",
      "LIXOCAM",
      "CALTEC",
      "IAMACALCIN",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "MIACALCIC",
        "tag": "ενέσιμο και ρινικό εκνέφωμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "MIADENIL",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "CALCIPHAR",
        "tag": "ρινικό εκνέφωμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "LIXOCAM",
        "tag": "ρινικό εκνέφωμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "CALTEC",
        "tag": "ρινικό εκνέφωμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "IAMACALCIN",
        "tag": "ρινικό εκνέφωμα",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/calcitonin/marketing"
      }
    ],
    "brands_str": "MIACALCIC, MIADENIL, CALCIPHAR, LIXOCAM, CALTEC, IAMACALCIN, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Σύνδεση με τον υποδοχέα της καλσιτονίνης στους οστεοκλάστες (συζευγμένος με πρωτεΐνη G) → συστολή και ↓ κινητικότητα των οστεοκλαστών → ταχεία ↓ οστικής απορρόφησης και ↓ ασβεστίου ορού.",
      "Συνεχής χορήγηση → απευαισθητοποίηση της σηματοδότησης του υποδοχέα → ταχυφυλαξία μέσα σε λίγες ημέρες."
    ],
    "indications": [
      "Ενέσιμη: πρόληψη της οξείας οστικής απώλειας από αιφνίδια ακινητοποίηση (π.χ. μετά από πρόσφατο οστεοπορωτικό κάταγμα), νόσος Paget, υπερασβεστιαιμία κακοήθειας.",
      "Αναλγητική δράση στο οξύ οστεοπορωτικό σπονδυλικό κάταγμα (η διαφάνεια του μαθήματος δείχνει μείωση του πόνου, εντονότερη με το ρινικό σκεύασμα)."
    ],
    "contraindications": [
      "Υπερευαισθησία (πεπτίδιο → κίνδυνος αλλεργικών αντιδράσεων έως αναφυλαξία). Υπασβεστιαιμία."
    ],
    "adverse_effects": [
      "Ναυτία, έμετος, εξάψεις προσώπου και χεριών, ζάλη, δυσάρεστη γεύση, μυρμηκίαση στα χέρια.",
      "Ρινικό εκνέφωμα: ξηρότητα και ερεθισμός του ρινικού βλεννογόνου.",
      "Μακροχρόνια χρήση: μικρή αύξηση του κινδύνου κακοήθειας."
    ],
    "pearls": [
      "Ο Ευρωπαϊκός Οργανισμός Φαρμάκων (2012) έκρινε ότι το ρινικό εκνέφωμα δεν πρέπει να χρησιμοποιείται για την οστεοπόρωση και περιόρισε την ενέσιμη μορφή σε βραχυχρόνια χρήση, λόγω του κινδύνου κακοήθειας και της χαμηλής αποτελεσματικότητας. Ο Γαληνός εξακολουθεί να εμφανίζει ρινικά σκευάσματα.",
      "Στην υπερασβεστιαιμία δρα μέσα σε ώρες, αλλά η ταχυφυλαξία την περιορίζει σε 1–2 ημέρες → γεφυρώνει μέχρι να δράσει το διφωσφονικό (2–3 ημέρες).",
      "Μειώνει τα επίπεδα λιθίου στο πλάσμα (↑ νεφρική κάθαρση) → έλεγχος λιθιαιμίας.",
      "Το ρινικό εκνέφωμα εναλλάσσεται ρουθούνι κάθε ημέρα. Η ενέσιμη μορφή μπορεί να δοθεί το βράδυ πριν από τον ύπνο, ώστε να μειωθούν η ναυτία και οι εξάψεις."
    ],
    "abbreviations": "Συντομογραφίες CaSR : υποδοχέας ανίχνευσης ασβεστίου · OPG : οστεοπροτεγερίνη · DRESS : φαρμακευτικό εξάνθημα με ηωσινοφιλία και συστηματικά συμπτώματα · ΕΜΑ : Ευρωπαϊκός Οργανισμός Φαρμάκων · IU : διεθνείς μονάδες · BMD : οστική πυκνότητα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-s8-2",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s8",
    "url": "pharmaka/osteoporosi.html#s8",
    "category": "8. Φάρμακα που αποσύρθηκαν την τελευταία 10ετία",
    "substance": "Ρανελικό στρόντιο",
    "inn": "Strontium ranelate",
    "note": "2 g ημερησίως από το στόμα (φακελίσκος). Η κυκλοφορία του PROTELOS σταμάτησε στην Ευρώπη το 2017. Ο Γαληνός διατηρεί την καταχώριση.",
    "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/strontium",
    "brands": [
      "PROTELOS",
      "Υπήρχε μόνο 1 σκεύασμα",
      "όλα τα σκευάσματα στον Γαληνό"
    ],
    "brands_details": [
      {
        "name": "PROTELOS",
        "tag": "αποσύρθηκε",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/protelos"
      },
      {
        "name": "Υπήρχε μόνο 1 σκεύασμα",
        "tag": "",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/substances/strontium"
      },
      {
        "name": "όλα τα σκευάσματα στον Γαληνό",
        "tag": "όλα τα σκευάσματα στον Γαληνό",
        "galinos_url": "https://www.galinos.gr/web/drugs/main/drugs/protelos"
      }
    ],
    "brands_str": "PROTELOS, Υπήρχε μόνο 1 σκεύασμα, όλα τα σκευάσματα στον Γαληνό",
    "mechanism": [
      "Ενεργοποίηση του CaSR στους οστεοβλάστες → διαφοροποίηση πρόδρομων οστεοβλαστών, ↑ σύνθεση κολλαγόνου → ↑ σχηματισμός οστού.",
      "↑ OPG και ↓ RANKL → ↓ διαφοροποίηση και ↑ απόπτωση οστεοκλαστών → ↓ απορρόφηση.",
      "Τα άτομα στροντίου ενσωματώνονται στους κρυστάλλους του υδροξυαπατίτη."
    ],
    "indications": [
      "Παλαιότερα: σοβαρή μετεμμηνοπαυσιακή οστεοπόρωση και ανδρική οστεοπόρωση, μόνο όταν άλλα φάρμακα δεν μπορούσαν να χρησιμοποιηθούν."
    ],
    "contraindications": [
      "Ισχαιμική καρδιοπάθεια, περιφερική αρτηριοπάθεια, εγκεφαλαγγειακή νόσος, μη ρυθμισμένη υπέρταση.",
      "Φλεβική θρομβοεμβολή ή ακινητοποίηση. Φαινυλκετονουρία (περιέχει ασπαρτάμη). Κύηση, γαλουχία."
    ],
    "adverse_effects": [
      "Έμφραγμα του μυοκαρδίου, φλεβική θρομβοεμβολή.",
      "Σοβαρές δερματικές αντιδράσεις (DRESS, σύνδρομο Stevens-Johnson).",
      "Ναυτία, διάρροια, κεφαλαλγία, έκζεμα, διαταραχές της συνείδησης."
    ],
    "pearls": [
      "Το γάλα, η τροφή, το ασβέστιο και τα αντιόξινα μειώνουν την απορρόφηση → λαμβανόταν το βράδυ, τουλάχιστον 2 ώρες μετά το φαγητό.",
      "Το στρόντιο έχει μεγαλύτερο ατομικό βάρος από το ασβέστιο → «ψευδώς» αυξημένη BMD στη μέτρηση (DXA), που δεν αντιστοιχεί πλήρως σε πραγματικό κέρδος.",
      "Ελαττώνουν την απορρόφησή του και οι τετρακυκλίνες και οι κινολόνες (σχηματισμός συμπλόκων)."
    ],
    "abbreviations": "Συντομογραφίες CaSR : υποδοχέας ανίχνευσης ασβεστίου · OPG : οστεοπροτεγερίνη · DRESS : φαρμακευτικό εξάνθημα με ηωσινοφιλία και συστηματικά συμπτώματα · ΕΜΑ : Ευρωπαϊκός Οργανισμός Φαρμάκων · IU : διεθνείς μονάδες · BMD : οστική πυκνότητα",
    "type": "substance"
  },
  {
    "id": "pharma-ost-cat-s8",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "s8",
    "url": "pharmaka/osteoporosi.html#s8",
    "category": "8. Φάρμακα που αποσύρθηκαν την τελευταία 10ετία",
    "substance": "8. Φάρμακα που αποσύρθηκαν την τελευταία 10ετία",
    "inn": "",
    "note": "Κατηγορία: 8. Φάρμακα που αποσύρθηκαν την τελευταία 10ετία",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "mechanism": [
      "Καλσιτονίνη: ορμόνη των παραθυλακιωδών C κυττάρων του θυρεοειδούς → υποδοχέας συζευγμένος με πρωτεΐνη G στους οστεοκλάστες → συστολή των οστεοκλαστών, ↓ κινητικότητα → ↓ οστική απορρόφηση. Στον νεφρό: ↓ επαναρρόφηση ασβεστίου και φωσφόρου.",
      "Ρανελικό στρόντιο: το στρόντιο μοιάζει με το ασβέστιο → ενεργοποίηση του CaSR → διαφοροποίηση πρόδρομων οστεοβλαστών σε οστεοβλάστες και ↑ OPG → ↑ σχηματισμός και ↓ απορρόφηση οστού (ασθενής διπλή δράση)."
    ],
    "indications": [
      "Δεν αποτελούν πλέον θεραπεία της οστεοπόρωσης. Η καλσιτονίνη διατηρεί βραχυχρόνιες ενδείξεις εκτός οστεοπόρωσης."
    ],
    "contraindications": [
      "Καλσιτονίνη: υπερευαισθησία, υπασβεστιαιμία.",
      "Ρανελικό στρόντιο: φλεβική θρομβοεμβολή, ισχαιμική καρδιοπάθεια, περιφερική αρτηριοπάθεια, εγκεφαλαγγειακή νόσος, μη ρυθμισμένη υπέρταση, φαινυλκετονουρία."
    ],
    "adverse_effects": [
      "Καλσιτονίνη: ναυτία, έμετος, εξάψεις, δυσάρεστη γεύση, μυρμηκίαση στα χέρια, ρινικός ερεθισμός (εκνέφωμα), τοπική φλεγμονή (ένεση). Μικρή αύξηση του κινδύνου κακοήθειας στη μακροχρόνια χρήση.",
      "Ρανελικό στρόντιο: έμφραγμα του μυοκαρδίου, φλεβική θρομβοεμβολή, σοβαρές δερματικές αντιδράσεις (DRESS), ναυτία, διάρροια."
    ],
    "pearls": [
      "Ερώτηση εξετάσεων: ποια αντιοστεοπορωτικά αποσύρθηκαν; Η καλσιτονίνη (κακοήθειες, χαμηλή αποτελεσματικότητα) και το ρανελικό στρόντιο (καρδιαγγειακός κίνδυνος)."
    ],
    "abbreviations": "Συντομογραφίες CaSR : υποδοχέας ανίχνευσης ασβεστίου · OPG : οστεοπροτεγερίνη · DRESS : φαρμακευτικό εξάνθημα με ηωσινοφιλία και συστηματικά συμπτώματα · ΕΜΑ : Ευρωπαϊκός Οργανισμός Φαρμάκων · IU : διεθνείς μονάδες · BMD : οστική πυκνότητα",
    "type": "category"
  },
  {
    "id": "pharma-ost-choice",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "choice",
    "url": "pharmaka/osteoporosi.html#choice",
    "category": "Θεραπευτική στρατηγική στην οστεοπόρωση",
    "substance": "Φάρμακα Οστεοπόρωσης — Θεραπευτική στρατηγική στην οστεοπόρωση",
    "inn": "",
    "note": "Κλινικές οδηγίες, διαχείριση και θεραπευτική στρατηγική.",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "content_parts": [
      "Επιδημιολογία και κλινική εικόνα",
      "Χρόνια πάθηση που απαιτεί μακροχρόνια θεραπεία. Περίπου 200 εκατομμύρια γυναίκες πάσχουν παγκοσμίως. Ένα κάταγμα κάθε 30 δευτερόλεπτα. 1 στους 8 πολίτες της Ευρωπαϊκής Ένωσης άνω των 50 ετών θα υποστεί σπονδυλικό κάταγμα. Το 20% των ασθενών με κάταγμα ισχίου πεθαίνει τον πρώτο χρόνο από επιπλοκές. Περίπου 1 στις 2 γυναίκες και 1 στους 5 άνδρες θα πάθουν κάταγμα ευθραυστότητας. Κλινικά: απουσία προειδοποιητικών συμπτωμάτων και πόνου, απώλεια ύψους, κύφωση, περιοριστική πνευμονική νόσος. Συνηθέστερα σημεία καταγμάτων: σπόνδυλοι, ισχίο, κάταγμα Colles (περιφερικό άκρο κερκίδας). Ο κίνδυνος κατάγματος 10ετίας υπολογίζεται με το εργαλείο FRAX του Παγκόσμιου Οργανισμού Υγείας.",
      "Παθογένεια και φαρμακευτικοί στόχοι",
      "Η ισορροπία οστεοβλαστών (σχηματισμός) και οστεοκλαστών (απορρόφηση) διαταράσσεται υπέρ της απορρόφησης. Τα φάρμακα χωρίζονται σε δύο ομάδες. Αναστολή της οστικής απορρόφησης: ΘΟΥ (θεραπεία ορμονικής υποκατάστασης), SERMs, διφωσφονικά, δενοσουμάμπη. Διέγερση της οστικής σύνθεσης: παραθορμόνη (τεριπαρατίδη), αμπαλοπαρατίδη, ρομοσοζουμάμπη (η τελευταία με διπλή δράση). Τα γλυκοκορτικοειδή αναστέλλουν τη διαφοροποίηση των οστεοβλαστών, ενώ η καλσιτριόλη και η PTH διεγείρουν τη στρατολόγηση των οστεοκλαστών.",
      "Θεραπεία: Βήμα 1ο",
      "Αναπλήρωση ασβεστίου και βιταμίνης D. Επαρκής πρόσληψη πρωτεΐνης, όχι όμως κατάχρηση. Διακοπή του καπνίσματος. Αποφυγή κατάχρησης αλκοόλ και καφέ. Άσκηση. Η ανεπάρκεια βιταμίνης D πρέπει να έχει διορθωθεί πριν από ζολεδρονικό οξύ ή δενοσουμάμπη, ώστε να μην προκληθεί υπασβεστιαιμία.",
      "Θεραπεία: Βήμα 2ο, ανάλογα με τον κίνδυνο",
      "Υψηλός κίνδυνος (οι περισσότεροι ασθενείς): πρώτη γραμμή τα από του στόματος διφωσφονικά (αλενδρονάτη, ρισεδρονάτη), λόγω αποτελεσματικότητας, χαμηλού κόστους και μακράς εμπειρίας. Αν δεν είναι ανεκτά ή αντενδείκνυνται: ζολεδρονικό οξύ ή δενοσουμάμπη. Πολύ υψηλός κίνδυνος (πρόσφατο σοβαρό κάταγμα, πολλαπλά σπονδυλικά κατάγματα, πολύ χαμηλή BMD): σύμφωνα με τις οδηγίες NOGG 2024 (National Osteoporosis Guideline Group) έναρξη με αναβολικό φάρμακο (τεριπαρατίδη, αμπαλοπαρατίδη ή ρομοσοζουμάμπη). Η μελέτη VERO έδειξε ανωτερότητα της τεριπαρατίδης έναντι της ρισεδρονάτης. Νεότερες μετεμμηνοπαυσιακές γυναίκες με κυρίως σπονδυλικό κίνδυνο ή αυξημένο κίνδυνο καρκίνου του μαστού: SERM (ραλοξιφαίνη).",
      "Διαδοχική θεραπεία",
      "Μετά από τεριπαρατίδη (24 μήνες), αμπαλοπαρατίδη (18 μήνες) ή ρομοσοζουμάμπη (12 μήνες) ακολουθεί υποχρεωτικά αντιαπορροφητικό φάρμακο, ώστε να «κλειδωθεί» το κέρδος. Η σειρά «αναβολικό → αντιαπορροφητικό» δίνει μεγαλύτερο κέρδος από την αντίστροφη. Η δενοσουμάμπη δεν διακόπτεται ποτέ χωρίς μετάβαση σε διφωσφονικό (συνήθως ζολεδρονικό οξύ περίπου 6 μήνες μετά την τελευταία ένεση).",
      "Οστεοπόρωση από γλυκοκορτικοειδή",
      "Η πιο συχνή αιτία δευτεροπαθούς οστεοπόρωσης. Τα γλυκοκορτικοειδή αναστέλλουν κυρίως τη διαφοροποίηση και τη λειτουργία των οστεοβλαστών και αυξάνουν την απόπτωσή τους. Τεριπαρατίδη: ανώτερη της αλενδρονάτης στην αύξηση της BMD και στη μείωση των σπονδυλικών καταγμάτων. Δενοσουμάμπη: ανώτερη των διφωσφονικών στην αύξηση της BMD. Αλενδρονάτη, ρισεδρονάτη και ζολεδρονικό οξύ έχουν όλα ένδειξη για πρόληψη και θεραπεία. Σε πολύ υψηλό κίνδυνο προτιμάται συχνά η τεριπαρατίδη ως πρώτη γραμμή, ώστε να αποκατασταθεί γρήγορα το οστό που χάθηκε.",
      "Διάρκεια θεραπείας και «φαρμακευτική διακοπή»",
      "Τα διφωσφονικά παραμένουν στον σκελετό για χρόνια. Μετά από 5 χρόνια από του στόματος ή 3 χρόνια ενδοφλέβιας θεραπείας γίνεται επανεκτίμηση. Σε ασθενείς χαμηλότερου κινδύνου μπορεί να γίνει διακοπή για 1–3 χρόνια. Σε όσους παραμένουν σε υψηλό κίνδυνο η θεραπεία συνεχίζεται (στη μελέτη FLEX, όσοι σταμάτησαν την αλενδρονάτη μετά από 5 χρόνια είχαν περισσότερα κλινικά σπονδυλικά κατάγματα). Η δενοσουμάμπη, η ΘΟΥ και τα SERMs δεν έχουν παρατεταμένη δράση: η διακοπή τους χρειάζεται άλλο φάρμακο.",
      "Συγκεντρωτικός πίνακας επανάληψης",
      "Διφωσφονικά: αναστολή οστεοκλαστών, από το στόμα εβδομαδιαία ή ενδοφλέβια ετήσια. Κρίσιμο: ONJ και AFF, αυστηροί κανόνες λήψης από το στόμα. Δενοσουμάμπη: αναστολή του RANKL, υποδόρια κάθε 6 μήνες. Κρίσιμο: πολλαπλά κατάγματα με τη διακοπή, ONJ/AFF, υπασβεστιαιμία. Ραλοξιφαίνη: αγωνιστής στο οστό, ανταγωνιστής σε μαστό και μήτρα, ημερησίως από το στόμα. Κρίσιμο: φλεβική θρομβοεμβολή. Τεριπαρατίδη: αναβολική, υποδόρια ημερησίως. Κρίσιμο: μέγιστη διάρκεια 24 μήνες και μετά αντιαπορροφητικό. Ρομοσοζουμάμπη: διπλή δράση (αναστολή σκληροστίνης), υποδόρια μηνιαίως. Κρίσιμο: μέγιστη διάρκεια 12 μήνες, καρδιαγγειακός κίνδυνος, μετά αντιαπορροφητικό."
    ],
    "type": "guide_summary"
  },
  {
    "id": "pharma-ost-practice",
    "source": "pharma",
    "guide": "Φάρμακα Οστεοπόρωσης",
    "file": "pharmaka/osteoporosi.html",
    "anchor": "practice",
    "url": "pharmaka/osteoporosi.html#practice",
    "category": "Τι πρέπει να ξέρει ο γιατρός: πρακτικές οδηγίες και προσοχή",
    "substance": "Φάρμακα Οστεοπόρωσης — Τι πρέπει να ξέρει ο γιατρός: πρακτικές οδηγίες και προσοχή",
    "inn": "",
    "note": "Κλινικές οδηγίες, διαχείριση και θεραπευτική στρατηγική.",
    "galinos_url": null,
    "brands": [],
    "brands_details": [],
    "brands_str": "",
    "content_parts": [
      "Πριν από την έναρξη κάθε θεραπείας",
      "Μέτρηση ασβεστίου, κρεατινίνης (eGFR), 25-υδροξυβιταμίνης D και αλκαλικής φωσφατάσης. Διόρθωση υπασβεστιαιμίας και ανεπάρκειας βιταμίνης D. Οδοντιατρικός έλεγχος και ολοκλήρωση των απαραίτητων οδοντιατρικών εργασιών πριν από διφωσφονικά, δενοσουμάμπη και ρομοσοζουμάμπη. Αναζήτηση δευτεροπαθών αιτίων (γλυκοκορτικοειδή, υπερπαραθυρεοειδισμός, υπογοναδισμός, δυσαπορρόφηση, πολλαπλό μυέλωμα).",
      "Σωστή λήψη των διφωσφονικών από το στόμα",
      "Το πρωί μόλις ξυπνήσει, με άδειο στομάχι, μόνο με ένα γεμάτο ποτήρι νερό βρύσης (όχι γάλα, καφέ, χυμό ή μεταλλικό νερό). Ο ασθενής μένει όρθιος ή καθιστός και δεν τρώει, δεν πίνει και δεν παίρνει άλλο φάρμακο για 30 λεπτά (αλενδρονάτη, ρισεδρονάτη) ή 60 λεπτά (ιβανδρονάτη). Το δισκίο καταπίνεται ολόκληρο. Το ασβέστιο, ο σίδηρος και τα αντιόξινα λαμβάνονται αργότερα μέσα στην ημέρα. Νέα δυσφαγία, πόνος στην κατάποση ή καύσος οδηγούν σε διακοπή.",
      "Παραλειφθείσες δόσεις",
      "Αλενδρονάτη 70 mg: το επόμενο πρωί που το θυμηθεί ο ασθενής, και μετά επιστροφή στην ίδια ημέρα της εβδομάδας. Ποτέ δύο δισκία την ίδια ημέρα. Δενοσουμάμπη: η ένεση γίνεται το συντομότερο δυνατό και μετά κάθε 6 μήνες από τη νέα ημερομηνία. Η καθυστέρηση είναι επικίνδυνη (rebound απορρόφηση).",
      "Νεφρική λειτουργία",
      "Διφωσφονικά: δεν συνιστώνται με CrCl < 30–35 ml/min. Για το ζολεδρονικό οξύ απαιτούνται ενυδάτωση, έγχυση σε τουλάχιστον 15 λεπτά και κρεατινίνη πριν από κάθε έγχυση. Δενοσουμάμπη: δεν χρειάζεται προσαρμογή δόσης, αλλά σε CrCl < 30 ml/min ή αιμοκάθαρση ο κίνδυνος υπασβεστιαιμίας είναι μεγάλος → μέτρηση ασβεστίου πριν και 1–2 εβδομάδες μετά την ένεση. Τεριπαρατίδη και αμπαλοπαρατίδη: αντένδειξη στη σοβαρή νεφρική ανεπάρκεια.",
      "Σημεία συναγερμού κατά τη θεραπεία",
      "Πόνος στον μηρό ή στη βουβωνική χώρα → απεικόνιση και των δύο μηριαίων (άτυπο κάταγμα). Πόνος, οίδημα, κινητό δόντι ή εκτεθειμένο οστό στη γνάθο → οστεονέκρωση της γνάθου. Ωτικά συμπτώματα ή χρόνια ωτίτιδα υπό δενοσουμάμπη ή διφωσφονικό → οστεονέκρωση του έξω ακουστικού πόρου. Πόνος ή ερυθρότητα του οφθαλμού μετά από ζολεδρονικό → ραγοειδίτιδα. Πόνος στο θώρακα ή νευρολογικά συμπτώματα υπό ρομοσοζουμάμπη → διακοπή. Οίδημα ή πόνος στη γαστροκνημία ή δύσπνοια υπό SERM ή ΘΟΥ → φλεβική θρομβοεμβολή.",
      "Ενέσιμα και ενδοφλέβια",
      "Ζολεδρονικό οξύ: η γριππώδης αντίδραση τις πρώτες 3 ημέρες μετά την πρώτη έγχυση είναι συχνή και υποχωρεί με παρακεταμόλη. Τεριπαρατίδη: οι πρώτες ενέσεις με τον ασθενή καθιστό ή ξαπλωμένο (ορθοστατική υπόταση), το ασβέστιο ορού μετριέται τουλάχιστον 16 ώρες μετά την ένεση, και η πένα φυλάσσεται στο ψυγείο. Δενοσουμάμπη: κάρτα υπενθύμισης ασθενούς, η ημερομηνία της επόμενης δόσης γράφεται πάντα. Ρομοσοζουμάμπη: δύο ενέσεις των 105 mg διαδοχικά, κάθε μήνα, για 12 μήνες.",
      "Αλληλεπιδράσεις που πρέπει να θυμόμαστε",
      "Ασβέστιο, σίδηρος, μαγνήσιο και αντιόξινα → δεσμεύουν τα διφωσφονικά και το στρόντιο. Αλενδρονάτη μαζί με τεριπαρατίδη → μικρότερο αναβολικό αποτέλεσμα. Μη στεροειδή αντιφλεγμονώδη και ασπιρίνη → περισσότερος ερεθισμός του ανώτερου πεπτικού με τα διφωσφονικά από το στόμα. Τεριπαρατίδη και διγοξίνη → κίνδυνος τοξικότητας από δακτυλίτιδα λόγω υπερασβεστιαιμίας. Καλσιτονίνη και λίθιο → μείωση της λιθιαιμίας. Δενοσουμάμπη και XGEVA (ή άλλο σκεύασμα με δενοσουμάμπη) → ποτέ μαζί. ACLASTA και ZOMETA → ίδια ουσία, ποτέ μαζί.",
      "Χειρουργείο, ακινητοποίηση, κάταγμα",
      "SERM και ΘΟΥ: διακοπή πριν από παρατεταμένη ακινητοποίηση (θρομβοεμβολικός κίνδυνος). Μετά από κάταγμα ισχίου: το ζολεδρονικό οξύ δίνεται τουλάχιστον 2 εβδομάδες μετά τη χειρουργική αποκατάσταση. Τα αντιοστεοπορωτικά δεν καθυστερούν σημαντικά την πώρωση των καταγμάτων και δεν διακόπτονται χωρίς λόγο μετά από κάταγμα."
    ],
    "type": "guide_summary"
  }
];

// Προσθήκη στη συνολική βάση, αν έχει ήδη φορτωθεί το pharma_database.js
if (typeof pharmaDatabase !== 'undefined' && Array.isArray(pharmaDatabase)) {
  pharmaOsteoporosi.forEach(function (e) {
    if (!pharmaDatabase.some(function (x) { return x.id === e.id; })) pharmaDatabase.push(e);
  });
}
