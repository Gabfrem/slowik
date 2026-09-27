/* Słowik — révisions : cartes recto-verso en 3D, notation FSRS, glisser pour noter. */
(function () {
  'use strict';
  const { $, esc, frTypo, shuffle, fmtTime, cvars } = S.util;
  const { icon, say, mascot, plWord, hint, genderChip, flower, ring } = S.ui;
  const C = S.content;

  const GRADES = [
    { g: 1, fr: 'À revoir', pl: 'Jeszcze raz', cls: 'g-again', key: '1' },
    { g: 2, fr: 'Difficile', pl: 'Trudne', cls: 'g-hard', key: '2' },
    { g: 3, fr: 'Bien', pl: 'Dobrze', cls: 'g-good', key: '3' },
    { g: 4, fr: 'Facile', pl: 'Łatwe', cls: 'g-easy', key: '4' },
  ];

  function counts() {
    const cards = S.store.state.cards;
    const m = [0, 0, 0, 0, 0];
    Object.keys(cards).forEach((id) => C.wordById[id] && m[S.srs.mastery(cards[id])]++);
    m[0] = C.words.length - Object.keys(cards).filter((id) => C.wordById[id]).length;
    return m;
  }
  function forecast() {
    const cards = S.store.state.cards;
    const now = Date.now();
    const DAY = S.srs.DAY;
    const out = new Array(7).fill(0);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    Object.keys(cards).forEach((id) => {
      if (!C.wordById[id]) return;
      const d = Math.floor((Math.max(cards[id].due, now) - start.getTime()) / DAY);
      if (d >= 0 && d < 7) out[d]++;
    });
    return out;
  }

  S.views.review = {
    title: 'Révisions',
    pl: 'Powtórki',
    mount(el) {
      const due = S.store.dueIds();
      const total = Object.keys(S.store.state.cards).filter((id) => C.wordById[id]).length;
      const m = counts();
      const fc = forecast();
      const maxF = Math.max(1, ...fc);
      const DAYN = ['Auj.', 'Dem.', '+2 j', '+3 j', '+4 j', '+5 j', '+6 j'];
      el.innerHTML = `
        <section class="review">
          <div class="rv-hero card paper rv" style="--layer:var(--blue)">
            <div class="rvh-txt">
              <div class="eyebrow">Répétition espacée · FSRS</div>
              <h2>${due.length ? `${due.length} carte${due.length > 1 ? 's' : ''} à réviser` : total ? 'Tout est à jour !' : 'Ton jardin de mots est vide'}</h2>
              <p class="muted">${total ? 'L’algorithme FSRS (celui d’Anki) calcule le moment idéal pour revoir chaque mot : juste avant que tu ne l’oublies. Quelques minutes par jour suffisent.' : 'Termine une leçon : ses mots viendront pousser ici, et reviendront au moment idéal pour être révisés.'}</p>
              <div class="row wrap">
                ${due.length ? `<button type="button" class="btn btn-blue btn-lg" data-magnet data-rv="due">${icon('play', 18)}<span>Commencer</span></button>` : ''}
                ${total ? `<button type="button" class="btn ${due.length ? 'btn-soft' : 'btn-blue'} btn-lg" data-rv="free">${icon('shuffle', 18)}<span>Révision libre</span></button>` : `<button type="button" class="btn btn-primary btn-lg" data-go="path">${icon('path', 18)}<span>Aller au parcours</span></button>`}
              </div>
            </div>
            <div class="rvh-deck ${due.length ? 'has' : ''}">
              <div class="deck-card d3"></div><div class="deck-card d2"></div>
              <div class="deck-card d1"><span class="display">${due.length}</span><small>${due.length ? 'à revoir' : 'à jour'}</small></div>
              ${!due.length && total ? `<div class="deck-bird">${mascot('sleep', 110)}</div>` : ''}
            </div>
          </div>

          <div class="grid g2 mt">
            <div class="card rv" style="--i:1">
              <div class="card-title">${icon('tulip', 20)}<h3>Ton jardin de mots</h3></div>
              <div class="garden">
                ${S.srs.MASTERY_LABELS.map((lbl, k) => `
                  <div class="garden-row" style="--i:${k}">
                    ${flower(k, 30)}
                    <span class="garden-lbl">${lbl}</span>
                    <div class="bar garden-bar" style="--c-bar:${S.ui.MASTERY_COLORS[k]}"><div class="bar-fill" style="width:0" data-w="${((m[k] / Math.max(1, C.words.length)) * 100).toFixed(1)}%"></div></div>
                    <b class="tnum">${m[k]}</b>
                  </div>`).join('')}
              </div>
            </div>
            <div class="card rv" style="--i:2">
              <div class="card-title">${icon('calendar', 20)}<h3>Cette semaine</h3><span class="eyebrow">Prévisions</span></div>
              <div class="forecast">
                ${fc.map((n, i) => `<div class="fc-col" style="--i:${i}"><span class="fc-n tnum">${n || ''}</span><div class="fc-bar" style="--h:${(n / maxF) * 100}%"></div><span class="fc-d">${DAYN[i]}</span></div>`).join('')}
              </div>
              <p class="small muted">Nombre de cartes qui arriveront à échéance chaque jour.</p>
            </div>
          </div>

          <div class="card mt rv" style="--i:3">
            <div class="card-title">${icon('bulb', 20)}<h3>Comment noter ?</h3></div>
            <div class="grade-help">
              ${GRADES.map((g) => `<div class="gh ${g.cls}"><span class="kbd">${g.key}</span><b>${g.fr}</b><span class="pl">${g.pl}</span><small>${['Je ne savais pas.', 'Trouvé, mais avec effort.', 'Trouvé sans trop hésiter.', 'Évident, immédiat !'][g.g - 1]}</small></div>`).join('')}
            </div>
            <p class="small muted mt">Astuce : après avoir retourné une carte, glisse-la vers la droite (Bien) ou la gauche (À revoir). Espace pour retourner.</p>
          </div>
        </section>`;
      el.querySelectorAll('[data-rv]').forEach((b) =>
        b.addEventListener('click', () => {
          const ids = b.dataset.rv === 'due' ? S.store.dueIds().slice(0, 40) : freePick();
          startReview(ids, b);
        })
      );
      el.querySelectorAll('.fc-bar').forEach((b, i) => setTimeout(() => b.classList.add('grow'), 300 + i * 70));
    },
  };

  function freePick() {
    const cards = S.store.state.cards;
    return Object.keys(cards)
      .filter((id) => C.wordById[id])
      .sort((a, b) => S.srs.recallNow(cards[a]) - S.srs.recallNow(cards[b]))
      .slice(0, 20);
  }

  /* ───────────── Séance de cartes ───────────── */
  function startReview(ids, from) {
    if (!ids.length) return;
    const queue = shuffle(ids.slice(0, 12)).concat(ids.slice(12));
    const again = {};
    const tally = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const seen = new Set();
    const t0 = Date.now();
    let current = null;
    let flipped = false;
    let busy = false;

    const root = document.createElement('div');
    root.className = 'session flash';
    root.style.setProperty('--c-acc', 'var(--blue)');
    root.style.setProperty('--c-acc-d', 'var(--blue-d)');
    const r = from.getBoundingClientRect();
    root.style.setProperty('--ox', r.left + r.width / 2 + 'px');
    root.style.setProperty('--oy', r.top + r.height / 2 + 'px');
    root.innerHTML = `
      <div class="ss-top">
        <button type="button" class="icon-btn ss-close" aria-label="Quitter">${icon('x', 22)}</button>
        <div class="ss-progress"><div class="ss-bar"><div class="ss-bar-fill"></div></div></div>
        <div class="fl-count tnum"></div>
      </div>
      <div class="ss-stage-wrap"><div class="fl-stage"><div class="fl-deck"></div></div></div>
      <div class="ss-foot"><div class="ss-foot-inner fl-foot"></div></div>`;
    $('#overlay').appendChild(root);
    document.body.classList.add('in-session');
    requestAnimationFrame(() => root.classList.add('open'));
    const coverT = setTimeout(() => document.body.classList.add('covered'), 850);
    S.audio.sfx.whoosh();
    const deck = root.querySelector('.fl-deck');
    const foot = root.querySelector('.fl-foot');
    const barFill = root.querySelector('.ss-bar-fill');
    const countEl = root.querySelector('.fl-count');
    const totalUnique = new Set(queue).size;

    function progress() {
      barFill.style.width = Math.max(3, (seen.size / totalUnique) * 100) + '%';
      countEl.textContent = `${seen.size}/${totalUnique}`;
    }

    function cardHTML(w, dir) {
      const front =
        dir === 'pl'
          ? `<div class="fc-dir">${icon('cards', 14)} Polonais → Français</div>
             <div class="fc-main"><div class="fc-pl">${plWord(w)}</div>${say(w.pl, { big: true })}</div>
             <div class="fc-q muted">Que signifie ce mot ?</div>`
          : `<div class="fc-dir">${icon('cards', 14)} Français → Polonais</div>
             <div class="fc-main"><span class="emoji fc-emoji">${w.e || ''}</span><div class="fc-fr">« ${frTypo(esc(w.fr))} »</div></div>
             <div class="fc-q muted">Dis-le en polonais, puis retourne la carte.</div>`;
      const back = `
          <div class="fc-dir">${icon('check', 14)} Réponse</div>
          <div class="fc-main">
            <span class="emoji fc-emoji-s">${w.e || ''}</span>
            <div class="fc-pl">${plWord(w)}</div>
            <div>${hint(w)}</div>
            <div class="fc-fr2">${frTypo(esc(w.fr))} ${genderChip(w.g)}</div>
            <div class="row">${say(w.pl)}${say(w.pl, { slow: true })}</div>
          </div>
          ${w.ex ? `<div class="fc-ex"><div class="pl">${S.ui.glossy(w.ex[0])}</div><div class="small muted">${frTypo(esc(w.ex[1]))}</div></div>` : ''}`;
      return `<div class="fc-card" style="${cvars(w.unit.color)}"><div class="fc-inner">
          <div class="fc-face fc-front">${front}<div class="fc-flip-hint">${icon('refresh', 16)} Espace pour retourner</div></div>
          <div class="fc-face fc-back">${back}</div>
        </div><div class="fc-stamp"></div></div>`;
    }

    function showFootFront() {
      foot.innerHTML = `<div class="grow"></div><button type="button" class="btn btn-lg btn-blue fl-flip">${icon('refresh', 20)}<span>Retourner</span> <span class="kbd-hint">Espace</span></button><div class="grow"></div>`;
      foot.querySelector('.fl-flip').addEventListener('click', flip);
    }
    function showFootBack(card) {
      const pv = S.srs.preview(card);
      foot.innerHTML = `<div class="grades stagger-pop">${GRADES.map(
        (g, i) => `<button type="button" class="grade ${g.cls}" data-g="${g.g}" style="--i:${i}"><span class="kbd">${g.key}</span><b>${g.fr}</b><small>${S.srs.fmtDelay(pv[g.g])}</small></button>`
      ).join('')}</div>`;
      foot.querySelectorAll('.grade').forEach((b) => b.addEventListener('click', () => grade(+b.dataset.g)));
    }

    function show() {
      if (!queue.length) return finish();
      const id = queue.shift();
      const w = C.wordById[id];
      const dir = Math.random() < 0.55 ? 'pl' : 'fr';
      current = { id, w, dir };
      flipped = false;
      busy = false;
      deck.innerHTML = `<div class="fc-ghost g2"></div><div class="fc-ghost g1"></div>${cardHTML(w, dir)}`;
      const card = deck.querySelector('.fc-card');
      card.classList.add('enter');
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-say]')) return;
        if (!flipped) flip();
      });
      enableDrag(card);
      showFootFront();
      if (dir === 'pl') setTimeout(() => S.store.state.settings.autoplay && S.audio.speak(w.pl), 350);
      progress();
    }

    function flip() {
      if (flipped || !current) return;
      flipped = true;
      const card = deck.querySelector('.fc-card');
      card.classList.add('flipped');
      S.audio.sfx.flip();
      if (current.dir === 'fr') setTimeout(() => S.store.state.settings.autoplay && S.audio.speak(current.w.pl), 380);
      showFootBack(S.store.state.cards[current.id]);
    }

    function grade(g) {
      if (!flipped || busy) return;
      busy = true;
      const card = deck.querySelector('.fc-card');
      const { id } = current;
      S.store.reviewCard(id, g);
      tally[g]++;
      if (g === 1) {
        again[id] = (again[id] || 0) + 1;
        if (again[id] <= 2) queue.splice(Math.min(queue.length, 3 + Math.floor(Math.random() * 3)), 0, id);
        else seen.add(id);
        S.audio.sfx.wrong();
      } else {
        seen.add(id);
        S.audio.sfx.correct();
      }
      const stamp = card.querySelector('.fc-stamp');
      stamp.textContent = GRADES[g - 1].pl;
      stamp.className = `fc-stamp show ${GRADES[g - 1].cls}`;
      card.classList.add('out', `out-${g}`);
      progress();
      setTimeout(show, 520);
    }

    /* Glisser la carte retournée : droite = Bien, gauche = À revoir. */
    function enableDrag(card) {
      let sx = 0;
      let dx = 0;
      let dragging = false;
      card.addEventListener('pointerdown', (e) => {
        if (!flipped || busy || e.target.closest('button')) return;
        dragging = true;
        sx = e.clientX;
        dx = 0;
        card.setPointerCapture(e.pointerId);
        card.classList.add('dragging');
      });
      card.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        dx = e.clientX - sx;
        card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
        card.style.setProperty('--drag', Math.max(-1, Math.min(1, dx / 160)));
        card.classList.toggle('lean-r', dx > 60);
        card.classList.toggle('lean-l', dx < -60);
      });
      const end = () => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('dragging', 'lean-r', 'lean-l');
        if (dx > 120) return grade(3);
        if (dx < -120) return grade(1);
        card.style.transform = '';
      };
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', end);
    }

    const onKey = (e) => {
      if ($('#modals').children.length) return;
      if (e.key === 'Escape') return close();
      if (root.classList.contains('done')) {
        if (e.key === 'Enter') close();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) flip();
        else if (e.key === 'Enter') grade(3);
        return;
      }
      if (flipped && ['1', '2', '3', '4'].includes(e.key)) grade(+e.key);
    };
    document.addEventListener('keydown', onKey);
    root.querySelector('.ss-close').addEventListener('click', close);

    function close() {
      document.removeEventListener('keydown', onKey);
      S.audio.stop();
      clearTimeout(coverT);
      document.body.classList.remove('covered');
      root.classList.remove('open');
      root.classList.add('closing');
      document.body.classList.remove('in-session');
      setTimeout(() => {
        root.remove();
        S.updateHUD();
        S.router.refresh();
      }, 480);
    }

    function finish() {
      root.classList.add('done');
      const n = seen.size;
      const xp = Math.min(30, n);
      if (xp) S.store.addXP(xp, 'review');
      S.store.checkAchievements();
      const sum = tally[1] + tally[2] + tally[3] + tally[4] || 1;
      const nextDue = S.store.dueIds(Date.now() + S.srs.DAY).length;
      root.querySelector('.ss-foot').remove();
      root.querySelector('.ss-stage-wrap').innerHTML = `
        <div class="results">
          <div class="res-art">${S.ui.orn.rosette({ petals: 12, colors: ['var(--blue)', 'var(--yellow)', 'var(--green)'], cls: 'bloom res-rosette' })}${mascot('cheer', 160)}</div>
          <h1 class="res-title display">${S.fx.letters('Powtórka zrobiona!')}</h1>
          <p class="res-sub">Révision terminée : ${n} carte${n > 1 ? 's' : ''} en ${fmtTime(Date.now() - t0)}.</p>
          <div class="grade-split">${GRADES.map((g) => (tally[g.g] ? `<div class="gs ${g.cls}" style="flex:${tally[g.g]}"><b>${tally[g.g]}</b><span>${g.fr}</span></div>` : '')).join('')}</div>
          <div class="res-stats" style="grid-template-columns:repeat(3,minmax(0,1fr))">
            <div class="res-stat c-orange" style="--i:0"><span class="rs-k">XP</span><b class="rs-v">+${xp}</b></div>
            <div class="res-stat c-green" style="--i:1"><span class="rs-k">Réussies</span><b class="rs-v">${Math.round(((tally[2] + tally[3] + tally[4]) / sum) * 100)} %</b></div>
            <div class="res-stat c-blue" style="--i:2"><span class="rs-k">Demain</span><b class="rs-v">${nextDue}</b></div>
          </div>
          <div class="res-actions"><button type="button" class="btn btn-lg btn-blue res-done">Terminer ${icon('check', 20)}</button></div>
        </div>`;
      root.querySelector('.res-done').addEventListener('click', close);
      S.audio.sfx.complete();
      S.fx.cannons(60);
      if (xp) setTimeout(() => S.fx.floatText(`+${xp} XP`, root.querySelector('.res-stat'), 'xp'), 900);
    }

    setTimeout(show, 420);
  }

  S.review = { start: startReview };
})();
