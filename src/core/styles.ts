export const BASE_CSS = `
.ct-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;mix-blend-mode:screen}
.ct-glitch{background:repeating-linear-gradient(180deg,rgba(255,0,80,.18) 0 2px,rgba(0,255,255,.12) 2px 4px);opacity:.55;animation:ctGlitch .14s steps(2,end) infinite}
.ct-noise{background-image:radial-gradient(circle,rgba(255,255,255,.2) 1px,transparent 1px);background-size:3px 3px;opacity:.2}
.ct-flash{background:rgba(255,255,255,.35);animation:ctPulse .16s linear infinite}
.ct-popup{position:fixed;right:18px;bottom:18px;max-width:320px;background:#111;color:#f8f8f8;border:2px solid #ff4d6d;border-radius:10px;padding:12px 12px 10px;box-shadow:0 12px 28px rgba(0,0,0,.4);z-index:2147483001;font-family:ui-sans-serif,system-ui}
.ct-popup h4{margin:0 0 6px;font-size:14px;letter-spacing:.02em}
.ct-popup p{margin:0 0 8px;font-size:12px;line-height:1.4}
.ct-popup button{border:0;background:#ff4d6d;color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px}
.ct-shake{animation:ctShake .05s linear infinite}
.ct-shake-rumble{animation:ctRumble .24s linear infinite}
.ct-shake-wobble{animation:ctWobble .22s ease-in-out infinite}
.ct-shake-float{animation:ctFloat 2.4s ease-in-out infinite}
.ct-zoom{animation:ctZoom .2s linear infinite alternate}
.ct-zoom-3d{transform-style:preserve-3d;perspective:900px;animation:ctZoom3d .36s ease-in-out infinite alternate}
.ct-zoom-prism{filter:saturate(1.08) drop-shadow(0 10px 30px rgba(80,180,255,.2));transform:perspective(1000px) rotateX(var(--ct-zoom-tilt-x,0deg)) rotateY(var(--ct-zoom-tilt-y,0deg))}
.ct-error{filter:saturate(1.25) hue-rotate(-22deg)}
.ct-theme-overlay{position:fixed;inset:0;pointer-events:none;z-index:2147482999}
.ct-theme-hint{position:fixed;bottom:16px;left:16px;font-size:24px;opacity:.55;animation:ctHint 2.3s ease-in-out infinite;z-index:2147483003;pointer-events:none}
.ct-theme-pulse{animation:ctHeartbeat .8s ease-in-out infinite}
.ct-theme-recoil{animation:ctRecoil .42s ease-out 3}
.ct-theme-drift-layer{position:fixed;inset:-10%;pointer-events:none;z-index:2147482998;opacity:.24;filter:blur(28px);mix-blend-mode:screen;animation:ctAmbientDrift 8.5s ease-in-out infinite alternate}
.ct-theme-countdown{position:fixed;top:18px;left:50%;transform:translateX(-50%);min-width:136px;padding:10px 12px 12px;border-radius:14px;background:rgba(8,12,24,.72);border:1px solid rgba(255,255,255,.12);box-shadow:0 18px 40px rgba(0,0,0,.32);backdrop-filter:blur(14px);z-index:2147483004;color:#f8fafc;text-align:center;pointer-events:none}
.ct-theme-countdown__label{font:600 12px/1 ui-sans-serif,system-ui;letter-spacing:.18em;text-transform:uppercase;opacity:.84;margin-bottom:8px}
.ct-theme-countdown__value{font:700 24px/1 ui-sans-serif,system-ui;letter-spacing:.04em}
.ct-theme-countdown__track{position:relative;overflow:hidden;height:6px;border-radius:999px;background:rgba(255,255,255,.08);margin-top:10px}
.ct-theme-countdown__bar{height:100%;width:100%;border-radius:999px;transform-origin:left center;animation:ctCountdownBar linear forwards}
.ct-theme-dark{background-color:#07070b;color:#f5f5f5}
.ct-rgb-split{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
.ct-vhs{position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden}
.ct-vhs-scanlines{background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.25) 2px 4px);position:absolute;inset:0}
.ct-vhs-tracking{animation:ctVhsTracking .3s steps(1) infinite;position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 80px,rgba(255,255,255,.04) 80px 82px)}
.ct-screen-crack{position:fixed;inset:0;pointer-events:none;z-index:2147483002}
.ct-screen-melt{animation:ctMelt 2s ease-in forwards}
.ct-crt-shutdown{animation:ctCrtOff .6s ease-in forwards;transform-origin:center}
.ct-bsod{position:fixed;inset:0;z-index:2147483600;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0078d7;color:#fff;font-family:'Segoe UI',sans-serif;padding:40px;cursor:default}
.ct-fake-update{position:fixed;inset:0;z-index:2147483600;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0078d7;color:#fff;font-family:'Segoe UI',sans-serif;cursor:default}
.ct-fake-terminal{position:fixed;inset:0;z-index:2147483600;background:#0c0c0c;color:#00ff41;font-family:'Courier New',monospace;padding:20px;overflow:hidden;cursor:text}
.ct-clippy{position:fixed;bottom:20px;right:20px;z-index:2147483500;pointer-events:auto;font-family:ui-sans-serif,system-ui;animation:ctClippyBounce .5s ease-out}
.ct-virus-scan{position:fixed;inset:0;z-index:2147483600;background:#1a1a2e;color:#0f0;font-family:'Courier New',monospace;padding:30px;overflow:hidden}
.ct-fake-crash{position:fixed;inset:0;z-index:2147483600;background:#f5f5f5;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Segoe UI',Arial,sans-serif;color:#333}
.ct-matrix-canvas{position:fixed;inset:0;z-index:2147483000;pointer-events:none}
.ct-gravity-el{transition:none!important;position:fixed!important;z-index:2147483000!important}
.ct-cursor-trail{position:fixed;pointer-events:none;z-index:2147483100;border-radius:50%;transition:opacity .3s}
.ct-drunk{filter:blur(1.5px) hue-rotate(15deg);transition:filter .4s}
.ct-screenflip-vortex{background:radial-gradient(circle at 50% 50%,rgba(120,200,255,.18),rgba(95,0,160,.08) 42%,transparent 72%);opacity:0;animation:ctFlipVortex .9s ease-out forwards}
@keyframes ctGlitch{0%{transform:translate(0,0)}20%{transform:translate(-3px,2px)}40%{transform:translate(2px,-1px)}60%{transform:translate(-2px,1px)}80%{transform:translate(3px,-2px)}100%{transform:translate(0,0)}}
@keyframes ctPulse{0%,100%{opacity:.05}50%{opacity:.25}}
@keyframes ctShake{0%{transform:translate(1px,0)}25%{transform:translate(-1px,1px)}50%{transform:translate(-2px,-1px)}75%{transform:translate(2px,1px)}100%{transform:translate(1px,0)}}
@keyframes ctRumble{0%,100%{transform:translate(0,0)}50%{transform:translate(-1px,1px)}}
@keyframes ctWobble{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-1px,0) rotate(-.2deg)}75%{transform:translate(1px,0) rotate(.2deg)}}
@keyframes ctFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes ctZoom{from{transform:scale(1)}to{transform:scale(1.02)}}
@keyframes ctZoom3d{0%{transform:perspective(900px) translateZ(0) rotateX(0) rotateY(0) scale(1)}100%{transform:perspective(900px) translateZ(24px) rotateX(.9deg) rotateY(-1.4deg) scale(1.024)}}
@keyframes ctHint{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:.65;transform:translateY(-4px)}}
@keyframes ctHeartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.01)}}
@keyframes ctRecoil{0%{transform:translateX(0)}30%{transform:translateX(-6px)}60%{transform:translateX(3px)}100%{transform:translateX(0)}}
@keyframes ctAmbientDrift{0%{transform:translate3d(-2%,0,0) scale(1)}50%{transform:translate3d(2%,-1.5%,0) scale(1.03)}100%{transform:translate3d(-1%,2%,0) scale(1.06)}}
@keyframes ctCountdownBar{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes ctVhsTracking{0%{transform:translateY(0)}50%{transform:translateY(-2px)}100%{transform:translateY(1px)}}
@keyframes ctMelt{0%{clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 0 100% 0)}}
@keyframes ctCrtOff{0%{transform:scaleY(1) scaleX(1);opacity:1;filter:brightness(1)}50%{transform:scaleY(.005) scaleX(1);opacity:1;filter:brightness(2)}80%{transform:scaleY(.005) scaleX(.1);opacity:.7;filter:brightness(3)}100%{transform:scaleY(0) scaleX(0);opacity:0;filter:brightness(0)}}
@keyframes ctClippyBounce{0%{transform:translateY(40px) scale(.8);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
@keyframes ctScreenFlip{0%{transform:rotate(0deg)}100%{transform:rotate(180deg)}}
@keyframes ctFlipVortex{0%{opacity:0;transform:scale(.9)}30%{opacity:.45}100%{opacity:0;transform:scale(1.16)}}
`;
