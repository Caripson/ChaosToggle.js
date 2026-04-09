import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'screenFlip',
  name: 'Screen flip',
  description: 'Rotates the whole scope with a 3D card-flip feel.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    const prevTransform = root.style.transform;
    const prevTransition = root.style.transition;
    const prevTransformStyle = root.style.transformStyle;
    const prevBackfaceVisibility = root.style.backfaceVisibility;
    const ms = clamp(500 + ctx.duration * 0.2, 600, 2000);

    root.style.transition = `transform ${ms}ms cubic-bezier(0.45, 0, 0.2, 1)`;
    root.style.transformStyle = 'preserve-3d';
    root.style.backfaceVisibility = 'hidden';
    void root.offsetWidth;
    root.style.transform = 'perspective(1200px) rotateX(180deg) rotateY(8deg)';

    return () => {
      root.style.transition = 'none';
      root.style.transform = prevTransform;
      root.style.transformStyle = prevTransformStyle;
      root.style.backfaceVisibility = prevBackfaceVisibility;
      void root.offsetWidth;
      root.style.transition = prevTransition;
    };
  },
};

export default effect;
