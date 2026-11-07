const fs = require('fs');

const web = fs.readFileSync('views/pages/web_developer.ejs', 'utf8');
const scripts = [...web.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

// Find script containing HOME
const s = scripts.find(sc => sc[1].includes('HOME'));
if (s) {
  console.log(s[1]);
}

