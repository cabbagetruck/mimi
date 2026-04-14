// ===== Scene 3: 양배추 피라미드 + 당당한 남자 + 선베드 여자 =====
// 꼭대기 양배추 반짝 + 선글라스 반짝

(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;

  function init() {
    const setup = setupCanvas('canvas-3', 200, 360);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
    loadMimiImage();
  }

  // ---- Background ----

  function drawBackground() {
    // Sky gradient (warm sunset-ish)
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(80 + t * 80);
      const g = Math.floor(150 + t * 60);
      const b = Math.floor(240 - t * 60);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }
    // Clouds
    drawCloud(10, 15);
    drawCloud(100, 28);
    drawCloud(160, 8);
  }

  function drawCloud(x, y) {
    const c = 'rgba(255,255,255,0.55)';
    drawRect(ctx, x, y, 20, 4, c);
    drawRect(ctx, x + 4, y - 3, 12, 3, c);
    drawRect(ctx, x + 7, y - 5, 6, 2, c);
  }

  // ---- Cabbage Mountain (fills top ~50% of screen) ----

  let topCabbageX = 0;
  let topCabbageY = 0;

  function drawCabbageMountain() {
    // Build a pyramid/mountain shape from bottom-center upward
    const baseY = Math.floor(h * 0.55);  // mountain base
    const peakY = Math.floor(h * 0.06);  // mountain peak
    const r = 7;
    const d = r * 2 - 2;
    const rowH = r * 2 - 4;

    const totalRows = Math.floor((baseY - peakY) / rowH);

    for (let row = 0; row < totalRows; row++) {
      const rowY = baseY - row * rowH;
      // Width narrows as we go up (pyramid shape)
      const progress = row / totalRows; // 0 at bottom, 1 at top
      const rowWidth = w * (1.1 - progress * 0.9); // wide at bottom, narrow at top
      const cols = Math.floor(rowWidth / d) + 1;
      const startX = (w - rowWidth) / 2;
      const offset = (row % 2) * (d / 2);

      for (let col = 0; col < cols; col++) {
        const cx = startX + col * d + offset + r;
        const cy = rowY;
        if (cx > -r && cx < w + r) {
          const sizeVar = ((row * 3 + col * 7) % 3) - 1;
          drawMountainCabbage(cx, cy, r + sizeVar);
        }
      }

      // Track the topmost cabbage for sparkle
      if (row === totalRows - 1) {
        topCabbageX = w / 2;
        topCabbageY = rowY;
      }
    }
  }

  function drawMountainCabbage(cx, cy, r) {
    drawCircle(ctx, cx, cy, r, '#4CAF50');
    drawCircle(ctx, cx + 1, cy + 1, r - 1, '#388E3C');
    drawCircle(ctx, cx - 1, cy - 1, r - 1, '#4CAF50');
    drawCircle(ctx, cx - 1, cy - 1, r - 3, '#5CBF5C');
    drawCircle(ctx, cx, cy - 2, Math.max(1, r - 5), '#7DD07D');
    if (r >= 6) {
      drawPixel(ctx, cx - 2, cy - 3, '#388E3C');
      drawPixel(ctx, cx + 1, cy - 2, '#388E3C');
    }
  }

  // ---- Male character (back view, hands on hips, slightly right of center) ----

  function drawMaleBack() {
    const x = Math.floor(w * 0.70);
    const feetY = Math.floor(h * 0.62);

    const S = PALETTE.skin;
    const K = PALETTE.black;
    const BEANIE = '#FF6D00';
    const JEANS = '#4A6FA5';
    const JEANS_DARK = '#3A5A85';
    const BOOT = '#8B2500';
    const BOOT_SOLE = '#5C1A00';
    const SHIRT = '#202020';

    // Boots
    const bootY = feetY - 5;
    drawRect(ctx, x - 8, bootY, 7, 5, BOOT);
    drawRect(ctx, x - 9, bootY + 3, 8, 2, BOOT_SOLE);
    drawRect(ctx, x - 8, bootY + 1, 7, 1, '#A03010');
    drawRect(ctx, x + 1, bootY, 7, 5, BOOT);
    drawRect(ctx, x + 1, bootY + 3, 8, 2, BOOT_SOLE);
    drawRect(ctx, x + 1, bootY + 1, 7, 1, '#A03010');

    // Legs
    const legH = 16;
    const legTopY = bootY - legH;
    drawRect(ctx, x - 5, legTopY, 5, legH, JEANS);
    drawRect(ctx, x - 5, legTopY, 1, legH, JEANS_DARK);
    drawRect(ctx, x + 1, legTopY, 5, legH, JEANS);
    drawRect(ctx, x + 5, legTopY, 1, legH, JEANS_DARK);
    // Belt
    drawRect(ctx, x - 5, legTopY, 11, 2, '#3A2A1A');

    // Torso (back view)
    const torsoH = 14;
    const torsoY = legTopY - torsoH;
    drawRect(ctx, x - 6, torsoY, 12, torsoH, SHIRT);
    // Shirt back seam
    drawRect(ctx, x, torsoY + 2, 1, torsoH - 4, '#2A2A2A');

    // Head (back, slightly turned left — show left profile edge)
    const headH = 10;
    const headY = torsoY - 2 - headH;
    // Neck (back)
    drawRect(ctx, x - 2, torsoY - 2, 5, 3, S);
    // Back of head
    drawRect(ctx, x - 4, headY, 9, headH, S);
    // Beanie
    drawRect(ctx, x - 5, headY - 5, 11, 6, BEANIE);
    drawRect(ctx, x - 4, headY - 6, 9, 2, BEANIE);
    drawRect(ctx, x - 5, headY, 11, 2, '#E05A00');
    drawRect(ctx, x - 4, headY - 2, 9, 1, '#D04F00');

    // Left profile edge (face peeking)
    drawRect(ctx, x - 5, headY + 2, 1, 6, S);
    // Glasses arm visible on left side
    drawRect(ctx, x - 5, headY + 3, 2, 1, K);
    // Ear on left
    drawRect(ctx, x - 6, headY + 3, 1, 3, S);

    // Arms on hips (back view) — elbows out to sides
    // Left arm: shoulder → elbow out left → hand on hip
    drawRect(ctx, x - 7, torsoY + 1, 2, 3, SHIRT); // sleeve
    drawRect(ctx, x - 9, torsoY + 2, 3, 2, S);     // upper arm out
    drawRect(ctx, x - 11, torsoY + 4, 3, 3, S);    // elbow
    drawRect(ctx, x - 10, torsoY + 7, 3, 3, S);    // forearm back in
    drawRect(ctx, x - 7, torsoY + 9, 3, 3, S);     // hand on hip

    // Right arm
    drawRect(ctx, x + 5, torsoY + 1, 2, 3, SHIRT);
    drawRect(ctx, x + 6, torsoY + 2, 3, 2, S);
    drawRect(ctx, x + 8, torsoY + 4, 3, 3, S);
    drawRect(ctx, x + 7, torsoY + 7, 3, 3, S);
    drawRect(ctx, x + 5, torsoY + 9, 3, 3, S);
  }

  // ---- Female character: external image (assets/mimi.png) ----
  let mimiImg = null;
  let mimiLoaded = false;

  function loadMimiImage() {
    mimiImg = new Image();
    mimiImg.onload = function () { mimiLoaded = true; };
    mimiImg.src = 'assets/mimi.png';
  }

  function drawFemaleImage() {
    if (!mimiLoaded) return;
    // Draw large, positioned at lower-left area of the canvas
    // Image has transparent background so it composites nicely
    const imgW = 143;
    const imgH = imgW * (mimiImg.naturalHeight / mimiImg.naturalWidth);
    const ix = 4;
    const iy = h * 0.72 - imgH;

    ctx.imageSmoothingEnabled = false; // keep pixel art crisp
    ctx.drawImage(mimiImg, ix, iy, imgW, imgH);

  }

  // ---- Sparkle effects ----

  function drawSparkles() {
    // Top cabbage sparkle
    drawSparkle(ctx, topCabbageX, topCabbageY - 4, 4, frame, PALETTE.yellow);
  }

  // ---- Render ----

  function render() {
    ctx.clearRect(0, 0, w, h);

    drawBackground();
    drawCabbageMountain();
    drawMaleBack();
    drawSparkles();

    drawBottomGradient(ctx, w, h, '24,24,24', 0.58);

    // Draw mimi image ON TOP of gradient so it's not hidden
    drawFemaleImage();

    frame++;
    animFrame = requestAnimationFrame(render);
  }

  function start() {
    frame = 0;
    render();
  }

  function stop() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  registerScene(3, init, start, stop);
})();
