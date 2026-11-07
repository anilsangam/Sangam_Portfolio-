const fs = require('fs');

const appDev = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');
const scripts = [...appDev.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Script 1 length:', scripts[0][1].length);
console.log('Script 1 content:\n', scripts[0][1].slice(0, 3000));

