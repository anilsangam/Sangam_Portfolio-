const fs = require('fs');

// 1. Process web_devloper.html -> views/pages/web_developer.ejs
let web = fs.readFileSync('portfolio/web_devloper.html', 'utf8');

// Replace head
web = web.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n    <%- include('../partials/head', { isRoom: true }) %>\n</head>`);

// Fix header back links
web = web.replace(/href="\.\.\/#works"/g, 'href="/#works"');
web = web.replace(/const HOME = '\.\.\/#works'[\s\S]*?;/g, "const HOME = '/#works';");

// Remove clock from header
web = web.replace(/<div class="rn__clock" aria-label="Local time">[\s\S]*?<\/div>/i, '');

// Remove UI/UX & Graphic Design from nav
web = web.replace(/<li>\s*<button data-nav="door:2">[\s\S]*?<\/button>\s*<\/li>/gi, '');
web = web.replace(/<li>\s*<button data-nav="door:3">[\s\S]*?<\/button>\s*<\/li>/gi, '');
web = web.replace(/<button data-nav="door:2">UI\/UX Design<\/button>/gi, '');
web = web.replace(/<button data-nav="door:3">Graphic Design<\/button>/gi, '');

// Inject dynamic projects array in script
web = web.replace(
  /const PROJECTS = \[[\s\S]*?\];/i,
  `const PROJECTS = <%- JSON.stringify(projects) %>;`
);

// Remove clock script (tick function)
web = web.replace(/<script>\s*\(\s*\(\)\s*=>\s*\{\s*const M = \['Jan', 'Feb', 'Mar'[\s\S]*?<\/script>/i, '');

// Remove Netlify script
web = web.replace(/<script[^>]*src="\/\.netlify\/scripts\/hud[^>]*><\/script>/i, '');

// Replace footer with include
web = web.replace(/<footer class="sf" id="contact-footer"[\s\S]*?<\/footer>/i, `<%- include('../partials/footer') %>`);

// Replace contact modal with include
web = web.replace(/<!-- ============ RequestModal ============ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, `<%- include('../partials/contact_modal') %>`);

// Make sure asset paths point to /images/
web = web.replace(/src="(1-zerodha|4-quicko-cg|5-sandbox-cost|2-tax-pnl|3-capital-gains|project-2|project-4)\.(webp|png|mp4)"/g, 'src="/images/$1.$2"');

fs.writeFileSync('views/pages/web_developer.ejs', web, 'utf8');
console.log('views/pages/web_developer.ejs created, size:', fs.statSync('views/pages/web_developer.ejs').size);

// 2. Process app_dev.html -> views/pages/app_developer.ejs
let app = fs.readFileSync('portfolio/app_dev.html', 'utf8');

// Replace head
app = app.replace(/<head>[\s\S]*?<\/head>/i, `<head>\n    <%- include('../partials/head', { isRoom: true }) %>\n</head>`);

// Fix header back links
app = app.replace(/href="\.\.\/#works"/g, 'href="/#works"');
app = app.replace(/const HOME = '\.\.\/#works'[\s\S]*?;/g, "const HOME = '/#works';");

// Remove clock from header
app = app.replace(/<div class="rn__clock" aria-label="Local time">[\s\S]*?<\/div>/i, '');

// Remove UI/UX & Graphic Design from nav
app = app.replace(/<li>\s*<button data-nav="door:2">[\s\S]*?<\/button>\s*<\/li>/gi, '');
app = app.replace(/<li>\s*<button data-nav="door:3">[\s\S]*?<\/button>\s*<\/li>/gi, '');
app = app.replace(/<button data-nav="door:2">UI\/UX Design<\/button>/gi, '');
app = app.replace(/<button data-nav="door:3">Graphic Design<\/button>/gi, '');

// Inject dynamic projects array in script
app = app.replace(
  /const PROJECTS = \[[\s\S]*?\];/i,
  `const PROJECTS = <%- JSON.stringify(projects) %>;`
);

// Remove clock script (tick function)
app = app.replace(/<script>\s*\(\s*\(\)\s*=>\s*\{\s*const M = \['Jan', 'Feb', 'Mar'[\s\S]*?<\/script>/i, '');

// Remove Netlify script
app = app.replace(/<script[^>]*src="\/\.netlify\/scripts\/hud[^>]*><\/script>/i, '');

// Replace footer with include
app = app.replace(/<footer class="sf" id="contact-footer"[\s\S]*?<\/footer>/i, `<%- include('../partials/footer') %>`);

// Replace contact modal with include
app = app.replace(/<!-- ============ RequestModal ============ -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, `<%- include('../partials/contact_modal') %>`);

// Fix asset paths
app = app.replace(/src="(icon-expense|icon-vault|icon-brick|icon-dice|app-expense|app-vault|app-brick|app-dice)\.(webp|png|mp4)"/g, 'src="/images/$1.$2"');

fs.writeFileSync('views/pages/app_developer.ejs', app, 'utf8');
console.log('views/pages/app_developer.ejs created, size:', fs.statSync('views/pages/app_developer.ejs').size);

