# Contributing to ChaosToggle.js

Thanks for wanting to make the web more chaotic! Here's how to get started.

## Quick Start

```bash
git clone https://github.com/Caripson/ChaosToggle.js.git
cd ChaosToggle.js
npm install
npm run build
npm test
```

Open `examples/index.html` in a browser to test effects visually.

## Adding a New Effect

This is the most common and most welcome contribution.

### 1. Create the file

Create `src/effects/my-effect.ts`:

```typescript
import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const myEffect: ChaosEffect = {
  id: 'myEffect',
  name: 'My Effect',
  description: 'What it does in one sentence.',
  category: 'visual', // 'visual' | 'dom' | 'interaction' | 'overlay' | 'prank'
  apply(ctx: EffectContext) {
    // ctx.root       -- the scoped root element
    // ctx.intensity  -- 0 to 1
    // ctx.duration   -- ms
    // ctx.palette    -- { primary, accent, background, text }
    // ctx.addNode()  -- register a DOM node for automatic cleanup
    // ctx.addTimer() -- register a timer ID for automatic cleanup

    const el = createEl('div', 'my-effect-class');
    ctx.addNode(el);

    // Return a cleanup function (optional but recommended)
    return () => {
      el.remove();
    };
  },
};

export default myEffect;
```

### 2. Register it

Add your import and entry in `src/effects/index.ts`:

```typescript
import myEffect from './my-effect';
// ...
export const ALL_EFFECTS: ChaosEffect[] = [
  // ...existing effects
  myEffect,
];
```

### 3. Add CSS if needed

Add any CSS classes to `src/core/styles.ts`.

### 4. Test it

```bash
npm run build
# Open examples/index.html and try your effect
```

### Effect Guidelines

- Effects MUST be self-contained (one file, no cross-dependencies between effects)
- Effects MUST return a cleanup function if they modify DOM or add listeners
- Effects SHOULD use `ctx.addNode()` and `ctx.addTimer()` for automatic cleanup
- Effects SHOULD respect `ctx.intensity` to scale their visual impact
- Effects MUST NOT break the page permanently -- everything reverses on reset
- Keep file size reasonable (< 200 lines ideally)

## Adding a New Theme

Add your theme object to `src/themes/builtin.ts`:

```typescript
'my-theme': {
  visual: {
    className: 'ct-theme-mytheme',
    forceDark: false,
    palette: { primary: '#ff0000', accent: '#00ff00', background: '#000', text: '#fff' },
    fontFamily: 'ui-sans-serif,system-ui',
  },
  effects: { bsod: true, matrixRain: true },
  animation: { style: 'default', intensityMultiplier: 0.8, shakeStyle: 'default' },
  particles: { type: 'confetti', density: 0.5, emoji: null, mixWithConfetti: false },
  popup: { title: 'My Theme', message: 'Theme activated.', tone: 'neutral' },
  behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
},
```

### Theme Guidelines

- Themes should have a clear identity/concept
- Set `effects` to control which effects fire for the theme
- Use `behavior` flags for ambient effects (pulse, drift, microJumps)
- Test with `ChaosToggle.runTheme('my-theme')`

## Code Style

- TypeScript strict mode -- no `any` except in `utils.ts` where necessary
- No comments that just restate what the code does
- Use `createEl()` for DOM creation
- Use `clamp()` for numeric bounds
- Run `npx tsc --noEmit` before committing

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm test` and `npm run build`
4. Update docs if you added new public API
5. Open a PR with a clear description of what and why

## Commit Messages

Use descriptive commit messages:

- `feat: add gravity effect`
- `fix: correct cooldown calculation`
- `docs: add effect template to contributing guide`
- `theme: add retro theme`

## Questions?

Open a [Discussion](https://github.com/Caripson/ChaosToggle.js/discussions) or [Issue](https://github.com/Caripson/ChaosToggle.js/issues).
