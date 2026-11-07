const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scriptMatch = home.match(/<script\s+type="module">([\s\S]*?)<\/script>/i);
const code = scriptMatch[1];

console.log('Occurrences of holo in script 3:', (code.match(/holo/gi) || []).length);
console.log('Occurrences of clock in script 3:', (code.match(/clock/gi) || []).length);

