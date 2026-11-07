const fs = require('fs');

// 1. Fix views/admin/dashboard.ejs line 205
let dash = fs.readFileSync('views/admin/dashboard.ejs', 'utf8');
dash = dash.replace(
  /value="<%= profile\.headline[^%]+%>"/,
  'value="<%= (profile && profile.headline) ? profile.headline : \'Hi, I am Anil Sangam. I am a Software Developer.\' %>"'
);
fs.writeFileSync('views/admin/dashboard.ejs', dash, 'utf8');

// 2. Fix views/home/index.ejs headline
let home = fs.readFileSync('views/home/index.ejs', 'utf8');
// Find h1
home = home.replace(
  /<h1 class="hero__h1">[\s\S]*?<\/h1>/i,
  `<h1 class="hero__h1">
        <span class="sr-only"><%= (profile && profile.headline) || "Hi, I'm Anil Sangam. I'm a Software Developer." %></span>
        <span class="hero__h1-vis" aria-hidden="true">
            <span><%= (profile && profile.fullName) || "Anil Sangam" %></span>
            <span><%= (profile && profile.headline) || "Software Developer" %></span>
        </span>
    </h1>`
);
fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('Fixed headline and dashboard!');

