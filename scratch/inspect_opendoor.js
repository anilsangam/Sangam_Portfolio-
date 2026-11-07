const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const idx = home.indexOf('window.openDoor = i => {');
console.log(home.slice(idx, idx + 3500));
