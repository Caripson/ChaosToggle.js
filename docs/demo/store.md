---
title: ChaosShop Demo
layout: page
---

<div class="chaos-shop-wrap">
  <header class="cs-header">
    <div class="cs-header-inner">
      <div class="cs-logo">
        <span class="cs-logo-mark">🛒</span>
        <span class="cs-logo-text">ChaosShop</span>
      </div>
      <div class="cs-search" aria-hidden="true">
        <span class="cs-search-fake">Search products…</span>
      </div>
      <div class="cs-cart" title="Cart">
        <span class="cs-cart-icon">🛍️</span>
        <span class="cs-cart-badge">3 items</span>
      </div>
    </div>
  </header>

  <main class="cs-main">
    <section class="cs-hero">
      <h1 class="cs-hero-title">Deals that defy logic</h1>
      <p class="cs-hero-sub">Free shipping on orders over $0.01 · Same-day delivery to parallel universes</p>
    </section>

    <section class="cs-grid" aria-label="Products">
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">⌨️</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">Invisible Keyboard</h2>
          <p class="cs-card-price">$49.99</p>
          <p class="cs-card-stars">★★★★☆ <span class="cs-card-reviews">(2,847)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);">☕</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">Error 404 Mug</h2>
          <p class="cs-card-price">$14.99</p>
          <p class="cs-card-stars">★★★★★ <span class="cs-card-reviews">(12,103)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);">🖼️</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">BSOD Poster</h2>
          <p class="cs-card-price">$24.99</p>
          <p class="cs-card-stars">★★★☆☆ <span class="cs-card-reviews">(891)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">💾</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">Matrix Screensaver USB</h2>
          <p class="cs-card-price">$9.99</p>
          <p class="cs-card-stars">★★★★☆ <span class="cs-card-reviews">(5,220)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);">📎</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">Clippy Plushie</h2>
          <p class="cs-card-price">$29.99</p>
          <p class="cs-card-stars">★★★★★ <span class="cs-card-reviews">(3,401)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
      <article class="cs-card">
        <div class="cs-card-img" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">💥</div>
        <div class="cs-card-body">
          <h2 class="cs-card-title">Self-Destructing Hard Drive</h2>
          <p class="cs-card-price">$99.99</p>
          <p class="cs-card-stars">★★☆☆☆ <span class="cs-card-reviews">(14)</span></p>
          <button type="button" class="cs-btn">Add to Cart</button>
        </div>
      </article>
    </section>
  </main>

  <nav class="cs-chaos-bar" aria-label="Chaos demo controls">
    <span class="cs-chaos-label">Chaos toolbar</span>
    <button type="button" class="cs-chaos-btn cs-chaos-btn--sale" onclick="ChaosToggle.runTheme('black-friday')">Black Friday Sale</button>
    <button type="button" class="cs-chaos-btn" onclick="ChaosToggle.runEffect('screenCrack'); setTimeout(()=>ChaosToggle.runEffect('confetti'),500)">Flash Deal!</button>
    <button type="button" class="cs-chaos-btn" onclick="ChaosToggle.runEffect('bsod')">Payment Error</button>
    <button type="button" class="cs-chaos-btn" onclick="ChaosToggle.runEffect('clippy')">Checkout Assistant</button>
    <button type="button" class="cs-chaos-btn cs-chaos-btn--reset" onclick="ChaosToggle.reset()">Reset</button>
  </nav>
</div>

<style>
.chaos-shop-wrap {
  --cs-bg: #f4f6f9;
  --cs-card: #ffffff;
  --cs-text: #1e293b;
  --cs-muted: #64748b;
  --cs-accent: #4f46e5;
  --cs-bar: #0f172a;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--cs-text);
  background: var(--cs-bg);
  min-height: 100vh;
  padding-bottom: 5.5rem;
  margin: -24px -24px 0;
  max-width: none;
}
.cs-header {
  background: var(--cs-card);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}
.cs-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.cs-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}
.cs-logo-mark { font-size: 1.5rem; line-height: 1; }
.cs-search {
  flex: 1;
  max-width: 420px;
}
.cs-search-fake {
  display: block;
  padding: 0.5rem 1rem;
  background: var(--cs-bg);
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: var(--cs-muted);
  font-size: 0.875rem;
}
.cs-cart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  cursor: default;
}
.cs-cart-icon { font-size: 1.35rem; }
.cs-cart-badge {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--cs-accent);
  background: #eef2ff;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}
.cs-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}
.cs-hero {
  text-align: center;
  margin-bottom: 2.5rem;
}
.cs-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem;
}
.cs-hero-sub {
  margin: 0;
  color: var(--cs-muted);
  font-size: 0.95rem;
}
.cs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
.cs-card {
  background: var(--cs-card);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06);
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.2s, transform 0.2s;
}
.cs-card:hover {
  box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -4px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}
.cs-card-img {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
}
.cs-card-body { padding: 1.125rem 1.25rem 1.35rem; }
.cs-card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  line-height: 1.3;
}
.cs-card-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--cs-accent);
  margin: 0 0 0.5rem;
}
.cs-card-stars {
  font-size: 0.8125rem;
  color: #ca8a04;
  letter-spacing: 0.05em;
  margin: 0 0 1rem;
}
.cs-card-reviews { color: var(--cs-muted); letter-spacing: 0; }
.cs-btn {
  width: 100%;
  padding: 0.65rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #fff;
  background: var(--cs-accent);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, filter 0.15s;
}
.cs-btn:hover { filter: brightness(1.08); }
.cs-chaos-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--cs-bar);
  border-top: 1px solid #334155;
  padding: 0.65rem 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 0.65rem;
  z-index: 100;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.25);
}
.cs-chaos-label {
  color: #94a3b8;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  width: 100%;
  text-align: center;
  margin-bottom: 0.15rem;
}
@media (min-width: 768px) {
  .cs-chaos-label { width: auto; margin: 0 0.5rem 0 0; text-align: left; }
}
.cs-chaos-btn {
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e2e8f0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.cs-chaos-btn:hover {
  background: #334155;
  border-color: #475569;
}
.cs-chaos-btn--sale {
  background: #7c3aed;
  border-color: #6d28d9;
  color: #fff;
}
.cs-chaos-btn--sale:hover { background: #6d28d9; }
.cs-chaos-btn--reset {
  background: transparent;
  color: #94a3b8;
}
.cs-chaos-btn--reset:hover {
  color: #f1f5f9;
  background: #334155;
}
</style>

<script setup>
import { onMounted, onUnmounted } from 'vue'

function loadChaos() {
  if (window.ChaosToggle) {
    window.ChaosToggle.init({ duration: 3000 })
    return
  }
  const el = document.createElement('script')
  el.src = 'https://cdn.jsdelivr.net/gh/Caripson/ChaosToggle.js@main/dist/chaos-toggle.min.js'
  el.onload = () => {
    if (window.ChaosToggle) window.ChaosToggle.init({ duration: 3000 })
  }
  document.head.appendChild(el)
}

onMounted(() => { loadChaos() })
onUnmounted(() => { if (window.ChaosToggle) window.ChaosToggle.reset() })
</script>
