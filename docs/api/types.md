# TypeScript types

Types are exported from **`chaos-toggle`** alongside the runtime API.

```typescript
import type {
  ChaosToggleAPI,
  ChaosSettings,
  ChaosEffect,
  ChaosPlugin,
  ChaosEventName,
  ChaosEventHandler,
  CompositionStep,
  ThemeProfile,
  ThemeBuilder,
  EffectContext,
  CleanupFn,
  EffectCategory,
  ThemePalette,
  ThemeVisual,
  ThemeAnimation,
  ThemeParticles,
  ThemePopup,
  ThemeSound,
  ThemeTiming,
  ThemeOverlay,
  ThemeDecorations,
  ThemeBehavior,
  ModeConfig,
} from 'chaos-toggle';
```

## Core aliases

| Type | Meaning |
| --- | --- |
| `CleanupFn` | `() => void` — optional return from **`effect.apply`**. |
| `EffectCategory` | `'visual' \| 'dom' \| 'interaction' \| 'overlay' \| 'prank'` |
| `ChaosEventName` | Union of lifecycle event strings (see [API overview](/api/) Events table). |
| `ChaosEventHandler` | `(...args: unknown[]) => void` |

## `EffectContext`

| Field | Type | Notes |
| --- | --- | --- |
| `root` | `HTMLElement` | Scoped root from **`scopeSelector`**. |
| `intensity` | `number` | Clamped 0–1 in settings validation. |
| `duration` | `number` | Effective ms after theme timing multiplier. |
| `palette` | `ThemePalette` | Active theme colors. |
| `addNode` | `(node: HTMLElement) => void` | Tracked DOM insertion. |
| `addTimer` | `(id: number) => void` | Register timer ids for reset. |
| `log` | `(...args: unknown[]) => void` | No-op unless **`debug`**. |

## `ChaosEffect`

| Field | Type |
| --- | --- |
| `id` | `string` |
| `name` | `string` |
| `description` | `string` |
| `category` | `EffectCategory` |
| `apply` | `(ctx: EffectContext) => void \| CleanupFn` |
| `defaults?` | `Record<string, unknown>` |

## Theme types

- **`ThemePalette`** — `primary`, `accent`, `background`, `text` hex/CSS colors.  
- **`ThemeVisual`** — `className`, `forceDark`, `palette`, `fontFamily`.  
- **`ThemeAnimation`** — `style`, `intensityMultiplier`, `shakeStyle`.  
- **`ThemeParticles`** — `type`, `density`, `emoji`, `mixWithConfetti`.  
- **`ThemePopup`** — `title`, `message`, `confirmText?`, `tone`.  
- **`ThemeSound`** — `enabled`, `preset`.  
- **`ThemeTiming`** — `durationMultiplier`, `cooldownMultiplier`, `pattern`.  
- **`ThemeOverlay`** — `type`, `opacity`, optional `gradient`.  
- **`ThemeDecorations`** — `hints`.  
- **`ThemeBehavior`** — `microJumps`, `pulse`, `recoil`, `drift`, `loopBursts`, `countdown`.  

**`ThemeProfile`** composes all of the above into one required shape (partials merge over **`DEFAULT_THEME_PROFILE`** at runtime).

## `ModeConfig`

```typescript
interface ModeConfig {
  intensity?: number;
  duration?: number;
  effects: Record<string, boolean>;
}
```

## `CompositionStep`

```typescript
interface CompositionStep {
  effect: string;
  delay: number;
  options?: Record<string, unknown>;
}
```

`options` is reserved for future per-step parameters; effects read **`EffectContext`** today.

## `ChaosSettings`

Large flat settings object: flags, **`theme`**, **`effects`**, **`shortcuts`**, **`triggers`**, **`modes`**, sliders, and theme merge controls. Prefer **`ChaosSettings`** from the package for autocomplete rather than re-declaring.

## `ChaosToggleAPI` / `ThemeBuilder`

These interfaces document every public method including **`buildTheme`**’s fluent chain. See [API reference](/api/) for behavior notes.
