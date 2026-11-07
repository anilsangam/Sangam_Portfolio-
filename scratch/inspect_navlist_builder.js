const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const navListMatch = home.match(/const MENU_ITEMS = \[[\s\S]*?\];/);
if (navListMatch) {
  console.log('MENU_ITEMS:\n', navListMatch[0]);
  const idx = home.indexOf(navListMatch[0]);
  console.log(home.slice(idx, idx + 800));
}

