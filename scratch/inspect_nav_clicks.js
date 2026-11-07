const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const web = fs.readFileSync('views/pages/web_developer.ejs', 'utf8');

console.log('=== NAV CLICKS IN HOME ===');
const homeNavMatches = [...home.matchAll(/(.{0,80}(?:data-door|closeNav|openDoor).{0,80})/gi)];
homeNavMatches.slice(0, 10).forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

console.log('\n=== NAV CLICKS IN WEB DEV ===');
const webNavMatches = [...web.matchAll(/(.{0,80}(?:data-nav|SLUGS|HOME).{0,80})/gi)];
webNavMatches.slice(0, 15).forEach(m => console.log('  ' + m[0].replace(/\s+/g, ' ')));

