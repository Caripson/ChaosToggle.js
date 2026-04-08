import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp } from '../core/utils';

const rgbSplit: ChaosEffect = {
  id: 'rgbSplit',
  name: 'RGB split',
  description: 'Chromatic aberration across the scoped root.',
  category: 'visual',
  apply(ctx: EffectContext): () => void {
    const { root, intensity } = ctx;
    const spread = clamp(1.5 + intensity * 14, 1.5, 18);
    const blur = clamp(intensity * 0.35, 0, 0.45);
    const prevFilter = root.style.filter;
    const prevMix = root.style.mixBlendMode;

    root.style.filter = [
      `drop-shadow(${spread}px 0 0 rgba(255, 0, 60, ${0.55 + intensity * 0.35}))`,
      `drop-shadow(${-spread * 0.92}px 0 0 rgba(0, 220, 255, ${0.5 + intensity * 0.35}))`,
      `drop-shadow(0 ${spread * 0.35}px 0 rgba(255, 255, 0, ${0.2 + intensity * 0.25}))`,
      blur > 0 ? `blur(${blur}px)` : '',
    ]
      .filter(Boolean)
      .join(' ');

    if (intensity > 0.55) root.style.mixBlendMode = 'screen';

    return () => {
      root.style.filter = prevFilter;
      root.style.mixBlendMode = prevMix;
    };
  },
};

export default rgbSplit;
