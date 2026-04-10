import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const noise: ChaosEffect = {
  id: 'noise',
  name: 'Noise',
  description: 'Film-grain style noise overlay.',
  category: 'overlay',
  apply(ctx) {
    const layer = createEl('div', 'ct-layer ct-noise');
    Object.assign(layer.style, {
      opacity: String(0.24 + ctx.intensity * 0.16),
      mixBlendMode: 'overlay',
      backgroundSize: '2px 2px',
      filter: `contrast(${1.08 + ctx.intensity * 0.34}) saturate(${1 + ctx.intensity * 0.08})`,
    } as CSSStyleDeclaration);

    let animation: Animation | null = null;
    if (typeof layer.animate === 'function') {
      animation = layer.animate(
        [
          { transform: 'translate3d(0, 0, 0)', opacity: Number(layer.style.opacity) },
          { transform: 'translate3d(-1px, 1px, 0)', opacity: Number(layer.style.opacity) + 0.06 },
          { transform: 'translate3d(1px, -1px, 0)', opacity: Number(layer.style.opacity) - 0.03 },
        ],
        { duration: 180, iterations: Infinity, easing: 'steps(3, end)' },
      );
    }

    ctx.addNode(layer);
    return () => {
      animation?.cancel();
      layer.remove();
    };
  },
};

export default noise;
