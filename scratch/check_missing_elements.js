const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { DEFAULT_PROFILE } = require('../scripts/seed');

const viewsDir = path.join(__dirname, '../views');
const homeTemplate = fs.readFileSync(path.join(viewsDir, 'home/index.ejs'), 'utf8');

const rendered = ejs.render(homeTemplate, {
  pageTitle: 'Test',
  profile: DEFAULT_PROFILE,
  settings: {},
  experience: [],
  education: [],
  skills: [],
  currentRoute: 'home',
  isRoom: false
}, { filename: path.join(viewsDir, 'home/index.ejs') });

const scriptMatch = rendered.match(/<script\s+type="module">([\s\S]*?)<\/script>/i);
const code = scriptMatch[1];

// Find all $('#...')
const idSelectors = [...code.matchAll(/\$\(['"]#([\w-]+)['"]\)/g)].map(m => m[1]);
const allIds = [...new Set(idSelectors)];

console.log('Total IDs queried in script 3:', allIds.length);
let missing = 0;
allIds.forEach(id => {
  const exists = rendered.includes(`id="${id}"`) || rendered.includes(`id='${id}'`);
  if (!exists) {
    console.log(`⚠️ ID missing in rendered HTML: #${id}`);
    missing++;
  }
});

console.log(`Missing IDs count: ${missing}`);
