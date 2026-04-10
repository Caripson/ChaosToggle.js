import type { ChaosEffect, EffectContext } from '../core/types';
import { clamp, createEl } from '../core/utils';

type ParticleConfig = {
  type: string;
  density: number;
  emoji: string | null;
  emojiSet: string[];
  mixWithConfetti: boolean;
  motion: MotionKind;
  colors: string[];
  size: number;
};

type MotionKind = 'fall' | 'burst' | 'rise' | 'hop';
type ShapeKind = 'rect' | 'streamer' | 'dot' | 'emoji';

type RenderableParticle = {
  shape: ShapeKind;
  color: string;
  glyph: string | null;
  width: number;
  height: number;
  fontSize: number;
  radius: number;
};

type PhysicalParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drift: number;
  decay: number;
  rotation: number;
  spin: number;
  life: number;
  ticks: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  renderable: RenderableParticle;
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

function toMotionKind(value: string): MotionKind {
  if (value === 'burst' || value === 'rise' || value === 'hop') return value;
  return 'fall';
}

function randomRange(ctx: EffectContext, min: number, max: number): number {
  return min + ctx.random() * (max - min);
}

function randomSigned(ctx: EffectContext, size: number): number {
  return (ctx.random() - 0.5) * size * 2;
}

function pick<T>(ctx: EffectContext, items: T[]): T {
  return items[Math.floor(ctx.random() * items.length)] ?? items[0]!;
}

function hslPiece(hue: number, ctx: EffectContext, index: number): string {
  const shifted = ((hue + randomSigned(ctx, 36) + (index % 7) * 12) % 360 + 360) % 360;
  const saturation = 66 + Math.round(ctx.random() * 24);
  const lightness = 46 + Math.round(ctx.random() * 22);
  return `hsl(${shifted} ${saturation}% ${lightness}%)`;
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
    motion: toMotionKind(String(theme.motion || defaults.motion || 'fall').toLowerCase()),
    colors: Array.isArray(theme.colors) ? theme.colors.slice() : Array.isArray(defaults.colors) ? defaults.colors.slice() : [],
    size: clamp(Number(theme.size ?? defaults.size ?? 1), 0.5, 2.4),
  };
}

function resolveParticleCount(ctx: EffectContext, particle: ParticleConfig): number {
  let count = Math.round((26 + ctx.intensity * 170) * particle.density);
  if (particle.type === 'minimal') count = clamp(Math.round(count * 0.24), 6, 44);
  else if (particle.motion === 'burst') count = clamp(Math.round(count * 0.88), 18, 180);
  else if (particle.motion === 'rise') count = clamp(Math.round(count * 0.72), 14, 150);
  else if (particle.motion === 'hop') count = clamp(Math.round(count * 0.3), 8, 42);
  else count = clamp(count, 20, 220);
  return count;
}

function resolvePaletteColors(ctx: EffectContext, particle: ParticleConfig, count: number): string[] {
  if (particle.colors.length) {
    return Array.from({ length: count }, (_, index) => particle.colors[index % particle.colors.length]!);
  }

  const baseHue = hexHue(ctx.palette.primary) ?? hexHue(ctx.palette.accent) ?? 200;
  return Array.from({ length: count }, (_, index) => hslPiece(baseHue, ctx, index));
}

function createRenderable(
  ctx: EffectContext,
  particle: ParticleConfig,
  paletteColors: string[],
  index: number,
  count: number,
): RenderableParticle {
  const emojiOnly = particle.emojiSet.length > 0 && !particle.mixWithConfetti;
  const guaranteedEmoji = particle.emojiSet.length
    ? Math.min(count, Math.max(1, Math.min(8, particle.emojiSet.length + (particle.mixWithConfetti ? 1 : 3))))
    : 0;
  const emojiChance = emojiOnly ? 1 : 0.24 + ctx.intensity * 0.1;
  const wantEmoji = particle.emojiSet.length > 0 && (index < guaranteedEmoji || ctx.random() < emojiChance);
  const scale = clamp(particle.size * (0.82 + ctx.random() * 0.7), 0.55, 2.8);

  if (wantEmoji) {
    return {
      shape: 'emoji',
      glyph: particle.emojiSet[index % particle.emojiSet.length]!,
      color: '#ffffff',
      width: 0,
      height: 0,
      fontSize: clamp((20 + ctx.random() * 18) * scale, 16, 56),
      radius: 0,
    };
  }

  const shape = pick<ShapeKind>(ctx, ['rect', 'rect', 'streamer', 'dot']);
  if (shape === 'dot') {
    const radius = clamp((2.6 + ctx.random() * 3.8) * scale, 2.2, 11);
    return {
      shape,
      glyph: null,
      color: paletteColors[index]!,
      width: radius * 2,
      height: radius * 2,
      fontSize: 0,
      radius,
    };
  }

  const width = clamp((shape === 'streamer' ? 5.5 : 7.5) * scale, 4, 24);
  const height = clamp((shape === 'streamer' ? 18 : 11.5) * scale, 7, 42);
  return {
    shape,
    glyph: null,
    color: paletteColors[index]!,
    width,
    height,
    fontSize: 0,
    radius: 0,
  };
}

function angleVelocity(ctx: EffectContext, angleDeg: number, spreadDeg: number, minSpeed: number, maxSpeed: number): { vx: number; vy: number } {
  const angle = (angleDeg + randomSigned(ctx, spreadDeg * 0.5)) * (Math.PI / 180);
  const speed = randomRange(ctx, minSpeed, maxSpeed);
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function createFallParticle(
  ctx: EffectContext,
  renderable: RenderableParticle,
  index: number,
  count: number,
  width: number,
  height: number,
): PhysicalParticle {
  const kickoffCount = clamp(Math.round(count * 0.22), 6, 28);
  const fromCannon = index < kickoffCount;
  const opacity = clamp(0.84 + ctx.random() * 0.18, 0.82, 1);

  if (fromCannon) {
    const fromLeft = index % 2 === 0;
    const originX = fromLeft ? width * (0.06 + ctx.random() * 0.1) : width * (0.84 + ctx.random() * 0.1);
    const originY = height * (0.05 + ctx.random() * 0.08);
    const velocity = angleVelocity(ctx, fromLeft ? 64 : 116, 34 + ctx.intensity * 22, 5.8, 10.5 + ctx.intensity * 3.2);
    return {
      x: originX,
      y: originY,
      vx: velocity.vx,
      vy: velocity.vy,
      gravity: randomRange(ctx, 0.13, 0.2),
      drift: randomSigned(ctx, 0.08 + ctx.intensity * 0.1),
      decay: randomRange(ctx, 0.985, 0.992),
      rotation: randomRange(ctx, -Math.PI, Math.PI),
      spin: randomSigned(ctx, 0.22),
      life: 0,
      ticks: Math.round(randomRange(ctx, 62, 102 + ctx.intensity * 32)),
      wobble: randomRange(ctx, 0, Math.PI * 2),
      wobbleSpeed: randomRange(ctx, 0.1, 0.24),
      opacity,
      renderable,
    };
  }

  return {
    x: randomRange(ctx, -width * 0.05, width * 1.05),
    y: randomRange(ctx, -48, height * 0.16),
    vx: randomSigned(ctx, 1.2 + ctx.intensity * 1.2),
    vy: randomRange(ctx, 1.8, 4.6 + ctx.intensity * 1.2),
    gravity: randomRange(ctx, 0.045, 0.095),
    drift: randomSigned(ctx, 0.05 + ctx.intensity * 0.08),
    decay: randomRange(ctx, 0.994, 0.998),
    rotation: randomRange(ctx, -Math.PI, Math.PI),
    spin: randomSigned(ctx, 0.15),
    life: 0,
    ticks: Math.round(randomRange(ctx, 118, 190 + ctx.intensity * 40)),
    wobble: randomRange(ctx, 0, Math.PI * 2),
    wobbleSpeed: randomRange(ctx, 0.06, 0.18),
    opacity,
    renderable,
  };
}

function createBurstParticle(
  ctx: EffectContext,
  renderable: RenderableParticle,
  index: number,
  width: number,
  height: number,
): PhysicalParticle {
  const lane = index % 3;
  const originX = lane === 0 ? width * (0.12 + ctx.random() * 0.12) : lane === 1 ? width * (0.4 + ctx.random() * 0.2) : width * (0.76 + ctx.random() * 0.12);
  const originY = lane === 1 ? height * (0.62 + ctx.random() * 0.1) : height * (0.74 + ctx.random() * 0.12);
  const angle = lane === 0 ? 72 : lane === 1 ? 90 : 108;
  const velocity = angleVelocity(ctx, angle, 52 + ctx.intensity * 26, 6.2, 12.5 + ctx.intensity * 4.2);

  return {
    x: originX,
    y: originY,
    vx: velocity.vx,
    vy: velocity.vy,
    gravity: randomRange(ctx, 0.11, 0.18),
    drift: randomSigned(ctx, 0.08 + ctx.intensity * 0.12),
    decay: randomRange(ctx, 0.982, 0.991),
    rotation: randomRange(ctx, -Math.PI, Math.PI),
    spin: randomSigned(ctx, 0.26),
    life: 0,
    ticks: Math.round(randomRange(ctx, 64, 110 + ctx.intensity * 28)),
    wobble: randomRange(ctx, 0, Math.PI * 2),
    wobbleSpeed: randomRange(ctx, 0.12, 0.28),
    opacity: clamp(0.88 + ctx.random() * 0.12, 0.86, 1),
    renderable,
  };
}

function createRiseParticle(ctx: EffectContext, renderable: RenderableParticle, width: number, height: number): PhysicalParticle {
  const originX = randomRange(ctx, width * 0.06, width * 0.94);
  const originY = randomRange(ctx, height * 0.82, height + 36);
  const velocity = angleVelocity(ctx, -90, 44 + ctx.intensity * 22, 5.4, 10.2 + ctx.intensity * 2.8);

  return {
    x: originX,
    y: originY,
    vx: velocity.vx,
    vy: velocity.vy,
    gravity: randomRange(ctx, 0.08, 0.13),
    drift: randomSigned(ctx, 0.08 + ctx.intensity * 0.1),
    decay: randomRange(ctx, 0.985, 0.993),
    rotation: randomRange(ctx, -Math.PI, Math.PI),
    spin: randomSigned(ctx, 0.12),
    life: 0,
    ticks: Math.round(randomRange(ctx, 72, 132 + ctx.intensity * 24)),
    wobble: randomRange(ctx, 0, Math.PI * 2),
    wobbleSpeed: randomRange(ctx, 0.08, 0.18),
    opacity: clamp(0.86 + ctx.random() * 0.14, 0.84, 1),
    renderable,
  };
}

function createHopParticle(ctx: EffectContext, renderable: RenderableParticle, width: number, height: number): PhysicalParticle {
  const originX = randomRange(ctx, 24, Math.max(24, width - 24));
  const originY = randomRange(ctx, height - 28, height - 10);
  const velocity = angleVelocity(ctx, -90, 34 + ctx.intensity * 12, 3.8, 6.8 + ctx.intensity * 1.5);

  return {
    x: originX,
    y: originY,
    vx: velocity.vx,
    vy: velocity.vy,
    gravity: randomRange(ctx, 0.17, 0.25),
    drift: randomSigned(ctx, 0.06 + ctx.intensity * 0.04),
    decay: randomRange(ctx, 0.984, 0.991),
    rotation: randomRange(ctx, -Math.PI, Math.PI),
    spin: randomSigned(ctx, 0.16),
    life: 0,
    ticks: Math.round(randomRange(ctx, 34, 62 + ctx.intensity * 12)),
    wobble: randomRange(ctx, 0, Math.PI * 2),
    wobbleSpeed: randomRange(ctx, 0.12, 0.24),
    opacity: clamp(0.88 + ctx.random() * 0.12, 0.84, 1),
    renderable,
  };
}

function createPhysicalParticle(
  ctx: EffectContext,
  particle: ParticleConfig,
  renderable: RenderableParticle,
  index: number,
  count: number,
  width: number,
  height: number,
): PhysicalParticle {
  if (particle.motion === 'burst') return createBurstParticle(ctx, renderable, index, width, height);
  if (particle.motion === 'rise') return createRiseParticle(ctx, renderable, width, height);
  if (particle.motion === 'hop') return createHopParticle(ctx, renderable, width, height);
  return createFallParticle(ctx, renderable, index, count, width, height);
}

function hasRenderableCanvasContext(
  value: CanvasRenderingContext2D | null,
): value is CanvasRenderingContext2D & Required<Pick<CanvasRenderingContext2D, 'clearRect' | 'save' | 'restore' | 'translate' | 'rotate' | 'beginPath' | 'arc' | 'fill' | 'fillRect' | 'fillText'>> {
  return Boolean(
    value &&
      typeof value.clearRect === 'function' &&
      typeof value.save === 'function' &&
      typeof value.restore === 'function' &&
      typeof value.translate === 'function' &&
      typeof value.rotate === 'function' &&
      typeof value.beginPath === 'function' &&
      typeof value.arc === 'function' &&
      typeof value.fill === 'function' &&
      typeof value.fillRect === 'function' &&
      typeof value.fillText === 'function',
  );
}

function drawParticle(g: CanvasRenderingContext2D, particle: PhysicalParticle): void {
  const lifeIn = clamp(particle.life / 8, 0, 1);
  const lifeOut = clamp((particle.ticks - particle.life) / Math.max(14, particle.ticks * 0.24), 0, 1);
  const alpha = particle.opacity * Math.min(lifeIn, lifeOut);
  if (alpha <= 0.01) return;

  g.save();
  g.globalAlpha = alpha;
  g.translate(particle.x, particle.y);
  g.rotate(particle.rotation);
  g.translate(Math.sin(particle.wobble) * 1.6, Math.cos(particle.wobble * 1.3) * 0.8);

  if (particle.renderable.shape === 'emoji') {
    g.font = `${particle.renderable.fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.shadowColor = 'rgba(0,0,0,0.28)';
    g.shadowBlur = Math.max(6, particle.renderable.fontSize * 0.22);
    g.fillText(particle.renderable.glyph || '•', 0, 0);
    g.restore();
    return;
  }

  g.fillStyle = particle.renderable.color;
  g.shadowColor = 'rgba(255,255,255,0.16)';
  g.shadowBlur = 8;

  if (particle.renderable.shape === 'dot') {
    g.beginPath();
    g.arc(0, 0, particle.renderable.radius, 0, Math.PI * 2);
    g.fill();
    g.restore();
    return;
  }

  const wobbleTilt = 0.72 + Math.sin(particle.wobble) * 0.35;
  const width = particle.renderable.width * wobbleTilt;
  const height = particle.renderable.height;
  const radius = Math.min(width, height) * 0.24;
  if (typeof g.roundRect === 'function') {
    g.beginPath();
    g.roundRect(-width / 2, -height / 2, width, height, radius);
    g.fill();
  } else {
    g.fillRect(-width / 2, -height / 2, width, height);
  }
  g.restore();
}

const confetti: ChaosEffect = {
  id: 'confetti',
  name: 'Confetti',
  description: 'Canvas-driven theme-aware confetti with burst, fall, rise, and hop motion profiles.',
  category: 'visual',
  defaults: { type: 'confetti', mixWithConfetti: false, motion: 'fall', colors: [], emojiSet: [], size: 1 },
  apply(ctx) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const particle = resolveParticleConfig(ctx);
    const total = resolveParticleCount(ctx, particle);
    const paletteColors = resolvePaletteColors(ctx, particle, total);

    const host = createEl('div', 'ct-confetti-field');
    Object.assign(host.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: '2147483002',
    } as CSSStyleDeclaration);

    const canvas = createEl('canvas', 'ct-confetti-canvas') as HTMLCanvasElement;
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
    } as CSSStyleDeclaration);
    host.appendChild(canvas);

    const meta = createEl('div', 'ct-confetti-meta');
    meta.setAttribute('aria-hidden', 'true');
    meta.dataset.theme = ctx.themeName;
    meta.dataset.motion = particle.motion;
    meta.dataset.particleType = particle.type;
    Object.assign(meta.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap',
      border: '0',
    } as CSSStyleDeclaration);
    meta.textContent = particle.emojiSet.join(' ');
    host.appendChild(meta);

    ctx.addNode(host);

    const context = canvas.getContext('2d', { alpha: true });
    if (!hasRenderableCanvasContext(context)) {
      return () => {
        host.remove();
      };
    }
    const g = context;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (): void => {
      width = Math.max(window.innerWidth || 1, 1);
      height = Math.max(window.innerHeight || 1, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (typeof g.setTransform === 'function') {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resize();

    const particles: PhysicalParticle[] = Array.from({ length: total }, (_, index) => {
      const renderable = createRenderable(ctx, particle, paletteColors, index, total);
      return createPhysicalParticle(ctx, particle, renderable, index, total, width, height);
    });

    const onResize = (): void => {
      resize();
    };
    window.addEventListener('resize', onResize);

    const tick = (): void => {
      if (!running) return;
      raf = window.requestAnimationFrame(tick);
      g.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const current = particles[i];
        if (!current) continue;

        current.life += 1;
        current.x += current.vx;
        current.y += current.vy;
        current.vx = current.vx * current.decay + current.drift;
        current.vy = current.vy * current.decay + current.gravity;
        current.rotation += current.spin;
        current.wobble += current.wobbleSpeed;

        const outOfBounds =
          current.x < -140 ||
          current.x > width + 140 ||
          current.y < -180 ||
          current.y > height + 180;

        if (current.life >= current.ticks || outOfBounds) {
          particles.splice(i, 1);
          continue;
        }

        drawParticle(g, current);
      }

      if (!particles.length) running = false;
    };

    tick();

    return () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      host.remove();
    };
  },
};

export default confetti;
