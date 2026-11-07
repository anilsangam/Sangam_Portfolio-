const http = require('http');

['/app-developer', '/web-developer'].forEach(path => {
    http.get('http://127.0.0.1:3000' + path, (res) => {
        let html = '';
        res.on('data', d => html += d);
        res.on('end', () => {
            console.log(`=== LIVE CHECK FOR ${path} ===`);
            console.log("Contains <header class=\"hdr rv\":", html.includes('class="hdr rv"'));
            console.log("Contains menuBtn:", html.includes('id="menuBtn"'));
            console.log("Contains navm drawer:", html.includes('id="navm"'));
            console.log("Contains clock widget:", html.includes('class="chip clock"'));
            console.log("Does NOT contain Works in nav:", !html.includes('>Works<'));
            console.log("Contains 3D books mount:", html.includes('BooksShowcase'));
        });
    });
});

