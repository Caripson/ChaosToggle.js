import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'delayedClicks',
  name: 'Delayed clicks',
  description: 'Clicks pause on a loading cursor before they fire.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    let replay = false;

    const onClick = (e: MouseEvent) => {
      if (replay) return;
      if (e.button !== 0) return;
      const path = e.composedPath();
      const hit = path.find((n): n is HTMLElement => n instanceof HTMLElement && ctx.root.contains(n));
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const delay = 200 + Math.random() * 600 * clamp(0.7 + ctx.intensity * 0.3, 0.5, 1.2);
      const prev = document.documentElement.style.cursor;
      document.documentElement.style.cursor = 'wait';

      window.setTimeout(() => {
        document.documentElement.style.cursor = prev;
        replay = true;
        try {
          (hit as HTMLElement).click();
        } finally {
          replay = false;
        }
      }, delay);
    };

    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.documentElement.style.cursor = '';
    };
  },
};

export default effect;
