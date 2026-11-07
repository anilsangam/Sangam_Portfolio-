const fs = require('fs');

const files = ['views/pages/web_developer.ejs', 'views/pages/app_developer.ejs'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}...`);
  // replace ../fonts with /fonts
  content = content.replace(/\.\.\/fonts\//g, '/fonts/');
  // replace ./vendor with /vendor
  content = content.replace(/\.\/vendor\//g, '/vendor/');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done checking and fixing asset paths in subpages.');

