const fs = require('fs');

const home = fs.readFileSync('c:/my projects/portfolio/home.html', 'utf8');

const styles = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);

console.log('Total style tags in home.html:', styles.length);
console.log('Style 1 length:', styles[0].length);
console.log('Style 2 length:', styles[1].length);
if (styles[2]) console.log('Style 3 length:', styles[2].length);

// Let's check holo and clock styles in style 2
const s2 = styles[1];
const holoMatches = [...s2.matchAll(/\.holo[^{]*\{[^}]*\}/gi)];
console.log('Holo CSS rules count in style 2:', holoMatches.length);

