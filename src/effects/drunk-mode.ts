import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const effect: ChaosEffect = {
  id: 'drunkMode',
  name: 'Drunk mode',
  description: 'Blurry vision and a tipsy wobble.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const root = ctx.root;
    root.classList.add('ct-drunk');
    const prevTransform = root.style.transform;
    const prevTransition = root.style.transition;
    root.style.transition = 'transform 0.12s ease-out';

    const tick = () => {
      const k = clamp(ctx.intensity, 0.15, 1);
      const dx = (Math.random() - 0.5) * 10 * k;
      const dy = (Math.random() - 0.5) * 8 * k;
      const rot = (Math.random() - 0.5) * 3.2 * k;
      root.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
    };

    tick();
    const id = window.setInterval(tick, 200);
    ctx.addTimer(id);

    return () => {
      clearInterval(id);
      root.classList.remove('ct-drunk');
      root.style.transition = 'none';
      root.style.transform = prevTransform;
      void root.offsetWidth;
      root.style.transition = prevTransition;
    };
  },
};

export default effect;
