import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl, clamp } from '../core/utils';

const NEIGHBORS: Record<string, string[]> = {
  q: ['w', 'a', 's'],
  w: ['q', 'e', 'a', 's'],
  e: ['w', 'r', 's', 'd'],
  r: ['e', 't', 'd', 'f'],
  t: ['r', 'y', 'f', 'g'],
  y: ['t', 'u', 'g', 'h'],
  u: ['y', 'i', 'h', 'j'],
  i: ['u', 'o', 'j', 'k'],
  o: ['i', 'p', 'k', 'l'],
  p: ['o', 'l'],
  a: ['q', 'w', 's', 'z'],
  s: ['a', 'w', 'e', 'd', 'x', 'z'],
  d: ['s', 'e', 'r', 'f', 'c', 'x'],
  f: ['d', 'r', 't', 'g', 'v', 'c'],
  g: ['f', 't', 'y', 'h', 'b', 'v'],
  h: ['g', 'y', 'u', 'j', 'n', 'b'],
  j: ['h', 'u', 'i', 'k', 'm', 'n'],
  k: ['j', 'i', 'o', 'l', 'm'],
  l: ['k', 'o', 'p'],
  z: ['a', 's', 'x'],
  x: ['z', 's', 'd', 'c'],
  c: ['x', 'd', 'f', 'v'],
  v: ['c', 'f', 'g', 'b'],
  b: ['v', 'g', 'h', 'n'],
  n: ['b', 'h', 'j', 'm'],
  m: ['n', 'j', 'k'],
};

function wrongFor(ch: string): string {
  const lower = ch.toLowerCase();
  const pool = NEIGHBORS[lower] || ['x', 'z', 'q'];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return ch === ch.toUpperCase() ? pick.toUpperCase() : pick;
}

const effect: ChaosEffect = {
  id: 'autoTypo',
  name: 'Auto typo',
  description: 'Sometimes sneaks an extra neighbor key into fields.',
  category: 'interaction',
  apply(ctx: EffectContext): () => void {
    const baseChance = 0.15 * clamp(0.35 + ctx.intensity * 0.65, 0, 1);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      if (Math.random() > baseChance) return;
      const el = e.target as HTMLElement;
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return;
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      if (input.readOnly || input.disabled) return;
      e.preventDefault();
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const val = input.value;
      const wrong = wrongFor(e.key);
      const next = val.slice(0, start) + e.key + wrong + val.slice(end);
      input.value = next;
      const pos = start + 2;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
    };
  },
};

export default effect;
