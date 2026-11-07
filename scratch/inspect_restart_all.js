const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

const matches = [...app.matchAll(/(.{0,80}(?:__restartAll|__pickVideo|checkHidden).{0,80})/gi)];
matches.forEach(m => console.log(m[0].replace(/\s+/g, ' ')));

