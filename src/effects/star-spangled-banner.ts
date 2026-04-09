import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const TOKENS = ['🇺🇸', '★', '✦'];

const effect: ChaosEffect = {
  id: 'starSpangledBanner',
  name: 'Star-spangled banner',
  description: 'A patriotic ribbon of flags and stars hangs across the top of the viewport.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-star-spangled-banner', {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      padding: '10px 16px 0',
      pointerEvents: 'none',
      zIndex: '2147483004',
    });

    const stripe = createEl('div', '', {
      height: '8px',
      width: '100%',
      borderRadius: '999px',
      background: 'linear-gradient(90deg, #b22234 0 33%, #ffffff 33% 66%, #3c3b6e 66% 100%)',
      boxShadow: '0 10px 22px rgba(15,23,42,0.18)',
      marginBottom: '10px',
    });
    wrap.appendChild(stripe);

    const row = createEl('div', '', {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '8px',
      width: '100%',
    });
    wrap.appendChild(row);

    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const count = clamp(Math.floor(width / 96), 7, 14);
    for (let i = 0; i < count; i++) {
      const badge = createEl('div', 'ct-star-spangled-banner__badge', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${i % 3 === 0 ? 58 : 46}px`,
        height: `${i % 3 === 0 ? 54 : 46}px`,
        borderRadius: '18px 18px 22px 22px',
        color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#b22234' : '#3c3b6e',
        background: i % 3 === 0 ? 'rgba(60,59,110,0.92)' : 'rgba(255,255,255,0.95)',
        border: `2px solid ${i % 3 === 2 ? '#b22234' : '#3c3b6e'}`,
        fontSize: `${i % 3 === 0 ? 26 : 22}px`,
        transform: `translateY(${10 + Math.sin(i * 0.7) * 12}px)`,
        boxShadow: '0 10px 24px rgba(15,23,42,0.22)',
        backdropFilter: 'blur(6px)',
      });
      badge.textContent = TOKENS[i % TOKENS.length]!;
      row.appendChild(badge);

      badge.animate(
        [
          { transform: `${badge.style.transform} rotate(-4deg)` },
          { transform: `translateY(${6 + Math.sin(i * 0.7) * 10}px) rotate(3deg)` },
          { transform: `${badge.style.transform} rotate(-4deg)` },
        ],
        { duration: 1800 + i * 90, delay: i * 60, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
      );
    }

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
