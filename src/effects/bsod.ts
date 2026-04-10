import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

function buildQrPlaceholder(): HTMLElement {
  const wrap = createEl('div', 'ct-bsod__qr');
  wrap.setAttribute('aria-hidden', 'true');
  Object.assign(wrap.style, {
    width: '124px',
    height: '124px',
    padding: '8px',
    borderRadius: '8px',
    background: '#ffffff',
    display: 'grid',
    gridTemplateColumns: 'repeat(11, 1fr)',
    gridTemplateRows: 'repeat(11, 1fr)',
    gap: '0',
    flexShrink: '0',
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.18)',
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

function randomHex(ctx: EffectContext, length: number): string {
  const alphabet = '0123456789ABCDEF';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(ctx.random() * alphabet.length)]!;
  }
  return out;
}

function pickOne<T>(ctx: EffectContext, items: T[]): T {
  return items[Math.floor(ctx.random() * items.length)]!;
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
      background:
        'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.10), transparent 22%), linear-gradient(180deg, #2184df 0%, #0d65c2 28%, #0857b2 100%)',
      color: '#fff',
      fontFamily: '"Segoe UI", "Segoe UI Variable", system-ui, sans-serif',
      fontSize: 'clamp(14px, 1.65vw, 20px)',
      lineHeight: '1.5',
      padding: 'clamp(24px, 5vw, 64px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: '24px',
      overflow: 'hidden',
      isolation: 'isolate',
      letterSpacing: '-0.01em',
    } as CSSStyleDeclaration);

    const glow = createEl('div', 'ct-bsod__glow');
    glow.setAttribute('aria-hidden', 'true');
    Object.assign(glow.style, {
      position: 'absolute',
      inset: '-12%',
      background:
        'radial-gradient(circle at 50% 16%, rgba(255,255,255,0.14), transparent 18%), radial-gradient(circle at 50% 62%, rgba(0,24,88,0.24), transparent 42%)',
      opacity: String(0.72 + ctx.intensity * 0.12),
      filter: 'blur(18px)',
      pointerEvents: 'none',
      zIndex: '0',
    } as CSSStyleDeclaration);
    overlay.appendChild(glow);

    const scanlines = createEl('div', 'ct-bsod__scanlines');
    scanlines.setAttribute('aria-hidden', 'true');
    Object.assign(scanlines.style, {
      position: 'absolute',
      inset: '0',
      background:
        'repeating-linear-gradient(180deg, rgba(255,255,255,0.07) 0 1px, rgba(255,255,255,0) 1px 4px)',
      opacity: '0.24',
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      zIndex: '0',
    } as CSSStyleDeclaration);
    overlay.appendChild(scanlines);

    const vignette = createEl('div', 'ct-bsod__vignette');
    vignette.setAttribute('aria-hidden', 'true');
    Object.assign(vignette.style, {
      position: 'absolute',
      inset: '0',
      boxShadow: 'inset 0 0 120px rgba(0, 38, 102, 0.38)',
      pointerEvents: 'none',
      zIndex: '0',
    } as CSSStyleDeclaration);
    overlay.appendChild(vignette);

    const content = createEl('div', 'ct-bsod__content');
    Object.assign(content.style, {
      position: 'relative',
      zIndex: '1',
      width: 'min(1040px, 100%)',
      display: 'grid',
      gap: 'clamp(20px, 3vw, 30px)',
    } as CSSStyleDeclaration);

    const face = createEl('div');
    face.textContent = ':(';
    Object.assign(face.style, {
      fontSize: 'clamp(64px, 12vw, 120px)',
      fontWeight: '300',
      lineHeight: '1',
      marginBottom: '8px',
      textShadow: '0 12px 28px rgba(0, 24, 76, 0.22)',
    } as CSSStyleDeclaration);

    const msg = createEl('p');
    msg.textContent =
      'Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then you can restart.';
    Object.assign(msg.style, {
      maxWidth: '620px',
      margin: '0',
      fontSize: 'clamp(19px, 2.2vw, 28px)',
      lineHeight: '1.38',
    } as CSSStyleDeclaration);

    const phase = createEl('p', 'ct-bsod__phase');
    phase.textContent = 'Collecting crash data';
    Object.assign(phase.style, {
      margin: '0',
      fontSize: '0.9em',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      opacity: '0.86',
    } as CSSStyleDeclaration);

    const pctRow = createEl('p', 'ct-bsod__progress');
    Object.assign(pctRow.style, {
      margin: '0',
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.45rem',
      fontSize: 'clamp(20px, 2.4vw, 30px)',
    } as CSSStyleDeclaration);
    const pctSpan = createEl('span');
    pctSpan.textContent = '0';
    Object.assign(pctSpan.style, {
      fontVariantNumeric: 'tabular-nums',
      fontWeight: '600',
      minWidth: '2.2ch',
    } as CSSStyleDeclaration);
    pctRow.appendChild(pctSpan);
    pctRow.appendChild(document.createTextNode('% complete'));

    const progressTrack = createEl('div', 'ct-bsod__track');
    Object.assign(progressTrack.style, {
      position: 'relative',
      width: 'min(320px, 78vw)',
      height: '6px',
      borderRadius: '999px',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.18)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)',
    } as CSSStyleDeclaration);

    const progressBar = createEl('div', 'ct-bsod__bar');
    Object.assign(progressBar.style, {
      position: 'absolute',
      inset: '0',
      transformOrigin: 'left center',
      transform: 'scaleX(0)',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.76), rgba(255,255,255,0.96))',
      boxShadow: '0 0 18px rgba(255,255,255,0.3)',
    } as CSSStyleDeclaration);
    progressTrack.appendChild(progressBar);

    const row = createEl('div');
    Object.assign(row.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
      alignItems: 'flex-start',
      gap: 'clamp(24px, 4vw, 48px)',
      width: '100%',
    } as CSSStyleDeclaration);

    const leftCol = createEl('div');
    Object.assign(leftCol.style, {
      minWidth: '0',
      display: 'grid',
      gap: '14px',
    } as CSSStyleDeclaration);
    leftCol.appendChild(face);
    leftCol.appendChild(msg);
    leftCol.appendChild(phase);
    leftCol.appendChild(pctRow);
    leftCol.appendChild(progressTrack);

    const stop = createEl('p');
    stop.textContent = 'Stop code: CHAOS_TOGGLE_EXCEPTION';
    Object.assign(stop.style, {
      margin: '8px 0 0',
      fontSize: '0.94em',
      opacity: '0.95',
    } as CSSStyleDeclaration);
    leftCol.appendChild(stop);

    const failingModule = createEl('p');
    failingModule.textContent = `What failed: ${pickOne(ctx, ['chaoskrnl.sys', 'riftstack64.sys', 'ct-memory-dump.dll', 'quantum-display.sys'])}`;
    Object.assign(failingModule.style, {
      margin: '0',
      fontSize: '0.9em',
      opacity: '0.92',
    } as CSSStyleDeclaration);
    leftCol.appendChild(failingModule);

    const qrHint = createEl('p');
    qrHint.textContent = 'For more information about this issue and possible fixes, visit https://www.windows.com/stopcode';
    Object.assign(qrHint.style, {
      fontSize: '0.78em',
      opacity: '0.84',
      margin: '10px 0 0',
      maxWidth: '420px',
    } as CSSStyleDeclaration);
    leftCol.appendChild(qrHint);

    row.appendChild(leftCol);

    const aside = createEl('div', 'ct-bsod__aside');
    Object.assign(aside.style, {
      display: 'grid',
      gap: '16px',
      minWidth: '0',
    } as CSSStyleDeclaration);

    const qrWrap = createEl('div');
    Object.assign(qrWrap.style, {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-start',
    } as CSSStyleDeclaration);
    qrWrap.appendChild(buildQrPlaceholder());
    const scanMe = createEl('span');
    scanMe.textContent = 'Scan to troubleshoot';
    Object.assign(scanMe.style, {
      fontSize: '12px',
      opacity: '0.9',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    } as CSSStyleDeclaration);
    qrWrap.appendChild(scanMe);
    aside.appendChild(qrWrap);

    const dumpCard = createEl('div', 'ct-bsod__dump');
    Object.assign(dumpCard.style, {
      border: '1px solid rgba(255,255,255,0.16)',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '16px',
      padding: '16px 18px',
      display: 'grid',
      gap: '10px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 18px 42px rgba(0, 29, 80, 0.18)',
      minWidth: '0',
    } as CSSStyleDeclaration);

    const dumpLabel = createEl('div');
    dumpLabel.textContent = 'Crash telemetry';
    Object.assign(dumpLabel.style, {
      fontSize: '11px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      opacity: '0.82',
    } as CSSStyleDeclaration);
    dumpCard.appendChild(dumpLabel);

    const dumpItems = [
      `MEMORY.DMP  0x${randomHex(ctx, 8)}  ${randomHex(ctx, 4)}:${randomHex(ctx, 4)}`,
      `STACK_PTR   0x${randomHex(ctx, 12)}  BUS ${randomHex(ctx, 2)}`,
      `SESSION_ID  CT-${randomHex(ctx, 4)}-${randomHex(ctx, 4)}  CHECK ${randomHex(ctx, 6)}`,
    ];

    const dumpLines = dumpItems.map((text) => {
      const line = createEl('div', 'ct-bsod__dump-line');
      line.textContent = text;
      Object.assign(line.style, {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: '12px',
        lineHeight: '1.45',
        opacity: '0.34',
        transform: 'translateY(4px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
      } as CSSStyleDeclaration);
      dumpCard.appendChild(line);
      return line;
    });

    const detail = createEl('p');
    detail.textContent = 'Diagnostic packets are being serialized for automatic restart recovery.';
    Object.assign(detail.style, {
      margin: '4px 0 0',
      fontSize: '12px',
      lineHeight: '1.45',
      opacity: '0.8',
    } as CSSStyleDeclaration);
    dumpCard.appendChild(detail);

    aside.appendChild(dumpCard);
    row.appendChild(aside);

    content.appendChild(row);
    overlay.appendChild(content);
    ctx.addNode(overlay);

    const phaseMessages = [
      { until: 14, label: 'Collecting crash data', revealDumpLines: 0 },
      { until: 46, label: 'Writing memory dump', revealDumpLines: 1 },
      { until: 82, label: 'Verifying driver state', revealDumpLines: 2 },
      { until: 100, label: 'Preparing automatic restart', revealDumpLines: 3 },
    ];

    function syncStatus(progress: number): void {
      const phaseState = phaseMessages.find((entry) => progress <= entry.until) ?? phaseMessages[phaseMessages.length - 1]!;
      phase.textContent = phaseState.label;
      pctSpan.textContent = String(progress);
      progressBar.style.transform = `scaleX(${Math.max(0, Math.min(progress / 100, 1))})`;
      dumpLines.forEach((line, index) => {
        const visible = index < phaseState.revealDumpLines || progress >= 100;
        line.style.opacity = visible ? '0.94' : '0.34';
        line.style.transform = visible ? 'translateY(0)' : 'translateY(4px)';
      });
      detail.textContent =
        progress >= 100
          ? 'Crash telemetry complete. Automatic restart can proceed safely.'
          : `Diagnostic packets are being serialized for automatic restart recovery.`;
    }

    const animations: Animation[] = [];
    if (typeof overlay.animate === 'function') {
      animations.push(
        overlay.animate(
          [
            { opacity: 0, filter: 'blur(8px)' },
            { opacity: 1, filter: 'blur(0px)' },
          ],
          { duration: 260, easing: 'ease-out', fill: 'forwards' },
        ),
      );
      animations.push(
        content.animate(
          [
            { transform: 'translateY(18px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration: 420, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
        ),
      );
      animations.push(
        face.animate(
          [
            { transform: 'translateY(0) scale(1)', opacity: 0.98 },
            { transform: 'translateY(-2px) scale(1.015)', opacity: 1 },
          ],
          { duration: 1800, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity },
        ),
      );
      animations.push(
        scanlines.animate(
          [
            { transform: 'translateY(0)' },
            { transform: 'translateY(6px)' },
          ],
          { duration: 520, easing: 'linear', iterations: Infinity },
        ),
      );
    }

    let n = 0;
    syncStatus(n);
    const tick = window.setInterval(() => {
      const maxStep = n < 20 ? 3 : n < 68 ? 2 : 1;
      const stallChance = n < 30 ? 0.06 : n < 76 ? 0.14 : 0.28;
      const step = ctx.random() < stallChance ? 0 : Math.max(1, Math.round(ctx.random() * maxStep));
      n = Math.min(100, n + step);
      syncStatus(n);
    }, 320 + Math.round((1 - ctx.intensity) * 500));
    ctx.addTimer(tick);

    return () => {
      clearInterval(tick);
      animations.forEach((animation) => animation.cancel());
      overlay.remove();
    };
  },
};

export default effect;
