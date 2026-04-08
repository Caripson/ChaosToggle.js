import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const glitchOverlay: ChaosEffect = {
  id: 'glitchOverlay',
  name: 'Glitch overlay',
  description: 'Full-screen scanline-style glitch layer.',
  category: 'overlay',
  apply(ctx) {
    ctx.addNode(createEl('div', 'ct-layer ct-glitch'));
  },
};

export default glitchOverlay;
