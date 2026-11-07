const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const { DEFAULT_PROJECTS, DEFAULT_PROFILE } = require('../scripts/seed');

const viewsDir = path.join(__dirname, '../views');

// Test App Developer
const appTmpl = fs.readFileSync(path.join(viewsDir, 'pages/app_developer.ejs'), 'utf8');
const appProjects = DEFAULT_PROJECTS.filter(p => p.category === 'app');
const appHtml = ejs.render(appTmpl, {
  pageTitle: 'App Dev Test',
  profile: DEFAULT_PROFILE,
  settings: {},
  projects: appProjects,
  currentRoute: 'app-developer',
  isRoom: true
}, { filename: path.join(viewsDir, 'pages/app_developer.ejs') });

console.log('=== APP DEV SSR VERIFICATION ===');
console.log('Rendered length:', appHtml.length);
appProjects.forEach(p => {
  console.log(`Contains "${p.title}":`, appHtml.includes(p.title));
});
console.log('Does NOT contain old hardcoded "Expense Tracker":', !appHtml.includes('Expense Tracker'));

// Test Web Developer
const webTmpl = fs.readFileSync(path.join(viewsDir, 'pages/web_developer.ejs'), 'utf8');
const webProjects = DEFAULT_PROJECTS.filter(p => p.category === 'web');
const webHtml = ejs.render(webTmpl, {
  pageTitle: 'Web Dev Test',
  profile: DEFAULT_PROFILE,
  settings: {},
  projects: webProjects,
  currentRoute: 'web-developer',
  isRoom: true
}, { filename: path.join(viewsDir, 'pages/web_developer.ejs') });

console.log('\n=== WEB DEV SSR VERIFICATION ===');
console.log('Rendered length:', webHtml.length);
webProjects.forEach(p => {
  console.log(`Contains "${p.title}":`, webHtml.includes(p.title));
});
console.log('Does NOT contain old hardcoded "Sundown Studio":', !webHtml.includes('Sundown Studio'));

