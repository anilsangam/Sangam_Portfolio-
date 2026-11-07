const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const html = ejs.render(fs.readFileSync('views/home/index.ejs', 'utf8'), {
  profile: { fullName: 'Anil Sangam', headline: 'dev', subheadline: 'dev' },
  skills: [], experiences: [], projects: [], currentRoute: 'home',
  pageTitle: 'Anil', settings: {}, isRoom: false,
  filename: path.join(__dirname, '../views/home/index.ejs')
});
console.log('hdr matches:');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('hdr')) console.log(`${idx + 1}: ${l.trim()}`);
});

