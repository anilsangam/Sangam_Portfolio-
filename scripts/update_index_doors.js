const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'views', 'home', 'index.ejs');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove obsolete navm dialog
const navmRegex = /<!-- ============ NavMenu ============ -->[\s\S]*?<\/div>\s*<\/div>/;
if (navmRegex.test(content)) {
    content = content.replace(navmRegex, '');
    console.log('Removed obsolete navm markup');
} else {
    console.log('navm markup not found or already removed');
}

// 2. Replace doors wall markup to include tabs and pre-populated content above doors
const doorsWallOld = `<div class="shell doors__wall">
                    <h2 class="sr-only" id="doorsTitle">My work, one door per skill</h2>
                    <p class="paint" aria-hidden="true">
                        Magic happens <br class="mbr">behind the doors
                    </p>
                    <p class="doors__hint" aria-hidden="true">Swipe along the wall</p>
                    <div class="dinfo" id="dinfo" aria-live="polite">
                        <h3 class="dinfo__h"></h3>
                        <p class="dinfo__t"></p>
                        <ul class="dinfo__p"></ul>
                    </div>
                    <p class="doors__dots" aria-hidden="true"><i class="on"></i><i></i></p>
                    <ul class="doors__row">`;

const doorsWallNew = `<div class="shell doors__wall">
                    <h2 class="sr-only" id="doorsTitle">My work, one door per skill</h2>
                    <p class="paint" aria-hidden="true">
                        Magic happens <br class="mbr">behind the doors
                    </p>
                    <!-- Door info card placed directly ABOVE the doors -->
                    <div class="dinfo on" id="dinfo" aria-live="polite">
                        <div class="dinfo__tabs" role="tablist" aria-label="Select discipline">
                            <button type="button" class="dinfo__tab active" data-door-tab="0" role="tab" aria-selected="true">Web Development</button>
                            <button type="button" class="dinfo__tab" data-door-tab="1" role="tab" aria-selected="false">App Development</button>
                        </div>
                        <h3 class="dinfo__h">Web Development</h3>
                        <p class="dinfo__t">End to end, from sketch to live application</p>
                        <ul class="dinfo__p">
                            <li>Discovery &amp; planning</li>
                            <li>Full-stack Node.js &amp; MongoDB</li>
                            <li>REST APIs &amp; responsive frontend</li>
                            <li>Performance &amp; technical SEO</li>
                            <li>Launch &amp; support</li>
                        </ul>
                    </div>
                    <p class="doors__dots" aria-hidden="true"><i class="on"></i><i></i></p>
                    <ul class="doors__row" id="doorsRow">`;

if (content.includes(doorsWallOld.replace(/\r\n/g, '\n')) || content.includes(doorsWallOld.replace(/\n/g, '\r\n')) || content.includes(doorsWallOld)) {
    content = content.replace(doorsWallOld.replace(/\r\n/g, '\n'), doorsWallNew);
    content = content.replace(doorsWallOld.replace(/\n/g, '\r\n'), doorsWallNew);
    console.log('Replaced doors__wall markup successfully');
} else {
    // Regex fallback
    const wallRegex = /<div class="shell doors__wall">[\s\S]*?<ul class="doors__row">/;
    if (wallRegex.test(content)) {
        content = content.replace(wallRegex, doorsWallNew);
        console.log('Replaced doors__wall markup via regex');
    } else {
        console.log('doors__wall markup match failed');
    }
}

// 3. Replace old nav menu script that referenced non-existent #menuBtn
const oldNavScriptRegex = /\/\/ nav menu[\s\S]*?const CONTACT_EMAIL = \['rishithakor218', 'gmail\.com'\]\.join\('@'\);/;
const newNavScript = `// Global helper for opening modal or doors
        window.openModal = () => {
            const m = $('#modal');
            if (m) {
                m.hidden = false;
                m.classList.add('on');
                document.body.style.overflow = 'hidden';
            }
        };
        // request modal
        const CONTACT_EMAIL = ['asangam012', 'gmail.com'].join('@');`;

if (oldNavScriptRegex.test(content)) {
    content = content.replace(oldNavScriptRegex, newNavScript);
    console.log('Replaced old nav menu script successfully');
} else {
    console.log('Old nav menu script regex match failed');
}

// 4. Update initDoors logic to handle tab switching and direct mobile door selection
const oldSetInfoRegex = /const setInfo = i => \{[\s\S]*?\}\;\s*if \(canHover\) \{/;
const newSetInfo = `const setInfo = i => {
                if (!dinfo || !INFO[i]) return;
                const h = dinfo.querySelector('.dinfo__h');
                const t = dinfo.querySelector('.dinfo__t');
                const p = dinfo.querySelector('.dinfo__p');
                if (h) h.textContent = INFO[i][0];
                if (t) t.textContent = INFO[i][1];
                if (p) p.innerHTML = INFO[i][2].map(s => \`<li>\${s}</li>\`).join('');
                document.querySelectorAll('.dinfo__tab').forEach((b, k) => {
                    b.classList.toggle('active', k === i);
                    b.setAttribute('aria-selected', k === i ? 'true' : 'false');
                });
                units.forEach((u, k) => u.classList.toggle('on', k === i));
            };

            // Wire up interactive door tabs
            document.querySelectorAll('.dinfo__tab').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabIdx = parseInt(btn.dataset.doorTab, 10);
                    setInfo(tabIdx);
                });
            });

            // Initialize with Web Development
            setInfo(0);
            window.openDoor = (i) => enter(i);

            if (canHover) {`;

if (oldSetInfoRegex.test(content)) {
    content = content.replace(oldSetInfoRegex, newSetInfo);
    console.log('Updated setInfo and door tab listeners');
} else {
    console.log('setInfo regex match failed');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('index.ejs written successfully');

