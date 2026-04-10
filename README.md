<div align="center">

# ChaosToggle.js

**The ultimate prank & chaos effects library for the web.**

51 effects. 17 themes. Built-in control panel. Plugin system. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/chaos-toggle?color=ff4d6d&style=flat-square)](https://www.npmjs.com/package/chaos-toggle)
[![license](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Caripson/ChaosToggle.js/ci.yml?style=flat-square)](https://github.com/Caripson/ChaosToggle.js/actions)

[Live Demo](https://caripson.github.io/ChaosToggle.js/demo/) &#8226; [Getting Started](https://caripson.github.io/ChaosToggle.js/#quick-start) &#8226; [Effects Reference](https://caripson.github.io/ChaosToggle.js/#effects) &#8226; [Themes](https://caripson.github.io/ChaosToggle.js/#effects) &#8226; [API Reference](https://caripson.github.io/ChaosToggle.js/#api)

</div>

---

## First prank in 30 seconds

```html
<script src="https://cdn.jsdelivr.net/npm/chaos-toggle/dist/chaos-toggle.min.js"></script>
<script>
  ChaosToggle.start(); // alias of init()
  ChaosToggle.runEffect('bsod'); // Blue Screen of Death
</script>
```

`start()` is an alias of `init()`—use whichever reads better in your docs.

## Install

```bash
npm install chaos-toggle
```

```js
import ChaosToggle from 'chaos-toggle';

ChaosToggle.start();
ChaosToggle.trigger();
```

## What's inside

### 51 Effects across 5 categories

| Category | Effects |
|---|---|
| **Visual** | shake, glitchOverlay, noise, flashOverlay, zoomFlicker, fakeErrorState, matrixRain, rgbSplit, vhsDistortion, screenCrack, pixelDissolve, screenMelt, crtShutdown |
| **Prank** | bsod, fakeUpdate, fakeTerminal, clippy, fakeVirusScan, fakeCrash |
| **DOM** | gravity, elementShuffle, elementScatter, magneticCursor, tinyGiantMode |
| **Interaction** | cursorChaos, cursorDrift, autoTypo, delayedClicks, invertedScroll, screenFlip, drunkMode |
| **Overlay** | confetti, popups, textScramble, springParade, starSpangledBanner, hackerHud, holidayLights, hauntedEyes, retroBroadcast, partyBalloons, officeStickyNotes, evacuationTape, midnightBurst, harvestTable, doorbusterMarquee, protocolGrid, loveLetters, lastCall, panicAlarm, realityTear |

### Effects we just pushed further (with 3D flavor)

- `zoomFlicker`: now reacts to pointer/gyro movement for a prism-like live 3D tilt
- `screenFlip`: now plays a cinematic “portal flip” with elastic overshoot and vortex flash
- `tinyGiantMode`: now does two-phase quantum pulses with depth-shift and dynamic shadowing

### 17 Themes

`default` `easter` `halloween` `christmas` `new-year` `4th-of-july` `thanksgiving` `black-friday` `cyber-monday` `valentines-day` `birthday` `office` `hacker` `retro` `apocalypse` `drunk` `jumpscare`

### 7 Preset Modes

`subtle` `demo` `chaos` `nuclear` `celebration` `glitch` `panic`

## Showcase picks

If you want themes that read immediately, start here:

- `easter`: chicks, eggs, and `springParade`
- `4th-of-july`: flags, stars, and `starSpangledBanner`
- `hacker`: terminal rain plus `hackerHud`
- `birthday`: balloons and `partyBalloons`
- `black-friday`: sale pressure via `doorbusterMarquee`
- `jumpscare`: hard-stop warning treatment via `panicAlarm`
- `realityTear`: flagship viewport split with drifting slabs and a live rift core

For a live preview-first overview, use the docs showcase: [caripson.github.io/ChaosToggle.js](https://caripson.github.io/ChaosToggle.js/).

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
  policy: 'demo',          // 'safe' | 'demo' | 'prank'
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

Policy levels:

- `safe` blocks prank-heavy and interaction-disrupting effects.
- `demo` allows visual pranks and overlays but still blocks disruptive interaction effects.
- `prank` allows everything.

`safeMode` still works as a compatibility alias: `true` maps to `safe`, `false` maps to `prank`.

Recommended default:

- Use `safe` for public pages and shared screens.
- Use `demo` for staging, sales demos, and guided walkthroughs.
- Use `prank` only when you explicitly want disruptive behavior.

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

## Testing

Unit and API regression tests:

```bash
npm test
```

Browser and visual regression tests:

```bash
npm run playwright:install
npm run test:visual
```

When you intentionally update browser baselines:

```bash
npm run test:visual:update
```

The docs and playground pages load the local `dist/` bundle first and only fall back to CDN if the local bundle is unavailable, so browser tests exercise the code in this repo.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

The easiest ways to contribute:

1. **New effect** -- Create a file in `src/effects/`, implement the `ChaosEffect` interface
2. **New theme** -- Add to `src/themes/builtin.ts` or create a plugin
3. **Bug fixes** -- Open an issue first, then PR
4. **Documentation** -- Improve docs under `docs/`

## License


[MIT](./LICENSE) -- Johan Caripson
