import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'retroBroadcast',
  name: 'Retro broadcast',
  description: 'Analog TV status bugs, timestamp labels, and REC indicators frame the screen.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-retro-broadcast', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      color: '#ffd166',
      fontFamily: '"Courier New", ui-monospace, monospace',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    });

    const rec = createEl('div', '', {
      position: 'absolute',
      top: '18px',
      left: '18px',
      fontSize: '12px',
      padding: '6px 8px',
      background: 'rgba(26,26,46,0.76)',
      border: '1px solid rgba(255,107,53,0.5)',
      boxShadow: '0 0 14px rgba(255,107,53,0.12)',
    });
    rec.textContent = 'REC  SP';
    wrap.appendChild(rec);

    const channel = createEl('div', '', {
      position: 'absolute',
      top: '18px',
      right: '18px',
      fontSize: '12px',
      padding: '6px 8px',
      background: 'rgba(26,26,46,0.76)',
      border: '1px solid rgba(255,209,102,0.5)',
    });
    channel.textContent = 'CH 84';
    wrap.appendChild(channel);

    const stamp = createEl('div', '', {
      position: 'absolute',
      bottom: '18px',
      left: '18px',
      fontSize: '12px',
      padding: '6px 8px',
      background: 'rgba(26,26,46,0.76)',
      border: '1px solid rgba(224,224,224,0.36)',
    });
    wrap.appendChild(stamp);

    const badge = createEl('div', '', {
      position: 'absolute',
      bottom: '18px',
      right: '18px',
      fontSize: '12px',
      padding: '6px 8px',
      background: 'rgba(26,26,46,0.76)',
      border: '1px solid rgba(255,107,53,0.5)',
    });
    badge.textContent = 'TRACKING';
    wrap.appendChild(badge);

    const corners = [
      { left: '18px', top: '54px' },
      { right: '18px', top: '54px' },
      { left: '18px', bottom: '54px' },
      { right: '18px', bottom: '54px' },
    ];

    for (const pos of corners) {
      const corner = createEl('div', '', {
        position: 'absolute',
        width: '20px',
        height: '20px',
        borderTop: '2px solid rgba(255,209,102,0.55)',
        borderLeft: '2px solid rgba(255,107,53,0.55)',
        ...pos,
      });
      wrap.appendChild(corner);
    }

    const updateStamp = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      stamp.textContent = `${hh}:${mm}:${ss}  PM`;
    };
    updateStamp();

    const timer = window.setInterval(() => {
      updateStamp();
      rec.style.opacity = Math.random() < 0.35 ? '0.58' : '1';
      badge.textContent = Math.random() < 0.4 ? 'PLAY' : 'TRACKING';
    }, 400);
    ctx.addTimer(timer);

    ctx.addNode(wrap);

    return () => {
      clearInterval(timer);
      wrap.remove();
    };
  },
};

export default effect;
