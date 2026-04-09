import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const TOKENS = ['🎆', '✨', '🥂', '🎇'];

const effect: ChaosEffect = {
  id: 'midnightBurst',
  name: 'Midnight burst',
  description: 'Countdown medallion and fireworks markers celebrate the New Year rollover.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-midnight-burst', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
    });

    const halo = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '14%',
      width: '320px',
      height: '320px',
      marginLeft: '-160px',
      marginTop: '-120px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,239,90,0.28), rgba(255,79,216,0.18), rgba(12,16,40,0))',
      filter: 'blur(6px)',
    });
    wrap.appendChild(halo);

    const badge = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '28px',
      transform: 'translateX(-50%)',
      padding: '12px 18px',
      borderRadius: '999px',
      border: '1px solid rgba(255,255,255,0.24)',
      background: 'linear-gradient(135deg, rgba(255,239,90,0.2), rgba(255,79,216,0.28))',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '800',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      boxShadow: '0 16px 36px rgba(12,16,40,0.28)',
      backdropFilter: 'blur(8px)',
    });
    badge.textContent = '00:00 LIVE';
    wrap.appendChild(badge);

    const ribbon = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '78px',
      transform: 'translateX(-50%)',
      padding: '8px 14px',
      borderRadius: '999px',
      background: 'rgba(12,16,40,0.64)',
      color: '#ffef5a',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      border: '1px solid rgba(255,255,255,0.18)',
    });
    ribbon.textContent = 'Happy New Year';
    wrap.appendChild(ribbon);

    const count = clamp(6 + Math.round(ctx.intensity * 10), 6, 16);
    for (let i = 0; i < count; i++) {
      const token = createEl('div', 'ct-midnight-burst__token', {
        position: 'absolute',
        left: `${8 + ctx.random() * 84}%`,
        top: `${14 + ctx.random() * 48}%`,
        fontSize: `${clamp(24 + ctx.random() * 18 + ctx.intensity * 12, 24, 52)}px`,
        lineHeight: '1',
        opacity: '0.9',
        filter: 'drop-shadow(0 8px 16px rgba(255,79,216,0.22))',
      });
      token.textContent = TOKENS[i % TOKENS.length]!;
      wrap.appendChild(token);

      token.animate(
        [
          { transform: 'scale(0.84) translateY(10px)', opacity: 0.22 },
          { transform: 'scale(1.08) translateY(-16px)', opacity: 1 },
          { transform: 'scale(0.94) translateY(4px)', opacity: 0.7 },
        ],
        { duration: 1400 + i * 110, delay: i * 80, iterations: Infinity, easing: 'ease-in-out' },
      );
    }

    const year = createEl('div', '', {
      position: 'absolute',
      right: '18px',
      bottom: '18px',
      padding: '10px 12px',
      borderRadius: '16px',
      background: 'rgba(12,16,40,0.72)',
      border: '1px solid rgba(255,255,255,0.14)',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    });
    year.textContent = `Year ${new Date().getFullYear()}`;
    wrap.appendChild(year);

    const timer = window.setInterval(() => {
      badge.style.opacity = ctx.random() < 0.4 ? '0.72' : '1';
      badge.textContent = ctx.random() < 0.5 ? '00:00 LIVE' : 'Midnight Burst';
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
