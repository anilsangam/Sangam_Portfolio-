const fs = require('fs');
let s = fs.readFileSync('views/home/index.ejs', 'utf8');

const scriptCode = `
    <!-- 3D Books Showcase Data & Controller for Home Page -->
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
    </script>
</body>`;

const idx = s.lastIndexOf('</body>');
if (idx !== -1) {
  s = s.substring(0, idx) + scriptCode + s.substring(idx + 7);
  fs.writeFileSync('views/home/index.ejs', s, 'utf8');
  console.log('Successfully inserted script into views/home/index.ejs');
} else {
  console.error('</body> not found');
}

