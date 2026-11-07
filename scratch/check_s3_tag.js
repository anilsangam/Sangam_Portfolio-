const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scripts = [...home.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

scripts.forEach((s, i) => {
  if (s[2].includes("import('lenis')")) {
    console.log(`Script ${i+1} has import('lenis')! Tag: <script ${s[1]}>`);
  }
});

