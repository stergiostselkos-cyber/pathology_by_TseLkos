/**
 * ΠΑΘΟΛΟΓΙΑ - Ερωτήσεις Πολλαπλής Επιλογής
 * Core Application Logic (Pathology MCQs Master App)
 * Author: Stergios Tselkos
 */

(function() {
  'use strict';

  // Global State
  let currentBank = 'old_book'; // 'old_book' (2013-2023), 'bank_1', or 'larnaka'
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;
  let currentFilter = 'all'; // all, unanswered, wrong, starred
  let currentChapter = 'all';
  let searchTerm = '';

  // Local Storage State
  let userAnswers = {};
  let starredSet = new Set();

  function getStorageKeys() {
    return {
      answers: 'patho_quiz_answers_' + currentBank,
      starred: 'patho_quiz_starred_' + currentBank
    };
  }

  function loadStorageData() {
    const keys = getStorageKeys();
    try {
      const rawAns = localStorage.getItem(keys.answers);
      userAnswers = rawAns ? JSON.parse(rawAns) : {};
    } catch (e) {
      userAnswers = {};
    }

    try {
      const rawStar = localStorage.getItem(keys.starred);
      starredSet = rawStar ? new Set(JSON.parse(rawStar)) : new Set();
    } catch (e) {
      starredSet = new Set();
    }
  }

  function saveAnswers() {
    try {
      localStorage.setItem(getStorageKeys().answers, JSON.stringify(userAnswers));
    } catch (e) {}
  }

  function saveStarred() {
    try {
      localStorage.setItem(getStorageKeys().starred, JSON.stringify(Array.from(starredSet)));
    } catch (e) {}
  }

  // Accent remover for Greek search
  function removeAccents(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // Helper to extract clean question title if options are appended in question text (e.g. Bank 1)
  function getCleanQuestionTitle(fullText) {
    if (!fullText) return '';
    let clean = fullText.replace(/\*/g, '').replace(/\\n/g, '\n').trim();
    const match = clean.match(/(?:^|\s|\n)([α-γ]|\d+)[\.\)]\s/i);
    if (match) {
      const idx = clean.indexOf(match[0]);
      if (idx !== -1 && idx > 15) {
        return clean.substring(0, idx).trim();
      }
    }
    return clean;
  }

  // Helper to get normalized correct answer indices
  function getCorrectIndices(q) {
    if (!q) return [];
    if (Array.isArray(q.correctAnswerIndices)) {
      return q.correctAnswerIndices.map(x => parseInt(x, 10));
    }
    if (typeof q.correctAnswerIndices === 'number') {
      return [q.correctAnswerIndices];
    }
    if (typeof q.correctAnswerIndex !== 'undefined' && q.correctAnswerIndex !== null) {
      return [parseInt(q.correctAnswerIndex, 10)];
    }
    if (typeof q.correctAnswer === 'number') {
      return [q.correctAnswer];
    }
    if (typeof q.correct !== 'undefined' && q.correct !== null) {
      return [parseInt(q.correct, 10) - 1];
    }
    return [0];
  }

  // Helper to extract clean chapter/category
  function getQuestionChapter(q) {
    if (!q) return 'Γενικά';
    if (currentBank === 'bank_1') {
      return q.category || q.chapter || 'Γενικά';
    } else if (currentBank === 'larnaka') {
      return q.part ? ('Μέρος / ' + q.part) : (q.subcategory || q.chapter || 'Γενικά');
    } else {
      return q.chapter || q.category || 'Γενικά';
    }
  }

  // DOM Elements
  const bankSelect = document.getElementById('bankSelect');
  const chapterSelect = document.getElementById('chapterSelect');
  const questionSelect = document.getElementById('questionSelect');

  const scoreVal = document.getElementById('scoreVal');
  const scorePct = document.getElementById('scorePct');
  const totalCountVal = document.getElementById('totalCountVal');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const progressFill = document.getElementById('progressFill');

  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

  const qBankBadge = document.getElementById('qBankBadge');
  const qTypeBadge = document.getElementById('qTypeBadge');
  const qNumberBadge = document.getElementById('qNumberBadge');
  const qChapterBadge = document.getElementById('qChapterBadge');
  const starBtn = document.getElementById('starBtn');

  const questionStem = document.getElementById('questionStem');
  const optionsList = document.getElementById('optionsList');

  const feedbackBox = document.getElementById('feedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');

  const explanationBox = document.getElementById('explanationBox');
  const explanationBody = document.getElementById('explanationBody');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const randomBtn = document.getElementById('randomBtn');
  const jumpInput = document.getElementById('jumpInput');

  // Initialize Application
  function init() {
    // Read URL params
    const urlParams = new URLSearchParams(window.location.search);
    const bankParam = urlParams.get('bank');
    if (bankParam) {
      if (['old_book', 'v3', 'questions_v3'].includes(bankParam)) {
        currentBank = 'old_book';
      } else if (bankParam === 'bank_1') {
        currentBank = 'bank_1';
      } else if (bankParam.startsWith('larnaka')) {
        currentBank = 'larnaka';
      }
    }
    if (bankSelect) {
      bankSelect.value = currentBank;
    }

    loadBankData();
    populateChapters();
    bindEvents();
    applyFilters();

    // Check direct jump
    const targetQId = urlParams.get('qId') || urlParams.get('id');
    if (targetQId) {
      const qNum = parseInt(targetQId, 10);
      if (!isNaN(qNum)) {
        jumpToQuestionId(qNum);
      }
    }
  }

  // Load Bank Data
  function loadBankData() {
    loadStorageData();

    if (currentBank === 'old_book') {
      const source = (typeof questionsData !== 'undefined' && Array.isArray(questionsData)) ? questionsData :
                     (typeof window !== 'undefined' && Array.isArray(window.questionsData)) ? window.questionsData : [];
      allQuestions = source;
    } else if (currentBank === 'bank_1') {
      const source = (typeof questionsBank1Data !== 'undefined' && Array.isArray(questionsBank1Data)) ? questionsBank1Data :
                     (typeof window !== 'undefined' && Array.isArray(window.questionsBank1Data)) ? window.questionsBank1Data : [];
      allQuestions = source;
    } else if (currentBank === 'larnaka') {
      const source = (typeof larnakaAllQuestions !== 'undefined' && Array.isArray(larnakaAllQuestions)) ? larnakaAllQuestions :
                     (typeof window !== 'undefined' && Array.isArray(window.larnakaAllQuestions)) ? window.larnakaAllQuestions : [];
      allQuestions = source;
    }

    // Set jump input max
    if (jumpInput) {
      jumpInput.max = allQuestions.length || 9999;
    }
  }

  // Populate Chapters Dropdown
  function populateChapters() {
    chapterSelect.innerHTML = '<option value="all">Όλα τα Κεφάλαια</option>';
    const chapterMap = new Map();

    allQuestions.forEach(q => {
      const chName = getQuestionChapter(q);
      chapterMap.set(chName, (chapterMap.get(chName) || 0) + 1);
    });

    chapterMap.forEach((count, chName) => {
      const opt = document.createElement('option');
      opt.value = chName;
      opt.textContent = `${chName} (${count} ερωτήσεις)`;
      chapterSelect.appendChild(opt);
    });

    currentChapter = 'all';
  }

  // Populate Questions Dropdown
  function populateQuestionSelect() {
    questionSelect.innerHTML = '';
    if (filteredQuestions.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Δεν υπάρχουν διαθέσιμες ερωτήσεις';
      questionSelect.appendChild(opt);
      questionSelect.disabled = true;
      return;
    }

    questionSelect.disabled = false;
    filteredQuestions.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = q.id;
      let preview = getCleanQuestionTitle(q.question).replace(/\s+/g, ' ').trim();
      if (preview.length > 70) preview = preview.substring(0, 68) + '...';
      opt.textContent = `Ερώτηση #${q.id}: ${preview}`;
      questionSelect.appendChild(opt);
    });

    if (filteredQuestions[currentIndex]) {
      questionSelect.value = filteredQuestions[currentIndex].id;
    }
  }

  // Bind Events
  function bindEvents() {
    // 1. Bank Change
    bankSelect.addEventListener('change', (e) => {
      currentBank = e.target.value;
      loadBankData();
      populateChapters();
      applyFilters();
    });

    // 2. Chapter Change
    chapterSelect.addEventListener('change', (e) => {
      currentChapter = e.target.value;
      applyFilters();
    });

    // 3. Question Change
    questionSelect.addEventListener('change', (e) => {
      const qid = parseInt(e.target.value, 10);
      if (!isNaN(qid)) {
        const foundIdx = filteredQuestions.findIndex(q => q.id === qid);
        if (foundIdx !== -1) {
          currentIndex = foundIdx;
          renderCurrentQuestion();
        }
      }
    });

    // Reset Score Button
    if (resetScoreBtn) {
      resetScoreBtn.addEventListener('click', () => {
        const bankName = (bankSelect.options[bankSelect.selectedIndex] || {}).textContent || '';
        if (confirm(`Θέλετε να μηδενίσετε το σκορ και τις απαντήσεις σας στην τράπεζα:\n«${bankName}»;`)) {
          userAnswers = {};
          saveAnswers();
          renderCurrentQuestion();
          updateStats();
        }
      });
    }

    // Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilters();
      });
    });

    // Search Input
    let searchDebounce = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        searchTerm = e.target.value.trim();
        applyFilters();
      }, 200);
    });

    // Navigation Buttons
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    randomBtn.addEventListener('click', navigateRandom);

    // Jump Input
    jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt(jumpInput.value, 10);
        if (!isNaN(val)) {
          jumpToQuestionId(val);
          jumpInput.value = '';
        }
      }
    });

    starBtn.addEventListener('click', toggleCurrentStarred);

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      if (e.key === 'ArrowLeft') {
        navigate(-1);
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        navigate(1);
      } else if (e.key.toLowerCase() === 's') {
        toggleCurrentStarred();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        selectOption(optIdx);
      } else {
        const char = e.key.toUpperCase();
        const letterMap = { 'A': 0, 'Α': 0, 'B': 1, 'Β': 1, 'C': 2, 'Γ': 2, 'D': 3, 'Δ': 3, 'E': 4, 'Ε': 4 };
        if (char in letterMap) {
          selectOption(letterMap[char]);
        }
      }
    });
  }

  // Apply Filters
  function applyFilters() {
    filteredQuestions = allQuestions.filter(q => {
      // Chapter filter
      if (currentChapter !== 'all') {
        if (getQuestionChapter(q) !== currentChapter) return false;
      }

      // Status filter
      const ans = userAnswers[q.id];
      if (currentFilter === 'unanswered' && ans && ans.completed) return false;
      if (currentFilter === 'wrong' && (!ans || ans.isCorrect)) return false;
      if (currentFilter === 'starred' && !starredSet.has(q.id)) return false;

      // Text Search
      if (searchTerm) {
        const normSearch = removeAccents(searchTerm);
        const normQuestion = removeAccents(q.question || '');
        const normOptions = Array.isArray(q.options) ? removeAccents(q.options.join(' ')) : '';
        if (!normQuestion.includes(normSearch) && !normOptions.includes(normSearch)) {
          return false;
        }
      }

      return true;
    });

    currentIndex = 0;
    renderCurrentQuestion();
    populateQuestionSelect();
    updateStats();
  }

  // Render Current Question
  function renderCurrentQuestion() {
    const bankLabels = {
      'old_book': 'Θέματα 2013-2023',
      'bank_1': 'Τράπεζα 1',
      'larnaka': 'Τράπεζα ΛΑΡΝΑΚΑ'
    };
    qBankBadge.textContent = bankLabels[currentBank] || 'Παθολογία';

    if (filteredQuestions.length === 0) {
      qTypeBadge.textContent = '-';
      qTypeBadge.className = 'q-type-badge';
      qNumberBadge.textContent = '0 / 0';
      qChapterBadge.textContent = 'Δεν βρέθηκαν ερωτήσεις';
      questionStem.textContent = 'Δεν υπάρχει ερώτηση με τα επιλεγμένα κριτήρια ή φίλτρα.';
      optionsList.innerHTML = '';
      feedbackBox.className = 'feedback-box';
      explanationBox.className = 'explanation-box';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      starBtn.classList.remove('starred');
      return;
    }

    const q = filteredQuestions[currentIndex];
    const totalInFilter = filteredQuestions.length;
    const correctIndices = getCorrectIndices(q);
    const isMultiChoice = correctIndices.length > 1;

    // Badges
    qTypeBadge.textContent = isMultiChoice ? `Πολλαπλών Επιλογών (${correctIndices.length} σωστές)` : 'Μονής Επιλογής';
    qTypeBadge.className = isMultiChoice ? 'q-type-badge multi' : 'q-type-badge';
    qNumberBadge.textContent = `Ερώτηση ${q.id} (Φίλτρο: ${currentIndex + 1} / ${totalInFilter})`;
    qChapterBadge.textContent = getQuestionChapter(q);

    // Sync Question Dropdown
    if (questionSelect.value !== String(q.id)) {
      questionSelect.value = q.id;
    }

    // Star status
    if (starredSet.has(q.id)) {
      starBtn.classList.add('starred');
      starBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
      starBtn.title = 'Αφαίρεση από τα Αγαπημένα';
    } else {
      starBtn.classList.remove('starred');
      starBtn.innerHTML = '<i class="fa-regular fa-star"></i>';
      starBtn.title = 'Προσθήκη στα Αγαπημένα';
    }

    // Question Stem
    questionStem.textContent = getCleanQuestionTitle(q.question);

    // Render options
    optionsList.innerHTML = '';
    const answerState = userAnswers[q.id] || { selected: [], completed: false, isCorrect: false };
    const hasAnswered = answerState.completed;
    const optLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε'];

    const GREEK_UPPER_MAP = {
      'α': 'Α', 'ά': 'Ά', 'β': 'Β', 'γ': 'Γ', 'δ': 'Δ', 'ε': 'Ε', 'έ': 'Έ',
      'ζ': 'Ζ', 'η': 'Η', 'ή': 'Ή', 'θ': 'Θ', 'ι': 'Ι', 'ί': 'Ί', 'ϊ': 'Ϊ', 'ΐ': 'Ϊ',
      'κ': 'Κ', 'λ': 'Λ', 'μ': 'Μ', 'ν': 'Ν', 'ξ': 'Ξ', 'ο': 'Ο', 'ό': 'Ό',
      'π': 'Π', 'ρ': 'Ρ', 'σ': 'Σ', 'ς': 'Σ', 'τ': 'Τ', 'υ': 'Υ', 'ύ': 'Ύ', 'ϋ': 'Ϋ', 'ΰ': 'Ϋ',
      'φ': 'Φ', 'χ': 'Χ', 'ψ': 'Ψ', 'ω': 'Ω', 'ώ': 'Ώ'
    };

    function capitalizeFirstLetter(str) {
      if (!str) return '';
      str = str.trim();
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (/[a-zA-Z\u0370-\u03FF]/.test(ch)) {
          const up = GREEK_UPPER_MAP[ch] || ch.toUpperCase();
          return str.slice(0, i) + up + str.slice(i + 1);
        }
      }
      return str;
    }

    const optionsArray = Array.isArray(q.options) ? q.options : [];
    optionsArray.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';

      let cleanText = optText.replace(/^[Α-ΕA-E8Οo0-9]+[\.\)\:\-]\s*/, '').trim();
      cleanText = capitalizeFirstLetter(cleanText);

      const letterBox = document.createElement('div');
      letterBox.className = 'option-letter';
      letterBox.textContent = optLetters[idx] || (idx + 1);

      const textBox = document.createElement('div');
      textBox.className = 'option-text';
      textBox.textContent = cleanText;

      const iconBox = document.createElement('div');
      iconBox.className = 'option-status-icon';

      // Status marking
      const isSelected = answerState.selected.includes(idx);
      const isActuallyCorrect = correctIndices.includes(idx);

      if (hasAnswered) {
        if (isActuallyCorrect) {
          btn.classList.add('correct');
          iconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        } else if (isSelected) {
          btn.classList.add('incorrect');
          iconBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        }
      } else if (isSelected) {
        if (isActuallyCorrect) {
          btn.classList.add('correct');
          iconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        } else {
          btn.classList.add('incorrect');
          iconBox.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        }
      }

      btn.appendChild(letterBox);
      btn.appendChild(textBox);
      btn.appendChild(iconBox);

      btn.addEventListener('click', () => {
        selectOption(idx);
      });

      optionsList.appendChild(btn);
    });

    // Feedback Box
    if (hasAnswered) {
      const correctLettersStr = correctIndices.map(i => optLetters[i] || (i + 1)).join(', ');
      if (answerState.isCorrect) {
        feedbackBox.className = 'feedback-box correct';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        feedbackTitle.textContent = 'Σωστή Απάντηση! Συγχαρητήρια!';
        feedbackText.innerHTML = `Η ορθή επιλογή είναι η <strong>(${correctLettersStr})</strong>.<br><button type="button" class="retry-q-btn" onclick="window.retryCurrentQuestion()"><i class="fa-solid fa-rotate-left"></i> Δοκιμή Ξανά</button>`;
      } else {
        feedbackBox.className = 'feedback-box incorrect';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        feedbackTitle.textContent = 'Λανθασμένη Επιλογή';
        feedbackText.innerHTML = `Η σωστή απάντηση είναι η επιλογή <strong>(${correctLettersStr})</strong>.<br><button type="button" class="retry-q-btn" onclick="window.retryCurrentQuestion()"><i class="fa-solid fa-rotate-left"></i> Δοκιμή Ξανά</button>`;
      }
    } else {
      feedbackBox.className = 'feedback-box';
    }

    // Explanation Box
    if (q.explanation && (hasAnswered || (answerState.selected && answerState.selected.length > 0))) {
      let expHtml = q.explanation;
      if (currentBank === 'larnaka') {
        expHtml = expHtml.replace(/src="images\//g, 'src="LARNAKA/images/');
      }
      explanationBody.innerHTML = expHtml;
      explanationBox.className = 'explanation-box active';
    } else {
      explanationBox.className = 'explanation-box';
      explanationBody.innerHTML = '';
    }

    // Navigation buttons state
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === filteredQuestions.length - 1);
  }

  // Handle Option Click
  function selectOption(selectedIndex) {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    const correctIndices = getCorrectIndices(q);
    const isMultiChoice = correctIndices.length > 1;

    let ans = userAnswers[q.id] || { selected: [], completed: false, isCorrect: false, timestamp: Date.now() };

    if (!ans.selected.includes(selectedIndex)) {
      ans.selected.push(selectedIndex);
    }

    if (!isMultiChoice) {
      // Single Choice: complete immediately
      ans.completed = true;
      ans.isCorrect = (selectedIndex === correctIndices[0]);
    } else {
      // Multi Choice: complete if either clicked an incorrect option OR selected all correct ones
      const hasIncorrect = ans.selected.some(i => !correctIndices.includes(i));
      const hasAllCorrect = correctIndices.every(i => ans.selected.includes(i));

      if (hasIncorrect) {
        ans.completed = true;
        ans.isCorrect = false;
      } else if (hasAllCorrect) {
        ans.completed = true;
        ans.isCorrect = true;
      }
    }

    ans.timestamp = Date.now();
    userAnswers[q.id] = ans;
    saveAnswers();
    renderCurrentQuestion();
    updateStats();
  }

  // Retry Current Question
  window.retryCurrentQuestion = function() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (userAnswers[q.id]) {
      delete userAnswers[q.id];
      saveAnswers();
      renderCurrentQuestion();
      updateStats();
    }
  };

  // Navigation
  function navigate(delta) {
    const nextIdx = currentIndex + delta;
    if (nextIdx >= 0 && nextIdx < filteredQuestions.length) {
      currentIndex = nextIdx;
      renderCurrentQuestion();
    }
  }

  function navigateRandom() {
    if (filteredQuestions.length <= 1) return;
    let rand = Math.floor(Math.random() * filteredQuestions.length);
    if (rand === currentIndex) {
      rand = (currentIndex + 1) % filteredQuestions.length;
    }
    currentIndex = rand;
    renderCurrentQuestion();
  }

  function jumpToQuestionId(qid) {
    let targetIdx = filteredQuestions.findIndex(q => q.id === qid);
    if (targetIdx === -1) {
      const targetQ = allQuestions.find(q => q.id === qid);
      if (targetQ) {
        currentChapter = 'all';
        chapterSelect.value = 'all';
        currentFilter = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        searchTerm = '';
        searchInput.value = '';
        applyFilters();
        targetIdx = filteredQuestions.findIndex(q => q.id === qid);
      } else {
        alert(`Η ερώτηση #${qid} δεν βρέθηκε στη συγκεκριμένη τράπεζα.`);
        return;
      }
    }

    if (targetIdx !== -1) {
      currentIndex = targetIdx;
      renderCurrentQuestion();
    }
  }

  function toggleCurrentStarred() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (starredSet.has(q.id)) {
      starredSet.delete(q.id);
    } else {
      starredSet.add(q.id);
    }
    saveStarred();
    renderCurrentQuestion();
  }

  // Update Score & Statistics
  function updateStats() {
    const totalAll = allQuestions.length;
    const totalInFilter = filteredQuestions.length;
    totalCountVal.textContent = (currentChapter === 'all' && currentFilter === 'all' && !searchTerm) ? totalAll : `${totalInFilter} (από ${totalAll})`;

    const currentBankIds = new Set(allQuestions.map(q => q.id));
    const answeredInBank = Object.keys(userAnswers).filter(id => currentBankIds.has(parseInt(id, 10)) && userAnswers[id].completed);
    const answeredCount = answeredInBank.length;
    const correctCount = answeredInBank.filter(id => userAnswers[id] && userAnswers[id].isCorrect).length;

    const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    scoreVal.textContent = `${correctCount} / ${answeredCount}`;
    scorePct.textContent = `${pct}%`;

    const progressPct = totalAll > 0 ? Math.round((answeredCount / totalAll) * 100) : 0;
    progressFill.style.width = `${progressPct}%`;
  }

  // Auto-launch
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
