const fs = require('fs');
const content = fs.readFileSync('portfolio/home.html', 'utf8');

const navmIdx = content.indexOf('.navm {');
console.log(content.substring(navmIdx + 3000, navmIdx + 4500));
