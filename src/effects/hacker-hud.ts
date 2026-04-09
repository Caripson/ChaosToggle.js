import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const FEEDS = [
  ['TRACE ROUTE', 'uplink stable', 'packet mirror live', 'latency 11ms'],
  ['AUTH STATUS', 'token accepted', 'root shell open', 'session mirrored'],
  ['SIGNAL WATCH', 'camera sweep active', 'target reacquired', 'sniffer online'],
];

const effect: ChaosEffect = {
  id: 'hackerHud',
  name: 'Hacker HUD',
  description: 'Green-on-black status panels and a target reticle float above the page.',
  category: 'overlay',
  apply(ctx: EffectContext) {
    const wrap = createEl('div', 'ct-hacker-hud', {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '2147483004',
      color: '#7fffd4',
      fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    });

    const grid = createEl('div', '', {
      position: 'absolute',
      inset: '0',
      opacity: '0.14',
      backgroundImage:
        'linear-gradient(rgba(10,189,198,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.18) 1px, transparent 1px)',
      backgroundSize: '42px 42px',
      mixBlendMode: 'screen',
    });
    wrap.appendChild(grid);

    const makePanel = (title: string, lines: string[], styles: Partial<CSSStyleDeclaration>) => {
      const panel = createEl('div', 'ct-hacker-hud__panel', {
        position: 'absolute',
        minWidth: '220px',
        padding: '12px 14px',
        border: '1px solid rgba(0,255,65,0.45)',
        background: 'linear-gradient(180deg, rgba(2,10,6,0.88), rgba(2,10,6,0.68))',
        boxShadow: '0 0 22px rgba(0,255,65,0.12)',
        backdropFilter: 'blur(6px)',
        ...styles,
      });

      const heading = createEl('div', '', {
        fontSize: '11px',
        color: '#0abdc6',
        marginBottom: '8px',
      });
      heading.textContent = title;
      panel.appendChild(heading);

      const body = createEl('div', '', {
        display: 'grid',
        gap: '5px',
        fontSize: '10px',
        color: '#9fffd0',
      });
      panel.appendChild(body);

      const nodes = lines.map((line) => {
        const row = createEl('div');
        row.textContent = line;
        body.appendChild(row);
        return row;
      });

      wrap.appendChild(panel);
      return { nodes };
    };

    const panels = [
      makePanel(FEEDS[0]![0]!, FEEDS[0]!.slice(1), { top: '18px', left: '18px' }),
      makePanel(FEEDS[1]![0]!, FEEDS[1]!.slice(1), { top: '18px', right: '18px' }),
      makePanel(FEEDS[2]![0]!, FEEDS[2]!.slice(1), { bottom: '18px', right: '18px' }),
    ];

    const reticle = createEl('div', 'ct-hacker-hud__reticle', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '130px',
      height: '130px',
      marginLeft: '-65px',
      marginTop: '-65px',
      border: '2px solid rgba(0,255,65,0.68)',
      borderRadius: '50%',
      boxShadow: '0 0 28px rgba(0,255,65,0.14)',
    });
    wrap.appendChild(reticle);

    const crossX = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '190px',
      height: '1px',
      marginLeft: '-95px',
      marginTop: '-1px',
      background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.8), transparent)',
    });
    const crossY = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '1px',
      height: '190px',
      marginLeft: '-1px',
      marginTop: '-95px',
      background: 'linear-gradient(180deg, transparent, rgba(10,189,198,0.8), transparent)',
    });
    const tag = createEl('div', '', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: '-48px',
      marginTop: '78px',
      fontSize: '11px',
      color: '#0abdc6',
    });
    tag.textContent = 'TARGET LOCK';
    wrap.append(crossX, crossY, tag);

    ctx.addNode(wrap);

    const interval = window.setInterval(() => {
      const stamp = `${Math.floor(Math.random() * 90 + 10)}.${Math.floor(Math.random() * 9)}%`;
      panels[0]!.nodes[0]!.textContent = `uplink stable ${stamp}`;
      panels[1]!.nodes[1]!.textContent = `root shell ${Math.random() < 0.5 ? 'open' : 'mirrored'}`;
      panels[2]!.nodes[2]!.textContent = `sniffer ${Math.random() < 0.5 ? 'online' : 'locked'}`;
      tag.textContent = Math.random() < 0.3 ? 'TRACE LIVE' : 'TARGET LOCK';
    }, 320);
    ctx.addTimer(interval);

    reticle.animate(
      [
        { transform: 'scale(0.96)', opacity: 0.72 },
        { transform: 'scale(1.02)', opacity: 1 },
        { transform: 'scale(0.96)', opacity: 0.72 },
      ],
      { duration: 1300, iterations: Infinity, easing: 'ease-in-out' },
    );

    return () => {
      clearInterval(interval);
      wrap.remove();
    };
  },
};

export default effect;
