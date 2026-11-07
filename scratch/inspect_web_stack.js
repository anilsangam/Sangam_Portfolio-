const fs = require('fs');

const web = fs.readFileSync('views/pages/web_developer.ejs', 'utf8');
const match = web.match(/const stack = document\.getElementById\('stack'\);[\s\S]*?(?=\n\s*function|\n\s*const|\n\s*let|\<\/script)/);
if (match) console.log(match[0].slice(0, 1000));

