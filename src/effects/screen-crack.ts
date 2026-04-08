import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp } from '../core/utils';

function rayPath(cx: number, cy: number, angle: number, segments: number, length: number, noise: number, seed: number): string {
  const parts: string[] = [`M ${cx} ${cy}`];
  let x = cx;
  let y = cy;
  let a = angle;
  const segLen = length / segments;
  for (let i = 0; i < segments; i++) {
    const w = (Math.sin(seed * 1.3 + i * 1.7) + Math.cos(seed * 0.8 + i)) * 0.5 * noise;
    a += w * 0.38;
    x += Math.cos(a) * segLen * (0.75 + Math.random() * 0.45);
    y += Math.sin(a) * segLen * (0.75 + Math.random() * 0.45);
    parts.push(`L ${x.toFixed(3)} ${y.toFixed(3)}`);
  }
  return parts.join(' ');
}

const screenCrack: ChaosEffect = {
  id: 'screenCrack',
  name: 'Screen crack',
  description: 'Shattered-glass fracture lines from a central impact.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const { intensity, addNode } = ctx;
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('class', 'ct-screen-crack');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    Object.assign(svg.style, {
      opacity: '0',
      transition: 'opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
    });

    const filterId = `ct-crack-${Math.random().toString(36).slice(2, 11)}`;
    const defs = document.createElementNS(svgNs, 'defs');
    const filt = document.createElementNS(svgNs, 'filter');
    filt.setAttribute('id', filterId);
    const blur = document.createElementNS(svgNs, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', String(0.08 + intensity * 0.22));
    blur.setAttribute('result', 'blur');
    filt.appendChild(blur);
    const merge = document.createElementNS(svgNs, 'feMerge');
    const mn0 = document.createElementNS(svgNs, 'feMergeNode');
    mn0.setAttribute('in', 'blur');
    const mn1 = document.createElementNS(svgNs, 'feMergeNode');
    mn1.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn0);
    merge.appendChild(mn1);
    filt.appendChild(merge);
    defs.appendChild(filt);
    svg.appendChild(defs);

    const cx = 46 + Math.random() * 10;
    const cy = 38 + Math.random() * 16;
    const rays = 14 + Math.floor(intensity * 16);
    const noise = 0.42 + intensity * 0.78;
    const baseLen = 50 + intensity * 24;

    const addRay = (ox: number, oy: number, ang: number, segs: number, len: number, w: number, op: number, seed: number): void => {
      const d = rayPath(ox, oy, ang, segs, len, noise, seed);
      const path = document.createElementNS(svgNs, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(245,248,255,0.94)');
      path.setAttribute('stroke-width', String(w));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', String(op));
      path.setAttribute('filter', `url(#${filterId})`);
      svg.appendChild(path);
    };

    for (let r = 0; r < rays; r++) {
      const angle = (r / rays) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
      const segs = 8 + Math.floor(intensity * 9);
      const len = baseLen * (0.68 + Math.random() * 0.52);
      const w = 0.09 + Math.random() * 0.22 + (1 - r / rays) * 0.1;
      const op = clamp(0.48 + Math.random() * 0.48, 0.42, 0.98);
      addRay(cx, cy, angle, segs, len, w, op, r * 97 + intensity * 50);
    }

    const branchCount = 4 + Math.floor(intensity * 8);
    for (let b = 0; b < branchCount; b++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 22 + intensity * 12;
      const ox = cx + Math.cos(ang) * dist;
      const oy = cy + Math.sin(ang) * dist;
      const out = ang + (Math.random() - 0.5) * 1.4;
      addRay(ox, oy, out, 5 + Math.floor(intensity * 5), baseLen * (0.28 + Math.random() * 0.22), 0.06 + Math.random() * 0.1, 0.35 + Math.random() * 0.35, b * 51 + 200);
    }

    const impact = document.createElementNS(svgNs, 'circle');
    impact.setAttribute('cx', String(cx));
    impact.setAttribute('cy', String(cy));
    impact.setAttribute('r', String(0.32 + intensity * 0.55));
    impact.setAttribute('fill', 'rgba(255,255,255,0.98)');
    impact.setAttribute('stroke', 'rgba(210,220,240,0.55)');
    impact.setAttribute('stroke-width', '0.07');
    svg.appendChild(impact);

    const halo = document.createElementNS(svgNs, 'circle');
    halo.setAttribute('cx', String(cx));
    halo.setAttribute('cy', String(cy));
    halo.setAttribute('r', String(1.1 + intensity * 1.6));
    halo.setAttribute('fill', 'none');
    halo.setAttribute('stroke', 'rgba(255,255,255,0.22)');
    halo.setAttribute('stroke-width', '0.12');
    svg.appendChild(halo);

    addNode(svg as unknown as HTMLElement);
    requestAnimationFrame(() => {
      svg.style.opacity = '1';
    });

    return () => {
      svg.remove();
    };
  },
};

export default screenCrack;
