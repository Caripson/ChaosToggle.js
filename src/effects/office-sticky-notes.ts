import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const NOTES = [
  'TPS REPORT',
  '11:00 SYNC',
  'CALL IT',
  'SHIP TODAY',
  'COFFEE RUN',
  'FOLLOW UP',
];

const NOTE_COLORS = ['#ffe08a', '#ffd6a5', '#cdeac0', '#bde0fe'];

const effect: ChaosEffect = {
  id: 'officeStickyNotes',
  name: 'Office sticky notes',
  description: 'Sticky notes, reminders, and desk clutter pop into the corners like office chaos.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-office-sticky-notes', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      overflow: 'hidden',
      fontFamily: '"Segoe UI", ui-sans-serif, system-ui',
    });

    const positions = [
      { top: '18px', left: '20px', rotate: '-6deg' },
      { top: '18px', right: '26px', rotate: '5deg' },
      { bottom: '24px', left: '26px', rotate: '4deg' },
      { bottom: '28px', right: '18px', rotate: '-5deg' },
    ];

    positions.forEach((pos, index) => {
      const note = createEl('div', 'ct-office-sticky-notes__note', {
        position: 'absolute',
        width: '148px',
        minHeight: '110px',
        padding: '16px 14px',
        background: NOTE_COLORS[index % NOTE_COLORS.length]!,
        color: '#243447',
        boxShadow: '0 12px 26px rgba(15,23,42,0.18)',
        border: '1px solid rgba(36,52,71,0.12)',
        transform: `rotate(${pos.rotate})`,
        ...pos,
      });

      const pin = createEl('div', '', {
        position: 'absolute',
        top: '8px',
        right: '10px',
        fontSize: '18px',
      });
      pin.textContent = '📌';
      note.appendChild(pin);

      const heading = createEl('div', '', {
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        marginBottom: '10px',
      });
      heading.textContent = NOTES[index]!;
      note.appendChild(heading);

      const body = createEl('div', '', {
        fontSize: '12px',
        lineHeight: '1.45',
        opacity: '0.88',
      });
      body.textContent =
        index % 2 === 0 ? 'Please review before lunch. This somehow became urgent again.' : 'Reminder: yes, this is still a real meeting.';
      note.appendChild(body);

      wrap.appendChild(note);
    });

    const mug = createEl('div', '', {
      position: 'absolute',
      bottom: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '44px',
      filter: 'drop-shadow(0 8px 18px rgba(15,23,42,0.2))',
    });
    mug.textContent = '☕';
    wrap.appendChild(mug);

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
