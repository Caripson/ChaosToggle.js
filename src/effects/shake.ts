import type { ChaosEffect } from '../core/types';

const SHAKE_CLASS: Record<string, string> = {
  default: 'ct-shake',
  rumble: 'ct-shake-rumble',
  wobble: 'ct-shake-wobble',
  float: 'ct-shake-float',
};

const shake: ChaosEffect = {
  id: 'shake',
  name: 'Shake',
  description: 'Shakes the scoped root using the active shake animation style.',
  category: 'visual',
  apply(ctx) {
    const key = (ctx.root.dataset.ctShakeStyle || 'default').toLowerCase();
    const cls = SHAKE_CLASS[key] || 'ct-shake';
    ctx.root.classList.add(cls);
    return () => {
      ctx.root.classList.remove(cls);
    };
  },
};

export default shake;
