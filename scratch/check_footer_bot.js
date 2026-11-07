const fs = require('fs');
const home = fs.readFileSync('portfolio/home.html', 'utf8');
const match = home.match(/<footer[^>]*id=["']contact-footer["'][\s\S]*?<\/footer>/i);
if (match) {
  const sfBot = match[0].match(/<div class="sf__bot"[\s\S]*?<\/footer>/i);
  if (sfBot) console.log(sfBot[0]);
}

