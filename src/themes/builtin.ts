import type { ThemeProfile } from '../core/types';

export const BUILTIN_THEMES: Record<string, Partial<ThemeProfile>> = {
  default: {},

  easter: {
    visual: { className: 'ct-theme-easter', forceDark: false, palette: { primary: '#ffc8dd', accent: '#b8f2e6', background: '#fffaf3', text: '#4d4067' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: true, glitchOverlay: false, flashOverlay: false, noise: false, fakeErrorState: false, springParade: true },
    animation: { style: 'bounce', intensityMultiplier: 0.55, shakeStyle: 'wobble' },
    particles: { type: 'chicks', density: 0.38, emoji: null, emojiSet: ['🐥', '🥚'], mixWithConfetti: false, motion: 'hop', colors: ['#ffe066', '#ffd166', '#ffc8dd'], size: 1.45 },
    popup: { title: 'Spring Mode', message: 'Tiny chicks escaped and are bouncing across the page.', confirmText: 'Aww', tone: 'playful' },
    overlay: { type: 'gradient', opacity: 0.13, gradient: 'linear-gradient(130deg,rgba(255,200,221,.55),rgba(255,240,184,.45),rgba(184,242,230,.45))' },
    decorations: { hints: true },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  halloween: {
    visual: { className: 'ct-theme-halloween', forceDark: true, palette: { primary: '#ff8f1f', accent: '#8b5cf6', background: '#09070f', text: '#f8f4ef' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: true, glitchOverlay: true, noise: true, flashOverlay: true, confetti: true, popups: true, hauntedEyes: true },
    animation: { style: 'glitchy', intensityMultiplier: 0.9, shakeStyle: 'rumble' },
    particles: { type: 'ghosts', density: 0.42, emoji: null, emojiSet: ['🎃', '🦇', '👻'], mixWithConfetti: true, motion: 'fall', colors: ['#ff8f1f', '#8b5cf6', '#f8f4ef'], size: 1.15 },
    popup: { title: 'Eerie Signal', message: 'Pumpkins, bats, and ghosts are slipping out of the dark.', confirmText: 'Keep lights on', tone: 'eerie' },
    overlay: { type: 'fog', opacity: 0.25 },
    behavior: { microJumps: true, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  christmas: {
    visual: { className: 'ct-theme-christmas', forceDark: false, palette: { primary: '#d62839', accent: '#2a9d6f', background: '#10231f', text: '#fff8e5' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: false, flashOverlay: false, fakeErrorState: false, glitchOverlay: false, confetti: true, popups: true, holidayLights: true },
    animation: { style: 'smooth', intensityMultiplier: 0.5, shakeStyle: 'float' },
    particles: { type: 'snow', density: 0.72, emoji: null, emojiSet: ['❄️', '🎁', '⭐'], mixWithConfetti: true, motion: 'fall', colors: ['#d62839', '#2a9d6f', '#fff8e5'], size: 1.1 },
    popup: { title: 'Holiday Theme', message: 'Snow, gifts, and stars are drifting through the page.', confirmText: 'Open gift', tone: 'friendly' },
    sound: { enabled: true, preset: 'bells' },
    overlay: { type: 'glow', opacity: 0.16 },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: true, loopBursts: true, countdown: false },
  },

  'new-year': {
    visual: { className: 'ct-theme-new-year', forceDark: false, palette: { primary: '#ffef5a', accent: '#ff4fd8', background: '#0c1028', text: '#ffffff' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: true, flashOverlay: true, confetti: true, popups: true, midnightBurst: true },
    animation: { style: 'sharp', intensityMultiplier: 1, shakeStyle: 'default' },
    particles: { type: 'fireworks', density: 1.1, emoji: null, emojiSet: ['🎆', '✨'], mixWithConfetti: true, motion: 'burst', colors: ['#ffef5a', '#ff4fd8', '#ffffff'], size: 1.1 },
    popup: { title: 'New Year', message: 'New cycle initiated.', tone: 'energetic' },
    timing: { pattern: 'fast', durationMultiplier: 1.1, cooldownMultiplier: 1 },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: true },
  },

  '4th-of-july': {
    visual: { className: 'ct-theme-july4', forceDark: false, palette: { primary: '#f94144', accent: '#577590', background: '#0f172a', text: '#f8fafc' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: true, flashOverlay: true, confetti: true, starSpangledBanner: true },
    animation: { style: 'recoil', intensityMultiplier: 0.88, shakeStyle: 'default' },
    particles: { type: 'fireworks', density: 1.05, emoji: null, emojiSet: ['🇺🇸', '⭐'], mixWithConfetti: true, motion: 'burst', colors: ['#b22234', '#ffffff', '#3c3b6e'], size: 1.2 },
    popup: { title: 'Freedom Mode', message: 'Flags, stars, and fireworks are taking over the screen.', confirmText: 'USA', tone: 'bold' },
    overlay: { type: 'pulse', opacity: 0.21 },
    behavior: { microJumps: false, pulse: false, recoil: true, drift: false, loopBursts: true, countdown: false },
  },

  thanksgiving: {
    visual: { className: 'ct-theme-thanksgiving', forceDark: false, palette: { primary: '#bc6c25', accent: '#7f5539', background: '#2a1b14', text: '#f8eedf' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: false, glitchOverlay: false, flashOverlay: false, noise: false, confetti: true, popups: true, harvestTable: true },
    animation: { style: 'smooth', intensityMultiplier: 0.4, shakeStyle: 'default' },
    particles: { type: 'leaves', density: 0.48, emoji: null, emojiSet: ['🍂', '🍁', '🦃'], mixWithConfetti: true, motion: 'fall', colors: ['#bc6c25', '#dda15e', '#7f5539'], size: 1.08 },
    popup: { title: 'Harvest Mode', message: 'Autumn leaves are falling and the page smells suspiciously like pie.', confirmText: 'Pass pie', tone: 'reflective' },
    overlay: { type: 'cozy', opacity: 0.14 },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: true, loopBursts: true, countdown: false },
  },

  'black-friday': {
    visual: { className: 'ct-theme-black-friday', forceDark: true, palette: { primary: '#00f5d4', accent: '#f15bb5', background: '#050505', text: '#f8f8f8' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: true, glitchOverlay: true, flashOverlay: true, popups: true, doorbusterMarquee: true },
    animation: { style: 'flicker', intensityMultiplier: 0.95, shakeStyle: 'default' },
    particles: { type: 'minimal', density: 0.15, emoji: null, emojiSet: [], mixWithConfetti: false, motion: 'fall', colors: ['#00f5d4', '#f15bb5', '#ffffff'], size: 1 },
    popup: { title: 'Flash Event', message: 'Limited time overload.', tone: 'urgent' },
    timing: { pattern: 'fast', durationMultiplier: 0.85, cooldownMultiplier: 1 },
    behavior: { microJumps: true, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: true },
  },

  'cyber-monday': {
    visual: { className: 'ct-theme-cyber-monday', forceDark: true, palette: { primary: '#00bbf9', accent: '#00f5ff', background: '#040b18', text: '#dbf8ff' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: false, glitchOverlay: true, flashOverlay: true, noise: true, popups: true, protocolGrid: true },
    animation: { style: 'digital', intensityMultiplier: 0.74, shakeStyle: 'default' },
    particles: { type: 'minimal', density: 0.1, emoji: null, emojiSet: [], mixWithConfetti: false, motion: 'fall', colors: ['#00bbf9', '#00f5ff', '#dbf8ff'], size: 1 },
    popup: { title: 'Protocol', message: 'Protocol override detected.', tone: 'system' },
    overlay: { type: 'scanline', opacity: 0.22 },
    behavior: { microJumps: true, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  'valentines-day': {
    visual: { className: 'ct-theme-valentine', forceDark: false, palette: { primary: '#ff4d8d', accent: '#ff8fab', background: '#2b1123', text: '#fff3f7' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { shake: false, glitchOverlay: false, flashOverlay: false, fakeErrorState: false, confetti: true, popups: true, loveLetters: true },
    animation: { style: 'smooth', intensityMultiplier: 0.46, shakeStyle: 'default' },
    particles: { type: 'hearts', density: 0.44, emoji: null, emojiSet: ['💖', '💕', '🌹'], mixWithConfetti: false, motion: 'rise', colors: ['#ff4d8d', '#ff8fab', '#fff3f7'], size: 1.15 },
    popup: { title: 'Spark', message: 'Hearts and roses are floating up through the interface.', confirmText: 'Aww', tone: 'light' },
    overlay: { type: 'gradient', opacity: 0.16, gradient: 'radial-gradient(circle at 20% 10%,rgba(255,77,141,.28),rgba(255,143,171,.14),rgba(43,17,35,.16))' },
    behavior: { microJumps: false, pulse: true, recoil: false, drift: false, loopBursts: true, countdown: false },
  },

  birthday: {
    visual: { className: 'ct-theme-birthday', forceDark: false, palette: { primary: '#ffbe0b', accent: '#8338ec', background: '#1b1140', text: '#ffffff' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { confetti: true, popups: true, shake: false, flashOverlay: true, partyBalloons: true },
    animation: { style: 'party', intensityMultiplier: 0.78, shakeStyle: 'default' },
    particles: { type: 'balloons', density: 0.82, emoji: null, emojiSet: ['🎈', '🎉'], mixWithConfetti: true, motion: 'rise', colors: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'], size: 1.25 },
    popup: { title: 'Level Up', message: 'Balloons are up, confetti is flying, and the party just started.', confirmText: 'Party on', tone: 'celebratory' },
    timing: { pattern: 'cinematic', durationMultiplier: 1.2, cooldownMultiplier: 1 },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: true, countdown: false },
  },

  // --- NEW PRANK-ORIENTED THEMES ---

  office: {
    visual: { className: 'ct-theme-office', forceDark: false, palette: { primary: '#0078d7', accent: '#ffb900', background: '#f0f0f0', text: '#333333' }, fontFamily: '"Segoe UI",sans-serif' },
    effects: { bsod: true, fakeUpdate: true, clippy: true, delayedClicks: true, shake: false, confetti: true, popups: true, officeStickyNotes: true },
    animation: { style: 'default', intensityMultiplier: 0.7, shakeStyle: 'default' },
    particles: { type: 'minimal', density: 0.18, emoji: null, emojiSet: ['📎', '📄', '☕'], mixWithConfetti: true, motion: 'fall', colors: ['#0078d7', '#ffb900', '#f0f0f0'], size: 1.05 },
    popup: { title: 'IT Department', message: 'Paperwork, coffee, and emergency support tickets are now all over your screen.', confirmText: 'Call support', tone: 'serious' },
    timing: { durationMultiplier: 2, cooldownMultiplier: 1, pattern: 'default' },
    behavior: { microJumps: false, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  hacker: {
    visual: { className: 'ct-theme-hacker', forceDark: true, palette: { primary: '#00ff41', accent: '#0abdc6', background: '#0a0a0a', text: '#00ff41' }, fontFamily: '"Courier New",monospace' },
    effects: { matrixRain: true, fakeTerminal: true, glitchOverlay: true, textScramble: true, noise: true, confetti: true, popups: true, hackerHud: true },
    animation: { style: 'glitchy', intensityMultiplier: 0.85, shakeStyle: 'default' },
    particles: { type: 'minimal', density: 0.09, emoji: null, emojiSet: ['0', '1', '>_'], mixWithConfetti: false, motion: 'fall', colors: ['#00ff41', '#0abdc6'], size: 1.05 },
    popup: { title: 'ACCESS GRANTED', message: 'Terminal flood detected. Binary artifacts are dropping across the viewport.', confirmText: 'Trace route', tone: 'system' },
    overlay: { type: 'scanline', opacity: 0.2 },
    behavior: { microJumps: true, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  retro: {
    visual: { className: 'ct-theme-retro', forceDark: true, palette: { primary: '#ff6b35', accent: '#ffd166', background: '#1a1a2e', text: '#e0e0e0' }, fontFamily: '"Courier New",monospace' },
    effects: { vhsDistortion: true, crtShutdown: true, noise: true, glitchOverlay: true, confetti: true, popups: true, retroBroadcast: true },
    animation: { style: 'glitchy', intensityMultiplier: 0.8, shakeStyle: 'rumble' },
    particles: { type: 'minimal', density: 0.16, emoji: null, emojiSet: ['📼', '📺', '✦'], mixWithConfetti: true, motion: 'fall', colors: ['#ff6b35', '#ffd166', '#e0e0e0'], size: 1.08 },
    popup: { title: 'REWIND', message: 'Tape icons and broadcast shimmer are leaking through the signal.', confirmText: 'Adjust antenna', tone: 'retro' },
    overlay: { type: 'scanline', opacity: 0.3 },
    behavior: { microJumps: true, pulse: false, recoil: false, drift: false, loopBursts: false, countdown: false },
  },

  apocalypse: {
    visual: { className: 'ct-theme-apocalypse', forceDark: true, palette: { primary: '#ff2e2e', accent: '#ff8c00', background: '#0d0d0d', text: '#ffcccc' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { screenCrack: true, gravity: true, elementScatter: true, shake: true, fakeErrorState: true, flashOverlay: true, confetti: true, popups: true, evacuationTape: true },
    animation: { style: 'sharp', intensityMultiplier: 1, shakeStyle: 'rumble' },
    particles: { type: 'confetti', density: 0.88, emoji: null, emojiSet: ['🔥', '☠', '💥'], mixWithConfetti: true, motion: 'burst', colors: ['#ff2e2e', '#ff8c00', '#3b0a0a'], size: 1.2 },
    popup: { title: 'CRITICAL FAILURE', message: 'Ash, fire, and impact debris are erupting across the interface.', confirmText: 'Evacuate', tone: 'panic' },
    overlay: { type: 'gradient', opacity: 0.2, gradient: 'radial-gradient(circle,rgba(255,0,0,.2),rgba(0,0,0,.4))' },
    behavior: { microJumps: true, pulse: false, recoil: true, drift: false, loopBursts: true, countdown: false },
  },

  drunk: {
    visual: { className: 'ct-theme-drunk', forceDark: false, palette: { primary: '#a855f7', accent: '#ec4899', background: '#faf5ff', text: '#3b0764' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { drunkMode: true, cursorDrift: true, invertedScroll: true, zoomFlicker: true, confetti: true, popups: true, lastCall: true },
    animation: { style: 'smooth', intensityMultiplier: 0.65, shakeStyle: 'wobble' },
    particles: { type: 'minimal', density: 0.22, emoji: null, emojiSet: ['🍺', '🍸', '🫧'], mixWithConfetti: true, motion: 'rise', colors: ['#a855f7', '#ec4899', '#f9a8d4'], size: 1.15 },
    popup: { title: 'Woah...', message: 'Bubbles and drinks are floating upward while the whole page sways.', confirmText: 'Water please', tone: 'playful' },
    behavior: { microJumps: false, pulse: true, recoil: false, drift: true, loopBursts: true, countdown: false },
  },

  jumpscare: {
    visual: { className: 'ct-theme-jumpscare', forceDark: true, palette: { primary: '#ff0000', accent: '#ffffff', background: '#000000', text: '#ff0000' }, fontFamily: 'ui-sans-serif,system-ui' },
    effects: { screenCrack: true, flashOverlay: true, shake: true, fakeErrorState: true, confetti: true, popups: true, panicAlarm: true },
    animation: { style: 'sharp', intensityMultiplier: 1, shakeStyle: 'rumble' },
    particles: { type: 'minimal', density: 0.08, emoji: null, emojiSet: ['☠', '✖', '!'], mixWithConfetti: true, motion: 'burst', colors: ['#ff0000', '#ffffff', '#330000'], size: 1.15 },
    popup: { title: '!!!', message: 'Impact warning. The screen just snapped back.', confirmText: 'Run', tone: 'panic' },
    timing: { durationMultiplier: 0.5, cooldownMultiplier: 1, pattern: 'fast' },
    behavior: { microJumps: true, pulse: false, recoil: true, drift: false, loopBursts: false, countdown: false },
  },
};
