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
  const sel = 'p, h1, h2, h3, img, button, a';
  const base = Array.from(root.querySelectorAll(sel)) as HTMLElement[];
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
  return out;
}

const effect: ChaosEffect = {
  id: 'gravity',
  name: 'Gravity',
  description: 'Clones visible blocks and lets them fall with goofy physics.',
  category: 'dom',
  apply(ctx: EffectContext): () => void {
    const pool = collectTargets(ctx.root);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const max = 15;
    const targets = pool.slice(0, max);
    const holder = createEl('div', '', {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '2147483000',
    });
    ctx.addNode(holder);
    const clones: HTMLElement[] = [];
    const states: Array<{ el: HTMLElement; prev: string }> = [];

    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.cssText = '';
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        boxSizing: 'border-box',
        zIndex: '2147483000',
        pointerEvents: 'none',
        transition: 'none',
      });
      holder.appendChild(clone);
      clones.push(clone);
      states.push({ el, prev: el.style.visibility });
      el.style.visibility = 'hidden';
    }

    const g = 0.45 + 0.35 * clamp(ctx.intensity, 0, 1);
    const start = performance.now();
    let raf = 0;
    const velocities = targets.map(() => ({
      vx: (Math.random() - 0.5) * 1.2,
      vy: -2 - Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    }));

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = elapsed / 1000;
      for (let i = 0; i < clones.length; i++) {
        const c = clones[i];
        const v = velocities[i];
        v.vy += g;
        v.phase += 0.08;
        const wobble = Math.sin(v.phase + t * 6) * (1.2 + ctx.intensity * 2);
        const left = parseFloat(c.style.left) || 0;
        const top = parseFloat(c.style.top) || 0;
        c.style.left = `${left + v.vx + wobble * 0.12}px`;
        c.style.top = `${top + v.vy}px`;
      }
      if (elapsed < ctx.duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const restore = () => {
      cancelAnimationFrame(raf);
      holder.remove();
      for (const { el, prev } of states) {
        el.style.visibility = prev;
      }
    };

    const endId = window.setTimeout(restore, ctx.duration);
    ctx.addTimer(endId);

    return () => {
      clearTimeout(endId);
      restore();
    };
  },
};

export default effect;
