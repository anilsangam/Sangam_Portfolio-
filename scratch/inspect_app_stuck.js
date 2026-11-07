const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

// Check script tags in app_developer.ejs
console.log('=== SCRIPT TAGS IN app_developer.ejs ===');
const scripts = [...app.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
scripts.forEach((s, i) => {
  console.log(`\n--- Script ${i+1} (${s[1].length} chars) ---`);
  console.log(s[1].slice(0, 300).replace(/\s+/g, ' '));
});

// Check CSS in public/css/room.css for pointer-events or locks
const roomCss = fs.readFileSync('public/css/room.css', 'utf8');
const lockMatches = [...roomCss.matchAll(/([^{}]*(?:pointer-events|overflow|rn-lock|veil|out\b|hidden)[^{]*\{[^}]*\})/gi)].map(m => m[0].replace(/\s+/g, ' '));
console.log('\n=== CSS LOCK RULES in room.css ===');
lockMatches.slice(0, 10).forEach(m => console.log('  ' + m));

