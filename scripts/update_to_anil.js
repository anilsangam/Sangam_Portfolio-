const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'models/Profile.js',
  'models/SiteSettings.js',
  'views/partials/head.ejs',
  'views/partials/nav_drawer.ejs',
  'views/partials/footer.ejs',
  'views/home/index.ejs',
  'views/pages/web_developer.ejs',
  'views/pages/app_developer.ejs',
  'views/admin/dashboard.ejs',
  'views/admin/login.ejs',
  'controllers/homeController.js'
];

for (const rel of filesToUpdate) {
  const p = path.join('c:/my projects/portfolio', rel);
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');

  // Replace names and emails
  content = content.replace(/Rishi Thakor/g, 'Anil Sangam');
  content = content.replace(/rishi-mode/g, 'anil-mode');
  content = content.replace(/rishi-analytics/g, 'anil-analytics');
  content = content.replace(/rishithakor218@gmail\.com/g, 'asangam012@gmail.com');
  content = content.replace(/therishithakor\.com/g, 'anilsangam.dev');

  // In brands or hero greetings:
  content = content.replace(/Hi, I'm Rishi/g, "Hi, I'm Anil");
  content = content.replace(/>Rishi</g, '>Anil<');
  content = content.replace(/Designed and built by Rishi/g, 'Designed and built by Anil Sangam');

  fs.writeFileSync(p, content, 'utf8');
  console.log(`Updated: ${rel}`);
}

console.log('Site-wide update to Anil Sangam complete!');

