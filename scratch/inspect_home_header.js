const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const match = home.match(/<header class="hdr[\s\S]*?<\/header>/);
if (match) console.log(match[0]);

