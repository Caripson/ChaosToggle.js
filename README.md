<div align="center">

# ChaosToggle.js

**The ultimate prank & chaos effects library for the web.**

34 effects. 17 themes. Built-in control panel. Plugin system. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/chaos-toggle?color=ff4d6d&style=flat-square)](https://www.npmjs.com/package/chaos-toggle)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chaos-toggle?color=00f5ff&style=flat-square)](https://bundlephobia.com/package/chaos-toggle)
[![license](https://img.shields.io/github/license/Caripson/ChaosToggle.js?color=10b981&style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Caripson/ChaosToggle.js/ci.yml?style=flat-square)](https://github.com/Caripson/ChaosToggle.js/actions)

[Live Demo](https://caripson.github.io/ChaosToggle.js/) &#8226; [Docs](https://caripson.github.io/ChaosToggle.js/guide/getting-started) &#8226; [Effects Reference](https://caripson.github.io/ChaosToggle.js/guide/effects) &#8226; [Themes](https://caripson.github.io/ChaosToggle.js/guide/themes) &#8226; [Plugin Guide](https://caripson.github.io/ChaosToggle.js/api/plugin-api)

</div>

---

## First prank in 30 seconds

```html
<script src="https://cdn.jsdelivr.net/gh/Caripson/ChaosToggle.js@main/dist/chaos-toggle.min.js"></script>
<script>
  ChaosToggle.init();
  ChaosToggle.runEffect('bsod'); // Blue Screen of Death
</script>
```

## Install

```bash
npm install chaos-toggle
```

```js
import { ChaosToggle } from 'chaos-toggle';

ChaosToggle.init();
ChaosToggle.trigger();
```

## What's inside

### 34 Effects across 5 categories

| Category | Effects |
|---|---|
| **Visual** | shake, glitchOverlay, noise, flashOverlay, zoomFlicker, fakeErrorState, matrixRain, rgbSplit, vhsDistortion, screenCrack, pixelDissolve, screenMelt, crtShutdown |
| **Prank** | bsod, fakeUpdate, fakeTerminal, clippy, fakeVirusScan, fakeCrash |
| **DOM** | gravity, elementShuffle, elementScatter, magneticCursor, tinyGiantMode |
| **Interaction** | cursorChaos, cursorDrift, autoTypo, delayedClicks, invertedScroll, screenFlip, drunkMode |
| **Overlay** | confetti, popups, textScramble |

### 17 Themes

`default` `easter` `halloween` `christmas` `new-year` `4th-of-july` `thanksgiving` `black-friday` `cyber-monday` `valentines-day` `birthday` `office` `hacker` `retro` `apocalypse` `drunk` `jumpscare`

### 7 Preset Modes

`subtle` `demo` `chaos` `nuclear` `celebration` `glitch` `panic`

## Quick examples

```js
// Run a specific effect
ChaosToggle.runEffect('matrixRain');
ChaosToggle.runEffect('fakeTerminal');
ChaosToggle.runEffect('gravity');

// Apply a theme
ChaosToggle.runTheme('hacker');
ChaosToggle.runTheme('office');

// Run a mode
ChaosToggle.runMode('nuclear');
ChaosToggle.runMode('panic');

// Chain effects into a timed sequence
ChaosToggle.compose('ultimate-prank', [
  { effect: 'screenCrack', delay: 0 },
  { effect: 'bsod', delay: 800 },
  { effect: 'fakeVirusScan', delay: 4000 },
]);
ChaosToggle.runComposition('ultimate-prank');

// Open the built-in control panel
ChaosToggle.openPanel();
```

## Built-in Control Panel

A beautiful floating panel with glassmorphism design, draggable, with:

- Effect browser with toggle switches
- Theme picker gallery
- Intensity/duration/probability sliders
- Mode selector
- Run individual effects
- Export/import settings as JSON

```js
ChaosToggle.openPanel();
// or press Shift+Ctrl+C (configurable)
```

## Theme Builder

Create custom themes with a fluent API:

```js
ChaosToggle.buildTheme('office-prank')
  .palette('#0078d7', '#ffb900', '#f0f0f0', '#333')
  .effects('bsod', 'fakeUpdate', 'clippy', 'delayedClicks')
  .particles('confetti', { density: 0.3 })
  .popup({ title: 'IT Department', message: 'Your PC has been compromised.' })
  .timing({ durationMultiplier: 2 })
  .register();

ChaosToggle.runTheme('office-prank');
```

## Plugin System

Create and share effect packs:

```js
const myPlugin = {
  id: 'chaos-plugin-office',
  name: 'Office Pranks Pack',
  version: '1.0.0',
  effects: [myCustomEffect],
  themes: [{ id: 'corporate', config: { /* ... */ } }],
  install(engine) {
    engine.registerShortcut('Shift+B', 'runEffect:bsod');
  },
};

ChaosToggle.use(myPlugin);
```

### Event hooks

```js
ChaosToggle.on('beforeTrigger', () => console.log('Chaos incoming...'));
ChaosToggle.on('effectStart', (id) => console.log(`Effect: ${id}`));
ChaosToggle.on('themeChange', (name) => console.log(`Theme: ${name}`));
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Shift+H` | Trigger chaos |
| `Shift+P` | Panic mode |
| `Shift+R` | Reset |
| `Shift+C` | Celebration mode |

Register custom shortcuts:

```js
ChaosToggle.registerShortcut('Shift+B', 'runEffect:bsod');
ChaosToggle.registerShortcut('Shift+M', 'runEffect:matrixRain');
ChaosToggle.registerShortcut('Alt+K', () => ChaosToggle.togglePanel());
```

## Settings

```js
ChaosToggle.init({
  intensity: 0.7,          // 0-1
  duration: 3000,          // ms
  probability: 1,          // 0-1, chance of trigger firing
  cooldownMs: 150,         // ms between triggers
  theme: 'hacker',
  effects: {
    bsod: true,
    matrixRain: true,
    fakeTerminal: true,
    gravity: false,
  },
  shortcuts: {
    'Shift+H': 'trigger',
    'Shift+N': 'runMode:nuclear',
  },
});

// Update at runtime
ChaosToggle.updateSettings({ intensity: 1, duration: 5000 });
```

## API Reference

| Method | Description |
|---|---|
| `init(config?)` | Initialize with optional config |
| `trigger()` | Fire all enabled effects |
| `reset()` | Clear all active effects |
| `destroy()` | Full teardown |
| `updateSettings(config)` | Merge new settings |
| `enable()` / `disable()` | Toggle on/off |
| `getSettings()` | Get current settings copy |
| `runEffect(id)` | Run a single effect |
| `listEffects()` | List registered effect IDs |
| `registerEffect(effect)` | Add a custom effect |
| `runMode(name)` | Run a preset mode |
| `listModes()` | List available modes |
| `runTheme(name)` | Apply and trigger a theme |
| `setTheme(name)` | Set theme without triggering |
| `listThemes()` | List available themes |
| `buildTheme(name)` | Start fluent theme builder |
| `registerTheme(name, config)` | Register a theme |
| `compose(name, steps)` | Define an effect sequence |
| `runComposition(name)` | Run a sequence |
| `use(plugin)` | Install a plugin |
| `on(event, handler)` | Listen for events |
| `openPanel()` / `closePanel()` / `togglePanel()` | Control panel |
| `registerShortcut(combo, action)` | Add keyboard shortcut |

## TypeScript

Full type definitions included. Import types directly:

```typescript
import type { ChaosEffect, ChaosPlugin, ChaosToggleAPI, ThemeProfile } from 'chaos-toggle';
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

The easiest ways to contribute:

1. **New effect** -- Create a file in `src/effects/`, implement the `ChaosEffect` interface
2. **New theme** -- Add to `src/themes/builtin.ts` or create a plugin
3. **Bug fixes** -- Open an issue first, then PR
4. **Documentation** -- Improve docs under `docs/`

## License

[MIT](./LICENSE) -- Caripson
