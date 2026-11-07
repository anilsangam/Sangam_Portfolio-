const fs = require('fs');

const home = fs.readFileSync('portfolio/home.html', 'utf8');

const modalMatch = home.match(/<!-- ============ RequestModal ============ -->[\s\S]*?(?=<!-- ============ Ability card)/);
if (modalMatch) {
  console.log(modalMatch[0]);
} else {
  // search for RequestModal up to script
  const start = home.indexOf('<!-- ============ RequestModal ============ -->');
  const end = home.indexOf('<script', start);
  console.log(home.slice(start, end));
}

