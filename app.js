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
    
    // Event Listeners
    nextButton.addEventListener('click', handleNextQuestion);
    prevButton.addEventListener('click', handlePrevQuestion);
    restartButton.addEventListener('click', restartQuiz);
    themeToggleBtn.addEventListener('click', toggleTheme);
    if (revealAnswerBtn) {
        revealAnswerBtn.addEventListener('click', handleRevealAnswer);
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
        localStorage.setItem('theme', 'dark');
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
 * Returns either a single index or array of indices.
 */
function getCorrectAnswerIndices(question) {
    if (Array.isArray(question.correctAnswerIndices)) {
        return question.correctAnswerIndices.map(x => parseInt(x, 10));
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
        presentChapters.add(getQuestionChapter(q));
    });
    
    // Sort chapters to place "Γενικά" at the end if present
    const list = Array.from(presentChapters).sort((a, b) => {
        if (a === "Γενικά") return 1;
        if (b === "Γενικά") return -1;
        return a.localeCompare(b, 'el');
    });
    
    return ["Όλα", ...list];
}

/**
 * Helper to clean embedded options from the question title for display.
 */
function getCleanQuestionTitle(fullQuestionText) {
    let clean = fullQuestionText.replace(/\*/g, '');
    
    // Replace all literal "\\n" with real newlines first, so that we can consistently use standard whitespace/newline checks
    clean = clean.replace(/\\n/g, '\n').trim();
    
    // Find where the choices list starts (e.g. "a) ", "1. ", "a. ")
    let match = clean.match(/(?:^|\s|\n)([a-gΑ-Ω]|\d+)[\.\)]\s/i);
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
            <strong style="color: #d946ef; flex-shrink: 0; margin-right: 4px;">Ερ. ${idx + 1}:</strong>
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
        progressText.textContent = "Ερώτηση 0 από 0";
        progressFill.style.width = "0%";
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
    
    // Navigation state
    prevButton.disabled = (index === 0);
    
    // Change Next button text on the last question to reflect completion
    const nextSpan = nextButton.querySelector('span');
    if (index === filteredQuestions.length - 1) {
        nextSpan.textContent = "Αποτελέσματα";
    } else {
        nextSpan.textContent = "Επόμενη";
    }
    
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
            html += `<h3>${headerText}</h3>`;
        }
        // Unordered list items
        else if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•") || line.startsWith("\u2022")) {
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            if (!inList) {
                html += "<ul>";
                inList = true;
            }
            const liText = line.replace(/^[-*•\u2022]\s*/, '').trim();
            html += `<li>${liText}</li>`;
        }
        // Ordered list items
        else if (/^\d+\.\s+/.test(line)) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (!inOrderedList) {
                html += "<ol>";
                inOrderedList = true;
            }
            const liText = line.replace(/^\d+\.\s+/, '').trim();
            html += `<li>${liText}</li>`;
        }
        // Standard Paragraphs
        else {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (inOrderedList) {
                html += "</ol>";
                inOrderedList = false;
            }
            html += `<p>${line}</p>`;
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

/**
 * Update Progress Bar and stats
 */
function updateProgressBar() {
    const total = filteredQuestions.length;
    const current = total > 0 ? currentQuestionIndex + 1 : 0;
    const percentage = total > 0 ? Math.round((currentQuestionIndex / total) * 100) : 0;
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Ερώτηση ${current} από ${total}`;
    
    const answeredQuestions = filteredQuestions.filter(q => q.answeredCorrectly);
    const answeredCount = answeredQuestions.length;
    
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
