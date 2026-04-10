import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const STICKY = new Set([27, 42, 76, 89]);

function randomDigits(ctx: EffectContext, length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += String(Math.floor(ctx.random() * 10));
  }
  return out;
}

const effect: ChaosEffect = {
  id: 'fakeUpdate',
  name: 'Fake Windows Update',
  description: 'Convincing full-screen Windows Update progress prank.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-fake-update');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background:
        'radial-gradient(circle at 50% 24%, rgba(80, 170, 255, 0.16), transparent 20%), radial-gradient(circle at 50% 78%, rgba(0, 54, 120, 0.22), transparent 42%), #07090f',
      color: '#f3f3f3',
      fontFamily: '"Segoe UI", "Segoe UI Variable", system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      boxSizing: 'border-box',
      padding: 'clamp(28px, 6vw, 56px)',
      overflow: 'hidden',
      isolation: 'isolate',
    } as CSSStyleDeclaration);

    const styleId = 'ct-fake-update-spin';
    if (!document.getElementById(styleId)) {
      const s = createEl('style') as HTMLStyleElement;
      s.id = styleId;
      s.textContent = `
        @keyframes ct-fu-pulse {
          0%, 80%, 100% { opacity: 0.22; transform: translate(var(--x), var(--y)) scale(0.48); }
          40% { opacity: 1; transform: translate(var(--x), var(--y)) scale(1); }
        }
        .ct-fake-update__dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 10px;
          height: 10px;
          margin: -5px 0 0 -5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 0 12px rgba(255,255,255,0.3);
          animation: ct-fu-pulse 1.12s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.12s);
        }
        .ct-fake-update__timeline-step {
          transition: opacity 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        .ct-fake-update__timeline-step.is-active {
          opacity: 1;
          border-color: rgba(255,255,255,0.32);
          background: rgba(255,255,255,0.14);
          transform: translateY(-1px);
        }
        .ct-fake-update__timeline-step.is-complete {
          opacity: 0.92;
          border-color: rgba(255,255,255,0.24);
          background: rgba(255,255,255,0.09);
        }
      `;
      document.head.appendChild(s);
    }

    const haze = createEl('div', 'ct-fake-update__haze');
    haze.setAttribute('aria-hidden', 'true');
    Object.assign(haze.style, {
      position: 'absolute',
      inset: '-10%',
      background:
        'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.06), transparent 18%), radial-gradient(circle at 50% 78%, rgba(0,100,220,0.18), transparent 40%)',
      filter: 'blur(18px)',
      opacity: '0.9',
      zIndex: '0',
      pointerEvents: 'none',
    } as CSSStyleDeclaration);
    overlay.appendChild(haze);

    const shell = createEl('div', 'ct-fake-update__shell');
    Object.assign(shell.style, {
      position: 'relative',
      zIndex: '1',
      width: 'min(720px, 100%)',
      display: 'grid',
      justifyItems: 'center',
      gap: '18px',
      textAlign: 'center',
    } as CSSStyleDeclaration);

    const system = createEl('div', 'ct-fake-update__system');
    system.textContent = `Windows Update  KB${randomDigits(ctx, 6)}  Build ${randomDigits(ctx, 2)}.${randomDigits(ctx, 4)}`;
    Object.assign(system.style, {
      fontSize: '12px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      opacity: '0.58',
      marginBottom: '6px',
    } as CSSStyleDeclaration);

    const spinner = createEl('div', 'ct-fake-update__spinner');
    Object.assign(spinner.style, {
      position: 'relative',
      width: '82px',
      height: '82px',
      marginBottom: '2px',
    } as CSSStyleDeclaration);

    for (let i = 0; i < 8; i += 1) {
      const dot = createEl('div', 'ct-fake-update__dot');
      const angle = (Math.PI * 2 * i) / 8;
      dot.style.setProperty('--i', String(i));
      dot.style.setProperty('--x', `${Math.cos(angle) * 30}px`);
      dot.style.setProperty('--y', `${Math.sin(angle) * 30}px`);
      spinner.appendChild(dot);
    }

    const title = createEl('h1');
    title.textContent = 'Working on updates';
    Object.assign(title.style, {
      margin: '0',
      fontSize: 'clamp(24px, 4vw, 38px)',
      fontWeight: '200',
      letterSpacing: '0.02em',
    } as CSSStyleDeclaration);

    const pct = createEl('p', 'ct-fake-update__percent');
    pct.textContent = '0%';
    Object.assign(pct.style, {
      margin: '0',
      fontSize: 'clamp(44px, 7vw, 80px)',
      fontWeight: '200',
      fontVariantNumeric: 'tabular-nums',
      lineHeight: '1',
    } as CSSStyleDeclaration);

    const stage = createEl('p', 'ct-fake-update__stage');
    stage.textContent = 'Stage 1 of 4 · Downloading cumulative update';
    Object.assign(stage.style, {
      margin: '0',
      fontSize: '15px',
      opacity: '0.9',
      letterSpacing: '0.03em',
    } as CSSStyleDeclaration);

    const sub = createEl('p');
    sub.textContent = 'Keep your computer on. Your system will restart automatically.';
    Object.assign(sub.style, {
      margin: '0',
      fontSize: '15px',
      opacity: '0.78',
      maxWidth: '480px',
      lineHeight: '1.45',
    } as CSSStyleDeclaration);

    const detail = createEl('p', 'ct-fake-update__detail');
    detail.textContent = 'Estimated time remaining: about 6 minutes';
    Object.assign(detail.style, {
      margin: '0',
      fontSize: '13px',
      opacity: '0.56',
      letterSpacing: '0.02em',
    } as CSSStyleDeclaration);

    const track = createEl('div', 'ct-fake-update__track');
    Object.assign(track.style, {
      position: 'relative',
      width: 'min(420px, 82vw)',
      height: '4px',
      borderRadius: '999px',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.1)',
      marginTop: '6px',
    } as CSSStyleDeclaration);

    const bar = createEl('div', 'ct-fake-update__bar');
    Object.assign(bar.style, {
      position: 'absolute',
      inset: '0',
      transformOrigin: 'left center',
      transform: 'scaleX(0)',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.95))',
      boxShadow: '0 0 16px rgba(255,255,255,0.24)',
    } as CSSStyleDeclaration);
    track.appendChild(bar);

    const timeline = createEl('div', 'ct-fake-update__timeline');
    Object.assign(timeline.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '10px',
      width: 'min(560px, 100%)',
      marginTop: '10px',
    } as CSSStyleDeclaration);

    const timelineLabels = ['Downloading', 'Installing', 'Configuring', 'Finalizing'];
    const timelineSteps = timelineLabels.map((label, index) => {
      const chip = createEl('div', 'ct-fake-update__timeline-step');
      chip.textContent = `${index + 1}. ${label}`;
      Object.assign(chip.style, {
        padding: '10px 12px',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        fontSize: '12px',
        letterSpacing: '0.04em',
        opacity: '0.56',
      } as CSSStyleDeclaration);
      timeline.appendChild(chip);
      return chip;
    });

    const footer = createEl('div', 'ct-fake-update__footer');
    Object.assign(footer.style, {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px 18px',
      marginTop: '16px',
      fontSize: '12px',
      opacity: '0.46',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    } as CSSStyleDeclaration);

    const footerItems = [
      `Servicing stack ${randomDigits(ctx, 2)}.${randomDigits(ctx, 5)}`,
      `Session ${randomDigits(ctx, 4)}-${randomDigits(ctx, 4)}`,
      `Device ${randomDigits(ctx, 3)} ready`,
    ];
    footerItems.forEach((text) => {
      const item = createEl('span');
      item.textContent = text;
      footer.appendChild(item);
    });

    shell.appendChild(system);
    shell.appendChild(spinner);
    shell.appendChild(title);
    shell.appendChild(pct);
    shell.appendChild(stage);
    shell.appendChild(sub);
    shell.appendChild(detail);
    shell.appendChild(track);
    shell.appendChild(timeline);
    shell.appendChild(footer);
    overlay.appendChild(shell);
    ctx.addNode(overlay);

    const stages = [
      {
        until: 18,
        title: 'Working on updates',
        stage: 'Stage 1 of 4 · Downloading cumulative update',
        eta: 'Estimated time remaining: about 6 minutes',
        activeIndex: 0,
      },
      {
        until: 54,
        title: 'Installing updates',
        stage: 'Stage 2 of 4 · Installing security components',
        eta: 'Estimated time remaining: about 4 minutes',
        activeIndex: 1,
      },
      {
        until: 84,
        title: 'Configuring your system',
        stage: 'Stage 3 of 4 · Applying feature configuration',
        eta: 'Estimated time remaining: about 2 minutes',
        activeIndex: 2,
      },
      {
        until: 99,
        title: 'Finalizing updates',
        stage: 'Stage 4 of 4 · Cleaning up temporary files',
        eta: 'Estimated time remaining: less than a minute',
        activeIndex: 3,
      },
    ];

    function syncStatus(value: number): void {
      const current = stages.find((entry) => value <= entry.until) ?? stages[stages.length - 1]!;
      title.textContent = current.title;
      pct.textContent = `${value}%`;
      stage.textContent = current.stage;
      detail.textContent = current.eta;
      bar.style.transform = `scaleX(${Math.max(0, Math.min(value / 100, 0.99))})`;
      timelineSteps.forEach((chip, index) => {
        chip.classList.toggle('is-active', index === current.activeIndex);
        chip.classList.toggle('is-complete', index < current.activeIndex);
      });
    }

    const animations: Animation[] = [];
    if (typeof overlay.animate === 'function') {
      animations.push(
        overlay.animate(
          [
            { opacity: 0, filter: 'blur(6px)' },
            { opacity: 1, filter: 'blur(0px)' },
          ],
          { duration: 280, easing: 'ease-out', fill: 'forwards' },
        ),
      );
      animations.push(
        shell.animate(
          [
            { transform: 'translateY(18px)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration: 420, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'forwards' },
        ),
      );
      animations.push(
        haze.animate(
          [
            { transform: 'scale(0.98)', opacity: 0.84 },
            { transform: 'scale(1.03)', opacity: 1 },
          ],
          { duration: 2400, easing: 'ease-in-out', direction: 'alternate', iterations: Infinity },
        ),
      );
    }

    let value = 0;
    let pauseUntil = 0;
    syncStatus(value);

    const tick = window.setInterval(() => {
      const now = Date.now();
      if (now < pauseUntil) return;

      const maxStep = value < 22 ? 3 : value < 72 ? 2 : 1;
      const stallChance = value < 24 ? 0.08 : value < 78 ? 0.18 : 0.3;
      const step = ctx.random() < stallChance ? 0 : Math.max(1, Math.round(ctx.random() * maxStep));
      value = Math.min(99, value + step);
      syncStatus(value);

      if (STICKY.has(value) && ctx.random() < 0.58) {
        pauseUntil = now + 1800 + ctx.random() * 4200;
      }
    }, 280 + Math.round((1 - ctx.intensity) * 400));
    ctx.addTimer(tick);

    return () => {
      clearInterval(tick);
      animations.forEach((animation) => animation.cancel());
      overlay.remove();
    };
  },
};

export default effect;
