import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const flashOverlay: ChaosEffect = {
  id: 'flashOverlay',
  name: 'Flash overlay',
  description: 'Pulsing bright flash across the viewport.',
  category: 'overlay',
  apply(ctx) {
    ctx.addNode(createEl('div', 'ct-layer ct-flash'));
  },
};

export default flashOverlay;
