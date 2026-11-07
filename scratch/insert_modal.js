const fs = require('fs');

let home = fs.readFileSync('views/home/index.ejs', 'utf8');

// Insert contact_modal right before <script type="importmap">
const target = '<script type="importmap">';
const replacement = "<%- include('../partials/contact_modal') %>\n\n    <script type=\"importmap\">";

home = home.replace(target, replacement);

fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('Successfully inserted contact_modal into views/home/index.ejs');

