import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'evacuationTape',
  name: 'Evacuation tape',
  description: 'Hazard tape bars and evacuation warnings frame the page like a disaster zone.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-evacuation-tape', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
    });

    const makeTape = (styles: Partial<CSSStyleDeclaration>, rotate: string) => {
      const tape = createEl('div', 'ct-evacuation-tape__bar', {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '54px',
        background:
          'repeating-linear-gradient(135deg, #ffcc00 0 22px, #111111 22px 44px)',
        color: '#111111',
        fontSize: '14px',
        fontWeight: '800',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        boxShadow: '0 18px 34px rgba(0,0,0,0.25)',
        transform: `rotate(${rotate})`,
        ...styles,
      });
      tape.textContent = 'EVACUATE';
      return tape;
    };

    wrap.appendChild(makeTape({ top: '28px', left: '-8%', width: '116%' }, '-2deg'));
    wrap.appendChild(makeTape({ bottom: '42px', left: '-8%', width: '116%' }, '1.5deg'));

    const alert = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '18px 24px',
      border: '2px solid rgba(255,46,46,0.7)',
      background: 'linear-gradient(180deg, rgba(13,13,13,0.92), rgba(59,10,10,0.86))',
      color: '#ffcccc',
      fontSize: '18px',
      fontWeight: '800',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      boxShadow: '0 0 30px rgba(255,46,46,0.22)',
    });
    alert.textContent = 'Critical Failure';
    wrap.appendChild(alert);

    alert.animate(
      [
        { opacity: 0.62, transform: 'translate(-50%, -50%) scale(0.98)' },
        { opacity: 1, transform: 'translate(-50%, -50%) scale(1.03)' },
        { opacity: 0.7, transform: 'translate(-50%, -50%) scale(0.99)' },
      ],
      { duration: 980, iterations: Infinity, easing: 'ease-in-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
