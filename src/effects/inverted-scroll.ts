import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

function findVerticalScroller(start: Element | null, root: HTMLElement): HTMLElement | null {
  let n: Element | null = start instanceof Element ? start : null;
  while (n) {
    if (!root.contains(n)) break;
    if (n instanceof HTMLElement) {
      const st = getComputedStyle(n);
      const canY = n.scrollHeight - n.clientHeight > 2 && /(auto|scroll|overlay)/.test(st.overflowY);
      if (canY) return n;
    }
    n = n.parentElement;
  }
  if (root === document.body) return (document.scrollingElement as HTMLElement) || document.documentElement;
  return root.scrollHeight - root.clientHeight > 2 ? root : null;
}

function findHorizontalScroller(start: Element | null, root: HTMLElement): HTMLElement | null {
  let n: Element | null = start instanceof Element ? start : null;
  while (n) {
    if (!root.contains(n)) break;
    if (n instanceof HTMLElement) {
      const st = getComputedStyle(n);
      const canX = n.scrollWidth - n.clientWidth > 2 && /(auto|scroll|overlay)/.test(st.overflowX);
      if (canX) return n;
    }
    n = n.parentElement;
  }
  if (root === document.body) return (document.scrollingElement as HTMLElement) || document.documentElement;
  return root.scrollWidth - root.clientWidth > 2 ? root : null;
}

const effect: ChaosEffect = {
  id: 'invertedScroll',
  name: 'Inverted scroll',
  description: 'Wheel direction feels backwards.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const sens = clamp(0.85 + ctx.intensity * 0.35, 0.6, 1.4);

    const onWheel = (e: WheelEvent) => {
      if (!ctx.root.contains(e.target as Node)) return;
      let dy = e.deltaY * sens;
      let dx = e.deltaX * sens;
      if (e.deltaMode === 1) {
        dy *= 16;
        dx *= 16;
      } else if (e.deltaMode === 2) {
        const host =
          findVerticalScroller(e.target as Element, ctx.root) ||
          findHorizontalScroller(e.target as Element, ctx.root) ||
          document.documentElement;
        dy *= host.clientHeight || window.innerHeight;
        dx *= host.clientWidth || window.innerWidth;
      }

      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
        const host = findVerticalScroller(e.target as Element, ctx.root);
        if (host) {
          e.preventDefault();
          host.scrollTop -= dy;
        }
      } else {
        const host = findHorizontalScroller(e.target as Element, ctx.root);
        if (host) {
          e.preventDefault();
          host.scrollLeft -= dx;
        }
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false, capture: true });

    return () => {
      document.removeEventListener('wheel', onWheel, true);
    };
  },
};

export default effect;
