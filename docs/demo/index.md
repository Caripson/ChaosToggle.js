---
title: Live Demo
layout: page
---

<style>
.ct-pg { font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, system-ui; max-width: 960px; margin: 0 auto; padding: 0 1rem 6rem; overflow-x: hidden; }
.ct-pg *, .ct-pg *::before, .ct-pg *::after { box-sizing: border-box; }

.ct-hero { text-align: center; padding: 2rem 0 1.5rem; }
.ct-hero h1 {
  font-size: clamp(2.2rem, 7vw, 3.8rem); font-weight: 900; margin: 0 0 .5rem;
  background: linear-gradient(90deg, #ff4d6d, #f97316, #facc15, #4ade80, #38bdf8, #a78bfa, #ff4d6d);
  background-size: 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: ct-rainbow 4s linear infinite;
}
@keyframes ct-rainbow { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
.ct-hero .ct-tagline { font-size: 1.15rem; color: var(--vp-c-text-2); margin: 0 0 1.5rem; }
.ct-hero .ct-warning {
  display: inline-block; font-size: .8rem; padding: .4rem .9rem; border-radius: 999px;
  background: #fef3c7; color: #92400e; border: 1px dashed #f59e0b; margin-bottom: 1.5rem;
  animation: ct-wiggle 2s ease-in-out infinite;
}
@keyframes ct-wiggle { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }

.ct-big-btn {
  display: inline-block; cursor: pointer; border: none; font-family: inherit;
  font-size: 1.4rem; font-weight: 900; letter-spacing: .04em; text-transform: uppercase;
  padding: 1rem 2.5rem; border-radius: 1rem; color: #fff;
  background: linear-gradient(135deg, #ef4444, #f97316, #eab308);
  box-shadow: 0 6px 24px rgba(239,68,68,.4), 0 0 0 4px rgba(239,68,68,.15);
  transition: transform .15s, box-shadow .15s;
  animation: ct-bigpulse 1.5s ease-in-out infinite;
}
.ct-big-btn:hover { transform: scale(1.08) rotate(-1deg); box-shadow: 0 10px 36px rgba(239,68,68,.5); }
.ct-big-btn:active { transform: scale(.96); }
@keyframes ct-bigpulse { 0%,100% { box-shadow: 0 6px 24px rgba(239,68,68,.4), 0 0 0 4px rgba(239,68,68,.15); } 50% { box-shadow: 0 6px 32px rgba(249,115,22,.5), 0 0 0 8px rgba(234,179,8,.12); } }

.ct-section { margin-bottom: 2rem; }
.ct-section h2 {
  font-size: 1.3rem; font-weight: 800; margin: 0 0 .75rem; padding-bottom: .5rem;
  border-bottom: 3px dashed var(--vp-c-divider);
}
.ct-section h2 .emoji { margin-right: .4rem; }
.ct-note { font-size: .9rem; color: var(--vp-c-text-2); margin: 0 0 .75rem; line-height: 1.5; }

.ct-row { display: flex; flex-wrap: wrap; gap: .5rem; }
.ct-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: .5rem; }
.ct-grid--sm { grid-template-columns: repeat(auto-fill, minmax(105px, 1fr)); }

.ct-btn {
  cursor: pointer; border: 2px solid var(--vp-c-divider); border-radius: .6rem;
  padding: .5rem .85rem; font-family: inherit; font-size: .85rem; font-weight: 700;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  transition: all .15s; position: relative; overflow: hidden;
}
.ct-btn:hover { transform: translateY(-2px) rotate(-.5deg); border-color: var(--vp-c-brand-1); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
.ct-btn:active { transform: scale(.95); }

.ct-btn--fire { background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; border-color: transparent; }
.ct-btn--fire:hover { box-shadow: 0 4px 16px rgba(239,68,68,.35); border-color: transparent; }
.ct-btn--cool { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; border-color: transparent; }
.ct-btn--cool:hover { box-shadow: 0 4px 16px rgba(59,130,246,.35); border-color: transparent; }
.ct-btn--green { background: linear-gradient(135deg, #22c55e, #14b8a6); color: #fff; border-color: transparent; }
.ct-btn--green:hover { box-shadow: 0 4px 16px rgba(34,197,94,.35); border-color: transparent; }
.ct-btn--pink { background: linear-gradient(135deg, #ec4899, #f43f5e); color: #fff; border-color: transparent; }
.ct-btn--pink:hover { box-shadow: 0 4px 16px rgba(236,72,153,.35); border-color: transparent; }
.ct-btn--dark { background: linear-gradient(135deg, #1e293b, #334155); color: #f1f5f9; border-color: transparent; }
.ct-btn--dark:hover { box-shadow: 0 4px 16px rgba(30,41,59,.4); border-color: transparent; }
.ct-btn--reset { background: #fff; border: 2px dashed #d1d5db; color: #6b7280; }
.ct-btn--reset:hover { border-color: #9ca3af; background: #f9fafb; }

.ct-showcase { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .75rem; }
.ct-showcase a {
  display: block; padding: 1rem; border-radius: .75rem; text-decoration: none; color: inherit;
  border: 2px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
  transition: all .2s;
}
.ct-showcase a:hover { border-color: var(--vp-c-brand-1); transform: translateY(-3px) rotate(.5deg); box-shadow: 0 8px 20px rgba(0,0,0,.08); }
.ct-showcase .sc-emoji { font-size: 1.8rem; margin-bottom: .4rem; display: block; }
.ct-showcase .sc-title { font-weight: 800; font-size: .95rem; display: block; margin-bottom: .25rem; }
.ct-showcase .sc-desc { font-size: .8rem; color: var(--vp-c-text-2); line-height: 1.4; }

.ct-sample { border: 2px dashed var(--vp-c-divider); border-radius: 1rem; padding: 1.25rem; background: var(--vp-c-bg-soft); overflow: hidden; }
.ct-sample h3 { margin: 1rem 0 .5rem; }
.ct-sample form { margin-top: 1rem; }
.ct-sample label { display: block; margin: .6rem 0 .2rem; font-size: .85rem; font-weight: 600; }
.ct-sample input, .ct-sample textarea, .ct-sample select {
  display: block; width: 100%; max-width: 100%; padding: .45rem .6rem; border-radius: .4rem;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1);
  font-family: inherit; font-size: .9rem;
}

.ct-ticker {
  overflow: hidden; white-space: nowrap; padding: .6rem 0; font-size: .85rem;
  color: var(--vp-c-text-2); border-top: 1px dashed var(--vp-c-divider);
  border-bottom: 1px dashed var(--vp-c-divider); margin-bottom: 2rem;
}
.ct-ticker span { display: inline-block; animation: ct-scroll 20s linear infinite; }
@keyframes ct-scroll { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }

.ct-counter { text-align: center; padding: .75rem; border-radius: .75rem; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); margin-bottom: 2rem; }
.ct-counter span { font-weight: 900; font-size: 1.2rem; color: var(--vp-c-brand-1); }

.ct-quote {
  font-style: italic; font-size: .95rem; color: var(--vp-c-text-2); padding: .75rem 1rem;
  border-left: 4px solid var(--vp-c-brand-1); margin: 0 0 2rem; background: var(--vp-c-bg-soft);
  border-radius: 0 .5rem .5rem 0;
}
.ct-quote cite { display: block; font-style: normal; font-size: .8rem; margin-top: .4rem; opacity: .7; }
</style>

<div class="ct-pg">
<section class="ct-hero">
  <h1>Playground</h1>
  <p class="ct-tagline">Click anything. Break everything. Blame the intern.</p>
  <div class="ct-warning">WARNING: No real computers were harmed in the making of this page</div>
  <br><br>
  <button type="button" class="ct-big-btn" onclick="ChaosToggle.trigger()">TRIGGER CHAOS</button>
</section>
<div class="ct-ticker"><span>BREAKING: ChaosToggle.js detected in production. DevOps team in emergency meeting. Stock price unaffected because nobody uses our app anyway. Clippy seen roaming the codebase. Film at 11. This is not a drill (it might be a drill). Remember: git blame won't help you now.</span></div>
<div class="ct-counter">Chaos effects triggered on this page: <span id="ct-count">0</span> (and counting)</div>
<section class="ct-section">
  <h2><span class="emoji">🎮</span> Quick Actions</h2>
  <div class="ct-row">
    <button type="button" class="ct-btn ct-btn--fire" onclick="ctFire('trigger')">Trigger</button>
    <button type="button" class="ct-btn ct-btn--reset" onclick="ChaosToggle.reset()">Reset</button>
    <button type="button" class="ct-btn ct-btn--dark" onclick="ctFire('nuclear')">Nuclear Mode</button>
    <button type="button" class="ct-btn ct-btn--pink" onclick="ctFire('panic')">Panic Mode</button>
    <button type="button" class="ct-btn ct-btn--green" onclick="ctFire('celebration')">Celebration</button>
    <button type="button" class="ct-btn ct-btn--cool" onclick="ChaosToggle.openPanel()">Open Panel</button>
  </div>
</section>
<section class="ct-section">
  <h2><span class="emoji">💥</span> Signature Effects</h2>
  <p class="ct-note">Each button fires a single effect. Some are subtle. Some will make you question your life choices.</p>
  <div class="ct-grid">
    <button type="button" class="ct-btn" onclick="ctFire('effect','bsod')">BSOD</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','matrixRain')">Matrix Rain</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','fakeTerminal')">Fake Terminal</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','clippy')">Clippy</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','screenCrack')">Screen Crack</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','gravity')">Gravity</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','screenFlip')">Screen Flip</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','drunkMode')">Drunk Mode</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','fakeUpdate')">Fake Update</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','fakeVirusScan')">Virus Scan</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','vhsDistortion')">VHS Distortion</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','crtShutdown')">CRT Shutdown</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','fakeCrash')">Fake Crash</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','rgbSplit')">RGB Split</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','elementShuffle')">Element Shuffle</button>
    <button type="button" class="ct-btn" onclick="ctFire('effect','cursorChaos')">Cursor Chaos</button>
  </div>
</section>
<section class="ct-section">
  <h2><span class="emoji">🎨</span> Themes</h2>
  <p class="ct-note">17 built-in vibes. Each one changes the palette, particles, and fires a themed combo of effects.</p>
  <div class="ct-grid ct-grid--sm">
    <button type="button" class="ct-btn" onclick="ctFire('theme','default')">Default</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','easter')">Easter</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','halloween')">Halloween</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','christmas')">Christmas</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','new-year')">New Year</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','4th-of-july')">4th of July</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','thanksgiving')">Thanksgiving</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','black-friday')">Black Friday</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','cyber-monday')">Cyber Monday</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','valentines-day')">Valentine's</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','birthday')">Birthday</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','office')">Office</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','hacker')">Hacker</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','retro')">Retro</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','apocalypse')">Apocalypse</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','drunk')">Drunk</button>
    <button type="button" class="ct-btn" onclick="ctFire('theme','jumpscare')">Jumpscare</button>
  </div>
</section>
<section class="ct-section">
  <h2><span class="emoji">🎬</span> Effect Composer</h2>
  <p class="ct-note">Pre-built horror sequence: glass shatters, then the blue screen hits, then a dramatic virus scan. <strong>Buckle. Up.</strong></p>
  <button type="button" class="ct-btn ct-btn--fire" style="font-size:1rem;padding:.7rem 1.5rem;" onclick="ChaosToggle.compose('ultimate',[{effect:'screenCrack',delay:0},{effect:'bsod',delay:800},{effect:'fakeVirusScan',delay:4000}]); ChaosToggle.runComposition('ultimate'); bumpCounter();">Run the Ultimate Prank</button>
</section>
<div class="ct-quote">
  "I thought my laptop was possessed. Turns out my coworker installed ChaosToggle. HR says it's 'not technically a fireable offense.'"
  <cite>Anonymous Developer, 2026</cite>
</div>
<section class="ct-section">
  <h2><span class="emoji">🗺️</span> Showcase Pages</h2>
  <p class="ct-note">See how ChaosToggle looks when it hits "real" websites. Each page is a fake site you can destroy.</p>
  <div class="ct-showcase">
    <a href="/ChaosToggle.js/demo/store">
      <span class="sc-emoji">🛒</span>
      <span class="sc-title">E-commerce Store</span>
      <span class="sc-desc">Invisible keyboards, error 404 mugs, and checkout assistants that won't leave you alone.</span>
    </a>
    <a href="/ChaosToggle.js/demo/dashboard">
      <span class="sc-emoji">📊</span>
      <span class="sc-title">Corporate Dashboard</span>
      <span class="sc-desc">KPIs, bar charts, and fake productivity. Watch it all burn during Drunk Friday.</span>
    </a>
    <a href="/ChaosToggle.js/demo/blog">
      <span class="sc-emoji">📰</span>
      <span class="sc-title">Blog / News Site</span>
      <span class="sc-desc">"Breaking: Local Developer Discovers One Weird Trick to Crash Any Website."</span>
    </a>
    <a href="/ChaosToggle.js/demo/corporate">
      <span class="sc-emoji">🏢</span>
      <span class="sc-title">Corporate Landing</span>
      <span class="sc-desc">"Streamline Your Workflow" — until the intern pushes to prod and everything goes nuclear.</span>
    </a>
  </div>
</section>
<section class="ct-section">
  <h2><span class="emoji">🧪</span> Sample Content</h2>
  <p class="ct-note">This section exists so effects have real DOM to chew on. Try Gravity or Element Shuffle on this stuff.</p>
  <div class="ct-sample">
    <p>This is a perfectly normal paragraph. Nothing to see here. Please do not press any of the buttons above. Especially not the Nuclear one. <strong>We mean it.</strong></p>
    <h3>A Heading That Has Done Nothing Wrong</h3>
    <p>This heading was minding its own business before you showed up. It had a family. A mortgage. Plans for the weekend. And now you're about to shuffle it into the comment section.</p>
    <p>Here are some <a href="#">links</a> and <a href="#">more links</a> and <a href="#">even more links</a> that go nowhere, because this is a demo and consequences are imaginary.</p>
    <form action="#" method="get" onsubmit="return false;">
      <label for="ct-name">Your name (or alias)</label>
      <input id="ct-name" type="text" placeholder="Captain Chaos" autocomplete="off" />
      <label for="ct-email">Email (we won't spam you, the effects will)</label>
      <input id="ct-email" type="email" placeholder="you@chaos.example" />
      <label for="ct-tier">Chaos tolerance</label>
      <select id="ct-tier">
        <option>I scare easily</option>
        <option selected>Bring it on</option>
        <option>I AM the chaos</option>
      </select>
      <label for="ct-notes">Last words</label>
      <textarea id="ct-notes" rows="3" placeholder="Tell your loved ones something nice..."></textarea>
      <div class="ct-row" style="margin-top:.75rem;">
        <button type="submit" class="ct-btn">Submit (does nothing)</button>
        <button type="button" class="ct-btn ct-btn--fire" onclick="ctFire('trigger')">Or trigger chaos</button>
      </div>
    </form>
  </div>
</section>
</div>

<script setup>
import { onMounted, onUnmounted } from 'vue'

function loadChaos() {
  if (!window._ctCount) window._ctCount = 0
  window.bumpCounter = function() {
    window._ctCount++
    var el = document.getElementById('ct-count')
    if (el) el.textContent = window._ctCount
  }
  window.ctFire = function(type, name) {
    window.bumpCounter()
    if (!window.ChaosToggle) return
    if (type === 'trigger') window.ChaosToggle.trigger()
    else if (type === 'effect') window.ChaosToggle.runEffect(name)
    else if (type === 'theme') window.ChaosToggle.runTheme(name)
    else if (type === 'nuclear') window.ChaosToggle.runMode('nuclear')
    else if (type === 'panic') window.ChaosToggle.runMode('panic')
    else if (type === 'celebration') window.ChaosToggle.runMode('celebration')
  }

  function unwrap() {
    var ct = window.ChaosToggle
    if (ct && ct.ChaosToggle) window.ChaosToggle = ct.ChaosToggle
  }
  unwrap()
  if (window.ChaosToggle && window.ChaosToggle.init) {
    window.ChaosToggle.init({ duration: 3000 })
    return
  }
  var el = document.createElement('script')
  el.src = 'https://cdn.jsdelivr.net/npm/chaos-toggle/dist/chaos-toggle.min.js'
  el.onload = function() {
    unwrap()
    if (window.ChaosToggle) window.ChaosToggle.init({ duration: 3000 })
  }
  document.head.appendChild(el)
}

onMounted(function() { loadChaos() })
onUnmounted(function() { if (window.ChaosToggle) window.ChaosToggle.reset() })
</script>
