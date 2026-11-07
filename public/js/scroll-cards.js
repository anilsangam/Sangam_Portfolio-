/**
 * Sticky Stacking Cards Mobile Project Showcase
 * "Background ruke rahe and card new new uper aate jaye"
 * High-performance vanilla JS & CSS implementation with zero dead space.
 */

const SPLASH_GRADIENTS = [
  ['#f43f5e', '#fb923c'], // Rose -> Coral Orange
  ['#0284c7', '#38bdf8'], // Ocean Blue -> Cyan
  ['#8b5cf6', '#ec4899'], // Violet -> Neon Pink
  ['#10b981', '#06b6d4'], // Emerald -> Mint Teal
  ['#f59e0b', '#ef4444'], // Warm Amber -> Sunset Red
  ['#6366f1', '#a855f7']  // Indigo -> Royal Purple
];

const SPLASH_PATH = 'M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z';

// Subtle alternating tilt angles for the stacked card deck
const TILT_ANGLES = ['-3.5deg', '3.5deg', '-2.8deg', '2.8deg', '-3deg', '3deg'];

export function initMobileScrollCards(container, options = {}) {
  if (!container) return;
  const projects = options.projects || [];
  if (!projects.length) return;

  const title = options.title || 'Selected Projects';
  const subtitle = options.subtitle || 'Scroll to explore projects';
  const uniqueId = Math.random().toString(36).substr(2, 6);

  // Generate initial gradient stops
  const [initColorA, initColorB] = SPLASH_GRADIENTS[0];

  let html = `
    <div class="m-deck-header">
      <span class="m-deck-header__badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8"/>
        </svg>
        Featured Work
      </span>
      <h3 class="m-deck-header__title">${title}</h3>
      <p class="m-deck-header__subtitle">${subtitle} <span>↓</span></p>
    </div>

    <!-- Pinned Background Splash (Stays FROZEN / RUKE RAHEGA) -->
    <div class="m-deck-bg-pin" id="mDeckBgPin_${uniqueId}">
      <svg class="m-deck-splash" viewBox="0 0 500 450" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="splashGrad_${uniqueId}" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop id="gradStop0_${uniqueId}" offset="0%" stop-color="${initColorA}" />
            <stop id="gradStop1_${uniqueId}" offset="100%" stop-color="${initColorB}" />
          </linearGradient>
        </defs>
        <path fill="url(#splashGrad_${uniqueId})" d="${SPLASH_PATH}" />
      </svg>
    </div>

    <!-- Cards that glide up and stack directly over each other -->
    <div class="m-deck-cards-list">
  `;

  projects.forEach((p, i) => {
    const rot = TILT_ANGLES[i % TILT_ANGLES.length];
    const category = p.kind || (p.category === 'app' ? 'Android Application' : 'Web Application');
    const categoryTone = /android|app|mobile/i.test(category) ? 'app' : 'web';
    const year = p.year || '2025';
    const desc = p.desc || p.subTitle || 'Custom scalable software solution built end to end.';
    const imgSrc = p.mobileScreenshot || p.images?.front || p.coverURL || (p.icon ? (p.icon.startsWith('/') ? p.icon : '/images/' + p.icon) : null);
    const tags = (p.tags && p.tags.length) ? p.tags.slice(0, 4) : ((p.chapters && p.chapters.length) ? p.chapters.slice(0, 4) : ['Node.js', 'Express', 'MongoDB']);

    // Determine live demo URL
    let demoUrl = p.url;
    if (!demoUrl) {
      if (p.title && p.title.toLowerCase().includes('nishad')) {
        demoUrl = 'https://nishadaarakshansankalp.in';
      } else if (p.title && p.title.toLowerCase().includes('ridtech')) {
        demoUrl = 'https://ridtech.in';
      } else {
        demoUrl = '';
      }
    }

    const isLiveDemo = Boolean(p.url || (demoUrl && !demoUrl.includes('github.com')));

    html += `
      <div class="m-deck-card-item" style="--i:${i}" data-deck-index="${i}">
        <article class="m-card" style="--rot:${rot}" role="article" aria-label="${p.title}">
          <div class="m-card__top">
            <span class="m-card__category m-card__category--${categoryTone}">${category}</span>
            <span class="m-card__year">${year}</span>
          </div>

          <!-- Clickable Screenshot Preview -->
          <a href="${demoUrl || '#projectsShowcase'}" ${demoUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="m-card__media" aria-label="Open ${p.title} live demo">
            ${imgSrc ? `
              <img class="m-card__img" src="${imgSrc}" alt="${p.title}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" onerror="this.parentElement.innerHTML='<div class=\\'m-card__placeholder\\'><span>${p.title}</span></div>'" />
            ` : `
              <div class="m-card__placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="m9 8 6 4-6 4Z"/>
                </svg>
                <span>${p.title}</span>
              </div>
            `}
            <span class="m-card__media-badge" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17 17 7M7 7h10v10"/>
              </svg>
            </span>
          </a>

          <div class="m-card__content">
            <h4 class="m-card__title">
              <a href="${demoUrl || '#projectsShowcase'}" ${demoUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="m-card__title-link">${p.title}</a>
            </h4>
            <p class="m-card__desc">${desc}</p>

            <div class="m-card__tags">
              ${tags.map(t => `<span class="m-card__tag">${t}</span>`).join('')}
            </div>

            <!-- Direct actions: live demo and project inquiry -->
            <div class="m-card__actions">
              ${isLiveDemo ? `
                <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="m-card__btn m-card__btn--primary">
                  Live
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10"/>
                  </svg>
                </a>
              ` : ''}
              <button type="button" class="m-card__btn m-card__btn--secondary" data-contact>Build a project</button>
            </div>
          </div>
        </article>
      </div>
    `;
  });

  html += `
    </div>
  `;

  container.innerHTML = html;

  // Ensure scroll is unlocked when links are clicked or when returning
  container.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (typeof window.unlockScroll === 'function') {
        window.unlockScroll();
      }
    });
  });

  // Stacking Scroll Physics
  const cardItems = container.querySelectorAll('.m-deck-card-item');
  const stop0 = document.getElementById(`gradStop0_${uniqueId}`);
  const stop1 = document.getElementById(`gradStop1_${uniqueId}`);

  let lastActive = -1;

  function updateDeckPhysics() {
    const targetStickyTop = window.innerWidth <= 480 ? 70 : 76; // Sticky snap point matching CSS top

    let currentTopCard = 0;

    cardItems.forEach((item, idx) => {
      const rect = item.getBoundingClientRect();
      const dist = rect.top - targetStickyTop;

      if (dist <= 8) {
        currentTopCard = idx;
      }
    });

    // Update depth scaling & dimming for covered cards
    cardItems.forEach((item, idx) => {
      const innerCard = item.querySelector('.m-card');
      if (!innerCard) return;

      if (idx < currentTopCard) {
        // Covered card: gently scale down and dim behind
        const depth = currentTopCard - idx;
        const scale = Math.max(0.90, 1 - depth * 0.035);
        const yOffset = depth * -6;
        const brightness = Math.max(0.70, 1 - depth * 0.14);

        innerCard.style.transform = `translateY(${yOffset}px) scale(${scale}) rotate(var(--rot, 0deg))`;
        innerCard.style.filter = `brightness(${brightness})`;
      } else {
        // Active topmost card or upcoming cards
        innerCard.style.transform = `translateY(0px) scale(1) rotate(var(--rot, 0deg))`;
        innerCard.style.filter = 'brightness(1)';
      }
    });

    // Dynamic gradient transition on the pinned background
    if (currentTopCard !== lastActive && SPLASH_GRADIENTS[currentTopCard % SPLASH_GRADIENTS.length]) {
      lastActive = currentTopCard;
      const [colA, colB] = SPLASH_GRADIENTS[currentTopCard % SPLASH_GRADIENTS.length];
      if (stop0 && stop1) {
        stop0.setAttribute('stop-color', colA);
        stop1.setAttribute('stop-color', colB);
      }
    }
  }

  window.addEventListener('scroll', updateDeckPhysics, { passive: true });
  window.addEventListener('resize', updateDeckPhysics, { passive: true });
  // Initial calculation
  setTimeout(updateDeckPhysics, 100);
}
