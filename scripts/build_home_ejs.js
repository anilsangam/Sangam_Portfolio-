const fs = require('fs');

const home = fs.readFileSync('portfolio/home.html', 'utf8');

// Let's inspect the sections in home.html
console.log('Building views/home/index.ejs...');

// We will construct views/home/index.ejs using the exact markup of portfolio/home.html with the removals applied
let ejs = home;

// 1. Replace <head>...</head> with partial
ejs = ejs.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n    <%- include('../partials/head', { isRoom: false }) %>\n</head>`);

// 2. Remove Ability card markup:
// <!-- ============ Ability card ============ --> ... </div> </div>
ejs = ejs.replace(/<!-- ============ Ability card ============ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');
// and button #holoOpen on portrait:
ejs = ejs.replace(/<button class="fig__card" id="holoOpen"[\s\S]*?<\/button>/i, '');

// 3. Remove Clock & Date from Header:
ejs = ejs.replace(/<div class="chip clock" aria-label="Local time">[\s\S]*?<\/div>/i, '');

// 4. Remove UI/UX & Graphic Design from Header Nav:
ejs = ejs.replace(/<li>\s*<button data-door="2">[\s\S]*?<\/button>\s*<\/li>/i, '');
ejs = ejs.replace(/<li>\s*<button data-door="3">[\s\S]*?<\/button>\s*<\/li>/i, '');

// 5. Remove UI/UX & Graphic Design pills from #loader:
ejs = ejs.replace(/<div class="ld__pill" style="--k:3;--c:#7a8670;--t:#F3EEEC;--dir:-1">[\s\S]*?<\/div>/i, '');
ejs = ejs.replace(/<div class="ld__pill" style="--k:4;--c:#a4552c;--t:#F3EEEC;--dir:1">[\s\S]*?<\/div>/i, '');
// Reindex photography pill to --k:3
ejs = ejs.replace(/style="--k:5;--c:#C4B0B0/i, 'style="--k:3;--c:#C4B0B0');

// 6. Remove UI/UX & Graphic Design doors from #works:
// Door 2 (UI/UX):
ejs = ejs.replace(/<li class="unit" style="--i:2;--door:#7a8670;--door-dk:#66705d">[\s\S]*?<\/li>/i, '');
// Door 3 (Graphic Design):
ejs = ejs.replace(/<li class="unit" style="--i:3;--door:#a4552c;--door-dk:#8c4826">[\s\S]*?<\/li>/i, '');
// Re-index Photographer door to --i:2
ejs = ejs.replace(/style="--i:4;--door:#262523;--door-dk:#201f1d"/i, 'style="--i:2;--door:#262523;--door-dk:#201f1d"');

// Update doors dots from 4 to 2 (or 3)
ejs = ejs.replace(/<p class="doors__dots" aria-hidden="true">[\s\S]*?<\/p>/i, `<p class="doors__dots" aria-hidden="true"><i class="on"></i><i></i><i></i></p>`);

// 7. Update FlipCalendar skills in JS:
ejs = ejs.replace(
  "const SKILLS = ['Web Developer', 'App Developer', 'UI/UX Designer', 'Graphic Designer', 'Photographer'];",
  "const SKILLS = ['Web Developer', 'App Developer', 'Photographer'];"
);

// 8. Update Doors JS in script 7:
ejs = ejs.replace(
  "const ROUTES = ['web-developer/', 'app-developer/', 'ui-ux-designer/', 'graphic-designer/', 'photographer/'];",
  "const ROUTES = ['/web-developer', '/app-developer', '/#works'];"
);
ejs = ejs.replace(
  "const SLUGS = ['web-developer', 'app-developer', 'ui-ux-designer', 'graphic-designer', 'photographer'];",
  "const SLUGS = ['web-developer', 'app-developer', 'photographer'];"
);

// Update INFO array in Doors JS to 3 entries:
ejs = ejs.replace(
  /const INFO = \[[\s\S]*?\];/,
  `const INFO = [
            ['Web Development', 'End to end, from sketch to live site', ['Discovery & planning', 'UX & visual design', 'Front-end & back-end development', 'Technical SEO & performance', 'Analytics, launch & ongoing support']],
            ['App Development', 'From the first idea to the app store', ['Product scoping & user flows', 'Interface design', 'Cross-platform development', 'Device testing & store launch', 'Analytics, monitoring & updates']],
            ['Photography', 'The eye behind every layout', ['Architecture, concerts & sport', 'Nature & product', 'Light & composition first']]
        ];`
);

// 9. Remove Ability Card JS completely from Script 7:
ejs = ejs.replace(/\/\* ---------- Ability card:[\s\S]*?(?=\/\* ---------- Lenis)/i, '');

// 10. Remove live clock JS from Script 7:
ejs = ejs.replace(/\/\* ---------- live clock ---------- \*\/[\s\S]*?(?=\/\* ---------- overlays)/i, '');

// 11. Remove script 4 (clock tick):
ejs = ejs.replace(/<script>\s*\(\s*\(\)\s*=>\s*\{\s*const M = \['Jan', 'Feb', 'Mar'[\s\S]*?<\/script>/i, '');

// 12. In navm__bot, remove Local time display:
ejs = ejs.replace(/<span>\s*Local time<span data-navtime><\/span>\s*<\/span>/i, '');

// 13. Remove Netlify HUD script
ejs = ejs.replace(/<script[^>]*src="\/\.netlify\/scripts\/hud[^>]*><\/script>/i, '');

// 14. In footer sf__cols, remove UI/UX and Graphic Design links:
ejs = ejs.replace(/<li>\s*<a href="ui-ux-designer\/"[\s\S]*?<\/li>/i, '');
ejs = ejs.replace(/<li>\s*<a href="graphic-designer\/"[\s\S]*?<\/li>/i, '');

// Replace footer with include or dynamic tags
ejs = ejs.replace(/<footer class="sf" id="contact-footer"[\s\S]*?<\/footer>/i, `<%- include('../partials/footer') %>`);

// Replace contact modal with partial
ejs = ejs.replace(/<!-- ============ RequestModal ============ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, `<%- include('../partials/contact_modal') %>`);

fs.writeFileSync('views/home/index.ejs', ejs, 'utf8');
console.log('views/home/index.ejs created successfully! Size:', fs.statSync('views/home/index.ejs').size);

