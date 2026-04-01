/**
 * 1. Particle Background with shooting stars (dark) / floating bubbles (light)
 * 2. Mouse Cursor Glow Effect
 * 3. Flowing Gradient Background
 * 4. ASCII Particle Hero Animation
 */

(function () {
  'use strict';

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.body.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ===================== FLOWING GRADIENT BACKGROUND =====================
  function initGradientBg() {
    const el = document.createElement('div');
    el.id = 'gradient-bg';
    el.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;' +
      'transition:opacity 0.8s ease;';
    document.body.prepend(el);

    function update() {
      if (isDark()) {
        el.style.background =
          'linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 25%, #1a0a2e 50%, #0a1628 75%, #0a0a1a 100%)';
        el.style.backgroundSize = '400% 400%';
      } else {
        el.style.background =
          'linear-gradient(135deg, #f5f0ff 0%, #e8f4fd 25%, #f0e6ff 50%, #e6f2ff 75%, #faf5ff 100%)';
        el.style.backgroundSize = '400% 400%';
      }
      el.style.animation = 'gradientFlow 15s ease infinite';
    }

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        25% { background-position: 100% 0%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes shootingStar {
        0% { transform: translateX(0) translateY(0); opacity: 1; }
        100% { transform: translateX(300px) translateY(300px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ===================== PARTICLE BACKGROUND =====================
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse;
    let shootingStars = [];
    let lastShootTime = 0;

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

    const count = Math.min(160, Math.floor((w * h) / 7000));
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        // For light mode colored bubbles
        hue: Math.random() * 60 + 220, // 220-280 (blue-purple range)
      });
    }

    function spawnShootingStar() {
      const side = Math.random();
      let sx, sy, angle;
      if (side < 0.5) {
        sx = Math.random() * w;
        sy = -10;
        angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      } else {
        sx = -10;
        sy = Math.random() * h * 0.5;
        angle = Math.PI / 6 + (Math.random() - 0.5) * 0.3;
      }
      const speed = 4 + Math.random() * 4;
      shootingStars.push({
        x: sx, y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
        length: 30 + Math.random() * 50,
        width: 1 + Math.random() * 1.5,
      });
    }

    function draw(now) {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();

      // ---- DARK MODE: Starfield + Shooting Stars ----
      if (dark) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx * 0.3; // slower in dark mode for star feel
          p.y += p.vy * 0.3;

          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Twinkle
          p.twinklePhase += p.twinkleSpeed;
          const alpha = 0.3 + Math.sin(p.twinklePhase) * 0.35 + 0.35;

          // Star glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          gradient.addColorStop(0, 'rgba(200,210,255,' + alpha + ')');
          gradient.addColorStop(0.5, 'rgba(150,170,255,' + alpha * 0.3 + ')');
          gradient.addColorStop(1, 'rgba(150,170,255,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Star core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(240,245,255,' + alpha + ')';
          ctx.fill();

          // Connect nearby (subtle constellation lines)
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'rgba(100,120,200,' + (1 - dist / 100) * 0.12 + ')';
              ctx.lineWidth = 0.4;
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
              ctx.strokeStyle = 'rgba(160,170,255,' + (1 - dist / 200) * 0.3 + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Shooting stars
        if (now - lastShootTime > 3000 + Math.random() * 5000) {
          spawnShootingStar();
          lastShootTime = now;
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const s = shootingStars[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life -= s.decay;

          if (s.life <= 0 || s.x > w + 50 || s.y > h + 50) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = s.x - s.vx * s.length / Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 0.5;
          const tailY = s.y - s.vy * s.length / Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 0.5;

          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(200,220,255,0)');
          grad.addColorStop(0.6, 'rgba(200,220,255,' + s.life * 0.4 + ')');
          grad.addColorStop(1, 'rgba(255,255,255,' + s.life + ')');

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.width;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Bright head
          const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
          headGlow.addColorStop(0, 'rgba(255,255,255,' + s.life + ')');
          headGlow.addColorStop(1, 'rgba(200,220,255,0)');
          ctx.beginPath();
          ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
          ctx.fill();
        }

      // ---- LIGHT MODE: Colorful floating bubbles ----
      } else {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          // Gentle pulsing
          p.twinklePhase += p.twinkleSpeed;
          const pulse = 0.8 + Math.sin(p.twinklePhase) * 0.2;
          const r = p.r * pulse;

          // Soft colored bubble with glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
          gradient.addColorStop(0, 'hsla(' + p.hue + ',60%,65%,0.25)');
          gradient.addColorStop(0.5, 'hsla(' + p.hue + ',50%,70%,0.08)');
          gradient.addColorStop(1, 'hsla(' + p.hue + ',50%,70%,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + p.hue + ',55%,60%,0.45)';
          ctx.fill();

          // Connect nearby
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const midHue = (p.hue + q.hue) / 2;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = 'hsla(' + midHue + ',40%,60%,' + (1 - dist / 120) * 0.15 + ')';
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
              ctx.strokeStyle = 'hsla(' + p.hue + ',50%,55%,' + (1 - dist / 200) * 0.25 + ')';
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // ===================== MOUSE GLOW =====================
  function initMouseGlow() {
    const glow = document.createElement('div');
    glow.id = 'mouse-glow';
    glow.style.cssText =
      'position:fixed;width:350px;height:350px;border-radius:50%;pointer-events:none;' +
      'z-index:0;transform:translate(-50%,-50%);' +
      'transition:opacity 0.3s ease;opacity:0;';
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

    function updateGlowColor() {
      if (isDark()) {
        glow.style.background =
          'radial-gradient(circle, rgba(120,130,255,0.18) 0%, rgba(80,100,200,0.06) 40%, rgba(120,130,255,0) 70%)';
      } else {
        glow.style.background =
          'radial-gradient(circle, rgba(120,80,240,0.12) 0%, rgba(100,60,200,0.04) 40%, rgba(120,80,240,0) 70%)';
      }
    }

    updateGlowColor();
    const observer = new MutationObserver(updateGlowColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ===================== TYPEWRITER (TWO LINES) =====================
  function initTypewriter() {
    var line1El = document.getElementById('typewriter-line1');
    var line2El = document.getElementById('typewriter-line2');
    var cursor1 = document.getElementById('cursor1');
    var cursor2 = document.getElementById('cursor2');
    if (!line1El || !line2El) return;

    var line1 = 'Designing evolving agents while evolving myself.';
    var line2 = 'AI Agents · LLMs · VLMs · Generative AI';
    var typeSpeed = 55;

    function typeLine(el, text, idx, callback) {
      if (idx <= text.length) {
        el.textContent = text.substring(0, idx);
        setTimeout(function () { typeLine(el, text, idx + 1, callback); }, typeSpeed);
      } else if (callback) {
        callback();
      }
    }

    setTimeout(function () {
      typeLine(line1El, line1, 0, function () {
        // Line 1 done, move cursor to line 2
        cursor1.style.display = 'none';
        cursor2.style.display = 'inline';
        setTimeout(function () {
          typeLine(line2El, line2, 0, function () {
            // Both done, keep cursor blinking
          });
        }, 400);
      });
    }, 600);
  }

  // ===================== SCROLL REVEAL =====================
  function initScrollReveal() {
    const els = document.querySelectorAll('.scroll-reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
      observer.observe(el);
    });
  }

  // ===================== 3D TILT =====================
  function initTilt3D() {
    var containers = document.querySelectorAll('.tilt-3d');
    containers.forEach(function (container) {
      var img = container.querySelector('img');
      if (!img) return;

      container.addEventListener('mousemove', function (e) {
        var rect = container.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * 20;
        var rotateX = (0.5 - y) * 20;
        img.style.transform =
          'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.05)';
      });

      container.addEventListener('mouseleave', function () {
        img.style.transform = 'rotateX(0) rotateY(0) scale(1)';
      });
    });
  }

  // ===================== ASCII PARTICLE HERO =====================
  function initAsciiHero() {
    var canvas = document.getElementById('ascii-hero');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Config
    var CHAR_SET = '.,:;+*=#@%&';
    var FONT_SIZE = 7;
    var DISPLAY_TEXT = 'CHENHUI GOU';
    var MOUSE_RADIUS = 60;
    var RETURN_SPEED = 0.06;
    var PUSH_FORCE = 6;

    var particles = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var dpr = window.devicePixelRatio || 1;
    var w, h;

    // Style
    canvas.style.width = '100%';
    canvas.style.height = '180px';
    canvas.style.display = 'block';
    canvas.style.marginBottom = '16px';
    canvas.style.cursor = 'default';

    function getColors() {
      var dark = isDark();
      return {
        chars: dark
          ? ['#60a5fa', '#818cf8', '#67e8f9', '#a78bfa', '#38bdf8']
          : ['#6d28d9', '#4f46e5', '#7c3aed', '#3b82f6', '#6366f1'],
        bg: 'transparent'
      };
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      particles = [];

      // Measure text to center it — measure actual text width and fit
      var offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      var offCtx = offCanvas.getContext('2d');

      // Binary search for the largest font that fits with 20px padding each side
      var maxW = w - 40;
      var maxH = h - 20;
      var lo = 16, hi = 150, measureSize = 40;
      while (lo <= hi) {
        var mid = Math.floor((lo + hi) / 2);
        offCtx.font = '900 ' + mid + 'px "Arial Black", "Helvetica Neue", Arial, sans-serif';
        var tw = offCtx.measureText(DISPLAY_TEXT).width;
        if (tw <= maxW && mid <= maxH) {
          measureSize = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      offCtx.fillStyle = '#000';
      offCtx.font = '900 ' + measureSize + 'px "Arial Black", "Helvetica Neue", Arial, sans-serif';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(DISPLAY_TEXT, w / 2, h / 2);

      // Sample pixels — smaller step = denser particles = clearer text
      var imageData = offCtx.getImageData(0, 0, w, h);
      var data = imageData.data;
      var step = 3;

      for (var y = 0; y < h; y += step) {
        for (var x = 0; x < w; x += step) {
          var idx = (y * w + x) * 4;
          var alpha = data[idx + 3];
          if (alpha > 128) {
            var brightness = data[idx] / 255;
            var charIdx = Math.floor(Math.random() * CHAR_SET.length);
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              char: CHAR_SET[charIdx],
              size: FONT_SIZE * (0.85 + Math.random() * 0.3),
              colorIdx: Math.floor(Math.random() * 5),
              vx: 0,
              vy: 0,
              friction: 0.85 + Math.random() * 0.1
            });
          }
        }
      }
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', function () {
      mouse.active = false;
    });

    // Touch support
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      var rect = canvas.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      mouse.active = true;
    }, { passive: false });

    canvas.addEventListener('touchend', function () {
      mouse.active = false;
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var colors = getColors();

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse interaction
        if (mouse.active) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * PUSH_FORCE;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Return to origin
        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;

        // Apply friction
        p.vx *= p.friction;
        p.vy *= p.friction;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw character
        var displacement = Math.sqrt(
          (p.x - p.originX) * (p.x - p.originX) +
          (p.y - p.originY) * (p.y - p.originY)
        );
        var alpha = Math.min(1, 0.5 + displacement / 30);
        var color = colors.chars[p.colorIdx];

        ctx.font = '700 ' + p.size + 'px monospace';
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      requestAnimationFrame(draw);
    }

    resize();
    requestAnimationFrame(draw);

    window.addEventListener('resize', function () {
      resize();
    });

    // Theme change
    var themeObserver = new MutationObserver(function () {
      // Colors update automatically in draw loop
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ===================== FLOATING ORBS =====================
  function initFloatingOrbs() {
    var postEl = document.querySelector('.post');
    if (!postEl) return;

    // Make .post the positioning context
    if (getComputedStyle(postEl).position === 'static') {
      postEl.style.position = 'relative';
    }

    var canvas = document.createElement('canvas');
    canvas.id = 'floating-orbs-canvas';
    canvas.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    postEl.insertBefore(canvas, postEl.firstChild);

    var ctx = canvas.getContext('2d');
    var w, h;
    var dragging = null;
    var dragOffsetX = 0, dragOffsetY = 0;

    function resize() {
      var rect = postEl.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    // Observe .post size changes
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(postEl);
    }

    // Orb definitions
    function makeOrbs() {
      var dark = isDark();
      var palettes = dark
        ? [
            [60, 130, 250],  // blue
            [80, 220, 220],  // cyan
            [140, 100, 240], // purple
          ]
        : [
            [140, 80, 240],  // purple
            [80, 130, 250],  // blue
            [230, 100, 180], // pink
          ];
      var alphaRange = dark ? [0.2, 0.35] : [0.15, 0.28];

      var orbs = [];
      for (var i = 0; i < 3; i++) {
        var r = 80 + Math.random() * 80;
        orbs.push({
          x: r + Math.random() * (w - 2 * r),
          y: r + Math.random() * (h - 2 * r),
          r: r,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: palettes[i % palettes.length],
          alpha: alphaRange[0] + Math.random() * (alphaRange[1] - alphaRange[0]),
        });
      }
      return orbs;
    }

    var orbs = makeOrbs();

    // Re-create orbs on theme change
    var orbObserver = new MutationObserver(function () {
      orbs = makeOrbs();
    });
    orbObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    orbObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Drag support
    canvas.style.pointerEvents = 'auto';

    function getCanvasXY(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x: cx, y: cy };
    }

    function findOrb(cx, cy) {
      for (var i = orbs.length - 1; i >= 0; i--) {
        var o = orbs[i];
        var dx = cx - o.x, dy = cy - o.y;
        if (dx * dx + dy * dy < o.r * o.r) return o;
      }
      return null;
    }

    canvas.addEventListener('mousedown', function (e) {
      var p = getCanvasXY(e);
      var orb = findOrb(p.x, p.y);
      if (orb) {
        dragging = orb;
        dragOffsetX = p.x - orb.x;
        dragOffsetY = p.y - orb.y;
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var p = getCanvasXY(e);
      dragging.x = p.x - dragOffsetX;
      dragging.y = p.y - dragOffsetY;
    });

    window.addEventListener('mouseup', function () {
      if (dragging) {
        dragging = null;
        canvas.style.cursor = 'default';
      }
    });

    // Touch drag
    canvas.addEventListener('touchstart', function (e) {
      var p = getCanvasXY(e);
      var orb = findOrb(p.x, p.y);
      if (orb) {
        dragging = orb;
        dragOffsetX = p.x - orb.x;
        dragOffsetY = p.y - orb.y;
        e.preventDefault();
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var p = getCanvasXY(e);
      dragging.x = p.x - dragOffsetX;
      dragging.y = p.y - dragOffsetY;
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', function () {
      dragging = null;
    });

    function draw() {
      resize(); // keep synced
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < orbs.length; i++) {
        var o = orbs[i];

        // Move (skip if dragging this orb)
        if (o !== dragging) {
          o.x += o.vx;
          o.y += o.vy;

          // Bounce
          if (o.x - o.r < 0) { o.x = o.r; o.vx = Math.abs(o.vx); }
          if (o.x + o.r > w) { o.x = w - o.r; o.vx = -Math.abs(o.vx); }
          if (o.y - o.r < 0) { o.y = o.r; o.vy = Math.abs(o.vy); }
          if (o.y + o.r > h) { o.y = h - o.r; o.vy = -Math.abs(o.vy); }
        }

        // Draw radial gradient orb
        var grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        var c = o.color;
        grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + o.alpha + ')');
        grad.addColorStop(0.6, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (o.alpha * 0.4) + ')');
        grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // ===================== CARD GLOW (Publications) =====================
  function initCardGlow() {
    var items = document.querySelectorAll('ol.bibliography li');
    if (!items.length) return;

    function updateGlowColor() {
      var color = isDark()
        ? 'rgba(96, 165, 250, 0.15)'
        : 'rgba(120, 80, 240, 0.12)';
      items.forEach(function (li) {
        li.style.setProperty('--glow-color', color);
      });
    }

    updateGlowColor();

    items.forEach(function (li) {
      li.addEventListener('mousemove', function (e) {
        var rect = li.getBoundingClientRect();
        li.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        li.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });

    var glowObserver = new MutationObserver(updateGlowColor);
    glowObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    glowObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // ===================== INIT =====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initGradientBg();
      initParticles();
      initMouseGlow();
      initAsciiHero();
      initTypewriter();
      initScrollReveal();
      initTilt3D();
      initFloatingOrbs();
      initCardGlow();
    });
  } else {
    initGradientBg();
    initParticles();
    initMouseGlow();
    initAsciiHero();
    initTypewriter();
    initScrollReveal();
    initTilt3D();
    initFloatingOrbs();
    initCardGlow();
  }
})();
