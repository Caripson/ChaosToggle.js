/* ChaosToggle.js v0.2.0
 * Drop-in visual chaos effects for demos and storytelling.
 * This library is for playful visual effects only.
 */
(function (global) {
  'use strict';

  var VERSION = '0.2.0';

  var DEFAULT_THEME_PROFILE = {
    visual: {
      className: '',
      forceDark: false,
      palette: { primary: '#ff4d6d', accent: '#00f5ff', background: '#111111', text: '#f8f8f8' },
      fontFamily: 'ui-sans-serif,system-ui'
    },
    effects: {},
    animation: { style: 'default', intensityMultiplier: 1, shakeStyle: 'default' },
    particles: { type: 'confetti', density: 1, emoji: null, mixWithConfetti: false },
    popup: { title: 'Demo Alert', message: 'ChaosToggle demo popup. This is a visual effect only.', confirmText: 'Keep going', tone: 'neutral' },
    sound: { enabled: false, preset: null },
    timing: { durationMultiplier: 1, cooldownMultiplier: 1, pattern: 'default' },
    triggers: {},
    overlay: { type: 'none', opacity: 0.18 },
    decorations: { hints: false },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false }
  };

  var DEFAULT_SETTINGS = {
    autoInit: false,
    enabled: true,
    safeMode: true,
    debug: false,
    scopeSelector: 'body',
    cooldownMs: 150,
    randomSeed: null,
    theme: 'default',
    themeOverrides: {},
    themeParts: {
      visual: true,
      effects: true,
      animation: true,
      particles: true,
      popup: true,
      sound: true,
      timing: true,
      triggers: true,
      overlay: true,
      decorations: true,
      behavior: true
    },
    duration: 1800,
    intensity: 0.6,
    probability: 1,
    shortcutsEnabled: true,
    popup: {
      title: 'Demo Alert',
      message: 'ChaosToggle demo popup. This is a visual effect only.',
      confirmText: 'Keep going'
    },
    effects: {
      shake: true,
      glitchOverlay: true,
      popups: true,
      confetti: true,
      flashOverlay: true,
      textScramble: true,
      fakeErrorState: true,
      noise: true,
      zoomFlicker: true
    },
    triggers: {
      onLoad: false,
      onClickSelector: null
    },
    shortcuts: {
      'Shift+H': 'trigger',
      'Shift+P': 'runMode:panic',
      'Shift+R': 'reset',
      'Shift+C': 'runMode:celebration'
    },
    modes: {}
  };

  var PRESET_MODES = {
    subtle: { intensity: 0.25, duration: 900, effects: { shake: true, glitchOverlay: false, confetti: false, flashOverlay: false, textScramble: true, noise: false, zoomFlicker: false, popups: false, fakeErrorState: false } },
    demo: { intensity: 0.5, duration: 1500, effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: false, popups: true, fakeErrorState: false } },
    chaos: { intensity: 0.75, duration: 2200, effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } },
    nuclear: { intensity: 1, duration: 3200, effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } },
    celebration: { intensity: 0.6, duration: 2200, effects: { shake: false, glitchOverlay: false, confetti: true, flashOverlay: false, textScramble: false, noise: false, zoomFlicker: false, popups: true, fakeErrorState: false } },
    glitch: { intensity: 0.65, duration: 1800, effects: { shake: false, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: false, fakeErrorState: false } },
    panic: { intensity: 0.85, duration: 2600, effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } }
  };

  var BUILTIN_THEMES = {
    'default': {},
    easter: {
      visual: { className: 'ct-theme-easter', palette: { primary: '#ffc8dd', accent: '#b8f2e6', background: '#fffaf3', text: '#4d4067' } },
      effects: { shake: true, glitchOverlay: false, flashOverlay: false, noise: false, fakeErrorState: false },
      animation: { style: 'bounce', intensityMultiplier: 0.55, shakeStyle: 'wobble' },
      particles: { type: 'eggs', density: 0.45, emoji: '🥚' },
      popup: { title: 'Spring Mode', message: 'Something fun just hatched.', tone: 'playful' },
      overlay: { type: 'gradient', opacity: 0.13, gradient: 'linear-gradient(130deg, rgba(255,200,221,.55), rgba(255,240,184,.45), rgba(184,242,230,.45))' },
      decorations: { hints: true },
      behavior: { microJumps: false, pulse: false }
    },
    halloween: {
      visual: { className: 'ct-theme-halloween', forceDark: true, palette: { primary: '#ff8f1f', accent: '#8b5cf6', background: '#09070f', text: '#f8f4ef' } },
      effects: { shake: true, glitchOverlay: true, noise: true, flashOverlay: true },
      animation: { style: 'glitchy', intensityMultiplier: 0.9, shakeStyle: 'rumble' },
      particles: { type: 'ghosts', density: 0.3, emoji: '👻' },
      popup: { title: 'Eerie Signal', message: 'Something is not quite right…', tone: 'eerie' },
      overlay: { type: 'fog', opacity: 0.25 },
      behavior: { microJumps: true }
    },
    christmas: {
      visual: { className: 'ct-theme-christmas', palette: { primary: '#d62839', accent: '#2a9d6f', background: '#10231f', text: '#fff8e5' } },
      effects: { shake: false, flashOverlay: false, fakeErrorState: false, glitchOverlay: false },
      animation: { style: 'smooth', intensityMultiplier: 0.5, shakeStyle: 'float' },
      particles: { type: 'snow', density: 0.55, emoji: '❄️' },
      popup: { title: 'Holiday Theme', message: 'Holiday mode activated.', tone: 'friendly' },
      sound: { enabled: true, preset: 'bells' },
      overlay: { type: 'glow', opacity: 0.16 },
      behavior: { drift: true }
    },
    'new-year': {
      visual: { className: 'ct-theme-new-year', palette: { primary: '#ffef5a', accent: '#ff4fd8', background: '#0c1028', text: '#ffffff' } },
      effects: { shake: true, flashOverlay: true, confetti: true },
      animation: { style: 'sharp', intensityMultiplier: 1 },
      particles: { type: 'fireworks', density: 1.1, mixWithConfetti: true },
      popup: { title: 'New Year', message: 'New cycle initiated.', tone: 'energetic' },
      timing: { pattern: 'fast', durationMultiplier: 1.1 },
      behavior: { countdown: true }
    },
    '4th-of-july': {
      visual: { className: 'ct-theme-july4', palette: { primary: '#f94144', accent: '#577590', background: '#0f172a', text: '#f8fafc' } },
      effects: { shake: true, flashOverlay: true },
      animation: { style: 'recoil', intensityMultiplier: 0.88 },
      particles: { type: 'fireworks', density: 0.85 },
      popup: { title: 'Freedom Mode', message: 'System freedom mode.', tone: 'bold' },
      overlay: { type: 'pulse', opacity: 0.21 },
      behavior: { recoil: true }
    },
    thanksgiving: {
      visual: { className: 'ct-theme-thanksgiving', palette: { primary: '#bc6c25', accent: '#7f5539', background: '#2a1b14', text: '#f8eedf' } },
      effects: { shake: false, glitchOverlay: false, flashOverlay: false, noise: false },
      animation: { style: 'smooth', intensityMultiplier: 0.4 },
      particles: { type: 'leaves', density: 0.45, emoji: '🍂' },
      popup: { title: 'Pause', message: 'Taking a moment…', tone: 'reflective' },
      overlay: { type: 'cozy', opacity: 0.14 },
      behavior: { drift: true }
    },
    'black-friday': {
      visual: { className: 'ct-theme-black-friday', forceDark: true, palette: { primary: '#00f5d4', accent: '#f15bb5', background: '#050505', text: '#f8f8f8' } },
      effects: { shake: true, glitchOverlay: true, flashOverlay: true, popups: true },
      animation: { style: 'flicker', intensityMultiplier: 0.95 },
      particles: { type: 'minimal', density: 0.15 },
      popup: { title: 'Flash Event', message: 'Limited time overload.', tone: 'urgent' },
      timing: { pattern: 'fast', durationMultiplier: 0.85 },
      behavior: { microJumps: true, countdown: true }
    },
    'cyber-monday': {
      visual: { className: 'ct-theme-cyber-monday', forceDark: true, palette: { primary: '#00bbf9', accent: '#00f5ff', background: '#040b18', text: '#dbf8ff' } },
      effects: { shake: false, glitchOverlay: true, flashOverlay: true, noise: true },
      animation: { style: 'digital', intensityMultiplier: 0.74 },
      particles: { type: 'minimal', density: 0.1 },
      popup: { title: 'Protocol', message: 'Protocol override detected.', tone: 'system' },
      overlay: { type: 'scanline', opacity: 0.22 },
      behavior: { microJumps: true }
    },
    'valentines-day': {
      visual: { className: 'ct-theme-valentine', palette: { primary: '#ff4d8d', accent: '#ff8fab', background: '#2b1123', text: '#fff3f7' } },
      effects: { shake: false, glitchOverlay: false, flashOverlay: false, fakeErrorState: false },
      animation: { style: 'smooth', intensityMultiplier: 0.46 },
      particles: { type: 'hearts', density: 0.5, emoji: '💖' },
      popup: { title: 'Spark', message: 'Something sparked.', tone: 'light' },
      overlay: { type: 'gradient', opacity: 0.16, gradient: 'radial-gradient(circle at 20% 10%, rgba(255,77,141,.28), rgba(255,143,171,.14), rgba(43,17,35,.16))' },
      behavior: { pulse: true }
    },
    birthday: {
      visual: { className: 'ct-theme-birthday', palette: { primary: '#ffbe0b', accent: '#8338ec', background: '#1b1140', text: '#ffffff' } },
      effects: { confetti: true, popups: true, shake: true, flashOverlay: true },
      animation: { style: 'party', intensityMultiplier: 0.78 },
      particles: { type: 'balloons', density: 0.7, mixWithConfetti: true },
      popup: { title: 'Level Up', message: 'Another level unlocked.', tone: 'celebratory' },
      timing: { pattern: 'cinematic', durationMultiplier: 1.2 },
      behavior: { loopBursts: true }
    }
  };

  function isObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }

  function deepMerge(target, source) {
    var out = Object.assign({}, target);
    if (!isObject(source)) return out;
    Object.keys(source).forEach(function (key) {
      var srcVal = source[key];
      if (isObject(srcVal) && isObject(out[key])) out[key] = deepMerge(out[key], srcVal);
      else out[key] = srcVal;
    });
    return out;
  }

  function pickEnabledSections(base, incoming, parts, fallback) {
    var out = deepMerge({}, base);
    Object.keys(parts || {}).forEach(function (key) {
      if (parts[key] !== false) return;
      if (fallback && typeof fallback[key] !== 'undefined') out[key] = deepMerge({}, fallback[key]);
      else delete out[key];
    });
    Object.keys(incoming || {}).forEach(function (key) {
      if (parts && parts[key] === false) return;
      out[key] = isObject(incoming[key]) && isObject(out[key]) ? deepMerge(out[key], incoming[key]) : incoming[key];
    });
    return out;
  }

  function clamp(num, min, max) { return Math.max(min, Math.min(max, num)); }

  function createEl(tag, className, styles) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (styles) Object.assign(el.style, styles);
    return el;
  }

  function normalizeCombo(combo) {
    if (!combo || typeof combo !== 'string') return null;
    var parts = combo.split('+').map(function (p) { return p.trim().toLowerCase(); }).filter(Boolean);
    if (!parts.length) return null;
    var modifiers = ['ctrl', 'alt', 'shift', 'meta'];
    var out = [];
    modifiers.forEach(function (m) {
      if (parts.indexOf(m) !== -1 || (m === 'ctrl' && parts.indexOf('control') !== -1) || (m === 'meta' && (parts.indexOf('cmd') !== -1 || parts.indexOf('command') !== -1))) out.push(m);
    });
    var key = parts.find(function (p) { return modifiers.indexOf(p) === -1 && p !== 'control' && p !== 'cmd' && p !== 'command'; });
    if (!key) return null;
    out.push(key);
    return out.join('+');
  }

  function eventToCombo(event) {
    var out = [];
    if (event.ctrlKey) out.push('ctrl');
    if (event.altKey) out.push('alt');
    if (event.shiftKey) out.push('shift');
    if (event.metaKey) out.push('meta');
    out.push(String(event.key || '').toLowerCase());
    return out.join('+');
  }

  function ChaosToggleEngine() {
    this._settings = deepMerge(DEFAULT_SETTINGS, {});
    this._modes = deepMerge(PRESET_MODES, {});
    this._themes = deepMerge(BUILTIN_THEMES, {});
    this._themeState = deepMerge(DEFAULT_THEME_PROFILE, {});
    this._shortcutMap = new Map();
    this._destroyables = [];
    this._effectNodes = [];
    this._activeTimers = [];
    this._resetTimer = null;
    this._activeVisualClass = null;
    this._lastTriggerAt = 0;
    this._enabled = true;
    this._initialized = false;
    this._styleNode = null;
  }

  ChaosToggleEngine.prototype._log = function () {
    if (!this._settings.debug) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[ChaosToggle]');
    console.log.apply(console, args);
  };

  ChaosToggleEngine.prototype._maybe = function () { return Math.random() <= clamp(Number(this._settings.probability || 0), 0, 1); };

  ChaosToggleEngine.prototype._scopeRoot = function () { return document.querySelector(this._settings.scopeSelector) || document.body; };

  ChaosToggleEngine.prototype._installBaseStyles = function () {
    if (this._styleNode) return;
    var css = [
      '.chaos-toggle-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;mix-blend-mode:screen;}',
      '.chaos-toggle-glitch{background:repeating-linear-gradient(180deg,rgba(255,0,80,.18) 0 2px,rgba(0,255,255,.12) 2px 4px);opacity:.55;animation:ctGlitch .14s steps(2,end) infinite;}',
      '.chaos-toggle-noise{background-image:radial-gradient(circle,rgba(255,255,255,.2) 1px,transparent 1px);background-size:3px 3px;opacity:.2;}',
      '.chaos-toggle-flash{background:rgba(255,255,255,.35);animation:ctPulse .16s linear infinite;}',
      '.chaos-toggle-popup{position:fixed;right:18px;bottom:18px;max-width:320px;background:#111;color:#f8f8f8;border:2px solid #ff4d6d;border-radius:10px;padding:12px 12px 10px;box-shadow:0 12px 28px rgba(0,0,0,.4);z-index:2147483001;font-family:ui-sans-serif,system-ui;}',
      '.chaos-toggle-popup h4{margin:0 0 6px;font-size:14px;letter-spacing:.02em;}',
      '.chaos-toggle-popup p{margin:0 0 8px;font-size:12px;line-height:1.4;}',
      '.chaos-toggle-popup button{border:0;background:#ff4d6d;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;}',
      '.chaos-toggle-shake{animation:ctShake .05s linear infinite;}',
      '.chaos-toggle-shake-rumble{animation:ctRumble .24s linear infinite;}',
      '.chaos-toggle-shake-wobble{animation:ctWobble .22s ease-in-out infinite;}',
      '.chaos-toggle-shake-float{animation:ctFloat 2.4s ease-in-out infinite;}',
      '.chaos-toggle-zoom{animation:ctZoom .2s linear infinite alternate;}',
      '.chaos-toggle-error{filter:saturate(1.25) hue-rotate(-22deg);}',
      '.chaos-toggle-theme-overlay{position:fixed;inset:0;pointer-events:none;z-index:2147482999;}',
      '.chaos-toggle-theme-hint{position:fixed;bottom:16px;left:16px;font-size:24px;opacity:.55;animation:ctHint 2.3s ease-in-out infinite;z-index:2147483003;pointer-events:none;}',
      '.chaos-toggle-theme-pulse{animation:ctHeartbeat .8s ease-in-out infinite;}',
      '.chaos-toggle-theme-recoil{animation:ctRecoil .42s ease-out 3;}',
      '.chaos-toggle-theme-dark{background-color:#07070b;color:#f5f5f5;}',
      '@keyframes ctGlitch{0%{transform:translate(0,0)}20%{transform:translate(-3px,2px)}40%{transform:translate(2px,-1px)}60%{transform:translate(-2px,1px)}80%{transform:translate(3px,-2px)}100%{transform:translate(0,0)}}',
      '@keyframes ctPulse{0%,100%{opacity:.05}50%{opacity:.25}}',
      '@keyframes ctShake{0%{transform:translate(1px,0)}25%{transform:translate(-1px,1px)}50%{transform:translate(-2px,-1px)}75%{transform:translate(2px,1px)}100%{transform:translate(1px,0)}}',
      '@keyframes ctRumble{0%,100%{transform:translate(0,0)}50%{transform:translate(-1px,1px)}}',
      '@keyframes ctWobble{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-1px,0) rotate(-.2deg)}75%{transform:translate(1px,0) rotate(.2deg)}}',
      '@keyframes ctFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
      '@keyframes ctZoom{from{transform:scale(1)}to{transform:scale(1.02)}}',
      '@keyframes ctHint{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.65;transform:translateY(-4px)}}',
      '@keyframes ctHeartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.01)}}',
      '@keyframes ctRecoil{0%{transform:translateX(0)}30%{transform:translateX(-6px)}60%{transform:translateX(3px)}100%{transform:translateX(0)}}'
    ].join('');
    this._styleNode = createEl('style');
    this._styleNode.setAttribute('data-chaos-toggle', 'styles');
    this._styleNode.textContent = css;
    document.head.appendChild(this._styleNode);
  };

  ChaosToggleEngine.prototype._pushDestroyable = function (fn) { this._destroyables.push(fn); };

  ChaosToggleEngine.prototype._clearTimers = function () {
    this._activeTimers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    this._activeTimers = [];
    if (this._resetTimer) clearTimeout(this._resetTimer);
    this._resetTimer = null;
  };

  ChaosToggleEngine.prototype._themeDuration = function () {
    var base = clamp(Number(this._settings.duration || 0), 250, 120000);
    var multi = this._themeState.timing && this._themeState.timing.durationMultiplier ? Number(this._themeState.timing.durationMultiplier) : 1;
    return clamp(base * multi, 250, 120000);
  };

  ChaosToggleEngine.prototype._scheduleReset = function () {
    var self = this;
    if (this._resetTimer) clearTimeout(this._resetTimer);
    this._resetTimer = setTimeout(function () { self.reset(); }, this._themeDuration());
  };

  ChaosToggleEngine.prototype._createLayer = function (className, extraStyles) {
    var layer = createEl('div', 'chaos-toggle-layer ' + className, extraStyles || null);
    document.body.appendChild(layer);
    this._effectNodes.push(layer);
    return layer;
  };

  ChaosToggleEngine.prototype._applyShake = function (on) {
    var root = this._scopeRoot();
    root.classList.remove('chaos-toggle-shake', 'chaos-toggle-shake-rumble', 'chaos-toggle-shake-wobble', 'chaos-toggle-shake-float');
    if (!on) return;
    var shakeStyle = (this._themeState.animation && this._themeState.animation.shakeStyle) || 'default';
    var cls = 'chaos-toggle-shake';
    if (shakeStyle === 'rumble') cls = 'chaos-toggle-shake-rumble';
    else if (shakeStyle === 'wobble') cls = 'chaos-toggle-shake-wobble';
    else if (shakeStyle === 'float') cls = 'chaos-toggle-shake-float';
    root.classList.add(cls);
  };

  ChaosToggleEngine.prototype._applyZoomFlicker = function (on) { this._scopeRoot().classList.toggle('chaos-toggle-zoom', !!on); };
  ChaosToggleEngine.prototype._applyFakeErrorState = function (on) { this._scopeRoot().classList.toggle('chaos-toggle-error', !!on); };
  ChaosToggleEngine.prototype._applyGlitchOverlay = function (on) { if (on) this._createLayer('chaos-toggle-glitch'); };
  ChaosToggleEngine.prototype._applyNoise = function (on) { if (on) this._createLayer('chaos-toggle-noise'); };
  ChaosToggleEngine.prototype._applyFlashOverlay = function (on) { if (on) this._createLayer('chaos-toggle-flash'); };

  ChaosToggleEngine.prototype._applyThemeOverlay = function () {
    var overlay = this._themeState.overlay || {};
    if (!overlay.type || overlay.type === 'none') return;
    var styles = { opacity: String(overlay.opacity || 0.18), mixBlendMode: 'screen' };
    if (overlay.type === 'gradient' && overlay.gradient) styles.background = overlay.gradient;
    else if (overlay.type === 'fog') styles.background = 'radial-gradient(circle at 20% 30%, rgba(255,255,255,.14), rgba(0,0,0,.2) 60%), linear-gradient(180deg, rgba(30,20,40,.4), rgba(0,0,0,.75))';
    else if (overlay.type === 'scanline') styles.background = 'repeating-linear-gradient(180deg, rgba(0,255,255,.12) 0 1px, transparent 1px 3px)';
    else if (overlay.type === 'glow') styles.background = 'radial-gradient(circle at 10% 10%, rgba(255,225,130,.45), transparent 55%)';
    else if (overlay.type === 'pulse') styles.background = 'linear-gradient(90deg, rgba(255,0,0,.15), rgba(255,255,255,.15), rgba(0,0,255,.15))';
    else if (overlay.type === 'cozy') styles.background = 'linear-gradient(120deg, rgba(188,108,37,.25), rgba(127,85,57,.22))';
    else styles.background = 'linear-gradient(120deg, rgba(255,255,255,.08), rgba(255,255,255,.03))';
    this._createLayer('chaos-toggle-theme-overlay', styles);
  };

  ChaosToggleEngine.prototype._applyPopup = function (on) {
    var self = this;
    if (!on) return;
    var popupConf = this._themeState.popup || this._settings.popup;
    var palette = this._themeState.visual.palette;
    var popup = createEl('div', 'chaos-toggle-popup');
    popup.innerHTML = '<h4></h4><p></p><button type="button"></button>';
    popup.style.background = palette.background;
    popup.style.color = palette.text;
    popup.style.borderColor = palette.primary;
    popup.style.fontFamily = this._themeState.visual.fontFamily || 'ui-sans-serif,system-ui';
    popup.querySelector('h4').textContent = popupConf.title || this._settings.popup.title;
    popup.querySelector('p').textContent = popupConf.message || this._settings.popup.message;
    popup.querySelector('button').textContent = popupConf.confirmText || this._settings.popup.confirmText;
    popup.querySelector('button').style.background = palette.primary;
    popup.querySelector('button').addEventListener('click', function () {
      popup.remove();
      self._effectNodes = self._effectNodes.filter(function (n) { return n !== popup; });
    });
    document.body.appendChild(popup);
    this._effectNodes.push(popup);
  };

  ChaosToggleEngine.prototype._applyTextScramble = function (on) {
    if (!on) return;
    var nodes = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,p,button,a,span')).filter(function (el) { return el.childNodes.length && el.childNodes[0].nodeType === 3; }).slice(0, 18);
    var originals = new Map();
    var chars = '!<>-_\\/[]{}—=+*^?#________';
    nodes.forEach(function (el) { originals.set(el, el.textContent); });
    var ticks = 0;
    var maxTicks = 8;
    var self = this;
    function step() {
      ticks += 1;
      nodes.forEach(function (el) {
        var base = originals.get(el) || '';
        var next = '';
        for (var i = 0; i < base.length; i += 1) next += Math.random() < 0.22 ? chars[Math.floor(Math.random() * chars.length)] : base[i];
        el.textContent = next;
      });
      if (ticks < maxTicks) self._activeTimers.push(setTimeout(step, 80));
      else nodes.forEach(function (el) { el.textContent = originals.get(el) || ''; });
    }
    step();
  };

  ChaosToggleEngine.prototype._particleEmojiForType = function (type) {
    if (type === 'snow') return '❄️';
    if (type === 'eggs') return '🥚';
    if (type === 'ghosts') return '👻';
    if (type === 'leaves') return '🍂';
    if (type === 'hearts') return '💖';
    if (type === 'balloons') return '🎈';
    if (type === 'fireworks') return '✨';
    return null;
  };

  ChaosToggleEngine.prototype._applyParticles = function (on) {
    if (!on) return;
    var particleTheme = this._themeState.particles || {};
    var type = particleTheme.type || 'confetti';
    var density = clamp((particleTheme.density || 1) * this._settings.intensity, 0.05, 1.25);
    var pieces = Math.round(20 + (density * 90));
    var emoji = particleTheme.emoji || this._particleEmojiForType(type);
    var useConfetti = (type === 'confetti' || particleTheme.mixWithConfetti);

    for (var i = 0; i < pieces; i += 1) {
      var dot = createEl('div', 'chaos-toggle-layer', {
        width: emoji ? 'auto' : '8px',
        height: emoji ? 'auto' : '8px',
        borderRadius: '2px',
        background: emoji ? 'transparent' : 'hsl(' + Math.floor(Math.random() * 360) + ' 95% 60%)',
        left: Math.round(Math.random() * window.innerWidth) + 'px',
        top: '-20px',
        opacity: '0.95',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 2147483002,
        transform: 'rotate(' + Math.round(Math.random() * 360) + 'deg)',
        fontSize: '18px'
      });
      if (emoji) dot.textContent = emoji;
      document.body.appendChild(dot);
      this._effectNodes.push(dot);
      (function (el, isBurst) {
        var travel = 240 + Math.random() * window.innerHeight;
        var dx = (Math.random() - 0.5) * (isBurst ? 380 : 220);
        el.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + travel + 'px) rotate(520deg)', opacity: 0.05 }
        ], { duration: 850 + Math.random() * 1700, easing: isBurst ? 'cubic-bezier(.15,.7,.2,1)' : 'ease-out', fill: 'forwards' });
      })(dot, type === 'fireworks');
    }
    if (!useConfetti && type === 'minimal') return;
  };

  ChaosToggleEngine.prototype._applyDecorations = function () {
    if (!this._themeState.decorations || !this._themeState.decorations.hints) return;
    var hint = createEl('div', 'chaos-toggle-theme-hint');
    hint.textContent = '🥚';
    document.body.appendChild(hint);
    this._effectNodes.push(hint);
  };

  ChaosToggleEngine.prototype._applyBehavior = function () {
    var behavior = this._themeState.behavior || {};
    var root = this._scopeRoot();
    if (behavior.pulse) root.classList.add('chaos-toggle-theme-pulse');
    if (behavior.recoil) root.classList.add('chaos-toggle-theme-recoil');
    if (behavior.microJumps) {
      var hops = 2 + Math.round(Math.random() * 3);
      for (var i = 0; i < hops; i += 1) {
        var self = this;
        this._activeTimers.push(setTimeout(function () {
          root.style.transform = 'translate(' + ((Math.random() - 0.5) * 6) + 'px,' + ((Math.random() - 0.5) * 6) + 'px)';
          self._activeTimers.push(setTimeout(function () { root.style.transform = ''; }, 80));
        }, 120 + (i * 140)));
      }
    }
    if (behavior.loopBursts) {
      var self2 = this;
      var loopId = setInterval(function () { self2._applyParticles(true); }, 900);
      this._activeTimers.push(loopId);
    }
  };

  ChaosToggleEngine.prototype._applyThemeVisual = function () {
    var visual = this._themeState.visual || {};
    var root = this._scopeRoot();
    var palette = visual.palette || {};
    if (this._activeVisualClass && this._activeVisualClass !== visual.className) root.classList.remove(this._activeVisualClass);
    if (visual.className) root.classList.add(visual.className);
    this._activeVisualClass = visual.className || null;
    root.style.setProperty('--chaos-primary', palette.primary || '#ff4d6d');
    root.style.setProperty('--chaos-accent', palette.accent || '#00f5ff');
    root.style.setProperty('--chaos-bg', palette.background || '#111111');
    root.style.setProperty('--chaos-text', palette.text || '#f8f8f8');
    if (visual.fontFamily) root.style.fontFamily = visual.fontFamily;
    if (visual.forceDark) root.classList.add('chaos-toggle-theme-dark');
  };

  ChaosToggleEngine.prototype._clearEffects = function () {
    var root = this._scopeRoot();
    root.classList.remove('chaos-toggle-zoom', 'chaos-toggle-error', 'chaos-toggle-theme-pulse', 'chaos-toggle-theme-recoil', 'chaos-toggle-theme-dark');
    if (this._activeVisualClass) root.classList.remove(this._activeVisualClass);
    this._activeVisualClass = null;
    this._applyShake(false);
    root.style.transform = '';
    this._effectNodes.forEach(function (node) { if (node && node.remove) node.remove(); });
    this._effectNodes = [];
    this._clearTimers();
  };

  ChaosToggleEngine.prototype._validateSettings = function (incoming) {
    var valid = deepMerge({}, incoming || {});
    if (typeof valid.intensity !== 'undefined') valid.intensity = clamp(Number(valid.intensity), 0, 1);
    if (typeof valid.probability !== 'undefined') valid.probability = clamp(Number(valid.probability), 0, 1);
    if (typeof valid.duration !== 'undefined') valid.duration = clamp(Number(valid.duration), 250, 120000);
    if (typeof valid.cooldownMs !== 'undefined') valid.cooldownMs = clamp(Number(valid.cooldownMs), 0, 60000);
    return valid;
  };

  ChaosToggleEngine.prototype._resolveTheme = function () {
    var activeName = this._settings.theme || 'default';
    var selected = this._themes[activeName] || this._themes.default || {};
    var fromTheme = deepMerge(DEFAULT_THEME_PROFILE, selected);
    var withOverrides = pickEnabledSections(fromTheme, this._settings.themeOverrides || {}, this._settings.themeParts || {}, DEFAULT_THEME_PROFILE);
    this._themeState = withOverrides;
    return withOverrides;
  };

  ChaosToggleEngine.prototype._runAction = function (action) {
    if (typeof action === 'function') { action(this); return; }
    if (typeof action !== 'string') return;
    if (action === 'trigger') this.trigger();
    else if (action === 'reset') this.reset();
    else if (action === 'enable') this.enable();
    else if (action === 'disable') this.disable();
    else if (action.indexOf('runMode:') === 0) this.runMode(action.split(':')[1]);
    else if (action.indexOf('runTheme:') === 0) this.runTheme(action.split(':')[1]);
    else this._log('Unknown shortcut action:', action);
  };

  ChaosToggleEngine.prototype._bindShortcuts = function () {
    var self = this;
    this._shortcutMap.clear();
    if (!this._settings.shortcutsEnabled) return;
    Object.keys(this._settings.shortcuts || {}).forEach(function (combo) {
      var normalized = normalizeCombo(combo);
      if (!normalized) return;
      self._shortcutMap.set(normalized, self._settings.shortcuts[combo]);
    });
    var listener = function (event) {
      if (!self._settings.shortcutsEnabled || !self._enabled) return;
      var combo = eventToCombo(event);
      if (!self._shortcutMap.has(combo)) return;
      event.preventDefault();
      self._runAction(self._shortcutMap.get(combo));
    };
    window.addEventListener('keydown', listener);
    this._pushDestroyable(function () { window.removeEventListener('keydown', listener); });
  };

  ChaosToggleEngine.prototype._bindTriggers = function () {
    var self = this;
    var triggerSettings = deepMerge(this._settings.triggers, (this._themeState && this._themeState.triggers) || {});
    var selector = triggerSettings.onClickSelector;
    if (selector) {
      var clickHandler = function (event) {
        var target = event.target && event.target.closest ? event.target.closest(selector) : null;
        if (target) self.trigger();
      };
      document.addEventListener('click', clickHandler);
      this._pushDestroyable(function () { document.removeEventListener('click', clickHandler); });
    }
    if (triggerSettings.onLoad) {
      var loadHandler = function () { self.trigger(); };
      window.addEventListener('load', loadHandler, { once: true });
      this._pushDestroyable(function () { window.removeEventListener('load', loadHandler); });
    }
  };

  ChaosToggleEngine.prototype._composeEffects = function (modeEffects) {
    var themeEffects = (this._themeState && this._themeState.effects) || {};
    return deepMerge(deepMerge(this._settings.effects, themeEffects), modeEffects || {});
  };

  ChaosToggleEngine.prototype._applyEffectSet = function (modeEffects) {
    var effects = this._composeEffects(modeEffects);
    this._applyThemeVisual();
    this._applyThemeOverlay();
    this._applyDecorations();
    this._applyBehavior();
    this._applyShake(!!effects.shake);
    this._applyZoomFlicker(!!effects.zoomFlicker);
    this._applyFakeErrorState(!!effects.fakeErrorState);
    this._applyGlitchOverlay(!!effects.glitchOverlay);
    this._applyNoise(!!effects.noise);
    this._applyFlashOverlay(!!effects.flashOverlay);
    this._applyPopup(!!effects.popups);
    this._applyTextScramble(!!effects.textScramble);
    this._applyParticles(!!effects.confetti);
    if (this._themeState.sound && this._themeState.sound.enabled) this._log('Sound hook:', this._themeState.sound.preset || 'theme-sound');
  };

  ChaosToggleEngine.prototype.init = function (config) {
    if (this._initialized) return this;
    this._settings = deepMerge(this._settings, this._validateSettings(config));
    this._modes = deepMerge(this._modes, this._settings.modes || {});
    this._resolveTheme();
    this._enabled = !!this._settings.enabled;
    this._installBaseStyles();
    this._bindShortcuts();
    this._bindTriggers();
    this._initialized = true;
    this._log('Initialized with settings', this._settings);
    return this;
  };

  ChaosToggleEngine.prototype.trigger = function (modeEffects) {
    if (!this._initialized) this.init({});
    if (!this._enabled || !this._settings.enabled) return false;
    var now = Date.now();
    var cooldown = this._settings.cooldownMs * ((this._themeState.timing && this._themeState.timing.cooldownMultiplier) || 1);
    if ((now - this._lastTriggerAt) < cooldown) return false;
    this._lastTriggerAt = now;
    if (!this._maybe()) return false;
    this.reset();
    this._resolveTheme();
    this._applyEffectSet(modeEffects || null);
    this._scheduleReset();
    return true;
  };

  ChaosToggleEngine.prototype.reset = function () { this._clearEffects(); return this; };

  ChaosToggleEngine.prototype.destroy = function () {
    this.reset();
    this._destroyables.forEach(function (fn) { fn(); });
    this._destroyables = [];
    if (this._styleNode && this._styleNode.remove) this._styleNode.remove();
    this._styleNode = null;
    this._initialized = false;
    return this;
  };

  ChaosToggleEngine.prototype.updateSettings = function (config) {
    this._settings = deepMerge(this._settings, this._validateSettings(config));
    this._modes = deepMerge(this._modes, this._settings.modes || {});
    this._resolveTheme();
    this._clearEffects();
    this._destroyables.forEach(function (fn) { fn(); });
    this._destroyables = [];
    this._bindShortcuts();
    this._bindTriggers();
    return this;
  };

  ChaosToggleEngine.prototype.enable = function () { this._enabled = true; return this; };
  ChaosToggleEngine.prototype.disable = function () { this._enabled = false; this.reset(); return this; };

  ChaosToggleEngine.prototype.setTheme = function (name) {
    if (!this._themes[name]) return false;
    this._settings.theme = name;
    this._resolveTheme();
    return true;
  };

  ChaosToggleEngine.prototype.getTheme = function () {
    return { name: this._settings.theme, config: deepMerge({}, this._themeState) };
  };

  ChaosToggleEngine.prototype.listThemes = function () { return Object.keys(this._themes); };

  ChaosToggleEngine.prototype.registerTheme = function (name, config) {
    if (!name || typeof name !== 'string') throw new Error('Theme name is required.');
    this._themes[name] = deepMerge(DEFAULT_THEME_PROFILE, config || {});
    return this;
  };

  ChaosToggleEngine.prototype.removeTheme = function (name) {
    if (!name || name === 'default') return false;
    if (!this._themes[name]) return false;
    delete this._themes[name];
    if (this._settings.theme === name) {
      this._settings.theme = 'default';
      this._resolveTheme();
    }
    return true;
  };

  ChaosToggleEngine.prototype.runTheme = function (name) {
    if (!this.setTheme(name)) return false;
    return this.trigger();
  };

  ChaosToggleEngine.prototype.registerShortcut = function (combo, action) {
    var normalized = normalizeCombo(combo);
    if (!normalized) throw new Error('Invalid shortcut combo: ' + combo);
    this._settings.shortcuts[combo] = action;
    this._shortcutMap.set(normalized, action);
    return this;
  };

  ChaosToggleEngine.prototype.unregisterShortcut = function (combo) {
    var normalized = normalizeCombo(combo);
    if (!normalized) return this;
    delete this._settings.shortcuts[combo];
    this._shortcutMap.delete(normalized);
    return this;
  };

  ChaosToggleEngine.prototype.runMode = function (name) {
    var mode = this._modes[name];
    if (!mode) { this._log('Unknown mode:', name); return false; }
    var previousIntensity = this._settings.intensity;
    var previousDuration = this._settings.duration;
    this._settings.intensity = typeof mode.intensity === 'number' ? mode.intensity : previousIntensity;
    this._settings.duration = typeof mode.duration === 'number' ? mode.duration : previousDuration;
    var didRun = this.trigger(mode.effects || {});
    this._settings.intensity = previousIntensity;
    this._settings.duration = previousDuration;
    return didRun;
  };

  ChaosToggleEngine.prototype.listModes = function () { return Object.keys(this._modes); };
  ChaosToggleEngine.prototype.getSettings = function () { return deepMerge({}, this._settings); };

  var instance = new ChaosToggleEngine();

  var API = {
    version: VERSION,
    init: function (config) { return instance.init(config); },
    trigger: function () { return instance.trigger(); },
    reset: function () { return instance.reset(); },
    destroy: function () { return instance.destroy(); },
    updateSettings: function (config) { return instance.updateSettings(config); },
    enable: function () { return instance.enable(); },
    disable: function () { return instance.disable(); },
    setTheme: function (name) { return instance.setTheme(name); },
    getTheme: function () { return instance.getTheme(); },
    listThemes: function () { return instance.listThemes(); },
    registerTheme: function (name, config) { return instance.registerTheme(name, config); },
    removeTheme: function (name) { return instance.removeTheme(name); },
    runTheme: function (name) { return instance.runTheme(name); },
    registerShortcut: function (combo, action) { return instance.registerShortcut(combo, action); },
    unregisterShortcut: function (combo) { return instance.unregisterShortcut(combo); },
    runMode: function (name) { return instance.runMode(name); },
    listModes: function () { return instance.listModes(); },
    getSettings: function () { return instance.getSettings(); }
  };

  global.ChaosToggle = API;

  if (DEFAULT_SETTINGS.autoInit) API.init();
})(window);
