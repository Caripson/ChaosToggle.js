import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'panicAlarm',
  name: 'Panic alarm',
  description: 'Alarm braces, warning markers, and a hard-stop badge slam into the viewport.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-panic-alarm', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
      textTransform: 'uppercase',
    });

    const frame = createEl('div', '', {
      position: 'absolute',
      inset: '12px',
      border: '2px solid rgba(255,0,0,0.58)',
      boxShadow: '0 0 26px rgba(255,0,0,0.18), inset 0 0 18px rgba(255,0,0,0.12)',
    });
    wrap.appendChild(frame);

    const makeCorner = (styles: Partial<CSSStyleDeclaration>) => {
      const corner = createEl('div', '', {
        position: 'absolute',
        width: '48px',
        height: '48px',
        borderTop: '4px solid rgba(255,255,255,0.82)',
        borderLeft: '4px solid rgba(255,0,0,0.88)',
        ...styles,
      });
      wrap.appendChild(corner);
    };

    makeCorner({ top: '16px', left: '16px' });
    makeCorner({ top: '16px', right: '16px', transform: 'scaleX(-1)' });
    makeCorner({ bottom: '16px', left: '16px', transform: 'scaleY(-1)' });
    makeCorner({ bottom: '16px', right: '16px', transform: 'scale(-1)' });

    const badge = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '18px 24px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.92), rgba(51,0,0,0.88))',
      border: '2px solid rgba(255,0,0,0.72)',
      color: '#ffffff',
      textAlign: 'center',
      boxShadow: '0 0 30px rgba(255,0,0,0.22)',
    });
    wrap.appendChild(badge);

    const title = createEl('div', '', {
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.26em',
      color: '#ff9d9d',
    });
    title.textContent = 'Alarm';
    badge.appendChild(title);

    const stop = createEl('div', '', {
      marginTop: '8px',
      fontSize: '34px',
      fontWeight: '900',
      letterSpacing: '0.12em',
      color: '#ff0000',
      textShadow: '0 0 16px rgba(255,0,0,0.55)',
    });
    stop.textContent = 'NOPE';
    badge.appendChild(stop);

    const sub = createEl('div', '', {
      marginTop: '8px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.22em',
      color: '#ffffff',
    });
    sub.textContent = 'Back Away';
    badge.appendChild(sub);

    const side = createEl('div', '', {
      position: 'absolute',
      right: '-42px',
      top: '50%',
      transform: 'translateY(-50%) rotate(90deg)',
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.24em',
      color: '#ff9d9d',
    });
    side.textContent = 'Impact Warning';
    wrap.appendChild(side);

    badge.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.96)', opacity: 0.74 },
        { transform: 'translate(-50%, -50%) scale(1.04)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0.98)', opacity: 0.8 },
      ],
      { duration: 560 - Math.round(ctx.intensity * 120), iterations: Infinity, easing: 'ease-in-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
