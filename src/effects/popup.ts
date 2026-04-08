import type { ChaosEffect } from '../core/types';
import { createEl } from '../core/utils';

const popups: ChaosEffect = {
  id: 'popups',
  name: 'Popup',
  description: 'Corner toast with title, message, and dismiss control.',
  category: 'interaction',
  defaults: {
    title: 'Notice',
    message: 'Something happened.',
  },
  apply(ctx) {
    const title = String(popups.defaults?.title ?? 'Notice');
    const message = String(popups.defaults?.message ?? 'Something happened.');
    const { primary, background, text } = ctx.palette;

    const box = createEl('div', 'ct-popup');
    box.style.background = background;
    box.style.color = text;
    box.style.borderColor = primary;

    const h4 = createEl('h4');
    h4.textContent = title;
    const p = createEl('p');
    p.textContent = message;
    const btn = createEl('button');
    btn.textContent = 'Close';
    btn.style.background = primary;
    btn.style.color = text;

    const close = () => box.remove();
    btn.addEventListener('click', close, { once: true });

    box.append(h4, p, btn);
    ctx.addNode(box);
  },
};

export default popups;
