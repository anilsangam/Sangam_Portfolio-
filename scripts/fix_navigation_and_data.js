const fs = require('fs');

console.log('Starting navigation and data rendering fix...');

// ==========================================
// 1. UPDATE views/pages/web_developer.ejs
// ==========================================
let web = fs.readFileSync('views/pages/web_developer.ejs', 'utf8');

// Replace static #stack with EJS SSR loop
const webStackRegex = /<section class="stack" id="stack"[\s\S]*?<\/section>/i;
const newWebStack = `<section class="stack" id="stack" aria-label="Projects">
    <% if (projects && projects.length > 0) { %>
        <% projects.forEach((p, i) => { %>
            <article class="card<%= i % 2 ? ' flip' : '' %>" style="--i:<%= i %>" aria-labelledby="p<%= i %>">
                <div class="card__in">
                    <div class="card__info">
                        <p class="card__meta">
                            <span><%= p.kind || 'Web Application' %></span>
                        </p>
                        <h2 id="p<%= i %>"><%= p.title %></h2>
                        <p class="sub"><%= p.subTitle || '' %></p>
                        <p class="desc"><%= p.desc || '' %></p>
                        <% if (p.tags && p.tags.length > 0) { %>
                            <ul class="tags">
                                <% p.tags.forEach(t => { %>
                                    <li><%= t %></li>
                                <% }) %>
                            </ul>
                        <% } %>
                        <% if (p.url) { %>
                            <a class="live" href="<%= p.url %>" target="_blank" rel="noopener noreferrer">
                                Visit live site 
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M7 17 17 7M8 7h9v9"/>
                                </svg>
                            </a>
                        <% } else { %>
                            <span class="note"><%= p.note || 'Full-stack application build' %></span>
                        <% } %>
                    </div>
                    <div class="stage" aria-hidden="true">
                        <div class="mon">
                            <div class="mon__body">
                                <div class="mon__screen<%= p.video ? ' vid' : '' %>" style="--ar:<%= p.ar || '1280 / 732' %>">
                                    <% if (p.video) { %>
                                        <video muted loop playsinline preload="metadata" poster="<%= p.poster ? (p.poster.startsWith('/') ? p.poster : '/images/' + p.poster) : '/images/project-2.webp' %>" src="<%= p.video.startsWith('/') ? p.video : '/images/' + p.video %>" style="background:<%= p.bg || '#1A1818' %>;object-fit:contain"></video>
                                    <% } else if (p.shot || p.poster) { %>
                                        <img src="<%= (p.shot || p.poster).startsWith('/') ? (p.shot || p.poster) : '/images/' + (p.shot || p.poster) %>" alt="" loading="<%= i < 1 ? 'eager' : 'lazy' %>" style="background:<%= p.bg || '#1A1818' %>;object-fit:contain;width:100%;height:100%">
                                    <% } else { %>
                                        <img src="/images/1-zerodha.webp" alt="" loading="<%= i < 1 ? 'eager' : 'lazy' %>" style="background:<%= p.bg || '#1A1818' %>;object-fit:contain;width:100%;height:100%">
                                    <% } %>
                                </div>
                            </div>
                            <div class="mon__neck"></div>
                            <div class="mon__foot"></div>
                        </div>
                    </div>
                </div>
                <div class="card__dim"></div>
            </article>
        <% }) %>
    <% } %>
</section>`;

web = web.replace(webStackRegex, newWebStack);

// Fix navigation go() in web_developer.ejs to use direct clean URLs
const webGoRegex = /const go = to => \{[\s\S]*?(?=\n\s*;\s*\n\s*document\.addEventListener\('click')/;
const newWebGo = `const go = to => {
                if (to === 'top') {
                    scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                if (to === 'home')
                    location.href = '/';
                else if (to === 'about')
                    location.href = '/#about';
                else if (to === 'contact') {
                    const m = document.getElementById('modal');
                    if (m) m.hidden = false;
                } else if (to === 'door:0' || to === 'web-developer')
                    location.href = '/web-developer';
                else if (to === 'door:1' || to === 'app-developer')
                    location.href = '/app-developer';
            }`;

web = web.replace(webGoRegex, newWebGo);

// Update back chip link:
web = web.replace(/href="[^"]*#works"/g, 'href="/"');

// Ensure window.__live is true so videos and media are immediately visible
web = web.replace("window.__live = !document.documentElement.classList.contains('embed');", "window.__live = true;");

fs.writeFileSync('views/pages/web_developer.ejs', web, 'utf8');
console.log('views/pages/web_developer.ejs updated!');


// ==========================================
// 2. UPDATE views/pages/app_developer.ejs
// ==========================================
let app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

// Replace static #stack with EJS SSR loop
const appStackRegex = /<section class="stack" id="stack"[\s\S]*?<\/section>/i;
const newAppStack = `<section class="stack" id="stack" aria-label="Projects">
    <% if (projects && projects.length > 0) { %>
        <% projects.forEach((p, i) => { %>
            <article class="card<%= i % 2 ? ' flip' : '' %>" style="--i:<%= i %>" aria-labelledby="p<%= i %>">
                <div class="card__in">
                    <div class="card__info">
                        <div class="app">
                            <img src="<%= p.icon ? (p.icon.startsWith('/') ? p.icon : '/images/' + p.icon) : '/images/icon-expense.webp' %>" alt="" width="58" height="58" decoding="async" loading="<%= i < 1 ? 'eager' : 'lazy' %>">
                            <p class="card__meta">
                                <span><%= p.kind || 'Mobile Application' %></span>
                            </p>
                        </div>
                        <h2 id="p<%= i %>"><%= p.title %></h2>
                        <p class="sub"><%= p.subTitle || '' %></p>
                        <p class="desc"><%= p.desc || '' %></p>
                        <% if (p.tags && p.tags.length > 0) { %>
                            <ul class="tags">
                                <% p.tags.forEach(t => { %>
                                    <li><%= t %></li>
                                <% }) %>
                            </ul>
                        <% } %>
                        <% if (p.url) { %>
                            <a class="live" href="<%= p.url %>" target="_blank" rel="noopener noreferrer">
                                Visit live site 
                                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M7 17 17 7M8 7h9v9"/>
                                </svg>
                            </a>
                        <% } else { %>
                            <span class="note"><%= p.note || 'Screen recording of the build' %></span>
                        <% } %>
                    </div>
                    <div class="stage" aria-hidden="true">
                        <div class="phone">
                            <div class="phone__body">
                                <i class="phone__btn l" style="top:19%;height:4%"></i>
                                <i class="phone__btn l" style="top:26%;height:7.5%"></i>
                                <i class="phone__btn l" style="top:35%;height:7.5%"></i>
                                <i class="phone__btn r" style="top:28%;height:11%"></i>
                                <div class="phone__screen">
                                    <% if (p.video) { %>
                                        <video muted loop playsinline preload="metadata" poster="<%= p.poster ? (p.poster.startsWith('/') ? p.poster : '/images/' + p.poster) : '/images/app-expense.webp' %>" width="393" height="852">
                                            <source src="<%= p.video.startsWith('/') ? p.video : '/images/' + p.video %>" type="video/mp4">
                                        </video>
                                    <% } else if (p.poster || p.shot) { %>
                                        <img src="<%= (p.poster || p.shot).startsWith('/') ? (p.poster || p.shot) : '/images/' + (p.poster || p.shot) %>" alt="" width="393" height="852" loading="<%= i < 1 ? 'eager' : 'lazy' %>">
                                    <% } else { %>
                                        <img src="/images/app-expense.webp" alt="" width="393" height="852" loading="<%= i < 1 ? 'eager' : 'lazy' %>">
                                    <% } %>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card__dim"></div>
            </article>
        <% }) %>
    <% } %>
</section>`;

app = app.replace(appStackRegex, newAppStack);

// Fix navigation go() in app_developer.ejs to use direct clean URLs
const appGoRegex = /const go = to => \{[\s\S]*?(?=\n\s*;\s*\n\s*document\.addEventListener\('click')/;
const newAppGo = `const go = to => {
                if (to === 'top') {
                    scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                if (to === 'home')
                    location.href = '/';
                else if (to === 'about')
                    location.href = '/#about';
                else if (to === 'contact') {
                    const m = document.getElementById('modal');
                    if (m) m.hidden = false;
                } else if (to === 'door:0' || to === 'web-developer')
                    location.href = '/web-developer';
                else if (to === 'door:1' || to === 'app-developer')
                    location.href = '/app-developer';
            }`;

app = app.replace(appGoRegex, newAppGo);

// Update back chip link:
app = app.replace(/href="[^"]*#works"/g, 'href="/"');

// Ensure window.__live is true so videos and media are immediately visible
app = app.replace("window.__live = !document.documentElement.classList.contains('embed');", "window.__live = true;");

fs.writeFileSync('views/pages/app_developer.ejs', app, 'utf8');
console.log('views/pages/app_developer.ejs updated!');


// ==========================================
// 3. UPDATE views/home/index.ejs NAVBAR & DOORS
// ==========================================
let home = fs.readFileSync('views/home/index.ejs', 'utf8');

// Update header nav buttons to use data-nav-link:
home = home.replace(
  '<button data-door="0">',
  '<button data-nav-link="/web-developer">'
);
home = home.replace(
  '<button data-door="1">',
  '<button data-nav-link="/app-developer">'
);

// Add data-nav-link click listener in home:
const navLinkHandler = `
        // Direct navbar links (no door animation when clicking from header nav)
        document.addEventListener('click', e => {
            const nl = e.target.closest('[data-nav-link]');
            if (nl) {
                e.preventDefault();
                location.href = nl.dataset.navLink;
                return;
            }
        });
`;

if (!home.includes('data-nav-link')) {
  // insert before doors listener
  home = home.replace(
    "const dr = e.target.closest('[data-door]');",
    `${navLinkHandler}\n        const dr = e.target.closest('[data-door]');`
  );
}

// Clean up any double hashes if page loads with legacy hash:
home = home.replace(
  "const HASH_DOOR = SLUGS.indexOf(decodeURIComponent(location.hash.slice(1)));",
  `const cleanHash = location.hash.replace(/^#works#/, '#').slice(1);
            const HASH_DOOR = SLUGS.indexOf(decodeURIComponent(cleanHash));`
);

// In handoff() of through(), ensure clean URL push:
home = home.replace(
  "ROUTES[i]",
  "ROUTES[i]"
);

fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('views/home/index.ejs updated!');


// ==========================================
// 4. UPDATE views/partials/nav_drawer.ejs
// ==========================================
let drawer = fs.readFileSync('views/partials/nav_drawer.ejs', 'utf8');
drawer = drawer.replace(
  '<li><button data-door="0">Web Development</button></li>',
  '<li><button onclick="location.href=\'/web-developer\'">Web Development</button></li>'
);
drawer = drawer.replace(
  '<li><button data-door="1">App Development</button></li>',
  '<li><button onclick="location.href=\'/app-developer\'">App Development</button></li>'
);
fs.writeFileSync('views/partials/nav_drawer.ejs', drawer, 'utf8');
console.log('views/partials/nav_drawer.ejs updated!');

console.log('All navigation and data rendering fixes applied successfully!');

