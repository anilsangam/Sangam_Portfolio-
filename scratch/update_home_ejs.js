const fs = require('fs');

let content = fs.readFileSync('views/home/index.ejs', 'utf8');

// 1. Replace section
const oldSec = `<section id="projectsShowcase" class="books-showcase-section" aria-label="3D Selected Works Showcase">
            <div id="homeBooksShowcase" class="books-showcase-mount"></div>
        </section>`;

const newSec = `<section id="projectsShowcase" class="books-showcase-section" aria-label="Selected Works Showcase">
            <!-- Desktop: Vengeance UI 3D Books Showcase -->
            <div id="homeBooksShowcase" class="books-showcase-mount bs-desktop-only"></div>
            <!-- Mobile: Framer Motion Style Scroll-Triggered Card Stack -->
            <div id="homeMobileCards" class="mobile-scroll-cards bs-mobile-only" aria-label="Mobile Project Showcase"></div>
        </section>`;

if (content.includes('id="homeBooksShowcase" class="books-showcase-mount"')) {
    content = content.replace(
        /<section id="projectsShowcase"[\s\S]*?<\/section>/,
        newSec
    );
    console.log("Section replaced successfully!");
} else {
    console.log("Could not find section target");
}

// 2. Replace script
const oldScript = `    <!-- 3D Books Showcase Data & Controller for Home Page -->
    <script id="homeBooksData" type="application/json"><%- JSON.stringify((typeof booksData !== 'undefined' && booksData) ? booksData : []).replace(/</g, '\\\\u003c') %></script>
    <script type="module">
        import { initBooksShowcase } from '/js/books-showcase.js';

        (function setupHomeShowcase() {
            const mount = document.getElementById('homeBooksShowcase');
            const dataEl = document.getElementById('homeBooksData');
            if (!mount || !dataEl) return;

            try {
                const books = JSON.parse(dataEl.textContent);
                initBooksShowcase(mount, {
                    books,
                    heroTitle: 'Works',
                    navTitle: 'Selected Projects',
                    showNav: true,
                    showDetailPanel: true,
                    showCarousel: true
                });
            } catch (err) {
                console.error('Error mounting Home 3D Books Showcase:', err);
            }
        })();
    </script>`;

const newScript = `    <!-- Project Showcase Data & Controllers (Desktop 3D Books + Mobile Motion Cards) -->
    <script id="homeBooksData" type="application/json"><%- JSON.stringify((typeof booksData !== 'undefined' && booksData) ? booksData : []).replace(/</g, '\\\\u003c') %></script>
    <script type="module">
        import { initBooksShowcase } from '/js/books-showcase.js';
        import { initMobileScrollCards } from '/js/scroll-cards.js';

        (function setupHomeShowcases() {
            const dataEl = document.getElementById('homeBooksData');
            if (!dataEl) return;

            let projects = [];
            try {
                projects = JSON.parse(dataEl.textContent);
            } catch (err) {
                console.error('Error parsing project data:', err);
                return;
            }

            // 1. Desktop: Initialize 3D Books Showcase
            const desktopMount = document.getElementById('homeBooksShowcase');
            if (desktopMount) {
                try {
                    initBooksShowcase(desktopMount, {
                        books: projects,
                        heroTitle: 'Works',
                        navTitle: 'Selected Projects',
                        showNav: true,
                        showDetailPanel: true,
                        showCarousel: true
                    });
                } catch (err) {
                    console.error('Error mounting Desktop 3D Books Showcase:', err);
                }
            }

            // 2. Mobile: Initialize Scroll-Triggered Motion Cards
            const mobileMount = document.getElementById('homeMobileCards');
            if (mobileMount) {
                try {
                    initMobileScrollCards(mobileMount, {
                        projects: projects,
                        title: 'Selected Projects',
                        subtitle: 'Scroll to explore projects'
                    });
                } catch (err) {
                    console.error('Error mounting Mobile Scroll Cards:', err);
                }
            }
        })();
    </script>`;

if (content.includes('setupHomeShowcase')) {
    content = content.replace(
        /<!-- 3D Books Showcase Data & Controller for Home Page -->[\s\S]*?<\/script>\s*<\/body>/,
        newScript + '\n</body>'
    );
    console.log("Script replaced successfully!");
} else {
    console.log("Could not find script target");
}

fs.writeFileSync('views/home/index.ejs', content, 'utf8');
console.log("views/home/index.ejs updated successfully!");

