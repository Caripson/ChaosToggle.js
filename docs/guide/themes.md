# Themes

A **theme** is a named `Partial<ThemeProfile>` merged on top of defaults. It can set palette, fonts, which effects are on, particles, popups, timing, overlays, and motion behavior.

## Built-in themes (17)

| Key | Vibe |
| --- | --- |
| `default` | Baseline profile; empty override. |
| `easter` | Pastel palette, eggs, playful popup. |
| `halloween` | Dark, ghosts, fog, glitch-friendly. |
| `christmas` | Snow, bells sound preset, cozy glow. |
| `new-year` | Fireworks, confetti, countdown behavior. |
| `4th-of-july` | Fireworks, patriotic palette, recoil motion. |
| `thanksgiving` | Leaves, reflective tone, cozy overlay. |
| `black-friday` | Neon cyber-sale urgency, fast timing. |
| `cyber-monday` | Digital scanlines, minimal particles. |
| `valentines-day` | Hearts, pulse behavior, romantic gradient. |
| `birthday` | Balloons, party animation, loop bursts. |
| `office` | BSOD, fake update, Clippy, delayed clicks. |
| `hacker` | Green terminal, matrix rain, fake terminal. |
| `retro` | VHS + CRT + noise + scanlines. |
| `apocalypse` | Cracks, gravity, scatter, panic popup. |
| `drunk` | Drunk mode, drift, inverted scroll, zoom flicker. |
| `jumpscare` | Fast, high-contrast flash + crack + shake. |

```javascript
ChaosToggle.init({ autoInit: true, safeMode: false });

ChaosToggle.setTheme('hacker');
ChaosToggle.trigger(); // uses theme’s effect map + visuals

// Or theme + trigger in one call
ChaosToggle.runTheme('office');
```

::: tip
**`setTheme`** only changes the active theme. **`runTheme(name)`** sets the theme and immediately **`trigger()`**s so you see the full package.
:::

## Partial themes & overrides

Registered themes are **partials**. Missing fields fall back to **`DEFAULT_THEME_PROFILE`**. You can also pass **`themeOverrides`** and **`themeParts`** in settings to layer ad-hoc changes without defining a full theme.

```javascript
ChaosToggle.updateSettings({
  theme: 'default',
  themeOverrides: {
    visual: {
      palette: {
        primary: '#22c55e',
        accent: '#a855f7',
        background: '#0f172a',
        text: '#f8fafc',
      },
    },
  },
});
```

## Theme builder API

**`buildTheme(name)`** returns a fluent **`ThemeBuilder`** that fills a `Partial<ThemeProfile>` and registers it on **`register()`**.

```javascript
ChaosToggle.buildTheme('brand-demo')
  .palette('#0ea5e9', '#f97316', '#020617', '#e2e8f0')
  .effects('confetti', 'shake', 'popups')
  .particles('confetti', { density: 0.8, mixWithConfetti: true })
  .popup({ title: 'Hello', message: 'From the builder API.', tone: 'friendly' })
  .timing({ pattern: 'cinematic', durationMultiplier: 1.1 })
  .animation({ style: 'smooth', intensityMultiplier: 0.7, shakeStyle: 'float' })
  .overlay({ type: 'gradient', opacity: 0.12 })
  .behavior({ drift: true, pulse: false })
  .register();

ChaosToggle.runTheme('brand-demo');
```

### Builder methods

| Method | Role |
| --- | --- |
| `palette(primary, accent, background, text)` | Sets `visual.palette` (and seeds `visual` defaults). |
| `effects(...ids)` | Sets `effects[id] = true` for each effect id. |
| `particles(type, opts?)` | Merges into `ThemeParticles`. |
| `popup(config)` | Merges into `ThemePopup`. |
| `timing(config)` | Merges into `ThemeTiming`. |
| `animation(config)` | Merges into `ThemeAnimation`. |
| `overlay(config)` | Merges into `ThemeOverlay`. |
| `behavior(config)` | Merges into `ThemeBehavior`. |
| `register()` | Calls `registerTheme(name, config)` and returns the API. |

## Registering custom themes

Use **`registerTheme`** when you already have a config object (for example loaded from JSON):

```javascript
ChaosToggle.registerTheme('staging-only', {
  visual: {
    className: 'ct-custom',
    forceDark: true,
    palette: {
      primary: '#ef4444',
      accent: '#fbbf24',
      background: '#18181b',
      text: '#fafafa',
    },
    fontFamily: 'system-ui, sans-serif',
  },
  effects: { noise: true, glitchOverlay: true },
});

ChaosToggle.setTheme('staging-only');
```

Remove a non-default theme with **`removeTheme('staging-only')`**.

## Listening for theme changes

```javascript
ChaosToggle.on('themeChange', (name) => {
  console.log('Active theme:', name);
});
```

See [TypeScript types](/api/types) for **`ThemeProfile`** and related interfaces.
