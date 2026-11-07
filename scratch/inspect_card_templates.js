const fs = require('fs');

const web = fs.readFileSync('portfolio/web_devloper.html', 'utf8');
const app = fs.readFileSync('portfolio/app_dev.html', 'utf8');

const webCards = [...web.matchAll(/<article class="card"[\s\S]*?<\/article>/gi)].map(m => m[0]);
console.log('Web cards count:', webCards.length);
if (webCards[0]) console.log('Sample Web card 1:\n', webCards[0].slice(0, 800));

const appCards = [...app.matchAll(/<article class="card"[\s\S]*?<\/article>/gi)].map(m => m[0]);
console.log('\nApp cards count:', appCards.length);
if (appCards[0]) console.log('Sample App card 1:\n', appCards[0].slice(0, 800));

