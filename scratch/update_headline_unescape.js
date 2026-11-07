const fs = require('fs');

let home = fs.readFileSync('views/home/index.ejs', 'utf8');
home = home.replace(
  '<span class="sr-only"><%= (profile && profile.headline)',
  '<span class="sr-only"><%- (profile && profile.headline)'
);
fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('Updated sr-only to unescaped EJS tag.');

