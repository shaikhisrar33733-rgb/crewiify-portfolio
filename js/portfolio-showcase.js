/**
 * portfolio-showcase.js - Interactive Controller for CREWiiFY Work / Portfolio Showcase
 * 
 * Features:
 * - Dynamic Category Filtering (All Work, Portrait Videos, Landscape Videos, SEO Results, Websites)
 * - Deep Linking via URL Query Param (?category=...)
 * - Clean HTML5 Video Modal Player (Portrait 9:16 and Landscape 16:9)
 * - High-Resolution SEO Screenshot Lightbox Modal
 * - Full Keyboard Accessibility (ESC to close, Tab navigation)
 */

import { portfolioCategories, portfolioItems } from './portfolio-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilters();
  initVideoModal();
  initSeoLightbox();
  checkInitialCategoryFromUrl();
});

/* ==========================================================================
   01. CATEGORY FILTER SYSTEM
   ========================================================================== */

function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('.pf-nav-btn');
  const sections = {
    'portrait-videos': document.getElementById('sec-portrait-videos'),
    'landscape-videos': document.getElementById('sec-landscape-videos'),
    'seo-results': document.getElementById('sec-seo-results'),
    'websites': document.getElementById('sec-websites')
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-filter');
      applyFilter(targetCategory, filterButtons, sections);
      
      // Update URL query parameter cleanly without reloading
      const url = new URL(window.location);
      if (targetCategory === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', targetCategory);
      }
      window.history.replaceState({}, '', url);
    });
  });
}

function applyFilter(category, filterButtons, sections) {
  // Update button active states
  filterButtons.forEach(btn => {
    const isTarget = btn.getAttribute('data-filter') === category;
    btn.classList.toggle('is-active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Toggle sections
  Object.entries(sections).forEach(([secKey, secEl]) => {
    if (!secEl) return;
    if (category === 'all' || category === secKey) {
      secEl.classList.remove('is-hidden');
    } else {
      secEl.classList.add('is-hidden');
    }
  });
}

function checkInitialCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');
  if (!catParam) return;

  const validCategories = ['all', 'portrait-videos', 'landscape-videos', 'seo-results', 'websites'];
  // Handle alias query params like 'seo' -> 'seo-results', 'video' -> 'portrait-videos', etc.
  let mappedCat = catParam.toLowerCase();
  if (mappedCat === 'seo') mappedCat = 'seo-results';
  if (mappedCat === 'portrait' || mappedCat === 'reels') mappedCat = 'portrait-videos';
  if (mappedCat === 'landscape') mappedCat = 'landscape-videos';
  if (mappedCat === 'web' || mappedCat === 'website') mappedCat = 'websites';

  if (validCategories.includes(mappedCat)) {
    const filterButtons = document.querySelectorAll('.pf-nav-btn');
    const sections = {
      'portrait-videos': document.getElementById('sec-portrait-videos'),
      'landscape-videos': document.getElementById('sec-landscape-videos'),
      'seo-results': document.getElementById('sec-seo-results'),
      'websites': document.getElementById('sec-websites')
    };
    applyFilter(mappedCat, filterButtons, sections);

    // Scroll to showcase section
    const showcaseContainer = document.getElementById('portfolioShowcase');
    if (showcaseContainer) {
      setTimeout(() => {
        showcaseContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}

/* ==========================================================================
   02. VIDEO MODAL PLAYER SYSTEM
   ========================================================================== */

function initVideoModal() {
  const modalBackdrop = document.getElementById('pfVideoModal');
  const modalDialog = document.getElementById('pfVideoDialog');
  const videoEl = document.getElementById('pfModalVideo');
  const closeBtn = document.getElementById('pfVideoCloseBtn');
  const titleEl = document.getElementById('pfVideoTitle');
  const badgeEl = document.getElementById('pfVideoBadge');
  const descEl = document.getElementById('pfVideoDesc');

  if (!modalBackdrop || !videoEl) return;

  // Open modal on card click
  document.querySelectorAll('[data-video-src]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on an external link inside card
      if (e.target.closest('a')) return;

      const videoSrc = card.getAttribute('data-video-src');
      const title = card.getAttribute('data-title') || 'CREWiiFY Portfolio';
      const badge = card.getAttribute('data-format') || 'VIDEO';
      const desc = card.getAttribute('data-desc') || '';
      const isPortrait = card.getAttribute('data-aspect') === '9/16';

      if (!videoSrc) return;

      // Configure Modal
      titleEl.textContent = title;
      badgeEl.textContent = badge;
      descEl.textContent = desc;

      if (isPortrait) {
        modalDialog.classList.add('pf-modal-dialog--portrait');
        modalDialog.classList.remove('pf-modal-dialog--landscape');
      } else {
        modalDialog.classList.add('pf-modal-dialog--landscape');
        modalDialog.classList.remove('pf-modal-dialog--portrait');
      }

      // Load & Play Video
      videoEl.src = videoSrc;
      videoEl.load();

      modalBackdrop.classList.add('is-open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      videoEl.play().catch(() => {
        // Autoplay may be restricted with sound; fallback quietly
      });
    });
  });

  // Close Modal handler
  function closeVideoModal() {
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeVideoModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   03. SEO SCREENSHOT LIGHTBOX MODAL
   ========================================================================== */

function initSeoLightbox() {
  const lightboxBackdrop = document.getElementById('pfSeoLightbox');
  const lightboxImg = document.getElementById('pfLightboxImg');
  const lightboxTitle = document.getElementById('pfLightboxTitle');
  const lightboxMetric = document.getElementById('pfLightboxMetric');
  const closeBtn = document.getElementById('pfLightboxCloseBtn');

  if (!lightboxBackdrop || !lightboxImg) return;

  document.querySelectorAll('[data-seo-zoom]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-seo-zoom');
      const title = trigger.getAttribute('data-seo-title') || 'SEO Evidence Analytics';
      const metric = trigger.getAttribute('data-seo-metric') || '';

      lightboxImg.src = imgSrc;
      lightboxTitle.textContent = title;
      lightboxMetric.textContent = metric;

      lightboxBackdrop.classList.add('is-open');
      lightboxBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightboxBackdrop.classList.remove('is-open');
    lightboxBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.removeAttribute('src');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightboxBackdrop.addEventListener('click', (e) => {
    if (e.target === lightboxBackdrop) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxBackdrop.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
