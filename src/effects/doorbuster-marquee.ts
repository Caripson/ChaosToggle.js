import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'doorbusterMarquee',
  name: 'Doorbuster marquee',
  description: 'Flash sale ribbons and discount badges turn the screen into a Black Friday rush.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-doorbuster-marquee', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
      textTransform: 'uppercase',
    });

    const makeRibbon = (top: string, rotate: string, text: string) => {
      const ribbon = createEl('div', '', {
        position: 'absolute',
        left: '-8%',
        width: '116%',
        top,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '58px',
        background: 'linear-gradient(90deg, rgba(0,245,212,0.96), rgba(241,91,181,0.96))',
        color: '#050505',
        fontSize: '14px',
        fontWeight: '900',
        letterSpacing: '0.24em',
        transform: `rotate(${rotate})`,
        boxShadow: '0 18px 34px rgba(0,0,0,0.24)',
      });
      ribbon.textContent = text;
      return ribbon;
    };

    wrap.appendChild(makeRibbon('24px', '-2deg', 'Doorbuster  Doorbuster  Doorbuster'));
    wrap.appendChild(makeRibbon('auto', '2deg', 'Flash Sale  Flash Sale  Flash Sale'));
    (wrap.lastChild as HTMLElement).style.bottom = '34px';

    const badge = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '22px 28px',
      borderRadius: '24px',
      background: 'rgba(5,5,5,0.86)',
      border: '2px solid rgba(0,245,212,0.55)',
      color: '#f8f8f8',
      boxShadow: '0 0 34px rgba(0,245,212,0.18)',
      textAlign: 'center',
    });
    wrap.appendChild(badge);

    const title = createEl('div', '', {
      fontSize: '28px',
      fontWeight: '900',
      letterSpacing: '0.12em',
      color: '#00f5d4',
    });
    title.textContent = '-70%';
    badge.appendChild(title);

    const sub = createEl('div', '', {
      marginTop: '6px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.28em',
      color: '#f15bb5',
    });
    sub.textContent = 'Today Only';
    badge.appendChild(sub);

    const sideLeft = createEl('div', '', {
      position: 'absolute',
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%) rotate(-90deg)',
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.26em',
      color: '#00f5d4',
    });
    sideLeft.textContent = 'Limited Drop';
    wrap.appendChild(sideLeft);

    const sideRight = createEl('div', '', {
      position: 'absolute',
      right: '18px',
      top: '50%',
      transform: 'translateY(-50%) rotate(90deg)',
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.26em',
      color: '#f15bb5',
    });
    sideRight.textContent = 'Cart Fast';
    wrap.appendChild(sideRight);

    badge.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.96)', opacity: 0.72 },
        { transform: 'translate(-50%, -50%) scale(1.04)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0.98)', opacity: 0.84 },
      ],
      { duration: 1040 - Math.round(ctx.intensity * 160), iterations: Infinity, easing: 'ease-in-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
