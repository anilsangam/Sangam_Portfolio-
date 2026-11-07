const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const profile = {
  fullName: 'Anil Sangam',
  headline: "Hi, I'm Anil Sangam. I'm a Software Developer.",
  subheadline: 'Building modern web and mobile applications using React, React Native, Node.js, Express.js and MongoDB.',
  email: 'asangam012@gmail.com',
  location: 'Bhopal, Madhya Pradesh, India',
  availabilityStatus: 'Open to opportunities',
  responseTime: 'Replies within 24 hours',
  socialLinks: { github: 'https://github.com/anilsangam', linkedin: 'https://www.linkedin.com/in/anil-sangam-019aa3386' }
};

const html = ejs.render(fs.readFileSync('views/home/index.ejs', 'utf8'), {
  profile,
  skills: [],
  experiences: [],
  projects: [],
  currentRoute: 'home',
  pageTitle: 'Anil Sangam | Portfolio',
  settings: {},
  siteSettings: {},
  isRoom: false,
  filename: path.join(__dirname, '../views/home/index.ejs')
});

const queries = [
  '.hdr', '#modal', '#reqForm', '#f-name', '#mForm', '#mSuccess', '#mSendLbl',
  '#mPanel', '#mClose', '#mDone', '#mOkT', '#mOkP', '.msuccess__alt', '#mSend',
  '#cal', '#figCanvas', '#fig', '#cordHit', '#cord', '.hdr .clock', '#works',
  '#doorCursor', '#dinfo', '.story'
];

for (const q of queries) {
  const isClass = q.startsWith('.');
  const isId = q.startsWith('#');
  const name = q.replace(/[.#]/g, '').split(' ')[0];
  const found = html.includes(name);
  console.log(`${q}: ${found ? 'FOUND' : 'MISSING'}`);
}
