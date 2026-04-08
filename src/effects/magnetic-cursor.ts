import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const RADIUS = 150;

function collect(root: HTMLElement): HTMLElement[] {
  const sel = 'button, a, h1, h2, h3, p, img, span, label';
  return Array.from(root.querySelectorAll(sel)) as HTMLElement[];
}

const effect: ChaosEffect = {
  id: 'magneticCursor',
  name: 'Magnetic cursor',
  description: 'Nearby elements creep toward the pointer.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const els = collect(ctx.root);
    const strength = 0.35 + 0.65 * clamp(ctx.intensity, 0, 1);
    let mx = 0;
    let my = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.hypot(dx, dy);
        if (d < RADIUS && d > 1) {
          const pull = (1 - d / RADIUS) * strength * 22;
          const nx = (dx / d) * pull;
          const ny = (dy / d) * pull;
          el.style.transform = `translate(${nx}px, ${ny}px)`;
        } else {
          el.style.transform = '';
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      for (const el of els) el.style.transform = '';
    };
  },
};

export default effect;
