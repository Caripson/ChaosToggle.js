import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp } from '../core/utils';

function collect(root: HTMLElement): HTMLElement[] {
  const sel = 'p, h1, h2, h3, img, button, a, li, span';
  const els = Array.from(root.querySelectorAll(sel)) as HTMLElement[];
  const vis = els.filter(el => {
    const r = el.getBoundingClientRect();
    return r.width > 4 && r.height > 4;
  });
  for (let i = vis.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [vis[i], vis[j]] = [vis[j], vis[i]];
  }
  return vis.slice(0, 10);
}

const effect: ChaosEffect = {
  id: 'tinyGiantMode',
  name: 'Tiny / giant mode',
  description: 'Quantum-style grow/shrink with depth pulses and jitter.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const picks = collect(ctx.root);
    const prevTransform: string[] = [];
    const prevTransition: string[] = [];
    const prevTransformOrigin: string[] = [];
    const prevWillChange: string[] = [];
    const prevFilter: string[] = [];
    const ms = clamp(320 + ctx.duration * 0.12, 400, 1200);

    for (const el of picks) {
      prevTransform.push(el.style.transform);
      prevTransition.push(el.style.transition);
      prevTransformOrigin.push(el.style.transformOrigin);
      prevWillChange.push(el.style.willChange);
      prevFilter.push(el.style.filter);
      const giant = ctx.random() < 0.5;
      const s = giant ? 1.9 + ctx.random() * 1.25 : 0.28 + ctx.random() * 0.25;
      const tiltX = (ctx.random() - 0.5) * 18;
      const tiltY = (ctx.random() - 0.5) * 18;
      const depth = giant ? 22 : -8;
      el.style.transition = `transform ${ms}ms cubic-bezier(0.45, 0, 0.2, 1.4)`;
      el.style.transform = `perspective(900px) translateZ(${depth}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(${s})`;
      el.style.transformOrigin = 'center center';
      el.style.willChange = 'transform, filter';
      el.style.filter = giant ? 'drop-shadow(0 14px 22px rgba(0,0,0,.18))' : 'drop-shadow(0 4px 10px rgba(0,0,0,.1))';

      const pulseTimer = window.setTimeout(() => {
        const pulseTiltX = tiltX * -0.35;
        const pulseTiltY = tiltY * 0.35;
        const pulseDepth = giant ? 38 : -14;
        el.style.transform = `perspective(900px) translateZ(${pulseDepth}px) rotateX(${pulseTiltX.toFixed(2)}deg) rotateY(${pulseTiltY.toFixed(2)}deg) scale(${(s * (giant ? 1.06 : 0.94)).toFixed(3)})`;
      }, Math.floor(ms * 0.55));
      ctx.addTimer(pulseTimer);
    }

    return () => {
      for (let i = 0; i < picks.length; i++) {
        const el = picks[i];
        el.style.transition = 'none';
        el.style.transform = prevTransform[i] || '';
        el.style.transformOrigin = prevTransformOrigin[i] || '';
        el.style.willChange = prevWillChange[i] || '';
        el.style.filter = prevFilter[i] || '';
        void el.offsetWidth;
        el.style.transition = prevTransition[i] || '';
      }
    };
  },
};

export default effect;
