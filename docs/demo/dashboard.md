---
title: Dashboard Demo
layout: page
---

<style>
.cm-dash-wrap {
  --cm-sidebar: #0c1222;
  --cm-sidebar-hover: #151d32;
  --cm-content-bg: #f1f5f9;
  --cm-surface: #ffffff;
  --cm-text: #0f172a;
  --cm-muted: #64748b;
  --cm-border: #e2e8f0;
  --cm-bar: #0f172a;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--cm-text);
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: 0;
}
.cm-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--cm-sidebar);
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1e293b;
}
.cm-sidebar-brand {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid #1e293b;
}
.cm-brand-icon { font-size: 1.35rem; }
.cm-brand-text {
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  color: #f8fafc;
}
.cm-nav {
  padding: 1rem 0.75rem;
  flex: 1;
}
.cm-nav-item {
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  cursor: default;
  color: #94a3b8;
  transition: background 0.15s, color 0.15s;
}
.cm-nav-item:hover {
  background: var(--cm-sidebar-hover);
  color: #e2e8f0;
}
.cm-nav-item--active {
  background: #1e3a5f;
  color: #7dd3fc;
}
.cm-sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #1e293b;
}
.cm-sidebar-hint {
  font-size: 0.7rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.cm-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--cm-content-bg);
}
.cm-topbar {
  background: var(--cm-surface);
  border-bottom: 1px solid var(--cm-border);
  padding: 1rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.cm-page-title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cm-breadcrumb {
  margin: 0.2rem 0 0;
  font-size: 0.8125rem;
  color: var(--cm-muted);
}
.cm-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  font-weight: 700;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
}
.cm-content {
  padding: 1.5rem 1.75rem 2rem;
  flex: 1;
}
.cm-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 1024px) {
  .cm-kpis { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .cm-sidebar { display: none; }
  .cm-kpis { grid-template-columns: 1fr; }
}
.cm-kpi {
  background: var(--cm-surface);
  border-radius: 12px;
  padding: 1.15rem 1.25rem;
  border: 1px solid var(--cm-border);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  border-top: 4px solid #94a3b8;
}
.cm-kpi--revenue { border-top-color: #22c55e; }
.cm-kpi--users { border-top-color: #3b82f6; }
.cm-kpi--uptime { border-top-color: #a855f7; }
.cm-kpi--incidents { border-top-color: #f97316; }
.cm-kpi-label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cm-muted);
}
.cm-kpi-value {
  margin: 0.35rem 0 0.25rem;
  font-size: 1.625rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.cm-kpi-delta {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--cm-muted);
}
.cm-kpi-delta.positive { color: #16a34a; }
.cm-kpi-delta.negative { color: #dc2626; }
.cm-panel {
  background: var(--cm-surface);
  border-radius: 12px;
  border: 1px solid var(--cm-border);
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}
.cm-panel-head {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--cm-border);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}
.cm-panel-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}
.cm-panel-meta {
  font-size: 0.8125rem;
  color: var(--cm-muted);
}
.cm-chart {
  padding: 1.5rem 1.25rem 1.25rem;
  min-height: 220px;
}
.cm-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  height: 180px;
  padding: 0 0.5rem;
  border-bottom: 1px solid var(--cm-border);
}
.cm-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.cm-bar {
  width: 100%;
  max-width: 48px;
  border-radius: 6px 6px 0 0;
  min-height: 8%;
  transition: opacity 0.2s;
}
.cm-bar--1 { background: linear-gradient(180deg, #60a5fa, #2563eb); }
.cm-bar--2 { background: linear-gradient(180deg, #34d399, #059669); }
.cm-bar--3 { background: linear-gradient(180deg, #fbbf24, #d97706); }
.cm-bar--4 { background: linear-gradient(180deg, #a78bfa, #7c3aed); }
.cm-bar--5 { background: linear-gradient(180deg, #fb7185, #e11d48); }
.cm-bar--6 { background: linear-gradient(180deg, #2dd4bf, #0d9488); }
.cm-bar-label {
  margin-top: 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cm-muted);
}
.cm-panel--table .cm-panel-head { border-bottom: none; }
.cm-table-wrap { overflow-x: auto; }
.cm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.cm-table th {
  text-align: left;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  color: var(--cm-muted);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--cm-border);
}
.cm-table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--cm-border);
  color: var(--cm-text);
}
.cm-table tbody tr:last-child td { border-bottom: none; }
.cm-table tbody tr:hover td { background: #fafbfc; }
.cm-pill {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
.cm-pill--ok { background: #dcfce7; color: #166534; }
.cm-pill--warn { background: #fef3c7; color: #92400e; }
.cm-pill--pending { background: #e0e7ff; color: #3730a3; }
.cm-chaos-bar {
  position: sticky;
  bottom: 0;
  background: var(--cm-bar);
  border-top: 1px solid #334155;
  padding: 0.6rem 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem 0.6rem;
  z-index: 100;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.2);
}
.cm-chaos-label {
  color: #94a3b8;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  width: 100%;
  text-align: center;
}
@media (min-width: 900px) {
  .cm-chaos-label { width: auto; margin-right: 0.5rem; text-align: left; }
}
.cm-chaos-btn {
  padding: 0.45rem 0.8rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e2e8f0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.cm-chaos-btn:hover {
  background: #334155;
  border-color: #475569;
}
.cm-chaos-btn--danger {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fecaca;
}
.cm-chaos-btn--danger:hover { background: #991b1b; }
.cm-chaos-btn--reset {
  background: transparent;
  color: #94a3b8;
}
.cm-chaos-btn--reset:hover {
  color: #f1f5f9;
  background: #334155;
}
</style>

<div class="cm-dash-wrap">
  <aside class="cm-sidebar">
    <div class="cm-sidebar-brand">
      <span class="cm-brand-icon">📊</span>
      <span class="cm-brand-text">ChaosMetrics</span>
    </div>
    <nav class="cm-nav" aria-label="Main">
      <div class="cm-nav-item cm-nav-item--active">Overview</div>
      <div class="cm-nav-item">Analytics</div>
      <div class="cm-nav-item">Reports</div>
      <div class="cm-nav-item">Settings</div>
    </nav>
    <div class="cm-sidebar-footer">
      <span class="cm-sidebar-hint">v2.4.1 · Enterprise</span>
    </div>
  </aside>
  <div class="cm-shell">
    <header class="cm-topbar">
      <div class="cm-topbar-left">
        <h1 class="cm-page-title">Overview</h1>
        <p class="cm-breadcrumb">Home / Dashboard</p>
      </div>
      <div class="cm-topbar-right">
        <span class="cm-avatar" title="John Doe">JD</span>
      </div>
    </header>
    <main class="cm-content">
      <section class="cm-kpis" aria-label="Key metrics">
        <article class="cm-kpi cm-kpi--revenue">
          <p class="cm-kpi-label">Revenue</p>
          <p class="cm-kpi-value">$1.2M</p>
          <p class="cm-kpi-delta positive">↑ 12.4% vs last month</p>
        </article>
        <article class="cm-kpi cm-kpi--users">
          <p class="cm-kpi-label">Users</p>
          <p class="cm-kpi-value">48,291</p>
          <p class="cm-kpi-delta positive">↑ 3.1% vs last month</p>
        </article>
        <article class="cm-kpi cm-kpi--uptime">
          <p class="cm-kpi-label">Uptime</p>
          <p class="cm-kpi-value">99.2%</p>
          <p class="cm-kpi-delta">SLA target 99.0%</p>
        </article>
        <article class="cm-kpi cm-kpi--incidents">
          <p class="cm-kpi-label">Incidents</p>
          <p class="cm-kpi-value">7</p>
          <p class="cm-kpi-delta negative">3 open</p>
        </article>
      </section>
      <section class="cm-panel">
        <div class="cm-panel-head">
          <h2 class="cm-panel-title">Monthly active usage</h2>
          <span class="cm-panel-meta">Last 6 months</span>
        </div>
        <div class="cm-chart" role="img" aria-label="Bar chart: Jan through Jun">
          <div class="cm-chart-bars">
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--1" style="height: 45%;"></div><span class="cm-bar-label">Jan</span></div>
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--2" style="height: 62%;"></div><span class="cm-bar-label">Feb</span></div>
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--3" style="height: 38%;"></div><span class="cm-bar-label">Mar</span></div>
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--4" style="height: 88%;"></div><span class="cm-bar-label">Apr</span></div>
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--5" style="height: 55%;"></div><span class="cm-bar-label">May</span></div>
            <div class="cm-bar-wrap"><div class="cm-bar cm-bar--6" style="height: 72%;"></div><span class="cm-bar-label">Jun</span></div>
          </div>
        </div>
      </section>
      <section class="cm-panel cm-panel--table">
        <div class="cm-panel-head">
          <h2 class="cm-panel-title">Recent activity</h2>
        </div>
        <div class="cm-table-wrap">
          <table class="cm-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>User</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Deployed API gateway v3</td>
                <td>sre-bot</td>
                <td>2 min ago</td>
                <td><span class="cm-pill cm-pill--ok">Success</span></td>
              </tr>
              <tr>
                <td>Quota alert — 87% of burst</td>
                <td>billing@co</td>
                <td>18 min ago</td>
                <td><span class="cm-pill cm-pill--warn">Warning</span></td>
              </tr>
              <tr>
                <td>User export requested (GDPR)</td>
                <td>jdoe</td>
                <td>1 hr ago</td>
                <td><span class="cm-pill cm-pill--pending">Pending</span></td>
              </tr>
              <tr>
                <td>Failed login spike (region EU)</td>
                <td>security</td>
                <td>3 hr ago</td>
                <td><span class="cm-pill cm-pill--ok">Reviewed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
  <nav class="cm-chaos-bar" aria-label="Chaos demo controls">
    <span class="cm-chaos-label">Chaos toolbar</span>
    <button type="button" class="cm-chaos-btn cm-chaos-btn--danger" onclick="ChaosToggle.runTheme('apocalypse')">System Failure</button>
    <button type="button" class="cm-chaos-btn" onclick="ChaosToggle.runTheme('hacker')">Hacker Alert</button>
    <button type="button" class="cm-chaos-btn" onclick="ChaosToggle.runEffect('fakeUpdate')">Windows Update</button>
    <button type="button" class="cm-chaos-btn" onclick="ChaosToggle.runTheme('drunk')">Drunk Friday</button>
    <button type="button" class="cm-chaos-btn cm-chaos-btn--reset" onclick="ChaosToggle.reset()">Reset</button>
  </nav>
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
