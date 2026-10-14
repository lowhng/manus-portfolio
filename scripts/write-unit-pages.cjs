#!/usr/bin/env node
/** Write the thin condo and unit HTML stubs from public/apartments/condos.json. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public', 'apartments');
const list = JSON.parse(fs.readFileSync(path.join(root, 'condos.json'), 'utf8'));

const condoStub = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Apartment</title>
<link rel="stylesheet" href="../shared/condo.css">
<script src="../shared/theme-boot.js"></script>
</head>
<body>
<script type="module" src="../shared/condo.js"></script>
</body>
</html>
`;

function unitStub(id) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Apartment</title>
<link rel="stylesheet" href="../shared/unit.css">
<script src="../shared/theme-boot.js"></script>
</head>
<body>
<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"
}}
</script>
<script src="./data/${id}.js"></script>
<script type="module" src="../shared/unit-page.js"></script>
</body>
</html>
`;
}

const catalogue = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Apartment Models</title>
<link rel="stylesheet" href="shared/catalogue.css">
<script src="shared/theme-boot.js"></script>
</head>
<body>
<script type="module" src="shared/catalogue.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'index.html'), catalogue);
console.log('wrote index.html');

for (const condo of list.condos) {
  const dir = path.join(root, condo.slug);
  fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), condoStub);
  console.log('wrote', condo.slug + '/index.html');
  for (const unit of condo.units) {
    fs.writeFileSync(path.join(dir, unit.page), unitStub(unit.id));
    console.log('wrote', condo.slug + '/' + unit.page);
  }
}
