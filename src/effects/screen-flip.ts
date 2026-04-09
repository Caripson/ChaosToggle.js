import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'screenFlip',
  name: 'Screen flip',
  description: 'Cinematic 3D portal flip with elastic overshoot.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    const prevTransform = root.style.transform;
    const prevTransition = root.style.transition;
    const prevTransformStyle = root.style.transformStyle;
    const prevBackfaceVisibility = root.style.backfaceVisibility;
    const prevWillChange = root.style.willChange;
    const prevFilter = root.style.filter;
    const ms = clamp(500 + ctx.duration * 0.2, 600, 2000);
    const overlay = createEl('div', 'ct-layer ct-screenflip-vortex');
    ctx.addNode(overlay);

    root.style.transformStyle = 'preserve-3d';
    root.style.backfaceVisibility = 'hidden';
    root.style.willChange = 'transform, filter';
    root.style.filter = 'saturate(1.05) contrast(1.02)';

    let animation: Animation | null = null;
    if (typeof root.animate === 'function') {
      animation = root.animate(
        [
          { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)', offset: 0 },
          { transform: 'perspective(1200px) rotateX(120deg) rotateY(14deg) scale(0.985)', offset: 0.38 },
          { transform: 'perspective(1200px) rotateX(196deg) rotateY(-8deg) scale(1.015)', offset: 0.78 },
          { transform: 'perspective(1200px) rotateX(180deg) rotateY(6deg) scale(1)', offset: 1 },
        ],
        { duration: ms, easing: 'cubic-bezier(0.22, 0.8, 0.2, 1)', fill: 'forwards' },
      );
    } else {
      root.style.transition = `transform ${ms}ms cubic-bezier(0.22, 0.8, 0.2, 1)`;
      void root.offsetWidth;
      root.style.transform = 'perspective(1200px) rotateX(180deg) rotateY(6deg)';
    }

    return () => {
      animation?.cancel();
      root.style.transition = 'none';
      root.style.transform = prevTransform;
      root.style.transformStyle = prevTransformStyle;
      root.style.backfaceVisibility = prevBackfaceVisibility;
      root.style.willChange = prevWillChange;
      root.style.filter = prevFilter;
      void root.offsetWidth;
      root.style.transition = prevTransition;
    };
  },
};

export default effect;
