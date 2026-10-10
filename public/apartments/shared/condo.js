/**
 * Shared condo page. The stub is identical for every project; this module
 * reads the slug from the URL and renders public/apartments/condos.json.
 */
const listUrl = new URL('../condos.json', import.meta.url);

function condoSlug() {
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts[parts.length - 1] === 'index.html') parts.pop();
  return decodeURIComponent(parts[parts.length - 1] || '');
}

function countLabel(n, singular, plural) {
  if (typeof n === 'string' && n.includes('+')) return `${n} ${singular}`;
  const v = Number(n);
  return `${n} ${v === 1 ? singular : plural}`;
}

function themeOf() {
  return window.apartmentsTheme?.effective() || 'light';
}

function withTheme(base) {
  const url = new URL(base, location.href);
  url.searchParams.set('theme', themeOf());
  url.searchParams.set('embed', '1');
  return `${url.pathname.split('/').pop()}?${url.searchParams.toString()}`;
}

function paintEmbeds(theme) {
  document.querySelectorAll('iframe').forEach((frame) => {
    frame.contentWindow?.postMessage({ type: 'apartments-theme', theme }, location.origin);
  });
}

const slug = condoSlug();
const data = await fetch(listUrl).then((r) => {
  if (!r.ok) throw new Error(`condos.json ${r.status}`);
  return r.json();
});
const condo = (data.condos || []).find((c) => c.slug === slug);
const root = document.body;
if (!condo) {
  document.title = 'Apartment';
  const header = document.createElement('header');
  header.className = 'bar';
  const back = document.createElement('a');
  back.href = '../index.html';
  back.textContent = 'Apartment Models';
  header.append(back);
  const main = document.createElement('main');
  const h1 = document.createElement('h1');
  h1.textContent = 'Unknown condo';
  const p = document.createElement('p');
  p.textContent = `No entry for “${slug}” in the shared condo list.`;
  main.append(h1, p);
  root.replaceChildren(header, main);
} else {
  document.title = `${condo.name} — Apartment Models`;
  const header = document.createElement('header');
  header.className = 'bar';
  const back = document.createElement('a');
  back.href = '../index.html';
  back.textContent = 'Apartment Models';
  header.append(back);
  window.apartmentsTheme?.mount(header);

  const main = document.createElement('main');
  const h1 = document.createElement('h1');
  h1.textContent = condo.name;
  const intro = document.createElement('p');
  intro.textContent = condo.intro || '';
  main.append(h1, intro);

  for (const unit of condo.units || []) {
    const h2 = document.createElement('h2');
    const link = document.createElement('a');
    link.href = unit.page;
    link.textContent = unit.name;
    h2.append(
      link,
      ` · ${countLabel(unit.beds, 'bedroom', 'bedrooms')} · ${countLabel(unit.baths, 'bath', 'baths')} · ${unit.sqft} sqft`,
    );
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.base = `${unit.page}?embed=1`;
    slot.dataset.title = `${unit.name}, ${unit.sqft} square feet`;
    const img = document.createElement('img');
    img.src = unit.plan;
    img.alt = `${unit.name} floor plan`;
    slot.append(img);
    main.append(h2, slot);
  }
  root.replaceChildren(header, main);
}

const ratios = new Map();
let active = null;
function activate(slot) {
  if (!slot || slot === active) return;
  if (active) {
    active.querySelector('iframe')?.remove();
    active.classList.remove('live');
  }
  active = slot;
  slot.classList.add('live');
  const frame = document.createElement('iframe');
  frame.src = withTheme(slot.dataset.base);
  frame.title = slot.dataset.title || '';
  frame.allow = 'fullscreen';
  slot.append(frame);
}
const slots = [...document.querySelectorAll('.slot')];
if (slots[0]) activate(slots[0]);
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
  let best = null;
  let bestRatio = 0;
  for (const slot of slots) {
    const ratio = ratios.get(slot) || 0;
    if (ratio > bestRatio) { best = slot; bestRatio = ratio; }
  }
  if (best) activate(best);
}, { threshold: [0, 0.25, 0.5, 0.75, 1] });
for (const slot of slots) io.observe(slot);

window.addEventListener('apartments-theme', (ev) => paintEmbeds(ev.detail || themeOf()));
