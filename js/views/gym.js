/* Słowik — salle d'entraînement : pratique ciblée, nombres, heure, conjugaison, cas, dictée, sprint. */
(function () {
  'use strict';
  const { $, esc, frTypo, shuffle, pick, sample, randi, cvars } = S.util;
  const { icon, say, mascot } = S.ui;
  const C = S.content;
  const E = S.ex;

  const DRILLS = [
    { id: 'practice', ic: 'target', color: 'green', t: 'Entraînement ciblé', pl: 'Trening', d: 'Tes mots les plus fragiles, en exercices variés.' },
    { id: 'sprint', ic: 'bolt', color: 'orange', t: 'Sprint 60 s', pl: 'Sprint', d: 'Un maximum de bonnes réponses en une minute !' },
    { id: 'numbers', ic: 'hash', color: 'yellow', t: 'Les nombres', pl: 'Liczby', d: 'Écoute un nombre (0 → 9 999) et écris-le en chiffres.' },
    { id: 'clock', ic: 'clock', color: 'blue', t: 'L’heure', pl: 'Która godzina?', d: 'Lis l’horloge et choisis la bonne heure en polonais.' },
    { id: 'conj', ic: 'refresh', color: 'violet', t: 'Conjugaison', pl: 'Odmiana', d: 'Présent et passé de 38 verbes essentiels.' },
    { id: 'cases', ic: 'puzzle', color: 'teal', t: 'Les cas', pl: 'Przypadki', d: 'Phrases à trous : accusatif, génitif, locatif…' },
    { id: 'dictee', ic: 'ear', color: 'pink', t: 'Dictée', pl: 'Dyktando', d: 'Écoute des phrases et écris-les sans faute.' },
    { id: 'gender', ic: 'puzzle', color: 'red', t: 'Masculin, féminin, neutre', pl: 'Rodzaj', d: 'Devine le genre des noms appris.' },
  ];

  S.views.gym = {
    title: 'Entraînement',
    pl: 'Siłownia językowa',
    mount(el) {
      const st = S.store.state;
      el.innerHTML = `
        <section class="gym">
          <div class="gym-hero card paper rv" style="--layer:var(--green)">
            <div class="grow">
              <h2>La salle de sport linguistique</h2>
              <p class="muted">Des exercices ciblés pour muscler ce qui résiste : nombres, heures, conjugaisons, cas… Chaque bonne réponse rapporte de l’XP.</p>
              <div class="row wrap"><span class="chip">${icon('bolt', 14)} Record du sprint : <b>${st.stats.sprintBest || 0}</b></span><span class="chip">${icon('hash', 14)} Nombres réussis : <b>${st.stats.numbersOk || 0}</b></span></div>
            </div>
            ${mascot('cheer', 130)}
          </div>
          <div class="gym-grid">
            ${DRILLS.map(
              (d, i) => `
              <button type="button" class="gym-card card hover rv" style="${cvars(d.color)};--i:${i}" data-drill="${d.id}" data-tilt="7">
                <span class="gc-ico">${icon(d.ic, 30)}</span>
                <span class="gc-txt"><b>${d.t}</b><span class="pl">${d.pl}</span><small>${d.d}</small></span>
                <span class="gc-go">${icon('play', 16)}</span>
              </button>`
            ).join('')}
          </div>
        </section>`;
      el.querySelectorAll('[data-drill]').forEach((b) => b.addEventListener('click', () => start(b.dataset.drill, b)));
    },
  };

  function start(id, from) {
    S.audio.sfx.pop();
    if (id === 'practice') return S.session.startPractice(from);
    if (id === 'sprint') return sprint(from);
    const gen = { numbers: numbersItems, clock: clockItems, conj: conjItems, cases: casesItems, dictee: dicteeItems, gender: genderItems }[id];
    const d = DRILLS.find((x) => x.id === id);
    const items = gen();
    if (!items || !items.length) {
      S.ui.toast({ emoji: '🌱', title: 'Pas encore disponible', text: 'Termine quelques leçons pour débloquer cet exercice.' });
      return;
    }
    S.session.open({
      items, from, color: d.color,
      titleHTML: `<span class="pl">${esc(d.pl)}</span><span class="muted"> · ${esc(d.t)}</span>`,
      doneLabel: d.t,
      onFinish(r) {
        const correct = Math.round(r.acc * items.filter((x) => x.graded).length);
        r.xp = Math.max(3, correct);
        S.store.addXP(r.xp, 'gym');
        if (id === 'numbers') S.store.bumpStat('numbersOk', correct);
        S.store.checkAchievements();
        return {};
      },
      again: () => start(id),
    });
  }

  /* ───────────── Nombres ───────────── */
  function numberItem(n) {
    const words = C.numberPl(n);
    return {
      type: 'number', graded: true, words: [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-number">
            <div class="ex-head"><div class="ex-label">${icon('hash', 16)}<span>Nombres</span></div><h2 class="ex-title">Écris ce nombre en chiffres</h2></div>
            <div class="listen-box">${say(words, { big: true })}${say(words, { big: true, slow: true })}</div>
            <input class="input type-input num-input" inputmode="numeric" autocomplete="off" placeholder="123" aria-label="Nombre en chiffres">
          </div>`;
        const inp = stage.querySelector('.num-input');
        inp.addEventListener('input', () => {
          inp.value = inp.value.replace(/[^0-9]/g, '');
          api.ready(inp.value.length > 0);
        });
        setTimeout(() => {
          S.audio.speak(words);
          inp.focus();
        }, 380);
        this._inp = inp;
        api.ready(false);
      },
      onKey(e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          S.audio.speak(words, { slow: e.shiftKey });
        }
      },
      check() {
        const ok = +this._inp.value === n;
        this._inp.disabled = true;
        this._inp.classList.add(ok ? 'ok' : 'ko');
        return { ok, answer: `<b>${n.toLocaleString('fr-FR')}</b> = <span class="pl">${esc(words)}</span>`, say: words };
      },
    };
  }
  function numbersItems() {
    const ranges = [[0, 10], [11, 20], [21, 99], [21, 99], [100, 999], [100, 999], [1000, 9999], [0, 100], [11, 19], [100, 999]];
    return ranges.map(([a, b]) => {
      const n = randi(a, b);
      const it = numberItem(n);
      it.clone = () => numberItem(n);
      return it;
    });
  }

  /* ───────────── Horloge ───────────── */
  const H = S.data.hours;
  function timePl(h, m) {
    const h12 = h % 12 || 12;
    const nx = (h12 % 12) + 1;
    if (m === 0) return `${H.nom[h12]}`;
    if (m === 30) return `wpół do ${H.gen[nx]}`;
    if (m === 15) return `kwadrans po ${H.gen[h12]}`;
    if (m === 45) return `za kwadrans ${H.nom[nx]}`;
    return '';
  }
  function clockSVG(h, m) {
    const ticks = Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return `<line x1="${50 + Math.sin(a) * 40}" y1="${50 - Math.cos(a) * 40}" x2="${50 + Math.sin(a) * 45}" y2="${50 - Math.cos(a) * 45}" stroke="var(--ink)" stroke-width="${i % 3 ? 1.5 : 3}" stroke-linecap="round"/>`;
    }).join('');
    const ha = ((h % 12) + m / 60) * 30;
    const ma = m * 6;
    return `<svg class="clock" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="var(--surface)" stroke="var(--c-acc)" stroke-width="3"/>
      ${ticks}
      <g class="hand h-h" style="--a:${ha}deg"><line x1="50" y1="52" x2="50" y2="27" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/></g>
      <g class="hand h-m" style="--a:${ma}deg"><line x1="50" y1="54" x2="50" y2="14" stroke="var(--c-acc)" stroke-width="3" stroke-linecap="round"/></g>
      <circle cx="50" cy="50" r="4" fill="var(--ink)"/>
    </svg>`;
  }
  function clockItem(h, m) {
    const good = timePl(h, m);
    const set = new Set([good]);
    while (set.size < 4) {
      const hh = randi(1, 12);
      const mm = pick([0, 15, 30, 45]);
      set.add(timePl(hh, mm));
    }
    const opts = shuffle(Array.from(set));
    let sel = -1;
    return {
      type: 'clock', graded: true, words: [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-clock">
            <div class="ex-head"><div class="ex-label">${icon('clock', 16)}<span>L’heure</span></div><h2 class="ex-title">Która jest godzina?</h2></div>
            <div class="clock-wrap">${clockSVG(h, m)}<div class="clock-digital tnum">${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}</div></div>
            <div class="options stagger-pop">${opts.map((o, i) => `<button type="button" class="opt" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt pl">${esc(o)}</span></button>`).join('')}</div>
          </div>`;
        const btns = stage.querySelectorAll('.opt');
        const choose = (i) => {
          sel = i;
          btns.forEach((b, j) => b.classList.toggle('sel', j === i));
          S.audio.sfx.select();
          S.audio.speak(opts[i]);
          api.ready(true);
        };
        btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
        this._choose = choose;
        this._btns = btns;
        requestAnimationFrame(() => stage.querySelector('.clock').classList.add('set'));
      },
      onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 4) this._choose(n - 1);
      },
      check() {
        this._btns.forEach((b, j) => {
          b.disabled = true;
          if (opts[j] === good) b.classList.add('ok');
          else if (j === sel) b.classList.add('ko');
        });
        const note = m === 30 ? '« Wpół do… » : littéralement « à moitié vers » l’heure suivante !' : m === 15 ? '« Kwadrans po… » : un quart d’heure après…' : m === 45 ? '« Za kwadrans… » : dans un quart d’heure, il sera…' : 'Les heures pleines utilisent l’ordinal féminin : pierwsza, druga, trzecia…';
        return { ok: opts[sel] === good, answer: `<span class="pl">${esc(good)}</span>`, note, say: good };
      },
    };
  }
  function clockItems() {
    return Array.from({ length: 8 }, () => {
      const h = randi(1, 12);
      const m = pick([0, 0, 15, 30, 30, 45]);
      const it = clockItem(h, m);
      it.clone = () => clockItem(h, m);
      return it;
    });
  }

  /* ───────────── Conjugaison ───────────── */
  function pastForms(v) {
    if (v.past) return v.past;
    const reflex = v.inf.endsWith(' się');
    const inf = v.inf.replace(' się', '');
    const sfx = reflex ? ' się' : '';
    let sg;
    let mp;
    if (inf.endsWith('eć')) {
      sg = inf.slice(0, -2) + 'a';
      mp = inf.slice(0, -2) + 'e';
    } else {
      sg = inf.slice(0, -1);
      mp = sg;
    }
    return {
      m: [sg + 'łem', sg + 'łeś', sg + 'ł', mp + 'liśmy', mp + 'liście', mp + 'li'].map((x) => x + sfx),
      f: [sg + 'łam', sg + 'łaś', sg + 'ła', sg + 'łyśmy', sg + 'łyście', sg + 'ły'].map((x) => x + sfx),
    };
  }
  S.data.pastForms = pastForms;
  function conjItem(v, tense, p, g) {
    const P = S.data.persons;
    const answer = tense === 'pres' ? v.pres[p] : pastForms(v)[g][p];
    const person = tense === 'pres' ? P[p].pl : ['ja', 'ty', g === 'm' ? 'on' : 'ona', 'my', 'wy', g === 'm' ? 'oni' : 'one'][p];
    const genderLbl = tense === 'past' && [0, 1, 3, 4].includes(p) ? ` <span class="chip ${g === 'm' ? 'g-m' : 'g-f'}">${g === 'm' ? 'homme / masc.' : 'femme / fém.'}</span>` : '';
    return {
      type: 'conj', graded: true, words: [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-conj">
            <div class="ex-head"><div class="ex-label">${icon('refresh', 16)}<span>${tense === 'pres' ? 'Présent' : 'Passé'}</span></div><h2 class="ex-title">Conjugue le verbe</h2></div>
            <div class="conj-prompt">
              <div class="cp-verb"><span class="pl">${esc(v.inf)}</span><span class="muted">${esc(v.fr)}</span></div>
              <div class="cp-person"><span class="pl">${esc(person)}</span>${genderLbl}<span class="cp-blank">…</span></div>
            </div>
            <div class="type-box">
              <input class="input type-input" autocomplete="off" spellcheck="false" placeholder="Forme conjuguée" aria-label="Forme conjuguée">
              ${E.plKeyboard()}
            </div>
          </div>`;
        const inp = stage.querySelector('.type-input');
        E.wireKeyboard(stage, inp);
        inp.addEventListener('input', () => api.ready(inp.value.trim().length > 0));
        setTimeout(() => inp.focus(), 380);
        this._inp = inp;
        api.ready(false);
      },
      check() {
        this._inp.disabled = true;
        const r = E.checkTyped(this._inp.value, [answer]);
        this._inp.classList.add(r.ok ? 'ok' : 'ko');
        const table = (tense === 'pres' ? v.pres : pastForms(v)[g]).map((f, k) => `<span class="${k === p ? 'hl' : ''}">${esc(f)}</span>`).join(' · ');
        return { ok: r.ok, soft: !!r.soft, answer: `<span class="pl">${esc(person)} ${esc(answer)}</span>`, sub: `<span class="pl conj-line">${table}</span>`, say: `${person.split(' / ')[0]} ${answer}` };
      },
    };
  }
  function conjItems() {
    const V = S.data.verbs;
    return Array.from({ length: 10 }, (_, i) => {
      const v = pick(V);
      const tense = i % 3 === 2 ? 'past' : 'pres';
      const p = randi(0, 5);
      const g = pick(['m', 'f']);
      const it = conjItem(v, tense, p, g);
      it.clone = () => conjItem(v, tense, p, g);
      return it;
    });
  }

  /* ───────────── Cas, dictée, genre ───────────── */
  function casesItems() {
    const units = C.studiedUnits();
    const pool = [].concat(...units.map((u) => u.cloze || []));
    const all = pool.length >= 8 ? pool : [].concat(...C.units.slice(0, 6).map((u) => u.cloze || []));
    return sample(all, 10).map((c) => E.cloze(c));
  }
  function dicteeItems() {
    if (!S.audio.hasVoice()) {
      S.ui.noVoiceHelp(true);
      return null;
    }
    const units = C.studiedUnits();
    const sents = [].concat(...units.map((u) => u.sentences));
    return sample(sents, 8).map((s) => E.dictation(s));
  }
  function genderItems() {
    const learned = C.learnedWords().filter((w) => ['m', 'f', 'n'].includes(w.g));
    const pool = learned.length >= 8 ? learned : C.words.filter((w) => ['m', 'f', 'n'].includes(w.g) && w.unit.index < 6);
    return sample(pool, 10).map((w) => E.gender(w));
  }

  /* ───────────── Sprint chronométré ───────────── */
  function sprint(from) {
    const learned = C.learnedWords();
    const pool = learned.length >= 12 ? learned : C.words.filter((w) => w.unit.index < Math.max(2, C.studiedUnits().length + 1));
    const root = document.createElement('div');
    root.className = 'session sprint';
    root.style.setProperty('--c-acc', 'var(--orange)');
    root.style.setProperty('--c-acc-d', 'var(--orange-d)');
    const r = from.getBoundingClientRect();
    root.style.setProperty('--ox', r.left + r.width / 2 + 'px');
    root.style.setProperty('--oy', r.top + r.height / 2 + 'px');
    root.innerHTML = `
      <div class="ss-top"><button type="button" class="icon-btn ss-close" aria-label="Quitter">${icon('x', 22)}</button>
        <div class="sp-timer"><svg viewBox="0 0 100 100"><circle class="sp-track" cx="50" cy="50" r="44"/><circle class="sp-fill" cx="50" cy="50" r="44" pathLength="100"/></svg><b class="sp-sec tnum">60</b></div>
        <div class="sp-score"><span class="muted small">Score</span><b class="display tnum">0</b></div></div>
      <div class="ss-stage-wrap"><div class="sp-stage"><div class="sp-ready a-pop">${mascot('cheer', 150)}<h2 class="display">Prêt·e ?</h2><p class="muted">Traduis un maximum de mots en 60 secondes. Touches 1 à 4 pour répondre vite !</p><button type="button" class="btn btn-lg btn-primary sp-go" style="--c:var(--orange);--c-d:var(--orange-d)">${icon('bolt', 20)} Partez !</button></div></div></div>`;
    $('#overlay').appendChild(root);
    document.body.classList.add('in-session');
    requestAnimationFrame(() => root.classList.add('open'));
    const coverT = setTimeout(() => document.body.classList.add('covered'), 850);
    const stage = root.querySelector('.sp-stage');
    const scoreEl = root.querySelector('.sp-score b');
    const secEl = root.querySelector('.sp-sec');
    const fill = root.querySelector('.sp-fill');
    let score = 0;
    let t0 = 0;
    let timer = null;
    let over = false;
    let cur = null;

    function q() {
      const w = pick(pool);
      const dir = Math.random() < 0.5 ? 'pl-fr' : 'fr-pl';
      const key = dir === 'pl-fr' ? 'fr' : 'pl';
      const others = shuffle(pool.filter((x) => x.id !== w.id && x[key] !== w[key])).slice(0, 3);
      const opts = shuffle([w].concat(others));
      cur = { w, opts, dir };
      stage.innerHTML = `
        <div class="sp-q a-zoom">
          <div class="sp-prompt">${dir === 'pl-fr' ? `<span class="pl">${esc(w.pl)}</span>` : `<span class="emoji">${w.e}</span> ${frTypo(esc(w.fr))}`}</div>
          <div class="options">${opts.map((o, i) => `<button type="button" class="opt" data-i="${i}"><span class="kbd">${i + 1}</span><span class="opt-txt ${key === 'pl' ? 'pl' : ''}">${esc(key === 'pl' ? o.pl : o.fr)}</span></button>`).join('')}</div>
        </div>`;
      stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.i, b)));
    }
    function answer(i, b) {
      if (over) return;
      const ok = cur.opts[i].id === cur.w.id;
      if (ok) {
        score++;
        scoreEl.textContent = score;
        S.fx.pop(scoreEl, 1.3);
        S.audio.sfx.correct();
        b.classList.add('ok');
      } else {
        S.audio.sfx.wrong();
        b.classList.add('ko');
        S.fx.shake(b);
      }
      setTimeout(q, ok ? 180 : 450);
    }
    function tick() {
      const left = Math.max(0, 60 - (Date.now() - t0) / 1000);
      secEl.textContent = Math.ceil(left);
      fill.style.strokeDashoffset = 100 - (left / 60) * 100;
      root.classList.toggle('hurry', left <= 10);
      if (left <= 10 && Math.ceil(left) !== tick.last) {
        tick.last = Math.ceil(left);
        S.audio.sfx.tick();
      }
      if (left <= 0) end();
    }
    function end() {
      over = true;
      clearInterval(timer);
      const best = S.store.state.stats.sprintBest || 0;
      S.store.setStatMax('sprintBest', score);
      const xp = Math.min(25, score);
      if (xp) S.store.addXP(xp, 'sprint');
      S.store.checkAchievements();
      stage.innerHTML = `<div class="sp-ready a-pop">${mascot(score > best ? 'cheer' : 'happy', 150)}<h2 class="display">${score} point${score > 1 ? 's' : ''} !</h2>
        <p>${score > best ? '🏆 Nouveau record personnel !' : `Record : ${best}`}</p><p class="muted">+${xp} XP</p>
        <div class="row wrap" style="justify-content:center"><button type="button" class="btn btn-soft sp-quit">Terminer</button><button type="button" class="btn btn-primary sp-again" style="--c:var(--orange);--c-d:var(--orange-d)">${icon('refresh', 18)} Rejouer</button></div></div>`;
      if (score > best) S.fx.rain(120);
      else S.fx.burst(stage, 40, 9);
      S.audio.sfx.complete();
      stage.querySelector('.sp-quit').addEventListener('click', close);
      stage.querySelector('.sp-again').addEventListener('click', () => {
        close();
        setTimeout(() => sprint(from), 520);
      });
    }
    function close() {
      over = true;
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      clearTimeout(coverT);
      document.body.classList.remove('covered');
      root.classList.remove('open');
      root.classList.add('closing');
      document.body.classList.remove('in-session');
      setTimeout(() => {
        root.remove();
        S.router.refresh();
      }, 480);
    }
    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      const n = parseInt(e.key, 10);
      if (!over && cur && n >= 1 && n <= 4) {
        const b = stage.querySelectorAll('.opt')[n - 1];
        if (b) answer(n - 1, b);
      }
      if (e.key === 'Enter' && !t0) root.querySelector('.sp-go') && root.querySelector('.sp-go').click();
    };
    document.addEventListener('keydown', onKey);
    root.querySelector('.ss-close').addEventListener('click', close);
    root.querySelector('.sp-go').addEventListener('click', () => {
      t0 = Date.now();
      S.audio.sfx.levelup();
      q();
      timer = setInterval(tick, 200);
    });
  }
})();
