/**
 * ΠΑΘΟΛΟΓΙΑ - Ερωτήσεις Πολλαπλής Επιλογής
 * Core Application Logic (Pathology MCQs Master App)
 * Author: Stergios Tselkos
 */

(function() {
  'use strict';

  // Global State
  // Smooth scroll to top of current question
  window.scrollToQuestionTop = function() {
    const target = document.getElementById('questionCard') || document.querySelector('.question-card') || document.body;
    if (target) {
      const yOffset = -20;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  let currentBank = 'old_book'; // 'old_book' (2013-2023), 'bank_1', or 'larnaka'
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;
  let currentFilter = 'all'; // all, unanswered, wrong, starred
  let currentChapter = 'all';
  let searchTerm = '';
  let showExplanationForced = false;

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
    // Only strip when choices start on a NEWLINE (e.g. \nΑ) or \n1.)
    // Never strip numbers in continuous prose like "39°C, 2. ημέρες μετά" or "pH 7.32, 25."
    const match = clean.match(/\n\s*([Α-ΕA-Eα-εa-e]|\d+)[\.\)]\s/);
    if (match) {
      const idx = clean.indexOf(match[0]);
      if (idx !== -1) {
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
    } else if (currentBank === 'doatap' || currentBank === 'farmakologia' || currentBank === 'fysiologia') {
      return q.chapterTitle || q.chapter || q.category || 'Γενικά';
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
  const openResultsBtn = document.getElementById('openResultsBtn');
  const progressFill = document.getElementById('progressFill');

  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

  const qBankBadge = document.getElementById('qBankBadge');
  const qTypeBadge = document.getElementById('qTypeBadge');
  const qNumberBadge = document.getElementById('qNumberBadge');
  const qChapterBadge = document.getElementById('qChapterBadge');
  const toggleExpBtn = document.getElementById('toggleExpBtn');
  const starBtn = document.getElementById('starBtn');

  const questionStem = document.getElementById('questionStem');
  const optionsList = document.getElementById('optionsList');

  const feedbackBox = document.getElementById('feedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackText = document.getElementById('feedbackText');

  const explanationPanel = document.getElementById('explanationPanel');
  const explanationBody = document.getElementById('explanationBody');

  const firstBtn = document.getElementById('firstBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const lastBtn = document.getElementById('lastBtn');
  const randomBtn = document.getElementById('randomBtn');
  const jumpInput = document.getElementById('jumpInput');

  // Results Modal Elements
  const resultsModal = document.getElementById('resultsModal');
  const closeResultsModalBtn = document.getElementById('closeResultsModalBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalResetBtn = document.getElementById('modalResetBtn');
  const modalViewWrongBtn = document.getElementById('modalViewWrongBtn');
  const modalViewUnansweredBtn = document.getElementById('modalViewUnansweredBtn');
  const modalPct = document.getElementById('modalPct');
  const modalCorrect = document.getElementById('modalCorrect');
  const modalWrong = document.getElementById('modalWrong');
  const modalUnanswered = document.getElementById('modalUnanswered');

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
      } else if (['doatap', 'bank_doatap', 'pathologia_doatap'].includes(bankParam)) {
        currentBank = 'doatap';
      } else if (['farmakologia', 'pharma', 'farmaka', 'farmakologia_doatap'].includes(bankParam)) {
        currentBank = 'farmakologia';
      } else if (['fysiologia', 'physio', 'physiology', 'fysiologia_doatap'].includes(bankParam)) {
        currentBank = 'fysiologia';
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

  // Load Bank Data (Guaranteed across all 3 banks)
  function loadBankData() {
    loadStorageData();
    showExplanationForced = false;

    if (currentBank === 'old_book') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.questionsData) && window.questionsData !== window.questionsBank1Data) ? window.questionsData :
                     (typeof questionsData !== 'undefined' && Array.isArray(questionsData) && questionsData !== window.questionsBank1Data) ? questionsData : [];
    } else if (currentBank === 'bank_1') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.questionsBank1Data)) ? window.questionsBank1Data :
                     (typeof questionsBank1Data !== 'undefined' && Array.isArray(questionsBank1Data)) ? questionsBank1Data : [];
    } else if (currentBank === 'larnaka') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.larnakaAllQuestions)) ? window.larnakaAllQuestions :
                     (typeof larnakaAllQuestions !== 'undefined' && Array.isArray(larnakaAllQuestions)) ? larnakaAllQuestions : [];
    } else if (currentBank === 'doatap') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.pathologiaDoatap)) ? window.pathologiaDoatap :
                     (typeof pathologiaDoatap !== 'undefined' && Array.isArray(pathologiaDoatap)) ? pathologiaDoatap : [];
    } else if (currentBank === 'farmakologia') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.farmakologia)) ? window.farmakologia :
                     (typeof farmakologia !== 'undefined' && Array.isArray(farmakologia)) ? farmakologia : [];
    } else if (currentBank === 'fysiologia') {
      allQuestions = (typeof window !== 'undefined' && Array.isArray(window.fysiologia)) ? window.fysiologia :
                     (typeof fysiologia !== 'undefined' && Array.isArray(fysiologia)) ? fysiologia : [];
    }

    // Assign guaranteed unique identifiers & global sequential indices
    allQuestions.forEach((q, idx) => {
      q._uid = `${currentBank}_${q.id || (idx + 1)}_${idx}`;
      q._globalIndex = idx + 1;
    });

    if (jumpInput) {
      jumpInput.max = allQuestions.length || 9999;
    }
  }

  // Helper to format explanation content whether string or structured array (e.g. DOATAP)
  function formatExplanationContent(exp) {
    if (!exp) return '<p>Δεν υπάρχει διαθέσιμη αιτιολόγηση για αυτή την ερώτηση.</p>';
    if (typeof exp === 'string') return exp;
    if (Array.isArray(exp)) {
      if (exp.length === 0) return '<p>Δεν υπάρχει διαθέσιμη αιτιολόγηση για αυτή την ερώτηση.</p>';
      let html = '<div class="doatap-explanation-container">';
      exp.forEach(item => {
        if (typeof item === 'string') {
          html += `<div class="doatap-exp-text">${item}</div>`;
        } else if (item && typeof item === 'object') {
          if (item.type === 'note') {
            html += `<div class="doatap-exp-note"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Σημείωση:</strong> ${item.text || ''}</div>`;
          } else if (item.type === 'text') {
            html += `<div class="doatap-exp-text">${item.text || ''}</div>`;
          } else if (item.type === 'link') {
            html += `<div class="doatap-exp-link"><a href="${item.url}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${item.title || item.url}</a></div>`;
          } else if (item.type === 'image') {
            html += `<div class="doatap-exp-image"><img src="${item.url}" alt="Επεξηγηματική εικόνα"></div>`;
          } else if (item.text) {
            html += `<div class="doatap-exp-text">${item.text}</div>`;
          }
        }
      });
      html += '</div>';
      return html;
    }
    return String(exp);
  }

  // Populate Chapters Dropdown
  function populateChapters() {
    chapterSelect.innerHTML = '<option value="all">Όλα τα Κεφάλαια</option>';
    const chapterMap = new Map();

    allQuestions.forEach(q => {
      const chName = getQuestionChapter(q);
      chapterMap.set(chName, (chapterMap.get(chName) || 0) + 1);
    });

    const sortedEntries = Array.from(chapterMap.entries()).sort((a, b) => {
      const getNum = (s) => {
        const m = String(s).match(/(?:ΚΕΦΑΛΑΙΟ\s*)?(\d+)/i);
        return m ? parseInt(m[1], 10) : 9999;
      };
      return getNum(a[0]) - getNum(b[0]) || a[0].localeCompare(b[0], 'el');
    });

    sortedEntries.forEach(([chName, count]) => {
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
      opt.value = q._uid || q.id;
      let preview = getCleanQuestionTitle(q.question).replace(/\s+/g, ' ').trim();
      if (preview.length > 70) preview = preview.substring(0, 68) + '...';
      const dispNum = (currentBank === 'larnaka') ? q._globalIndex : (q.id || q._globalIndex);
      opt.textContent = `Ερ. #${dispNum}: ${preview}`;
      questionSelect.appendChild(opt);
    });

    if (filteredQuestions[currentIndex]) {
      questionSelect.value = filteredQuestions[currentIndex]._uid || filteredQuestions[currentIndex].id;
    }
  }

  // Bind Events
  function bindEvents() {
    // 1. Bank Change
    bankSelect.addEventListener('change', (e) => {
      currentBank = e.target.value;
      currentChapter = 'all';
      if (chapterSelect) chapterSelect.value = 'all';
      currentIndex = 0;
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
      const val = e.target.value;
      const foundIdx = filteredQuestions.findIndex(q => (q._uid === val || String(q.id) === val));
      if (foundIdx !== -1) {
        currentIndex = foundIdx;
        renderQuestion();
      }
    });

    // Reset Score Button
    if (resetScoreBtn) {
      resetScoreBtn.addEventListener('click', resetBankScore);
    }

    // Results Modal Trigger
    if (openResultsBtn) {
      openResultsBtn.addEventListener('click', openResultsModal);
    }
    if (closeResultsModalBtn) closeResultsModalBtn.addEventListener('click', closeResultsModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeResultsModal);
    if (modalResetBtn) modalResetBtn.addEventListener('click', () => { closeResultsModal(); resetBankScore(); });

    if (modalViewWrongBtn) {
      modalViewWrongBtn.addEventListener('click', () => {
        closeResultsModal();
        currentFilter = 'wrong';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'wrong'));
        applyFilters();
      });
    }

    if (modalViewUnansweredBtn) {
      modalViewUnansweredBtn.addEventListener('click', () => {
        closeResultsModal();
        currentFilter = 'unanswered';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'unanswered'));
        applyFilters();
      });
    }

    // Toggle Explanation Manual Button (Guaranteed to populate & open immediately)
    if (toggleExpBtn) {
      toggleExpBtn.addEventListener('click', () => {
        showExplanationForced = !showExplanationForced;
        if (filteredQuestions.length === 0) return;
        const q = filteredQuestions[currentIndex];
        if (showExplanationForced) {
          let expHtml = formatExplanationContent(q.explanation);
          if (currentBank === 'larnaka') {
            expHtml = expHtml.replace(/src="images\//g, 'src="LARNAKA/images/');
          }
          if (expHtml && expHtml.length > 400 && !expHtml.includes('btn-section-top')) {
            expHtml += `<div class="section-back-to-top">
              <button type="button" class="btn-section-top" onclick="window.scrollToQuestionTop()" title="Επιστροφή στην κορυφή της ερώτησης">
                <i class="fa-solid fa-arrow-up"></i>
                <span>Επιστροφή στην κορυφή</span>
              </button>
            </div>`;
          }
          explanationBody.innerHTML = expHtml;
          explanationPanel.className = 'patho-explanation-panel active';
          if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([explanationBody]).catch(function(err){});
          }
        } else {
          const ansKey = q._uid || q.id;
          const answerState = userAnswers[ansKey] || { selected: [], completed: false };
          if (!answerState.completed) {
            explanationPanel.className = 'patho-explanation-panel';
            explanationBody.innerHTML = '';
          }
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

    // Navigation Buttons (Top & Bottom Toolbars)
    document.querySelectorAll('#firstBtn, #firstBtnBottom, .btn-nav-first').forEach(b => {
      b.addEventListener('click', (e) => { e.preventDefault(); navigateToExtreme(0); });
    });
    document.querySelectorAll('#lastBtn, #lastBtnBottom, .btn-nav-last').forEach(b => {
      b.addEventListener('click', (e) => { e.preventDefault(); navigateToExtreme(filteredQuestions.length - 1); });
    });
    document.querySelectorAll('#prevBtn, #prevBtnBottom, .btn-nav-prev').forEach(b => {
      b.addEventListener('click', (e) => { e.preventDefault(); navigate(-1); });
    });
    document.querySelectorAll('#nextBtn, #nextBtnBottom, .btn-nav-next').forEach(b => {
      b.addEventListener('click', (e) => { e.preventDefault(); navigate(1); });
    });
    document.querySelectorAll('#randomBtn, #randomBtnBottom, .btn-nav-random').forEach(b => {
      b.addEventListener('click', (e) => { e.preventDefault(); navigateRandom(); });
    });

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
      } else if (e.key.toLowerCase() === 'e') {
        if (toggleExpBtn) toggleExpBtn.click();
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

  function resetBankScore() {
    const bankName = (bankSelect.options[bankSelect.selectedIndex] || {}).textContent || '';
    if (confirm(`Θέλετε να μηδενίσετε το σκορ και τις απαντήσεις σας στην τράπεζα:\n«${bankName}»;`)) {
      userAnswers = {};
      saveAnswers();
      renderCurrentQuestion();
      updateStats();
      applyFilters();
    }
  }

  function openResultsModal() {
    if (!resultsModal) return;
    const totalAll = allQuestions.length;
    const currentBankIds = new Set(allQuestions.map(q => q.id));
    const answeredInBank = Object.keys(userAnswers).filter(id => currentBankIds.has(parseInt(id, 10)) && userAnswers[id].completed);
    const answeredCount = answeredInBank.length;
    const correctCount = answeredInBank.filter(id => userAnswers[id] && userAnswers[id].isCorrect).length;
    const wrongCount = answeredCount - correctCount;
    const unansweredCount = Math.max(0, totalAll - answeredCount);
    const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    modalPct.textContent = `${pct}%`;
    modalCorrect.textContent = correctCount;
    modalWrong.textContent = wrongCount;
    modalUnanswered.textContent = unansweredCount;

    resultsModal.classList.add('active');
  }

  function closeResultsModal() {
    if (resultsModal) resultsModal.classList.remove('active');
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
      'larnaka': 'Τράπεζα ΛΑΡΝΑΚΑ',
      'doatap': 'Παθολογία ΔΟΑΤΑΠ',
      'farmakologia': 'Φαρμακολογία ΔΟΑΤΑΠ',
      'fysiologia': 'Φυσιολογία ΔΟΑΤΑΠ'
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
      explanationPanel.className = 'patho-explanation-panel';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      if (firstBtn) firstBtn.disabled = true;
      if (lastBtn) lastBtn.disabled = true;
      starBtn.classList.remove('starred');
      return;
    }

    const q = filteredQuestions[currentIndex];
    const totalInFilter = filteredQuestions.length;
    const correctIndices = getCorrectIndices(q);
    const isMultiChoice = correctIndices.length > 1;

    // Uncertain Flag (DOATAP)
    let uncertainEl = document.getElementById('uncertainBadge');
    if (q.uncertain) {
      if (!uncertainEl) {
        uncertainEl = document.createElement('span');
        uncertainEl.id = 'uncertainBadge';
        uncertainEl.className = 'uncertain-badge';
        uncertainEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Προς Έλεγχο';
        uncertainEl.title = 'Η ορθή επιλογή επισημάνθηκε από τον συντάκτη ως πιθανώς αβέβαιη ή προς επανέλεγχο';
        const badgeBox = document.querySelector('.question-badge-box');
        if (badgeBox) badgeBox.appendChild(uncertainEl);
      } else {
        uncertainEl.style.display = 'inline-flex';
      }
    } else if (uncertainEl) {
      uncertainEl.style.display = 'none';
    }
    // Badges
    qTypeBadge.textContent = isMultiChoice ? `Πολλαπλών Επιλογών (${correctIndices.length} σωστές)` : 'Μονής Επιλογής';
    qTypeBadge.className = isMultiChoice ? 'q-type-badge multi' : 'q-type-badge';
    const displayId = (currentBank === 'larnaka') ? `${q._globalIndex} / ${allQuestions.length}` : `#${q.id || q._globalIndex}`;
    qNumberBadge.textContent = `Ερώτηση ${displayId} (α/α: ${currentIndex + 1} / ${totalInFilter})`;
    qChapterBadge.textContent = getQuestionChapter(q);

    // Sync Question Dropdown
    const curVal = q._uid || q.id;
    if (questionSelect.value !== String(curVal)) {
      questionSelect.value = curVal;
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
    const ansKey = q._uid || q.id;
    const answerState = userAnswers[ansKey] || { selected: [], completed: false, isCorrect: false };
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

      // Only strip single-letter choice indicators like "Α) ", "a) ", "Α. ", "(Α) "
      // NEVER strip numbers or digits (e.g. "1.5 g/kg", "2-3 ημέρες", "24ωρη", "8-12 ώρες")
      let cleanText = optText.replace(/^[\(\[]?[Α-ΕA-Ea-eα-ε][\.\)\:\-\]]\s+/, '').trim();
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

    // Explanation Panel (Displays analysis whenever question is answered OR forced)
    const hasExp = (Array.isArray(q.explanation) ? q.explanation.length > 0 : Boolean(q.explanation));
    if ((hasExp || showExplanationForced) && (hasAnswered || showExplanationForced || (answerState.selected && answerState.selected.length > 0))) {
      let expHtml = formatExplanationContent(q.explanation);
      if (currentBank === 'larnaka') {
        expHtml = expHtml.replace(/src="images\//g, 'src="LARNAKA/images/');
      }
      if (expHtml && expHtml.length > 400 && !expHtml.includes('btn-section-top')) {
        expHtml += `<div class="section-back-to-top">
          <button type="button" class="btn-section-top" onclick="window.scrollToQuestionTop()" title="Επιστροφή στην κορυφή της ερώτησης">
            <i class="fa-solid fa-arrow-up"></i>
            <span>Επιστροφή στην κορυφή</span>
          </button>
        </div>`;
      }
      explanationBody.innerHTML = expHtml;
      explanationPanel.className = 'patho-explanation-panel active';

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([explanationBody]).catch(function(err){ console.log('MathJax error:', err); });
      }
    } else {
      explanationPanel.className = 'patho-explanation-panel';
      explanationBody.innerHTML = '';
    }

    // Navigation buttons state (Sync both top & bottom toolbars)
    const isFirst = (currentIndex === 0);
    const isLast = (currentIndex === filteredQuestions.length - 1);
    document.querySelectorAll('#prevBtn, #prevBtnBottom, .btn-nav-prev').forEach(b => b.disabled = isFirst);
    document.querySelectorAll('#nextBtn, #nextBtnBottom, .btn-nav-next').forEach(b => b.disabled = isLast);
    document.querySelectorAll('#firstBtn, #firstBtnBottom, .btn-nav-first').forEach(b => b.disabled = isFirst);
    document.querySelectorAll('#lastBtn, #lastBtnBottom, .btn-nav-last').forEach(b => b.disabled = isLast);
  }

  // Handle Option Click
  function selectOption(selectedIndex) {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    const correctIndices = getCorrectIndices(q);
    const isMultiChoice = correctIndices.length > 1;

    const ansKey = q._uid || q.id;
    let ans = userAnswers[ansKey] || { selected: [], completed: false, isCorrect: false, timestamp: Date.now() };

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
    userAnswers[ansKey] = ans;
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

  // Navigation (With smooth return to question top)
  function navigate(delta) {
    const nextIdx = currentIndex + delta;
    if (nextIdx >= 0 && nextIdx < filteredQuestions.length) {
      currentIndex = nextIdx;
      showExplanationForced = false;
      renderCurrentQuestion();
      window.scrollToQuestionTop();
    }
  }

  function navigateToExtreme(targetIdx) {
    if (filteredQuestions.length === 0) return;
    if (targetIdx >= 0 && targetIdx < filteredQuestions.length) {
      currentIndex = targetIdx;
      showExplanationForced = false;
      renderCurrentQuestion();
      window.scrollToQuestionTop();
    }
  }

  function navigateRandom() {
    if (filteredQuestions.length <= 1) return;
    let rand = Math.floor(Math.random() * filteredQuestions.length);
    if (rand === currentIndex) {
      rand = (currentIndex + 1) % filteredQuestions.length;
    }
    currentIndex = rand;
    showExplanationForced = false;
    renderCurrentQuestion();
    window.scrollToQuestionTop();
  }

  function jumpToQuestionId(qid) {
    let targetIdx = filteredQuestions.findIndex(q => (q.id === qid || q._globalIndex === qid || q.part2Id === qid));
    if (targetIdx === -1) {
      const targetQ = allQuestions.find(q => (q.id === qid || q._globalIndex === qid || q.part2Id === qid));
      if (targetQ) {
        currentChapter = 'all';
        chapterSelect.value = 'all';
        currentFilter = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        searchTerm = '';
        searchInput.value = '';
        applyFilters();
        targetIdx = filteredQuestions.findIndex(q => (q.id === qid || q._globalIndex === qid || q.part2Id === qid));
      } else {
        alert(`Η ερώτηση #${qid} δεν βρέθηκε στη συγκεκριμένη τράπεζα.`);
        return;
      }
    }

    if (targetIdx !== -1) {
      currentIndex = targetIdx;
      showExplanationForced = false;
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
