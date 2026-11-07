const fs = require('fs');
const home = fs.readFileSync('portfolio/home.html', 'utf8');
const match = home.match(/<footer[^>]*id=["']contact-footer["'][\s\S]*?<\/footer>/i);
if (match) console.log(match[0].slice(0, 1500));

