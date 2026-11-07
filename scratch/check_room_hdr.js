const fs = require('fs');
const web = fs.readFileSync('portfolio/web_devloper.html', 'utf8');
const match = web.match(/<header[^>]*id=["']rn["'][\s\S]*?<\/header>/i);
if (match) console.log(match[0]);

