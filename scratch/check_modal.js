const fs = require('fs');
const home = fs.readFileSync('portfolio/home.html', 'utf8');
const match = home.match(/<!-- ============ RequestModal ============ -->[\s\S]*?<\/dialog>/i);
if (match) console.log(match[0]);

