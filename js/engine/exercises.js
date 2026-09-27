/* Słowik — types d'exercices. Chaque fabrique renvoie { type, graded, words, mount(stage, api), check(), onKey? }.
   api : { ready(bool), complete(ok), color }. */
(function () {
  'use strict';
  const { esc, shuffle, sample, pick, norm, strip, lev, frTypo, uniq } = S.util;
  const { icon, say, plWord, hint, glossy, genderChip, mascot } = S.ui;
  const C = S.content;

  const autoplay = () => S.store.state.settings.autoplay;
  const speakSoon = (text, delay = 350, opts) => setTimeout(() => autoplay() && S.audio.speak(text, opts), delay);
  const variants = (pl) => String(pl).split(/\s*\/\s*/).filter(Boolean);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const head = (ic, label, title, cls = '') => `
    <div class="ex-head ${cls}">
      <div class="ex-label">${icon(ic, 16)}<span>${label}</span></div>
      <h2 class="ex-title">${title}</h2>
    </div>`;

  /* Distracteurs : mots d'autres leçons, en évitant les doublons de sens. */
  function distractors(w, pool, n, key) {
    const seen = new Set([norm(w[key])]);
    const out = [];
    shuffle(pool).forEach((x) => {
      if (out.length >= n || x.id === w.id) return;
      const k = norm(x[key]);
      if (seen.has(k)) return;
      seen.add(k);
      out.push(x);
    });
    return out;
  }

  /* Vérification d'une réponse écrite en polonais : exacte, sans accents, ou faute de frappe. */
  function checkTyped(input, answers) {
    const u = norm(input);
    if (!u) return { ok: false, empty: true };
    for (const a of answers) if (norm(a) === u) return { ok: true, exact: true, best: a };
    for (const a of answers) {
      if (strip(norm(a)) === strip(u)) return { ok: true, soft: 'accents', best: a };
    }
    let best = answers[0];
    let bd = 99;
    answers.forEach((a) => {
      const d = lev(strip(norm(a)), strip(u));
      if (d < bd) {
        bd = d;
        best = a;
      }
    });
    const tol = norm(best).length >= 12 ? 2 : norm(best).length >= 5 ? 1 : 0;
    if (bd <= tol) return { ok: true, soft: 'typo', best };
    return { ok: false, best };
  }
  /* Surligne les différences entre la réponse et la forme attendue. */
  function diffHTML(user, target) {
    const a = norm(target);
    const b = norm(user);
    let i = 0;
    while (i < a.length && i < b.length && strip(a[i]) === strip(b[i]) && a[i] === b[i]) i++;
    return esc(a.slice(0, i)) + `<mark>${esc(a.slice(i, i + 1))}</mark>` + esc(a.slice(i + 1));
  }

  /* Clavier des lettres polonaises. */
  const PL_KEYS = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];
  function plKeyboard() {
    return `<div class="pl-keys">${PL_KEYS.map((k) => `<button type="button" class="pl-key" data-k="${k}" tabindex="-1">${k}</button>`).join('')}</div>`;
  }
  function wireKeyboard(root, input) {
    root.querySelectorAll('.pl-key').forEach((b) =>
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const k = b.dataset.k;
        const s = input.selectionStart ?? input.value.length;
        const t = input.selectionEnd ?? input.value.length;
        input.value = input.value.slice(0, s) + k + input.value.slice(t);
        input.setSelectionRange(s + 1, s + 1);
        input.dispatchEvent(new Event('input'));
        input.focus();
        S.audio.sfx.tap();
        S.fx.pop(b, 1.25);
      })
    );
  }

  const E = {};

  /* ───────────── Nouveau mot ───────────── */
  E.intro = (w) => ({
    type: 'intro', graded: false, words: [w.id],
    mount(stage, api) {
      const ex = w.ex;
      stage.innerHTML = `
        <div class="ex ex-intro">
          <div class="ex-label new">${icon('sparkles', 16)}<span>Nouveau mot</span></div>
          <div class="intro-card">
            <div class="intro-medal medallion a-pop" style="--sz:112px;--c:var(--c-acc)"><span class="emoji">${w.e || '✨'}</span></div>
            <div class="intro-word">${S.fx.letters(w.pl, 'ltr')}</div>
            <div class="intro-hint a-rise" style="--d:350ms">${hint(w)}</div>
            <div class="intro-fr a-rise" style="--d:450ms">${frTypo(esc(w.fr))} ${genderChip(w.g)}</div>
            <div class="intro-say a-rise" style="--d:550ms">${say(w.pl, { big: true })}${say(w.pl, { big: true, slow: true })}</div>
            ${ex ? `<div class="intro-ex a-rise" style="--d:680ms">${say(ex[0])}<div><div class="pl">${glossy(ex[0])}</div><div class="muted small">${frTypo(esc(ex[1]))}</div></div></div>` : ''}
            ${w.note ? `<div class="callout tip a-rise" style="--d:800ms"><span class="emoji">💡</span><p>${S.util.fmt(w.note)}</p></div>` : ''}
          </div>
        </div>`;
      speakSoon(w.pl, 420);
      api.ready(true);
    },
    check: () => ({ ok: true }),
  });

  /* ───────────── QCM (pl → fr ou fr → pl) ───────────── */
  E.choice = (w, dir, pool) => {
    const key = dir === 'pl-fr' ? 'fr' : 'pl';
    const opts = shuffle([w].concat(distractors(w, pool, 3, key)));
    let sel = -1;
    return {
      type: 'choice', graded: true, words: [w.id],
      mount(stage, api) {
        const prompt =
          dir === 'pl-fr'
            ? `<div class="prompt-word">${say(w.pl)}<span class="big-pl">${plWord(w)}</span></div>`
            : `<div class="prompt-word"><span class="emoji prompt-emoji">${w.e || ''}</span><span class="big-fr">« ${frTypo(esc(w.fr))} »</span></div>`;
        stage.innerHTML = `
          <div class="ex ex-choice">
            ${head('target', dir === 'pl-fr' ? 'Traduis' : 'Choisis le bon mot', dir === 'pl-fr' ? 'Que signifie ce mot ?' : 'Comment dit-on en polonais…')}
            ${prompt}
            <div class="options stagger-pop">
              ${opts
                .map(
                  (o, i) => `<button type="button" class="opt" data-i="${i}" style="--i:${i}">
                    <span class="kbd">${i + 1}</span>
                    ${dir === 'pl-fr' ? `<span class="emoji opt-emoji">${o.e || ''}</span><span class="opt-txt">${frTypo(esc(o.fr))}</span>` : `<span class="opt-txt pl">${esc(o.pl)}</span>`}
                  </button>`
                )
                .join('')}
            </div>
          </div>`;
        const btns = stage.querySelectorAll('.opt');
        const choose = (i) => {
          sel = i;
          btns.forEach((b, j) => b.classList.toggle('sel', j === i));
          S.audio.sfx.select();
          S.fx.pop(btns[i], 1.05);
          if (dir === 'fr-pl') S.audio.speak(opts[i].pl);
          api.ready(true);
        };
        btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
        this._choose = choose;
        this._btns = btns;
        if (dir === 'pl-fr') speakSoon(w.pl, 300);
      },
      onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length) this._choose(n - 1);
      },
      check() {
        const ok = opts[sel] && opts[sel].id === w.id;
        const good = opts.findIndex((o) => o.id === w.id);
        this._btns.forEach((b, j) => {
          b.disabled = true;
          if (j === good) b.classList.add('ok');
          else if (j === sel) b.classList.add('ko');
        });
        return { ok, answer: dir === 'pl-fr' ? `<span class="pl">${esc(w.pl)}</span> = ${frTypo(esc(w.fr))}` : `<span class="pl">${esc(w.pl)}</span>`, say: w.pl };
      },
    };
  };

  /* ───────────── Écoute et choisis ───────────── */
  E.listen = (w, pool) => {
    const opts = shuffle([w].concat(distractors(w, pool, 3, 'pl')));
    let sel = -1;
    return {
      type: 'listen', graded: true, words: [w.id],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-listen">
            ${head('ear', 'Écoute', 'Quel mot entends-tu ?')}
            <div class="listen-box">${say(w.pl, { big: true })}${say(w.pl, { big: true, slow: true })}</div>
            <div class="options stagger-pop">
              ${opts.map((o, i) => `<button type="button" class="opt" data-i="${i}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt pl">${esc(o.pl)}</span></button>`).join('')}
            </div>
          </div>`;
        const btns = stage.querySelectorAll('.opt');
        const choose = (i) => {
          sel = i;
          btns.forEach((b, j) => b.classList.toggle('sel', j === i));
          S.audio.sfx.select();
          S.fx.pop(btns[i], 1.05);
          api.ready(true);
        };
        btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
        this._choose = choose;
        this._btns = btns;
        setTimeout(() => S.audio.speak(w.pl), 350);
      },
      onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length) this._choose(n - 1);
        if (e.key === ' ') {
          e.preventDefault();
          S.audio.speak(w.pl);
        }
      },
      check() {
        const good = opts.findIndex((o) => o.id === w.id);
        this._btns.forEach((b, j) => {
          b.disabled = true;
          if (j === good) b.classList.add('ok');
          else if (j === sel) b.classList.add('ko');
        });
        return { ok: sel === good, answer: `<span class="pl">${esc(w.pl)}</span> = ${frTypo(esc(w.fr))}`, say: w.pl };
      },
    };
  };

  /* ───────────── Associer les paires ───────────── */
  E.match = (words) => {
    const list = words.slice(0, 5);
    let mistakes = 0;
    return {
      type: 'match', graded: false, auto: true, words: list.map((w) => w.id),
      mount(stage, api) {
        const L = shuffle(list);
        const R = shuffle(list);
        stage.innerHTML = `
          <div class="ex ex-match">
            ${head('puzzle', 'Associe', 'Relie chaque mot à sa traduction')}
            <div class="match-grid">
              <div class="match-col stagger-pop">${L.map((w, i) => `<button type="button" class="opt m-l" data-id="${w.id}" style="--i:${i}"><span class="opt-txt pl">${esc(w.pl)}</span></button>`).join('')}</div>
              <div class="match-col stagger-pop" style="--d0:120ms">${R.map((w, i) => `<button type="button" class="opt m-r" data-id="${w.id}" style="--i:${i}"><span class="emoji opt-emoji">${w.e || ''}</span><span class="opt-txt">${frTypo(esc(w.fr))}</span></button>`).join('')}</div>
            </div>
          </div>`;
        let left = null;
        let right = null;
        let done = 0;
        const reset = () => {
          stage.querySelectorAll('.opt.sel').forEach((b) => b.classList.remove('sel'));
          left = right = null;
        };
        const tryPair = () => {
          if (!left || !right) return;
          const a = left;
          const b = right;
          if (a.dataset.id === b.dataset.id) {
            S.audio.sfx.match();
            [a, b].forEach((x) => {
              x.classList.remove('sel');
              x.classList.add('ok', 'done');
              x.disabled = true;
              S.fx.pop(x, 1.08);
            });
            done++;
            left = right = null;
            if (done === list.length) {
              setTimeout(() => api.complete(true, mistakes), 450);
            }
          } else {
            mistakes++;
            this.weak = (this.weak || []).concat([a.dataset.id, b.dataset.id]);
            S.audio.sfx.wrong();
            [a, b].forEach((x) => {
              x.classList.add('ko');
              S.fx.shake(x);
              setTimeout(() => x.classList.remove('ko'), 500);
            });
            reset();
          }
        };
        stage.querySelectorAll('.m-l').forEach((b) =>
          b.addEventListener('click', () => {
            stage.querySelectorAll('.m-l.sel').forEach((x) => x.classList.remove('sel'));
            b.classList.add('sel');
            left = b;
            S.audio.speak(C.wordById[b.dataset.id].pl);
            tryPair();
          })
        );
        stage.querySelectorAll('.m-r').forEach((b) =>
          b.addEventListener('click', () => {
            stage.querySelectorAll('.m-r.sel').forEach((x) => x.classList.remove('sel'));
            b.classList.add('sel');
            right = b;
            S.audio.sfx.select();
            tryPair();
          })
        );
        api.ready(false);
      },
      check: () => ({ ok: true }),
    };
  };

  /* ───────────── Construire une phrase avec des tuiles ───────────── */
  E.build = (s, dir, unit) => {
    const toPl = dir === 'fr-pl';
    const target = toPl ? s.pl : s.fr;
    const answers = [target].concat(toPl ? s.plAlt || [] : s.frAlt || []);
    const correct = C.tokens(target);
    const normSet = new Set(correct.map((t) => norm(t)));
    const others = [];
    const units = [unit, C.units[unit.index - 1], C.units[unit.index + 1]].filter(Boolean);
    units.forEach((u) => u.sentences.forEach((x) => x !== s && others.push(...C.tokens(toPl ? x.pl : x.fr))));
    const extra = sample(uniq(others.filter((t) => !normSet.has(norm(t)))), correct.length <= 3 ? 2 : 3);
    const tiles = shuffle(correct.concat(extra)).map((t, i) => ({ t, i }));
    let placed = [];
    return {
      type: 'build', graded: true, words: [],
      mount(stage, api) {
        const prompt = toPl
          ? `<div class="bubble"><span>${frTypo(esc(s.fr))}</span></div>`
          : `<div class="bubble">${say(s.pl)}<span class="pl">${glossy(s.pl)}</span></div>`;
        stage.innerHTML = `
          <div class="ex ex-build">
            ${head('type', toPl ? 'Traduis en polonais' : 'Traduis en français', toPl ? 'Construis la phrase en polonais' : 'Que signifie cette phrase ?')}
            <div class="build-prompt">${mascot('idle', 92)}${prompt}</div>
            <div class="build-answer" aria-label="Ta réponse"></div>
            <div class="build-bank stagger-pop">
              ${tiles.map((x, k) => `<span class="slot" style="--i:${k}"><button type="button" class="tile ${toPl ? 'pl-tile' : ''}" data-i="${x.i}">${esc(x.t)}</button></span>`).join('')}
            </div>
          </div>`;
        const ans = stage.querySelector('.build-answer');
        const bank = stage.querySelector('.build-bank');
        const sync = () => api.ready(placed.length > 0);
        const addTile = async (btn) => {
          if (btn.classList.contains('used')) return;
          const i = +btn.dataset.i;
          const t = tiles.find((x) => x.i === i);
          placed.push(i);
          const nb = document.createElement('button');
          nb.type = 'button';
          nb.className = 'tile placed' + (toPl ? ' pl-tile' : '');
          nb.dataset.i = i;
          nb.textContent = t.t;
          nb.style.visibility = 'hidden';
          ans.appendChild(nb);
          btn.classList.add('used');
          S.audio.sfx.tap();
          if (toPl) S.audio.speak(t.t, { rate: 1.05 });
          await S.fx.fly(btn, nb, { duration: 360 });
          nb.style.visibility = '';
          sync();
        };
        const removeTile = async (nb) => {
          const i = +nb.dataset.i;
          const src = bank.querySelector(`.tile[data-i="${i}"]`);
          placed = placed.filter((x) => x !== i);
          const siblings = Array.from(ans.children).filter((x) => x !== nb);
          S.audio.sfx.tap();
          const fly = S.fx.fly(nb, src, { duration: 320, arc: 30 });
          nb.style.visibility = 'hidden';
          S.fx.flip(siblings, () => nb.remove(), { duration: 300 });
          await fly;
          src.classList.remove('used');
          S.fx.pop(src, 1.06);
          sync();
        };
        bank.addEventListener('click', (e) => {
          const b = e.target.closest('.tile');
          if (b && !this._locked) addTile(b);
        });
        ans.addEventListener('click', (e) => {
          const b = e.target.closest('.tile');
          if (b && !this._locked) removeTile(b);
        });
        this._undo = () => {
          const last = ans.lastElementChild;
          if (last) removeTile(last);
        };
        this._stage = stage;
        if (!toPl) speakSoon(s.pl, 400);
        api.ready(false);
      },
      onKey(e) {
        if (e.key === 'Backspace') this._undo && this._undo();
      },
      check() {
        this._locked = true;
        const user = placed.map((i) => tiles.find((x) => x.i === i).t).join(' ');
        const ok = answers.some((a) => norm(a) === norm(user));
        const ansEl = this._stage.querySelector('.build-answer');
        ansEl.classList.add(ok ? 'ok' : 'ko');
        if (ok) Array.from(ansEl.children).forEach((t, k) => t.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'none' }], { duration: 380, delay: k * 50, easing: 'ease-out' }));
        return {
          ok,
          answer: toPl ? `<span class="pl">${esc(s.pl)}</span>` : frTypo(esc(s.fr)),
          sub: toPl ? frTypo(esc(s.fr)) : `<span class="pl">${esc(s.pl)}</span>`,
          note: s.note,
          say: s.pl,
        };
      },
    };
  };

  /* ───────────── Écrire le mot en polonais ───────────── */
  E.type = (w) => {
    const answers = variants(w.pl).concat(w.plAlt || []);
    return {
      type: 'type', graded: true, words: [w.id],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-type">
            ${head('keyboard', 'Écris', 'Écris en polonais')}
            <div class="prompt-word"><span class="emoji prompt-emoji">${w.e || ''}</span><span class="big-fr">« ${frTypo(esc(w.fr))} »</span></div>
            <div class="type-box">
              <input class="input type-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Tape ta réponse…" aria-label="Ta réponse en polonais">
              ${plKeyboard()}
              <p class="tiny muted center">Astuce : si tu n’as pas de clavier polonais, les lettres sans signes sont acceptées (avec une petite remarque).</p>
            </div>
          </div>`;
        const inp = stage.querySelector('.type-input');
        wireKeyboard(stage, inp);
        inp.addEventListener('input', () => api.ready(inp.value.trim().length > 0));
        setTimeout(() => inp.focus(), 380);
        this._inp = inp;
        api.ready(false);
      },
      check() {
        this._inp.disabled = true;
        const r = checkTyped(this._inp.value, answers);
        this._inp.classList.add(r.ok ? 'ok' : 'ko');
        let note = '';
        if (r.soft === 'accents') note = `Attention aux signes : on écrit <span class="pl">${esc(r.best)}</span>.`;
        else if (r.soft === 'typo') note = `Petite faute de frappe : <span class="pl diff">${diffHTML(this._inp.value, r.best)}</span>`;
        return { ok: r.ok, soft: !!r.soft, answer: `<span class="pl">${esc(w.pl)}</span>`, note, say: variants(w.pl)[0] };
      },
    };
  };

  /* ───────────── Traduire une phrase par écrit (défis) ───────────── */
  E.typeSentence = (s) => {
    const answers = [s.pl].concat(s.plAlt || []);
    return {
      type: 'type', graded: true, words: [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-type">
            ${head('keyboard', 'Écris', 'Traduis cette phrase en polonais')}
            <div class="build-prompt">${mascot('think', 92)}<div class="bubble"><span>${frTypo(esc(s.fr))}</span></div></div>
            <div class="type-box">
              <input class="input type-input" type="text" autocomplete="off" spellcheck="false" placeholder="Écris en polonais…" aria-label="Ta traduction">
              ${plKeyboard()}
            </div>
          </div>`;
        const inp = stage.querySelector('.type-input');
        wireKeyboard(stage, inp);
        inp.addEventListener('input', () => api.ready(inp.value.trim().length > 0));
        setTimeout(() => inp.focus(), 380);
        this._inp = inp;
        api.ready(false);
      },
      check() {
        this._inp.disabled = true;
        const r = checkTyped(this._inp.value, answers);
        this._inp.classList.add(r.ok ? 'ok' : 'ko');
        const note = r.soft === 'accents' ? 'Attention aux signes diacritiques !' : r.soft === 'typo' ? `Presque parfait : <span class="pl diff">${diffHTML(this._inp.value, r.best)}</span>` : s.note;
        return { ok: r.ok, soft: !!r.soft, answer: `<span class="pl">${esc(s.pl)}</span>`, note, say: s.pl };
      },
    };
  };

  /* ───────────── Dictée ───────────── */
  E.dictation = (s) => {
    const answers = [s.pl].concat(s.plAlt || []);
    return {
      type: 'dictation', graded: true, words: [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-dict">
            ${head('ear', 'Dictée', 'Écris ce que tu entends')}
            <div class="listen-box">${say(s.pl, { big: true })}${say(s.pl, { big: true, slow: true })}</div>
            <div class="type-box">
              <input class="input type-input" type="text" autocomplete="off" spellcheck="false" placeholder="Écris en polonais…" aria-label="Dictée">
              ${plKeyboard()}
            </div>
          </div>`;
        const inp = stage.querySelector('.type-input');
        wireKeyboard(stage, inp);
        inp.addEventListener('input', () => api.ready(inp.value.trim().length > 0));
        setTimeout(() => {
          S.audio.speak(s.pl);
          inp.focus();
        }, 400);
        this._inp = inp;
        api.ready(false);
      },
      onKey(e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          S.audio.speak(s.pl, { slow: e.shiftKey });
        }
      },
      check() {
        this._inp.disabled = true;
        const r = checkTyped(this._inp.value, answers);
        this._inp.classList.add(r.ok ? 'ok' : 'ko');
        const note = r.soft === 'accents' ? 'Attention aux signes diacritiques !' : r.soft === 'typo' ? `Presque : <span class="pl diff">${diffHTML(this._inp.value, r.best)}</span>` : '';
        return { ok: r.ok, soft: !!r.soft, answer: `<span class="pl">${esc(s.pl)}</span>`, sub: frTypo(esc(s.fr)), note, say: s.pl };
      },
    };
  };

  /* ───────────── Texte à trous (cas, accords, conjugaisons) ───────────── */
  E.cloze = (c) => {
    const opts = shuffle([c.a].concat(c.o.slice(0, 3)));
    let sel = -1;
    const full = c.s.replace('___', c.a);
    return {
      type: 'cloze', graded: true, words: [],
      mount(stage, api) {
        const [before, after] = c.s.split('___');
        stage.innerHTML = `
          <div class="ex ex-cloze">
            ${head('puzzle', 'Complète', 'Choisis la bonne forme')}
            <div class="cloze-sentence pl">${esc(before)}<span class="gap" data-hint="${esc(c.hint || '…')}"><span class="gap-in">${esc(c.hint || '…')}</span></span>${esc(after)}</div>
            <div class="cloze-fr muted">${frTypo(esc(c.fr))}</div>
            <div class="options chips-opts stagger-pop">
              ${opts.map((o, i) => `<button type="button" class="opt opt-chip" data-i="${i}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt pl">${esc(o)}</span></button>`).join('')}
            </div>
          </div>`;
        const gap = stage.querySelector('.gap');
        const gapIn = stage.querySelector('.gap-in');
        const btns = stage.querySelectorAll('.opt');
        const choose = (i) => {
          sel = i;
          btns.forEach((b, j) => b.classList.toggle('sel', j === i));
          gapIn.textContent = opts[i];
          gap.classList.add('filled');
          S.fx.pop(gap, 1.12);
          S.audio.sfx.select();
          api.ready(true);
        };
        btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
        this._choose = choose;
        this._btns = btns;
        this._gap = gap;
      },
      onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= opts.length) this._choose(n - 1);
      },
      check() {
        const ok = opts[sel] === c.a;
        this._btns.forEach((b, j) => {
          b.disabled = true;
          if (opts[j] === c.a) b.classList.add('ok');
          else if (j === sel) b.classList.add('ko');
        });
        this._gap.classList.add(ok ? 'ok' : 'ko');
        if (!ok) this._gap.querySelector('.gap-in').textContent = c.a;
        return { ok, answer: `<span class="pl">${esc(full)}</span>`, note: c.why || '', say: full };
      },
    };
  };

  /* ───────────── Genre du nom ───────────── */
  E.gender = (w) => {
    const G = [['m', 'Masculin', 'mój · ten'], ['f', 'Féminin', 'moja · ta'], ['n', 'Neutre', 'moje · to']];
    let sel = null;
    return {
      type: 'gender', graded: true, words: [w.id],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-gender">
            ${head('puzzle', 'Genre', 'Quel est le genre de ce nom ?')}
            <div class="prompt-word">${say(w.pl)}<span class="big-pl">${plWord(w)}</span></div>
            <div class="muted center">${frTypo(esc(w.fr))}</div>
            <div class="options g3opts stagger-pop">
              ${G.map((g, i) => `<button type="button" class="opt opt-g g-${g[0]}" data-g="${g[0]}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt"><b>${g[1]}</b><small class="pl">${g[2]}</small></span></button>`).join('')}
            </div>
          </div>`;
        const btns = stage.querySelectorAll('.opt');
        const choose = (i) => {
          sel = G[i][0];
          btns.forEach((b, j) => b.classList.toggle('sel', j === i));
          S.audio.sfx.select();
          api.ready(true);
        };
        btns.forEach((b, i) => b.addEventListener('click', () => choose(i)));
        this._choose = choose;
        this._btns = btns;
        speakSoon(w.pl, 300);
      },
      onKey(e) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 3) this._choose(n - 1);
      },
      check() {
        this._btns.forEach((b) => {
          b.disabled = true;
          if (b.dataset.g === w.g) b.classList.add('ok');
          else if (b.dataset.g === sel) b.classList.add('ko');
        });
        const name = { m: 'masculin', f: 'féminin', n: 'neutre' }[w.g];
        return { ok: sel === w.g, answer: `<span class="pl">${esc(w.pl)}</span> est ${name}`, say: w.pl };
      },
    };
  };

  /* ───────────── Prononcer (reconnaissance vocale) ───────────── */
  E.speak = (item) => {
    const text = variants(item.pl)[0];
    let result = null;
    let skipped = false;
    return {
      type: 'speak', graded: true, skippable: true, words: item.id && C.wordById[item.id] ? [item.id] : [],
      mount(stage, api) {
        stage.innerHTML = `
          <div class="ex ex-speak">
            ${head('mic', 'Prononce', 'Dis cette phrase à voix haute')}
            <div class="speak-target">${say(text)}<span class="pl">${glossy(text)}</span></div>
            <div class="muted center">${frTypo(esc(item.fr))}</div>
            <div class="center">${hint(text)}</div>
            <button type="button" class="mic-btn" aria-label="Parler">${icon('mic', 38)}<span class="mic-rings"><i></i><i></i><i></i></span></button>
            <div class="speak-status muted center">Appuie sur le micro, puis parle.</div>
            <div class="speak-heard"></div>
          </div>`;
        const mic = stage.querySelector('.mic-btn');
        const status = stage.querySelector('.speak-status');
        const heard = stage.querySelector('.speak-heard');
        let busy = false;
        mic.addEventListener('click', async () => {
          if (busy) {
            S.audio.stopListening();
            return;
          }
          busy = true;
          mic.classList.add('rec');
          status.textContent = 'Je t’écoute…';
          heard.innerHTML = '';
          const r = await S.audio.listen({ onInterim: (t) => (heard.innerHTML = `<span class="interim">${esc(t)}</span>`) });
          busy = false;
          mic.classList.remove('rec');
          if (!r.ok) {
            const msg = { 'not-allowed': 'Accès au micro refusé. Autorise-le dans ton navigateur, ou passe cet exercice.', 'no-speech': 'Je n’ai rien entendu. Réessaie !', network: 'La reconnaissance vocale nécessite internet.', unsupported: 'Ton navigateur ne gère pas la reconnaissance vocale.' }[r.error];
            status.textContent = msg || 'Je n’ai pas bien compris. Réessaie !';
            S.fx.shake(mic);
            return;
          }
          result = S.audio.bestCompare(text, r.alts);
          heard.innerHTML = `<div class="heard-words">${result.words.map((x) => `<span class="${x.ok ? 'ok' : 'ko'}">${esc(x.w)}</span>`).join(' ')}</div><div class="tiny muted">Entendu : « ${esc(result.text)} » · ${Math.round(result.score * 100)} %</div>`;
          status.textContent = result.score >= 0.7 ? 'Très bien ! Tu peux vérifier.' : 'Pas mal ! Réessaie ou vérifie.';
          if (result.score >= 0.7) S.fx.burst(mic, 24, 7);
          api.ready(true);
        });
        this._skip = () => {
          skipped = true;
          S.audio.stopListening();
        };
        api.ready(false);
      },
      check() {
        const ok = skipped || (result && result.score >= 0.7);
        if (ok && !skipped) S.store.bumpStat('speakOk');
        return { ok, skipped, answer: `<span class="pl">${esc(text)}</span>`, say: text, note: skipped ? 'Exercice passé.' : '' };
      },
    };
  };

  S.ex = E;
  S.ex.checkTyped = checkTyped;
  S.ex.plKeyboard = plKeyboard;
  S.ex.wireKeyboard = wireKeyboard;
  S.ex.diffHTML = diffHTML;
})();
