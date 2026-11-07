const fs = require('fs');

// 1. Fix admin/dashboard.ejs
let dash = fs.readFileSync('views/admin/dashboard.ejs', 'utf8');
dash = dash.replace(
  'value="<%= profile.headline || \\"Hi, I\'m Rishi. I am a photographer, web developer and iOS developer.\\" %>"',
  'value="<%= profile.headline || `Hi, I am Rishi. I am a developer.` %>"'
);
fs.writeFileSync('views/admin/dashboard.ejs', dash, 'utf8');

// 2. Fix home/index.ejs headline binding
let home = fs.readFileSync('views/home/index.ejs', 'utf8');
// Check where headline is in home
console.log('Searching for headline in home/index.ejs:');
const hMatches = [...home.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
hMatches.forEach(m => console.log(m[0]));

// Let's replace the h1 inside #home with dynamic profile headline:
home = home.replace(
  /<h1[^>]*>[\s\S]*?<\/h1>/i,
  `<h1 class="hero__h1">
        <span class="sr-only"><%= (profile && profile.headline) || "Hi, I'm Rishi. I am a photographer, web developer and iOS developer." %></span>
        <span class="hero__h1-vis" aria-hidden="true">
            <span>Hi, I'm Rishi.</span>
            <span>I am a developer</span>
        </span>
    </h1>`
);
fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('EJS syntax and headline fixed.');

