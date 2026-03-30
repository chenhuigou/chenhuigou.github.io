/**
 * 1. Particle Background (Canvas-based, no dependencies)
 * 2. Mouse Cursor Glow Effect
 */

(function () {
  'use strict';

  // ===================== PARTICLE BACKGROUND =====================
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse;

    mouse = { x: null, y: null };
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Detect dark mode
    function isDark() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const count = Math.min(80, Math.floor((w * h) / 15000));
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      const dotColor = dark ? 'rgba(255,255,255,' : 'rgba(100,100,180,';
      const lineColor = dark ? 'rgba(255,255,255,' : 'rgba(100,100,180,';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor + '0.5)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = lineColor + (1 - dist / 120) * 0.2 + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = lineColor + (1 - dist / 200) * 0.35 + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  // ===================== MOUSE GLOW =====================
  function initMouseGlow() {
    const glow = document.createElement('div');
    glow.id = 'mouse-glow';
    glow.style.cssText =
      'position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;' +
      'z-index:0;transform:translate(-50%,-50%);' +
      'transition:opacity 0.3s ease;opacity:0;' +
      'background:radial-gradient(circle,rgba(120,100,255,0.12) 0%,rgba(120,100,255,0) 70%);';
    document.body.appendChild(glow);

    let visible = false;

    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      if (!visible) {
        glow.style.opacity = '1';
        visible = true;
      }
    });

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
      visible = false;
    });

    // Adapt glow color to dark mode
    function updateGlowColor() {
      const dark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      glow.style.background = dark
        ? 'radial-gradient(circle,rgba(160,140,255,0.15) 0%,rgba(160,140,255,0) 70%)'
        : 'radial-gradient(circle,rgba(100,80,220,0.1) 0%,rgba(100,80,220,0) 70%)';
    }

    updateGlowColor();
    // Watch for theme changes
    const observer = new MutationObserver(updateGlowColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ===================== INIT =====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initParticles();
      initMouseGlow();
    });
  } else {
    initParticles();
    initMouseGlow();
  }
})();
