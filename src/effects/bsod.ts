import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

function buildQrPlaceholder(): HTMLElement {
  const wrap = createEl('div', 'ct-bsod__qr');
  wrap.setAttribute('aria-hidden', 'true');
  Object.assign(wrap.style, {
    width: '120px',
    height: '120px',
    background: '#fff',
    display: 'grid',
    gridTemplateColumns: 'repeat(11, 1fr)',
    gridTemplateRows: 'repeat(11, 1fr)',
    gap: '0',
    flexShrink: '0',
  } as CSSStyleDeclaration);
  const pattern = [
    '11111111111',
    '10000000001',
    '10111110101',
    '10100010101',
    '10101010101',
    '10100010101',
    '10111110101',
    '10000000001',
    '10101010101',
    '10000000001',
    '11111111111',
  ];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const cell = createEl('div');
      cell.style.background = pattern[r]![c] === '1' ? '#000' : '#fff';
      wrap.appendChild(cell);
    }
  }
  return wrap;
}

const effect: ChaosEffect = {
  id: 'bsod',
  name: 'Blue Screen',
  description: 'Full-screen Windows-style blue screen prank.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-bsod');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: '#0078d4',
      color: '#fff',
      fontFamily: '"Segoe UI", "Segoe UI Variable", system-ui, sans-serif',
      fontSize: 'clamp(14px, 2vw, 20px)',
      lineHeight: '1.5',
      padding: 'clamp(24px, 5vw, 64px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: '24px',
    } as CSSStyleDeclaration);

    const face = createEl('div');
    face.textContent = ':(';
    Object.assign(face.style, {
      fontSize: 'clamp(64px, 12vw, 120px)',
      fontWeight: '300',
      lineHeight: '1',
    } as CSSStyleDeclaration);

    const msg = createEl('p');
    msg.textContent =
      'Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then you can restart.';
    Object.assign(msg.style, { maxWidth: '520px', margin: '0' } as CSSStyleDeclaration);

    const pctRow = createEl('p');
    pctRow.style.margin = '0';
    const pctLabel = document.createTextNode(' ');
    const pctSpan = createEl('span');
    pctSpan.textContent = '0';
    const pctSuffix = document.createTextNode('% complete');
    pctRow.appendChild(pctLabel);
    pctRow.appendChild(pctSpan);
    pctRow.appendChild(document.createTextNode(' '));
    pctRow.appendChild(pctSuffix);

    const row = createEl('div');
    Object.assign(row.style, {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      gap: 'clamp(24px, 4vw, 48px)',
      width: '100%',
    } as CSSStyleDeclaration);

    const leftCol = createEl('div');
    Object.assign(leftCol.style, { flex: '1 1 280px', minWidth: '0' } as CSSStyleDeclaration);
    leftCol.appendChild(face);
    leftCol.appendChild(msg);
    leftCol.appendChild(pctRow);

    const stop = createEl('p');
    stop.textContent = 'Stop code: CHAOS_TOGGLE_EXCEPTION';
    Object.assign(stop.style, { margin: '0', fontSize: '0.9em', opacity: '0.95' } as CSSStyleDeclaration);
    leftCol.appendChild(stop);

    const qrHint = createEl('p');
    qrHint.textContent = 'For more information about this issue and possible fixes, visit https://www.windows.com/stopcode';
    Object.assign(qrHint.style, { fontSize: '0.75em', opacity: '0.85', margin: '12px 0 0', maxWidth: '360px' } as CSSStyleDeclaration);
    leftCol.appendChild(qrHint);

    row.appendChild(leftCol);
    const qrWrap = createEl('div');
    Object.assign(qrWrap.style, { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' } as CSSStyleDeclaration);
    qrWrap.appendChild(buildQrPlaceholder());
    const scanMe = createEl('span');
    scanMe.textContent = 'Scan to troubleshoot';
    Object.assign(scanMe.style, { fontSize: '12px', opacity: '0.9' } as CSSStyleDeclaration);
    qrWrap.appendChild(scanMe);
    row.appendChild(qrWrap);

    overlay.appendChild(row);
    ctx.addNode(overlay);

    let n = 0;
    const tick = window.setInterval(() => {
      const step = Math.random() < 0.85 ? 1 : 0;
      n = Math.min(100, n + step);
      pctSpan.textContent = String(n);
      if (n >= 100) n = 100;
    }, 320 + Math.round((1 - ctx.intensity) * 500));
    ctx.addTimer(tick);

    return () => {
      clearInterval(tick);
      overlay.remove();
    };
  },
};

export default effect;
