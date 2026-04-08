import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChaosToggle } from '../src/index';
import type { ChaosEffect, ChaosPlugin, CompositionStep } from '../src/index';
import { DEFAULT_SETTINGS } from '../src/core/defaults';

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
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ChaosToggle API', () => {
  it('exposes expected methods and version', () => {
    expect(ChaosToggle.version).toBe('1.1.0');
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
