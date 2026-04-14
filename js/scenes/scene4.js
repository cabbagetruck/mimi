// ===== Scene 4: 프랙탈 무한 줌 — 불꽃 심지 안으로 끝없이 dive =====

(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;
  let zoom = 1;

  // 줌은 지수적으로 증가 (등속 느낌: 매 프레임 일정 비율 곱하기)
  const ZOOM_MULTIPLIER = 1.02;  // 매 프레임 1.2% 씩 확대
  const RESET_ZOOM = 210;        // 이 배율에서 B=A 1:1 → 리셋
  const PORTAL_VISIBLE = 20;     // 코어 안 어두운 영역 보이기 시작
  const SCENE_FADE_IN = 40;      // 미니 씬 fade-in 시작

  // 포커스: 불꽃 심지 바로 위 white core 위치 (scene 좌표)
  // drawFlame에서 white core = (x + sway*0.2, y - 1), x=100, y=h*0.32-7=108.2-7≈101
  // sway는 프레임마다 변하지만 포커스는 고정 (sway=0 기준)
  const FOCUS_X = 100.5;
  const FOCUS_Y = 111.55;

  // 코어 반지름: 불꽃 안의 아주 작은 점 (scene 좌표에서 0.4px)
  const CORE_R = 0.4;

  function init() {
    const setup = setupCanvas('canvas-4', 200, 360);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
  }

  // ---- 1:1 씬 (배경 + 양배추 + 텍스트 + 촛불) ----

  function drawSceneContent() {
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const r = Math.floor(20 + t * 25);
      const g = Math.floor(18 + t * 20);
      const b = Math.floor(35 + t * 15);
      drawRect(ctx, 0, y, w, 1, `rgb(${r},${g},${b})`);
    }

    for (let r = 60; r > 0; r -= 2) {
      const a = 0.02 + (60 - r) * 0.001;
      ctx.fillStyle = `rgba(240, 200, 100, ${a})`;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.38, r, 0, Math.PI * 2);
      ctx.fill();
    }

    drawBigCabbage(w / 2, h * 0.52);
    drawWobblyText(w / 2, h * 0.52);
    drawCandleBody(w / 2, h * 0.32);
  }

  function drawCandleBody(cx, topY) {
    const candleH = 28;
    const candleW = 8;
    drawRect(ctx, cx - candleW / 2, topY, candleW, candleH, '#F0E8D8');
    drawRect(ctx, cx - candleW / 2, topY + 5, candleW, 2, '#E04060');
    drawRect(ctx, cx - candleW / 2, topY + 12, candleW, 2, '#E04060');
    drawRect(ctx, cx - candleW / 2, topY + 19, candleW, 2, '#E04060');
    drawRect(ctx, cx - candleW / 2, topY, candleW, 2, '#F8F0E8');
    drawFlame(ctx, cx, topY - 7, frame);

    // 글로우
    const gi = 0.08 + Math.sin(frame * 0.1) * 0.03;
    ctx.fillStyle = `rgba(255, 200, 80, ${gi})`;
    ctx.beginPath();
    ctx.arc(cx, topY - 6, 12, 0, Math.PI * 2);
    ctx.fill();

    // *** 심지 (불꽃+글로우 위에 덮어쓰기 → 배경색과 정확히 동일) ***
    drawRect(ctx, cx, topY - 4, 1, 4, '#1A1620');

    // 코어 (포탈 입구)
    ctx.fillStyle = '#1A1620';
    ctx.beginPath();
    ctx.arc(FOCUS_X, FOCUS_Y, CORE_R, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---- 코어 안 B레이어 (미니 씬) ----

  function drawInnerScene(outerZoom) {
    if (outerZoom < PORTAL_VISIBLE) return;

    ctx.save();

    // 코어 원형으로 클립
/*    ctx.beginPath();
    ctx.arc(FOCUS_X, FOCUS_Y, CORE_R, 0, Math.PI * 2);
    ctx.clip();

    // 코어 안 어두운 배경
    ctx.fillStyle = '#1A1620';
    ctx.fillRect(FOCUS_X - CORE_R, FOCUS_Y - CORE_R, CORE_R * 2, CORE_R * 2);
*/
    // 미니 씬 (fade-in)
    if (outerZoom >= SCENE_FADE_IN) {
      const fadeProgress = Math.min(1, (outerZoom - SCENE_FADE_IN) / (RESET_ZOOM * 0.2));

      ctx.save();
      ctx.globalAlpha = fadeProgress;

      // 미니 씬 스케일: zoom=RESET_ZOOM일 때 1:1이 되도록
      const innerScale = 1 / RESET_ZOOM;

      ctx.translate(FOCUS_X, FOCUS_Y);
      ctx.scale(innerScale, innerScale);
      ctx.translate(-FOCUS_X, -FOCUS_Y);

      drawSceneContent();

      // 미니 씬의 코어도 그리기
      ctx.fillStyle = '#A06020';
      ctx.beginPath();
      ctx.arc(FOCUS_X, FOCUS_Y, CORE_R + 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1A1620';
      ctx.beginPath();
      ctx.arc(FOCUS_X, FOCUS_Y, CORE_R, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    ctx.restore();
  }

  // ---- 양배추 / 텍스트 ----

  function drawBigCabbage(cx, cy) {
    const r = 45;
    drawCircle(ctx, cx, cy, r, '#4CAF50');
    drawCircle(ctx, cx + 2, cy + 2, r - 2, '#388E3C');
    drawCircle(ctx, cx - 2, cy - 2, r - 2, '#4CAF50');
    drawCircle(ctx, cx - 3, cy - 3, r - 8, '#5CBF5C');
    drawCircle(ctx, cx - 2, cy - 5, r - 15, '#6DD06D');
    drawCircle(ctx, cx, cy - 6, r - 22, '#7DE07D');
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      drawRect(ctx, Math.floor(cx + Math.cos(ang) * r * 0.5), Math.floor(cy + Math.sin(ang) * r * 0.5), 2, 2, '#388E3C');
    }
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      drawCircle(ctx, Math.floor(cx + Math.cos(ang) * (r - 1)), Math.floor(cy + Math.sin(ang) * (r - 1)), 3, '#3A9A3A');
    }
  }

  function drawWobblyText(cx, cy) {
    const tc = '#F8F0E0', sc = '#2A4A2A';
    const sx = cx - 22, by = cy - 4;
    dTa(sx + 1, by + 1, sc); dRa(sx + 16, by + 2, sc); dHae(sx + 33, by + 1, sc);
    dTa(sx, by, tc); dRa(sx + 15, by + 1, tc); dHae(sx + 32, by, tc);
  }
  function dTa(x, y, c) {
    drawRect(ctx, x, y, 9, 2, c); drawRect(ctx, x + 1, y + 3, 7, 2, c);
    drawRect(ctx, x, y + 6, 9, 2, c); drawRect(ctx, x, y, 2, 8, c);
    drawRect(ctx, x + 10, y + 1, 2, 8, c); drawRect(ctx, x + 12, y + 3, 2, 2, c);
  }
  function dRa(x, y, c) {
    drawRect(ctx, x, y - 1, 7, 2, c); drawRect(ctx, x + 5, y + 1, 2, 2, c);
    drawRect(ctx, x + 1, y + 3, 6, 2, c); drawRect(ctx, x, y + 5, 2, 2, c);
    drawRect(ctx, x, y + 6, 8, 2, c); drawRect(ctx, x + 9, y, 2, 8, c);
    drawRect(ctx, x + 11, y + 2, 2, 2, c);
    drawCircle(ctx, x + 5, y + 12, 3, c); drawCircle(ctx, x + 5, y + 12, 1, '#4CAF50');
  }
  function dHae(x, y, c) {
    drawRect(ctx, x + 2, y, 4, 2, c); drawRect(ctx, x, y + 3, 8, 2, c);
    drawCircle(ctx, x + 4, y + 8, 3, c); drawCircle(ctx, x + 4, y + 8, 1, '#4CAF50');
    drawRect(ctx, x + 9, y + 1, 2, 10, c); drawRect(ctx, x + 12, y + 1, 2, 10, c);
    drawRect(ctx, x + 11, y + 4, 1, 2, c); drawRect(ctx, x + 14, y + 4, 2, 2, c);
  }

  // ---- 렌더 ----

  function render() {
    ctx.clearRect(0, 0, w, h);

    // 등속 확대 (지수적 = 화면상 일정한 속도감)
    zoom *= ZOOM_MULTIPLIER;

    // B가 A의 1x와 동일해지면 리셋
    if (zoom >= RESET_ZOOM) {
      zoom = zoom / RESET_ZOOM;
    }

    // 줌 적용
    ctx.save();
    ctx.translate(FOCUS_X, FOCUS_Y);
    ctx.scale(zoom, zoom);
    ctx.translate(-FOCUS_X, -FOCUS_Y);

    drawSceneContent();
    drawInnerScene(zoom);

    ctx.restore();

    drawBottomGradient(ctx, w, h, '24,24,24', 0.55);

    frame++;
    animFrame = requestAnimationFrame(render);
  }

  function start() {
    frame = 0;
    zoom = 1;
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
