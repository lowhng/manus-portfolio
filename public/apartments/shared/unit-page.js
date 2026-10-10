/**
 * Shared unit page. The HTML stub only loads this module and the unit's
 * data file. Panel copy comes from window.UNIT.
 */
const U = window.UNIT;
if (!U) throw new Error('UNIT data missing');

function countLabel(n, singular, plural) {
  if (typeof n === 'string' && n.includes('+')) return `${n} ${singular}`;
  const v = Number(n);
  return `${n} ${v === 1 ? singular : plural}`;
}

const place = String(U.location || '').split(',')[0].trim();
document.title = `${U.project} ${U.name} — 3D Model`;

document.body.insertAdjacentHTML('afterbegin', `
<div id="stage"></div>
<div id="labels"></div>
<div id="loader"><div id="loadtxt">Loading furniture…</div></div>
<aside id="panel" aria-label="Model controls">
  <div class="head">
    <div>
      <div class="eyebrow"></div>
      <h1></h1>
      <div class="legend" id="hackNote" hidden>Tinted walls can be removed</div>
      <div class="meta"></div>
    </div>
    <button id="collapse" aria-expanded="true">Hide</button>
  </div>
  <div class="body">
    <div class="sec">
      <h2>Views</h2>
      <div class="chips" id="views"></div>
    </div>
    <div class="sec">
      <h2>Model</h2>
      <div class="opts">
        <label class="toggle"><input type="checkbox" id="showDoors" checked> Doors</label>
        <label class="toggle"><input type="checkbox" id="openDoors" checked> Open</label>
        <label class="toggle"><input type="checkbox" id="lowWalls"> Lower walls</label>
        <label class="toggle"><input type="checkbox" id="showLabels" checked> Labels</label>
      </div>
    </div>
    <div class="sec roomsec">
      <h2>Rooms · traced from plan</h2>
      <ul class="rooms" id="rooms"></ul>
    </div>
    <div class="foot"></div>
  </div>
</aside>
<div id="hint">Drag to orbit · scroll to zoom · right‑drag to pan</div>
<button id="gate" aria-label="Explore the 3D model"><span>Click to explore in 3D</span></button>
<button id="fsBtn" aria-label="Full screen" title="Full screen">
  <svg class="enter" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
  <svg class="exit" viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>
</button>
`);

document.querySelector('.eyebrow').textContent = place ? `${U.project} · ${place}` : U.project;
document.querySelector('#panel h1').textContent = `${U.name} unit`;
document.querySelector('#panel .meta').textContent =
  `${countLabel(U.beds, 'bedroom', 'bedrooms')} · ${countLabel(U.baths, 'bathroom', 'bathrooms')} · ${U.sqft} sqft built-up. Furnished with Ayanna-style pieces.`;

const foot = document.querySelector('#panel .foot');
const hasHackable = (U.walls || []).some((w) => w && w.hackable);
foot.append(
  'Walls traced from the floor plan. Ceiling is 2.5 m; lower walls drops the cut to 1.05 m. ',
);
if (hasHackable) foot.append('Tinted walls can be removed. ');
foot.append('Doors follow the drawn swings. Source: ');
if (U.sourceUrl) {
  const a = document.createElement('a');
  a.href = U.sourceUrl;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = 'brochure';
  foot.append(a, '.');
} else {
  foot.append('the sales brochure.');
}

window.addEventListener('message', (ev) => {
  if (ev.origin !== location.origin) return;
  const data = ev.data;
  if (!data || data.type !== 'apartments-theme') return;
  const root = document.documentElement;
  if (data.theme === 'light' || data.theme === 'dark') root.dataset.theme = data.theme;
});

await import('./viewer.js');
