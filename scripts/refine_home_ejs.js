const fs = require('fs');

let home = fs.readFileSync('views/home/index.ejs', 'utf8');

// Update MENU_ITEMS:
home = home.replace(
  "[['Home', 'home'], ['Web Development', 0], ['App Development', 1], ['UI/UX Design', 2], ['Graphic Design', 3], ['My story', 'about'], ['Contact', null]]",
  "[['Home', 'home'], ['Web Development', 0], ['App Development', 1], ['My story', 'about'], ['Contact', null]]"
);

// Update TITLES:
home = home.replace(
  "const TITLES = ['Web Development', 'App Development', 'UI/UX Design', 'Graphic Design', 'Photography'];",
  "const TITLES = ['Web Development', 'App Development', 'Photography'];"
);

// Update Hero text:
home = home.replace(
  '<span>Web · App · UI/UX · Graphic design</span>',
  '<span>Web · iOS App · Creative Direction</span>'
);

home = home.replace(
  "Hi, I'm Rishi. I am a photographer, graphic designer, UI/UX designer and developer.",
  "<%= (profile && profile.headline) || \"Hi, I'm Rishi. I am a photographer, web developer and iOS developer.\" %>"
);

// Update timeline experience items to be dynamic or clean
// Let's check the about section in views/home/index.ejs
fs.writeFileSync('views/home/index.ejs', home, 'utf8');
console.log('views/home/index.ejs refined!');

