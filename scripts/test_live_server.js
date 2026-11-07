const { spawn } = require('child_process');
const http = require('http');

const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit' });

function probe(urlPath) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + urlPath, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          status: res.statusCode,
          length: data.length,
          hasWorksInNav: (data.match(/<nav[\s\S]*?<\/nav>/i) || [''])[0].includes('/works') && !(data.match(/<nav[\s\S]*?<\/nav>/i) || [''])[0].includes('site-back-chip'),
          hasDoorTabs: data.includes('class="dinfo__tab'),
          hasSideBySideDoors: data.includes('id="doorsRow"'),
          title: (data.match(/<title>(.*?)<\/title>/) || [])[1]
        });
      });
    }).on('error', (err) => resolve({ path: urlPath, error: err.message }));
  });
}

setTimeout(async () => {
  console.log('\n--- PROBING RUNNING APPLICATION ---');
  const routes = ['/', '/web-developer', '/app-developer', '/about', '/works'];
  for (const r of routes) {
    const res = await probe(r);
    console.log(`Route: ${r.padEnd(16)} | Status: ${res.status} | Length: ${res.length} | DoorTabs: ${res.hasDoorTabs} | SideBySideDoors: ${res.hasSideBySideDoors}`);
  }
  console.log('-----------------------------------\n');
  server.kill('SIGINT');
  process.exit(0);
}, 3500);

