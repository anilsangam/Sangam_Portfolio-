const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../views/home/index.ejs');
let content = fs.readFileSync(filePath, 'utf8');

const doorsScriptReplacement = fs.readFileSync(path.join(__dirname, 'doors_replacement.txt'), 'utf8');

const oldDoorsStart = content.indexOf('/* ---------- Doors: hover cracks a door open;');
const lenisMarker = content.indexOf('/* ---------- Lenis smooth scroll ---------- */');

if (oldDoorsStart !== -1 && lenisMarker !== -1) {
  content = content.slice(0, oldDoorsStart) + doorsScriptReplacement + "\n\n        " + content.slice(lenisMarker);
  console.log('Replaced doors and PageLoader scripts with clean instant startup');
} else {
  console.warn('Could not find markers:', { oldDoorsStart: oldDoorsStart !== -1, lenisMarker: lenisMarker !== -1 });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('views/home/index.ejs successfully updated');
