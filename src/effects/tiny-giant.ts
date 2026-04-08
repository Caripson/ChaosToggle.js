import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

function collect(root: HTMLElement): HTMLElement[] {
  const sel = 'p, h1, h2, h3, img, button, a, li, span';
  const els = Array.from(root.querySelectorAll(sel)) as HTMLElement[];
  const vis = els.filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 4 && r.height > 4;
  });
  for (let i = vis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vis[i], vis[j]] = [vis[j], vis[i]];
  }
  return vis.slice(0, 10);
}

const effect: ChaosEffect = {
  id: 'tinyGiantMode',
  name: 'Tiny / giant mode',
  description: 'Random elements balloon or shrink.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const picks = collect(ctx.root);
    const prevTransform: string[] = [];
    const prevTransition: string[] = [];
    const ms = clamp(320 + ctx.duration * 0.12, 400, 1200);

    for (const el of picks) {
      prevTransform.push(el.style.transform);
      prevTransition.push(el.style.transition);
      const giant = Math.random() < 0.5;
      const s = giant ? 2 + Math.random() : 0.3 + Math.random() * 0.2;
      el.style.transition = `transform ${ms}ms cubic-bezier(0.45, 0, 0.2, 1.4)`;
      el.style.transform = `scale(${s})`;
      el.style.transformOrigin = 'center center';
    }

    return () => {
      for (let i = 0; i < picks.length; i++) {
        const el = picks[i];
        el.style.transition = 'none';
        el.style.transform = prevTransform[i] || '';
        el.style.transformOrigin = '';
        void el.offsetWidth;
        el.style.transition = prevTransition[i] || '';
      }
    };
  },
};

export default effect;
