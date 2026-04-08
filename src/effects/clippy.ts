import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const MESSAGES = [
  "It looks like you're trying to work. Would you like help procrastinating?",
  "It looks like you're writing an email. Want me to add three more exclamation points?",
  "It looks like you're debugging. Shall I suggest turning it off and on again?",
  "It looks like you're in a meeting. I can pretend your mic is broken.",
  "It looks like you're focused. Would you like a random Wikipedia rabbit hole?",
  "It looks like you're almost done. How about we rearrange your desktop icons?",
];

const CORNERS = ['bottom-right', 'bottom-left', 'top-right', 'top-left'] as const;

function cornerStyles(corner: (typeof CORNERS)[number]): Partial<CSSStyleDeclaration> {
  const base = {
    position: 'fixed',
    zIndex: '2147483645',
    maxWidth: 'min(320px, 92vw)',
    fontFamily: 'Tahoma, "Segoe UI", sans-serif',
  } as Partial<CSSStyleDeclaration>;
  const pad = '16px';
  if (corner === 'bottom-right') return { ...base, bottom: pad, right: pad };
  if (corner === 'bottom-left') return { ...base, bottom: pad, left: pad };
  if (corner === 'top-right') return { ...base, top: pad, right: pad };
  return { ...base, top: pad, left: pad };
}

const effect: ChaosEffect = {
  id: 'clippy',
  name: 'Clippy',
  description: 'Paperclip assistant with unhelpful suggestions.',
  category: 'prank',
  apply(ctx: EffectContext) {
    let cornerIdx = 0;

    const wrap = createEl('div', 'ct-clippy');
    Object.assign(wrap.style, cornerStyles(CORNERS[cornerIdx]!));

    const inner = createEl('div');
    Object.assign(inner.style, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    } as CSSStyleDeclaration);

    const clipRow = createEl('div');
    Object.assign(clipRow.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '42px',
      lineHeight: '1',
      userSelect: 'none',
    } as CSSStyleDeclaration);

    const clip = createEl('span');
    clip.textContent = '📎';
    clip.setAttribute('aria-hidden', 'true');

    const bubble = createEl('div');
    Object.assign(bubble.style, {
      background: '#ffffe1',
      border: '1px solid #000',
      borderRadius: '4px',
      padding: '12px 14px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.25)',
      fontSize: '13px',
      lineHeight: '1.35',
      color: '#000',
      position: 'relative',
    } as CSSStyleDeclaration);

    const tail = createEl('div');
    Object.assign(tail.style, {
      position: 'absolute',
      bottom: '-8px',
      right: '24px',
      width: '0',
      height: '0',
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '8px solid #ffffe1',
    } as CSSStyleDeclaration);
    bubble.appendChild(tail);

    const msg = createEl('p');
    msg.textContent = MESSAGES[0]!;
    Object.assign(msg.style, { margin: '0', paddingRight: '28px' } as CSSStyleDeclaration);
    bubble.insertBefore(msg, tail);

    const close = createEl('button');
    close.setAttribute('type', 'button');
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close');
    Object.assign(close.style, {
      position: 'absolute',
      top: '6px',
      right: '8px',
      width: '22px',
      height: '22px',
      padding: '0',
      lineHeight: '20px',
      fontSize: '16px',
      border: '1px solid #888',
      background: '#eee',
      cursor: 'pointer',
      borderRadius: '2px',
    } as CSSStyleDeclaration);

    bubble.appendChild(close);

    clipRow.appendChild(clip);
    inner.appendChild(bubble);
    inner.appendChild(clipRow);
    wrap.appendChild(inner);
    ctx.addNode(wrap);

    let msgIdx = 0;
    const rotate = window.setInterval(() => {
      msgIdx = (msgIdx + 1) % MESSAGES.length;
      msg.textContent = MESSAGES[msgIdx]!;
    }, 3000);
    ctx.addTimer(rotate);

    const onClose = () => {
      cornerIdx = (cornerIdx + 1) % CORNERS.length;
      Object.assign(wrap.style, cornerStyles(CORNERS[cornerIdx]!));
      wrap.style.transition = 'transform 0.15s ease-out';
      wrap.style.transform = 'scale(1.08)';
      const hop = window.setTimeout(() => {
        wrap.style.transform = 'scale(1)';
      }, 150);
      ctx.addTimer(hop);
    };
    close.addEventListener('click', onClose);

    return () => {
      clearInterval(rotate);
      close.removeEventListener('click', onClose);
      wrap.remove();
    };
  },
};

export default effect;
