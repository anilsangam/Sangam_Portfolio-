const fs = require('fs');
const ejs = require('ejs');

const lines = fs.readFileSync('views/admin/dashboard.ejs', 'utf8').split('\n');

for (let i = 1; i <= lines.length; i++) {
  const slice = lines.slice(0, i).join('\n');
  try {
    ejs.compile(slice);
  } catch (err) {
    if (err.message.includes('Invalid or unexpected token')) {
      console.log(`Error at or before line ${i}:`);
      console.log(lines[i - 1]);
      break;
    }
  }
}

