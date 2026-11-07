const fs = require('fs');

const web = fs.readFileSync('views/pages/web_developer.ejs', 'utf8');
const stackMatch = web.match(/<section class="stack" id="stack"[\s\S]*?<\/section>/);
if (stackMatch) {
  const cards = [...stackMatch[0].matchAll(/<article class="card"[\s\S]*?<\/article>/gi)];
  console.log('Cards in web_developer.ejs stack:', cards.length);
  if (cards[0]) {
    console.log('--- Card 1: ---\n', cards[0][0]);
  }
}

