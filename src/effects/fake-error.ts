import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const fakeErrorState: ChaosEffect = {
  id: 'fakeErrorState',
  name: 'Fake error',
  description: 'Applies a dramatic color shift reminiscent of a broken display.',
  category: 'prank',
  apply(ctx) {
    ctx.root.classList.add('ct-error');
    const overlay = createEl('div', 'ct-fake-error-overlay', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483001',
      background:
        'radial-gradient(circle at 50% 50%, rgba(255,60,60,0.14), transparent 32%), repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)',
      mixBlendMode: 'screen',
      opacity: String(0.4 + ctx.intensity * 0.18),
    });
    let animation: Animation | null = null;
    if (typeof overlay.animate === 'function') {
      animation = overlay.animate(
        [
          { opacity: Number(overlay.style.opacity) - 0.06, filter: 'blur(0px)' },
          { opacity: Number(overlay.style.opacity) + 0.08, filter: 'blur(0.4px)' },
          { opacity: Number(overlay.style.opacity) - 0.02, filter: 'blur(0px)' },
        ],
        { duration: 220, iterations: Infinity, easing: 'steps(2, end)' },
      );
    }
    ctx.addNode(overlay);
    return () => {
      animation?.cancel();
      overlay.remove();
      ctx.root.classList.remove('ct-error');
    };
  },
};

export default fakeErrorState;
