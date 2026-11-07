const fs = require('fs');

let testCode = fs.readFileSync('scripts/test_in_memory.js', 'utf8');

// Update project checks
testCode = testCode.replace("Sundown Studio", "Nishad Aarakshan Sankalp");
testCode = testCode.replace("Expense Tracker", "VIP Party Mobile App");

fs.writeFileSync('scripts/test_in_memory.js', testCode, 'utf8');
console.log('test_in_memory.js updated!');

