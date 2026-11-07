const fs = require('fs');
let s = fs.readFileSync('views/home/index.ejs', 'utf8');

const target = '        <!-- ============ Doors ============ -->\r\n        <section id="works" class="doors"';
const replacement = `        <!-- ============ 3D Books Showcase: Selected Works ============ -->\r\n        <section id="projectsShowcase" class="books-showcase-section" aria-label="3D Selected Works Showcase">\r\n            <div id="homeBooksShowcase" class="books-showcase-mount"></div>\r\n        </section>\r\n\r\n        <!-- ============ Doors ============ -->\r\n        <section id="works" class="doors"`;

if (s.includes(target)) {
  s = s.replace(target, replacement);
  console.log('Inserted projectsShowcase in home index.ejs');
} else {
  // Try with \n
  const targetLF = '        <!-- ============ Doors ============ -->\n        <section id="works" class="doors"';
  const replacementLF = `        <!-- ============ 3D Books Showcase: Selected Works ============ -->\n        <section id="projectsShowcase" class="books-showcase-section" aria-label="3D Selected Works Showcase">\n            <div id="homeBooksShowcase" class="books-showcase-mount"></div>\n        </section>\n\n        <!-- ============ Doors ============ -->\n        <section id="works" class="doors"`;
  if (s.includes(targetLF)) {
    s = s.replace(targetLF, replacementLF);
    console.log('Inserted projectsShowcase with LF');
  } else {
    console.error('Target not found!');
  }
}

// Add script before </body>
const scriptTarget = '    </body>';
const scriptCode = `    <!-- 3D Books Showcase Data & Controller for Home Page -->
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

if (!s.includes('id="homeBooksData"') && s.includes(scriptTarget)) {
  s = s.replace(scriptTarget, scriptCode);
  console.log('Added homeBooksData script to home index.ejs');
}

fs.writeFileSync('views/home/index.ejs', s, 'utf8');
console.log('Successfully updated views/home/index.ejs');

