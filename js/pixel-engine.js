// ===== Pixel Art Rendering Engine =====

// Scene registry (loaded before scene files)
const scenes = {};
function registerScene(pageNum, initFn, startFn, stopFn) {
  scenes[pageNum] = { init: initFn, start: startFn, stop: stopFn };
}

// Color palette (Super Mario inspired)
const PALETTE = {
  red: '#E44040',
  blue: '#4060D0',
  green: '#40A040',
  darkGreen: '#2D7A2D',
  yellow: '#F0D020',
  brown: '#A06020',
  darkBrown: '#6B3A10',
  skin: '#F0B080',
  white: '#F8F8F8',
  black: '#181818',
  sky: '#70B0F0',
  pink: '#F090B0',
  lightPink: '#F8C0D0',
  orange: '#E08030',
  gray: '#909090',
  lightGray: '#C0C0C0',
  darkGray: '#505050',
  cream: '#F8E8C0',
};

// Setup a canvas with proper pixel scaling
function setupCanvas(canvasId, pixelWidth, pixelHeight) {
  const canvas = document.getElementById(canvasId);
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx, w: pixelWidth, h: pixelHeight };
}

// Draw a single pixel (actually a 1x1 rect at pixel scale)
function drawPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

// Draw a filled rectangle
function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

// Draw a sprite from a 2D color array
// spriteData: array of rows, each row is array of color strings (null = transparent)
function drawSprite(ctx, x, y, spriteData, scale) {
  scale = scale || 1;
  for (let row = 0; row < spriteData.length; row++) {
    for (let col = 0; col < spriteData[row].length; col++) {
      const color = spriteData[row][col];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(x + col * scale),
          Math.floor(y + row * scale),
          scale,
          scale
        );
      }
    }
  }
}

// Draw a circle (filled, pixelated)
function drawCircle(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) {
        ctx.fillRect(Math.floor(cx + x), Math.floor(cy + y), 1, 1);
      }
    }
  }
}

// Draw a triangle (filled)
function drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

// Sparkle effect (4-point star)
function drawSparkle(ctx, x, y, size, frame, color) {
  const t = (Math.sin(frame * 0.15) + 1) / 2; // 0~1 pulsing
  const s = Math.floor(size * (0.5 + t * 0.5));
  const c = color || PALETTE.yellow;
  // Vertical line
  drawRect(ctx, x, y - s, 1, s * 2 + 1, c);
  // Horizontal line
  drawRect(ctx, x - s, y, s * 2 + 1, 1, c);
  // Diagonal dots at half size
  const d = Math.floor(s * 0.6);
  if (d > 0) {
    drawPixel(ctx, x - d, y - d, c);
    drawPixel(ctx, x + d, y - d, c);
    drawPixel(ctx, x - d, y + d, c);
    drawPixel(ctx, x + d, y + d, c);
  }
}

// Candle flame animation
// Returns flame sprite data based on frame
function drawFlame(ctx, x, y, frame) {
  const flicker = Math.sin(frame * 0.2) * 0.5 + Math.sin(frame * 0.37) * 0.3;
  const sway = Math.sin(frame * 0.12) * 1.5;

  // Outer glow
  const glowAlpha = 0.15 + Math.sin(frame * 0.1) * 0.05;
  ctx.fillStyle = `rgba(240, 208, 32, ${glowAlpha})`;
  drawCircle(ctx, x + sway * 0.5, y - 2, 4 + flicker, `rgba(240, 208, 32, ${glowAlpha})`);
  ctx.fillStyle = `rgba(240, 208, 32, ${glowAlpha})`;

  // Outer flame (yellow-orange)
  const outerH = 5 + flicker;
  ctx.fillStyle = PALETTE.orange;
  ctx.beginPath();
  ctx.ellipse(x + sway * 0.7, y - outerH / 2, 2, outerH / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner flame (yellow)
  const innerH = 3 + flicker * 0.5;
  ctx.fillStyle = PALETTE.yellow;
  ctx.beginPath();
  ctx.ellipse(x + sway * 0.4, y - innerH / 2 - 0.5, 1.2, innerH / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // White hot core
  ctx.fillStyle = PALETTE.white;
  ctx.fillRect(Math.floor(x + sway * 0.2), Math.floor(y - 1), 1, 1);
}

// Draw cabbage
function drawCabbage(ctx, x, y, size) {
  const s = size;
  // Outer leaves (darker green)
  drawCircle(ctx, x, y, s, PALETTE.green);
  // Inner layers
  drawCircle(ctx, x - s * 0.15, y - s * 0.1, s * 0.75, PALETTE.darkGreen);
  drawCircle(ctx, x + s * 0.1, y + s * 0.05, s * 0.6, PALETTE.green);
  // Center highlight
  drawCircle(ctx, x, y - s * 0.1, s * 0.35, '#50C050');
  // Vein lines (simple pixel lines)
  drawPixel(ctx, x, y - s * 0.3, PALETTE.darkGreen);
  drawPixel(ctx, x - 1, y - s * 0.15, PALETTE.darkGreen);
  drawPixel(ctx, x + 1, y - s * 0.15, PALETTE.darkGreen);
}

// Draw gradient background (bottom area for text readability)
function drawBottomGradient(ctx, w, h, color, startRatio) {
  const startY = Math.floor(h * (startRatio || 0.55));
  const steps = h - startY;
  for (let i = 0; i < steps; i++) {
    const alpha = (i / steps) * 0.85;
    ctx.fillStyle = `rgba(${color || '24,24,24'}, ${alpha})`;
    ctx.fillRect(0, startY + i, w, 1);
  }
}

// Simple text drawing on canvas (pixel style)
function drawPixelText(ctx, text, x, y, color, charSize) {
  // This is a simplified pixel text - for complex Korean, we rely on HTML overlay
  // This is only for in-canvas text like "타랑해" on the cabbage
  ctx.fillStyle = color || PALETTE.white;
  ctx.font = `${charSize || 6}px monospace`;
  ctx.imageSmoothingEnabled = false;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
