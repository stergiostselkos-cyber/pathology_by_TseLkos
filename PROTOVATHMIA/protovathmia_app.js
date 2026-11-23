/**
 * ΠΡΩΤΟΒΑΘΜΙΑ ΦΡΟΝΤΙΔΑ ΥΓΕΙΑΣ - Ερωτήσεις Πολλαπλής Επιλογής
 * Core Application Logic (Primary Health Care Master App)
 * Author: Stergios Tselkos
 */

(function() {
  'use strict';

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

  // Global State
  let currentBank = 'mcq'; // 'mcq' (325 questions), 'open' (32 questions), 'all' (357 questions)
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
  let pendingSelections = new Set();

  function getStorageKeys() {
    return {
      answers: 'proto_quiz_answers_' + currentBank,
      starred: 'proto_quiz_starred_' + currentBank
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

  // Helper to extract clean question title
  function getCleanQuestionTitle(fullText) {
    if (!fullText) return '';
    return fullText.replace(/\*/g, '').trim();
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
    if (Array.isArray(q.markedIndices)) {
      return q.markedIndices.map(x => parseInt(x, 10));
    }
    return [];
  }

  // Helper to extract clean chapter/category
  function getQuestionChapter(q) {
    if (!q) return 'Γενικά';
    return q.chapter || q.category || 'Γενικά';
  }

  // Helper to get question options
  function getQuestionOptions(q) {
    if (!q) return [];
    if (Array.isArray(q.options) && q.options.length > 0) {
      return q.options;
    }
    if (Array.isArray(q.items) && q.items.length > 0) {
      return q.items;
    }
    return [];
  }

  // DOM Elements cache
  let bankSelect, scoreVal, scorePct, totalCountVal, openResultsBtn, resetScoreBtn;
  let chapterSelect, questionSelect;
  let filterBtns, searchInput, progressFill;
  let questionCard, qBankBadge, qTypeBadge, qNumberBadge, qChapterBadge, qCodeBadge, toggleExpBtn, starBtn;
  let questionStem, optionsList, submitActionBar, checkAnswerBtn, clearSelectionBtn, feedbackBox, feedbackIcon, feedbackTitle, feedbackText;
  let firstBtn, prevBtn, nextBtn, lastBtn, randomBtn, jumpInput;
  let firstBtnBottom, prevBtnBottom, nextBtnBottom, lastBtnBottom, randomBtnBottom;
  let explanationPanel, explanationBody;
  let resultsModal, closeResultsModalBtn, modalTotalQuestions, modalAnswered, modalCorrect, modalWrong, modalSuccessRate;
  let modalViewWrongBtn, modalViewUnansweredBtn, modalResetBtn, modalCloseBtn;

  function initDOMElements() {
    bankSelect = document.getElementById('bankSelect');
    scoreVal = document.getElementById('scoreVal');
    scorePct = document.getElementById('scorePct');
    totalCountVal = document.getElementById('totalCountVal');
    openResultsBtn = document.getElementById('openResultsBtn');
    resetScoreBtn = document.getElementById('resetScoreBtn');

    chapterSelect = document.getElementById('chapterSelect');
    questionSelect = document.getElementById('questionSelect');

    filterBtns = document.querySelectorAll('.filter-btn');
    searchInput = document.getElementById('searchInput');
    progressFill = document.getElementById('progressFill');

    questionCard = document.getElementById('questionCard');
    qBankBadge = document.getElementById('qBankBadge');
    qTypeBadge = document.getElementById('qTypeBadge');
    qNumberBadge = document.getElementById('qNumberBadge');
    qChapterBadge = document.getElementById('qChapterBadge');
    qCodeBadge = document.getElementById('qCodeBadge');
    toggleExpBtn = document.getElementById('toggleExpBtn');
    starBtn = document.getElementById('starBtn');

    questionStem = document.getElementById('questionStem');
    optionsList = document.getElementById('optionsList');
    submitActionBar = document.getElementById('submitActionBar');
    checkAnswerBtn = document.getElementById('checkAnswerBtn');
    clearSelectionBtn = document.getElementById('clearSelectionBtn');
    feedbackBox = document.getElementById('feedbackBox');
    feedbackIcon = document.getElementById('feedbackIcon');
    feedbackTitle = document.getElementById('feedbackTitle');
    feedbackText = document.getElementById('feedbackText');

    firstBtn = document.getElementById('firstBtn');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    lastBtn = document.getElementById('lastBtn');
    randomBtn = document.getElementById('randomBtn');
    jumpInput = document.getElementById('jumpInput');

    firstBtnBottom = document.getElementById('firstBtnBottom');
    prevBtnBottom = document.getElementById('prevBtnBottom');
    nextBtnBottom = document.getElementById('nextBtnBottom');
    lastBtnBottom = document.getElementById('lastBtnBottom');
    randomBtnBottom = document.getElementById('randomBtnBottom');

    explanationPanel = document.getElementById('explanationPanel');
    explanationBody = document.getElementById('explanationBody');

    resultsModal = document.getElementById('resultsModal');
    closeResultsModalBtn = document.getElementById('closeResultsModalBtn');
    modalTotalQuestions = document.getElementById('modalTotalQuestions');
    modalAnswered = document.getElementById('modalAnswered');
    modalCorrect = document.getElementById('modalCorrect');
    modalWrong = document.getElementById('modalWrong');
    modalSuccessRate = document.getElementById('modalSuccessRate');

    modalViewWrongBtn = document.getElementById('modalViewWrongBtn');
    modalViewUnansweredBtn = document.getElementById('modalViewUnansweredBtn');
    modalResetBtn = document.getElementById('modalResetBtn');
    modalCloseBtn = document.getElementById('modalCloseBtn');
  }

  // Load Bank Data
  function loadBankData() {
    loadStorageData();
    showExplanationForced = false;

    const mcqSource = (typeof window !== 'undefined' && Array.isArray(window.protovathmiaQuestions)) ? window.protovathmiaQuestions :
                      (typeof protovathmiaQuestions !== 'undefined' && Array.isArray(protovathmiaQuestions)) ? protovathmiaQuestions : [];

    const openSource = (typeof window !== 'undefined' && Array.isArray(window.protovathmiaOpenQuestions)) ? window.protovathmiaOpenQuestions :
                       (typeof protovathmiaOpenQuestions !== 'undefined' && Array.isArray(protovathmiaOpenQuestions)) ? protovathmiaOpenQuestions : [];

    if (currentBank === 'mcq') {
      allQuestions = mcqSource.slice();
    } else if (currentBank === 'open') {
      allQuestions = openSource.slice();
    } else {
      allQuestions = mcqSource.concat(openSource);
    }

    // Assign guaranteed unique identifiers & global sequential indices
    allQuestions.forEach((q, idx) => {
      q._uid = 'pf_' + (q.code || ('q_' + (q.id || (idx + 1))));
      q._displayNumber = idx + 1;
    });

    if (totalCountVal) {
      totalCountVal.textContent = allQuestions.length;
    }
  }

  // Populate Chapters Dropdown
  function populateChapters() {
    if (!chapterSelect) return;
    const chaptersSet = new Set();
    allQuestions.forEach(q => {
      const ch = getQuestionChapter(q);
      if (ch) chaptersSet.add(ch.trim());
    });

    const sortedChapters = Array.from(chaptersSet).sort((a, b) => a.localeCompare(b, 'el', { numeric: true }));

    chapterSelect.innerHTML = '<option value="all">Όλα τα Κλινικά Σενάρια & Κεφάλαια (' + allQuestions.length + ')</option>';
    sortedChapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      const count = allQuestions.filter(q => getQuestionChapter(q).trim() === ch).length;
      opt.textContent = ch + ' (' + count + ')';
      chapterSelect.appendChild(opt);
    });

    chapterSelect.value = currentChapter;
  }

  // Populate Question Selector Dropdown
  function populateQuestionSelect() {
    if (!questionSelect) return;
    questionSelect.innerHTML = '';
    filteredQuestions.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = q._uid;
      let shortTitle = (q.code ? '[' + q.code + '] ' : '') + getCleanQuestionTitle(q.question);
      if (shortTitle.length > 70) {
        shortTitle = shortTitle.substring(0, 70) + '...';
      }
      opt.textContent = (idx + 1) + '. ' + shortTitle;
      questionSelect.appendChild(opt);
    });

    if (filteredQuestions[currentIndex]) {
      questionSelect.value = filteredQuestions[currentIndex]._uid;
    }
  }

  // Filter Questions based on chapter, filter status, and search
  function applyFilters() {
    filteredQuestions = allQuestions.filter(q => {
      // 1. Chapter Filter
      if (currentChapter !== 'all') {
        if (getQuestionChapter(q).trim() !== currentChapter.trim()) {
          return false;
        }
      }

      // 2. Status Filter
      const userAns = userAnswers[q._uid];
      if (currentFilter === 'unanswered') {
        if (userAns !== undefined) return false;
      } else if (currentFilter === 'wrong') {
        if (!userAns || userAns.isCorrect) return false;
      } else if (currentFilter === 'starred') {
        if (!starredSet.has(q._uid)) return false;
      }

      // 3. Search Term Filter
      if (searchTerm) {
        const normSearch = removeAccents(searchTerm.trim());
        const normQ = removeAccents(q.question || '');
        const normCode = removeAccents(q.code || '');
        const normExp = removeAccents(q.explanation || q.answerHtml || '');
        const normBook = removeAccents(q.bookChapter || '');
        const normSource = removeAccents(q.source || '');
        const normOpts = getQuestionOptions(q).map(opt => removeAccents(opt)).join(' ');

        if (!normQ.includes(normSearch) &&
            !normCode.includes(normSearch) &&
            !normExp.includes(normSearch) &&
            !normBook.includes(normSearch) &&
            !normSource.includes(normSearch) &&
            !normOpts.includes(normSearch)) {
          return false;
        }
      }

      return true;
    });

    if (currentIndex >= filteredQuestions.length) {
      currentIndex = Math.max(0, filteredQuestions.length - 1);
    }

    populateQuestionSelect();
    updateScoreStats();
    renderCurrentQuestion();
  }

  // Update Score and Progress Bar
  function updateScoreStats() {
    let answeredCount = 0;
    let correctCount = 0;

    allQuestions.forEach(q => {
      const u = userAnswers[q._uid];
      if (u !== undefined) {
        answeredCount++;
        if (u.isCorrect) correctCount++;
      }
    });

    if (scoreVal) {
      scoreVal.textContent = correctCount + ' / ' + answeredCount;
    }
    if (scorePct) {
      const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
      scorePct.textContent = pct + '%';
    }

    // Progress bar reflects current question index in filtered list
    if (progressFill) {
      const pctProg = filteredQuestions.length > 0 ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100) : 0;
      progressFill.style.width = pctProg + '%';
    }
  }

  // Render Current Question
  function renderCurrentQuestion() {
    if (!questionCard) return;

    if (filteredQuestions.length === 0) {
      questionCard.style.display = 'block';
      if (qNumberBadge) qNumberBadge.textContent = 'Ερώτηση 0 / 0';
      if (qChapterBadge) qChapterBadge.textContent = 'Κανένα αποτέλεσμα';
      if (questionStem) questionStem.innerHTML = '<div style="text-align:center; padding:40px 20px; color:#64748b;">' +
        '<i class="fa-solid fa-filter-circle-xmark" style="font-size:3rem; margin-bottom:14px; color:#ec4899;"></i>' +
        '<h3 style="margin-bottom:8px; color:#1e1b4b;">Δεν βρέθηκαν ερωτήσεις</h3>' +
        '<p>Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης, το κεφάλαιο ή την κατάσταση ερωτήσεων.</p>' +
        '</div>';
      if (optionsList) optionsList.innerHTML = '';
      if (submitActionBar) submitActionBar.style.display = 'none';
      if (feedbackBox) feedbackBox.classList.remove('active', 'correct', 'wrong');
      if (explanationPanel) explanationPanel.classList.remove('active');
      return;
    }

    const q = filteredQuestions[currentIndex];
    const u = userAnswers[q._uid];
    const isAnswered = (u !== undefined);

    // Badges
    if (qBankBadge) {
      qBankBadge.textContent = (currentBank === 'open') ? 'Θέματα Ανάπτυξης' : 'Πρωτοβάθμια Φροντίδα';
    }

    if (qTypeBadge) {
      if (q.type) {
        qTypeBadge.style.display = 'inline-flex';
        qTypeBadge.textContent = q.type;
      } else {
        qTypeBadge.style.display = 'none';
      }
    }

    if (qNumberBadge) {
      qNumberBadge.textContent = 'Ερώτηση ' + (currentIndex + 1) + ' από ' + filteredQuestions.length + ' (PF #' + q.sequence + ')';
    }

    if (qChapterBadge) {
      qChapterBadge.textContent = getQuestionChapter(q);
      qChapterBadge.title = getQuestionChapter(q);
    }

    if (qCodeBadge) {
      qCodeBadge.textContent = q.code || '';
      qCodeBadge.style.display = q.code ? 'inline-flex' : 'none';
    }

    // Star state
    if (starBtn) {
      const isStarred = starredSet.has(q._uid);
      starBtn.classList.toggle('active', isStarred);
      starBtn.innerHTML = isStarred ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }

    // Meta tags row: bookChapter, source
    let metaTagsHtml = '';
    if (q.bookChapter) {
      metaTagsHtml += '<span class="q-source-tag"><i class="fa-solid fa-book-open"></i> ' + q.bookChapter + '</span>';
    }
    if (q.source) {
      metaTagsHtml += '<span class="q-source-tag q-source-exam"><i class="fa-solid fa-calendar-check"></i> Εξεταστική ' + q.source + '</span>';
    }
    if (q.subcategory && q.subcategory !== q.chapter) {
      metaTagsHtml += '<span class="q-source-tag q-source-subcat"><i class="fa-solid fa-folder-open"></i> ' + q.subcategory + '</span>';
    }

    // Question Images
    let imagesHtml = '';
    const qImages = q.questionImages || q.images || [];
    if (Array.isArray(qImages) && qImages.length > 0) {
      imagesHtml += '<div class="question-images-grid" style="display:flex; flex-wrap:wrap; gap:16px; margin:16px 0;">';
      qImages.forEach(img => {
        const fileName = (typeof img === 'string') ? img : (img.file || '');
        if (fileName) {
          const imgSrc = 'images/' + fileName.replace(/^images\//, '');
          imagesHtml += '<div class="q-img-card" style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.06); max-width:320px;">' +
            '<img src="' + imgSrc + '" alt="Κλινική Εικόνα" class="zoomable-image" style="width:100%; display:block; cursor:zoom-in;" onclick="window.openHDZoomModal ? window.openHDZoomModal(this.src) : window.open(this.src)">' +
            '<div style="padding:6px 10px; font-size:0.8rem; color:#64748b; text-align:center; background:#f8fafc; border-top:1px solid #f1f5f9;"><i class="fa-solid fa-magnifying-glass-plus"></i> Κάντε κλικ για μεγέθυνση</div>' +
            '</div>';
        }
      });
      imagesHtml += '</div>';
    }

    // Stem rendering
    if (questionStem) {
      questionStem.innerHTML = (metaTagsHtml ? '<div class="q-extra-tags" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">' + metaTagsHtml + '</div>' : '') +
        '<div class="stem-text">' + q.question + '</div>' + imagesHtml;
    }

    // Options rendering
    const options = getQuestionOptions(q);
    const correctIndices = getCorrectIndices(q);
    const isMultiChoice = correctIndices.length > 1;

    if (optionsList) {
      optionsList.innerHTML = '';

      if (options.length === 0) {
        // Open question without options (ανάπτυξης/σύντομης)
        optionsList.innerHTML = '<div class="open-question-notice" style="background:#fdf4ff; border:1px solid #f0abfc; padding:16px 20px; border-radius:14px; margin:16px 0; color:#701a75;">' +
          '<i class="fa-solid fa-pen-fancy" style="font-size:1.4rem; margin-right:8px; color:#ec4899;"></i> ' +
          '<strong>Θέμα Ανάπτυξης / Σύντομης Απάντησης</strong>' +
          '<p style="margin-top:8px; font-size:0.95rem; color:#475569;">Μελετήστε το ερώτημα και πατήστε «Ανάλυση / Επεξήγηση» για να δείτε τα βασικά κλινικά σημεία και την πλήρη απάντηση.</p>' +
          '</div>';
        if (submitActionBar) submitActionBar.style.display = 'none';
      } else {
        // Multiple choice question
        if (submitActionBar) submitActionBar.style.display = 'flex';

        options.forEach((optText, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D, E...
          const optDiv = document.createElement('div');
          optDiv.className = 'option-item';
          optDiv.dataset.index = optIdx;

          // Selection state
          const isPending = pendingSelections.has(optIdx);
          const isSelected = isAnswered && u.selectedIndices && u.selectedIndices.includes(optIdx);

          if (isPending || isSelected) {
            optDiv.classList.add('selected');
          }

          if (isAnswered) {
            optDiv.classList.add('locked');
            if (correctIndices.includes(optIdx)) {
              optDiv.classList.add('correct');
            } else if (isSelected) {
              optDiv.classList.add('wrong');
            }
          }

          const indicator = document.createElement('span');
          indicator.className = 'option-letter ' + (isMultiChoice ? 'checkbox-style' : 'radio-style');
          indicator.textContent = letter;

          const textSpan = document.createElement('span');
          textSpan.className = 'option-text';
          textSpan.innerHTML = optText;

          optDiv.appendChild(indicator);
          optDiv.appendChild(textSpan);

          // Click handler for selection
          optDiv.addEventListener('click', () => {
            if (isAnswered) return;

            if (isMultiChoice) {
              if (pendingSelections.has(optIdx)) {
                pendingSelections.delete(optIdx);
              } else {
                pendingSelections.add(optIdx);
              }
            } else {
              pendingSelections.clear();
              pendingSelections.add(optIdx);
            }

            // Update UI selection
            optionsList.querySelectorAll('.option-item').forEach((el, idx) => {
              el.classList.toggle('selected', pendingSelections.has(idx));
            });

            if (checkAnswerBtn) {
              checkAnswerBtn.disabled = (pendingSelections.size === 0);
            }
            if (clearSelectionBtn) {
              clearSelectionBtn.style.display = (pendingSelections.size > 0) ? 'inline-flex' : 'none';
            }
          });

          optionsList.appendChild(optDiv);
        });
      }
    }

    // Submit Action Bar buttons state
    if (checkAnswerBtn) {
      if (isAnswered) {
        checkAnswerBtn.disabled = true;
        checkAnswerBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> <span>Απαντήθηκε</span>';
      } else {
        checkAnswerBtn.disabled = (pendingSelections.size === 0);
        checkAnswerBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i> <span>Έλεγχος Απάντησης</span>';
      }
    }

    if (clearSelectionBtn) {
      clearSelectionBtn.style.display = (!isAnswered && pendingSelections.size > 0) ? 'inline-flex' : 'none';
    }

    // Feedback Box
    if (feedbackBox) {
      if (isAnswered) {
        feedbackBox.classList.add('active');
        if (u.isCorrect) {
          feedbackBox.classList.remove('wrong');
          feedbackBox.classList.add('correct');
          if (feedbackIcon) feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          if (feedbackTitle) feedbackTitle.textContent = 'Συγχαρητήρια! Σωστή Απάντηση 🎉';
          if (feedbackText) feedbackText.textContent = 'Επιλέξατε την ορθή απάντηση.';
        } else {
          feedbackBox.classList.remove('correct');
          feedbackBox.classList.add('wrong');
          if (feedbackIcon) feedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
          if (feedbackTitle) feedbackTitle.textContent = 'Μη ορθή απάντηση';
          const correctLetters = correctIndices.map(i => String.fromCharCode(65 + i)).join(', ');
          if (feedbackText) feedbackText.textContent = 'Η σωστή επιλογή είναι: ' + (correctLetters || 'βλέπε επεξήγηση') + '.';
        }
      } else {
        feedbackBox.classList.remove('active', 'correct', 'wrong');
      }
    }

    // Explanation Box
    renderExplanation(q, isAnswered);

    // Update Question Select Dropdown value
    if (questionSelect) {
      questionSelect.value = q._uid;
    }

    // Update Jump input
    if (jumpInput) {
      jumpInput.value = (currentIndex + 1);
    }

    // Trigger MathJax typesetting if available
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([questionCard]).catch(() => {});
    }
  }

  // Render Explanation Box
  function renderExplanation(q, isAnswered) {
    if (!explanationPanel || !explanationBody) return;

    const shouldShow = showExplanationForced || isAnswered || (optionsList && optionsList.children.length === 0);

    if (shouldShow) {
      let expHtml = '';

      if (q.correctAnswer) {
        expHtml += '<div class="exp-correct-highlight" style="background:#f0fdf4; border-left:4px solid #16a34a; padding:12px 16px; border-radius:8px; margin-bottom:14px; font-weight:600; color:#14532d;">' +
          '<i class="fa-solid fa-check-circle" style="color:#16a34a; margin-right:6px;"></i> Ορθή Απάντηση: ' + q.correctAnswer +
          '</div>';
      }

      if (q.explanation && q.explanation.trim()) {
        expHtml += '<div class="exp-content" style="line-height:1.65; color:#1e293b;">' + q.explanation + '</div>';
      }

      if (q.answerHtml && q.answerHtml.trim()) {
        expHtml += '<div class="exp-open-answer" style="line-height:1.65; margin-top:12px; color:#1e293b;">' + q.answerHtml + '</div>';
      }

      if (!expHtml.trim()) {
        expHtml = '<div style="color:#64748b; font-style:italic;">Δεν υπάρχει διαθέσιμη πρόσθετη επεξήγηση για τη συγκεκριμένη ερώτηση.</div>';
      }

      explanationBody.innerHTML = expHtml;
      explanationPanel.classList.add('active');
    } else {
      explanationPanel.classList.remove('active');
    }
  }

  // Check Answer Handler
  function handleCheckAnswer() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (userAnswers[q._uid] !== undefined) return;
    if (pendingSelections.size === 0) return;

    const correctIndices = getCorrectIndices(q);
    const selectedArr = Array.from(pendingSelections).sort((a, b) => a - b);
    const isCorrect = (selectedArr.length === correctIndices.length) &&
                      selectedArr.every((val, idx) => val === correctIndices[idx]);

    userAnswers[q._uid] = {
      selectedIndices: selectedArr,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    saveAnswers();
    pendingSelections.clear();
    showExplanationForced = true;

    updateScoreStats();
    renderCurrentQuestion();
  }

  // Clear Selection Handler
  function handleClearSelection() {
    pendingSelections.clear();
    if (optionsList) {
      optionsList.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
    }
    if (checkAnswerBtn) checkAnswerBtn.disabled = true;
    if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
  }

  // Toggle Star Handler
  function handleToggleStar() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    if (starredSet.has(q._uid)) {
      starredSet.delete(q._uid);
    } else {
      starredSet.add(q._uid);
    }
    saveStarred();

    if (starBtn) {
      const isStarred = starredSet.has(q._uid);
      starBtn.classList.toggle('active', isStarred);
      starBtn.innerHTML = isStarred ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
  }

  // Jump to Question by Index
  function goToIndex(idx) {
    if (filteredQuestions.length === 0) return;
    if (idx < 0) idx = 0;
    if (idx >= filteredQuestions.length) idx = filteredQuestions.length - 1;

    currentIndex = idx;
    pendingSelections.clear();
    showExplanationForced = false;
    renderCurrentQuestion();
    window.scrollToQuestionTop();
  }

  // Jump to Question by ID or Sequence
  function jumpToQuestionId(qNum) {
    const foundIdx = filteredQuestions.findIndex(q => (q.id === qNum || q.sequence === qNum || q._displayNumber === qNum));
    if (foundIdx !== -1) {
      goToIndex(foundIdx);
    }
  }

  // Bind All Event Listeners
  function bindEvents() {
    // 1. Bank Change
    if (bankSelect) {
      bankSelect.addEventListener('change', (e) => {
        currentBank = e.target.value;
        currentChapter = 'all';
        currentIndex = 0;
        pendingSelections.clear();
        showExplanationForced = false;
        loadBankData();
        populateChapters();
        applyFilters();
      });
    }

    // 2. Chapter Change
    if (chapterSelect) {
      chapterSelect.addEventListener('change', (e) => {
        currentChapter = e.target.value;
        currentIndex = 0;
        pendingSelections.clear();
        showExplanationForced = false;
        applyFilters();
      });
    }

    // 3. Question Select
    if (questionSelect) {
      questionSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const foundIdx = filteredQuestions.findIndex(q => q._uid === val);
        if (foundIdx !== -1) {
          goToIndex(foundIdx);
        }
      });
    }

    // 4. Status Filter Buttons
    if (filterBtns) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.dataset.filter || 'all';
          currentIndex = 0;
          pendingSelections.clear();
          showExplanationForced = false;
          applyFilters();
        });
      });
    }

    // 5. Search Input
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchTerm = e.target.value;
          currentIndex = 0;
          pendingSelections.clear();
          showExplanationForced = false;
          applyFilters();
        }, 220);
      });
    }

    // 6. Action Buttons
    if (checkAnswerBtn) checkAnswerBtn.addEventListener('click', handleCheckAnswer);
    if (clearSelectionBtn) clearSelectionBtn.addEventListener('click', handleClearSelection);
    if (starBtn) starBtn.addEventListener('click', handleToggleStar);
    if (toggleExpBtn) {
      toggleExpBtn.addEventListener('click', () => {
        showExplanationForced = !showExplanationForced;
        if (filteredQuestions[currentIndex]) {
          renderExplanation(filteredQuestions[currentIndex], userAnswers[filteredQuestions[currentIndex]._uid] !== undefined);
        }
      });
    }

    // 7. Nav Buttons (Top & Bottom)
    const prevAction = () => { if (currentIndex > 0) goToIndex(currentIndex - 1); };
    const nextAction = () => { if (currentIndex < filteredQuestions.length - 1) goToIndex(currentIndex + 1); };
    const firstAction = () => { goToIndex(0); };
    const lastAction = () => { if (filteredQuestions.length > 0) goToIndex(filteredQuestions.length - 1); };
    const randomAction = () => {
      if (filteredQuestions.length <= 1) return;
      let randIdx = Math.floor(Math.random() * filteredQuestions.length);
      if (randIdx === currentIndex) randIdx = (randIdx + 1) % filteredQuestions.length;
      goToIndex(randIdx);
    };

    if (prevBtn) prevBtn.addEventListener('click', prevAction);
    if (prevBtnBottom) prevBtnBottom.addEventListener('click', prevAction);
    if (nextBtn) nextBtn.addEventListener('click', nextAction);
    if (nextBtnBottom) nextBtnBottom.addEventListener('click', nextAction);
    if (firstBtn) firstBtn.addEventListener('click', firstAction);
    if (firstBtnBottom) firstBtnBottom.addEventListener('click', firstAction);
    if (lastBtn) lastBtn.addEventListener('click', lastAction);
    if (lastBtnBottom) lastBtnBottom.addEventListener('click', lastAction);
    if (randomBtn) randomBtn.addEventListener('click', randomAction);
    if (randomBtnBottom) randomBtnBottom.addEventListener('click', randomAction);

    // 8. Jump Input
    if (jumpInput) {
      jumpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = parseInt(jumpInput.value, 10);
          if (!isNaN(val) && val >= 1 && val <= filteredQuestions.length) {
            goToIndex(val - 1);
          }
        }
      });
    }

    // 9. Results Modal
    if (openResultsBtn) {
      openResultsBtn.addEventListener('click', () => {
        if (!resultsModal) return;
        let answered = 0, correct = 0, wrong = 0;
        allQuestions.forEach(q => {
          const u = userAnswers[q._uid];
          if (u !== undefined) {
            answered++;
            if (u.isCorrect) correct++;
            else wrong++;
          }
        });

        if (modalTotalQuestions) modalTotalQuestions.textContent = allQuestions.length;
        if (modalAnswered) modalAnswered.textContent = answered;
        if (modalCorrect) modalCorrect.textContent = correct;
        if (modalWrong) modalWrong.textContent = wrong;
        if (modalSuccessRate) {
          const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
          modalSuccessRate.textContent = pct + '%';
        }

        resultsModal.classList.add('active');
      });
    }

    if (closeResultsModalBtn) {
      closeResultsModalBtn.addEventListener('click', () => resultsModal.classList.remove('active'));
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => resultsModal.classList.remove('active'));
    }

    if (modalViewWrongBtn) {
      modalViewWrongBtn.addEventListener('click', () => {
        resultsModal.classList.remove('active');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'wrong'));
        currentFilter = 'wrong';
        currentIndex = 0;
        applyFilters();
      });
    }

    if (modalViewUnansweredBtn) {
      modalViewUnansweredBtn.addEventListener('click', () => {
        resultsModal.classList.remove('active');
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'unanswered'));
        currentFilter = 'unanswered';
        currentIndex = 0;
        applyFilters();
      });
    }

    // 10. Reset Score
    const performReset = () => {
      if (confirm('Είστε σίγουροι ότι θέλετε να μηδενίσετε το σκορ και τις απαντήσεις σας σε αυτή την τράπεζα;')) {
        userAnswers = {};
        saveAnswers();
        pendingSelections.clear();
        showExplanationForced = false;
        if (resultsModal) resultsModal.classList.remove('active');
        updateScoreStats();
        renderCurrentQuestion();
      }
    };

    if (resetScoreBtn) resetScoreBtn.addEventListener('click', performReset);
    if (modalResetBtn) modalResetBtn.addEventListener('click', performReset);

    // 11. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'ArrowLeft') {
        prevAction();
      } else if (e.key === 'ArrowRight') {
        nextAction();
      } else if (e.key >= '1' && e.key <= '9') {
        const optIdx = parseInt(e.key, 10) - 1;
        const options = getQuestionOptions(filteredQuestions[currentIndex]);
        if (optIdx < options.length) {
          const optEl = optionsList.children[optIdx];
          if (optEl) optEl.click();
        }
      } else if (e.key === 'Enter') {
        if (!checkAnswerBtn.disabled) {
          handleCheckAnswer();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (toggleExpBtn) toggleExpBtn.click();
      } else if (e.key.toLowerCase() === 's') {
        handleToggleStar();
      }
    });
  }

  // Init Application
  document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const reqBank = urlParams.get('bank');
    if (reqBank && (reqBank === 'mcq' || reqBank === 'open' || reqBank === 'all')) {
      currentBank = reqBank;
      if (bankSelect) bankSelect.value = reqBank;
    }

    loadBankData();
    populateChapters();
    bindEvents();
    applyFilters();

    // Check direct jump
    const targetQId = urlParams.get('qId') || urlParams.get('id') || urlParams.get('q');
    if (targetQId) {
      const qNum = parseInt(targetQId, 10);
      if (!isNaN(qNum)) {
        jumpToQuestionId(qNum);
      }
    }
  });

})();
