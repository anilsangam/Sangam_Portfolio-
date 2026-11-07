const fs = require('fs');
const home = fs.readFileSync('portfolio/home.html', 'utf8');
const idx = home.indexOf('<!-- ============ RequestModal ============ -->');
const endIdx = home.indexOf('<!--', idx + 10);
console.log(home.slice(idx, endIdx !== -1 ? endIdx : idx + 3500));

