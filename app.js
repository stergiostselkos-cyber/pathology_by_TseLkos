// Application State
let questions = [];
let filteredQuestions = [];
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
const nextButtonTop = document.getElementById('next-button-top');
const prevButtonTop = document.getElementById('prev-button-top');
const themeToggleBtn = document.getElementById('theme-toggle');
const revealAnswerBtn = document.getElementById('reveal-answer-btn');

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

// Dropdowns DOM Elements
const quickChaptersDropdownBtn = document.getElementById('quick-chapters-dropdown-btn');
const quickChaptersOverlay = document.getElementById('quick-chapters-overlay');
const quickQuestionsDropdownBtn = document.getElementById('quick-questions-dropdown-btn');
const quickQuestionsOverlay = document.getElementById('quick-questions-overlay');
const quickChaptersDropdownValue = document.getElementById('quick-chapters-dropdown-value');
const quickQuestionsDropdownValue = document.getElementById('quick-questions-dropdown-value');

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadQuestions();
    setupDropdownEventListeners();
    
    // Event Listeners (both bottom and top navigation)
    const allNextBtns = [nextButton, document.getElementById('next-button-top')].filter(Boolean);
    const allPrevBtns = [prevButton, document.getElementById('prev-button-top')].filter(Boolean);
    allNextBtns.forEach(btn => btn.addEventListener('click', handleNextQuestion));
    allPrevBtns.forEach(btn => btn.addEventListener('click', handlePrevQuestion));
    restartButton.addEventListener('click', restartQuiz);
    // themeToggleBtn listener removed
    if (revealAnswerBtn) {
        revealAnswerBtn.addEventListener('click', handleRevealAnswer);
    }
});

/**
 * Theme Management
 */
function initTheme() { document.body.classList.remove('dark-theme'); document.body.classList.add('light-theme'); localStorage.setItem('theme', 'light'); }

function toggleTheme() {}

/**
 * Helper to get the correct answer index from a question object.
 * Returns either a single index or array of indices.
 */
function getCorrectAnswerIndices(question) {
    if (Array.isArray(question.correctAnswerIndices)) {
        return question.correctAnswerIndices.map(x => parseInt(x, 10));
    }
    if (typeof question.correctAnswerIndices !== 'undefined' && question.correctAnswerIndices !== null) {
        return [parseInt(question.correctAnswerIndices, 10)];
    }
    if (typeof question.correctAnswerIndex !== 'undefined' && question.correctAnswerIndex !== null) {
        return [parseInt(question.correctAnswerIndex, 10)];
    }
    if (typeof question.correct !== 'undefined' && question.correct !== null) {
        return [parseInt(question.correct, 10) - 1];
    }
    return [];
}

/**
 * Helper to determine which chapter/category a question belongs to.
 */
function getQuestionChapter(q) {
    return q.category || "Γενικά";
}

function isChapterMatch(questionCh, activeCh) {
    if (activeCh === "Όλα") return true;
    return questionCh === activeCh;
}

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
 * Helper to clean embedded options from the question title for display.
 */
function getCleanQuestionTitle(fullQuestionText) {
    let clean = fullQuestionText.replace(/\*/g, '');
    
    // Replace all literal "\\n" with real newlines first, so that we can consistently use standard whitespace/newline checks
    clean = clean.replace(/\\n/g, '\n').trim();
    
    // Find where the choices list starts (e.g. "a) ", "1. ", "a. ")
    let match = clean.match(/(?:^|\s|\n)([α-γ]|\d+)[\.\)]\s/i);
    if (match) {
        let index = clean.indexOf(match[0]);
        if (index !== -1) {
            return clean.substring(0, index).trim();
        }
    }
    
    return clean;
}

/**
 * Populate Dropdowns
 */
function populateChapterSelector() {
    if (!quickChaptersOverlay) return;
    quickChaptersOverlay.innerHTML = '';
    
    const chapterList = getChapterList(questions);
    chapterList.forEach(chapter => {
        const item = document.createElement('button');
        const isActive = (chapter === activeChapter);
        item.className = `overlay-chapter-item ${isActive ? 'active' : ''}`;
        item.textContent = chapter;
        item.addEventListener('click', () => {
            activeChapter = chapter;
            quickChaptersDropdownValue.textContent = chapter;
            quickChaptersOverlay.classList.add('hidden');
            filterQuestions();
        });
        quickChaptersOverlay.appendChild(item);
    });
}

function populateQuestionSelector() {
    if (!quickQuestionsOverlay) return;
    quickQuestionsOverlay.innerHTML = '';
    
    filteredQuestions.forEach((q, idx) => {
        const cleanQuestion = getCleanQuestionTitle(q.question);
        const shortQ = cleanQuestion.length > 60 ? cleanQuestion.substring(0, 58) + "..." : cleanQuestion;
        
        const overlayItem = document.createElement('button');
        overlayItem.className = 'overlay-question-item';
        overlayItem.setAttribute('data-index', idx);
        overlayItem.style.width = '100%';
        overlayItem.innerHTML = `
            <strong style="color: var(--primary-color); flex-shrink: 0; margin-right: 4px;">Ερ. ${idx + 1}:</strong>
            <span style="flex-grow: 1; text-align: left;">${shortQ}</span>
        `;
        overlayItem.addEventListener('click', () => {
            currentQuestionIndex = idx;
            showQuestion(idx);
            quickQuestionsOverlay.classList.add('hidden');
        });
        quickQuestionsOverlay.appendChild(overlayItem);
    });
}

function setupDropdownEventListeners() {
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
 * Load questions from local questions.js
 */
function loadQuestions() {
    try {
        if (typeof questionsData !== 'undefined' && Array.isArray(questionsData)) {
            questions = questionsData;
        } else if (typeof larnakaPart04Questions !== 'undefined' && Array.isArray(larnakaPart04Questions)) {
            questions = larnakaPart04Questions;
        } else if (typeof larnakaQuestionsPart4 !== 'undefined' && Array.isArray(larnakaQuestionsPart4)) {
            questions = larnakaQuestionsPart4;
        } else if (typeof larnakaAllQuestions !== 'undefined' && Array.isArray(larnakaAllQuestions)) {
            questions = larnakaAllQuestions;
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
            q.selectedCorrectIndices = [];
            q.isFirstAttempt = true;
        });
        
        populateChapterSelector();
        startQuiz();

        // Check if question ID requested via URL (?qId=123)
        const urlParams = new URLSearchParams(window.location.search);
        const targetQId = urlParams.get('qId') || urlParams.get('id');
        if (targetQId && questions.length > 0) {
            const foundIdx = questions.findIndex(q => String(q.id) === String(targetQId));
            if (foundIdx !== -1) {
                activeChapter = "Όλα";
                if (quickChaptersDropdownValue) quickChaptersDropdownValue.textContent = "Όλα";
                filteredQuestions = questions;
                populateQuestionSelector();
                currentQuestionIndex = foundIdx;
                showQuestion(foundIdx);
            }
        }
    } catch (error) {
        console.error("Σφάλμα κατά τη φόρτωση των ερωτήσεων:", error);
        questionText.textContent = "Αποτυχία φόρτωσης των ερωτήσεων. Βεβαιωθείτε ότι το αρχείο questions.js υπάρχει.";
    }
}

/**
 * Filter questions
 */
function filterQuestions() {
    filteredQuestions = questions.filter(q => isChapterMatch(getQuestionChapter(q), activeChapter));
    currentQuestionIndex = 0;
    populateQuestionSelector();
    showQuestion(0);
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
        q.selectedCorrectIndices = [];
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
        questionText.textContent = "Δεν βρέθηκαν ερωτήσεις για αυτό το κεφάλαιο.";
        optionsList.innerHTML = "";
        if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
        explanationPanel.classList.remove('expanded');
        explanationContent.innerHTML = "";
        prevButton.disabled = true;
        nextButton.disabled = true;
        if (progressText) progressText.textContent = "Ερώτηση 0 από 0";
        if (progressFill) progressFill.style.width = "0%";
        if (quickQuestionsDropdownValue) {
            quickQuestionsDropdownValue.textContent = "Δεν υπάρχουν ερωτήσεις";
        }
        return;
    }
    
    currentQuestionIndex = index;
    const question = filteredQuestions[index];
    
    // Update question selector dropdown display text (showing cleaned version without inline choices)
    if (quickQuestionsDropdownValue) {
        const cleanQ = getCleanQuestionTitle(question.question);
        const shortQ = cleanQ.length > 50 ? cleanQ.substring(0, 48) + "..." : cleanQ;
        quickQuestionsDropdownValue.textContent = `Ερ. ${index + 1}: ${shortQ}`;
    }
    
    // Highlights in overlays
    if (quickQuestionsOverlay) {
        const items = quickQuestionsOverlay.querySelectorAll('.overlay-question-item');
        items.forEach(item => {
            const idx = parseInt(item.getAttribute('data-index'), 10);
            if (idx === index) {
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Fallback initializations
    if (typeof question.answeredCorrectly === 'undefined') question.answeredCorrectly = false;
    if (typeof question.incorrectIndices === 'undefined') question.incorrectIndices = [];
    if (typeof question.selectedCorrectIndices === 'undefined') question.selectedCorrectIndices = [];
    if (typeof question.isFirstAttempt === 'undefined') question.isFirstAttempt = true;
    
    // Set UI elements (showing clean question on the card without inline choices)
    categoryBadge.textContent = question.category || "Παθολογική Ανατομική";
    questionText.textContent = getCleanQuestionTitle(question.question);
    
    // Navigation state (sync both bottom and top navigation bars)
    const prevButtons = [prevButton, document.getElementById('prev-button-top')].filter(Boolean);
    const nextButtons = [nextButton, document.getElementById('next-button-top')].filter(Boolean);
    
    prevButtons.forEach(btn => btn.disabled = (index === 0));
    
    const nextLabel = (index === filteredQuestions.length - 1) ? "Αποτελέσματα" : "Επόμενη";
    nextButtons.forEach(btn => {
        const span = btn.querySelector('span');
        if (span) span.textContent = nextLabel;
    });
    
    const correctIndices = getCorrectAnswerIndices(question);
    
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
            if (correctIndices.includes(i)) {
                btn.classList.add('correct');
            } else if (question.incorrectIndices.includes(i)) {
                btn.classList.add('incorrect');
            }
        } else {
            if (question.incorrectIndices.includes(i)) {
                btn.classList.add('incorrect');
                btn.disabled = true;
            } else if (question.selectedCorrectIndices.includes(i)) {
                btn.classList.add('correct');
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
        explanationPanel.classList.add('collapsed');
        explanationContent.innerHTML = "";
        if (revealAnswerBtn) revealAnswerBtn.style.display = 'flex';
    }
    
    updateProgressBar();
}

/**
 * Handle Option Clicks
 */
function handleOptionSelection(index, buttonElement) {
    const question = filteredQuestions[currentQuestionIndex];
    totalAttempts++;
    
    const correctIndices = getCorrectAnswerIndices(question);
    
    if (correctIndices.includes(index)) {
        // Correct Choice
        buttonElement.classList.add('correct');
        buttonElement.disabled = true;
        
        if (!question.selectedCorrectIndices.includes(index)) {
            question.selectedCorrectIndices.push(index);
        }
        
        // Check if all correct answers are found
        if (question.selectedCorrectIndices.length === correctIndices.length) {
            question.answeredCorrectly = true;
            
            // Increment score only if it was correct on the first attempt
            if (question.isFirstAttempt && question.incorrectIndices.length === 0) {
                score++;
            }
            
            // Disable all option buttons
            const allOptionBtns = optionsList.querySelectorAll('.option-btn');
            allOptionBtns.forEach(btn => {
                btn.disabled = true;
                const clone = btn.cloneNode(true);
                btn.parentNode.replaceChild(clone, btn);
            });
            
            // Show explanation
            revealExplanation(question.explanation);
            updateProgressBar();
        }
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
    if (!explanationText || !explanationText.trim()) {
        explanationPanel.classList.remove('expanded');
        return;
    }
    
    let mainExp = explanationText;
    let detailedTheory = "";
    
    if (explanationText.includes("### Αναλυτική Απάντηση")) {
        const parts = explanationText.split("### Αναλυτική Απάντηση");
        mainExp = parts[0];
        detailedTheory = "### Αναλυτική Απάντηση" + parts[1];
    } else if (explanationText.includes("### Αναλυτική Απάντηση")) {
        const parts = explanationText.split("### Αναλυτική Απάντηση");
        mainExp = parts[0];
        detailedTheory = "### Αναλυτική Απάντηση" + parts[1];
    }
    
    let finalHtml = '<div class="mcq-strict-answer">' + parseMarkdown(mainExp) + '</div>';
    if (detailedTheory) {
        finalHtml += '<div class="mcq-sweet-theory">' +
            '<div class="theory-icon-header">📖 Έξτρα Υλικό Μελέτης</div>' +
            '<div class="theory-content">' + parseMarkdown(detailedTheory) + '</div>' +
        '</div>';
    }
    
    try {
        explanationContent.innerHTML = injectSectionBackToTop(finalHtml);
    } catch (e) {
        console.error("Error setting explanationContent:", e);
        explanationContent.innerHTML = finalHtml;
    }
    explanationPanel.classList.remove('collapsed');
    explanationPanel.classList.add('expanded');
    
    // Smooth scroll down to explanation panel if mobile
    if (window.innerWidth < 600) {
        setTimeout(() => {
            explanationPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

/**
 * Simple Markdown to HTML parser
 */
function parseMarkdown(text) {
    if (!text) return "";
    
    // BYPASS FOR RAW HTML (WORD EXPORT)
    if (text.trim().startsWith('<div class="word-export"')) {
        return text;
    }

    
    // Normalize different escaped newline variations and strip stray backslashes
    let normalized = text.replace(/\\n/g, '\n');
    normalized = normalized.replace(/\\\n/g, '\n');
    normalized = normalized.replace(/\\/g, '');
    
    // Pre-process our custom image syntax
    normalized = normalized.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="embedded-image-container"><img src="$2" alt="$1" class="embedded-med-image" /><span class="image-caption">$1</span></div>');
    
    // Auto-format sources (Catch phrases with or without colons, brackets, case-insensitive)
    
    
    
    if (normalized.trim().startsWith('<div')) {
        return normalized; // It is already raw HTML from NotebookLM
    }
    
    if (typeof marked !== 'undefined') {

        
            // Clean bloated wordfmt spans from markdown table rows
    normalized = normalized.replace(/^\|.*\|$/gm, function(line) {
        return line.replace(/<\/?span[^>]*>/gi, '');
    });
    
    let __parsed = marked.parse(normalized, { breaks: true, gfm: true });
    return __parsed.replace(/(<div[^>]*class=["'][^"']*table-responsive-wrapper[^"']*["'][^>]*>[\s\S]*?<\/div>)|<table([\s\S]*?)<\/table>/gi, function(m, wrapped, body) {
        if (wrapped) return wrapped;
        return '<div class="table-responsive-wrapper"><table class="zoomable-table med-table"' + body + '</table></div>';
    });
    }
    
    return normalized.replace(/\n/g, '<br/>');
}

/**
 * Update Progress Bar and stats
 */
function updateProgressBar() {
    const total = filteredQuestions.length;
    const current = total > 0 ? currentQuestionIndex + 1 : 0;
    const percentage = total > 0 ? Math.round((currentQuestionIndex / total) * 100) : 0;
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `Ερώτηση ${current} από ${total}`;
    
    const answeredQuestions = filteredQuestions.filter(q => q.answeredCorrectly);
    const answeredCount = answeredQuestions.length;
    
    const liveScorePercent = answeredCount > 0 
        ? Math.round((score / answeredCount) * 100) 
        : 0;
    if (scoreText) scoreText.textContent = `Σκορ: ${liveScorePercent}%`;
}

/**
 * Handle Next Question Navigation
 */
function handleNextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
        window.scrollToQuestionTop();
    } else {
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
        window.scrollToQuestionTop();
    }
}

/**
 * End of Quiz: Display Results View
 */
function showResults() {
    quizView.classList.add('hidden');
    resultsView.classList.remove('hidden');
    
    if (progressFill) progressFill.style.width = "100%";
    if (progressText) progressText.textContent = `Ολοκληρώθηκε!`;
    
    const total = filteredQuestions.length;
    const finalPercent = total > 0 ? Math.round((score / total) * 100) : 0;
    
    finalScore.textContent = `${finalPercent}%`;
    finalCorrect.textContent = `${score} / ${total}`;
    finalAttempts.textContent = `${totalAttempts}`;
    
    let ratingText = "";
    if (finalPercent >= 90) {
        ratingText = "🏆 Αριστεία! Εξαιρετική κατάρτιση στην Παθολογική Ανατομική.";
    } else if (finalPercent >= 75) {
        ratingText = "✨ Πολλά υποσχόμενη επίδοση! Καλή κατανόηση της ύλης.";
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
    const target = document.getElementById('quiz-view') || 
                   document.getElementById('question-text') || 
                   document.getElementById('quiz-navigation-top') || 
                   document.querySelector('.question-card') || 
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

        // 1. If explanation has .section-heading or .theory-icon-header
        if (html.includes('class="section-heading"') || html.includes('class="theory-icon-header"')) {
            let count = 0;
            let modified = html.replace(/<div class="(?:section-heading|theory-icon-header)"/g, (match) => {
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
