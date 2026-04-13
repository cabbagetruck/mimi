// ===== Scene 2: 양배추 트럭 앞에서 양배추를 파는 남자와 여자 =====
// 와이드샷 → 여자 얼굴로 실제 줌인 → 눈 지긋이 감기

(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;

  // Zoom state machine (single play, stops at end)
  // 0: wide (3s) → 1: zooming in (1.5s) → 2: hold zoom (0.5s) → 3: eye closing (1.5s) → 4: tear drop (2s) → 5: hold final (forever)
  let phase = 0;
  let phaseTimer = 0;
  const PHASE_DURATIONS = [180, 90, 30, 90, 120, Infinity];

  // Female character position (set during wide draw, used for zoom target)
  let femaleHeadCenterX = 110;
  let femaleHeadCenterY = 150;

  function init() {
    const setup = setupCanvas('canvas-2', 200, 360);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
  }

  // ---- Background (sky only, no grass) ----

  function drawBackground() {
    // Sky top to bottom gradient
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(70 + t * 90);
      const g = Math.floor(140 + t * 70);
      const b = Math.floor(245 - t * 50);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }
    // Clouds
    drawCloud(12, 20);
    drawCloud(90, 35);
    drawCloud(155, 15);
    drawCloud(50, 50);
  }

  function drawCloud(x, y) {
    const c = 'rgba(255,255,255,0.65)';
    drawRect(ctx, x, y, 20, 5, c);
    drawRect(ctx, x + 3, y - 3, 14, 3, c);
    drawRect(ctx, x + 6, y - 5, 7, 2, c);
  }

  // ---- Road strip (simple) ----

  function drawRoad() {
    const roadY = Math.floor(h * 0.58);
    // Asphalt
    drawRect(ctx, 0, roadY, w, 30, '#706058');
    drawRect(ctx, 0, roadY, w, 2, '#807068');
    drawRect(ctx, 0, roadY + 28, w, 2, '#605048');
    // Dashed center line
    for (let x = -10; x < w; x += 20) {
      drawRect(ctx, x, roadY + 14, 10, 2, '#C8B896');
    }
    // Sidewalk / curb
    drawRect(ctx, 0, roadY - 3, w, 3, '#A09888');
    drawRect(ctx, 0, roadY - 4, w, 1, '#B8A898');
  }

  // ==== TRUCK (reference-faithful pixel art) ====
  // Reference: blue 1-ton truck, cab on the RIGHT, open cargo bed on LEFT
  // Cabbages heaped above the bed walls, tightly packed

  function drawTruck() {
    // Truck positioned center-left, facing right
    const tx = 8;                // truck left edge
    const groundY = Math.floor(h * 0.58) - 3; // truck sits on curb

    // --- Proportions based on reference ---
    const totalW = 130;
    const totalH = 65;
    const bedW = 82;             // cargo bed width
    const cabW = totalW - bedW;  // cabin width
    const truckBottom = groundY;
    const truckTop = truckBottom - totalH;

    // ---- Chassis / undercarriage ----
    drawRect(ctx, tx, truckBottom - 8, totalW, 8, '#2A4A70');

    // ---- Wheels ----
    const wheelY = truckBottom - 2;
    // Rear wheel (under bed)
    drawWheel(tx + 18, wheelY, 9);
    // Front wheel (under cab)
    drawWheel(tx + totalW - 16, wheelY, 9);

    // Wheel arches
    drawRect(ctx, tx + 8, truckBottom - 16, 22, 8, '#2A4A70');
    drawRect(ctx, tx + totalW - 28, truckBottom - 16, 22, 8, '#2A4A70');

    // ---- Cargo bed ----
    const bedX = tx;
    const bedFloorY = truckTop + 25;
    const bedH = truckBottom - 8 - bedFloorY;

    // Bed floor
    drawRect(ctx, bedX, bedFloorY, bedW, bedH, '#3568A0');
    // Bed left wall
    drawRect(ctx, bedX, truckTop + 10, 4, bedFloorY - truckTop - 10 + bedH, '#3568A0');
    drawRect(ctx, bedX, truckTop + 10, 4, bedFloorY - truckTop - 10 + bedH, 'rgba(255,255,255,0.08)');
    // Bed rear panel (right side of bed, connects to cab)
    drawRect(ctx, bedX + bedW - 4, truckTop + 10, 4, bedFloorY - truckTop - 10 + bedH, '#2A5080');
    // Bed top rail
    drawRect(ctx, bedX, truckTop + 8, bedW, 3, '#4080B8');
    // Horizontal body line
    drawRect(ctx, bedX, bedFloorY - 1, bedW, 2, '#2A5080');
    // Vertical stake/slat lines on bed wall
    for (let i = 0; i < 4; i++) {
      const sx = bedX + 12 + i * 18;
      drawRect(ctx, sx, truckTop + 10, 2, bedFloorY - truckTop - 10, '#2A5080');
    }

    // ---- Cabbages (tightly packed, overflowing) ----
    drawCabbagePile(bedX + 4, truckTop + 10, bedW - 8, bedFloorY - truckTop - 10 + bedH);

    // ---- Cabin ----
    const cabX = bedX + bedW;
    const cabTop = truckTop;
    const cabH = truckBottom - 8 - cabTop;

    // Cab body
    drawRect(ctx, cabX, cabTop, cabW, cabH, '#3568A0');
    // Roof highlight
    drawRect(ctx, cabX, cabTop, cabW, 3, '#4080B8');
    // Windshield (front, on right side)
    drawRect(ctx, cabX + cabW - 3, cabTop + 8, 3, 28, '#80C0E0');
    drawRect(ctx, cabX + cabW - 3, cabTop + 8, 3, 3, '#A0D8F0');
    // Side window
    drawRect(ctx, cabX + 5, cabTop + 8, cabW - 10, 16, '#80C0E0');
    drawRect(ctx, cabX + 5, cabTop + 8, cabW - 10, 2, '#A0D8F0');
    // Window glare
    drawRect(ctx, cabX + 7, cabTop + 11, 4, 6, 'rgba(255,255,255,0.25)');
    // Window divider
    drawRect(ctx, cabX + cabW / 2 + 2, cabTop + 8, 2, 16, '#2A5080');
    // Door line
    drawRect(ctx, cabX + 3, cabTop + 26, 1, cabH - 28, '#2A5080');
    // Door handle
    drawRect(ctx, cabX + 6, cabTop + 36, 5, 2, '#C0C0C0');
    drawRect(ctx, cabX + 7, cabTop + 37, 3, 1, '#E0E0E0');
    // Headlight
    drawRect(ctx, cabX + cabW - 2, cabTop + cabH - 18, 3, 7, PALETTE.yellow);
    drawRect(ctx, cabX + cabW - 1, cabTop + cabH - 17, 1, 5, '#FFF8E0');
    // Bumper
    drawRect(ctx, cabX + cabW - 4, cabTop + cabH - 4, 6, 4, '#808888');
    drawRect(ctx, tx - 2, truckBottom - 12, 4, 4, '#808888');
    // Tail light (left rear)
    drawRect(ctx, tx, truckBottom - 18, 3, 5, '#E04040');
    drawRect(ctx, tx + 1, truckBottom - 17, 1, 3, '#FF6060');

    // ---- Cab-bed connection shadow ----
    drawRect(ctx, cabX - 1, cabTop + 3, 2, cabH - 5, 'rgba(0,0,0,0.15)');

    return { truckBottom: groundY, tx, totalW };
  }

  function drawWheel(cx, cy, r) {
    // Tire
    drawCircle(ctx, cx, cy, r, '#2A2A2A');
    drawCircle(ctx, cx, cy, r - 1, '#3A3A3A');
    // Rim
    drawCircle(ctx, cx, cy, r - 4, '#707878');
    drawCircle(ctx, cx, cy, r - 5, '#889090');
    // Hubcap center
    drawCircle(ctx, cx, cy, 2, '#A0A8A8');
    // Bolt dots
    drawPixel(ctx, cx - 2, cy, '#606868');
    drawPixel(ctx, cx + 2, cy, '#606868');
    drawPixel(ctx, cx, cy - 2, '#606868');
    drawPixel(ctx, cx, cy + 2, '#606868');
  }

  function drawCabbagePile(x, y, areaW, areaH) {
    // Tightly packed cabbages filling the bed, overflowing above the rails
    // Draw from bottom to top so upper ones overlap correctly

    const r = 7; // cabbage radius
    const d = r * 2 - 2; // horizontal spacing (overlapping slightly)
    const rowH = r * 2 - 3; // vertical spacing (snug)

    // Calculate rows to fill area + overflow above
    const cols = Math.floor(areaW / d) + 1;
    const rows = 4; // 3 rows fill bed + 1 overflow row

    // Start from bottom of the cargo area
    for (let row = 0; row < rows; row++) {
      const rowY = y + areaH - r - row * rowH;
      const offset = (row % 2) * (d / 2); // brick pattern offset
      for (let col = 0; col < cols; col++) {
        const cx = x + r + col * d + offset - 2;
        if (cx > x - r && cx < x + areaW + r) {
          // Slight size variation
          const sizeVar = (row * 3 + col * 7) % 3 - 1; // -1, 0, or 1
          drawPileCabbage(cx, rowY, r + sizeVar);
        }
      }
    }

    // A couple of carrots peeking between cabbages (reference detail)
    drawCarrot(x + 12, y + areaH - rowH * 2 - 3);
    drawCarrot(x + areaW - 15, y + areaH - rowH - 6);
    drawCarrot(x + areaW / 2 + 5, y + areaH - rowH * 3 + 2);
  }

  function drawPileCabbage(cx, cy, r) {
    // Outer
    drawCircle(ctx, cx, cy, r, '#4CAF50');
    // Shadow crescent
    drawCircle(ctx, cx + 1, cy + 1, r - 1, '#388E3C');
    // Main body
    drawCircle(ctx, cx - 1, cy - 1, r - 1, '#4CAF50');
    // Inner swirl / lighter core
    drawCircle(ctx, cx - 1, cy - 1, r - 3, '#5CBF5C');
    drawCircle(ctx, cx, cy - 2, Math.max(1, r - 5), '#7DD07D');
    // Leaf vein hints
    if (r >= 6) {
      drawPixel(ctx, cx - 2, cy - 3, '#388E3C');
      drawPixel(ctx, cx + 1, cy - 2, '#388E3C');
      drawPixel(ctx, cx, cy - r + 2, '#44A044');
    }
  }

  function drawCarrot(x, y) {
    // Angled carrot
    drawRect(ctx, x, y, 2, 8, PALETTE.orange);
    drawRect(ctx, x + 1, y + 2, 1, 5, '#D07030');
    drawPixel(ctx, x, y + 7, '#C06020');
    // Leaves
    drawRect(ctx, x - 1, y - 2, 1, 3, '#4CAF50');
    drawRect(ctx, x + 1, y - 3, 1, 3, '#388E3C');
    drawRect(ctx, x + 2, y - 2, 1, 2, '#4CAF50');
  }

  // ---- Ground cabbages (being sold, on the road) ----

  function drawGroundCabbages() {
    const gy = Math.floor(h * 0.58) - 4;
    // Loose cabbages
    drawPileCabbage(22, gy - 5, 6);
    drawPileCabbage(40, gy - 4, 7);
    drawPileCabbage(55, gy - 6, 5);
    drawPileCabbage(160, gy - 5, 6);
    drawPileCabbage(178, gy - 4, 5);
    // Wooden crate
    const crateX = 68;
    const crateY = gy - 16;
    drawRect(ctx, crateX, crateY, 22, 16, '#A07840');
    drawRect(ctx, crateX, crateY, 22, 2, '#B89060');
    drawRect(ctx, crateX, crateY + 7, 22, 2, '#B89060');
    drawRect(ctx, crateX, crateY + 14, 22, 2, '#907030');
    drawRect(ctx, crateX, crateY, 2, 16, '#907030');
    drawRect(ctx, crateX + 20, crateY, 2, 16, '#907030');
    // Cabbages in crate
    drawPileCabbage(73, crateY - 4, 5);
    drawPileCabbage(83, crateY - 5, 5);
    drawPileCabbage(78, crateY - 10, 4);
  }

  // ---- Male character (same design as scene1) ----

  function drawMaleChar(baseX, baseY) {
    const S = PALETTE.skin;
    const K = PALETTE.black;
    const BEANIE = '#FF6D00';
    const JEANS = '#4A6FA5';
    const JEANS_DARK = '#3A5A85';
    const BOOT = '#8B2500';
    const BOOT_SOLE = '#5C1A00';
    const SHIRT = '#202020';
    const x = baseX;
    const feetY = baseY;

    // Boots
    const bootY = feetY - 5;
    drawRect(ctx, x - 9, bootY, 8, 5, BOOT);
    drawRect(ctx, x - 10, bootY + 3, 9, 2, BOOT_SOLE);
    drawRect(ctx, x - 9, bootY + 1, 8, 1, '#A03010');
    drawRect(ctx, x + 1, bootY, 8, 5, BOOT);
    drawRect(ctx, x + 1, bootY + 3, 9, 2, BOOT_SOLE);
    drawRect(ctx, x + 1, bootY + 1, 8, 1, '#A03010');

    // Legs
    const legH = 16;
    const legTopY = bootY - legH;
    drawRect(ctx, x - 6, legTopY, 5, legH, JEANS);
    drawRect(ctx, x - 6, legTopY, 1, legH, JEANS_DARK);
    drawRect(ctx, x + 1, legTopY, 5, legH, JEANS);
    drawRect(ctx, x + 5, legTopY, 1, legH, JEANS_DARK);
    drawRect(ctx, x - 6, legTopY, 11, 2, '#3A2A1A'); // belt
    drawPixel(ctx, x, legTopY, PALETTE.yellow); // buckle

    // Torso
    const torsoH = 13;
    const torsoY = legTopY - torsoH;
    drawRect(ctx, x - 6, torsoY, 12, torsoH, SHIRT);
    drawRect(ctx, x - 2, torsoY - 2, 4, 3, S); // neck

    // Head
    const headH = 10;
    const headY = torsoY - 2 - headH;
    drawRect(ctx, x - 5, headY, 10, headH, S);
    // Beanie
    drawRect(ctx, x - 6, headY - 5, 12, 6, BEANIE);
    drawRect(ctx, x - 5, headY - 6, 10, 2, BEANIE);
    drawRect(ctx, x - 6, headY, 12, 2, '#E05A00');
    drawRect(ctx, x - 5, headY - 2, 10, 1, '#D04F00');
    // Glasses
    const gy = headY + 3;
    drawRect(ctx, x - 4, gy, 4, 3, K);
    drawRect(ctx, x - 3, gy + 1, 2, 1, '#A0D0F0');
    drawRect(ctx, x, gy, 4, 3, K);
    drawRect(ctx, x + 1, gy + 1, 2, 1, '#A0D0F0');
    drawRect(ctx, x - 1, gy + 1, 2, 1, K);
    drawRect(ctx, x - 1, headY + 7, 3, 1, K); // smile

    // Left arm holding cabbage up — swaying side to side
    const swayX = Math.floor(Math.sin(frame * 0.06) * 3);
    const swayY = Math.floor(Math.sin(frame * 0.06) * -1);
    drawRect(ctx, x - 7, torsoY, 2, 4, SHIRT);          // shoulder
    drawRect(ctx, x - 9 + swayX * 0.3, torsoY + 1, 3, 3, S); // upper arm
    drawRect(ctx, x - 12 + swayX, torsoY - 2 + swayY, 3, 4, S); // forearm
    drawPileCabbage(x - 15 + swayX, torsoY - 6 + swayY, 5);     // cabbage

    // Right arm at side
    drawRect(ctx, x + 5, torsoY, 2, 4, SHIRT);
    drawRect(ctx, x + 6, torsoY + 3, 3, 5, S);
  }

  // ---- Female character ----

  // Returns position info for zoom targeting
  function drawFemaleChar(baseX, baseY) {
    const S = PALETTE.skin;
    const K = PALETTE.black;
    const HOODIE = '#F0D020';
    const HOODIE_DARK = '#D0B010';
    const PANTS = '#D83030';
    const PANTS_DARK = '#B82020';
    const PANTS_DECO = '#30A060'; // green decoration
    const SLIPPER = '#2AABB3';
    const SLIPPER_DARK = '#1E8A90';
    const HAIR = '#3A2518';
    const x = baseX;
    const feetY = baseY;

    // Slippers (teal)
    const slipperY = feetY - 3;
    drawRect(ctx, x - 8, slipperY, 7, 3, SLIPPER);
    drawRect(ctx, x - 8, slipperY + 2, 7, 1, SLIPPER_DARK);
    drawRect(ctx, x + 1, slipperY, 7, 3, SLIPPER);
    drawRect(ctx, x + 1, slipperY + 2, 7, 1, SLIPPER_DARK);

    // Legs (red long pants with green deco)
    const pantsH = 18;
    const pantsY = slipperY - pantsH;
    // Left leg
    drawRect(ctx, x - 6, pantsY, 5, pantsH, PANTS);
    drawRect(ctx, x - 6, pantsY, 1, pantsH, PANTS_DARK);
    // Right leg
    drawRect(ctx, x + 1, pantsY, 5, pantsH, PANTS);
    drawRect(ctx, x + 5, pantsY, 1, pantsH, PANTS_DARK);
    // Green decoration: vine/leaf pattern down the sides
    // Left leg deco
    drawPixel(ctx, x - 6, pantsY + 4, PANTS_DECO);
    drawPixel(ctx, x - 5, pantsY + 5, PANTS_DECO);
    drawPixel(ctx, x - 6, pantsY + 6, PANTS_DECO);
    drawPixel(ctx, x - 6, pantsY + 9, PANTS_DECO);
    drawPixel(ctx, x - 5, pantsY + 10, PANTS_DECO);
    drawPixel(ctx, x - 6, pantsY + 11, PANTS_DECO);
    drawPixel(ctx, x - 6, pantsY + 14, PANTS_DECO);
    drawPixel(ctx, x - 5, pantsY + 15, PANTS_DECO);
    // Right leg deco
    drawPixel(ctx, x + 5, pantsY + 3, PANTS_DECO);
    drawPixel(ctx, x + 4, pantsY + 4, PANTS_DECO);
    drawPixel(ctx, x + 5, pantsY + 5, PANTS_DECO);
    drawPixel(ctx, x + 5, pantsY + 8, PANTS_DECO);
    drawPixel(ctx, x + 4, pantsY + 9, PANTS_DECO);
    drawPixel(ctx, x + 5, pantsY + 10, PANTS_DECO);
    drawPixel(ctx, x + 5, pantsY + 13, PANTS_DECO);
    drawPixel(ctx, x + 4, pantsY + 14, PANTS_DECO);
    // Waistband
    drawRect(ctx, x - 6, pantsY, 11, 2, PANTS_DARK);

    // Torso (yellow hoodie)
    const torsoH = 14;
    const torsoY = pantsY - torsoH;
    drawRect(ctx, x - 6, torsoY, 12, torsoH, HOODIE);
    // Hood strings
    drawPixel(ctx, x - 1, torsoY + 2, HOODIE_DARK);
    drawPixel(ctx, x + 1, torsoY + 2, HOODIE_DARK);
    drawRect(ctx, x - 1, torsoY + 3, 1, 3, HOODIE_DARK);
    drawRect(ctx, x + 1, torsoY + 3, 1, 3, HOODIE_DARK);
    // Kangaroo pocket
    drawRect(ctx, x - 4, torsoY + 8, 8, 4, HOODIE_DARK);
    drawRect(ctx, x - 3, torsoY + 9, 6, 2, HOODIE);
    // Neck
    drawRect(ctx, x - 2, torsoY - 2, 4, 3, S);

    // Head
    const headH = 10;
    const headY = torsoY - 2 - headH;
    drawRect(ctx, x - 5, headY, 10, headH, S);

    // Hair - wavy bob
    drawRect(ctx, x - 6, headY - 3, 12, 5, HAIR);
    drawRect(ctx, x - 7, headY, 3, 10, HAIR);
    drawRect(ctx, x + 5, headY, 3, 10, HAIR);
    drawRect(ctx, x - 6, headY - 1, 12, 3, HAIR);
    // Wave texture
    drawPixel(ctx, x - 7, headY + 3, '#4A3528');
    drawPixel(ctx, x - 6, headY + 5, '#4A3528');
    drawPixel(ctx, x - 7, headY + 7, '#4A3528');
    drawPixel(ctx, x + 6, headY + 3, '#4A3528');
    drawPixel(ctx, x + 7, headY + 5, '#4A3528');
    drawPixel(ctx, x + 6, headY + 7, '#4A3528');
    // Wave curls at ends
    drawPixel(ctx, x - 8, headY + 9, HAIR);
    drawPixel(ctx, x - 7, headY + 10, HAIR);
    drawPixel(ctx, x + 7, headY + 9, HAIR);
    drawPixel(ctx, x + 8, headY + 10, HAIR);

    // Eyes - droopy, long lashes
    const eyeY = headY + 4;
    // Left eye
    drawRect(ctx, x - 4, eyeY, 3, 2, PALETTE.white);
    drawRect(ctx, x - 3, eyeY, 2, 2, K);
    drawPixel(ctx, x - 3, eyeY, '#A0D0F0');
    // Left lashes
    drawPixel(ctx, x - 5, eyeY - 1, K);
    drawPixel(ctx, x - 4, eyeY - 1, K);
    drawPixel(ctx, x - 3, eyeY - 1, K);
    drawPixel(ctx, x - 2, eyeY - 1, K);
    drawPixel(ctx, x - 5, eyeY, K);
    drawPixel(ctx, x - 5, eyeY + 1, K); // droop
    // Right eye
    drawRect(ctx, x + 1, eyeY, 3, 2, PALETTE.white);
    drawRect(ctx, x + 1, eyeY, 2, 2, K);
    drawPixel(ctx, x + 2, eyeY, '#A0D0F0');
    drawPixel(ctx, x + 1, eyeY - 1, K);
    drawPixel(ctx, x + 2, eyeY - 1, K);
    drawPixel(ctx, x + 3, eyeY - 1, K);
    drawPixel(ctx, x + 4, eyeY - 1, K);
    drawPixel(ctx, x + 4, eyeY, K);
    drawPixel(ctx, x + 4, eyeY + 1, K);
    // Blush
    drawPixel(ctx, x - 4, eyeY + 2, '#F0A0A0');
    drawPixel(ctx, x + 3, eyeY + 2, '#F0A0A0');
    // Smile
    drawPixel(ctx, x - 1, headY + 8, K);
    drawRect(ctx, x, headY + 8, 2, 1, K);
    drawPixel(ctx, x + 1, headY + 8, K);

    // Arms (long hoodie sleeves)
    drawRect(ctx, x - 7, torsoY, 2, 4, HOODIE);
    drawRect(ctx, x - 9, torsoY + 2, 3, 6, HOODIE);
    drawRect(ctx, x - 9, torsoY + 8, 3, 2, S);
    drawPileCabbage(x - 12, torsoY + 4, 4);
    drawRect(ctx, x + 5, torsoY, 2, 4, HOODIE);
    drawRect(ctx, x + 6, torsoY + 3, 3, 5, HOODIE);
    drawRect(ctx, x + 6, torsoY + 8, 3, 2, S);

    // Store head center for zoom target
    femaleHeadCenterX = x;
    femaleHeadCenterY = headY + headH / 2;

    return { headY, headX: x, eyeY };
  }

  // ---- Closeup face (drawn at the same canvas coords, we zoom via transform) ----
  // eyeClose: 0 = open, 1 = fully closed

  function drawFemaleCloseupFace(fx, fy, eyeClose, tearProgress) {
    const S = PALETTE.skin;
    const K = PALETTE.black;
    const HAIR = '#3A2518';

    // Face
    drawRect(ctx, fx - 5, fy - 5, 10, 10, S);

    // Hair
    drawRect(ctx, fx - 6, fy - 8, 12, 5, HAIR);
    drawRect(ctx, fx - 7, fy - 4, 3, 10, HAIR);
    drawRect(ctx, fx + 5, fy - 4, 3, 10, HAIR);
    drawRect(ctx, fx - 6, fy - 6, 12, 3, HAIR);
    // Wave
    drawPixel(ctx, fx - 7, fy - 1, '#4A3528');
    drawPixel(ctx, fx - 6, fy + 1, '#4A3528');
    drawPixel(ctx, fx - 7, fy + 3, '#4A3528');
    drawPixel(ctx, fx + 6, fy - 1, '#4A3528');
    drawPixel(ctx, fx + 7, fy + 1, '#4A3528');
    drawPixel(ctx, fx + 6, fy + 3, '#4A3528');
    drawPixel(ctx, fx - 8, fy + 5, HAIR);
    drawPixel(ctx, fx + 7, fy + 5, HAIR);

    // Eyes with closing animation
    const eyeY = fy - 1;

    if (eyeClose < 0.3) {
      // Open eyes - droopy with long lashes
      // Left eye
      drawRect(ctx, fx - 4, eyeY, 3, 2, PALETTE.white);
      drawRect(ctx, fx - 3, eyeY, 2, 2, '#4A3020');
      drawPixel(ctx, fx - 3, eyeY, '#A0D0F0');
      // Left lashes
      drawPixel(ctx, fx - 5, eyeY - 1, K);
      drawPixel(ctx, fx - 4, eyeY - 1, K);
      drawPixel(ctx, fx - 3, eyeY - 1, K);
      drawPixel(ctx, fx - 2, eyeY - 1, K);
      drawPixel(ctx, fx - 5, eyeY, K);
      drawPixel(ctx, fx - 5, eyeY + 1, K);
      // Right eye
      drawRect(ctx, fx + 1, eyeY, 3, 2, PALETTE.white);
      drawRect(ctx, fx + 1, eyeY, 2, 2, '#4A3020');
      drawPixel(ctx, fx + 2, eyeY, '#A0D0F0');
      drawPixel(ctx, fx + 1, eyeY - 1, K);
      drawPixel(ctx, fx + 2, eyeY - 1, K);
      drawPixel(ctx, fx + 3, eyeY - 1, K);
      drawPixel(ctx, fx + 4, eyeY - 1, K);
      drawPixel(ctx, fx + 4, eyeY, K);
      drawPixel(ctx, fx + 4, eyeY + 1, K);
    } else if (eyeClose < 0.6) {
      // Half closed - eyelids covering top half
      // Left eye
      drawRect(ctx, fx - 4, eyeY + 1, 3, 1, PALETTE.white);
      drawPixel(ctx, fx - 3, eyeY + 1, '#4A3020');
      // Eyelid
      drawRect(ctx, fx - 5, eyeY - 1, 4, 2, S);
      // Lashes on lid
      drawPixel(ctx, fx - 5, eyeY - 1, K);
      drawPixel(ctx, fx - 4, eyeY - 1, K);
      drawPixel(ctx, fx - 3, eyeY - 1, K);
      drawPixel(ctx, fx - 2, eyeY - 1, K);
      drawPixel(ctx, fx - 5, eyeY, K);
      drawPixel(ctx, fx - 5, eyeY + 1, K);
      // Right eye
      drawRect(ctx, fx + 1, eyeY + 1, 3, 1, PALETTE.white);
      drawPixel(ctx, fx + 2, eyeY + 1, '#4A3020');
      drawRect(ctx, fx + 1, eyeY - 1, 4, 2, S);
      drawPixel(ctx, fx + 1, eyeY - 1, K);
      drawPixel(ctx, fx + 2, eyeY - 1, K);
      drawPixel(ctx, fx + 3, eyeY - 1, K);
      drawPixel(ctx, fx + 4, eyeY - 1, K);
      drawPixel(ctx, fx + 4, eyeY, K);
      drawPixel(ctx, fx + 4, eyeY + 1, K);
    } else {
      // Fully closed - just lash lines (gentle, content expression)
      // Left closed eye - curved line
      drawPixel(ctx, fx - 5, eyeY - 1, K);
      drawPixel(ctx, fx - 4, eyeY, K);
      drawPixel(ctx, fx - 3, eyeY, K);
      drawPixel(ctx, fx - 2, eyeY, K);
      drawPixel(ctx, fx - 5, eyeY, K);
      drawPixel(ctx, fx - 5, eyeY + 1, K); // droop
      // Right closed eye
      drawPixel(ctx, fx + 4, eyeY - 1, K);
      drawPixel(ctx, fx + 3, eyeY, K);
      drawPixel(ctx, fx + 2, eyeY, K);
      drawPixel(ctx, fx + 1, eyeY, K);
      drawPixel(ctx, fx + 4, eyeY, K);
      drawPixel(ctx, fx + 4, eyeY + 1, K);
    }

    // Blush (always)
    drawPixel(ctx, fx - 4, eyeY + 2, '#F0A0A0');
    drawPixel(ctx, fx + 3, eyeY + 2, '#F0A0A0');

    // Nose
    drawPixel(ctx, fx, fy + 1, '#E0A080');

    // Gentle smile
    drawPixel(ctx, fx - 1, fy + 3, K);
    drawPixel(ctx, fx, fy + 3, K);
    drawPixel(ctx, fx + 1, fy + 3, K);

    // Tear drop from left eye
    if (tearProgress > 0) {
      const tearStartY = eyeY + 2;
      const tearTravelY = tearProgress * 6; // travels 6 pixels down
      const tearY = tearStartY + tearTravelY;
      const tearX = fx - 4;
      // Tear body (light blue)
      drawPixel(ctx, tearX, Math.floor(tearY), '#80C8F0');
      if (tearProgress > 0.2) {
        drawPixel(ctx, tearX, Math.floor(tearY) - 1, '#A0D8F8');
      }
      // Tear trail (fading)
      if (tearProgress > 0.4) {
        drawPixel(ctx, tearX, Math.floor(tearY) - 2, 'rgba(160,216,248,0.5)');
      }
    }
  }

  // ---- Sign ----

  function drawSign() {
    const sx = 96;
    const sy = Math.floor(h * 0.52);
    drawRect(ctx, sx + 8, sy, 3, 16, '#A07840');
    drawRect(ctx, sx - 4, sy - 14, 26, 14, '#F8E8C0');
    drawRect(ctx, sx - 4, sy - 14, 26, 2, '#A07840');
    drawRect(ctx, sx - 4, sy - 2, 26, 2, '#A07840');
    drawPixelText(ctx, '양배추', sx + 9, sy - 7, '#4A3020', 5);
  }

  // ---- Draw the full wide scene (used for both wide shot and as zoom source) ----

  function drawWideScene() {
    drawBackground();
    drawRoad();
    drawTruck();
    drawGroundCabbages();
    drawSign();

    const roadY = Math.floor(h * 0.58) - 4;
    drawMaleChar(160, roadY);
    drawFemaleChar(115, roadY);
  }

  // ---- Render ----

  function render() {
    ctx.clearRect(0, 0, w, h);

    // Phase state machine (no loop — stops at phase 5)
    if (phase < 5) {
      phaseTimer++;
      if (phaseTimer > PHASE_DURATIONS[phase]) {
        phaseTimer = 0;
        phase++;
      }
    }

    if (phase === 0) {
      // Wide shot
      drawWideScene();
      drawBottomGradient(ctx, w, h, '24,24,24', 0.62);
    } else if (phase === 1) {
      // Zooming into female face
      const t = phaseTimer / PHASE_DURATIONS[1]; // 0 → 1
      const zoomLevel = 1 + t * 7; // 1x → 8x
      const targetX = femaleHeadCenterX;
      const targetY = femaleHeadCenterY;

      ctx.save();
      ctx.translate(w / 2, h * 0.38);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-targetX, -targetY);

      drawWideScene();

      ctx.restore();
      drawBottomGradient(ctx, w, h, '24,24,24', 0.55);
    } else {
      // Phases 2-5: Zoomed in closeup face
      drawRect(ctx, 0, 0, w, h, '#B0D0F0');

      // Eye closing progress
      let eyeClose = 0;
      if (phase === 2) eyeClose = 0;                               // open
      if (phase === 3) eyeClose = phaseTimer / PHASE_DURATIONS[3]; // closing
      if (phase >= 4) eyeClose = 1;                                // closed

      // Tear progress
      let tearProgress = 0;
      if (phase === 4) tearProgress = phaseTimer / PHASE_DURATIONS[4]; // 0 → 1
      if (phase >= 5) tearProgress = 1;                                // held

      ctx.save();
      const faceScale = 10;
      ctx.translate(w / 2, h * 0.35);
      ctx.scale(faceScale, faceScale);
      drawFemaleCloseupFace(0, 0, eyeClose, tearProgress);
      ctx.restore();

      drawBottomGradient(ctx, w, h, '24,24,24', 0.55);
    }

    frame++;
    animFrame = requestAnimationFrame(render);
  }

  function start() {
    frame = 0;
    phase = 0;
    phaseTimer = 0;
    render();
  }

  function stop() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  registerScene(2, init, start, stop);
})();
