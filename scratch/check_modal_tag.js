const fs = require('fs');
const home = fs.readFileSync('portfolio/home.html', 'utf8');
const idx = home.indexOf('RequestModal');
if (idx !== -1) {
  console.log(home.slice(idx - 50, idx + 800));
}

