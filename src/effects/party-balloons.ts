import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const TOKENS = ['🎈', '🎉', '🎂', '✨'];
const COLORS = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

const effect: ChaosEffect = {
  id: 'partyBalloons',
  name: 'Party balloons',
  description: 'Balloon bouquet and birthday banner frame the viewport like a party backdrop.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-party-balloons', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
    });

    const banner = createEl('div', '', {
      position: 'absolute',
      top: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 18px',
      borderRadius: '999px',
      background: 'linear-gradient(135deg, rgba(255,190,11,0.92), rgba(131,56,236,0.9))',
      color: '#ffffff',
      fontFamily: 'ui-sans-serif, system-ui',
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      boxShadow: '0 14px 30px rgba(27,17,64,0.24)',
    });
    banner.textContent = 'Happy Birthday';
    wrap.appendChild(banner);

    const count = 5 + Math.round(ctx.intensity * 6);
    for (let i = 0; i < count; i++) {
      const balloon = createEl('div', 'ct-party-balloons__balloon', {
        position: 'absolute',
        left: `${8 + (i / Math.max(1, count - 1)) * 84}%`,
        bottom: `${-16 + Math.random() * 36}px`,
        width: `${38 + Math.random() * 18}px`,
        height: `${52 + Math.random() * 24}px`,
        marginLeft: '-20px',
        borderRadius: '50% 50% 46% 46%',
        background: COLORS[i % COLORS.length]!,
        boxShadow: `0 0 18px ${COLORS[i % COLORS.length]!}`,
        border: '2px solid rgba(255,255,255,0.22)',
      });

      const knot = createEl('div', '', {
        position: 'absolute',
        left: '50%',
        bottom: '-8px',
        width: '10px',
        height: '10px',
        marginLeft: '-5px',
        background: COLORS[i % COLORS.length]!,
        transform: 'rotate(45deg)',
        borderRadius: '2px',
      });
      balloon.appendChild(knot);

      const token = createEl('div', '', {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: '-10px',
        marginTop: '-12px',
        fontSize: '20px',
        lineHeight: '1',
      });
      token.textContent = TOKENS[i % TOKENS.length]!;
      balloon.appendChild(token);

      const string = createEl('div', '', {
        position: 'absolute',
        left: '50%',
        top: '100%',
        width: '2px',
        height: `${42 + Math.random() * 70}px`,
        marginLeft: '-1px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.05))',
        opacity: '0.72',
      });
      balloon.appendChild(string);

      balloon.animate(
        [
          { transform: 'translateY(0px) rotate(-4deg)' },
          { transform: `translateY(${-18 - Math.random() * 22}px) rotate(5deg)` },
          { transform: 'translateY(-8px) rotate(-3deg)' },
        ],
        { duration: 2200 + i * 120, delay: i * 90, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
      );

      wrap.appendChild(balloon);
    }

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
