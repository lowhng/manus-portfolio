/**
 * Catalogue rendered from public/apartments/condos.json.
 */
const listUrl = new URL('../condos.json', import.meta.url);

function countLabel(n, singular, plural) {
  if (typeof n === 'string' && n.includes('+')) return `${n} ${singular}`;
  const v = Number(n);
  return `${n} ${v === 1 ? singular : plural}`;
}

const data = await fetch(listUrl).then((r) => {
  if (!r.ok) throw new Error(`condos.json ${r.status}`);
  return r.json();
});

const header = document.createElement('header');
header.className = 'bar';
const titles = document.createElement('div');
const h1 = document.createElement('h1');
h1.textContent = 'Apartment Models';
const lead = document.createElement('p');
lead.textContent = 'Interactive 3D models built from real unit floor plans';
titles.append(h1, lead);
header.append(titles);
window.apartmentsTheme?.mount(header);

const main = document.createElement('main');
const intro = document.createElement('div');
intro.className = 'intro';
intro.innerHTML = `
  <h2>About this catalogue</h2>
  <p>These interactive 3D apartment models are built from real floor plans of Malaysian condominiums, transformed into explorable 3D spaces. Each model preserves the unit's layout and proportions based on the developer's published specifications.</p>
  <p>The models use the same visual style and furniture assets as the <a href="../ayanna/index.html">Ayanna E2</a> model (beds, sofas, kitchen run, bathroom fittings), placed and scaled to match each plan. Room dimensions are traced from the developer floor plans.</p>
`;
main.append(intro);

for (const condo of data.condos || []) {
  const section = document.createElement('section');
  section.className = 'project';
  const h2 = document.createElement('h2');
  h2.textContent = condo.name;
  const meta = document.createElement('div');
  meta.className = 'meta';
  const bits = [condo.location, condo.developer].filter(Boolean);
  meta.append(bits.join(' · '));
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
  const grid = document.createElement('div');
  grid.className = 'units';
  for (const unit of condo.units || []) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = `${condo.slug}/${unit.page}`;
    const image = document.createElement('div');
    image.className = 'card-image';
    const img = document.createElement('img');
    img.src = `${condo.slug}/${unit.plan}`;
    img.alt = `${unit.name} floor plan`;
    img.loading = 'lazy';
    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = '3D Model';
    image.append(img, badge);
    const content = document.createElement('div');
    content.className = 'card-content';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = unit.name;
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
    footer.textContent = 'Click to explore the interactive 3D model';
    content.append(title, specs, footer);
    card.append(image, content);
    grid.append(card);
  }
  section.append(h2, meta, grid);
  main.append(section);
}

const footer = document.createElement('footer');
const fp = document.createElement('p');
fp.append('Part of ');
const home = document.createElement('a');
home.href = '../';
home.textContent = "Wei Hong's Portfolio";
fp.append(home, ' · Models built with three.js');
footer.append(fp);

document.body.replaceChildren(header, main, footer);
