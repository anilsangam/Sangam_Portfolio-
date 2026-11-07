const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const idx = home.indexOf('const step = now => {');
console.log(home.slice(idx, idx + 2500));

