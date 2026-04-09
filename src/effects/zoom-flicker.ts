import type { ChaosEffect } from '../core/types';

const zoomFlicker: ChaosEffect = {
  id: 'zoomFlicker',
  name: 'Zoom flicker',
  description: 'Subtle scale pulse with a light 3D tilt on the scoped root.',
  category: 'visual',
  apply(ctx) {
    ctx.root.classList.add('ct-zoom', 'ct-zoom-3d');
    return () => {
      ctx.root.classList.remove('ct-zoom', 'ct-zoom-3d');
    };
  },
};

export default zoomFlicker;
