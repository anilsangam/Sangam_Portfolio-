const http = require('http');

http.get('http://127.0.0.1:3000/', (res) => {
    let html = '';
    res.on('data', d => html += d);
    res.on('end', () => {
        console.log("=== LIVE SERVER HOME PAGE CHECKS ===");
        console.log("Contains <header class=\"hdr rv\":", html.includes('class="hdr rv"'));
        console.log("Contains menuBtn:", html.includes('id="menuBtn"'));
        console.log("Contains navm drawer:", html.includes('id="navm"'));
        console.log("Contains clock widget:", html.includes('class="chip clock"'));
        console.log("Does NOT contain Works in nav:", !html.includes('>Works<'));
        console.log("Contains 3D books mount #homeBooksShowcase:", html.includes('id="homeBooksShowcase"'));
        console.log("Contains homeBooksData script:", html.includes('id="homeBooksData"'));
    });
});

