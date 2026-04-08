# Theme template

Themes are **`Partial<ThemeProfile>`** objects merged over defaults. Start from an existing key in **`src/themes/builtin.ts`** or use this minimal pattern.

## Inline registration

```javascript
ChaosToggle.init({ autoInit: true });

ChaosToggle.registerTheme('my-conference', {
  visual: {
    className: 'ct-theme-my-conference',
    forceDark: true,
    palette: {
      primary: '#6366f1',
      accent: '#22d3ee',
      background: '#020617',
      text: '#f1f5f9',
    },
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  effects: {
    confetti: true,
    shake: false,
    glitchOverlay: true,
    flashOverlay: false,
  },
  animation: {
    style: 'digital',
    intensityMultiplier: 0.75,
    shakeStyle: 'default',
  },
  particles: {
    type: 'minimal',
    density: 0.2,
    emoji: null,
    mixWithConfetti: false,
  },
  popup: {
    title: 'Hey there',
    message: 'Demo theme — not a real alert.',
    tone: 'friendly',
  },
  sound: { enabled: false, preset: null },
  timing: {
    pattern: 'default',
    durationMultiplier: 1,
    cooldownMultiplier: 1,
  },
  triggers: {},
  overlay: { type: 'scanline', opacity: 0.18 },
  decorations: { hints: false },
  behavior: {
    microJumps: false,
    pulse: false,
    recoil: false,
    drift: false,
    loopBursts: false,
    countdown: false,
  },
});

ChaosToggle.setTheme('my-conference');
```

## TypeScript module (core)

```typescript
import type { ThemeProfile } from '../core/types';

const myTheme: Partial<ThemeProfile> = {
  visual: {
    className: 'ct-theme-my-pack',
    forceDark: false,
    palette: {
      primary: '#f472b6',
      accent: '#38bdf8',
      background: '#0f172a',
      text: '#f8fafc',
    },
    fontFamily: 'system-ui, sans-serif',
  },
  effects: { matrixRain: true, noise: true },
  // ...fill other sections as needed
};

export default myTheme;
```

Add the export to **`BUILTIN_THEMES`** in **`builtin.ts`** and register is handled at startup in **`src/index.ts`**.

## Builder variant

```javascript
ChaosToggle.buildTheme('launch-week')
  .palette('#ec4899', '#8b5cf6', '#111827', '#f9fafb')
  .effects('confetti', 'shake', 'popups')
  .particles('confetti', { density: 1, mixWithConfetti: true })
  .popup({ title: 'Ship it', message: 'Theme from builder.', tone: 'energetic' })
  .register();
```

## CSS class hook

Set **`visual.className`** to a string you style globally (for example in your app CSS):

```css
.ct-theme-my-conference {
  letter-spacing: 0.01em;
}
```

::: tip
**`forceDark: true`** adds the `ct-theme-dark` class on the scope root so built-in dark styles apply consistently.
:::

## See also

- [Themes guide](/guide/themes) — all built-in keys and behavior notes  
- [TypeScript types](/api/types) — full **`ThemeProfile`** shape  
