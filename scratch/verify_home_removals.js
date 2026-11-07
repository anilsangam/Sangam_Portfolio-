const fs = require('fs');

const content = fs.readFileSync('views/home/index.ejs', 'utf8');

console.log('holo occurrences:', (content.match(/holo/gi) || []).length);
console.log('holoOpen occurrences:', (content.match(/holoOpen/gi) || []).length);
console.log('ability occurrences:', (content.match(/ability/gi) || []).length);
console.log('clock widget occurrences:', (content.match(/class=["'][^"']*clock[^"']*["']/gi) || []).length);
console.log('UI/UX occurrences:', (content.match(/UI\/UX/gi) || []).length);
console.log('Graphic Design occurrences:', (content.match(/Graphic Design/gi) || []).length);

