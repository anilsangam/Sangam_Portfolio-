const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://therishithakor.com';

const items = [
  // fonts
  { url: `${BASE}/fonts/onest-latin.woff2`, dest: 'public/fonts/onest-latin.woff2' },
  { url: `${BASE}/fonts/onest-latin-ext.woff2`, dest: 'public/fonts/onest-latin-ext.woff2' },
  // vendor
  { url: `${BASE}/vendor/lenis.min.mjs`, dest: 'public/vendor/lenis.min.mjs' },
  // app dev assets
  { url: `${BASE}/app-developer/icon-expense.webp`, dest: 'public/images/icon-expense.webp' },
  { url: `${BASE}/app-developer/icon-vault.webp`, dest: 'public/images/icon-vault.webp' },
  { url: `${BASE}/app-developer/icon-brick.webp`, dest: 'public/images/icon-brick.webp' },
  { url: `${BASE}/app-developer/icon-dice.webp`, dest: 'public/images/icon-dice.webp' },
  { url: `${BASE}/app-developer/app-expense.webp`, dest: 'public/images/app-expense.webp' },
  { url: `${BASE}/app-developer/app-vault.webp`, dest: 'public/images/app-vault.webp' },
  { url: `${BASE}/app-developer/app-brick.webp`, dest: 'public/images/app-brick.webp' },
  { url: `${BASE}/app-developer/app-dice.webp`, dest: 'public/images/app-dice.webp' },
  // web dev assets
  { url: `${BASE}/web-developer/1-zerodha.webp`, dest: 'public/images/1-zerodha.webp' },
  { url: `${BASE}/web-developer/4-quicko-cg.webp`, dest: 'public/images/4-quicko-cg.webp' },
  { url: `${BASE}/web-developer/5-sandbox-cost.webp`, dest: 'public/images/5-sandbox-cost.webp' },
  { url: `${BASE}/web-developer/2-tax-pnl.webp`, dest: 'public/images/2-tax-pnl.webp' },
  { url: `${BASE}/web-developer/3-capital-gains.webp`, dest: 'public/images/3-capital-gains.webp' },
  { url: `${BASE}/web-developer/project-2.webp`, dest: 'public/images/project-2.webp' },
  { url: `${BASE}/web-developer/project-4.webp`, dest: 'public/images/project-4.webp' }
];

async function download(item) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(item.dest);
    https.get(item.url, res => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[OK] ${item.dest} (${fs.statSync(item.dest).size} bytes)`);
          resolve(true);
        });
      } else {
        file.close();
        if (fs.existsSync(item.dest)) fs.unlinkSync(item.dest);
        console.log(`[SKIP ${res.statusCode}] ${item.url}`);
        resolve(false);
      }
    }).on('error', err => {
      file.close();
      if (fs.existsSync(item.dest)) fs.unlinkSync(item.dest);
      console.log(`[ERR] ${item.url}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const it of items) {
    await download(it);
  }
  console.log('Download complete.');
}

run();

