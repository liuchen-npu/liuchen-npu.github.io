/**
 * 全局背景飘落特效 - Canvas 实现
 * 支持雪花 (snow) 和樱花花瓣 (sakura)
 * 通过顶部 CONFIG 对象修改参数
 */
(function () {
  /* ===================== 配置区（可按需修改） ===================== */
  var CONFIG = {
    type: 'sakura',   // 特效类型：'snow' | 'sakura'
    count: 38,        // 粒子数量，建议 20-60
    speed: 1.0,       // 下落速度系数
    opacity: 0.75,    // 粒子整体透明度 (0-1)
    zIndex: 10,       // canvas 层叠顺序（pointer-events:none，不影响点击）
  };
  /* ============================================================== */

  var canvas, ctx, particles = [], raf, paused = false;

  function W() { return window.innerWidth; }
  function H() { return window.innerHeight; }

  /* ---------- Canvas 初始化 ---------- */
  function createCanvas() {
    var existing = document.getElementById('falling-particles-canvas');
    if (existing) { canvas = existing; ctx = canvas.getContext('2d'); return; }
    canvas = document.createElement('canvas');
    canvas.id = 'falling-particles-canvas';
    canvas.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100%', 'height:100%',
      'pointer-events:none',
      'z-index:' + CONFIG.zIndex,
    ].join(';');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
  }

  function resize() {
    if (!canvas) return;
    canvas.width = W();
    canvas.height = H();
  }

  /* ---------- 粒子工厂 ---------- */
  function newParticle(scatter) {
    var snow = CONFIG.type === 'snow';
    return {
      x: Math.random() * W(),
      y: scatter ? Math.random() * H() : -20,
      size: snow ? (2 + Math.random() * 4) : (5 + Math.random() * 9),
      speedY: (0.5 + Math.random() * 1.5) * CONFIG.speed,
      speedX: (Math.random() - 0.5) * 0.7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.06,
      swing: 0.3 + Math.random() * 0.7,
      swingPhase: Math.random() * Math.PI * 2,
      alpha: (0.35 + Math.random() * 0.65) * CONFIG.opacity,
      /* 樱花色相微随机 */
      hue: snow ? 0 : (340 + Math.random() * 30),
    };
  }

  function initParticles(scatter) {
    particles = [];
    for (var i = 0; i < CONFIG.count; i++) {
      particles.push(newParticle(scatter !== false));
    }
  }

  /* ---------- 绘制：雪花 ---------- */
  function drawSnow(p) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(200,230,255,0.9)';
    ctx.fill();
    ctx.restore();
  }

  /* ---------- 绘制：樱花花瓣 ---------- */
  function drawSakura(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;

    var s = p.size;
    var color = 'hsl(' + p.hue + ',80%,82%)';
    var stroke = 'hsla(' + p.hue + ',70%,65%,0.5)';

    /* 花瓣主体：5 片椭圆形，围绕中心旋转 */
    for (var i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      /* 椭圆花瓣：向上伸出 */
      ctx.ellipse(0, -s * 0.7, s * 0.38, s * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.6;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    /* 花蕊淡点 */
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,200,210,0.7)';
    ctx.fill();

    ctx.restore();
  }

  /* ---------- 每帧更新 ---------- */
  function updateParticle(p) {
    p.swingPhase += 0.018;
    p.x += p.speedX + Math.sin(p.swingPhase) * p.swing;
    p.y += p.speedY;
    p.angle += p.spin;
    if (p.y > H() + 40 || p.x < -60 || p.x > W() + 60) {
      var next = newParticle(false);
      Object.assign(p, next);
    }
  }

  /* ---------- 动画循环 ---------- */
  function loop() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var draw = CONFIG.type === 'snow' ? drawSnow : drawSakura;
    for (var i = 0; i < particles.length; i++) {
      updateParticle(particles[i]);
      draw(particles[i]);
    }
    raf = requestAnimationFrame(loop);
  }

  /* ---------- 页面可见性优化：后台标签停止动画 ---------- */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      paused = true;
    } else if (paused) {
      paused = false;
      loop();
    }
  });

  /* ---------- 公开 API ---------- */
  function start() {
    if (raf) cancelAnimationFrame(raf);
    createCanvas();
    initParticles(true);
    loop();
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    var el = document.getElementById('falling-particles-canvas');
    if (el) el.remove();
    canvas = null; ctx = null; particles = [];
  }

  /* 切换类型并重启 */
  function setType(type) {
    CONFIG.type = type;
    start();
  }

  window.FallingParticles = { start: start, stop: stop, setType: setType, config: CONFIG };

  /* ---------- 窗口 resize ---------- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); initParticles(true); }, 200);
  });

  /* ---------- PJAX 支持 ---------- */
  document.addEventListener('pjax:complete', function () {
    if (!document.getElementById('falling-particles-canvas')) {
      start();
    }
  });

  /* ---------- 自动启动 ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
