const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const idx = home.indexOf("$('#navList').innerHTML");
console.log(home.slice(idx - 400, idx + 500));

