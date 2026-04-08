# Effect template

Use this skeleton when adding a **`ChaosEffect`** in core or in a plugin. Replace placeholders and keep **`id`** unique.

```typescript
import type { ChaosEffect, EffectContext } from 'chaos-toggle';

const myEffect: ChaosEffect = {
  id: 'myEffect',
  name: 'My effect',
  description: 'One-line explanation for docs and the panel.',
  category: 'visual', // 'visual' | 'dom' | 'interaction' | 'overlay' | 'prank'

  defaults: {
    // optional: serialized knobs if you read them later
    strength: 1,
  },

  apply(ctx: EffectContext): void | (() => void) {
    const { root, intensity, duration, palette, addNode, addTimer, log } = ctx;

    log('myEffect:start', { intensity, duration });

    // Example: timed class on scope root
    root.classList.add('ct-my-effect');
    const t = window.setTimeout(() => {
      root.classList.remove('ct-my-effect');
    }, duration);
    addTimer(t);

    // Example: overlay node (auto-removed on reset)
    const layer = document.createElement('div');
    layer.className = 'ct-my-layer';
    layer.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: color-mix(in srgb, ${palette.primary} 20%, transparent);
      z-index: 2147483000;
    `;
    addNode(layer);

    // Return cleanup for listeners you attach manually
    const onMove = () => {};
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      root.classList.remove('ct-my-effect');
    };
  },
};

export default myEffect;
```

## Checklist

1. **Register** the effect in **`src/effects/index.ts`** (core) or pass it in a **`ChaosPlugin.effects`** array.  
2. **Styles** — prefer small additions in **`src/core/styles.ts`** (`BASE_CSS`) or scoped inline styles from **`palette`**.  
3. **Timers & DOM** — always **`addTimer`** for `setTimeout` / `setInterval`, and **`addNode`** for floating layers so **`reset()`** cleans up.  
4. **Docs** — add a row to [Effects](/guide/effects) and mention any new theme toggles in [Themes](/guide/themes) if applicable.

::: tip
Use **`intensity`** (0–1) to scale counts, opacity, or probability—not hard-coded constants—so modes and sliders feel consistent.
:::

::: warning
Effects that capture **pointer events** or **keyboard** input should restore the previous state in **`cleanup`** to avoid bricking the page after **`reset()`**.
:::
