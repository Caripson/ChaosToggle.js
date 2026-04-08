import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const crtShutdown: ChaosEffect = {
  id: 'crtShutdown',
  name: 'CRT shutdown',
  description: 'Vintage display collapse with phosphor flash.',
  category: 'visual',
  apply(ctx: EffectContext): () => void {
    const { root, intensity, duration, addNode } = ctx;
    const totalMs = clamp(duration * (0.35 + intensity * 0.25), 650, 4200);
    const sec = totalMs / 1000;

    root.classList.add('ct-crt-shutdown');
    root.style.animationDuration = `${sec}s`;
    root.style.animationTimingFunction = 'cubic-bezier(0.45, 0.02, 0.55, 0.98)';

    const flash = createEl('div', 'ct-crt-flash', {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483600',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.95) 0%, rgba(255,255,240,0.55) 35%, rgba(255,255,255,0) 72%)',
      opacity: '0',
      mixBlendMode: 'screen',
    });
    addNode(flash);

    const bloom = createEl('div', '', {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483599',
      pointerEvents: 'none',
      boxShadow: `inset 0 0 ${40 + intensity * 80}px rgba(120, 200, 255, ${0.15 + intensity * 0.25})`,
      opacity: '0',
    });
    addNode(bloom);

    const flashAnim = flash.animate(
      [
        { opacity: 0, filter: 'brightness(1)' },
        { opacity: 0.92, filter: 'brightness(2.2)', offset: 0.08 },
        { opacity: 0.35, filter: 'brightness(1.4)', offset: 0.18 },
        { opacity: 0, filter: 'brightness(1)', offset: 0.32 },
      ],
      { duration: Math.min(480, totalMs * 0.35), easing: 'ease-out', fill: 'forwards' },
    );

    const bloomAnim = bloom.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.06 },
        { opacity: 0.6, offset: 0.2 },
        { opacity: 0, offset: 0.45 },
      ],
      { duration: totalMs * 0.5, easing: 'ease-in-out', fill: 'forwards' },
    );

    const vignette = createEl('div', '', {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483598',
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
      opacity: '0',
    });
    addNode(vignette);
    const vigAnim = vignette.animate(
      [
        { opacity: 0 },
        { opacity: 0.5 + intensity * 0.35, offset: 0.4 },
        { opacity: 0.85, offset: 1 },
      ],
      { duration: totalMs, easing: 'ease-in', fill: 'forwards' },
    );

    return () => {
      flashAnim.cancel();
      bloomAnim.cancel();
      vigAnim.cancel();
      root.classList.remove('ct-crt-shutdown');
      root.style.animationDuration = '';
      root.style.animationTimingFunction = '';
      flash.remove();
      bloom.remove();
      vignette.remove();
    };
  },
};

export default crtShutdown;
