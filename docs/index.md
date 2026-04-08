---
layout: page
title: ChaosToggle.js
---

<style>
.ct-home { font-family: 'Comic Sans MS', 'Chalkboard SE', cursive, system-ui; max-width: 900px; margin: 0 auto; padding: 0 1rem 4rem; }
.ct-home *, .ct-home *::before, .ct-home *::after { box-sizing: border-box; }

.ct-home-hero { text-align: center; padding: 3rem 0 1.5rem; }
.ct-home-hero h1 {
  font-size: clamp(2.5rem, 8vw, 4.2rem); font-weight: 900; margin: 0 0 .35rem;
  background: linear-gradient(90deg, #ff4d6d, #f97316, #facc15, #4ade80, #38bdf8, #a78bfa, #ff4d6d);
  background-size: 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ctRb 4s linear infinite;
}
@keyframes ctRb { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
.ct-home-hero .ct-sub { font-size: 1.2rem; color: var(--vp-c-text-2); margin: 0 0 .5rem; line-height: 1.5; }
.ct-home-hero .ct-sub2 { font-size: .95rem; color: var(--vp-c-text-3); margin: 0 0 1.5rem; }
.ct-home-hero .ct-badge {
  display: inline-block; font-size: .75rem; padding: .35rem .8rem; border-radius: 999px;
  background: #fef3c7; color: #92400e; border: 1px dashed #f59e0b; margin-bottom: 1.5rem;
  animation: ctW 2s ease-in-out infinite;
}
@keyframes ctW { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }

.ct-home-actions { display: flex; flex-wrap: wrap; gap: .6rem; justify-content: center; margin-bottom: 2rem; }
.ct-ha {
  display: inline-block; cursor: pointer; border: none; font-family: inherit;
  font-size: 1rem; font-weight: 800; padding: .75rem 1.5rem; border-radius: .75rem;
  text-decoration: none; transition: all .15s;
}
.ct-ha:hover { transform: translateY(-2px) rotate(-.5deg); }
.ct-ha--brand { background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; box-shadow: 0 4px 16px rgba(239,68,68,.3); }
.ct-ha--brand:hover { box-shadow: 0 8px 24px rgba(239,68,68,.4); color: #fff; }
.ct-ha--alt { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); border: 2px solid var(--vp-c-divider); }
.ct-ha--alt:hover { border-color: var(--vp-c-brand-1); }

.ct-stats {
  display: flex; flex-wrap: wrap; gap: .5rem; justify-content: center; margin-bottom: 2.5rem;
}
.ct-stat {
  padding: .5rem 1rem; border-radius: .6rem; font-size: .85rem; font-weight: 700;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
}
.ct-stat span { color: var(--vp-c-brand-1); }

.ct-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: .75rem; margin-bottom: 2.5rem; }
.ct-feat {
  padding: 1.1rem; border-radius: .75rem; border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); transition: all .2s;
}
.ct-feat:hover { border-color: var(--vp-c-brand-1); transform: translateY(-2px) rotate(.3deg); }
.ct-feat-emoji { font-size: 1.6rem; margin-bottom: .4rem; }
.ct-feat h3 { font-size: 1rem; font-weight: 800; margin: 0 0 .3rem; }
.ct-feat p { font-size: .85rem; color: var(--vp-c-text-2); margin: 0; line-height: 1.45; }

.ct-demos-title { text-align: center; font-size: 1.4rem; font-weight: 900; margin: 0 0 .5rem; }
.ct-demos-sub { text-align: center; font-size: .9rem; color: var(--vp-c-text-2); margin: 0 0 1rem; }
.ct-demos { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: .75rem; margin-bottom: 2.5rem; }
.ct-demo-card {
  display: block; padding: 1rem; border-radius: .75rem; text-decoration: none; color: inherit;
  border: 2px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); transition: all .2s; text-align: center;
}
.ct-demo-card:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px) rotate(.5deg); box-shadow: 0 6px 16px rgba(0,0,0,.08); }
.ct-demo-card .de { font-size: 2rem; display: block; margin-bottom: .3rem; }
.ct-demo-card .dt { font-weight: 800; font-size: .9rem; display: block; margin-bottom: .2rem; }
.ct-demo-card .dd { font-size: .75rem; color: var(--vp-c-text-2); line-height: 1.4; }

.ct-install {
  border: 2px dashed var(--vp-c-divider); border-radius: 1rem; padding: 1.25rem; margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
}
.ct-install h2 { font-size: 1.1rem; font-weight: 800; margin: 0 0 .75rem; }
.ct-install pre {
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: .5rem;
  padding: .75rem 1rem; overflow-x: auto; font-size: .85rem; line-height: 1.5; margin: .5rem 0;
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
.ct-install code { color: var(--vp-c-text-1); }

.ct-quote {
  font-style: italic; font-size: .95rem; color: var(--vp-c-text-2); padding: .75rem 1rem;
  border-left: 4px solid var(--vp-c-brand-1); margin: 0 0 2rem; background: var(--vp-c-bg-soft);
  border-radius: 0 .5rem .5rem 0;
}
.ct-quote cite { display: block; font-style: normal; font-size: .8rem; margin-top: .4rem; opacity: .7; }

.ct-footer-links { text-align: center; font-size: .85rem; color: var(--vp-c-text-2); }
.ct-footer-links a { color: var(--vp-c-brand-1); text-decoration: none; }
.ct-footer-links a:hover { text-decoration: underline; }
</style>

<div class="ct-home">

<section class="ct-home-hero">
  <h1>ChaosToggle.js</h1>
  <p class="ct-sub">The ultimate prank & chaos effects library for the web.</p>
  <p class="ct-sub2">Drop one script tag. Watch your coworkers question reality.</p>
  <div class="ct-badge">WARNING: May cause spontaneous laughter, confused Slack messages, and emergency stand-ups</div>
</section>

<div class="ct-home-actions">
  <a href="/ChaosToggle.js/demo/" class="ct-ha ct-ha--brand">Try Live Demo</a>
  <a href="/ChaosToggle.js/guide/getting-started" class="ct-ha ct-ha--brand">Get Started</a>
  <a href="/ChaosToggle.js/api/" class="ct-ha ct-ha--alt">API Reference</a>
  <a href="https://github.com/Caripson/ChaosToggle.js" class="ct-ha ct-ha--alt">GitHub</a>
</div>

<div class="ct-stats">
  <div class="ct-stat"><span>34</span> effects</div>
  <div class="ct-stat"><span>17</span> themes</div>
  <div class="ct-stat"><span>0</span> dependencies</div>
  <div class="ct-stat"><span>1</span> script tag</div>
  <div class="ct-stat"><span>∞</span> confused coworkers</div>
</div>

<div class="ct-features">
  <div class="ct-feat">
    <div class="ct-feat-emoji">💥</div>
    <h3>34+ Effects</h3>
    <p>BSOD, matrix rain, gravity, fake Windows Update, Clippy, screen crack, virus scan, and dozens more.</p>
  </div>
  <div class="ct-feat">
    <div class="ct-feat-emoji">🎨</div>
    <h3>17 Themes</h3>
    <p>Holiday packs, office pranks, hacker retro, apocalypse, drunk mode, and jumpscare. One click each.</p>
  </div>
  <div class="ct-feat">
    <div class="ct-feat-emoji">🎛️</div>
    <h3>Control Panel</h3>
    <p>Draggable glass UI to tweak intensity, duration, and effects live. No build step needed.</p>
  </div>
  <div class="ct-feat">
    <div class="ct-feat-emoji">🔌</div>
    <h3>Plugin System</h3>
    <p>Ship custom effects and themes as ChaosPlugin packages. Hook into engine events.</p>
  </div>
  <div class="ct-feat">
    <div class="ct-feat-emoji">🔷</div>
    <h3>TypeScript-first</h3>
    <p>Full type coverage for settings, themes, effects, and the public API. Great DX.</p>
  </div>
  <div class="ct-feat">
    <div class="ct-feat-emoji">🪶</div>
    <h3>Zero Dependencies</h3>
    <p>One script tag or ESM import. Self-contained runtime with inlined styles.</p>
  </div>
</div>

<div class="ct-quote">
  "I thought my laptop was broken. Turns out the new intern installed ChaosToggle on the staging server. We've promoted them to Senior Chaos Engineer."
  <cite>Anonymous Engineering Manager, 2026</cite>
</div>

<h2 class="ct-demos-title">See It In Action</h2>
<p class="ct-demos-sub">Fake websites you can destroy. Click a page, press the chaos buttons, and watch it all fall apart.</p>
<div class="ct-demos">
  <a href="/ChaosToggle.js/demo/" class="ct-demo-card">
    <span class="de">🎮</span>
    <span class="dt">Playground</span>
    <span class="dd">All effects, all themes, one page</span>
  </a>
  <a href="/ChaosToggle.js/demo/store" class="ct-demo-card">
    <span class="de">🛒</span>
    <span class="dt">E-commerce</span>
    <span class="dd">Invisible keyboards and checkout chaos</span>
  </a>
  <a href="/ChaosToggle.js/demo/dashboard" class="ct-demo-card">
    <span class="de">📊</span>
    <span class="dt">Dashboard</span>
    <span class="dd">KPIs meet system failure</span>
  </a>
  <a href="/ChaosToggle.js/demo/blog" class="ct-demo-card">
    <span class="de">📰</span>
    <span class="dt">Blog</span>
    <span class="dd">Breaking news that breaks the page</span>
  </a>
  <a href="/ChaosToggle.js/demo/corporate" class="ct-demo-card">
    <span class="de">🏢</span>
    <span class="dt">Corporate</span>
    <span class="dd">The intern pushed to prod</span>
  </a>
</div>

<div class="ct-install">
  <h2>Get started in 30 seconds</h2>
  <pre><code>&lt;script src="https://cdn.jsdelivr.net/npm/chaos-toggle/dist/chaos-toggle.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
  ChaosToggle.init();
  ChaosToggle.runEffect('bsod'); // Blue Screen of Death
&lt;/script&gt;</code></pre>
  <pre><code>npm install chaos-toggle</code></pre>
</div>

<p class="ct-footer-links">
  <a href="/ChaosToggle.js/guide/getting-started">Getting Started</a> · 
  <a href="/ChaosToggle.js/guide/effects">Effects</a> · 
  <a href="/ChaosToggle.js/guide/themes">Themes</a> · 
  <a href="/ChaosToggle.js/api/">API</a> · 
  <a href="/ChaosToggle.js/api/plugin-api">Plugins</a> · 
  <a href="/ChaosToggle.js/community/contributing">Contributing</a> · 
  <a href="https://github.com/Caripson/ChaosToggle.js">GitHub</a>
</p>

</div>
