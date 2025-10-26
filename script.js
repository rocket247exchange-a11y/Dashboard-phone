// script.js
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gradient-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // hi-DPI scaling helper
  function resizeCanvasToDisplaySize() {
    const dpr = window.devicePixelRatio || 1;
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // line setup
  const lines = [];
  const numLines = 5;
  const colors = ['#8e2de2', '#9f00ff', '#4a00e0', '#a64cff'];

  for (let i = 0; i < numLines; i++) {
    lines.push({
      amplitude: 20 + Math.random() * 30,
      frequency: 0.004 + Math.random() * 0.01,
      speed: 0.006 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      color: colors[i % colors.length]
    });
  }

  let running = true;
  // visibility handling: pause when not visible
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) requestAnimationFrame(draw);
  });

  // draw loop
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = window.innerWidth;
    const H = window.innerHeight;

    lines.forEach(line => {
      const gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, line.color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 3;
      ctx.beginPath();

      // step by 2 pixels for perf
      for (let x = 0; x <= W; x += 2) {
        const y = H / 2 + Math.sin(x * line.frequency + line.phase) * line.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // advance phase
      line.phase += line.speed;
    });

    requestAnimationFrame(draw);
  }

  // initial sizing + start
  resizeCanvasToDisplaySize();
  requestAnimationFrame(draw);

  // debounce resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvasToDisplaySize();
    }, 120);
  });
});
