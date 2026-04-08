import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const LINES = [
  '$ sudo rm -rf /',
  '[sudo] password for chaos:',
  'Accessing mainframe...',
  'Decrypting files... [OK]',
  'Downloading user data... 100%',
  'Uploading to remote server...',
  'Bypassing firewall... [DONE]',
  'root@chaos:~# ./exploit.sh --verbose',
  'Injecting payload into /dev/null... success',
  'Establishing encrypted tunnel to 192.168.CHAOS.1...',
];

const CHAR_MS = 40;

const effect: ChaosEffect = {
  id: 'fakeTerminal',
  name: 'Fake Terminal',
  description: 'Hollywood-style typing terminal overlay.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-fake-terminal');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: '#0a0a0a',
      color: '#33ff33',
      fontFamily: 'ui-monospace, "Cascadia Code", "Consolas", "Menlo", monospace',
      fontSize: 'clamp(13px, 1.6vw, 16px)',
      lineHeight: '1.45',
      padding: '24px',
      boxSizing: 'border-box',
      overflow: 'auto',
      textShadow: '0 0 6px rgba(51,255,51,0.35)',
    } as CSSStyleDeclaration);

    const pre = createEl('pre');
    Object.assign(pre.style, {
      margin: '0',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    } as CSSStyleDeclaration);

    const buffer = document.createTextNode('');
    const cursor = createEl('span');
    cursor.textContent = '█';
    Object.assign(cursor.style, {
      animation: 'ct-term-blink 1s step-end infinite',
      color: '#33ff33',
    } as CSSStyleDeclaration);

    const styleId = 'ct-fake-terminal-blink';
    if (!document.getElementById(styleId)) {
      const s = createEl('style') as HTMLStyleElement;
      s.id = styleId;
      s.textContent = '@keyframes ct-term-blink { 50% { opacity: 0; } }';
      document.head.appendChild(s);
    }

    pre.appendChild(buffer);
    pre.appendChild(cursor);
    overlay.appendChild(pre);
    ctx.addNode(overlay);

    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;
    let timeoutId = 0;

    const schedule = (fn: () => void, ms: number) => {
      timeoutId = window.setTimeout(fn, ms);
      ctx.addTimer(timeoutId);
    };

    const typeNext = () => {
      if (cancelled) return;
      const full = LINES[lineIndex] ?? '';
      if (charIndex < full.length) {
        buffer.data += full[charIndex]!;
        charIndex += 1;
        schedule(typeNext, CHAR_MS);
        return;
      }
      if (lineIndex < LINES.length - 1) {
        buffer.data += '\n';
        lineIndex += 1;
        charIndex = 0;
        schedule(typeNext, 200 + Math.round(Math.random() * 400));
        return;
      }
      schedule(() => {
        if (!cancelled) buffer.data += '\n$ ';
      }, 600);
    };

    schedule(typeNext, 400);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      overlay.remove();
    };
  },
};

export default effect;
