/* ChaosToggle.js — Site JS (minimal) */

(function () {
  'use strict';

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
})();
