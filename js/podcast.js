/**
 * podcast.js - CREWIIFY Dedicated Podcast Section Video Carousel
 * Continuous smooth auto-gliding infinite carousel (no arrows, no popups)
 * Features:
 * - Glides continuously from right to left using requestAnimationFrame (zero jumps)
 * - Seamless infinite wrapping via cloned card sets
 * - Pauses automatically on hover, resumes on pointer leave
 * - Touch swipe & drag support with seamless resume
 * - Pauses when off-screen (IntersectionObserver)
 * - Reduced motion support (prefers-reduced-motion)
 * - Video previews only, no click-to-play, completely silent
 */

document.addEventListener('DOMContentLoaded', () => {
  initPodcastCarousel();
});

function initPodcastCarousel() {
  const carousel = document.getElementById('podcastCarousel');
  const viewport = document.getElementById('podcastViewport');
  const track = document.getElementById('podcastTrack');

  if (!carousel || !viewport || !track) return;

  const originalCards = Array.from(track.querySelectorAll('.podcast__card'));
  const totalCards = originalCards.length;
  if (totalCards === 0) return;

  // Clone original cards once for seamless infinite wrapping (total 12 cards)
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const GAP = 24; // 24px matching CSS gap
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

  // Gliding speed in pixels per second (smooth, relaxed viewing pace)
  const SPEED = 48;

  // Reduced motion accessibility
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
  });

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 640) return 1.15; // 1 card with a peek of the next card on mobile
    if (w <= 1024) return 2;   // 2 cards on tablet
    return 3;                  // 3 cards on desktop
  }

  function updateDimensions() {
    const viewportWidth = viewport.getBoundingClientRect().width;
    const cardsPerView = getCardsPerView();

    if (cardsPerView === 1.15) {
      cardWidth = Math.min(viewportWidth * 0.85, 340);
    } else {
      cardWidth = (viewportWidth - (GAP * (cardsPerView - 1))) / cardsPerView;
    }

    const allCards = track.querySelectorAll('.podcast__card');
    allCards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.width = `${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
    });

    singleSetWidth = totalCards * (cardWidth + GAP);

    if (singleSetWidth > 0) {
      currentX = currentX % singleSetWidth;
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }
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

  // Hover Pause Handlers
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
      }
    });
  }, { threshold: 0.05 });
  observer.observe(carousel);

  // Handle window resize with debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateDimensions();
    }, 100);
  });

  // Initialize
  updateDimensions();
  animationId = requestAnimationFrame(animate);
}
