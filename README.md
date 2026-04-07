# ChaosToggle.js

ChaosToggle.js is a tiny **drop-in visual effects library** that adds controlled, playful disruption to any webpage.

> **Important:** ChaosToggle.js is for demos, storytelling, presentations, and easter eggs only. It is **not** a security tool and should never be presented as a real breach detector.

## Quick Start (CDN-first)

```html
<script src="https://cdn.jsdelivr.net/gh/your-org/ChaosToggle.js@main/chaos-toggle.js"></script>
<script>
  // optional: explicit init
  window.ChaosToggle.init({
    intensity: 0.55,
    duration: 1800
  });

  // optional: trigger instantly
  window.ChaosToggle.trigger();
</script>
```

## Core API

```js
ChaosToggle.init(config);
ChaosToggle.trigger();
ChaosToggle.reset();
ChaosToggle.destroy();
ChaosToggle.updateSettings(config);
ChaosToggle.enable();
ChaosToggle.disable();
ChaosToggle.registerShortcut(combo, action);
ChaosToggle.unregisterShortcut(combo);
ChaosToggle.runMode(name);
ChaosToggle.listModes();
```

## Default Shortcuts

- `Shift+H` → trigger chaos
- `Shift+P` → panic mode
- `Shift+R` → reset
- `Shift+C` → celebration mode

Disable shortcuts globally:

```js
ChaosToggle.updateSettings({ shortcutsEnabled: false });
```

## Settings System

ChaosToggle uses one central, runtime-updatable settings object.

```js
ChaosToggle.init({
  enabled: true,
  safeMode: true,
  debug: false,
  scopeSelector: 'body',
  intensity: 0.6,
  duration: 1800,
  probability: 1,
  cooldownMs: 150,
  theme: 'neon',

  popup: {
    title: 'Demo Alert',
    message: 'ChaosToggle demo popup. Visual effect only.',
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
    onClickSelector: '.demo-chaos-button'
  },

  shortcutsEnabled: true,
  shortcuts: {
    'Shift+H': 'trigger',
    'Shift+P': 'runMode:panic',
    'Shift+R': 'reset',
    'Shift+C': 'runMode:celebration'
  },

  // optional extension point
  modes: {
    customStoryBeat: {
      intensity: 0.7,
      duration: 2000,
      effects: {
        shake: true,
        glitchOverlay: true,
        confetti: false,
        flashOverlay: true,
        textScramble: true,
        noise: true,
        zoomFlicker: false,
        popups: true,
        fakeErrorState: false
      }
    }
  }
});
```

Update at runtime:

```js
ChaosToggle.updateSettings({
  intensity: 0.8,
  effects: { confetti: false, glitchOverlay: true }
});
```

## Modes / Presets

Built-in modes:

- `subtle`
- `demo`
- `chaos`
- `nuclear`
- `celebration`
- `glitch`
- `panic`

Use a mode:

```js
ChaosToggle.runMode('nuclear');
```

List available modes:

```js
console.log(ChaosToggle.listModes());
```

## Keyboard Shortcut Design

Internally, shortcuts are normalized to a canonical format:

- Input examples accepted: `Shift+H`, `shift + h`, `Ctrl+Alt+X`, `Cmd+K`
- Canonical storage format: `ctrl+alt+shift+meta+key` (only active modifiers included)
- Runtime matching is done by converting each `keydown` event to the same normalized shape

Actions can be:

- built-in action strings (`trigger`, `reset`, `enable`, `disable`)
- mode action strings (`runMode:chaos`)
- custom functions (`(engine) => { ... }`)

Examples:

```js
ChaosToggle.registerShortcut('Shift+G', 'runMode:glitch');
ChaosToggle.registerShortcut('Alt+K', function () {
  ChaosToggle.trigger();
});
```

## Effect List

Effects are modular and can be toggled independently:

- screen shake
- glitch overlay
- fake system-style popup (clearly demo text)
- confetti burst
- flashing overlay
- text scrambling
- fake error visual state
- visual noise overlay
- zoom flicker

## Recommended Project Structure

A minimal evolution path for the current file:

```text
ChaosToggle.js/
├─ chaos-toggle.js             # CDN entry (global API, standalone)
├─ README.md
└─ src/
   ├─ core/
   │  ├─ engine.js
   │  ├─ settings-manager.js
   │  ├─ shortcut-manager.js
   │  └─ modes-registry.js
   ├─ effects/
   │  ├─ shake.js
   │  ├─ glitch-overlay.js
   │  ├─ popup.js
   │  └─ confetti.js
   └─ utils/
      ├─ deep-merge.js
      └─ keyboard.js
```

## External Libraries (Optional)

The current implementation is dependency-free.

If you want higher-fidelity effects later while staying lightweight:

1. **canvas-confetti** for better confetti physics
2. **motion-one** (or tiny animation helper) for advanced timelines

Keep these optional and behind thin wrappers so they can be replaced without API breakage.

## CDN Distribution Strategy

For immediate use:

- GitHub + jsDelivr: `https://cdn.jsdelivr.net/gh/<org>/<repo>@<tag>/chaos-toggle.js`

For scale:

- Publish versioned tags (`v0.1.0`, `v0.2.0`)
- Keep `chaos-toggle.js` as browser-global build (`window.ChaosToggle`)
- Later add npm package + ESM/CJS outputs while preserving CDN global entry

## Scaling the Project Over Time

1. Keep API stable (`init`, `trigger`, `reset`, etc.)
2. Move each effect into isolated modules
3. Add plugin hook points (`beforeTrigger`, `afterTrigger`, `onEffectStart`)
4. Add theme tokens (colors, popup style, overlay presets)
5. Add optional settings UI panel that writes through `updateSettings`
6. Add TypeScript declarations (`index.d.ts`) without changing runtime architecture

## Minimal Demo HTML

```html
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>ChaosToggle Demo</title></head>
  <body>
    <h1>ChaosToggle Demo</h1>
    <button onclick="ChaosToggle.trigger()">Trigger</button>
    <button onclick="ChaosToggle.runMode('nuclear')">Nuclear</button>
    <button onclick="ChaosToggle.reset()">Reset</button>

    <script src="./chaos-toggle.js"></script>
    <script>
      ChaosToggle.init({
        triggers: { onClickSelector: null },
        popup: { message: 'Controlled demo effect. Not a real incident.' }
      });
    </script>
  </body>
</html>
```
