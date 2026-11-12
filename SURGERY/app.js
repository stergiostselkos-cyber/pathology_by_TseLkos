/**
 * ΧΕΙΡΟΥΡΓΙΚΗ - Ερωτήσεις Πολλαπλής Επιλογής
 * Core Application Logic
 * Author: Stergios Tselkos
 */

(function() {
  'use strict';

  // State
  let currentBank = 'bank_4004'; // 'bank_4004' or 'bank_2002'
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;
  let currentFilter = 'all'; // all, unanswered, wrong, starred
  let currentChapter = 'all';
  let searchTerm = '';

  // Local Storage State
  const STORAGE_KEY_ANSWERS = 'surgery_quiz_answers_v1';
  const STORAGE_KEY_STARRED = 'surgery_quiz_starred_v1';

  let userAnswers = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
    if (raw) userAnswers = JSON.parse(raw);
  } catch (e) {
    userAnswers = {};
  }

  let starredSet = new Set();
  try {
    const rawStar = localStorage.getItem(STORAGE_KEY_STARRED);
    if (rawStar) starredSet = new Set(JSON.parse(rawStar));
  } catch (e) {
    starredSet = new Set();
  }

  function saveAnswers() {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(userAnswers));
    } catch (e) {}
  }

  function saveStarred() {
    try {
      localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(Array.from(starredSet)));
    } catch (e) {}
  }

  // DOM Elements
  const bankSelect = document.getElementById('bankSelect');
  const chapterSelect = document.getElementById('chapterSelect');
  const questionSelect = document.getElementById('questionSelect');

  const scoreVal = document.getElementById('scoreVal');
  const scorePct = document.getElementById('scorePct');
  const totalCountVal = document.getElementById('totalCountVal');
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
    loadBankData();
    populateChapters();
    bindEvents();
    applyFilters();

    // Check URL parameters for direct question jump (e.g. from search.html)
    const urlParams = new URLSearchParams(window.location.search);
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
    } else if (currentBank === 'bank_2002') {
      // Future surgery bank
      if (typeof SURGERY_2002_QUESTIONS !== 'undefined' && Array.isArray(SURGERY_2002_QUESTIONS)) {
        allQuestions = SURGERY_2002_QUESTIONS;
      } else {
        allQuestions = [];
      }
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
    } else if (currentBank === 'bank_2002') {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = 'all';
      defaultOpt.textContent = 'Όλα τα Κεφάλαια (2002 Ερωτήσεις - Προσεχώς)';
      chapterSelect.appendChild(defaultOpt);
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
    filteredQuestions.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = q.id;
      // Short preview of question text
      let preview = q.question.replace(/\s+/g, ' ').trim();
      if (preview.length > 70) preview = preview.substring(0, 68) + '...';
      opt.textContent = `Ερώτηση #${q.id}: ${preview}`;
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
      populateChapters();
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

  function applyFilters() {
    if (currentBank === 'bank_2002' && allQuestions.length === 0) {
      filteredQuestions = [];
      currentIndex = 0;
      renderCurrentQuestion();
      populateQuestionSelect();
      updateStats();
      return;
    }

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
    if (currentBank === 'bank_2002' && allQuestions.length === 0) {
      qBankBadge.textContent = '2002 Ερωτήσεις';
      qNumberBadge.textContent = 'Προσεχώς';
      qChapterBadge.textContent = 'Υπό Κατασκευή';
      questionStem.innerHTML = '<div style="text-align:center; padding: 20px 0;"><i class="fa-solid fa-clock-rotate-left" style="font-size:2.5rem; color:#0f766e; margin-bottom:15px; display:block;"></i><h3>Η τράπεζα «2002 Ερωτήσεις Πολλαπλής Επιλογής» ετοιμάζεται!</h3><p style="color:#64748b; margin-top:8px;">Θα είναι διαθέσιμη αμέσως μόλις φορτωθεί το αρχείο των ερωτήσεων. Επιλέξτε την τράπεζα <strong>«4004 Ερωτήσεις Πολλαπλής Επιλογής»</strong> για να συνεχίσετε την εξάσκηση.</p></div>';
      optionsList.innerHTML = '';
      feedbackBox.className = 'feedback-box';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      starBtn.classList.remove('starred');
      return;
    }

    if (filteredQuestions.length === 0) {
      qBankBadge.textContent = (currentBank === 'bank_4004' ? '4004 Ερωτήσεις' : '2002 Ερωτήσεις');
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

    qBankBadge.textContent = (currentBank === 'bank_4004' ? '4004 Ερωτήσεις' : '2002 Ερωτήσεις');
    qNumberBadge.textContent = `Ερώτηση ${q.id} (Φίλτρο: ${currentIndex + 1} / ${totalInFilter})`;
    qChapterBadge.textContent = q.chapterTitle || `Κεφάλαιο ${q.chapterId}`;

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
        if (!hasAnswered) {
          selectOption(idx);
        }
      });

      optionsList.appendChild(btn);
    });

    // Feedback Box
    if (hasAnswered) {
      const correctLetter = optLetters[q.correctAnswer] || 'Α';
      if (answerState.isCorrect) {
        feedbackBox.className = 'feedback-box correct';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        feedbackTitle.textContent = 'Σωστή Απάντηση! Συγχαρητήρια!';
        feedbackText.textContent = `Η ορθή επιλογή είναι η (${correctLetter}).`;
      } else {
        feedbackBox.className = 'feedback-box incorrect';
        feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        feedbackTitle.textContent = 'Λανθασμένη Επιλογή';
        feedbackText.textContent = `Η σωστή απάντηση είναι η επιλογή (${correctLetter}).`;
      }
    } else {
      feedbackBox.className = 'feedback-box';
    }

    // Navigation buttons state
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === filteredQuestions.length - 1);
  }

  function selectOption(selectedIndex) {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];

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
