const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const matches = [...home.matchAll(/(.{0,80}navList.{0,80})/gi)];
matches.forEach(m => console.log(m[0].replace(/\s+/g, ' ')));

