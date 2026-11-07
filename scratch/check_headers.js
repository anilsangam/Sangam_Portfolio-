const fs = require('fs');

['portfolio/home.html', 'portfolio/app_dev.html', 'portfolio/web_devloper.html'].forEach(f => {
    if (fs.existsSync(f)) {
        const c = fs.readFileSync(f, 'utf8');
        const hMatch = c.match(/<header[\s\S]*?<\/header>/);
        console.log(`=== HEADER IN ${f} ===`);
        if (hMatch) {
            console.log(hMatch[0].substring(0, 500) + '...');
        } else {
            console.log('No <header> found, checking top:');
            const topMatch = c.match(/<div class="top"[\s\S]*?<\/div>/);
            if (topMatch) console.log(topMatch[0]);
        }
    }
});

