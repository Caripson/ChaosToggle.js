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
    confirmText: 'Close',
  },
  apply(ctx) {
    const title = String(ctx.popup.title || popups.defaults?.title || 'Notice');
    const message = String(ctx.popup.message || popups.defaults?.message || 'Something happened.');
    const confirmText = String(ctx.popup.confirmText || popups.defaults?.confirmText || 'Close');
    const tone = String(ctx.popup.tone || 'neutral');
    const { primary, background, text } = ctx.palette;
    const toneMap: Record<string, string> = {
      bold: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
      celebratory: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,190,11,0.16))',
      eerie: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(139,92,246,0.16))',
      energetic: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,79,216,0.18))',
      friendly: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(42,157,111,0.14))',
      light: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,143,171,0.14))',
      neutral: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
      panic: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,0,0,0.18))',
      playful: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,200,221,0.18))',
      reflective: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(188,108,37,0.16))',
      retro: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,107,53,0.16))',
      serious: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,120,215,0.16))',
      system: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,245,255,0.14))',
      urgent: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(241,91,181,0.16))',
    };

    const box = createEl('div', 'ct-popup');
    box.style.background = background;
    box.style.backgroundImage = toneMap[tone] || toneMap.neutral || 'none';
    box.style.color = text;
    box.style.borderColor = primary;
    box.style.backdropFilter = 'blur(10px)';

    const h4 = createEl('h4');
    h4.textContent = title;
    const p = createEl('p');
    p.textContent = message;
    const btn = createEl('button');
    btn.textContent = confirmText;
    btn.style.background = primary;
    btn.style.color = text;

    const close = () => box.remove();
    btn.addEventListener('click', close, { once: true });

    box.append(h4, p, btn);
    ctx.addNode(box);
  },
};

export default popups;
