/**
 * home-case-studies.js - Controller for CREWIIFY Homepage Case Studies Showcase
 * Handles dynamic category filtering, video modal player, SEO screenshot lightbox, and hover previews.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomeFilters();
  initHomeVideoModal();
  initHomeSeoLightbox();
  initHomeHoverVideoPreviews();
});

/* ==========================================================================
   01. DYNAMIC CATEGORY FILTER SYSTEM
   ========================================================================== */

function initHomeFilters() {
  const filterBtns = document.querySelectorAll('.home-cs__filter-btn');
  const cards = document.querySelectorAll('.home-cs__card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-home-filter');

      // Update button active states
      filterBtns.forEach(b => {
        const isTarget = b === btn;
        b.classList.toggle('is-active', isTarget);
        b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });

      // Filter cards
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.classList.remove('is-hidden');
          // Smooth fade-in
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   02. VIDEO MODAL PLAYER
   ========================================================================== */

function initHomeVideoModal() {
  const modalBackdrop = document.getElementById('homeVideoModal');
  const modalDialog = document.getElementById('homeVideoDialog');
  const videoEl = document.getElementById('homeModalVideo');
  const closeBtn = document.getElementById('homeVideoCloseBtn');
  const titleEl = document.getElementById('homeVideoTitle');
  const badgeEl = document.getElementById('homeVideoBadge');
  const descEl = document.getElementById('homeVideoDesc');

  if (!modalBackdrop || !videoEl) return;

  // Open video modal on card or button click
  document.querySelectorAll('[data-home-video]').forEach(trigger => {
    const openHandler = (e) => {
      // Don't trigger if clicked on an external link inside card
      if (e.target.closest('a') && !e.target.closest('[data-home-video-action]')) return;

      const videoSrc = trigger.getAttribute('data-video-src');
      const title = trigger.getAttribute('data-title') || 'CREWIIFY Video';
      const badge = trigger.getAttribute('data-format') || 'VIDEO';
      const desc = trigger.getAttribute('data-desc') || '';
      const isPortrait = trigger.getAttribute('data-aspect') === '9/16';

      if (!videoSrc) return;

      titleEl.textContent = title;
      badgeEl.textContent = badge;
      descEl.textContent = desc;

      if (isPortrait) {
        modalDialog.classList.add('home-modal-dialog--portrait');
        modalDialog.classList.remove('home-modal-dialog--landscape');
      } else {
        modalDialog.classList.add('home-modal-dialog--landscape');
        modalDialog.classList.remove('home-modal-dialog--portrait');
      }

      videoEl.src = videoSrc;
      videoEl.load();

      modalBackdrop.classList.add('is-open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      videoEl.play().catch(() => {
        // Autoplay may be restricted with sound; fallback quietly
      });
    };

    trigger.addEventListener('click', openHandler);

    // Keyboard support (Enter/Space)
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHandler(e);
      }
    });
  });

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

function initHomeSeoLightbox() {
  const lightboxBackdrop = document.getElementById('homeSeoLightbox');
  const lightboxImg = document.getElementById('homeLightboxImg');
  const lightboxTitle = document.getElementById('homeLightboxTitle');
  const lightboxMetric = document.getElementById('homeLightboxMetric');
  const closeBtn = document.getElementById('homeLightboxCloseBtn');

  if (!lightboxBackdrop || !lightboxImg) return;

  document.querySelectorAll('[data-home-seo-zoom]').forEach(trigger => {
    const openLightbox = () => {
      const imgSrc = trigger.getAttribute('data-seo-zoom');
      const title = trigger.getAttribute('data-seo-title') || 'SEO Evidence Analytics';
      const metric = trigger.getAttribute('data-seo-metric') || '';

      lightboxImg.src = imgSrc;
      lightboxTitle.textContent = title;
      lightboxMetric.textContent = metric;

      lightboxBackdrop.classList.add('is-open');
      lightboxBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    trigger.addEventListener('click', openLightbox);

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox();
      }
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

/* ==========================================================================
   04. HOVER VIDEO PREVIEWS ON DESKTOP
   ========================================================================== */

function initHomeHoverVideoPreviews() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const videoCards = document.querySelectorAll('.home-cs__card[data-home-video]');

  videoCards.forEach(card => {
    const previewVideo = card.querySelector('video');
    if (!previewVideo) return;

    previewVideo.muted = true;
    previewVideo.loop = true;

    let playPromise = null;

    card.addEventListener('mouseenter', () => {
      playPromise = previewVideo.play();
    });

    card.addEventListener('mouseleave', () => {
      if (playPromise !== null) {
        playPromise
          .then(() => {
            previewVideo.pause();
          })
          .catch(() => {
            previewVideo.pause();
          });
      } else {
        previewVideo.pause();
      }
    });
  });
}
