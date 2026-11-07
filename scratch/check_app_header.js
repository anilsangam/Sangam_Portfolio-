const fs = require('fs');
const c = fs.readFileSync('portfolio/app_dev.html', 'utf8');
const hMatch = c.match(/<header class="rn"[\s\S]*?<\/header>/);
if (hMatch) {
    console.log(hMatch[0]);
}

