const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const idx = home.indexOf("$('#navList').addEventListener");
console.log(home.slice(idx, idx + 400));

