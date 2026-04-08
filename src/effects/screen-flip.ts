import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'screenFlip',
  name: 'Screen flip',
  description: 'Rotates the whole scope upside down.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    const prevTransform = root.style.transform;
    const prevTransition = root.style.transition;
    const ms = clamp(500 + ctx.duration * 0.2, 600, 2000);

    root.style.transition = `transform ${ms}ms cubic-bezier(0.45, 0, 0.2, 1)`;
    void root.offsetWidth;
    root.style.transform = 'rotate(180deg)';

    return () => {
      root.style.transition = 'none';
      root.style.transform = prevTransform;
      void root.offsetWidth;
      root.style.transition = prevTransition;
    };
  },
};

export default effect;
