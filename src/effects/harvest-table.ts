import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const TOKENS = ['🥧', '🦃', '🍁', '🍂', '🕯️'];

const effect: ChaosEffect = {
  id: 'harvestTable',
  name: 'Harvest table',
  description: 'A harvest spread of pie, leaves, and candlelight settles along the bottom edge.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-harvest-table', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
    });

    const glow = createEl('div', '', {
      position: 'absolute',
      inset: 'auto 0 0 0',
      height: '220px',
      background: 'linear-gradient(180deg, rgba(42,27,20,0), rgba(188,108,37,0.12), rgba(42,27,20,0.42))',
    });
    wrap.appendChild(glow);

    const shelf = createEl('div', '', {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      height: '112px',
      background: 'linear-gradient(180deg, rgba(127,85,57,0.9), rgba(74,47,35,0.96))',
      borderTop: '1px solid rgba(248,238,223,0.16)',
      boxShadow: '0 -20px 36px rgba(0,0,0,0.18)',
    });
    wrap.appendChild(shelf);

    const badge = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      bottom: '80px',
      transform: 'translateX(-50%)',
      padding: '10px 18px',
      borderRadius: '999px',
      background: 'rgba(42,27,20,0.78)',
      border: '1px solid rgba(248,238,223,0.18)',
      color: '#f8eedf',
      fontSize: '13px',
      fontWeight: '800',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    });
    badge.textContent = 'Pass Pie';
    wrap.appendChild(badge);

    const count = clamp(6 + Math.round(ctx.intensity * 6), 6, 12);
    for (let i = 0; i < count; i++) {
      const token = createEl('div', 'ct-harvest-table__token', {
        position: 'absolute',
        left: `${6 + (i / Math.max(1, count - 1)) * 88}%`,
        bottom: `${16 + (i % 3) * 12}px`,
        marginLeft: '-18px',
        fontSize: `${clamp(28 + ctx.random() * 14, 28, 44)}px`,
        lineHeight: '1',
        filter: 'drop-shadow(0 8px 12px rgba(42,27,20,0.28))',
      });
      token.textContent = TOKENS[i % TOKENS.length]!;
      wrap.appendChild(token);
    }

    const steam = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      bottom: '108px',
      width: '160px',
      height: '90px',
      marginLeft: '-80px',
      background: 'radial-gradient(circle at 50% 80%, rgba(248,238,223,0.28), rgba(248,238,223,0))',
      filter: 'blur(10px)',
      opacity: '0.82',
    });
    wrap.appendChild(steam);

    steam.animate(
      [
        { transform: 'translateY(8px) scale(0.94)', opacity: 0.32 },
        { transform: 'translateY(-12px) scale(1.08)', opacity: 0.72 },
        { transform: 'translateY(-28px) scale(1.16)', opacity: 0.18 },
      ],
      { duration: 2400, iterations: Infinity, easing: 'ease-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
