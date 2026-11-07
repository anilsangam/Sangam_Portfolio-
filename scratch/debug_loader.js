const fs = require('fs');

const home = fs.readFileSync('portfolio/home.html', 'utf8');

// Find PageLoader or 000
const matchLoader = home.match(/\/\* ---------- PageLoader[\s\S]*?(?=\/\* ---------- Clean routes)/);
if (matchLoader) {
  console.log('=== PageLoader JS ===');
  console.log(matchLoader[0]);
}

// Find HTML for loader
const htmlLoader = home.match(/<div class="loader"[\s\S]*?<\/div>\s*<\/div>/);
if (htmlLoader) {
  console.log('=== Loader HTML ===');
  console.log(htmlLoader[0]);
}

