const fs = require('fs');

const web = fs.readFileSync('portfolio/web_devloper.html', 'utf8');

// Check main content inside <main>
const mainMatch = web.match(/<main[\s\S]*?<\/main>/i);
if (mainMatch) {
  console.log('Main length:', mainMatch[0].length);
  console.log('Main first 1000 chars:\n', mainMatch[0].slice(0, 1000));
}

