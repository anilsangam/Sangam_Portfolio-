const fs = require('fs');

let home = fs.readFileSync('views/home/index.ejs', 'utf8');

// Replace NAV definition in views/home/index.ejs
home = home.replace(
  "const NAV = [['Home', 'home'], ['Web Development', 0], ['App Development', 1], ['My story', 'about'], ['Contact', null]];",
  "const NAV = [['Home', 'home'], ['Web Development', '/web-developer'], ['App Development', '/app-developer'], ['My story', 'about'], ['Contact', null]];"
);

// Update navList click listener in views/home/index.ejs
const oldNavClick = `$('#navList').addEventListener('click', e => {
            const b = e.target.closest('.navm__item');
            if (!b)
                return;
            const id = NAV[+b.dataset.i][1];
            closeNav( () => typeof id === 'number' ? window.openDoor?.(id) : id ? scrollToId(id) : openModal());
        }
        );`;

const newNavClick = `$('#navList').addEventListener('click', e => {
            const b = e.target.closest('.navm__item');
            if (!b)
                return;
            const target = NAV[+b.dataset.i][1];
            closeNav( () => {
                if (typeof target === 'string' && target.startsWith('/')) {
                    location.href = target;
                } else if (target === 'home') {
                    scrollToId('home');
                } else if (target === 'about') {
                    scrollToId('about');
                } else if (target === null) {
                    openModal();
                } else if (typeof target === 'number') {
                    window.openDoor?.(target);
                }
            });
        }
        );`;

home = home.replace(oldNavClick, newNavClick);

fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('views/home/index.ejs NAV array and click handler updated!');

