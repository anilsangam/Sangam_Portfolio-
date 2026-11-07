const fs = require('fs');
const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const match = home.match(/<script type="importmap"[\s\S]*?<\/script>/i);
if (match) console.log(match[0]);

