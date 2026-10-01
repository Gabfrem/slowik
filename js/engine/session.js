/* Słowik — séances d'exercices : génération des leçons, déroulé, retours animés, écran de fin. */
(function () {
  'use strict';
  const { $, esc, shuffle, sample, pick, frTypo, fmtTime, uniq } = S.util;
  const { icon, mascot, say } = S.ui;
  const C = S.content;
  const E = S.ex;

  /* « Je ne peux pas écouter / parler maintenant » : ces exercices sont mis en pause 10 minutes. */
  const PAUSE_MS = 10 * 60 * 1000;
  const NEEDS = { listen: 'listen', dictation: 'listen', speak: 'speak' };
  const PAUSE_KEY = { listen: 'noListenUntil', speak: 'noSpeakUntil' };
  const paused = (need) => Date.now() < (S.store.state.settings[PAUSE_KEY[need]] || 0);
  const canHear = () => S.audio.hasVoice() && !paused('listen');
  const canSpeak = () => S.store.state.settings.speech && S.audio.canListen() && !paused('speak');
  /* Variante sans son ni micro d'un exercice (null = on le retire). */
  function noAudioAlt(it) {
    const [k, args] = it._spec || [];
    if (k === 'listen') return E.choice(args[0], 'pl-fr', args[1]);
    if (k === 'dictation') return E.build(args[0], 'fr-pl', args[0].unit);
    return null;
  }

  /* ───────────── Générateurs ───────────── */
  function poolFor(unit) {
    const us = [unit, C.units[unit.index - 1], C.units[unit.index + 1]].filter(Boolean);
    return [].concat(...us.map((u) => u.words));
  }
  function learnedBefore(unit, exclude) {
    const ex = new Set(exclude.map((w) => w.id));
    return C.learnedWords().filter((w) => !ex.has(w.id) && w.unit.index <= unit.index);
  }
  const listenOr = (w, pool) => (canHear() ? E.listen(w, pool) : E.choice(w, 'fr-pl', pool));

  function lessonItems(lesson) {
    const u = lesson.unit;
    const ws = lesson.words;
    const pool = poolFor(u);
    const prev = learnedBefore(u, ws);
    const items = [];
    ws.forEach((w, i) => {
      items.push(E.intro(w));
      if (i % 3 === 0) items.push(E.choice(w, 'pl-fr', pool));
      else if (i % 3 === 1) items.push(listenOr(w, pool));
      else items.push(E.choice(w, 'fr-pl', pool));
      if (i === 2) items.push(E.match(ws.slice(0, 3).concat(sample(prev, 2))));
    });
    const practice = [];
    practice.push(E.match(sample(ws, Math.min(5, ws.length))));
    const sents = shuffle(lesson.sentences);
    sents.slice(0, 3).forEach((s, i) => practice.push(E.build(s, i % 2 === 0 ? 'fr-pl' : 'pl-fr', u)));
    const typed = sample(ws, 2);
    practice.push(E.type(typed[0]));
    if (u.cloze && u.cloze.length) sample(u.cloze, lesson.index === 0 ? 1 : 2).forEach((c) => practice.push(E.cloze(c)));
    if (canSpeak()) practice.push(E.speak(pick(sents.slice(0, 2).concat(ws.slice(0, 2)))));
    practice.push(listenOr(pick(ws), pool));
    if (typed[1]) practice.push(E.type(typed[1]));
    if (lesson.index >= 1 && canHear() && sents[3]) practice.push(E.dictation(sents[3]));
    const nouns = ws.filter((w) => ['m', 'f', 'n'].includes(w.g));
    if (u.index >= 3 && nouns.length) practice.push(E.gender(pick(nouns)));
    sample(prev, 2).forEach((w) => practice.push(Math.random() < 0.5 ? E.choice(w, 'fr-pl', pool) : E.type(w)));
    // On garde les tuiles de phrases réparties, pas groupées
    const mixed = spread(practice);
    return items.concat(mixed);
  }
  /* Mélange en évitant deux exercices du même type à la suite. */
  function spread(list) {
    const pool = shuffle(list);
    const out = [];
    while (pool.length) {
      const last = out[out.length - 1];
      let k = pool.findIndex((x) => !last || x.type !== last.type);
      if (k < 0) k = 0;
      out.push(pool.splice(k, 1)[0]);
    }
    return out;
  }

  function challengeItems(unit) {
    const ws = unit.words;
    const pool = poolFor(unit);
    const sents = shuffle(unit.sentences);
    const items = [];
    sents.slice(0, 3).forEach((s) => items.push(E.build(s, 'fr-pl', unit)));
    sents.slice(3, 5).forEach((s) => items.push(E.build(s, 'pl-fr', unit)));
    sample(ws, 3).forEach((w) => items.push(E.type(w)));
    sample(unit.cloze || [], 3).forEach((c) => items.push(E.cloze(c)));
    items.push(E.match(sample(ws, 5)));
    if (canHear()) {
      items.push(E.dictation(sents[5] || sents[0]));
      sample(ws, 2).forEach((w) => items.push(E.listen(w, pool)));
    } else sample(ws, 2).forEach((w) => items.push(E.choice(w, 'pl-fr', pool)));
    if (sents[6]) items.push(E.typeSentence(sents[6]));
    const nouns = ws.filter((w) => ['m', 'f', 'n'].includes(w.g));
    if (nouns.length) items.push(E.gender(pick(nouns)));
    sample(ws, 2).forEach((w) => items.push(E.choice(w, 'fr-pl', pool)));
    if (canSpeak()) items.push(E.speak(pick(sents)));
    return spread(items);
  }

  /* Entraînement ciblé : mots appris les plus fragiles (de tout le parcours, ou d'une sélection). */
  function practiceItems(n = 12, subset) {
    const cards = S.store.state.cards;
    const learned = subset ? subset.filter((w) => w && cards[w.id]) : C.learnedWords();
    const weak = learned
      .map((w) => ({ w, r: S.srs.recallNow(cards[w.id]) - (cards[w.id].lapses || 0) * 0.05 + Math.random() * 0.15 }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.w);
    const pickW = weak.slice(0, 10);
    if (pickW.length < (subset ? 2 : 4)) return null;
    const units = uniq(pickW.map((w) => w.unit));
    const pool = [].concat(...units.map((u) => u.words));
    const items = [];
    if (pickW.length >= 3) items.push(E.match(sample(pickW, 5)));
    if (subset) {
      // Sélection : chaque mot revient deux fois (production + reconnaissance), phrases des mêmes étapes
      pickW.forEach((w, i) => {
        items.push(i % 2 ? E.type(w) : listenOr(w, pool));
        items.push(E.choice(w, i % 2 ? 'pl-fr' : 'fr-pl', pool));
      });
      const sents = uniq(pickW.map((w) => w.lesson)).flatMap((l) => l.sentences);
      sample(sents, 3).forEach((s, i) => items.push(E.build(s, i % 2 ? 'pl-fr' : 'fr-pl', s.unit)));
      return spread(items).slice(0, n);
    }
    const sents = [].concat(...units.map((u) => u.lessons.filter((l) => C.isDone(l.id)).flatMap((l) => l.sentences)));
    const clz = [].concat(...units.map((u) => u.cloze || []));
    pickW.slice(0, 4).forEach((w, i) => items.push(i % 2 ? E.type(w) : listenOr(w, pool)));
    pickW.slice(4, 7).forEach((w) => items.push(E.choice(w, pick(['pl-fr', 'fr-pl']), pool)));
    sample(sents, 2).forEach((s, i) => items.push(E.build(s, i ? 'pl-fr' : 'fr-pl', s.unit)));
    sample(clz, 2).forEach((c) => items.push(E.cloze(c)));
    return spread(items).slice(0, n);
  }

  /* ───────────── Déroulé d'une séance ───────────── */
  let active = null;

  function open(opts) {
    if (active) return;
    const overlay = $('#overlay');
    const root = document.createElement('div');
    root.className = 'session';
    root.style.setProperty('--c-acc', `var(--${opts.color || 'red'})`);
    root.style.setProperty('--c-acc-d', `var(--${opts.color || 'red'}-d)`);
    // Ouverture en « portail » depuis l'élément cliqué
    let ox = innerWidth / 2;
    let oy = innerHeight / 2;
    if (opts.from && opts.from.getBoundingClientRect) {
      const r = opts.from.getBoundingClientRect();
      ox = r.left + r.width / 2;
      oy = r.top + r.height / 2;
    }
    root.style.setProperty('--ox', ox + 'px');
    root.style.setProperty('--oy', oy + 'px');
    root.innerHTML = `
      <div class="ss-top">
        <button type="button" class="icon-btn ss-close" aria-label="Quitter">${icon('x', 22)}</button>
        <div class="ss-progress"><div class="ss-bar"><div class="ss-bar-fill"></div></div></div>
        <div class="ss-combo" aria-live="polite"></div>
      </div>
      <div class="ss-stage-wrap"><div class="ss-stage"></div></div>
      <div class="ss-foot">
        <div class="ss-foot-inner">
          <button type="button" class="btn btn-ghost ss-skip" hidden>Passer</button>
          <div class="ss-title">${opts.titleHTML || ''}</div>
          <button type="button" class="btn btn-lg ss-check" disabled>Vérifier <span class="kbd-hint">Entrée</span></button>
        </div>
      </div>
      <div class="ss-feedback" aria-live="assertive"></div>`;
    overlay.appendChild(root);
    document.body.classList.add('in-session');
    requestAnimationFrame(() => root.classList.add('open'));
    const coverT = setTimeout(() => document.body.classList.add('covered'), 850);
    S.audio.sfx.whoosh();

    const st = {
      queue: opts.items.map((it, k) => Object.assign(it, { orig: k, tries: 0 })),
      total: opts.items.length,
      doneSet: new Set(),
      graded: 0,
      firstOk: 0,
      mistakes: 0,
      combo: 0,
      maxCombo: 0,
      weak: new Set(),
      words: new Set(),
      start: Date.now(),
      cur: null,
      phase: 'answer',
    };
    opts.items.forEach((it) => it.graded && st.graded++);
    // Une séance entièrement d'écoute (dictée choisie exprès) ne propose pas la pause
    const audioOnly = opts.items.every((it) => NEEDS[it.type]);
    const stage = root.querySelector('.ss-stage');
    const checkBtn = root.querySelector('.ss-check');
    const skipBtn = root.querySelector('.ss-skip');
    const fb = root.querySelector('.ss-feedback');
    const barFill = root.querySelector('.ss-bar-fill');
    const comboEl = root.querySelector('.ss-combo');

    const setProgress = () => {
      const p = st.doneSet.size / st.total;
      barFill.style.width = Math.max(3, p * 100) + '%';
      barFill.classList.remove('bump');
      void barFill.offsetWidth;
      barFill.classList.add('bump');
    };
    const api = {
      ready(v) {
        checkBtn.disabled = !v;
      },
      complete(ok, mistakes) {
        onResult({ ok: true, auto: true, mistakes });
      },
    };

    function show(item) {
      st.cur = item;
      st.phase = 'answer';
      fb.classList.remove('show', 'ok', 'ko');
      checkBtn.disabled = true;
      checkBtn.className = 'btn btn-lg ss-check';
      checkBtn.innerHTML = item.graded ? `Vérifier <span class="kbd-hint">Entrée</span>` : `Continuer <span class="kbd-hint">Entrée</span>`;
      checkBtn.hidden = !!item.auto;
      skipBtn.hidden = !item.skippable;
      const old = stage.firstElementChild;
      const mountNew = () => {
        stage.innerHTML = '<div class="ss-card"></div>';
        const card = stage.firstElementChild;
        item.mount(card, api);
        const need = NEEDS[item.type];
        if (need && !audioOnly) {
          card.insertAdjacentHTML(
            'beforeend',
            `<div class="ss-cant-row"><button type="button" class="ss-cant">${icon(need === 'speak' ? 'mic' : 'speaker', 16)}<span>${need === 'speak' ? 'Je ne peux pas parler maintenant' : 'Je ne peux pas écouter maintenant'}</span></button></div>`
          );
          card.querySelector('.ss-cant').addEventListener('click', () => cant(need));
        }
        card.classList.add('enter');
        S.ui.animateRings(card);
      };
      if (old && !S.fx.reduced()) {
        old.classList.add('leave');
        setTimeout(mountNew, 230);
      } else mountNew();
    }

    /* Pause de 10 minutes pour les exercices d'écoute ou de micro : l'exercice en cours et ceux
       qui restent sont remplacés par une variante écrite (ou retirés pour la prononciation). */
    function cant(need) {
      S.store.state.settings[PAUSE_KEY[need]] = Date.now() + PAUSE_MS;
      S.store.save();
      S.audio.stop();
      if (need === 'speak') S.audio.stopListening();
      S.ui.toast({
        icon: need === 'speak' ? 'mic' : 'speaker',
        title: need === 'speak' ? 'Micro en pause' : 'Écoute en pause',
        text: `Plus d’exercices ${need === 'speak' ? 'de prononciation' : 'd’écoute'} pendant 10 minutes.`,
      });
      const swap = (it) => {
        const alt = noAudioAlt(it);
        if (alt) {
          alt.orig = it.orig;
          alt.tries = it.tries;
          if (it.graded && !alt.graded) st.graded--;
          if (!it.graded && alt.graded) st.graded++;
        } else {
          // Exercice retiré : il ne compte plus ni dans la progression ni dans la précision
          st.total = Math.max(1, st.total - 1);
          if (it.graded && it.tries === 0) st.graded = Math.max(0, st.graded - 1);
        }
        return alt;
      };
      st.queue = st.queue.map((it) => (NEEDS[it.type] === need ? swap(it) : it)).filter(Boolean);
      const item = st.cur;
      if (st.phase !== 'answer' || !item || NEEDS[item.type] !== need) {
        const row = stage.querySelector('.ss-cant-row');
        if (row) row.remove();
        return setProgress();
      }
      if (item._skip) item._skip();
      const alt = swap(item);
      setProgress();
      if (alt) show(alt);
      else next();
    }

    function next() {
      S.audio.stop();
      if (!st.queue.length) return finish();
      show(st.queue.shift());
    }

    function onResult(r) {
      const item = st.cur;
      st.phase = 'feedback';
      (item.words || []).forEach((w) => st.words.add(w));
      if (item.auto) {
        (item.weak || []).forEach((w) => st.weak.add(w));
        st.doneSet.add(item.orig);
        setProgress();
        S.audio.sfx.correct();
        return setTimeout(next, 250);
      }
      if (!item.graded) {
        st.doneSet.add(item.orig);
        setProgress();
        return next();
      }
      const first = item.tries === 0;
      item.tries++;
      if (r.ok) {
        if (first && !r.skipped) st.firstOk++;
        if (!r.skipped) {
          st.combo++;
          st.maxCombo = Math.max(st.maxCombo, st.combo);
        }
        st.doneSet.add(item.orig);
      } else {
        st.mistakes++;
        st.combo = 0;
        (item.words || []).forEach((w) => st.weak.add(w));
        if (item.tries < 2 && item.clone) {
          const again = item.clone();
          again.orig = item.orig;
          again.tries = item.tries;
          st.queue.push(again);
        } else st.doneSet.add(item.orig);
      }
      S.store.recordAnswer(r.ok);
      setProgress();
      renderCombo();
      feedback(r);
    }

    function renderCombo() {
      if (st.combo >= 3) {
        comboEl.innerHTML = `<span class="combo-badge">${icon('flame', 18)}<b>×${st.combo}</b></span>`;
        comboEl.firstElementChild.classList.add('a-pop');
        if ([3, 5, 10, 15, 20].includes(st.combo)) {
          S.audio.sfx.combo(st.combo);
          S.fx.floatText(`Combo ×${st.combo} !`, comboEl, 'xp');
        }
      } else comboEl.innerHTML = '';
    }

    function feedback(r) {
      const ok = r.ok;
      const cheers = S.data.cheers;
      const k = Math.floor(Math.random() * cheers.ok.length);
      const kk = Math.floor(Math.random() * cheers.ko.length);
      const title = r.skipped ? 'Pas de souci' : ok ? (r.soft ? 'Presque parfait !' : `${cheers.ok[k]}`) : cheers.ko[kk];
      const sub = r.skipped ? 'On continue.' : ok ? (r.soft ? '' : cheers.okFr[k]) : cheers.koFr[kk];
      fb.innerHTML = `
        <div class="fb-inner">
          <div class="fb-bird">${mascot(ok ? 'happy' : 'sad', 86)}</div>
          <div class="fb-txt">
            <div class="fb-title">${icon(ok ? 'check' : 'x', 24)}<span class="pl">${esc(title)}</span><span class="fb-sub">${esc(sub)}</span></div>
            ${!ok || r.soft ? `<div class="fb-answer"><span class="muted">${ok ? 'Forme exacte' : 'Bonne réponse'} :</span> ${r.answer || ''} ${r.say ? say(r.say) : ''}</div>` : r.answer ? `<div class="fb-answer">${r.answer} ${r.say ? say(r.say) : ''}</div>` : ''}
            ${r.sub ? `<div class="fb-sub2">${r.sub}</div>` : ''}
            ${r.note ? `<div class="fb-note">${icon('bulb', 16)}<span>${r.note}</span></div>` : ''}
          </div>
          <button type="button" class="btn btn-lg fb-next ${ok ? 'btn-green' : 'btn-danger'}">Continuer <span class="kbd-hint">Entrée</span></button>
        </div>`;
      fb.className = `ss-feedback show ${ok ? 'ok' : 'ko'}`;
      checkBtn.hidden = true;
      skipBtn.hidden = true;
      if (ok) {
        S.audio.sfx.correct();
        if (!r.skipped) S.fx.burst(fb.querySelector('.fb-title .ic') || fb, 22, 7);
      } else {
        S.audio.sfx.wrong();
        S.fx.shake(stage.firstElementChild);
      }
      if (r.say && ok) setTimeout(() => S.store.state.settings.autoplay && S.audio.speak(r.say), 250);
      const nb = fb.querySelector('.fb-next');
      nb.addEventListener('click', () => {
        checkBtn.hidden = false;
        next();
      });
      setTimeout(() => nb.focus({ preventScroll: true }), 50);
    }

    checkBtn.addEventListener('click', () => {
      if (checkBtn.disabled || st.phase !== 'answer') return;
      const item = st.cur;
      if (!item.graded) return onResult({ ok: true });
      const r = item.check();
      onResult(r);
    });
    skipBtn.addEventListener('click', () => {
      const item = st.cur;
      if (item && item._skip) item._skip();
      onResult(Object.assign(item.check(), { ok: true, skipped: true }));
    });

    const onKey = (e) => {
      if (!active) return;
      if ($('#modals').children.length) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        return askClose();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (st.phase === 'feedback') {
          const nb = fb.querySelector('.fb-next');
          if (nb) nb.click();
        } else if (st.phase === 'answer' && !checkBtn.disabled && !checkBtn.hidden) checkBtn.click();
        return;
      }
      if (st.phase === 'answer' && st.cur && st.cur.onKey) {
        const typing = e.target.matches && e.target.matches('input');
        if (typing && e.key !== 'Tab') return;
        st.cur.onKey(e);
      }
    };
    document.addEventListener('keydown', onKey);

    async function askClose() {
      if (st.phase === 'done') return close();
      const ok = await S.ui.modal({
        title: 'Quitter la séance ?',
        art: mascot('sad', 110),
        body: '<p class="center">Ta progression dans cette séance sera perdue.</p>',
        actions: [{ label: 'Continuer', value: false, cls: 'btn-green' }, { label: 'Quitter', value: true, cls: 'btn-soft' }],
      });
      if (ok) close();
    }
    root.querySelector('.ss-close').addEventListener('click', askClose);

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
        active = null;
        S.router.refresh();
      }, 480);
    }

    function finish() {
      st.phase = 'done';
      const time = Date.now() - st.start;
      const acc = st.graded ? st.firstOk / st.graded : 1;
      const result = { acc, mistakes: st.mistakes, time, maxCombo: st.maxCombo, words: Array.from(st.words), weak: Array.from(st.weak) };
      const extra = opts.onFinish ? opts.onFinish(result) || {} : {};
      results(root, Object.assign(result, extra), opts, close);
    }

    active = { root, close };
    setProgress();
    setTimeout(next, 380);
  }

  /* ───────────── Écran de fin ───────────── */
  function results(root, r, opts, close) {
    const stars = r.stars != null ? r.stars : r.acc >= 0.95 ? 3 : r.acc >= 0.75 ? 2 : 1;
    const perfect = r.mistakes === 0;
    const pct = Math.round(r.acc * 100);
    const title = perfect ? 'Bezbłędnie!' : pct >= 75 ? 'Brawo!' : 'Dobra robota!';
    const titleFr = perfect ? 'Sans aucune faute !' : pct >= 75 ? 'Bravo !' : 'Bon travail !';
    const wordsHTML = (r.words || [])
      .map((id) => C.wordById[id])
      .filter(Boolean)
      .slice(0, 12)
      .map((w, i) => `<span class="chip res-word" style="--i:${i}"><span class="emoji">${w.e || ''}</span><span class="pl">${esc(w.pl)}</span></span>`)
      .join('');
    root.querySelector('.ss-combo').innerHTML = '';
    root.querySelector('.ss-bar-fill').style.width = '100%';
    root.querySelector('.ss-feedback').className = 'ss-feedback';
    root.querySelector('.ss-foot').remove();
    const stageWrap = root.querySelector('.ss-stage-wrap');
    stageWrap.innerHTML = `
      <div class="results">
        <div class="res-art">
          ${S.ui.orn.rosette({ petals: 14, colors: ['var(--c-acc)', 'var(--yellow)', 'var(--green)'], cls: 'bloom res-rosette' })}
          ${mascot('cheer', 170)}
        </div>
        <h1 class="res-title display">${S.fx.letters(title)}</h1>
        <p class="res-sub">${esc(titleFr)} ${opts.doneLabel ? '— ' + esc(opts.doneLabel) : ''}</p>
        <div class="res-stars">${[0, 1, 2].map((i) => `<span class="res-star ${i < stars ? 'on' : ''}" style="--i:${i}">${icon('star', 44)}</span>`).join('')}</div>
        <div class="res-stats">
          <div class="res-stat c-orange" style="--i:0"><span class="rs-k">XP</span><b class="rs-v" data-to="${r.xp || 0}" data-pre="+">0</b></div>
          <div class="res-stat c-green" style="--i:1"><span class="rs-k">Précision</span><b class="rs-v" data-to="${pct}" data-suf=" %">0</b></div>
          <div class="res-stat c-blue" style="--i:2"><span class="rs-k">Temps</span><b class="rs-v">${fmtTime(r.time)}</b></div>
          <div class="res-stat c-red" style="--i:3"><span class="rs-k">Combo max</span><b class="rs-v" data-to="${r.maxCombo || 0}" data-pre="×">0</b></div>
        </div>
        ${wordsHTML ? `<div class="res-words"><div class="eyebrow">Mots travaillés</div><div class="res-words-list">${wordsHTML}</div></div>` : ''}
        ${r.extraHTML || ''}
        <div class="res-actions">
          ${opts.again ? `<button type="button" class="btn btn-soft btn-lg res-again">${icon('refresh', 20)}<span>Recommencer</span></button>` : ''}
          <button type="button" class="btn btn-lg btn-primary res-done" data-magnet>Continuer ${icon('arrowR', 20)}</button>
        </div>
      </div>`;
    const res = stageWrap.querySelector('.results');
    S.audio.sfx.complete();
    setTimeout(() => S.fx.cannons(perfect ? 90 : 60), 250);
    // Étoiles une à une
    res.querySelectorAll('.res-star.on').forEach((s, i) =>
      setTimeout(() => {
        s.classList.add('lit');
        S.audio.sfx.star(i);
        S.fx.burst(s, 16, 6);
      }, 900 + i * 380)
    );
    res.querySelectorAll('.rs-v[data-to]').forEach((el, i) =>
      setTimeout(() => S.fx.countUp(el, +el.dataset.to, 1000, 0, (v) => `${el.dataset.pre || ''}${Math.round(v)}${el.dataset.suf || ''}`), 1100 + i * 150)
    );
    if (r.xp) setTimeout(() => S.fx.floatText(`+${r.xp} XP`, res.querySelector('.res-stat'), 'xp'), 1400);
    const done = res.querySelector('.res-done');
    done.addEventListener('click', () => {
      close();
      if (opts.after) setTimeout(opts.after, 520);
    });
    const again = res.querySelector('.res-again');
    if (again) again.addEventListener('click', () => {
      close();
      setTimeout(opts.again, 560);
    });
    setTimeout(() => done.focus({ preventScroll: true }), 600);
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        document.removeEventListener('keydown', onKey);
        done.click();
      }
    };
    setTimeout(() => document.addEventListener('keydown', onKey), 700);
  }

  /* ───────────── Points d'entrée ───────────── */
  function startNode(node, from) {
    if (!node) return;
    const isCh = node.kind === 'challenge';
    const u = node.unit;
    const items = isCh ? challengeItems(u) : lessonItems(node);
    open({
      items, from, color: u.color,
      titleHTML: `<span class="pl">${esc(isCh ? 'Wyzwanie' : node.pl)}</span><span class="muted"> · ${esc(isCh ? 'Défi de l’unité ' + u.num : node.fr)}</span>`,
      doneLabel: isCh ? `Unité ${u.num} validée` : node.fr,
      onFinish(r) {
        const perfect = r.mistakes === 0;
        r.xp = (isCh ? 20 : 10) + (perfect ? 5 : 0);
        const out = S.store.completeLesson(node.id, r);
        const nextN = C.nextNode();
        return {
          stars: out.stars,
          extraHTML: isCh && out.first ? `<div class="callout tip res-callout"><span class="emoji">🎉</span><p>Unité ${u.num} terminée ! ${C.units[u.index + 1] ? `L’unité ${u.num + 1} — <strong class="pl">${esc(C.units[u.index + 1].pl)}</strong> — est débloquée.` : 'Tu as terminé tout le parcours. Gratulacje!'}</p></div>` : '',
          next: nextN,
        };
      },
      again: () => startNode(node),
      after: () => {
        if (location.hash !== '#/path') S.router.go('path');
      },
    });
  }

  /* subset : liste de mots à travailler (révision « à la carte »), label : son nom affiché. */
  function startPractice(from, subset, label) {
    const items = practiceItems(subset ? 18 : 12, subset);
    if (!items) {
      S.ui.toast({ emoji: '🌱', title: 'Pas encore assez de mots', text: subset ? 'Choisis des étapes contenant au moins 2 mots appris.' : 'Termine au moins une leçon pour débloquer l’entraînement ciblé.' });
      return;
    }
    open({
      items, from, color: subset ? 'blue' : 'green',
      titleHTML: `<span class="pl">Trening</span><span class="muted"> · ${esc(label || 'Entraînement ciblé')}</span>`,
      doneLabel: label || 'Entraînement ciblé',
      onFinish(r) {
        r.xp = Math.max(5, Math.round(r.acc * 12));
        S.store.addXP(r.xp, 'practice');
        // Les réponses renforcent aussi la mémoire des mots
        r.words.forEach((id) => S.store.state.cards[id] && !r.weak.includes(id) && S.store.reviewCard(id, 3));
        r.weak.forEach((id) => S.store.state.cards[id] && S.store.reviewCard(id, 1));
        S.store.checkAchievements();
        return {};
      },
      again: () => startPractice(null, subset, label),
    });
  }

  /* Enregistre le type + paramètres pour pouvoir recréer chaque exercice. */
  Object.keys(E).forEach((k) => {
    if (typeof E[k] !== 'function' || ['checkTyped', 'plKeyboard', 'wireKeyboard', 'diffHTML'].includes(k)) return;
    const f = E[k];
    E[k] = function (...args) {
      const it = f(...args);
      it._spec = [k, args];
      it.clone = function () {
        const c = f(...args);
        c._spec = it._spec;
        c.clone = it.clone;
        return c;
      };
      return it;
    };
  });

  S.session = { open, startNode, startPractice, lessonItems, challengeItems, practiceItems, spread, get active() { return active; } };
})();
