import * as THREE from '/vendor/three.module.js';

/**
 * Vengeance UI 3D Books Showcase - Vanilla JS & Three.js Port
 * High-fidelity reproduction of the original books-showcase component
 */
export function initBooksShowcase(root, options = {}) {
  if (!root) return null;

  const books = options.books || [];
  const heroTitle = options.heroTitle || 'Projects';
  const navTitle = options.navTitle || 'Featured Works';
  const showNav = options.showNav !== undefined ? options.showNav : true;
  const showDetailPanel = options.showDetailPanel !== undefined ? options.showDetailPanel : true;
  const showCarousel = options.showCarousel !== undefined ? options.showCarousel : true;
  const onBookSelect = options.onBookSelect || null;

  if (books.length === 0) {
    root.innerHTML = '<div class="bs-empty">No projects published for 3D showcase.</div>';
    return null;
  }

  // Build DOM Structure for Showcase
  root.classList.add('book-showcase');
  root.setAttribute('tabindex', '0');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', `${heroTitle} 3D Showcase`);
  root.setAttribute('data-state', 'hero');

  root.innerHTML = `
    <!-- Background Hero Typography -->
    <div class="bs-hero-word" id="bsHeroWord" aria-hidden="true">
      <span>${heroTitle}</span>
    </div>

    <!-- WebGL Canvas -->
    <canvas class="bs-canvas" id="bsCanvas" aria-hidden="true"></canvas>

    <!-- Top Navigation -->
    ${showNav ? `
      <nav class="bs-nav" id="bsNav" aria-hidden="false">
        <div class="bs-nav__title">${navTitle}</div>
      </nav>
    ` : ''}

    <!-- Carousel Arrows -->
    ${showCarousel && books.length > 3 ? `
      <button type="button" class="bs-arrow bs-arrow--prev" id="bsPrevBtn" aria-label="Previous project">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button type="button" class="bs-arrow bs-arrow--next" id="bsNextBtn" aria-label="Next project">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    ` : ''}

    <!-- Floating Cursor "Open" Slip -->
    <button type="button" class="bs-open-slip" id="bsOpenSlip" tabindex="-1" aria-hidden="true">
      Open
    </button>

    <!-- Close Detail Button -->
    <button type="button" class="bs-close-btn" id="bsCloseBtn" aria-label="Close detail view">
      &#10005;
    </button>

    <!-- Detail Panel -->
    ${showDetailPanel ? `
      <div class="bs-detail-panel" id="bsDetailPanel" aria-live="polite">
        <div class="bs-dp__category" id="bsDpCategory"></div>
        <h1 class="bs-dp__title" id="bsDpTitle"></h1>
        <p class="bs-dp__desc" id="bsDpDesc"></p>
        
        <div class="bs-dp__meta" id="bsDpMeta">
          <div class="bs-dp__divider"></div>
          <div class="bs-dp__author" id="bsDpAuthor">Anil Sangam</div>
          <div class="bs-dp__year" id="bsDpYear"></div>
        </div>

        <div class="bs-dp__tags" id="bsDpTags"></div>

        <div class="bs-dp__actions" id="bsDpActions">
          <a class="bs-btn bs-btn--primary" id="bsLiveBtn" href="#" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span>Live</span>
          </a>
          <button class="bs-btn bs-btn--secondary" type="button" data-contact>Let's build</button>
        </div>
      </div>
    ` : ''}
  `;

  const canvasEl = root.querySelector('#bsCanvas');
  const openSlip = root.querySelector('#bsOpenSlip');
  const closeBtn = root.querySelector('#bsCloseBtn');
  const dpEl = root.querySelector('#bsDetailPanel');
  const heroWord = root.querySelector('#bsHeroWord');
  const prevBtn = root.querySelector('#bsPrevBtn');
  const nextBtn = root.querySelector('#bsNextBtn');

  const dpTitle = root.querySelector('#bsDpTitle');
  const dpDesc = root.querySelector('#bsDpDesc');
  const dpAuthor = root.querySelector('#bsDpAuthor');
  const dpYear = root.querySelector('#bsDpYear');
  const dpCategory = root.querySelector('#bsDpCategory');
  const dpTags = root.querySelector('#bsDpTags');
  const dpLiveBtn = root.querySelector('#bsLiveBtn');

  // Activate Hero word entrance
  requestAnimationFrame(() => {
    if (heroWord) heroWord.classList.add('visible');
  });

  // Utilities
  let cancelled = false;
  const timeouts = [];
  const setT = (fn, ms) => {
    const id = setTimeout(() => {
      if (!cancelled) fn();
    }, ms);
    timeouts.push(id);
    return id;
  };

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPowerDevice = RM || window.matchMedia('(max-width: 900px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Spring class - 2nd-order damped harmonic oscillator
  class Spring {
    constructor(v, k = 120, d = 14) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      this.k = k;
      this.d = d;
    }
    set(v) {
      this.v = v;
      this.t = v;
      this.vel = 0;
      return this;
    }
    update(dt) {
      const a = this.k * (this.t - this.v) - this.d * this.vel;
      this.vel += a * dt;
      this.v += this.vel * dt;
      return this.v;
    }
  }

  function mkCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function drawSpaced(x, text, cx, y, ls) {
    const prev = x.textAlign;
    x.textAlign = 'left';
    const chars = [...text];
    let tot = 0;
    const ws = chars.map((ch) => {
      const w = x.measureText(ch).width;
      tot += w;
      return w;
    });
    tot += ls * (chars.length - 1);
    let px = cx - tot / 2;
    chars.forEach((ch, i) => {
      x.fillText(ch, px, y);
      px += ws[i] + ls;
    });
    x.textAlign = prev;
  }

  function rr(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  // WebGL Renderer Setup
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !lowPowerDevice, alpha: true });
  } catch (err) {
    console.warn('BooksShowcase: WebGL initialization failed', err);
    root.innerHTML = '<div class="bs-fallback">WebGL is required for 3D showcase.</div>';
    return null;
  }

  const dims = { w: 0, h: 0 };
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.enabled = !lowPowerDevice;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const ANISO = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0.1, 9.6);

  // Procedural Studio Environment Gradient Map
  function envBlob(x, cx, cy, r, rgb, a) {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g;
    x.beginPath();
    x.arc(cx, cy, r, 0, 6.2832);
    x.fill();
  }

  (function buildEnv() {
    const c = mkCanvas(512, 256);
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#5a6ba6');
    g.addColorStop(0.55, '#262e52');
    g.addColorStop(1, '#0a0d1d');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 256);
    envBlob(x, 140, 66, 95, '255,255,255', 0.95);
    envBlob(x, 405, 84, 55, '255,214,168', 0.55);
    envBlob(x, 256, 150, 120, '255,155,185', 0.28);
    const tx = new THREE.CanvasTexture(c);
    tx.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(tx).texture;
    tx.dispose();
    pmrem.dispose();
  })();

  // Lighting
  const hemi = new THREE.HemisphereLight(0x8fa0d8, 0x0d1024, 0.32);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(3.5, 5, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const fillLight = new THREE.DirectionalLight(0xa9b6ff, 0.22);
  fillLight.position.set(-4, 1, 4);
  scene.add(fillLight);

  const rim = new THREE.DirectionalLight(0xff9db8, 0.32);
  rim.position.set(-2, 3, -5);
  scene.add(rim);

  const bookRoot = new THREE.Group();
  scene.add(bookRoot);

  function tex(c) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = ANISO;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }

  function noiseTexture(base, amp, scratches) {
    const s = 256, c = mkCanvas(s, s), x = c.getContext('2d');
    const img = x.createImageData(s, s), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = base + (Math.random() - 0.5) * 2 * amp;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    if (scratches) {
      x.strokeStyle = 'rgba(200,200,200,.25)';
      x.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        x.beginPath();
        const y = Math.random() * s;
        x.moveTo(0, y);
        x.lineTo(s, y + (Math.random() - 0.5) * 22);
        x.stroke();
      }
    }
    return new THREE.CanvasTexture(c);
  }

  const laminateBump = noiseTexture(128, 10, true);
  const clothBump = (function () {
    const s = 128, c = mkCanvas(s, s), x = c.getContext('2d');
    x.fillStyle = '#808080';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < s; i += 2) {
      x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.22)';
      x.fillRect(i, 0, 1, s);
      x.fillRect(0, i, s, 1);
    }
    return new THREE.CanvasTexture(c);
  })();

  function striationTexture(vertical) {
    const s = 512, c = mkCanvas(s, s), x = c.getContext('2d');
    x.fillStyle = '#ece4d2';
    x.fillRect(0, 0, s, s);
    let p = 0;
    while (p < s) {
      const w = 1 + Math.random() * 2.4, tone = Math.random();
      x.fillStyle = tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
      if (vertical) x.fillRect(p, 0, w, s);
      else x.fillRect(0, p, s, w);
      p += w + 0.6 + Math.random() * 1.6;
    }
    for (let i = 0; i < 2600; i++) {
      x.fillStyle = `rgba(120,108,84,${(Math.random() * 0.1).toFixed(3)})`;
      x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
    }
    return tex(c);
  }
  const striV = striationTexture(true);
  const striH = striationTexture(false);

  const endpaperTex = (function () {
    const s = 512, c = mkCanvas(s, s), x = c.getContext('2d');
    x.fillStyle = '#f3edde';
    x.fillRect(0, 0, s, s);
    for (let i = 0; i < 1400; i++) {
      x.fillStyle = `rgba(120,105,70,${(0.04 + Math.random() * 0.08).toFixed(3)})`;
      x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
    }
    const g = x.createLinearGradient(0, 0, s, 0);
    g.addColorStop(0, 'rgba(0,0,0,.08)');
    g.addColorStop(0.12, 'rgba(0,0,0,0)');
    g.addColorStop(0.88, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,.08)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return tex(c);
  })();

  const blobTex = (function () {
    const s = 256, c = mkCanvas(s, s), x = c.getContext('2d');
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(0,0,0,.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(c);
  })();

  function loadOrPaint(material, imageURL, paintFallback) {
    material.map = tex(paintFallback());
    material.needsUpdate = true;
    if (!imageURL) return;
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(
      imageURL,
      (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = ANISO;
        material.map = t;
        material.needsUpdate = true;
      },
      undefined,
      () => console.warn('Cover image fallback used for:', imageURL)
    );
  }

  // Cover Painters
  function paintDefaultFront(x, w, h, o) {
    const bgGrad = x.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, o.bg);
    bgGrad.addColorStop(1, '#0c101d');
    x.fillStyle = bgGrad;
    x.fillRect(0, 0, w, h);

    // Decorative geometric corner borders
    x.strokeStyle = 'rgba(255,255,255,0.22)';
    x.lineWidth = 3;
    x.strokeRect(52, 52, w - 104, h - 104);
    x.strokeStyle = 'rgba(255,255,255,0.08)';
    x.lineWidth = 1;
    x.strokeRect(66, 66, w - 132, h - 132);

    // Subtle texture noise
    x.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 50; i++) x.fillRect(Math.random() * w, Math.random() * h, 3, 3);

    // Project Category badge
    x.fillStyle = o.themeInk || '#f591ac';
    x.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    x.textAlign = 'center';
    x.fillText((o.kind || 'PORTFOLIO PROJECT').toUpperCase(), w / 2, 170);

    // Title
    x.fillStyle = '#ffffff';
    x.font = '700 78px Georgia, serif';
    const words = o.title.split(' ');
    let line = '';
    const lines = [];
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (x.measureText(test).width > w * 0.78 && line) {
        lines.push(line);
        line = word;
      } else line = test;
    });
    if (line) lines.push(line);

    const startY = h * 0.44 - ((lines.length - 1) * 92) / 2;
    lines.forEach((l, i) => x.fillText(l, w / 2, startY + i * 92));

    // Author
    x.font = 'italic 38px Georgia, serif';
    x.fillStyle = 'rgba(255,255,255,0.85)';
    x.fillText(o.author, w / 2, startY + lines.length * 92 + 70);

    // Decorative Emblem
    x.strokeStyle = o.themeInk || '#f591ac';
    x.lineWidth = 2;
    x.beginPath();
    x.arc(w / 2, h - 180, 24, 0, 6.2832);
    x.stroke();
    x.fillStyle = o.themeInk || '#f591ac';
    x.font = '600 20px sans-serif';
    x.fillText('★', w / 2, h - 173);
  }

  function paintBack(x, w, h, o) {
    x.fillStyle = o.backBg;
    x.fillRect(0, 0, w, h);
    const ink = o.backInk;

    // Heading block
    x.fillStyle = `rgba(${ink},.5)`;
    rr(x, 140, 180, w - 440, 26, 13);
    x.fill();

    // Summary lines
    for (let i = 0; i < 9; i++) {
      const lw = i === 8 ? w - 540 : w - 280 - Math.random() * 160;
      x.fillStyle = `rgba(${ink},.22)`;
      rr(x, 140, 280 + i * 54, lw, 14, 7);
      x.fill();
    }

    // Emblem
    x.fillStyle = `rgba(${ink},.45)`;
    x.beginPath();
    x.arc(170, h - 186, 26, 0, 6.2832);
    x.fill();

    // Barcode box
    x.fillStyle = '#fff';
    rr(x, w - 340, h - 260, 240, 150, 8);
    x.fill();
    x.fillStyle = '#111';
    let bx = w - 320;
    while (bx < w - 120) {
      const bw = 2 + Math.random() * 6;
      if (Math.random() > 0.42) x.fillRect(bx, h - 240, bw, 92);
      bx += bw + 2 + Math.random() * 4;
    }
    x.font = '500 20px monospace';
    x.textAlign = 'center';
    x.fillText('ANIL-SANGAM-2025', w - 220, h - 124);
    x.textAlign = 'left';
  }

  function paintSpine(x, w, h, o) {
    x.fillStyle = o.spineBg;
    x.fillRect(0, 0, w, h);
    x.save();
    x.translate(w / 2, h / 2);
    x.rotate(Math.PI / 2);
    x.fillStyle = o.spineInk;
    x.font = o.spineFont;
    drawSpaced(x, o.title.toUpperCase(), -h * 0.1, 15, 6);
    x.globalAlpha = 0.85;
    x.font = '600 24px Arial, sans-serif';
    drawSpaced(x, o.author.toUpperCase(), h * 0.32, 9, 4);
    x.globalAlpha = 1;
    x.restore();
    x.fillStyle = o.spineInk;
    x.globalAlpha = 0.6;
    x.fillRect(w / 2 - 26, 90, 52, 3);
    x.fillRect(w / 2 - 26, h - 95, 52, 3);
    x.globalAlpha = 1;
  }

  // ============================================================
  // SPECIAL MOBILE UI SCREENSHOT OPEN-PAGE TEXTURE
  // When book opens, page 0 renders a sleek mobile app UI mockup!
  // ============================================================
  function makeAppPageTex(cfg) {
    const w = 1024, h = 1536;
    const c = mkCanvas(w, h);
    const x = c.getContext('2d');

    // Website projects show the complete page capture on the book leaf, not inside a phone frame.
    if (cfg.category === 'web') {
      x.fillStyle = '#f6f4ef';
      x.fillRect(0, 0, w, h);
      const pageTexture = tex(c);
      const siteCapture = cfg.websiteScreenshot || cfg.mobileScreenshot || cfg.images?.front || cfg.coverURL;
      if (siteCapture) {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          if (cancelled) return;
          const maxW = w - 96, maxH = h - 112;
          const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
          const drawW = image.naturalWidth * scale;
          const drawH = image.naturalHeight * scale;
          x.fillStyle = '#fff';
          x.fillRect((w - drawW) / 2 - 4, (h - drawH) / 2 - 4, drawW + 8, drawH + 8);
          x.drawImage(image, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH);
          pageTexture.needsUpdate = true;
        };
        image.src = siteCapture;
      }
      return pageTexture;
    }

    // Page parchment backing
    x.fillStyle = '#f6f1e3';
    x.fillRect(0, 0, w, h);

    // Subtle paper grain
    x.fillStyle = 'rgba(130,110,80,0.06)';
    for (let i = 0; i < 1800; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);

    // Vignette on spine side
    const vGrad = x.createLinearGradient(0, 0, 160, 0);
    vGrad.addColorStop(0, 'rgba(0,0,0,0.12)');
    vGrad.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = vGrad;
    x.fillRect(0, 0, 160, h);

    // App header title & tag
    x.fillStyle = '#1e2438';
    x.font = '700 48px Georgia, serif';
    x.textAlign = 'center';
    x.fillText(cfg.title, w / 2, 110);

    x.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    x.fillStyle = '#6b7a99';
    x.fillText((cfg.kind || 'MOBILE APPLICATION BUILD').toUpperCase(), w / 2, 150);

    // Realistic Smartphone Device Mockup
    const pw = 580;
    const ph = 1180;
    const px = (w - pw) / 2;
    const py = 190;
    const pr = 48; // corner radius

    // Drop shadow under phone frame
    x.save();
    x.shadowColor = 'rgba(0, 0, 0, 0.35)';
    x.shadowBlur = 45;
    x.shadowOffsetY = 24;
    x.fillStyle = '#121520';
    rr(x, px, py, pw, ph, pr);
    x.fill();
    x.restore();

    // Outer Bezel
    x.fillStyle = '#1c2233';
    x.strokeStyle = '#343e5c';
    x.lineWidth = 4;
    rr(x, px, py, pw, ph, pr);
    x.fill();
    x.stroke();

    // Screen area
    const screenInset = 16;
    const sx = px + screenInset;
    const sy = py + screenInset;
    const sw = pw - screenInset * 2;
    const sh = ph - screenInset * 2;
    const sr = pr - 8;

    x.save();
    rr(x, sx, sy, sw, sh, sr);
    x.clip();

    // Screen background gradient
    const screenBg = x.createLinearGradient(sx, sy, sx, sy + sh);
    screenBg.addColorStop(0, '#101424');
    screenBg.addColorStop(1, '#1b2238');
    x.fillStyle = screenBg;
    x.fillRect(sx, sy, sw, sh);

    // Placeholder UI until image loads (or if no image)
    // Status Bar
    x.fillStyle = 'rgba(255,255,255,0.75)';
    x.font = '600 18px -apple-system, sans-serif';
    x.textAlign = 'left';
    x.fillText('9:41', sx + 32, sy + 38);
    x.textAlign = 'right';
    x.fillText('100% ⚡', sx + sw - 32, sy + 38);

    // Dynamic Island / Speaker Notch
    x.fillStyle = '#080a12';
    rr(x, sx + sw / 2 - 70, sy + 18, 140, 32, 16);
    x.fill();

    // App UI Hero Header
    x.fillStyle = 'rgba(255,255,255,0.06)';
    rr(x, sx + 24, sy + 76, sw - 48, 160, 24);
    x.fill();

    x.fillStyle = '#ffffff';
    x.font = '700 28px -apple-system, sans-serif';
    x.textAlign = 'left';
    x.fillText(cfg.title, sx + 44, sy + 130);

    x.font = '400 18px -apple-system, sans-serif';
    x.fillStyle = '#94a3b8';
    x.fillText(cfg.subTitle || 'Expo · React Native · Node.js', sx + 44, sy + 168);

    // Feature Cards
    const list = (cfg.chapters && cfg.chapters.length) ? cfg.chapters.slice(0, 5) : ['Authentication', 'Realtime DB', 'Interactive UI', 'Push Alerts', 'Cloud Sync'];
    list.forEach((feat, fi) => {
      const cardY = sy + 260 + fi * 120;
      x.fillStyle = 'rgba(255,255,255,0.04)';
      rr(x, sx + 24, cardY, sw - 48, 100, 20);
      x.fill();

      // Icon circle
      x.fillStyle = '#38bdf8';
      x.beginPath();
      x.arc(sx + 64, cardY + 50, 22, 0, 6.2832);
      x.fill();
      x.fillStyle = '#0f172a';
      x.font = '700 18px sans-serif';
      x.textAlign = 'center';
      x.fillText(String(fi + 1), sx + 64, cardY + 56);

      // Feature text
      x.fillStyle = '#f8fafc';
      x.font = '600 22px -apple-system, sans-serif';
      x.textAlign = 'left';
      x.fillText(feat, sx + 104, cardY + 48);

      x.font = '400 16px -apple-system, sans-serif';
      x.fillStyle = '#64748b';
      x.fillText('Optimized mobile component', sx + 104, cardY + 76);
    });

    // Bottom Navigation Bar in Phone
    x.fillStyle = 'rgba(15, 23, 42, 0.95)';
    x.fillRect(sx, sy + sh - 90, sw, 90);
    x.fillStyle = '#38bdf8';
    x.beginPath();
    x.arc(sx + sw / 2, sy + sh - 45, 24, 0, 6.2832);
    x.fill();
    x.fillStyle = '#ffffff';
    x.font = '700 24px sans-serif';
    x.textAlign = 'center';
    x.fillText('✦', sx + sw / 2, sy + sh - 37);

    // Home Indicator Bar
    x.fillStyle = '#ffffff';
    rr(x, sx + sw / 2 - 80, sy + sh - 16, 160, 6, 3);
    x.fill();

    x.restore();

    // Create texture and asynchronously load the project's actual mobile screenshot
    const canvasTexture = tex(c);
    const shotUrl = cfg.mobileScreenshot || cfg.images?.front || cfg.coverURL;

    if (shotUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (cancelled) return;
        x.save();
        rr(x, sx, sy, sw, sh, sr);
        x.clip();
        x.drawImage(img, sx, sy, sw, sh);

        // Re-draw clean status notch on top of screenshot
        x.fillStyle = '#080a12';
        rr(x, sx + sw / 2 - 70, sy + 14, 140, 30, 15);
        x.fill();
        x.fillStyle = '#ffffff';
        rr(x, sx + sw / 2 - 80, sy + sh - 16, 160, 6, 3);
        x.fill();
        x.restore();

        canvasTexture.needsUpdate = true;
      };
      img.src = shotUrl;
    }

    return canvasTexture;
  }

  // Book Rigging
  const N = books.length;
  const VISIBLE = Math.min(3, N);

  const W = 1.42, H = 2.14, T = 0.34, CT = 0.032, OV = 0.05;
  const PAGE_N = lowPowerDevice ? 6 : 10;
  const BACK_PAGE_N = lowPowerDevice ? 3 : 5;
  const PW = W - 0.02, PH = H - 0.02;
  const BLOCK_D = 0.245;
  const BLOCK_Z = -0.0205;
  const PIVOT_Z = T / 2 + CT / 2;
  const BPIVOT_Z = -(T / 2 + CT / 2);
  const HINGE_OVERLAP = 0.05;

  const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
  const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
  const pageGeo = new THREE.PlaneGeometry(PW, PH);
  const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
  const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
  const blobGeo = new THREE.PlaneGeometry(1, 1);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });

  function std(o) {
    return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
  }

  const paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
  const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
  const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
  const endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
  const pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map((c) =>
    std({ color: c, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide })
  );

  const bookInstances = [];
  const hitMeshes = [];

  function buildBook(cfg, index) {
    const root = new THREE.Group();
    const float = new THREE.Group();
    root.add(float);
    bookRoot.add(root);

    // Special App Screenshot Page Texture for the open page
    const openPageMat = std({ map: makeAppPageTex(cfg), roughness: 0.88, envMapIntensity: 0.22, side: THREE.DoubleSide });

    const edgeColor = cfg.edge ?? '#eee4cf';
    const mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.68, envMapIntensity: 0.3 });
    const mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.54, envMapIntensity: 0.28 });
    const mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.58, envMapIntensity: 0.26 });
    const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.78, envMapIntensity: 0.22 });

    loadOrPaint(mFront, cfg.images?.front ?? cfg.coverURL ?? null, () => {
      const c = mkCanvas(1024, 1536);
      const ctx = c.getContext('2d');
      paintDefaultFront(ctx, 1024, 1536, {
        title: cfg.title,
        author: cfg.author,
        bg: cfg.spineBg ?? cfg.backBg ?? '#1e2438',
        kind: cfg.kind,
        themeInk: cfg.themeInk
      });
      return c;
    });

    loadOrPaint(mBack, cfg.images?.back ?? null, () => {
      const c = mkCanvas(1024, 1536);
      const ctx = c.getContext('2d');
      paintBack(ctx, 1024, 1536, { backBg: cfg.backBg ?? '#1e2438', backInk: cfg.backInk ?? '255,255,255' });
      return c;
    });

    loadOrPaint(mSpine, cfg.images?.spine ?? null, () => {
      const c = mkCanvas(220, 1536);
      const ctx = c.getContext('2d');
      paintSpine(ctx, 220, 1536, {
        spineBg: cfg.spineBg ?? cfg.backBg ?? '#141829',
        spineInk: cfg.spineInk ?? '#ffffff',
        spineFont: cfg.spineFont ?? '700 42px Georgia, serif',
        title: cfg.title,
        author: cfg.author
      });
      return c;
    });

    const backPivot = new THREE.Group();
    backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
    const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
    backMesh.position.x = (W + OV) / 2;
    backMesh.castShadow = backMesh.receiveShadow = true;
    backPivot.add(backMesh);
    float.add(backPivot);

    const pivot = new THREE.Group();
    pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
    const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
    frontMesh.position.x = (W + OV) / 2;
    frontMesh.castShadow = frontMesh.receiveShadow = true;
    pivot.add(frontMesh);
    float.add(pivot);

    const spine = new THREE.Mesh(spineGeo, mSpine);
    spine.position.set(-W / 2 - 0.013, 0, 0);
    spine.castShadow = true;
    float.add(spine);

    const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
    block.position.set(-0.0075, 0, BLOCK_Z);
    block.castShadow = block.receiveShadow = true;
    float.add(block);

    // Front Pages (First page is the high-res app screenshot!)
    const pages = [], pageF = [];
    for (let i = 0; i < PAGE_N; i++) {
      const pp = new THREE.Group();
      pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
      const pm = new THREE.Mesh(pageGeo, i === 0 ? openPageMat : pageMats[i % 3]);
      pm.position.x = PW / 2;
      pm.rotation.z = (Math.random() - 0.5) * 0.006;
      pp.add(pm);
      float.add(pp);
      pages.push(pp);
      pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
    }

    // Back Pages
    const pagesB = [], pageFB = [];
    for (let i = 0; i < BACK_PAGE_N; i++) {
      const pp = new THREE.Group();
      pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + i * 0.0042);
      const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
      pm.position.x = PW / 2;
      pm.rotation.z = (Math.random() - 0.5) * 0.006;
      pp.add(pm);
      float.add(pp);
      pagesB.push(pp);
      pageFB.push(0.3 * Math.pow(1 - i / BACK_PAGE_N, 2.6));
    }

    // Ground shadow blob
    const blob = new THREE.Mesh(
      blobGeo,
      new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.45, depthWrite: false })
    );
    blob.scale.set(3.1, 3.9, 1);
    blob.position.set(0.1, -0.3, -0.85);
    blob.renderOrder = -5;
    root.add(blob);

    // Invisible Hit Box for Raycasting
    const hit = new THREE.Mesh(hitGeo, hitMat);
    float.add(hit);

    const springs = {
      px: new Spring(0, 17, 6.8),
      py: new Spring(0, 17, 6.8),
      pz: new Spring(0, 17, 6.8),
      rx: new Spring(0, 17, 6.8),
      ry: new Spring(0, 17, 6.8),
      rz: new Spring(0, 17, 6.8),
      sc: new Spring(1, 17, 6.8),
      tiltX: new Spring(0, 120, 13),
      tiltY: new Spring(0, 120, 13),
      lift: new Spring(0, 120, 13),
      cover: new Spring(0, 90, 12),
      coverB: new Spring(0, 90, 12),
      drag: new Spring(0, 160, 16)
    };

    const b = {
      cfg,
      index,
      root,
      float,
      pivot,
      backPivot,
      frontMesh,
      spine,
      block,
      pages,
      pageF,
      pagesB,
      pageFB,
      hit,
      springs,
      phase: Math.random() * 6.28,
      slotScale: 1,
      hitEdge: null,
      scr: { x: 0, y: 0 },
      orbY: 0,
      orbYv: 0,
      orbPhase: 'idle',
      orbTarget: 0,
      orbXs: new Spring(0, 60, 12),
      exit: null
    };
    bookInstances.push(b);
    return b;
  }

  books.forEach(buildBook);
  const bookByHit = (m) => bookInstances.find((b) => b.hit === m);

  // Floating Leaves
  const leaves = {
    items: [],
    anchor: null,
    activate(book) {
      this.anchor = book;
      this.items.forEach((l) => {
        l.kick.set(-l.hx + (Math.random() - 0.5) * 0.6, -l.hy + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.5);
        l.s.t = l.size;
        l.mesh.visible = true;
      });
    },
    deactivate() {
      this.items.forEach((l) => {
        l.s.t = 0;
      });
    },
    push(dx, dy) {
      if (!this.anchor) return;
      this.items.forEach((l) => {
        l.kick.x += dx * 2.4 * Math.random();
        l.kick.y += -dy * 2.4 * Math.random();
      });
    },
    update(dt, t) {
      if (!this.anchor) return;
      const ap = this.anchor.root.position;
      const w = RM ? 0.15 : 1;
      this.items.forEach((l) => {
        l.kick.multiplyScalar(Math.exp(-1.15 * dt));
        l.mesh.position.set(
          ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.4 * w + l.kick.x,
          ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.3 * w + l.kick.y,
          ap.z * 0.4 + l.hz + l.kick.z
        );
        l.mesh.rotation.x += l.rv.x * dt * (0.3 + w);
        l.mesh.rotation.y += l.rv.y * dt * (0.3 + w);
        l.mesh.rotation.z += l.rv.z * dt * (0.3 + w);
        const s = l.s.update(dt);
        l.mesh.scale.setScalar(Math.max(s, 0.0001));
        if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
      });
    }
  };

  (function buildLeaves() {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.bezierCurveTo(0.3, -0.28, 0.3, 0.22, 0, 0.55);
    shape.bezierCurveTo(-0.3, 0.22, -0.3, -0.28, 0, -0.5);
    const geo = new THREE.ShapeGeometry(shape, 10);
    const cols = [0x3e7c3f, 0x57944a, 0x2f6136, 0x6aa557];
    for (let i = 0; i < 16; i++) {
      const mat = std({ color: cols[i % 4], roughness: 0.55, envMapIntensity: 0.3, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      bookRoot.add(mesh);
      let hx = (Math.random() - 0.5) * 4.6;
      if (i % 5 === 0) hx += 2.8 * Math.sign(hx || 1);
      leaves.items.push({
        mesh,
        hx,
        hy: (Math.random() - 0.5) * 3.2,
        hz: -0.5 + Math.random() * 1.5,
        sp: 0.25 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        rv: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
        kick: new THREE.Vector3(),
        size: 0.14 + Math.random() * 0.16,
        s: new Spring(0, 60, 10)
      });
    }
  })();

  // Layout slots & State machine
  const state = {
    mode: 'hero',
    selected: null,
    hovered: null,
    pillLock: null,
    kbIndex: -1
  };

  const SLOTS = { hero: [], detail: null, portrait: false };

  function computeSlots() {
    const a = dims.w / Math.max(1, dims.h);
    const portrait = a < 0.85;
    const fit = portrait ? clamp(a / 0.95, 0.44, 0.82) : clamp(a / 1.62, 0.52, 1);
    bookRoot.scale.setScalar(fit);
    bookRoot.position.y = portrait ? 0.08 : -(1 - fit) * 0.28;
    SLOTS.portrait = portrait;

    SLOTS.hero = SLOTS.portrait
      ? [
        { p: [-1.15, -0.42, -0.18], r: [-0.04, 0.36, 0.15], s: 1.08 },
        { p: [0.0, -0.12, 0.65], r: [-0.035, -0.06, -0.015], s: 1.26 },
        { p: [1.18, -0.46, -0.32], r: [-0.04, -0.36, -0.14], s: 1.08 }
      ]
      : [
        { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
        { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
        { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 }
      ];

    if (!showDetailPanel) {
      SLOTS.detail = { p: [0, -0.05, 0.75], r: [0.02, -0.34, 0.05], s: SLOTS.portrait ? 0.94 : 1.08 };
      return;
    }

    if (SLOTS.portrait) {
      // On mobile, position open book in upper half so phone screenshot is prominently visible above the floating detail card
      SLOTS.detail = { p: [0.0, 0.48, 0.85], r: [-0.02, -0.38, 0.04], s: 0.84 };
    } else {
      SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.22 };
    }
  }

  function setTargets(b, slot) {
    const s = b.springs;
    s.px.t = slot.p[0];
    s.py.t = slot.p[1];
    s.pz.t = slot.p[2];
    s.rx.t = slot.r[0];
    s.ry.t = slot.r[1];
    s.rz.t = slot.r[2];
    b.slotScale = slot.s;
  }

  const EASE = {
    hold: () => 1,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2
  };
  const LIFT = 0.38, CLEAR = 4.2;

  function playY(b, segs) {
    b.exit = { segs, i: 0, t: 0 };
  }
  function stepY(b, dt) {
    const ex = b.exit, s = b.springs;
    ex.t += dt;
    let seg = ex.segs[ex.i];
    while (seg && ex.t >= seg.d) {
      ex.t -= seg.d;
      s.py.v = seg.to;
      if (seg.end) seg.end();
      seg = ex.segs[++ex.i];
    }
    if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
    else b.exit = null;
    s.py.t = s.py.v;
    s.py.vel = 0;
  }

  function pinInPlace(b) {
    const s = b.springs;
    s.px.t = s.px.v;
    s.pz.t = s.pz.v;
    s.rx.t = s.rx.v;
    s.ry.t = s.ry.v;
    s.rz.t = s.rz.v;
  }

  function sendOut(b, i, delay) {
    const y0 = SLOTS.hero[i].p[1], here = b.springs.py.v, apex = y0 + LIFT;
    b.root.visible = true;
    pinInPlace(b);
    playY(b, [
      { d: delay, from: here, to: here, ease: EASE.hold },
      { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
      { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } }
    ]);
  }

  function bringBack(b, i, delay) {
    const here = b.springs.py.v;
    b.root.visible = true;
    pinInPlace(b);
    playY(b, [
      { d: delay, from: here, to: here, ease: EASE.hold },
      { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint }
    ]);
  }

  // Carousel
  function windowIndices(start, total, count) {
    const arr = [];
    for (let i = 0; i < count; i++) arr.push((start + i) % total);
    return arr;
  }
  let carouselStart = 0;
  let currentWindow = windowIndices(0, N, VISIBLE);
  let carouselBusy = false;

  function rebuildHitMeshes() {
    hitMeshes.length = 0;
    currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
  }

  function applyMode() {
    if (state.mode === 'hero' || state.mode === 'closing') {
      currentWindow.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (slot) setTargets(bookInstances[bi], slot);
      });
    } else if (state.selected) {
      setTargets(state.selected, SLOTS.detail);
    }
  }

  function shiftCarousel(dir) {
    if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
    carouselBusy = true;
    const outgoing = currentWindow;
    carouselStart = (((carouselStart + dir) % N) + N) % N;
    const incoming = windowIndices(carouselStart, N, VISIBLE);
    const toHide = outgoing.filter((bi) => !incoming.includes(bi));

    toHide.forEach((bi) => {
      const oldIdx = outgoing.indexOf(bi);
      const slot = SLOTS.hero[oldIdx];
      const b = bookInstances[bi];
      if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
    });
    setT(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

    incoming.forEach((bi, i) => {
      const slot = SLOTS.hero[i];
      if (!slot) return;
      const b = bookInstances[bi];
      const alreadyOnScreen = outgoing.includes(bi);
      b.root.visible = true;
      if (!alreadyOnScreen) {
        b.springs.px.set(slot.p[0] + dir * 6.5);
        b.springs.py.set(slot.p[1]);
        b.springs.pz.set(slot.p[2]);
        b.springs.rx.set(slot.r[0]);
        b.springs.ry.set(slot.r[1]);
        b.springs.rz.set(slot.r[2]);
        b.springs.sc.set(slot.s * 0.92);
      }
      setTargets(b, slot);
    });

    currentWindow = incoming;
    rebuildHitMeshes();
    setT(() => { carouselBusy = false; }, 700);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => shiftCarousel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => shiftCarousel(1));

  // Camera & Perspective Springs
  const camX = new Spring(0, 13, 6.5), camY = new Spring(0.1, 13, 6.5), camZ = new Spring(9.6, 13, 6.5);
  const lookX = new Spring(0, 13, 6.5), lookY = new Spring(0, 13, 6.5);
  const parX = new Spring(0, 60, 10), parY = new Spring(0, 60, 10);

  function camTo(mode) {
    if (mode === 'detail') {
      camX.t = SLOTS.portrait ? 0 : -0.25;
      camZ.t = SLOTS.portrait ? 10.4 : 9.6;
      lookX.t = SLOTS.portrait ? 0 : -0.35;
      lookY.t = SLOTS.portrait ? 0 : 0.15;
    } else {
      camX.t = 0;
      camZ.t = 9.6;
      lookX.t = 0;
      lookY.t = 0;
    }
  }

  // Torn-paper "Open" pill badge
  const pillX = new Spring(0, 190, 23), pillY = new Spring(0, 190, 23);
  let pillOn = false;
  function showPill() {
    if (!openSlip) return;
    openSlip.classList.add('visible');
    pillOn = true;
  }
  function hidePill() {
    if (openSlip) openSlip.classList.remove('visible');
    pillOn = false;
  }

  // Populate Detail Panel
  function updateDetailPanel(cfg) {
    if (!dpEl || !cfg) return;
    if (dpTitle) dpTitle.textContent = cfg.title;
    if (dpDesc) dpDesc.textContent = cfg.desc;
    if (dpAuthor) dpAuthor.textContent = cfg.author || 'Anil Sangam';
    if (dpYear) dpYear.textContent = cfg.year || '2025';
    if (dpCategory) dpCategory.textContent = cfg.kind || 'Mobile Application';

    if (dpTags) {
      const tags = cfg.tags || [];
      dpTags.innerHTML = tags.map(t => `<span class="bs-tag">${t}</span>`).join('');
    }

    if (dpLiveBtn) {
      if (cfg.url) {
        dpLiveBtn.href = cfg.url;
        dpLiveBtn.style.display = 'inline-flex';
      } else {
        dpLiveBtn.style.display = 'none';
      }
    }

  }

  // Open & Close Sequences
  function open(book) {
    if (state.mode !== 'hero' || !book) return;
    state.mode = 'opening';
    root.setAttribute('data-state', 'opening');
    state.selected = book;
    state.pillLock = null;
    state.kbIndex = -1;
    hidePill();
    book.exit = null;
    root.classList.add('bs-transit');
    updateDetailPanel(book.cfg);
    if (typeof onBookSelect === 'function') onBookSelect(book.cfg);
    computeSlots();

    let out = 0;
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      if (b !== book) sendOut(b, i, out++ * 0.08);
    });

    setT(() => {
      if (state.mode !== 'opening' && state.mode !== 'detail') return;
      book.orbY = RM ? 0 : -6.2832;
      book.orbYv = RM ? 0 : 3;
      book.orbPhase = 'return';
      book.orbTarget = 0;
      book.orbXs.set(0);
      applyMode();
      camTo('detail');
    }, 760);

    setT(() => leaves.activate(book), 1000);

    setT(() => {
      if (state.mode === 'opening') {
        currentWindow.forEach((bi) => {
          const sibling = bookInstances[bi];
          if (sibling !== book) {
            sibling.exit = null;
            sibling.root.visible = false;
          }
        });
        root.classList.add('bs-detail-open');
        state.mode = 'detail';
        root.setAttribute('data-state', 'detail');
      }
    }, 1400);
  }

  function close() {
    if (state.mode !== 'detail') return;
    state.mode = 'closing';
    root.setAttribute('data-state', 'closing');
    root.classList.remove('bs-detail-open');
    if (typeof onBookSelect === 'function') onBookSelect(null);
    leaves.deactivate();
    orbit.drag = false;
    const b = state.selected;
    if (b) {
      b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
      b.orbYv = Math.max(b.orbYv, 3);
      b.orbPhase = 'return';
      b.orbXs.t = 0;
    }
    setT(() => {
      root.classList.remove('bs-transit');
      applyMode();
      camTo('hero');
      let back = 0;
      currentWindow.forEach((bi, i) => {
        const bk = bookInstances[bi];
        if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
      });
    }, 250);

    setT(() => {
      if (state.mode === 'closing') {
        state.mode = 'hero';
        root.setAttribute('data-state', 'hero');
        state.selected = null;
      }
    }, 1600);
  }

  if (closeBtn) closeBtn.addEventListener('click', close);

  // Input Handling
  const ptr = {
    ndcX: 0, ndcY: 0, cx: 0, cy: 0,
    lastX: 0, lastY: 0, down: false,
    downX: 0, downY: 0, moved: 0,
    t0: 0, type: 'mouse', seen: false,
    id: null
  };
  const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
  let dragBook = null, rayBook = null;
  const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
  const ray = new THREE.Raycaster();
  const tmpV = new THREE.Vector3();

  canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());

  canvasEl.addEventListener('pointerleave', () => {
    rayBook = null;
    state.pillLock = null;
    state.kbIndex = -1;
  });

  const localXY = (e) => {
    const r = root.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  canvasEl.addEventListener('pointermove', (e) => {
    if (ptr.id !== null && e.pointerId !== ptr.id) return;
    const { x: cx, y: cy } = localXY(e);
    const dxN = (cx - ptr.lastX) / dims.w;
    const dyN = (cy - ptr.lastY) / dims.h;
    ptr.lastX = cx;
    ptr.lastY = cy;
    ptr.cx = cx;
    ptr.cy = cy;
    ptr.ndcX = (cx / dims.w) * 2 - 1;
    ptr.ndcY = -(cy / dims.h) * 2 + 1;
    ptr.type = e.pointerType || 'mouse';
    ptr.seen = true;

    if (state.mode === 'detail') leaves.push(dxN, dyN);
    if (ptr.down && dragBook) {
      ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
    }
    if (ptr.down && orbit.drag) {
      orbit.dxAcc += dxN;
      orbit.dyAcc += dyN;
      ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
    }
  });

  canvasEl.addEventListener('pointerdown', (e) => {
    if (ptr.id !== null) return;
    root.focus({ preventScroll: true });
    ptr.id = e.pointerId;
    const { x: cx, y: cy } = localXY(e);
    ptr.cx = cx;
    ptr.cy = cy;
    ptr.lastX = cx;
    ptr.lastY = cy;
    ptr.ndcX = (cx / dims.w) * 2 - 1;
    ptr.ndcY = -(cy / dims.h) * 2 + 1;
    ptr.type = e.pointerType || 'mouse';
    ptr.seen = true;
    castRay();

    if (state.mode === 'hero' && rayBook) {
      ptr.down = true;
      dragBook = rayBook;
      ptr.downX = cx;
      ptr.downY = cy;
      ptr.moved = 0;
      ptr.t0 = performance.now();
      canvasEl.setPointerCapture(e.pointerId);
    } else if (state.mode === 'detail' && rayBook === state.selected) {
      ptr.down = true;
      orbit.drag = true;
      orbit.dxAcc = 0;
      orbit.dyAcc = 0;
      ptr.moved = 0;
      ptr.t0 = performance.now();
      canvasEl.setPointerCapture(e.pointerId);
    } else {
      state.pillLock = null;
      state.kbIndex = -1;
      if (state.mode === 'hero') {
        ptr.down = true;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
      }
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (ptr.id !== null && e.pointerId !== ptr.id) return;
    ptr.id = null;
    orbit.drag = false;
    if (dragBook) {
      const slop = isTouch() ? 26 : 14;
      const limit = isTouch() ? 650 : 450;
      const wasDrag = ptr.moved > slop;
      const totalDx = (ptr.cx || ptr.lastX) - ptr.downX;
      dragBook.springs.drag.t = 0;
      if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) {
        open(dragBook);
      } else if (wasDrag && state.mode === 'hero' && showCarousel && Math.abs(totalDx) > 50) {
        if (totalDx < 0) next();
        else prev();
      }
      dragBook = null;
    } else if (ptr.down && state.mode === 'hero' && showCarousel) {
      const totalDx = (ptr.cx || ptr.lastX) - ptr.downX;
      if (Math.abs(totalDx) > 40) {
        if (totalDx < 0) next();
        else prev();
      }
    }
    ptr.down = false;
    if (isTouch()) rayBook = null;
  });

  const cancelPointer = (e) => {
    if (e && ptr.id !== null && e.pointerId !== ptr.id) return;
    ptr.id = null;
    ptr.down = false;
    orbit.drag = false;
    if (dragBook) {
      dragBook.springs.drag.t = 0;
      dragBook = null;
    }
    if (isTouch()) rayBook = null;
  };
  window.addEventListener('pointercancel', cancelPointer);
  canvasEl.addEventListener('lostpointercapture', cancelPointer);

  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (state.mode !== 'hero') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (e.shiftKey) {
        shiftCarousel(e.key === 'ArrowRight' ? 1 : -1);
      } else {
        const d = e.key === 'ArrowRight' ? 1 : -1;
        state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
        state.pillLock = null;
      }
      e.preventDefault();
    }
    if (e.key === 'Enter' && state.hovered) open(state.hovered);
  });

  function castRay() {
    ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
    const hits = ray.intersectObjects(hitMeshes, false);
    if (hits.length) {
      rayBook = bookByHit(hits[0].object);
      const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
      rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
    } else {
      rayBook = null;
    }
  }

  // Animation Frame Loop
  const clock = new THREE.Clock();
  const idle = RM ? 0 : 1;
  const DETAIL_OPEN_ANGLE = 1.28;
  const DETAIL_OPEN_SWAY = 0.035;

  function screenPos(b) {
    b.root.getWorldPosition(tmpV).project(camera);
    b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
    b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
  }

  function tickBook(b, dt, t) {
    const s = b.springs;
    const isHov = state.hovered === b;
    const inDetail = state.mode === 'detail' && state.selected === b;
    const orbitActive = state.selected === b && state.mode !== 'hero';

    let activity = 0;
    if (orbitActive) {
      if (orbit.drag && inDetail) {
        const step = orbit.dxAcc * 6.5;
        orbit.dxAcc = 0;
        b.orbY += step;
        b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
        b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
        orbit.dyAcc = 0;
        b.orbPhase = 'drag';
      } else {
        b.orbXs.t = 0;
        if (b.orbPhase === 'drag') {
          if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
          else {
            b.orbPhase = 'return';
            b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
          }
        }
        if (b.orbPhase === 'spin') {
          b.orbYv *= Math.exp(-0.9 * dt);
          b.orbY += b.orbYv * dt;
          if (Math.abs(b.orbYv) < 0.5) {
            b.orbPhase = 'return';
            b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
          }
        } else if (b.orbPhase === 'return') {
          const acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
          b.orbYv += acc * dt;
          b.orbY += b.orbYv * dt;
          if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
            b.orbY = b.orbTarget;
            b.orbYv = 0;
            b.orbPhase = 'idle';
          }
        }
      }
      const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
      activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
    }
    b.orbXs.update(dt);

    let coverBase = 0;
    if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
    const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
    const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
    let coverBBase = 0;
    if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

    if (isHov && ptr.seen && state.mode === 'hero') {
      const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
      const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
      s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
      s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
      s.lift.t = 0.3;
      coverBase = 0;
    } else {
      s.tiltY.t = 0;
      s.tiltX.t = 0;
      s.lift.t = 0;
    }

    s.cover.t = coverBase + fan;
    s.coverB.t = coverBBase + fanB;
    s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

    s.px.update(dt);
    if (b.exit) stepY(b, dt);
    else s.py.update(dt);
    s.pz.update(dt);
    s.rx.update(dt);
    s.ry.update(dt);
    s.rz.update(dt);
    s.sc.update(dt);
    s.tiltX.update(dt);
    s.tiltY.update(dt);
    s.lift.update(dt);
    s.cover.update(dt);
    s.coverB.update(dt);
    s.drag.update(dt);

    b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
    b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

    b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
    const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
    const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
    b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
    b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

    const ang = Math.max(0, s.cover.v + s.drag.v);
    const angB = Math.max(0, s.coverB.v);
    b.pivot.rotation.y = -ang;
    b.pivot.position.z = PIVOT_Z + ang * 0.022;
    b.backPivot.rotation.y = angB;
    b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
    b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
    b.block.scale.z = 1 - (ang + angB) * 0.05;
    b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;

    for (let i = 0; i < PAGE_N; i++) {
      const fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
      b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
    }
    for (let i = 0; i < BACK_PAGE_N; i++) {
      b.pagesB[i].rotation.y = angB * b.pageFB[i];
    }
  }

  let rafId = 0;
  let isInViewport = true;
  let lastFrameTime = 0;
  const frameInterval = 1000 / (lowPowerDevice ? 24 : 35);

  function animate() {
    if (cancelled || !isInViewport || document.hidden) {
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(animate);

    const now = performance.now();
    if (now - lastFrameTime < frameInterval) return;
    lastFrameTime = now;

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();

    let hov = null;
    if (state.mode === 'hero') {
      const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
      hov = rayBook || state.pillLock || kb || null;
    } else if (state.mode === 'detail') {
      hov = rayBook === state.selected ? rayBook : null;
    }
    state.hovered = hov;

    let cur = 'default';
    if (state.mode === 'hero' && hov) cur = 'pointer';
    else if (state.mode === 'detail' && state.selected) {
      if (orbit.drag) cur = 'grabbing';
      else if (rayBook === state.selected) cur = 'grab';
    }
    canvasEl.style.cursor = cur;

    bookInstances.forEach((b) => screenPos(b));
    bookInstances.forEach((b) => tickBook(b, dt, t));
    leaves.update(dt, t);

    parX.t = RM ? 0 : ptr.ndcX * 0.02;
    parY.t = RM ? 0 : -ptr.ndcY * 0.012;
    bookRoot.rotation.y = parX.update(dt);
    bookRoot.rotation.x = parY.update(dt);

    camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
    camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

    // Floating Torn-Paper Slip Position Update
    if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
      const tx = ptr.cx, ty = ptr.cy + 34;
      if (!pillOn) {
        pillX.set(tx);
        pillY.set(ty);
      }
      pillX.t = tx;
      pillY.t = ty;
      if (openSlip) {
        openSlip.style.left = `${pillX.update(dt)}px`;
        openSlip.style.top = `${pillY.update(dt)}px`;
      }
      if (!pillOn) showPill();
    } else {
      hidePill();
    }

    renderer.render(scene, camera);
  }

  function resumeAnimation() {
    if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
  }

  function relayout() {
    const r = root.getBoundingClientRect();
    const w = r.width || root.clientWidth || window.innerWidth;
    const h = r.height || root.clientHeight || 750;
    dims.w = Math.max(300, Math.round(w));
    dims.h = Math.max(540, Math.round(h));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerDevice ? 1 : 1.25));
    renderer.setSize(dims.w, dims.h);
    camera.aspect = dims.w / dims.h;
    camera.updateProjectionMatrix();
    computeSlots();
    applyMode();
    camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
  }

  relayout();
  currentWindow.forEach((bi, i) => {
    const b = bookInstances[bi];
    const slot = SLOTS.hero[i];
    const s = b.springs;
    s.px.set(slot.p[0]);
    s.py.set(slot.p[1] - 3.9);
    s.pz.set(slot.p[2]);
    s.rx.set(slot.r[0]);
    s.ry.set(slot.r[1]);
    s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
    s.sc.set(slot.s);
    b.slotScale = slot.s;
    setT(() => setTargets(b, slot), 240 + i * 150);
  });
  bookInstances.forEach((b, idx) => {
    if (!currentWindow.includes(idx)) b.root.visible = false;
  });
  rebuildHitMeshes();
  camTo('hero');
  animate();

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isInViewport = entry.isIntersecting;
      if (isInViewport) resumeAnimation();
      else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    },
    { rootMargin: '160px' }
  );
  visibilityObserver.observe(root);

  const onVisibilityChange = () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      resumeAnimation();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('resize', relayout);

  const ro = new ResizeObserver(() => relayout());
  ro.observe(root);

  // Return destroy handler for cleanup
  return {
    destroy() {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      timeouts.forEach((id) => clearTimeout(id));
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ro.disconnect();
      window.removeEventListener('resize', relayout);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v && v.isTexture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      if (scene.environment) {
        scene.environment.dispose();
        scene.environment = null;
      }
      renderer.dispose();
    }
  };
}

