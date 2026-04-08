import type { ChaosToggleAPI } from '../core/types';

const PANEL_CSS = `
:host{all:initial;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:14px;color:#e2e8f0}
*,*::before,*::after{box-sizing:border-box}
.panel{position:fixed;top:16px;right:16px;width:380px;max-height:80vh;background:rgba(15,23,42,.92);border:1px solid rgba(255,255,255,.08);border-radius:16px;backdrop-filter:blur(20px);box-shadow:0 25px 50px -12px rgba(0,0,0,.6);z-index:2147483640;overflow:hidden;display:flex;flex-direction:column;resize:both;min-width:300px;min-height:240px}
.header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.06);cursor:grab;user-select:none}
.header h3{margin:0;font-size:15px;font-weight:600;letter-spacing:.02em;background:linear-gradient(135deg,#ff4d6d,#00f5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.header .ver{font-size:11px;color:#64748b;margin-left:8px}
.close{background:none;border:0;color:#94a3b8;font-size:18px;cursor:pointer;padding:2px 6px;border-radius:6px;line-height:1}
.close:hover{background:rgba(255,255,255,.1);color:#fff}
.body{overflow-y:auto;padding:12px 16px 16px;flex:1}
.section{margin-bottom:14px}
.section-title{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:0 0 8px;font-weight:600}
.row{display:flex;align-items:center;justify-content:space-between;padding:6px 0}
.row label{font-size:13px;color:#cbd5e1}
.toggle{position:relative;width:36px;height:20px;background:#334155;border-radius:10px;cursor:pointer;transition:background .2s;border:0;padding:0}
.toggle.on{background:#10b981}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s}
.toggle.on::after{transform:translateX(16px)}
.slider-row{display:flex;align-items:center;gap:10px}
.slider-row input[type=range]{flex:1;accent-color:#ff4d6d;height:6px}
.slider-row .val{font-size:12px;color:#94a3b8;min-width:38px;text-align:right}
.btn{border:0;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s}
.btn-primary{background:linear-gradient(135deg,#ff4d6d,#f97316);color:#fff}
.btn-primary:hover{filter:brightness(1.15)}
.btn-ghost{background:rgba(255,255,255,.06);color:#e2e8f0}
.btn-ghost:hover{background:rgba(255,255,255,.12)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.chip{padding:5px 10px;border-radius:8px;font-size:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#e2e8f0;cursor:pointer;text-align:center;transition:all .15s}
.chip:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}
.chip.active{background:rgba(255,77,109,.15);border-color:#ff4d6d;color:#ff8fa3}
.effects-list{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px}
.export-area{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;color:#e2e8f0;font-family:monospace;font-size:11px;padding:8px;resize:vertical;min-height:60px}
.footer{padding:10px 16px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:8px;justify-content:flex-end}
`;

export function createPanel(api: ChaosToggleAPI): { destroy(): void } {
  const host = document.createElement('div');
  host.setAttribute('data-chaos-panel', '');
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = PANEL_CSS;
  shadow.appendChild(style);

  const settings = api.getSettings();

  const panel = document.createElement('div');
  panel.className = 'panel';

  // Header
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `<div><h3>ChaosToggle</h3><span class="ver">v${api.version}</span></div>`;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close';
  closeBtn.textContent = '\u00d7';
  closeBtn.addEventListener('click', () => api.closePanel());
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // Drag
  let isDragging = false;
  let dx = 0, dy = 0;
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    dx = e.clientX - panel.getBoundingClientRect().left;
    dy = e.clientY - panel.getBoundingClientRect().top;
    header.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panel.style.position = 'fixed';
    panel.style.left = `${e.clientX - dx}px`;
    panel.style.top = `${e.clientY - dy}px`;
    panel.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'grab'; });

  const body = document.createElement('div');
  body.className = 'body';

  // --- Quick Actions ---
  const actionsSection = document.createElement('div');
  actionsSection.className = 'section';
  const actionsTitle = document.createElement('div');
  actionsTitle.className = 'section-title';
  actionsTitle.textContent = 'Quick Actions';
  actionsSection.appendChild(actionsTitle);
  const actionsGrid = document.createElement('div');
  actionsGrid.className = 'grid';
  const actions: [string, () => void][] = [
    ['Trigger', () => api.trigger()],
    ['Reset', () => api.reset()],
    ['Nuclear', () => api.runMode('nuclear')],
    ['Panic', () => api.runMode('panic')],
    ['Celebration', () => api.runMode('celebration')],
    ['Glitch', () => api.runMode('glitch')],
  ];
  for (const [label, fn] of actions) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = label;
    btn.addEventListener('click', fn);
    actionsGrid.appendChild(btn);
  }
  actionsSection.appendChild(actionsGrid);
  body.appendChild(actionsSection);

  // --- Intensity / Duration sliders ---
  function createSlider(label: string, min: number, max: number, step: number, value: number, onChange: (v: number) => void): HTMLElement {
    const row = document.createElement('div');
    row.className = 'row';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    row.appendChild(lbl);
    const sliderRow = document.createElement('div');
    sliderRow.className = 'slider-row';
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = String(value);
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      val.textContent = String(v);
      onChange(v);
    });
    sliderRow.appendChild(input);
    sliderRow.appendChild(val);
    row.appendChild(sliderRow);
    return row;
  }

  const slidersSection = document.createElement('div');
  slidersSection.className = 'section';
  const slidersTitle = document.createElement('div');
  slidersTitle.className = 'section-title';
  slidersTitle.textContent = 'Controls';
  slidersSection.appendChild(slidersTitle);
  slidersSection.appendChild(createSlider('Intensity', 0, 1, 0.05, settings.intensity, (v) => api.updateSettings({ intensity: v })));
  slidersSection.appendChild(createSlider('Duration', 250, 10000, 50, settings.duration, (v) => api.updateSettings({ duration: v })));
  slidersSection.appendChild(createSlider('Probability', 0, 1, 0.05, settings.probability, (v) => api.updateSettings({ probability: v })));
  body.appendChild(slidersSection);

  // --- Theme Picker ---
  const themeSection = document.createElement('div');
  themeSection.className = 'section';
  const themeTitle = document.createElement('div');
  themeTitle.className = 'section-title';
  themeTitle.textContent = 'Themes';
  themeSection.appendChild(themeTitle);
  const themeGrid = document.createElement('div');
  themeGrid.className = 'grid';
  const currentTheme = api.getTheme().name;
  for (const name of api.listThemes()) {
    const chip = document.createElement('div');
    chip.className = `chip${name === currentTheme ? ' active' : ''}`;
    chip.textContent = name;
    chip.addEventListener('click', () => {
      api.runTheme(name);
      for (const c of themeGrid.querySelectorAll('.chip')) c.classList.remove('active');
      chip.classList.add('active');
    });
    themeGrid.appendChild(chip);
  }
  themeSection.appendChild(themeGrid);
  body.appendChild(themeSection);

  // --- Effects Toggles ---
  const effectsSection = document.createElement('div');
  effectsSection.className = 'section';
  const effectsTitle = document.createElement('div');
  effectsTitle.className = 'section-title';
  effectsTitle.textContent = 'Effects';
  effectsSection.appendChild(effectsTitle);
  const effectsList = document.createElement('div');
  effectsList.className = 'effects-list';
  for (const id of api.listEffects()) {
    const row = document.createElement('div');
    row.className = 'row';
    const lbl = document.createElement('label');
    lbl.textContent = id;
    row.appendChild(lbl);
    const toggle = document.createElement('button');
    toggle.className = `toggle${settings.effects[id] ? ' on' : ''}`;
    toggle.addEventListener('click', () => {
      const current = api.getSettings().effects[id];
      api.updateSettings({ effects: { [id]: !current } });
      toggle.classList.toggle('on');
    });
    row.appendChild(toggle);
    effectsList.appendChild(row);
  }
  effectsSection.appendChild(effectsList);
  body.appendChild(effectsSection);

  // --- Modes ---
  const modesSection = document.createElement('div');
  modesSection.className = 'section';
  const modesTitle = document.createElement('div');
  modesTitle.className = 'section-title';
  modesTitle.textContent = 'Modes';
  modesSection.appendChild(modesTitle);
  const modesGrid = document.createElement('div');
  modesGrid.className = 'grid';
  for (const name of api.listModes()) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.textContent = name;
    btn.addEventListener('click', () => api.runMode(name));
    modesGrid.appendChild(btn);
  }
  modesSection.appendChild(modesGrid);
  body.appendChild(modesSection);

  // --- Run Single Effect ---
  const runSection = document.createElement('div');
  runSection.className = 'section';
  const runTitle = document.createElement('div');
  runTitle.className = 'section-title';
  runTitle.textContent = 'Run Single Effect';
  runSection.appendChild(runTitle);
  const runGrid = document.createElement('div');
  runGrid.className = 'grid';
  for (const id of api.listEffects()) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.textContent = id;
    btn.addEventListener('click', () => api.runEffect(id));
    runGrid.appendChild(btn);
  }
  runSection.appendChild(runGrid);
  body.appendChild(runSection);

  // --- Export / Import ---
  const exportSection = document.createElement('div');
  exportSection.className = 'section';
  const exportTitle = document.createElement('div');
  exportTitle.className = 'section-title';
  exportTitle.textContent = 'Export / Import Settings';
  exportSection.appendChild(exportTitle);
  const textarea = document.createElement('textarea');
  textarea.className = 'export-area';
  textarea.rows = 4;
  textarea.value = JSON.stringify(api.getSettings(), null, 2);
  exportSection.appendChild(textarea);
  const exportBtns = document.createElement('div');
  exportBtns.style.display = 'flex';
  exportBtns.style.gap = '8px';
  exportBtns.style.marginTop = '8px';
  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn btn-ghost';
  copyBtn.textContent = 'Copy';
  copyBtn.addEventListener('click', () => {
    textarea.value = JSON.stringify(api.getSettings(), null, 2);
    textarea.select();
    navigator.clipboard?.writeText(textarea.value);
  });
  const importBtn = document.createElement('button');
  importBtn.className = 'btn btn-ghost';
  importBtn.textContent = 'Import';
  importBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(textarea.value);
      api.updateSettings(parsed);
    } catch {
      /* invalid JSON */
    }
  });
  exportBtns.appendChild(copyBtn);
  exportBtns.appendChild(importBtn);
  exportSection.appendChild(exportBtns);
  body.appendChild(exportSection);

  panel.appendChild(body);
  shadow.appendChild(panel);
  document.body.appendChild(host);

  return {
    destroy() {
      host.remove();
    },
  };
}
