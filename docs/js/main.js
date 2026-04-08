/* ChaosToggle.js — Site JS */

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
      if (e.target.closest('a, button, code, kbd')) return;
      card.classList.toggle('open');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('open');
      }
    });
  });

  /* --- Install tabs --- */
  var tabBtns = document.querySelectorAll('.install-tab');
  var tabPanels = document.querySelectorAll('.install-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.querySelector('[data-panel="' + target + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  /* --- Copy buttons --- */
  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var pre = btn.closest('pre');
      if (!pre) return;
      var code = pre.querySelector('code');
      if (!code) return;
      var text = code.textContent || '';
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied. No turning back.';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();
