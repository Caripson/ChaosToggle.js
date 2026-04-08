import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'cursorDrift',
  name: 'Cursor drift',
  description: 'Fake pointer slowly wanders away from the real one.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    const prevCursor = root.style.cursor;
    root.style.cursor = 'none';

    const fake = createEl('div', '', {
      position: 'fixed',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: `2px solid ${ctx.palette.accent}`,
      boxShadow: `0 0 6px ${ctx.palette.primary}`,
      pointerEvents: 'none',
      zIndex: '2147483640',
      left: '0',
      top: '0',
      marginLeft: '-7px',
      marginTop: '-7px',
    });
    ctx.addNode(fake);

    let rx = 0;
    let ry = 0;
    const start = performance.now();
    const speed = 6 + ctx.intensity * 28;

    const onMove = (e: MouseEvent) => {
      rx = e.clientX;
      ry = e.clientY;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const cap = clamp(12 + t * speed, 12, 140);
      const ox = Math.sin(t * 1.1) * cap * 0.45 + t * 14 * ctx.intensity;
      const oy = Math.cos(t * 0.85) * cap * 0.4 - t * 9 * ctx.intensity;
      fake.style.left = `${rx + ox}px`;
      fake.style.top = `${ry + oy}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      fake.remove();
      root.style.cursor = prevCursor;
    };
  },
};

export default effect;
