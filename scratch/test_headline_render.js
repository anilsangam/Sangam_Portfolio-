const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const { DEFAULT_PROFILE } = require('../scripts/seed');

const viewsDir = path.join(__dirname, '../views');
const homeTemplate = fs.readFileSync(path.join(viewsDir, 'home/index.ejs'), 'utf8');

const html = ejs.render(homeTemplate, {
  pageTitle: 'Test',
  profile: DEFAULT_PROFILE,
  settings: {},
  experience: [],
  education: [],
  skills: [],
  currentRoute: 'home',
  isRoom: false
}, { filename: path.join(viewsDir, 'home/index.ejs') });

const match = html.match(/<span class="sr-only">[\s\S]*?<\/span>/);
console.log('sr-only in rendered HTML:\n', match ? match[0] : 'None');
console.log('DEFAULT_PROFILE.headline:\n', DEFAULT_PROFILE.headline);
console.log('Does it match?:', match[0].includes(DEFAULT_PROFILE.headline));

