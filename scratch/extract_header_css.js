const fs = require('fs');
const content = fs.readFileSync('portfolio/home.html', 'utf8');

const startIdx = content.indexOf('.navm ');
if (startIdx !== -1) {
    console.log(content.substring(startIdx, startIdx + 3500));
} else {
    const idx2 = content.indexOf('.navm');
    console.log(content.substring(idx2, idx2 + 3500));
}
