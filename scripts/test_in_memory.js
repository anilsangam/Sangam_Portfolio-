const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCE,
  DEFAULT_EDUCATION,
  DEFAULT_SKILLS
} = require('../scripts/seed');

async function testTemplates() {
  console.log('\n================ IN-PROCESS TEMPLATE & LOGIC TESTS ================');
  let passed = 0;
  let failed = 0;

  function assert(desc, condition, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc} ${details}`);
      failed++;
    }
  }

  const viewsDir = path.join(__dirname, '../views');

  let homeHtml = '';
  let webHtml = '';
  let appHtml = '';

  // Test 1: Home Page EJS Rendering
  try {
    const homeTemplate = fs.readFileSync(path.join(viewsDir, 'home/index.ejs'), 'utf8');
    homeHtml = ejs.render(homeTemplate, {
      pageTitle: 'Anil Sangam — Software & Web Developer',
      profile: DEFAULT_PROFILE,
      settings: {
        siteTitle: 'Anil Sangam — Software & Web Developer',
        metaDescription: 'Software Developer building modern web and mobile applications.'
      },
      experience: DEFAULT_EXPERIENCE,
      education: DEFAULT_EDUCATION,
      skills: DEFAULT_SKILLS,
      currentRoute: 'home',
      scrollToSection: '',
      openContact: false,
      isRoom: false
    }, {
      filename: path.join(viewsDir, 'home/index.ejs')
    });

    assert('Home index.ejs renders without errors', Boolean(homeHtml));
    assert('Home HTML does NOT contain doors section', !homeHtml.includes('class="doors"'));
    assert('Home HTML does NOT contain Magic happens behind the doors', !homeHtml.includes('Magic happens'));
    assert('Home HTML does NOT contain #loader screen', !homeHtml.includes('id="loader"'));
    assert('Home HTML does NOT contain Opening up the work text', !homeHtml.includes('Opening up the work'));
    assert('Home HTML does NOT contain Photographer door', !homeHtml.includes('Photographer'));
    assert('Home HTML does NOT contain holoOpen button', !homeHtml.includes('id="holoOpen"'));
    assert('Home HTML does NOT contain holo dialog', !homeHtml.includes('id="holo"'));
    assert('Home HTML contains clean clock widget matching portfolio/home.html', homeHtml.includes('class="chip clock"'));
    assert('Home HTML navbar does NOT contain Works link', !homeHtml.includes('>Works<'));
    assert('Home HTML does NOT contain UI/UX door', !homeHtml.includes('aria-label="Open the UI/UX Designer door"'));
    assert('Home HTML does NOT contain Graphic Designer door', !homeHtml.includes('aria-label="Open the Graphic Designer door"'));
    assert('Home HTML contains dynamic profile headline', homeHtml.includes(DEFAULT_PROFILE.headline));
  } catch (err) {
    assert('Home index.ejs renders without errors', false, err.message);
  }

  // Test 2: Web Developer Page EJS Rendering
  try {
    const webProjects = DEFAULT_PROJECTS.filter(p => p.category === 'web');
    const webTemplate = fs.readFileSync(path.join(viewsDir, 'pages/web_developer.ejs'), 'utf8');
    webHtml = ejs.render(webTemplate, {
      pageTitle: 'Freelance Web Developer — Anil Sangam',
      profile: DEFAULT_PROFILE,
      settings: {},
      projects: webProjects,
      currentRoute: 'web-developer',
      isRoom: true
    }, {
      filename: path.join(viewsDir, 'pages/web_developer.ejs')
    });

    assert('web_developer.ejs renders without errors', Boolean(webHtml));
    assert('web_developer.ejs contains project Nishad Aarakshan Sankalp', webHtml.includes('Nishad Aarakshan Sankalp'));
    assert('web_developer.ejs contains cards with seen on classes', webHtml.includes('seen on'));
    assert('web_developer.ejs links cleanly to home', webHtml.includes('href="/"'));
    assert('web_developer.ejs does NOT contain rn__clock', !webHtml.includes('class="rn__clock"'));
    assert('web_developer.ejs contains 3D Web showcase mount', webHtml.includes('id="webBooksShowcase"'));
  } catch (err) {
    assert('web_developer.ejs renders without errors', false, err.message);
  }

  // Test 3: App Developer Page EJS Rendering
  try {
    const appProjects = DEFAULT_PROJECTS.filter(p => p.category === 'app');
    const appTemplate = fs.readFileSync(path.join(viewsDir, 'pages/app_developer.ejs'), 'utf8');
    appHtml = ejs.render(appTemplate, {
      pageTitle: 'Freelance iOS App Developer — Anil Sangam',
      profile: DEFAULT_PROFILE,
      settings: {},
      projects: appProjects,
      currentRoute: 'app-developer',
      isRoom: true
    }, {
      filename: path.join(viewsDir, 'pages/app_developer.ejs')
    });

    assert('app_developer.ejs renders without errors', Boolean(appHtml));
    assert('app_developer.ejs contains project VIP Party Mobile App', appHtml.includes('VIP Party Mobile App'));
    assert('app_developer.ejs contains cards with seen on classes', appHtml.includes('seen on'));
    assert('app_developer.ejs links cleanly to home', appHtml.includes('href="/"'));
    assert('app_developer.ejs does NOT contain rn__clock', !appHtml.includes('class="rn__clock"'));
    assert('app_developer.ejs contains 3D App showcase mount', appHtml.includes('id="appBooksShowcase"'));
  } catch (err) {
    assert('app_developer.ejs renders without errors', false, err.message);
  }

  // Test 4: Admin Login Page EJS Rendering
  try {
    const loginTemplate = fs.readFileSync(path.join(viewsDir, 'admin/login.ejs'), 'utf8');
    const loginHtml = ejs.render(loginTemplate, {
      pageTitle: 'Admin Login',
      error: null,
      success: null
    }, {
      filename: path.join(viewsDir, 'admin/login.ejs')
    });

    assert('admin/login.ejs renders without errors', Boolean(loginHtml));
    assert('admin/login.ejs contains form action /admin/login', loginHtml.includes('action="/admin/login"'));
  } catch (err) {
    assert('admin/login.ejs renders without errors', false, err.message);
  }

  // Test 5: Admin Dashboard Page EJS Rendering
  try {
    const dashTemplate = fs.readFileSync(path.join(viewsDir, 'admin/dashboard.ejs'), 'utf8');
    const dashHtml = ejs.render(dashTemplate, {
      pageTitle: 'Admin Dashboard',
      adminUser: 'admin',
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      skills: DEFAULT_SKILLS,
      experience: DEFAULT_EXPERIENCE,
      education: DEFAULT_EDUCATION,
      inquiries: [],
      settings: {},
      msg: null
    }, {
      filename: path.join(viewsDir, 'admin/dashboard.ejs')
    });

    assert('admin/dashboard.ejs renders without errors', Boolean(dashHtml));
    assert('admin/dashboard.ejs displays project count', dashHtml.includes('Projects (' + DEFAULT_PROJECTS.length + ')'));
    assert('admin/dashboard.ejs contains Add Project form', dashHtml.includes('id="newProjectForm"'));
    assert('admin/dashboard.ejs does NOT contain Photography option', !dashHtml.includes('<option value="Photography">'));
  } catch (err) {
    assert('admin/dashboard.ejs renders without errors', false, err.message);
  }

  // Test 6: Preserved Reference Files
  assert('portfolio/home.html reference exists', fs.existsSync(path.join(__dirname, '../portfolio/home.html')));
  assert('portfolio/app_dev.html reference exists', fs.existsSync(path.join(__dirname, '../portfolio/app_dev.html')));
  assert('portfolio/web_devloper.html reference exists', fs.existsSync(path.join(__dirname, '../portfolio/web_devloper.html')));

  // Test 7: 3D Books Showcase & Mobile Scroll-Triggered Cards Assets
  assert('public/js/books-showcase.js exists', fs.existsSync(path.join(__dirname, '../public/js/books-showcase.js')));
  assert('public/css/books-showcase.css exists', fs.existsSync(path.join(__dirname, '../public/css/books-showcase.css')));
  assert('public/js/scroll-cards.js exists', fs.existsSync(path.join(__dirname, '../public/js/scroll-cards.js')));
  assert('public/css/scroll-cards.css exists', fs.existsSync(path.join(__dirname, '../public/css/scroll-cards.css')));
  assert('public/vendor/three.module.js exists', fs.existsSync(path.join(__dirname, '../public/vendor/three.module.js')));
  assert('services/projectService.js exists', fs.existsSync(path.join(__dirname, '../services/projectService.js')));
  assert('Home HTML contains mobile scroll cards mount', homeHtml.includes('id="homeMobileCards"'));
  assert('web_developer.ejs contains mobile scroll cards mount', webHtml.includes('id="webMobileCards"'));
  assert('app_developer.ejs contains mobile scroll cards mount', appHtml.includes('id="appMobileCards"'));

  const ProjectService = require('../services/projectService');
  const appBooks = ProjectService.formatForBooksShowcase(DEFAULT_PROJECTS.filter(p => p.category === 'app'), DEFAULT_PROFILE);
  assert('ProjectService formats app books correctly', appBooks.length === 2);
  assert('App books include mobile screenshot property', Boolean(appBooks[0].mobileScreenshot));
  assert('App books author set to Anil Sangam', appBooks[0].author === 'Anil Sangam');

  console.log(`\n================ TEST SUMMARY ================`);
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  console.log(`==============================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

testTemplates();
