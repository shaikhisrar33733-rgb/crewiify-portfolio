/**
 * blog.js - Crewiify Blog Carousel Controller
 * Responsive horizontal carousel with step pagination, touch swipe,
 * button state management, and resize handling.
 */

(function () {
  'use strict';

  function initBlogCarousel() {
    var section = document.getElementById('blog');
    if (!section) return;

    var track = section.querySelector('#blogTrack');
    var viewport = section.querySelector('#blogViewport');
    var prevBtn = section.querySelector('#blogPrevBtn');
    var nextBtn = section.querySelector('#blogNextBtn');
    var cards = section.querySelectorAll('.blog__card');

    if (!track || !viewport || !prevBtn || !nextBtn || cards.length === 0) return;

    var currentIndex = 0;
    var totalCards = cards.length;

    function getVisibleCount() {
      var w = window.innerWidth;
      if (w <= 640) return 1;
      return 2;
    }

    function getMaxIndex() {
      var visible = getVisibleCount();
      return Math.max(0, totalCards - visible);
    }

    function getStep() {
      return getVisibleCount();
    }

    function updateCarousel(animate) {
      if (animate === undefined) animate = true;

      var maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }

      if (!animate) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)';
      }

      var firstCard = cards[0];
      var targetCard = cards[currentIndex];
      var offset = targetCard.offsetLeft - firstCard.offsetLeft;

      track.style.transform = 'translateX(-' + offset + 'px)';

      // Update button states
      var isStart = currentIndex <= 0;
      var isEnd = currentIndex >= maxIndex;

      prevBtn.disabled = isStart;
      prevBtn.setAttribute('aria-disabled', isStart ? 'true' : 'false');
      if (isStart) {
        prevBtn.classList.add('is-disabled');
      } else {
        prevBtn.classList.remove('is-disabled');
      }

      nextBtn.disabled = isEnd;
      nextBtn.setAttribute('aria-disabled', isEnd ? 'true' : 'false');
      if (isEnd) {
        nextBtn.classList.add('is-disabled');
      } else {
        nextBtn.classList.remove('is-disabled');
      }
    }

    function goPrev() {
      var step = getStep();
      if (currentIndex > 0) {
        currentIndex = Math.max(0, currentIndex - step);
        updateCarousel(true);
      }
    }

    function goNext() {
      var step = getStep();
      var maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex = Math.min(maxIndex, currentIndex + step);
        updateCarousel(true);
      }
    }

    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      goPrev();
    });

    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      goNext();
    });

    // Touch swipe support
    var startX = 0;
    var startY = 0;
    var currentX = 0;
    var isSwiping = false;

    viewport.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      isSwiping = true;
    }, { passive: true });

    viewport.addEventListener('touchmove', function (e) {
      if (!isSwiping || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      if (!isSwiping) return;
      isSwiping = false;
      var diffX = currentX - startX;
      var diffY = (e.changedTouches && e.changedTouches[0]) ? (e.changedTouches[0].clientY - startY) : 0;

      // Ensure horizontal swipe is dominant and above threshold (40px)
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    }, { passive: true });

    // Keyboard navigation
    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    });

    // Resize listener with debounce
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateCarousel(false);
      }, 100);
    });

    // Initial positioning
    updateCarousel(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogCarousel);
  } else {
    initBlogCarousel();
  }
})();

