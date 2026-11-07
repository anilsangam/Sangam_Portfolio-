const fs = require('fs');
const c = fs.readFileSync('portfolio/app_dev.html', 'utf8');
const idx = c.indexOf('class="top"');
if (idx !== -1) console.log(c.substring(idx - 20, idx + 300));

