# Getting Started

ChaosToggle.js adds visual chaos, pranks, and demo effects to any page. It runs in the browser, ships with **no npm dependencies**, and exposes a global `ChaosToggle` when loaded via script tag.

::: tip
Control what can run with the **`effects`** map and your choice of **theme**. Prank UIs (BSOD, fake update, etc.) are off unless you enable them in settings or load a theme that turns them on.
:::

## Install

### CDN (global)

Add the built bundle from your CDN of choice (for example after publishing to npm / unpkg):

```html
<script src="https://cdn.jsdelivr.net/npm/chaos-toggle/dist/chaos-toggle.min.js"></script>
<script>
  ChaosToggle.init({ autoInit: true });
</script>
```

### npm

```bash
npm install chaos-toggle
```

```javascript
import ChaosToggle from 'chaos-toggle';

ChaosToggle.init({ autoInit: true });
```

## Minimal setup

1. Call **`init()`** once (or pass `autoInit: true` in config).
2. Call **`trigger()`** to run a random pass over enabled effects (respects `probability` and `cooldownMs`).
3. Call **`reset()`** to clear overlays, timers, and DOM artifacts early.

```javascript
ChaosToggle.init({
  scopeSelector: 'body',
  theme: 'default',
  effects: { bsod: true, fakeUpdate: true }, // only enable pranks you intend to use
});

document.getElementById('chaos-btn').onclick = () => {
  ChaosToggle.trigger();
};
```

## First prank in 30 seconds

```javascript
ChaosToggle.init({ autoInit: true });

// One-shot office nightmare
ChaosToggle.setTheme('office');
ChaosToggle.trigger();

// Or a preset mode (intensity + duration + effect subset)
ChaosToggle.runMode('panic');
```

::: warning
Prank effects (BSOD, fake update, virus scan, etc.) look real. Only use them where **everyone** has agreed to the joke, and never on production sites that serve unaware users.
:::

## Next steps

- [Effects reference](/guide/effects) — all 34 effects by category  
- [Themes](/guide/themes) — 17 built-in themes and custom registration  
- [Modes](/guide/modes) — preset intensity profiles (panic, nuclear, celebration, etc.)  
- [Control Panel](/guide/panel) — built-in floating settings UI  
- [API reference](/api/) — full method list  
