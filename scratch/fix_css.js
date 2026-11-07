const fs = require('fs');
let css = fs.readFileSync('public/css/main.css', 'utf8');

const heroFix = `
/* ========================================================
   HERO INSTANT VISIBILITY & NAVBAR REFINEMENTS
   ======================================================== */
.fig {
    opacity: 1 !important;
    transform: translate(-50%, 0) !important;
}
@media (min-width: 1024px) {
    .fig {
        transform: none !important;
    }
}
.line > span {
    opacity: 1 !important;
    transform: none !important;
}
.rv {
    opacity: 1 !important;
    transform: none !important;
}
`;

if (!css.includes('HERO INSTANT VISIBILITY')) {
    css += '\n' + heroFix;
    fs.writeFileSync('public/css/main.css', css, 'utf8');
    console.log('Appended hero visibility fix to public/css/main.css');
} else {
    console.log('Already includes hero fix');
}

