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

  // Clone original cards for seamless infinite wrapping (at least 12 cards total)
  const cloneSets = totalCards <= 5 ? 2 : 1;
  for (let s = 0; s < cloneSets; s++) {
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      delete clone.dataset.iframeLoaded;
      const cloneIframe = clone.querySelector('iframe');
      if (cloneIframe) {
        cloneIframe.removeAttribute('src');
        cloneIframe.removeAttribute('srcdoc');
      }
      track.appendChild(clone);
    });
  }

  // Helper to retrieve the active <video> element from a podcast card
  function getPodcastVideo(card) {
    if (!card) return null;
    const iframe = card.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      try {
        const v = iframe.contentDocument.querySelector('video');
        if (v) return v;
      } catch (e) {}
    }
    return card.querySelector('video');
  }

  // Lazy-load an iframe embed for a podcast card when approaching viewport
  function loadPodcastIframe(card) {
    if (!card || card.dataset.iframeLoaded === 'true') return;
    const iframe = card.querySelector('iframe');
    if (!iframe) return;

    const src = iframe.dataset.src;
    if (!src) return;

    card.dataset.iframeLoaded = 'true';
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; overflow:hidden; background:#0B0E17; }
    video { width:100%; height:100%; object-fit:contain; display:block; background:#0B0E17; }
  </style>
</head>
<body>
  <video src="${src}" autoplay muted loop playsinline preload="auto"></video>
</body>
</html>`;

    iframe.addEventListener('load', () => {
      try {
        const v = iframe.contentDocument ? iframe.contentDocument.querySelector('video') : null;
        if (v) {
          v.muted = true;
          v.volume = 0;
          v.loop = true;
          v.playsInline = true;
          v.setAttribute('muted', '');
          v.setAttribute('playsinline', '');
          v.setAttribute('loop', '');
          v.removeAttribute('controls');
          v.play().catch(() => {});
        }
      } catch (e) {}
    });
  }

  let checkPodcastVisible = null;

  // IntersectionObserver for deferred lazy-loaded iframe embeds
  function initPodcastLazyLoading() {
    const allCards = track.querySelectorAll('.podcast__card, .podcast-video-card');
    if (!allCards.length) return;

    checkPodcastVisible = () => {
      const carouselRect = carousel.getBoundingClientRect();
      if (carouselRect.bottom < -300 || carouselRect.top > window.innerHeight + 300) {
        return;
      }
      const viewportRect = viewport.getBoundingClientRect();
      allCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.right >= viewportRect.left - 250 && cardRect.left <= viewportRect.right + 250) {
          loadPodcastIframe(card);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkPodcastVisible();
          }
        });
      }, {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0.01
      });
      sectionObserver.observe(carousel);

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadPodcastIframe(entry.target);
            cardObserver.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '250px 250px',
        threshold: 0.01
      });

      allCards.forEach((card) => cardObserver.observe(card));
    } else {
      allCards.forEach(loadPodcastIframe);
    }
  }

  function getGap() {
    const section = document.querySelector('.home-podcast-section') || carousel;
    const style = window.getComputedStyle(section);
    const gap = parseFloat(style.getPropertyValue('--podcast-gap'));
    return gap || (window.innerWidth <= 768 ? 16 : 24);
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

  function updateDimensions() {
    const section = document.querySelector('.home-podcast-section') || carousel;
    const style = window.getComputedStyle(section);
    cardWidth = parseFloat(style.getPropertyValue('--podcast-card-w'));
    let cardHeight = parseFloat(style.getPropertyValue('--podcast-card-h'));
    const gap = parseFloat(style.getPropertyValue('--podcast-gap')) || getGap();

    if (!cardWidth || isNaN(cardWidth)) {
      if (window.innerWidth <= 480) {
        cardWidth = 260;
      } else if (window.innerWidth <= 768) {
        cardWidth = 300;
      } else if (window.innerWidth <= 1100) {
        cardWidth = 360;
      } else {
        cardWidth = 420;
      }
    }

    if (!cardHeight || isNaN(cardHeight)) {
      cardHeight = Math.round(cardWidth * (9 / 16));
    }

    const allCards = track.querySelectorAll('.podcast__card, .podcast-video-card');
    allCards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.width = `${cardWidth}px`;
      card.style.minWidth = `${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
      card.style.height = `${cardHeight}px`;
      card.style.minHeight = `${cardHeight}px`;
      card.style.maxHeight = `${cardHeight}px`;
      card.style.boxSizing = 'border-box';

      const media = card.querySelector('.podcast__media');
      if (media) {
        media.style.width = '100%';
        media.style.height = '100%';
        media.style.minWidth = '100%';
        media.style.minHeight = '100%';
        media.style.maxWidth = '100%';
        media.style.maxHeight = '100%';
        media.style.display = 'flex';
        media.style.alignItems = 'center';
        media.style.justifyContent = 'center';
      }

      const video = card.querySelector('video');
      if (video) {
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.minWidth = '100%';
        video.style.minHeight = '100%';
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        video.style.objectFit = 'contain';
        video.style.objectPosition = 'center';
        video.style.display = 'block';
        video.style.margin = '0';
        video.style.padding = '0';
        video.style.background = '#0B0E17';
      }

      const iframe = card.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.minWidth = '100%';
        iframe.style.minHeight = '100%';
        iframe.style.maxWidth = '100%';
        iframe.style.maxHeight = '100%';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.background = '#0B0E17';
      }
    });

    singleSetWidth = totalCards * (cardWidth + gap);

    if (singleSetWidth > 0) {
      currentX = currentX % singleSetWidth;
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }
  }

  // Ensure all videos play silently in continuous loop with exact contain dimensions
  function playAllSilentVideos() {
    const allCards = track.querySelectorAll('.podcast__card, .podcast-video-card');
    allCards.forEach((card) => {
      const v = getPodcastVideo(card);
      if (v) {
        v.muted = true;
        v.volume = 0;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('loop', '');
        v.removeAttribute('controls');
        v.style.width = '100%';
        v.style.height = '100%';
        v.style.objectFit = 'contain';
        v.style.objectPosition = 'center';
        v.style.display = 'block';
        v.style.margin = '0';
        v.style.padding = '0';
        v.style.background = '#0B0E17';
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    });
  }

  function pauseAllVideos() {
    const allCards = track.querySelectorAll('.podcast__card, .podcast-video-card');
    allCards.forEach((card) => {
      const v = getPodcastVideo(card);
      if (v) {
        v.pause();
      }
    });
  }

  let lastPodcastLazyCheck = 0;

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

      if (timestamp - lastPodcastLazyCheck > 500) {
        lastPodcastLazyCheck = timestamp;
        if (typeof checkPodcastVisible === 'function') {
          checkPodcastVisible();
        }
      }
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

  // Initialize layout, video lazy loading, and start continuous loop
  updateDimensions();
  initPodcastLazyLoading();
  playAllSilentVideos();
  animationId = requestAnimationFrame(animate);
}
