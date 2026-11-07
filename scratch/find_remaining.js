const fs = require('fs');
const content = fs.readFileSync('views/home/index.ejs', 'utf8');

console.log('--- Ability match:');
[...content.matchAll(/(.{0,60}ability.{0,60})/gi)].forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

console.log('--- Clock match:');
[...content.matchAll(/(.{0,60}clock.{0,60})/gi)].forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

console.log('--- UI/UX matches:');
[...content.matchAll(/(.{0,60}UI\/UX.{0,60})/gi)].forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

console.log('--- Graphic Design matches:');
[...content.matchAll(/(.{0,60}Graphic Design.{0,60})/gi)].forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

