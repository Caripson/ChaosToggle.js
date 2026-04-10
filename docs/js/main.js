/* ChaosToggle.js — Site JS */

(function () {
  'use strict';

  function unwrapChaosToggle() {
    var raw = window.ChaosToggle;
    if (!raw) return null;
    if (typeof raw.init === 'function' || typeof raw.start === 'function') return raw;
    if (raw.ChaosToggle && (typeof raw.ChaosToggle.init === 'function' || typeof raw.ChaosToggle.start === 'function')) {
      return raw.ChaosToggle;
    }
    if (raw.default && (typeof raw.default.init === 'function' || typeof raw.default.start === 'function')) {
      return raw.default;
    }
    return null;
  }

  /* --- Homepage: ChaosToggle preview (scoped to #site-main) --- */
  var siteMain = document.getElementById('site-main');
  if (siteMain) {
    var ct = unwrapChaosToggle();
    if (ct) {
      window.ChaosToggle = ct;
      var boot = typeof ct.start === 'function' ? ct.start.bind(ct) : ct.init.bind(ct);
      var modePolicyMap = { celebration: 'safe', panic: 'demo', nuclear: 'demo' };
      boot({ duration: 3200, intensity: 0.82, scopeSelector: '#site-main', policy: 'demo' });

      var previewTheme = document.querySelector('[data-preview-theme]');
      var previewPolicy = document.querySelector('[data-preview-policy]');
      var previewLast = document.querySelector('[data-preview-last]');

      function readPolicy() {
        if (!ct.getSettings) return 'safe';
        var settings = ct.getSettings();
        return settings && settings.policy ? settings.policy : (settings && settings.safeMode ? 'safe' : 'prank');
      }

      function readTheme() {
        if (!ct.getTheme) return 'default';
        var theme = ct.getTheme();
        return theme && theme.name ? theme.name : 'default';
      }

      function syncPreview(lastAction) {
        if (previewTheme) previewTheme.textContent = readTheme();
        if (previewPolicy) previewPolicy.textContent = readPolicy();
        if (previewLast && lastAction) previewLast.textContent = lastAction;
      }

      function setPolicy(policy) {
        if (!ct.updateSettings) return;
        ct.updateSettings({ policy: policy });
      }

      syncPreview('ready');

      document.addEventListener('click', function (e) {
        var effBtn = e.target.closest('[data-landing-effect]');
        if (effBtn && ct.runEffect) {
          e.preventDefault();
          if (ct.reset) ct.reset();
          var effectId = effBtn.getAttribute('data-landing-effect') || '';
          ct.runEffect(effectId);
          syncPreview('effect: ' + effectId);
          return;
        }
        var themeBtn = e.target.closest('[data-landing-theme]');
        if (themeBtn && ct.runTheme) {
          e.preventDefault();
          var nextPolicy = themeBtn.getAttribute('data-landing-policy');
          if (nextPolicy) setPolicy(nextPolicy);
          ct.reset();
          ct.runTheme(themeBtn.getAttribute('data-landing-theme') || '');
          syncPreview('theme');
          return;
        }
        var policyBtn = e.target.closest('[data-landing-policy]');
        if (policyBtn && !policyBtn.hasAttribute('data-landing-theme')) {
          e.preventDefault();
          setPolicy(policyBtn.getAttribute('data-landing-policy') || 'safe');
          syncPreview('policy');
          return;
        }
        var modeBtn = e.target.closest('[data-landing-mode]');
        if (modeBtn && ct.runMode) {
          e.preventDefault();
          var modeName = modeBtn.getAttribute('data-landing-mode') || '';
          var modePolicy = modePolicyMap[modeName];
          if (modePolicy) setPolicy(modePolicy);
          if (ct.reset) ct.reset();
          ct.runMode(modeName);
          syncPreview('mode: ' + modeName);
        }
      });
    }
  }

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
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
})();
