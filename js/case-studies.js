// case-studies.js - CREWiiFY Case Studies Listing, Dynamic Filtering & Compact Modal Preview

import { caseStudiesData } from './case-studies-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initEditorialAnimations();
  initAudioPlayer();
  initCaseStudiesSection();
  initModalSystem();
});

/* ==========================================================================
   1. VIEWPORT-TRIGGERED ANIMATED COUNTER (Section 2)
   ========================================================================== */

function initEditorialAnimations() {
  const section = document.getElementById('credibility');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters(prefersReducedMotion);
        observer.unobserve(section);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(section);
}

function animateCounters(reducedMotion) {
  const counterEl = document.querySelector('.cs-stat-hero__num');
  if (!counterEl) return;

  const target = parseInt(counterEl.getAttribute('data-target') || '400', 10);
  if (reducedMotion) {
    counterEl.textContent = target;
    return;
  }

  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(easeProgress * target);

    counterEl.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counterEl.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   2. INTERACTIVE AUDIO PLAYER (Section 2)
   ========================================================================== */

function initAudioPlayer() {
  const audioBtn = document.getElementById('csCredAudioBtn');
  const waveform = document.getElementById('csCredWaveform');
  const timeDisplay = document.getElementById('csCredTime');
  let audio = document.getElementById('csCredAudioEl');

  if (!audioBtn || !waveform || !timeDisplay) return;

  if (!audio) {
    audio = new Audio('assets/audio/testimonial_review.ogg');
    audio.id = 'csCredAudioEl';
    audio.preload = 'metadata';
    document.body.appendChild(audio);
  }

  const barHeights = [
    6, 10, 14, 8, 16, 22, 12, 18, 24, 14, 20, 22, 16, 10, 18, 22, 
    14, 24, 20, 12, 16, 20, 14, 18, 10, 14, 8, 6
  ];

  waveform.innerHTML = '';
  barHeights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'cs-waveform-bar';
    bar.style.height = `${h}px`;
    bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
    waveform.appendChild(bar);
  });

  const bars = waveform.querySelectorAll('.cs-waveform-bar');
  let isSeeking = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    const currentTime = audio.currentTime || 0;
    const duration = audio.duration || 0;
    timeDisplay.textContent = formatTime(currentTime);

    const progress = duration > 0 ? (currentTime / duration) : 0;
    bars.forEach((bar, idx) => {
      const barThreshold = (idx + 0.5) / bars.length;
      if (barThreshold <= progress) {
        bar.classList.add('is-played');
      } else {
        bar.classList.remove('is-played');
      }
    });
  }

  function setPlayState(isPlaying) {
    if (isPlaying) {
      audioBtn.classList.add('is-playing');
      audioBtn.setAttribute('aria-label', 'Pause audio testimonial');
      audioBtn.innerHTML = `
        <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
      `;
    } else {
      audioBtn.classList.remove('is-playing');
      audioBtn.setAttribute('aria-label', 'Play audio testimonial');
      audioBtn.innerHTML = `
        <svg class="cs-audio-player__icon" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
    }
  }

  audioBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayState(true);
      }).catch(err => {
        console.warn('Audio playback prevented or error:', err);
      });
    } else {
      audio.pause();
      setPlayState(false);
    }
  });

  audio.addEventListener('play', () => setPlayState(true));
  audio.addEventListener('pause', () => setPlayState(false));
  audio.addEventListener('timeupdate', () => {
    if (!isSeeking) {
      updateProgress();
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    updateProgress();
  });

  audio.addEventListener('ended', () => {
    setPlayState(false);
    audio.currentTime = 0;
    updateProgress();
  });

  // Seeking via Waveform Click & Pointer Drag
  function seekFromEvent(e) {
    const rect = waveform.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
      updateProgress();
    }
  }

  waveform.addEventListener('pointerdown', (e) => {
    isSeeking = true;
    try {
      waveform.setPointerCapture(e.pointerId);
    } catch (_) {}
    seekFromEvent(e);
  });

  waveform.addEventListener('pointermove', (e) => {
    if (isSeeking) {
      seekFromEvent(e);
    }
  });

  waveform.addEventListener('pointerup', (e) => {
    if (isSeeking) {
      seekFromEvent(e);
      isSeeking = false;
      try {
        waveform.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  });

  waveform.addEventListener('pointercancel', () => {
    isSeeking = false;
  });

  // Initial display setup
  updateProgress();
}

/* ==========================================================================
   3. CASE STUDIES SECTION (FILTERING & MASONRY GRID)
   ========================================================================== */

let currentFilter = 'all';

function initCaseStudiesSection() {
  const gridContainer = document.getElementById('csMasonryGrid');
  const countDisplay = document.getElementById('csItemCount');
  const filterBtns = document.querySelectorAll('.cs-filter-btn');

  if (!gridContainer) return;

  // Category Mapping Table
  const categoryMap = {
    'seo': 'SEO',
    'ppc': 'PPC Management & Growth',
    'ppc-management': 'PPC Management & Growth',
    'ppc management': 'PPC Management & Growth',
    'ppc-management-and-growth': 'PPC Management & Growth',
    'ppc management & growth': 'PPC Management & Growth',
    'google-ads': 'PPC Management & Growth',
    'google ads': 'PPC Management & Growth',
    'web-development': 'Web Development',
    'web development': 'Web Development',
    'web': 'Web Development',
    'whatsapp-automation': 'WhatsApp Automation',
    'whatsapp automation': 'WhatsApp Automation',
    'whatsapp': 'WhatsApp Automation',
    'wordpress': 'WordPress',
    'shopify': 'Shopify'
  };

  // Helper to resolve category from query parameter or hash
  const resolveCategoryFilter = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('category') || urlParams.get('filter');
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();

    if (filterParam) {
      const cleanParam = filterParam.toLowerCase();
      if (categoryMap[cleanParam]) return categoryMap[cleanParam];
      const match = Array.from(filterBtns).find(btn => 
        btn.getAttribute('data-filter')?.toLowerCase() === cleanParam
      );
      if (match) return match.getAttribute('data-filter');
    }

    if (hash && categoryMap[hash]) {
      return categoryMap[hash];
    }

    return 'all';
  };

  const initialFilter = resolveCategoryFilter();
  if (initialFilter && initialFilter !== 'all') {
    currentFilter = initialFilter;
    const matchingBtn = Array.from(filterBtns).find(btn => 
      btn.getAttribute('data-filter')?.toLowerCase() === initialFilter.toLowerCase()
    );
    if (matchingBtn) {
      filterBtns.forEach(b => {
        const isSelected = (b === matchingBtn);
        b.classList.toggle('is-active', isSelected);
        b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      // Auto-scroll filter list rail on load so the selected filter is centered in view
      const filterList = matchingBtn.closest('.cs-filter-list');
      if (filterList) {
        setTimeout(() => {
          const listItem = matchingBtn.parentElement;
          const targetEl = (listItem && listItem.tagName === 'LI') ? listItem : matchingBtn;
          const targetScroll = targetEl.offsetLeft - (filterList.clientWidth / 2) + (targetEl.offsetWidth / 2);
          filterList.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }

  // 1. Initial Render with determined filter
  renderCaseStudiesGrid(currentFilter);

  // Helper to scroll accurately to target listing section with sticky navbar offset & breathing room
  const scrollToTarget = (targetEl) => {
    if (!targetEl) return;
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 84;
    const offsetPadding = 24; // Visual breathing room
    const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerHeight - offsetPadding);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: offsetPosition,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Check if page was loaded with a deep link (category param or listing hash)
  const urlParams = new URLSearchParams(window.location.search);
  const hasDeepLink = urlParams.has('category') || urlParams.has('filter') || window.location.hash.length > 1;

  if (hasDeepLink) {
    // Wait until masonry cards are painted into DOM
    setTimeout(() => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      const targetEl = document.getElementById(hash) || 
                       document.getElementById('case-studies-grid') || 
                       document.getElementById('csGridView');
      scrollToTarget(targetEl);
    }, 120);
  }

  // Handle browser back/forward and dynamic hash updates
  window.addEventListener('hashchange', () => {
    const newCategory = resolveCategoryFilter();
    if (newCategory && newCategory !== currentFilter) {
      currentFilter = newCategory;
      const matchingBtn = Array.from(filterBtns).find(btn => 
        btn.getAttribute('data-filter')?.toLowerCase() === currentFilter.toLowerCase()
      );
      if (matchingBtn) {
        filterBtns.forEach(b => {
          const isSelected = (b === matchingBtn);
          b.classList.toggle('is-active', isSelected);
          b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
      }
      renderCaseStudiesGrid(currentFilter);
    }
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    const targetEl = document.getElementById(hash) || 
                     document.getElementById('case-studies-grid') || 
                     document.getElementById('csGridView');
    if (targetEl) {
      scrollToTarget(targetEl);
    }
  });

  // 2. Filter Navigation Clicks & Auto-Scroll into View
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      if (filter === currentFilter) return;

      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Auto-scroll ONLY the internal filter list rail (never the page, window, or cards)
      const filterList = btn.closest('.cs-filter-list');
      if (filterList) {
        const listItem = btn.parentElement;
        const targetEl = (listItem && listItem.tagName === 'LI') ? listItem : btn;
        const targetScroll = targetEl.offsetLeft - (filterList.clientWidth / 2) + (targetEl.offsetWidth / 2);
        filterList.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }

      currentFilter = filter;
      renderCaseStudiesGrid(filter);
    });
  });

  // 3. Scroll End Detection for Visual Cue Fade on Mobile / Tablet
  const filterNav = document.querySelector('.cs-filter-nav');
  const filterList = document.querySelector('.cs-filter-list');
  if (filterNav && filterList) {
    const updateScrollEnd = () => {
      const isEnd = (filterList.scrollLeft + filterList.clientWidth) >= (filterList.scrollWidth - 12);
      filterNav.classList.toggle('is-scrolled-end', isEnd);
    };

    filterList.addEventListener('scroll', updateScrollEnd, { passive: true });
    window.addEventListener('resize', updateScrollEnd, { passive: true });
    updateScrollEnd();
  }
}

/**
 * Filter and render case studies into the masonry grid
 */
function renderCaseStudiesGrid(filter) {
  const gridContainer = document.getElementById('csMasonryGrid');
  const countDisplay = document.getElementById('csItemCount');
  if (!gridContainer) return;

  // Filter items client-side
  const filteredData = filter === 'all'
    ? caseStudiesData
    : caseStudiesData.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  // Update dynamic count indicator
  if (countDisplay) {
    const totalCount = caseStudiesData.length;
    const displayTotal = (filter === 'all') ? totalCount : filteredData.length;
    countDisplay.textContent = `Showing ${filteredData.length} of ${displayTotal} Projects`;
  }

  // Smooth Grid Repopulation
  gridContainer.innerHTML = '';

  if (filteredData.length === 0) {
    gridContainer.innerHTML = `
      <div class="cs-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <p style="color: #A3A3A3; font-size: 1.1rem;">No case studies found in this category.</p>
      </div>
    `;
    return;
  }

  filteredData.forEach((item, index) => {
    const card = document.createElement('article');
    const spanClass = item.cardSpan ? `cs-card--${item.cardSpan}` : 'cs-card--medium';
    card.className = `cs-card ${spanClass} animate-fade-up-${(index % 3) + 1}`;
    card.setAttribute('data-id', item.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${item.title} Case Study Preview`);

    card.innerHTML = createCardHTML(item);

    // Click on entire card opens modal preview
    card.addEventListener('click', (e) => {
      openModal(item.id, card);
    });

    // Keyboard activation (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item.id, card);
      }
    });

    gridContainer.appendChild(card);
  });
}

/**
 * HTML generator for Case Study Cards
 */
function createCardHTML(item) {
  const primaryMetric = (item.result && item.resultLabel) 
    ? { value: item.result, label: item.resultLabel }
    : (item.metrics && item.metrics.length > 0 ? item.metrics[0] : null);

  return `
    <div class="cs-card__media">
      <img src="${item.image}" alt="${item.title} Project" class="cs-card__img" style="object-position: ${item.imagePosition || 'center center'};" loading="lazy">
      <div class="cs-card__overlay"></div>
      <div class="cs-card__tag-wrap">
        <span class="cs-tag cs-tag--category">${item.category}</span>
      </div>
    </div>

    <div class="cs-card__body">
      <h4 class="cs-card__title">${item.title}</h4>
      <p class="cs-card__desc">${item.description}</p>

      <div class="cs-card__footer">
        ${primaryMetric ? `
          <div class="cs-card__metric-badge">
            <span class="cs-card__metric-val">${primaryMetric.value}</span>
            <span class="cs-card__metric-lbl">${primaryMetric.label}</span>
          </div>
        ` : '<div></div>'}

        <span class="cs-card__affordance" aria-hidden="true">
          View Case Study →
        </span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. EXPANDED CASE STUDY OVERLAY & IMMERSIVE PORTFOLIO ENGINE
   ========================================================================== */

let lastFocusedElement = null;
let isModalOpen = false;

function initModalSystem() {
  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');
  const closeBtn = document.getElementById('csModalCloseBtn');

  if (!backdrop || !modal) return;

  // Close via sticky top-right close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Close when clicking on backdrop (outside modal dialog)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  // Close via ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
    }
  });

  // Check URL query params to auto-open modal if specified
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') || urlParams.get('project') || urlParams.get('case-study');
  if (targetId) {
    setTimeout(() => {
      openModal(targetId);
    }, 150);
  }
}

/**
 * Open Expanded Case Study Modal with Dynamic Data
 */
function openModal(caseStudyId, triggerElement) {
  const currentIndex = caseStudiesData.findIndex(cs => cs.id === caseStudyId);
  if (currentIndex === -1) return;
  const item = caseStudiesData[currentIndex];

  const totalCases = caseStudiesData.length;
  const prevIndex = (currentIndex - 1 + totalCases) % totalCases;
  const nextIndex = (currentIndex + 1) % totalCases;
  const prevItem = caseStudiesData[prevIndex];
  const nextItem = caseStudiesData[nextIndex];

  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');
  const modalBody = document.getElementById('csModalBody');
  const closeBtn = document.getElementById('csModalCloseBtn');
  const stickyIndex = document.getElementById('csModalStickyIndex');
  const stickyCategory = document.getElementById('csModalStickyCategory');
  const stickyTitle = document.getElementById('csModalStickyTitle');

  if (!backdrop || !modal || !modalBody) return;

  // Save trigger element for accessible focus restoration
  lastFocusedElement = triggerElement || document.activeElement;

  // Update minimal editorial sticky header
  const caseNumberStr = String(currentIndex + 1).padStart(2, '0');
  const totalCasesStr = String(totalCases).padStart(2, '0');
  const categoryLabel = item.hero?.eyebrow || item.category || 'CASE STUDY';
  const clientTitle = item.client?.name || item.title;
  
  if (stickyIndex) stickyIndex.textContent = `CASE STUDY ${caseNumberStr} / ${totalCasesStr}`;
  if (stickyCategory) stickyCategory.textContent = categoryLabel;
  if (stickyTitle) stickyTitle.textContent = clientTitle;

  // Populate dynamic modal content
  modalBody.innerHTML = createModalContentHTML(item, prevItem, nextItem, currentIndex, totalCases);

  // Bind Previous/Next navigation buttons
  const navBtns = modalBody.querySelectorAll('.cs-exp-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target-id');
      if (targetId) {
        openModal(targetId, lastFocusedElement);
      }
    });
  });

  // Reset modal scroll position to top
  modal.scrollTop = 0;

  // Lock background scroll without shifting content
  lockScroll();

  // Show Modal with Animation
  backdrop.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('is-active');
  modal.classList.add('is-active');
  isModalOpen = true;

  // Run adaptive media type detection on the hero image
  initHeroMediaDetector(modalBody);

  // Set focus into modal close button
  setTimeout(() => {
    if (closeBtn) {
      closeBtn.focus();
    } else {
      modal.focus();
    }
  }, 60);
}

/**
 * Close Modal & Restore Focus + Background Scroll
 */
function closeModal() {
  if (!isModalOpen) return;

  const backdrop = document.getElementById('csModalBackdrop');
  const modal = document.getElementById('csModal');

  if (backdrop && modal) {
    backdrop.classList.remove('is-active');
    modal.classList.remove('is-active');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  isModalOpen = false;

  // Restore background scrolling
  unlockScroll();

  // Return focus to triggering card
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/**
 * Adaptive Hero Media Type Detection
 * Inspects naturalWidth/naturalHeight of the hero image after load and assigns
 * one of four CSS modifier classes to the image-box container.
 *
 * Classification thresholds (aspect ratio = width / height):
 *   artwork   ratio < 0.60   → extremely tall asset (infographic, stat graphic, very tall photo)
 *   portrait  ratio 0.60–0.86 → taller-than-wide asset
 *   square    ratio 0.87–1.15 → approximately square
 *   landscape ratio > 1.15   → wider-than-tall asset
 *
 * If data.hero.imageMode is set (and not "auto" / "photo"), it takes priority:
 *   Legacy values are mapped: cutout → artwork, photo → auto, screen → landscape, creative → artwork
 */
function initHeroMediaDetector(modalBody) {
  const imageBox = modalBody.querySelector('.cs-exp-hero__image-box');
  const img      = modalBody.querySelector('.cs-exp-hero__img');
  if (!imageBox || !img) return;

  // Map legacy imageMode values to the new type system
  const LEGACY_MAP = {
    cutout:   'artwork',
    screen:   'landscape',
    creative: 'artwork',
    photo:    null,   // null = fall through to auto-detection
    auto:     null
  };

  const rawMode = (imageBox.dataset.imageMode || '').toLowerCase();

  // If there is a valid manual override that maps to a real type, apply it immediately
  if (rawMode && rawMode !== 'auto' && rawMode !== 'photo' && !LEGACY_MAP.hasOwnProperty(rawMode)) {
    // Direct match — e.g. imageMode: "portrait" / "landscape" / "square" / "artwork"
    applyHeroMediaClass(imageBox, rawMode);
    return;
  }

  const legacyResolved = LEGACY_MAP[rawMode];
  if (legacyResolved) {
    // e.g. cutout → artwork
    applyHeroMediaClass(imageBox, legacyResolved);
    return;
  }

  // Auto-detection from naturalWidth / naturalHeight
  function detectFromDimensions() {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) {
      // Fallback: treat as landscape so the stage still looks intentional
      applyHeroMediaClass(imageBox, 'landscape');
      return;
    }
    const ratio = w / h;
    let type;
    if      (ratio < 0.60) type = 'artwork';   // Extremely tall — infographic, stat graphic, very tall photo
    else if (ratio < 0.87) type = 'portrait';  // Taller than wide
    else if (ratio <= 1.15) type = 'square';   // Approximately square
    else                    type = 'landscape'; // Wider than tall
    applyHeroMediaClass(imageBox, type);
  }

  if (img.complete && img.naturalWidth) {
    detectFromDimensions();
  } else {
    img.addEventListener('load',  detectFromDimensions, { once: true });
    img.addEventListener('error', () => applyHeroMediaClass(imageBox, 'landscape'), { once: true });
  }
}

/**
 * Apply a single media-type class to the hero image-box, removing any previous type.
 */
function applyHeroMediaClass(box, type) {
  box.classList.remove(
    'cs-exp-media--landscape',
    'cs-exp-media--portrait',
    'cs-exp-media--square',
    'cs-exp-media--artwork'
  );
  box.classList.add(`cs-exp-media--${type}`);
}

/**
 * Main Case Study Modal Content Dispatcher
 */
function createModalContentHTML(item, prevItem, nextItem, currentIndex, totalCases) {
  if (item.type === 'creative') {
    return createCreativeCaseStudyHTML(item, prevItem, nextItem);
  }
  return createResultCaseStudyHTML(item, prevItem, nextItem);
}

/**
 * RESULT-BASED Case Study Renderer
 * HERO → RESULTS → ANALYTICS PROOF → CHALLENGE + APPROACH → SMALL CTA → NAVIGATION
 */
function createResultCaseStudyHTML(item, prevItem, nextItem) {
  return `
    <div class="cs-exp">
      ${renderHeroSection(item)}
      ${renderResultsSection(item)}
      ${renderProofSection(item)}
      ${renderChallengeApproachSection(item, '02', '03')}
      ${renderFooterSection(item, prevItem, nextItem)}
    </div>
  `;
}

/**
 * CREATIVE-BASED Case Study Renderer
 * HERO → WORK / GALLERY → CHALLENGE + APPROACH → SMALL CTA → NAVIGATION
 */
function createCreativeCaseStudyHTML(item, prevItem, nextItem) {
  return `
    <div class="cs-exp">
      ${renderHeroSection(item)}
      ${renderWorkSection(item, '01')}
      ${renderChallengeApproachSection(item, '02', '03')}
      ${renderFooterSection(item, prevItem, nextItem)}
    </div>
  `;
}

/**
 * 1. HERO — Asymmetric Editorial 2-Column Composition
 * Left: Metadata, Client Name, Secondary Headline, Overview
 * Right: Integrated Visual Stage with Atmospheric Glow & Contour Texture
 */
function renderHeroSection(item) {
  const eyebrow = item.hero?.eyebrow || item.category || 'CASE STUDY';
  const industry = item.client?.industry || '';
  const timeframe = item.hero?.timeframe || '';
  const clientName = item.client?.name || item.title;
  const headline = item.hero?.headline || item.subtitle || '';
  const overview = item.hero?.overview || item.hero?.description || item.overview || '';
  const coverImage = item.hero?.coverImage || item.image || '';
  const coverImageAlt = item.hero?.coverImageAlt || `${clientName} Project Overview`;
  const imageMode = item.hero?.imageMode || (coverImage.includes('cutout') || coverImage.includes('palladium') ? 'cutout' : 'photo');

  // Build metadata items
  const metaParts = [eyebrow];
  if (industry) metaParts.push(industry.toUpperCase());
  if (timeframe) metaParts.push(timeframe);

  return `
    <section class="cs-exp-hero" aria-label="Project Overview">
      <div class="cs-exp-hero__grid">
        <!-- Left Column: Editorial Information -->
        <div class="cs-exp-hero__content">
          <div class="cs-exp-hero__meta">
            ${metaParts.map((part, i) => `
              ${i > 0 ? '<span class="cs-exp-meta-sep" aria-hidden="true">/</span>' : ''}
              <span class="${i === 0 ? 'cs-exp-meta-tag' : (i === metaParts.length - 1 ? 'cs-exp-meta-timeframe' : 'cs-exp-meta-industry')}">${part}</span>
            `).join('')}
          </div>

          <h1 class="cs-exp-client-name">${clientName}</h1>

          ${headline ? `<p class="cs-exp-headline">${headline}</p>` : ''}

          ${overview ? `
            <div class="cs-exp-overview-block">
              <span class="cs-exp-overview-label">OVERVIEW</span>
              <p class="cs-exp-overview">${overview}</p>
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Visual Presentation with Glow & Contour Waves -->
        ${coverImage ? `
          <div class="cs-exp-hero__visual-wrap">
            <div class="cs-exp-hero__stage">
              <div class="cs-exp-hero__glow" aria-hidden="true"></div>
              <svg class="cs-exp-hero__contours" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M40 320C100 240 180 290 260 210C320 150 350 70 380 20" stroke="rgba(139, 92, 246, 0.18)" stroke-width="1.2"/>
                <path d="M10 340C80 260 160 310 240 220C300 160 340 90 370 40" stroke="rgba(139, 92, 246, 0.14)" stroke-width="1"/>
                <path d="M70 300C130 230 200 270 280 190C330 130 360 50 390 0" stroke="rgba(139, 92, 246, 0.1)" stroke-width="1"/>
                <path d="M-20 360C60 280 140 330 220 240C280 180 330 110 360 60" stroke="rgba(139, 92, 246, 0.07)" stroke-width="1"/>
              </svg>
              <div class="cs-exp-hero__image-box" data-image-mode="${imageMode}">
                <img src="${coverImage}" alt="${coverImageAlt}" class="cs-exp-hero__img" loading="eager">
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

/**
 * 2. RESULTS — Primary Metric & Dynamic Secondary Metric Columns
 */
function renderResultsSection(item) {
  const results = item.results;
  if (!results && (!item.metrics || item.metrics.length === 0)) return '';

  const primaryMetric = results?.primary || ((item.result && item.resultLabel) ? { value: item.result, label: item.resultLabel } : (item.metrics && item.metrics[0] ? item.metrics[0] : null));
  const secondaryMetrics = results?.secondary || (item.metrics && item.metrics.length > 1 ? item.metrics.slice(1) : []);

  return `
    <section class="cs-exp-results" aria-label="Key Outcomes">
      <div class="cs-exp-divider" aria-hidden="true"></div>

      <!-- Editorial Section Marker (01 / RESULTS) -->
      <div class="cs-exp-marker">
        <span class="cs-exp-marker__num">01</span>
        <span class="cs-exp-marker__title">RESULTS</span>
      </div>

      <!-- Primary Metric Anchor -->
      ${primaryMetric ? `
        <div class="cs-exp-primary-metric">
          <div class="cs-exp-primary-metric__val">${primaryMetric.value}</div>
          <div class="cs-exp-primary-metric__lbl">${primaryMetric.label}</div>
        </div>
      ` : ''}

      <!-- Dynamic Secondary Metrics Row with Vertical Separators -->
      ${secondaryMetrics.length > 0 ? `
        <div class="cs-exp-secondary-row">
          ${secondaryMetrics.map((m, idx) => `
            ${idx > 0 ? '<div class="cs-exp-secondary-sep" aria-hidden="true"></div>' : ''}
            <div class="cs-exp-secondary-col">
              <div class="cs-exp-secondary-val">${m.value}</div>
              <div class="cs-exp-secondary-lbl">${m.label}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * 3. ANALYTICS PROOF — Large, readable evidence panels
 */
function renderProofSection(item) {
  const proofImages = item.results?.proofImages || [];
  if (proofImages.length === 0) return '';

  return `
    <section class="cs-exp-proof" aria-label="Performance Evidence">
      <div class="cs-exp-proof-label">
        <span class="cs-exp-proof-label__text">PERFORMANCE EVIDENCE</span>
      </div>

      <div class="cs-exp-proof-grid cs-exp-proof-grid--count-${proofImages.length}">
        ${proofImages.map(img => `
          <figure class="cs-exp-proof-item">
            <div class="cs-exp-proof-item__frame">
              <img src="${img.src}" alt="${img.alt || 'Performance Analytics Evidence'}" class="cs-exp-proof-item__img" loading="lazy">
            </div>
            ${img.caption ? `<figcaption class="cs-exp-proof-item__caption">${img.caption}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * 4. CHALLENGE + APPROACH — Two-Column Layout with Adaptive Density
 */
function renderChallengeApproachSection(item, challengeNum = '02', approachNum = '03') {
  const challenge = item.challenge || item.startingPoint || null;
  const challengeSummary = item.challenge?.summary || '';
  const challengePoints = challenge?.points || challenge?.items || [];
  const approaches = item.approach || item.strategy || [];

  // Hide entire section if neither challenge nor approach data is present
  if (challengePoints.length === 0 && approaches.length === 0) return '';

  // Adaptive Approach Grid: Switch to 2 columns if 5 or more items
  const isMultiColApproach  = approaches.length >= 5;
  // Adaptive Challenge Grid: Switch to 2 columns if 5 or more bullet points
  const isMultiColChallenge = challengePoints.length >= 5;

  return `
    <section class="cs-exp-challenge-approach" aria-label="Challenge & Approach">
      <div class="cs-exp-divider" aria-hidden="true"></div>

      <div class="cs-exp-ca-grid">
        <!-- Left Column: Challenge -->
        ${challengePoints.length > 0 ? `
          <div class="cs-exp-ca-col cs-exp-ca-col--challenge">
            <div class="cs-exp-marker">
              <span class="cs-exp-marker__num">${challengeNum}</span>
              <span class="cs-exp-marker__title">CHALLENGE</span>
            </div>

            ${challengeSummary ? `
              <p class="cs-exp-challenge-summary">${challengeSummary}</p>
            ` : ''}

            <ul class="cs-exp-challenge-list${isMultiColChallenge ? ' cs-exp-challenge-list--grid2' : ''}">
              ${challengePoints.map(point => `
                <li class="cs-exp-challenge-item">${point}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Vertical Divider (Desktop) -->
        ${(challengePoints.length > 0 && approaches.length > 0) ? `
          <div class="cs-exp-ca-divider" aria-hidden="true"></div>
        ` : ''}

        <!-- Right Column: Our Approach -->
        ${approaches.length > 0 ? `
          <div class="cs-exp-ca-col cs-exp-ca-col--approach">
            <div class="cs-exp-marker">
              <span class="cs-exp-marker__num">${approachNum}</span>
              <span class="cs-exp-marker__title">OUR APPROACH</span>
            </div>

            <ol class="cs-exp-approach-list cs-exp-approach-list--${isMultiColApproach ? 'grid2' : 'col1'}">
              ${approaches.map((item, idx) => {
                const cleanTitle = (item.title || item).replace(/^0\d\s*(—|-|\/)\s*/, '');
                const itemDesc = item.description || '';
                const numStr = String(idx + 1).padStart(2, '0');
                return `
                  <li class="cs-exp-approach-item">
                    <span class="cs-exp-approach-num">${numStr}</span>
                    <div class="cs-exp-approach-content">
                      <span class="cs-exp-approach-title">${cleanTitle}</span>
                      ${itemDesc ? `<span class="cs-exp-approach-desc">${itemDesc}</span>` : ''}
                    </div>
                  </li>
                `;
              }).join('')}
            </ol>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

/**
 * 5. WORK / GALLERY — Portfolio showcase (Creative template or supplementary visual)
 */
function renderWorkSection(item, markerNum = '01') {
  const work = item.work;
  const heading = work?.heading || 'WORK';
  const cleanHeading = heading.replace(/^0\d\s*(\/|—|-)?\s*/, '').trim();
  const gallery = Array.isArray(work) ? work : (work?.gallery || []);

  if (gallery.length === 0) return '';

  return `
    <section class="cs-exp-work" aria-label="Creative Work Showcase">
      <div class="cs-exp-divider" aria-hidden="true"></div>

      <div class="cs-exp-marker">
        <span class="cs-exp-marker__num">${markerNum}</span>
        <span class="cs-exp-marker__title">${cleanHeading || 'WORK'}</span>
      </div>

      <div class="cs-exp-work__gallery cs-exp-work__gallery--count-${gallery.length}">
        ${gallery.map(w => `
          <figure class="cs-exp-work-figure">
            <div class="cs-exp-work-figure__frame">
              <img src="${w.src}" alt="${w.alt || 'Client Creative Work Visual'}" class="cs-exp-work-figure__img" loading="lazy">
            </div>
            ${w.caption ? `<figcaption class="cs-exp-work-figure__caption">${w.caption}</figcaption>` : ''}
          </figure>
        `).join('')}
      </div>
    </section>
  `;
}

/**
 * 6. SMALL CTA & PREVIOUS / NEXT NAVIGATION
 */
function renderFooterSection(item, prevItem, nextItem) {
  const cta = item.cta;
  const headline = cta?.headline || 'Have a similar challenge?';
  const primaryText = cta?.text || 'START A PROJECT';
  const primaryLink = cta?.link || '/contact';

  return `
    <footer class="cs-exp-footer">
      <div class="cs-exp-divider" aria-hidden="true"></div>

      <!-- Small Editorial Closing Row -->
      <div class="cs-exp-closing-row">
        <span class="cs-exp-closing-row__headline">${headline}</span>
        <a href="${primaryLink}" class="btn cs-exp-cta-btn">
          ${primaryText} <span class="cs-exp-btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>

      <!-- Dynamic Dataset Previous / Next Navigation -->
      ${(prevItem && nextItem) ? `
        <div class="cs-exp-divider" aria-hidden="true"></div>

        <nav class="cs-exp-nav-row" aria-label="Case Study Navigation">
          <button type="button" class="cs-exp-nav-btn cs-exp-nav-btn--prev" data-target-id="${prevItem.id}" aria-label="View previous project: ${prevItem.client?.name || prevItem.title}">
            <span class="cs-exp-nav-btn__dir">← PREVIOUS CASE</span>
            <span class="cs-exp-nav-btn__title">${prevItem.client?.name || prevItem.title}</span>
          </button>

          <div class="cs-exp-nav-sep" aria-hidden="true"></div>

          <button type="button" class="cs-exp-nav-btn cs-exp-nav-btn--next" data-target-id="${nextItem.id}" aria-label="View next project: ${nextItem.client?.name || nextItem.title}">
            <span class="cs-exp-nav-btn__dir">NEXT CASE →</span>
            <span class="cs-exp-nav-btn__title">${nextItem.client?.name || nextItem.title}</span>
          </button>
        </nav>
      ` : ''}
    </footer>
  `;
}

/* ==========================================================================
   5. SCROLL LOCK UTILITIES
   ========================================================================== */

function lockScroll() {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollBarWidth}px`;
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
}

function unlockScroll() {
  document.body.style.paddingRight = '';
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
}
