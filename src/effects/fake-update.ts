import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const STICKY = new Set([27, 42, 89]);

const effect: ChaosEffect = {
  id: 'fakeUpdate',
  name: 'Fake Windows Update',
  description: 'Convincing full-screen Windows Update progress prank.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-fake-update');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: '#000',
      color: '#f3f3f3',
      fontFamily: '"Segoe UI", "Segoe UI Variable", system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      boxSizing: 'border-box',
    } as CSSStyleDeclaration);

    const styleId = 'ct-fake-update-spin';
    if (!document.getElementById(styleId)) {
      const s = createEl('style') as HTMLStyleElement;
      s.id = styleId;
      s.textContent = `
        @keyframes ct-fu-spin { to { transform: rotate(360deg); } }
        .ct-fake-update__ring {
          width: 56px; height: 56px; border-radius: 50%;
          border: 4px solid rgba(255,255,255,0.15);
          border-top-color: #fff;
          animation: ct-fu-spin 0.9s linear infinite;
        }
      `;
      document.head.appendChild(s);
    }

    const ring = createEl('div', 'ct-fake-update__ring');

    const title = createEl('h1');
    title.textContent = 'Working on updates';
    Object.assign(title.style, {
      margin: '0',
      fontSize: 'clamp(22px, 4vw, 34px)',
      fontWeight: '200',
      letterSpacing: '0.02em',
    } as CSSStyleDeclaration);

    const pct = createEl('p');
    pct.textContent = '0%';
    Object.assign(pct.style, {
      margin: '0',
      fontSize: 'clamp(40px, 7vw, 72px)',
      fontWeight: '200',
    } as CSSStyleDeclaration);

    const sub = createEl('p');
    sub.textContent = "Don't turn off your computer";
    Object.assign(sub.style, {
      margin: '0',
      fontSize: '15px',
      opacity: '0.85',
    } as CSSStyleDeclaration);

    const detail = createEl('p');
    detail.textContent = 'This will take a while';
    Object.assign(detail.style, {
      margin: '0',
      fontSize: '13px',
      opacity: '0.55',
    } as CSSStyleDeclaration);

    overlay.appendChild(ring);
    overlay.appendChild(title);
    overlay.appendChild(pct);
    overlay.appendChild(sub);
    overlay.appendChild(detail);
    ctx.addNode(overlay);

    let value = 0;
    let pauseUntil = 0;

    const tick = window.setInterval(() => {
      const now = Date.now();
      if (now < pauseUntil) return;

      const step = Math.random() < 0.1 ? 0 : Math.random() < 0.55 ? 1 : 2;
      let next = Math.min(99, value + step);
      if (next >= 96 && Math.random() < 0.22) next = 89;

      value = next;
      pct.textContent = `${value}%`;

      if (STICKY.has(value) && Math.random() < 0.5) {
        pauseUntil = now + 2200 + Math.random() * 5200;
      }
    }, 280 + Math.round((1 - ctx.intensity) * 400));
    ctx.addTimer(tick);

    return () => {
      clearInterval(tick);
      overlay.remove();
    };
  },
};

export default effect;
