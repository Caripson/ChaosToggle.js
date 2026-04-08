import type {
  ChaosSettings, ThemeProfile, ModeConfig, ChaosEffect,
  EffectContext, ChaosPlugin, CompositionStep,
  ChaosEventName, ChaosEventHandler, ChaosToggleAPI, ThemeBuilder,
  CleanupFn,
} from './types';
import { DEFAULT_THEME_PROFILE, DEFAULT_SETTINGS, PRESET_MODES } from './defaults';
import { deepMerge, clamp, createEl, pickEnabledSections } from './utils';
import { EventEmitter } from './event-emitter';
import { EffectRegistry } from './effect-registry';
import { ShortcutManager, type ShortcutAction } from './shortcut-manager';
import { BASE_CSS } from './styles';

export class ChaosToggleEngine {
  private _settings: ChaosSettings;
  private _modes: Record<string, ModeConfig>;
  private _themes: Record<string, Partial<ThemeProfile>>;
  private _themeState: ThemeProfile;
  private _effectRegistry = new EffectRegistry();
  private _shortcuts = new ShortcutManager();
  private _events = new EventEmitter();
  private _compositions = new Map<string, CompositionStep[]>();
  private _plugins: ChaosPlugin[] = [];
  private _destroyables: Array<() => void> = [];
  private _effectNodes: HTMLElement[] = [];
  private _effectCleanups: CleanupFn[] = [];
  private _activeTimers: number[] = [];
  private _resetTimer: number | null = null;
  private _activeVisualClass: string | null = null;
  private _lastTriggerAt = 0;
  private _enabled = true;
  private _initialized = false;
  private _styleNode: HTMLStyleElement | null = null;
  private _panelInstance: { destroy(): void } | null = null;

  constructor() {
    this._settings = deepMerge(DEFAULT_SETTINGS, {});
    this._modes = deepMerge(PRESET_MODES, {});
    this._themes = { default: {} };
    this._themeState = deepMerge(DEFAULT_THEME_PROFILE, {});
  }

  private _log(...args: unknown[]): void {
    if (!this._settings.debug) return;
    console.log('[ChaosToggle]', ...args);
  }

  private _maybe(): boolean {
    return Math.random() <= clamp(Number(this._settings.probability || 0), 0, 1);
  }

  scopeRoot(): HTMLElement {
    return (document.querySelector(this._settings.scopeSelector) as HTMLElement) || document.body;
  }

  private _installStyles(): void {
    if (this._styleNode) return;
    this._styleNode = createEl('style') as HTMLStyleElement;
    this._styleNode.setAttribute('data-chaos-toggle', 'styles');
    this._styleNode.textContent = BASE_CSS;
    document.head.appendChild(this._styleNode);
  }

  private _validateSettings(incoming: Partial<ChaosSettings>): Partial<ChaosSettings> {
    const valid = deepMerge({} as Record<string, unknown>, incoming as Record<string, unknown>) as Partial<ChaosSettings>;
    if (valid.intensity !== undefined) valid.intensity = clamp(Number(valid.intensity), 0, 1);
    if (valid.probability !== undefined) valid.probability = clamp(Number(valid.probability), 0, 1);
    if (valid.duration !== undefined) valid.duration = clamp(Number(valid.duration), 250, 120000);
    if (valid.cooldownMs !== undefined) valid.cooldownMs = clamp(Number(valid.cooldownMs), 0, 60000);
    return valid;
  }

  private _resolveTheme(): ThemeProfile {
    const activeName = this._settings.theme || 'default';
    const selected = this._themes[activeName] || this._themes.default || {};
    const fromTheme = deepMerge(DEFAULT_THEME_PROFILE, selected);
    const withOverrides = pickEnabledSections(
      fromTheme,
      this._settings.themeOverrides || {},
      this._settings.themeParts,
      DEFAULT_THEME_PROFILE,
    );
    this._themeState = withOverrides;
    return this._themeState;
  }

  private _themeDuration(): number {
    const base = clamp(Number(this._settings.duration || 0), 250, 120000);
    const multi = this._themeState.timing?.durationMultiplier ?? 1;
    return clamp(base * multi, 250, 120000);
  }

  private _scheduleReset(): void {
    if (this._resetTimer) clearTimeout(this._resetTimer);
    this._resetTimer = window.setTimeout(() => this.reset(), this._themeDuration());
  }

  addNode(node: HTMLElement): void {
    document.body.appendChild(node);
    this._effectNodes.push(node);
  }

  addTimer(id: number): void {
    this._activeTimers.push(id);
  }

  private _createEffectContext(): EffectContext {
    return {
      root: this.scopeRoot(),
      intensity: this._settings.intensity,
      duration: this._themeDuration(),
      palette: this._themeState.visual.palette,
      addNode: (node: HTMLElement) => this.addNode(node),
      addTimer: (id: number) => this.addTimer(id),
      log: (...args: unknown[]) => this._log(...args),
    };
  }

  private _applyThemeVisual(): void {
    const visual = this._themeState.visual || ({} as ThemeProfile['visual']);
    const root = this.scopeRoot();
    const palette = visual.palette || {};
    if (this._activeVisualClass && this._activeVisualClass !== visual.className) {
      root.classList.remove(this._activeVisualClass);
    }
    if (visual.className) root.classList.add(visual.className);
    this._activeVisualClass = visual.className || null;
    root.style.setProperty('--chaos-primary', palette.primary || '#ff4d6d');
    root.style.setProperty('--chaos-accent', palette.accent || '#00f5ff');
    root.style.setProperty('--chaos-bg', palette.background || '#111111');
    root.style.setProperty('--chaos-text', palette.text || '#f8f8f8');
    if (visual.fontFamily) root.style.fontFamily = visual.fontFamily;
    if (visual.forceDark) root.classList.add('ct-theme-dark');
    root.dataset.ctShakeStyle = String(this._themeState.animation?.shakeStyle ?? 'default');
  }

  private _applyThemeOverlay(): void {
    const overlay = this._themeState.overlay || {};
    if (!overlay.type || overlay.type === 'none') return;
    const styles: Partial<CSSStyleDeclaration> = { opacity: String(overlay.opacity || 0.18), mixBlendMode: 'screen' };
    const overlayMap: Record<string, string> = {
      gradient: overlay.gradient || '',
      fog: 'radial-gradient(circle at 20% 30%,rgba(255,255,255,.14),rgba(0,0,0,.2) 60%),linear-gradient(180deg,rgba(30,20,40,.4),rgba(0,0,0,.75))',
      scanline: 'repeating-linear-gradient(180deg,rgba(0,255,255,.12) 0 1px,transparent 1px 3px)',
      glow: 'radial-gradient(circle at 10% 10%,rgba(255,225,130,.45),transparent 55%)',
      pulse: 'linear-gradient(90deg,rgba(255,0,0,.15),rgba(255,255,255,.15),rgba(0,0,255,.15))',
      cozy: 'linear-gradient(120deg,rgba(188,108,37,.25),rgba(127,85,57,.22))',
    };
    styles.background = overlayMap[overlay.type] || 'linear-gradient(120deg,rgba(255,255,255,.08),rgba(255,255,255,.03))';
    const layer = createEl('div', 'ct-layer ct-theme-overlay', styles);
    this.addNode(layer);
  }

  private _applyDecorations(): void {
    if (!this._themeState.decorations?.hints) return;
    const hint = createEl('div', 'ct-theme-hint');
    hint.textContent = '🥚';
    this.addNode(hint);
  }

  private _applyBehavior(): void {
    const behavior = this._themeState.behavior || {};
    const root = this.scopeRoot();
    if (behavior.pulse) root.classList.add('ct-theme-pulse');
    if (behavior.recoil) root.classList.add('ct-theme-recoil');
    if (behavior.microJumps) {
      const hops = 2 + Math.round(Math.random() * 3);
      for (let i = 0; i < hops; i++) {
        this._activeTimers.push(window.setTimeout(() => {
          root.style.transform = `translate(${(Math.random() - 0.5) * 6}px,${(Math.random() - 0.5) * 6}px)`;
          this._activeTimers.push(window.setTimeout(() => { root.style.transform = ''; }, 80));
        }, 120 + i * 140));
      }
    }
    if (behavior.loopBursts) {
      const confettiEffect = this._effectRegistry.get('confetti');
      if (confettiEffect) {
        const loopId = window.setInterval(() => {
          confettiEffect.apply(this._createEffectContext());
        }, 900);
        this._activeTimers.push(loopId);
      }
    }
  }

  private _composeEffects(modeEffects?: Record<string, boolean>): Record<string, boolean> {
    const themeEffects = this._themeState.effects || {};
    let merged = deepMerge(this._settings.effects, themeEffects);
    if (modeEffects) merged = deepMerge(merged, modeEffects);
    return merged;
  }

  private _applyEffectSet(modeEffects?: Record<string, boolean>): void {
    const effects = this._composeEffects(modeEffects);
    this._applyThemeVisual();
    this._applyThemeOverlay();
    this._applyDecorations();
    this._applyBehavior();

    const ctx = this._createEffectContext();
    for (const [id, enabled] of Object.entries(effects)) {
      if (!enabled) continue;
      const effect = this._effectRegistry.get(id);
      if (!effect) continue;
      this._events.emit('effectStart', id, ctx);
      const cleanup = effect.apply(ctx);
      if (typeof cleanup === 'function') this._effectCleanups.push(cleanup);
      this._events.emit('effectEnd', id);
    }
  }

  private _clearEffects(): void {
    const root = this.scopeRoot();
    root.classList.remove('ct-zoom', 'ct-error', 'ct-theme-pulse', 'ct-theme-recoil', 'ct-theme-dark', 'ct-drunk', 'ct-screen-melt', 'ct-crt-shutdown');
    const shakeClasses = ['ct-shake', 'ct-shake-rumble', 'ct-shake-wobble', 'ct-shake-float'];
    for (const cls of shakeClasses) root.classList.remove(cls);
    if (this._activeVisualClass) root.classList.remove(this._activeVisualClass);
    this._activeVisualClass = null;
    root.style.transform = '';
    root.style.filter = '';
    root.style.cursor = '';
    delete root.dataset.ctShakeStyle;
    for (const cleanup of this._effectCleanups) {
      try { cleanup(); } catch { /* noop */ }
    }
    this._effectCleanups = [];
    for (const node of this._effectNodes) node.remove();
    this._effectNodes = [];
    this._clearTimers();
  }

  private _clearTimers(): void {
    for (const id of this._activeTimers) { clearTimeout(id); clearInterval(id); }
    this._activeTimers = [];
    if (this._resetTimer) clearTimeout(this._resetTimer);
    this._resetTimer = null;
  }

  private _runAction(action: ShortcutAction): void {
    if (typeof action === 'function') { action(this); return; }
    if (typeof action !== 'string') return;
    if (action === 'trigger') this.trigger();
    else if (action === 'reset') this.reset();
    else if (action === 'enable') this.enable();
    else if (action === 'disable') this.disable();
    else if (action === 'togglePanel') this.togglePanel();
    else if (action.startsWith('runMode:')) this.runMode(action.split(':')[1]);
    else if (action.startsWith('runTheme:')) this.runTheme(action.split(':')[1]);
    else if (action.startsWith('runEffect:')) this.runEffect(action.split(':')[1]);
    else this._log('Unknown shortcut action:', action);
  }

  private _bindShortcuts(): () => void {
    if (!this._settings.shortcutsEnabled) return () => {};
    return this._shortcuts.bind(
      this._settings.shortcuts as Record<string, ShortcutAction>,
      (action) => { if (this._enabled) this._runAction(action); },
    );
  }

  private _bindTriggers(): void {
    const triggerSettings = deepMerge(
      this._settings.triggers,
      (this._themeState?.triggers || {}) as Record<string, unknown>,
    ) as { onLoad: boolean; onClickSelector: string | null };

    if (triggerSettings.onClickSelector) {
      const selector = triggerSettings.onClickSelector;
      const handler = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target?.closest?.(selector)) this.trigger();
      };
      document.addEventListener('click', handler);
      this._destroyables.push(() => document.removeEventListener('click', handler));
    }
    if (triggerSettings.onLoad) {
      const handler = () => this.trigger();
      window.addEventListener('load', handler, { once: true });
      this._destroyables.push(() => window.removeEventListener('load', handler));
    }
  }

  // --- Public API ---

  init(config: Partial<ChaosSettings> = {}): this {
    if (this._initialized) return this;
    this._settings = deepMerge(this._settings, this._validateSettings(config));
    this._modes = deepMerge(this._modes, this._settings.modes || {});
    this._resolveTheme();
    this._enabled = !!this._settings.enabled;
    this._installStyles();
    const destroyShortcuts = this._bindShortcuts();
    this._destroyables.push(destroyShortcuts);
    this._bindTriggers();
    this._initialized = true;
    this._log('Initialized', this._settings);
    return this;
  }

  trigger(modeEffects?: Record<string, boolean>): boolean {
    if (!this._initialized) this.init({});
    if (!this._enabled || !this._settings.enabled) return false;
    const now = Date.now();
    const cooldown = this._settings.cooldownMs * (this._themeState.timing?.cooldownMultiplier ?? 1);
    if (now - this._lastTriggerAt < cooldown) return false;
    this._lastTriggerAt = now;
    if (!this._maybe()) return false;
    this._events.emit('beforeTrigger');
    this.reset();
    this._resolveTheme();
    this._applyEffectSet(modeEffects);
    this._scheduleReset();
    this._events.emit('afterTrigger');
    return true;
  }

  reset(): this {
    this._clearEffects();
    return this;
  }

  destroy(): this {
    this.reset();
    this.closePanel();
    for (const fn of this._destroyables) fn();
    this._destroyables = [];
    this._shortcuts.destroy();
    if (this._styleNode) this._styleNode.remove();
    this._styleNode = null;
    this._initialized = false;
    return this;
  }

  updateSettings(config: Partial<ChaosSettings>): this {
    this._settings = deepMerge(this._settings, this._validateSettings(config));
    this._modes = deepMerge(this._modes, this._settings.modes || {});
    this._resolveTheme();
    this._clearEffects();
    for (const fn of this._destroyables) fn();
    this._destroyables = [];
    const destroyShortcuts = this._bindShortcuts();
    this._destroyables.push(destroyShortcuts);
    this._bindTriggers();
    this._events.emit('settingsChange', this._settings);
    return this;
  }

  enable(): this { this._enabled = true; return this; }
  disable(): this { this._enabled = false; this.reset(); return this; }
  getSettings(): ChaosSettings { return deepMerge({}, this._settings) as ChaosSettings; }
  getThemeState(): ThemeProfile { return this._themeState; }

  setTheme(name: string): boolean {
    if (!this._themes[name]) return false;
    this._settings.theme = name;
    this._resolveTheme();
    this._events.emit('themeChange', name);
    return true;
  }

  getTheme(): { name: string; config: ThemeProfile } {
    return { name: this._settings.theme, config: deepMerge({} as ThemeProfile, this._themeState) };
  }

  listThemes(): string[] { return Object.keys(this._themes); }

  registerTheme(name: string, config: Partial<ThemeProfile>): this {
    if (!name) throw new Error('Theme name is required.');
    this._themes[name] = deepMerge(DEFAULT_THEME_PROFILE, config);
    return this;
  }

  removeTheme(name: string): boolean {
    if (!name || name === 'default' || !this._themes[name]) return false;
    delete this._themes[name];
    if (this._settings.theme === name) { this._settings.theme = 'default'; this._resolveTheme(); }
    return true;
  }

  runTheme(name: string): boolean {
    if (!this.setTheme(name)) return false;
    return this.trigger();
  }

  buildTheme(name: string): ThemeBuilder {
    const config: Partial<ThemeProfile> = {};
    const self = this;
    const builder: ThemeBuilder = {
      palette(primary, accent, background, text) {
        config.visual = { ...DEFAULT_THEME_PROFILE.visual, palette: { primary, accent, background, text } };
        return builder;
      },
      effects(...ids) {
        config.effects = {};
        for (const id of ids) config.effects[id] = true;
        return builder;
      },
      particles(type, opts) {
        config.particles = { ...DEFAULT_THEME_PROFILE.particles, type, ...opts };
        return builder;
      },
      popup(cfg) {
        config.popup = { ...DEFAULT_THEME_PROFILE.popup, ...cfg };
        return builder;
      },
      timing(cfg) {
        config.timing = { ...DEFAULT_THEME_PROFILE.timing, ...cfg };
        return builder;
      },
      animation(cfg) {
        config.animation = { ...DEFAULT_THEME_PROFILE.animation, ...cfg };
        return builder;
      },
      overlay(cfg) {
        config.overlay = { ...DEFAULT_THEME_PROFILE.overlay, ...cfg };
        return builder;
      },
      behavior(cfg) {
        config.behavior = { ...DEFAULT_THEME_PROFILE.behavior, ...cfg };
        return builder;
      },
      register() {
        self.registerTheme(name, config);
        return self as unknown as ChaosToggleAPI;
      },
    };
    return builder;
  }

  registerShortcut(combo: string, action: string | ((engine: ChaosToggleAPI) => void)): this {
    this._shortcuts.register(combo, action as ShortcutAction);
    (this._settings.shortcuts as Record<string, unknown>)[combo] = action;
    return this;
  }

  unregisterShortcut(combo: string): this {
    this._shortcuts.unregister(combo);
    delete (this._settings.shortcuts as Record<string, unknown>)[combo];
    return this;
  }

  runMode(name: string): boolean {
    const mode = this._modes[name];
    if (!mode) { this._log('Unknown mode:', name); return false; }
    this._events.emit('modeChange', name);
    const prevI = this._settings.intensity;
    const prevD = this._settings.duration;
    this._settings.intensity = mode.intensity ?? prevI;
    this._settings.duration = mode.duration ?? prevD;
    const didRun = this.trigger(mode.effects);
    this._settings.intensity = prevI;
    this._settings.duration = prevD;
    return didRun;
  }

  listModes(): string[] { return Object.keys(this._modes); }

  registerEffect(effect: ChaosEffect): this {
    this._effectRegistry.register(effect);
    return this;
  }

  removeEffect(id: string): boolean {
    return this._effectRegistry.remove(id);
  }

  listEffects(): string[] {
    return this._effectRegistry.list();
  }

  getEffect(id: string): ChaosEffect | undefined {
    return this._effectRegistry.get(id);
  }

  runEffect(id: string): boolean {
    const effect = this._effectRegistry.get(id);
    if (!effect) return false;
    if (!this._initialized) this.init({});
    this._installStyles();
    const ctx = this._createEffectContext();
    const cleanup = effect.apply(ctx);
    if (typeof cleanup === 'function') this._effectCleanups.push(cleanup);
    this._scheduleReset();
    return true;
  }

  compose(name: string, steps: CompositionStep[]): this {
    this._compositions.set(name, steps);
    return this;
  }

  runComposition(name: string): boolean {
    const steps = this._compositions.get(name);
    if (!steps) return false;
    if (!this._initialized) this.init({});
    this._installStyles();
    const ctx = this._createEffectContext();
    for (const step of steps) {
      const effect = this._effectRegistry.get(step.effect);
      if (!effect) continue;
      this._activeTimers.push(window.setTimeout(() => {
        this._events.emit('effectStart', step.effect, ctx);
        const cleanup = effect.apply(ctx);
        if (typeof cleanup === 'function') this._effectCleanups.push(cleanup);
        this._events.emit('effectEnd', step.effect);
      }, step.delay));
    }
    const maxDelay = Math.max(...steps.map(s => s.delay));
    this._activeTimers.push(window.setTimeout(() => this._scheduleReset(), maxDelay + 100));
    return true;
  }

  on(event: ChaosEventName, handler: ChaosEventHandler): this {
    this._events.on(event, handler);
    return this;
  }

  off(event: ChaosEventName, handler: ChaosEventHandler): this {
    this._events.off(event, handler);
    return this;
  }

  use(plugin: ChaosPlugin): this {
    this._plugins.push(plugin);
    if (plugin.effects) {
      for (const effect of plugin.effects) this._effectRegistry.register(effect);
    }
    if (plugin.themes) {
      for (const theme of plugin.themes) this.registerTheme(theme.id, theme.config);
    }
    if (plugin.install) plugin.install(this as unknown as ChaosToggleAPI);
    this._log('Plugin installed:', plugin.name);
    return this;
  }

  openPanel(): void {
    if (this._panelInstance) return;
    import('../panel/panel').then(mod => {
      this._panelInstance = mod.createPanel(this as unknown as ChaosToggleAPI);
    });
  }

  closePanel(): void {
    if (this._panelInstance) {
      this._panelInstance.destroy();
      this._panelInstance = null;
    }
  }

  togglePanel(): void {
    if (this._panelInstance) this.closePanel();
    else this.openPanel();
  }
}
