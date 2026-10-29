/**
 * podcast.js - CREWIIFY Dedicated Podcast Section Video Carousel
 * Pure Vanilla JS infinite auto-sliding carousel (no arrows)
 * Features:
 * - Starts sliding automatically when visible
 * - Advances every 3.5 seconds with smooth cubic-bezier transitions
 * - Seamless infinite wrapping via cloned boundary cards (no visible jump)
 * - Pause on hover, focus, tab switch, and offscreen
 * - Respects prefers-reduced-motion
 * - Drag/swipe touch support with zero arrows
 * - Video modal preview player
 */

document.addEventListener('DOMContentLoaded', () => {
  initPodcastCarousel();
  initPodcastModal();
});

/* ==========================================================================
   01. INFINITE AUTO-SLIDING PODCAST CAROUSEL
   ========================================================================== */

function initPodcastCarousel() {
  const carousel = document.getElementById('podcastCarousel');
  const viewport = document.getElementById('podcastViewport');
  const track = document.getElementById('podcastTrack');

  if (!carousel || !viewport || !track) return;

  const originalCards = Array.from(track.querySelectorAll('.podcast__card'));
  const totalOriginal = originalCards.length;
  if (totalOriginal === 0) return;

  // Configuration
  const AUTO_INTERVAL_MS = 3500; // 3.5 seconds between slides
  const CLONE_COUNT = 3;         // Clones on each side to support up to 3 cards visible
  const GAP = 24;                // 24px gap matching CSS

  let currentIndex = 0;
  let cardWidth = 0;
  let cardsPerView = 3;
  let isTransitioning = false;
  let timerId = null;
  let isIntersecting = false;
  let isHovered = false;
  let isFocused = false;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  const dragThreshold = 45;

  // Accessibility: Check reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;

  motionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      stopAutoSlide();
    } else if (isIntersecting && !isHovered && !isFocused) {
      startAutoSlide();
    }
  });

  // Setup infinite clones
  function setupClones() {
    track.innerHTML = '';

    // Prepend clones (last N cards)
    for (let i = totalOriginal - CLONE_COUNT; i < totalOriginal; i++) {
      const idx = (i + totalOriginal) % totalOriginal;
      const clone = originalCards[idx].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      clone.querySelectorAll('button, a').forEach(el => el.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }

    // Append original cards
    originalCards.forEach((card) => {
      track.appendChild(card);
    });

    // Append clones (first N cards)
    for (let i = 0; i < CLONE_COUNT; i++) {
      const clone = originalCards[i].cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      clone.querySelectorAll('button, a').forEach(el => el.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
  }

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function updateDimensions() {
    cardsPerView = getCardsPerView();
    const viewportWidth = viewport.getBoundingClientRect().width;
    cardWidth = (viewportWidth - (GAP * (cardsPerView - 1))) / cardsPerView;

    const allCards = track.querySelectorAll('.podcast__card');
    allCards.forEach(c => {
      c.style.flex = `0 0 ${cardWidth}px`;
      c.style.maxWidth = `${cardWidth}px`;
    });

    // Reposition track without animation to match current index
    updateTrackPosition(false);
  }

  function getTranslateForIndex(index) {
    const realIndex = index + CLONE_COUNT;
    const step = cardWidth + GAP;
    return -realIndex * step;
  }

  function updateTrackPosition(animate = true) {
    if (!animate) {
      track.classList.add('is-repositioning');
    } else {
      track.classList.remove('is-repositioning');
    }

    const targetX = getTranslateForIndex(currentIndex);
    currentTranslate = targetX;
    prevTranslate = targetX;
    track.style.transform = `translate3d(${targetX}px, 0, 0)`;

    if (!animate) {
      track.offsetHeight; // Force reflow
      track.classList.remove('is-repositioning');
    }
  }

  function goToIndex(index, animate = true) {
    if (isTransitioning && animate) return;

    if (animate) {
      isTransitioning = true;
    }

    currentIndex = index;
    updateTrackPosition(animate);
  }

  function nextSlide() {
    if (isTransitioning) return;
    goToIndex(currentIndex + 1, true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    goToIndex(currentIndex - 1, true);
  }

  // Handle transition end for seamless infinite loop reset (zero jump)
  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    isTransitioning = false;

    // Check wrap-around boundaries
    if (currentIndex >= totalOriginal) {
      currentIndex = currentIndex % totalOriginal;
      updateTrackPosition(false);
    } else if (currentIndex < 0) {
      currentIndex = (currentIndex % totalOriginal + totalOriginal) % totalOriginal;
      updateTrackPosition(false);
    }
  });

  // Timer controls
  function startAutoSlide() {
    stopAutoSlide();
    if (isReducedMotion || isHovered || isFocused || !isIntersecting) return;

    timerId = setInterval(() => {
      nextSlide();
    }, AUTO_INTERVAL_MS);
  }

  function stopAutoSlide() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Hover pause / resume
  carousel.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoSlide();
  });

  carousel.addEventListener('mouseleave', () => {
    isHovered = false;
    if (isIntersecting && !isFocused && !isReducedMotion) {
      startAutoSlide();
    }
  });

  // Focus pause / resume (for keyboard users)
  carousel.addEventListener('focusin', () => {
    isFocused = true;
    stopAutoSlide();
  });

  carousel.addEventListener('focusout', () => {
    isFocused = false;
    if (isIntersecting && !isHovered && !isReducedMotion) {
      startAutoSlide();
    }
  });

  // Tab visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoSlide();
    } else if (isIntersecting && !isHovered && !isFocused && !isReducedMotion) {
      startAutoSlide();
    }
  });

  // Viewport intersection observer (starts automatically when visible)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (!isReducedMotion && !isHovered && !isFocused) {
            startAutoSlide();
          }
        } else {
          stopAutoSlide();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(carousel);
  } else {
    // Fallback if IntersectionObserver is not supported
    isIntersecting = true;
    if (!isReducedMotion) startAutoSlide();
  }

  // Pointer / Touch drag handling (swipe smoothly without buttons)
  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function startDrag(e) {
    if (isTransitioning) return;
    isDragging = true;
    startX = getPositionX(e);
    stopAutoSlide();
    track.classList.add('is-repositioning');
    viewport.classList.add('is-dragging');
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diffX = currentX - startX;
    const targetX = prevTranslate + diffX;
    track.style.transform = `translate3d(${targetX}px, 0, 0)`;
  }

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('is-repositioning');
    viewport.classList.remove('is-dragging');

    const endX = e.type.includes('touch') ? (e.changedTouches[0] ? e.changedTouches[0].clientX : startX) : e.pageX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > dragThreshold) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      updateTrackPosition(true);
    }

    if (isIntersecting && !isHovered && !isFocused && !isReducedMotion) {
      startAutoSlide();
    }
  }

  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  viewport.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', moveDrag, { passive: true });
  window.addEventListener('touchend', endDrag);

  // Resize handler with debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateDimensions();
    }, 100);
  });

  // Initialize
  setupClones();
  updateDimensions();
}

/* ==========================================================================
   02. PODCAST MODAL PLAYER & PREVIEW HANDLER
   ========================================================================== */

function initPodcastModal() {
  const modal = document.getElementById('podcastModal');
  const closeBtn = document.getElementById('podcastModalCloseBtn');
  const titleEl = document.getElementById('podcastModalTitle');
  const descEl = document.getElementById('podcastModalDesc');
  const durationEl = document.getElementById('podcastModalDuration');
  const badgeEl = document.getElementById('podcastModalBadge');

  if (!modal) return;

  function openPodcastModal(card) {
    const videoSrc = card.getAttribute('data-video-src');
    const title = card.getAttribute('data-podcast-title') || 'Podcast Episode';
    const desc = card.getAttribute('data-podcast-desc') || '';
    const duration = card.getAttribute('data-podcast-duration') || '35 Min';
    const episode = card.getAttribute('data-podcast-episode') || 'EPISODE';

    // If real video source is present, launch the standard site video modal
    if (videoSrc) {
      const siteModal = document.getElementById('homeVideoModal');
      const siteVideo = document.getElementById('homeModalVideo');
      const siteTitle = document.getElementById('homeVideoTitle');
      const siteBadge = document.getElementById('homeVideoBadge');
      const siteDesc = document.getElementById('homeVideoDesc');

      if (siteModal && siteVideo) {
        siteTitle.textContent = title;
        siteBadge.textContent = episode;
        siteDesc.textContent = desc;
        siteVideo.src = videoSrc;
        siteVideo.load();
        siteModal.classList.add('is-open');
        siteModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        siteVideo.play().catch(() => {});
        return;
      }
    }

    // Otherwise show the podcast episode preview modal
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (durationEl) durationEl.textContent = `Duration: ${duration}`;
    if (badgeEl) badgeEl.textContent = episode;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePodcastModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind clicks on podcast cards or buttons using event delegation
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.podcast__card');
    if (!card) return;

    // Do not trigger if clicking an external link inside
    if (e.target.closest('a') && !e.target.closest('.podcast__action-btn')) return;

    openPodcastModal(card);
  });

  // Keyboard Enter / Space support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = document.activeElement ? document.activeElement.closest('.podcast__card') : null;
      if (card && !card.classList.contains('is-clone')) {
        e.preventDefault();
        openPodcastModal(card);
      }
    }

    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closePodcastModal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closePodcastModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePodcastModal();
    }
  });
}

