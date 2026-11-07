const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

console.log('Includes in views/home/index.ejs:');
const incs = [...home.matchAll(/<%-[\s\S]*?%>/g)].map(m => m[0]);
console.log(incs);

console.log('Does home contain #modal?:', home.includes('id="modal"'));

