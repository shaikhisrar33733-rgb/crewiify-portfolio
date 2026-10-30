/**
 * podcast.js - CREWIIFY Dedicated Podcast Section Video Carousel
 * Continuous smooth auto-gliding infinite carousel with interactive video playback,
 * original audio support, mute/unmute controls, and previous/next navigation arrows.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPodcastCarousel();
});

function initPodcastCarousel() {
  const carousel = document.getElementById('podcastCarousel');
  const viewport = document.getElementById('podcastViewport');
  const track = document.getElementById('podcastTrack');
  const prevBtn = document.getElementById('podcastPrevBtn');
  const nextBtn = document.getElementById('podcastNextBtn');

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
  let dragMoved = false;
  let isVisible = true;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let lastTimestamp = 0;
  let animationId = null;

  // Active playing card tracking (ensures only one video plays with sound)
  let activePlayingCard = null;
  let isAnyVideoPlaying = false;

  // Gliding speed in pixels per second
  const SPEED = 46;

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

  // Play a video with original sound and pause carousel gliding
  function playVideoWithSound(card) {
    const video = card.querySelector('video');
    if (!video) return;

    // If another card was active, stop it first
    if (activePlayingCard && activePlayingCard !== card) {
      stopActiveVideo(false);
    }

    // Pause all other carousel videos so ONLY this video plays
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach((v) => {
      if (v !== video) {
        v.pause();
        v.muted = true;
      }
    });

    // Unmute and play this video with original audio
    video.muted = false;
    video.volume = 1;
    video.loop = false; // Allows 'ended' event to trigger completion

    if (video.ended || (video.duration && video.currentTime >= video.duration - 0.2)) {
      video.currentTime = 0;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback silently if browser restrictions prevent unmuted audio
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    card.classList.add('is-playing', 'is-unmuted');
    activePlayingCard = card;
    isAnyVideoPlaying = true;

    const playBtn = card.querySelector('.podcast__play-btn');
    if (playBtn) {
      playBtn.setAttribute('title', 'Pause episode');
      playBtn.setAttribute('aria-label', 'Pause episode');
    }
    const muteBtn = card.querySelector('.podcast__mute-btn');
    if (muteBtn) {
      muteBtn.setAttribute('title', 'Mute sound');
      muteBtn.setAttribute('aria-label', 'Mute podcast audio');
    }
  }

  // Stop currently playing active video and optionally resume carousel
  function stopActiveVideo(andResumeCarousel = true) {
    if (activePlayingCard) {
      const vid = activePlayingCard.querySelector('video');
      if (vid) {
        vid.pause();
        vid.muted = true;
        vid.loop = true;
      }
      activePlayingCard.classList.remove('is-playing', 'is-unmuted');
      const pBtn = activePlayingCard.querySelector('.podcast__play-btn');
      if (pBtn) {
        pBtn.setAttribute('title', 'Play episode');
        pBtn.setAttribute('aria-label', 'Play podcast video with sound');
      }
      const mBtn = activePlayingCard.querySelector('.podcast__mute-btn');
      if (mBtn) {
        mBtn.setAttribute('title', 'Unmute sound');
        mBtn.setAttribute('aria-label', 'Unmute podcast audio');
      }
      activePlayingCard = null;
    }
    isAnyVideoPlaying = false;
    if (andResumeCarousel) {
      lastTimestamp = performance.now();
      playAllSilentVideos();
    }
  }

  // Toggle Mute/Unmute sound for a video card
  function toggleMute(card) {
    const video = card.querySelector('video');
    if (!video) return;

    video.muted = !video.muted;
    const muteBtn = card.querySelector('.podcast__mute-btn');

    if (video.muted) {
      card.classList.remove('is-unmuted');
      if (muteBtn) {
        muteBtn.setAttribute('title', 'Unmute sound');
        muteBtn.setAttribute('aria-label', 'Unmute podcast audio');
      }
    } else {
      video.volume = 1;
      card.classList.add('is-unmuted');
      if (muteBtn) {
        muteBtn.setAttribute('title', 'Mute sound');
        muteBtn.setAttribute('aria-label', 'Mute podcast audio');
      }
      // If the card was not yet in active playing mode, activate it
      if (!card.classList.contains('is-playing')) {
        playVideoWithSound(card);
      }
    }
  }

  // Setup video ended & pause listener callbacks
  function setupVideoEventListeners() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.addEventListener('ended', () => {
        const card = v.closest('.podcast__card');
        if (card === activePlayingCard) {
          stopActiveVideo(true);
        }
      });
      v.addEventListener('pause', () => {
        const card = v.closest('.podcast__card');
        if (card === activePlayingCard && !v.ended && v.paused) {
          card.classList.remove('is-playing');
          isAnyVideoPlaying = false;
          lastTimestamp = performance.now();
          playAllSilentVideos();
        }
      });
    });
  }

  // Background silent loop playback for all carousel videos
  function playAllSilentVideos() {
    if (isAnyVideoPlaying) return;
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
      v.play().catch(() => {});
    });
  }

  function pauseAllVideos() {
    const allVideos = track.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.pause();
    });
  }

  // Animation Loop using requestAnimationFrame
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Movement pauses when a video is being played by the user (!isAnyVideoPlaying)
    if (isVisible && !isHovered && !isDragging && !isReducedMotion && !isAnyVideoPlaying && singleSetWidth > 0) {
      currentX += SPEED * deltaTime;
      if (currentX >= singleSetWidth) {
        currentX = currentX % singleSetWidth;
      }
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
    }

    animationId = requestAnimationFrame(animate);
  }

  // Navigation Arrows Support
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const gap = getGap();
      const step = cardWidth + gap;
      currentX -= step;
      while (currentX < 0) currentX += singleSetWidth;
      track.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
      setTimeout(() => {
        track.style.transition = '';
        lastTimestamp = performance.now();
      }, 350);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const gap = getGap();
      const step = cardWidth + gap;
      currentX += step;
      if (currentX >= singleSetWidth) currentX = currentX % singleSetWidth;
      track.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      track.style.transform = `translate3d(-${currentX}px, 0, 0)`;
      setTimeout(() => {
        track.style.transition = '';
        lastTimestamp = performance.now();
      }, 350);
    });
  }

  // Hover Handlers
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
    dragMoved = false;
    dragStartOffset = currentX;
    viewport.classList.add('is-dragging');
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = dragStartX - clientX;
    if (Math.abs(deltaX) > 6) {
      dragMoved = true;
    }
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

  // Unified click handler on carousel track
  track.addEventListener('click', (e) => {
    // If the user performed a drag movement, cancel click
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = false;
      return;
    }

    // 1. Mute/Unmute button click
    const muteBtn = e.target.closest('.podcast__mute-btn');
    if (muteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = muteBtn.closest('.podcast__card');
      if (card) toggleMute(card);
      return;
    }

    // 2. Play/Pause button or media click
    const playBtn = e.target.closest('.podcast__play-btn');
    const media = e.target.closest('.podcast__media');
    if (playBtn || media) {
      e.preventDefault();
      e.stopPropagation();
      const card = (playBtn || media).closest('.podcast__card');
      if (!card) return;

      if (card.classList.contains('is-playing')) {
        stopActiveVideo(true);
      } else {
        playVideoWithSound(card);
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  });

  // IntersectionObserver to pause when offscreen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        lastTimestamp = performance.now();
        if (!isAnyVideoPlaying) {
          playAllSilentVideos();
        }
      } else {
        pauseAllVideos();
      }
    });
  }, { threshold: 0.05 });
  observer.observe(carousel);

  // Fallback trigger for mobile browser autoplay policies
  const resumeSilentVideos = () => {
    if (!isAnyVideoPlaying) {
      playAllSilentVideos();
    }
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

  // Initialize layout, video events, and start continuous loop
  updateDimensions();
  setupVideoEventListeners();
  playAllSilentVideos();
  animationId = requestAnimationFrame(animate);
}
