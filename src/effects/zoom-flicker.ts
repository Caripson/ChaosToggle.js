import type { ChaosEffect } from '../core/types';

const zoomFlicker: ChaosEffect = {
  id: 'zoomFlicker',
  name: 'Zoom flicker',
  description: 'Subtle scale pulse on the scoped root.',
  category: 'visual',
  apply(ctx) {
    ctx.root.classList.add('ct-zoom');
    return () => {
      ctx.root.classList.remove('ct-zoom');
    };
  },
};

export default zoomFlicker;
