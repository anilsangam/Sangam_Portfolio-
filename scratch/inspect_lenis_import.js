const fs = require('fs');

const orig = fs.readFileSync('portfolio/home.html', 'utf8');
const scripts = [...orig.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];

scripts.forEach((s, i) => {
  if (s[2].includes("import('lenis')")) {
    console.log(`Script ${i+1} has import('lenis')! Tag: <script ${s[1]}>`);
    const idx = s[2].indexOf("import('lenis')");
    console.log('Snippet around import:\n', s[2].slice(idx - 200, idx + 200));
  }
});

