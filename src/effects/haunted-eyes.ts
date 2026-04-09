import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'hauntedEyes',
  name: 'Haunted eyes',
  description: 'Pairs of glowing eyes lurk around the edges of the viewport.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-haunted-eyes', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
    });

    const count = 5 + Math.round(ctx.intensity * 6);
    for (let i = 0; i < count; i++) {
      const pair = createEl('div', 'ct-haunted-eyes__pair', {
        position: 'absolute',
        display: 'flex',
        gap: `${8 + Math.random() * 10}px`,
        opacity: '0.88',
        filter: 'drop-shadow(0 0 10px rgba(255,143,31,0.4))',
      });

      const fromLeft = i % 2 === 0;
      pair.style[fromLeft ? 'left' : 'right'] = `${14 + Math.random() * 90}px`;
      pair.style.top = `${16 + Math.random() * 68}%`;

      for (let j = 0; j < 2; j++) {
        const eye = createEl('div', '', {
          width: `${clamp(12 + Math.random() * 14 + ctx.intensity * 6, 12, 28)}px`,
          height: `${clamp(7 + Math.random() * 9 + ctx.intensity * 4, 7, 16)}px`,
          borderRadius: '999px',
          background: 'radial-gradient(circle at 50% 45%, rgba(255,244,220,0.98), rgba(255,143,31,0.9) 55%, rgba(139,92,246,0.45) 100%)',
          boxShadow: '0 0 16px rgba(255,143,31,0.55)',
        });
        pair.appendChild(eye);
      }

      pair.animate(
        [
          { opacity: 0.28, transform: 'scaleY(0.15)' },
          { opacity: 0.95, transform: 'scaleY(1)' },
          { opacity: 0.95, transform: 'scaleY(1)' },
          { opacity: 0.2, transform: 'scaleY(0.12)' },
        ],
        { duration: 1700 + i * 220, delay: i * 130, iterations: Infinity, easing: 'ease-in-out' },
      );

      wrap.appendChild(pair);
    }

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
