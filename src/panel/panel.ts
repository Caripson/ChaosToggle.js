import { DEFAULT_SETTINGS } from '../core/defaults';
import type { ChaosToggleAPI, ChaosEffectMeta, ChaosSettings, EffectCategory, ChaosPolicy } from '../core/types';

const FAVORITES_KEY = 'chaos-toggle:panel-favorites';

const PANEL_CSS = `
:host{all:initial;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:14px;color:#e2e8f0}
*,*::before,*::after{box-sizing:border-box}
.panel{position:fixed;top:16px;right:16px;width:430px;max-height:82vh;background:
linear-gradient(180deg,rgba(15,23,42,.96),rgba(15,23,42,.9)),
radial-gradient(circle at top left,rgba(255,77,109,.16),transparent 38%),
radial-gradient(circle at top right,rgba(0,245,255,.12),transparent 34%);
border:1px solid rgba(255,255,255,.08);border-radius:18px;backdrop-filter:blur(20px);box-shadow:0 30px 80px rgba(0,0,0,.46);z-index:2147483640;overflow:hidden;display:flex;flex-direction:column;resize:both;min-width:320px;min-height:300px}
.header{display:flex;align-items:flex-start;justify-content:space-between;padding:16px 18px 14px;border-bottom:1px solid rgba(255,255,255,.06);cursor:grab;user-select:none}
.header-main{display:flex;flex-direction:column;gap:6px}
.eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8}
.title{display:flex;align-items:center;gap:8px}
.title h3{margin:0;font-size:17px;font-weight:700;letter-spacing:.02em;background:linear-gradient(135deg,#ff4d6d,#00f5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ver{font-size:11px;color:#64748b}
.subtitle{font-size:12px;color:#94a3b8;line-height:1.35}
.close{background:none;border:0;color:#94a3b8;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:8px;line-height:1}
.close:hover{background:rgba(255,255,255,.08);color:#fff}
.body{overflow-y:auto;padding:14px 16px 18px;display:grid;gap:14px}
.section{display:grid;gap:10px;padding:12px;border:1px solid rgba(255,255,255,.06);border-radius:16px;background:rgba(255,255,255,.025)}
.section-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.section-title{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#64748b;font-weight:700}
.section-meta{font-size:11px;color:#94a3b8}
.status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.status-card{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05)}
.status-label{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#94a3b8;margin-bottom:6px}
.status-value{font-size:13px;font-weight:600;color:#f8fafc;word-break:break-word}
.cluster{display:flex;flex-wrap:wrap;gap:6px}
.chip,.filter-chip{display:inline-flex;align-items:center;gap:6px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#e2e8f0;padding:6px 10px;font-size:12px;line-height:1;cursor:pointer;transition:all .15s}
.chip:hover,.filter-chip:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}
.chip.active,.filter-chip.active{background:rgba(255,77,109,.14);border-color:#ff4d6d;color:#ff9daf}
.chip.subtle{cursor:default}
.chip.subtle:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08)}
.signature-stack{display:flex;flex-wrap:wrap;gap:8px}
.signature-card{display:grid;gap:6px;min-width:120px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06)}
.signature-title{font-size:12px;font-weight:600;color:#f8fafc}
.signature-copy{font-size:11px;line-height:1.45;color:#94a3b8}
.controls-grid{display:grid;gap:10px}
.control-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.control-label{display:grid;gap:3px}
.control-title{font-size:13px;color:#e2e8f0}
.control-copy{font-size:11px;color:#94a3b8}
.toggle{position:relative;width:40px;height:22px;background:#334155;border-radius:999px;cursor:pointer;transition:background .2s;border:0;padding:0;flex:0 0 auto}
.toggle.on{background:#10b981}
.toggle::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s}
.toggle.on::after{transform:translateX(18px)}
.slider{display:grid;gap:7px}
.slider-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.slider-row input[type=range]{flex:1;accent-color:#ff4d6d;height:6px}
.slider-value{font-size:12px;color:#94a3b8;min-width:48px;text-align:right}
.field{display:grid;gap:6px}
.field label{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#64748b}
.policy-row{display:grid;gap:6px}
.input,.textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;color:#e2e8f0;padding:9px 10px;font-size:12px;outline:none}
.input:focus,.textarea:focus{border-color:rgba(255,77,109,.5);box-shadow:0 0 0 3px rgba(255,77,109,.12)}
.textarea{min-height:88px;resize:vertical;font-family:ui-monospace,SFMono-Regular,monospace}
.btn-row{display:flex;flex-wrap:wrap;gap:8px}
.btn{border:0;padding:8px 12px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.btn-primary{background:linear-gradient(135deg,#ff4d6d,#f97316);color:#fff}
.btn-primary:hover{filter:brightness(1.12)}
.btn-ghost{background:rgba(255,255,255,.06);color:#e2e8f0}
.btn-ghost:hover{background:rgba(255,255,255,.12)}
.btn-quiet{background:rgba(255,255,255,.03);color:#94a3b8}
.btn-quiet:hover{background:rgba(255,255,255,.08);color:#fff}
.mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.mode-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.effect-toolbar{display:grid;gap:8px}
.filter-row{display:flex;flex-wrap:wrap;gap:6px}
.effects-list{display:grid;gap:8px;max-height:340px;overflow:auto;padding-right:4px}
.effect-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.05)}
.effect-main{display:grid;gap:7px;min-width:0}
.effect-title{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.effect-name{font-size:13px;font-weight:600;color:#f8fafc}
.effect-id{font-size:11px;color:#94a3b8}
.badge-row{display:flex;flex-wrap:wrap;gap:6px}
.badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;font-size:10px;text-transform:uppercase;letter-spacing:.12em;background:rgba(255,255,255,.05);color:#cbd5e1}
.badge.signature{background:rgba(255,190,11,.14);color:#ffd166}
.badge.enabled{background:rgba(16,185,129,.15);color:#86efac}
.effect-desc{font-size:11px;line-height:1.45;color:#94a3b8}
.effect-actions{display:flex;align-items:center;gap:6px}
.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#cbd5e1;cursor:pointer}
.icon-btn:hover{background:rgba(255,255,255,.1);color:#fff}
.icon-btn.active{border-color:#ffbe0b;color:#ffbe0b;background:rgba(255,190,11,.12)}
.empty{padding:12px;border-radius:12px;border:1px dashed rgba(255,255,255,.12);color:#94a3b8;font-size:12px;line-height:1.45}
.status-pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;background:rgba(255,255,255,.05);color:#cbd5e1}
.status-pill.hot{background:rgba(255,77,109,.14);color:#ffb0be}
.status-pill.good{background:rgba(16,185,129,.14);color:#9ae6b4}
.helper{font-size:11px;color:#94a3b8;line-height:1.45}
`;

type EffectFilter = 'all' | 'favorites' | EffectCategory;

function readFavorites(): Set<string> {
  try {
    const raw = window.localStorage?.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((value): value is string => typeof value === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function writeFavorites(favorites: Set<string>): void {
  try {
    window.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites).sort()));
  } catch {
    /* ignore storage failures */
  }
}

function createButton(label: string, className: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn ${className}`;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function createIconButton(label: string, text: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-btn';
  button.textContent = text;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  return button;
}

function formatSliderValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, '').replace(/0$/, '');
}

export function createPanel(api: ChaosToggleAPI): { destroy(): void } {
  const host = document.createElement('div');
  host.setAttribute('data-chaos-panel', '');
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = PANEL_CSS;
  shadow.appendChild(style);

  const panel = document.createElement('div');
  panel.className = 'panel';

  const header = document.createElement('div');
  header.className = 'header';
  const headerMain = document.createElement('div');
  headerMain.className = 'header-main';
  headerMain.innerHTML = `
    <div class="eyebrow">Control Center</div>
    <div class="title"><h3>ChaosToggle</h3><span class="ver">v${api.version}</span></div>
    <div class="subtitle">Live panel for themes, modes, favorites, and effect routing.</div>
  `;
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'close';
  closeBtn.textContent = '\u00d7';
  closeBtn.addEventListener('click', () => api.closePanel());
  header.append(headerMain, closeBtn);

  const body = document.createElement('div');
  body.className = 'body';

  const statusSection = document.createElement('section');
  statusSection.className = 'section';
  const statusHead = document.createElement('div');
  statusHead.className = 'section-head';
  statusHead.innerHTML = `<div class="section-title">Live Status</div><div class="section-meta">Synced from runtime events</div>`;
  const statusGrid = document.createElement('div');
  statusGrid.className = 'status-grid';
  const activeThemeCard = document.createElement('div');
  activeThemeCard.className = 'status-card';
  activeThemeCard.innerHTML = `<div class="status-label">Theme</div><div class="status-value" data-panel-status-theme></div>`;
  const activeModeCard = document.createElement('div');
  activeModeCard.className = 'status-card';
  activeModeCard.innerHTML = `<div class="status-label">Mode</div><div class="status-value" data-panel-status-mode></div>`;
  const statusFlagsCard = document.createElement('div');
  statusFlagsCard.className = 'status-card';
  statusFlagsCard.innerHTML = `<div class="status-label">Guardrails</div><div class="status-value" data-panel-status-flags></div>`;
  statusGrid.append(activeThemeCard, activeModeCard, statusFlagsCard);
  const statusPills = document.createElement('div');
  statusPills.className = 'cluster';
  statusSection.append(statusHead, statusGrid, statusPills);

  const actionsSection = document.createElement('section');
  actionsSection.className = 'section';
  const actionsHead = document.createElement('div');
  actionsHead.className = 'section-head';
  actionsHead.innerHTML = `<div class="section-title">Quick Actions</div><div class="section-meta">Most-used triggers</div>`;
  const actionsGrid = document.createElement('div');
  actionsGrid.className = 'mini-grid';
  const favoriteLaunchSection = document.createElement('div');
  favoriteLaunchSection.className = 'field';
  const favoriteLaunchLabel = document.createElement('label');
  favoriteLaunchLabel.textContent = 'Pinned Effects';
  const favoriteLaunchGrid = document.createElement('div');
  favoriteLaunchGrid.className = 'btn-row';
  favoriteLaunchSection.append(favoriteLaunchLabel, favoriteLaunchGrid);
  actionsSection.append(actionsHead, actionsGrid, favoriteLaunchSection);

  const controlsSection = document.createElement('section');
  controlsSection.className = 'section';
  const controlsHead = document.createElement('div');
  controlsHead.className = 'section-head';
  controlsHead.innerHTML = `<div class="section-title">Runtime Controls</div><div class="section-meta">Settings stay in sync</div>`;
  const controlsGrid = document.createElement('div');
  controlsGrid.className = 'controls-grid';
  controlsSection.append(controlsHead, controlsGrid);

  const themesSection = document.createElement('section');
  themesSection.className = 'section';
  const themesHead = document.createElement('div');
  themesHead.className = 'section-head';
  themesHead.innerHTML = `<div class="section-title">Themes</div><div class="section-meta">Theme signatures and stack</div>`;
  const themeGrid = document.createElement('div');
  themeGrid.className = 'cluster';
  const themeSummary = document.createElement('div');
  themeSummary.className = 'signature-stack';
  themesSection.append(themesHead, themeGrid, themeSummary);

  const effectsSection = document.createElement('section');
  effectsSection.className = 'section';
  const effectsHead = document.createElement('div');
  effectsHead.className = 'section-head';
  effectsHead.innerHTML = `<div class="section-title">Effects Browser</div><div class="section-meta" data-panel-effect-count></div>`;
  const effectToolbar = document.createElement('div');
  effectToolbar.className = 'effect-toolbar';
  const effectSearch = document.createElement('input');
  effectSearch.className = 'input';
  effectSearch.type = 'search';
  effectSearch.placeholder = 'Search effect id, name, description, or category';
  effectSearch.setAttribute('data-effect-search', '');
  const effectFilterRow = document.createElement('div');
  effectFilterRow.className = 'filter-row';
  const effectsList = document.createElement('div');
  effectsList.className = 'effects-list';
  effectsSection.append(effectsHead, effectToolbar, effectsList);
  effectToolbar.append(effectSearch, effectFilterRow);

  const modesSection = document.createElement('section');
  modesSection.className = 'section';
  const modesHead = document.createElement('div');
  modesHead.className = 'section-head';
  modesHead.innerHTML = `<div class="section-title">Modes</div><div class="section-meta">Last mode stays highlighted</div>`;
  const modesSummary = document.createElement('div');
  modesSummary.className = 'helper';
  modesSummary.setAttribute('data-panel-mode-summary', '');
  const modesGrid = document.createElement('div');
  modesGrid.className = 'mode-grid';
  modesSection.append(modesHead, modesSummary, modesGrid);

  const exportSection = document.createElement('section');
  exportSection.className = 'section';
  const exportHead = document.createElement('div');
  exportHead.className = 'section-head';
  exportHead.innerHTML = `<div class="section-title">Import / Export</div><div class="section-meta">Round-trip current config</div>`;
  const textarea = document.createElement('textarea');
  textarea.className = 'textarea';
  textarea.rows = 6;
  textarea.setAttribute('data-panel-settings-json', '');
  const importStatus = document.createElement('div');
  importStatus.className = 'helper';
  importStatus.setAttribute('data-panel-import-status', '');
  const exportButtons = document.createElement('div');
  exportButtons.className = 'btn-row';
  exportSection.append(exportHead, textarea, importStatus, exportButtons);

  panel.append(header, body);
  body.append(statusSection, actionsSection, controlsSection, themesSection, effectsSection, modesSection, exportSection);
  shadow.appendChild(panel);
  document.body.appendChild(host);

  type SliderControl = {
    input: HTMLInputElement;
    value: HTMLElement;
    sync(next: number): void;
  };

  const state: {
    settings: ChaosSettings;
    theme: ReturnType<ChaosToggleAPI['getTheme']>;
    activeMode: string | null;
    effectQuery: string;
    effectFilter: EffectFilter;
    favorites: Set<string>;
    importDirty: boolean;
  } = {
    settings: api.getSettings(),
    theme: api.getTheme(),
    activeMode: null,
    effectQuery: '',
    effectFilter: 'all',
    favorites: readFavorites(),
    importDirty: false,
  };

  const defaultEffectIds = new Set(Object.keys(DEFAULT_SETTINGS.effects));

  const createToggleRow = (key: keyof Pick<ChaosSettings, 'enabled' | 'shortcutsEnabled'>, title: string, copy: string) => {
    const row = document.createElement('div');
    row.className = 'control-row';
    const label = document.createElement('div');
    label.className = 'control-label';
    label.innerHTML = `<div class="control-title">${title}</div><div class="control-copy">${copy}</div>`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toggle';
    button.setAttribute('data-panel-toggle', String(key));
    button.addEventListener('click', () => {
      api.updateSettings({ [key]: !api.getSettings()[key] } as Partial<ChaosSettings>);
    });
    row.append(label, button);
    controlsGrid.appendChild(row);
    return {
      sync(value: boolean) {
        button.classList.toggle('on', value);
        button.setAttribute('aria-pressed', String(value));
      },
    };
  };

  const policyField = document.createElement('div');
  policyField.className = 'policy-row';
  const policyLabel = document.createElement('label');
  policyLabel.textContent = 'Policy';
  const policyCopy = document.createElement('div');
  policyCopy.className = 'helper';
  policyCopy.textContent = 'Safe blocks prank and interaction disruption, demo allows visual pranks, prank allows everything.';
  const policyCluster = document.createElement('div');
  policyCluster.className = 'cluster';
  const policyButtons = new Map<ChaosPolicy, HTMLButtonElement>();
  for (const [value, label] of [
    ['safe', 'Safe'],
    ['demo', 'Demo'],
    ['prank', 'Prank'],
  ] as const satisfies Array<[ChaosPolicy, string]>) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = label;
    button.setAttribute('data-panel-policy', value);
    button.addEventListener('click', () => {
      api.updateSettings({ policy: value });
    });
    policyButtons.set(value, button);
    policyCluster.appendChild(button);
  }
  policyField.append(policyLabel, policyCopy, policyCluster);
  controlsGrid.appendChild(policyField);

  const createSlider = (
    key: keyof Pick<ChaosSettings, 'intensity' | 'duration' | 'probability'>,
    title: string,
    min: number,
    max: number,
    step: number,
  ): SliderControl => {
    const wrap = document.createElement('div');
    wrap.className = 'slider';
    const titleNode = document.createElement('div');
    titleNode.className = 'control-title';
    titleNode.textContent = title;
    const row = document.createElement('div');
    row.className = 'slider-row';
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.setAttribute('data-panel-slider', String(key));
    const value = document.createElement('span');
    value.className = 'slider-value';
    input.addEventListener('input', () => {
      const parsed = Number(input.value);
      api.updateSettings({ [key]: parsed } as Partial<ChaosSettings>);
    });
    row.append(input, value);
    wrap.append(titleNode, row);
    controlsGrid.appendChild(wrap);
    return {
      input,
      value,
      sync(next: number) {
        input.value = String(next);
        value.textContent = formatSliderValue(next);
      },
    };
  };

  const enabledToggle = createToggleRow('enabled', 'Master switch', 'Stops all triggers without losing your setup.');
  const shortcutsToggle = createToggleRow('shortcutsEnabled', 'Keyboard shortcuts', 'Lets hotkeys keep working while the panel is open.');
  const intensitySlider = createSlider('intensity', 'Intensity', 0, 1, 0.05);
  const durationSlider = createSlider('duration', 'Duration', 250, 10000, 50);
  const probabilitySlider = createSlider('probability', 'Probability', 0, 1, 0.05);

  const randomSeedField = document.createElement('div');
  randomSeedField.className = 'field';
  const randomSeedLabel = document.createElement('label');
  randomSeedLabel.textContent = 'Random seed';
  const randomSeedInput = document.createElement('input');
  randomSeedInput.className = 'input';
  randomSeedInput.placeholder = 'Leave empty for live randomness';
  randomSeedInput.setAttribute('data-panel-random-seed', '');
  randomSeedInput.addEventListener('change', () => {
    const value = randomSeedInput.value.trim();
    api.updateSettings({ randomSeed: value || null });
  });
  randomSeedField.append(randomSeedLabel, randomSeedInput);
  controlsGrid.appendChild(randomSeedField);

  const actions: Array<[string, () => void, string]> = [
    ['Trigger', () => api.trigger(), 'btn-primary'],
    ['Reset', () => api.reset(), 'btn-ghost'],
    ['Nuclear', () => api.runMode('nuclear'), 'btn-primary'],
    ['Panic', () => api.runMode('panic'), 'btn-ghost'],
    ['Celebration', () => api.runMode('celebration'), 'btn-primary'],
    ['Open Theme', () => api.runTheme(api.getTheme().name), 'btn-ghost'],
  ];

  for (const [label, onClick, className] of actions) {
    actionsGrid.appendChild(createButton(label, className, onClick));
  }

  const copyButton = createButton('Copy Current', 'btn-primary', () => {
    state.importDirty = false;
    syncTextarea();
    const payload = textarea.value;
    const clipboardPromise = navigator.clipboard?.writeText(payload);
    if (clipboardPromise && typeof clipboardPromise.catch === 'function') {
      void clipboardPromise.catch(() => {});
    }
    importStatus.textContent = 'Current settings copied from the live engine snapshot.';
  });

  const refreshButton = createButton('Refresh Snapshot', 'btn-ghost', () => {
    state.importDirty = false;
    syncTextarea();
    importStatus.textContent = 'Textarea refreshed from current settings.';
  });

  const importButton = createButton('Apply JSON', 'btn-ghost', () => {
    try {
      const parsed = JSON.parse(textarea.value) as Partial<ChaosSettings>;
      state.importDirty = false;
      api.updateSettings(parsed);
      importStatus.textContent = 'Settings applied to the engine.';
    } catch {
      importStatus.textContent = 'Invalid JSON. No changes were applied.';
    }
  });

  exportButtons.append(copyButton, refreshButton, importButton);

  textarea.addEventListener('input', () => {
    state.importDirty = true;
    importStatus.textContent = 'Edited locally. Apply JSON to push it into the engine.';
  });

  const getEffectMeta = (): ChaosEffectMeta[] =>
    api.describeEffects().slice().sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  const signatureIds = (): Set<string> => {
    const themeEffects = state.theme.config.effects || {};
    return new Set(
      Object.entries(themeEffects)
        .filter(([id, enabled]) => Boolean(enabled) && !defaultEffectIds.has(id))
        .map(([id]) => id),
    );
  };

  const renderStatus = (): void => {
    const themeName = state.theme.name;
    const policy = state.settings.policy;
    const shortcuts = state.settings.shortcutsEnabled ? 'keys on' : 'keys off';
    const flags = panel.querySelector('[data-panel-status-flags]');
    const themeNode = panel.querySelector('[data-panel-status-theme]');
    const modeNode = panel.querySelector('[data-panel-status-mode]');
    if (themeNode) themeNode.textContent = themeName;
    if (modeNode) modeNode.textContent = state.activeMode || 'none';
    if (flags) flags.textContent = `${policy} / ${shortcuts}`;

    statusPills.replaceChildren();
    const pills: Array<[string, string]> = [
      [`${getEffectMeta().length} registered effects`, 'status-pill'],
      [`${state.favorites.size} pinned`, state.favorites.size ? 'status-pill hot' : 'status-pill'],
      [state.settings.enabled ? 'engine enabled' : 'engine paused', state.settings.enabled ? 'status-pill good' : 'status-pill hot'],
    ];

    for (const [label, className] of pills) {
      const pill = document.createElement('div');
      pill.className = className;
      pill.textContent = label;
      statusPills.appendChild(pill);
    }
  };

  const syncControls = (): void => {
    enabledToggle.sync(state.settings.enabled);
    shortcutsToggle.sync(state.settings.shortcutsEnabled);
    for (const [value, button] of policyButtons) {
      button.classList.toggle('active', value === state.settings.policy);
    }
    intensitySlider.sync(state.settings.intensity);
    durationSlider.sync(state.settings.duration);
    probabilitySlider.sync(state.settings.probability);
    randomSeedInput.value = state.settings.randomSeed || '';
  };

  const renderFavoriteLaunchers = (): void => {
    favoriteLaunchGrid.replaceChildren();
    const metas = new Map(getEffectMeta().map((meta) => [meta.id, meta]));
    const favorites = Array.from(state.favorites).filter((id) => metas.has(id));
    favoriteLaunchSection.style.display = favorites.length ? 'grid' : 'none';

    for (const id of favorites) {
      favoriteLaunchGrid.appendChild(createButton(metas.get(id)!.name, 'btn-quiet', () => api.runEffect(id)));
    }
  };

  const renderThemes = (): void => {
    const currentTheme = state.theme.name;
    themeGrid.replaceChildren();
    for (const name of api.listThemes()) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `chip${name === currentTheme ? ' active' : ''}`;
      chip.textContent = name;
      chip.setAttribute('data-theme-chip', name);
      chip.addEventListener('click', () => api.runTheme(name));
      themeGrid.appendChild(chip);
    }

    themeSummary.replaceChildren();

    const motionCard = document.createElement('div');
    motionCard.className = 'signature-card';
    motionCard.innerHTML = `
      <div class="signature-title">Particle profile</div>
      <div class="signature-copy">${state.theme.config.particles.type} / ${state.theme.config.particles.motion}</div>
    `;

    const popupCard = document.createElement('div');
    popupCard.className = 'signature-card';
    popupCard.innerHTML = `
      <div class="signature-title">${state.theme.config.popup.title}</div>
      <div class="signature-copy">${state.theme.config.popup.message}</div>
    `;

    const stackCard = document.createElement('div');
    stackCard.className = 'signature-card';
    const stackTitle = document.createElement('div');
    stackTitle.className = 'signature-title';
    stackTitle.textContent = 'Signature stack';
    const stackRow = document.createElement('div');
    stackRow.className = 'cluster';

    const signatures = Array.from(signatureIds()).map((id) => api.getEffectMeta(id)).filter((meta): meta is ChaosEffectMeta => Boolean(meta));
    if (!signatures.length) {
      const fallback = document.createElement('div');
      fallback.className = 'chip subtle';
      fallback.textContent = 'No dedicated signature effect';
      stackRow.appendChild(fallback);
    } else {
      for (const meta of signatures) {
        const item = document.createElement('div');
        item.className = 'chip subtle';
        item.textContent = meta.name;
        item.setAttribute('data-signature-item', meta.id);
        stackRow.appendChild(item);
      }
    }

    stackCard.append(stackTitle, stackRow);
    themeSummary.append(motionCard, popupCard, stackCard);
  };

  const renderModes = (): void => {
    modesGrid.replaceChildren();
    modesSummary.textContent = state.activeMode
      ? `Last triggered mode: ${state.activeMode}`
      : 'No mode has been triggered since the panel opened.';

    for (const name of api.listModes()) {
      const active = name === state.activeMode;
      const button = createButton(name, active ? 'btn-primary' : 'btn-ghost', () => api.runMode(name));
      button.setAttribute('data-mode-chip', name);
      modesGrid.appendChild(button);
    }
  };

  const renderEffects = (): void => {
    const activeSignatures = signatureIds();
    const query = state.effectQuery.trim().toLowerCase();
    const visibleEffects = getEffectMeta().filter((meta) => {
      if (state.effectFilter === 'favorites' && !state.favorites.has(meta.id)) return false;
      if (state.effectFilter !== 'all' && state.effectFilter !== 'favorites' && meta.category !== state.effectFilter) return false;
      if (!query) return true;
      const haystack = `${meta.id} ${meta.name} ${meta.description} ${meta.category}`.toLowerCase();
      return haystack.includes(query);
    });

    const countLabel = panel.querySelector('[data-panel-effect-count]');
    if (countLabel) countLabel.textContent = `${visibleEffects.length} visible / ${getEffectMeta().length} total`;

    effectsList.replaceChildren();

    if (!visibleEffects.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No effects match the current search and filter state.';
      effectsList.appendChild(empty);
      return;
    }

    for (const meta of visibleEffects) {
      const card = document.createElement('div');
      card.className = 'effect-card';
      card.setAttribute('data-effect-item', meta.id);

      const main = document.createElement('div');
      main.className = 'effect-main';

      const title = document.createElement('div');
      title.className = 'effect-title';
      title.innerHTML = `<div><div class="effect-name">${meta.name}</div><div class="effect-id">${meta.id}</div></div>`;

      const badges = document.createElement('div');
      badges.className = 'badge-row';
      const category = document.createElement('div');
      category.className = 'badge';
      category.textContent = meta.category;
      badges.appendChild(category);
      if (activeSignatures.has(meta.id)) {
        const signature = document.createElement('div');
        signature.className = 'badge signature';
        signature.textContent = 'signature';
        badges.appendChild(signature);
      }
      if (state.settings.effects[meta.id]) {
        const enabled = document.createElement('div');
        enabled.className = 'badge enabled';
        enabled.textContent = 'enabled';
        badges.appendChild(enabled);
      }

      const description = document.createElement('div');
      description.className = 'effect-desc';
      description.textContent = meta.description;
      main.append(title, badges, description);

      const actions = document.createElement('div');
      actions.className = 'effect-actions';

      const favorite = createIconButton('Pin effect', state.favorites.has(meta.id) ? '★' : '☆', () => {
        if (state.favorites.has(meta.id)) state.favorites.delete(meta.id);
        else state.favorites.add(meta.id);
        writeFavorites(state.favorites);
        renderFavoriteLaunchers();
        renderStatus();
        renderEffects();
      });
      favorite.classList.toggle('active', state.favorites.has(meta.id));
      favorite.setAttribute('data-effect-favorite', meta.id);

      const run = createIconButton('Run effect', '▶', () => api.runEffect(meta.id));
      run.setAttribute('data-effect-run', meta.id);

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = `toggle${state.settings.effects[meta.id] ? ' on' : ''}`;
      toggle.setAttribute('data-effect-toggle', meta.id);
      toggle.addEventListener('click', () => {
        const current = api.getSettings().effects[meta.id];
        api.updateSettings({ effects: { [meta.id]: !current } });
      });

      actions.append(favorite, run, toggle);
      card.append(main, actions);
      effectsList.appendChild(card);
    }
  };

  const renderFilters = (): void => {
    effectFilterRow.replaceChildren();
    const filters: Array<[EffectFilter, string]> = [
      ['all', 'All'],
      ['favorites', 'Favorites'],
      ['visual', 'Visual'],
      ['overlay', 'Overlay'],
      ['dom', 'DOM'],
      ['interaction', 'Interaction'],
      ['prank', 'Prank'],
    ];
    for (const [value, label] of filters) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `filter-chip${state.effectFilter === value ? ' active' : ''}`;
      chip.textContent = label;
      chip.setAttribute('data-effect-filter', value);
      chip.addEventListener('click', () => {
        state.effectFilter = value;
        renderFilters();
        renderEffects();
      });
      effectFilterRow.appendChild(chip);
    }
  };

  const syncTextarea = (): void => {
    if (state.importDirty) return;
    textarea.value = JSON.stringify(state.settings, null, 2);
  };

  const syncFromApi = (): void => {
    state.settings = api.getSettings();
    state.theme = api.getTheme();
    renderStatus();
    syncControls();
    renderFavoriteLaunchers();
    renderThemes();
    renderFilters();
    renderEffects();
    renderModes();
    syncTextarea();
  };

  effectSearch.addEventListener('input', () => {
    state.effectQuery = effectSearch.value;
    renderEffects();
  });

  const onSettingsChange = () => {
    syncFromApi();
  };
  const onThemeChange = () => {
    state.theme = api.getTheme();
    renderStatus();
    renderThemes();
    renderEffects();
  };
  const onModeChange = (name?: unknown) => {
    state.activeMode = typeof name === 'string' ? name : null;
    renderStatus();
    renderModes();
  };

  api.on('settingsChange', onSettingsChange);
  api.on('themeChange', onThemeChange);
  api.on('modeChange', onModeChange);

  let isDragging = false;
  let dx = 0;
  let dy = 0;

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    panel.style.position = 'fixed';
    panel.style.left = `${event.clientX - dx}px`;
    panel.style.top = `${event.clientY - dy}px`;
    panel.style.right = 'auto';
  };

  const onMouseUp = () => {
    isDragging = false;
    header.style.cursor = 'grab';
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') api.closePanel();
  };

  header.addEventListener('mousedown', (event) => {
    isDragging = true;
    dx = event.clientX - panel.getBoundingClientRect().left;
    dy = event.clientY - panel.getBoundingClientRect().top;
    header.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);

  syncFromApi();

  return {
    destroy() {
      api.off('settingsChange', onSettingsChange);
      api.off('themeChange', onThemeChange);
      api.off('modeChange', onModeChange);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKeyDown);
      host.remove();
    },
  };
}
