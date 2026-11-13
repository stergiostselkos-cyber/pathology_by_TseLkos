// ==============================================================================
// SURGERY MCQ ENGINE (4004 & DOATAP 1039)
// Platform: By Stergios Tselkos
// ==============================================================================

(function() {
  'use strict';

  // State
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;
  let currentBank = 'bank_4004'; // 'bank_4004' or 'bank_doatap'
  let currentChapter = 'all';
  let searchTerm = '';
  let currentFilter = 'all'; // all, unanswered, wrong, starred

  // Dynamic Local Storage State per bank
  let userAnswers = {};
  let starredSet = new Set();

  function getStorageKeyAnswers() {
    return 'surgery_quiz_answers_' + currentBank;
  }

  function getStorageKeyStarred() {
    return 'surgery_quiz_starred_' + currentBank;
  }

  function loadUserAnswers() {
    try {
      const raw = localStorage.getItem(getStorageKeyAnswers());
      userAnswers = raw ? JSON.parse(raw) : {};
    } catch (e) {
      userAnswers = {};
    }
  }

  function loadStarred() {
    try {
      const rawStar = localStorage.getItem(getStorageKeyStarred());
      starredSet = rawStar ? new Set(JSON.parse(rawStar)) : new Set();
    } catch (e) {
      starredSet = new Set();
    }
  }

  function saveAnswers() {
    try {
      localStorage.setItem(getStorageKeyAnswers(), JSON.stringify(userAnswers));
    } catch (e) {}
  }

  function saveStarred() {
    try {
      localStorage.setItem(getStorageKeyStarred(), JSON.stringify(Array.from(starredSet)));
    } catch (e) {}
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
  const qNumberBadge = document.getElementById('qNumberBadge');
  const qChapterBadge = document.getElementById('qChapterBadge');
  const starBtn = document.getElementById('starBtn');
  const questionStem = document.getElementById('questionStem');
  const optionsList = document.getElementById('optionsList');

  const feedbackBox = document.getElementById('feedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const randomBtn = document.getElementById('randomBtn');
  const jumpInput = document.getElementById('jumpInput');

  // Initialize
  function init() {
    // Check URL parameters for bank selection
    const urlParams = new URLSearchParams(window.location.search);
    const bankParam = urlParams.get('bank');
    if (bankParam && (bankParam === 'bank_4004' || bankParam === 'bank_doatap')) {
      currentBank = bankParam;
    }
    if (bankSelect) {
      bankSelect.value = currentBank;
    }

    loadBankData();
    loadUserAnswers();
    loadStarred();
    populateChapters();
    bindEvents();
    applyFilters();

    // Check URL parameters for direct question jump
    const targetQId = urlParams.get('qId') || urlParams.get('id');
    if (targetQId) {
      const qNum = parseInt(targetQId, 10);
      if (!isNaN(qNum)) {
        jumpToQuestionId(qNum);
      }
    }
  }

  function loadBankData() {
    if (currentBank === 'bank_4004') {
      const source = (typeof SURGERY_QUESTIONS !== 'undefined' && Array.isArray(SURGERY_QUESTIONS)) ? SURGERY_QUESTIONS :
                     (typeof surgeryQuestions !== 'undefined' && Array.isArray(surgeryQuestions)) ? surgeryQuestions :
                     (typeof window !== 'undefined' && Array.isArray(window.SURGERY_QUESTIONS)) ? window.SURGERY_QUESTIONS :
                     (typeof window !== 'undefined' && Array.isArray(window.surgeryQuestions)) ? window.surgeryQuestions : [];
      allQuestions = source;
    } else if (currentBank === 'bank_doatap') {
      const source = (typeof xeirourgikiDoatap !== 'undefined' && Array.isArray(xeirourgikiDoatap)) ? xeirourgikiDoatap :
                     (typeof window !== 'undefined' && Array.isArray(window.xeirourgikiDoatap)) ? window.xeirourgikiDoatap : [];
      allQuestions = source;
    }
  }

  function populateChapters() {
    chapterSelect.innerHTML = '';
    
    if (currentBank === 'bank_4004') {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = 'all';
      defaultOpt.textContent = 'Όλα τα Κεφάλαια (1 - 4004)';
      chapterSelect.appendChild(defaultOpt);

      if (typeof SURGERY_CHAPTERS !== 'undefined') {
        SURGERY_CHAPTERS.forEach(ch => {
          const opt = document.createElement('option');
          opt.value = ch.id;
          opt.textContent = `Κεφάλαιο ${ch.id}: ${ch.title} (Ερ. ${ch.qStart} - ${ch.qEnd})`;
          chapterSelect.appendChild(opt);
        });
      }
    } else if (currentBank === 'bank_doatap') {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = 'all';
      defaultOpt.textContent = `Όλα τα Κεφάλαια (1 - ${allQuestions.length})`;
      chapterSelect.appendChild(defaultOpt);

      if (typeof DOATAP_CHAPTERS !== 'undefined') {
        DOATAP_CHAPTERS.forEach(ch => {
          const opt = document.createElement('option');
          opt.value = ch.id;
          opt.textContent = `Κεφάλαιο ${ch.id}: ${ch.title} (${ch.count} Ερωτήσεις)`;
          chapterSelect.appendChild(opt);
        });
      }
    }
    
    chapterSelect.value = 'all';
    currentChapter = 'all';
  }

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
    filteredQuestions.forEach((q) => {
      const opt = document.createElement('option');
      opt.value = q.id;
      // Short preview of question text
      let preview = q.question.replace(/\s+/g, ' ').trim();
      if (preview.length > 70) preview = preview.substring(0, 68) + '...';
      const prefix = (currentBank === 'bank_doatap') ? 'ΔΟΑΤΑΠ #' : '#';
      opt.textContent = `${prefix}${q.id}: ${preview}`;
      questionSelect.appendChild(opt);
    });

    // Sync selected question in dropdown
    if (filteredQuestions[currentIndex]) {
      questionSelect.value = filteredQuestions[currentIndex].id;
    }
  }

  function bindEvents() {
    // 1. Bank Change
    bankSelect.addEventListener('change', (e) => {
      currentBank = e.target.value;
      loadBankData();
      loadUserAnswers();
      loadStarred();
      populateChapters();
      currentIndex = 0;
      applyFilters();
    });

    // 2. Chapter Change
    chapterSelect.addEventListener('change', (e) => {
      currentChapter = e.target.value;
      applyFilters();
    });

    // 3. Question Change (Bar 3)
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

    // Status Filter Buttons
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
        searchTerm = e.target.value.trim().toLowerCase();
        applyFilters();
      }, 200);
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    randomBtn.addEventListener('click', goToRandom);

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

    // Reset Score Button
    if (resetScoreBtn) {
      resetScoreBtn.addEventListener('click', resetSurgeryScore);
    }

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

  function resetSurgeryScore() {
    const bankName = (bankSelect && bankSelect.options[bankSelect.selectedIndex]) ? bankSelect.options[bankSelect.selectedIndex].textContent : 'Χειρουργική';
    if (confirm(`Θέλετε να μηδενίσετε όλες τις απαντήσεις και το σκορ στη ${bankName};`)) {
      userAnswers = {};
      try {
        localStorage.removeItem(getStorageKeyAnswers());
      } catch (e) {}
      saveAnswers();
      renderCurrentQuestion();
      updateStats();
      applyFilters();
    }
  }

  // Clear / Retry current question selection
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

  function applyFilters() {
    filteredQuestions = allQuestions.filter(q => {
      // Chapter filter
      if (currentChapter !== 'all') {
        if (q.chapterId !== parseInt(currentChapter, 10)) return false;
      }

      // Status filter
      const ans = userAnswers[q.id];
      if (currentFilter === 'unanswered' && ans) return false;
      if (currentFilter === 'wrong' && (!ans || ans.isCorrect)) return false;
      if (currentFilter === 'starred' && !starredSet.has(q.id)) return false;

      // Search term
      if (searchTerm) {
        const matchStem = q.question && q.question.toLowerCase().includes(searchTerm);
        const matchOpt = q.options && q.options.some(o => o.toLowerCase().includes(searchTerm));
        if (!matchStem && !matchOpt) return false;
      }

      return true;
    });

    currentIndex = 0;
    renderCurrentQuestion();
    populateQuestionSelect();
    updateStats();
  }

  function renderCurrentQuestion() {
    if (filteredQuestions.length === 0) {
      qBankBadge.textContent = (currentBank === 'bank_4004' ? '4004 Ερωτήσεις' : 'Χειρουργική ΔΟΑΤΑΠ');
      qNumberBadge.textContent = '0 / 0';
      qChapterBadge.textContent = 'Δεν βρέθηκαν ερωτήσεις';
      questionStem.textContent = 'Δεν υπάρχει ερώτηση με τα επιλεγμένα κριτήρια ή φίλτρα.';
      optionsList.innerHTML = '';
      feedbackBox.className = 'feedback-box';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      starBtn.classList.remove('starred');
      return;
    }

    const q = filteredQuestions[currentIndex];
    const totalInFilter = filteredQuestions.length;

    qBankBadge.textContent = (currentBank === 'bank_4004' ? '4004 Ερωτήσεις' : 'Χειρουργική ΔΟΑΤΑΠ');
    
    // Question number badge with uncertain flag indicator
    let numberText = `Ερώτηση ${q.id} (Φίλτρο: ${currentIndex + 1} / ${totalInFilter})`;
    if (q.uncertain) {
      numberText += ` <span class="uncertain-badge" title="Απάντηση προς έλεγχο / αμφισβητούμενη"><i class="fa-solid fa-triangle-exclamation"></i> Προς Έλεγχο</span>`;
    }
    qNumberBadge.innerHTML = numberText;
    qChapterBadge.textContent = q.chapterTitle || `Κεφάλαιο ${q.chapterId}`;

    // Sync Question Dropdown
    if (questionSelect.value !== String(q.id)) {
      questionSelect.value = q.id;
    }

    // Sync Jump Input max
    jumpInput.max = allQuestions.length;

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

    questionStem.textContent = q.question;

    // Render options
    optionsList.innerHTML = '';
    const answerState = userAnswers[q.id];
    const hasAnswered = !!answerState;
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

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      if (hasAnswered) btn.classList.add('disabled');

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

      if (hasAnswered) {
        if (idx === q.correctAnswer) {
          btn.classList.add('correct');
          iconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        } else if (idx === answerState.selectedIndex) {
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
      const correctLetter = optLetters[q.correctAnswer] || 'Α';
      let correctOptText = (q.options && q.options[q.correctAnswer]) ? q.options[q.correctAnswer].replace(/^[Α-ΕA-E8δόo0-9]+[\.\)\:\-]\s*/i, '').trim() : '';
      if (correctOptText) {
        correctOptText = correctOptText.charAt(0).toUpperCase() + correctOptText.slice(1);
      }
      const answerSnippet = correctOptText ? ` — <em>${correctOptText}</em>` : '';

      // Format DOATAP Explanation if available
      let expHtml = '';
      if (Array.isArray(q.explanation) && q.explanation.length > 0) {
        expHtml += '<div class="doatap-explanation-container">';
        q.explanation.forEach(e => {
          if (!e) return;
          if (e.type === 'note' && e.text) {
            expHtml += `<div class="doatap-exp-note"><i class="fa-solid fa-clipboard-check"></i> <strong>Σημείωση / Τεκμηρίωση:</strong> ${e.text}</div>`;
          } else if (e.type === 'text' && e.text) {
            expHtml += `<div class="doatap-exp-text">${e.text}</div>`;
          } else if (e.type === 'link' && e.text) {
            expHtml += `<div class="doatap-exp-link"><a href="${e.text}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Πηγή / Βιβλιογραφία</a></div>`;
          } else if (e.type === 'image' && e.src) {
            expHtml += `<div class="doatap-exp-image"><img src="${e.src}" alt="${e.id || 'Εικόνα'}" loading="lazy"></div>`;
          }
        });
        expHtml += '</div>';
      }

      const retryBtn = `<button type="button" class="retry-q-btn" onclick="window.retryCurrentQuestion()"><i class="fa-solid fa-rotate-left"></i> ${answerState.isCorrect ? 'Επαναφορά Επιλογής' : 'Δοκιμή Ξανά'}</button>`;

      if (answerState.isCorrect) {
        feedbackBox.className = 'feedback-box correct';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        feedbackTitle.textContent = 'Σωστή Απάντηση! Μπράβο!';
        feedbackText.innerHTML = `Μπράβο, επιλέξατε τη σωστή απάντηση <strong>(${correctLetter})</strong>${answerSnippet}.<br>${retryBtn}${expHtml}`;
      } else {
        feedbackBox.className = 'feedback-box incorrect';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        feedbackTitle.textContent = 'Λανθασμένη Επιλογή';
        feedbackText.innerHTML = `Η σωστή απάντηση είναι η <strong>(${correctLetter})</strong>${answerSnippet}.<br>${retryBtn}${expHtml}`;
      }
    } else {
      feedbackBox.className = 'feedback-box';
      feedbackIcon.innerHTML = '';
      feedbackTitle.textContent = '';
      feedbackText.innerHTML = '';
    }

    // Navigation buttons state
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === filteredQuestions.length - 1);
  }

  function selectOption(selectedIndex) {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];

    // Toggle off / clear selection if clicked the same option again
    if (userAnswers[q.id] && userAnswers[q.id].selectedIndex === selectedIndex) {
      delete userAnswers[q.id];
      saveAnswers();
      renderCurrentQuestion();
      updateStats();
      return;
    }

    const isCorrect = (selectedIndex === q.correctAnswer);
    userAnswers[q.id] = {
      selectedIndex: selectedIndex,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    saveAnswers();
    renderCurrentQuestion();
    updateStats();
  }

  function navigate(delta) {
    const nextIdx = currentIndex + delta;
    if (nextIdx >= 0 && nextIdx < filteredQuestions.length) {
      currentIndex = nextIdx;
      renderCurrentQuestion();
    }
  }

  function goToRandom() {
    if (filteredQuestions.length <= 1) return;
    let rand = Math.floor(Math.random() * filteredQuestions.length);
    if (rand === currentIndex) {
      rand = (rand + 1) % filteredQuestions.length;
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
        alert(`Η ερώτηση #${qid} δεν βρέθηκε.`);
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

  function updateStats() {
    const totalAll = allQuestions.length;
    const totalInFilter = filteredQuestions.length;
    totalCountVal.textContent = (currentChapter === 'all' && currentFilter === 'all' && !searchTerm) ? totalAll : `${totalInFilter} (από ${totalAll})`;

    const answeredIds = Object.keys(userAnswers);
    const answeredCount = answeredIds.length;
    const correctCount = answeredIds.filter(id => userAnswers[id] && userAnswers[id].isCorrect).length;

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
