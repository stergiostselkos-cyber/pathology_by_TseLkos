// Study Portal State
let flashcardQuestions = [];
let summaryTables = [];
let tableAnalyses = [];
let currentQuickIndex = 0;
let activeQuickChapter = "Όλα";
let activeTableChapter = "Όλα";
let activeTableId = null;

// DOM Elements
const studyDashboard = document.getElementById('study-dashboard');
const tablesView = document.getElementById('tables-view') || document.createElement('div');
const quickRecallView = document.getElementById('quick-recall-view');
const tableAnalysisView = document.getElementById('table-analysis-view');

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
    if (typeof flashcardQuestionsData !== 'undefined') {
        flashcardQuestions = Array.isArray(flashcardQuestionsData) ? flashcardQuestionsData : [flashcardQuestionsData];
    }
    if (typeof summaryTablesData !== 'undefined') {
        summaryTables = Array.isArray(summaryTablesData) ? summaryTablesData : [summaryTablesData];
    }
    if (typeof tableAnalysesData !== 'undefined') {
        tableAnalyses = Array.isArray(tableAnalysesData) ? tableAnalysesData : [tableAnalysesData];
    }

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
    
    // Normalize raw chapter text to standard rich names (allowing optional prefix like ΚΕΦΑΛΑΙΟ)
    const match = ch.match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
    if (match) {
        const num = parseInt(match[1], 10);
        if (num === 1) return "1ο, ΓΕΝΙΚΗ ΠΑΘΟΛΟΓΙΑ";
        if (num === 2) return "2ο, ΣΥΣΤΗΜΑΤΙΚΗ ΠΑΘΟΛΟΓΙΑ";
        if (num === 3) return "3ο, ΛΟΙΜΩΔΗ ΝΟΣΗΜΑΤΑ";
    }
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

    const ordered = [
        "1ο, ΓΕΝΙΚΗ ΠΑΘΟΛΟΓΙΑ",
        "2ο, ΣΥΣΤΗΜΑΤΙΚΗ ΠΑΘΟΛΟΓΙΑ",
        "3ο, ΛΟΙΜΩΔΗ ΝΟΣΗΜΑΤΑ"
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

    // Print table button
    if (printTableBtn) {
        printTableBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/**
 * Switch top-level Portal Views
 */
function showView(view) {
    if (studyDashboard) studyDashboard.classList.add('hidden');
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

    if (view === 'quick-recall') {
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
    
    // Normalize different escaped newline variations and strip stray backslashes
    let normalized = text.replace(/\\n/g, '\n');
    normalized = normalized.replace(/\\\n/g, '\n');
    normalized = normalized.replace(/\\/g, '');
    
    const lines = normalized.split('\n');
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

    if (table.tableId === 7) {
        subtitleEl.textContent = "Συνήθεις ερεθιστικοί παράγοντες (αριστερά) και αλλεργιογόνα (δεξιά) με τις παθοφυσιολογικές τους λεπτομέρειες.";
        subtitleEl.style.display = 'block';

        // Render custom dark header (high tonal contrast)
        const thead = document.getElementById('table-analysis-thead');
        thead.innerHTML = `
            <tr style="background-color: #0f172a !important; color: #ffffff !important;">
                <th class="table7-th" style="padding: 14px 18px; text-align: left; font-weight: 700; border: 1px solid var(--card-border); color: #ffffff !important; width: 50%;">Ερεθιστικοί παράγοντες</th>
                <th class="table7-th" style="padding: 14px 18px; text-align: left; font-weight: 700; border: 1px solid var(--card-border); color: #ffffff !important; width: 50%;">Αλλεργιογόνα</th>
            </tr>
        `;

        const tbody = document.getElementById('table-analysis-tbody');
        tbody.innerHTML = "";

        const tr = document.createElement('tr');
        tr.style.backgroundColor = '#f8fafc'; // Subtle light background for body

        // Column 1 (Irritants)
        const tdMain = document.createElement('td');
        tdMain.className = "table7-td";
        tdMain.style.verticalAlign = 'top';
        tdMain.style.padding = '18px';
        tdMain.style.border = '1px solid var(--card-border)';
        tdMain.style.backgroundColor = '#f8fafc'; // light background
        
        const ulMain = document.createElement('ul');
        ulMain.style.listStyleType = 'disc';
        ulMain.style.margin = '0';
        ulMain.style.paddingLeft = '20px';
        tdMain.appendChild(ulMain);

        // Column 2 (Allergens)
        const tdSecondary = document.createElement('td');
        tdSecondary.className = "table7-td";
        tdSecondary.style.verticalAlign = 'top';
        tdSecondary.style.padding = '18px';
        tdSecondary.style.border = '1px solid var(--card-border)';
        tdSecondary.style.backgroundColor = '#f8fafc'; // light background
        
        const ulSecondary = document.createElement('ul');
        ulSecondary.style.margin = '0';
        ulSecondary.style.paddingLeft = '20px';
        tdSecondary.appendChild(ulSecondary);

        // Position helper
        const positionTooltipAt = (clientX, clientY) => {
            let left = clientX + 15;
            let top = clientY + 15;
            
            const tooltipWidth = 320;
            globalTooltip.style.width = tooltipWidth + 'px';
            const tooltipHeight = globalTooltip.offsetHeight || 200;
            
            if (left + tooltipWidth > window.innerWidth) {
                left = clientX - tooltipWidth - 15;
            }
            if (left < 10) left = 10;
            
            if (top + tooltipHeight > window.innerHeight) {
                top = clientY - tooltipHeight - 15;
            }
            if (top < 10) top = 10;
            
            globalTooltip.style.left = left + 'px';
            globalTooltip.style.top = top + 'px';
            globalTooltip.style.opacity = '1';
            globalTooltip.style.visibility = 'visible';
        };

        const showTooltip = (title, text, clientX, clientY) => {
            globalTooltip.innerHTML = `
                <div class="cell-tooltip-header" style="font-weight: 700; color: #0d9488; margin-bottom: 8px;">📌 ${title}</div>
                <div style="font-size: 0.88rem; line-height: 1.4; color: var(--text-primary);">
                    ${parseMarkdown(text || "")}
                </div>
            `;
            globalTooltip.style.display = 'block';
            positionTooltipAt(clientX, clientY);
            
            // Check selection to update bottom details box dynamically
            const hasSelection = document.querySelector('.interactive-li-t7.active-cell-selected') !== null;
            if (!hasSelection) {
                const detailsContainer = document.getElementById('table-cell-details-box');
                if (detailsContainer) {
                    detailsContainer.style.display = 'block';
                    detailsContainer.style.borderColor = '#0f766e';
                    detailsContainer.innerHTML = `
                        <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            <span>📌 ${title}</span>
                        </div>
                        <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                            ${parseMarkdown(text || "")}
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

        const toggleLockT7 = (e, element, title, text) => {
            e.stopPropagation();
            const isSelected = element.classList.contains('active-cell-selected');

            document.querySelectorAll('.interactive-li, .interactive-cell, .interactive-li-t7').forEach(el => {
                el.classList.remove('active-cell-selected');
            });

            const detailsContainer = document.getElementById('table-cell-details-box');
            if (isSelected) {
                if (detailsContainer) detailsContainer.style.display = 'none';
            } else {
                element.classList.add('active-cell-selected');
                if (detailsContainer) {
                    detailsContainer.style.display = 'block';
                    detailsContainer.style.borderColor = '#0f766e';
                    detailsContainer.innerHTML = `
                        <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                            <span>📌 ${title}</span>
                        </div>
                        <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                            ${parseMarkdown(text || "")}
                        </div>
                    `;
                }
            }
        };

        // Populate Irritants
        table.rows.forEach(row => {
            const col = row["Στήλη"];
            if (col === "Ερεθιστικοί παράγοντες") {
                const elementText = row["Στοιχείο"];
                const mechText = row["Γενική_Πληροφορία_και_Μηχανισμός"];

                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.lineHeight = '1.6';
                li.className = 'interactive-li-t7';
                li.style.cursor = 'pointer';
                li.style.listStyleType = 'disc';

                const span = document.createElement('span');
                span.className = 'hover-trigger';
                span.style.borderBottom = '1px dashed var(--primary-color)';
                span.style.fontWeight = '500';
                span.style.color = '#000000';
                span.textContent = elementText;
                li.appendChild(span);

                li.addEventListener('mouseenter', (e) => showTooltip(elementText, mechText, e.clientX, e.clientY));
                li.addEventListener('mousemove', (e) => positionTooltipAt(e.clientX, e.clientY));
                li.addEventListener('mouseleave', hideTooltip);
                li.addEventListener('click', (e) => toggleLockT7(e, li, elementText, mechText));

                ulMain.appendChild(li);
            }
        });

        // Group allergens by category
        const allergenGroups = {};
        const categoryOrder = [];
        table.rows.forEach(row => {
            const col = row["Στήλη"];
            if (col === "Αλλεργιογόνα") {
                const cat = row["Κατηγορία"];
                if (!allergenGroups[cat]) {
                    allergenGroups[cat] = [];
                    categoryOrder.push(cat);
                }
                allergenGroups[cat].push(row);
            }
        });

        // Populate Allergens
        categoryOrder.forEach(category => {
            const items = allergenGroups[category];
            if (category === "Τοπικά κορτικοστεροειδή" || (items.length === 1 && items[0]["Στοιχείο"] === category)) {
                const rowObj = items[0];
                const elementText = rowObj["Στοιχείο"];
                const mechText = rowObj["Γενική_Πληροφορία_και_Μηχανισμός"];

                const li = document.createElement('li');
                li.className = 'interactive-li-t7';
                li.style.marginBottom = '10px';
                li.style.lineHeight = '1.6';
                li.style.cursor = 'pointer';
                li.style.listStyleType = 'disc';

                const span = document.createElement('span');
                span.className = 'hover-trigger';
                span.style.borderBottom = '1px dashed var(--primary-color)';
                span.style.fontWeight = '700';
                span.style.color = '#000000';
                span.textContent = elementText;
                li.appendChild(span);

                li.addEventListener('mouseenter', (e) => showTooltip(elementText, mechText, e.clientX, e.clientY));
                li.addEventListener('mousemove', (e) => positionTooltipAt(e.clientX, e.clientY));
                li.addEventListener('mouseleave', hideTooltip);
                li.addEventListener('click', (e) => toggleLockT7(e, li, elementText, mechText));

                ulSecondary.appendChild(li);
            } else {
                const categoryLi = document.createElement('li');
                categoryLi.style.marginBottom = '12px';
                categoryLi.style.lineHeight = '1.6';
                categoryLi.style.fontWeight = '700';
                categoryLi.style.color = '#000000';
                categoryLi.style.listStyleType = 'disc';
                categoryLi.textContent = category;

                const subUl = document.createElement('ul');
                subUl.style.listStyleType = 'none';
                subUl.style.paddingLeft = '18px';
                subUl.style.marginTop = '6px';

                items.forEach(rowObj => {
                    const elementText = rowObj["Στοιχείο"];
                    const mechText = rowObj["Γενική_Πληροφορία_και_Μηχανισμός"];

                    const subLi = document.createElement('li');
                    subLi.className = 'interactive-li-t7';
                    subLi.style.marginBottom = '6px';
                    subLi.style.lineHeight = '1.5';
                    subLi.style.cursor = 'pointer';
                    subLi.style.fontWeight = 'normal';

                    const dashSpan = document.createElement('span');
                    dashSpan.style.marginRight = '8px';
                    dashSpan.style.color = '#000000';
                    dashSpan.textContent = '—';
                    subLi.appendChild(dashSpan);

                    const span = document.createElement('span');
                    span.className = 'hover-trigger';
                    span.style.borderBottom = '1px dashed var(--primary-color)';
                    span.style.fontWeight = '500';
                    span.style.color = '#000000';
                    span.textContent = elementText;
                    subLi.appendChild(span);

                    subLi.addEventListener('mouseenter', (e) => showTooltip(elementText, mechText, e.clientX, e.clientY));
                    subLi.addEventListener('mousemove', (e) => positionTooltipAt(e.clientX, e.clientY));
                    subLi.addEventListener('mouseleave', hideTooltip);
                    subLi.addEventListener('click', (e) => toggleLockT7(e, subLi, elementText, mechText));

                    subUl.appendChild(subLi);
                });

                categoryLi.appendChild(subUl);
                ulSecondary.appendChild(categoryLi);
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

            if (cell.subItems && Array.isArray(cell.subItems)) {
                td.className = "";
                td.style.padding = "8px 12px";
                td.style.border = "1px solid var(--card-border)";
                
                const ul = document.createElement('ul');
                ul.style.margin = "0";
                ul.style.paddingLeft = "20px";
                ul.style.listStyleType = "disc";
                
                cell.subItems.forEach(item => {
                    const li = document.createElement('li');
                    li.className = "interactive-cell";
                    li.style.cursor = "pointer";
                    li.style.marginBottom = "6px";
                    li.style.lineHeight = "1.4";
                    
                    const span = document.createElement('span');
                    span.className = "hover-trigger";
                    span.style.borderBottom = "1px dashed var(--primary-color)";
                    span.style.fontWeight = "500";
                    span.style.color = "var(--text-primary)";
                    span.textContent = item.text;
                    li.appendChild(span);
                    
                    const itemText = item.text;
                    const itemHover = item.hoverText;
                    
                    li.addEventListener('mouseenter', () => {
                        const cleanHeader = itemText ? itemText.split('(')[0].trim() : "";
                        globalTooltip.innerHTML = `
                            <div class="cell-tooltip-header">📌 ${cleanHeader}</div>
                            ${parseMarkdown(itemHover || "")}
                        `;
                        globalTooltip.style.display = 'block';
                        
                        // Check if another element is locked
                        const hasSelection = document.querySelector('.interactive-cell.active-cell-selected, .interactive-li.active-cell-selected, .interactive-li-t7.active-cell-selected') !== null;
                        if (!hasSelection) {
                            const detailsContainer = document.getElementById('table-cell-details-box');
                            if (detailsContainer) {
                                detailsContainer.style.display = 'block';
                                detailsContainer.style.borderColor = '#0f766e';
                                detailsContainer.innerHTML = `
                                    <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                        <span>📌 ${itemText}</span>
                                    </div>
                                    <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                        ${parseMarkdown(itemHover || "")}
                                    </div>
                                `;
                            }
                        }
                    });
                    
                    li.addEventListener('mousemove', (e) => {
                        let left = e.clientX + 15;
                        let top = e.clientY + 15;
                        
                        const tooltipWidth = 320;
                        globalTooltip.style.width = tooltipWidth + 'px';
                        const tooltipHeight = globalTooltip.offsetHeight || 200;
                        
                        if (left + tooltipWidth > window.innerWidth) {
                            left = e.clientX - tooltipWidth - 15;
                        }
                        if (left < 10) left = 10;
                        
                        if (top + tooltipHeight > window.innerHeight) {
                            top = e.clientY - tooltipHeight - 15;
                        }
                        if (top < 10) top = 10;
                        
                        globalTooltip.style.left = left + 'px';
                        globalTooltip.style.top = top + 'px';
                        globalTooltip.style.opacity = '1';
                        globalTooltip.style.visibility = 'visible';
                    });
                    
                    li.addEventListener('mouseleave', () => {
                        globalTooltip.style.display = 'none';
                        globalTooltip.style.opacity = '0';
                        globalTooltip.style.visibility = 'hidden';
                    });
                    
                    li.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const isSelected = li.classList.contains('active-cell-selected');
                        
                        document.querySelectorAll('.interactive-cell, .interactive-li, .interactive-li-t7').forEach(el => {
                            el.classList.remove('active-cell-selected');
                        });
                        
                        const detailsContainer = document.getElementById('table-cell-details-box');
                        if (isSelected) {
                            if (detailsContainer) detailsContainer.style.display = 'none';
                        } else {
                            li.classList.add('active-cell-selected');
                            if (detailsContainer) {
                                detailsContainer.style.display = 'block';
                                detailsContainer.style.borderColor = '#0f766e';
                                detailsContainer.innerHTML = `
                                    <div style="font-size: 1.15rem; font-weight: 700; color: #0f766e; margin-bottom: 12px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                        <span>📌 ${itemText}</span>
                                    </div>
                                    <div class="cell-details-body" style="font-size: 0.98rem; line-height: 1.6; color: var(--text-primary);">
                                        ${parseMarkdown(itemHover || "")}
                                    </div>
                                `;
                            }
                        }
                    });
                    
                    ul.appendChild(li);
                });
                
                td.appendChild(ul);
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
    document.querySelectorAll('.interactive-cell, .interactive-li, .interactive-li-t7').forEach(c => c.classList.remove('active-cell-selected'));
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
