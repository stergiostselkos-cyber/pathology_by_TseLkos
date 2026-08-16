// cases.js — έκδοση 2026-08-14 (v3)
// Handles logic for displaying clinical cases in a multi-stage interactive way.

var CASES_JS_VERSION = 'v12 · 14-08-2026';
console.log('%c cases.js ' + CASES_JS_VERSION + ' φορτώθηκε ', 'background:#10b981;color:#fff;font-weight:700');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Initialization
    const initTheme = () => {
        const savedTheme = localStorage.getItem('pathologia_theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.replace('light-theme', 'dark-theme');
        }
    };
    initTheme();

    // Το cases-extra.css μπορεί να μην έχει συνδεθεί στο cases.html.
    // Το ελέγχουμε και το φορτώνουμε μόνοι μας αν λείπει, ώστε να μη χρειάζεται
    // καμία επέμβαση στο HTML.
    (function ensureStylesheet() {
        var probe = document.createElement('span');
        probe.className = 'cases-version-tag';
        probe.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(probe);
        var loaded = /16,\s*185,\s*129/.test(getComputedStyle(probe).backgroundColor);
        document.body.removeChild(probe);
        if (!loaded) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'cases-extra.css';
            document.head.appendChild(link);
            console.warn('cases-extra.css δεν ήταν συνδεδεμένο στο cases.html — φορτώθηκε αυτόματα.');
        }
    })();

    // Ορατή σφραγίδα έκδοσης: αν ΔΕΝ τη βλέπεις δίπλα στον τίτλο,
    // ο browser τρέχει παλιό αρχείο cases.js.
    (function stampVersion() {
        const logo = document.querySelector('.app-logo h1');
        if (!logo || document.getElementById('cases-js-version')) return;
        const tag = document.createElement('span');
        tag.id = 'cases-js-version';
        tag.className = 'cases-version-tag';
        tag.textContent = CASES_JS_VERSION;
        logo.appendChild(tag);
    })();

    // Elements
    const bookSelect = document.getElementById('book-select');
    const caseSelectWrapper = document.getElementById('case-select-wrapper');
    const caseSelect = document.getElementById('case-select');
    const welcomeScreen = document.getElementById('cases-welcome-screen');
    const activeCaseContainer = document.getElementById('active-case-container');
    const caseTitle = document.getElementById('case-title');
    const caseBookBadge = document.getElementById('case-book-badge');
    const caseHistory = document.getElementById('case-history');
    const caseExam = document.getElementById('case-exam');
    const stagesContainer = document.getElementById('stages-container');
    const keypointsContainer = document.getElementById('case-keypoints-container');
    const keypointsList = document.getElementById('case-keypoints-list');
    
    const markCompletedBtn = document.getElementById('mark-completed-btn');
    const markCompletedText = document.getElementById('mark-completed-text');

    let currentCases = [];
    let currentActiveCase = null;
    let currentActiveBtn = null;

    // Αποθήκευση με εφεδρεία στη μνήμη, αν ο browser κλειδώνει το localStorage
    let memStore = null;
    const getCompleted = () => {
        try { return JSON.parse(localStorage.getItem('completed_cases') || '[]').map(String); }
        catch (e) { return (memStore || []).map(String); }
    };
    const setCompleted = (arr) => {
        memStore = arr;
        try { localStorage.setItem('completed_cases', JSON.stringify(arr)); } catch (e) {}
    };

    // Το τρέχον περιστατικό, ακόμη κι αν κάτι μηδένισε τη μεταβλητή
    const activeCase = () => {
        if (currentActiveCase) return currentActiveCase;
        const opt = caseSelect && caseSelect.options[caseSelect.selectedIndex];
        const idx = opt ? parseInt(opt.dataset.idx, 10) : NaN;
        return !isNaN(idx) ? currentCases[idx] : null;
    };

    // Το κείμενο μιας επιλογής, με ή χωρίς σήμανση.
    const optionLabel = (caseData, index, isDone) =>
        (isDone ? '✓  ' : '') + 'Περιστατικό ' + (index + 1) + ' - ' + caseData.title;

    // Ανανεώνει ΟΛΕΣ τις επιλογές της ροδέλας.
    // Ο Chrome σε Windows δεν εφαρμόζει πάντα το χρώμα στα <option>,
    // γι' αυτό η σήμανση μπαίνει και μέσα στο ίδιο το κείμενο (✓).
    const refreshCaseOptions = () => {
        if (!caseSelect) return;
        const completed = getCompleted();
        let done = 0;
        Array.from(caseSelect.options).forEach(opt => {
            const idx = parseInt(opt.dataset.idx, 10);
            if (isNaN(idx) || !currentCases[idx]) return;
            const isDone = completed.indexOf(String(currentCases[idx].id)) !== -1;
            if (isDone) done++;
            opt.text = optionLabel(currentCases[idx], idx, isDone);
            opt.style.color = isDone ? '#10b981' : '';
            opt.style.backgroundColor = isDone ? 'rgba(16,185,129,0.12)' : '';
            opt.style.fontWeight = isDone ? '700' : '400';
        });
        const sel = caseSelect.options[caseSelect.selectedIndex];
        const selIdx = sel ? parseInt(sel.dataset.idx, 10) : NaN;
        const curDone = !isNaN(selIdx) && currentCases[selIdx] &&
                        completed.indexOf(String(currentCases[selIdx].id)) !== -1;
        caseSelect.classList.toggle('is-completed', curDone);
        if (caseSelectWrapper) caseSelectWrapper.classList.toggle('is-completed', curDone);
        // Σημαίνουμε και τον περιέκτη του περιστατικού, ώστε το πράσινο να φαίνεται
        // στο κουμπί και στην κάρτα ασθενούς ανεξάρτητα από το πώς σχεδιάζει
        // ο browser το <select>.
        if (activeCaseContainer) activeCaseContainer.classList.toggle('case-is-done', curDone);
        if (markCompletedBtn) markCompletedBtn.classList.toggle('is-completed', curDone);
        const counter = document.getElementById('cases-progress');
        if (counter) {
            counter.textContent = done + '/' + currentCases.length;
            counter.classList.toggle('all-done', done > 0 && done === currentCases.length);
        }
    };

    // Μικρός μετρητής + ✓ δίπλα στη ροδέλα
    const buildBadges = () => {
        if (!caseSelectWrapper || document.getElementById('cases-progress')) return;
        const tick = document.createElement('span');
        tick.className = 'case-done-tick';
        tick.textContent = '✓';
        tick.title = 'Διαβασμένο';
        caseSelectWrapper.appendChild(tick);
        const badge = document.createElement('span');
        badge.id = 'cases-progress';
        badge.className = 'cases-progress-badge';
        caseSelectWrapper.appendChild(badge);
    };

    // Toggle completion status
    // ── ΣΗΜΑΝΣΗ ΟΛΟΚΛΗΡΩΜΕΝΟΥ ──────────────────────────────────────────────
    // Ο χειριστής δένεται στο document σε φάση σύλληψης (capture), δηλαδή
    // ΠΡΙΝ από όποιον άλλον είναι δεμένος στο ίδιο το κουμπί, και σταματά τη
    // διάδοση. Έτσι, αν έχει μείνει φορτωμένο και παλιό αντίγραφο του cases.js,
    // ο δικός του χειριστής δεν εκτελείται καθόλου και δεν ακυρώνει το κλικ.
    document.addEventListener('click', function (ev) {
        const btn = ev.target && ev.target.closest && ev.target.closest('#mark-completed-btn');
        if (!btn) return;
        ev.stopPropagation();
        ev.preventDefault();
        try {
            const cur = activeCase();
            if (!cur) { markCompletedText.textContent = 'Επίλεξε πρώτα περιστατικό'; return; }
            const cid = String(cur.id);
            let completed = getCompleted();
            const done = completed.indexOf(cid) === -1;
            setCompleted(done ? completed.concat([cid]) : completed.filter(id => id !== cid));
            btn.classList.toggle('is-completed', done);
            markCompletedText.textContent = done ? 'Ολοκληρώθηκε ✓' : 'Σήμανση ως Ολοκληρωμένο';
            refreshCaseOptions();
        } catch (err) {
            markCompletedText.textContent = 'Σφάλμα: ' + err.message;
            console.error('mark-completed:', err);
        }
    }, true);

    // 2. Load Books Dropdown
    const loadBooks = () => {
        if (typeof clinicalCases === 'undefined' || !clinicalCases.length) {
            welcomeScreen.innerHTML =
                '<h2>Δεν βρέθηκαν περιστατικά</h2>' +
                '<p>Το <code>data/cases_klinika_100.js</code> δεν φορτώθηκε. Έλεγξε ότι το αρχείο ' +
                'υπάρχει στον φάκελο <code>data</code> και ότι το <code>&lt;script&gt;</code> tag ' +
                'στο cases.html δείχνει σε αυτό.</p>';
            return;
        }

        // Get unique books
        const books = [...new Set(clinicalCases.map(c => c.book))];
        
        bookSelect.innerHTML = '';
        books.forEach(book => {
            const opt = document.createElement('option');
            opt.value = book;
            opt.textContent = book;
            bookSelect.appendChild(opt);
        });

        // Event listener for book change
        bookSelect.addEventListener('change', (e) => {
            try { localStorage.setItem('cases_last_book', e.target.value); } catch (err) {}
            loadCasesForBook(e.target.value);
        });

        // Ποιο βιβλίο ανοίγει πρώτο:
        //  1) αυτό που διάλεξες τελευταία φορά,
        //  2) αλλιώς τα «Κλινικά Σενάρια Παθολογίας», αν υπάρχουν,
        //  3) αλλιώς το πρώτο της λίστας.
        if (books.length > 0) {
            let start = null;
            try { start = localStorage.getItem('cases_last_book'); } catch (e) {}
            if (!start || books.indexOf(start) === -1) {
                start = books.filter(b => /Κλινικά Σενάρια Παθολογίας/.test(b))[0] || books[0];
            }
            bookSelect.value = start;
            loadCasesForBook(start);
        }
    };

    // 3. Load Cases for selected book
    const loadCasesForBook = (bookName) => {
        currentCases = clinicalCases.filter(c => c.book === bookName);
        caseSelect.innerHTML = '<option value="" disabled selected>Επιλέξτε περιστατικό...</option>';
        
        if (currentCases.length > 0) {
            caseSelectWrapper.style.display = 'block';
        } else {
            caseSelectWrapper.style.display = 'none';
        }
        
        const completedNow = getCompleted();
        currentCases.forEach((caseData, index) => {
            const opt = document.createElement('option');
            opt.value = String(caseData.id);
            opt.dataset.idx = index;
            // το κείμενο μπαίνει αμέσως, ώστε η ροδέλα να μη μείνει ποτέ κενή
            opt.textContent = optionLabel(caseData, index,
                completedNow.indexOf(String(caseData.id)) !== -1);
            caseSelect.appendChild(opt);
        });

        buildBadges();
        refreshCaseOptions();

        // Reset view
        welcomeScreen.style.display = 'block';
        activeCaseContainer.style.display = 'none';
    };

    // 4. Render a specific case
    const renderCase = (caseData) => {
        currentActiveCase = caseData;

        // Check completion status for button
        if (markCompletedBtn) {
            const completedCases = getCompleted().map(String);
            if (completedCases.indexOf(String(caseData.id)) !== -1) {
                markCompletedBtn.classList.add('is-completed');
                markCompletedText.textContent = 'Ολοκληρώθηκε ✓';
            } else {
                markCompletedBtn.classList.remove('is-completed');
                markCompletedText.textContent = 'Σήμανση ως Ολοκληρωμένο';
            }
        }

        refreshCaseOptions();

        // Show container
        welcomeScreen.style.display = 'none';
        activeCaseContainer.style.display = 'flex';
        activeCaseContainer.classList.add('fade-in-up');

        // Set Headers & Basic Info
        caseTitle.textContent = caseData.title;
        caseBookBadge.textContent = caseData.book;
        
        // Auto-render images if provided for history/exam
        let historyHtml = caseData.history;
        if (caseData.historyImage) {
            historyHtml += `<br><img src="assets/images/${caseData.historyImage}" class="case-image">`;
        }
        caseHistory.innerHTML = historyHtml;

        // Render Vitals (if provided) and Examination
        let examHtml = '';
        if (caseData.vitals) {
            examHtml += `<div class="vitals-grid">`;
            if (caseData.vitals.temp) examHtml += `<div class="vital-card"><span class="v-icon">🌡️</span><span class="v-label">Θερμοκρασία</span><span class="v-value">${caseData.vitals.temp}</span></div>`;
            if (caseData.vitals.bp) examHtml += `<div class="vital-card"><span class="v-icon">🩸</span><span class="v-label">Αρτ. Πίεση</span><span class="v-value">${caseData.vitals.bp}</span></div>`;
            if (caseData.vitals.hr) examHtml += `<div class="vital-card"><span class="v-icon">💓</span><span class="v-label">Σφύξεις</span><span class="v-value">${caseData.vitals.hr}</span></div>`;
            if (caseData.vitals.rr) examHtml += `<div class="vital-card"><span class="v-icon">🫁</span><span class="v-label">Αναπνοές</span><span class="v-value">${caseData.vitals.rr}</span></div>`;
            if (caseData.vitals.sat) examHtml += `<div class="vital-card"><span class="v-icon">💧</span><span class="v-label">SpO2</span><span class="v-value">${caseData.vitals.sat}</span></div>`;
            examHtml += `</div>`;
        }

        examHtml += `<div class="exam-text">${caseData.examination}</div>`;
        
        if (caseData.examinationImage) {
            examHtml += `<br><img src="assets/images/${caseData.examinationImage}" class="case-image">`;
        }
        caseExam.innerHTML = examHtml;

        // Clear previous stages and keypoints
        stagesContainer.innerHTML = '';
        keypointsList.innerHTML = '';
        keypointsContainer.style.display = 'none';

        // Render Stages
        if (caseData.stages && caseData.stages.length > 0) {
            renderStage(caseData, 0); // Start with stage 0
        } else {
            // No stages? Just show keypoints
            showKeyPoints(caseData);
        }
    };

    // 5. Render a specific stage recursively
    const renderStage = (caseData, stageIndex) => {
        const stage = caseData.stages[stageIndex];
        if (!stage) {
            // All stages done, show keypoints
            showKeyPoints(caseData);
            return;
        }

        const stageDiv = document.createElement('div');
        stageDiv.className = 'case-stage fade-in-up';
        
        // Build Stage HTML
        let html = `
            <div class="stage-marker">${stageIndex + 1}</div>
            <div class="stage-card">
                <h4>Στάδιο ${stageIndex + 1}</h4>
        `;

        if (stage.investigations) {
            let invHtml = stage.investigations;
            if (stage.investigationsImage) {
                invHtml += `<br><img src="assets/images/${stage.investigationsImage}" class="case-image">`;
            }
            html += `
                <div class="investigations">
                    <strong style="color: var(--primary-color);">🔬 Εργαστηριακός/Απεικονιστικός Έλεγχος:</strong><br>
                    ${invHtml}
                </div>
            `;
        }

        if (stage.questions && stage.questions.length > 0) {
            html += `
                <div class="questions-box">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                        <span style="font-size:1.2rem;">❓</span>
                        <h4 style="margin:0; color:var(--text-primary);">Ερωτήσεις</h4>
                    </div>
                    <ul>
                        ${stage.questions.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        let ansHtml = stage.answer;
        if (stage.answerImage) {
            ansHtml += `<br><img src="assets/images/${stage.answerImage}" class="case-image">`;
        }

        html += `
                <!-- Reveal Button -->
                <button class="btn btn-primary reveal-stage-btn">
                    Απάντηση & Συνέχεια
                </button>

                <!-- Hidden Answer Box -->
                <div class="answer-box" style="display: none;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                        <span style="font-size:1.2rem;">✅</span>
                        <h4 style="margin:0; color:var(--text-primary);">Απάντηση</h4>
                    </div>
                    <div>${ansHtml}</div>
                    ${stage.differential ? `<div class="diff-dx"><strong>Διαφορική Διάγνωση:</strong><br> ${stage.differential}</div>` : ''}
                </div>
            </div>
        `;

        stageDiv.innerHTML = html;
        stagesContainer.appendChild(stageDiv);

        // Bind button
        const btn = stageDiv.querySelector('.reveal-stage-btn');
        const answerBox = stageDiv.querySelector('.answer-box');
        
        btn.addEventListener('click', () => {
            btn.style.display = 'none';
            answerBox.style.display = 'block';
            answerBox.classList.add('fade-in-up');
            
            // Scroll a bit down
            setTimeout(() => {
                answerBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

            // Call next stage after short delay so user can read
            setTimeout(() => {
                renderStage(caseData, stageIndex + 1);
            }, 600); // 600ms delay before appending the next stage
        });
    };

    // 6. Show Key Points
    const showKeyPoints = (caseData) => {
        if (caseData.keyPoints && caseData.keyPoints.length > 0) {
            keypointsContainer.style.display = 'block';
            keypointsContainer.classList.add('fade-in-up');
            caseData.keyPoints.forEach(kp => {
                const li = document.createElement('li');
                li.innerHTML = kp;
                keypointsList.appendChild(li);
            });
            
            setTimeout(() => {
                keypointsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 200);
        }
    };

    // Ο listener δένεται μία φορά — αλλιώς συσσωρευόταν σε κάθε αλλαγή βιβλίου
    if (caseSelect) {
        caseSelect.addEventListener('change', (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            const idx = opt ? parseInt(opt.dataset.idx, 10) : NaN;
            const selectedCase = !isNaN(idx) ? currentCases[idx]
                               : currentCases.filter(c => String(c.id) === e.target.value)[0];
            if (selectedCase) renderCase(selectedCase);
        });
    }

    // Initialize
    loadBooks();
});

/* ==========================================================================
   ΠΡΟΒΟΛΕΑΣ ΕΙΚΟΝΩΝ
   Κλικ σε ακτινογραφία ή ΗΚΓ → άνοιγμα σε πλήρη οθόνη με ζουμ και μετακίνηση.
   Ζουμ: ροδέλα ποντικιού (προς τον δείκτη), κουμπιά +/−, ή διπλό κλικ.
   Μετακίνηση: σύρσιμο. Κλείσιμο: Esc, ✕, ή κλικ στο φόντο.
   ========================================================================== */
(function () {
  "use strict";
  var ov, stage, img, cap, zoomLabel;
  var scale = 1, tx = 0, ty = 0, drag = null;
  var MIN = 1, MAX = 8;

  function build() {
    if (ov) return;
    ov = document.createElement("div");
    ov.className = "figviewer";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.innerHTML =
      '<div class="fv-bar">' +
        '<span class="fv-cap"></span>' +
        '<span class="fv-tools">' +
          '<button type="button" data-fv="out" aria-label="Σμίκρυνση">−</button>' +
          '<span class="fv-zoom">100%</span>' +
          '<button type="button" data-fv="in" aria-label="Μεγέθυνση">+</button>' +
          '<button type="button" data-fv="reset" aria-label="Επαναφορά">⟲</button>' +
          '<button type="button" data-fv="close" aria-label="Κλείσιμο">✕</button>' +
        '</span>' +
      '</div>' +
      '<div class="fv-stage"><img alt=""></div>' +
      '<div class="fv-hint">Ροδέλα ή +/− για ζουμ · σύρσιμο για μετακίνηση · Esc για κλείσιμο</div>';
    document.body.appendChild(ov);
    stage = ov.querySelector(".fv-stage");
    img   = ov.querySelector("img");
    cap   = ov.querySelector(".fv-cap");
    zoomLabel = ov.querySelector(".fv-zoom");

    ov.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fv]");
      if (b) {
        var a = b.dataset.fv;
        if (a === "close") close();
        else if (a === "reset") { scale = 1; tx = ty = 0; apply(); }
        else zoomAt(a === "in" ? 1.4 : 1 / 1.4, 0, 0);
        return;
      }
      if (e.target === stage || e.target === ov) close();
    });

    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.18 : 1 / 1.18,
             e.clientX - r.left - r.width / 2,
             e.clientY - r.top - r.height / 2);
    }, { passive: false });

    img.addEventListener("dblclick", function (e) {
      var r = stage.getBoundingClientRect();
      if (scale > 1.05) { scale = 1; tx = ty = 0; apply(); }
      else zoomAt(2.5, e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2);
    });

    img.addEventListener("pointerdown", function (e) {
      if (scale <= 1.01) return;
      drag = { x: e.clientX - tx, y: e.clientY - ty };
      img.setPointerCapture(e.pointerId);
      img.style.cursor = "grabbing";
      e.preventDefault();
    });
    img.addEventListener("pointermove", function (e) {
      if (!drag) return;
      tx = e.clientX - drag.x; ty = e.clientY - drag.y; apply();
    });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      img.addEventListener(ev, function () { drag = null; img.style.cursor = scale > 1.01 ? "grab" : "zoom-in"; });
    });

    document.addEventListener("keydown", function (e) {
      if (!ov.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomAt(1.4, 0, 0);
      if (e.key === "-") zoomAt(1 / 1.4, 0, 0);
      if (e.key === "0") { scale = 1; tx = ty = 0; apply(); }
    });
  }

  function zoomAt(factor, px, py) {
    var next = Math.min(MAX, Math.max(MIN, scale * factor));
    if (next === scale) return;
    // κρατάμε σταθερό το σημείο κάτω από τον δείκτη
    tx = px - (px - tx) * (next / scale);
    ty = py - (py - ty) * (next / scale);
    scale = next;
    if (scale <= 1.01) { tx = ty = 0; }
    apply();
  }

  function apply() {
    img.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    img.style.cursor = scale > 1.01 ? "grab" : "zoom-in";
    zoomLabel.textContent = Math.round(scale * 100) + "%";
  }

  function open(src, caption) {
    build();
    img.src = src;
    img.alt = caption || "";
    cap.textContent = caption || "";
    scale = 1; tx = ty = 0; apply();
    ov.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!ov) return;
    ov.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { if (!ov.classList.contains("open")) img.src = ""; }, 220);
  }

  document.addEventListener("click", function (e) {
    var im = e.target.closest(".case-fig img, .case-image");
    if (!im || !im.getAttribute("src")) return;
    var fig = im.closest("figure, .case-fig");
    var c = fig && fig.querySelector("figcaption");
    open(im.getAttribute("src"), c ? c.textContent.trim() : (im.alt || ""));
  });
})();
