# Preset modes

**Modes** bundle **intensity**, **duration**, and an **effects** map. They are merged from **`PRESET_MODES`** defaults plus anything you pass in **`init({ modes: { ... } })`** or **`updateSettings`**.

Running a mode temporarily overrides global intensity and duration for that trigger, then restores previous values.

```javascript
ChaosToggle.runMode('celebration');
```

## All 7 preset modes

### `subtle`

- **Intensity:** `0.25` · **Duration:** `900` ms  
- Light touch: shake and text scramble only; no confetti, glitch, flash, noise, popups, or fake error state.

### `demo`

- **Intensity:** `0.5` · **Duration:** `1500` ms  
- Balanced showcase: shake, glitch, flash, text scramble, noise, popups—no confetti or fake error state.

### `chaos`

- **Intensity:** `0.75` · **Duration:** `2200` ms  
- Most core toggles on except you still control safe-mode-gated effects separately via settings and theme.

### `nuclear`

- **Intensity:** `1` · **Duration:** `3200` ms  
- Maximum of the default effect subset: everything in the base `effects` map turned on at full strength for the mode’s duration.

### `celebration`

- **Intensity:** `0.6` · **Duration:** `2200` ms  
- Confetti and popups; calm on shake, glitch, flash, scramble, noise, zoom, fake error.

### `glitch`

- **Intensity:** `0.65` · **Duration:** `1800` ms  
- Glitch-forward: glitch overlay, flash, text scramble, noise, zoom flicker—no shake, confetti, popups, fake error.

### `panic`

- **Intensity:** `0.85` · **Duration:** `2600` ms  
- Heavy “something broke” vibe: shake, glitch, flash, scramble, noise, zoom, popups, fake error state.

::: tip
Default keyboard shortcuts include **`Shift+P`** → `runMode:panic` and **`Shift+C`** → `runMode:celebration` when shortcuts are enabled.
:::

## Custom modes

```javascript
ChaosToggle.init({
  autoInit: true,
  modes: {
    'qa-smoke': {
      intensity: 0.4,
      duration: 800,
      effects: {
        shake: true,
        flashOverlay: true,
        popups: false,
      },
    },
  },
});

ChaosToggle.runMode('qa-smoke');
```

List names with **`ChaosToggle.listModes()`**.

## Modes vs themes

| | Modes | Themes |
| --- | --- | --- |
| **Purpose** | One-shot intensity + duration + effect subset | Persistent palette, particles, behavior, merged effect defaults |
| **API** | `runMode(name)` | `setTheme` / `runTheme` |
| **Event** | `modeChange` | `themeChange` |

You can combine them: set a theme for look-and-feel, then **`runMode`** for how hard the next trigger hits.
