const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const scriptMatch = home.match(/<script\s+type="module">([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
  console.log('No script type="module" found!');
  process.exit(1);
}

const code = scriptMatch[1];
console.log('Script module length:', code.length);

try {
  new Function('async () => {\n' + code + '\n}');
  console.log('Code compiles cleanly inside async wrapper!');
} catch (e) {
  console.error('Compile error:', e);
}
