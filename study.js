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
        if (ch) {
            presentChapters.add(ch);
        }
    });

    // Ταξινόμηση με βάση τον αριθμό του κεφαλαίου, όποιο κι αν είναι το όνομά του,
    // ώστε να δουλεύει και για όσα κεφάλαια προστεθούν στο μέλλον.
    const chapterNum = (s) => {
        const m = String(s).match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
        return m ? parseInt(m[1], 10) : 9999;
    };
    const ordered = [...presentChapters].sort(
        (a, b) => chapterNum(a) - chapterNum(b) || String(a).localeCompare(String(b), 'el')
    );
    
    const list = [];
    ordered.forEach(ch => {
        const numMatch = ch.match(/^(\d+)/);
        if (numMatch) {
            const num = numMatch[1];
            presentChapters.forEach(pCh => {
                const pNumMatch = pCh.match(/^(\d+)/);
                if (pNumMatch && pNumMatch[1] === num) {
                    list.push(pCh);
                }
            });
        }
    });

    presentChapters.forEach(ch => {
        const hasPref = ordered.some(o => {
            const m1 = ch.match(/^(\d+)/);
            const m2 = o.match(/^(\d+)/);
            return m1 && m2 && m1[1] === m2[1];
        });
        if (!hasPref) {
            list.push(ch);
        }
    });

    const uniqueList = [];
    list.forEach(ch => {
        if (!uniqueList.includes(ch)) {
            uniqueList.push(ch);
        }
    });

    return ["Όλα", ...uniqueList];
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
    if (quickRecallPrevBtn) quickRecallPrevBtn.addEventListener('click', () => navigateQuickRecall(-1));
    if (quickRecallNextBtn) quickRecallNextBtn.addEventListener('click', () => navigateQuickRecall(1));
    if (quickRecallRandomBtn) quickRecallRandomBtn.addEventListener('click', loadQuickRandomQuestion);

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
    if (quickRecallNextBtn) {
        if (currentIndexInMatch === matchingIndices.length - 1) {
            quickRecallNextBtn.querySelector('span').textContent = "Επανεκκίνηση";
        } else {
            quickRecallNextBtn.querySelector('span').textContent = "Επόμενο";
        }
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
        quickCorrectAnswerText.innerHTML = parseMarkdown(question.correctAnswer);
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
                quickRecallExplanationContent.innerHTML = html;
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
function parseMarkdown(text) {
    if (!text) return "";
    
    // Normalize different escaped newline variations and strip stray backslashes
    let normalized = text.replace(/\\n/g, '\n');
    normalized = normalized.replace(/\\\n/g, '\n');
    normalized = normalized.replace(/\\/g, '');
    
    // Pre-process our custom image syntax
    normalized = normalized.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="embedded-image-container"><img src="" alt="" class="embedded-med-image" onclick="window.open(this.src, \'_blank\')" /><span class="image-caption"></span></div>');
    
    if (typeof marked !== 'undefined') {
        return marked.parse(normalized);
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
