/* ChaosToggle.js v0.1.0
 * Drop-in visual chaos effects for demos and storytelling.
 * This library is for playful visual effects only.
 */
(function (global) {
  'use strict';

  var VERSION = '0.1.0';

  var DEFAULT_SETTINGS = {
    autoInit: false,
    enabled: true,
    safeMode: true,
    debug: false,
    scopeSelector: 'body',
    cooldownMs: 150,
    randomSeed: null,
    theme: 'neon',
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
    subtle: {
      intensity: 0.25,
      duration: 900,
      effects: { shake: true, glitchOverlay: false, confetti: false, flashOverlay: false, textScramble: true, noise: false, zoomFlicker: false, popups: false, fakeErrorState: false }
    },
    demo: {
      intensity: 0.5,
      duration: 1500,
      effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: false, popups: true, fakeErrorState: false }
    },
    chaos: {
      intensity: 0.75,
      duration: 2200,
      effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true }
    },
    nuclear: {
      intensity: 1,
      duration: 3200,
      effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true }
    },
    celebration: {
      intensity: 0.6,
      duration: 2200,
      effects: { shake: false, glitchOverlay: false, confetti: true, flashOverlay: false, textScramble: false, noise: false, zoomFlicker: false, popups: true, fakeErrorState: false }
    },
    glitch: {
      intensity: 0.65,
      duration: 1800,
      effects: { shake: false, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: false, fakeErrorState: false }
    },
    panic: {
      intensity: 0.85,
      duration: 2600,
      effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true }
    }
  };

  function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  function deepMerge(target, source) {
    var out = Object.assign({}, target);
    if (!isObject(source)) return out;

    Object.keys(source).forEach(function (key) {
      var srcVal = source[key];
      if (isObject(srcVal) && isObject(out[key])) {
        out[key] = deepMerge(out[key], srcVal);
      } else {
        out[key] = srcVal;
      }
    });
    return out;
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

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
      if (parts.indexOf(m) !== -1 || (m === 'ctrl' && parts.indexOf('control') !== -1) || (m === 'meta' && (parts.indexOf('cmd') !== -1 || parts.indexOf('command') !== -1))) {
        out.push(m);
      }
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
    this._shortcutMap = new Map();
    this._destroyables = [];
    this._effectNodes = [];
    this._activeTimers = [];
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

  ChaosToggleEngine.prototype._maybe = function () {
    return Math.random() <= clamp(Number(this._settings.probability || 0), 0, 1);
  };

  ChaosToggleEngine.prototype._scopeRoot = function () {
    return document.querySelector(this._settings.scopeSelector) || document.body;
  };

  ChaosToggleEngine.prototype._installBaseStyles = function () {
    if (this._styleNode) return;
    var css = [
      '.chaos-toggle-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;mix-blend-mode:screen;}',
      '.chaos-toggle-glitch{background:repeating-linear-gradient(180deg,rgba(255,0,80,.18) 0 2px,rgba(0,255,255,.12) 2px 4px);opacity:.55;animation:ctGlitch .14s steps(2,end) infinite;}',
      '.chaos-toggle-noise{background-image:radial-gradient(circle,rgba(255,255,255,.2) 1px,transparent 1px);background-size:3px 3px;opacity:.2;}',
      '.chaos-toggle-flash{background:rgba(255,255,255,.35);animation:ctPulse .16s linear infinite;}',
      '.chaos-toggle-popup{position:fixed;right:18px;bottom:18px;max-width:300px;background:#111;color:#f8f8f8;border:2px solid #ff4d6d;border-radius:10px;padding:12px 12px 10px;box-shadow:0 12px 28px rgba(0,0,0,.4);z-index:2147483001;font-family:ui-sans-serif,system-ui;}',
      '.chaos-toggle-popup h4{margin:0 0 6px;font-size:14px;letter-spacing:.02em;}',
      '.chaos-toggle-popup p{margin:0 0 8px;font-size:12px;line-height:1.4;}',
      '.chaos-toggle-popup button{border:0;background:#ff4d6d;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px;}',
      '.chaos-toggle-shake{animation:ctShake .05s linear infinite;}',
      '.chaos-toggle-zoom{animation:ctZoom .2s linear infinite alternate;}',
      '.chaos-toggle-error{filter:saturate(1.25) hue-rotate(-22deg);}',
      '@keyframes ctGlitch{0%{transform:translate(0,0)}20%{transform:translate(-3px,2px)}40%{transform:translate(2px,-1px)}60%{transform:translate(-2px,1px)}80%{transform:translate(3px,-2px)}100%{transform:translate(0,0)}}',
      '@keyframes ctPulse{0%,100%{opacity:.05}50%{opacity:.25}}',
      '@keyframes ctShake{0%{transform:translate(1px,0)}25%{transform:translate(-1px,1px)}50%{transform:translate(-2px,-1px)}75%{transform:translate(2px,1px)}100%{transform:translate(1px,0)}}',
      '@keyframes ctZoom{from{transform:scale(1)}to{transform:scale(1.02)}}'
    ].join('');
    this._styleNode = createEl('style');
    this._styleNode.setAttribute('data-chaos-toggle', 'styles');
    this._styleNode.textContent = css;
    document.head.appendChild(this._styleNode);
  };

  ChaosToggleEngine.prototype._pushDestroyable = function (fn) {
    this._destroyables.push(fn);
  };

  ChaosToggleEngine.prototype._clearTimers = function () {
    this._activeTimers.forEach(function (id) { clearTimeout(id); });
    this._activeTimers = [];
  };

  ChaosToggleEngine.prototype._scheduleReset = function () {
    var self = this;
    this._clearTimers();
    this._activeTimers.push(setTimeout(function () {
      self.reset();
    }, clamp(Number(this._settings.duration || 0), 250, 120000)));
  };

  ChaosToggleEngine.prototype._createLayer = function (className, extraStyles) {
    var layer = createEl('div', 'chaos-toggle-layer ' + className, extraStyles || null);
    document.body.appendChild(layer);
    this._effectNodes.push(layer);
    return layer;
  };

  ChaosToggleEngine.prototype._applyShake = function (on) {
    this._scopeRoot().classList.toggle('chaos-toggle-shake', !!on);
  };

  ChaosToggleEngine.prototype._applyZoomFlicker = function (on) {
    this._scopeRoot().classList.toggle('chaos-toggle-zoom', !!on);
  };

  ChaosToggleEngine.prototype._applyFakeErrorState = function (on) {
    this._scopeRoot().classList.toggle('chaos-toggle-error', !!on);
  };

  ChaosToggleEngine.prototype._applyGlitchOverlay = function (on) {
    if (on) this._createLayer('chaos-toggle-glitch');
  };

  ChaosToggleEngine.prototype._applyNoise = function (on) {
    if (on) this._createLayer('chaos-toggle-noise');
  };

  ChaosToggleEngine.prototype._applyFlashOverlay = function (on) {
    if (on) this._createLayer('chaos-toggle-flash');
  };

  ChaosToggleEngine.prototype._applyPopup = function (on) {
    var self = this;
    if (!on) return;
    var popup = createEl('div', 'chaos-toggle-popup');
    popup.innerHTML = '<h4></h4><p></p><button type="button"></button>';
    popup.querySelector('h4').textContent = this._settings.popup.title;
    popup.querySelector('p').textContent = this._settings.popup.message;
    popup.querySelector('button').textContent = this._settings.popup.confirmText;
    popup.querySelector('button').addEventListener('click', function () {
      popup.remove();
      self._effectNodes = self._effectNodes.filter(function (n) { return n !== popup; });
    });
    document.body.appendChild(popup);
    this._effectNodes.push(popup);
  };

  ChaosToggleEngine.prototype._applyTextScramble = function (on) {
    if (!on) return;
    var nodes = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3,p,button,a,span'))
      .filter(function (el) { return el.childNodes.length && el.childNodes[0].nodeType === 3; })
      .slice(0, 18);
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
        for (var i = 0; i < base.length; i += 1) {
          if (Math.random() < 0.22) next += chars[Math.floor(Math.random() * chars.length)];
          else next += base[i];
        }
        el.textContent = next;
      });
      if (ticks < maxTicks) {
        self._activeTimers.push(setTimeout(step, 80));
      } else {
        nodes.forEach(function (el) { el.textContent = originals.get(el) || ''; });
      }
    }
    step();
  };

  ChaosToggleEngine.prototype._applyConfetti = function (on) {
    if (!on) return;
    var pieces = Math.round(30 + (this._settings.intensity * 100));
    for (var i = 0; i < pieces; i += 1) {
      var dot = createEl('div', 'chaos-toggle-layer', {
        width: '8px',
        height: '8px',
        borderRadius: '2px',
        background: 'hsl(' + Math.floor(Math.random() * 360) + ' 95% 60%)',
        left: Math.round(Math.random() * window.innerWidth) + 'px',
        top: '-20px',
        opacity: '0.95',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 2147483002,
        transform: 'rotate(' + Math.round(Math.random() * 360) + 'deg)'
      });
      document.body.appendChild(dot);
      this._effectNodes.push(dot);

      (function (el) {
        var travel = 400 + Math.random() * window.innerHeight;
        var dx = (Math.random() - 0.5) * 240;
        el.animate([
          { transform: 'translate(0,0) rotate(0deg)' },
          { transform: 'translate(' + dx + 'px,' + travel + 'px) rotate(520deg)' }
        ], { duration: 800 + Math.random() * 1400, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
      })(dot);
    }
  };

  ChaosToggleEngine.prototype._clearEffects = function () {
    this._applyShake(false);
    this._applyZoomFlicker(false);
    this._applyFakeErrorState(false);
    this._effectNodes.forEach(function (node) {
      if (node && node.remove) node.remove();
    });
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

  ChaosToggleEngine.prototype._runAction = function (action) {
    if (typeof action === 'function') {
      action(this);
      return;
    }
    if (typeof action !== 'string') return;

    if (action === 'trigger') this.trigger();
    else if (action === 'reset') this.reset();
    else if (action === 'enable') this.enable();
    else if (action === 'disable') this.disable();
    else if (action.indexOf('runMode:') === 0) this.runMode(action.split(':')[1]);
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
    this._pushDestroyable(function () {
      window.removeEventListener('keydown', listener);
    });
  };

  ChaosToggleEngine.prototype._bindTriggers = function () {
    var self = this;
    var selector = this._settings.triggers.onClickSelector;
    if (selector) {
      var clickHandler = function (event) {
        var target = event.target && event.target.closest ? event.target.closest(selector) : null;
        if (target) self.trigger();
      };
      document.addEventListener('click', clickHandler);
      this._pushDestroyable(function () {
        document.removeEventListener('click', clickHandler);
      });
    }
    if (this._settings.triggers.onLoad) {
      var loadHandler = function () { self.trigger(); };
      window.addEventListener('load', loadHandler, { once: true });
      this._pushDestroyable(function () {
        window.removeEventListener('load', loadHandler);
      });
    }
  };

  ChaosToggleEngine.prototype._applyEffectSet = function (effectSet) {
    var effects = deepMerge(this._settings.effects, effectSet || {});
    this._applyShake(!!effects.shake);
    this._applyZoomFlicker(!!effects.zoomFlicker);
    this._applyFakeErrorState(!!effects.fakeErrorState);
    this._applyGlitchOverlay(!!effects.glitchOverlay);
    this._applyNoise(!!effects.noise);
    this._applyFlashOverlay(!!effects.flashOverlay);
    this._applyPopup(!!effects.popups);
    this._applyTextScramble(!!effects.textScramble);
    this._applyConfetti(!!effects.confetti);
  };

  ChaosToggleEngine.prototype.init = function (config) {
    if (this._initialized) return this;
    this._settings = deepMerge(this._settings, this._validateSettings(config));
    this._modes = deepMerge(this._modes, this._settings.modes || {});
    this._enabled = !!this._settings.enabled;
    this._installBaseStyles();
    this._bindShortcuts();
    this._bindTriggers();
    this._initialized = true;
    this._log('Initialized with settings', this._settings);
    return this;
  };

  ChaosToggleEngine.prototype.trigger = function () {
    if (!this._initialized) this.init({});
    if (!this._enabled || !this._settings.enabled) return false;

    var now = Date.now();
    if ((now - this._lastTriggerAt) < this._settings.cooldownMs) return false;
    this._lastTriggerAt = now;
    if (!this._maybe()) return false;

    this.reset();
    this._applyEffectSet();
    this._scheduleReset();
    return true;
  };

  ChaosToggleEngine.prototype.reset = function () {
    this._clearEffects();
    return this;
  };

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
    this._clearEffects();
    this._destroyables.forEach(function (fn) { fn(); });
    this._destroyables = [];
    this._bindShortcuts();
    this._bindTriggers();
    return this;
  };

  ChaosToggleEngine.prototype.enable = function () {
    this._enabled = true;
    return this;
  };

  ChaosToggleEngine.prototype.disable = function () {
    this._enabled = false;
    this.reset();
    return this;
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
    if (!mode) {
      this._log('Unknown mode:', name);
      return false;
    }
    var previous = this._settings;
    this.updateSettings({
      intensity: mode.intensity,
      duration: mode.duration,
      effects: mode.effects
    });
    this.trigger();
    this.updateSettings({
      intensity: previous.intensity,
      duration: previous.duration,
      effects: previous.effects
    });
    return true;
  };

  ChaosToggleEngine.prototype.listModes = function () {
    return Object.keys(this._modes);
  };

  ChaosToggleEngine.prototype.getSettings = function () {
    return deepMerge({}, this._settings);
  };

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
    registerShortcut: function (combo, action) { return instance.registerShortcut(combo, action); },
    unregisterShortcut: function (combo) { return instance.unregisterShortcut(combo); },
    runMode: function (name) { return instance.runMode(name); },
    listModes: function () { return instance.listModes(); },
    getSettings: function () { return instance.getSettings(); }
  };

  global.ChaosToggle = API;

  if (DEFAULT_SETTINGS.autoInit) {
    API.init();
  }
})(window);
