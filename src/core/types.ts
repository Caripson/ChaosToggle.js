export type CleanupFn = () => void;

export type EffectCategory = 'visual' | 'dom' | 'interaction' | 'overlay' | 'prank';
export type ChaosPolicy = 'safe' | 'demo' | 'prank';

export interface EffectContext {
  root: HTMLElement;
  intensity: number;
  duration: number;
  palette: ThemePalette;
  themeName: string;
  theme: ThemeProfile;
  popup: ThemePopup;
  random(): number;
  addNode(node: HTMLElement): void;
  addTimer(id: number): void;
  log(...args: unknown[]): void;
}

export interface ChaosEffect {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
  apply(ctx: EffectContext): void | CleanupFn;
  defaults?: Record<string, unknown>;
}

export interface ChaosEffectMeta {
  id: string;
  name: string;
  description: string;
  category: EffectCategory;
}

export interface ThemePalette {
  primary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeVisual {
  className: string;
  forceDark: boolean;
  palette: ThemePalette;
  fontFamily: string;
}

export interface ThemeAnimation {
  style: string;
  intensityMultiplier: number;
  shakeStyle: string;
}

export interface ThemeParticles {
  type: string;
  density: number;
  emoji: string | null;
  emojiSet: string[];
  mixWithConfetti: boolean;
  motion: string;
  colors: string[];
  size: number;
}

export interface ThemePopup {
  title: string;
  message: string;
  confirmText?: string;
  tone: string;
}

export interface ThemeSound {
  enabled: boolean;
  preset: string | null;
}

export interface ThemeTiming {
  durationMultiplier: number;
  cooldownMultiplier: number;
  pattern: string;
}

export interface ThemeOverlay {
  type: string;
  opacity: number;
  gradient?: string;
}

export interface ThemeDecorations {
  hints: boolean;
}

export interface ThemeBehavior {
  microJumps: boolean;
  pulse: boolean;
  recoil: boolean;
  drift: boolean;
  loopBursts: boolean;
  countdown: boolean;
}

export interface ThemeProfile {
  visual: ThemeVisual;
  effects: Record<string, boolean>;
  animation: ThemeAnimation;
  particles: ThemeParticles;
  popup: ThemePopup;
  sound: ThemeSound;
  timing: ThemeTiming;
  triggers: Record<string, unknown>;
  overlay: ThemeOverlay;
  decorations: ThemeDecorations;
  behavior: ThemeBehavior;
}

export interface ModeConfig {
  intensity?: number;
  duration?: number;
  effects: Record<string, boolean>;
}

export interface ChaosSettings {
  autoInit: boolean;
  enabled: boolean;
  policy: ChaosPolicy;
  safeMode: boolean;
  debug: boolean;
  scopeSelector: string;
  cooldownMs: number;
  randomSeed: string | null;
  theme: string;
  themeOverrides: Partial<ThemeProfile>;
  themeParts: Record<string, boolean>;
  duration: number;
  intensity: number;
  probability: number;
  shortcutsEnabled: boolean;
  popup: { title: string; message: string; confirmText: string };
  effects: Record<string, boolean>;
  triggers: { onLoad: boolean; onClickSelector: string | null };
  shortcuts: Record<string, string | ((engine: unknown) => void)>;
  modes: Record<string, ModeConfig>;
}

export type ChaosEventName =
  | 'beforeTrigger'
  | 'afterTrigger'
  | 'effectStart'
  | 'effectEnd'
  | 'themeChange'
  | 'modeChange'
  | 'settingsChange'
  | 'panelOpen'
  | 'panelClose';

export type ChaosEventHandler = (...args: unknown[]) => void;

export interface ChaosPlugin {
  id: string;
  name: string;
  version: string;
  effects?: ChaosEffect[];
  themes?: Array<{ id: string; config: Partial<ThemeProfile> }>;
  install?(engine: ChaosToggleAPI): void;
}

export interface CompositionStep {
  effect: string;
  delay: number;
  options?: Record<string, unknown>;
}

export interface ChaosToggleAPI {
  readonly version: string;
  /** Alias of `init` for a friendlier first call. */
  start(config?: Partial<ChaosSettings>): ChaosToggleAPI;
  init(config?: Partial<ChaosSettings>): ChaosToggleAPI;
  trigger(modeEffects?: Record<string, boolean>): boolean;
  reset(): ChaosToggleAPI;
  destroy(): ChaosToggleAPI;
  updateSettings(config: Partial<ChaosSettings>): ChaosToggleAPI;
  enable(): ChaosToggleAPI;
  disable(): ChaosToggleAPI;
  getSettings(): ChaosSettings;

  setTheme(name: string): boolean;
  getTheme(): { name: string; config: ThemeProfile };
  listThemes(): string[];
  registerTheme(name: string, config: Partial<ThemeProfile>): ChaosToggleAPI;
  removeTheme(name: string): boolean;
  runTheme(name: string): boolean;
  buildTheme(name: string): ThemeBuilder;

  registerShortcut(combo: string, action: string | ((engine: ChaosToggleAPI) => void)): ChaosToggleAPI;
  unregisterShortcut(combo: string): ChaosToggleAPI;

  runMode(name: string): boolean;
  listModes(): string[];

  registerEffect(effect: ChaosEffect): ChaosToggleAPI;
  removeEffect(id: string): boolean;
  listEffects(): string[];
  getEffectMeta(id: string): ChaosEffectMeta | null;
  describeEffects(): ChaosEffectMeta[];
  runEffect(id: string): boolean;

  compose(name: string, steps: CompositionStep[]): ChaosToggleAPI;
  runComposition(name: string): boolean;

  on(event: ChaosEventName, handler: ChaosEventHandler): ChaosToggleAPI;
  off(event: ChaosEventName, handler: ChaosEventHandler): ChaosToggleAPI;

  use(plugin: ChaosPlugin): ChaosToggleAPI;

  openPanel(): void;
  closePanel(): void;
  togglePanel(): void;
}

export interface ThemeBuilder {
  palette(primary: string, accent: string, background: string, text: string): ThemeBuilder;
  effects(...ids: string[]): ThemeBuilder;
  particles(type: string, opts?: Partial<ThemeParticles>): ThemeBuilder;
  popup(config: Partial<ThemePopup>): ThemeBuilder;
  timing(config: Partial<ThemeTiming>): ThemeBuilder;
  animation(config: Partial<ThemeAnimation>): ThemeBuilder;
  overlay(config: Partial<ThemeOverlay>): ThemeBuilder;
  behavior(config: Partial<ThemeBehavior>): ThemeBuilder;
  register(): ChaosToggleAPI;
}
