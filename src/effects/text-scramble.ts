import type { ChaosEffect } from '../core/types';

const SEL = 'h1,h2,h3,p,button,a,span';
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

function pickTextEls(root: HTMLElement, max: number): HTMLElement[] {
  const out: HTMLElement[] = [];
  const nodes = root.querySelectorAll<HTMLElement>(SEL);
  for (let i = 0; i < nodes.length && out.length < max; i++) {
    const el = nodes[i]!;
    const t = el.textContent;
    if (t && t.trim()) out.push(el);
  }
  return out;
}

function scramble(s: string): string {
  let r = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    r += /\s/.test(c) ? c : CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  }
  return r;
}

const textScramble: ChaosEffect = {
  id: 'textScramble',
  name: 'Text scramble',
  description: 'Temporarily replaces visible text with random characters, then restores it.',
  category: 'dom',
  apply(ctx) {
    const els = pickTextEls(ctx.root, 18);
    if (!els.length) return;

    const originals = els.map(el => el.textContent ?? '');
    let ticks = 0;
    let id = 0;

    const restore = () => {
      for (let i = 0; i < els.length; i++) els[i]!.textContent = originals[i]!;
    };

    const stop = () => {
      if (id) clearInterval(id);
      id = 0;
      restore();
    };

    id = window.setInterval(() => {
      ticks++;
      for (let i = 0; i < els.length; i++) els[i]!.textContent = scramble(originals[i]!);
      if (ticks >= 8) stop();
    }, 80);

    ctx.addTimer(id);

    return () => stop();
  },
};

export default textScramble;
