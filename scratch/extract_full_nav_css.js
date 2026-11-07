const fs = require('fs');
const content = fs.readFileSync('portfolio/home.html', 'utf8');

const hdrIdx = content.indexOf('.hdr {');
const heroIdx = content.indexOf('/* ---------- hero ---------- */');
const headerCss = content.substring(hdrIdx, heroIdx);

const navmIdx = content.indexOf('.navm {');
const holoIdx = content.indexOf('.holo', navmIdx);
const navmCss = content.substring(navmIdx, holoIdx);

fs.writeFileSync('scratch/extracted_navbar.css', headerCss + '\n\n' + navmCss);
console.log("Header CSS length:", headerCss.length);
console.log("Navm CSS length:", navmCss.length);
