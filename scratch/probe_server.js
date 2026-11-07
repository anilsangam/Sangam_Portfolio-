const http = require('http');

function check(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, length: data.length, snippet: data.substring(0, 300) }));
        }).on('error', reject);
    });
}

(async () => {
    try {
        const homeRes = await check('http://127.0.0.1:3000/');
        console.log("Home Page: Status", homeRes.status, "Length", homeRes.length);
        const webRes = await check('http://127.0.0.1:3000/web-developer');
        console.log("Web Developer: Status", webRes.status, "Length", webRes.length);
        const appRes = await check('http://127.0.0.1:3000/app-developer');
        console.log("App Developer: Status", appRes.status, "Length", appRes.length);
    } catch (err) {
        console.log("Server not reachable yet or offline:", err.message);
    }
})();

