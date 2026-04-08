import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

function isVisible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return false;
  const st = getComputedStyle(el);
  if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
  return true;
}

function collect(root: HTMLElement): HTMLElement[] {
  const sel = 'button, a, h1, h2, h3, h4, p';
  const els = Array.from(root.querySelectorAll(sel)) as HTMLElement[];
  return els.filter(isVisible).slice(0, 40);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const effect: ChaosEffect = {
  id: 'elementShuffle',
  name: 'Element shuffle',
  description: 'Swaps on-screen positions of headings, text, and controls.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const elements = collect(ctx.root);
    if (elements.length < 2) return () => {};

    const rects = elements.map(el => el.getBoundingClientRect());
    const order = shuffle(rects.map((_, i) => i));

    const prevTransition: string[] = [];
    const prevTransform: string[] = [];

    const ms = clamp(400 + ctx.duration * 0.15, 500, 1600);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      prevTransition.push(el.style.transition);
      prevTransform.push(el.style.transform);
      const from = rects[i];
      const to = rects[order[i]];
      const dx = to.left - from.left;
      const dy = to.top - from.top;
      el.style.willChange = 'transform';
      el.style.transition = 'none';
      el.style.transform = 'translate(0px, 0px)';
      void el.offsetWidth;
      el.style.transition = `transform ${ms}ms cubic-bezier(0.34, 1.2, 0.64, 1)`;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    return () => {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        el.style.transition = 'none';
        el.style.transform = prevTransform[i] || '';
        void el.offsetWidth;
        el.style.transition = prevTransition[i] || '';
        el.style.willChange = '';
      }
    };
  },
};

export default effect;
