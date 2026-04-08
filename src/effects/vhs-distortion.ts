import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const vhsDistortion: ChaosEffect = {
  id: 'vhsDistortion',
  name: 'VHS distortion',
  description: 'Scanlines, tracking errors, and analog skew.',
  category: 'overlay',
  apply(ctx: EffectContext): () => void {
    const { root, intensity, addNode, addTimer } = ctx;
    const wrap = createEl('div', 'ct-vhs');
    const scan = createEl('div', 'ct-vhs-scanlines');
    const track = createEl('div', 'ct-vhs-tracking');
    Object.assign(track.style, {
      willChange: 'transform',
      background: `repeating-linear-gradient(0deg, transparent 0 ${60 + Math.floor(intensity * 40)}px, rgba(255,255,255,.06) ${60 + Math.floor(intensity * 40)}px ${62 + Math.floor(intensity * 40)}px)`,
    });
    const chroma = createEl('div', '', {
      position: 'absolute',
      inset: '0',
      background: 'linear-gradient(90deg, rgba(255,0,80,.04), transparent 40%, transparent 60%, rgba(0,255,255,.05))',
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    });
    wrap.appendChild(scan);
    wrap.appendChild(track);
    wrap.appendChild(chroma);
    addNode(wrap);

    const prevTransform = root.style.transform;
    const skew = (0.15 + intensity * 0.85) * (Math.random() < 0.5 ? 1 : -1);
    root.style.transform = `${prevTransform ? `${prevTransform} ` : ''}skewX(${skew}deg) scaleX(${1 + intensity * 0.008})`.trim();

    let tx = 0;
    let ty = 0;
    const jitter = (): void => {
      if (Math.random() < 0.08 + intensity * 0.35) {
        tx = (Math.random() - 0.5) * (4 + intensity * 28);
        ty = (Math.random() - 0.5) * (2 + intensity * 8);
      } else {
        tx *= 0.88;
        ty *= 0.88;
      }
      track.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scaleX(${1 + (Math.random() - 0.5) * intensity * 0.04})`;
    };

    const id = window.setInterval(jitter, 40 + Math.floor((1 - intensity) * 50));
    addTimer(id);
    jitter();

    const noise = createEl('div', '', {
      position: 'absolute',
      inset: '0',
      opacity: String(clamp(0.04 + intensity * 0.12, 0.04, 0.2)),
      backgroundImage:
        'repeating-radial-gradient(circle at 17% 32%, rgba(255,255,255,.12) 0 1px, transparent 1px 3px)',
      backgroundSize: '2px 3px',
      pointerEvents: 'none',
      mixBlendMode: 'overlay',
    });
    wrap.appendChild(noise);

    return () => {
      clearInterval(id);
      root.style.transform = prevTransform;
      wrap.remove();
    };
  },
};

export default vhsDistortion;
