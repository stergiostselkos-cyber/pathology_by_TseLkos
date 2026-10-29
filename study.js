// Study Portal State
let flashcardQuestions = [];
let currentQuickIndex = 0;
let activeQuickChapter = "Όλα";

// DOM Elements
const studyDashboard = document.getElementById('study-dashboard');
const quickRecallView = document.getElementById('quick-recall-view');

// Quick Recall Elements
const quickRecallProgress = document.getElementById('quick-recall-progress');
const quickRecallCategory = document.getElementById('quick-recall-category');
const quickRecallQuestion = document.getElementById('quick-recall-question');
const quickRevealedBlock = document.getElementById('quick-revealed-block');
const quickCorrectAnswerText = document.getElementById('quick-correct-answer-text');
const quickMnemonicText = document.getElementById('quick-mnemonic-text');
const quickRecallExplanationContent = document.getElementById('quick-recall-explanation-content');
const quickRevealBtn = document.getElementById('quick-reveal-btn');
const quickRevealBtnContainer = document.getElementById('quick-reveal-btn-container');
const quickRecallPrevBtn = document.getElementById('quick-recall-prev-btn');
const quickRecallNextBtn = document.getElementById('quick-recall-next-btn');
const quickRecallRandomBtn = document.getElementById('quick-recall-random-btn');
const quickPillsContainer = document.getElementById('quick-questions-overlay');

// Chapter Filter Containers
const quickChaptersContainer = document.getElementById('quick-chapters-overlay');


// Theme Toggle Element
const themeToggleBtn = document.getElementById('theme-toggle');

/**
 * Initialize Study Portal
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadQuestions();
    setupEventListeners();

    showView('quick-recall');
    
});

/**
 * Theme Management
 */
function initTheme() { document.body.classList.remove('dark-theme'); document.body.classList.add('light-theme'); localStorage.setItem('theme', 'light'); }

function toggleTheme() {}

/**
 * Load split databases from data/ folder
 */
function loadQuestions() {
    if (typeof flashcardQuestionsData !== 'undefined' && Array.isArray(flashcardQuestionsData) && flashcardQuestionsData.length > 0) {
        flashcardQuestions = flashcardQuestionsData;
    } else if (typeof newBookQuestionsData !== 'undefined' && Array.isArray(newBookQuestionsData) && newBookQuestionsData.length > 0) {
        flashcardQuestions = newBookQuestionsData;
    }
    populateQuickTopicSelector();

    if (typeof renderMainChapterFilters === 'function') renderMainChapterFilters();
    if (typeof renderSubchapterFilters === 'function') renderSubchapterFilters();
    if (typeof loadFirstMatchingQuickQuestion === 'function') loadFirstMatchingQuickQuestion();

    // Check if question ID requested via URL (?qId=123)
    const urlParams = new URLSearchParams(window.location.search);
    const targetQId = urlParams.get('qId') || urlParams.get('id');
    if (targetQId && flashcardQuestions.length > 0) {
        const foundIdx = flashcardQuestions.findIndex(q => String(q.id) === String(targetQId));
        if (foundIdx !== -1) {
            currentQuickIndex = foundIdx;
            if (typeof loadQuickRecallQuestion === 'function') loadQuickRecallQuestion(foundIdx);
        }
    }
}

/**
 * Helper to extract Chapter from Category (string after /)
 */
function getChapterFromCategory(category) {
    if (!category) return "Γενικά";
    if (category.includes("/")) {
        return category.split("/")[0].trim();
    }
    return category.trim();
}

/**
 * Helper to get the chapter of a question object
 */
function getQuestionChapter(q) {
    let rawCh = q.chapter || "";
    if (!rawCh) {
        rawCh = getChapterFromCategory(q.category);
    }
    
    // Normalize and strip outer brackets
    let ch = rawCh.replace(/^\[/, "").replace(/\]$/, "").trim();
    
    // Το όνομα του κεφαλαίου έρχεται αποκλειστικά από τα δεδομένα.
    // Παλαιότερα εδώ αντικαθίστανταν τα κεφάλαια 1–3 με σταθερά ονόματα,
    // οπότε κάθε μετονομασία στο flashcard_questions.js αγνοούνταν. Αφαιρέθηκε.
    return ch;
}

/**
 * Helper to check if a question's chapter matches the selected chapter.
 */
function isChapterMatch(questionCh, activeCh) {
    if (activeCh === "Όλα") return true;
    if (questionCh === activeCh) return true;
    
    const m1 = questionCh.match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
    const m2 = activeCh.match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
    if (m1 && m2 && m1[1] === m2[1]) {
        return true;
    }
    return false;
}

/**
 * Dynamically builds the ordered list of chapters.
 */
function getChapterList(questions) {
    const presentChapters = new Set();
    questions.forEach(q => {
        const ch = getQuestionChapter(q);
        if (ch) presentChapters.add(ch);
    });

    const chapterNum = (s) => {
        const m = String(s).match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
        return m ? parseInt(m[1], 10) : 9999;
    };
    
    const ordered = [...presentChapters].sort(
        (a, b) => chapterNum(a) - chapterNum(b) || String(a).localeCompare(String(b), 'el')
    );
    
    return ["Όλα", ...ordered];
}


/**
 * Toggles a beautiful empty state panel when a chapter has no questions.
 */
function toggleRecallEmptyState(hasQuestions) {
    const titleHeader = document.querySelector('#quick-recall-view .topic-title-header');
    const cardContainer = document.querySelector('#quick-recall-view .recall-card-container');
    const navFooter = document.querySelector('#quick-recall-view .quiz-navigation');
    const pillsContainer = document.getElementById('quick-pills-container');
    
    let emptyState = document.getElementById('quick-empty-state');
    if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'quick-empty-state';
        emptyState.className = 'empty-state-card';
        emptyState.innerHTML = `
            <div class="empty-state-icon" style="color: var(--primary-color); background: rgba(241, 196, 15, 0.1); border-color: rgba(241, 196, 15, 0.25);">📭</div>
            <h3 style="color: var(--primary-color);">Δεν υπάρχουν ερωτήσεις</h3>
            <p>Δεν έχουν προστεθεί ακόμη ερωτήσεις για αυτό το κεφάλαιο.</p>
        `;
        if (navFooter) {
            navFooter.parentNode.insertBefore(emptyState, navFooter);
        }
    }

    if (hasQuestions) {
        if (titleHeader) titleHeader.classList.remove('hidden');
        if (cardContainer) cardContainer.classList.remove('hidden');
        if (navFooter) navFooter.classList.remove('hidden');
        if (pillsContainer) pillsContainer.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
    } else {
        if (titleHeader) titleHeader.classList.add('hidden');
        if (cardContainer) cardContainer.classList.add('hidden');
        if (navFooter) navFooter.classList.add('hidden');
        if (pillsContainer) pillsContainer.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
    }
}

/**
 * Render Chapter Filters Dynamically
 */
function renderChapterFilters(container, questions, activeChapter, onSelect) {
    if (!container) return;
    container.innerHTML = '';

    const chapterList = getChapterList(questions);

    if (container.id === 'quick-chapters-overlay') {
        chapterList.forEach(chapter => {
            const item = document.createElement('button');
            const isActive = isChapterMatch(chapter, activeChapter);
            item.className = `overlay-chapter-item ${isActive ? 'active' : ''}`;
            item.textContent = chapter;
            item.addEventListener('click', () => {
                onSelect(chapter);
                container.classList.add('hidden');
            });
            container.appendChild(item);
        });

        const valueDisplay = document.getElementById('quick-chapters-dropdown-value');
        if (valueDisplay) {
            const matchedChapter = chapterList.find(ch => isChapterMatch(ch, activeChapter)) || activeChapter;
            valueDisplay.textContent = matchedChapter;
        }
    }
}

function handleQuickChapterSelect(selectedChapter) {
    activeQuickChapter = selectedChapter;
    renderChapterFilters(quickChaptersContainer, flashcardQuestions, activeQuickChapter, handleQuickChapterSelect);
    populateQuickTopicSelector();
    loadFirstMatchingQuickQuestion();
}

function loadFirstMatchingQuickQuestion() {
    let targetIndex = -1;
    for (let i = 0; i < flashcardQuestions.length; i++) {
        const ch = getQuestionChapter(flashcardQuestions[i]);
        if (isChapterMatch(ch, activeQuickChapter)) {
            targetIndex = i;
            break;
        }
    }
    if (targetIndex !== -1) {
        toggleRecallEmptyState(true);
        loadQuickRecallQuestion(targetIndex);
    } else {
        toggleRecallEmptyState(false);
    }
}




/**
 * Populate topic selector pills dynamically (Flashcard mode)
 */
function populateQuickTopicSelector() {
    const quickQuestionsOverlay = document.getElementById('quick-questions-overlay');
    if (!quickQuestionsOverlay) return;
    
    quickQuestionsOverlay.innerHTML = '';
    
    let relativeIndex = 1;
    flashcardQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (!isChapterMatch(ch, activeQuickChapter)) {
            return;
        }

        const currentRelative = relativeIndex++;
        const cleanQuestion = q.question.replace(/\*/g, '').trim();

        // Create overlay question item button
        const overlayItem = document.createElement('button');
        overlayItem.className = 'overlay-question-item';
        overlayItem.setAttribute('data-index', idx);
        overlayItem.style.width = '100%';
        overlayItem.innerHTML = `
            <strong style="color: var(--primary-color); flex-shrink: 0; margin-right: 4px;">Ερ. ${currentRelative}:</strong>
            <span style="flex-grow: 1; text-align: left;">${cleanQuestion}</span>
        `;
        overlayItem.addEventListener('click', () => {
            loadQuickRecallQuestion(idx);
            quickQuestionsOverlay.classList.add('hidden');
        });
        quickQuestionsOverlay.appendChild(overlayItem);
    });
}

/**
 * Update active state and scroll active pill into view
 */
function updateActivePill(container, activeIndex) {
    if (!container) return;
    
    if (container.id !== 'quick-questions-overlay') {
        const pills = container.querySelectorAll('.topic-pill');
        pills.forEach(p => p.classList.remove('active'));
        
        const activePill = container.querySelector(`.topic-pill[data-index="${activeIndex}"]`);
        if (activePill) {
            activePill.classList.add('active');
            activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        return;
    }

    // For Quick Recall selector
    const items = container.querySelectorAll('.overlay-question-item');
    items.forEach(item => item.classList.remove('active'));
    
    const activeItem = container.querySelector(`.overlay-question-item[data-index="${activeIndex}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Also update the large button text showing active question
        const qDisplay = document.getElementById('quick-questions-dropdown-value');
        if (qDisplay) {
            const strongText = activeItem.querySelector('strong').textContent;
            const spanText = activeItem.querySelector('span').textContent;
            qDisplay.textContent = `${strongText} ${spanText}`;
        }
    }
}

/**
 * Connect Event Listeners
 */
function setupEventListeners() {
    // Theme switch
    if (themeToggleBtn) // themeToggleBtn listener removed

    // Dashboard Cards click -> navigate to views
    document.querySelectorAll('.active-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            showView(target);
        });
    });

    // Back to menu buttons
    document.querySelectorAll('.back-to-menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    });



    // Quick Recall Controls (Flashcards)
    if (quickRevealBtn) quickRevealBtn.addEventListener('click', revealQuickAnswer);
    const allPrevStudyBtns = [quickRecallPrevBtn, document.getElementById('quick-recall-prev-btn-top')].filter(Boolean);
    const allNextStudyBtns = [quickRecallNextBtn, document.getElementById('quick-recall-next-btn-top')].filter(Boolean);
    const allRandStudyBtns = [quickRecallRandomBtn, document.getElementById('quick-recall-random-btn-top')].filter(Boolean);

    allPrevStudyBtns.forEach(btn => btn.addEventListener('click', () => navigateQuickRecall(-1)));
    allNextStudyBtns.forEach(btn => btn.addEventListener('click', () => navigateQuickRecall(1)));
    allRandStudyBtns.forEach(btn => btn.addEventListener('click', loadQuickRandomQuestion));

    // Quick List & Chapters Dropdowns toggle overlay
    const quickChaptersDropdownBtn = document.getElementById('quick-chapters-dropdown-btn');
    const quickChaptersOverlay = document.getElementById('quick-chapters-overlay');
    const quickQuestionsDropdownBtn = document.getElementById('quick-questions-dropdown-btn');
    const quickQuestionsOverlay = document.getElementById('quick-questions-overlay');

    if (quickChaptersDropdownBtn && quickChaptersOverlay) {
        quickChaptersDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
            quickChaptersOverlay.classList.toggle('hidden');
        });
    }

    if (quickQuestionsDropdownBtn && quickQuestionsOverlay) {
        quickQuestionsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
            quickQuestionsOverlay.classList.toggle('hidden');
        });
    }

    // Hide overlays if clicked outside
    document.addEventListener('click', (e) => {
        if (quickChaptersOverlay && !quickChaptersOverlay.contains(e.target) && e.target !== quickChaptersDropdownBtn && !quickChaptersDropdownBtn.contains(e.target)) {
            quickChaptersOverlay.classList.add('hidden');
        }
        if (quickQuestionsOverlay && !quickQuestionsOverlay.contains(e.target) && e.target !== quickQuestionsDropdownBtn && !quickQuestionsDropdownBtn.contains(e.target)) {
            quickQuestionsOverlay.classList.add('hidden');
        }
    });

}

/**
 * Switch top-level Portal Views
 */
function showView(view) {
    if (studyDashboard) studyDashboard.classList.add('hidden');
    if (quickRecallView) quickRecallView.classList.add('hidden');
    
    const quickQuestionsOverlay = document.getElementById('quick-questions-overlay');
    if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
    const quickChaptersOverlay = document.getElementById('quick-chapters-overlay');
    if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
    if (view === 'quick-recall') {
        if (quickRecallView) {
            quickRecallView.classList.remove('hidden');
            renderChapterFilters(quickChaptersContainer, flashcardQuestions, activeQuickChapter, handleQuickChapterSelect);
            populateQuickTopicSelector();
            loadFirstMatchingQuickQuestion();
        }
    } else {
        if (studyDashboard) studyDashboard.classList.remove('hidden');
    }
}

/**
 * Load Quick Recall question at index (Flashcards)
 */
function loadQuickRecallQuestion(index) {
    if (flashcardQuestions.length === 0) return;

    updateActivePill(quickPillsContainer, index);
    currentQuickIndex = index;

    const question = flashcardQuestions[index];

    if (quickRecallCategory) quickRecallCategory.textContent = question.category || "Παθολογία";
    if (quickRecallQuestion) quickRecallQuestion.innerHTML = parseMarkdown(question.question);

    const matchingIndices = [];
    flashcardQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeQuickChapter)) {
            matchingIndices.push(idx);
        }
    });
    const currentIndexInMatch = matchingIndices.indexOf(index);
    if (quickRecallProgress) quickRecallProgress.textContent = `Θέμα ${currentIndexInMatch + 1} από ${matchingIndices.length}`;

    if (quickRevealedBlock) quickRevealedBlock.classList.add('collapsed');
    if (quickRevealBtnContainer) quickRevealBtnContainer.classList.remove('hidden');

    if (quickRecallPrevBtn) quickRecallPrevBtn.disabled = (currentIndexInMatch === 0 || currentIndexInMatch === -1);
    const prevBtnTop = document.getElementById('quick-recall-prev-btn-top');
    if (prevBtnTop) prevBtnTop.disabled = (currentIndexInMatch === 0 || currentIndexInMatch === -1);

    const nextLabel = (currentIndexInMatch === matchingIndices.length - 1) ? "Επανεκκίνηση" : "Επόμενο";
    if (quickRecallNextBtn) {
        const span = quickRecallNextBtn.querySelector('span');
        if (span) span.textContent = nextLabel;
    }
    const nextBtnTop = document.getElementById('quick-recall-next-btn-top');
    if (nextBtnTop) {
        const span = nextBtnTop.querySelector('span');
        if (span) span.textContent = nextLabel;
    }
}

/**
 * Reveal Quick Recall answer
 */
function revealQuickAnswer() {
    const question = flashcardQuestions[currentQuickIndex];
    if (!question) return;

    if (quickRevealBtnContainer) quickRevealBtnContainer.classList.add('hidden');

    if (quickCorrectAnswerText) {
        let rawAns = question.correctAnswer || question.answer || "";
        if (!rawAns && question.correctAnswerIndices && question.options) {
            const indices = Array.isArray(question.correctAnswerIndices) ? question.correctAnswerIndices : [question.correctAnswerIndices];
            rawAns = indices.map(i => question.options[i]).filter(Boolean).join("<br>");
        }
        let ansParsed = parseMarkdown(rawAns);
        try {
            quickCorrectAnswerText.innerHTML = injectSectionBackToTop(ansParsed);
        } catch (e) {
            console.error("Error setting quickCorrectAnswerText:", e);
            quickCorrectAnswerText.innerHTML = ansParsed;
        }
    }

    // Mnemonic Tip Box - hide if empty or missing
    const mnemonicBox = document.getElementById('quick-mnemonic-box');
    if (mnemonicBox) {
        if (question.mnemonic && question.mnemonic.trim()) {
            mnemonicBox.style.display = "block";
            if (quickMnemonicText) {
                quickMnemonicText.textContent = question.mnemonic;
            }
        } else {
            mnemonicBox.style.display = "none";
        }
    }

    // Explanation Wrapper - hide if empty or redundant (matches answer text)
    const explanationWrapper = document.querySelector('#quick-recall-view .explanation-wrapper');
    if (explanationWrapper) {
        let rawExp = (question.explanation || "").trim();
        let rawAns = (question.correctAnswer || question.answer || "").trim();

        if (rawExp && rawExp !== rawAns) {
            explanationWrapper.style.display = "block";
            let html = "";

            const isSharedGuide = flashcardQuestions.filter(q => (q.explanation || "").trim() === rawExp).length > 1;

            if (isSharedGuide) {
                html += `<div style="font-size: 0.88rem; font-weight: 700; color: var(--primary-color); margin-bottom: 12px; padding: 6px 12px; border-radius: 8px; background: rgba(243, 156, 18, 0.15); border: 1px solid rgba(243, 156, 18, 0.3); display: inline-block;">📘 Γενικό Πλαίσιο &amp; Ανακεφαλαίωση Ενότητας</div>`;
            }

            html += parseMarkdown(rawExp);

            if (question.table) {
                let tableHtml = `<div class="table-pane active" style="margin-top: 24px; background: transparent; padding: 0; border: none; box-shadow: none;">`;
                tableHtml += `<div class="table-pane-header" style="margin-bottom: 12px;">`;
                tableHtml += `<h3 style="font-size: 1.15rem; font-weight: 600; color: var(--accent-color);">${question.table.title}</h3>`;
                tableHtml += `</div>`;
                tableHtml += `<div class="table-responsive"><table class="med-table">`;
                tableHtml += `<thead><tr>`;
                question.table.headers.forEach(h => {
                    tableHtml += `<th>${h}</th>`;
                });
                tableHtml += `</tr></thead><tbody>`;
                question.table.rows.forEach(row => {
                    tableHtml += `<tr>`;
                    row.forEach(cell => {
                        tableHtml += `<td>${cell}</td>`;
                    });
                    tableHtml += `</tr>`;
                });
                tableHtml += `</tbody></table></div></div>`;
                html += tableHtml;
            }

            if (quickRecallExplanationContent) {
                try {
                    quickRecallExplanationContent.innerHTML = injectSectionBackToTop(html);
                } catch (e) {
                    console.error("Error setting quickRecallExplanationContent:", e);
                    quickRecallExplanationContent.innerHTML = html;
                }
            }
        } else if (question.table) {
            explanationWrapper.style.display = "block";
            let tableHtml = `<div class="table-pane active" style="margin-top: 24px; background: transparent; padding: 0; border: none; box-shadow: none;">`;
            tableHtml += `<div class="table-pane-header" style="margin-bottom: 12px;">`;
            tableHtml += `<h3 style="font-size: 1.15rem; font-weight: 600; color: var(--accent-color);">${question.table.title}</h3>`;
            tableHtml += `</div>`;
            tableHtml += `<div class="table-responsive"><table class="med-table">`;
            tableHtml += `<thead><tr>`;
            question.table.headers.forEach(h => {
                tableHtml += `<th>${h}</th>`;
            });
            tableHtml += `</tr></thead><tbody>`;
            question.table.rows.forEach(row => {
                tableHtml += `<tr>`;
                row.forEach(cell => {
                    tableHtml += `<td>${cell}</td>`;
                });
                tableHtml += `</tr>`;
            });
            tableHtml += `</tbody></table></div></div>`;
            if (quickRecallExplanationContent) {
                quickRecallExplanationContent.innerHTML = tableHtml;
            }
        } else {
            explanationWrapper.style.display = "none";
        }
    }

    if (quickRevealedBlock) {
        quickRevealedBlock.classList.remove('collapsed');
        if (typeof window.initHDZoomInspector === 'function') {
            setTimeout(window.initHDZoomInspector, 50);
        }
    }

    setTimeout(() => {
        if (quickRevealedBlock) {
            quickRevealedBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 150);
}

/**
 * Cycle through quick recall topics (respecting chapter filter)
 */
function navigateQuickRecall(direction) {
    window.scrollToQuestionTop();
    const matchingIndices = [];
    flashcardQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeQuickChapter)) {
            matchingIndices.push(idx);
        }
    });

    if (matchingIndices.length === 0) return;

    let currentIndexInMatch = matchingIndices.indexOf(currentQuickIndex);
    if (currentIndexInMatch === -1) {
        loadQuickRecallQuestion(matchingIndices[0]);
        return;
    }

    let nextIndexInMatch = currentIndexInMatch + direction;
    if (nextIndexInMatch >= matchingIndices.length) {
        nextIndexInMatch = 0;
    }
    if (nextIndexInMatch < 0) {
        nextIndexInMatch = matchingIndices.length - 1;
    }

    loadQuickRecallQuestion(matchingIndices[nextIndexInMatch]);
}

/**
 * Load random quick recall topic (respecting chapter filter)
 */
function loadQuickRandomQuestion() {
    const matchingIndices = [];
    flashcardQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeQuickChapter)) {
            matchingIndices.push(idx);
        }
    });
    if (matchingIndices.length === 0) return;
    const randomIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    loadQuickRecallQuestion(randomIndex);
}

/**
 * Simple Markdown to HTML parser
 */
function wrapTablesInHtml(html) {
    if (!html || typeof html !== 'string' || !html.includes('<table')) return html;
    return html.replace(/(<div[^>]*class=["'][^"']*table-responsive-wrapper[^"']*["'][^>]*>[\s\S]*?<\/div>)|<table([\s\S]*?)<\/table>/gi, function(m, wrapped, body) {
        if (wrapped) return wrapped;
        return '<div class="table-responsive-wrapper"><table class="zoomable-table med-table"' + body + '</table></div>';
    });
}

function parseMarkdown(text) {
    if (!text) return "";
    
    // BYPASS FOR RAW HTML (WORD EXPORT)
    if (text.trim().startsWith('<div class="word-export"')) {
        return wrapTablesInHtml(text);
    }

    
    // Normalize different escaped newline variations and strip stray backslashes
    let normalized = text.replace(/\\n/g, '\n');
    normalized = normalized.replace(/\\\n/g, '\n');
    normalized = normalized.replace(/\\/g, '');
    
    // Pre-process our custom image syntax
    normalized = normalized.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="embedded-image-container"><img src="$2" alt="$1" class="embedded-med-image" /><span class="image-caption">$1</span></div>');
    
    if (typeof marked !== 'undefined') {
            // Clean bloated wordfmt spans from markdown table rows
    normalized = normalized.replace(/^\|.*\|$/gm, function(line) {
        return line.replace(/<\/?span[^>]*>/gi, '');
    });
    
    let __parsed = marked.parse(normalized);
    return __parsed.replace(/(<div[^>]*class=["'][^"']*table-responsive-wrapper[^"']*["'][^>]*>[\s\S]*?<\/div>)|<table([\s\S]*?)<\/table>/gi, function(m, wrapped, body) {
        if (wrapped) return wrapped;
        return '<div class="table-responsive-wrapper"><table class="zoomable-table med-table"' + body + '</table></div>';
    });
    }
    
    return normalized.replace(/\n/g, '<br/>');
}

// Close all custom dropdown panels when clicking outside
window.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.style.transform = 'rotate(0deg)';
    });
});


/* GLOBAL IMAGE VIEWER ADDED FOR DIAGRAMS */
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
    var im = e.target.closest(".case-fig img, .case-image, .embedded-med-image, .word-export img, .explanation-content img, .explanation-box img, .mcq-strict-answer img, .embedded-image-container img");
    if (!im || !im.getAttribute("src")) return;
    var fig = im.closest("figure, .case-fig, .embedded-image-container");
    var c = fig && (fig.querySelector("figcaption, .image-caption") || fig.querySelector("span, div"));
    open(im.getAttribute("src"), c ? c.textContent.trim() : (im.alt || ""));
  });
})();


// Unified HD Zoom Inspector is handled exclusively by image_zoom_viewer.js



window.openGlobalSearch = function() {
    if (window.innerWidth < 768) {
        window.location.href = 'search.html';
    } else {
        window.open('search.html', 'PathologiaUnifiedSearch', 'width=980,height=900,left=150,top=50,resizable=yes,scrollbars=yes');
    }
};
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openGlobalSearch();
    }
});


// ==============================================================================
// Section Back-to-Top & Floating Return Utilities (v20261023)
// ==============================================================================
window.scrollToQuestionTop = function() {
    const target = document.getElementById('quick-recall-view') || 
                   document.getElementById('quick-recall-question') || 
                   document.querySelector('.study-card') || 
                   document.querySelector('.app-main') || 
                   document.body;
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

function injectSectionBackToTop(html) {
    if (!html || typeof html !== 'string') return html;
    try {
        const topBtnHtml = '<div class="section-back-to-top">' +
            '<button type="button" class="btn-section-top" onclick="window.scrollToQuestionTop()" title="Επιστροφή στην κορυφή της ερώτησης">' +
            '<svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '<span>Επιστροφή στην κορυφή</span>' +
            '</button></div>';

        // 1. If explanation has .section-heading
        if (html.includes('class="section-heading"')) {
            let count = 0;
            let modified = html.replace(/<div class="section-heading"/g, (match) => {
                count++;
                if (count > 1) {
                    return topBtnHtml + match;
                }
                return match;
            });
            return modified + topBtnHtml;
        }
        
        // 2. If explanation has h2, h3, or h4
        if (html.includes('<h2') || html.includes('<h3') || html.includes('<h4')) {
            let count = 0;
            let modified = html.replace(/<h[234]/g, (match) => {
                count++;
                if (count > 1) {
                    return topBtnHtml + match;
                }
                return match;
            });
            return modified + topBtnHtml;
        }

        // 3. Fallback: if long enough (> 400 chars), append at the end
        if (html.length > 400) {
            return html + topBtnHtml;
        }

        return html;
    } catch (err) {
        console.error("injectSectionBackToTop error:", err);
        return html;
    }
}

// Window scroll listener for floating back-to-top button
window.addEventListener('scroll', () => {
    const floatBtn = document.getElementById('floating-back-to-top');
    if (floatBtn) {
        if (window.scrollY > 280) {
            floatBtn.classList.remove('hidden');
        } else {
            floatBtn.classList.add('hidden');
        }
    }
});
