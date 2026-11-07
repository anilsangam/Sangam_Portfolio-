const fs = require('fs');
let content = fs.readFileSync('views/home/index.ejs', 'utf8');

const target = 'function closeModal() {\r\n            closeLayer(modal,';
const targetLF = 'function closeModal() {\n            closeLayer(modal,';

const insertCRLF = 'function closeModal() {\r\n            document.body.style.removeProperty(\x27overflow\x27);\r\n            if (window.unlockScroll) window.unlockScroll();\r\n            closeLayer(modal,';
const insertLF = 'function closeModal() {\n            document.body.style.removeProperty(\x27overflow\x27);\n            if (window.unlockScroll) window.unlockScroll();\n            closeLayer(modal,';

if (content.includes(target)) {
  content = content.replace(target, insertCRLF);
  fs.writeFileSync('views/home/index.ejs', content, 'utf8');
  console.log('Updated index.ejs (CRLF)');
} else if (content.includes(targetLF)) {
  content = content.replace(targetLF, insertLF);
  fs.writeFileSync('views/home/index.ejs', content, 'utf8');
  console.log('Updated index.ejs (LF)');
} else {
  console.log('Target not found in views/home/index.ejs');
}

