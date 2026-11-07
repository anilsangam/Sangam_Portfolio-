const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SETTINGS } = require('../scripts/seed_data_anil');

const templatePath = path.join(__dirname, '..', 'views', 'home', 'index.ejs');
const str = fs.readFileSync(templatePath, 'utf8');

const html = ejs.render(str, {
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  projects: DEFAULT_PROJECTS,
  experiences: [],
  educations: [],
  skills: [],
  currentRoute: 'home',
  scrollToSection: ''
}, { filename: templatePath });

const lines = html.split('\n');
console.log('--- FIRST 80 LINES OF RENDERED HTML ---');
console.log(lines.slice(0, 80).join('\n'));
console.log('---------------------------------------');

