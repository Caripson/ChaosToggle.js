import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

function pct(value: number): string {
  return `${clamp(value, 0, 100).toFixed(2)}%`;
}

function sanitizeClone(root: HTMLElement): HTMLElement {
  const clone = root.cloneNode(true) as HTMLElement;
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  clone.querySelectorAll('script').forEach((node) => node.remove());
  clone.querySelectorAll('audio, video, iframe').forEach((node) => node.remove());
  return clone;
}

const realityTear: ChaosEffect = {
  id: 'realityTear',
  name: 'Reality tear',
  description: 'The page splits into drifting slabs while a dark rift opens through the center.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const { root, intensity, duration, palette, addNode } = ctx;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth || 1024 : 1024;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight || 768 : 768;
    const rect = root.getBoundingClientRect();
    const cloneWidth = Math.max(rect.width || 0, root.scrollWidth || 0, viewportWidth);
    const cloneHeight = Math.max(rect.height || 0, root.scrollHeight || 0, viewportHeight);
    const baseLeft = Number.isFinite(rect.left) ? rect.left : 0;
    const baseTop = Number.isFinite(rect.top) ? rect.top : 0;
    const centerX = 50 + (ctx.random() - 0.5) * 7;
    const centerY = 42 + (ctx.random() - 0.5) * 10;
    const seam = 7 + intensity * 7;
    const outer = 15 + intensity * 8;
    const drift = 60 + intensity * 180;
    const lift = 18 + intensity * 44;
    const phase = Math.max(1200, Math.round(duration * 0.78));
    const colors = [palette.primary, palette.accent, palette.text];

    const host = createEl('div', 'ct-reality-tear', {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483052',
      pointerEvents: 'none',
      overflow: 'hidden',
      perspective: '1200px',
      opacity: '0',
    });

    const backdrop = createEl('div', 'ct-reality-tear__backdrop', {
      position: 'absolute',
      inset: '0',
      background:
        `radial-gradient(circle at ${pct(centerX)} ${pct(centerY)}, rgba(255,255,255,0.08), transparent 18%), ` +
        `radial-gradient(circle at ${pct(centerX)} ${pct(centerY)}, rgba(4,2,18,0.18), rgba(4,2,18,0.82) 60%)`,
      mixBlendMode: 'multiply',
      opacity: String(0.58 + intensity * 0.18),
    });
    host.appendChild(backdrop);

    const halo = createEl('div', 'ct-reality-tear__halo', {
      position: 'absolute',
      left: pct(centerX),
      top: pct(centerY),
      width: `${clamp(180 + intensity * 260, 180, 420)}px`,
      height: `${clamp(220 + intensity * 280, 220, 460)}px`,
      marginLeft: `${-clamp(90 + intensity * 130, 90, 210)}px`,
      marginTop: `${-clamp(120 + intensity * 140, 120, 230)}px`,
      background:
        `radial-gradient(circle, ${palette.accent}44 0%, ${palette.primary}22 26%, rgba(0,0,0,0) 72%)`,
      filter: `blur(${clamp(8 + intensity * 14, 8, 22)}px)`,
      opacity: String(0.72 + intensity * 0.12),
    });
    host.appendChild(halo);

    const rift = createEl('div', 'ct-reality-tear__rift', {
      position: 'absolute',
      left: pct(centerX),
      top: pct(centerY),
      width: `${clamp(120 + intensity * 170, 120, 250)}px`,
      height: `${clamp(220 + intensity * 320, 220, 460)}px`,
      marginLeft: `${-clamp(60 + intensity * 85, 60, 125)}px`,
      marginTop: `${-clamp(110 + intensity * 150, 110, 230)}px`,
      background:
        `linear-gradient(180deg, rgba(255,255,255,0.12), ${palette.accent}33 18%, rgba(8,4,18,0.98) 42%, rgba(0,0,0,0.98) 100%)`,
      clipPath:
        'polygon(48% 0%, 62% 6%, 57% 18%, 70% 31%, 61% 44%, 73% 60%, 59% 75%, 67% 88%, 49% 100%, 34% 90%, 40% 74%, 28% 60%, 38% 44%, 26% 30%, 40% 15%, 35% 4%)',
      border: `1px solid ${palette.text}22`,
      boxShadow:
        `0 0 ${clamp(32 + intensity * 46, 32, 78)}px ${palette.accent}22, ` +
        `0 0 ${clamp(52 + intensity * 58, 52, 96)}px rgba(7,4,18,0.72)`,
      transform: 'translateZ(0)',
      mixBlendMode: 'screen',
    });
    host.appendChild(rift);

    const spine = createEl('div', 'ct-reality-tear__spine', {
      position: 'absolute',
      left: '50%',
      top: '6%',
      bottom: '6%',
      width: '2px',
      marginLeft: '-1px',
      background: `linear-gradient(180deg, transparent, ${palette.text}88, ${palette.accent}aa, transparent)`,
      opacity: '0.82',
      filter: 'blur(0.4px)',
    });
    rift.appendChild(spine);

    const riftDust = createEl('div', 'ct-reality-tear__dust', {
      position: 'absolute',
      inset: '-8%',
      background:
        `radial-gradient(circle at 48% 18%, ${palette.text}22 0%, transparent 18%), ` +
        `radial-gradient(circle at 55% 56%, ${palette.accent}22 0%, transparent 22%), ` +
        `radial-gradient(circle at 42% 84%, ${palette.primary}22 0%, transparent 20%)`,
      opacity: '0.76',
    });
    rift.appendChild(riftDust);

    const segments = [
      {
        polygon: `polygon(0 0, ${pct(centerX - outer)} 0, ${pct(centerX - seam * 1.9)} 100%, 0 100%)`,
        dx: -(drift * 0.95),
        dy: -(lift * (0.6 + ctx.random() * 0.9)),
        rot: -(2.2 + ctx.random() * 4.4),
        skew: -(1.4 + ctx.random() * 2.2),
      },
      {
        polygon: `polygon(${pct(centerX - outer * 0.92)} 0, ${pct(centerX - seam * 0.35)} 0, ${pct(centerX - seam * 1.55)} 100%, ${pct(centerX - outer * 1.2)} 100%)`,
        dx: -(drift * 0.38),
        dy: -(lift * (0.25 + ctx.random() * 0.5)),
        rot: -(1.2 + ctx.random() * 2.1),
        skew: -(0.8 + ctx.random() * 1.4),
      },
      {
        polygon: `polygon(${pct(centerX + seam * 0.35)} 0, ${pct(centerX + outer * 0.92)} 0, ${pct(centerX + outer * 1.22)} 100%, ${pct(centerX + seam * 1.55)} 100%)`,
        dx: drift * 0.42,
        dy: -(lift * (0.18 + ctx.random() * 0.56)),
        rot: 1.3 + ctx.random() * 2.2,
        skew: 0.8 + ctx.random() * 1.3,
      },
      {
        polygon: `polygon(${pct(centerX + seam * 1.85)} 0, 100% 0, 100% 100%, ${pct(centerX + outer)} 100%)`,
        dx: drift,
        dy: lift * (0.28 + ctx.random() * 0.72),
        rot: 2.4 + ctx.random() * 4.3,
        skew: 1.5 + ctx.random() * 2.2,
      },
    ];

    const animations: Animation[] = [];

    segments.forEach((segment, index) => {
      const shell = createEl('div', `ct-reality-tear__segment ct-reality-tear__segment--${index + 1}`, {
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        clipPath: segment.polygon,
        willChange: 'transform, opacity, filter',
        transformOrigin: `${pct(centerX)} ${pct(centerY)}`,
      });

      const clone = sanitizeClone(root);
      Object.assign(clone.style, {
        position: 'absolute',
        left: `${baseLeft}px`,
        top: `${baseTop}px`,
        width: `${cloneWidth}px`,
        minHeight: `${cloneHeight}px`,
        maxWidth: 'none',
        margin: '0',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        filter: `contrast(${1.04 + intensity * 0.06}) saturate(${1.05 + intensity * 0.12})`,
      });

      shell.appendChild(clone);
      host.appendChild(shell);

      animations.push(
        shell.animate(
          [
            { transform: 'translate3d(0,0,0) rotate(0deg) skewY(0deg)', opacity: 1, filter: 'brightness(1)' },
            {
              transform: `translate3d(${segment.dx * 0.18}px, ${segment.dy * 0.18}px, 40px) rotate(${segment.rot * 0.32}deg) skewY(${segment.skew * 0.32}deg)`,
              opacity: 0.98,
              offset: 0.16,
            },
            {
              transform: `translate3d(${segment.dx}px, ${segment.dy}px, 110px) rotate(${segment.rot}deg) skewY(${segment.skew}deg)`,
              opacity: 0.86,
              filter: 'brightness(1.08)',
            },
          ],
          {
            duration: phase + index * 110,
            easing: 'cubic-bezier(0.18, 0.82, 0.18, 1)',
            fill: 'forwards',
          },
        ),
      );
    });

    const shardCount = Math.round(clamp(12 + intensity * 18, 12, 28));
    for (let i = 0; i < shardCount; i++) {
      const shard = createEl('div', 'ct-reality-tear__shard', {
        position: 'absolute',
        left: pct(centerX),
        top: pct(centerY),
        width: `${clamp(4 + ctx.random() * 16 + intensity * 6, 4, 26)}px`,
        height: `${clamp(2 + ctx.random() * 7 + intensity * 4, 2, 14)}px`,
        marginLeft: '-3px',
        marginTop: '-2px',
        background: colors[i % colors.length]!,
        opacity: String(0.58 + ctx.random() * 0.34),
        borderRadius: '999px',
        boxShadow: `0 0 14px ${colors[i % colors.length]!}55`,
      });
      host.appendChild(shard);

      const angle = -0.9 + ctx.random() * 1.8 + (i % 2 === 0 ? Math.PI : 0);
      const distance = 36 + ctx.random() * 180 + intensity * 120;
      const rise = (ctx.random() - 0.5) * 120;
      const spin = (ctx.random() - 0.5) * 260;

      animations.push(
        shard.animate(
          [
            { transform: 'translate3d(0,0,0) rotate(0deg) scale(0.7)', opacity: 0.82 },
            {
              transform: `translate3d(${Math.cos(angle) * distance * 0.28}px, ${Math.sin(angle) * distance * 0.28 + rise * 0.18}px, 0) rotate(${spin * 0.25}deg) scale(1)`,
              opacity: 0.74,
              offset: 0.24,
            },
            {
              transform: `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + rise}px, 0) rotate(${spin}deg) scale(0.15)`,
              opacity: 0,
            },
          ],
          {
            duration: 760 + Math.round(ctx.random() * 760),
            delay: i * 22,
            easing: 'cubic-bezier(0.16, 0.8, 0.22, 1)',
            fill: 'forwards',
          },
        ),
      );
    }

    animations.push(
      halo.animate(
        [
          { transform: 'scale(0.94)', opacity: 0.54 },
          { transform: 'scale(1.04)', opacity: 0.86 },
          { transform: 'scale(0.98)', opacity: 0.64 },
        ],
        { duration: 1500 + Math.round(intensity * 700), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
      ),
    );
    animations.push(
      rift.animate(
        [
          { transform: 'translateZ(0) scaleX(0.88) scaleY(0.96)', opacity: 0.7 },
          { transform: 'translateZ(0) scaleX(1.08) scaleY(1.02)', opacity: 0.98 },
          { transform: 'translateZ(0) scaleX(0.94) scaleY(1.04)', opacity: 0.82 },
        ],
        { duration: 1100 + Math.round(intensity * 600), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
      ),
    );

    const prevTransition = root.style.transition;
    const prevTransform = root.style.transform;
    const prevTransformOrigin = root.style.transformOrigin;
    const prevFilter = root.style.filter;
    const prevWillChange = root.style.willChange;
    root.style.transition = 'transform 140ms ease, filter 140ms ease';
    root.style.transformOrigin = `${pct(centerX)} ${pct(centerY)}`;
    root.style.filter =
      `brightness(${1.03 + intensity * 0.06}) contrast(${1.02 + intensity * 0.08}) saturate(${1.06 + intensity * 0.14})`;
    root.style.willChange = 'transform, filter';

    if (typeof root.animate === 'function') {
      animations.push(
        root.animate(
          [
            { transform: 'translate3d(0,0,0) scale(1)' },
            { transform: `translate3d(${(-1 + ctx.random() * 2).toFixed(2)}px, ${(-2 + ctx.random() * 4).toFixed(2)}px, 0) scale(${(1.004 + intensity * 0.01).toFixed(4)})` },
            { transform: `translate3d(${(-1 + ctx.random() * 2).toFixed(2)}px, ${(-2 + ctx.random() * 4).toFixed(2)}px, 0) scale(${(1.002 + intensity * 0.008).toFixed(4)})` },
          ],
          { duration: 980 + Math.round(intensity * 440), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' },
        ),
      );
    }

    addNode(host);
    requestAnimationFrame(() => {
      host.style.opacity = '1';
    });

    return () => {
      animations.forEach((animation) => animation.cancel());
      root.style.transition = prevTransition;
      root.style.transform = prevTransform;
      root.style.transformOrigin = prevTransformOrigin;
      root.style.filter = prevFilter;
      root.style.willChange = prevWillChange;
      host.remove();
    };
  },
};

export default realityTear;
