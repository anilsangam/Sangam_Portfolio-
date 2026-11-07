const fs = require('fs');
const content = fs.readFileSync('portfolio/home.html', 'utf8');
const idx = 451752;
console.log(content.substring(idx - 1500, idx + 500));
