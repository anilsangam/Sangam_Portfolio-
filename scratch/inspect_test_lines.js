const fs = require('fs');

const testFile = fs.readFileSync('scripts/test_in_memory.js', 'utf8');
const lines = testFile.split('\n');
console.log(lines.slice(45, 95).join('\n'));

