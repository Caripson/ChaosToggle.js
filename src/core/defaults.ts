import type { ThemeProfile, ChaosSettings, ModeConfig } from './types';

export const DEFAULT_THEME_PROFILE: ThemeProfile = {
  visual: {
    className: '',
    forceDark: false,
    palette: { primary: '#ff4d6d', accent: '#00f5ff', background: '#111111', text: '#f8f8f8' },
    fontFamily: 'ui-sans-serif,system-ui',
  },
  effects: {},
  animation: { style: 'default', intensityMultiplier: 1, shakeStyle: 'default' },
  particles: { type: 'confetti', density: 1, emoji: null, emojiSet: [], mixWithConfetti: false, motion: 'fall', colors: [], size: 1 },
  popup: { title: 'Demo Alert', message: 'ChaosToggle demo popup. This is a visual effect only.', confirmText: 'Keep going', tone: 'neutral' },
  sound: { enabled: false, preset: null },
  timing: { durationMultiplier: 1, cooldownMultiplier: 1, pattern: 'default' },
  triggers: {},
  overlay: { type: 'none', opacity: 0.18 },
  decorations: { hints: false },
  behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
};

export const DEFAULT_SETTINGS: ChaosSettings = {
  autoInit: false,
  enabled: true,
  safeMode: true,
  debug: false,
  scopeSelector: 'body',
  cooldownMs: 150,
  randomSeed: null,
  theme: 'default',
  themeOverrides: {},
  themeParts: {
    visual: true, effects: true, animation: true, particles: true, popup: true,
    sound: true, timing: true, triggers: true, overlay: true, decorations: true, behavior: true,
  },
  duration: 1800,
  intensity: 0.6,
  probability: 1,
  shortcutsEnabled: true,
  popup: { title: 'Demo Alert', message: 'ChaosToggle demo popup. This is a visual effect only.', confirmText: 'Keep going' },
  effects: {
    shake: true, glitchOverlay: true, popups: true, confetti: true, flashOverlay: true,
    textScramble: true, fakeErrorState: true, noise: true, zoomFlicker: true,
  },
  triggers: { onLoad: false, onClickSelector: null },
  shortcuts: {
    'Shift+H': 'trigger',
    'Shift+P': 'runMode:panic',
    'Shift+R': 'reset',
    'Shift+C': 'runMode:celebration',
  },
  modes: {},
};

export const PRESET_MODES: Record<string, ModeConfig> = {
  subtle: { intensity: 0.25, duration: 900, effects: { shake: true, glitchOverlay: false, confetti: false, flashOverlay: false, textScramble: true, noise: false, zoomFlicker: false, popups: false, fakeErrorState: false } },
  demo: { intensity: 0.5, duration: 1500, effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: false, popups: true, fakeErrorState: false } },
  chaos: { intensity: 0.75, duration: 2200, effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } },
  nuclear: { intensity: 1, duration: 3200, effects: { shake: true, glitchOverlay: true, confetti: true, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } },
  celebration: { intensity: 0.6, duration: 2200, effects: { shake: false, glitchOverlay: false, confetti: true, flashOverlay: false, textScramble: false, noise: false, zoomFlicker: false, popups: true, fakeErrorState: false } },
  glitch: { intensity: 0.65, duration: 1800, effects: { shake: false, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: false, fakeErrorState: false } },
  panic: { intensity: 0.85, duration: 2600, effects: { shake: true, glitchOverlay: true, confetti: false, flashOverlay: true, textScramble: true, noise: true, zoomFlicker: true, popups: true, fakeErrorState: true } },
};
