# API reference

The default export (and named **`ChaosToggle`**) implements **`ChaosToggleAPI`**. All chainable methods return the same API instance unless noted.

```javascript
import ChaosToggle from 'chaos-toggle';

ChaosToggle.init({ autoInit: true })
  .on('afterTrigger', () => console.log('done'))
  .trigger();
```

## Properties

| Member | Type | Description |
| --- | --- | --- |
| `version` | `string` | Package version string exposed on the API. |

## Lifecycle

### `init(config?)`

Initializes the engine once: injects base CSS, binds shortcuts, attaches optional click/load triggers. Idempotent if already initialized.

### `destroy()`

Clears effects, closes the panel, removes listeners and style tag; engine can be initialized again later.

### `reset()`

Removes transient DOM, timers, and effect cleanups without unbinding global shortcuts.

### `enable()` / `disable()`

**`disable()`** also **`reset()`**s. **`enable()`** only flips the internal flag.

### `updateSettings(config)`

Deep-merges partial settings, reapplies shortcuts and triggers, emits **`settingsChange`**.

### `getSettings()`

Returns a **clone** of the current **`ChaosSettings`**.

## Triggering chaos

### `trigger(modeEffects?)`

Runs the effect pipeline: respects **`cooldownMs`**, **`probability`**, merges theme + settings effects, optionally overridden by **`modeEffects`**. Schedules automatic **`reset()`** after the themed duration. Returns **`true`** if a trigger actually ran.

### `runEffect(id)`

Runs a **single** registered effect with a fresh context; schedules reset after themed duration.

### `runMode(name)`

Looks up **`modes[name]`**, temporarily applies its intensity/duration, then **`trigger(mode.effects)`**. Restores previous intensity/duration afterward. Returns whether **`trigger`** succeeded.

### `runTheme(name)`

**`setTheme(name)`** then **`trigger()`**.

### `compose(name, steps)` / `runComposition(name)`

**`compose`** stores a named sequence of **`CompositionStep`** `{ effect, delay, options? }`. **`runComposition`** schedules each effect with **`setTimeout`** and resets after the last step.

## Themes

| Method | Description |
| --- | --- |
| `setTheme(name)` | Switches active theme if registered; emits **`themeChange`**. |
| `getTheme()` | `{ name, config }` snapshot of resolved profile. |
| `listThemes()` | All registered theme keys. |
| `registerTheme(name, config)` | Registers or replaces a partial profile. |
| `removeTheme(name)` | Deletes a theme (not `default`). |
| `buildTheme(name)` | Returns fluent **`ThemeBuilder`**; call **`.register()`** to persist. |

## Effects registry

| Method | Description |
| --- | --- |
| `registerEffect(effect)` | Adds or replaces a **`ChaosEffect`**. |
| `removeEffect(id)` | Unregisters by id. |
| `listEffects()` | All effect ids. |

## Modes

| Method | Description |
| --- | --- |
| `listModes()` | Keys of merged preset + custom modes. |

Custom modes are supplied via **`init` / `updateSettings`** → **`modes`**.

## Shortcuts

| Method | Description |
| --- | --- |
| `registerShortcut(combo, action)` | Adds a key combo. `action` is a string token or `(engine) => void`. |
| `unregisterShortcut(combo)` | Removes a combo. |

Built-in string actions: **`trigger`**, **`reset`**, **`enable`**, **`disable`**, **`togglePanel`**, **`runMode:<name>`**, **`runTheme:<name>`**, **`runEffect:<id>`**.

Toggle all shortcuts with **`updateSettings({ shortcutsEnabled: false })`**.

## Panel

| Method | Description |
| --- | --- |
| `openPanel()` | Lazy-loads panel module and mounts UI. |
| `closePanel()` | Destroys panel host. |
| `togglePanel()` | Open or close. |

## Events

### `on(event, handler)` / `off(event, handler)`

**`ChaosEventName`** values:

| Event | When |
| --- | --- |
| `beforeTrigger` | Start of **`trigger`** before DOM work. |
| `afterTrigger` | After scheduling effects and reset timer. |
| `effectStart` / `effectEnd` | Around each effect invocation (payload includes effect id and context where emitted). |
| `themeChange` | Theme name changed. |
| `modeChange` | **`runMode`** invoked with mode name. |
| `settingsChange` | After **`updateSettings`**. |
| `panelOpen` / `panelClose` | Reserved for panel lifecycle; not emitted by the stock panel today—wrap **`openPanel` / `closePanel`** if you need hooks. |

```javascript
ChaosToggle.on('effectStart', (id) => console.log('started', id));
```

## Plugins

### `use(plugin)`

Registers **`ChaosPlugin`**: optional **`effects`**, **`themes`**, and **`install(api)`** hook. See [Plugin API](/api/plugin-api).

---

## `ChaosSettings` (overview)

Key fields (see [types](/api/types) for the full interface):

| Field | Role |
| --- | --- |
| `autoInit` | If `true`, consumers may auto-start; library still expects explicit **`init()`** in typical use. |
| `enabled` | Master on/off for triggers. |
| `safeMode` | Reserved flag in settings shape; use **`effects`** / themes to limit pranks. |
| `debug` | Verbose **`[ChaosToggle]`** logging when `true`. |
| `scopeSelector` | Root query selector for effects (default `body`). |
| `cooldownMs` | Minimum gap between **`trigger`** calls. |
| `randomSeed` | Optional seed hook for integrations. |
| `theme` | Active theme name. |
| `themeOverrides` / `themeParts` | Layered partial profile + section toggles. |
| `duration` / `intensity` / `probability` | Base timing, strength, and trigger roll. |
| `shortcutsEnabled` | Global shortcut listener switch. |
| `popup` | Default toast copy for **`popups`** effect. |
| `effects` | Map of effect id → boolean. |
| `triggers` | `onLoad`, `onClickSelector`. |
| `shortcuts` | Combo → action map. |
| `modes` | Custom mode definitions merged over presets. |
