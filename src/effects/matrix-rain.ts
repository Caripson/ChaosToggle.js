import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const KATAKANA =
  'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン０１２３４５６７８９';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const STATUS = ['Cipher cascade stable', 'Neural relay open', 'Trace route synchronized', 'Ghost channel linked'];

function pickChar(ctx: EffectContext, intensity: number): string {
  const pool = ctx.random() < 0.72 + intensity * 0.08 ? KATAKANA : LATIN;
  return pool[Math.floor(ctx.random() * pool.length)] ?? '0';
}

type MatrixColumn = {
  head: number;
  speed: number;
  length: number;
  glyph: string;
  laneOffset: number;
};

const matrixRain: ChaosEffect = {
  id: 'matrixRain',
  name: 'Matrix rain',
  description: 'Full-viewport digital rain of katakana and symbols.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const host = createEl('div', 'ct-matrix-rain');
    Object.assign(host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483000',
      pointerEvents: 'none',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 12%, rgba(28,255,138,0.05), transparent 20%)',
    } as CSSStyleDeclaration);

    const canvas = createEl('canvas', 'ct-matrix-canvas') as HTMLCanvasElement;
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    } as CSSStyleDeclaration);
    host.appendChild(canvas);

    const veil = createEl('div', 'ct-matrix-rain__veil');
    veil.setAttribute('aria-hidden', 'true');
    Object.assign(veil.style, {
      position: 'absolute',
      inset: '0',
      background:
        'linear-gradient(180deg, rgba(0,8,0,0.16), rgba(0,0,0,0.02) 22%, rgba(0,0,0,0.18) 100%), radial-gradient(circle at 50% 18%, rgba(130,255,180,0.06), transparent 24%)',
      mixBlendMode: 'screen',
      opacity: String(0.42 + ctx.intensity * 0.18),
    } as CSSStyleDeclaration);
    host.appendChild(veil);

    const vignette = createEl('div', 'ct-matrix-rain__vignette');
    vignette.setAttribute('aria-hidden', 'true');
    Object.assign(vignette.style, {
      position: 'absolute',
      inset: '0',
      boxShadow: 'inset 0 0 160px rgba(0, 18, 0, 0.6)',
      opacity: '0.9',
    } as CSSStyleDeclaration);
    host.appendChild(vignette);

    const hud = createEl('div', 'ct-matrix-rain__hud');
    Object.assign(hud.style, {
      position: 'absolute',
      top: '18px',
      left: '18px',
      padding: '12px 14px',
      borderRadius: '14px',
      border: '1px solid rgba(106, 255, 164, 0.18)',
      background: 'rgba(2, 14, 7, 0.34)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 14px 34px rgba(0, 0, 0, 0.22)',
      color: 'rgba(210,255,224,0.92)',
      fontFamily: '"Cascadia Code", "Fira Code", ui-monospace, monospace',
      display: 'grid',
      gap: '4px',
      minWidth: '220px',
      maxWidth: 'min(72vw, 320px)',
    } as CSSStyleDeclaration);

    const hudLabel = createEl('div');
    hudLabel.textContent = 'Matrix relay';
    Object.assign(hudLabel.style, {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.18em',
      opacity: '0.72',
    } as CSSStyleDeclaration);
    hud.appendChild(hudLabel);

    const hudStatus = createEl('div', 'ct-matrix-rain__status');
    Object.assign(hudStatus.style, {
      fontSize: '13px',
      lineHeight: '1.4',
    } as CSSStyleDeclaration);
    hud.appendChild(hudStatus);

    const hudMeta = createEl('div', 'ct-matrix-rain__meta');
    Object.assign(hudMeta.style, {
      fontSize: '11px',
      letterSpacing: '0.08em',
      opacity: '0.62',
      textTransform: 'uppercase',
    } as CSSStyleDeclaration);
    hud.appendChild(hudMeta);
    host.appendChild(hud);

    const badge = createEl('div', 'ct-matrix-rain__badge');
    badge.textContent = 'LINK ACTIVE';
    Object.assign(badge.style, {
      position: 'absolute',
      right: '18px',
      bottom: '18px',
      padding: '10px 12px',
      borderRadius: '999px',
      border: '1px solid rgba(116, 255, 162, 0.18)',
      background: 'rgba(0, 10, 4, 0.34)',
      color: 'rgba(212,255,220,0.82)',
      font: '600 11px/1.1 "Cascadia Code", "Fira Code", ui-monospace, monospace',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      backdropFilter: 'blur(8px)',
    } as CSSStyleDeclaration);
    host.appendChild(badge);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let beamX = -120;
    let frame = 0;

    const colWidth = clamp(12 + (1 - ctx.intensity) * 8, 12, 22);
    const speedBase = 0.42 + ctx.intensity * 1.9;
    const density = clamp(0.42 + ctx.intensity * 0.62, 0.42, 1);
    const glow = 0.24 + ctx.intensity * 0.58;

    function resize(): void {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }

    resize();
    ctx.addNode(host);

    const g = canvas.getContext('2d', { alpha: true });
    if (!g) {
      return () => {
        host.remove();
      };
    }

    g.scale(dpr, dpr);
    g.font = `${colWidth}px "Cascadia Code", "Fira Code", ui-monospace, monospace`;

    let colCount = 0;
    const columns: MatrixColumn[] = [];

    const syncColumns = (): void => {
      const needed = Math.ceil(w / colWidth);
      if (needed === colCount) return;
      if (needed > colCount) {
        for (let i = colCount; i < needed; i += 1) {
          columns[i] = {
            head: -ctx.random() * h * 1.35,
            speed: speedBase * (0.45 + ctx.random() * 1.35),
            length: Math.round(10 + ctx.random() * 18 + ctx.intensity * 10),
            glyph: pickChar(ctx, ctx.intensity),
            laneOffset: (ctx.random() - 0.5) * colWidth * 0.12,
          };
        }
      } else {
        columns.length = needed;
      }
      colCount = needed;
    };

    syncColumns();

    const onResize = (): void => {
      resize();
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.font = `${colWidth}px "Cascadia Code", "Fira Code", ui-monospace, monospace`;
      syncColumns();
    };
    window.addEventListener('resize', onResize);

    const onVisibility = (): void => {
      if (document.visibilityState !== 'visible') return;
      for (let i = 0; i < colCount; i += 1) {
        const column = columns[i];
        if (!column) continue;
        if (column.head > h + colWidth * 8) {
          column.head = -ctx.random() * h * 0.65;
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const syncHud = (): void => {
      hudStatus.textContent = STATUS[Math.floor((frame / 64) % STATUS.length)] ?? STATUS[0]!;
      hudMeta.textContent = `Streams ${colCount} · Glow ${Math.round(glow * 100)} · Density ${Math.round(density * 100)}`;
    };
    syncHud();

    const animations: Animation[] = [];
    if (typeof host.animate === 'function') {
      animations.push(
        host.animate(
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          { duration: 260, easing: 'ease-out', fill: 'forwards' },
        ),
      );
      animations.push(
        hud.animate(
          [
            { transform: 'translateY(6px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration: 420, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
        ),
      );
    }

    const tick = (): void => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      frame += 1;
      beamX += 0.45 + ctx.intensity * 0.5;
      if (beamX > w + 140) beamX = -140;

      g.fillStyle = `rgba(0, 6, 0, ${0.09 + ctx.intensity * 0.08})`;
      g.fillRect(0, 0, w, h);

      g.fillStyle = 'rgba(80, 255, 150, 0.035)';
      g.fillRect(beamX, 0, 38, h);

      for (let c = 0; c < colCount; c += 1) {
        const column = columns[c];
        if (!column) continue;

        if (ctx.random() < 0.022 * density) {
          column.glyph = pickChar(ctx, ctx.intensity);
        }

        const x = c * colWidth + column.laneOffset;
        const y = column.head;

        g.shadowColor = `rgba(84, 255, 164, ${0.42 + glow * 0.34})`;
        g.shadowBlur = 6 + ctx.intensity * 10;
        g.fillStyle = `rgba(228, 255, 236, ${0.9 + glow * 0.08})`;
        g.fillText(column.glyph, x, y);
        g.shadowBlur = 0;

        for (let t = 1; t < column.length; t += 1) {
          const ty = y - t * colWidth * 0.9;
          if (ty < -colWidth) break;
          const alpha = Math.max(0.03, 0.7 - t * (0.65 / column.length));
          const char = ctx.random() < 0.16 + density * 0.08 ? pickChar(ctx, ctx.intensity) : column.glyph;
          if (t < 3) {
            g.fillStyle = `rgba(96, 255, 180, ${Math.min(0.8, alpha + 0.14)})`;
          } else {
            g.fillStyle = `rgba(12, ${140 + Math.floor(ctx.intensity * 70)}, 44, ${alpha})`;
          }
          g.fillText(char, x, ty);
        }

        column.head += column.speed * colWidth * 0.11;
        if (column.head - column.length * colWidth > h + ctx.random() * 320) {
          column.head = -ctx.random() * h * 0.9;
          column.speed = speedBase * (0.45 + ctx.random() * 1.3);
          column.length = Math.round(10 + ctx.random() * 18 + ctx.intensity * 10);
          column.glyph = pickChar(ctx, ctx.intensity);
        }
      }

      if (frame % 14 === 0) {
        syncHud();
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      host.remove();
    };
  },
};

export default matrixRain;
