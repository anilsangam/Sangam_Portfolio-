const fs = require('fs');
const content = fs.readFileSync('portfolio/home.html', 'utf8');

function findCss(selector, length = 1000) {
    let idx = content.indexOf(selector);
    if (idx !== -1) {
        console.log(`=== CSS for ${selector} ===`);
        console.log(content.substring(idx - 20, idx + length));
    } else {
        console.log(`Not found: ${selector}`);
    }
}

findCss('.hdr{');
findCss('.hdr ');
findCss('.nav{');
findCss('.chip{');
findCss('.navm{');

