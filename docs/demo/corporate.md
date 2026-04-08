---
title: Corporate Demo
layout: page
---

<style>
.sf-demo { --sf-blue: #2563eb; --sf-blue-dark: #1d4ed8; --sf-slate: #0f172a; --sf-muted: #64748b; --sf-bg: #f8fafc; --sf-card: #ffffff; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--sf-slate); background: var(--sf-bg); padding: 0 0 120px; min-height: 100vh; }
.sf-demo * { box-sizing: border-box; }
.sf-nav-wrap { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
.sf-nav { max-width: 1120px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.sf-logo { font-weight: 800; font-size: 1.25rem; letter-spacing: -0.03em; display: flex; align-items: center; gap: 8px; }
.sf-logo-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--sf-blue), #7c3aed); display: grid; place-items: center; color: #fff; font-size: 0.75rem; font-weight: 700; }
.sf-links { display: flex; align-items: center; gap: 8px 28px; flex-wrap: wrap; font-size: 0.9rem; font-weight: 500; }
.sf-links a { color: var(--sf-slate); text-decoration: none; }
.sf-links a:hover { color: var(--sf-blue); }
.sf-cta { background: var(--sf-blue); color: #fff !important; padding: 10px 20px; border-radius: 10px; font-weight: 600; box-shadow: 0 4px 14px rgba(37,99,235,0.35); }
.sf-cta:hover { background: var(--sf-blue-dark); color: #fff !important; }
.sf-hero { max-width: 1120px; margin: 0 auto; padding: 72px 24px 80px; text-align: center; }
.sf-hero-badge { display: inline-block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--sf-blue); background: rgba(37,99,235,0.08); padding: 6px 14px; border-radius: 999px; margin-bottom: 20px; }
.sf-hero h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 20px; background: linear-gradient(135deg, #0f172a 0%, #334155 50%, var(--sf-blue) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.sf-hero p { font-size: 1.2rem; color: var(--sf-muted); max-width: 560px; margin: 0 auto 32px; line-height: 1.6; }
.sf-hero-btns { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.sf-btn-primary { background: var(--sf-blue); color: #fff; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 20px rgba(37,99,235,0.35); }
.sf-btn-primary:hover { background: var(--sf-blue-dark); }
.sf-btn-ghost { background: #fff; color: var(--sf-slate); border: 1px solid #e2e8f0; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; }
.sf-btn-ghost:hover { border-color: #cbd5e1; background: #f8fafc; }
.sf-section { max-width: 1120px; margin: 0 auto; padding: 0 24px 80px; }
.sf-section-title { text-align: center; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--sf-blue); margin-bottom: 12px; }
.sf-section h2 { text-align: center; font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 48px; }
.sf-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
.sf-card { background: var(--sf-card); border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 24px rgba(15,23,42,0.06); transition: transform 0.2s, box-shadow 0.2s; }
.sf-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(15,23,42,0.1); }
.sf-card-icon { font-size: 2.5rem; line-height: 1; margin-bottom: 16px; }
.sf-card h3 { font-size: 1.15rem; font-weight: 700; margin: 0 0 10px; }
.sf-card p { margin: 0; color: var(--sf-muted); font-size: 0.95rem; line-height: 1.6; }
.sf-quote-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px 80px; }
.sf-quote { background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border-radius: 20px; padding: 48px 40px; text-align: center; border: 1px solid #e0e7ff; }
.sf-quote blockquote { margin: 0; font-size: clamp(1.15rem, 2.5vw, 1.45rem); font-weight: 500; line-height: 1.55; color: #1e293b; font-style: italic; }
.sf-quote cite { display: block; margin-top: 20px; font-style: normal; font-size: 0.9rem; font-weight: 600; color: var(--sf-blue); }
.sf-pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; align-items: stretch; }
.sf-tier { background: var(--sf-card); border-radius: 16px; padding: 36px 28px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.sf-tier.featured { border-color: var(--sf-blue); box-shadow: 0 8px 32px rgba(37,99,235,0.15); position: relative; }
.sf-tier.featured::before { content: 'Most popular'; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--sf-blue); color: #fff; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 6px 14px; border-radius: 999px; }
.sf-tier h3 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; }
.sf-tier .sf-price { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
.sf-tier .sf-price small { font-size: 1rem; font-weight: 600; color: var(--sf-muted); }
.sf-tier ul { list-style: none; padding: 0; margin: 20px 0 0; flex: 1; }
.sf-tier li { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #475569; padding-left: 24px; position: relative; }
.sf-tier li::before { content: '✓'; position: absolute; left: 0; color: var(--sf-blue); font-weight: 700; }
.sf-tier .sf-tier-cta { margin-top: 24px; width: 100%; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; border: none; font-size: 0.95rem; }
.sf-tier .sf-tier-cta.outline { background: #fff; border: 2px solid #e2e8f0; color: var(--sf-slate); }
.sf-tier .sf-tier-cta.solid { background: var(--sf-blue); color: #fff; }
.sf-footer { max-width: 1120px; margin: 0 auto; padding: 40px 24px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 0.85rem; color: var(--sf-muted); }
.sf-chaos-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; padding: 14px 16px; background: linear-gradient(180deg, #0f172a, #020617); border-top: 1px solid #1e293b; font-family: ui-sans-serif, system-ui, sans-serif; box-shadow: 0 -12px 40px rgba(15,23,42,0.4); }
.sf-chaos-bar span { color: #94a3b8; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.14em; margin-right: 8px; width: 100%; text-align: center; }
@media (min-width: 720px) { .sf-chaos-bar span { width: auto; text-align: left; margin-right: 14px; } }
.sf-chaos-bar button { cursor: pointer; border: 1px solid #334155; padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; background: #1e293b; color: #e2e8f0; }
.sf-chaos-bar button:hover { background: #334155; }
.sf-chaos-bar .sf-reset { background: var(--sf-blue); border-color: var(--sf-blue-dark); color: #fff; }
.sf-chaos-bar .sf-reset:hover { background: var(--sf-blue-dark); }
</style>

<div class="sf-demo">
<div class="sf-nav-wrap">
  <nav class="sf-nav" aria-label="Main">
    <div class="sf-logo">
      <span class="sf-logo-mark" aria-hidden="true">SF</span>
      SyncFlow
    </div>
    <div class="sf-links">
      <a href="#">Product</a>
      <a href="#">Pricing</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
      <a class="sf-cta" href="#">Get Started</a>
    </div>
  </nav>
</div>
<section class="sf-hero">
  <span class="sf-hero-badge">Workflow intelligence</span>
  <h1>Streamline Your Workflow</h1>
  <p>The all-in-one platform trusted by 10,000+ teams to ship faster, stay aligned, and pretend their calendar isn’t a competitive sport.</p>
  <div class="sf-hero-btns">
    <button type="button" class="sf-btn-primary">Start Free Trial</button>
    <button type="button" class="sf-btn-ghost">Watch Demo</button>
  </div>
</section>
<section class="sf-section" aria-labelledby="sf-features-heading">
  <p class="sf-section-title" id="sf-features-heading">Why SyncFlow</p>
  <h2>Everything your team needs, in one calm dashboard</h2>
  <div class="sf-features">
    <div class="sf-card">
      <div class="sf-card-icon" aria-hidden="true">⚡</div>
      <h3>Lightning Fast</h3>
      <p>Real-time sync across projects, channels, and time zones—so nobody has to ask “which doc is the source of truth?” for the ninth time this week.</p>
    </div>
    <div class="sf-card">
      <div class="sf-card-icon" aria-hidden="true">🔒</div>
      <h3>Enterprise Security</h3>
      <p>SOC 2-friendly controls, granular permissions, and audit trails that make compliance reviewers nod slowly instead of scheduling another “quick sync.”</p>
    </div>
    <div class="sf-card">
      <div class="sf-card-icon" aria-hidden="true">🤝</div>
      <h3>Team Collaboration</h3>
      <p>Shared workspaces, smart mentions, and workflows that turn “I’ll Slack you the link” into an actual system your future self will thank you for.</p>
    </div>
  </div>
</section>
<div class="sf-quote-wrap">
  <div class="sf-quote">
    <blockquote>“SyncFlow transformed how our team works together. We finally have one place for priorities, context, and decisions—without losing them to a thread from 2023.”</blockquote>
    <cite>— Sarah Johnson, CTO at TechCorp</cite>
  </div>
</div>
<section class="sf-section" aria-labelledby="sf-pricing-heading">
  <p class="sf-section-title" id="sf-pricing-heading">Pricing</p>
  <h2>Plans that scale with your ambition</h2>
  <div class="sf-pricing">
    <div class="sf-tier">
      <h3>Starter</h3>
      <div class="sf-price">$9<small>/mo</small></div>
      <p style="margin:0;font-size:0.9rem;color:var(--sf-muted)">For small teams getting organized.</p>
      <ul>
        <li>Up to 5 seats</li>
        <li>Core workflows</li>
        <li>7-day version history</li>
        <li>Email support</li>
      </ul>
      <button type="button" class="sf-tier-cta outline">Choose Starter</button>
    </div>
    <div class="sf-tier featured">
      <h3>Pro</h3>
      <div class="sf-price">$29<small>/mo</small></div>
      <p style="margin:0;font-size:0.9rem;color:var(--sf-muted)">For growing teams that live in the product.</p>
      <ul>
        <li>Unlimited seats</li>
        <li>Advanced automation</li>
        <li>SSO &amp; admin controls</li>
        <li>Priority support</li>
        <li>Custom integrations</li>
      </ul>
      <button type="button" class="sf-tier-cta solid">Choose Pro</button>
    </div>
    <div class="sf-tier">
      <h3>Enterprise</h3>
      <div class="sf-price">Contact us</div>
      <p style="margin:0;font-size:0.9rem;color:var(--sf-muted)">For orgs with compliance, scale, and a dedicated “platform” Slack channel.</p>
      <ul>
        <li>Dedicated success team</li>
        <li>Custom SLA</li>
        <li>Advanced security reviews</li>
        <li>Private deployment options</li>
      </ul>
      <button type="button" class="sf-tier-cta outline">Talk to sales</button>
    </div>
  </div>
</section>
<footer class="sf-footer">
  © 2026 SyncFlow Inc. All rights reserved. Built for teams who ship—and occasionally read the footer.
</footer>
<div class="sf-chaos-bar" role="toolbar" aria-label="Chaos demo controls">
  <span>Board mode</span>
  <button type="button" onclick="ChaosToggle.runMode('celebration')">Investor Demo</button>
  <button type="button" onclick="ChaosToggle.runMode('nuclear')">Intern Pushed to Prod</button>
  <button type="button" onclick="ChaosToggle.runTheme('office')">IT Helpdesk</button>
  <button type="button" onclick="ChaosToggle.runTheme('jumpscare')">Jumpscare</button>
  <button type="button" class="sf-reset" onclick="ChaosToggle.reset()">Reset</button>
</div>
</div>

<script setup>
import { onMounted, onUnmounted } from 'vue'

function loadChaos() {
  function unwrap() { var c = window.ChaosToggle; if (c && c.ChaosToggle) window.ChaosToggle = c.ChaosToggle; }
  unwrap()
  if (window.ChaosToggle && window.ChaosToggle.init) {
    window.ChaosToggle.init({ duration: 3000 })
    return
  }
  var el = document.createElement('script')
  el.src = 'https://cdn.jsdelivr.net/npm/chaos-toggle/dist/chaos-toggle.min.js'
  el.onload = function() { unwrap(); if (window.ChaosToggle) window.ChaosToggle.init({ duration: 3000 }); }
  document.head.appendChild(el)
}

onMounted(function() { loadChaos() })
onUnmounted(function() { if (window.ChaosToggle) window.ChaosToggle.reset() })
</script>
