import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const DRINKS = ['🍺', '🍸', '🥃', '🫧'];

const effect: ChaosEffect = {
  id: 'lastCall',
  name: 'Last call',
  description: 'A neon bar sign, drinks, and bubbles sway across the viewport like a late-night haze.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-last-call', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
    });

    const sign = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '26px',
      transform: 'translateX(-50%)',
      padding: '12px 22px',
      borderRadius: '999px',
      border: '2px solid rgba(236,72,153,0.55)',
      background: 'rgba(59,7,100,0.74)',
      color: '#fdf2ff',
      fontSize: '16px',
      fontWeight: '800',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      boxShadow: '0 0 24px rgba(168,85,247,0.28)',
      textShadow: '0 0 12px rgba(236,72,153,0.64)',
    });
    sign.textContent = 'Last Call';
    wrap.appendChild(sign);

    const rail = createEl('div', '', {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      height: '88px',
      background: 'linear-gradient(180deg, rgba(250,245,255,0), rgba(168,85,247,0.08), rgba(59,7,100,0.22))',
      borderTop: '1px solid rgba(255,255,255,0.12)',
    });
    wrap.appendChild(rail);

    const count = clamp(6 + Math.round(ctx.intensity * 5), 6, 11);
    for (let i = 0; i < count; i++) {
      const drink = createEl('div', 'ct-last-call__drink', {
        position: 'absolute',
        left: `${8 + (i / Math.max(1, count - 1)) * 84}%`,
        bottom: `${10 + (i % 2) * 8}px`,
        marginLeft: '-18px',
        fontSize: `${clamp(26 + ctx.random() * 16, 26, 44)}px`,
        lineHeight: '1',
        filter: 'drop-shadow(0 8px 18px rgba(59,7,100,0.2))',
      });
      drink.textContent = DRINKS[i % DRINKS.length]!;
      wrap.appendChild(drink);

      drink.animate(
        [
          { transform: 'translateY(0px) rotate(-4deg)' },
          { transform: 'translateY(-8px) rotate(5deg)' },
          { transform: 'translateY(0px) rotate(-3deg)' },
        ],
        { duration: 1700 + i * 140, delay: i * 90, iterations: Infinity, easing: 'ease-in-out' },
      );
    }

    const bubbleCount = clamp(5 + Math.round(ctx.intensity * 8), 5, 14);
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = createEl('div', '', {
        position: 'absolute',
        left: `${10 + ctx.random() * 80}%`,
        bottom: `${14 + ctx.random() * 46}px`,
        width: `${10 + ctx.random() * 16}px`,
        height: `${10 + ctx.random() * 16}px`,
        borderRadius: '50%',
        border: '1px solid rgba(249,168,212,0.45)',
        background: 'rgba(255,255,255,0.06)',
      });
      wrap.appendChild(bubble);

      bubble.animate(
        [
          { transform: 'translateY(0px) scale(0.8)', opacity: 0.18 },
          { transform: `translateY(${-80 - ctx.random() * 120}px) scale(1.12)`, opacity: 0.62 },
          { transform: `translateY(${-130 - ctx.random() * 160}px) scale(1.2)`, opacity: 0 },
        ],
        { duration: 2200 + i * 120, delay: i * 110, iterations: Infinity, easing: 'ease-out' },
      );
    }

    sign.animate(
      [
        { transform: 'translateX(-50%) rotate(-1deg)' },
        { transform: 'translateX(-50%) rotate(1.5deg)' },
        { transform: 'translateX(-50%) rotate(-0.5deg)' },
      ],
      { duration: 1900, iterations: Infinity, easing: 'ease-in-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
