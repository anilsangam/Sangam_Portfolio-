const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0b0e17; color: #fff; font-family: sans-serif; }
.spacer { height: 40vh; background: #141824; display: flex; align-items: center; justify-content: center; }

.m-deck-section {
  position: relative;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 14px;
}

/* Pinned Background Splash */
.m-deck-bg-pin {
  position: sticky;
  top: 12vh;
  z-index: 1;
  width: min(380px, 94vw);
  height: 520px;
  margin: 0 auto;
  pointer-events: none;
}

.m-deck-splash { width: 100%; height: 100%; }

/* Stacking Cards List */
.m-deck-cards-list {
  position: relative;
  z-index: 5;
  margin-top: -520px;
}

.m-deck-card-item {
  position: sticky;
  top: 13vh;
  height: 490px;
  margin-bottom: 32px; /* Next card starts immediately when first card ends! */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: calc(10 + var(--i));
  will-change: transform, filter;
  transition: transform 0.35s ease, filter 0.35s ease;
}

.m-deck-card-item:last-child {
  margin-bottom: 80px;
}

.m-card {
  width: min(336px, calc(100vw - 32px));
  height: 480px;
  border-radius: 24px;
  background: #171b2b;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
  padding: 18px;
  display: flex;
  flex-direction: column;
  transform: rotate(var(--rot, 0deg));
}

.m-card__media {
  width: 100%;
  height: 220px;
  background: #0d101a;
  border-radius: 14px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
</head>
<body>
  <div class="spacer">Scroll down to test tight card gap</div>
  <div class="m-deck-section">
    <div class="m-deck-bg-pin">
      <svg class="m-deck-splash" viewBox="0 0 500 450" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0" y1="1" x2="1" y2="0">
            <stop id="stop0" offset="0%" stop-color="#f43f5e" />
            <stop id="stop1" offset="100%" stop-color="#fb923c" />
          </linearGradient>
        </defs>
        <path fill="url(#grad)" d="M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z" />
      </svg>
    </div>
    <div class="m-deck-cards-list">
      <div class="m-deck-card-item" style="--i:0"><div class="m-card" style="--rot:-4deg"><div class="m-card__media">Card 1 Image (220px)</div><h3>Project 1</h3></div></div>
      <div class="m-deck-card-item" style="--i:1"><div class="m-card" style="--rot:3.5deg"><div class="m-card__media">Card 2 Image (220px)</div><h3>Project 2</h3></div></div>
      <div class="m-deck-card-item" style="--i:2"><div class="m-card" style="--rot:-3deg"><div class="m-card__media">Card 3 Image (220px)</div><h3>Project 3</h3></div></div>
      <div class="m-deck-card-item" style="--i:3"><div class="m-card" style="--rot:3deg"><div class="m-card__media">Card 4 Image (220px)</div><h3>Project 4</h3></div></div>
    </div>
  </div>
  <div class="spacer">End of deck</div>
</body>
</html>
`;

fs.writeFileSync('scratch/test_deck_tight.html', html);
console.log("Written scratch/test_deck_tight.html");

