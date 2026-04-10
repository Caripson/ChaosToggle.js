import { ChaosToggleEngine } from './core/engine';
import { BUILTIN_THEMES } from './themes/builtin';
import { ALL_EFFECTS } from './effects/index';
import type {
  ChaosToggleAPI, ChaosSettings, ChaosEffect, ChaosPlugin,
  CompositionStep, ChaosEventName, ChaosEventHandler,
  ThemeProfile, ThemeBuilder, EffectContext, CleanupFn,
  EffectCategory, ChaosEffectMeta, ChaosPolicy, ThemePalette, ThemeVisual, ThemeAnimation,
  ThemeParticles, ThemePopup, ThemeSound, ThemeTiming,
  ThemeOverlay, ThemeDecorations, ThemeBehavior, ModeConfig,
} from './core/types';

const VERSION = '1.3.1';

const engine = new ChaosToggleEngine();

for (const [name, config] of Object.entries(BUILTIN_THEMES)) {
  engine.registerTheme(name, config);
}

for (const effect of ALL_EFFECTS) {
  engine.registerEffect(effect);
}

const api: ChaosToggleAPI = {
  get version() { return VERSION; },
  start: (config?) => { engine.init(config); return api; },
  init: (config?) => { engine.init(config); return api; },
  trigger: (modeEffects?) => engine.trigger(modeEffects),
  reset: () => { engine.reset(); return api; },
  destroy: () => { engine.destroy(); return api; },
  updateSettings: (config) => { engine.updateSettings(config); return api; },
  enable: () => { engine.enable(); return api; },
  disable: () => { engine.disable(); return api; },
  getSettings: () => engine.getSettings(),

  setTheme: (name) => engine.setTheme(name),
  getTheme: () => engine.getTheme(),
  listThemes: () => engine.listThemes(),
  registerTheme: (name, config) => { engine.registerTheme(name, config); return api; },
  removeTheme: (name) => engine.removeTheme(name),
  runTheme: (name) => engine.runTheme(name),
  buildTheme: (name) => engine.buildTheme(name),

  registerShortcut: (combo, action) => { engine.registerShortcut(combo, action); return api; },
  unregisterShortcut: (combo) => { engine.unregisterShortcut(combo); return api; },

  runMode: (name) => engine.runMode(name),
  listModes: () => engine.listModes(),

  registerEffect: (effect) => { engine.registerEffect(effect); return api; },
  removeEffect: (id) => engine.removeEffect(id),
  listEffects: () => engine.listEffects(),
  getEffectMeta: (id) => engine.getEffectMeta(id),
  describeEffects: () => engine.describeEffects(),
  runEffect: (id) => engine.runEffect(id),

  compose: (name, steps) => { engine.compose(name, steps); return api; },
  runComposition: (name) => engine.runComposition(name),

  on: (event, handler) => { engine.on(event, handler); return api; },
  off: (event, handler) => { engine.off(event, handler); return api; },

  use: (plugin) => { engine.use(plugin); return api; },

  openPanel: () => engine.openPanel(),
  closePanel: () => engine.closePanel(),
  togglePanel: () => engine.togglePanel(),
};

if (typeof window !== 'undefined') {
  const view = window as Window & typeof globalThis & {
    ChaosToggle?: ChaosToggleAPI;
    ChaosToggleConfig?: Partial<ChaosSettings>;
  };
  view.ChaosToggle = api;
  if (view.ChaosToggleConfig?.autoInit) {
    const boot = () => { engine.init(view.ChaosToggleConfig); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }
}

export default api;
export { api as ChaosToggle };
export type {
  ChaosToggleAPI, ChaosSettings, ChaosEffect, ChaosPlugin,
  CompositionStep, ChaosEventName, ChaosEventHandler,
  ThemeProfile, ThemeBuilder, EffectContext, CleanupFn,
  EffectCategory, ChaosEffectMeta, ChaosPolicy, ThemePalette, ThemeVisual, ThemeAnimation,
  ThemeParticles, ThemePopup, ThemeSound, ThemeTiming,
  ThemeOverlay, ThemeDecorations, ThemeBehavior, ModeConfig,
};
