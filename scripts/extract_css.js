const fs = require('fs');
const path = require('path');

const home = fs.readFileSync('c:/my projects/portfolio/home.html', 'utf8');
const web = fs.readFileSync('c:/my projects/portfolio/web_devloper.html', 'utf8');

// 1. Extract main.css
const homeStyles = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
let mainCss = homeStyles.join('\n\n');

// Clean up holo CSS from mainCss
mainCss = mainCss.replace(/\/\* the ability card:[\s\S]*?(?=\/\*)/g, '');
mainCss = mainCss.replace(/\.holo[\s\S]*?(?=(?:\.|\#|[a-z])\w+[\s\S]*?\{)/gi, '');
mainCss = mainCss.replace(/\.fig__card[\s\S]*?\{[^}]*\}/gi, '');

// Clean up clock styles
mainCss = mainCss.replace(/\.clock\b[\s\S]*?\{[^}]*\}/gi, '');
mainCss = mainCss.replace(/\.clock__\w+[\s\S]*?\{[^}]*\}/gi, '');

fs.writeFileSync('public/css/main.css', mainCss, 'utf8');
console.log('public/css/main.css written, size:', fs.statSync('public/css/main.css').size);

// 2. Extract room.css
const webStyles = [...web.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
let roomCss = webStyles.join('\n\n');
// Clean up clock in roomCss
roomCss = roomCss.replace(/\.rn__clock[\s\S]*?\{[^}]*\}/gi, '');

fs.writeFileSync('public/css/room.css', roomCss, 'utf8');
console.log('public/css/room.css written, size:', fs.statSync('public/css/room.css').size);

