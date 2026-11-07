const fs = require('fs');

const home = fs.readFileSync('views/home/index.ejs', 'utf8');
const scripts = [...home.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];

console.log('Total scripts in views/home/index.ejs:', scripts.length);

scripts.forEach((s, i) => {
  const text = s[1].trim();
  if (!text || s[0].includes('importmap') || s[0].includes('ld+json')) return;
  try {
    new Function(text);
    console.log(`Script ${i+1}: Valid JS syntax (${text.length} chars)`);
  } catch (err) {
    console.error(`Script ${i+1} SYNTAX ERROR:`, err.message);
    // Find line
    const lines = text.split('\n');
    console.log('Around error:', lines.slice(0, 15).join('\n'));
  }
});

