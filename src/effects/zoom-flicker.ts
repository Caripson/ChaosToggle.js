import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp } from '../core/utils';

const zoomFlicker: ChaosEffect = {
  id: 'zoomFlicker',
  name: 'Zoom flicker',
  description: 'Pulse zoom with prism glow and pointer-reactive 3D tilt.',
  category: 'visual',
  apply(ctx: EffectContext) {
    const root = ctx.root;
    const maxTilt = 6 + ctx.intensity * 7;
    const updateTilt = (xRatio: number, yRatio: number) => {
      const tiltX = clamp((0.5 - yRatio) * maxTilt * 2, -maxTilt, maxTilt);
      const tiltY = clamp((xRatio - 0.5) * maxTilt * 2, -maxTilt, maxTilt);
      root.style.setProperty('--ct-zoom-tilt-x', `${tiltX.toFixed(2)}deg`);
      root.style.setProperty('--ct-zoom-tilt-y', `${tiltY.toFixed(2)}deg`);
    };

    const onPointerMove = (event: PointerEvent) => {
      const xRatio = window.innerWidth > 0 ? event.clientX / window.innerWidth : 0.5;
      const yRatio = window.innerHeight > 0 ? event.clientY / window.innerHeight : 0.5;
      updateTilt(xRatio, yRatio);
    };

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.beta !== 'number' || typeof event.gamma !== 'number') return;
      const xRatio = clamp((event.gamma + 45) / 90, 0, 1);
      const yRatio = clamp((event.beta + 45) / 90, 0, 1);
      updateTilt(xRatio, yRatio);
    };

    root.classList.add('ct-zoom', 'ct-zoom-3d', 'ct-zoom-prism');
    updateTilt(ctx.random(), ctx.random());
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      root.classList.remove('ct-zoom', 'ct-zoom-3d', 'ct-zoom-prism');
      root.style.removeProperty('--ct-zoom-tilt-x');
      root.style.removeProperty('--ct-zoom-tilt-y');
    };
  },
};

export default zoomFlicker;
