const fs = require('fs');
let home = fs.readFileSync('views/home/index.ejs', 'utf8');
home = home.replace('"./vendor/lenis.min.mjs"', '"/vendor/lenis.min.mjs"');
fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('Fixed importmap in index.ejs');

