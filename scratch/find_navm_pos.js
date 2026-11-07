const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

const navmIdx = home.indexOf('id="navm"');
console.log('Index of id="navm":', navmIdx);
if (navmIdx !== -1) {
  const endNavm = home.indexOf('</div>\n    </div>', navmIdx);
  console.log('Snippet after navm:\n', home.slice(endNavm, endNavm + 300));
}

