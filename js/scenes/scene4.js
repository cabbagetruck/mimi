// ===== Scene 4: 무한 줌 — 타랑해 양배추 + 촛불 =====
// 양배추 클로즈업 → '타랑해' 글씨 → 촛불 → 심지로 줌인 → 다시 양배추 (무한 루프)

(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;

  // Zoom cycle: continuously zooming in, cross-fading at reset
  // Two layers alternate to create seamless infinite zoom
  let zoomA = 1;       // current scale of layer A
  let zoomB = 1;       // current scale of layer B
  let alphaA = 1;
  let alphaB = 0;
  let activeLayer = 0; // 0 = A is foreground, 1 = B is foreground

  const ZOOM_SPEED = 0.1;
  const MAX_ZOOM = 20;
  const CROSSFADE_START = 19; // start fading when zoom reaches this

  function init() {
    const setup = setupCanvas('canvas-4', 200, 360);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
  }

  // ---- Draw the cabbage scene at a given zoom level ----

  function drawScene(zoom, alpha) {
    if (alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Zoom toward the candle flame (center-top area of the cabbage)
    const focusX = w / 2;
    const focusY = h * 0.28;
    ctx.translate(focusX, focusY);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);

    // Background (dark warm tone)
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(20 + t * 25);
      const g = Math.floor(18 + t * 20);
      const b = Math.floor(35 + t * 15);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }

    // Subtle radial glow behind cabbage (warm light from candle)
    for (let r = 60; r > 0; r -= 2) {
      const a = 0.02 + (60 - r) * 0.001;
      ctx.fillStyle = `rgba(240, 200, 100, ${a})`;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.38, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- Big cabbage (center) ----
    drawBigCabbage(w / 2, h * 0.52);

    // ---- '타랑해' text on the cabbage ----
    drawWobblyText(w / 2, h * 0.52);

    // ---- Candle on top of cabbage ----
    drawCandle(w / 2, h * 0.32);

    ctx.restore();
  }

  function drawBigCabbage(cx, cy) {
    const r = 45;
    // Outer leaves
    drawCircle(ctx, cx, cy, r, '#4CAF50');
    drawCircle(ctx, cx + 2, cy + 2, r - 2, '#388E3C');
    drawCircle(ctx, cx - 2, cy - 2, r - 2, '#4CAF50');
    // Inner layers
    drawCircle(ctx, cx - 3, cy - 3, r - 8, '#5CBF5C');
    drawCircle(ctx, cx - 2, cy - 5, r - 15, '#6DD06D');
    drawCircle(ctx, cx, cy - 6, r - 22, '#7DE07D');
    // Vein details
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const vx = cx + Math.cos(angle) * (r * 0.5);
      const vy = cy + Math.sin(angle) * (r * 0.5);
      drawRect(ctx, Math.floor(vx), Math.floor(vy), 2, 2, '#388E3C');
    }
    // Leaf edge bumps
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bx = cx + Math.cos(angle) * (r - 1);
      const by = cy + Math.sin(angle) * (r - 1);
      drawCircle(ctx, Math.floor(bx), Math.floor(by), 3, '#3A9A3A');
    }
  }

  function drawWobblyText(cx, cy) {
    // '타랑해' in wobbly handwritten style — pixel by pixel
    // Each character is drawn with intentional crookedness
    const textColor = '#F8F0E0';
    const shadowColor = '#2A4A2A';
    const startX = cx - 22;
    const baseY = cy - 4;

    // Shadow first
    drawWobblyChar_ta(startX + 1, baseY + 1, shadowColor);
    drawWobblyChar_rang(startX + 16, baseY + 2, shadowColor);
    drawWobblyChar_hae(startX + 33, baseY + 1, shadowColor);

    // Main text
    drawWobblyChar_ta(startX, baseY, textColor);
    drawWobblyChar_rang(startX + 15, baseY + 1, textColor);
    drawWobblyChar_hae(startX + 32, baseY, textColor);
  }

  // 타 - deliberately wobbly
  function drawWobblyChar_ta(x, y, c) {
    // ㅌ top
    drawRect(ctx, x, y, 9, 2, c);
    drawRect(ctx, x + 1, y + 3, 7, 2, c);
    drawRect(ctx, x, y + 6, 9, 2, c);
    drawRect(ctx, x, y, 2, 8, c);
    // ㅏ
    drawRect(ctx, x + 10, y + 1, 2, 8, c);
    drawRect(ctx, x + 12, y + 3, 2, 2, c);
  }

  // 랑 - wobbly
  function drawWobblyChar_rang(x, y, c) {
    // ㄹ
    drawRect(ctx, x, y - 1, 7, 2, c);
    drawRect(ctx, x + 5, y + 1, 2, 2, c);
    drawRect(ctx, x + 1, y + 3, 6, 2, c);
    drawRect(ctx, x, y + 5, 2, 2, c);
    drawRect(ctx, x, y + 6, 8, 2, c);
    // ㅏ
    drawRect(ctx, x + 9, y, 2, 8, c);
    drawRect(ctx, x + 11, y + 2, 2, 2, c);
    // ㅇ underneath
    drawCircle(ctx, x + 5, y + 12, 3, c);
    // Clear center of ㅇ
    drawCircle(ctx, x + 5, y + 12, 1, '#4CAF50');
  }

  // 해 - wobbly
  function drawWobblyChar_hae(x, y, c) {
    // ㅎ
    drawRect(ctx, x + 2, y, 4, 2, c);     // dot/top
    drawRect(ctx, x, y + 3, 8, 2, c);     // middle bar
    drawCircle(ctx, x + 4, y + 8, 3, c);  // circle
    drawCircle(ctx, x + 4, y + 8, 1, '#4CAF50'); // hollow
    // ㅐ
    drawRect(ctx, x + 9, y + 1, 2, 10, c);
    drawRect(ctx, x + 12, y + 1, 2, 10, c);
    drawRect(ctx, x + 11, y + 4, 1, 2, c);
    drawRect(ctx, x + 14, y + 4, 2, 2, c);
  }

  function drawCandle(cx, topY) {
    // Candle stick
    const candleH = 28;
    const candleW = 8;
    const candleTop = topY;
    const candleBottom = candleTop + candleH;

    // Candle body
    drawRect(ctx, cx - candleW / 2, candleTop, candleW, candleH, '#F0E8D8');
    // Stripes
    drawRect(ctx, cx - candleW / 2, candleTop + 5, candleW, 2, '#E04060');
    drawRect(ctx, cx - candleW / 2, candleTop + 12, candleW, 2, '#E04060');
    drawRect(ctx, cx - candleW / 2, candleTop + 19, candleW, 2, '#E04060');
    // Candle top highlight
    drawRect(ctx, cx - candleW / 2, candleTop, candleW, 2, '#F8F0E8');

    // Wick
    drawRect(ctx, cx, candleTop - 4, 1, 4, '#3A2A1A');

    // Flame (animated)
    drawFlame(ctx, cx, candleTop - 7, frame);

    // Glow around flame
    const glowIntensity = 0.08 + Math.sin(frame * 0.1) * 0.03;
    ctx.fillStyle = `rgba(255, 200, 80, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(cx, candleTop - 6, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- Render with dual-layer infinite zoom ----

  function render() {
    ctx.clearRect(0, 0, w, h);

    // Update zoom levels
    zoomA += ZOOM_SPEED;
    zoomB += ZOOM_SPEED;

    // Compute cross-fade alphas
    if (activeLayer === 0) {
      alphaA = 1;
      alphaB = 0;
      if (zoomA >= CROSSFADE_START) {
        // Start fading A out, bring B in from zoom=1
        const fadeProgress = (zoomA - CROSSFADE_START) / (MAX_ZOOM - CROSSFADE_START);
        alphaA = 1 - fadeProgress;
        alphaB = fadeProgress;
        if (zoomB < 1 || zoomB >= CROSSFADE_START) {
          zoomB = 1; // reset B
        }
      }
      if (zoomA >= MAX_ZOOM) {
        // Switch: B is now foreground
        activeLayer = 1;
        zoomA = 1;
        alphaA = 0;
        alphaB = 1;
      }
    } else {
      alphaA = 0;
      alphaB = 1;
      if (zoomB >= CROSSFADE_START) {
        const fadeProgress = (zoomB - CROSSFADE_START) / (MAX_ZOOM - CROSSFADE_START);
        alphaB = 1 - fadeProgress;
        alphaA = fadeProgress;
        if (zoomA < 1 || zoomA >= CROSSFADE_START) {
          zoomA = 1;
        }
      }
      if (zoomB >= MAX_ZOOM) {
        activeLayer = 0;
        zoomB = 1;
        alphaB = 0;
        alphaA = 1;
      }
    }

    // Draw both layers (back layer first)
    if (activeLayer === 0) {
      drawScene(zoomB, alphaB);
      drawScene(zoomA, alphaA);
    } else {
      drawScene(zoomA, alphaA);
      drawScene(zoomB, alphaB);
    }

    // Bottom gradient for text
    drawBottomGradient(ctx, w, h, '24,24,24', 0.55);

    frame++;
    animFrame = requestAnimationFrame(render);
  }

  function start() {
    frame = 0;
    zoomA = 1;
    zoomB = 1;
    alphaA = 1;
    alphaB = 0;
    activeLayer = 0;
    render();
  }

  function stop() {
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  registerScene(4, init, start, stop);
})();
