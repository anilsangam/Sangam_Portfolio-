const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const navmIdx = home.indexOf('id="navm"');
console.log(home.slice(navmIdx + 700, navmIdx + 1300));

