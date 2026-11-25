/**
 * PROTOVATHMIA - LARNAKA AESTHETICS & HIGH-CONTRAST INTERACTIVE ENGINE
 * Supports 357 Clinical Scenarios (325 MCQs + 32 Open Questions)
 * Instant Snappy Feedback & Visual Clarity
 * By Stergios Tselkos
 */

(function () {
  'use strict';

  // Greek letters for option badges
  const GREEK_LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'];

  // Application State
  let allMasterQuestions = [];
  let bankQuestions = [];
  let filteredQuestions = [];
  let currentBank = 'mcq'; // 'mcq', 'open', 'all'
  let activeChapter = 'Όλα';
  let currentIndex = 0;
  let score = 0;
  let totalAttempts = 0;
  let questionAttempts = {}; // tracks attempts per question index

  // DOM Elements
  let quizView, categoryBadge, questionCodeBadge, questionTypeBadge;
  let questionText, optionsList, explanationPanel, explanationContent;
  let progressFill, progressText, scoreText;
  let prevBtnTop, nextBtnTop, prevBtnBottom, nextBtnBottom;
  let revealAnswerBtn, bankSelect, jumpInput;
  let quickChaptersBtn, quickChaptersOverlay, quickChaptersValue;
  let quickQuestionsBtn, quickQuestionsOverlay, quickQuestionsValue;
  let resultsModal, modalScoreVal, modalCorrectVal, modalAttemptsVal;

  /**
   * Initialize App
   */
  function init() {
    cacheDomElements();
    prepareData();
    setupEventListeners();
    setBank(currentBank);
  }

  /**
   * Cache DOM Elements
   */
  function cacheDomElements() {
    quizView = document.getElementById('quiz-view');
    categoryBadge = document.getElementById('categoryBadge');
    questionCodeBadge = document.getElementById('questionCodeBadge');
    questionTypeBadge = document.getElementById('questionTypeBadge');
    questionText = document.getElementById('questionText');
    optionsList = document.getElementById('optionsList');
    explanationPanel = document.getElementById('explanationPanel');
    explanationContent = document.getElementById('explanationContent');
    
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    scoreText = document.getElementById('scoreText');
    
    prevBtnTop = document.getElementById('prevBtnTop');
    nextBtnTop = document.getElementById('nextBtnTop');
    prevBtnBottom = document.getElementById('prevBtnBottom');
    nextBtnBottom = document.getElementById('nextBtnBottom');
    
    revealAnswerBtn = document.getElementById('revealAnswerBtn');
    bankSelect = document.getElementById('bankSelect');
    jumpInput = document.getElementById('jumpInput');
    
    quickChaptersBtn = document.getElementById('quickChaptersBtn');
    quickChaptersOverlay = document.getElementById('quickChaptersOverlay');
    quickChaptersValue = document.getElementById('quickChaptersValue');
    
    quickQuestionsBtn = document.getElementById('quickQuestionsBtn');
    quickQuestionsOverlay = document.getElementById('quickQuestionsOverlay');
    quickQuestionsValue = document.getElementById('quickQuestionsValue');

    resultsModal = document.getElementById('resultsModal');
    modalScoreVal = document.getElementById('modalScoreVal');
    modalCorrectVal = document.getElementById('modalCorrectVal');
    modalAttemptsVal = document.getElementById('modalAttemptsVal');
  }

  /**
   * Normalize & Prepare Questions from themata_protovathmias.js
   */
  function prepareData() {
    const rawMcq = window.protovathmiaQuestions || [];
    const rawOpen = window.protovathmiaOpenQuestions || [];

    const mcqList = rawMcq.map((q, idx) => ({
      id: q.id || idx + 1,
      code: q.code || `PF_MCQ_${idx + 1}`,
      chapter: q.chapter || 'Κλινικά Σενάρια',
      bookChapter: q.bookChapter || '',
      category: q.category || 'Πρωτοβάθμια Φροντίδα',
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswerIndices: Array.isArray(q.correctAnswerIndices) ? q.correctAnswerIndices.map(Number) : [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      images: Array.isArray(q.images) ? q.images : [],
      isOpen: false,
      answeredCorrectly: false,
      incorrectIndices: [],
      selectedCorrectIndices: [],
      isFirstAttempt: true
    }));

    const openList = rawOpen.map((q, idx) => ({
      id: q.id || idx + 1,
      code: q.code || `PF_OPEN_${idx + 1}`,
      chapter: q.chapter || 'Κλινικά Σενάρια',
      bookChapter: q.bookChapter || '',
      category: q.category || 'Πρωτοβάθμια Φροντίδα',
      question: q.question || '',
      options: Array.isArray(q.items) ? q.items : [],
      correctAnswerIndices: Array.isArray(q.markedIndices) ? q.markedIndices.map(Number) : [],
      correctAnswer: '',
      explanation: q.answerHtml || q.explanation || '',
      images: Array.isArray(q.images) ? q.images : [],
      isOpen: true,
      openType: q.type || 'ανάπτυξης',
      answeredCorrectly: false,
      incorrectIndices: [],
      selectedCorrectIndices: [],
      isFirstAttempt: true
    }));

    allMasterQuestions = {
      mcq: mcqList,
      open: openList,
      all: [...mcqList, ...openList]
    };
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Navigation (Synchronized Top & Bottom)
    const nextButtons = [nextBtnTop, nextBtnBottom].filter(Boolean);
    const prevButtons = [prevBtnTop, prevBtnBottom].filter(Boolean);
    nextButtons.forEach(btn => btn.addEventListener('click', handleNext));
    prevButtons.forEach(btn => btn.addEventListener('click', handlePrev));

    // Reveal Answer Button
    if (revealAnswerBtn) {
      revealAnswerBtn.addEventListener('click', handleRevealAnswer);
    }

    // Bank Selector
    if (bankSelect) {
      bankSelect.addEventListener('change', (e) => {
        setBank(e.target.value);
      });
    }

    // Jump Input
    if (jumpInput) {
      jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = parseInt(jumpInput.value.trim(), 10);
          if (!isNaN(val) && val >= 1 && val <= filteredQuestions.length) {
            renderQuestion(val - 1);
            jumpInput.blur();
          }
        }
      });
    }

    // Dropdown Toggles
    if (quickChaptersBtn && quickChaptersOverlay) {
      quickChaptersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (quickQuestionsOverlay) quickQuestionsOverlay.classList.add('hidden');
        quickChaptersOverlay.classList.toggle('hidden');
      });
    }

    if (quickQuestionsBtn && quickQuestionsOverlay) {
      quickQuestionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (quickChaptersOverlay) quickChaptersOverlay.classList.add('hidden');
        quickQuestionsOverlay.classList.toggle('hidden');
      });
    }

    // Close overlays on outside click
    document.addEventListener('click', (e) => {
      if (quickChaptersOverlay && !quickChaptersOverlay.contains(e.target) && e.target !== quickChaptersBtn && !quickChaptersBtn.contains(e.target)) {
        quickChaptersOverlay.classList.add('hidden');
      }
      if (quickQuestionsOverlay && !quickQuestionsOverlay.contains(e.target) && e.target !== quickQuestionsBtn && !quickQuestionsBtn.contains(e.target)) {
        quickQuestionsOverlay.classList.add('hidden');
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Results Modal Triggers
    const openResultsBtn = document.getElementById('openResultsBtn');
    const closeResultsBtn = document.getElementById('closeResultsBtn');
    const resetScoreBtn = document.getElementById('resetScoreBtn');
    if (openResultsBtn) openResultsBtn.addEventListener('click', openResultsModal);
    if (closeResultsBtn) closeResultsBtn.addEventListener('click', closeResultsModal);
    if (resetScoreBtn) resetScoreBtn.addEventListener('click', resetQuizScore);
  }

  /**
   * Set Bank (MCQ / Open / All)
   */
  function setBank(bankKey) {
    currentBank = bankKey || 'mcq';
    bankQuestions = allMasterQuestions[currentBank] || allMasterQuestions.mcq;
    activeChapter = 'Όλα';
    buildChaptersList();
    applyFilters();
  }

  /**
   * Build Chapter list for Quick Chapters Dropdown
   */
  function buildChaptersList() {
    if (!quickChaptersOverlay) return;

    const chaptersSet = new Set();
    bankQuestions.forEach(q => {
      if (q.chapter) chaptersSet.add(q.chapter);
    });

    const sortedChapters = Array.from(chaptersSet).sort((a, b) => {
      const numA = parseInt((a.match(/\d+/) || [9999])[0], 10);
      const numB = parseInt((b.match(/\d+/) || [9999])[0], 10);
      return numA - numB || a.localeCompare(b, 'el');
    });

    const allChapters = ['Όλα', ...sortedChapters];

    quickChaptersOverlay.innerHTML = allChapters.map(ch => {
      const count = ch === 'Όλα' ? bankQuestions.length : bankQuestions.filter(q => q.chapter === ch).length;
      const isActive = ch === activeChapter;
      return `
        <div class="overlay-chapter-item ${isActive ? 'active' : ''}" data-chapter="${escapeHtml(ch)}">
          <span>${escapeHtml(ch)}</span>
          <span style="font-size: 0.8rem; opacity: 0.75; font-weight: 700;">(${count})</span>
        </div>
      `;
    }).join('');

    // Chapter item clicks
    quickChaptersOverlay.querySelectorAll('.overlay-chapter-item').forEach(item => {
      item.addEventListener('click', () => {
        activeChapter = item.dataset.chapter;
        quickChaptersValue.textContent = activeChapter;
        quickChaptersOverlay.classList.add('hidden');
        applyFilters();
      });
    });

    if (quickChaptersValue) {
      quickChaptersValue.textContent = activeChapter;
    }
  }

  /**
   * Apply filters (Chapter)
   */
  function applyFilters() {
    if (activeChapter === 'Όλα') {
      filteredQuestions = [...bankQuestions];
    } else {
      filteredQuestions = bankQuestions.filter(q => q.chapter === activeChapter);
    }

    buildQuestionsList();
    renderQuestion(0);
  }

  /**
   * Build Questions list for Quick Questions Dropdown
   */
  function buildQuestionsList() {
    if (!quickQuestionsOverlay) return;

    quickQuestionsOverlay.innerHTML = filteredQuestions.map((q, idx) => {
      const cleanTitle = getCleanSnippet(q.question);
      const badgeIcon = q.isOpen ? '✍️' : '🎯';
      return `
        <div class="overlay-question-item ${idx === currentIndex ? 'active' : ''}" data-index="${idx}">
          <span style="font-weight: 800; color: #db2777; margin-right: 8px;">${badgeIcon} #${idx + 1} [${q.code}]</span>
          <span style="flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHtml(cleanTitle)}</span>
        </div>
      `;
    }).join('');

    quickQuestionsOverlay.querySelectorAll('.overlay-question-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        quickQuestionsOverlay.classList.add('hidden');
        renderQuestion(idx);
      });
    });
  }

  /**
   * Render Question at Index
   */
  function renderQuestion(index) {
    if (filteredQuestions.length === 0) {
      if (questionText) questionText.textContent = "Δεν βρέθηκαν ερωτήσεις για τη συγκεκριμένη επιλογή.";
      if (optionsList) optionsList.innerHTML = "";
      return;
    }

    if (index < 0) index = 0;
    if (index >= filteredQuestions.length) index = filteredQuestions.length - 1;
    currentIndex = index;

    const q = filteredQuestions[currentIndex];

    // Synchronize Question Dropdown Value
    if (quickQuestionsValue) {
      quickQuestionsValue.textContent = `#${currentIndex + 1} (${q.code}): ${getCleanSnippet(q.question)}`;
    }

    // Update active state in Question Overlay
    if (quickQuestionsOverlay) {
      quickQuestionsOverlay.querySelectorAll('.overlay-question-item').forEach(el => {
        const elIdx = parseInt(el.dataset.index, 10);
        el.classList.toggle('active', elIdx === currentIndex);
      });
    }

    // Update Badges
    if (categoryBadge) {
      categoryBadge.textContent = q.chapter || 'Πρωτοβάθμια Φροντίδα';
    }
    if (questionCodeBadge) {
      questionCodeBadge.textContent = q.code;
    }
    if (questionTypeBadge) {
      if (q.isOpen) {
        questionTypeBadge.style.display = 'inline-flex';
        questionTypeBadge.textContent = `📝 ${q.openType || 'Ανοικτή / Ανάπτυξης'}`;
      } else {
        questionTypeBadge.style.display = 'inline-flex';
        questionTypeBadge.textContent = '🎯 Πολλαπλής Επιλογής';
      }
    }

    // Render Question Text & Clinical Images
    let questionHtml = escapeHtml(q.question).replace(/\n/g, '<br>');

    // Insert Clinical Images if any
    if (Array.isArray(q.images) && q.images.length > 0) {
      questionHtml += '<div class="fig-img-wrap">';
      q.images.forEach(imgName => {
        const cleanName = imgName.replace(/^images\//, '');
        questionHtml += `<img src="images/${cleanName}" alt="Κλινική Εικόνα" class="fig-img zoomable" title="Κάντε κλικ για μεγέθυνση">`;
      });
      questionHtml += '</div>';
    }

    // Add Book Reference note if available
    if (q.bookChapter) {
      questionHtml += `<div style="margin-top: 14px; font-size: 0.88rem; color: #64748b; font-weight: 600;"><i class="fa-solid fa-book-bookmark" style="color: #ec4899; margin-right: 6px;"></i>Πηγή: ${escapeHtml(q.bookChapter)}</div>`;
    }

    if (questionText) {
      questionText.innerHTML = questionHtml;
    }

    // Render Options List
    renderOptions(q);

    // Render Explanation
    if (q.answeredCorrectly) {
      revealExplanation(q);
      if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
    } else {
      collapseExplanation();
      if (revealAnswerBtn) revealAnswerBtn.style.display = 'inline-flex';
    }

    // Update Navigation Buttons
    updateNavButtons();

    // Update Progress Bar & Score
    updateProgressBar();

    // Scroll card into view gently if needed
    if (quizView && window.innerWidth < 768) {
      quizView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Render Options for Multiple Choice or Open Question Prompts
   */
  function renderOptions(q) {
    if (!optionsList) return;
    optionsList.innerHTML = '';

    // If Open Question without choices
    if (q.isOpen && (!q.options || q.options.length === 0)) {
      const openCard = document.createElement('div');
      openCard.className = 'open-question-notice';
      openCard.style.cssText = 'background: #fdf4ff; border: 1.5px dashed #d8b4fe; border-radius: 14px; padding: 20px; text-align: center; color: #7e22ce; font-weight: 700; font-size: 1.05rem;';
      openCard.innerHTML = `
        <i class="fa-solid fa-feather-pointed" style="font-size: 1.8rem; margin-bottom: 8px; display: block; color: #9333ea;"></i>
        <span>Ερώτηση Κλινικής Ανάπτυξης / Σύντομης Απάντησης</span>
        <p style="font-size: 0.92rem; font-weight: 500; color: #64748b; margin-top: 6px;">
          Σκεφτείτε την απάντησή σας ή σημειώστε τα κλινικά σημεία και πατήστε «Εμφάνιση Απάντησης» για να δείτε την πλήρη υποδειγματική ανάλυση και διαφορική διάγνωση.
        </p>
      `;
      optionsList.appendChild(openCard);
      return;
    }

    // Render Multiple Choice Options (or Prompt Items)
    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.dataset.index = i;

      const letter = GREEK_LETTERS[i] || `${i + 1}`;
      btn.innerHTML = `
        <div class="option-badge">${letter}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
        <div class="option-icon"><i class="fa-solid fa-circle-check"></i></div>
      `;

      // Apply preserved states
      if (q.answeredCorrectly) {
        btn.disabled = true;
        if (q.correctAnswerIndices.includes(i)) {
          btn.classList.add('correct');
        } else if (q.incorrectIndices.includes(i)) {
          btn.classList.add('incorrect');
          btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        }
      } else {
        if (q.incorrectIndices.includes(i)) {
          btn.classList.add('incorrect');
          btn.disabled = true;
          btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        } else if (q.selectedCorrectIndices.includes(i)) {
          btn.classList.add('correct');
          btn.disabled = true;
        } else {
          // Interactive Instant Selection Click (Larnaka-Style)
          btn.addEventListener('click', () => handleOptionClick(i, btn, q));
        }
      }

      optionsList.appendChild(btn);
    });
  }

  /**
   * Handle Option Click - HIGH CONTRAST & INSTANT INTERACTIVE FEEDBACK
   */
  function handleOptionClick(index, btnElement, q) {
    totalAttempts++;

    // Highlight immediately as active selection
    btnElement.classList.add('selected');

    const isCorrect = q.correctAnswerIndices.includes(index);

    // If Question is Open with items and no strict correct index, treat as correct
    const treatsAsCorrect = isCorrect || (q.isOpen && q.correctAnswerIndices.length === 0);

    setTimeout(() => {
      btnElement.classList.remove('selected');

      if (treatsAsCorrect) {
        // === SUCCESS (GREEN EMERALD HIGHLIGHT) ===
        btnElement.classList.add('correct');
        btnElement.disabled = true;

        if (!q.selectedCorrectIndices.includes(index)) {
          q.selectedCorrectIndices.push(index);
        }

        // If all correct options found (or single-choice question)
        const targetCount = Math.max(1, q.correctAnswerIndices.length);
        if (q.selectedCorrectIndices.length >= targetCount || q.isOpen) {
          q.answeredCorrectly = true;

          // Increment score if answered correctly on first try without previous wrong clicks
          if (q.isFirstAttempt && q.incorrectIndices.length === 0) {
            score++;
          }

          // Disable all remaining options
          optionsList.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
          });

          // Unfold explanation
          revealExplanation(q);
          if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
        }

      } else {
        // === ERROR (RED CRIMSON + SHAKE ANIMATION) ===
        q.isFirstAttempt = false;
        if (!q.incorrectIndices.includes(index)) {
          q.incorrectIndices.push(index);
        }

        btnElement.classList.add('incorrect');
        btnElement.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        btnElement.disabled = true;

        // Add lively shake animation
        btnElement.classList.add('shake');
        btnElement.addEventListener('animationend', () => {
          btnElement.classList.remove('shake');
        }, { once: true });
      }

      updateProgressBar();
    }, 120);
  }

  /**
   * Handle "Εμφάνιση Απάντησης" (Reveal Answer Button)
   */
  function handleRevealAnswer() {
    const q = filteredQuestions[currentIndex];
    if (!q) return;

    q.answeredCorrectly = true;
    q.isFirstAttempt = false;

    // Highlight all correct options in green
    const allBtns = optionsList.querySelectorAll('.option-btn');
    allBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (q.correctAnswerIndices.includes(idx)) {
        btn.classList.add('correct');
        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      }
    });

    revealExplanation(q);
    if (revealAnswerBtn) revealAnswerBtn.style.display = 'none';
    updateProgressBar();
  }

  /**
   * Reveal Explanation Panel (Larnaka-style spacious clean card)
   */
  function revealExplanation(q) {
    if (!explanationPanel || !explanationContent) return;

    let contentHtml = '';

    // Premium Top Header for Correct Answer
    if (q.correctAnswer) {
      contentHtml += `
        <div class="protovathmia-answer-header" style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:6px solid #10b981; border-radius:12px; padding:16px 22px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; box-shadow:0 2px 8px rgba(16,185,129,0.08);">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="background:#10b981; color:#ffffff; font-weight:900; font-size:1.15rem; width:36px; height:36px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(16,185,129,0.25);">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <div style="font-size:0.75rem; font-weight:800; color:#047857; text-transform:uppercase; letter-spacing:0.8px;">Σωστή Επιλογή</div>
              <div style="font-size:1.1rem; font-weight:800; color:#064e3b; line-height:1.4;">${escapeHtml(q.correctAnswer)}</div>
            </div>
          </div>
          <div style="background:#dcfce7; color:#15803d; font-size:0.82rem; font-weight:700; padding:5px 14px; border-radius:20px; border:1px solid #bbf7d0; display:inline-flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-stethoscope"></i> Κλινική Τεκμηρίωση
          </div>
        </div>
      `;
    }

    if (q.explanation) {
      contentHtml += `<div class="explanation-body-text">${q.explanation}</div>`;
    } else if (!q.correctAnswer) {
      contentHtml += `<div style="color: #64748b; font-style: italic;">Δεν υπάρχει διαθέσιμη πρόσθετη ανάλυση για τη συγκεκριμένη ερώτηση.</div>`;
    }

    explanationContent.innerHTML = contentHtml;
    explanationPanel.classList.remove('collapsed');
  }

  /**
   * Collapse Explanation Panel
   */
  function collapseExplanation() {
    if (!explanationPanel || !explanationContent) return;
    explanationPanel.classList.add('collapsed');
    explanationContent.innerHTML = '';
  }

  /**
   * Update Navigation Buttons (Next / Prev)
   */
  function updateNavButtons() {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === filteredQuestions.length - 1;

    [prevBtnTop, prevBtnBottom].filter(Boolean).forEach(btn => {
      btn.disabled = isFirst;
    });

    [nextBtnTop, nextBtnBottom].filter(Boolean).forEach(btn => {
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = isLast ? 'Τέλος' : 'Επόμενη';
      }
    });

    if (jumpInput) {
      jumpInput.value = currentIndex + 1;
      jumpInput.max = filteredQuestions.length;
    }
  }

  /**
   * Update Progress Bar & Score Counters
   */
  function updateProgressBar() {
    const total = filteredQuestions.length;
    const current = total > 0 ? currentIndex + 1 : 0;
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `Ερώτηση ${current} από ${total}`;

    const scorePct = totalAttempts > 0 ? Math.round((score / Math.max(1, current)) * 100) : 0;
    if (scoreText) scoreText.textContent = `Σκορ: ${score} (${scorePct}%)`;
  }

  /**
   * Next Question Handler
   */
  function handleNext() {
    if (currentIndex < filteredQuestions.length - 1) {
      renderQuestion(currentIndex + 1);
    } else {
      openResultsModal();
    }
  }

  /**
   * Prev Question Handler
   */
  function handlePrev() {
    if (currentIndex > 0) {
      renderQuestion(currentIndex - 1);
    }
  }

  /**
   * Keyboard Shortcuts Handler
   */
  function handleKeyboardShortcuts(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Numbers 1-8 for Option selection
    if (e.key >= '1' && e.key <= '8') {
      const optIdx = parseInt(e.key, 10) - 1;
      const btns = optionsList.querySelectorAll('.option-btn');
      if (btns[optIdx] && !btns[optIdx].disabled) {
        btns[optIdx].click();
      }
      return;
    }

    // Navigation shortcuts: ArrowRight, ArrowLeft, N, P, Space
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === ' ' || e.key === 'Enter') {
      // If answer not revealed, reveal it; else next question
      const q = filteredQuestions[currentIndex];
      if (q && !q.answeredCorrectly && revealAnswerBtn && revealAnswerBtn.style.display !== 'none') {
        e.preventDefault();
        handleRevealAnswer();
      }
    }
  }

  /**
   * Results Modal Handlers
   */
  function openResultsModal() {
    if (!resultsModal) return;
    const currentQCount = Math.max(1, currentIndex + 1);
    const scorePct = Math.round((score / currentQCount) * 100);

    if (modalScoreVal) modalScoreVal.textContent = `${scorePct}%`;
    if (modalCorrectVal) modalCorrectVal.textContent = `${score} / ${currentQCount}`;
    if (modalAttemptsVal) modalAttemptsVal.textContent = `${totalAttempts}`;

    resultsModal.style.display = 'flex';
  }

  function closeResultsModal() {
    if (resultsModal) resultsModal.style.display = 'none';
  }

  function resetQuizScore() {
    score = 0;
    totalAttempts = 0;
    bankQuestions.forEach(q => {
      q.answeredCorrectly = false;
      q.incorrectIndices = [];
      q.selectedCorrectIndices = [];
      q.isFirstAttempt = true;
    });
    closeResultsModal();
    renderQuestion(0);
  }

  /**
   * Helpers
   */
  function getCleanSnippet(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').substring(0, 75).trim() + '...';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Self Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
