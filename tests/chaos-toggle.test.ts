import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChaosToggle } from '../src/index';
import type { ChaosEffect, ChaosPlugin, CompositionStep } from '../src/index';
import { DEFAULT_SETTINGS } from '../src/core/defaults';
import { ChaosToggleEngine } from '../src/core/engine';

/* jsdom has no Web Animations API; several effects call element.animate() */
if (typeof Element.prototype.animate !== 'function') {
  Element.prototype.animate = function animatePolyfill() {
    return {
      cancel: () => {},
      finish: () => {},
      pause: () => {},
      play: () => {},
      reverse: () => {},
      updatePlaybackRate: () => {},
      persist: () => {},
      commitStyles: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      onfinish: null,
      oncancel: null,
      onremove: null,
      ready: Promise.resolve(),
      finished: Promise.resolve(),
    } as unknown as Animation;
  };
}

HTMLCanvasElement.prototype.getContext = function getContextPolyfill() {
  return {
    scale: () => {},
    setTransform: () => {},
    fillRect: () => {},
    fillText: () => {},
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    save: () => {},
    restore: () => {},
    measureText: () => ({ width: 0 }),
    fillStyle: '',
    shadowColor: '',
    shadowBlur: 0,
    font: '',
  } as unknown as CanvasRenderingContext2D;
};

const testEffect: ChaosEffect = {
  id: 'test-plugin-effect',
  name: 'Test Plugin Effect',
  description: 'Used only in tests',
  category: 'overlay',
  apply: () => {},
};

beforeEach(() => {
  ChaosToggle.destroy();
  // Singleton engine retains merged settings after destroy(); restore defaults for isolated assertions.
  ChaosToggle.updateSettings(structuredClone(DEFAULT_SETTINGS));
  window.localStorage?.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage?.clear();
});

async function waitFor(predicate: () => boolean, timeoutMs = 400): Promise<boolean> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) return true;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return false;
}

describe('ChaosToggle API', () => {
  it('exposes expected methods and version', () => {
    expect(ChaosToggle.version).toBe('1.3.2');
    for (const key of [
      'init',
      'trigger',
      'reset',
      'destroy',
      'updateSettings',
      'enable',
      'disable',
      'getSettings',
      'setTheme',
      'getTheme',
      'listThemes',
      'registerTheme',
      'removeTheme',
      'runTheme',
      'buildTheme',
      'registerShortcut',
      'unregisterShortcut',
      'runMode',
      'listModes',
      'registerEffect',
      'removeEffect',
      'listEffects',
      'getEffectMeta',
      'describeEffects',
      'runEffect',
      'compose',
      'runComposition',
      'on',
      'off',
      'use',
      'openPanel',
      'closePanel',
      'togglePanel',
    ] as const) {
      expect(typeof (ChaosToggle as Record<string, unknown>)[key]).toBe('function');
    }
  });
});

describe('init()', () => {
  it('installs styles and shortcuts once; second call is idempotent', () => {
    ChaosToggle.init();
    const stylesAfterFirst = document.querySelectorAll('style[data-chaos-toggle="styles"]');
    expect(stylesAfterFirst.length).toBe(1);

    ChaosToggle.init();
    const stylesAfterSecond = document.querySelectorAll('style[data-chaos-toggle="styles"]');
    expect(stylesAfterSecond.length).toBe(1);
  });

  it('returns the API for chaining', () => {
    expect(ChaosToggle.init()).toBe(ChaosToggle);
  });
});

describe('getSettings()', () => {
  it('returns defaults aligned with DEFAULT_SETTINGS', () => {
    const s = ChaosToggle.getSettings();
    expect(s.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(s.policy).toBe(DEFAULT_SETTINGS.policy);
    expect(s.cooldownMs).toBe(DEFAULT_SETTINGS.cooldownMs);
    expect(s.intensity).toBe(DEFAULT_SETTINGS.intensity);
    expect(s.probability).toBe(DEFAULT_SETTINGS.probability);
    expect(s.scopeSelector).toBe(DEFAULT_SETTINGS.scopeSelector);
    expect(s.enabled).toBe(DEFAULT_SETTINGS.enabled);
    expect(s.effects).toEqual(expect.objectContaining(DEFAULT_SETTINGS.effects));
  });

  it('returns a copy; mutating it does not change internal state', () => {
    const a = ChaosToggle.getSettings();
    (a as { intensity: number }).intensity = 0.01;
    expect(ChaosToggle.getSettings().intensity).toBe(DEFAULT_SETTINGS.intensity);
  });
});

describe('updateSettings()', () => {
  it('deep-merges partial config without dropping sibling keys', () => {
    ChaosToggle.updateSettings({ intensity: 0.42, cooldownMs: 300 });
    const s = ChaosToggle.getSettings();
    expect(s.intensity).toBe(0.42);
    expect(s.cooldownMs).toBe(300);
    expect(s.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(s.effects.shake).toBe(DEFAULT_SETTINGS.effects.shake);
  });

  it('clamps intensity, probability, duration, and cooldownMs', () => {
    ChaosToggle.updateSettings({
      intensity: 99,
      probability: -1,
      duration: 10,
      cooldownMs: 999999,
    });
    const s = ChaosToggle.getSettings();
    expect(s.intensity).toBe(1);
    expect(s.probability).toBe(0);
    expect(s.duration).toBe(250);
    expect(s.cooldownMs).toBe(60000);
  });
});

describe('enable() / disable()', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('disable prevents trigger; enable restores it', () => {
    ChaosToggle.disable();
    expect(ChaosToggle.trigger()).toBe(false);

    ChaosToggle.enable();
    expect(ChaosToggle.trigger()).toBe(true);
  });

  it('disable clears active chaos via reset()', () => {
    ChaosToggle.trigger();
    expect(document.body.querySelector('.ct-layer')).toBeTruthy();
    ChaosToggle.disable();
    expect(document.body.querySelector('.ct-layer')).toBeNull();
  });
});

describe('Theme management', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('registerTheme, listThemes, setTheme, getTheme, and removeTheme behave correctly', () => {
    ChaosToggle.registerTheme('test-theme-alpha', {
      visual: { palette: { primary: '#111111', accent: '#222222', background: '#333333', text: '#444444' } },
    });
    expect(ChaosToggle.listThemes()).toContain('test-theme-alpha');

    const ok = ChaosToggle.setTheme('test-theme-alpha');
    expect(ok).toBe(true);
    const { name, config } = ChaosToggle.getTheme();
    expect(name).toBe('test-theme-alpha');
    expect(config.visual.palette.primary).toBe('#111111');

    const removed = ChaosToggle.removeTheme('test-theme-alpha');
    expect(removed).toBe(true);
    expect(ChaosToggle.listThemes()).not.toContain('test-theme-alpha');
  });

  it('setTheme returns false for unknown theme', () => {
    expect(ChaosToggle.setTheme('no-such-theme-xyz')).toBe(false);
  });

  it('cannot remove default theme', () => {
    expect(ChaosToggle.removeTheme('default')).toBe(false);
  });

  it('runTheme returns false for unknown theme', () => {
    expect(ChaosToggle.runTheme('unknown-theme-xyz')).toBe(false);
  });
});

describe('Theme-aware particles and popups', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, duration: 2000 });
  });

  function confettiMetaText(): string {
    return document.querySelector('.ct-confetti-meta')?.textContent || '';
  }

  it('confetti mounts a viewport canvas host', () => {
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(document.querySelector('.ct-confetti-field')).not.toBeNull();
    expect(document.querySelector('.ct-confetti-canvas')).not.toBeNull();
  });

  it('4th-of-july confetti includes patriotic emoji accents', () => {
    ChaosToggle.setTheme('4th-of-july');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🇺🇸|⭐/);
  });

  it('easter particles include chicks or eggs', () => {
    ChaosToggle.setTheme('easter');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🐥|🥚/);
  });

  it('birthday particles include balloons', () => {
    ChaosToggle.setTheme('birthday');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toContain('🎈');
  });

  it('christmas particles include seasonal icons', () => {
    ChaosToggle.setTheme('christmas');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/❄️|🎁|⭐/);
  });

  it('halloween particles include spooky icons', () => {
    ChaosToggle.setTheme('halloween');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🎃|🦇|👻/);
  });

  it('valentines-day particles include hearts or roses', () => {
    ChaosToggle.setTheme('valentines-day');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/💖|💕|🌹/);
  });

  it('thanksgiving particles include autumn icons', () => {
    ChaosToggle.setTheme('thanksgiving');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🍂|🍁|🦃/);
  });

  it('office particles include office clutter icons', () => {
    ChaosToggle.setTheme('office');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/📎|📄|☕/);
  });

  it('hacker particles include terminal-like glyphs', () => {
    ChaosToggle.setTheme('hacker');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/0|1|>_/);
  });

  it('retro particles include broadcast-era icons', () => {
    ChaosToggle.setTheme('retro');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/📼|📺|✦/);
  });

  it('apocalypse particles include destructive icons', () => {
    ChaosToggle.setTheme('apocalypse');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🔥|☠|💥/);
  });

  it('drunk particles include drink or bubble icons', () => {
    ChaosToggle.setTheme('drunk');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/🍺|🍸|🫧/);
  });

  it('jumpscare particles include danger icons', () => {
    ChaosToggle.setTheme('jumpscare');
    expect(ChaosToggle.runEffect('confetti')).toBe(true);
    expect(confettiMetaText()).toMatch(/☠|✖/);
  });

  it('popups use the active theme copy and button label', () => {
    ChaosToggle.setTheme('birthday');
    expect(ChaosToggle.runEffect('popups')).toBe(true);

    const popup = document.querySelector('.ct-popup');
    expect(popup?.querySelector('h4')?.textContent).toBe('Level Up');
    expect(popup?.querySelector('p')?.textContent).toContain('Balloons are up');
    expect(popup?.querySelector('button')?.textContent).toBe('Party on');
  });

  it('christmas popup uses seasonal copy and button label', () => {
    ChaosToggle.setTheme('christmas');
    expect(ChaosToggle.runEffect('popups')).toBe(true);

    const popup = document.querySelector('.ct-popup');
    expect(popup?.querySelector('h4')?.textContent).toBe('Holiday Theme');
    expect(popup?.querySelector('p')?.textContent).toContain('Snow, gifts, and stars');
    expect(popup?.querySelector('button')?.textContent).toBe('Open gift');
  });

  it('office popup uses office-themed copy and button label', () => {
    ChaosToggle.setTheme('office');
    expect(ChaosToggle.runEffect('popups')).toBe(true);

    const popup = document.querySelector('.ct-popup');
    expect(popup?.querySelector('h4')?.textContent).toBe('IT Department');
    expect(popup?.querySelector('p')?.textContent).toContain('Paperwork, coffee, and emergency support tickets');
    expect(popup?.querySelector('button')?.textContent).toBe('Call support');
  });
});

describe('Theme signature effects', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, duration: 2000 });
  });

  it('easter runTheme adds the spring parade signature effect', () => {
    expect(ChaosToggle.runTheme('easter')).toBe(true);

    const parade = document.querySelector('.ct-spring-parade');
    expect(parade).toBeTruthy();
    expect(parade?.textContent || '').toMatch(/🐥|🐣|🥚/);
  });

  it('4th-of-july runTheme adds the patriotic banner signature effect', () => {
    expect(ChaosToggle.runTheme('4th-of-july')).toBe(true);

    const banner = document.querySelector('.ct-star-spangled-banner');
    expect(banner).toBeTruthy();
    expect(banner?.textContent || '').toMatch(/🇺🇸|★|✦/);
  });

  it('hacker runTheme adds the HUD signature effect', () => {
    expect(ChaosToggle.runTheme('hacker')).toBe(true);

    const hud = document.querySelector('.ct-hacker-hud');
    expect(hud).toBeTruthy();
    expect(hud?.textContent || '').toContain('TARGET LOCK');
    expect(hud?.textContent || '').toContain('TRACE ROUTE');
  });

  it('christmas runTheme adds the holiday lights signature effect', () => {
    expect(ChaosToggle.runTheme('christmas')).toBe(true);

    const lights = document.querySelector('.ct-holiday-lights');
    expect(lights).toBeTruthy();
    expect(lights?.textContent || '').toMatch(/🔔|⭐|🎁/);
  });

  it('new-year runTheme adds the midnight burst signature effect', () => {
    expect(ChaosToggle.runTheme('new-year')).toBe(true);

    const burst = document.querySelector('.ct-midnight-burst');
    expect(burst).toBeTruthy();
    expect(burst?.textContent || '').toContain('00:00');
    expect(burst?.textContent || '').toContain('Happy New Year');
  });

  it('halloween runTheme adds the haunted eyes signature effect', () => {
    expect(ChaosToggle.runTheme('halloween')).toBe(true);

    const eyes = document.querySelector('.ct-haunted-eyes');
    expect(eyes).toBeTruthy();
    expect(eyes?.querySelectorAll('.ct-haunted-eyes__pair').length).toBeGreaterThan(0);
  });

  it('thanksgiving runTheme adds the harvest table signature effect', () => {
    expect(ChaosToggle.runTheme('thanksgiving')).toBe(true);

    const table = document.querySelector('.ct-harvest-table');
    expect(table).toBeTruthy();
    expect(table?.textContent || '').toContain('Pass Pie');
    expect(table?.textContent || '').toMatch(/🥧|🦃|🍁/);
  });

  it('black-friday runTheme adds the doorbuster marquee signature effect', () => {
    expect(ChaosToggle.runTheme('black-friday')).toBe(true);

    const marquee = document.querySelector('.ct-doorbuster-marquee');
    expect(marquee).toBeTruthy();
    expect(marquee?.textContent || '').toContain('Doorbuster');
    expect(marquee?.textContent || '').toContain('-70%');
  });

  it('cyber-monday runTheme adds the protocol grid signature effect', () => {
    expect(ChaosToggle.runTheme('cyber-monday')).toBe(true);

    const grid = document.querySelector('.ct-protocol-grid');
    expect(grid).toBeTruthy();
    expect(grid?.textContent || '').toContain('Checkout Live');
    expect(grid?.textContent || '').toContain('Sync OK');
  });

  it('valentines-day runTheme adds the love letters signature effect', () => {
    expect(ChaosToggle.runTheme('valentines-day')).toBe(true);

    const letters = document.querySelector('.ct-love-letters');
    expect(letters).toBeTruthy();
    expect(letters?.textContent || '').toContain('Be Mine');
    expect(letters?.textContent || '').toMatch(/💌|💖|🌹/);
  });

  it('retro runTheme adds the broadcast overlay signature effect', () => {
    expect(ChaosToggle.runTheme('retro')).toBe(true);

    const broadcast = document.querySelector('.ct-retro-broadcast');
    expect(broadcast).toBeTruthy();
    expect(broadcast?.textContent || '').toContain('REC');
    expect(broadcast?.textContent || '').toMatch(/TRACKING|PLAY/);
  });

  it('birthday runTheme adds the party balloons signature effect', () => {
    expect(ChaosToggle.runTheme('birthday')).toBe(true);

    const balloons = document.querySelector('.ct-party-balloons');
    expect(balloons).toBeTruthy();
    expect(balloons?.textContent || '').toContain('Happy Birthday');
    expect(balloons?.textContent || '').toMatch(/🎈|🎉|🎂/);
  });

  it('office runTheme adds the sticky notes signature effect', () => {
    expect(ChaosToggle.runTheme('office')).toBe(true);

    const notes = document.querySelector('.ct-office-sticky-notes');
    expect(notes).toBeTruthy();
    expect(notes?.textContent || '').toContain('TPS REPORT');
    expect(notes?.textContent || '').toContain('☕');
  });

  it('apocalypse runTheme adds the evacuation tape signature effect', () => {
    expect(ChaosToggle.runTheme('apocalypse')).toBe(true);

    const tape = document.querySelector('.ct-evacuation-tape');
    expect(tape).toBeTruthy();
    expect(tape?.textContent || '').toContain('EVACUATE');
    expect(tape?.textContent || '').toContain('Critical Failure');
  });

  it('drunk runTheme adds the last call signature effect', () => {
    expect(ChaosToggle.runTheme('drunk')).toBe(true);

    const lastCall = document.querySelector('.ct-last-call');
    expect(lastCall).toBeTruthy();
    expect(lastCall?.textContent || '').toContain('Last Call');
    expect(lastCall?.textContent || '').toMatch(/🍺|🍸|🥃/);
  });

  it('jumpscare runTheme adds the panic alarm signature effect', () => {
    expect(ChaosToggle.runTheme('jumpscare')).toBe(true);

    const panic = document.querySelector('.ct-panic-alarm');
    expect(panic).toBeTruthy();
    expect(panic?.textContent || '').toContain('Alarm');
    expect(panic?.textContent || '').toContain('NOPE');
  });
});

describe('buildTheme() fluent API', () => {
  it('chains builders and register() adds the theme', () => {
    ChaosToggle.buildTheme('fluent-test')
      .palette('#a', '#b', '#c', '#d')
      .effects('shake', 'noise')
      .timing({ durationMultiplier: 1.2 })
      .register();

    expect(ChaosToggle.listThemes()).toContain('fluent-test');
    ChaosToggle.setTheme('fluent-test');
    const { config } = ChaosToggle.getTheme();
    expect(config.effects?.shake).toBe(true);
    expect(config.effects?.noise).toBe(true);
    expect(config.timing?.durationMultiplier).toBe(1.2);
  });
});

describe('Mode management', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('listModes includes preset modes', () => {
    const modes = ChaosToggle.listModes();
    expect(modes).toEqual(expect.arrayContaining(['panic', 'celebration', 'chaos', 'subtle']));
  });

  it('runMode applies mode and returns boolean from trigger', () => {
    const ran = ChaosToggle.runMode('celebration');
    expect(typeof ran).toBe('boolean');
    expect(ran).toBe(true);
  });

  it('runMode returns false for unknown mode', () => {
    expect(ChaosToggle.runMode('unknown-mode-xyz')).toBe(false);
  });
});

describe('Effect registry', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('registerEffect, listEffects, and removeEffect', () => {
    const before = ChaosToggle.listEffects().length;
    ChaosToggle.registerEffect(testEffect);
    expect(ChaosToggle.listEffects()).toContain('test-plugin-effect');
    expect(ChaosToggle.listEffects().length).toBe(before + 1);

    const removed = ChaosToggle.removeEffect('test-plugin-effect');
    expect(removed).toBe(true);
    expect(ChaosToggle.listEffects()).not.toContain('test-plugin-effect');
  });

  it('removeEffect returns false for missing id', () => {
    expect(ChaosToggle.removeEffect('definitely-missing-effect')).toBe(false);
  });

  it('exposes effect metadata for registered effects', () => {
    ChaosToggle.registerEffect(testEffect);

    expect(ChaosToggle.getEffectMeta('test-plugin-effect')).toEqual({
      id: 'test-plugin-effect',
      name: 'Test Plugin Effect',
      description: 'Used only in tests',
      category: 'overlay',
    });

    expect(ChaosToggle.describeEffects()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-plugin-effect',
          category: 'overlay',
        }),
      ]),
    );
  });

  it('includes realityTear in metadata and renders its overlay structure', () => {
    expect(ChaosToggle.getEffectMeta('realityTear')).toEqual({
      id: 'realityTear',
      name: 'Reality tear',
      description: 'The page splits into drifting slabs while a dark rift opens through the center.',
      category: 'overlay',
    });

    expect(ChaosToggle.runEffect('realityTear')).toBe(true);
    expect(document.querySelector('.ct-reality-tear')).toBeTruthy();
    expect(document.querySelector('.ct-reality-tear__rift')).toBeTruthy();
    expect(document.querySelectorAll('.ct-reality-tear__segment')).toHaveLength(4);
  });
});

describe('compose() / runComposition()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs scheduled effect steps and returns true', () => {
    const steps: CompositionStep[] = [
      { effect: 'shake', delay: 0 },
      { effect: 'noise', delay: 50 },
    ];
    ChaosToggle.compose('seq-a', steps);

    const starts: string[] = [];
    ChaosToggle.on('effectStart', (...args: unknown[]) => {
      starts.push(String(args[0]));
    });

    expect(ChaosToggle.runComposition('seq-a')).toBe(true);
    vi.runAllTimers();

    expect(starts).toContain('shake');
    expect(starts).toContain('noise');
  });

  it('runComposition returns false for unknown composition name', () => {
    expect(ChaosToggle.runComposition('no-composition')).toBe(false);
  });
});

describe('Plugin system (use)', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('registers plugin effects and themes and runs install hook', () => {
    const install = vi.fn();
    const plugin: ChaosPlugin = {
      id: 'p1',
      name: 'Test Plugin',
      version: '0.0.1',
      effects: [testEffect],
      themes: [{ id: 'plugin-theme-1', config: { behavior: { pulse: true } } }],
      install,
    };

    ChaosToggle.use(plugin);

    expect(install).toHaveBeenCalledTimes(1);
    expect(ChaosToggle.listEffects()).toContain('test-plugin-effect');
    expect(ChaosToggle.listThemes()).toContain('plugin-theme-1');
    ChaosToggle.setTheme('plugin-theme-1');
    expect(ChaosToggle.getTheme().config.behavior?.pulse).toBe(true);
  });
});

describe('Event system (on / off)', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('emits beforeTrigger and afterTrigger around a successful trigger', () => {
    const before = vi.fn();
    const after = vi.fn();
    ChaosToggle.on('beforeTrigger', before);
    ChaosToggle.on('afterTrigger', after);

    ChaosToggle.trigger();

    expect(before).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(1);

    ChaosToggle.off('beforeTrigger', before);
    ChaosToggle.off('afterTrigger', after);

    ChaosToggle.trigger();
    expect(before).toHaveBeenCalledTimes(1);
    expect(after).toHaveBeenCalledTimes(1);
  });
});

describe('trigger() enabled state and cooldown', () => {
  it('returns false when disabled even with probability 1', () => {
    ChaosToggle.init({ probability: 1, cooldownMs: 0 });
    ChaosToggle.disable();
    expect(ChaosToggle.trigger()).toBe(false);
  });

  it('respects cooldown between triggers (fixed Date.now)', () => {
    // Must exceed any real _lastTriggerAt left over from other tests (destroy() does not reset it).
    let now = 9_000_000_000_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);

    ChaosToggle.init({ cooldownMs: 200, probability: 1 });

    expect(ChaosToggle.trigger()).toBe(true);
    now += 100;
    expect(ChaosToggle.trigger()).toBe(false);
    now += 150;
    expect(ChaosToggle.trigger()).toBe(true);
  });

  it('honors probability: skips effect run when random is above threshold', () => {
    // Stay ahead of _lastTriggerAt left by the cooldown test (9e15 + steps) and any other triggers.
    let t = 50_000_000_000_000_000;
    vi.spyOn(Date, 'now').mockImplementation(() => t);

    ChaosToggle.init({ cooldownMs: 0, probability: 0.5 });
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(ChaosToggle.trigger()).toBe(false);
    t += 1;
    vi.mocked(Math.random).mockReturnValue(0.1);
    expect(ChaosToggle.trigger()).toBe(true);
  });
});

describe('Runtime completeness', () => {
  it('autoInit boots a fresh engine when enabled through settings', () => {
    const engine = new ChaosToggleEngine();
    engine.updateSettings({ autoInit: true, shortcutsEnabled: false });

    expect(document.querySelector('style[data-chaos-toggle="styles"]')).toBeTruthy();

    engine.destroy();
  });

  it('safe policy blocks prank effects but keeps safe signature layers', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'safe' });

    expect(ChaosToggle.runTheme('office')).toBe(true);
    expect(document.querySelector('.ct-bsod')).toBeNull();
    expect(document.querySelector('.ct-office-sticky-notes')).toBeTruthy();
    expect(ChaosToggle.getSettings().safeMode).toBe(true);
  });

  it('demo policy allows visual pranks but blocks interaction disruption', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runTheme('office')).toBe(true);
    expect(document.querySelector('.ct-bsod')).toBeTruthy();
    expect(document.querySelector('.ct-office-sticky-notes')).toBeTruthy();

    ChaosToggle.reset();
    expect(ChaosToggle.runTheme('drunk')).toBe(true);
    expect(document.body.classList.contains('ct-drunk')).toBe(false);
    expect(document.querySelector('.ct-last-call')).toBeTruthy();
  });

  it('prank policy allows full interaction disruption', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'prank' });

    expect(ChaosToggle.runTheme('drunk')).toBe(true);
    expect(document.body.classList.contains('ct-drunk')).toBe(true);
    expect(document.querySelector('.ct-last-call')).toBeTruthy();
    expect(ChaosToggle.getSettings().safeMode).toBe(false);
  });

  it('policy also applies to direct runEffect calls', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });
    expect(ChaosToggle.runEffect('drunkMode')).toBe(false);
    expect(ChaosToggle.runEffect('bsod')).toBe(true);

    ChaosToggle.reset();
    ChaosToggle.updateSettings({ policy: 'safe' });
    expect(ChaosToggle.runEffect('bsod')).toBe(false);
  });

  it('celebration mode uses party overlays instead of generic demo popups', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'safe' });

    expect(ChaosToggle.runMode('celebration')).toBe(true);
    expect(document.querySelector('.ct-party-balloons')).toBeTruthy();
    expect(document.querySelector('.ct-popup')).toBeNull();
  });

  it('panic and nuclear modes now have distinct flagship layers', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runMode('panic')).toBe(true);
    expect(document.querySelector('.ct-panic-alarm')).toBeTruthy();
    expect(document.querySelector('.ct-reality-tear')).toBeNull();

    ChaosToggle.reset();

    expect(ChaosToggle.runMode('nuclear')).toBe(true);
    expect(document.querySelector('.ct-panic-alarm')).toBeTruthy();
    expect(document.querySelector('.ct-reality-tear')).toBeTruthy();
  });

  it('bsod v2 renders staged diagnostics and progress chrome', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runEffect('bsod')).toBe(true);
    expect(document.querySelector('.ct-bsod')).toBeTruthy();
    expect(document.querySelector('.ct-bsod__scanlines')).toBeTruthy();
    expect(document.querySelector('.ct-bsod__phase')?.textContent).toBe('Collecting crash data');
    expect(document.querySelector('.ct-bsod__bar')).toBeTruthy();
    expect(document.querySelectorAll('.ct-bsod__dump-line')).toHaveLength(3);
  });

  it('fakeUpdate v2 renders staged update chrome', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runEffect('fakeUpdate')).toBe(true);
    expect(document.querySelector('.ct-fake-update')).toBeTruthy();
    expect(document.querySelector('.ct-fake-update__spinner')).toBeTruthy();
    expect(document.querySelector('.ct-fake-update__track')).toBeTruthy();
    expect(document.querySelector('.ct-fake-update__stage')?.textContent).toBe('Stage 1 of 4 · Downloading cumulative update');
    expect(document.querySelectorAll('.ct-fake-update__timeline-step')).toHaveLength(4);
  });

  it('matrixRain v2 renders canvas with cinematic overlay chrome', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runEffect('matrixRain')).toBe(true);
    expect(document.querySelector('.ct-matrix-rain')).toBeTruthy();
    expect(document.querySelector('.ct-matrix-canvas')).toBeTruthy();
    expect(document.querySelector('.ct-matrix-rain__hud')).toBeTruthy();
    expect(document.querySelector('.ct-matrix-rain__badge')?.textContent).toBe('LINK ACTIVE');
  });

  it('screenCrack v2 renders vector, impact, and debris layers', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, policy: 'demo' });

    expect(ChaosToggle.runEffect('screenCrack')).toBe(true);
    expect(document.querySelector('.ct-screen-crack')).toBeTruthy();
    expect(document.querySelector('.ct-screen-crack__impact')).toBeTruthy();
    expect(document.querySelector('.ct-screen-crack__vector')).toBeTruthy();
    expect(document.querySelectorAll('.ct-screen-crack__vector path').length).toBeGreaterThan(10);
    expect(document.querySelectorAll('.ct-screen-crack__vector polygon').length).toBeGreaterThan(4);
  });

  it('safeMode remains a compatibility alias for safe and prank policy', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, safeMode: true });
    expect(ChaosToggle.getSettings().policy).toBe('safe');

    ChaosToggle.updateSettings({ safeMode: false });
    expect(ChaosToggle.getSettings().policy).toBe('prank');

    ChaosToggle.updateSettings({ policy: 'demo' });
    expect(ChaosToggle.getSettings().safeMode).toBe(false);
  });

  it('randomSeed makes effect randomness repeatable across runs', () => {
    const seededEffect: ChaosEffect = {
      id: 'seeded-snapshot',
      name: 'Seeded Snapshot',
      description: 'Captures random output for seeded runs.',
      category: 'overlay',
      apply(ctx) {
        const node = document.createElement('div');
        node.className = 'ct-seeded-snapshot';
        node.textContent = `${Math.random().toFixed(6)}|${Math.random().toFixed(6)}|${ctx.random().toFixed(6)}`;
        ctx.addNode(node);
      },
    };

    ChaosToggle.init({ cooldownMs: 0, probability: 1, randomSeed: 'alpha-seed' });
    ChaosToggle.registerEffect(seededEffect);

    expect(ChaosToggle.runEffect('seeded-snapshot')).toBe(true);
    const first = document.querySelector('.ct-seeded-snapshot')?.textContent;

    ChaosToggle.reset();
    expect(ChaosToggle.runEffect('seeded-snapshot')).toBe(true);
    const second = document.querySelector('.ct-seeded-snapshot')?.textContent;

    ChaosToggle.reset();
    ChaosToggle.updateSettings({ randomSeed: 'beta-seed' });
    expect(ChaosToggle.runEffect('seeded-snapshot')).toBe(true);
    const third = document.querySelector('.ct-seeded-snapshot')?.textContent;

    expect(first).toBe(second);
    expect(third).not.toBe(first);

    ChaosToggle.removeEffect('seeded-snapshot');
  });

  it('drift behavior adds an ambient drift layer for themes that request it', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, duration: 1600 });

    expect(ChaosToggle.runTheme('christmas')).toBe(true);
    expect(document.querySelector('.ct-theme-drift-layer')).toBeTruthy();
  });

  it('countdown behavior adds a visible reset timer overlay', () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1, duration: 1600 });

    expect(ChaosToggle.runTheme('new-year')).toBe(true);

    const countdown = document.querySelector('.ct-theme-countdown');
    const value = document.querySelector('.ct-theme-countdown__value');
    expect(countdown).toBeTruthy();
    expect(value?.textContent).toMatch(/1s|2s/);
  });

  it('plays theme sound presets when AudioContext is available', () => {
    const OriginalAudioContext = (window as Window & typeof globalThis & { AudioContext?: unknown }).AudioContext;
    const start = vi.fn();
    const stop = vi.fn();
    const close = vi.fn().mockResolvedValue(undefined);
    const resume = vi.fn().mockResolvedValue(undefined);
    const instances: unknown[] = [];

    class FakeAudioContext {
      currentTime = 1;
      destination = {};

      constructor() {
        instances.push(this);
      }

      createOscillator(): OscillatorNode {
        return {
          connect: vi.fn(),
          disconnect: vi.fn(),
          frequency: { value: 0 } as AudioParam,
          detune: { value: 0 } as AudioParam,
          type: 'sine',
          start,
          stop,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          onended: null,
        } as unknown as OscillatorNode;
      }

      createGain(): GainNode {
        return {
          connect: vi.fn(),
          disconnect: vi.fn(),
          gain: {
            value: 0,
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          } as unknown as AudioParam,
        } as unknown as GainNode;
      }

      close = close;
      resume = resume;
    }

    Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeAudioContext });

    try {
      ChaosToggle.init({ cooldownMs: 0, probability: 1, duration: 1200 });
      expect(ChaosToggle.runTheme('christmas')).toBe(true);

      expect(instances.length).toBe(1);
      expect(resume).toHaveBeenCalledTimes(1);
      expect(start).toHaveBeenCalled();

      ChaosToggle.reset();
      expect(close).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(window, 'AudioContext', { configurable: true, value: OriginalAudioContext });
    }
  });

  it('emits panelOpen and panelClose around panel lifecycle', async () => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
    const onOpen = vi.fn();
    const onClose = vi.fn();
    ChaosToggle.on('panelOpen', onOpen);
    ChaosToggle.on('panelClose', onClose);

    ChaosToggle.openPanel();
    const panelOpened = await waitFor(() => !!document.querySelector('[data-chaos-panel]'));

    expect(panelOpened).toBe(true);
    expect(onOpen).toHaveBeenCalledTimes(1);

    ChaosToggle.closePanel();

    expect(document.querySelector('[data-chaos-panel]')).toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Control panel 2.0', () => {
  beforeEach(() => {
    ChaosToggle.init({ cooldownMs: 0, probability: 1 });
  });

  it('live-syncs settings, theme signatures, mode state, and effect filtering', async () => {
    ChaosToggle.openPanel();
    expect(await waitFor(() => !!document.querySelector('[data-chaos-panel]'))).toBe(true);

    const host = document.querySelector('[data-chaos-panel]') as HTMLElement;
    const shadow = host.shadowRoot!;
    const intensity = shadow.querySelector('[data-panel-slider="intensity"]') as HTMLInputElement;
    const demoPolicy = shadow.querySelector('[data-panel-policy="demo"]') as HTMLButtonElement;
    const prankPolicy = shadow.querySelector('[data-panel-policy="prank"]') as HTMLButtonElement;
    const textarea = shadow.querySelector('[data-panel-settings-json]') as HTMLTextAreaElement;

    expect(intensity.value).toBe(String(DEFAULT_SETTINGS.intensity));
    expect(shadow.querySelector('[data-panel-policy="safe"]')?.classList.contains('active')).toBe(true);

    ChaosToggle.updateSettings({ intensity: 0.25, policy: 'demo', randomSeed: 'panel-seed' });

    expect(intensity.value).toBe('0.25');
    expect(demoPolicy.classList.contains('active')).toBe(true);
    expect(textarea.value).toContain('"randomSeed": "panel-seed"');
    expect(shadow.querySelector('[data-panel-status-flags]')?.textContent).toContain('demo');

    prankPolicy.click();
    expect(ChaosToggle.getSettings().policy).toBe('prank');
    expect(prankPolicy.classList.contains('active')).toBe(true);

    ChaosToggle.setTheme('hacker');
    expect(shadow.querySelector('[data-panel-status-theme]')?.textContent).toBe('hacker');
    expect(shadow.querySelector('[data-signature-item="hackerHud"]')).toBeTruthy();

    ChaosToggle.runMode('panic');
    expect(shadow.querySelector('[data-panel-status-mode]')?.textContent).toBe('panic');

    const search = shadow.querySelector('[data-effect-search]') as HTMLInputElement;
    search.value = 'hacker';
    search.dispatchEvent(new Event('input', { bubbles: true }));

    expect(shadow.querySelector('[data-effect-item="hackerHud"]')).toBeTruthy();
    expect(shadow.querySelector('[data-effect-item="confetti"]')).toBeNull();

    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));

    const favorite = shadow.querySelector('[data-effect-favorite="hackerHud"]') as HTMLButtonElement;
    favorite.click();

    const favoritesFilter = shadow.querySelector('[data-effect-filter="favorites"]') as HTMLButtonElement;
    favoritesFilter.click();

    expect(shadow.querySelector('[data-effect-item="hackerHud"]')).toBeTruthy();
    expect(shadow.querySelector('[data-effect-item="confetti"]')).toBeNull();
  });
});
