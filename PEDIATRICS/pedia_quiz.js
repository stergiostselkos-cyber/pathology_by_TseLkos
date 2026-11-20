/**
 * ==========================================================================
 * PEDIATRIC MCQs (609) QUIZ APP - INTERACTIVE ENGINE
 * Author: TseLkos Medical Portals
 * Dataset: window.pediatricsQuestionsData (609 questions)
 * Theme: Warm Amber Gold Palette
 * ==========================================================================
 */

(function () {
  'use strict';

  const GREEK_LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'];

  // Global State
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;

  let activeFilter = 'all'; // 'all' | 'explanation' | 'starred' | 'mistakes'
  let activeChapter = 'all';
  let activeBatch = 'all';   // 'all' | '1-50' | '51-100' ...
  let searchQuery = '';

  let userAnswers = {};      // { [id]: { selected: [indices], isCorrect: bool, attempts: int } }
  let starredSet = new Set();
  let mistakesSet = new Set();
  let firstTryCorrectSet = new Set();

  const STORAGE_KEY_STATE = 'tselkos_pedia_mcq609_state_v1';
  const STORAGE_KEY_STARRED = 'tselkos_pedia_mcq609_starred_v1';
  const STORAGE_KEY_MISTAKES = 'tselkos_pedia_mcq609_mistakes_v1';
  const STORAGE_KEY_THEME = 'tselkos_pedia_theme_preference';

  // DOM Elements cache
  let dom = {};

  function initDOM() {
    dom = {
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      searchInput: document.getElementById('search-input'),
      clearSearchBtn: document.getElementById('clear-search-btn'),
      chapterSelector: document.getElementById('chapter-selector'),
      batchSelector: document.getElementById('batch-selector'),
      jumpInput: document.getElementById('jump-input'),
      randomBtn: document.getElementById('random-btn'),
      
      filterPills: document.querySelectorAll('.filter-pill'),
      countAll: document.getElementById('count-all'),
      countExpl: document.getElementById('count-expl'),
      countStarred: document.getElementById('count-starred'),
      countMistakes: document.getElementById('count-mistakes'),

      statsCurrent: document.getElementById('stats-current'),
      statsTotal: document.getElementById('stats-total'),
      statsCategory: document.getElementById('stats-category'),

      questionCard: document.getElementById('question-card'),
      questionSeqBadge: document.getElementById('question-seq-badge'),
      starBtn: document.getElementById('star-btn'),
      questionText: document.getElementById('question-text'),
      optionsContainer: document.getElementById('options-container'),

      explanationCard: document.getElementById('explanation-card'),
      explanationAnswerPill: document.getElementById('explanation-answer-pill'),
      explanationBody: document.getElementById('explanation-body'),

      btnReveal: document.getElementById('btn-reveal'),
      btnReset: document.getElementById('btn-reset'),
      btnPrev: document.getElementById('btn-prev'),
      btnNext: document.getElementById('btn-next'),

      resultsModal: document.getElementById('results-modal'),
      modalScoreVal: document.getElementById('modal-score-val'),
      modalScoreDesc: document.getElementById('modal-score-desc'),
      modalReviewMistakesBtn: document.getElementById('modal-review-mistakes-btn'),
      modalCloseBtn: document.getElementById('modal-close-btn')
    };
  }

  function loadState() {
    try {
      const savedStarred = localStorage.getItem(STORAGE_KEY_STARRED);
      if (savedStarred) starredSet = new Set(JSON.parse(savedStarred));

      const savedMistakes = localStorage.getItem(STORAGE_KEY_MISTAKES);
      if (savedMistakes) mistakesSet = new Set(JSON.parse(savedMistakes));

      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        userAnswers = parsed.userAnswers || {};
        firstTryCorrectSet = new Set(parsed.firstTryCorrect || []);
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify([...starredSet]));
      localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify([...mistakesSet]));
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify({
        userAnswers,
        firstTryCorrect: [...firstTryCorrectSet]
      }));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  function initTheme() {
    document.body.classList.remove('dark-theme');
    document.body.classList.remove('light-theme');
    try {
      localStorage.removeItem(STORAGE_KEY_THEME);
    } catch (e) {}
  }

  function toggleTheme() {
    // Permanent bright light theme
  }

  function populateChapters() {
    if (!dom.chapterSelector) return;
    const chaptersSet = new Set();
    allQuestions.forEach(q => {
      let cat = q.category || 'Γενική Παιδιατρική';
      if (cat.includes('/')) {
        const parts = cat.split('/');
        cat = parts[1] ? parts[1].trim() : cat;
      }
      chaptersSet.add(cat);
    });

    const sortedChapters = Array.from(chaptersSet).sort((a, b) => {
      const numA = parseInt(a, 10) || 999;
      const numB = parseInt(b, 10) || 999;
      return numA - numB;
    });

    dom.chapterSelector.innerHTML = '<option value="all">Όλα τα Κεφάλαια</option>';
    sortedChapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = ch;
      dom.chapterSelector.appendChild(opt);
    });
  }

  function populateBatches() {
    if (!dom.batchSelector) return;
    const total = allQuestions.length;
    const batchSize = 50;
    const numBatches = Math.ceil(total / batchSize);

    dom.batchSelector.innerHTML = `<option value="all">Όλες οι ερωτήσεις (1 - ${total})</option>`;
    for (let i = 0; i < numBatches; i++) {
      const start = i * batchSize + 1;
      const end = Math.min((i + 1) * batchSize, total);
      const opt = document.createElement('option');
      opt.value = `${start}-${end}`;
      opt.textContent = `Ερωτήσεις ${start} - ${end}`;
      dom.batchSelector.appendChild(opt);
    }
  }

  function applyFilters() {
    let result = allQuestions;

    // 1. Chapter filter
    if (activeChapter !== 'all') {
      result = result.filter(q => {
        let cat = q.category || '';
        return cat.includes(activeChapter);
      });
    }

    // 2. Batch filter
    if (activeBatch !== 'all') {
      const [startStr, endStr] = activeBatch.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      result = result.filter((_, idx) => {
        const qNum = idx + 1;
        return qNum >= start && qNum <= end;
      });
    }

    // 3. Pill filter
    if (activeFilter === 'explanation') {
      result = result.filter(q => q.explanation && q.explanation.trim().length > 0);
    } else if (activeFilter === 'starred') {
      result = result.filter(q => starredSet.has(q.id));
    } else if (activeFilter === 'mistakes') {
      result = result.filter(q => mistakesSet.has(q.id));
    }

    // 4. Live Search
    if (searchQuery.trim().length > 0) {
      const qLower = searchQuery.toLowerCase().trim();
      result = result.filter(q => {
        const text = (q.question || '').toLowerCase();
        const cat = (q.category || '').toLowerCase();
        const exp = (q.explanation || '').toLowerCase();
        const opts = (q.options || []).join(' ').toLowerCase();
        const idStr = String(q.id);
        return text.includes(qLower) || cat.includes(qLower) || exp.includes(qLower) || opts.includes(qLower) || idStr === qLower;
      });
    }

    filteredQuestions = result;
    currentIndex = 0;

    updateCounts();
    renderCurrentQuestion();
  }

  function updateCounts() {
    if (dom.countAll) dom.countAll.textContent = allQuestions.length;
    if (dom.countExpl) {
      const explCount = allQuestions.filter(q => q.explanation && q.explanation.trim().length > 0).length;
      dom.countExpl.textContent = explCount;
    }
    if (dom.countStarred) dom.countStarred.textContent = starredSet.size;
    if (dom.countMistakes) dom.countMistakes.textContent = mistakesSet.size;

    if (dom.statsTotal) dom.statsTotal.textContent = filteredQuestions.length;
  }

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function renderCurrentQuestion() {
    if (filteredQuestions.length === 0) {
      dom.questionSeqBadge.textContent = '0 / 0';
      dom.questionText.innerHTML = '<div style="color:var(--text-muted);padding:30px 0;text-align:center;">Δεν βρέθηκαν ερωτήσεις με τα επιλεγμένα φίλτρα.</div>';
      dom.optionsContainer.innerHTML = '';
      dom.explanationCard.classList.remove('active');
      dom.statsCurrent.textContent = '0';
      dom.btnPrev.disabled = true;
      dom.btnNext.disabled = true;
      return;
    }

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= filteredQuestions.length) currentIndex = filteredQuestions.length - 1;

    const q = filteredQuestions[currentIndex];
    const qId = q.id;

    // Header & Badges
    dom.questionSeqBadge.textContent = `Ερώτηση #${q.id} (${currentIndex + 1} από ${filteredQuestions.length})`;
    dom.statsCurrent.textContent = currentIndex + 1;
    dom.statsTotal.textContent = filteredQuestions.length;

    let catShort = q.category || 'Παιδιατρική';
    if (catShort.includes('/')) {
      const parts = catShort.split('/');
      catShort = parts[1] ? parts[1].trim() : catShort;
    }
    dom.statsCategory.innerHTML = `<i class="fa-solid fa-folder-open"></i> ${escapeHtml(catShort)}`;

    // Star icon
    if (starredSet.has(qId)) {
      dom.starBtn.classList.add('starred');
      dom.starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
      dom.starBtn.title = 'Αφαίρεση από τα αγαπημένα (S)';
    } else {
      dom.starBtn.classList.remove('starred');
      dom.starBtn.innerHTML = '<i class="fa-regular fa-star"></i>';
      dom.starBtn.title = 'Προσθήκη στα αγαπημένα (S)';
    }

    // Question Text
    dom.questionText.innerHTML = escapeHtml(q.question);

    // Options
    dom.optionsContainer.innerHTML = '';
    const state = userAnswers[qId] || { selected: [], isCorrect: false, attempts: 0 };
    const correctIdx = q.correctAnswerIndex;

    (q.options || []).forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('data-index', idx);

      const letter = GREEK_LETTERS[idx] || String.fromCharCode(65 + idx);

      btn.innerHTML = `
        <span class="option-letter">${letter}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
      `;

      if (state.selected.includes(idx)) {
        if (idx === correctIdx) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }
      }

      btn.addEventListener('click', () => handleOptionClick(idx));
      dom.optionsContainer.appendChild(btn);
    });

    // Explanation panel
    renderExplanation(q, state.isCorrect);

    // Navigation buttons
    dom.btnPrev.disabled = (currentIndex === 0);
    dom.btnNext.disabled = (currentIndex === filteredQuestions.length - 1);
  }

  function handleOptionClick(selectedIdx) {
    const q = filteredQuestions[currentIndex];
    const qId = q.id;
    const correctIdx = q.correctAnswerIndex;

    if (!userAnswers[qId]) {
      userAnswers[qId] = { selected: [], isCorrect: false, attempts: 0 };
    }
    const state = userAnswers[qId];

    if (!state.selected.includes(selectedIdx)) {
      state.selected.push(selectedIdx);
      state.attempts += 1;
    }

    const isCorrect = (selectedIdx === correctIdx);
    if (isCorrect) {
      state.isCorrect = true;
      if (state.attempts === 1) {
        firstTryCorrectSet.add(qId);
        mistakesSet.delete(qId);
      }
      dom.explanationCard.classList.add('active');
    } else {
      mistakesSet.add(qId);
    }

    saveState();
    updateCounts();

    // Visual update
    const optionBtns = dom.optionsContainer.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (state.selected.includes(idx)) {
        if (idx === correctIdx) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }
      }
    });

    if (isCorrect) {
      renderExplanation(q, true);
    }
  }

  function renderExplanation(q, forceVisible = false) {
    if (!q.explanation && !q.correctAnswerIndex) {
      dom.explanationCard.classList.remove('active');
      return;
    }

    const letter = GREEK_LETTERS[q.correctAnswerIndex] || '';
    dom.explanationAnswerPill.innerHTML = `<strong>Ορθή Απάντηση:</strong> Επιλογή <strong>${letter}</strong> — <em>${escapeHtml(q.options[q.correctAnswerIndex] || '')}</em>`;

    if (q.explanation) {
      dom.explanationBody.innerHTML = formatMarkdown(q.explanation);
    } else {
      dom.explanationBody.innerHTML = '<p>Δεν υπάρχει διαθέσιμη εκτενής αιτιολόγηση για αυτή την ερώτηση.</p>';
    }

    const state = userAnswers[q.id];
    if (forceVisible || (state && state.isCorrect)) {
      dom.explanationCard.classList.add('active');
    } else {
      dom.explanationCard.classList.remove('active');
    }
  }

  function toggleStar() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (starredSet.has(q.id)) {
      starredSet.delete(q.id);
    } else {
      starredSet.add(q.id);
    }
    saveState();
    updateCounts();
    renderCurrentQuestion();
  }

  function revealAnswer() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    const correctIdx = q.correctAnswerIndex;

    if (!userAnswers[q.id]) {
      userAnswers[q.id] = { selected: [], isCorrect: false, attempts: 0 };
    }
    const state = userAnswers[q.id];
    if (!state.selected.includes(correctIdx)) {
      state.selected.push(correctIdx);
    }
    state.isCorrect = true;

    saveState();
    renderCurrentQuestion();
    dom.explanationCard.classList.add('active');
  }

  function resetQuestion() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    delete userAnswers[q.id];
    mistakesSet.delete(q.id);
    firstTryCorrectSet.delete(q.id);

    saveState();
    updateCounts();
    renderCurrentQuestion();
  }

  function jumpToQuestion(num) {
    if (!num || isNaN(num)) return;
    const targetId = parseInt(num, 10);
    const foundIdx = filteredQuestions.findIndex(q => q.id === targetId);

    if (foundIdx !== -1) {
      currentIndex = foundIdx;
      renderCurrentQuestion();
    } else {
      // Find in allQuestions
      const globalIdx = allQuestions.findIndex(q => q.id === targetId);
      if (globalIdx !== -1) {
        // Reset filters to show it
        activeChapter = 'all';
        activeBatch = 'all';
        activeFilter = 'all';
        searchQuery = '';
        if (dom.chapterSelector) dom.chapterSelector.value = 'all';
        if (dom.batchSelector) dom.batchSelector.value = 'all';
        if (dom.searchInput) dom.searchInput.value = '';
        dom.filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));

        filteredQuestions = allQuestions;
        currentIndex = globalIdx;
        renderCurrentQuestion();
      } else {
        alert(`Η ερώτηση #${targetId} δεν βρέθηκε.`);
      }
    }
  }

  function pickRandomQuestion() {
    if (filteredQuestions.length <= 1) return;
    let nextIdx = currentIndex;
    while (nextIdx === currentIndex) {
      nextIdx = Math.floor(Math.random() * filteredQuestions.length);
    }
    currentIndex = nextIdx;
    renderCurrentQuestion();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupEventListeners() {
    // Theme
    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Search
    let searchTimeout = null;
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          searchQuery = e.target.value;
          dom.clearSearchBtn.classList.toggle('active', searchQuery.length > 0);
          applyFilters();
        }, 200);
      });
    }

    if (dom.clearSearchBtn) {
      dom.clearSearchBtn.addEventListener('click', () => {
        dom.searchInput.value = '';
        searchQuery = '';
        dom.clearSearchBtn.classList.remove('active');
        applyFilters();
        dom.searchInput.focus();
      });
    }

    // Chapter Selector
    if (dom.chapterSelector) {
      dom.chapterSelector.addEventListener('change', (e) => {
        activeChapter = e.target.value;
        applyFilters();
      });
    }

    // Batch Selector
    if (dom.batchSelector) {
      dom.batchSelector.addEventListener('change', (e) => {
        activeBatch = e.target.value;
        applyFilters();
      });
    }

    // Jump Input
    if (dom.jumpInput) {
      dom.jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          jumpToQuestion(dom.jumpInput.value);
          dom.jumpInput.value = '';
        }
      });
    }

    // Random
    if (dom.randomBtn) {
      dom.randomBtn.addEventListener('click', pickRandomQuestion);
    }

    // Filter Pills
    dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        dom.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter');
        applyFilters();
      });
    });

    // Star
    if (dom.starBtn) {
      dom.starBtn.addEventListener('click', toggleStar);
    }

    // Actions
    if (dom.btnReveal) dom.btnReveal.addEventListener('click', revealAnswer);
    if (dom.btnReset) dom.btnReset.addEventListener('click', resetQuestion);

    // Navigation
    if (dom.btnPrev) {
      dom.btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderCurrentQuestion();
        }
      });
    }

    if (dom.btnNext) {
      dom.btnNext.addEventListener('click', () => {
        if (currentIndex < filteredQuestions.length - 1) {
          currentIndex++;
          renderCurrentQuestion();
        } else {
          // Reached end of questions
          showResultsModal();
        }
      });
    }

    // Modal
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', () => {
        dom.resultsModal.classList.remove('active');
      });
    }

    if (dom.modalReviewMistakesBtn) {
      dom.modalReviewMistakesBtn.addEventListener('click', () => {
        dom.resultsModal.classList.remove('active');
        dom.filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'mistakes'));
        activeFilter = 'mistakes';
        applyFilters();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1;
        handleOptionClick(idx);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (dom.btnPrev && !dom.btnPrev.disabled) dom.btnPrev.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (dom.btnNext && !dom.btnNext.disabled) dom.btnNext.click();
      } else if (e.key === ' ') {
        e.preventDefault();
        revealAnswer();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleStar();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (dom.searchInput) dom.searchInput.focus();
      }
    });
  }

  function showResultsModal() {
    const answeredTotal = Object.keys(userAnswers).length;
    const correctCount = firstTryCorrectSet.size;
    const pct = answeredTotal > 0 ? Math.round((correctCount / answeredTotal) * 100) : 0;

    if (dom.modalScoreVal) dom.modalScoreVal.textContent = `${pct}%`;
    if (dom.modalScoreDesc) {
      dom.modalScoreDesc.innerHTML = `Απαντήσατε ${answeredTotal} ερωτήσεις. Σωστές με την πρώτη προσπάθεια: <strong>${correctCount}</strong> (${pct}%).`;
    }
    if (dom.resultsModal) dom.resultsModal.classList.add('active');
  }

  // Initialize
  function init() {
    initDOM();
    loadState();
    initTheme();

    if (!window.pediatricsQuestionsData || !Array.isArray(window.pediatricsQuestionsData)) {
      console.error('pediatricsQuestionsData dataset not found!');
      dom.questionText.innerHTML = '<div style="color:var(--error-color);padding:20px;">Σφάλμα: Δεν βρέθηκε η βάση δεδομένων pediatricsQuestionsData.</div>';
      return;
    }

    allQuestions = window.pediatricsQuestionsData;
    filteredQuestions = allQuestions;

    populateChapters();
    populateBatches();
    updateCounts();
    setupEventListeners();

    // Jump to URL param if provided ?q=123
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam) {
      jumpToQuestion(qParam);
    } else {
      renderCurrentQuestion();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
