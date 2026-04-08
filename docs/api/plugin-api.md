# Plugin API

Plugins extend ChaosToggle with **`ChaosEffect`** instances, optional **theme** registrations, and an **`install`** hook for imperative setup.

## `ChaosPlugin` interface

```typescript
interface ChaosPlugin {
  id: string;
  name: string;
  version: string;
  effects?: ChaosEffect[];
  themes?: Array<{ id: string; config: Partial<ThemeProfile> }>;
  install?(engine: ChaosToggleAPI): void;
}
```

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Stable machine id (logging, deduping). |
| `name` | Yes | Human-readable label. |
| `version` | Yes | Semver string for your bundle. |
| `effects` | No | Effects registered before **`install`**. |
| `themes` | No | `{ id, config }` pairs passed to **`registerTheme`**. |
| `install` | No | Runs last; receives the full **`ChaosToggleAPI`**. |

## Installing a plugin

```javascript
const myPlugin = {
  id: 'acme-chaos-pack',
  name: 'ACME Chaos Pack',
  version: '1.0.0',
  effects: [sparkleEffect],
  themes: [
    { id: 'acme-brand', config: { effects: { confetti: true, shake: false } } },
  ],
  install(api) {
    api.registerShortcut('Shift+Alt+C', () => api.runEffect('sparkle'));
  },
};

ChaosToggle.init({ autoInit: true }).use(myPlugin);
```

::: tip
Call **`use`** after **`init`** if your **`install`** hook registers shortcuts or reads settings—order matters for predictable behavior.
:::

## Authoring an effect

Effects implement **`ChaosEffect`**:

```typescript
interface ChaosEffect {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
  apply(ctx: EffectContext): void | CleanupFn;
  defaults?: Record<string, unknown>;
}
```

**`EffectContext`** provides:

- **`root`** — scoped element  
- **`intensity`**, **`duration`**, **`palette`**  
- **`addNode(el)`** — append to document (tracked for reset)  
- **`addTimer(id)`** — register timeout/interval for bulk clear  
- **`log(...args)`** — debug logging when settings.debug is on  

Return a **cleanup function** to unregister listeners or undo DOM your effect created outside **`addNode`**.

See [Effect template](/community/effect-template) for a copy-paste starter.

## “Hooks” today

There is no separate plugin hook enum; use:

1. **`install(api)`** — shortcuts, **`on`** listeners, **`compose`** definitions.  
2. **Events** — `beforeTrigger`, `afterTrigger`, `effectStart`, `effectEnd`, `themeChange`, `modeChange`, `settingsChange` (plus typed `panelOpen` / `panelClose` for custom integrations).

```javascript
function auditPlugin() {
  return {
    id: 'audit',
    name: 'Audit log',
    version: '0.0.1',
    install(api) {
      api.on('afterTrigger', () => {
        console.info('[audit] trigger at', Date.now());
      });
    },
  };
}
```

::: warning
**`use`** appends plugins to an internal list but does not uninstall them; call **`removeEffect`** / **`removeTheme`** manually if you need hot-unplug semantics.
:::

## Publishing

Ship ESM/CJS bundles that call **`ChaosToggle.use(...)`** or export a plugin object for the host app to register. Keep **`id`** unique across the page.
