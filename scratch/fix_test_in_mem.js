const fs = require('fs');

let testCode = fs.readFileSync('scripts/test_in_memory.js', 'utf8');

testCode = testCode.replace("webHtml.includes('Sundown Studio')", "webHtml.includes('Nishad Aarakshan Sankalp')");
testCode = testCode.replace("appHtml.includes('Expense Tracker')", "appHtml.includes('VIP Party Mobile App')");

fs.writeFileSync('scripts/test_in_memory.js', testCode, 'utf8');
console.log('Fixed test_in_memory assertions!');

