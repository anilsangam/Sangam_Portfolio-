const fs = require('fs');

const app = fs.readFileSync('views/pages/app_developer.ejs', 'utf8');

// Check shimmering placeholder script
const placeholderMatch = app.match(/\/\/ every image and recording starts on a shimmering placeholder[\s\S]*?(?=\n\s*\(\s*\(\)\s*=>|\n\s*const|\n\s*let|\<\/script)/);
if (placeholderMatch) {
  console.log('=== Placeholder script ===');
  console.log(placeholderMatch[0]);
}

// Check video script
const videoMatch = app.match(/function pickVideo[\s\S]*?(?=\n\s*function|\n\s*const|\n\s*let|\<\/script)/);
if (videoMatch) {
  console.log('=== Video script ===');
  console.log(videoMatch[0].slice(0, 1000));
}

