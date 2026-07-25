// Application State
let questions = [];
let filteredQuestions = [];
let activeSubspecialty = "Όλα";
let activeChapter = "Όλα";
let currentQuestionIndex = 0;
let score = 0; // Number of questions answered correctly on the first try
let totalAttempts = 0; // Overall number of options clicked

// Greek Letter mapping for options (supports questions with up to 8 options)
const GREEK_LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'];

// DOM Elements
const quizView = document.getElementById('quiz-view');
const resultsView = document.getElementById('results-view');
const categoryBadge = document.getElementById('category-badge');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const explanationPanel = document.getElementById('explanation-panel');
const explanationContent = document.getElementById('explanation-content');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const themeToggleBtn = document.getElementById('theme-toggle');
const revealAnswerBtn = document.getElementById('reveal-answer-btn');
const quickNavPills = document.getElementById('quick-nav-pills');

// Dropdown Elements
const quizChaptersDropdownBtn = document.getElementById('quiz-chapters-dropdown-btn');
const quizChaptersOverlay = document.getElementById('quiz-chapters-overlay');
const quizQuestionsDropdownBtn = document.getElementById('quiz-questions-dropdown-btn');
const quizQuestionsOverlay = document.getElementById('quiz-questions-overlay');

// Progress Elements
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score-text');

// Results Elements
const finalScore = document.getElementById('final-score');
const finalCorrect = document.getElementById('final-correct');
const finalAttempts = document.getElementById('final-attempts');
const performanceRating = document.getElementById('performance-rating');
const restartButton = document.getElementById('restart-button');

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadQuestions();
    
    // Event Listeners
    nextButton.addEventListener('click', handleNextQuestion);
    prevButton.addEventListener('click', handlePrevQuestion);
    restartButton.addEventListener('click', restartQuiz);
    themeToggleBtn.addEventListener('click', toggleTheme);
    if (revealAnswerBtn) {
        revealAnswerBtn.addEventListener('click', handleRevealAnswer);
    }

    // Dropdowns click event handlers
    if (quizChaptersDropdownBtn && quizChaptersOverlay) {
        quizChaptersDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quizQuestionsOverlay) quizQuestionsOverlay.classList.add('hidden');
            quizChaptersOverlay.classList.toggle('hidden');
        });
    }

    if (quizQuestionsDropdownBtn && quizQuestionsOverlay) {
        quizQuestionsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (quizChaptersOverlay) quizChaptersOverlay.classList.add('hidden');
            quizQuestionsOverlay.classList.toggle('hidden');
        });
    }

    // Hide dropdown overlays if clicked outside
    document.addEventListener('click', (e) => {
        if (quizChaptersOverlay && !quizChaptersOverlay.contains(e.target) && e.target !== quizChaptersDropdownBtn && !quizChaptersDropdownBtn.contains(e.target)) {
            quizChaptersOverlay.classList.add('hidden');
        }
        if (quizQuestionsOverlay && !quizQuestionsOverlay.contains(e.target) && e.target !== quizQuestionsDropdownBtn && !quizQuestionsDropdownBtn.contains(e.target)) {
            quizQuestionsOverlay.classList.add('hidden');
        }
    });
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
        localStorage.setItem('theme', 'light');
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
 * Helper to get the correct answer index from a question object.
 * Supports both:
 * - "correctAnswerIndex" (used in Q1-49, which is 0-based: 0, 1, 2, 3)
 * - "correct" (used in Q50-66, which is 1-based: 1, 2, 3, 4, converted to 0-based here)
 */
function getCorrectAnswerIndex(question) {
    if (typeof question.correctAnswerIndex !== 'undefined' && question.correctAnswerIndex !== null) {
        return parseInt(question.correctAnswerIndex, 10); // 0-based
    }
    if (typeof question.correct !== 'undefined' && question.correct !== null) {
        return parseInt(question.correct, 10) - 1; // 1-based -> Convert to 0-based
    }
    return -1; // Fallback in case of error
}

/**
 * Helper to extract and normalize main subspecialty from category
 */
/**
 * Helper to determine which medical systems a question belongs to.
 * Maps a single question to potentially multiple systems dynamically based on keywords.
 */
function getSystemsForQuestion(q) {
    const systems = [];
    const category = (q.category || "").toLowerCase();
    const text = ((q.question || "") + " " + (q.explanation || "")).toLowerCase();
    
    const has = (str, keywords) => keywords.some(k => str.includes(k));
    
    // 1. Καρδιά
    if (has(category, ["καρδιο", "καρδια", "ηκγ", "κυκλοφορ"]) || 
        has(text, ["καρδιακ", "καρδιά", "ηκγ", "περικάρδ", "μυοκάρδ", "συγγενής καρδιοπάθεια", "τετραλογία fallot"])) {
        systems.push("Καρδιά");
    }
    
    // 2. Αναπνευστικό
    if (has(category, ["αναπνευστ", "πνευμον", "άσθμα", "βρογχ"]) ||
        has(text, ["αναπνευστ", "πνευμον", "άσθμα", "βρογχ", "συρίττον", "λαρυγγόσπασμ", "κρουπ", "εισρόφηση"])) {
        systems.push("Αναπνευστικό");
    }
    
    // 3. Νευρικό
    if (has(category, ["νευρο", "κνς", "επιληψ", "σπασμ"]) ||
        has(text, ["νευρο", "σπασμ", "επιληψ", "μηνιγγ", "εγκεφαλ", "κρανι", "οσφυονωτιαία", "αντανακλαστικά"])) {
        systems.push("Νευρικό");
    }
    
    // 4. Μυοσκελετικό
    if (has(category, ["ορθοπ", "μυοσκελ", "οστικ"]) ||
        has(text, ["ορθοπ", "κάταγμα", "κατάγματα", "άρθρωση", "μυϊκ", "σκελετ", "ισχίο", "βάδιση", "σκολίωση", "οστεομυελ", "οστεοσαρκ"])) {
        systems.push("Μυοσκελετικό");
    }
    
    // 5. Γαστρεντερικό
    if (has(category, ["γαστρ", "ηπατ", "χολ", "πυλωρ", "hirsch", "εγκολε", "κοιλια", "θηλασμ", "διατροφ"]) ||
        has(text, ["γαστρ", "έντερο", "ήπαρ", "ηπατ", "χολή", "εμετ", "διάρροια", "δυσκοιλι", "κοιλιακ", "πυλωρικ", "hirschsprung", "εγκολεασμ"])) {
        systems.push("Γαστρεντερικό");
    }
    
    // 6. Ψυχιατρική
    if (has(category, ["ψυχ", "συμπεριf", "ύπνο", "συμπεριφ"]) ||
        has(text, ["ψυχιατρ", "ψυχολογ", "κατάθλιψη", "άγχος", "αυτισμ", "δεπυ", "συμπεριφορά", "διαταραχές ύπνου", "νευρική ανορεξία", "βουλιμία"])) {
        systems.push("Ψυχιατρική");
    }
    
    // 7. Επείγουσα
    if (has(category, ["επείγ", "εντατικ", "shock", "abcde", "αεραγωγ", "τοξικ", "ανάνηψ", "υγρά", "ηλεκτρολ", "οξεοβασ"]) ||
        has(text, ["επείγον", "shock", "καταπληξία", "διασωλήν", "αναζωογόνη", "δηλητηρία", "τοξικ", "ανάνηψη", "αφυδάτωση", "υγρά ανάνηψης", "μεθ"])) {
        systems.push("Επείγουσα");
    }
    
    // 8. Λοιμώξεις
    if (has(category, ["λοιμ", "εμβολ", "μηνιγγ", "φαρυγγ", "φυματ", "εξανθημ", "torch", "ιοί", "βακτηρ", "σηψ", "ωτιτ"]) ||
        has(text, ["λοίμωξη", "λοιμώδ", "ιός", "βακτήριο", "βακτηρι", "αντιβιοτικ", "πυρετός", "πυρετού", "εμβόλ", "μηνιγγίτιδα", "σήψη", "πνευμονία", "ωτίτιδα"])) {
        systems.push("Λοιμώξεις");
    }
    
    // 9. Συγγενή νοσήματα
    if (has(category, ["γενετ", "συγγεν", "χρωμοσ", "μικροελλ", "down", "turner", "klinefelter", "μεταβολικ", "κληρονομ"]) ||
        has(text, ["συγγενής", "συγγενή", "σύνδρομο", "γενετικ", "χρωμοσώμ", "τρισωμία", "down", "turner", "klinefelter", "μεταβολικ", "κληρονομ"])) {
        systems.push("Συγγενή νοσήματα");
    }
    
    // 10. Ρευματολογικά
    if (has(category, ["ρευματ", "νια", "σελ", "αυτοφλεγ"]) ||
        has(text, ["ρευματ", "αρθρίτιδα", "λύκος", "σελ", "kawasaki", "αυτοφλεγ", "αγγειίτιδα", "henoch"])) {
        systems.push("Ρευματολογικά");
    }
    
    // 11. Αυτοάνοσα
    if (has(category, ["αυτοαν", "αυτοάνο", "ανοσο", "ρευματ", "νια", "σελ", "αλλεργ"]) ||
        has(text, ["αυτοάνοσ", "λύκος", "σελ", "αρθρίτιδα", "kawasaki", "κοιλιοκάκη", "ανοσοσφαιρ", "αλλεργ"])) {
        systems.push("Αυτοάνοσα");
    }
    
    // Fallback to Γενικά if no system fits
    if (systems.length === 0) {
        systems.push("Γενικά");
    }
    
    return systems;
}

/**
 * Load questions from local questions.js
 */
function loadQuestions() {
    try {
        if (typeof questionsData !== 'undefined' && Array.isArray(questionsData)) {
            questions = questionsData;
        } else {
            throw new Error("questionsData is not defined or is not an array");
        }
        
        if (questions.length === 0) {
            questionText.textContent = "Δεν βρέθηκαν ερωτήσεις στη βάση δεδομένων.";
            return;
        }
        
        // Reset full state
        questions.forEach(q => {
            q.answeredCorrectly = false;
            q.incorrectIndices = [];
            q.isFirstAttempt = true;
        });

        populateChaptersOverlay();
        
        startQuiz();
    } catch (error) {
        console.error("Σφάλμα κατά τη φόρτωση των ερωτήσεων:", error);
        questionText.textContent = "Αποτυχία φόρτωσης των ερωτήσεων. Βεβαιωθείτε ότι το αρχείο questions.js υπάρχει.";
    }
}

/**
 * Filter questions based on selected chapter
 */
function filterQuestions() {
    if (activeChapter === "Όλα") {
        filteredQuestions = questions;
    } else {
        filteredQuestions = questions.filter(q => {
            const ch = getQuestionChapter(q);
            return isChapterMatch(ch, activeChapter);
        });
    }
    
    currentQuestionIndex = 0;
    initQuickNav();
    populateQuestionsOverlay();
    showQuestion(0);
}

/**
 * Chapter Extraction Helpers
 */
function getQuestionChapter(q) {
    if (q.chapter) {
        return q.chapter;
    }
    if (q.category && q.category.includes("/")) {
        const parts = q.category.split("/");
        if (parts.length > 1) {
            return parts[1].trim();
        }
    }
    return q.category || "Γενικά";
}


function isChapterMatch(questionCh, activeCh) {
    if (activeCh === "Όλα") return true;
    return questionCh === activeCh;
}

function getChapterNumber(chapterStr) {
    if (!chapterStr) return 999;
    const match = chapterStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999;
}

function getChapterList(questions) {
    const presentChapters = new Set();
    questions.forEach(q => {
        const ch = getQuestionChapter(q);
        if (ch) {
            presentChapters.add(ch);
        }
    });

    const uniqueList = Array.from(presentChapters).sort((a, b) => {
        const numA = getChapterNumber(a);
        const numB = getChapterNumber(b);
        if (numA !== numB) {
            return numA - numB;
        }
        return a.localeCompare(b, 'el');
    });
    return ["Όλα", ...uniqueList];
}

function populateChaptersOverlay() {
    if (!quizChaptersOverlay) return;
    quizChaptersOverlay.innerHTML = '';
    const chapterList = getChapterList(questions);
    
    chapterList.forEach(chapter => {
        const item = document.createElement('button');
        const isActive = (chapter === activeChapter);
        item.className = `overlay-chapter-item ${isActive ? 'active' : ''}`;
        item.textContent = chapter;
        
        item.addEventListener('click', () => {
            handleChapterSelect(chapter);
        });
        quizChaptersOverlay.appendChild(item);
    });
}

function populateQuestionsOverlay() {
    if (!quizQuestionsOverlay) return;
    quizQuestionsOverlay.innerHTML = '';
    
    filteredQuestions.forEach((q, idx) => {
        const cleanQuestion = q.question.replace(/\*/g, '').trim();
        const item = document.createElement('button');
        const isActive = (idx === currentQuestionIndex);
        item.className = `overlay-question-item ${isActive ? 'active' : ''}`;
        item.setAttribute('data-index', idx);
        item.style.width = '100%';
        item.innerHTML = `
            <strong style="color: #2563eb; flex-shrink: 0; margin-right: 4px;">Ερ. ${idx + 1}:</strong>
            <span style="flex-grow: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cleanQuestion}</span>
        `;
        item.addEventListener('click', () => {
            currentQuestionIndex = idx;
            showQuestion(idx);
            quizQuestionsOverlay.classList.add('hidden');
        });
        quizQuestionsOverlay.appendChild(item);
    });
}

function handleChapterSelect(chapter) {
    activeChapter = chapter;
    const chaptersVal = document.getElementById('quiz-chapters-dropdown-value');
    if (chaptersVal) {
        chaptersVal.textContent = chapter;
    }
    if (quizChaptersOverlay) {
        quizChaptersOverlay.classList.add('hidden');
        // Highlight active chapter in overlay
        const items = quizChaptersOverlay.querySelectorAll('.overlay-chapter-item');
        items.forEach(item => {
            if (item.textContent === chapter) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    filterQuestions();
}


/**
 * Start/Restart Quiz state
 */
function startQuiz() {
    // Reset scores & attempts
    score = 0;
    totalAttempts = 0;
    
    // Reset individual progress state for all questions
    questions.forEach(q => {
        q.answeredCorrectly = false;
        q.incorrectIndices = [];
        q.isFirstAttempt = true;
    });
    
    // Apply filters
    filterQuestions();
    
    quizView.classList.remove('hidden');
    resultsView.classList.add('hidden');
}

/**
 * Display Question at index
 */
function showQuestion(index) {
    if (filteredQuestions.length === 0) {
        questionText.textContent = "Δεν βρέθηκαν ερωτήσεις για αυτή την ειδικότητα.";
        optionsList.innerHTML = "";
        if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
        explanationPanel.classList.remove('expanded');
        explanationContent.innerHTML = "";
        prevButton.disabled = true;
        nextButton.disabled = true;
        progressText.textContent = "Ερώτηση 0 από 0";
        progressFill.style.width = "0%";
        return;
    }
    const question = filteredQuestions[index];
    
    // Fallback initializations
    if (typeof question.answeredCorrectly === 'undefined') question.answeredCorrectly = false;
    if (typeof question.incorrectIndices === 'undefined') question.incorrectIndices = [];
    if (typeof question.isFirstAttempt === 'undefined') question.isFirstAttempt = true;
    
    // Set UI elements
    categoryBadge.textContent = question.category || "Παιδιατρική";
    questionText.innerHTML = parseMarkdown(question.question);

    // Also update the large button text showing active question
    const qDisplay = document.getElementById('quiz-questions-dropdown-value');
    if (qDisplay) {
        const cleanQuestion = question.question.replace(/\*/g, '').trim();
        qDisplay.textContent = `Ερ. ${index + 1}: ${cleanQuestion}`;
    }

    if (quizQuestionsOverlay) {
        const items = quizQuestionsOverlay.querySelectorAll('.overlay-question-item');
        items.forEach(item => item.classList.remove('active'));
        const activeItem = quizQuestionsOverlay.querySelector(`.overlay-question-item[data-index="${index}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            // Try to scroll the active item into view inside the dropdown scroll area
            try {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } catch (e) {}
        }
    }
    
    // Navigation state
    prevButton.disabled = (index === 0);
    
    // Change Next button text on the last question to reflect completion
    const nextSpan = nextButton.querySelector('span');
    if (index === filteredQuestions.length - 1) {
        nextSpan.textContent = "Αποτελέσματα";
    } else {
        nextSpan.textContent = "Επόμενη";
    }
    
    const correctIdx = getCorrectAnswerIndex(question);
    
    // Clear and render options
    optionsList.innerHTML = "";
    question.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('data-index', i);
        
        // Option structure: Badge with Letter + Option Text
        btn.innerHTML = `
            <div class="option-badge">${GREEK_LETTERS[i]}</div>
            <div class="option-text">${option}</div>
        `;
        
        // Determine button state based on historical attempts
        if (question.answeredCorrectly) {
            btn.disabled = true;
            if (i === correctIdx) {
                btn.classList.add('correct');
            } else if (question.incorrectIndices.includes(i)) {
                btn.classList.add('incorrect');
            }
        } else {
            if (question.incorrectIndices.includes(i)) {
                btn.classList.add('incorrect');
                btn.disabled = true;
            } else {
                btn.addEventListener('click', () => handleOptionSelection(i, btn));
            }
        }
        
        optionsList.appendChild(btn);
    });
    
    // Toggle explanation display
    if (question.answeredCorrectly) {
        revealExplanation(question.explanation);
        if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
    } else {
        explanationPanel.classList.remove('expanded');
        explanationContent.innerHTML = "";
        if (revealAnswerBtn) revealAnswerBtn.style.display = 'flex';
    }
    
    updateProgressBar();
    updateQuickNavHighlight();
}

/**
 * Handle Option Clicks
 */
function handleOptionSelection(index, buttonElement) {
    const question = filteredQuestions[currentQuestionIndex];
    totalAttempts++;
    
    const correctIdx = getCorrectAnswerIndex(question);
    
    // Check if correct
    if (index === correctIdx) {
        // Correct Choice
        question.answeredCorrectly = true;
        buttonElement.classList.add('correct');
        
        // Increment score only if it was correct on the first attempt
        if (question.isFirstAttempt) {
            score++;
        }
        
        // Disable all option buttons (and recreate nodes to strip listeners)
        const allOptionBtns = optionsList.querySelectorAll('.option-btn');
        allOptionBtns.forEach(btn => {
            btn.disabled = true;
            // Clone node to clean events
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
        });
        
        // Show explanation
        revealExplanation(question.explanation);
        
        updateProgressBar();
    } else {
        // Incorrect Choice
        question.isFirstAttempt = false;
        if (!question.incorrectIndices.includes(index)) {
            question.incorrectIndices.push(index);
        }
        
        // Mark button as incorrect and disable it
        buttonElement.classList.add('incorrect');
        buttonElement.disabled = true;
        
        // Add shake animation
        buttonElement.classList.add('shake');
        buttonElement.addEventListener('animationend', () => {
            buttonElement.classList.remove('shake');
        });
    }
}

/**
 * Handle Reveal Answer Click
 */
function handleRevealAnswer() {
    const question = filteredQuestions[currentQuestionIndex];
    question.answeredCorrectly = true;
    question.isFirstAttempt = false;
    
    // Refresh current question display to apply correct states
    showQuestion(currentQuestionIndex);
}

/**
 * Reveal explanation panel and parse markdown
 */
function revealExplanation(explanationText) {
    const parsedHtml = parseMarkdown(explanationText);
    explanationContent.innerHTML = parsedHtml;
    explanationPanel.classList.add('expanded');
    
    // Smooth scroll down to explanation panel if mobile
    if (window.innerWidth < 600) {
        setTimeout(() => {
            explanationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

function parseMarkdown(text) {
    if (!text) return "";
    
    let processedText = convertListTablesToHTML(text);
    
    // Extract HTML tables (case-insensitive, matching across multiple lines)
    const htmlTablePlaceholders = [];
    
    processedText = processedText.replace(/<table[\s\S]*?<\/table>/gi, (match) => {
        let tableWithClass = match;
        if (!/class=["'][^"']*med-table[^"']*["']/i.test(tableWithClass)) {
            tableWithClass = tableWithClass.replace(/<table/i, '<table class="med-table"');
        }
        tableWithClass = `<div class="table-responsive">${tableWithClass}</div>`;
        const placeholder = `__HTML_TABLE_PLACEHOLDER_${htmlTablePlaceholders.length}__`;
        htmlTablePlaceholders.push(tableWithClass);
        return placeholder;
    });
    
    // Normalize different escaped newline variations and strip stray backslashes
    let normalized = processedText.replace(/\\n/g, '\n');
    normalized = normalized.replace(/\\\n/g, '\n');
    normalized = normalized.replace(/\\/g, '');
    
    // Extract Markdown tables
    const mdTablePlaceholders = [];
    const linesForTableCheck = normalized.split('\n');
    let newLines = [];
    let currentTableLines = null;
    
    for (let i = 0; i < linesForTableCheck.length; i++) {
        let line = linesForTableCheck[i].trim();
        if (line.startsWith('|')) {
            if (currentTableLines === null) {
                currentTableLines = [];
            }
            currentTableLines.push(line);
        } else {
            if (currentTableLines !== null) {
                const htmlTable = parseMarkdownTable(currentTableLines);
                const placeholder = `__MD_TABLE_PLACEHOLDER_${mdTablePlaceholders.length}__`;
                mdTablePlaceholders.push(htmlTable);
                newLines.push(placeholder);
                currentTableLines = null;
            }
            newLines.push(linesForTableCheck[i]);
        }
    }
    if (currentTableLines !== null) {
        const htmlTable = parseMarkdownTable(currentTableLines);
        const placeholder = `__MD_TABLE_PLACEHOLDER_${mdTablePlaceholders.length}__`;
        mdTablePlaceholders.push(htmlTable);
        newLines.push(placeholder);
    }
    
    const lines = newLines;
    let html = "";
    let inList = false;
    let inOrderedList = false;
    
    // Regex for list matching (ASCII-safe unicode escapes for Greek characters)
    const orderedListRegex = /^(?:(?:\*\*(\d+|\w|[\u0370-\u03ff])\.\*\*)|(?:(\d+|\w|[\u0370-\u03ff])\.))\s+/;
    const unorderedListRegex = /^(?:[-*\u2022]|\*\*(?:[-*\u2022])\*\*)\s+/;
    
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
        
        // Check if line is a placeholder
        if (line.startsWith("__HTML_TABLE_PLACEHOLDER_") || line.startsWith("__MD_TABLE_PLACEHOLDER_")) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            html += line + "\n";
            continue;
        }
        
        // Heading ###
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
            html += `<h3>${parseInlineMarkdown(headerText)}</h3>`;
        }
        // Unordered lists
        else if (unorderedListRegex.test(line)) {
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            if (!inList) {
                html += "<ul>";
                inList = true;
            }
            const liText = line.replace(unorderedListRegex, '').trim();
            html += `<li>${parseInlineMarkdown(liText)}</li>`;
        }
        // Ordered lists
        else if (orderedListRegex.test(line)) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (!inOrderedList) {
                html += "<ol>";
                inOrderedList = true;
            }
            const liText = line.replace(orderedListRegex, '').trim();
            html += `<li>${parseInlineMarkdown(liText)}</li>`;
        }
        // Standard paragraphs
        else {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            html += `<p>${parseInlineMarkdown(line)}</p>`;
        }
    }
    
    if (inList) {
        html += "</ul>";
    }
    if (inOrderedList) {
        html += "</ol>";
    }
    
    // Restore placeholders
    for (let j = 0; j < htmlTablePlaceholders.length; j++) {
        const placeholder = `__HTML_TABLE_PLACEHOLDER_${j}__`;
        html = html.replace(placeholder, htmlTablePlaceholders[j]);
    }
    for (let j = 0; j < mdTablePlaceholders.length; j++) {
        const placeholder = `__MD_TABLE_PLACEHOLDER_${j}__`;
        html = html.replace(placeholder, mdTablePlaceholders[j]);
    }
    
    return html;
}

function parseMarkdownTable(tableLines) {
    if (tableLines.length === 0) return "";
    
    let html = '<div class="table-responsive"><table class="med-table"><thead>';
    let hasHeader = false;
    let inBody = false;
    
    for (let i = 0; i < tableLines.length; i++) {
        const line = tableLines[i].trim();
        let cleanLine = line;
        if (cleanLine.startsWith('|')) cleanLine = cleanLine.substring(1);
        if (cleanLine.endsWith('|')) cleanLine = cleanLine.substring(0, cleanLine.length - 1);
        
        const cells = cleanLine.split('|').map(c => c.trim());
        const isSeparator = cells.every(cell => /^:?-+:?$/.test(cell));
        if (isSeparator) {
            continue;
        }
        
        if (!hasHeader) {
            html += '<tr>';
            for (const cell of cells) {
                html += `<th>${parseInlineMarkdown(cell)}</th>`;
            }
            html += '</tr></thead><tbody>';
            hasHeader = true;
            inBody = true;
        } else {
            html += '<tr>';
            for (const cell of cells) {
                html += `<td>${parseInlineMarkdown(cell)}</td>`;
            }
            html += '</tr>';
        }
    }
    
    if (inBody) {
        html += '</tbody>';
    }
    html += '</table></div>';
    return html;
}

function parseInlineMarkdown(text) {
    if (!text) return "";
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="embedded-image-container"><img src="$2" alt="$1" class="embedded-med-image" onclick="window.open(this.src, \'_blank\')" /><span class="image-caption">$1</span></div>');
    return formatted;
}

/**
 * Update Progress Bar and stats
 */
function updateProgressBar() {
    const total = filteredQuestions.length;
    const current = currentQuestionIndex + 1;
    // Calculate percentage based on answered questions
    const percentage = total > 0 ? Math.round((currentQuestionIndex / total) * 100) : 0;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Ερώτηση ${current} από ${total}`;
    
    // Live score based on answered questions so far
    const answeredQuestions = filteredQuestions.filter(q => q.answeredCorrectly);
    const answeredCount = answeredQuestions.length;
    
    // Calculate score based on first-attempt correct answers out of the answered ones
    const liveScorePercent = answeredCount > 0 
        ? Math.round((score / answeredCount) * 100) 
        : 0;
    scoreText.textContent = `Σκορ: ${liveScorePercent}%`;
}

/**
 * Handle Next Question Navigation
 */
function handleNextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // End of Quiz, show results
        showResults();
    }
}

/**
 * Handle Previous Question Navigation
 */
function handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

/**
 * End of Quiz: Display Results View
 */
function showResults() {
    quizView.classList.add('hidden');
    resultsView.classList.remove('hidden');
    
    progressFill.style.width = "100%";
    progressText.textContent = `Ολοκληρώθηκε!`;
    
    const total = filteredQuestions.length;
    const finalPercent = total > 0 ? Math.round((score / total) * 100) : 0;
    
    finalScore.textContent = `${finalPercent}%`;
    finalCorrect.textContent = `${score} / ${total}`;
    finalAttempts.textContent = `${totalAttempts}`;
    
    // Performance Rating Banner
    let ratingText = "";
    if (finalPercent >= 90) {
        ratingText = "🏆 Αριστεία! Εξαιρετική κατάρτιση στην Παιδιατρική.";
    } else if (finalPercent >= 75) {
        ratingText = "✨ Πολύ καλή επίδοση! Καλή κατανόηση της ύλης.";
    } else if (finalPercent >= 50) {
        ratingText = "📚 Ικανοποιητική προσπάθεια. Χρειάζεται περισσότερη μελέτη της θεωρίας.";
    } else {
        ratingText = "⚠️ Χρειάζεται επανάληψη. Μελετήστε ξανά τις αναλύσεις των ερωτήσεων.";
    }
    performanceRating.textContent = ratingText;
    
    scoreText.textContent = `Σκορ: ${finalPercent}%`;
}

/**
 * Restart Quiz
 */
function restartQuiz() {
    startQuiz();
}

/**
 * Initialize Quick Navigation Jump Buttons
 */
function initQuickNav() {
    if (!quickNavPills) return;
    quickNavPills.innerHTML = "";
    
    const total = filteredQuestions.length;
    if (total === 0) return;
    
    // Create targets for Question 1, and every multiple of 50
    const indices = [0];
    for (let qNum = 50; qNum < total; qNum += 50) {
        indices.push(qNum - 1);
    }
    
    indices.forEach(idx => {
        const btn = document.createElement('button');
        btn.className = 'quick-nav-btn';
        btn.setAttribute('data-target-index', idx);
        btn.textContent = idx === 0 ? "1" : (idx + 1).toString();
        
        btn.addEventListener('click', () => {
            currentQuestionIndex = idx;
            showQuestion(currentQuestionIndex);
        });
        
        quickNavPills.appendChild(btn);
    });
}

/**
 * Update Quick Navigation Pill Highlights
 */
function updateQuickNavHighlight() {
    if (!quickNavPills) return;
    const btns = quickNavPills.querySelectorAll('.quick-nav-btn');
    if (btns.length === 0) return;
    
    btns.forEach(btn => btn.classList.remove('active'));
    
    const total = filteredQuestions.length;
    if (total === 0) return;
    
    const indices = [0];
    for (let qNum = 50; qNum < total; qNum += 50) {
        indices.push(qNum - 1);
    }
    
    let activeIdx = 0;
    for (let i = 0; i < indices.length; i++) {
        if (indices[i] <= currentQuestionIndex) {
            activeIdx = indices[i];
        } else {
            break;
        }
    }
    
    const activeBtn = Array.from(btns).find(btn => parseInt(btn.getAttribute('data-target-index'), 10) === activeIdx);
    if (activeBtn) {
        activeBtn.classList.add('active');
        // Smoothly scroll the active pill into view horizontally
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}


function convertListTablesToHTML(text) {
    if (!text) return "";
    
    let lines = text.split('\n');
    let outputLines = [];
    let inTable = false;
    let tableLines = [];
    let tableHeader = "";
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Check if line indicates start of a table
        let isTableHeaderLine = /📋|Πίνακας/i.test(line) && line.endsWith(':');
        
        if (isTableHeaderLine) {
            if (inTable) {
                outputLines.push(renderCustomTable(tableHeader, tableLines));
                tableLines = [];
            }
            inTable = true;
            tableHeader = line;
            continue;
        }
        
        if (inTable) {
            let isRow = /^(?:[-*\u2022]|\*\*(?:[-*\u2022])\*\*)\s+/.test(line) && (line.includes('→') || line.includes('\u2192') || line.includes(':'));
            let isSectionHeader = line.startsWith('**') && line.endsWith(':**');
            
            if (isRow || isSectionHeader || line === "" || line === "---") {
                if (line !== "" && line !== "---") {
                    tableLines.push(line);
                }
            } else {
                outputLines.push(renderCustomTable(tableHeader, tableLines));
                inTable = false;
                tableLines = [];
                outputLines.push(lines[i]);
            }
        } else {
            outputLines.push(lines[i]);
        }
    }
    
    if (inTable) {
        outputLines.push(renderCustomTable(tableHeader, tableLines));
    }
    
    return outputLines.join('\n');
}

function renderCustomTable(header, lines) {
    if (lines.length === 0) {
        return header;
    }
    
    let cleanHeader = header.replace(/^[📋\s*]+/, '').replace(/\*\*+/g, '').replace(/:$/, '').trim();
    let html = `<div class="table-title">📋 ${cleanHeader}</div>`;
    html += `<div class="table-responsive"><table class="med-table"><tbody>`;
    
    for (let line of lines) {
        let trimmed = line.trim();
        if (trimmed.startsWith('**') && trimmed.endsWith(':**')) {
            let secTitle = trimmed.replace(/\*\*+/g, '').replace(/:$/, '').trim();
            html += `<tr class="table-section-row"><td colspan="3" style="font-weight: bold; background: rgba(99, 102, 241, 0.04) !important; color: var(--primary-color) !important;">${secTitle}</td></tr>`;
        } else {
            let cleanLine = trimmed.replace(/^(?:[-*\u2022]|\*\*(?:[-*\u2022])\*\*)\s+/, '').trim();
            let parts = cleanLine.split(/\u2192|→/);
            if (parts.length >= 2) {
                let col1 = parts[0].trim();
                let col2 = parts.slice(1).join('→').trim();
                
                let col1Parts = col1.split(':');
                if (col1Parts.length >= 2 && !col1.includes('(') && col1Parts[0].trim().length < 30) {
                    let key = col1Parts[0].trim();
                    let val1 = col1Parts.slice(1).join(':').trim();
                    html += `<tr><td style="font-weight: bold; width: 25%;">${parseInlineMarkdown(key)}</td><td style="width: 35%;">${parseInlineMarkdown(val1)}</td><td style="width: 40%;">${parseInlineMarkdown(col2)}</td></tr>`;
                } else {
                    html += `<tr><td style="font-weight: bold; width: 40%;">${parseInlineMarkdown(col1)}</td><td colspan="2">${parseInlineMarkdown(col2)}</td></tr>`;
                }
            } else {
                html += `<tr><td colspan="3">${parseInlineMarkdown(cleanLine)}</td></tr>`;
            }
        }
    }
    html += `</tbody></table></div>`;
    return html;
}

