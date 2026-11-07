const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');
const idx = app.indexOf("if (m.wall === 'enter')");
if (idx !== -1) {
  console.log(app.slice(idx - 200, idx + 800));
}

