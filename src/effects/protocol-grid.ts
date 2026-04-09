import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'protocolGrid',
  name: 'Protocol grid',
  description: 'Neon rails, a sweep line, and checkout telemetry turn the page into a cyber storefront.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-protocol-grid', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      color: '#dbf8ff',
      fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    });

    const grid = createEl('div', '', {
      position: 'absolute',
      inset: '0',
      opacity: '0.2',
      backgroundImage:
        'linear-gradient(rgba(0,245,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,187,249,0.18) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      mixBlendMode: 'screen',
    });
    wrap.appendChild(grid);

    const sweep = createEl('div', '', {
      position: 'absolute',
      left: '0',
      right: '0',
      top: '20%',
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.85), transparent)',
      boxShadow: '0 0 16px rgba(0,245,255,0.42)',
    });
    wrap.appendChild(sweep);

    const panel = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '280px',
      padding: '18px 20px',
      border: '1px solid rgba(0,245,255,0.42)',
      background: 'linear-gradient(180deg, rgba(4,11,24,0.88), rgba(4,11,24,0.68))',
      boxShadow: '0 0 28px rgba(0,187,249,0.16)',
      backdropFilter: 'blur(6px)',
    });
    wrap.appendChild(panel);

    const title = createEl('div', '', {
      fontSize: '14px',
      fontWeight: '800',
      color: '#00f5ff',
      marginBottom: '10px',
    });
    title.textContent = 'Checkout Live';
    panel.appendChild(title);

    const rows = ['Sync OK', 'Cart Link Stable', 'Offer Mirror Ready'];
    rows.forEach((text) => {
      const row = createEl('div', '', {
        fontSize: '11px',
        marginTop: '6px',
        color: '#dbf8ff',
      });
      row.textContent = text;
      panel.appendChild(row);
    });

    const corners = [
      { left: '18px', top: '18px' },
      { right: '18px', top: '18px' },
      { left: '18px', bottom: '18px' },
      { right: '18px', bottom: '18px' },
    ];

    for (const pos of corners) {
      const corner = createEl('div', '', {
        position: 'absolute',
        width: '30px',
        height: '30px',
        borderTop: '2px solid rgba(0,245,255,0.56)',
        borderLeft: '2px solid rgba(0,187,249,0.56)',
        ...pos,
      });
      wrap.appendChild(corner);
    }

    const timer = window.setInterval(() => {
      sweep.style.top = `${18 + ctx.random() * 64}%`;
      panel.style.borderColor = ctx.random() < 0.5 ? 'rgba(0,245,255,0.42)' : 'rgba(0,187,249,0.42)';
    }, 420);
    ctx.addTimer(timer);
    ctx.addNode(wrap);

    return () => {
      clearInterval(timer);
      wrap.remove();
    };
  },
};

export default effect;
