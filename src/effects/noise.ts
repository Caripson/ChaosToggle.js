import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const noise: ChaosEffect = {
  id: 'noise',
  name: 'Noise',
  description: 'Film-grain style noise overlay.',
  category: 'overlay',
  apply(ctx) {
    ctx.addNode(createEl('div', 'ct-layer ct-noise'));
  },
};

export default noise;
