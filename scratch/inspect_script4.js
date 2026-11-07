const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');
const scripts = [...app.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Script 2 (formerly 4) in app_developer.ejs:\n', scripts[1][1]);

