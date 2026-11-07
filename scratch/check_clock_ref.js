const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scriptMatch = home.match(/<script\s+type="module">([\s\S]*?)<\/script>/i);
const code = scriptMatch[1];

const match = [...code.matchAll(/(.{0,80}clock.{0,80})/gi)];
match.forEach(m => console.log(m[0].replace(/\s+/g, ' ')));

