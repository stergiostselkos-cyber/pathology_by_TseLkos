// Study Portal State
let socraticQuestions = [];
let flashcardQuestions = [];
let summaryTables = [];
let tableAnalyses = [];
let currentRecallIndex = 0;
let currentStepIndex = 0;
let isGameCompleted = false;
let currentQuickIndex = 0;
let activeSocraticChapter = "Όλα";
let activeQuickChapter = "Όλα";
let activeTableChapter = "Όλα";
let activeTableId = null;

// DOM Elements
const studyDashboard = document.getElementById('study-dashboard');
const recallView = document.getElementById('recall-view');
const tablesView = document.getElementById('tables-view') || document.createElement('div');
const quickRecallView = document.getElementById('quick-recall-view');
const tableAnalysisView = document.getElementById('table-analysis-view');

// Active Recall & Socratic Game Elements
const recallProgress = document.getElementById('recall-progress');
const recallCategory = document.getElementById('recall-category');
const recallQuestion = document.getElementById('recall-question');
const revealedBlock = document.getElementById('revealed-block');
const correctAnswerText = document.getElementById('correct-answer-text');
const mnemonicText = document.getElementById('mnemonic-text');
const recallExplanationContent = document.getElementById('recall-explanation-content');
const recallPrevBtn = document.getElementById('recall-prev-btn');
const recallNextBtn = document.getElementById('recall-next-btn');
const recallRandomBtn = document.getElementById('recall-random-btn');

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
const socraticPillsContainer = document.getElementById('socratic-pills-container');

// Chapter Filter Containers
const socraticChaptersContainer = document.getElementById('socratic-chapters-container');
const quickChaptersContainer = document.getElementById('quick-chapters-overlay');

// Socratic Panels
const socraticPanel = document.getElementById('socratic-panel');
const socraticStepText = document.getElementById('socratic-step-text');
const socraticProgressFill = document.getElementById('socratic-progress-fill');
const socraticSubQuestion = document.getElementById('socratic-sub-question');
const socraticOptionsContainer = document.getElementById('socratic-options-container');
const socraticFeedback = document.getElementById('socratic-feedback');
const socraticSubmitBtn = document.getElementById('socratic-submit-btn');
const socraticNextStepBtn = document.getElementById('socratic-next-step-btn');
const socraticRestartBtn = document.getElementById('socratic-restart-btn');

// Tables Elements
const printTableBtn = document.getElementById('print-table-btn');

// Theme Toggle Element
const themeToggleBtn = document.getElementById('theme-toggle');

/**
 * Initialize Study Portal
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadQuestions();
    setupEventListeners();
    
    const hash = window.location.hash;
    if (hash === '#table-analysis') {
        showView('table-analysis');
    } else {
        showView('quick-recall');
    }
});

/**
 * Theme Management
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Load split databases from data/ folder
 */
function loadQuestions() {
    if (typeof socraticQuestionsData !== 'undefined') {
        socraticQuestions = Array.isArray(socraticQuestionsData) ? socraticQuestionsData : [socraticQuestionsData];
    }
    if (typeof flashcardQuestionsData !== 'undefined') {
        flashcardQuestions = Array.isArray(flashcardQuestionsData) ? flashcardQuestionsData : [flashcardQuestionsData];
    }
    if (typeof summaryTablesData !== 'undefined') {
        summaryTables = Array.isArray(summaryTablesData) ? summaryTablesData : [summaryTablesData];
    }
    if (typeof tableAnalysesData !== 'undefined') {
        tableAnalyses = Array.isArray(tableAnalysesData) ? tableAnalysesData : [tableAnalysesData];
    }

    populateTopicSelector();
    populateQuickTopicSelector();
    renderSummaryTables();
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
    
    // Normalize raw chapter text to standard rich names
    const match = ch.match(/^(\d+)/);
    if (match) {
        const num = parseInt(match[1], 10);
        if (num === 1) return "1ο, ΓΕΝΙΚΗ ΠΑΘΟΛΟΓΙΑ";
        if (num === 2) return "2ο, ΣΥΣΤΗΜΑΤΙΚΗ ΠΑΘΟΛΟΓΙΑ";
    }
    return ch;
}

/**
 * Helper to check if a question's chapter matches the selected chapter.
 */
function isChapterMatch(questionCh, activeCh) {
    if (activeCh === "Όλα") return true;
    if (questionCh === activeCh) return true;
    
    const m1 = questionCh.match(/^(\d+)/);
    const m2 = activeCh.match(/^(\d+)/);
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

    const ordered = [
        "1ο, ΓΕΝΙΚΗ ΠΑΘΟΛΟΓΙΑ",
        "2ο, ΣΥΣΤΗΜΑΤΙΚΗ ΠΑΘΟΛΟΓΙΑ"
    ];
    
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
function toggleRecallEmptyState(hasQuestions, viewType) {
    if (viewType === 'socratic') {
        const titleHeader = document.querySelector('#recall-view .topic-title-header');
        const cardContainer = document.querySelector('#recall-view .recall-card-container');
        const navFooter = document.querySelector('#recall-view .quiz-navigation');
        const pillsContainer = document.getElementById('socratic-pills-container');
        
        let emptyState = document.getElementById('socratic-empty-state');
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'socratic-empty-state';
            emptyState.className = 'empty-state-card';
            emptyState.innerHTML = `
                <div class="empty-state-icon">📭</div>
                <h3>Δεν υπάρχουν ερωτήσεις</h3>
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
    } else if (viewType === 'quick') {
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
                <div class="empty-state-icon" style="color: #d946ef; background: rgba(217, 70, 239, 0.1); border-color: rgba(217, 70, 239, 0.2);">📭</div>
                <h3 style="color: #d946ef;">Δεν υπάρχουν ερωτήσεις</h3>
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
        return;
    }

    const btn = document.createElement('button');
    btn.className = 'custom-dropdown-btn';
    
    const matchedChapter = chapterList.find(ch => isChapterMatch(ch, activeChapter)) || activeChapter;
    btn.innerHTML = `
        <span class="selected-value">${matchedChapter}</span>
        <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    const isQuickRecall = (container.id === 'quick-chapters-container');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openChapterModal(chapterList, activeChapter, onSelect, isQuickRecall);
    });

    container.appendChild(btn);
}

function openChapterModal(chapterList, activeChapter, onSelect, isQuickRecall) {
    const modal = document.getElementById('chapter-modal');
    const grid = document.getElementById('modal-chapters-grid');
    if (!modal || !grid) return;

    if (isQuickRecall) {
        modal.className = 'modal-overlay quick-theme';
    } else {
        modal.className = 'modal-overlay socratic-theme';
    }

    grid.innerHTML = '';

    chapterList.forEach(chapter => {
        const item = document.createElement('button');
        const isActive = isChapterMatch(chapter, activeChapter);
        item.className = `modal-chapter-item ${isActive ? 'active' : ''}`;
        item.textContent = chapter;

        item.addEventListener('click', () => {
            onSelect(chapter);
            closeChapterModal();
        });
        grid.appendChild(item);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeChapterModal() {
    const modal = document.getElementById('chapter-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function handleSocraticChapterSelect(selectedChapter) {
    activeSocraticChapter = selectedChapter;
    renderChapterFilters(socraticChaptersContainer, socraticQuestions, activeSocraticChapter, handleSocraticChapterSelect);
    populateTopicSelector();
    loadFirstMatchingSocraticQuestion();
}

function handleQuickChapterSelect(selectedChapter) {
    activeQuickChapter = selectedChapter;
    renderChapterFilters(quickChaptersContainer, flashcardQuestions, activeQuickChapter, handleQuickChapterSelect);
    populateQuickTopicSelector();
    loadFirstMatchingQuickQuestion();
}

function loadFirstMatchingSocraticQuestion() {
    let targetIndex = -1;
    for (let i = 0; i < socraticQuestions.length; i++) {
        const ch = getQuestionChapter(socraticQuestions[i]);
        if (isChapterMatch(ch, activeSocraticChapter)) {
            targetIndex = i;
            break;
        }
    }
    if (targetIndex !== -1) {
        toggleRecallEmptyState(true, 'socratic');
        loadRecallQuestion(targetIndex);
    } else {
        toggleRecallEmptyState(false, 'socratic');
    }
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
        toggleRecallEmptyState(true, 'quick');
        loadQuickRecallQuestion(targetIndex);
    } else {
        toggleRecallEmptyState(false, 'quick');
    }
}

/**
 * Populate topic selector pills dynamically (Socratic mode)
 */
function populateTopicSelector() {
    if (!socraticPillsContainer) return;
    
    socraticPillsContainer.innerHTML = '';
    let relativeIndex = 1;
    socraticQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (!isChapterMatch(ch, activeSocraticChapter)) {
            return;
        }

        const pill = document.createElement('button');
        pill.className = 'topic-pill number-pill';
        pill.setAttribute('data-index', idx);
        pill.textContent = `Ερ. ${relativeIndex++}`;
        pill.addEventListener('click', () => {
            loadRecallQuestion(idx);
        });
        socraticPillsContainer.appendChild(pill);
    });
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
            <strong style="color: #d946ef; flex-shrink: 0; margin-right: 4px;">Ερ. ${currentRelative}:</strong>
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
 * Render Summary Tables dynamically
 */
function renderSummaryTables() {
    const tabsContainer = document.getElementById('tables-tabs-container');
    const panesContainer = document.getElementById('table-panes-container');
    if (!tabsContainer || !panesContainer) return;

    tabsContainer.innerHTML = '';
    panesContainer.innerHTML = '';

    if (summaryTables.length === 0) {
        panesContainer.innerHTML = '<p style="padding: 30px; text-align: center; color: var(--text-secondary); font-weight: 500;">Δεν υπάρχουν διαθέσιμοι πίνακες.</p>';
        return;
    }

    summaryTables.forEach((table, idx) => {
        // Create Tab Button
        const tabBtn = document.createElement('button');
        tabBtn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
        tabBtn.setAttribute('data-table', table.id);
        tabBtn.textContent = table.title;
        tabBtn.addEventListener('click', () => {
            const allBtns = tabsContainer.querySelectorAll('.tab-btn');
            allBtns.forEach(b => b.classList.remove('active'));
            tabBtn.classList.add('active');

            const allPanes = panesContainer.querySelectorAll('.table-pane');
            allPanes.forEach(p => p.classList.remove('active'));
            document.getElementById(`table-${table.id}`).classList.add('active');
        });
        tabsContainer.appendChild(tabBtn);

        // Create Content Pane
        const pane = document.createElement('div');
        pane.id = `table-${table.id}`;
        pane.className = `table-pane ${idx === 0 ? 'active' : ''}`;

        let paneHtml = `
            <div class="table-pane-header">
                <h3>${table.title}</h3>
                ${table.subtitle ? `<p>${table.subtitle}</p>` : ''}
            </div>
        `;

        if (table.type === 'html') {
            paneHtml += table.htmlContent || '';
        } else {
            paneHtml += `
                <div class="table-responsive">
                    <table class="med-table">
                        <thead>
                            <tr>
            `;
            if (table.headers && Array.isArray(table.headers)) {
                table.headers.forEach(h => {
                    paneHtml += `<th>${h}</th>`;
                });
            }
            paneHtml += `
                            </tr>
                        </thead>
                        <tbody>
            `;
            if (table.rows && Array.isArray(table.rows)) {
                table.rows.forEach(row => {
                    if (row.length === 2 && row[0].trim() === 'SECTION') {
                        paneHtml += `
                            <tr class="table-section-row">
                                <td colspan="${table.headers.length}"><strong>${row[1]}</strong></td>
                            </tr>
                        `;
                    } else {
                        paneHtml += `<tr>`;
                        row.forEach(cell => {
                            paneHtml += `<td>${cell}</td>`;
                        });
                        paneHtml += `</tr>`;
                    }
                });
            }
            paneHtml += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        pane.innerHTML = paneHtml;
        panesContainer.appendChild(pane);
    });
}

/**
 * Connect Event Listeners
 */
function setupEventListeners() {
    // Theme switch
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

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

    // Active Recall / Navigation controls (Socratic)
    if (recallPrevBtn) recallPrevBtn.addEventListener('click', () => navigateRecall(-1));
    if (recallNextBtn) recallNextBtn.addEventListener('click', () => navigateRecall(1));
    if (recallRandomBtn) recallRandomBtn.addEventListener('click', loadRandomQuestion);

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

    const tableChaptersDropdownBtn = document.getElementById('table-chapters-dropdown-btn');
    const tableChaptersOverlay = document.getElementById('table-chapters-overlay');
    const tablesDropdownBtn = document.getElementById('tables-dropdown-btn');
    const tablesDropdownOverlay = document.getElementById('tables-dropdown-overlay');

    if (quickChaptersDropdownBtn && quickChaptersOverlay) {
        quickChaptersDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
            if (tableChaptersOverlay) tableChaptersOverlay.classList.add('hidden');
            if (tablesDropdownOverlay) tablesDropdownOverlay.classList.add('hidden');
            quickChaptersOverlay.classList.toggle('hidden');
        });
    }

    if (quickQuestionsDropdownBtn && quickQuestionsOverlay) {
        quickQuestionsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
            if (tableChaptersOverlay) tableChaptersOverlay.classList.add('hidden');
            if (tablesDropdownOverlay) tablesDropdownOverlay.classList.add('hidden');
            quickQuestionsOverlay.classList.toggle('hidden');
        });
    }

    if (tableChaptersDropdownBtn && tableChaptersOverlay) {
        tableChaptersDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
            if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
            if (tablesDropdownOverlay) tablesDropdownOverlay.classList.add('hidden');
            tableChaptersOverlay.classList.toggle('hidden');
        });
    }

    if (tablesDropdownBtn && tablesDropdownOverlay) {
        tablesDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
            if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
            if (tableChaptersOverlay) tableChaptersOverlay.classList.add('hidden');
            tablesDropdownOverlay.classList.toggle('hidden');
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
        if (tableChaptersOverlay && !tableChaptersOverlay.contains(e.target) && e.target !== tableChaptersDropdownBtn && !tableChaptersDropdownBtn.contains(e.target)) {
            tableChaptersOverlay.classList.add('hidden');
        }
        if (tablesDropdownOverlay && !tablesDropdownOverlay.contains(e.target) && e.target !== tablesDropdownBtn && !tablesDropdownBtn.contains(e.target)) {
            tablesDropdownOverlay.classList.add('hidden');
        }
    });

    // Socratic Game controls
    if (socraticSubmitBtn) socraticSubmitBtn.addEventListener('click', evaluateSocraticStep);
    if (socraticNextStepBtn) socraticNextStepBtn.addEventListener('click', nextSocraticStep);
    if (socraticRestartBtn) socraticRestartBtn.addEventListener('click', restartSocraticGame);

    // Print table button
    if (printTableBtn) {
        printTableBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Chapter selection modal close button
    const closeModalBtn = document.getElementById('close-chapter-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeChapterModal);
    }

    // Chapter selection modal click outside content to close
    const modalOverlay = document.getElementById('chapter-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeChapterModal();
            }
        });
    }
}

/**
 * Switch top-level Portal Views
 */
function showView(view) {
    if (studyDashboard) studyDashboard.classList.add('hidden');
    if (recallView) recallView.classList.add('hidden');
    if (tablesView) tablesView.classList.add('hidden');
    if (quickRecallView) quickRecallView.classList.add('hidden');
    if (tableAnalysisView) tableAnalysisView.classList.add('hidden');
    
    const quickQuestionsOverlay = document.getElementById('quick-questions-overlay');
    if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
    const quickChaptersOverlay = document.getElementById('quick-chapters-overlay');
    if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
    const tableChaptersOverlay = document.getElementById('table-chapters-overlay');
    if (tableChaptersOverlay) tableChaptersOverlay.classList.add('hidden');
    const tablesDropdownOverlay = document.getElementById('tables-dropdown-overlay');
    if (tablesDropdownOverlay) tablesDropdownOverlay.classList.add('hidden');

    if (view === 'recall') {
        if (recallView) {
            recallView.classList.remove('hidden');
            renderChapterFilters(socraticChaptersContainer, socraticQuestions, activeSocraticChapter, handleSocraticChapterSelect);
            populateTopicSelector();
            loadFirstMatchingSocraticQuestion();
        }
    } else if (view === 'quick-recall') {
        if (quickRecallView) {
            quickRecallView.classList.remove('hidden');
            renderChapterFilters(quickChaptersContainer, flashcardQuestions, activeQuickChapter, handleQuickChapterSelect);
            populateQuickTopicSelector();
            loadFirstMatchingQuickQuestion();
        }
    } else if (view === 'table-analysis') {
        if (tableAnalysisView) {
            tableAnalysisView.classList.remove('hidden');
            initTableAnalysisView();
        }
    } else if (view === 'tables') {
        if (tablesView) tablesView.classList.remove('hidden');
    } else {
        if (studyDashboard) studyDashboard.classList.remove('hidden');
    }
}

/**
 * Load Socratic question at index
 */
function loadRecallQuestion(index) {
    if (socraticQuestions.length === 0) return;

    updateActivePill(socraticPillsContainer, index);

    currentRecallIndex = index;
    currentStepIndex = 0;
    isGameCompleted = false;

    const question = socraticQuestions[index];

    recallCategory.textContent = question.category || "Παθολογία";
    recallQuestion.textContent = question.question;

    // Filter index for status label
    const matchingIndices = [];
    socraticQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeSocraticChapter)) {
            matchingIndices.push(idx);
        }
    });
    const currentIndexInMatch = matchingIndices.indexOf(index);
    recallProgress.textContent = `Θέμα ${currentIndexInMatch + 1} από ${matchingIndices.length}`;

    revealedBlock.classList.add('collapsed');
    socraticPanel.classList.remove('hidden');

    loadSocraticStep();

    recallPrevBtn.disabled = (currentIndexInMatch === 0 || currentIndexInMatch === -1);
    if (currentIndexInMatch === matchingIndices.length - 1) {
        recallNextBtn.querySelector('span').textContent = "Επανεκκίνηση";
    } else {
        recallNextBtn.querySelector('span').textContent = "Επόμενο";
    }
}

/**
 * Load current active Socratic Step details
 */
function loadSocraticStep() {
    const question = socraticQuestions[currentRecallIndex];
    const step = question.steps[currentStepIndex];

    socraticStepText.textContent = `Βήμα ${currentStepIndex + 1} από ${question.steps.length}`;
    socraticProgressFill.style.width = `${((currentStepIndex + 1) / question.steps.length) * 100}%`;
    socraticSubQuestion.textContent = step.question || step.subQuestion;

    socraticOptionsContainer.innerHTML = '';
    step.options.forEach((opt, idx) => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'checkbox-container';
        optionLabel.innerHTML = `
            <input type="checkbox" data-index="${idx}">
            <span>${opt}</span>
        `;
        
        const checkbox = optionLabel.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                socraticFeedback.classList.add('hidden');
                socraticFeedback.innerHTML = '';
            });
        }
        socraticOptionsContainer.appendChild(optionLabel);
    });

    socraticFeedback.innerHTML = '';
    socraticFeedback.classList.add('hidden');
    socraticSubmitBtn.classList.remove('hidden');
    socraticNextStepBtn.classList.add('hidden');
    socraticRestartBtn.classList.add('hidden');
}

/**
 * Evaluate checkbox selections for current step
 */
function evaluateSocraticStep() {
    const question = socraticQuestions[currentRecallIndex];
    const step = question.steps[currentStepIndex];

    const checkedInputs = socraticOptionsContainer.querySelectorAll('input[type="checkbox"]:checked');
    const checkedIndices = Array.from(checkedInputs).map(input => parseInt(input.getAttribute('data-index'), 10));

    checkedIndices.sort((a, b) => a - b);
    
    const correctAnswers = Array.isArray(step.correctAnswerIndex) ? step.correctAnswerIndex : [step.correctAnswerIndex];
    const correctIndices = [...correctAnswers].sort((a, b) => a - b);

    const isCorrect = checkedIndices.length === correctIndices.length && 
                      checkedIndices.every((val, index) => val === correctIndices[index]);

    const optionContainers = socraticOptionsContainer.querySelectorAll('.checkbox-container');
    optionContainers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        const idx = parseInt(checkbox.getAttribute('data-index'), 10);
        const isChecked = checkbox.checked;
        const isCorrectChoice = correctAnswers.includes(idx);
        
        checkbox.disabled = true;
        
        if (isCorrectChoice) {
            container.classList.add('choice-correct');
        } else if (isChecked) {
            container.classList.add('choice-incorrect');
        }
    });

    socraticFeedback.classList.remove('hidden');

    if (isCorrect) {
        socraticFeedback.innerHTML = `
            <div style="background: var(--success-bg); border: 1px solid var(--success-border); border-left: 4px solid var(--success-color); padding: 16px; border-radius: 8px; color: var(--text-primary); font-weight: 500; font-size: 0.95rem;">
                <span style="color: var(--success-color); font-weight: 700; display: block; margin-bottom: 4px;">🟢 Σωστή Απάντηση!</span>
                Εξαιρετικά! Απαντήσατε σωστά σε όλα τα ζητούμενα του βήματος.
            </div>
        `;
        socraticSubmitBtn.classList.add('hidden');
        socraticNextStepBtn.classList.remove('hidden');

        if (currentStepIndex === question.steps.length - 1) {
            socraticNextStepBtn.innerHTML = `
                <span>Αποκάλυψη Θεωρίας &amp; Σύνοψης</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-left: 6px;">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            socraticNextStepBtn.innerHTML = `
                <span>Επόμενο Βήμα</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-left: 6px;">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    } else {
        const tips = step.tips || [step.explanation];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const banter = step.banter || "Προσέξτε ξανά τις επιλογές σας.";

        socraticFeedback.innerHTML = `
            <div style="background: var(--error-bg); border: 1px solid var(--error-border); border-left: 4px solid var(--error-color); padding: 16px; border-radius: 8px; color: var(--text-primary); font-size: 0.95rem; line-height: 1.5;">
                <span style="color: var(--error-color); font-weight: 700; display: block; margin-bottom: 6px;">🔴 Λάθος επιλογή!</span>
                <p style="margin: 0 0 8px 0; font-weight: 500; color: var(--text-primary);">${banter}</p>
                <div style="background: rgba(0, 0, 0, 0.05); padding: 10px; border-radius: 6px; border: 1px dashed var(--error-border); color: var(--text-primary);">
                    <strong style="color: var(--error-color);">💡 Στοιχείο (Tip):</strong> ${randomTip}
                </div>
            </div>
        `;
        socraticSubmitBtn.classList.add('hidden');
        socraticNextStepBtn.classList.add('hidden');
        
        socraticRestartBtn.classList.remove('hidden');
        if (currentStepIndex === 0) {
            socraticRestartBtn.innerHTML = `<span>🔄 Προσπάθησε Ξανά</span>`;
        } else {
            socraticRestartBtn.innerHTML = `<span>🔄 Επανεκκίνηση από Βήμα 1</span>`;
        }
    }
}

/**
 * Handle Next Step button action
 */
function nextSocraticStep() {
    const question = socraticQuestions[currentRecallIndex];

    if (currentStepIndex === question.steps.length - 1) {
        revealFinalTheoryPresentation();
    } else {
        currentStepIndex++;
        loadSocraticStep();
    }
}

/**
 * Restart back to step 1
 */
function restartSocraticGame() {
    currentStepIndex = 0;
    loadSocraticStep();
}

/**
 * Render Socratic theory explanation
 */
function revealFinalTheoryPresentation() {
    isGameCompleted = true;
    const question = socraticQuestions[currentRecallIndex];

    socraticPanel.classList.add('hidden');

    let successBanner = `
        <div style="background: var(--success-bg); border: 1px solid var(--success-border); border-left: 4px solid var(--success-color); padding: 18px; border-radius: 8px; margin-bottom: 24px; color: var(--text-primary); line-height: 1.5;">
            <h4 style="margin: 0 0 6px 0; color: var(--success-color); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                🎉 Συγχαρητήρια!
            </h4>
            Απαντήσατε επιτυχώς σε όλα τα βήματα του Σωκρατικού διαλόγου. Παρακάτω ακολουθεί η πλήρης παρουσίαση της νόσου/κατάστασης.
        </div>
    `;

    correctAnswerText.innerHTML = `${successBanner}${parseMarkdown(question.correctAnswer)}`;
    mnemonicText.textContent = question.mnemonic || "Μελετήστε την ανάλυση της ερώτησης για να δείτε τα βασικά σημεία.";

    let explanationHtml = parseMarkdown(question.explanation);

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
        explanationHtml += tableHtml;
    }

    recallExplanationContent.innerHTML = explanationHtml;
    revealedBlock.classList.remove('collapsed');

    setTimeout(() => {
        revealedBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
}

/**
 * Cycle through Socratic topics (respecting chapter filter)
 */
function navigateRecall(direction) {
    const matchingIndices = [];
    socraticQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeSocraticChapter)) {
            matchingIndices.push(idx);
        }
    });

    if (matchingIndices.length === 0) return;

    let currentIndexInMatch = matchingIndices.indexOf(currentRecallIndex);
    if (currentIndexInMatch === -1) {
        loadRecallQuestion(matchingIndices[0]);
        return;
    }

    let nextIndexInMatch = currentIndexInMatch + direction;
    if (nextIndexInMatch >= matchingIndices.length) {
        nextIndexInMatch = 0;
    }
    if (nextIndexInMatch < 0) {
        nextIndexInMatch = matchingIndices.length - 1;
    }

    loadRecallQuestion(matchingIndices[nextIndexInMatch]);
}

/**
 * Load Socratic random topic (respecting chapter filter)
 */
function loadRandomQuestion() {
    const matchingIndices = [];
    socraticQuestions.forEach((q, idx) => {
        const ch = getQuestionChapter(q);
        if (isChapterMatch(ch, activeSocraticChapter)) {
            matchingIndices.push(idx);
        }
    });
    if (matchingIndices.length === 0) return;
    const randomIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    loadRecallQuestion(randomIndex);
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
    if (quickRecallQuestion) quickRecallQuestion.textContent = question.question;

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

    if (quickMnemonicText) {
        quickMnemonicText.textContent = question.mnemonic || "Μελετήστε την ανάλυση της ερώτησης για να δείτε τα βασικά σημεία.";
    }

    let explanationHtml = parseMarkdown(question.explanation);

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
        explanationHtml += tableHtml;
    }

    if (quickRecallExplanationContent) {
        quickRecallExplanationContent.innerHTML = explanationHtml;
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
    
    const lines = text.split('\n');
    let html = "";
    let inList = false;
    let inOrderedList = false;
    
    for (let line of lines) {
        line = line.trim();
        if (!line) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            continue;
        }
        
        // Parse bold: **text** -> <strong>text</strong>
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        if (line.startsWith("###")) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            const headerText = line.substring(3).trim();
            html += `<h3 style="font-size: 1.15rem; font-weight: 600; color: var(--accent-color); margin-top: 24px; margin-bottom: 12px;">${headerText}</h3>`;
        }
        else if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•") || line.startsWith("\u2022")) {
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            if (!inList) {
                html += "<ul style='margin-left: 20px; margin-bottom: 16px; line-height: 1.6; list-style-type: disc;'>";
                inList = true;
            }
            const liText = line.replace(/^[-*•\u2022]\s*/, '').trim();
            html += `<li style='margin-bottom: 8px; color: var(--text-primary);'>${liText}</li>`;
        }
        else if (/^\d+\.\s+/.test(line)) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (!inOrderedList) {
                html += "<ol style='margin-left: 20px; margin-bottom: 16px; line-height: 1.6;'>";
                inOrderedList = true;
            }
            const liText = line.replace(/^\d+\.\s+/, '').trim();
            html += `<li style='margin-bottom: 8px; color: var(--text-primary);'>${liText}</li>`;
        }
        else {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            html += `<p style='line-height: 1.6; margin-bottom: 14px; color: var(--text-primary);'>${line}</p>`;
        }
    }
    
    if (inList) {
        html += "</ul>";
    }
    if (inOrderedList) {
        html += "</ol>";
    }
    
    return html;
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

/**
 * Table Analysis Study Mode Functions
 */
function initTableAnalysisView() {
    // If no tables are available, show empty state or placeholder
    if (tableAnalyses.length === 0) {
        document.getElementById('table-analysis-title').textContent = "Δεν υπάρχουν διαθέσιμοι πίνακες.";
        document.getElementById('table-analysis-thead').innerHTML = "";
        document.getElementById('table-analysis-tbody').innerHTML = "";
        document.getElementById('table-analysis-detailed-content').innerHTML = "Παρακαλώ προσθέστε πίνακες στο αρχείο table_analyses.js.";
        document.getElementById('table-analysis-progress').textContent = "Πίνακας 0 από 0";
        return;
    }

    renderTableChaptersDropdown();
    renderTablesDropdown();

    // Load first table matching chapter filter or first table overall
    if (activeTableId === null) {
        loadFirstMatchingTable();
    } else {
        renderSelectedTable();
    }
}

function renderTableChaptersDropdown() {
    const container = document.getElementById('table-chapters-overlay');
    if (!container) return;

    container.innerHTML = "";
    
    // Get unique list of chapters
    const chapters = new Set();
    tableAnalyses.forEach(t => {
        if (t.chapter) chapters.add(t.chapter.trim());
    });

    const chapterList = ["Όλα", ...Array.from(chapters)];

    chapterList.forEach(chapter => {
        const item = document.createElement('button');
        const isActive = activeTableChapter === chapter;
        item.className = `overlay-chapter-item ${isActive ? 'active' : ''}`;
        item.textContent = chapter;
        item.addEventListener('click', () => {
            activeTableChapter = chapter;
            document.getElementById('table-chapters-dropdown-value').textContent = chapter;
            container.classList.add('hidden');
            renderTableChaptersDropdown();
            renderTablesDropdown();
            loadFirstMatchingTable();
        });
        container.appendChild(item);
    });

    document.getElementById('table-chapters-dropdown-value').textContent = activeTableChapter;
}

function renderTablesDropdown() {
    const container = document.getElementById('tables-dropdown-overlay');
    if (!container) return;

    container.innerHTML = "";

    const filteredTables = tableAnalyses.filter(t => {
        if (activeTableChapter === "Όλα") return true;
        return t.chapter.trim() === activeTableChapter;
    });

    filteredTables.forEach((t, index) => {
        const cleanTitle = t.title.replace(/\*/g, '').trim();
        const item = document.createElement('button');
        item.className = `overlay-question-item ${activeTableId === t.tableId ? 'active' : ''}`;
        item.style.width = '100%';
        item.innerHTML = `
            <strong style="color: #d946ef; flex-shrink: 0; margin-right: 4px;">Πίν. ${t.tableId}:</strong>
            <span style="flex-grow: 1; text-align: left;">${cleanTitle}</span>
        `;
        item.addEventListener('click', () => {
            activeTableId = t.tableId;
            container.classList.add('hidden');
            renderSelectedTable();
            renderTablesDropdown();
        });
        container.appendChild(item);
    });

    // Update active label display
        const label = document.getElementById('tables-dropdown-value');
    const currentTable = tableAnalyses.find(t => t.tableId === activeTableId);
    if (currentTable) {
        label.textContent = `Πίν. ${currentTable.tableId}: ${currentTable.title}`;
    } else {
        label.textContent = "Επιλέξτε Πίνακα...";
    }
}

function loadFirstMatchingTable() {
    const matched = tableAnalyses.find(t => {
        if (activeTableChapter === "Όλα") return true;
        return t.chapter.trim() === activeTableChapter;
    });

    if (matched) {
        activeTableId = matched.tableId;
        renderSelectedTable();
        renderTablesDropdown();
    } else {
        activeTableId = null;
        document.getElementById('table-analysis-title').textContent = "Δεν βρέθηκαν πίνακες για αυτό το κεφάλαιο.";
        document.getElementById('table-analysis-thead').innerHTML = "";
        document.getElementById('table-analysis-tbody').innerHTML = "";
        document.getElementById('table-analysis-detailed-content').innerHTML = "";
        document.getElementById('table-analysis-progress').textContent = "Πίνακας 0 από 0";
    }
}

function getT26NotebookLMPrompt(criterionName) {
    const name = criterionName.toLowerCase().trim();
    if (name.includes("κνησμός") && !name.includes("εφίδρωση")) {
        return "Αναζήτησε στις πηγές πληροφορίες για το κύριο κριτήριο 'Κνησμός'. Εξήγησε σύντομα γιατί είναι βασικό χαρακτηριστικό της ατοπικής δερματίτιδας σύμφωνα με τα κριτήρια Hanifin και Rajka.";
    }
    if (name.includes("μορφολογία")) {
        return "Αναζήτησε στις πηγές τον ορισμό της 'Τυπικής μορφολογίας και κατανομής' στην ατοπική δερματίτιδα (κριτήρια Hanifin-Rajka). Δώσε σύντομη περιγραφή του πώς εμφανίζονται συνήθως οι βλάβες.";
    }
    if (name.includes("υποτροπιάζουσα")) {
        return "Βρες στις πηγές πληροφορίες για το κριτήριο 'Χρόνια υποτροπιάζουσα δερματίτιδα' και εξήγησε σύντομα τι σημαίνει για την πορεία της ατοπικής δερματίτιδας.";
    }
    if (name.includes("ιστορικό")) {
        return "Αναζήτησε στις πηγές τη σημασία του 'Ατομικού ή οικογενειακού ιστορικού ατοπίας' ως κύριο κριτήριο διάγνωσης της ατοπικής δερματίτιδας.";
    }
    if (name.includes("ξηρότητα")) {
        return "Αναζήτησε στις πηγές γιατί η 'Ξηρότητα' αποτελεί δευτερεύον κριτήριο της ατοπικής δερματίτιδας και πώς σχετίζεται με τον δερματικό φραγμό.";
    }
    if (name.includes("ιχθύαση")) {
        return "Βρες στις πηγές πληροφορίες για το πώς η 'Ιχθύαση' συνδέεται με την ατοπική δερματίτιδα ως δευτερεύον κριτήριο διάγνωσης.";
    }
    if (name.includes("τύπου 1")) {
        return "Αναζήτησε στις πηγές την παρουσία 'Τύπου 1 αλλεργικής αντίδρασης' στο πλαίσιο των δευτερευόντων κριτηρίων Hanifin και Rajka για την ατοπική δερματίτιδα.";
    }
    if (name.includes("ige")) {
        return "Εξήγησε με βάση τις πηγές γιατί η 'Αυξημένη IgE σφαιρίνη στον ορό' καταγράφεται ως δευτερεύον κριτήριο στην ατοπική δερματίτιδα.";
    }
    if (name.includes("πρώιμη")) {
        return "Αναζήτησε στις πηγές τον όρο 'Πρώιμη έναρξη' σε σχέση με την ατοπική δερματίτιδα (κριτήρια Hanifin-Rajka) και δώσε ένα σύντομο κλινικό στοιχείο.";
    }
    if (name.includes("λοιμώξεις")) {
        return "Αναζήτησε στις πηγές γιατί η προδιάθεση για 'Λοιμώξεις δέρματος' αποτελεί δευτερεύον κριτήριο της ατοπικής δερματίτιδας.";
    }
    if (name.includes("άκρων")) {
        return "Βρες στις πηγές πληροφορίες για τη 'Δερματίτιδα άκρων' ως δευτερεύον κριτήριο Hanifin και Rajka.";
    }
    if (name.includes("χειλίτιδα")) {
        return "Αναζήτησε στις πηγές την εμφάνιση 'Χειλίτιδας' ως δευτερεύον κριτήριο διάγνωσης της ατοπικής δερματίτιδας.";
    }
    if (name.includes("επιπεφυκίτιδα")) {
        return "Βρες στις πηγές τη σύνδεση της 'Επιπεφυκίτιδας' με την ατοπική δερματίτιδα σύμφωνα με τα δευτερεύοντα κριτήρια διάγνωσης.";
    }
    if (name.includes("dennie")) {
        return "Αναζήτησε στις πηγές τον ορισμό για τις 'Πτυχές Dennie-Morgan' και τον ρόλο τους στα δευτερεύοντα κριτήρια της ατοπικής δερματίτιδας.";
    }
    if (name.includes("κερατόκωνος")) {
        return "Αναζήτησε στις πηγές τη σχέση του 'Κερατόκωνου' με την ατοπική δερματίτιδα στα κριτήρια Hanifin-Rajka.";
    }
    if (name.includes("λευκή πιτυρίαση") || name.includes("pityriasis")) {
        return "Βρες στις πηγές τον ορισμό της 'Διάγνωσης Λευκής πιτυρίασης' (Λευκή Πιτυρίαση (Pityriasis alba)) και πώς προσμετράται ως δευτερεύον κριτήριο.";
    }
    if (name.includes("ωχρότητα")) {
        return "Αναζήτησε στις πηγές πληροφορίες για την 'Ωχρότητα προσώπου / Ερύθημα' στο πλαίσιο των δευτερευόντων κριτηρίων της ατοπικής δερματίτιδας.";
    }
    if (name.includes("πτυχώσεις") || name.includes("τραχήλου")) {
        return "Βρες στις πηγές τον κλινικό ρόλο που έχουν οι 'Πτυχώσεις τραχήλου' στα δευτερεύοντα κριτήρια Hanifin και Rajka.";
    }
    if (name.includes("αυλακώσεων") || name.includes("υπεργραμμικότητα")) {
        return "Αναζήτησε στις πηγές την κλινική εικόνα 'Αύξηση των αυλακώσεων των παλαμών-πελμάτων' (υπεργραμμικότητα παλαμών) και εξήγησε γιατί είναι δευτερεύον κριτήριο.";
    }
    if (name.includes("εφίδρωση") || name.includes("ιδρώτα")) {
        return "Εξήγησε μέσω των πηγών τον μηχανισμό ή την κλινική σημασία για τον 'Κνησμό στην εφίδρωση' στην ατοπική δερματίτιδα.";
    }
    if (name.includes("μάλλινα") || name.includes("μαλλί")) {
        return "Αναζήτησε στις πηγές τη 'Δυσανεξία σε μάλλινα, σαπούνια' ως δευτερεύον κριτήριο ερεθισμού του δερματικού φραγμού.";
    }
    if (name.includes("θυλακική") || name.includes("περιθυλακική")) {
        return "Βρες στις πηγές τι σημαίνει 'Θυλακική υπερκεράτωση' (περιθυλακική έμφαση) και πώς περιλαμβάνεται στα δευτερεύοντα κριτήρια της ατοπικής δερματίτιδας.";
    }
    if (name.includes("τροφές") || name.includes("τροφική")) {
        return "Αναζήτησε στις πηγές τη σχέση ανάμεσα στη 'Δυσανεξία σε τροφές' (τροφική δυσανεξία) και τα κριτήρια Hanifin-Rajka.";
    }
    if (name.includes("περιβαλλοντικούς") || name.includes("συγκινησιακούς") || name.includes("επιβάρυνση") || name.includes("επιδείνωση")) {
        return "Εξήγησε μέσω των πηγών γιατί η 'Επιβάρυνση από περιβαλλοντικούς και συγκινησιακούς παράγοντες' αναγνωρίζεται ως δευτερεύον κριτήριο.";
    }
    if (name.includes("δερμογραφισμός")) {
        return "Αναζήτησε στις πηγές τον ορισμό για τον 'Λευκό δερμογραφισμό' και πώς αξιολογείται στην ατοπική δερματίτιδα.";
    }
    if (name.includes("θήλης") || name.includes("θηλών") || name.includes("μαστού")) {
        return "Βρες στις πηγές κλινικές πληροφορίες για το 'Έκζεμα της θηλής του μαστού' ως ειδικό δευτερεύον κριτήριο της ατοπικής δερματίτιδας.";
    }
    return "Αναζήτηση πληροφοριών στο NotebookLM για το κριτήριο " + criterionName;
}

function renderSelectedTable() {
    const table = tableAnalyses.find(t => t.tableId === activeTableId);
    if (!table) return;

    // Update title
    document.getElementById('table-analysis-title').textContent = table.title;

    // Subtitle management
    let subtitleEl = document.getElementById('table-analysis-subtitle');
    if (!subtitleEl) {
        subtitleEl = document.createElement('p');
        subtitleEl.id = 'table-analysis-subtitle';
        subtitleEl.style.fontSize = '1.05rem';
        subtitleEl.style.color = 'var(--text-secondary)';
        subtitleEl.style.marginTop = '6px';
        subtitleEl.style.marginBottom = '20px';
        subtitleEl.style.fontWeight = '500';
        const titleEl = document.getElementById('table-analysis-title');
        titleEl.parentNode.insertBefore(subtitleEl, titleEl.nextSibling);
    }

    // Update progress indicator
    const filtered = tableAnalyses.filter(t => {
        if (activeTableChapter === "Όλα") return true;
        return t.chapter.trim() === activeTableChapter;
    });
    const currentIndex = filtered.findIndex(t => t.tableId === activeTableId);
    document.getElementById('table-analysis-progress').textContent = `Πίνακας ${currentIndex + 1} από ${filtered.length}`;

    // Create viewport-relative global tooltip container if not present
    let globalTooltip = document.getElementById('global-table-cell-tooltip');
    if (!globalTooltip) {
        globalTooltip = document.createElement('div');
        globalTooltip.id = 'global-table-cell-tooltip';
        globalTooltip.className = 'cell-tooltip';
        globalTooltip.style.position = 'fixed';
        globalTooltip.style.zIndex = '10000';
        globalTooltip.style.display = 'none';
        globalTooltip.style.pointerEvents = 'none';
        globalTooltip.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        document.body.appendChild(globalTooltip);
    }

    if (table.tableId === 6) {
        subtitleEl.textContent = "Για να τεθεί η διάγνωση, πρέπει να πληρούνται τρία κύρια και τρία από τα δευτερεύοντα κριτήρια";
        subtitleEl.style.display = 'block';

        // Render custom dark blue medical headers
        const thead = document.getElementById('table-analysis-thead');
        thead.innerHTML = `
            <tr style="background-color: #1e3a8a !important; color: #ffffff !important;">
                <th style="padding: 14px 18px; text-align: left; font-weight: 700; border: 1px solid var(--card-border); color: #ffffff !important; width: 40%;">Κύρια κριτήρια</th>
                <th style="padding: 14px 18px; text-align: left; font-weight: 700; border: 1px solid var(--card-border); color: #ffffff !important; width: 60%;">Δευτερεύοντα κριτήρια</th>
            </tr>
        `;

        const tbody = document.getElementById('table-analysis-tbody');
        tbody.innerHTML = "";

        const tr = document.createElement('tr');

        // Column 1 (Main)
        const tdMain = document.createElement('td');
        tdMain.style.verticalAlign = 'top';
        tdMain.style.padding = '18px';
        tdMain.style.border = '1px solid var(--card-border)';
        const ulMain = document.createElement('ul');
        ulMain.className = 'criteria-list main-criteria-ul';
        ulMain.style.listStyleType = 'disc';
        ulMain.style.margin = '0';
        ulMain.style.paddingLeft = '20px';
        tdMain.appendChild(ulMain);

        // Column 2 (Secondary)
        const tdSecondary = document.createElement('td');
        tdSecondary.style.verticalAlign = 'top';
        tdSecondary.style.padding = '18px';
        tdSecondary.style.border = '1px solid var(--card-border)';
        const ulSecondary = document.createElement('ul');
        ulSecondary.className = 'criteria-list secondary-criteria-ul';
        ulSecondary.style.listStyleType = 'disc';
        ulSecondary.style.margin = '0';
        ulSecondary.style.paddingLeft = '20px';
        ulSecondary.style.columnCount = '2';
        ulSecondary.style.columnGap = '24px';
        tdSecondary.appendChild(ulSecondary);

        table.rows.forEach(row => {
            const cat = row.category ? (row.category.value !== undefined ? row.category.value : row.category) : "";
            const crit = row.criterion ? (row.criterion.value !== undefined ? row.criterion.value : row.criterion) : "";
            const mech = row.mechanism ? (row.mechanism.value !== undefined ? row.mechanism.value : row.mechanism) : "";

            const li = document.createElement('li');
            li.style.marginBottom = '10px';
            li.style.lineHeight = '1.5';
            li.className = 'interactive-li';
            li.style.cursor = 'pointer';

            const prompt = getT26NotebookLMPrompt(crit);

            const span = document.createElement('span');
            span.className = 'hover-trigger';
            span.setAttribute('data-prompt', prompt);
            span.textContent = crit;
            span.style.borderBottom = '1px dashed var(--primary-color)';
            span.style.fontWeight = '500';
            li.appendChild(span);

            // Bind tooltip events
            const showTooltip = () => {
                globalTooltip.innerHTML = `
                    <div class="cell-tooltip-header" style="font-weight: 700; color: #3b82f6; margin-bottom: 8px;">📌 ${crit}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px; font-style: italic; border-bottom: 1px solid var(--card-border); padding-bottom: 6px;">
                        <strong>Εντολή NotebookLM:</strong><br>${prompt}
                    </div>
                    <div style="font-size: 0.88rem; line-height: 1.4;">
                        <strong>Ανάλυση / Μηχανισμός:</strong><br>${parseMarkdown(mech || "")}
                    </div>
                `;
                globalTooltip.style.display = 'block';

                const rect = span.getBoundingClientRect();
                let left = rect.left + rect.width / 2 - 140;
                let top = rect.bottom + 8;

                if (left < 10) left = 10;
                if (left + 290 > window.innerWidth) {
                    left = window.innerWidth - 290;
                }

                const tooltipHeight = globalTooltip.offsetHeight || 220;
                if (top + tooltipHeight > window.innerHeight) {
                    top = rect.top - tooltipHeight - 8;
                }
                if (top < 10) top = 10;

                globalTooltip.style.left = left + 'px';
                globalTooltip.style.top = top + 'px';
                globalTooltip.style.opacity = '1';
                globalTooltip.style.visibility = 'visible';

                // Bottom details box
                const hasSelection = document.querySelector('.interactive-li.active-cell-selected') !== null;
                if (!hasSelection) {
                    const detailsContainer = document.getElementById('table-cell-details-box');
                    if (detailsContainer) {
                        detailsContainer.style.display = 'block';
                        detailsContainer.style.borderColor = '#1e3a8a';
                        detailsContainer.innerHTML = `
                            <div style="font-size: 1.15rem; font-weight: 700; color: #1e3a8a; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; display: flex; flex-direction: column; gap: 4px;">
                                <span>📌 ${crit}</span>
                                <span style="font-size: 0.88rem; font-weight: 400; color: var(--text-secondary); font-style: italic;">
                                    <b>Εντολή NotebookLM:</b> ${prompt}
                                </span>
                            </div>
                            <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                ${parseMarkdown(mech || "")}
                            </div>
                        `;
                    }
                }
            };

            const hideTooltip = () => {
                globalTooltip.style.display = 'none';
                globalTooltip.style.opacity = '0';
                globalTooltip.style.visibility = 'hidden';
            };

            const toggleLock = (e) => {
                e.stopPropagation();
                const isSelected = li.classList.contains('active-cell-selected');

                document.querySelectorAll('.interactive-li, .interactive-cell').forEach(el => {
                    el.classList.remove('active-cell-selected');
                });

                const detailsContainer = document.getElementById('table-cell-details-box');
                if (isSelected) {
                    if (detailsContainer) detailsContainer.style.display = 'none';
                } else {
                    li.classList.add('active-cell-selected');
                    if (detailsContainer) {
                        detailsContainer.style.display = 'block';
                        detailsContainer.style.borderColor = '#1e3a8a';
                        detailsContainer.innerHTML = `
                            <div style="font-size: 1.15rem; font-weight: 700; color: #1e3a8a; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; display: flex; flex-direction: column; gap: 4px;">
                                <span>📌 ${crit}</span>
                                <span style="font-size: 0.88rem; font-weight: 400; color: var(--text-secondary); font-style: italic;">
                                    <b>Εντολή NotebookLM:</b> ${prompt}
                                </span>
                            </div>
                            <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                ${parseMarkdown(mech || "")}
                            </div>
                        `;
                    }
                }
            };

            li.addEventListener('mouseenter', showTooltip);
            li.addEventListener('mouseleave', hideTooltip);
            li.addEventListener('click', toggleLock);

            if (cat.includes("Κύρια")) {
                ulMain.appendChild(li);
            } else {
                ulSecondary.appendChild(li);
            }
        });

        tr.appendChild(tdMain);
        tr.appendChild(tdSecondary);
        tbody.appendChild(tr);

        // Render Detailed Analysis
        const analysisBox = document.getElementById('table-analysis-detailed-content');
        if (analysisBox) {
            analysisBox.innerHTML = parseMarkdown(table.detailedAnalysis || "");
        }
        return;
    }

    subtitleEl.style.display = 'none';

    // Render Headers
    const thead = document.getElementById('table-analysis-thead');
    let headerHtml = "<tr>";
    table.headers.forEach(h => {
        const headerText = (h && typeof h === 'object') ? h.text : h;
        headerHtml += `<th>${headerText}</th>`;
    });
    headerHtml += "</tr>";
    thead.innerHTML = headerHtml;

    // Render Rows
    const tbody = document.getElementById('table-analysis-tbody');
    tbody.innerHTML = "";
    
    // Create viewport-relative global tooltip container if not present
    globalTooltip = document.getElementById('global-table-cell-tooltip');
    if (!globalTooltip) {
        globalTooltip = document.createElement('div');
        globalTooltip.id = 'global-table-cell-tooltip';
        globalTooltip.className = 'cell-tooltip';
        globalTooltip.style.position = 'fixed';
        globalTooltip.style.zIndex = '10000';
        globalTooltip.style.display = 'none';
        globalTooltip.style.pointerEvents = 'none';
        globalTooltip.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        document.body.appendChild(globalTooltip);
    }
    
    // Calculate rowspans for the first column to merge identical consecutive cells
    const rowSpans = [];
    for (let i = 0; i < table.rows.length; i++) {
        rowSpans[i] = 1;
    }
    let currentSpanIndex = 0;
    for (let i = 1; i < table.rows.length; i++) {
        const prevRow = table.rows[currentSpanIndex];
        const currRow = table.rows[i];
        
        let prevText = "";
        let currText = "";
        
        if (prevRow) {
            if (Array.isArray(prevRow)) {
                if (prevRow[0]) {
                    prevText = prevRow[0].value !== undefined ? prevRow[0].value : prevRow[0].text;
                }
            } else {
                const firstHeaderId = (table.headers[0] && typeof table.headers[0] === 'object') ? table.headers[0].id : table.headers[0];
                if (prevRow[firstHeaderId]) {
                    prevText = prevRow[firstHeaderId].value !== undefined ? prevRow[firstHeaderId].value : prevRow[firstHeaderId].text;
                }
            }
        }
        
        if (currRow) {
            if (Array.isArray(currRow)) {
                if (currRow[0]) {
                    currText = currRow[0].value !== undefined ? currRow[0].value : currRow[0].text;
                }
            } else {
                const firstHeaderId = (table.headers[0] && typeof table.headers[0] === 'object') ? table.headers[0].id : table.headers[0];
                if (currRow[firstHeaderId]) {
                    currText = currRow[firstHeaderId].value !== undefined ? currRow[firstHeaderId].value : currRow[firstHeaderId].text;
                }
            }
        }
        
        if (prevText && currText && prevText.trim() === currText.trim()) {
            rowSpans[currentSpanIndex]++;
            rowSpans[i] = 0;
        } else {
            currentSpanIndex = i;
        }
    }
    
    table.rows.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        const cellsToRender = [];
        if (Array.isArray(row)) {
            row.forEach(cell => cellsToRender.push(cell));
        } else {
            table.headers.forEach(h => {
                const headerId = (h && typeof h === 'object') ? h.id : h;
                cellsToRender.push(row[headerId]);
            });
        }

        cellsToRender.forEach((cell, colIndex) => {
            if (colIndex === 0 && rowSpans[rowIndex] === 0) {
                return; // Skip rendering merged cell
            }
            
            const td = document.createElement('td');
            td.className = "interactive-cell";
            if (colIndex === 0 && rowSpans[rowIndex] > 1) {
                td.rowSpan = rowSpans[rowIndex];
            }

            if (!cell) {
                td.textContent = "";
                tr.appendChild(td);
                return;
            }
            
            const cellText = cell.value !== undefined ? cell.value : cell.text;
            td.textContent = cellText;

            // Handle mouse entering cell (hover)
            td.addEventListener('mouseenter', () => {
                const cleanHeader = cellText ? cellText.split('(')[0].trim() : "";
                globalTooltip.innerHTML = `
                    <div class="cell-tooltip-header">📌 ${cleanHeader}</div>
                    ${parseMarkdown(cell.hoverText || "")}
                `;
                globalTooltip.style.display = 'block';
                
                // Position relative to cell bounding rect
                const rect = td.getBoundingClientRect();
                let left = rect.left + rect.width / 2 - 140;
                let top = rect.bottom + 8;
                
                // Keep inside screen viewport
                if (left < 10) left = 10;
                if (left + 290 > window.innerWidth) {
                    left = window.innerWidth - 290;
                }
                
                // Auto position above cell if it overflows screen bottom
                const tooltipHeight = globalTooltip.offsetHeight || 180;
                if (top + tooltipHeight > window.innerHeight) {
                    top = rect.top - tooltipHeight - 8;
                }
                if (top < 10) top = 10;
                
                globalTooltip.style.left = left + 'px';
                globalTooltip.style.top = top + 'px';
                globalTooltip.style.opacity = '1';
                globalTooltip.style.visibility = 'visible';
                
                // Update bottom details box dynamically on hover only if there is NO active locked selection!
                const hasSelection = document.querySelector('.interactive-cell.active-cell-selected') !== null;
                if (!hasSelection) {
                    const detailsContainer = document.getElementById('table-cell-details-box');
                    if (detailsContainer) {
                        detailsContainer.style.display = 'block';
                        detailsContainer.style.borderColor = '#0f766e';
                        detailsContainer.innerHTML = `
                            <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                <span>π“ ${cellText}</span>
                            </div>
                            <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                ${parseMarkdown(cell.hoverText || "")}
                            </div>
                        `;
                    }
                }
            });

            // Handle mouse leaving cell
            td.addEventListener('mouseleave', () => {
                globalTooltip.style.display = 'none';
                globalTooltip.style.opacity = '0';
                globalTooltip.style.visibility = 'hidden';
            });

            // Handle click/tap event for detailed display lock and scroll
            td.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const isAlreadySelected = td.classList.contains('active-cell-selected');
                
                document.querySelectorAll('.interactive-cell').forEach(c => {
                    c.classList.remove('active-cell-selected');
                });
                
                const detailsContainer = document.getElementById('table-cell-details-box');
                
                if (isAlreadySelected) {
                    // Toggle deselect
                    if (detailsContainer) {
                        detailsContainer.style.display = 'none';
                    }
                } else {
                    // Lock selection
                    td.classList.add('active-cell-selected');
                    if (detailsContainer) {
                        detailsContainer.style.display = 'block';
                        detailsContainer.style.borderColor = '#0f766e';
                        detailsContainer.innerHTML = `
                            <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                <span>π“ ${cellText}</span>
                            </div>
                            <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                ${parseMarkdown(cell.hoverText || "")}
                            </div>
                        `;
                    }
                }
            });

            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    // Render Detailed Analysis
    const analysisBox = document.getElementById('table-analysis-detailed-content');
    if (analysisBox) {
        analysisBox.innerHTML = parseMarkdown(table.detailedAnalysis || "");
    }
}

// Global click handler to close selections on tapping anywhere else
document.addEventListener('click', () => {
    document.querySelectorAll('.interactive-cell, .interactive-li').forEach(c => c.classList.remove('active-cell-selected'));
    const detailsContainer = document.getElementById('table-cell-details-box');
    if (detailsContainer) {
        detailsContainer.style.display = 'none';
    }
});

// Prevent deselecting when clicking inside the details box
const detailsBox = document.getElementById('table-cell-details-box');
if (detailsBox) {
    detailsBox.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}
