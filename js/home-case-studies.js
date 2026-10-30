/**
 * home-case-studies.js - Controller for CREWIIFY Homepage Case Studies Showcase
 * Handles dynamic category filtering, video modal player, SEO screenshot lightbox, and hover previews.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomeWorkCarousel();
  initHomeFilters();
  initHomeVideoModal();
  initHomeSeoLightbox();
  initHomeAutoplayVideoVisibility();
});

/* ==========================================================================
   01. DYNAMIC CATEGORY FILTER SYSTEM
   ========================================================================== */

function initHomeFilters() {
  const filterBtns = document.querySelectorAll('.home-cs__filter-btn');
  const cards = document.querySelectorAll('#homeCsGrid .home-cs__card');

  if (!filterBtns.length) return;

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

      // Pause all background card preview videos
      document.querySelectorAll('.home-cs__card[data-home-video] video').forEach(v => {
        v.pause();
      });

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

    // Resume playing visible card videos that are currently intersecting the viewport
    document.querySelectorAll('.home-cs__card[data-home-video]:not(.is-hidden)').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const v = card.querySelector('video');
        if (v) {
          v.muted = true;
          v.play().catch(() => {});
        }
      }
    });
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
   04. AUTOMATIC MUTED VIDEO PLAYBACK & VISIBILITY OBSERVER
   ========================================================================== */

function initHomeAutoplayVideoVisibility() {
  const videoCards = document.querySelectorAll('.home-cs__card[data-home-video]');
  if (!videoCards.length) return;

  const isReducedData = navigator.connection && (navigator.connection.saveData === true);

  // Configure all 8 video elements for reliable silent loop playback without controls
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.removeAttribute('controls');
  });

  const playPromiseMap = new WeakMap();

  const playVideo = (video) => {
    if (isReducedData) return;

    // Do not autoplay card preview if the full modal player is currently open
    const modal = document.getElementById('homeVideoModal');
    if (modal && modal.classList.contains('is-open')) return;

    video.muted = true;
    const promise = video.play();
    if (promise !== undefined) {
      playPromiseMap.set(video, promise);
      promise.catch(() => {
        // Gracefully handle browser policy rejections
      });
    }
  };

  const pauseVideo = (video) => {
    const pendingPromise = playPromiseMap.get(video);
    if (pendingPromise) {
      pendingPromise
        .then(() => video.pause())
        .catch(() => video.pause());
    } else {
      video.pause();
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        const video = card.querySelector('video');
        if (!video) return;

        const isHidden = card.classList.contains('is-hidden');
        if (entry.isIntersecting && !isHidden) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      });
    }, {
      root: null,
      rootMargin: '60px 0px 60px 0px',
      threshold: [0, 0.2]
    });

    videoCards.forEach(card => observer.observe(card));

    // Listen to category filter clicks to pause hidden cards immediately
    document.querySelectorAll('.home-cs__filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        requestAnimationFrame(() => {
          videoCards.forEach(card => {
            const video = card.querySelector('video');
            if (!video) return;
            if (card.classList.contains('is-hidden')) {
              pauseVideo(video);
            } else {
              const rect = card.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                playVideo(video);
              }
            }
          });
        });
      });
    });
  } else {
    // Graceful fallback for environments without IntersectionObserver
    videoCards.forEach(card => {
      const video = card.querySelector('video');
      if (video) playVideo(video);
    });
  }
}

/* ==========================================================================
   00. OUR WORK HORIZONTAL AUTO-GLIDING VIDEO CAROUSEL
   ========================================================================== */

function initHomeWorkCarousel() {
  const carousel = document.getElementById('homeWorkCarousel');
  const viewport = document.getElementById('homeWorkViewport');
  const track = document.getElementById('homeWorkTrack');

  if (!carousel || !viewport || !track) return;
  if (track.querySelector('.is-clone')) return;

  const originalCards = Array.from(track.querySelectorAll('.home-work__card:not(.is-clone)'));
  const totalCards = originalCards.length;
  if (totalCards === 0) return;

  // Clone original cards once for seamless infinite wrapping (total 16 cards)
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    const cloneVid = clone.querySelector('video');
    if (cloneVid) {
      cloneVid.muted = true;
      cloneVid.volume = 0;
      cloneVid.loop = true;
      cloneVid.playsInline = true;
      cloneVid.setAttribute('muted', '');
      cloneVid.setAttribute('playsinline', '');
      cloneVid.setAttribute('loop', '');
      cloneVid.removeAttribute('controls');
    }
    track.appendChild(clone);
  });

  function getGap() {
    return window.innerWidth <= 768 ? 16 : 24;
  }

  let cardWidth = 0;
  let singleSetWidth = 0;
  let currentX = 0;
  let isHovered = false;
  let isDragging = false;
  let isVisible = true;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let lastTimestamp = 0;
  let animationId = null;

  // Smooth cinematic gliding speed: ~46 px/sec
  const SPEED = 46;

  // Reduced motion support
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
  });

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 480) return 1.25; // 1 card + peek on mobile
    if (w <= 768) return 2.15; // 2 cards + peek on tablet
    if (w <= 1100) return 3.2; // 3 cards + peek on laptop
    return 4;                  // 4 cards on desktop
  }

  function updateDimensions() {
    const gap = getGap();
    const viewportWidth = viewport.getBoundingClientRect().width;
    const cardsPerView = getCardsPerView();

    if (cardsPerView <= 1.3) {
      cardWidth = Math.min(viewportWidth * 0.78, 280);
    } else {
      cardWidth = (viewportWidth - (gap * (Math.floor(cardsPerView) - 1))) / cardsPerView;
      cardWidth = Math.max(cardWidth, 220);
    }

    const allCards = track.querySelectorAll('.home-work__card');
    allCards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.width = `${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
    });

    singleSetWidth = totalCards * (cardWidth + gap);

    if (singleSetWidth > 0) {
      currentX = currentX % singleSetWidth;
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }
  }

  // Ensure all video elements autoplay muted inline with zero controls
  function playAllVideos() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach(v => {
      v.muted = true;
      v.volume = 0;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('loop', '');
      v.removeAttribute('controls');
      v.play().catch(() => {});
    });
  }

  function pauseAllVideos() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach(v => {
      v.pause();
    });
  }

  // Animation Loop using requestAnimationFrame
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (isVisible && !isHovered && !isDragging && !isReducedMotion && singleSetWidth > 0) {
      currentX += SPEED * deltaTime;
      if (currentX >= singleSetWidth) {
        currentX = currentX % singleSetWidth;
      }
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }

    animationId = requestAnimationFrame(animate);
  }

  // Hover Pause Handlers (Pause on hover, resume on pointer leave)
  viewport.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  viewport.addEventListener('mouseleave', () => {
    isHovered = false;
    lastTimestamp = performance.now();
  });

  // Touch & Drag Handlers
  function startDrag(e) {
    isDragging = true;
    dragStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragStartOffset = currentX;
    viewport.classList.add('is-dragging');
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = dragStartX - clientX;
    currentX = dragStartOffset + deltaX;

    if (singleSetWidth > 0) {
      while (currentX < 0) currentX += singleSetWidth;
      if (currentX >= singleSetWidth) currentX = currentX % singleSetWidth;
    }

    track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    isHovered = false;
    lastTimestamp = performance.now();
    viewport.classList.remove('is-dragging');
  }

  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  viewport.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', moveDrag, { passive: true });
  window.addEventListener('touchend', endDrag);

  // Prevent any clicks on cards from opening modals or triggering default actions
  track.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  // IntersectionObserver to pause gliding and videos when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTimestamp = performance.now();
        playAllVideos();
      } else {
        pauseAllVideos();
      }
    });
  }, { threshold: 0.05 });
  observer.observe(carousel);

  // Fallback trigger for mobile browser autoplay policies
  const resumeSilentVideos = () => {
    playAllVideos();
    document.removeEventListener('pointerdown', resumeSilentVideos);
    document.removeEventListener('scroll', resumeSilentVideos);
  };
  document.addEventListener('pointerdown', resumeSilentVideos, { once: true, passive: true });
  document.addEventListener('scroll', resumeSilentVideos, { once: true, passive: true });

  // Handle window resize with debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateDimensions();
    }, 100);
  });

  // Initialize layout and start continuous loop
  updateDimensions();
  playAllVideos();
  animationId = requestAnimationFrame(animate);
}
