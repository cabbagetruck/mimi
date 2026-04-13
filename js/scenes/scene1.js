// ===== Scene 1: 거대 케이크 위에 서있는 남자 =====
// 촛불 일렁임 + 오른손 흔들기 애니메이션

(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;

  function init() {
    const setup = setupCanvas('canvas-1', 200, 360);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
  }

  // ---- Background ----

  function drawSky() {
    // Upper sky
    for (let y = 0; y < h * 0.30; y++) {
      const t = y / (h * 0.30);
      const r = Math.floor(80 + t * 40);
      const g = Math.floor(150 + t * 30);
      const b = Math.floor(240 - t * 15);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }
    // Horizon transition: sky -> warm horizon -> grass
    const horizonStart = Math.floor(h * 0.30);
    const horizonEnd = Math.floor(h * 0.42);
    for (let y = horizonStart; y < horizonEnd; y++) {
      const t = (y - horizonStart) / (horizonEnd - horizonStart);
      const r = Math.floor(120 + t * 40);
      const g = Math.floor(180 + t * 40);
      const b = Math.floor(225 - t * 120);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }

    // Clouds
    drawCloud(25, 18);
    drawCloud(100, 30);
    drawCloud(160, 12);
  }

  function drawCloud(x, y) {
    const c = 'rgba(255,255,255,0.75)';
    drawRect(ctx, x, y, 18, 4, c);
    drawRect(ctx, x + 3, y - 3, 12, 3, c);
    drawRect(ctx, x + 6, y - 5, 6, 2, c);
  }

  function drawGrass() {
    const grassTop = Math.floor(h * 0.42);
    // Main grass body
    for (let y = grassTop; y < h; y++) {
      const t = (y - grassTop) / (h - grassTop);
      const r = Math.floor(55 - t * 20);
      const g = Math.floor(140 - t * 40);
      const b = Math.floor(45 - t * 20);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }
    // Grass blade tufts along the horizon
    const bladeColor1 = '#4CAF50';
    const bladeColor2 = '#388E3C';
    for (let x = 0; x < w; x += 5) {
      const bh = 3 + (x * 7 + 13) % 4;
      drawRect(ctx, x, grassTop - bh, 2, bh, (x % 10 < 5) ? bladeColor1 : bladeColor2);
      drawRect(ctx, x + 2, grassTop - bh + 1, 1, bh - 1, bladeColor2);
    }
    // Small flowers in the grass
    drawGrassFlower(15, grassTop + 8, PALETTE.white);
    drawGrassFlower(55, grassTop + 14, '#D0A0E0');
    drawGrassFlower(130, grassTop + 6, PALETTE.white);
    drawGrassFlower(175, grassTop + 12, '#D0A0E0');
  }

  function drawGrassFlower(x, y, color) {
    drawPixel(ctx, x, y - 1, color);
    drawPixel(ctx, x - 1, y, color);
    drawPixel(ctx, x + 1, y, color);
    drawPixel(ctx, x, y + 1, color);
    drawPixel(ctx, x, y, PALETTE.yellow);
  }

  // ---- Cake ----

  function drawCake() {
    const cakeBottom = Math.floor(h * 0.78);
    const cakeTop = Math.floor(h * 0.30);
    const cakeH = cakeBottom - cakeTop;
    const tierH = Math.floor(cakeH / 3);

    // Tier 1 (bottom) - widest
    const t1y = cakeBottom - tierH;
    const t1w = Math.floor(w * 0.80);
    const t1x = Math.floor((w - t1w) / 2);
    drawRect(ctx, t1x, t1y, t1w, tierH, PALETTE.pink);
    drawRect(ctx, t1x, t1y, t1w, 5, PALETTE.lightPink);
    for (let i = 0; i < 8; i++) {
      const dx = t1x + 8 + i * Math.floor((t1w - 16) / 7);
      const dh = 4 + (i % 3) * 3;
      drawRect(ctx, dx, t1y + 5, 4, dh, PALETTE.lightPink);
    }
    // Tier 1 flower garland: large clusters along the body
    // Left cascade
    drawFlowerLg(t1x + 8, t1y + tierH * 0.25, '#D0A0E0');
    drawFlowerMd(t1x + 18, t1y + tierH * 0.18, PALETTE.white);
    drawFlowerSm(t1x + 14, t1y + tierH * 0.38, '#E8B0D0');
    drawLeafCluster(t1x + 5, t1y + tierH * 0.20, 1);
    drawLeafCluster(t1x + 22, t1y + tierH * 0.30, -1);
    // Center bottom
    drawFlowerLg(t1x + t1w / 2, t1y + tierH * 0.70, PALETTE.white);
    drawFlowerMd(t1x + t1w / 2 - 12, t1y + tierH * 0.62, '#C890D8');
    drawFlowerMd(t1x + t1w / 2 + 12, t1y + tierH * 0.58, '#E8B0D0');
    drawFlowerSm(t1x + t1w / 2 - 6, t1y + tierH * 0.78, PALETTE.yellow);
    drawFlowerSm(t1x + t1w / 2 + 7, t1y + tierH * 0.75, PALETTE.white);
    drawLeafCluster(t1x + t1w / 2 - 18, t1y + tierH * 0.68, 1);
    drawLeafCluster(t1x + t1w / 2 + 14, t1y + tierH * 0.65, -1);
    // Right cascade
    drawFlowerLg(t1x + t1w - 8, t1y + tierH * 0.28, '#C890D8');
    drawFlowerMd(t1x + t1w - 20, t1y + tierH * 0.20, PALETTE.white);
    drawFlowerSm(t1x + t1w - 14, t1y + tierH * 0.40, '#E8B0D0');
    drawLeafCluster(t1x + t1w - 4, t1y + tierH * 0.22, -1);
    drawLeafCluster(t1x + t1w - 24, t1y + tierH * 0.34, 1);
    // Scattered small buds
    drawFlowerSm(t1x + 30, t1y + tierH * 0.50, PALETTE.white);
    drawFlowerSm(t1x + t1w - 32, t1y + tierH * 0.52, '#D0A0E0');

    // Tier 2 (middle)
    const t2y = t1y - tierH;
    const t2w = Math.floor(w * 0.56);
    const t2x = Math.floor((w - t2w) / 2);
    drawRect(ctx, t2x, t2y, t2w, tierH, '#E87090');
    drawRect(ctx, t2x, t2y, t2w, 5, PALETTE.lightPink);
    for (let i = 0; i < 5; i++) {
      const dx = t2x + 6 + i * Math.floor((t2w - 12) / 4);
      const dh = 3 + (i % 2) * 3;
      drawRect(ctx, dx, t2y + 5, 4, dh, PALETTE.lightPink);
    }
    // Tier 2 flowers: medium garlands + strawberry accents
    drawFlowerLg(t2x + 10, t2y + tierH * 0.35, PALETTE.white);
    drawFlowerMd(t2x + 22, t2y + tierH * 0.28, '#D0A0E0');
    drawFlowerSm(t2x + 16, t2y + tierH * 0.50, '#E8B0D0');
    drawLeafCluster(t2x + 6, t2y + tierH * 0.30, 1);
    drawFlowerLg(t2x + t2w - 10, t2y + tierH * 0.35, '#C890D8');
    drawFlowerMd(t2x + t2w - 22, t2y + tierH * 0.28, PALETTE.white);
    drawFlowerSm(t2x + t2w - 16, t2y + tierH * 0.50, PALETTE.yellow);
    drawLeafCluster(t2x + t2w - 6, t2y + tierH * 0.30, -1);
    // Center strawberry cluster
    drawCircle(ctx, t2x + t2w / 2 - 5, t2y + tierH * 0.55, 3, PALETTE.red);
    drawPixel(ctx, t2x + t2w / 2 - 5, t2y + tierH * 0.55 - 3, '#4CAF50');
    drawCircle(ctx, t2x + t2w / 2 + 5, t2y + tierH * 0.50, 3, PALETTE.red);
    drawPixel(ctx, t2x + t2w / 2 + 5, t2y + tierH * 0.50 - 3, '#4CAF50');
    drawFlowerSm(t2x + t2w / 2, t2y + tierH * 0.68, PALETTE.white);
    drawLeafCluster(t2x + t2w / 2 - 10, t2y + tierH * 0.60, 1);
    drawLeafCluster(t2x + t2w / 2 + 8, t2y + tierH * 0.58, -1);

    // Tier 3 (top)
    const t3y = t2y - tierH;
    const t3w = Math.floor(w * 0.34);
    const t3x = Math.floor((w - t3w) / 2);
    drawRect(ctx, t3x, t3y, t3w, tierH, PALETTE.pink);
    drawRect(ctx, t3x, t3y, t3w, 4, PALETTE.lightPink);
    for (let i = 0; i < 3; i++) {
      const dx = t3x + 5 + i * Math.floor((t3w - 10) / 2);
      const dh = 3 + (i % 2) * 2;
      drawRect(ctx, dx, t3y + 4, 3, dh, PALETTE.lightPink);
    }
    // Tier 3 flowers: cozy small cluster
    drawFlowerMd(t3x + 6, t3y + tierH * 0.35, PALETTE.white);
    drawFlowerLg(t3x + t3w / 2, t3y + tierH * 0.55, '#D0A0E0');
    drawFlowerMd(t3x + t3w - 6, t3y + tierH * 0.35, '#E8B0D0');
    drawFlowerSm(t3x + 12, t3y + tierH * 0.60, PALETTE.yellow);
    drawFlowerSm(t3x + t3w - 12, t3y + tierH * 0.62, PALETTE.white);
    drawLeafCluster(t3x + 3, t3y + tierH * 0.42, 1);
    drawLeafCluster(t3x + t3w - 3, t3y + tierH * 0.42, -1);

    // Plate
    drawRect(ctx, t1x - 5, cakeBottom, t1w + 10, 4, PALETTE.cream);
    drawRect(ctx, t1x - 3, cakeBottom + 4, t1w + 6, 2, '#E0D0A0');

    return { topY: t3y, topW: t3w, topX: t3x, tierH, cakeBottom };
  }

  // --- Flower helpers: Small / Medium / Large ---

  function drawFlowerSm(x, y, petalColor) {
    // 3px tiny bud
    drawPixel(ctx, x, y - 1, petalColor);
    drawPixel(ctx, x - 1, y, petalColor);
    drawPixel(ctx, x + 1, y, petalColor);
    drawPixel(ctx, x, y + 1, petalColor);
    drawPixel(ctx, x, y, PALETTE.yellow);
  }

  function drawFlowerMd(x, y, petalColor) {
    // 5-6px flower with visible petals
    const p = petalColor;
    // Top petal
    drawRect(ctx, x - 1, y - 3, 2, 2, p);
    // Bottom petal
    drawRect(ctx, x - 1, y + 2, 2, 2, p);
    // Left petal
    drawRect(ctx, x - 3, y - 1, 2, 2, p);
    // Right petal
    drawRect(ctx, x + 2, y - 1, 2, 2, p);
    // Center
    drawRect(ctx, x - 1, y - 1, 2, 2, PALETTE.yellow);
    drawPixel(ctx, x, y, '#E0C020');
  }

  function drawFlowerLg(x, y, petalColor) {
    // 8-10px lush flower with layered petals
    const p = petalColor;
    const p2 = (petalColor === PALETTE.white) ? '#F0E8F0' : '#E0C0E8';
    // Outer petals (8 directions)
    drawRect(ctx, x - 1, y - 5, 3, 3, p);     // top
    drawRect(ctx, x - 1, y + 3, 3, 3, p);     // bottom
    drawRect(ctx, x - 5, y - 1, 3, 3, p);     // left
    drawRect(ctx, x + 3, y - 1, 3, 3, p);     // right
    // Diagonal petals
    drawRect(ctx, x - 4, y - 4, 2, 2, p2);    // top-left
    drawRect(ctx, x + 3, y - 4, 2, 2, p2);    // top-right
    drawRect(ctx, x - 4, y + 3, 2, 2, p2);    // bottom-left
    drawRect(ctx, x + 3, y + 3, 2, 2, p2);    // bottom-right
    // Inner ring
    drawRect(ctx, x - 2, y - 2, 5, 5, p);
    // Center
    drawRect(ctx, x - 1, y - 1, 3, 3, PALETTE.yellow);
    drawPixel(ctx, x, y, '#D0A020');
    drawPixel(ctx, x + 1, y - 1, '#F0E0A0'); // highlight
  }

  function drawLeafCluster(x, y, dir) {
    // dir: 1 = leaves trail right, -1 = trail left
    const g1 = '#4CAF50';
    const g2 = '#388E3C';
    const g3 = '#2E7D32';
    // Main leaf
    drawRect(ctx, x, y, 5 * dir, 2, g1);
    drawRect(ctx, x + 1 * dir, y + 2, 3 * dir, 1, g2);
    // Small leaf
    drawRect(ctx, x + 2 * dir, y - 2, 3 * dir, 1, g1);
    drawRect(ctx, x + 3 * dir, y - 1, 2 * dir, 1, g2);
    // Tiny accent
    drawPixel(ctx, x + 5 * dir, y + 1, g3);
  }

  // ---- Character (tall, long limbs, big feet, beanie, glasses) ----

  function drawMan(cakeInfo) {
    const { topY, topW, topX, tierH } = cakeInfo;

    // Character anchor: standing on top of tier 3
    const feetY = topY - 1;
    const manX = Math.floor(w / 2);

    // Colors
    const S = PALETTE.skin;
    const K = PALETTE.black;
    const BEANIE = '#FF6D00';   // fluorescent orange
    const JEANS = '#4A6FA5';
    const JEANS_DARK = '#3A5A85';
    const BOOT = '#8B2500';     // Red Wing moc toe
    const BOOT_SOLE = '#5C1A00';
    const SHIRT = '#202020';

    // --- Big feet / Red Wing moc toe boots ---
    const bootY = feetY - 5;
    // Left boot
    drawRect(ctx, manX - 9, bootY, 8, 5, BOOT);
    drawRect(ctx, manX - 10, bootY + 3, 9, 2, BOOT_SOLE); // sole
    drawRect(ctx, manX - 9, bootY + 1, 8, 1, '#A03010');   // moc toe stitch line
    drawPixel(ctx, manX - 9, bootY, '#A03010'); // toe cap line
    // Right boot
    drawRect(ctx, manX + 1, bootY, 8, 5, BOOT);
    drawRect(ctx, manX + 1, bootY + 3, 9, 2, BOOT_SOLE);
    drawRect(ctx, manX + 1, bootY + 1, 8, 1, '#A03010');
    drawPixel(ctx, manX + 8, bootY, '#A03010');

    // --- Long legs (jeans) ---
    const legH = 18;
    const legTopY = bootY - legH;
    // Left leg
    drawRect(ctx, manX - 6, legTopY, 5, legH, JEANS);
    drawRect(ctx, manX - 6, legTopY, 1, legH, JEANS_DARK); // seam shadow
    // Right leg
    drawRect(ctx, manX + 1, legTopY, 5, legH, JEANS);
    drawRect(ctx, manX + 5, legTopY, 1, legH, JEANS_DARK);
    // Belt
    drawRect(ctx, manX - 6, legTopY, 11, 2, '#3A2A1A');
    drawPixel(ctx, manX, legTopY, PALETTE.yellow); // belt buckle

    // --- Torso (black t-shirt) ---
    const torsoH = 14;
    const torsoY = legTopY - torsoH;
    drawRect(ctx, manX - 6, torsoY, 12, torsoH, SHIRT);
    // Slight shirt texture
    drawRect(ctx, manX - 2, torsoY + 4, 4, 1, '#2A2A2A');
    // Neck
    drawRect(ctx, manX - 2, torsoY - 2, 4, 3, S);

    // --- Head ---
    const headW = 10;
    const headH = 10;
    const headY = torsoY - 2 - headH;
    const headX = manX - headW / 2;
    drawRect(ctx, headX, headY, headW, headH, S); // face

    // Beanie (fluorescent orange)
    drawRect(ctx, headX - 1, headY - 5, headW + 2, 6, BEANIE);
    drawRect(ctx, headX, headY - 6, headW, 2, BEANIE); // top
    drawRect(ctx, headX - 1, headY, headW + 2, 2, '#E05A00'); // brim fold
    // Beanie fold line
    drawRect(ctx, headX, headY - 2, headW, 1, '#D04F00');

    // Glasses (black horn-rimmed)
    const glassY = headY + 3;
    // Left lens frame
    drawRect(ctx, headX + 1, glassY, 4, 3, K);
    drawRect(ctx, headX + 2, glassY + 1, 2, 1, '#A0D0F0'); // lens reflection
    // Right lens frame
    drawRect(ctx, headX + 5, glassY, 4, 3, K);
    drawRect(ctx, headX + 6, glassY + 1, 2, 1, '#A0D0F0');
    // Bridge
    drawRect(ctx, headX + 4, glassY + 1, 2, 1, K);

    // Mouth (smile)
    drawPixel(ctx, manX - 1, headY + 8, K);
    drawRect(ctx, manX - 1, headY + 7, 3, 1, K);
    drawPixel(ctx, manX + 1, headY + 8, K);

    // --- Left arm: holding the big candle (wraps around it) ---
    const candleX = manX - 16;
    const candleW = 8;
    const candleH = 40;
    const candleTopY = torsoY - 15;
    const candleBottomY = candleTopY + candleH;

    // Arm behind candle (upper arm from shoulder going left)
    const shoulderLY = torsoY + 2;
    drawRect(ctx, manX - 7, shoulderLY, 2, 3, S);           // shoulder joint
    drawRect(ctx, manX - 9, shoulderLY + 1, 3, 2, S);       // upper arm going left
    drawRect(ctx, manX - 12, shoulderLY + 2, 4, 2, S);      // mid arm
    drawRect(ctx, candleX + candleW + 1, shoulderLY + 3, 3, 3, S); // arm arriving behind candle

    // Candle body
    drawRect(ctx, candleX, candleTopY, candleW, candleH, PALETTE.cream);
    // Candle stripes (red rings)
    for (let i = 0; i < 5; i++) {
      drawRect(ctx, candleX, candleTopY + 6 + i * 8, candleW, 2, PALETTE.red);
    }

    // Arm in front of candle (hand wrapping around)
    drawRect(ctx, candleX - 2, shoulderLY + 3, 3, 4, S);    // hand gripping front
    drawRect(ctx, candleX - 1, shoulderLY + 2, 2, 2, S);    // fingers over top

    // Wick
    drawRect(ctx, candleX + candleW / 2, candleTopY - 4, 1, 4, K);
    // Flame
    drawFlame(ctx, candleX + candleW / 2, candleTopY - 6, frame);

    // --- Right arm: waving, connected to shoulder ---
    const shoulderRX = manX + 6;
    const shoulderRY = torsoY + 2;
    const waveAngle = Math.sin(frame * 0.10) * 0.6;

    // Upper arm (from shoulder going out+up)
    drawRect(ctx, shoulderRX, shoulderRY, 3, 2, S);          // shoulder joint
    const upperEndX = shoulderRX + 3;
    const upperEndY = shoulderRY - 4;
    drawRect(ctx, shoulderRX + 1, shoulderRY - 3, 3, 4, S);  // upper arm

    // Forearm + hand waving
    const swayX = Math.floor(Math.sin(frame * 0.10) * 4);
    const swayY = Math.floor(Math.cos(frame * 0.10) * 2);
    const forearmX = upperEndX + 1 + swayX;
    const forearmY = upperEndY - 5 + swayY;
    // Forearm
    drawRect(ctx, upperEndX + swayX * 0.3, upperEndY - 2, 3, 4 + swayY * 0.3, S);
    // Hand (open palm waving)
    drawRect(ctx, forearmX, forearmY, 4, 3, S);
    // Fingers
    drawPixel(ctx, forearmX, forearmY - 1, S);
    drawPixel(ctx, forearmX + 1, forearmY - 1, S);
    drawPixel(ctx, forearmX + 2, forearmY - 1, S);
    drawPixel(ctx, forearmX + 3, forearmY - 1, S);

    // Sleeve edges (t-shirt short sleeves)
    drawRect(ctx, manX - 7, torsoY, 2, 4, SHIRT);  // left sleeve
    drawRect(ctx, manX + 5, torsoY, 3, 4, SHIRT);   // right sleeve
  }

  // ---- Particles ----
  const particles = [];
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: Math.random() * 200,
      y: Math.random() * 120,
      speed: 0.12 + Math.random() * 0.18,
      color: [PALETTE.yellow, PALETTE.red, PALETTE.pink, PALETTE.white, '#D0A0E0'][Math.floor(Math.random() * 5)],
      size: 1 + Math.floor(Math.random() * 2),
      phase: Math.random() * Math.PI * 2,
    });
  }

  function drawParticles() {
    particles.forEach(p => {
      p.y += p.speed;
      p.x += Math.sin(frame * 0.025 + p.phase) * 0.3;
      if (p.y > 120) {
        p.y = -2;
        p.x = Math.random() * 200;
      }
      const alpha = 0.4 + Math.sin(frame * 0.08 + p.phase) * 0.3;
      ctx.globalAlpha = alpha;
      drawRect(ctx, p.x, p.y, p.size, p.size, p.color);
      ctx.globalAlpha = 1;
    });
  }

  // ---- Render loop ----

  function render() {
    ctx.clearRect(0, 0, w, h);

    drawSky();
    drawGrass();
    drawParticles();

    const cakeInfo = drawCake();
    drawMan(cakeInfo);

    // Bottom gradient for text readability
    drawBottomGradient(ctx, w, h, '24,24,24', 0.62);

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

  registerScene(1, init, start, stop);
})();
