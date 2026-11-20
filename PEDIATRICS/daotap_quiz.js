/**
 * ==========================================================================
 * DAOTAP PEDIATRICS QUIZ APP - INTERACTIVE ENGINE
 * Author: TseLkos Medical Portals
 * Dataset: paidiatrikiQuestions (1,199 questions)
 * ==========================================================================
 */

(function () {
  'use strict';

  // Greek Letters for Multiple Choice
  const GREEK_LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'];

  // Global State
  let allQuestions = [];
  let filteredQuestions = [];
  let currentIndex = 0;

  let activeFilter = 'all'; // 'all' | 'image' | 'explanation' | 'starred' | 'mistakes' | 'notes'
  let activeBatch = 'all';   // 'all' | '1-100' | '101-200' ...
  let searchQuery = '';

  let userAnswers = {};      // { [questionId]: { selected: [indices], isCorrect: bool, attempts: int } }
  let starredSet = new Set();
  let mistakesSet = new Set();
  let firstTryCorrectSet = new Set();

  // Storage Keys
  const STORAGE_KEY_STATE = 'tselkos_pedia_daotap_state_v1';
  const STORAGE_KEY_STARRED = 'tselkos_pedia_daotap_starred_v1';
  const STORAGE_KEY_THEME = 'tselkos_pedia_theme';

  // DOM Elements cache
  let dom = {};

  function init() {
    cacheDom();
    initTheme();
    loadStorage();

    if (!window.paidiatrikiQuestions || !Array.isArray(window.paidiatrikiQuestions)) {
      console.error('paidiatrikiQuestions dataset not found!');
      dom.questionText.innerHTML = '<div style="color:var(--error-color);padding:20px;">Σφάλμα: Δεν βρέθηκε η βάση δεδομένων paidiatrikiQuestions.</div>';
      return;
    }

    allQuestions = window.paidiatrikiQuestions;
    populateBatchSelect();
    updateFilterCounts();
    applyFilters();
    bindEvents();

    // URL Query param handling (?q=120 or ?qId=120)
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || urlParams.get('qId');
    if (qParam) {
      const targetNum = parseInt(qParam, 10);
      if (!isNaN(targetNum)) {
        const foundIdx = filteredQuestions.findIndex(q => q.sequence === targetNum || q.id === targetNum);
        if (foundIdx !== -1) {
          currentIndex = foundIdx;
        } else {
          const globalIdx = allQuestions.findIndex(q => q.sequence === targetNum || q.id === targetNum);
          if (globalIdx !== -1) {
            activeFilter = 'all';
            activeBatch = 'all';
            searchQuery = '';
            applyFilters();
            currentIndex = globalIdx;
          }
        }
      }
    }

    renderCurrentQuestion();
    updateStats();
  }

  function cacheDom() {
    dom.themeToggleBtn = document.getElementById('theme-toggle-btn');
    dom.searchInput = document.getElementById('search-input');
    dom.batchSelect = document.getElementById('batch-select');
    dom.jumpInput = document.getElementById('jump-input');
    dom.jumpBtn = document.getElementById('jump-btn');
    dom.randomBtn = document.getElementById('random-btn');
    dom.filterPills = document.querySelectorAll('.filter-pill');

    dom.progressCounter = document.getElementById('progress-counter');
    dom.progressPercent = document.getElementById('progress-percent');
    dom.progressBarFill = document.getElementById('progress-bar-fill');

    dom.statCorrect = document.getElementById('stat-correct');
    dom.statWrong = document.getElementById('stat-wrong');
    dom.statRate = document.getElementById('stat-rate');
    dom.statBookmarked = document.getElementById('stat-bookmarked');

    dom.qBadgeId = document.getElementById('q-badge-id');
    dom.qBadgeChapter = document.getElementById('q-badge-chapter');
    dom.qBadgeFeatures = document.getElementById('q-badge-features');
    dom.btnStar = document.getElementById('btn-star');

    dom.questionText = document.getElementById('question-text');
    dom.optionsContainer = document.getElementById('options-container');

    dom.btnPrev = document.getElementById('btn-prev');
    dom.btnNext = document.getElementById('btn-next');
    dom.btnReveal = document.getElementById('btn-reveal');
    dom.btnClear = document.getElementById('btn-clear');

    dom.explanationCard = document.getElementById('explanation-card');
    dom.explanationBody = document.getElementById('explanation-body');
    dom.explanationAnswerPill = document.getElementById('explanation-answer-pill');
    dom.explanationNotesBox = document.getElementById('explanation-notes-box');

    dom.resultsModal = document.getElementById('results-modal');
    dom.modalScoreVal = document.getElementById('modal-score-val');
    dom.modalScoreDesc = document.getElementById('modal-score-desc');
    dom.modalCloseBtn = document.getElementById('modal-close-btn');
    dom.modalReviewMistakesBtn = document.getElementById('modal-review-mistakes-btn');
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark-theme';
    if (savedTheme === 'light-theme') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      updateThemeIcon(true);
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      updateThemeIcon(false);
    }
  }

  function updateThemeIcon(isLight) {
    if (!dom.themeToggleBtn) return;
    dom.themeToggleBtn.innerHTML = isLight
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
    dom.themeToggleBtn.setAttribute('title', isLight ? 'Εναλλαγή σε Σκούρο θέμα' : 'Εναλλαγή σε Φωτεινό θέμα');
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark-theme');
      updateThemeIcon(false);
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem(STORAGE_KEY_THEME, 'light-theme');
      updateThemeIcon(true);
    }
  }

  function loadStorage() {
    try {
      const savedStarred = localStorage.getItem(STORAGE_KEY_STARRED);
      if (savedStarred) {
        starredSet = new Set(JSON.parse(savedStarred));
      }
      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        userAnswers = parsed.userAnswers || {};
        mistakesSet = new Set(parsed.mistakes || []);
        firstTryCorrectSet = new Set(parsed.firstTryCorrect || []);
        if (typeof parsed.lastIndex === 'number') {
          currentIndex = parsed.lastIndex;
        }
      }
    } catch (e) {
      console.warn('Could not load saved quiz state:', e);
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_STARRED, JSON.stringify(Array.from(starredSet)));
      const state = {
        userAnswers,
        mistakes: Array.from(mistakesSet),
        firstTryCorrect: Array.from(firstTryCorrectSet),
        lastIndex: currentIndex
      };
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save quiz state:', e);
    }
  }

  function populateBatchSelect() {
    if (!dom.batchSelect) return;
    dom.batchSelect.innerHTML = '<option value="all">Όλες οι ερωτήσεις (1 - 1199)</option>';

    const total = allQuestions.length;
    const batchSize = 100;
    for (let start = 1; start <= total; start += batchSize) {
      const end = Math.min(start + batchSize - 1, total);
      const opt = document.createElement('option');
      opt.value = `${start}-${end}`;
      opt.textContent = `Ερωτήσεις ${start} - ${end}`;
      dom.batchSelect.appendChild(opt);
    }
  }

  function updateFilterCounts() {
    let imgCount = 0;
    let expCount = 0;
    let noteCount = 0;

    allQuestions.forEach(q => {
      if (q.images && q.images.length > 0) imgCount++;
      if (q.explanation && q.explanation.trim().length > 0) expCount++;
      if (q.uncertain || q.answerNote || q.answerChanged || q.pdfMarkedAnswer) noteCount++;
    });

    setCountBadge('all', allQuestions.length);
    setCountBadge('image', imgCount);
    setCountBadge('explanation', expCount);
    setCountBadge('starred', starredSet.size);
    setCountBadge('mistakes', mistakesSet.size);
    setCountBadge('notes', noteCount);
  }

  function setCountBadge(filterType, count) {
    const el = document.getElementById(`count-${filterType}`);
    if (el) el.textContent = count;
  }

  function applyFilters() {
    let pool = allQuestions.slice();

    // 1. Batch Range
    if (activeBatch !== 'all') {
      const parts = activeBatch.split('-');
      const startNum = parseInt(parts[0], 10);
      const endNum = parseInt(parts[1], 10);
      pool = pool.filter(q => q.sequence >= startNum && q.sequence <= endNum);
    }

    // 2. Specialty/Type Filter
    if (activeFilter === 'image') {
      pool = pool.filter(q => q.images && q.images.length > 0);
    } else if (activeFilter === 'explanation') {
      pool = pool.filter(q => q.explanation && q.explanation.trim().length > 0);
    } else if (activeFilter === 'starred') {
      pool = pool.filter(q => starredSet.has(q.id));
    } else if (activeFilter === 'mistakes') {
      pool = pool.filter(q => mistakesSet.has(q.id));
    } else if (activeFilter === 'notes') {
      pool = pool.filter(q => q.uncertain || q.answerNote || q.answerChanged || q.pdfMarkedAnswer);
    }

    // 3. Search Query
    if (searchQuery.trim().length > 0) {
      const qLower = searchQuery.toLowerCase();
      pool = pool.filter(q => {
        const inQ = (q.question || '').toLowerCase().includes(qLower);
        const inOpts = (q.options || []).some(o => o.toLowerCase().includes(qLower));
        const inExp = (q.explanation || '').toLowerCase().includes(qLower);
        const inNum = String(q.id).includes(qLower) || String(q.sequence).includes(qLower);
        return inQ || inOpts || inExp || inNum;
      });
    }

    filteredQuestions = pool;
    if (currentIndex >= filteredQuestions.length) {
      currentIndex = Math.max(0, filteredQuestions.length - 1);
    }

    updateFilterCounts();
  }

  function bindEvents() {
    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        applyFilters();
        currentIndex = 0;
        renderCurrentQuestion();
        updateStats();
      });
    }

    if (dom.batchSelect) {
      dom.batchSelect.addEventListener('change', (e) => {
        activeBatch = e.target.value;
        applyFilters();
        currentIndex = 0;
        renderCurrentQuestion();
        updateStats();
      });
    }

    if (dom.jumpBtn && dom.jumpInput) {
      const handleJump = () => {
        const val = parseInt(dom.jumpInput.value.trim(), 10);
        if (isNaN(val)) return;
        const targetIdx = filteredQuestions.findIndex(q => q.sequence === val || q.id === val);
        if (targetIdx !== -1) {
          currentIndex = targetIdx;
          renderCurrentQuestion();
          updateStats();
        } else {
          // If not in current filter, reset to all
          const globalIdx = allQuestions.findIndex(q => q.sequence === val || q.id === val);
          if (globalIdx !== -1) {
            activeFilter = 'all';
            activeBatch = 'all';
            searchQuery = '';
            if (dom.searchInput) dom.searchInput.value = '';
            if (dom.batchSelect) dom.batchSelect.value = 'all';
            updatePillActive();
            applyFilters();
            currentIndex = globalIdx;
            renderCurrentQuestion();
            updateStats();
          } else {
            alert(`Η ερώτηση #${val} δεν βρέθηκε!`);
          }
        }
      };
      dom.jumpBtn.addEventListener('click', handleJump);
      dom.jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleJump();
      });
    }

    if (dom.randomBtn) {
      dom.randomBtn.addEventListener('click', () => {
        if (filteredQuestions.length === 0) return;
        currentIndex = Math.floor(Math.random() * filteredQuestions.length);
        renderCurrentQuestion();
        updateStats();
      });
    }

    dom.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        activeFilter = pill.getAttribute('data-filter');
        updatePillActive();
        applyFilters();
        currentIndex = 0;
        renderCurrentQuestion();
        updateStats();
      });
    });

    if (dom.btnPrev) {
      dom.btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          renderCurrentQuestion();
          updateStats();
        }
      });
    }

    if (dom.btnNext) {
      dom.btnNext.addEventListener('click', () => {
        if (currentIndex < filteredQuestions.length - 1) {
          currentIndex++;
          renderCurrentQuestion();
          updateStats();
        } else if (filteredQuestions.length > 0) {
          openResultsModal();
        }
      });
    }

    if (dom.btnReveal) {
      dom.btnReveal.addEventListener('click', revealAnswer);
    }

    if (dom.btnClear) {
      dom.btnClear.addEventListener('click', clearCurrentAnswer);
    }

    if (dom.btnStar) {
      dom.btnStar.addEventListener('click', toggleStar);
    }

    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeResultsModal);
    }

    if (dom.modalReviewMistakesBtn) {
      dom.modalReviewMistakesBtn.addEventListener('click', () => {
        closeResultsModal();
        activeFilter = 'mistakes';
        updatePillActive();
        applyFilters();
        currentIndex = 0;
        renderCurrentQuestion();
        updateStats();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function updatePillActive() {
    dom.filterPills.forEach(p => {
      if (p.getAttribute('data-filter') === activeFilter) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  function handleKeyboardShortcuts(e) {
    if (['input', 'textarea', 'select'].includes((e.target.tagName || '').toLowerCase())) {
      return;
    }

    if (e.key === 'ArrowRight') {
      if (dom.btnNext && !dom.btnNext.disabled) dom.btnNext.click();
    } else if (e.key === 'ArrowLeft') {
      if (dom.btnPrev && !dom.btnPrev.disabled) dom.btnPrev.click();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      revealAnswer();
    } else if (e.key.toLowerCase() === 's') {
      toggleStar();
    } else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      if (dom.searchInput) dom.searchInput.focus();
    } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const opts = dom.optionsContainer.querySelectorAll('.option-item');
      if (opts[idx]) opts[idx].click();
    }
  }

  function renderCurrentQuestion() {
    if (filteredQuestions.length === 0) {
      dom.questionText.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-secondary);"><i class="fa-solid fa-filter-circle-xmark" style="font-size:2rem;margin-bottom:12px;display:block;"></i>Δεν βρέθηκαν ερωτήσεις με τα επιλεγμένα κριτήρια.</div>';
      dom.optionsContainer.innerHTML = '';
      dom.explanationCard.style.display = 'none';
      dom.qBadgeId.textContent = '# -';
      dom.qBadgeChapter.textContent = '-';
      dom.qBadgeFeatures.innerHTML = '';
      dom.btnPrev.disabled = true;
      dom.btnNext.disabled = true;
      return;
    }

    const q = filteredQuestions[currentIndex];
    const isAnswered = Boolean(userAnswers[q.id]);
    const isStarred = starredSet.has(q.id);

    // Meta Badges
    dom.qBadgeId.textContent = `#${q.sequence || q.id}`;
    dom.qBadgeChapter.textContent = q.bookChapter ? `Κεφ. ${q.bookChapter}` : 'ΠΑΙΔΙΑΤΡΙΚΗ ΔΟΑΤΑΠ';

    let featureBadges = '';
    if (q.images && q.images.length > 0) {
      featureBadges += '<span class="q-badge q-badge-img"><i class="fa-solid fa-image"></i> Εικόνα</span>';
    }
    if (q.explanation && q.explanation.trim().length > 0) {
      featureBadges += '<span class="q-badge q-badge-chapter"><i class="fa-solid fa-lightbulb"></i> Αιτιολόγηση</span>';
    }
    if (q.uncertain || q.answerNote || q.answerChanged || q.pdfMarkedAnswer) {
      featureBadges += '<span class="q-badge q-badge-note"><i class="fa-solid fa-triangle-exclamation"></i> Σημείωση</span>';
    }
    dom.qBadgeFeatures.innerHTML = featureBadges;

    // Star icon state
    if (isStarred) {
      dom.btnStar.classList.add('starred');
      dom.btnStar.innerHTML = '<i class="fa-solid fa-star"></i>';
    } else {
      dom.btnStar.classList.remove('starred');
      dom.btnStar.innerHTML = '<i class="fa-regular fa-star"></i>';
    }

    // Question Text
    dom.questionText.textContent = q.question;

    // Options
    renderOptions(q);

    // Navigation buttons state
    dom.btnPrev.disabled = (currentIndex === 0);
    dom.btnNext.disabled = (currentIndex >= filteredQuestions.length - 1 && filteredQuestions.length > 0);

    // Explanation visibility
    if (isAnswered) {
      showExplanation(q);
    } else {
      dom.explanationCard.style.display = 'none';
    }

    saveStorage();
  }

  function renderOptions(q) {
    dom.optionsContainer.innerHTML = '';
    const userAns = userAnswers[q.id];
    const correctIndices = getCorrectIndices(q);

    (q.options || []).forEach((optText, idx) => {
      const optEl = document.createElement('div');
      optEl.className = 'option-item';
      optEl.setAttribute('data-index', idx);

      const greekLetter = GREEK_LETTERS[idx] || (idx + 1);
      optEl.innerHTML = `
        <div class="option-indicator">${greekLetter}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
      `;

      if (userAns) {
        optEl.classList.add('locked');
        if (correctIndices.includes(idx)) {
          optEl.classList.add('correct');
          optEl.querySelector('.option-indicator').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (userAns.selected.includes(idx)) {
          optEl.classList.add('incorrect');
          optEl.querySelector('.option-indicator').innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
      } else {
        optEl.addEventListener('click', () => handleOptionClick(q, idx));
      }

      dom.optionsContainer.appendChild(optEl);
    });
  }

  function getCorrectIndices(q) {
    if (Array.isArray(q.correctAnswerIndices) && q.correctAnswerIndices.length > 0) {
      return q.correctAnswerIndices;
    }
    if (typeof q.correctAnswerIndex === 'number') {
      return [q.correctAnswerIndex];
    }
    // Fallback: match text
    if (q.correctAnswer && Array.isArray(q.options)) {
      const idx = q.options.findIndex(o => o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      if (idx !== -1) return [idx];
    }
    return [0];
  }

  function handleOptionClick(q, selectedIdx) {
    const correctIndices = getCorrectIndices(q);
    const isCorrect = correctIndices.includes(selectedIdx);

    const prevAnswer = userAnswers[q.id];
    const attempts = prevAnswer ? prevAnswer.attempts + 1 : 1;

    userAnswers[q.id] = {
      selected: [selectedIdx],
      isCorrect: isCorrect,
      attempts: attempts
    };

    if (isCorrect) {
      if (attempts === 1) {
        firstTryCorrectSet.add(q.id);
      }
      mistakesSet.delete(q.id);
    } else {
      mistakesSet.add(q.id);
      firstTryCorrectSet.delete(q.id);
    }

    renderOptions(q);
    showExplanation(q);
    updateStats();
    updateFilterCounts();
    saveStorage();
  }

  function revealAnswer() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    const correctIndices = getCorrectIndices(q);

    if (!userAnswers[q.id]) {
      userAnswers[q.id] = {
        selected: [],
        isCorrect: false,
        attempts: 1,
        revealed: true
      };
      mistakesSet.add(q.id);
    }

    renderOptions(q);
    showExplanation(q);
    updateStats();
    updateFilterCounts();
    saveStorage();
  }

  function clearCurrentAnswer() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    delete userAnswers[q.id];
    mistakesSet.delete(q.id);
    firstTryCorrectSet.delete(q.id);

    renderOptions(q);
    dom.explanationCard.style.display = 'none';
    updateStats();
    updateFilterCounts();
    saveStorage();
  }

  function toggleStar() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (starredSet.has(q.id)) {
      starredSet.delete(q.id);
    } else {
      starredSet.add(q.id);
    }
    renderCurrentQuestion();
    updateFilterCounts();
    saveStorage();
  }

  function showExplanation(q) {
    dom.explanationCard.style.display = 'block';

    const correctIndices = getCorrectIndices(q);
    const correctLetters = correctIndices.map(i => GREEK_LETTERS[i] || (i + 1)).join(', ');
    const correctText = correctIndices.map(i => q.options[i]).join(' / ');

    dom.explanationAnswerPill.innerHTML = `<strong>Σωστή Απάντηση:</strong> Επιλογή ${correctLetters} (${escapeHtml(correctText)})`;

    let bodyHtml = '';
    if (q.explanation && q.explanation.trim().length > 0) {
      bodyHtml = q.explanation;
    } else {
      bodyHtml = '<p style="color:var(--text-secondary);font-style:italic;">Δεν υπάρχει διαθέσιμη επιπλέον αιτιολόγηση για αυτή την ερώτηση.</p>';
    }

    // Append image zoom hint if images exist in explanation or in q.images
    if ((q.images && q.images.length > 0) || bodyHtml.includes('<img')) {
      bodyHtml = '<div class="image-zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i> Κάντε κλικ στην εικόνα για μεγέθυνση (HD Medical Zoom)</div>' + bodyHtml;
    }

    dom.explanationBody.innerHTML = bodyHtml;

    // Notes callout
    let notes = [];
    if (q.answerChanged) {
      notes.push(`<strong>Διόρθωση Κλειδιού:</strong> Η αρχική απάντηση στο PDF ήταν "${escapeHtml(q.pdfMarkedAnswer || '')}" και διορθώθηκε σε "${escapeHtml(q.correctAnswer || '')}".`);
    }
    if (q.uncertain) {
      notes.push(`<strong>Σημείωση Αμφιβολίας:</strong> Το κλειδί της ερώτησης αυτής φέρει επιστημονική επιφύλαξη ή αμφισβήτηση.`);
    }
    if (q.answerNote) {
      notes.push(`<strong>Παρατήρηση:</strong> ${escapeHtml(q.answerNote)}`);
    }

    if (notes.length > 0) {
      dom.explanationNotesBox.style.display = 'block';
      dom.explanationNotesBox.innerHTML = notes.map(n => `<div class="alert-note-box">${n}</div>`).join('');
    } else {
      dom.explanationNotesBox.style.display = 'none';
      dom.explanationNotesBox.innerHTML = '';
    }

    // Scroll slightly if on small screens
    if (window.innerWidth < 768) {
      dom.explanationCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateStats() {
    const totalFiltered = filteredQuestions.length;
    const currentNum = totalFiltered === 0 ? 0 : currentIndex + 1;

    dom.progressCounter.textContent = `Ερώτηση ${currentNum} από ${totalFiltered}`;

    const percent = totalFiltered === 0 ? 0 : Math.round((currentNum / totalFiltered) * 100);
    dom.progressPercent.textContent = `${percent}%`;
    dom.progressBarFill.style.width = `${percent}%`;

    const correctCount = firstTryCorrectSet.size;
    const wrongCount = mistakesSet.size;
    const answeredTotal = Object.keys(userAnswers).length;

    dom.statCorrect.textContent = correctCount;
    dom.statWrong.textContent = wrongCount;
    dom.statBookmarked.textContent = starredSet.size;

    const rate = answeredTotal === 0 ? 0 : Math.round((correctCount / answeredTotal) * 100);
    dom.statRate.textContent = `${rate}%`;
  }

  function openResultsModal() {
    const answered = Object.keys(userAnswers).length;
    const correct = firstTryCorrectSet.size;
    const rate = answered === 0 ? 0 : Math.round((correct / answered) * 100);

    dom.modalScoreVal.textContent = `${rate}%`;
    dom.modalScoreDesc.textContent = `Απαντήσατε επιτυχώς με την 1η προσπάθεια ${correct} από τις ${answered} ερωτήσεις που δοκιμάσατε. Λάθη προς επανάληψη: ${mistakesSet.size}.`;
    dom.resultsModal.style.display = 'flex';
  }

  function closeResultsModal() {
    dom.resultsModal.style.display = 'none';
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

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
