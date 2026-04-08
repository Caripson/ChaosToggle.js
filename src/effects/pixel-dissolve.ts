import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const pixelDissolve: ChaosEffect = {
  id: 'pixelDissolve',
  name: 'Pixel dissolve',
  description: 'The view explodes into a storm of palette-colored pixels.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const { intensity, palette, addNode } = ctx;
    const cols = Math.floor(clamp(14 + intensity * 38, 14, 56));
    const rows = Math.floor(clamp(10 + intensity * 28, 10, 40));
    const colors = [palette.primary, palette.accent, palette.background, palette.text];

    const host = createEl('div', 'ct-pixel-dissolve', {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483050',
      pointerEvents: 'none',
      overflow: 'hidden',
    });

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = vw / cols;
    const ch = vh / rows;
    const anims: Animation[] = [];

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const cell = createEl('div', '', {
          position: 'absolute',
          left: `${gx * cw}px`,
          top: `${gy * ch}px`,
          width: `${cw + 0.5}px`,
          height: `${ch + 0.5}px`,
          background: colors[(gx + gy + Math.floor(Math.random() * 4)) % colors.length],
          borderRadius: `${Math.random() * 2}px`,
          boxShadow: `0 0 ${2 + intensity * 6}px rgba(255,255,255,${0.12 + intensity * 0.2})`,
          opacity: String(0.82 + Math.random() * 0.18),
          willChange: 'transform, opacity',
          transformOrigin: 'center center',
        });

        const cx = gx * cw + cw / 2;
        const cy = gy * ch + ch / 2;
        const mx = vw / 2;
        const my = vh / 2;
        const dx = cx - mx;
        const dy = cy - my;
        const len = Math.hypot(dx, dy) || 1;
        const nx = dx / len;
        const ny = dy / len;
        const tang = (Math.random() - 0.5) * 1.4;
        const tx = nx + tang * -ny;
        const ty = ny + tang * nx;
        const dist = (280 + Math.random() * 520) * (0.55 + intensity * 0.95);
        const rot = (Math.random() - 0.5) * (720 + intensity * 720);
        const s0 = 0.92 + Math.random() * 0.2;
        const s1 = 0.05 + Math.random() * 0.2;
        const ox = tx * dist;
        const oy = ty * dist;

        host.appendChild(cell);

        const anim = cell.animate(
          [
            { transform: `translate(0,0) scale(${s0}) rotate(0deg)`, opacity: 0.95 },
            {
              transform: `translate(${ox * 0.2}px,${oy * 0.2}px) scale(${s0 * 0.92}) rotate(${rot * 0.12}deg)`,
              opacity: 0.9,
              offset: 0.12,
            },
            { transform: `translate(${ox}px,${oy}px) scale(${s1}) rotate(${rot}deg)`, opacity: 0 },
          ],
          {
            duration: 900 + Math.random() * 1100 - intensity * 200,
            delay: Math.random() * 180 * (1 - intensity * 0.35),
            easing: 'cubic-bezier(0.12, 0.85, 0.22, 1)',
            fill: 'forwards',
          },
        );
        anims.push(anim);
      }
    }

    addNode(host);

    return () => {
      for (const a of anims) a.cancel();
      host.remove();
    };
  },
};

export default pixelDissolve;
