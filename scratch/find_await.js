const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scripts = [...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const text = scripts[2][1];

const lines = text.split('\n');
lines.forEach((line, i) => {
  if (line.includes('await ') || line.includes('await(')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});

