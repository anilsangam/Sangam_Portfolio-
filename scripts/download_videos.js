const fs = require('fs');
const https = require('https');

const BASE = 'https://therishithakor.com';
const videos = [
  { url: `${BASE}/app-developer/app-expense.mp4`, dest: 'public/images/app-expense.mp4' },
  { url: `${BASE}/app-developer/app-vault.mp4`, dest: 'public/images/app-vault.mp4' },
  { url: `${BASE}/app-developer/app-brick.mp4`, dest: 'public/images/app-brick.mp4' },
  { url: `${BASE}/app-developer/app-dice.mp4`, dest: 'public/images/app-dice.mp4' },
  { url: `${BASE}/web-developer/project-2.mp4`, dest: 'public/images/project-2.mp4' },
  { url: `${BASE}/web-developer/project-4.mp4`, dest: 'public/images/project-4.mp4' }
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
  for (const v of videos) {
    await download(v);
  }
}

run();

