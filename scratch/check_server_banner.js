const fs = require('fs');
const server = fs.readFileSync('server.js', 'utf8');

const startBlock = server.match(/console\.log\(`[\s\S]*?`\);/);
if (startBlock) console.log(startBlock[0]);

