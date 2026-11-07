const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

// Look for EMBED or 'enter' or message
const msgMatches = [...app.matchAll(/(.{0,80}(?:EMBED|wall|enter|message).{0,80})/gi)];
msgMatches.slice(0, 15).forEach(m => console.log(m[0].replace(/\s+/g, ' ')));

