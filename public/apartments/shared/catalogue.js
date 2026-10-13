/**
 * Apartments home. Filters and cards come from public/apartments/condos.json.
 * A card opens one lazy 16:9 embed in place. The hash is the shareable link.
 */
const listUrl = new URL('../condos.json', import.meta.url);

function countLabel(n, singular, plural) {
  if (typeof n === 'string' && n.includes('+')) return `${n} ${singular}`;
  const v = Number(n);
  return `${n} ${v === 1 ? singular : plural}`;
}

function specKey(value) {
  const text = String(value);
  const n = parseFloat(text);
  if (!Number.isFinite(n)) return 999;
  return n + (text.includes('+') ? 0.5 : 0);
}

function themeOf() {
  return window.apartmentsTheme?.effective() || 'light';
}

function embedSrc(condo, unit) {
  const theme = encodeURIComponent(themeOf());
  return `${condo.slug}/${unit.page}?embed=1&theme=${theme}`;
}

function unitKey(condo, unit) {
  return `${condo.slug}/${unit.id}`;
}

function parseHash() {
  const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
  const slash = raw.indexOf('/');
  if (slash <= 0) return null;
  return { slug: raw.slice(0, slash), id: raw.slice(slash + 1) };
}

const data = await fetch(listUrl).then((r) => {
  if (!r.ok) throw new Error(`condos.json ${r.status}`);
  return r.json();
});
const condos = data.condos || [];
const flat = [];
for (const condo of condos) {
  for (const unit of condo.units || []) flat.push({ condo, unit });
}

const sqfts = flat.map(({ unit }) => Number(unit.sqft)).filter((n) => Number.isFinite(n));
const sizeFloor = sqfts.length ? Math.min(...sqfts) : 0;
const sizeCeil = sqfts.length ? Math.max(...sqfts) : 0;

function uniqueSpecs(key) {
  const values = [];
  for (const { unit } of flat) {
    if (unit[key] == null) continue;
    const text = String(unit[key]);
    if (!values.includes(text)) values.push(text);
  }
  return values.sort((a, b) => specKey(a) - specKey(b));
}

const header = document.createElement('header');
header.className = 'bar';
const titles = document.createElement('div');
const h1 = document.createElement('h1');
h1.textContent = 'Apartment Models';
const lead = document.createElement('p');
lead.textContent = 'Filter the catalogue, then open a unit to explore the model on this page';
titles.append(h1, lead);
header.append(titles);
window.apartmentsTheme?.mount(header);

const main = document.createElement('main');
const intro = document.createElement('div');
intro.className = 'intro';
const introH = document.createElement('h2');
introH.textContent = 'About this catalogue';
const introP1 = document.createElement('p');
introP1.textContent = 'These interactive 3D apartment models are built from real floor plans of Malaysian condominiums. Each model keeps the unit’s layout and proportions from the developer’s published plan.';
const introP2 = document.createElement('p');
introP2.append('Furniture and materials follow the ');
const ayanna = document.createElement('a');
ayanna.href = '../ayanna/index.html';
ayanna.textContent = 'Ayanna E2';
introP2.append(ayanna, ' model. Opening a card stays on this page. ');
const fullHint = document.createElement('span');
fullHint.textContent = 'Open full page';
introP2.append('Use ', fullHint, ' when you want the model on its own.');
intro.append(introH, introP1, introP2);
main.append(intro);

const filters = document.createElement('form');
filters.className = 'filters';
filters.setAttribute('role', 'search');
filters.addEventListener('submit', (ev) => ev.preventDefault());

function field(className) {
  const label = document.createElement('label');
  label.className = className;
  return label;
}
function addCaption(label, text) {
  const span = document.createElement('span');
  span.textContent = text;
  label.append(span);
  return span;
}

const searchLabel = field('search-field');
addCaption(searchLabel, 'Search');
const search = document.createElement('input');
search.id = 'q';
search.type = 'search';
search.placeholder = 'Name, condo, tower, size';
search.autocomplete = 'off';
searchLabel.append(search);

const devLabel = field('');
addCaption(devLabel, 'Development');
const development = document.createElement('select');
development.id = 'development';
const devAny = document.createElement('option');
devAny.value = '';
devAny.textContent = 'All';
development.append(devAny);
for (const condo of condos) {
  const option = document.createElement('option');
  option.value = condo.slug;
  const count = condo.units?.length || 0;
  option.textContent = `${condo.name} (${count})`;
  development.append(option);
}
devLabel.append(development);

const bedLabel = field('');
addCaption(bedLabel, 'Bedrooms');
const bedrooms = document.createElement('select');
bedrooms.id = 'bedrooms';
const bathLabel = field('');
addCaption(bathLabel, 'Bathrooms');
const bathrooms = document.createElement('select');
bathrooms.id = 'bathrooms';
for (const [select, key] of [[bedrooms, 'beds'], [bathrooms, 'baths']]) {
  const any = document.createElement('option');
  any.value = '';
  any.textContent = 'Any';
  select.append(any);
  for (const value of uniqueSpecs(key)) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}
bedLabel.append(bedrooms);
bathLabel.append(bathrooms);

const groups = [];
for (const { unit } of flat) {
  if (unit.group && !groups.includes(unit.group)) groups.push(unit.group);
}
const towerLabel = field('');
addCaption(towerLabel, 'Tower');
const tower = document.createElement('select');
tower.id = 'tower';
towerLabel.append(tower);
towerLabel.hidden = groups.length === 0;

const sizeLabel = field('size-field');
addCaption(sizeLabel, 'Size (sf)');
const sizeRow = document.createElement('div');
sizeRow.className = 'size-row';
const sizeMin = document.createElement('input');
sizeMin.id = 'sizeMin';
sizeMin.type = 'number';
sizeMin.inputMode = 'numeric';
sizeMin.min = String(sizeFloor);
sizeMin.max = String(sizeCeil);
sizeMin.step = '1';
sizeMin.value = String(sizeFloor);
sizeMin.setAttribute('aria-label', 'Minimum size in square feet');
const sizeDash = document.createElement('span');
sizeDash.textContent = '–';
sizeDash.setAttribute('aria-hidden', 'true');
const sizeMax = document.createElement('input');
sizeMax.id = 'sizeMax';
sizeMax.type = 'number';
sizeMax.inputMode = 'numeric';
sizeMax.min = String(sizeFloor);
sizeMax.max = String(sizeCeil);
sizeMax.step = '1';
sizeMax.value = String(sizeCeil);
sizeMax.setAttribute('aria-label', 'Maximum size in square feet');
sizeRow.append(sizeMin, sizeDash, sizeMax);
sizeLabel.append(sizeRow);

const resultCount = document.createElement('p');
resultCount.id = 'resultCount';
resultCount.className = 'result-count';
resultCount.setAttribute('aria-live', 'polite');

filters.append(searchLabel, devLabel, bedLabel, bathLabel, towerLabel, sizeLabel, resultCount);
main.append(filters);

const cards = new Map();
let seenGroup = null;
let currentCondo = null;
let grid = null;

function startSection(condo) {
  const section = document.createElement('section');
  section.className = 'project';
  section.dataset.condo = condo.slug;
  const h2 = document.createElement('h2');
  h2.textContent = condo.name;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.append([condo.location, condo.developer].filter(Boolean).join(' · '));
  if (condo.units?.length) {
    meta.append(' · ');
    const all = document.createElement('a');
    all.href = `${condo.slug}/index.html`;
    all.textContent = condo.units.length === 1 ? 'The unit' : `All ${condo.units.length} types`;
    meta.append(all);
  }
  if (condo.sourceUrl) {
    meta.append(' · ');
    const src = document.createElement('a');
    src.href = condo.sourceUrl;
    src.target = '_blank';
    src.rel = 'noopener';
    src.textContent = 'Source';
    meta.append(src);
  }
  grid = document.createElement('div');
  grid.className = 'units';
  section.append(h2, meta, grid);
  main.append(section);
  currentCondo = condo;
  seenGroup = null;
}

for (const { condo, unit } of flat) {
  if (condo !== currentCondo) startSection(condo);
  if (unit.group && unit.group !== seenGroup) {
    seenGroup = unit.group;
    const towerHead = document.createElement('h3');
    towerHead.className = 'tower';
    towerHead.textContent = unit.group;
    towerHead.dataset.group = unit.group;
    grid.append(towerHead);
  }
  const key = unitKey(condo, unit);
  const card = document.createElement('article');
  card.className = 'unit-card';
  card.id = key;
  card.dataset.condo = condo.slug;
  card.dataset.beds = String(unit.beds);
  card.dataset.baths = String(unit.baths);
  card.dataset.sqft = String(unit.sqft);
  card.dataset.group = unit.group || '';
  card.dataset.search = [
    condo.name, condo.location, condo.developer, condo.slug,
    unit.name, unit.id, unit.group, unit.beds, unit.baths, unit.sqft,
  ].filter((v) => v != null).join(' ').toLowerCase();

  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'card-open';
  open.setAttribute('aria-expanded', 'false');
  open.setAttribute('aria-controls', `live-${condo.slug}-${unit.id}`);
  const image = document.createElement('div');
  image.className = 'card-image';
  const img = document.createElement('img');
  img.src = `${condo.slug}/${unit.plan}`;
  img.alt = `${condo.name} ${unit.name} floor plan`;
  img.loading = 'lazy';
  const badge = document.createElement('div');
  badge.className = 'card-badge';
  badge.textContent = '3D Model';
  image.append(img, badge);
  const content = document.createElement('div');
  content.className = 'card-content';
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = unit.group ? `${unit.group} · ${unit.name}` : unit.name;
  const specs = document.createElement('div');
  specs.className = 'card-specs';
  for (const text of [
    countLabel(unit.beds, 'bedroom', 'bedrooms'),
    countLabel(unit.baths, 'bath', 'baths'),
    `${unit.sqft} sqft`,
  ]) {
    const span = document.createElement('span');
    span.textContent = text;
    specs.append(span);
  }
  const footer = document.createElement('div');
  footer.className = 'card-footer';
  footer.textContent = 'Open the 3D model here';
  content.append(title, specs, footer);
  open.append(image, content);
  open.addEventListener('click', () => openCard(key, false));
  card.append(open);
  grid.append(card);
  cards.set(key, { card, condo, unit, open });
}

const empty = document.createElement('p');
empty.id = 'empty';
empty.className = 'empty';
empty.hidden = true;
empty.textContent = 'No units match these filters.';
main.append(empty);

const footer = document.createElement('footer');
const fp = document.createElement('p');
fp.append('Part of ');
const home = document.createElement('a');
home.href = '../';
home.textContent = "Wei Hong's Portfolio";
fp.append(home, ' · Models built with three.js');
footer.append(fp);
document.body.replaceChildren(header, main, footer);

function groupsFor(slug) {
  const list = [];
  for (const { condo, unit } of flat) {
    if (slug && condo.slug !== slug) continue;
    if (unit.group && !list.includes(unit.group)) list.push(unit.group);
  }
  return list;
}

function fillTowers() {
  const available = groupsFor(development.value);
  const previous = tower.value;
  tower.replaceChildren();
  const any = document.createElement('option');
  any.value = '';
  any.textContent = available.length ? 'Any' : 'None';
  tower.append(any);
  for (const name of available) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    tower.append(option);
  }
  tower.disabled = available.length === 0;
  tower.value = available.includes(previous) ? previous : '';
  towerLabel.hidden = groups.length === 0;
}

function clampSize() {
  let min = Number(sizeMin.value);
  let max = Number(sizeMax.value);
  if (!Number.isFinite(min)) min = sizeFloor;
  if (!Number.isFinite(max)) max = sizeCeil;
  min = Math.min(sizeCeil, Math.max(sizeFloor, min));
  max = Math.min(sizeCeil, Math.max(sizeFloor, max));
  if (min > max) max = min;
  sizeMin.value = String(min);
  sizeMax.value = String(max);
}

let openKey = null;

function closeOpen(fromHash) {
  if (openKey) {
    const entry = cards.get(openKey);
    if (entry) {
      entry.card.classList.remove('open');
      entry.card.querySelector('.card-live')?.remove();
      entry.open.hidden = false;
      entry.open.setAttribute('aria-expanded', 'false');
    }
    openKey = null;
  }
  if (!fromHash && location.hash) {
    history.pushState(null, '', location.pathname + location.search);
  }
}

function paintEmbeds(theme) {
  document.querySelectorAll('.card-live iframe').forEach((frame) => {
    frame.contentWindow?.postMessage({ type: 'apartments-theme', theme }, location.origin);
  });
}

function openCard(key, fromHash) {
  const entry = cards.get(key);
  if (!entry || entry.card.hidden) return;
  if (openKey === key && entry.card.querySelector('iframe')) return;
  if (openKey && openKey !== key) closeOpen(true);
  openKey = key;
  entry.open.hidden = true;
  entry.open.setAttribute('aria-expanded', 'true');
  entry.card.classList.add('open');

  const live = document.createElement('div');
  live.className = 'card-live';
  live.id = `live-${entry.condo.slug}-${entry.unit.id}`;
  const tools = document.createElement('div');
  tools.className = 'embed-tools';
  const name = document.createElement('span');
  name.className = 'embed-name';
  name.textContent = entry.unit.group
    ? `${entry.condo.name} · ${entry.unit.group} · ${entry.unit.name}`
    : `${entry.condo.name} · ${entry.unit.name}`;
  const full = document.createElement('a');
  full.className = 'full-page';
  full.href = `${entry.condo.slug}/${entry.unit.page}`;
  full.textContent = 'Open full page';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'close-embed';
  close.textContent = 'Close';
  close.setAttribute('aria-label', `Close ${entry.unit.name}`);
  close.addEventListener('click', () => closeOpen(false));
  tools.append(name, full, close);
  const slot = document.createElement('div');
  slot.className = 'slot';
  const frame = document.createElement('iframe');
  frame.src = embedSrc(entry.condo, entry.unit);
  frame.title = `${entry.condo.name} ${entry.unit.name} 3D model`;
  frame.allow = 'fullscreen';
  slot.append(frame);
  live.append(tools, slot);
  entry.card.append(live);

  const top = filters.getBoundingClientRect().height + 12;
  entry.card.style.scrollMarginTop = `${top}px`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  entry.card.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  close.focus({ preventScroll: true });
  if (!fromHash && parseHashKey() !== key) location.hash = key;
}

function parseHashKey() {
  const parsed = parseHash();
  if (!parsed) return '';
  return `${parsed.slug}/${parsed.id}`;
}

function syncFromHash() {
  const key = parseHashKey();
  if (!key) {
    if (openKey) closeOpen(true);
    return;
  }
  if (key === openKey) return;
  openCard(key, true);
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  let min = Number(sizeMin.value);
  let max = Number(sizeMax.value);
  if (!Number.isFinite(min)) min = sizeFloor;
  if (!Number.isFinite(max)) max = sizeCeil;
  if (min > max) [min, max] = [max, min];
  let shown = 0;
  for (const { card } of cards.values()) {
    const sq = Number(card.dataset.sqft);
    const ok = (!q || card.dataset.search.includes(q))
      && (!development.value || card.dataset.condo === development.value)
      && (!bedrooms.value || card.dataset.beds === bedrooms.value)
      && (!bathrooms.value || card.dataset.baths === bathrooms.value)
      && (!tower.value || card.dataset.group === tower.value)
      && sq >= min && sq <= max;
    card.hidden = !ok;
    if (ok) shown += 1;
  }
  for (const section of main.querySelectorAll('.project')) {
    const visible = [...section.querySelectorAll('.unit-card')].some((card) => !card.hidden);
    section.hidden = !visible;
    for (const head of section.querySelectorAll('.tower')) {
      const group = head.dataset.group;
      const any = [...section.querySelectorAll('.unit-card')].some((card) => !card.hidden && card.dataset.group === group);
      head.hidden = !any;
    }
  }
  empty.hidden = shown !== 0;
  const noun = shown === 1 ? 'unit' : 'units';
  resultCount.textContent = `${shown} of ${flat.length} ${noun}`;
  if (openKey) {
    const entry = cards.get(openKey);
    if (!entry || entry.card.hidden) closeOpen(false);
  }
}

for (const el of [search, bedrooms, bathrooms, tower]) {
  el.addEventListener('input', applyFilters);
  el.addEventListener('change', applyFilters);
}
development.addEventListener('change', () => { fillTowers(); applyFilters(); });
for (const el of [sizeMin, sizeMax]) {
  el.addEventListener('input', applyFilters);
  el.addEventListener('change', () => { clampSize(); applyFilters(); });
}

window.addEventListener('hashchange', syncFromHash);
window.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape') return;
  if (document.activeElement === search && search.value) {
    search.value = '';
    applyFilters();
    return;
  }
  if (openKey) closeOpen(false);
});
window.addEventListener('message', (ev) => {
  if (ev.origin !== location.origin) return;
  if (ev.data?.type === 'apartments-close' && openKey) closeOpen(false);
});
window.addEventListener('apartments-theme', (ev) => paintEmbeds(ev.detail || themeOf()));

fillTowers();
applyFilters();
syncFromHash();
