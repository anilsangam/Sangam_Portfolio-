const fs = require('fs');
const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const matches = [...home.matchAll(/profile\.headline/g)];
console.log('Matches for profile.headline in views/home/index.ejs:', matches.length);

const h1Match = home.match(/<h1[\s\S]*?<\/h1>/i);
console.log('h1 in home/index.ejs:\n', h1Match ? h1Match[0] : 'None');

