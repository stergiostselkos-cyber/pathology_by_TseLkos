/**
 * 4004 Ερωτήσεις Πολλαπλής Επιλογής Χειρουργικής
 * Core Application Logic
 * Author: Stergios Tselkos
 */

(function() {
  'use strict';

  // State
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
  const chapterSelect = document.getElementById('chapterSelect');
  const scoreVal = document.getElementById('scoreVal');
  const scorePct = document.getElementById('scorePct');
  const totalCountVal = document.getElementById('totalCountVal');
  const progressFill = document.getElementById('progressFill');

  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

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
    // Check global datasets
    if (typeof SURGERY_QUESTIONS !== 'undefined' && Array.isArray(SURGERY_QUESTIONS)) {
      allQuestions = SURGERY_QUESTIONS;
    } else {
      console.warn('SURGERY_QUESTIONS dataset not loaded.');
      allQuestions = [];
    }

    populateChapters();
    bindEvents();
    applyFilters();
  }

  function populateChapters() {
    if (typeof SURGERY_CHAPTERS === 'undefined') return;
    
    SURGERY_CHAPTERS.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch.id;
      opt.textContent = `Κεφάλαιο ${ch.id}: ${ch.title} (Ερ. ${ch.qStart} - ${ch.qEnd})`;
      chapterSelect.appendChild(opt);
    });
  }

  function bindEvents() {
    chapterSelect.addEventListener('change', (e) => {
      currentChapter = e.target.value;
      applyFilters();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilters();
      });
    });

    let searchDebounce = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        searchTerm = e.target.value.trim().toLowerCase();
        applyFilters();
      }, 200);
    });

    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    randomBtn.addEventListener('click', goToRandom);

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
      // Ignore if user typing in an input
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
    updateStats();
  }

  function renderCurrentQuestion() {
    if (filteredQuestions.length === 0) {
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

    qNumberBadge.textContent = `Ερώτηση ${q.id} (Φίλτρο: ${currentIndex + 1} / ${totalInFilter})`;
    qChapterBadge.textContent = q.chapterTitle || `Κεφάλαιο ${q.chapterId}`;

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

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      if (hasAnswered) btn.classList.add('disabled');

      // Strip existing prefix if already present in text
      let cleanText = optText.replace(/^[Α-ΕA-E8Οo0-9]+[\.\)\:\-]\s*/, '').trim();

      const letterBox = document.createElement('div');
      letterBox.className = 'option-letter';
      letterBox.textContent = optLetters[idx] || (idx + 1);

      const textBox = document.createElement('div');
      textBox.className = 'option-text';
      textBox.textContent = cleanText;

      const iconBox = document.createElement('div');
      iconBox.className = 'option-status-icon';

      // Mark states if answered
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

    // Render Feedback Box
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
    if (userAnswers[q.id]) return; // already answered

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
    // If not in current filtered list, switch chapter to all or target
    let targetIdx = filteredQuestions.findIndex(q => q.id === qid);
    if (targetIdx === -1) {
      // Find question in allQuestions
      const targetQ = allQuestions.find(q => q.id === qid);
      if (targetQ) {
        // Reset chapter and filters
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
    totalCountVal.textContent = totalAll;

    const answeredIds = Object.keys(userAnswers);
    const answeredCount = answeredIds.length;
    const correctCount = answeredIds.filter(id => userAnswers[id] && userAnswers[id].isCorrect).length;

    const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    scoreVal.textContent = `${correctCount} / ${answeredCount}`;
    scorePct.textContent = `${pct}%`;

    // Overall Progress fill
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
