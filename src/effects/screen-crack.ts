import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

function rayPath(
  cx: number,
  cy: number,
  angle: number,
  segments: number,
  length: number,
  noise: number,
  seed: number,
  random: () => number,
): string {
  const parts: string[] = [`M ${cx} ${cy}`];
  let x = cx;
  let y = cy;
  let a = angle;
  const segLen = length / segments;
  for (let i = 0; i < segments; i += 1) {
    const wobble = (Math.sin(seed * 1.3 + i * 1.7) + Math.cos(seed * 0.8 + i)) * 0.5 * noise;
    a += wobble * 0.38;
    x += Math.cos(a) * segLen * (0.78 + random() * 0.42);
    y += Math.sin(a) * segLen * (0.78 + random() * 0.42);
    parts.push(`L ${x.toFixed(3)} ${y.toFixed(3)}`);
  }
  return parts.join(' ');
}

function polar(cx: number, cy: number, angle: number, radius: number): { x: number; y: number } {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

const screenCrack: ChaosEffect = {
  id: 'screenCrack',
  name: 'Screen crack',
  description: 'Shattered-glass fracture lines from a central impact.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const host = createEl('div', 'ct-screen-crack');
    Object.assign(host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483002',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
      overflow: 'hidden',
    } as CSSStyleDeclaration);

    const impactFlash = createEl('div', 'ct-screen-crack__impact');
    const cx = 46 + ctx.random() * 10;
    const cy = 36 + ctx.random() * 18;
    Object.assign(impactFlash.style, {
      position: 'absolute',
      left: `${cx}%`,
      top: `${cy}%`,
      width: `${110 + ctx.intensity * 110}px`,
      height: `${110 + ctx.intensity * 110}px`,
      marginLeft: `${-(55 + ctx.intensity * 55)}px`,
      marginTop: `${-(55 + ctx.intensity * 55)}px`,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.32), rgba(255,255,255,0.08) 28%, rgba(255,255,255,0) 68%)',
      filter: `blur(${8 + ctx.intensity * 10}px)`,
      opacity: String(0.5 + ctx.intensity * 0.22),
    } as CSSStyleDeclaration);
    host.appendChild(impactFlash);

    const vignette = createEl('div', 'ct-screen-crack__vignette');
    Object.assign(vignette.style, {
      position: 'absolute',
      inset: '0',
      background: 'radial-gradient(circle at center, rgba(255,255,255,0) 42%, rgba(0,0,0,0.12) 100%)',
      opacity: '0.85',
    } as CSSStyleDeclaration);
    host.appendChild(vignette);

    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('class', 'ct-screen-crack__vector');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    Object.assign(svg.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    });

    const filterId = `ct-crack-${Math.round(ctx.random() * 1_000_000_000).toString(36)}`;
    const defs = document.createElementNS(svgNs, 'defs');
    const filter = document.createElementNS(svgNs, 'filter');
    filter.setAttribute('id', filterId);

    const blur = document.createElementNS(svgNs, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic');
    blur.setAttribute('stdDeviation', String(0.12 + ctx.intensity * 0.28));
    blur.setAttribute('result', 'blur');
    filter.appendChild(blur);

    const merge = document.createElementNS(svgNs, 'feMerge');
    const merge0 = document.createElementNS(svgNs, 'feMergeNode');
    merge0.setAttribute('in', 'blur');
    const merge1 = document.createElementNS(svgNs, 'feMergeNode');
    merge1.setAttribute('in', 'SourceGraphic');
    merge.appendChild(merge0);
    merge.appendChild(merge1);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    const glowGroup = document.createElementNS(svgNs, 'g');
    glowGroup.setAttribute('class', 'ct-screen-crack__glow');
    svg.appendChild(glowGroup);

    const crackGroup = document.createElementNS(svgNs, 'g');
    crackGroup.setAttribute('class', 'ct-screen-crack__paths');
    svg.appendChild(crackGroup);

    const debrisGroup = document.createElementNS(svgNs, 'g');
    debrisGroup.setAttribute('class', 'ct-screen-crack__debris');
    svg.appendChild(debrisGroup);

    const noise = 0.44 + ctx.intensity * 0.8;
    const baseLen = 48 + ctx.intensity * 28;
    const rays = 16 + Math.floor(ctx.intensity * 18);

    const addCrackStroke = (d: string, width: number, opacity: number): void => {
      const shadow = document.createElementNS(svgNs, 'path');
      shadow.setAttribute('d', d);
      shadow.setAttribute('fill', 'none');
      shadow.setAttribute('stroke', 'rgba(8, 12, 18, 0.45)');
      shadow.setAttribute('stroke-width', String(width * 2.6));
      shadow.setAttribute('stroke-linecap', 'round');
      shadow.setAttribute('stroke-linejoin', 'round');
      shadow.setAttribute('opacity', String(Math.min(0.44, opacity * 0.64)));
      glowGroup.appendChild(shadow);

      const glow = document.createElementNS(svgNs, 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('fill', 'none');
      glow.setAttribute('stroke', 'rgba(196, 220, 255, 0.3)');
      glow.setAttribute('stroke-width', String(width * 1.65));
      glow.setAttribute('stroke-linecap', 'round');
      glow.setAttribute('stroke-linejoin', 'round');
      glow.setAttribute('opacity', String(opacity * 0.72));
      glow.setAttribute('filter', `url(#${filterId})`);
      glowGroup.appendChild(glow);

      const path = document.createElementNS(svgNs, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(246, 248, 255, 0.96)');
      path.setAttribute('stroke-width', String(width));
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', String(opacity));
      crackGroup.appendChild(path);
    };

    for (let r = 0; r < rays; r += 1) {
      const angle = (r / rays) * Math.PI * 2 + (ctx.random() - 0.5) * 0.18;
      const segs = 8 + Math.floor(ctx.intensity * 9);
      const len = baseLen * (0.68 + ctx.random() * 0.56);
      const width = 0.1 + ctx.random() * 0.2 + (1 - r / rays) * 0.08;
      const opacity = clamp(0.5 + ctx.random() * 0.42, 0.46, 0.96);
      const d = rayPath(cx, cy, angle, segs, len, noise, r * 97 + ctx.intensity * 50, ctx.random);
      addCrackStroke(d, width, opacity);
    }

    const branchCount = 5 + Math.floor(ctx.intensity * 9);
    for (let b = 0; b < branchCount; b += 1) {
      const angle = ctx.random() * Math.PI * 2;
      const dist = 8 + ctx.random() * 24 + ctx.intensity * 12;
      const origin = polar(cx, cy, angle, dist);
      const out = angle + (ctx.random() - 0.5) * 1.4;
      const d = rayPath(
        origin.x,
        origin.y,
        out,
        5 + Math.floor(ctx.intensity * 6),
        baseLen * (0.24 + ctx.random() * 0.24),
        noise * 0.72,
        b * 71 + 200,
        ctx.random,
      );
      addCrackStroke(d, 0.07 + ctx.random() * 0.1, 0.32 + ctx.random() * 0.3);
    }

    const rings = 2 + Math.floor(ctx.intensity * 2);
    for (let i = 0; i < rings; i += 1) {
      const ring = document.createElementNS(svgNs, 'circle');
      ring.setAttribute('cx', String(cx));
      ring.setAttribute('cy', String(cy));
      ring.setAttribute('r', String(2.2 + i * (2.2 + ctx.random() * 1.6) + ctx.intensity * 1.4));
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', 'rgba(255,255,255,0.18)');
      ring.setAttribute('stroke-width', String(0.06 + ctx.random() * 0.06));
      ring.setAttribute('stroke-dasharray', `${0.8 + ctx.random() * 1.8} ${0.6 + ctx.random() * 1.2}`);
      ring.setAttribute('opacity', String(0.26 + ctx.random() * 0.18));
      crackGroup.appendChild(ring);
    }

    const impact = document.createElementNS(svgNs, 'circle');
    impact.setAttribute('cx', String(cx));
    impact.setAttribute('cy', String(cy));
    impact.setAttribute('r', String(0.45 + ctx.intensity * 0.6));
    impact.setAttribute('fill', 'rgba(255,255,255,0.98)');
    impact.setAttribute('stroke', 'rgba(210,220,240,0.55)');
    impact.setAttribute('stroke-width', '0.08');
    crackGroup.appendChild(impact);

    const halo = document.createElementNS(svgNs, 'circle');
    halo.setAttribute('cx', String(cx));
    halo.setAttribute('cy', String(cy));
    halo.setAttribute('r', String(1.4 + ctx.intensity * 1.8));
    halo.setAttribute('fill', 'none');
    halo.setAttribute('stroke', 'rgba(255,255,255,0.22)');
    halo.setAttribute('stroke-width', '0.14');
    halo.setAttribute('opacity', '0.74');
    glowGroup.appendChild(halo);

    const shardCount = 10 + Math.floor(ctx.intensity * 14);
    for (let i = 0; i < shardCount; i += 1) {
      const angle = ctx.random() * Math.PI * 2;
      const dist = 2 + ctx.random() * (9 + ctx.intensity * 9);
      const size = 0.28 + ctx.random() * (0.7 + ctx.intensity * 0.65);
      const p1 = polar(cx, cy, angle, dist);
      const p2 = polar(p1.x, p1.y, angle + 0.8 + ctx.random() * 0.6, size);
      const p3 = polar(p1.x, p1.y, angle - 0.7 - ctx.random() * 0.5, size * (0.6 + ctx.random() * 0.5));
      const shard = document.createElementNS(svgNs, 'polygon');
      shard.setAttribute('points', `${p1.x.toFixed(2)},${p1.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} ${p3.x.toFixed(2)},${p3.y.toFixed(2)}`);
      shard.setAttribute('fill', 'rgba(255,255,255,0.14)');
      shard.setAttribute('stroke', 'rgba(255,255,255,0.28)');
      shard.setAttribute('stroke-width', '0.04');
      shard.setAttribute('opacity', String(0.18 + ctx.random() * 0.26));
      debrisGroup.appendChild(shard);
    }

    host.appendChild(svg);
    ctx.addNode(host);

    const animations: Animation[] = [];
    requestAnimationFrame(() => {
      host.style.opacity = '1';
    });
    if (typeof host.animate === 'function') {
      animations.push(
        impactFlash.animate(
          [
            { transform: 'scale(0.72)', opacity: 0.72 },
            { transform: 'scale(1.14)', opacity: 0.22 },
            { transform: 'scale(0.98)', opacity: 0.46 },
          ],
          { duration: 580, easing: 'cubic-bezier(0.18, 0.8, 0.2, 1)', fill: 'forwards' },
        ),
      );
      animations.push(
        glowGroup.animate(
          [
            { opacity: 0.2 },
            { opacity: 1 },
          ],
          { duration: 280, easing: 'ease-out', fill: 'forwards' },
        ),
      );
    }

    return () => {
      animations.forEach((animation) => animation.cancel());
      host.remove();
    };
  },
};

export default screenCrack;
