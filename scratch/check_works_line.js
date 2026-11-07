const fs = require('fs');
const s = fs.readFileSync('views/home/index.ejs', 'utf8');
const lines = s.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="works"')) {
    console.log('Line ' + i + ': ' + l);
    for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 5); j++) {
      console.log(j + ': ' + JSON.stringify(lines[j]));
    }
  }
});

