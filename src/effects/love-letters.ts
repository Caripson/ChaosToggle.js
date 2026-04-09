import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const NOTES = ['Be Mine', 'XO XO', 'Love Loop', 'Rose Mode'];
const SEALS = ['💌', '💖', '🌹', '💕'];
const COLORS = ['#fff3f7', '#ffd6e7', '#ffc2d6', '#ffe5ec'];

const effect: ChaosEffect = {
  id: 'loveLetters',
  name: 'Love letters',
  description: 'Pinned notes, heart seals, and rose-tinted cards wrap the page in Valentine energy.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-love-letters', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: 'ui-sans-serif, system-ui',
    });

    const positions = [
      { top: '20px', left: '22px', rotate: '-7deg' },
      { top: '28px', right: '26px', rotate: '6deg' },
      { bottom: '28px', left: '24px', rotate: '5deg' },
      { bottom: '24px', right: '22px', rotate: '-6deg' },
    ];

    positions.forEach((pos, index) => {
      const note = createEl('div', 'ct-love-letters__note', {
        position: 'absolute',
        width: '152px',
        minHeight: '112px',
        padding: '18px 14px 14px',
        background: COLORS[index % COLORS.length]!,
        color: '#7a1d44',
        boxShadow: '0 14px 28px rgba(122,29,68,0.14)',
        border: '1px solid rgba(255,255,255,0.48)',
        transform: `rotate(${pos.rotate})`,
        ...pos,
      });

      const seal = createEl('div', '', {
        position: 'absolute',
        top: '-12px',
        left: '50%',
        width: '34px',
        height: '34px',
        marginLeft: '-17px',
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #ff4d8d, #ff8fab)',
        boxShadow: '0 8px 18px rgba(255,77,141,0.24)',
      });
      seal.textContent = SEALS[index % SEALS.length]!;
      note.appendChild(seal);

      const title = createEl('div', '', {
        marginTop: '8px',
        fontSize: '13px',
        fontWeight: '800',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      });
      title.textContent = NOTES[index]!;
      note.appendChild(title);

      const body = createEl('div', '', {
        marginTop: '10px',
        fontSize: '12px',
        lineHeight: '1.5',
        opacity: '0.88',
      });
      body.textContent = index % 2 === 0 ? 'Hearts are rising through the interface again.' : 'This page has entered dramatic romance mode.';
      note.appendChild(body);

      wrap.appendChild(note);
    });

    const banner = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '24px',
      transform: 'translateX(-50%)',
      padding: '10px 18px',
      borderRadius: '999px',
      background: 'linear-gradient(135deg, rgba(255,77,141,0.92), rgba(255,143,171,0.92))',
      color: '#fff3f7',
      fontSize: '13px',
      fontWeight: '800',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      boxShadow: '0 14px 30px rgba(122,29,68,0.22)',
    });
    banner.textContent = 'Be Mine';
    wrap.appendChild(banner);

    const sparkCount = 4 + Math.round(ctx.intensity * 6);
    for (let i = 0; i < sparkCount; i++) {
      const spark = createEl('div', '', {
        position: 'absolute',
        left: `${12 + ctx.random() * 76}%`,
        top: `${18 + ctx.random() * 60}%`,
        fontSize: `${16 + ctx.random() * 10}px`,
        opacity: '0.62',
        lineHeight: '1',
      });
      spark.textContent = i % 2 === 0 ? '❤' : '✿';
      wrap.appendChild(spark);
    }

    banner.animate(
      [
        { transform: 'translateX(-50%) translateY(0px)' },
        { transform: 'translateX(-50%) translateY(-6px)' },
        { transform: 'translateX(-50%) translateY(0px)' },
      ],
      { duration: 1900 - Math.round(ctx.intensity * 240), iterations: Infinity, easing: 'ease-in-out' },
    );

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
