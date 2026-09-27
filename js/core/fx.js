/* Słowik — effets visuels : confettis de papier découpé, FLIP, compteurs, inclinaison 3D,
   boutons magnétiques, ondulations, apparitions au défilement, fond animé. */
(function () {
  'use strict';
  const { rand, pick, clamp, cssVar } = S.util;

  const reduced = () => document.documentElement.getAttribute('data-motion') === 'reduced';
  /* Taille de la fenêtre visible (fiable aussi sur téléphone). */
  const VW = () => document.documentElement.clientWidth || innerWidth;
  const VH = () => document.documentElement.clientHeight || innerHeight;

  /* ───────────── Confettis (papier découpé) ───────────── */
  const canvas = document.getElementById('fx');
  const ctx2d = canvas.getContext('2d');
  let parts = [];
  let raf = 0;
  let dpr = 1;
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(VW() * dpr);
    canvas.height = Math.round(VH() * dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const palette = () => ['--red', '--orange', '--yellow', '--green', '--teal', '--blue', '--violet', '--pink'].map(cssVar);
  const SHAPES = ['rect', 'circle', 'petal', 'flower', 'diamond', 'heart'];

  function drawShape(c, p) {
    const s = p.size;
    c.beginPath();
    switch (p.shape) {
      case 'rect':
        c.rect(-s / 2, -s / 3, s, s * 0.66);
        break;
      case 'circle':
        c.arc(0, 0, s / 2.2, 0, Math.PI * 2);
        break;
      case 'petal':
        c.moveTo(0, -s / 1.6);
        c.quadraticCurveTo(s / 1.8, 0, 0, s / 1.6);
        c.quadraticCurveTo(-s / 1.8, 0, 0, -s / 1.6);
        break;
      case 'diamond':
        c.moveTo(0, -s / 1.7);
        c.lineTo(s / 2.4, 0);
        c.lineTo(0, s / 1.7);
        c.lineTo(-s / 2.4, 0);
        break;
      case 'heart':
        c.moveTo(0, s / 2.2);
        c.bezierCurveTo(-s, -s / 5, -s / 2.2, -s / 1.3, 0, -s / 4.4);
        c.bezierCurveTo(s / 2.2, -s / 1.3, s, -s / 5, 0, s / 2.2);
        break;
      default: {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          c.moveTo(0, 0);
          c.ellipse(Math.cos(a) * s * 0.28, Math.sin(a) * s * 0.28, s * 0.26, s * 0.15, a, 0, Math.PI * 2);
        }
      }
    }
    c.fill();
    if (p.shape === 'flower') {
      c.fillStyle = p.center;
      c.beginPath();
      c.arc(0, 0, s * 0.13, 0, Math.PI * 2);
      c.fill();
    }
  }

  function loop() {
    ctx2d.setTransform(1, 0, 0, 1, 0, 0);
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();
    parts = parts.filter((p) => now - p.born < p.life && p.y < VH() + 60);
    parts.forEach((p) => {
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g;
      p.x += p.vx + Math.sin((now - p.born) / 260 + p.phase) * p.sway;
      p.y += p.vy;
      p.rot += p.vr;
      p.tilt += p.vt;
      const age = (now - p.born) / p.life;
      const alpha = age > 0.75 ? 1 - (age - 0.75) / 0.25 : 1;
      ctx2d.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
      ctx2d.rotate(p.rot);
      ctx2d.scale(1, Math.cos(p.tilt));
      ctx2d.globalAlpha = alpha;
      ctx2d.fillStyle = p.color;
      drawShape(ctx2d, p);
    });
    ctx2d.globalAlpha = 1;
    if (parts.length) raf = requestAnimationFrame(loop);
    else {
      raf = 0;
      ctx2d.setTransform(1, 0, 0, 1, 0, 0);
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  function spawn(p) {
    parts.push(p);
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function particle(x, y, vx, vy, cols) {
    return {
      x, y, vx, vy,
      g: rand(0.12, 0.2), drag: rand(0.975, 0.99), sway: rand(0.2, 1.1), phase: rand(0, 6),
      rot: rand(0, 6.28), vr: rand(-0.15, 0.15), tilt: rand(0, 6.28), vt: rand(0.03, 0.12),
      size: rand(8, 16), shape: pick(SHAPES), color: pick(cols), center: pick(cols),
      born: performance.now(), life: rand(2200, 3600),
    };
  }

  /* Explosion depuis un point (ou un élément). */
  function burst(at, n = 60, power = 11) {
    if (reduced()) n = Math.min(n, 18);
    let x = VW() / 2;
    let y = VH() / 2;
    if (at && at.getBoundingClientRect) {
      const r = at.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    } else if (at && 'x' in at) {
      x = at.x;
      y = at.y;
    }
    const cols = palette();
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(power * 0.35, power);
      spawn(particle(x, y, Math.cos(a) * v, Math.sin(a) * v - rand(2, 6), cols));
    }
  }
  /* Pluie de confettis depuis le haut. */
  function rain(n = 140) {
    if (reduced()) n = 30;
    const cols = palette();
    for (let i = 0; i < n; i++) {
      const p = particle(rand(0, VW()), rand(-VH() * 0.5, -20), rand(-2, 2), rand(1, 5), cols);
      p.life = rand(3500, 5500);
      spawn(p);
    }
  }
  /* Canons latéraux. */
  function cannons(n = 70) {
    if (reduced()) n = 20;
    const cols = palette();
    for (let i = 0; i < n; i++) {
      spawn(particle(-10, VH() * 0.75, rand(8, 19), rand(-19, -9), cols));
      spawn(particle(VW() + 10, VH() * 0.75, rand(-19, -8), rand(-19, -9), cols));
    }
  }

  /* ───────────── Animations utilitaires ───────────── */
  function countUp(el, to, dur = 1100, from = 0, fmt) {
    if (!el) return;
    const f = fmt || ((v) => Math.round(v).toLocaleString('fr-FR'));
    if (reduced()) {
      el.textContent = f(to);
      return;
    }
    const t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - k, 4);
      el.textContent = f(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* FLIP : anime les éléments de leur ancienne à leur nouvelle position après une mutation du DOM. */
  function flip(elements, mutate, opts = {}) {
    const els = Array.from(elements);
    const first = new Map(els.map((el) => [el, el.getBoundingClientRect()]));
    mutate();
    if (reduced()) return;
    els.forEach((el) => {
      if (!el.isConnected) return;
      const a = first.get(el);
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (!dx && !dy) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: opts.duration || 380,
        easing: opts.easing || 'cubic-bezier(.2,.9,.25,1.15)',
      });
    });
  }

  /* Fait voler un clone de `from` jusqu'à la position de `to`. */
  function fly(from, to, opts = {}) {
    return new Promise((resolve) => {
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (reduced()) return resolve();
      const ghost = from.cloneNode(true);
      ghost.classList.add('fly-ghost');
      Object.assign(ghost.style, {
        position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px',
        margin: 0, zIndex: 9999, pointerEvents: 'none', visibility: 'visible',
      });
      document.body.appendChild(ghost);
      const dx = b.left - a.left;
      const dy = b.top - a.top;
      const arc = opts.arc != null ? opts.arc : -Math.min(60, Math.abs(dx) * 0.15 + 20);
      const anim = ghost.animate(
        [
          { transform: 'translate(0,0) scale(1)', offset: 0 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 + arc}px) scale(1.08) rotate(${dx > 0 ? 3 : -3}deg)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(1)`, offset: 1 },
        ],
        { duration: opts.duration || 420, easing: 'cubic-bezier(.3,.7,.2,1)' }
      );
      anim.onfinish = () => {
        ghost.remove();
        resolve();
      };
    });
  }

  function shake(el) {
    if (!el || reduced()) return;
    el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px) rotate(-1deg)' }, { transform: 'translateX(8px) rotate(1deg)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
      { duration: 460, easing: 'ease-out' }
    );
  }
  function pop(el, scale = 1.12) {
    if (!el || reduced()) return;
    el.animate([{ transform: 'scale(1)' }, { transform: `scale(${scale})` }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' });
  }
  function jelly(el) {
    if (!el || reduced()) return;
    el.animate(
      [{ transform: 'scale(1,1)' }, { transform: 'scale(1.18,.84)' }, { transform: 'scale(.9,1.12)' }, { transform: 'scale(1.05,.96)' }, { transform: 'scale(1,1)' }],
      { duration: 600, easing: 'ease-out' }
    );
  }

  /* Texte flottant (« +10 XP ») qui s'élève et s'efface. */
  function floatText(text, at, cls = '') {
    const el = document.createElement('div');
    el.className = 'float-text ' + cls;
    el.textContent = text;
    let x = VW() / 2;
    let y = VH() / 2;
    if (at && at.getBoundingClientRect) {
      const r = at.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top;
    }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  /* Découpe un texte en lettres animables. */
  /* Chaque mot reste d'un seul tenant : la coupure de ligne se fait entre les mots, jamais au milieu. */
  function letters(text, cls = 'ltr') {
    let i = 0;
    return String(text)
      .split(' ')
      .map((word) => `<span class="ltr-word">${Array.from(word).map((ch) => `<span class="${cls}" style="--i:${i++}">${S.util.esc(ch)}</span>`).join('')}</span>`)
      .join('<span class="ltr-sp"> </span>');
  }

  /* ───────────── Apparition au défilement ───────────── */
  let io = null;
  function reveal(root = document) {
    const els = root.querySelectorAll('.rv:not(.in)');
    if (!('IntersectionObserver' in window) || reduced()) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              io.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
      );
    }
    els.forEach((e) => io.observe(e));
  }

  /* Indice de décalage pour les cascades. */
  function stagger(container, sel = ':scope > *', start = 0) {
    Array.from(container.querySelectorAll(sel)).forEach((el, i) => el.style.setProperty('--i', i + start));
  }

  /* ───────────── Interactions globales ───────────── */
  // Inclinaison 3D + reflet sur [data-tilt]
  let tiltEl = null;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reduced()) return;
    const el = e.target.closest && e.target.closest('[data-tilt]');
    if (tiltEl && tiltEl !== el) {
      tiltEl.style.transform = '';
      tiltEl.classList.remove('tilting');
    }
    tiltEl = el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const max = parseFloat(el.dataset.tilt) || 7;
    el.classList.add('tilting');
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-3px)`;
    el.style.setProperty('--gx', px * 100 + '%');
    el.style.setProperty('--gy', py * 100 + '%');
  });
  document.addEventListener('pointerleave', () => {
    if (tiltEl) tiltEl.style.transform = '';
  });

  // Boutons magnétiques [data-magnet]
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reduced()) return;
    document.querySelectorAll('[data-magnet]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const R = Math.max(r.width, r.height) * 0.9;
      if (dist < R) el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.25}px)`;
      else if (el.style.transform) el.style.transform = '';
    });
  });

  // Ondulation au clic sur .btn et [data-ripple]
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest && e.target.closest('.btn, [data-ripple]');
    if (!el || el.disabled || reduced()) return;
    const r = el.getBoundingClientRect();
    const s = Math.max(r.width, r.height) * 2.2;
    const rip = document.createElement('span');
    rip.className = 'ripple';
    rip.style.width = rip.style.height = s + 'px';
    rip.style.left = e.clientX - r.left - s / 2 + 'px';
    rip.style.top = e.clientY - r.top - s / 2 + 'px';
    el.appendChild(rip);
    setTimeout(() => rip.remove(), 650);
  });

  /* ───────────── Fond vivant ───────────── */
  function initBackground() {
    const bg = document.getElementById('bg');
    const O = S.ui.orn;
    bg.innerHTML = `
      <div class="bg-blob b1"></div><div class="bg-blob b2"></div><div class="bg-blob b3"></div>
      <div class="bg-orn o1">${O.rosette({ petals: 12, colors: ['var(--red)', 'var(--yellow)', 'var(--green)'] })}</div>
      <div class="bg-orn o2">${O.rosette({ petals: 8, colors: ['var(--blue)', 'var(--pink)', 'var(--yellow)'] })}</div>
      <div class="bg-orn o3">${O.sprig('var(--green)', 'var(--red)')}</div>
      <div class="bg-orn o4">${O.rosette({ petals: 10, colors: ['var(--violet)', 'var(--orange)', 'var(--teal)'] })}</div>
      <div class="bg-orn o5">${O.tulip()}</div>
      <div class="bg-orn o6">${O.sprig('var(--teal)', 'var(--orange)')}</div>
      <div class="bg-spot"></div>
      <div class="bg-grain"></div>`;
    // Grain de papier généré une fois
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const g = c.getContext('2d');
      const img = g.createImageData(160, 160);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = Math.random() * 60;
      }
      g.putImageData(img, 0, 0);
      bg.querySelector('.bg-grain').style.backgroundImage = `url(${c.toDataURL()})`;
    } catch (e) {}
    // Projecteur + parallaxe qui suivent la souris
    let tx = 0.5;
    let ty = 0.3;
    let cx = tx;
    let cy = ty;
    let ticking = false;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX / VW();
      ty = e.clientY / VH();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tick);
      }
    });
    function tick() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      bg.style.setProperty('--sx', (cx * VW()).toFixed(1) + 'px');
      bg.style.setProperty('--sy', (cy * VH()).toFixed(1) + 'px');
      bg.style.setProperty('--px', (cx - 0.5).toFixed(3));
      bg.style.setProperty('--py', (cy - 0.5).toFixed(3));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(tick);
      else ticking = false;
    }
    document.addEventListener('visibilitychange', () => bg.classList.toggle('paused', document.hidden));
  }

  S.fx = { reduced, burst, rain, cannons, countUp, flip, fly, shake, pop, jelly, floatText, letters, reveal, stagger, initBackground };
})();
