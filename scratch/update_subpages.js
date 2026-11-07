const fs = require('fs');

function updatePage(filePath, key, heroTitle, navTitle) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace section
    const oldSecRegex = new RegExp(`<section class="books-showcase-section"[\\s\\S]*?<div id="${key}BooksShowcase"[\\s\\S]*?<\\/section>`);
    const newSec = `<section class="books-showcase-section" aria-label="3D & Mobile ${heroTitle} Projects">
            <!-- Desktop: 3D Books Showcase -->
            <div id="${key}BooksShowcase" class="books-showcase-mount bs-desktop-only"></div>
            <!-- Mobile: Scroll-Triggered Cards -->
            <div id="${key}MobileCards" class="mobile-scroll-cards bs-mobile-only" aria-label="Mobile ${heroTitle} Projects"></div>
        </section>`;

    content = content.replace(oldSecRegex, newSec);

    // 2. Replace script
    const oldScriptRegex = new RegExp(`<script type="module">[\\s\\S]*?setupShowcase[\\s\\S]*?<\\/script>\\s*<\\/body>`);
    const newScript = `<script type="module">
        import { initBooksShowcase } from '/js/books-showcase.js';
        import { initMobileScrollCards } from '/js/scroll-cards.js';

        (function setupShowcases() {
            const dataEl = document.getElementById('${key}BooksData');
            if (!dataEl) return;

            let projects = [];
            try {
                projects = JSON.parse(dataEl.textContent);
            } catch (err) {
                console.error('Error parsing project data:', err);
                return;
            }

            // 1. Desktop: 3D Books Showcase
            const desktopMount = document.getElementById('${key}BooksShowcase');
            if (desktopMount) {
                try {
                    initBooksShowcase(desktopMount, {
                        books: projects,
                        heroTitle: '${heroTitle}',
                        navTitle: '${navTitle}',
                        showNav: true,
                        showDetailPanel: true,
                        showCarousel: true
                    });
                } catch (err) {
                    console.error('Error mounting Desktop 3D Books Showcase:', err);
                }
            }

            // 2. Mobile: Scroll-Triggered Cards
            const mobileMount = document.getElementById('${key}MobileCards');
            if (mobileMount) {
                try {
                    initMobileScrollCards(mobileMount, {
                        projects: projects,
                        title: '${navTitle}',
                        subtitle: 'Scroll to explore ${heroTitle.toLowerCase()} projects'
                    });
                } catch (err) {
                    console.error('Error mounting Mobile Scroll Cards:', err);
                }
            }
        })();
    </script>
</body>`;

    content = content.replace(oldScriptRegex, newScript);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath} successfully!`);
}

updatePage('views/pages/web_developer.ejs', 'web', 'Web', 'Web Projects');
updatePage('views/pages/app_developer.ejs', 'app', 'Apps', 'App Showcase');

