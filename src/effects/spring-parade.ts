import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

const SPRITES = ['🐥', '🐣', '🥚'];
const FLOWERS = ['🌼', '🌷'];

const effect: ChaosEffect = {
  id: 'springParade',
  name: 'Spring parade',
  description: 'A line of hopping chicks and eggs scoots across the bottom of the page.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-spring-parade', {
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0',
      height: '140px',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '2147483004',
    });

    const meadow = createEl('div', '', {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      height: '42px',
      background: 'linear-gradient(180deg, rgba(184,242,230,0) 0%, rgba(184,242,230,0.12) 30%, rgba(110,196,126,0.32) 100%)',
      borderTop: '1px solid rgba(255,255,255,0.38)',
    });
    wrap.appendChild(meadow);

    const flowerCount = 5 + Math.round(ctx.intensity * 7);
    for (let i = 0; i < flowerCount; i++) {
      const flower = createEl('div', '', {
        position: 'absolute',
        left: `${(i / Math.max(1, flowerCount - 1)) * 100}%`,
        bottom: `${8 + Math.random() * 14}px`,
        fontSize: `${14 + Math.random() * 8}px`,
        transform: `translateX(${(Math.random() - 0.5) * 18}px)`,
        opacity: '0.92',
      });
      flower.textContent = FLOWERS[i % FLOWERS.length]!;
      wrap.appendChild(flower);
    }

    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const count = 3 + Math.round(ctx.intensity * 4);
    for (let i = 0; i < count; i++) {
      const sprite = createEl('div', 'ct-spring-parade__sprite', {
        position: 'absolute',
        left: '0',
        bottom: `${22 + (i % 3) * 8}px`,
        fontSize: `${clamp(28 + Math.random() * 18 + ctx.intensity * 12, 28, 58)}px`,
        lineHeight: '1',
        filter: 'drop-shadow(0 5px 12px rgba(77,64,103,0.18))',
        willChange: 'transform',
      });
      sprite.textContent = SPRITES[i % SPRITES.length]!;
      wrap.appendChild(sprite);

      const startX = -100 - i * 56;
      const travel = width + 200 + i * 34;
      const hop = 16 + Math.random() * 24 + ctx.intensity * 20;
      const wobble = (Math.random() - 0.5) * 18;
      const duration = 2300 + Math.random() * 1400 + i * 140;
      const delay = i * 160;

      sprite.animate(
        [
          { transform: `translate(${startX}px, 0px) rotate(${-8 + wobble * 0.2}deg)` },
          { transform: `translate(${startX + travel * 0.18}px, ${-hop}px) rotate(${5 + wobble * 0.3}deg)` },
          { transform: `translate(${startX + travel * 0.36}px, 0px) rotate(${-6 + wobble * 0.15}deg)` },
          { transform: `translate(${startX + travel * 0.58}px, ${-hop * 0.72}px) rotate(${4 + wobble * 0.2}deg)` },
          { transform: `translate(${startX + travel * 0.8}px, 0px) rotate(${-4 + wobble * 0.1}deg)` },
          { transform: `translate(${startX + travel}px, ${-hop * 0.35}px) rotate(${wobble * 0.08}deg)` },
        ],
        { duration, delay, easing: 'ease-in-out', fill: 'forwards' },
      );
    }

    ctx.addNode(wrap);

    return () => {
      wrap.remove();
    };
  },
};

export default effect;
