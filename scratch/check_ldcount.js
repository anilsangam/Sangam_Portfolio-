const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');

console.log('ldCount occurrences:', (home.match(/ldCount/g) || []).length);
console.log('loader occurrences:', (home.match(/id=["']loader["']/g) || []).length);

const loaderHtml = home.match(/<div class="loader" id="loader"[\s\S]*?<\/div>\s*<\/div>/);
if (loaderHtml) {
  console.log('=== Loader HTML in views/home/index.ejs ===');
  console.log(loaderHtml[0]);
}

