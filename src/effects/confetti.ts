import type { ChaosEffect } from '../core/types';
import { clamp, createEl } from '../core/utils';

const TYPE_EMOJI: Record<string, string> = {
  snow: '❄️',
  eggs: '🥚',
  ghosts: '👻',
  leaves: '🍂',
  hearts: '❤️',
  balloons: '🎈',
};

function hexHue(hex: string): number | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return null;
  const d = max - min;
  let h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return h * 60;
}

function hslPiece(h: number, s: number, l: number): HTMLElement {
  const el = createEl('div');
  el.style.position = 'fixed';
  el.style.width = '8px';
  el.style.height = '12px';
  el.style.borderRadius = '2px';
  el.style.background = `hsl(${h} ${s}% ${l}%)`;
  el.style.pointerEvents = 'none';
  el.style.zIndex = '2147483002';
  return el;
}

function emojiPiece(char: string): HTMLElement {
  const el = createEl('div');
  el.style.position = 'fixed';
  el.style.fontSize = `${14 + Math.floor(Math.random() * 10)}px`;
  el.style.lineHeight = '1';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '2147483002';
  el.textContent = char;
  return el;
}

const confetti: ChaosEffect = {
  id: 'confetti',
  name: 'Confetti',
  description: 'Falling particles using emoji or colored pieces, driven by intensity and particle type.',
  category: 'visual',
  defaults: { type: 'confetti', mixWithConfetti: false },
  apply(ctx) {
    const particleType = String(confetti.defaults?.type ?? 'confetti').toLowerCase();
    const mix = Boolean(confetti.defaults?.mixWithConfetti);
    const overrideEmoji = confetti.defaults?.emoji;
    const forceEmoji = typeof overrideEmoji === 'string' && overrideEmoji.length > 0;

    const useHsl =
      !forceEmoji &&
      (particleType === 'confetti' ||
        particleType === 'fireworks' ||
        particleType === 'minimal' ||
        !TYPE_EMOJI[particleType]);

    let count = Math.round(10 + ctx.intensity * 130);
    count = clamp(count, 6, 180);
    if (particleType === 'minimal') count = clamp(Math.round(count * 0.25), 4, 40);

    const hp = hexHue(ctx.palette.primary);
    const ha = hexHue(ctx.palette.accent);
    const baseHue = hp ?? ha ?? 200;

    const spawn = (piece: HTMLElement, burst: boolean) => {
      const x0 = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800);
      const drift = (Math.random() - 0.5) * 220;
      const rot = 360 * (Math.random() - 0.5) * 4;
      const fall = burst ? 900 + Math.random() * 700 : 1800 + Math.random() * 2200 + ctx.intensity * 800;

      piece.style.left = '0';
      piece.style.top = '0';
      piece.style.transform = `translate(${x0}px, -24px) rotate(0deg)`;
      ctx.addNode(piece);

      const y1 = (typeof window !== 'undefined' ? window.innerHeight : 600) + 40;
      const yMid = burst ? -40 - Math.random() * 120 : y1 * 0.45;

      if (burst && particleType === 'fireworks') {
        piece.animate(
          [
            { transform: `translate(${x0}px, ${yMid}px) scale(1)`, opacity: 1, offset: 0 },
            { transform: `translate(${x0 + drift * 0.4}px, ${y1}px) scale(0.6) rotate(${rot}deg)`, opacity: 0.85, offset: 1 },
          ],
          { duration: fall, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
        );
      } else {
        piece.animate(
          [
            { transform: `translate(${x0}px, -24px) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${x0 + drift}px, ${y1}px) rotate(${rot}deg)`, opacity: 0.95 },
          ],
          { duration: fall, easing: 'linear', fill: 'forwards' },
        );
      }
    };

    for (let i = 0; i < count; i++) {
      const wantHsl = useHsl || (mix && Math.random() < 0.35);
      if (wantHsl) {
        const h = baseHue + (Math.random() - 0.5) * 70 + (i % 7) * 12;
        const s = 65 + Math.random() * 30;
        const l = 45 + Math.random() * 25;
        const piece = hslPiece(((h % 360) + 360) % 360, s, l);
        if (particleType === 'fireworks') piece.style.width = `${4 + Math.random() * 6}px`;
        spawn(piece, particleType === 'fireworks');
      } else {
        const ch = forceEmoji ? overrideEmoji : TYPE_EMOJI[particleType] || '🎉';
        spawn(emojiPiece(ch), false);
      }
    }
  },
};

export default confetti;
