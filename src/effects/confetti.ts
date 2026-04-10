import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

type ParticleConfig = {
  type: string;
  density: number;
  emoji: string | null;
  emojiSet: string[];
  mixWithConfetti: boolean;
  motion: string;
  colors: string[];
  size: number;
};

const TYPE_EMOJI_SETS: Record<string, string[]> = {
  balloons: ['🎈'],
  chicks: ['🐥', '🥚'],
  eggs: ['🥚'],
  ghosts: ['👻'],
  hearts: ['❤️'],
  leaves: ['🍂'],
  snow: ['❄️'],
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
  const h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return h * 60;
}

function coloredPiece(background: string, scale: number): HTMLElement {
  const el = createEl('div');
  el.style.position = 'fixed';
  el.style.width = `${8 * scale}px`;
  el.style.height = `${12 * scale}px`;
  el.style.borderRadius = `${2 * scale}px`;
  el.style.background = background;
  el.style.pointerEvents = 'none';
  el.style.zIndex = '2147483002';
  el.style.boxShadow = '0 0 8px rgba(255,255,255,0.12)';
  el.style.willChange = 'transform, opacity';
  return el;
}

function emojiPiece(char: string, scale: number): HTMLElement {
  const el = createEl('div');
  el.style.position = 'fixed';
  el.style.fontSize = `${(14 + Math.floor(Math.random() * 10)) * scale}px`;
  el.style.lineHeight = '1';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '2147483002';
  el.style.filter = 'drop-shadow(0 3px 8px rgba(0,0,0,0.22))';
  el.style.willChange = 'transform, opacity';
  el.textContent = char;
  return el;
}

function resolveParticleConfig(ctx: EffectContext): ParticleConfig {
  const defaults = (confetti.defaults || {}) as Partial<ParticleConfig>;
  const theme = ctx.theme.particles;

  let emojiSet =
    Array.isArray(theme.emojiSet) && theme.emojiSet.length
      ? theme.emojiSet.slice()
      : Array.isArray(defaults.emojiSet) && defaults.emojiSet.length
        ? defaults.emojiSet.slice()
        : [];

  const emoji =
    typeof theme.emoji === 'string' && theme.emoji
      ? theme.emoji
      : typeof defaults.emoji === 'string' && defaults.emoji
        ? defaults.emoji
        : null;

  if (!emojiSet.length && emoji) emojiSet = [emoji];
  if (!emojiSet.length) emojiSet = TYPE_EMOJI_SETS[String(theme.type || defaults.type || 'confetti').toLowerCase()] || [];

  return {
    type: String(theme.type || defaults.type || 'confetti').toLowerCase(),
    density: clamp(Number(theme.density ?? defaults.density ?? 1), 0.05, 2.5),
    emoji,
    emojiSet,
    mixWithConfetti: Boolean(theme.mixWithConfetti ?? defaults.mixWithConfetti),
    motion: String(theme.motion || defaults.motion || 'fall').toLowerCase(),
    colors: Array.isArray(theme.colors) ? theme.colors.slice() : Array.isArray(defaults.colors) ? defaults.colors.slice() : [],
    size: clamp(Number(theme.size ?? defaults.size ?? 1), 0.5, 2.4),
  };
}

function animateAndRemove(piece: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions): void {
  const animation = piece.animate(keyframes, { fill: 'forwards', ...options });
  animation.onfinish = () => piece.remove();
}

function spawnFall(ctx: EffectContext, piece: HTMLElement, scale: number): void {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;
  const x0 = Math.random() * width;
  const drift = (Math.random() - 0.5) * 220;
  const rot = 360 * (Math.random() - 0.5) * 4;
  const duration = 1800 + Math.random() * 2200 + ctx.intensity * 800;

  ctx.addNode(piece);
  animateAndRemove(
    piece,
    [
      { transform: `translate(${x0}px, -24px) rotate(0deg) scale(${scale})`, opacity: 1 },
      { transform: `translate(${x0 + drift}px, ${height + 40}px) rotate(${rot}deg) scale(${scale * 0.92})`, opacity: 0.94 },
    ],
    { duration, easing: 'linear' },
  );
}

function spawnBurst(ctx: EffectContext, piece: HTMLElement, scale: number): void {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;
  const originX = Math.random() * width;
  const originY = height * (0.62 + Math.random() * 0.22);
  const dx = (Math.random() - 0.5) * (180 + ctx.intensity * 280);
  const dy = -(140 + Math.random() * 260 + ctx.intensity * 180);
  const rot = (Math.random() - 0.5) * 520;
  const duration = 950 + Math.random() * 700;

  ctx.addNode(piece);
  animateAndRemove(
    piece,
    [
      { transform: `translate(${originX}px, ${originY}px) rotate(0deg) scale(${scale * 0.65})`, opacity: 0 },
      { transform: `translate(${originX}px, ${originY - 12}px) rotate(${rot * 0.15}deg) scale(${scale})`, opacity: 1, offset: 0.14 },
      { transform: `translate(${originX + dx}px, ${originY + dy}px) rotate(${rot}deg) scale(${scale * 0.9})`, opacity: 0, offset: 1 },
    ],
    { duration, easing: 'cubic-bezier(0.18, 0.8, 0.22, 1)' },
  );
}

function spawnRise(ctx: EffectContext, piece: HTMLElement, scale: number): void {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;
  const x0 = Math.random() * width;
  const drift = (Math.random() - 0.5) * 140;
  const sway = (Math.random() - 0.5) * 80;
  const rot = (Math.random() - 0.5) * 22;
  const duration = 2200 + Math.random() * 1800;

  ctx.addNode(piece);
  animateAndRemove(
    piece,
    [
      { transform: `translate(${x0}px, ${height + 48}px) rotate(${-rot}deg) scale(${scale * 0.9})`, opacity: 0.96 },
      { transform: `translate(${x0 + sway}px, ${height * 0.45}px) rotate(${rot * 0.45}deg) scale(${scale})`, opacity: 1, offset: 0.48 },
      { transform: `translate(${x0 + drift}px, -88px) rotate(${rot}deg) scale(${scale * 1.04})`, opacity: 0.84, offset: 1 },
    ],
    { duration, easing: 'cubic-bezier(0.28, 0.84, 0.22, 1)' },
  );
}

function spawnHop(ctx: EffectContext, piece: HTMLElement, scale: number): void {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;
  const margin = 24;
  const x0 = margin + Math.random() * Math.max(1, width - margin * 2);
  const baseY = height - (22 + Math.random() * 42);
  const travel = (Math.random() - 0.5) * (120 + ctx.intensity * 110);
  const hop = 28 + Math.random() * 54 + ctx.intensity * 22;
  const tilt = (Math.random() - 0.5) * 20;
  const duration = 1500 + Math.random() * 900;

  ctx.addNode(piece);
  animateAndRemove(
    piece,
    [
      { transform: `translate(${x0}px, ${baseY}px) rotate(${-tilt}deg) scale(${scale})`, opacity: 0.96, offset: 0 },
      { transform: `translate(${x0 + travel * 0.25}px, ${baseY - hop}px) rotate(${tilt}deg) scale(${scale * 1.06})`, opacity: 1, offset: 0.22 },
      { transform: `translate(${x0 + travel * 0.5}px, ${baseY}px) rotate(${-tilt * 0.45}deg) scale(${scale * 0.96})`, opacity: 0.98, offset: 0.48 },
      { transform: `translate(${x0 + travel * 0.78}px, ${baseY - hop * 0.7}px) rotate(${tilt * 0.75}deg) scale(${scale * 1.03})`, opacity: 0.96, offset: 0.74 },
      { transform: `translate(${x0 + travel}px, ${baseY}px) rotate(${tilt * 0.2}deg) scale(${scale * 0.92})`, opacity: 0.88, offset: 1 },
    ],
    { duration, easing: 'ease-in-out' },
  );
}

function spawn(ctx: EffectContext, motion: string, piece: HTMLElement, scale: number): void {
  if (motion === 'burst') {
    spawnBurst(ctx, piece, scale);
    return;
  }
  if (motion === 'rise') {
    spawnRise(ctx, piece, scale);
    return;
  }
  if (motion === 'hop') {
    spawnHop(ctx, piece, scale);
    return;
  }
  spawnFall(ctx, piece, scale);
}

const confetti: ChaosEffect = {
  id: 'confetti',
  name: 'Confetti',
  description: 'Theme-aware particles that can fall, burst, rise, or hop using color pieces or emoji sprites.',
  category: 'visual',
  defaults: { type: 'confetti', mixWithConfetti: false, motion: 'fall', colors: [], emojiSet: [], size: 1 },
  apply(ctx) {
    const particle = resolveParticleConfig(ctx);
    const hp = hexHue(ctx.palette.primary);
    const ha = hexHue(ctx.palette.accent);
    const baseHue = hp ?? ha ?? 200;
    const useEmojiOnly = particle.emojiSet.length > 0 && !particle.mixWithConfetti;

    let count = Math.round((10 + ctx.intensity * 130) * particle.density);
    if (particle.type === 'minimal') count = clamp(Math.round(count * 0.25), 4, 40);
    else if (particle.motion === 'burst') count = clamp(Math.round(count * 0.72), 8, 120);
    else if (particle.motion === 'rise') count = clamp(Math.round(count * 0.56), 6, 90);
    else if (particle.motion === 'hop') count = clamp(Math.round(count * 0.18), 3, 18);
    else count = clamp(count, 6, 220);

    const forcedEmojiCount = particle.emojiSet.length
      ? Math.min(count, Math.max(1, Math.min(4, particle.emojiSet.length + (particle.mixWithConfetti ? 0 : 1))))
      : 0;
    const kickoffBurstCount =
      particle.motion === 'fall' && particle.type === 'confetti'
        ? clamp(Math.round(count * 0.18), 4, 28)
        : 0;

    for (let i = 0; i < count; i++) {
      const scale = clamp(particle.size * (0.8 + Math.random() * 0.55), 0.5, 2.8);
      const forceEmoji = i < forcedEmojiCount;
      const wantEmoji = particle.emojiSet.length > 0 && (forceEmoji || useEmojiOnly || Math.random() < 0.34);

      if (wantEmoji) {
        const emoji = particle.emojiSet[i % particle.emojiSet.length]!;
        spawn(ctx, particle.motion, emojiPiece(emoji, scale), scale);
        continue;
      }

      const color = particle.colors.length
        ? particle.colors[i % particle.colors.length]!
        : `hsl(${((baseHue + (Math.random() - 0.5) * 70 + (i % 7) * 12) % 360 + 360) % 360} ${65 + Math.random() * 30}% ${45 + Math.random() * 25}%)`;
      const piece = coloredPiece(color, scale);
      if (i < kickoffBurstCount) {
        spawnBurst(ctx, piece, scale);
        continue;
      }
      spawn(ctx, particle.motion, piece, scale);
    }
  },
};

export default confetti;
