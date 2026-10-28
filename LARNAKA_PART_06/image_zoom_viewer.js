/**
 * Medical HD Zoom Inspector (Images, Tables & Charts/Graphs)
 * Unified Interactive Viewer supporting:
 * - High-Resolution Images (Pan, Zoom, HD Presets)
 * - Clinical Tables (Full styling, Zoom, Pan, Contrast & Spacing)
 * - SVG Diagrams & Graphs
 * - Mouse Wheel Zoom, Pointer Drag & Pan, Touch Pinch-to-Zoom, Presets (Fit, 100%, 150%, 200%, 300%), Fullscreen, Keyboard Shortcuts
 */
(function() {
  'use strict';

  let modal, stage, imgEl, customEl, titleEl, badgeEl, zoomIndEl, resEl;
  let presetBtns = {};
  
  let scale = 1;
  let tx = 0, ty = 0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let activeType = 'image'; // 'image' | 'custom'
  
  // Pinch-to-zoom touch state
  let initialPinchDist = null;
  let initialPinchScale = 1;

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 8.0;

  function buildModal() {
    if (modal) return;

    modal = document.createElement('div');
    modal.className = 'med-zoom-modal';
    modal.id = 'med-zoom-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="med-zoom-toolbar">
        <div class="med-zoom-title-group">
          <span class="med-zoom-badge" id="mzv-badge">ΙΑΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ</span>
          <span class="med-zoom-title" id="mzv-title">Τίτλος Προβολής</span>
        </div>

        <div class="med-zoom-actions">
          <button type="button" class="med-zoom-btn" id="mzv-btn-out" title="Σμίκρυνση (Πλήκτρο -)">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2.5" d="M5 12h14"/></svg>
            <span>−</span>
          </button>
          
          <span class="med-zoom-indicator" id="mzv-indicator">100%</span>

          <button type="button" class="med-zoom-btn" id="mzv-btn-in" title="Μεγέθυνση (Πλήκτρο +)">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2.5" d="M12 5v14M5 12h14"/></svg>
            <span>+</span>
          </button>

          <!-- Presets -->
          <button type="button" class="med-zoom-btn btn-preset" data-preset="fit" title="Προσαρμογή στην Οθόνη">Fit</button>
          <button type="button" class="med-zoom-btn btn-preset" data-preset="1" title="Φυσικό Μέγεθος (100%)">100%</button>
          <button type="button" class="med-zoom-btn btn-preset" data-preset="1.5" title="Μεγέθυνση 150%">150%</button>
          <button type="button" class="med-zoom-btn btn-preset" data-preset="2" title="Μεγέθυνση 200%">200%</button>
          <button type="button" class="med-zoom-btn btn-preset" data-preset="3" title="Μεγέθυνση 300%">300%</button>

          <!-- Reset -->
          <button type="button" class="med-zoom-btn" id="mzv-btn-reset" title="Επαναφορά (Πλήκτρο 0)">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Επαναφορά</span>
          </button>

          <!-- Fullscreen -->
          <button type="button" class="med-zoom-btn" id="mzv-btn-fullscreen" title="Πλήρης Οθόνη">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
          </button>

          <!-- Close -->
          <button type="button" class="med-zoom-btn btn-close" id="mzv-btn-close" title="Κλείσιμο (Esc)">
            ✕
          </button>
        </div>
      </div>

      <div class="med-zoom-stage" id="mzv-stage">
        <img id="mzv-img" class="med-zoom-img" src="" alt="Medical Diagram" draggable="false" style="display:none;" />
        <div id="mzv-custom" class="med-zoom-custom-wrap" style="display:none;"></div>
      </div>

      <div class="med-zoom-footer">
        <div class="med-zoom-hints">
          <span>🖱️ <b>Ροδέλα:</b> Ζουμ</span>
          <span>👆 <b>Σύρσιμο:</b> Μετακίνηση</span>
          <span>⚡ <b>Διπλό Κλικ:</b> 200% / Fit</span>
          <span>⌨️ <kbd>+</kbd> <kbd>−</kbd> <kbd>0</kbd> <kbd>Esc</kbd></span>
        </div>
        <div style="font-weight:600; color:#38bdf8;" id="mzv-res-info">
          Υψηλή Ανάλυση (HD)
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    stage = document.getElementById('mzv-stage');
    imgEl = document.getElementById('mzv-img');
    customEl = document.getElementById('mzv-custom');
    titleEl = document.getElementById('mzv-title');
    badgeEl = document.getElementById('mzv-badge');
    zoomIndEl = document.getElementById('mzv-indicator');
    resEl = document.getElementById('mzv-res-info');

    // Button Listeners
    document.getElementById('mzv-btn-in').addEventListener('click', () => zoomBy(1.25));
    document.getElementById('mzv-btn-out').addEventListener('click', () => zoomBy(1 / 1.25));
    document.getElementById('mzv-btn-reset').addEventListener('click', resetTransform);
    document.getElementById('mzv-btn-close').addEventListener('click', closeZoom);
    document.getElementById('mzv-btn-fullscreen').addEventListener('click', toggleFullscreen);

    modal.querySelectorAll('.btn-preset').forEach(btn => {
      const p = btn.dataset.preset;
      presetBtns[p] = btn;
      btn.addEventListener('click', () => {
        if (p === 'fit') {
          resetTransform();
        } else {
          setZoom(parseFloat(p));
        }
      });
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === stage || e.target === modal) {
        closeZoom();
      }
    });

    // Mouse Wheel Zoom centered on pointer
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      const px = e.clientX - rect.left - rect.width / 2;
      const py = e.clientY - rect.top - rect.height / 2;
      zoomAt(factor, px, py);
    }, { passive: false });

    // Double click to toggle zoom
    stage.addEventListener('dblclick', (e) => {
      const rect = stage.getBoundingClientRect();
      const px = e.clientX - rect.left - rect.width / 2;
      const py = e.clientY - rect.top - rect.height / 2;
      if (scale > 1.2) {
        resetTransform();
      } else {
        zoomAt(2.0, px, py);
      }
    });

    // Pointer Drag & Pan
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX - tx;
      startY = e.clientY - ty;
      stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      tx = e.clientX - startX;
      ty = e.clientY - startY;
      applyTransform();
    });

    const stopDrag = () => { isDragging = false; };
    stage.addEventListener('pointerup', stopDrag);
    stage.addEventListener('pointercancel', stopDrag);

    // Touch Pinch-to-Zoom
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialPinchScale = scale;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialPinchScale * (dist / initialPinchDist)));
        scale = nextScale;
        applyTransform();
      }
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialPinchDist = null;
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeZoom();
      else if (e.key === '+' || e.key === '=') zoomBy(1.25);
      else if (e.key === '-') zoomBy(1 / 1.25);
      else if (e.key === '0' || e.key.toLowerCase() === 'r') resetTransform();
      else if (e.key === 'ArrowLeft') { tx += 40; applyTransform(); }
      else if (e.key === 'ArrowRight') { tx -= 40; applyTransform(); }
      else if (e.key === 'ArrowUp') { ty += 40; applyTransform(); }
      else if (e.key === 'ArrowDown') { ty -= 40; applyTransform(); }
    });
  }

  function applyTransform() {
    const activeEl = (activeType === 'image') ? imgEl : customEl;
    if (activeEl) {
      activeEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    if (zoomIndEl) {
      zoomIndEl.textContent = `${Math.round(scale * 100)}%`;
    }
    
    // Update preset button active states
    Object.keys(presetBtns).forEach(k => {
      const btn = presetBtns[k];
      if (!btn) return;
      if (k === 'fit' && Math.abs(scale - 1) < 0.05 && tx === 0 && ty === 0) {
        btn.classList.add('active');
      } else if (Math.abs(parseFloat(k) - scale) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function zoomAt(factor, px, py) {
    const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (nextScale === scale) return;

    tx = px - (px - tx) * (nextScale / scale);
    ty = py - (py - ty) * (nextScale / scale);
    scale = nextScale;

    if (scale <= 1.01 && Math.abs(tx) < 10 && Math.abs(ty) < 10) {
      tx = 0;
      ty = 0;
    }
    applyTransform();
  }

  function zoomBy(factor) {
    zoomAt(factor, 0, 0);
  }

  function setZoom(targetScale) {
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale));
    tx = 0;
    ty = 0;
    applyTransform();
  }

  function resetTransform() {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      modal?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function openImageZoom(src, title, badge) {
    buildModal();
    activeType = 'image';
    customEl.style.display = 'none';
    customEl.innerHTML = '';

    imgEl.style.display = 'block';
    imgEl.src = src;
    imgEl.alt = title || 'Medical Diagram';
    titleEl.textContent = title || 'Ιατρικό Διάγραμμα';
    if (badgeEl) badgeEl.textContent = badge || 'ΙΑΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ';

    imgEl.onload = () => {
      if (resEl && imgEl.naturalWidth) {
        resEl.textContent = `Ανάλυση: ${imgEl.naturalWidth} × ${imgEl.naturalHeight} px (Full HD)`;
      }
    };

    resetTransform();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openCustomZoom(elementOrHtml, title, badge) {
    buildModal();
    activeType = 'custom';
    imgEl.style.display = 'none';
    imgEl.src = '';

    customEl.style.display = 'block';
    customEl.innerHTML = '';

    let contentNode;
    if (typeof elementOrHtml === 'string') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = elementOrHtml;
      contentNode = wrapper.firstElementChild || wrapper;
    } else if (elementOrHtml && elementOrHtml.nodeType) {
      contentNode = elementOrHtml.cloneNode(true);
    }

    if (contentNode) {
      // Remove any internal zoom triggers from the clone to prevent recursive buttons
      contentNode.querySelectorAll('.med-table-zoom-pill, .btn-table-zoom-trigger, .table-zoom-toolbar, .table-viewer-header').forEach(el => el.remove());
      
      // If table, ensure full visibility & styling
      if (contentNode.tagName === 'TABLE' || contentNode.querySelector('table')) {
        const tbl = contentNode.tagName === 'TABLE' ? contentNode : contentNode.querySelector('table');
        if (tbl) {
          tbl.classList.add('med-zoom-table-active');
          tbl.style.cursor = 'default';
        }
      }
      customEl.appendChild(contentNode);
    }

    titleEl.textContent = title || 'Κλινικός Πίνακας / Γράφημα';
    if (badgeEl) badgeEl.textContent = badge || 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ / ΓΡΑΦΗΜΑ';
    if (resEl) resEl.textContent = 'Διαδραστική Προβολή HD (Zoom & Pan)';

    resetTransform();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeZoom() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // Global exposure
  window.openMedZoom = function(target, title, badge) {
    if (!target) return;

    // String URL of image
    if (typeof target === 'string') {
      if (target.trim().startsWith('<')) {
        openCustomZoom(target, title, badge || 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
      } else {
        openImageZoom(target, title, badge || 'ΙΑΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ');
      }
      return;
    }

    // Direct Image Element
    if (target.tagName === 'IMG') {
      openImageZoom(target.src, title || target.alt, badge || 'ΙΑΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ');
      return;
    }

    // Direct Table Element
    if (target.tagName === 'TABLE') {
      openCustomZoom(target, title || target.getAttribute('data-title') || target.querySelector('caption, th')?.textContent?.trim(), badge || 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
      return;
    }

    // Table container (e.g. .scroll with table)
    if (target.querySelector && target.querySelector('table')) {
      const tbl = target.querySelector('table');
      openCustomZoom(tbl, title || tbl.getAttribute('data-title') || tbl.querySelector('caption, th')?.textContent?.trim(), badge || 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
      return;
    }

    // SVG Graph / Diagram
    if (target.tagName === 'svg' || (target.querySelector && target.querySelector('svg'))) {
      const svgEl = target.tagName === 'svg' ? target : target.querySelector('svg');
      openCustomZoom(svgEl, title || 'Ιατρικό Γράφημα', badge || 'ΙΑΤΡΙΚΟ ΓΡΑΦΗΜΑ');
      return;
    }

    // Container with image
    if (target.closest) {
      const container = target.closest('.embedded-image-container, .photo-card, .image-wrapper, .case-fig');
      const img = container?.querySelector('img');
      if (img) {
        openImageZoom(img.src, title || img.alt || container.querySelector('.card-title, .image-title, figcaption')?.textContent?.trim(), badge || 'ΙΑΤΡΙΚΟ ΔΙΑΓΡΑΜΜΑ');
        return;
      }

      // Container with table
      const tblContainer = target.closest('.table-container, .ch8-table-wrap, .scroll');
      const tbl = tblContainer?.querySelector('table') || target.closest('table');
      if (tbl) {
        openCustomZoom(tbl, title || tbl.getAttribute('data-title') || tbl.querySelector('caption, th')?.textContent?.trim(), badge || 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
        return;
      }
    }
  };

  window.closeMedZoom = closeZoom;

  // Auto-decorate all tables and charts across the page with zoom pill
  function decorateTablesAndGraphs() {
    // 1. Process all tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (table.closest('#med-zoom-modal') || table.dataset.medZoomReady === 'true') {
        return;
      }
      table.dataset.medZoomReady = 'true';
      table.classList.add('med-zoomable');
      table.title = table.title || 'Κάντε κλικ ή χρησιμοποιήστε το κουμπί για μεγέθυνση σε πλήρη οθόνη (HD Zoom)';

      // Check if parent already has zoom pill
      const parent = table.parentElement;
      if (!parent.querySelector('.med-table-zoom-pill')) {
        const pill = document.createElement('div');
        pill.className = 'med-table-zoom-pill';
        pill.innerHTML = `
          <button type="button" class="btn-med-zoom-table" title="Μεγέθυνση Πίνακα σε HD Inspector">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style="vertical-align:-2px"><path stroke="currentColor" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
            <span>HD Zoom Πίνακα</span>
          </button>
        `;
        table.parentNode.insertBefore(pill, table);
      }
    });

    // 2. Process all standalone SVG diagrams / charts
    const graphs = document.querySelectorAll('.chart-container, .graph-container, .med-graph');
    graphs.forEach(graph => {
      if (graph.closest('#med-zoom-modal') || graph.dataset.medZoomReady === 'true') {
        return;
      }
      graph.dataset.medZoomReady = 'true';
      graph.classList.add('med-zoomable');
      graph.title = 'Κάντε κλικ για μεγέθυνση γραφήματος σε πλήρη οθόνη (HD Zoom)';
    });
  }

  // Periodic and MutationObserver scanner for dynamically injected content (explanations, etc.)
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', decorateTablesAndGraphs);
    setInterval(decorateTablesAndGraphs, 1500);

    const domObserver = new MutationObserver(() => {
      decorateTablesAndGraphs();
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // Global delegated click listener for automatic binding
  document.addEventListener('click', (e) => {
    // 1. Table zoom pill or table click
    const tablePill = e.target.closest('.btn-med-zoom-table');
    if (tablePill) {
      e.preventDefault();
      e.stopPropagation();
      const parentWrap = tablePill.closest('.med-table-zoom-pill');
      const table = parentWrap?.nextElementSibling?.tagName === 'TABLE' ? parentWrap.nextElementSibling : parentWrap?.parentElement?.querySelector('table');
      if (table) {
        window.openMedZoom(table, table.getAttribute('data-title') || table.querySelector('caption, th')?.textContent?.trim(), 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
        return;
      }
    }

    // Direct Table click (if user clicks directly on any table)
    const directTable = e.target.closest('table.med-zoomable, table.zoomable-table');
    if (directTable && !directTable.closest('#med-zoom-modal') && !e.target.closest('button, a, input, select')) {
      e.preventDefault();
      window.openMedZoom(directTable, directTable.getAttribute('data-title') || directTable.querySelector('caption, th')?.textContent?.trim(), 'ΙΑΤΡΙΚΟΣ ΠΙΝΑΚΑΣ');
      return;
    }

    // Direct Graph / Chart click
    const directGraph = e.target.closest('.chart-container, .graph-container, .med-graph');
    if (directGraph && !directGraph.closest('#med-zoom-modal')) {
      e.preventDefault();
      window.openMedZoom(directGraph, 'Ιατρικό Γράφημα / Διάγραμμα', 'ΙΑΤΡΙΚΟ ΓΡΑΦΗΜΑ');
      return;
    }

    // 2. Image zoom triggers
    const zoomBtn = e.target.closest('.btn-med-zoom-trigger, .btn-action, .image-overlay, [data-zoom-trigger]');
    if (zoomBtn) {
      e.preventDefault();
      window.openMedZoom(zoomBtn);
      return;
    }

    const clickedImg = e.target.closest('.fig-img, .fig-img-wrap img, .embedded-med-image, .image-wrapper img, .photo-card img, .embedded-image-container img, .case-fig img, .case-image');
    if (clickedImg && clickedImg.id !== 'mzv-img' && clickedImg.id !== 'lightbox-img') {
      e.preventDefault();
      window.openMedZoom(clickedImg);
    }
  });

})();
