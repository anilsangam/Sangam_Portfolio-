const fs = require('fs');
const content = fs.readFileSync('views/home/index.ejs', 'utf8');

// Find all occurrences of $('...') or document.querySelector('...')
const regex = /(?:\$|document\.querySelector)\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
let match;
const queries = new Set();
while ((match = regex.exec(content)) !== null) {
    queries.add(match[1]);
}

console.log('Total queries:', queries.size);
for (const q of queries) {
    console.log(q);
}

