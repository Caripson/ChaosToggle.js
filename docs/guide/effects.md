# Effects reference

Every effect is registered under a stable **`id`** string. Enable or disable them in settings (`effects` map), in **theme** profiles, or when calling **`trigger(modeEffects)`** / **`runMode(name)`**.

::: tip
Effect **`popups`** uses the id `popups` (plural) in code and settings, even though the file is conceptually a “popup” effect.
:::

## Visual distortion & overlays

| ID | Name | Description |
| --- | --- | --- |
| `shake` | Shake | Shakes the scoped root using the active shake animation style. |
| `glitchOverlay` | Glitch overlay | Full-screen scanline-style glitch layer. |
| `noise` | Noise | Film-grain style noise overlay. |
| `flashOverlay` | Flash overlay | Pulsing bright flash across the viewport. |
| `rgbSplit` | RGB split | Chromatic aberration across the scoped root. |
| `vhsDistortion` | VHS distortion | Scanlines, tracking errors, and analog skew. |
| `zoomFlicker` | Zoom flicker | Subtle scale pulse on the scoped root. |
| `fakeErrorState` | Fake error | Dramatic color shift reminiscent of a broken display. |

```javascript
ChaosToggle.updateSettings({
  effects: {
    glitchOverlay: true,
    rgbSplit: true,
    shake: false,
  },
});
ChaosToggle.trigger();
```

## Text & UI chrome

| ID | Name | Description |
| --- | --- | --- |
| `textScramble` | Text scramble | Temporarily replaces visible text with random characters, then restores it. |
| `popups` | Popup | Corner toast with title, message, and dismiss control. |
| `confetti` | Confetti | Falling particles (emoji or colored pieces) driven by intensity and particle type. |

```javascript
ChaosToggle.runEffect('confetti');
```

## Destruction & “broken screen”

| ID | Name | Description |
| --- | --- | --- |
| `screenCrack` | Screen crack | Shattered-glass fracture lines from a central impact. |
| `pixelDissolve` | Pixel dissolve | View explodes into a storm of palette-colored pixels. |
| `screenMelt` | Screen melt | Viewport drips away beneath a molten edge. |
| `crtShutdown` | CRT shutdown | Vintage display collapse with phosphor flash. |

## Prank & parody UIs

| ID | Name | Description |
| --- | --- | --- |
| `bsod` | BSOD | Full-screen Windows-style blue screen prank. |
| `fakeUpdate` | Fake update | Convincing full-screen Windows Update progress prank. |
| `fakeTerminal` | Fake terminal | Hollywood-style typing terminal overlay. |
| `fakeVirusScan` | Fake virus scan | Dramatic full-screen antivirus-style scan UI. |
| `fakeCrash` | Fake crash | Chrome-style “Aw, Snap!” crash page prank. |
| `clippy` | Clippy | Paperclip assistant with unhelpful suggestions. |

::: warning
These overlays can alarm people or trigger security training. Use **only** with consent and in safe environments.
:::

## DOM & layout chaos

| ID | Name | Description |
| --- | --- | --- |
| `gravity` | Gravity | Clones visible blocks and lets them fall with goofy physics. |
| `elementShuffle` | Element shuffle | Swaps on-screen positions of headings, text, and controls. |
| `elementScatter` | Element scatter | Flings pieces off-screen with spin. |
| `tinyGiantMode` | Tiny / giant mode | Random elements balloon or shrink. |
| `screenFlip` | Screen flip | Rotates the whole scope upside down. |

## Pointer & interaction

| ID | Name | Description |
| --- | --- | --- |
| `cursorChaos` | Cursor chaos | Rainbow crumbs and restless pointer styles. |
| `cursorDrift` | Cursor drift | Fake pointer slowly wanders away from the real one. |
| `magneticCursor` | Magnetic cursor | Nearby elements creep toward the pointer. |
| `delayedClicks` | Delayed clicks | Clicks pause on a loading cursor before they fire. |
| `invertedScroll` | Inverted scroll | Wheel direction feels backwards. |
| `autoTypo` | Auto typo | Sometimes sneaks an extra neighbor key into fields. |
| `drunkMode` | Drunk mode | Blurry vision and a tipsy wobble. |

## Atmospheric

| ID | Name | Description |
| --- | --- | --- |
| `matrixRain` | Matrix rain | Full-viewport digital rain of katakana and symbols. |

## Running a single effect

```javascript
ChaosToggle.init({ autoInit: true });
ChaosToggle.runEffect('matrixRain');
```

## Listing registered IDs

```javascript
console.log(ChaosToggle.listEffects());
```

## Categories (TypeScript)

In source, each effect declares a **`category`**: `visual`, `dom`, `interaction`, `overlay`, or `prank`. Use that when building plugins or documentation tools.
