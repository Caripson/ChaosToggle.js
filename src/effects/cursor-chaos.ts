import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const CURSORS = ['wait', 'crosshair', 'move', 'not-allowed', 'progress', 'help', 'grab', 'grabbing', 'zoom-in', 'zoom-out', 'cell', 'alias'];

const effect: ChaosEffect = {
  id: 'cursorChaos',
  name: 'Cursor chaos',
  description: 'Rainbow crumbs and restless pointer styles.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    const prev = root.style.cursor;
    let moveCount = 0;

    const onMove = (e: MouseEvent) => {
      moveCount++;
      if (moveCount % 3 === 0) {
        root.style.cursor = CURSORS[Math.floor(Math.random() * CURSORS.length)];
      }

      const sz = 6 + clamp(ctx.intensity, 0, 1) * 10;
      const half = sz / 2;
      const dot = createEl('div', '', {
        position: 'fixed',
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        width: `${sz}px`,
        height: `${sz}px`,
        marginLeft: `-${half}px`,
        marginTop: `-${half}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '2147483600',
        background: `hsl(${Math.random() * 360},85%,55%)`,
        boxShadow: `0 0 8px ${ctx.palette.accent}`,
        opacity: '0.95',
      });
      ctx.addNode(dot);

      dot.animate([{ opacity: 0.95, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.2)' }], {
        duration: 500,
        easing: 'ease-out',
      }).onfinish = () => dot.remove();
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      root.style.cursor = prev;
    };
  },
};

export default effect;
