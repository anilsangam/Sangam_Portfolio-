const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ejsPath = path.join(__dirname, '..', 'views', 'home', 'index.ejs');
let html = fs.readFileSync(ejsPath, 'utf8');

// Replace EJS tags with mocks for testing
html = html.replace(/<%-?[\s\S]*?%>/g, '""');

// Find all script tags
const scriptRegex = /<script(?:\s+type="([^"]*)")?>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const type = match[1] || 'classic';
  const code = match[2];
  if (type === 'importmap' || type === 'application/json') continue;
  
  console.log(`Checking script #${count} (type=${type}, length=${code.length})...`);
  try {
    new vm.Script(code, { filename: `script_${count}.js` });
    console.log(`Script #${count} syntax OK!`);
  } catch (err) {
    console.error(`Script #${count} SYNTAX ERROR:`, err.message);
    const lines = code.split('\n');
    console.error('Line context:', lines.slice(Math.max(0, err.lineNumber - 5), err.lineNumber + 5).join('\n'));
  }
}

