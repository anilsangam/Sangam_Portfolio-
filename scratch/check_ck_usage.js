const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scriptMatch = home.match(/<script\s+type="module">([\s\S]*?)<\/script>/i);
const code = scriptMatch[1];

const idx = code.indexOf('.hdr .clock');
console.log(code.slice(idx - 100, idx + 400));

