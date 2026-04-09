import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const ORNAMENTS = ['🔔', '⭐', '🎁'];
const BULB_COLORS = ['#d62839', '#2a9d6f', '#fff8e5', '#ffd166'];

const effect: ChaosEffect = {
  id: 'holidayLights',
  name: 'Holiday lights',
  description: 'A festive string of lights and ornaments hangs across the top of the page.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-holiday-lights', {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      padding: '10px 18px 0',
      pointerEvents: 'none',
      zIndex: '2147483004',
    });

    const wire = createEl('div', '', {
      position: 'relative',
      height: '22px',
      borderTop: '3px solid rgba(255,255,255,0.75)',
      borderRadius: '999px',
      opacity: '0.82',
    });
    wrap.appendChild(wire);

    const count = clamp(Math.floor((typeof window !== 'undefined' ? window.innerWidth : 1024) / 84), 8, 16);
    for (let i = 0; i < count; i++) {
      const hanger = createEl('div', '', {
        position: 'absolute',
        left: `${(i / Math.max(1, count - 1)) * 100}%`,
        top: '16px',
        width: '2px',
        height: `${14 + Math.sin(i * 0.8) * 6 + 8}px`,
        background: 'rgba(255,255,255,0.55)',
      });
      wire.appendChild(hanger);

      const bulb = createEl('div', 'ct-holiday-lights__bulb', {
        position: 'absolute',
        left: '50%',
        top: '100%',
        marginLeft: '-10px',
        marginTop: '-1px',
        width: '20px',
        height: '26px',
        borderRadius: '12px 12px 14px 14px',
        background: BULB_COLORS[i % BULB_COLORS.length]!,
        boxShadow: `0 0 16px ${BULB_COLORS[i % BULB_COLORS.length]!}`,
        border: '2px solid rgba(255,255,255,0.18)',
      });
      hanger.appendChild(bulb);

      bulb.animate(
        [{ opacity: 0.45, filter: 'brightness(0.9)' }, { opacity: 1, filter: 'brightness(1.18)' }, { opacity: 0.58, filter: 'brightness(0.95)' }],
        { duration: 900 + i * 120, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
      );

      if (i % 3 === 1) {
        const ornament = createEl('div', '', {
          position: 'absolute',
          left: '50%',
          top: '100%',
          marginLeft: '-11px',
          marginTop: '28px',
          fontSize: '20px',
          lineHeight: '1',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.22))',
        });
        ornament.textContent = ORNAMENTS[i % ORNAMENTS.length]!;
        hanger.appendChild(ornament);
      }
    }

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
