const fs = require('fs');

const appDev = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

// Check projects in appDev
console.log('=== APP DEV PROJECTS CHECK ===');
const articles = [...appDev.matchAll(/<article[\s\S]*?<\/article>/gi)];
console.log('Number of <article> in app_developer.ejs HTML:', articles.length);
articles.forEach((a, i) => console.log(`Card ${i+1}:\n`, a[0].slice(0, 300)));

// Check how projects are rendered or if there is JS rendering
const scripts = [...appDev.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
scripts.forEach((s, i) => {
  if (s[1].includes('PROJECTS') || s[1].includes('stack') || s[1].includes('render')) {
    console.log(`\nScript ${i+1} mentions PROJECTS/stack:`, s[1].slice(0, 500).replace(/\s+/g, ' '));
  }
});

