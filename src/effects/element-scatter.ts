import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

function isVisible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return false;
  const st = getComputedStyle(el);
  if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
  return true;
}

function collectTargets(root: HTMLElement): HTMLElement[] {
  const base = Array.from(root.querySelectorAll('p, h1, h2, h3, img, button, a')) as HTMLElement[];
  const divs = Array.from(root.querySelectorAll('div')).filter(d => {
    const t = d.textContent?.trim();
    return !!t && t.length > 0 && isVisible(d);
  });
  const merged = [...base, ...divs].filter(isVisible);
  const seen = new Set<HTMLElement>();
  const out: HTMLElement[] = [];
  for (const el of merged) {
    if (seen.has(el)) continue;
    seen.add(el);
    out.push(el);
  }
  return out.slice(0, 18);
}

const effect: ChaosEffect = {
  id: 'elementScatter',
  name: 'Element scatter',
  description: 'Flings pieces off-screen with spin.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const targets = collectTargets(ctx.root);
    const anims: Animation[] = [];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dur = clamp(ctx.duration * 0.85, 600, 4000);

    for (const el of targets) {
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      let vx = ex - cx;
      let vy = ey - cy;
      const len = Math.hypot(vx, vy) || 1;
      vx /= len;
      vy /= len;
      const dist = Math.max(window.innerWidth, window.innerHeight) * (1.1 + Math.random() * 0.6);
      const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720) * (0.5 + ctx.intensity * 0.5);
      const tx = vx * dist;
      const ty = vy * dist;

      const prev = el.style.transform;
      const prevOrigin = el.style.transformOrigin;
      el.style.transformOrigin = `${cx - r.left}px ${cy - r.top}px`;

      const anim = el.animate(
        [
          { transform: 'translate(0px, 0px) rotate(0deg)' },
          { transform: `translate(${tx}px, ${ty}px) rotate(${spin}deg)` },
        ],
        {
          duration: dur,
          easing: 'cubic-bezier(0.1, 0.6, 0.2, 1)',
          fill: 'forwards',
        },
      );
      anims.push(anim);
    }

    return () => {
      for (const a of anims) a.cancel();
      for (let i = 0; i < targets.length; i++) {
        const el = targets[i];
        el.style.transform = '';
        el.style.transformOrigin = '';
      }
    };
  },
};

export default effect;
