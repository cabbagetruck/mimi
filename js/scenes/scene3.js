// ===== Scene 3: Placeholder =====
(function () {
  let ctx, w, h;
  let animFrame = null;
  let frame = 0;

  function init() {
    const setup = setupCanvas('canvas-3', 134, 240);
    ctx = setup.ctx;
    w = setup.w;
    h = setup.h;
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    drawRect(ctx, 0, 0, w, h, PALETTE.sky);
    drawBottomGradient(ctx, w, h, '24,24,24', 0.6);
    frame++;
    animFrame = requestAnimationFrame(render);
  }

  function start() { frame = 0; render(); }
  function stop() { if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; } }

  registerScene(3, init, start, stop);
})();
