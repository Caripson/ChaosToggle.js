import type { ChaosEffect, EffectContext } from '../core/types';
import { createEl } from '../core/utils';

const PATHS = [
  'C:\\Windows\\System32\\drivers\\ntfs.sys',
  'C:\\Windows\\System32\\virus.exe',
  '/etc/passwd',
  '/usr/bin/.hidden_payload',
  '~/secret_plans.doc',
  'C:\\Users\\You\\Downloads\\totally_safe.pdf.exe',
  '/var/log/auth.log',
  'C:\\Program Files\\ChaosToggle\\payload.dll',
  '\\\\NAS\\shared\\backup.zip',
  '~/.ssh/id_rsa',
  'C:\\Windows\\Temp\\~tmp0001.bin',
  '/home/user/.bash_history',
  'C:\\Users\\Public\\Desktop\\Invoice.lnk',
  '/opt/enterprise/mainframe_connector.so',
];

const THREAT_PATHS = new Set([
  'C:\\Windows\\System32\\virus.exe',
  '~/secret_plans.doc',
  '~/.ssh/id_rsa',
  'C:\\Users\\You\\Downloads\\totally_safe.pdf.exe',
]);

const STATUS_MESSAGES = [
  'Analyzing suspicious signatures...',
  'Resolving heuristic confidence map...',
  'Cross-checking kernel sectors...',
  'Monitoring outbound traffic anomalies...',
  'Rebuilding threat graph cache...',
];

const effect: ChaosEffect = {
  id: 'fakeVirusScan',
  name: 'Fake Virus Scan',
  description: 'Dramatic full-screen antivirus-style scan UI.',
  category: 'prank',
  apply(ctx: EffectContext) {
    const overlay = createEl('div', 'ct-virus-scan');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483646',
      background: 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
      color: '#e6edf3',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      padding: 'clamp(16px, 3vw, 40px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    } as CSSStyleDeclaration);

    const header = createEl('div');
    Object.assign(header.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
    } as CSSStyleDeclaration);

    const h1 = createEl('h1');
    h1.textContent = 'SCANNING SYSTEM...';
    Object.assign(h1.style, {
      margin: '0',
      fontSize: 'clamp(20px, 3.5vw, 28px)',
      fontWeight: '700',
      letterSpacing: '0.12em',
      color: '#ff4444',
      textShadow: '0 0 12px rgba(255,68,68,0.6)',
    } as CSSStyleDeclaration);

    const shield = createEl('span');
    shield.textContent = '⚠';
    Object.assign(shield.style, { fontSize: '32px' } as CSSStyleDeclaration);
    header.appendChild(h1);
    header.appendChild(shield);

    const barTrack = createEl('div');
    Object.assign(barTrack.style, {
      height: '14px',
      background: '#21262d',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid #30363d',
    } as CSSStyleDeclaration);

    const barFill = createEl('div');
    Object.assign(barFill.style, {
      height: '100%',
      width: '0%',
      background: 'linear-gradient(90deg, #238636, #3fb950)',
      transition: 'width 0.25s ease-out',
      boxShadow: '0 0 10px rgba(63,185,80,0.5)',
    } as CSSStyleDeclaration);
    barTrack.appendChild(barFill);

    const status = createEl('p');
    status.textContent = 'Initializing threat engine...';
    Object.assign(status.style, { margin: '0', fontSize: '14px', opacity: '0.9' } as CSSStyleDeclaration);

    const metrics = createEl('div');
    Object.assign(metrics.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '8px',
      fontSize: '12px',
      color: '#8b949e',
    } as CSSStyleDeclaration);

    const filesMetric = createEl('span');
    const threatMetric = createEl('span');
    const stageMetric = createEl('span');
    metrics.appendChild(filesMetric);
    metrics.appendChild(threatMetric);
    metrics.appendChild(stageMetric);

    const listWrap = createEl('div');
    Object.assign(listWrap.style, {
      flex: '1',
      minHeight: '200px',
      background: '#0d1117',
      border: '1px solid #30363d',
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    } as CSSStyleDeclaration);

    const listTitle = createEl('div');
    listTitle.textContent = 'Live scan log';
    Object.assign(listTitle.style, {
      padding: '8px 12px',
      background: '#161b22',
      borderBottom: '1px solid #30363d',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#8b949e',
    } as CSSStyleDeclaration);

    const list = createEl('div');
    Object.assign(list.style, {
      flex: '1',
      overflowY: 'auto',
      padding: '10px 12px',
      fontFamily: 'ui-monospace, Consolas, monospace',
      fontSize: '12px',
      lineHeight: '1.6',
    } as CSSStyleDeclaration);

    listWrap.appendChild(listTitle);
    listWrap.appendChild(list);

    overlay.appendChild(header);
    overlay.appendChild(barTrack);
    overlay.appendChild(status);
    overlay.appendChild(metrics);
    overlay.appendChild(listWrap);
    ctx.addNode(overlay);

    let progress = 0;
    let filesScanned = 0;
    let threatsFound = 0;
    let stage = 'Boot';

    const renderMetrics = (): void => {
      filesMetric.textContent = `Files scanned: ${filesScanned}`;
      threatMetric.textContent = `Threats flagged: ${threatsFound}`;
      stageMetric.textContent = `Scan stage: ${stage}`;
    };
    renderMetrics();

    const addLine = (text: string, isThreat: boolean): void => {
      const row = createEl('div');
      const time = new Date().toLocaleTimeString(undefined, { hour12: false });
      row.textContent = `[${time}] ${text}`;
      Object.assign(row.style, {
        color: isThreat ? '#ff7b72' : '#7ee787',
        marginBottom: '2px',
      } as CSSStyleDeclaration);
      if (isThreat) {
        row.style.fontWeight = '700';
        row.textContent = `[${time}] [THREAT DETECTED] ${text}`;
      }
      if (list.children.length > 72) list.removeChild(list.firstChild as ChildNode);
      list.appendChild(row);
      list.scrollTop = list.scrollHeight;
    };

    const tick = window.setInterval(() => {
      const path = PATHS[Math.floor(Math.random() * PATHS.length)]!;
      const threat = THREAT_PATHS.has(path) && Math.random() < 0.65;
      addLine(threat ? path : `Scanning ${path}...`, threat);
      filesScanned += 1;
      if (threat) threatsFound += 1;

      const inc = (0.8 + ctx.intensity * 1.4) * (Math.random() * 3 + 1);
      progress = Math.min(100, progress + inc);
      barFill.style.width = `${progress}%`;

      if (progress >= 99.5) {
        status.textContent = 'Finalizing deep scan...';
        stage = 'Final checks';
        progress = 95 + Math.random() * 4;
      } else if (threat) {
        status.textContent = 'Quarantine recommended — DO NOT DISCONNECT POWER';
        stage = 'Threat response';
      } else {
        status.textContent = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]!;
        stage = progress < 30 ? 'File crawl' : progress < 65 ? 'Heuristic pass' : 'Memory inspection';
      }
      renderMetrics();
    }, 380);
    ctx.addTimer(tick);

    return () => {
      clearInterval(tick);
      overlay.remove();
    };
  },
};

export default effect;
