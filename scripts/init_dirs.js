const fs = require('fs');
const path = require('path');

const dirs = [
  'config',
  'controllers',
  'middleware',
  'models',
  'routes',
  'services',
  'views/layouts',
  'views/partials',
  'views/home',
  'views/pages',
  'views/admin',
  'public/css',
  'public/js',
  'public/images',
  'public/fonts',
  'public/vendor',
  'utils',
  'scripts',
  'uploads'
];

for (const d of dirs) {
  const full = path.join('c:/my projects/portfolio', d);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
}
console.log('All directories ensured.');

