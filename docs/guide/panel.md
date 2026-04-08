# Control panel

The **control panel** is a floating, draggable UI (Shadow DOM) that talks to the public API. It is **lazy-loaded** the first time you open it.

## How to open

Call any of:

```javascript
ChaosToggle.openPanel();
ChaosToggle.togglePanel(); // open if closed, close if open
```

There is **no default keyboard shortcut** for the panel. Wire your own:

```javascript
ChaosToggle.init({ autoInit: true });

ChaosToggle.registerShortcut('Shift+K', 'togglePanel');
```

Supported string actions include `trigger`, `reset`, `enable`, `disable`, `togglePanel`, and prefixes `runMode:`, `runTheme:`, `runEffect:` (see [API reference](/api/)).

## Features

- **Quick actions** — Trigger, Reset, and one-click **Nuclear**, **Panic**, **Celebration**, and **Glitch** modes.
- **Sliders** — Adjust **intensity** and **duration** live (`updateSettings`).
- **Theme chips** — Pick from registered themes (`setTheme`).
- **Effect toggles** — Enable or disable individual effects on the merged settings map.
- **Export** — Copy a JSON snippet of current settings for reuse in code.
- **Chrome** — Draggable header, close button, resizable panel (minimum size enforced in CSS).

::: tip
Opening the panel calls **`init()`** indirectly if the engine was not initialized yet, because the panel needs a live settings snapshot.
:::

## Events

The public API includes **`panelOpen`** and **`panelClose`** in **`ChaosEventName`** for integrations. The bundled panel UI does not emit them yet; you can **`emit`** them from a fork or wrap **`openPanel` / `closePanel`** if you need analytics hooks.

## Closing and cleanup

```javascript
ChaosToggle.closePanel();
```

**`destroy()`** on the engine also closes and tears down the panel instance.
