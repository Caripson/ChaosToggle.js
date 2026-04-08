/* ChaosToggle.js — Site JS (minimal) */

(function () {
  'use strict';

  /* --- Mobile nav toggle --- */
  var hamburger = document.querySelector('.nav-hamburger');
  var drawer = document.querySelector('.nav-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
      });
    });
  }

  /* --- Feature card expand/collapse --- */
  document.querySelectorAll('.feature-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button, code')) return;
      card.classList.toggle('open');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('open');
      }
    });
  });
})();
