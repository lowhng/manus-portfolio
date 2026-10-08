#!/usr/bin/env node
/** Write thin HTML shells for each Sunway Cochrane unit. */
const fs = require('fs');
const path = require('path');

const UNITS = [
  { id: 'type-a', title: 'Type A', beds: '1+1 bedroom', baths: '1 bathroom', sqft: 650 },
  { id: 'type-b', title: 'Type B', beds: '2 bedrooms', baths: '2 bathrooms', sqft: 732 },
  { id: 'type-c', title: 'Type C', beds: '2+1 bedrooms', baths: '2 bathrooms', sqft: 872 },
  { id: 'type-d', title: 'Type D', beds: '3 bedrooms', baths: '2 bathrooms', sqft: 1001 },
];

const CSS = `/* shared Ayanna-style chrome — see public/ayanna/index.html */
:root{color-scheme:light;box-sizing:border-box;
  --sky-top:#dfe7ee; --sky-bottom:#f3f2ee;
  --panel:rgba(252,251,248,.86); --panel-line:rgba(60,66,56,.14);
  --ink:#23271f; --ink-soft:#5b6154; --ink-faint:#8a8f82;
  --accent:#5f6b55; --accent-ink:#fbfaf6; --chip:#eceae3; --chip-hover:#e1ded5;
  --label-bg:rgba(35,39,31,.78); --label-ink:#f7f5ef;
  --sans:"Manrope",system-ui,-apple-system,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  color-scheme:dark;
  --sky-top:#1d2226; --sky-bottom:#2b2d2a;
  --panel:rgba(30,33,29,.86); --panel-line:rgba(230,232,220,.12);
  --ink:#ecebe4; --ink-soft:#b3b6aa; --ink-faint:#80847a;
  --accent:#a3b394; --accent-ink:#1b1e19; --chip:#353933; --chip-hover:#41463e;
  --label-bg:rgba(248,246,240,.9); --label-ink:#23271f;
}}
html,body{height:100%;margin:0}
body{background:linear-gradient(180deg,var(--sky-top),var(--sky-bottom));color:var(--ink);font-family:var(--sans);overflow:hidden}
#stage{position:fixed;inset:0}
#stage canvas{display:block;width:100%;height:100%;touch-action:none}
#labels{position:fixed;inset:0;pointer-events:none}
.lbl{position:absolute;transform:translate(-50%,-50%);background:var(--label-bg);color:var(--label-ink);font:600 11px/1 var(--sans);padding:5px 8px;border-radius:999px;white-space:nowrap;transition:opacity .2s}
#labels.off .lbl{opacity:0}
#panel{position:fixed;top:calc(16px + env(safe-area-inset-top,0px));left:16px;width:290px;max-height:calc(100% - 32px);overflow:auto;background:var(--panel);backdrop-filter:blur(14px);border:1px solid var(--panel-line);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:16px}
.eyebrow{font:500 10.5px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}
h1{margin:6px 0 4px;font-size:22px;font-weight:700}
.meta{font-size:12.5px;color:var(--ink-soft);line-height:1.5}
.meta a{color:var(--accent)}
.sec{display:flex;flex-direction:column;gap:8px}
.sec h2{margin:0;font:500 10.5px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint)}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:0;background:var(--chip);border-radius:8px;padding:7px 10px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;color:inherit}
.chip:hover{background:var(--chip-hover)}
.chip[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
.rooms{margin:0;padding:0;list-style:none}
.rooms button{width:100%;display:flex;justify-content:space-between;border:0;background:none;padding:7px 4px;border-top:1px solid var(--panel-line);text-align:left;cursor:pointer;font-size:13px;font-weight:500;font-family:inherit;color:inherit}
.rooms li:first-child button{border-top:0}
.rooms button:hover{color:var(--accent)}
.dim{font:400 11.5px var(--mono);color:var(--ink-faint);white-space:nowrap}
.toggle{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink-soft)}
.toggle input{accent-color:var(--accent);width:15px;height:15px;margin:0}
.foot{font-size:11px;color:var(--ink-faint);line-height:1.5}
#hint{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));font:400 11px var(--mono);color:var(--ink-soft);background:var(--panel);border:1px solid var(--panel-line);padding:8px 10px;border-radius:8px}
#loader{position:fixed;inset:0;display:grid;place-items:center;pointer-events:none}
#loader div{font:500 12px var(--mono);color:var(--ink-soft)}
#loader[hidden]{display:none}
#collapse{display:none}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.body{display:flex;flex-direction:column;gap:16px}
@media (max-width:640px){
  #panel{top:auto;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:auto;max-height:46%;padding:14px;gap:12px}
  #panel.collapsed .body{display:none}
  #collapse{display:block;border:0;background:var(--chip);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600}
  h1{font-size:18px}
  #hint{display:none}
}
#gate,#fsBtn{display:none}
.embed #hint{display:none}
.embed #collapse{display:block;border:0;background:var(--chip);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600}
.embed #panel.collapsed .body,.embed #panel.collapsed .meta{display:none}
.embed #panel.collapsed{width:auto;padding:10px 12px}
.embed #panel.collapsed h1{font-size:16px;margin:4px 0 0}
.embed.noui #panel{display:none}
.embed #fsBtn{display:grid;place-items:center;position:fixed;top:12px;right:12px;width:36px;height:36px;padding:0;border:1px solid var(--panel-line);border-radius:10px;background:var(--panel)}
.embed #fsBtn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.embed.locked #gate{display:grid;place-items:center;position:fixed;inset:0;width:100%;border:0;padding:0;background:transparent;touch-action:pan-x pan-y}
#gate span{display:flex;align-items:center;gap:8px;font:600 13px/1 var(--sans);color:var(--label-ink);background:var(--label-bg);padding:11px 16px;border-radius:999px}
.embed.locked #panel{pointer-events:none}
.embed:fullscreen #fsBtn .enter,.embed:not(:fullscreen) #fsBtn .exit{display:none}
`;

function page(u) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Sunway Cochrane ${u.title} — 3D Model</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${CSS}
</style>
<script>
{
  const q = new URLSearchParams(location.search), root = document.documentElement;
  if (q.get('embed') === '1') root.classList.add('embed', 'locked');
  if (q.get('ui') === '0') root.classList.add('noui');
  const t = q.get('theme');
  if (t === 'light' || t === 'dark') root.dataset.theme = t;
}
</script>
</head>
<body>
<div id="stage"></div>
<div id="labels"></div>
<div id="loader"><div id="loadtxt">Loading furniture…</div></div>

<aside id="panel" aria-label="Model controls">
  <div class="head">
    <div>
      <div class="eyebrow">Sunway Cochrane · Cheras</div>
      <h1>${u.title} unit</h1>
      <div class="meta">${u.beds} · ${u.baths} · ${u.sqft} sqft built-up. Furnished with Ayanna-style pieces.</div>
    </div>
    <button id="collapse" aria-expanded="true">Hide</button>
  </div>
  <div class="body">
    <div class="sec">
      <h2>Views</h2>
      <div class="chips" id="views"></div>
    </div>
    <div class="sec">
      <h2>Rooms · approx. from plan</h2>
      <ul class="rooms" id="rooms"></ul>
    </div>
    <label class="toggle"><input type="checkbox" id="showLabels" checked> Show room labels</label>
    <div class="foot">Dimensions traced from the developer floor plan (±10%). Furniture from the Ayanna library, scaled to fit. Source: <a href="https://assets.sunwayproperty.com/2026/03/Sunway-Cochrane-Brochure.pdf" target="_blank" rel="noopener">brochure</a>.</div>
  </div>
</aside>
<div id="hint">Drag to orbit · scroll to zoom · right‑drag to pan</div>
<button id="gate" aria-label="Explore the 3D model"><span>Click to explore in 3D</span></button>
<button id="fsBtn" aria-label="Full screen" title="Full screen">
  <svg class="enter" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
  <svg class="exit" viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>
</button>

<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"
}}
</script>
<script src="./data/${u.id}.js"></script>
<script type="module" src="../shared/viewer.js"></script>
</body></html>
`;
}

const out = path.join(__dirname, '..', 'public', 'apartments', 'sunway-cochrane');
for (const u of UNITS) {
  fs.writeFileSync(path.join(out, `${u.id}.html`), page(u));
  console.log('wrote', u.id + '.html');
}
