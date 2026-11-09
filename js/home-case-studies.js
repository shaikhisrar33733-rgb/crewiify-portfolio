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
  initWebsitePreviewScroll();
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
   With Interactive Play/Pause, Sound Audio, Mute Toggle & Carousel Motion Pause
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

  // Clone original cards once for seamless infinite wrapping
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

  // Helper to retrieve the active <video> element from a card (direct or iframe embed)
  function getVideo(card) {
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

  // Attach video event listeners for ended and pause handlers
  function attachVideoListeners(v, card) {
    if (!v || v.dataset.hasOurWorkListeners === 'true') return;
    v.dataset.hasOurWorkListeners = 'true';
    v.addEventListener('ended', () => {
      if (card === activePlayingCard) {
        stopActiveVideo(true);
      }
    });
    v.addEventListener('pause', () => {
      if (card === activePlayingCard && !v.ended && v.paused) {
        card.classList.remove('is-playing');
        isAnyVideoPlaying = false;
        lastTimestamp = performance.now();
        playAllSilentVideos();
      }
    });
  }

  // Lazy-load an iframe embed for a card when approaching viewport
  function loadCardIframe(card, onReady) {
    if (!card) return;
    const iframe = card.querySelector('iframe');
    if (!iframe) {
      const v = card.querySelector('video');
      if (v) {
        attachVideoListeners(v, card);
        if (typeof onReady === 'function') onReady(v);
      }
      return;
    }

    if (card.dataset.iframeLoaded === 'true') {
      const v = getVideo(card);
      if (v && typeof onReady === 'function') onReady(v);
      return;
    }

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
          attachVideoListeners(v, card);
          if (!isAnyVideoPlaying) {
            v.play().catch(() => {});
          }
          if (typeof onReady === 'function') {
            onReady(v);
          }
        }
      } catch (e) {}
    });
  }

  let checkOurWorkVisible = null;

  // IntersectionObserver for deferred lazy-loaded iframe embeds
  function initOurWorkLazyLoading() {
    const allCards = track.querySelectorAll('.home-work__card');
    if (!allCards.length) return;

    checkOurWorkVisible = () => {
      const carouselRect = carousel.getBoundingClientRect();
      if (carouselRect.bottom < -300 || carouselRect.top > window.innerHeight + 300) {
        return;
      }
      const viewportRect = viewport.getBoundingClientRect();
      allCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.right >= viewportRect.left - 250 && cardRect.left <= viewportRect.right + 250) {
          loadCardIframe(card);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkOurWorkVisible();
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
            loadCardIframe(entry.target);
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
      allCards.forEach(loadCardIframe);
    }
  }

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

  // Play a video with original sound and pause carousel gliding
  function playVideoWithSound(card) {
    const applyPlay = (video) => {
      if (!video) return;

      // If another card was active, stop it first
      if (activePlayingCard && activePlayingCard !== card) {
        stopActiveVideo(false);
      }

      // Pause all other carousel videos so ONLY this video plays
      const allCards = track.querySelectorAll('.home-work__card');
      allCards.forEach((c) => {
        if (c !== card) {
          const v = getVideo(c);
          if (v) {
            v.pause();
            v.muted = true;
          }
        }
      });

      // Unmute and play this video
      video.muted = false;
      video.volume = 1;
      video.loop = false;

      if (video.ended || (video.duration && video.currentTime >= video.duration - 0.2)) {
        video.currentTime = 0;
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }

      card.classList.add('is-playing', 'is-unmuted');
      activePlayingCard = card;
      isAnyVideoPlaying = true;

      const playBtn = card.querySelector('.home-work__play-btn');
      if (playBtn) {
        playBtn.setAttribute('title', 'Pause video');
        playBtn.setAttribute('aria-label', 'Pause video');
      }
      const muteBtn = card.querySelector('.home-work__mute-btn');
      if (muteBtn) {
        muteBtn.setAttribute('title', 'Mute sound');
        muteBtn.setAttribute('aria-label', 'Mute video audio');
      }
    };

    const existingVid = getVideo(card);
    if (existingVid) {
      applyPlay(existingVid);
    } else {
      loadCardIframe(card, applyPlay);
    }
  }

  // Stop currently playing active video and optionally resume carousel
  function stopActiveVideo(andResumeCarousel = true) {
    if (activePlayingCard) {
      const vid = getVideo(activePlayingCard);
      if (vid) {
        vid.pause();
        vid.muted = true;
        vid.loop = true;
      }
      activePlayingCard.classList.remove('is-playing', 'is-unmuted');
      const pBtn = activePlayingCard.querySelector('.home-work__play-btn');
      if (pBtn) {
        pBtn.setAttribute('title', 'Play video');
        pBtn.setAttribute('aria-label', 'Play video with sound');
      }
      const mBtn = activePlayingCard.querySelector('.home-work__mute-btn');
      if (mBtn) {
        mBtn.setAttribute('title', 'Unmute sound');
        mBtn.setAttribute('aria-label', 'Unmute video audio');
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
    const handleToggle = (video) => {
      if (!video) return;

      video.muted = !video.muted;
      const muteBtn = card.querySelector('.home-work__mute-btn');

      if (video.muted) {
        card.classList.remove('is-unmuted');
        if (muteBtn) {
          muteBtn.setAttribute('title', 'Unmute sound');
          muteBtn.setAttribute('aria-label', 'Unmute video audio');
        }
      } else {
        video.volume = 1;
        card.classList.add('is-unmuted');
        if (muteBtn) {
          muteBtn.setAttribute('title', 'Mute sound');
          muteBtn.setAttribute('aria-label', 'Mute video audio');
        }
        if (!card.classList.contains('is-playing')) {
          playVideoWithSound(card);
        }
      }
    };

    const existingVid = getVideo(card);
    if (existingVid) {
      handleToggle(existingVid);
    } else {
      loadCardIframe(card, handleToggle);
    }
  }

  // Background silent loop playback for all carousel videos
  function playAllSilentVideos() {
    if (isAnyVideoPlaying) return;
    const allCards = track.querySelectorAll('.home-work__card');
    allCards.forEach((card) => {
      const v = getVideo(card);
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
    });
  }

  function pauseAllVideos() {
    const allCards = track.querySelectorAll('.home-work__card');
    allCards.forEach((card) => {
      const v = getVideo(card);
      if (v) v.pause();
    });
  }

  let lastOurWorkLazyCheck = 0;

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

      if (timestamp - lastOurWorkLazyCheck > 500) {
        lastOurWorkLazyCheck = timestamp;
        if (typeof checkOurWorkVisible === 'function') {
          checkOurWorkVisible();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // Hover Handlers (Pause on pointer hover, resume on pointer leave)
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
    const muteBtn = e.target.closest('.home-work__mute-btn');
    if (muteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = muteBtn.closest('.home-work__card');
      if (card) toggleMute(card);
      return;
    }

    // 2. Play/Pause button or media click
    const playBtn = e.target.closest('.home-work__play-btn');
    const media = e.target.closest('.home-cs__media');
    if (playBtn || media) {
      e.preventDefault();
      e.stopPropagation();
      const card = (playBtn || media).closest('.home-work__card');
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

  // Initialize layout, lazy-loading observer, and start continuous loop
  updateDimensions();
  initOurWorkLazyLoading();
  playAllSilentVideos();
  animationId = requestAnimationFrame(animate);
}

/* ==========================================================================
   06. SCROLLABLE WEBSITE PREVIEW CARDS (Independent Mouse-Wheel Scrolling)
   ========================================================================== */

function initWebsitePreviewScroll() {
  const websiteSection = document.getElementById('website-projects');
  if (!websiteSection) return;

  const previewMedias = websiteSection.querySelectorAll('.home-cs__media');
  if (!previewMedias.length) return;

  let activePreview = null;

  previewMedias.forEach(media => {
    // When pointer enters the preview viewport, mark as active preview
    media.addEventListener('mouseenter', () => {
      activePreview = media;
    });

    media.addEventListener('mouseleave', () => {
      if (activePreview === media) {
        activePreview = null;
      }
    });

    media.addEventListener('pointerenter', () => {
      activePreview = media;
    });

    media.addEventListener('pointerleave', () => {
      if (activePreview === media) {
        activePreview = null;
      }
    });
  });

  // Reset active preview whenever pointer moves anywhere outside the active preview
  document.addEventListener('mousemove', (e) => {
    if (activePreview && !activePreview.contains(e.target)) {
      activePreview = null;
    }
  }, { passive: true });

  // Prevent main Crewiify portfolio page from scrolling when pointer is over a website preview
  window.addEventListener('wheel', (e) => {
    if (activePreview) {
      e.preventDefault();
    }
  }, { passive: false });
}
