import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const effect: ChaosEffect = {
  id: 'fakeCrash',
  name: 'Fake Chrome Crash',
  description: 'Chrome-style “Aw, Snap!” crash page prank.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-fake-crash');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: '#f3f3f3',
      color: '#202124',
      fontFamily: 'Roboto, "Segoe UI", system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      boxSizing: 'border-box',
    } as CSSStyleDeclaration);

    const box = createEl('div');
    Object.assign(box.style, {
      maxWidth: '600px',
      textAlign: 'center',
    } as CSSStyleDeclaration);

    const iconWrap = createEl('div');
    Object.assign(iconWrap.style, {
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'center',
    } as CSSStyleDeclaration);

    const icon = createEl('div');
    icon.setAttribute('aria-hidden', 'true');
    Object.assign(icon.style, {
      width: '72px',
      height: '96px',
      border: '3px solid #9aa0a6',
      borderRadius: '4px',
      position: 'relative',
      background: '#fff',
      boxSizing: 'border-box',
    } as CSSStyleDeclaration);
    const face = createEl('div');
    Object.assign(face.style, {
      position: 'absolute',
      left: '50%',
      top: '42%',
      transform: 'translate(-50%, -50%)',
      fontSize: '36px',
      lineHeight: '1',
      color: '#9aa0a6',
    } as CSSStyleDeclaration);
    face.textContent = ':(';
    icon.appendChild(face);
    iconWrap.appendChild(icon);

    const heading = createEl('h1');
    heading.textContent = 'Aw, Snap!';
    Object.assign(heading.style, {
      margin: '0 0 12px',
      fontSize: '24px',
      fontWeight: '400',
    } as CSSStyleDeclaration);

    const msg = createEl('p');
    msg.textContent = 'Something went wrong while displaying this webpage.';
    Object.assign(msg.style, {
      margin: '0 0 8px',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#5f6368',
    } as CSSStyleDeclaration);

    const code = createEl('p');
    code.textContent = 'Error code: CHAOS_ERR_TOO_MUCH_FUN';
    Object.assign(code.style, {
      margin: '0 0 28px',
      fontSize: '13px',
      color: '#80868b',
    } as CSSStyleDeclaration);

    const btn = createEl('button');
    btn.setAttribute('type', 'button');
    btn.textContent = 'Reload';
    Object.assign(btn.style, {
      background: '#1a73e8',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
    } as CSSStyleDeclaration);

    const onReload = () => {
      btn.style.transform = 'scale(0.97)';
      const t = window.setTimeout(() => {
        btn.style.transform = 'scale(1)';
        code.textContent = 'Error code: CHAOS_ERR_STILL_HAVING_FUN';
      }, 120);
      ctx.addTimer(t);
    };
    btn.addEventListener('click', onReload);

    box.appendChild(iconWrap);
    box.appendChild(heading);
    box.appendChild(msg);
    box.appendChild(code);
    box.appendChild(btn);
    overlay.appendChild(box);
    ctx.addNode(overlay);

    return () => {
      btn.removeEventListener('click', onReload);
      overlay.remove();
    };
  },
};

export default effect;
