/* Słowik — parcours : carte sinueuse des unités, chemin « brodé », nœuds animés. */
(function () {
  'use strict';
  const { esc, frTypo, fmt, cvars } = S.util;
  const { icon, say, ring, mascot, plWord, hint } = S.ui;
  const C = S.content;

  const WAVE = [0, 0.62, 0.95, 0.62, 0, -0.62, -0.95, -0.62];

  function nodeState(n) {
    if (C.isDone(n.id)) return 'done';
    if (C.isUnlocked(n)) return 'open';
    return 'locked';
  }

  function unitHTML(u, ui) {
    const prog = C.unitProgress(u);
    const nodes = u.lessons.concat([u.challenge]);
    const unlocked = C.unitUnlocked(u);
    const rows = nodes
      .map((n, i) => {
        const stt = nodeState(n);
        const info = S.store.lessonInfo(n.id);
        const x = WAVE[(i + ui * 3) % WAVE.length];
        const isCh = n.kind === 'challenge';
        const stars = info ? info.stars : 0;
        const cur = C.nextNode() === n;
        return `
          <div class="node-row" style="--x:${x}">
            <div class="node-wrap ${cur ? 'current' : ''}">
              ${cur ? `<div class="node-flag"><span class="pl">${C.isDone(n.id) ? 'Jeszcze raz?' : 'Zaczynamy!'}</span></div>` : ''}
              <button type="button" class="node ${stt} ${isCh ? 'challenge' : ''} rv" style="--i:${i}" data-node="${n.id}" aria-label="${esc(isCh ? 'Défi de l’unité' : n.fr)}">
                ${ring(stt === 'done' ? 1 : 0, { size: isCh ? 108 : 94, stroke: 6, color: isCh ? 'var(--yellow)' : 'var(--c)', cls: 'node-ring' })}
                <span class="node-face">${stt === 'locked' ? icon('lock', 26) : `<span class="emoji">${isCh ? '👑' : n.icon}</span>`}</span>
                ${cur ? '<span class="node-pulse"></span><span class="node-pulse p2"></span>' : ''}
              </button>
              <div class="node-stars">${stt === 'done' ? [0, 1, 2].map((k) => `<span class="${k < stars ? 'on' : ''}">${icon('star', 14)}</span>`).join('') : ''}</div>
              <div class="node-label"><b>${esc(isCh ? 'Défi' : n.fr)}</b><span class="pl">${esc(isCh ? 'Wyzwanie' : n.pl)}</span></div>
            </div>
          </div>`;
      })
      .join('');
    const side = ui % 2 ? 'left' : 'right';
    return `
      <section class="unit ${unlocked ? '' : 'locked'}" style="${cvars(u.color)}" id="unit-${u.id}">
        <header class="unit-banner rv">
          <div class="ub-orn">${S.ui.orn.rosette({ petals: 10, colors: ['rgba(255,255,255,.25)', 'rgba(255,255,255,.18)', 'rgba(255,255,255,.3)'] })}</div>
          <div class="ub-num display">${String(u.num).padStart(2, '0')}</div>
          <div class="ub-txt">
            <div class="eyebrow">Unité ${u.num} · ${u.level}</div>
            <h2>${esc(u.fr)}</h2>
            <div class="pl ub-pl">${esc(u.pl)}</div>
            <p>${frTypo(esc(u.desc))}</p>
          </div>
          <div class="ub-side">
            <div class="ub-ring">${ring(prog.pct, { size: 64, stroke: 7, color: 'var(--on, #fff)' })}<span class="tnum">${prog.done}/${prog.total}</span></div>
            <button type="button" class="btn btn-sm ub-guide" data-guide="${u.id}">${icon('book', 16)}<span>Guide</span></button>
          </div>
        </header>
        <div class="unit-path">
          <svg class="up-svg" aria-hidden="true"></svg>
          <div class="up-deco ${side}">${ui % 3 === 0 ? S.ui.orn.sprig('var(--c)', 'var(--yellow)') : ui % 3 === 1 ? S.ui.orn.tulip() : S.ui.orn.rosette({ petals: 8, colors: ['var(--c)', 'var(--yellow)', 'var(--green)'] })}</div>
          ${rows}
        </div>
      </section>`;
  }

  /* Trace le chemin brodé entre les nœuds d'une unité. */
  function drawLines(root) {
    root.querySelectorAll('.unit.drawn').forEach(drawUnit);
  }
  function drawUnit(unit) {
    const box = unit.querySelector('.unit-path');
    const svg = unit.querySelector('.up-svg');
    const b = box.getBoundingClientRect();
    // Position de mise en page (sans les transformations des animations d'apparition)
    const pts = Array.from(box.querySelectorAll('.node-wrap')).map((wrap) => {
      const node = wrap.querySelector('.node');
      const wr = wrap.getBoundingClientRect();
      return { x: wr.left + wr.width / 2 - b.left, y: wr.top - b.top + node.offsetHeight / 2, done: node.classList.contains('done') };
    });
    if (pts.length < 2 || !b.width) return;
    let d = `M${pts[0].x} ${pts[0].y}`;
    let dDone = d;
    let open = pts[0].done;
    let segs = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const c = pts[i];
      const my = (a.y + c.y) / 2;
      const seg = ` C${a.x} ${my} ${c.x} ${my} ${c.x} ${c.y}`;
      d += seg;
      if (open) {
        dDone += seg;
        segs++;
        open = pts[i].done;
      }
    }
    svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
    svg.setAttribute('width', b.width);
    svg.setAttribute('height', b.height);
    svg.innerHTML = `<path class="up-base" d="${d}"/>${segs ? `<path class="up-done" d="${dDone}"/>` : ''}`;
  }

  function popover(node, btn, root) {
    closePop(root);
    const stt = nodeState(node);
    const isCh = node.kind === 'challenge';
    const info = S.store.lessonInfo(node.id);
    const u = node.unit;
    const words = isCh ? [] : node.words;
    const pop = document.createElement('div');
    pop.className = `node-pop ${stt}`;
    pop.style.cssText = cvars(u.color);
    pop.innerHTML = `
      <div class="np-head">
        <span class="emoji">${isCh ? '👑' : node.icon}</span>
        <div class="grow"><b>${esc(isCh ? 'Défi de l’unité ' + u.num : node.fr)}</b><div class="pl">${esc(isCh ? 'Wyzwanie' : node.pl)}</div></div>
        ${info ? `<span class="chip">${icon('star', 14)} ${info.stars}/3</span>` : ''}
      </div>
      ${words.length ? `<div class="np-words">${words.map((w) => `<span class="chip"><span class="emoji">${w.e}</span><span class="pl">${esc(w.pl)}</span></span>`).join('')}</div>` : `<p class="small">${isCh ? 'Mélange de tout le vocabulaire et des phrases de l’unité. Réussis-le pour débloquer la suite !' : ''}</p>`}
      ${stt === 'locked' ? `<p class="small np-lock">${icon('lock', 16)} Termine l’étape précédente pour débloquer celle-ci.</p>` : `<button type="button" class="btn btn-block np-go" style="${cvars(u.color)};--fg:#fff">${icon('play', 18)}<span>${stt === 'done' ? 'Rejouer (+XP)' : isCh ? 'Relever le défi' : 'Commencer'}</span></button>`}`;
    const wrap = btn.closest('.node-wrap');
    wrap.appendChild(pop);
    requestAnimationFrame(() => pop.classList.add('show'));
    const go = pop.querySelector('.np-go');
    if (go) go.addEventListener('click', (e) => {
      e.stopPropagation();
      closePop(root);
      S.session.startNode(node, btn);
    });
    pop.addEventListener('click', (e) => e.stopPropagation());
  }
  function closePop(root) {
    root.querySelectorAll('.node-pop').forEach((p) => {
      p.classList.remove('show');
      setTimeout(() => p.remove(), 250);
    });
  }

  function guide(u) {
    const words = u.words
      .map((w) => `<div class="guide-word">${say(w.pl)}<span class="emoji">${w.e}</span><div class="grow"><div>${plWord(w)}</div><div class="tiny">${hint(w)}</div></div><span class="small">${frTypo(esc(w.fr))}</span></div>`)
      .join('');
    const sents = u.sentences
      .slice(0, 8)
      .map((s) => `<div class="guide-sent">${say(s.pl)}<div><div class="pl">${S.ui.glossy(s.pl)}</div><div class="small muted">${frTypo(esc(s.fr))}</div></div></div>`)
      .join('');
    S.ui.modal({
      cls: 'wide guide-modal',
      title: `Unité ${u.num} · ${u.fr}`,
      art: `<div class="medallion" style="--sz:76px;--c:var(--${u.color})"><span class="emoji">${u.icon}</span></div>`,
      body: `
        <p class="center pl guide-pl">${esc(u.pl)}</p>
        <div class="guide-tips">${u.tips.map((t) => `<div class="callout tip"><span class="emoji">💡</span><p>${fmt(t)}</p></div>`).join('')}</div>
        <h3 class="guide-h">Vocabulaire <span class="muted small">(${u.words.length} mots)</span></h3>
        <div class="guide-words">${words}</div>
        <h3 class="guide-h">Phrases clés</h3>
        <div class="guide-sents">${sents}</div>`,
      actions: [{ label: 'Fermer', value: true, cls: 'btn-primary' }],
    });
  }

  S.views.path = {
    title: 'Parcours',
    pl: 'Twoja ścieżka',
    mount(el) {
      const anyDone = Object.keys(S.store.state.lessons).length > 0;
      el.innerHTML = `
        <section class="path">
          ${!anyDone ? `<a href="#/sounds" class="card paper path-start rv" style="--layer:var(--blue)" data-tilt="4">
              <span class="emoji ps-emoji">🔤</span>
              <div class="grow"><b>Conseil : commence par les sons !</b><p class="small muted">Le polonais se lit comme il s’écrit. 10 minutes avec l’alphabet et les « chuintantes » t’éviteront bien des surprises.</p></div>
              ${icon('arrowR', 22)}
            </a>` : ''}
          ${C.units.map((u, i) => unitHTML(u, i)).join('')}
          <div class="path-end rv">${mascot('cheer', 150)}<p class="pl">Koniec ścieżki… na razie!</p><p class="small muted">Fin du parcours… pour l’instant !</p></div>
        </section>`;

      const redraw = () => drawLines(el);
      window.addEventListener('resize', redraw);

      // Chaque unité trace son chemin (puis le révèle) quand elle apparaît à l'écran
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const u = en.target;
              drawUnit(u);
              requestAnimationFrame(() => u.classList.add('drawn'));
              setTimeout(() => drawUnit(u), 900);
              io.unobserve(u);
            }
          }),
        { threshold: 0.05 }
      );
      el.querySelectorAll('.unit').forEach((u) => io.observe(u));

      el.addEventListener('click', (e) => {
        const b = e.target.closest('.node');
        if (b) {
          e.stopPropagation();
          S.audio.sfx.pop();
          S.fx.jelly(b);
          popover(C.nodeById[b.dataset.node], b, el);
          return;
        }
        const g = e.target.closest('[data-guide]');
        if (g) return guide(C.units.find((u) => u.id === g.dataset.guide));
        closePop(el);
      });
      const onDoc = () => closePop(el);
      document.addEventListener('click', onDoc);

      // Défilement jusqu'à l'étape en cours
      const cur = el.querySelector('.node-wrap.current');
      if (cur && anyDone) setTimeout(() => cur.scrollIntoView({ behavior: S.fx.reduced() ? 'auto' : 'smooth', block: 'center' }), 500);

      return () => {
        window.removeEventListener('resize', redraw);
        document.removeEventListener('click', onDoc);
        io.disconnect();
      };
    },
  };
})();
