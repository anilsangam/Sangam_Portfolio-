const fs = require('fs');
const path = require('path');

const ejsPath = path.join(__dirname, '..', 'views', 'home', 'index.ejs');
const html = fs.readFileSync(ejsPath, 'utf8');

// Combine with partials
const partialsDir = path.join(__dirname, '..', 'views', 'partials');
let allHtml = html;
fs.readdirSync(partialsDir).forEach(f => {
  if (f.endsWith('.ejs')) {
    allHtml += '\n' + fs.readFileSync(path.join(partialsDir, f), 'utf8');
  }
});

// Find all $('#something') or document.getElementById('something')
const idQueryRegex = /(?:\$\(['"]#([a-zA-Z0-9_-]+)['"]\)|getElementById\(['"]([a-zA-Z0-9_-]+)['"]\))/g;
let m;
const missing = new Set();
const found = new Set();

while ((m = idQueryRegex.exec(html)) !== null) {
  const id = m[1] || m[2];
  const hasIdInDom = new RegExp(`id=["']${id}["']`).test(allHtml);
  if (!hasIdInDom) {
    missing.add(id);
  } else {
    found.add(id);
  }
}

console.log('Found IDs in DOM:', Array.from(found));
console.log('MISSING IDs queried in script:', Array.from(missing));

