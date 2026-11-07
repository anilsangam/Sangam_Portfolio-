const http = require('http');

const routes = ['/', '/works', '/about', '/web-developer', '/app-developer', '/admin/login'];

function checkRoute(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          length: data.length,
          hasLoader: data.includes('id="loader"'),
          hasPhotography: data.toLowerCase().includes('photographer') || data.toLowerCase().includes('photography'),
          title: (data.match(/<title>(.*?)<\/title>/) || [])[1]
        });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

(async () => {
  console.log('\n--- LIVE ROUTE VERIFICATION ---');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(`Route ${r.padEnd(16)} -> Status: ${res.status} | Length: ${res.length} | Loader: ${res.hasLoader} | Photography: ${res.hasPhotography} | Title: ${res.title}`);
  }
  console.log('-------------------------------\n');
})();

