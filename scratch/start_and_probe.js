const { spawn } = require('child_process');
const http = require('http');

console.log("Starting server process...");
const server = spawn('node', ['server.js'], { stdio: 'pipe' });

server.stdout.on('data', d => console.log('STDOUT:', d.toString().trim()));
server.stderr.on('data', d => console.error('STDERR:', d.toString().trim()));

function probe(url, retries = 10) {
    return new Promise((resolve, reject) => {
        const attempt = (n) => {
            http.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
            }).on('error', (err) => {
                if (n > 0) setTimeout(() => attempt(n - 1), 600);
                else reject(err);
            });
        };
        attempt(retries);
    });
}

(async () => {
    try {
        const res = await probe('http://127.0.0.1:3000/');
        console.log("SUCCESS! Server responded on / with HTTP", res.status, "Length:", res.length);
        const webRes = await probe('http://127.0.0.1:3000/web-developer');
        console.log("SUCCESS! Server responded on /web-developer with HTTP", webRes.status);
        const appRes = await probe('http://127.0.0.1:3000/app-developer');
        console.log("SUCCESS! Server responded on /app-developer with HTTP", appRes.status);
    } catch (err) {
        console.error("Probe failed:", err.message);
    } finally {
        server.kill();
        process.exit(0);
    }
})();

