const fs = require('fs');
const path = require('path');

// 1. Update dashboard.ejs
const dashPath = path.join(__dirname, '../views/admin/dashboard.ejs');
let dash = fs.readFileSync(dashPath, 'utf8');
dash = dash.replace(
  "Web Developer, App Developer, Photographer",
  "Software Developer, Web Developer, App Developer"
);
dash = dash.replace(
  '<option value="Photography">Photography</option>',
  '<option value="Backend & Database">Backend & Database</option>'
);
fs.writeFileSync(dashPath, dash, 'utf8');
console.log('Updated dashboard.ejs');

// 2. Update views/home/index.ejs line 29
const indexPath = path.join(__dirname, '../views/home/index.ejs');
let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace(
  '<%- (profile && profile.headline) || "Hi, I\'m Anil. I am a photographer, web developer and iOS developer." %>',
  '<%- (profile && profile.headline) || "Hi, I\'m Anil Sangam. I am a software developer, web developer and app developer." %>'
);
fs.writeFileSync(indexPath, index, 'utf8');
console.log('Updated index.ejs headline fallback');

