const http = require('http');
const app = require('../server');

const PORT = 3001; // test port
process.env.PORT = PORT;

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n================ STARTING E2E TESTS ================');
  const server = app.listen(PORT);
  await new Promise(r => setTimeout(r, 1000));

  let passed = 0;
  let failed = 0;

  function assert(desc, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc} ${details}`);
      failed++;
    }
  }

  try {
    // 1. GET /
    const homeRes = await request({ hostname: 'localhost', port: PORT, path: '/', method: 'GET' });
    assert('GET / returns 200', homeRes.status === 200);
    assert('GET / has valid HTML title', homeRes.body.includes('<title>'));
    assert('GET / contains Web Development door', homeRes.body.includes('Web Developer'));
    assert('GET / contains App Development door', homeRes.body.includes('App Developer'));
    assert('GET / does NOT contain holoOpen button', !homeRes.body.includes('id="holoOpen"'));
    assert('GET / does NOT contain holo dialog', !homeRes.body.includes('id="holo"'));
    assert('GET / does NOT contain clock widget', !homeRes.body.includes('class="chip clock"'));
    assert('GET / does NOT contain UI/UX door', !homeRes.body.includes('aria-label="Open the UI/UX Designer door"'));
    assert('GET / does NOT contain Graphic Designer door', !homeRes.body.includes('aria-label="Open the Graphic Designer door"'));

    // 2. GET /web-developer
    const webRes = await request({ hostname: 'localhost', port: PORT, path: '/web-developer', method: 'GET' });
    assert('GET /web-developer returns 200', webRes.status === 200);
    assert('GET /web-developer renders title', webRes.body.includes('Freelance Web Developer'));
    assert('GET /web-developer renders project data', webRes.body.includes('Sundown Studio'));
    assert('GET /web-developer has no rn__clock', !webRes.body.includes('class="rn__clock"'));

    // 3. GET /app-developer
    const appRes = await request({ hostname: 'localhost', port: PORT, path: '/app-developer', method: 'GET' });
    assert('GET /app-developer returns 200', appRes.status === 200);
    assert('GET /app-developer renders title', appRes.body.includes('Freelance iOS App Developer'));
    assert('GET /app-developer renders app data', appRes.body.includes('Expense Tracker'));
    assert('GET /app-developer has no rn__clock', !appRes.body.includes('class="rn__clock"'));

    // 4. GET /admin/login
    const loginRes = await request({ hostname: 'localhost', port: PORT, path: '/admin/login', method: 'GET' });
    assert('GET /admin/login returns 200', loginRes.status === 200);
    assert('GET /admin/login has form', loginRes.body.includes('<form action="/admin/login"'));

    // 5. GET /admin/dashboard (unauthenticated)
    const unauthRes = await request({ hostname: 'localhost', port: PORT, path: '/admin/dashboard', method: 'GET' });
    assert('GET /admin/dashboard without auth redirects to /admin/login', unauthRes.status === 302 && unauthRes.headers.location === '/admin/login');

    // 6. POST /admin/login (authentication)
    const postLoginData = 'username=admin&password=Admin%40Rishi2026%21';
    const postLoginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postLoginData)
      }
    }, postLoginData);
    assert('POST /admin/login redirects after login', postLoginRes.status === 302);

    const cookie = postLoginRes.headers['set-cookie'] ? postLoginRes.headers['set-cookie'][0].split(';')[0] : '';
    assert('Session cookie received', Boolean(cookie));

    // 7. GET /admin/dashboard (authenticated)
    if (cookie) {
      const authDashRes = await request({
        hostname: 'localhost',
        port: PORT,
        path: '/admin/dashboard',
        method: 'GET',
        headers: { 'Cookie': cookie }
      });
      assert('GET /admin/dashboard with session cookie returns 200', authDashRes.status === 200);
      assert('Authenticated dashboard renders Overview and Projects', authDashRes.body.includes('Dashboard') && authDashRes.body.includes('Manage Projects'));
    }

    // 8. POST /contact (inquiry form)
    const contactData = JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Need a custom iOS and Web application.',
      budget: '$5,000 - $10,000'
    });
    const contactRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(contactData)
      }
    }, contactData);
    assert('POST /contact returns 200 JSON', contactRes.status === 200);
    assert('Contact response has success:true', contactRes.body.includes('"success":true'));

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n================ TEST SUMMARY ================`);
    console.log(`Total Passed: ${passed}`);
    console.log(`Total Failed: ${failed}`);
    console.log(`==============================================\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();

