---
title: Live Demo
layout: page
---

<style>
.ct-demo-root {
  --ct-neon-pink: #ff2d95;
  --ct-neon-cyan: #00f5ff;
  --ct-neon-lime: #b7ff00;
  --ct-neon-violet: #a855f7;
  --ct-bg-deep: #070b14;
  --ct-glass: rgba(18, 24, 40, 0.55);
  --ct-glass-border: rgba(0, 245, 255, 0.22);
  font-family: ui-sans-serif, system-ui, sans-serif;
  color: #e8eef8;
  background: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(168, 85, 247, 0.35), transparent 55%),
    radial-gradient(ellipse 90% 60% at 100% 50%, rgba(255, 45, 149, 0.12), transparent 50%),
    radial-gradient(ellipse 80% 50% at 0% 80%, rgba(0, 245, 255, 0.1), transparent 45%),
    var(--ct-bg-deep);
  min-height: 100vh;
  padding: 2rem 1.25rem 4rem;
  margin: -24px -24px 0;
  box-sizing: border-box;
}
.ct-demo-root * { box-sizing: border-box; }
.ct-hero {
  text-align: center;
  padding: 2.5rem 1rem 2rem;
  margin-bottom: 2rem;
}
.ct-hero h1 {
  font-size: clamp(2.5rem, 8vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0 0 0.75rem;
  background: linear-gradient(120deg, var(--ct-neon-cyan), var(--ct-neon-pink), var(--ct-neon-lime));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 24px rgba(0, 245, 255, 0.35));
}
.ct-hero p.ct-sub {
  font-size: 1.15rem;
  opacity: 0.88;
  max-width: 32rem;
  margin: 0 auto 2rem;
  line-height: 1.5;
}
.ct-card {
  background: var(--ct-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--ct-glass-border);
  border-radius: 1.25rem;
  padding: 1.5rem 1.35rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.ct-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 245, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 45, 149, 0.35);
}
.ct-card h2 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--ct-neon-cyan);
  text-shadow: 0 0 20px rgba(0, 245, 255, 0.25);
}
.ct-btn {
  appearance: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.65rem 1.1rem;
  border-radius: 999px;
  color: #0a0e18;
  background: linear-gradient(135deg, var(--ct-neon-cyan), var(--ct-neon-pink));
  box-shadow: 0 4px 20px rgba(255, 45, 149, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.ct-btn:hover {
  transform: scale(1.06) translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 8px 28px rgba(0, 245, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
.ct-btn:active {
  transform: scale(0.98);
}
.ct-btn--xl {
  font-size: 1.35rem;
  padding: 1.1rem 2.25rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--ct-neon-lime), var(--ct-neon-cyan), var(--ct-neon-violet));
  animation: ct-pulse 2.2s ease-in-out infinite;
}
@keyframes ct-pulse {
  0%, 100% { box-shadow: 0 4px 24px rgba(183, 255, 0, 0.4); }
  50% { box-shadow: 0 8px 36px rgba(168, 85, 247, 0.55), 0 0 40px rgba(0, 245, 255, 0.25); }
}
.ct-btn--theme {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(255, 45, 149, 0.85));
  color: #fff;
  font-size: 0.8rem;
  padding: 0.55rem 0.85rem;
}
.ct-btn--effect {
  background: linear-gradient(135deg, #22d3ee, #6366f1);
  color: #fff;
  font-size: 0.8rem;
}
.ct-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
}
.ct-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 0.65rem;
}
.ct-grid--themes {
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
}
.ct-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.ct-showcase a {
  display: block;
  padding: 1rem 1.15rem;
  border-radius: 1rem;
  text-decoration: none;
  color: inherit;
  background: rgba(10, 14, 24, 0.5);
  border: 1px solid rgba(0, 245, 255, 0.2);
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}
.ct-showcase a:hover {
  border-color: var(--ct-neon-pink);
  transform: scale(1.02);
  background: rgba(168, 85, 247, 0.12);
}
.ct-showcase a strong {
  display: block;
  color: var(--ct-neon-cyan);
  margin-bottom: 0.35rem;
  font-size: 1.05rem;
}
.ct-showcase a span {
  font-size: 0.85rem;
  opacity: 0.85;
  line-height: 1.4;
}
.ct-sample {
  max-width: 52rem;
  margin: 0 auto;
}
.ct-sample h2, .ct-sample h3 { color: #c4d4f0; }
.ct-sample a { color: var(--ct-neon-cyan); }
.ct-sample form {
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px dashed rgba(255, 45, 149, 0.35);
  background: rgba(0, 0, 0, 0.25);
}
.ct-sample label { display: block; margin: 0.75rem 0 0.25rem; font-size: 0.9rem; }
.ct-sample input, .ct-sample textarea, .ct-sample select {
  width: 100%;
  max-width: 28rem;
  padding: 0.5rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 245, 255, 0.25);
  background: rgba(7, 11, 20, 0.8);
  color: #e8eef8;
}
.ct-composer-note {
  font-size: 0.9rem;
  opacity: 0.85;
  margin: 0 0 1rem;
  line-height: 1.5;
}
</style>

<div class="ct-demo-root">

<section class="ct-hero">
  <h1>Playground</h1>
  <p class="ct-sub">Click anything. Break everything. Reset and repeat.</p>
  <button type="button" class="ct-btn ct-btn--xl" onclick="ChaosToggle.trigger()">TRIGGER CHAOS</button>
</section>

<section class="ct-card">
  <h2>Quick actions</h2>
  <div class="ct-row">
    <button type="button" class="ct-btn" onclick="ChaosToggle.trigger()">Trigger</button>
    <button type="button" class="ct-btn" onclick="ChaosToggle.reset()">Reset</button>
    <button type="button" class="ct-btn" onclick="ChaosToggle.runMode('nuclear')">Nuclear mode</button>
    <button type="button" class="ct-btn" onclick="ChaosToggle.runMode('panic')">Panic mode</button>
    <button type="button" class="ct-btn" onclick="ChaosToggle.runMode('celebration')">Celebration</button>
    <button type="button" class="ct-btn" onclick="ChaosToggle.openPanel()">Open panel</button>
  </div>
</section>

<section class="ct-card">
  <h2>Signature effects</h2>
  <div class="ct-grid">
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('bsod')">BSOD</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('matrixRain')">Matrix rain</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('fakeTerminal')">Fake terminal</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('clippy')">Clippy</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('screenCrack')">Screen crack</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('gravity')">Gravity</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('screenFlip')">Screen flip</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('drunkMode')">Drunk mode</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('fakeUpdate')">Fake update</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('fakeVirusScan')">Virus scan</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('vhsDistortion')">VHS distortion</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('crtShutdown')">CRT shutdown</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('fakeCrash')">Fake crash</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('rgbSplit')">RGB split</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('elementShuffle')">Element shuffle</button>
    <button type="button" class="ct-btn ct-btn--effect" onclick="ChaosToggle.runEffect('cursorChaos')">Cursor chaos</button>
  </div>
</section>

<section class="ct-card">
  <h2>Themes</h2>
  <p class="ct-composer-note">Seventeen built-in vibes — each one sets the palette and fires the full theme experience.</p>
  <div class="ct-grid ct-grid--themes">
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('default')">Default</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('easter')">Easter</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('halloween')">Halloween</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('christmas')">Christmas</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('new-year')">New Year</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('4th-of-july')">4th of July</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('thanksgiving')">Thanksgiving</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('black-friday')">Black Friday</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('cyber-monday')">Cyber Monday</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('valentines-day')">Valentine's</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('birthday')">Birthday</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('office')">Office</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('hacker')">Hacker</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('retro')">Retro</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('apocalypse')">Apocalypse</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('drunk')">Drunk</button>
    <button type="button" class="ct-btn ct-btn--theme" onclick="ChaosToggle.runTheme('jumpscare')">Jumpscare</button>
  </div>
</section>

<section class="ct-card">
  <h2>Effect composer</h2>
  <p class="ct-composer-note">Pre-built sequence: glass shatter, then the blue screen, then a dramatic “scan.” Buckle up.</p>
  <button type="button" class="ct-btn ct-btn--xl" onclick="ChaosToggle.compose('ultimate',[ {effect:'screenCrack',delay:0},{effect:'bsod',delay:800},{effect:'fakeVirusScan',delay:4000} ]); ChaosToggle.runComposition('ultimate')">Run the ultimate prank</button>
</section>

<section class="ct-card">
  <h2>Showcase pages</h2>
  <div class="ct-showcase">
    <a href="/demo/store"><strong>Store</strong><span>Retail shelves, prices, and panic-buy energy for shopping chaos.</span></a>
    <a href="/demo/dashboard"><strong>Dashboard</strong><span>Charts, KPIs, and fake productivity — perfect for corporate meltdown demos.</span></a>
    <a href="/demo/blog"><strong>Blog</strong><span>Articles and bylines that beg to be scrambled and confetti-bombed.</span></a>
    <a href="/demo/corporate"><strong>Corporate</strong><span>Stiff copy, stock photos vibes, and synergy gone wrong.</span></a>
  </div>
</section>

<section class="ct-card ct-sample">
  <h2>Sample content</h2>
  <p>
    This paragraph exists purely so effects have real text and layout to chew on.
    Follow the <a href="/guide/getting-started">getting started guide</a> or peek at the
    <a href="/guide/effects">effects reference</a> when the storm clears.
  </p>
  <h3>Another heading</h3>
  <p>
    Lorem ipsum isn’t required — you’ve got ChaosToggle instead. Try gravity on this block,
    or shuffle the headings until the page looks like a design review gone off the rails.
  </p>
  <form action="#" method="get" onsubmit="return false;">
    <label for="ct-demo-name">Display name</label>
    <input id="ct-demo-name" name="name" type="text" placeholder="Party captain" autocomplete="off" />
    <label for="ct-demo-email">Email (fake)</label>
    <input id="ct-demo-email" name="email" type="email" placeholder="you@chaos.example" />
    <label for="ct-demo-tier">Chaos tier</label>
    <select id="ct-demo-tier" name="tier">
      <option>Mild</option>
      <option selected>Spicy</option>
      <option>Maximum</option>
    </select>
    <label for="ct-demo-notes">Notes</label>
    <textarea id="ct-demo-notes" name="notes" rows="3" placeholder="What should break first?"></textarea>
    <div class="ct-row" style="margin-top: 1rem;">
      <button type="submit" class="ct-btn">Submit (does nothing)</button>
      <button type="button" class="ct-btn" onclick="ChaosToggle.trigger()">Or trigger chaos</button>
    </div>
  </form>
</section>

</div>

<script>
if (typeof window !== 'undefined') {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/Caripson/ChaosToggle.js@main/dist/chaos-toggle.min.js';
  s.onload = function() {
    ChaosToggle.init({ duration: 3000 });
  };
  document.head.appendChild(s);
}
</script>
