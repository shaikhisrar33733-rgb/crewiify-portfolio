/**
 * podcast.js - CREWIIFY Dedicated Podcast Section Video Carousel
 * Continuous smooth auto-gliding infinite carousel with silent autoplaying videos.
 * Features:
 * - Glides horizontally automatically using requestAnimationFrame with seamless infinite wrapping
 * - Starts/continues smooth automatic horizontal movement when mouse enters the carousel area
 * - Seamlessly returns to normal automatic sliding behavior when mouse leaves
 * - Touch & drag swipe support with seamless release
 * - All 6 podcast videos autoplay silently in muted mode with zero controls
 * - No arrow buttons or audio controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initPodcastCarousel();
});

function initPodcastCarousel() {
  const carousel = document.getElementById('podcastCarousel');
  const viewport = document.getElementById('podcastViewport');
  const track = document.getElementById('podcastTrack');

  if (!carousel || !viewport || !track) return;
  if (track.querySelector('.is-clone')) return;

  const originalCards = Array.from(track.querySelectorAll('.podcast__card:not(.is-clone)'));
  const totalCards = originalCards.length;
  if (totalCards === 0) return;

  // Clone original cards once for seamless infinite wrapping (total 12 cards)
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

  // Gliding speeds in pixels per second:
  // BASE_SPEED: normal automatic sliding
  // HOVER_SPEED: smooth active movement when mouse is over the carousel
  const BASE_SPEED = 46;
  const HOVER_SPEED = 54;

  // Reduced motion accessibility
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

    const allCards = track.querySelectorAll('.podcast__card');
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

  // Ensure all videos play silently in continuous loop
  function playAllSilentVideos() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.muted = true;
      v.volume = 0;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('loop', '');
      v.removeAttribute('controls');
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });
  }

  function pauseAllVideos() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.pause();
    });
  }

  // Continuous animation loop using requestAnimationFrame
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Carousel moves continuously:
    // When mouse enters, it smoothly moves horizontally automatically (HOVER_SPEED).
    // When mouse leaves, it returns to normal automatic sliding behavior (BASE_SPEED).
    // Pauses only when actively dragging with mouse/touch or when off-screen.
    if (isVisible && !isDragging && !isReducedMotion && singleSetWidth > 0) {
      const activeSpeed = isHovered ? HOVER_SPEED : BASE_SPEED;
      currentX += activeSpeed * deltaTime;
      if (currentX >= singleSetWidth) {
        currentX = currentX % singleSetWidth;
      }
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }

    animationId = requestAnimationFrame(animate);
  }

  // Hover Handlers
  // When cursor enters, start/continue smooth horizontal movement automatically
  // When cursor leaves, seamlessly return to normal automatic sliding behavior
  viewport.addEventListener('mouseenter', () => {
    isHovered = true;
    lastTimestamp = performance.now();
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
    lastTimestamp = performance.now();
    viewport.classList.remove('is-dragging');
  }

  viewport.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);

  viewport.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('touchmove', moveDrag, { passive: true });
  window.addEventListener('touchend', endDrag);

  // IntersectionObserver to pause when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTimestamp = performance.now();
        playAllSilentVideos();
      } else {
        pauseAllVideos();
      }
    });
  }, { threshold: 0.05 });
  observer.observe(carousel);

  // Fallback trigger for mobile browser autoplay policies
  const resumeSilentVideos = () => {
    playAllSilentVideos();
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

  // Initialize layout, video playback, and start continuous loop
  updateDimensions();
  playAllSilentVideos();
  animationId = requestAnimationFrame(animate);
}
