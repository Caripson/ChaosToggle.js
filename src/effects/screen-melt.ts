import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const screenMelt: ChaosEffect = {
  id: 'screenMelt',
  name: 'Screen melt',
  description: 'The viewport drips away beneath a molten edge.',
  category: 'visual',
  apply(ctx: EffectContext): () => void {
    const { root, intensity, duration, palette, addNode } = ctx;
    const sec = clamp(duration / 1000, 0.8, 6);
    root.classList.add('ct-screen-melt');
    root.style.animationDuration = `${sec}s`;
    root.style.animationTimingFunction = 'cubic-bezier(0.55, 0.05, 0.85, 0.2)';

    const svgNs = 'http://www.w3.org/2000/svg';
    const wave = document.createElementNS(svgNs, 'svg');
    wave.setAttribute('class', 'ct-screen-melt-wave');
    wave.setAttribute('viewBox', '0 0 1000 140');
    wave.setAttribute('preserveAspectRatio', 'none');
    Object.assign(wave.style, {
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0',
      height: `${clamp(16 + intensity * 52, 16, 78)}vh`,
      width: '100%',
      zIndex: '2147483001',
      pointerEvents: 'none',
      overflow: 'visible',
    });

    const uid = Math.random().toString(36).slice(2, 10);
    const defs = document.createElementNS(svgNs, 'defs');
    const grad = document.createElementNS(svgNs, 'linearGradient');
    grad.setAttribute('id', `ct-melt-grad-${uid}`);
    grad.setAttribute('x1', '0');
    grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0');
    grad.setAttribute('y2', '1');
    const g1 = document.createElementNS(svgNs, 'stop');
    g1.setAttribute('offset', '0%');
    g1.setAttribute('stop-color', palette.accent);
    g1.setAttribute('stop-opacity', String(0.55 + intensity * 0.25));
    const g2 = document.createElementNS(svgNs, 'stop');
    g2.setAttribute('offset', '50%');
    g2.setAttribute('stop-color', palette.primary);
    g2.setAttribute('stop-opacity', String(0.38 + intensity * 0.22));
    const g3 = document.createElementNS(svgNs, 'stop');
    g3.setAttribute('offset', '100%');
    g3.setAttribute('stop-color', palette.background);
    g3.setAttribute('stop-opacity', '0');
    grad.appendChild(g1);
    grad.appendChild(g2);
    grad.appendChild(g3);
    defs.appendChild(grad);
    wave.appendChild(defs);

    const path = document.createElementNS(svgNs, 'path');
    const w = 1000;
    const buildD = (phase: number): string => {
      const amp = 10 + intensity * 22;
      const steps = 24;
      let d = 'M 0 130 ';
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const y =
          28 +
          Math.sin((i / steps) * Math.PI * 4 + phase) * amp +
          Math.sin((i / steps) * Math.PI * 11 + phase * 1.2) * (amp * 0.28);
        d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      d += `L ${w} 140 L 0 140 Z`;
      return d;
    };

    path.setAttribute('fill', `url(#ct-melt-grad-${uid})`);
    path.setAttribute('stroke', palette.text);
    path.setAttribute('stroke-width', '1.2');
    path.setAttribute('stroke-opacity', String(0.1 + intensity * 0.18));
    path.setAttribute('d', buildD(0));

    wave.appendChild(path);

    const drip = path.animate(
      [
        { d: buildD(0) },
        { d: buildD(Math.PI * 0.45) },
        { d: buildD(Math.PI * 0.9) },
        { d: buildD(Math.PI * 1.35) },
        { d: buildD(Math.PI * 1.8) },
        { d: buildD(Math.PI * 2.25) },
        { d: buildD(Math.PI * 2.7) },
        { d: buildD(Math.PI * 3.2) },
      ],
      {
        duration: Math.max(500, sec * 900),
        iterations: Infinity,
        easing: 'linear',
      },
    );

    const shimmer = createEl('div', '', {
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0',
      height: `${clamp(10 + intensity * 26, 10, 40)}vh`,
      pointerEvents: 'none',
      zIndex: '2147483002',
      background: `linear-gradient(105deg, transparent 0%, ${palette.accent}55 45%, ${palette.primary}44 55%, transparent 100%)`,
      backgroundSize: '240% 100%',
      opacity: String(0.35 + intensity * 0.35),
      mixBlendMode: 'screen',
    });
    const gl = shimmer.animate(
      [{ transform: 'translateX(-35%)' }, { transform: 'translateX(35%)' }],
      { duration: 900 - intensity * 250, iterations: Infinity, easing: 'linear' },
    );

    addNode(wave as unknown as HTMLElement);
    addNode(shimmer);

    return () => {
      drip.cancel();
      gl.cancel();
      root.classList.remove('ct-screen-melt');
      root.style.animationDuration = '';
      root.style.animationTimingFunction = '';
      wave.remove();
      shimmer.remove();
    };
  },
};

export default screenMelt;
