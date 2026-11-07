const fs = require('fs');
let s = fs.readFileSync('views/home/index.ejs', 'utf8');

const target = "const hdr = $('.hdr');";
console.log('Includes target:', s.includes(target));
if (s.includes(target)) {
    s = s.replace(target, "const hdr = $('.site-header') || $('.hdr');");
    s = s.replace("const upd = () => hdr.classList.toggle('stuck', scrollY > 24);", "const upd = () => { if (hdr) hdr.classList.toggle('stuck', scrollY > 24); };");
    fs.writeFileSync('views/home/index.ejs', s, 'utf8');
    console.log('Successfully updated hdr in views/home/index.ejs');
} else {
    console.log('Target string not found');
}

