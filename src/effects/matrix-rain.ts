import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const KATAKANA =
  'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン０１２３４５６７８９';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

function pickChar(intensity: number): string {
  const pool = Math.random() < 0.72 ? KATAKANA : LATIN;
  return pool[Math.floor(Math.random() * pool.length)] ?? '0';
}

const matrixRain: ChaosEffect = {
  id: 'matrixRain',
  name: 'Matrix rain',
  description: 'Full-viewport digital rain of katakana and symbols.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const { intensity, addNode } = ctx;
    const canvas = createEl('canvas', 'ct-matrix-canvas') as HTMLCanvasElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const colWidth = clamp(10 + (1 - intensity) * 8, 10, 22);
    const speedBase = 0.35 + intensity * 1.85;
    const density = clamp(0.35 + intensity * 0.65, 0.35, 1);
    const glow = 0.15 + intensity * 0.55;

    function resize(): void {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    resize();
    addNode(canvas);

    const g = canvas.getContext('2d', { alpha: true });
    if (!g) {
      return () => {
        canvas.remove();
      };
    }
    g.scale(dpr, dpr);
    g.font = `${colWidth}px ui-monospace, "Cascadia Code", "Fira Code", monospace`;

    const colCount = Math.ceil(w / colWidth);
    const heads: number[] = [];
    const speeds: number[] = [];
    const chars: string[] = [];
    for (let i = 0; i < colCount; i++) {
      heads[i] = Math.random() * h * 1.5;
      speeds[i] = speedBase * (0.4 + Math.random() * 1.2);
      chars[i] = pickChar(intensity);
    }

    const onResize = (): void => {
      resize();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.font = `${colWidth}px ui-monospace, "Cascadia Code", "Fira Code", monospace`;
    };
    window.addEventListener('resize', onResize);

    const tick = (): void => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      g.fillStyle = `rgba(0, 6, 0, ${0.08 + intensity * 0.07})`;
      g.fillRect(0, 0, w, h);

      for (let c = 0; c < colCount; c++) {
        if (Math.random() < 0.02 * density) chars[c] = pickChar(intensity);
        const x = c * colWidth;
        const y = heads[c];
        const headBright = `rgba(180, 255, 200, ${0.85 + glow * 0.15})`;
        const trail = `rgba(0, ${140 + Math.floor(intensity * 80)}, 40, ${0.35 + glow * 0.4})`;

        g.fillStyle = headBright;
        g.shadowColor = `rgba(0, 255, 100, ${0.4 + glow * 0.5})`;
        g.shadowBlur = 4 + intensity * 10;
        g.fillText(chars[c], x, y);
        g.shadowBlur = 0;

        for (let t = 1; t < 18; t++) {
          const ty = y - t * colWidth * 0.92;
          if (ty < 0) break;
          if (Math.random() < 0.04 * density) {
            g.fillStyle = trail;
            g.fillText(pickChar(intensity), x, ty);
          } else {
            g.fillStyle = `rgba(0, ${100 + t * 4}, 30, ${Math.max(0.02, 0.55 - t * 0.028)})`;
            g.fillText(chars[c], x, ty);
          }
        }

        heads[c] += speeds[c] * colWidth * 0.12;
        if (heads[c] > h + Math.random() * 400) {
          heads[c] = -Math.random() * h * 0.8;
          speeds[c] = speedBase * (0.4 + Math.random() * 1.2);
        }
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.remove();
    };
  },
};

export default matrixRain;
