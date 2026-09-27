/* Słowik — laboratoire des sons : alphabet, chuintantes, paires minimales, virelangues, accent tonique. */
(function () {
  'use strict';
  const { esc, frTypo, shuffle, pick, sample, cvars } = S.util;
  const { icon, say, mascot, hint, glossy } = S.ui;
  const A = S.data.alphabet;
  const C = S.content;

  const TABS = [
    ['abc', 'Alphabet', 'type'],
    ['sib', 'Chuintantes', 'wave'],
    ['pairs', 'Paires minimales', 'ear'],
    ['stress', 'Accent tonique', 'target'],
    ['twist', 'Virelangues', 'sparkles'],
  ];

  /* Onglets avec pastille glissante (réutilisés ailleurs). */
  function tabs(items, active) {
    return `<div class="tabs" role="tablist"><span class="tab-thumb"></span>${items
      .map(([k, l, ic]) => `<button type="button" role="tab" data-tab="${k}" class="${k === active ? 'on' : ''}">${ic ? icon(ic, 18) : ''}<span>${l}</span></button>`)
      .join('')}</div>`;
  }
  function moveThumb(root) {
    const on = root.querySelector('.tabs button.on');
    const th = root.querySelector('.tab-thumb');
    if (!on || !th) return;
    th.style.width = on.offsetWidth + 'px';
    th.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  S.ui.tabs = tabs;
  S.ui.moveThumb = moveThumb;

  /* ───────────── Alphabet ───────────── */
  function abc(pane) {
    const heard = new Set(S.store.state.heard);
    const all = A.letters.map((x) => Object.assign({ kind: 'l' }, x)).concat(A.digraphs.map((x) => Object.assign({ kind: 'd' }, x)));
    const tile = (x, i) => `
      <button type="button" class="letter ${x.special ? 'special' : ''} ${x.kind === 'd' ? 'digraph' : ''} ${x.g === 'v' ? 'vowel' : ''} ${heard.has(x.l) ? 'heard' : ''}" data-l="${esc(x.l)}" style="--i:${i}" data-tilt="10">
        <span class="lt-big display">${esc(x.l)}${x.kind === 'l' ? `<small>${esc(x.l.toLowerCase())}</small>` : ''}</span>
        <span class="lt-ipa">/${esc(x.ipa)}/</span>
        <span class="lt-fr">${esc(x.fr.split(',')[0])}</span>
        <span class="lt-heard">${icon('check', 12)}</span>
      </button>`;
    pane.innerHTML = `
      <div class="abc-intro card paper rv" style="--layer:var(--blue)">
        <div class="grow">
          <h3>32 lettres + 7 groupes de lettres</h3>
          <p class="muted">Bonne nouvelle : chaque lettre se prononce toujours de la même façon. Clique sur une lettre pour l’entendre dans des mots, avec sa prononciation « à la française ». Les lettres en rouge n’existent pas en français.</p>
          <div class="abc-filters row wrap">
            ${[['all', 'Toutes'], ['special', 'Spéciales'], ['vowel', 'Voyelles'], ['digraph', 'Digrammes']].map(([k, l], i) => `<button type="button" class="chip chip-btn ${i ? '' : 'on'}" data-f="${k}">${l}</button>`).join('')}
            <span class="chip heard-count">${icon('ear', 14)}<span><b class="hc-n">${heard.size}</b>/${all.length} écoutées</span></span>
          </div>
        </div>
        ${mascot('talk', 120)}
      </div>
      <div class="letters stagger-pop">${all.map(tile).join('')}</div>`;
    pane.querySelectorAll('[data-f]').forEach((b) =>
      b.addEventListener('click', () => {
        pane.querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('on', x === b));
        const f = b.dataset.f;
        const tiles = pane.querySelectorAll('.letter');
        S.fx.flip(tiles, () => tiles.forEach((t) => (t.hidden = f !== 'all' && !t.classList.contains(f))));
      })
    );
    pane.querySelector('.letters').addEventListener('click', (e) => {
      const b = e.target.closest('.letter');
      if (!b) return;
      const x = all.find((y) => y.l === b.dataset.l);
      S.audio.speak(x.ex[0][0]);
      S.fx.jelly(b);
      if (!b.classList.contains('heard')) {
        b.classList.add('heard');
        S.store.heard(x.l);
        const n = pane.querySelector('.hc-n');
        n.textContent = S.store.state.heard.length;
      }
      letterModal(x);
    });
  }
  function letterModal(x) {
    S.ui.modal({
      cls: 'letter-modal',
      title: '',
      art: `<div class="lm-big display">${esc(x.l)}</div>`,
      body: `
        <div class="center lm-ipa">/${esc(x.ipa)}/</div>
        <p class="center lm-fr">${frTypo(esc(x.fr))}</p>
        ${x.note ? `<div class="callout tip"><span class="emoji">💡</span><p>${frTypo(esc(x.note))}</p></div>` : ''}
        <div class="lm-ex">${x.ex
          .map(([pl, fr, e]) => `<div class="lm-row">${say(pl)}<span class="emoji">${e || ''}</span><div class="grow"><div class="pl lm-pl">${esc(pl)}</div><div class="tiny">${hint(pl)}</div></div><span class="small muted">${esc(fr)}</span>${say(pl, { slow: true })}</div>`)
          .join('')}</div>`,
      actions: [{ label: 'Fermer', value: true, cls: 'btn-primary' }],
    });
  }

  /* ───────────── Chuintantes ───────────── */
  function sib(pane) {
    const M = A.sibilants;
    pane.innerHTML = `
      <div class="card paper rv" style="--layer:var(--red)">
        <h3>Le grand tableau des « ch »</h3>
        <p class="muted">Le polonais distingue <strong>trois familles</strong> de sons sifflants et chuintants, là où le français n’en a que deux. C’est LA difficulté de la prononciation… et ce tableau la rend limpide : chaque rangée correspond à une position de langue, chaque colonne à un type de son.</p>
      </div>
      <div class="sib-table rv" style="--i:1">
        <div class="sib-corner"></div>
        ${M.cols.map((c) => `<div class="sib-col">${esc(c)}</div>`).join('')}
        ${M.rows
          .map(
            (row, ri) => `
          <div class="sib-rowhead" style="${cvars(row.color)}"><b>${esc(row.name)}</b><span>${esc(row.tag)}</span><small>${esc(row.how)}</small></div>
          ${row.cells
            .map(
              ([l, w, fr, e], ci) => `<button type="button" class="sib-cell" style="${cvars(row.color)};--i:${ri * 4 + ci}" data-say="${esc(w)}">
                <span class="sc-l display">${esc(l)}</span><span class="sc-w pl">${esc(w)}</span><span class="sc-fr"><span class="emoji">${e}</span> ${esc(fr)}</span></button>`
            )
            .join('')}`
          )
          .join('')}
      </div>
      <div class="grid g3 mt">
        ${M.rows.map((row, i) => `<div class="card sib-how rv" style="${cvars(row.color)};--i:${i + 2}"><div class="sib-mouth">${mouth(i)}</div><b>${esc(row.name)}</b><p class="small muted">${esc(row.how)}</p></div>`).join('')}
      </div>
      <div class="callout tip mt rv"><span class="emoji">🎧</span><p>Entraîne ton oreille avec l’onglet <strong>Paires minimales</strong> : <span class="pl">kasa</span> (caisse), <span class="pl">kasza</span> (gruau) et <span class="pl">Kasia</span> (prénom) ne se ressemblent plus du tout une fois qu’on a compris !</p></div>`;
  }
  /* Petit schéma de profil de langue pour chaque famille. */
  function mouth(k) {
    const tongue = [
      'M20 70 C 40 62, 62 60, 80 58 C 88 57, 94 56, 98 54',
      'M20 70 C 40 64, 60 58, 72 48 C 78 40, 84 36, 90 38',
      'M20 70 C 34 50, 58 40, 78 44 C 88 47, 94 52, 98 56',
    ][k];
    return `<svg viewBox="0 0 120 90" class="mouth-svg">
      <path d="M8 30 C 40 10, 90 10, 112 26" fill="none" stroke="var(--line-2)" stroke-width="3" stroke-linecap="round"/>
      <path d="M100 28 L106 44" stroke="var(--ink-3)" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 76 L106 60" stroke="var(--ink-3)" stroke-width="4" stroke-linecap="round"/>
      <path class="tongue" d="${tongue}" fill="none" stroke="var(--c)" stroke-width="9" stroke-linecap="round"/>
      <path d="M10 82 C 50 88, 90 86, 112 76" fill="none" stroke="var(--line-2)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  /* ───────────── Paires minimales (jeu d'écoute) ───────────── */
  function pairs(pane) {
    if (!S.audio.hasVoice()) {
      pane.innerHTML = `<div class="empty">${mascot('sad', 150)}<h3>Il faut une voix polonaise</h3><p class="muted">Ce jeu d’écoute nécessite la synthèse vocale polonaise.</p><button class="btn btn-primary" id="nv">Comment l’activer ?</button></div>`;
      pane.querySelector('#nv').addEventListener('click', () => S.ui.noVoiceHelp(true));
      return;
    }
    const rounds = shuffle(A.pairs).slice(0, 10);
    let k = 0;
    let score = 0;
    let target = null;
    const play = (slow) => S.audio.speak(target[0], { slow });
    pane.innerHTML = `
      <div class="pairs-game card paper" style="--layer:var(--green)">
        <div class="pg-top"><span class="chip">${icon('ear', 14)} Manche <b class="pg-k">1</b>/${rounds.length}</span><span class="chip">${icon('star', 14)} <b class="pg-s">0</b></span></div>
        <div class="pg-body"></div>
      </div>
      <div class="pairs-list mt">
        <h3 class="mb">Toutes les paires</h3>
        <div class="grid auto-fill" style="--min:230px">
          ${A.pairs.map((set, i) => `<div class="card pair-card rv" style="--i:${i % 8}">${set.map(([w, fr]) => `<div class="pc-row">${say(w)}<span class="pl">${esc(w)}</span><span class="small muted">${esc(fr)}</span></div>`).join('')}</div>`).join('')}
        </div>
      </div>`;
    const body = pane.querySelector('.pg-body');
    function round() {
      if (k >= rounds.length) return end();
      const set = rounds[k];
      target = pick(set);
      pane.querySelector('.pg-k').textContent = k + 1;
      body.innerHTML = `
        <div class="pg-listen a-zoom">${`<button type="button" class="say say-big pg-play" aria-label="Réécouter">${icon('speaker', 30)}<span class="say-wave"><i></i><i></i><i></i></span></button>`}<button type="button" class="say say-big pg-slow" data-slow="1" aria-label="Lentement">${icon('turtle', 28)}</button></div>
        <p class="center muted">Quel mot as-tu entendu ?</p>
        <div class="pg-opts stagger-pop">${shuffle(set)
          .map(([w, fr], i) => `<button type="button" class="opt pg-opt" data-w="${esc(w)}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt"><span class="pl">${esc(w)}</span><small class="muted">${esc(fr)}</small></span></button>`)
          .join('')}</div>`;
      body.querySelector('.pg-play').addEventListener('click', () => play(false));
      body.querySelector('.pg-slow').addEventListener('click', () => play(true));
      body.querySelectorAll('.pg-opt').forEach((b) => b.addEventListener('click', () => answer(b)));
      setTimeout(() => play(false), 450);
    }
    function answer(b) {
      const opts = body.querySelectorAll('.pg-opt');
      opts.forEach((o) => (o.disabled = true));
      const ok = b.dataset.w === target[0];
      opts.forEach((o) => o.dataset.w === target[0] && o.classList.add('ok'));
      if (ok) {
        score++;
        S.audio.sfx.correct();
        S.fx.burst(b, 20, 6);
        pane.querySelector('.pg-s').textContent = score;
        S.store.addXP(1, 'pairs');
      } else {
        b.classList.add('ko');
        S.audio.sfx.wrong();
        S.fx.shake(b);
      }
      k++;
      setTimeout(round, ok ? 1000 : 1700);
    }
    function end() {
      body.innerHTML = `<div class="pg-end a-pop">${mascot(score >= 8 ? 'cheer' : 'happy', 130)}<h3 class="display">${score}/${rounds.length}</h3><p class="muted">${score >= 8 ? 'Quelle oreille ! Tu distingues les sons comme un·e Polonais·e.' : 'Bien joué ! Réécoute le tableau des chuintantes et retente ta chance.'}</p><button class="btn btn-green pg-again">${icon('refresh', 18)} Rejouer</button></div>`;
      if (score >= 8) S.fx.burst(body, 60, 10);
      body.querySelector('.pg-again').addEventListener('click', () => pairs(pane));
    }
    pane._key = (e) => {
      const n = parseInt(e.key, 10);
      const opts = body.querySelectorAll('.pg-opt:not(:disabled)');
      if (n >= 1 && n <= opts.length) opts[n - 1].click();
      if (e.key === ' ' && target) {
        e.preventDefault();
        play(false);
      }
    };
    round();
  }

  /* ───────────── Accent tonique ───────────── */
  function stress(pane) {
    const cands = C.words.filter((w) => !/[\s/]/.test(w.pl) && nuclei(w.pl).length >= 2);
    const rounds = sample(cands, 8);
    let k = 0;
    let score = 0;
    pane.innerHTML = `
      <div class="card paper rv" style="--layer:var(--orange)">
        <h3>Toujours l’avant-dernière !</h3>
        <p class="muted">En polonais, l’accent tombe presque toujours sur l’<strong>avant-dernière syllabe</strong>. Dans Słowik, la voyelle accentuée est soulignée : <span class="pl">${S.phon.stressHTML('dziękuję')}</span>, <span class="pl">${S.phon.stressHTML('Warszawa')}</span>, <span class="pl">${S.phon.stressHTML('przepraszam')}</span>.</p>
        <div class="row wrap">${['dziękuję', 'Warszawa', 'przepraszam', 'poniedziałek', 'Polska'].map((w) => `<button type="button" class="chip chip-btn" data-say="${w}">${icon('speaker', 14)} <span class="pl">${esc(w)}</span></button>`).join('')}</div>
      </div>
      <div class="stress-game card mt">
        <div class="pg-top"><span class="chip">${icon('target', 14)} Mot <b class="sg-k">1</b>/${rounds.length}</span><span class="chip">${icon('star', 14)} <b class="sg-s">0</b></span></div>
        <p class="center muted">Clique sur la voyelle accentuée :</p>
        <div class="sg-body"></div>
      </div>`;
    const body = pane.querySelector('.sg-body');
    function round() {
      if (k >= rounds.length) {
        body.innerHTML = `<div class="pg-end a-pop">${mascot('happy', 120)}<h3 class="display">${score}/${rounds.length}</h3><button class="btn btn-primary sg-again">${icon('refresh', 18)} Rejouer</button></div>`;
        body.querySelector('.sg-again').addEventListener('click', () => stress(pane));
        return;
      }
      const w = rounds[k];
      const nuc = nuclei(w.pl);
      const good = w.st != null ? nuc[w.st] : nuc[nuc.length - 2];
      pane.querySelector('.sg-k').textContent = k + 1;
      body.innerHTML = `<div class="sg-word pl a-zoom">${Array.from(w.pl)
        .map((ch, i) => (nuc.includes(i) ? `<button type="button" class="sg-v" data-i="${i}">${esc(ch)}</button>` : `<span>${esc(ch)}</span>`))
        .join('')}</div><p class="center muted">${frTypo(esc(w.fr))} ${w.e}</p>`;
      body.querySelectorAll('.sg-v').forEach((b) =>
        b.addEventListener('click', () => {
          body.querySelectorAll('.sg-v').forEach((x) => (x.disabled = true));
          const ok = +b.dataset.i === good;
          body.querySelector(`.sg-v[data-i="${good}"]`).classList.add('ok');
          if (ok) {
            score++;
            S.audio.sfx.correct();
            S.fx.burst(b, 18, 6);
            S.store.addXP(1, 'stress');
          } else {
            b.classList.add('ko');
            S.audio.sfx.wrong();
          }
          pane.querySelector('.sg-s').textContent = score;
          S.audio.speak(w.pl);
          k++;
          setTimeout(round, 1500);
        })
      );
    }
    round();
  }
  function nuclei(word) {
    const V = 'aąeęioóuy';
    const low = word.toLowerCase();
    const pos = [];
    for (let i = 0; i < low.length; i++) {
      const c = low[i];
      if (!V.includes(c)) continue;
      if (c === 'i' && i > 0 && !V.includes(low[i - 1]) && i + 1 < low.length && V.includes(low[i + 1])) continue;
      if (c === 'u' && i > 0 && low[i - 1] === 'a') continue;
      pos.push(i);
    }
    return pos;
  }

  /* ───────────── Virelangues ───────────── */
  function twist(pane) {
    const canMic = S.audio.canListen() && S.store.state.settings.speech;
    pane.innerHTML = `
      <div class="card paper rv" style="--layer:var(--violet)">
        <h3>Łamańce językowe — les « casse-langue »</h3>
        <p class="muted">Les Polonais adorent ces phrases impossibles. Écoute-les lentement, puis accélère. ${canMic ? 'Tu peux même tester ta prononciation au micro !' : ''}</p>
      </div>
      <div class="twisters">
        ${A.twisters
          .map(
            (t, i) => `
          <div class="card twister rv" style="--i:${i}" data-tilt="3">
            <div class="tw-num display">${i + 1}</div>
            <div class="tw-pl pl">${glossy(t.pl)}</div>
            <div class="tw-hint">${hint(t.pl)}</div>
            <div class="tw-fr">${frTypo(esc(t.fr))}</div>
            <p class="tiny muted">${frTypo(esc(t.note))}</p>
            <div class="row wrap">
              ${say(t.pl)}${say(t.pl, { slow: true })}
              ${canMic ? `<button type="button" class="btn btn-sm btn-soft tw-mic" data-i="${i}">${icon('mic', 16)} Essayer</button>` : ''}
              <span class="tw-score"></span>
            </div>
          </div>`
          )
          .join('')}
      </div>`;
    pane.querySelectorAll('.tw-mic').forEach((b) =>
      b.addEventListener('click', async () => {
        const t = A.twisters[+b.dataset.i];
        const out = b.parentElement.querySelector('.tw-score');
        b.classList.add('rec');
        b.innerHTML = `${icon('mic', 16)} J’écoute…`;
        const r = await S.audio.listen({ timeout: 9000 });
        b.classList.remove('rec');
        b.innerHTML = `${icon('mic', 16)} Réessayer`;
        if (!r.ok) {
          out.innerHTML = `<span class="small muted">Je n’ai rien compris 😅</span>`;
          return;
        }
        const res = S.audio.bestCompare(t.pl, r.alts);
        const pct = Math.round(res.score * 100);
        out.innerHTML = `<span class="chip ${pct >= 70 ? 'g-n' : 'g-f'} a-pop">${pct} %</span>`;
        if (pct >= 70) {
          S.fx.burst(out, 30, 8);
          S.audio.sfx.correct();
          S.store.bumpStat('speakOk');
          S.store.addXP(2, 'twister');
        }
      })
    );
  }

  const PANES = { abc, sib, pairs, stress, twist };

  S.views.sounds = {
    title: 'Les sons du polonais',
    pl: 'Dźwięki',
    mount(el) {
      let cur = 'abc';
      el.innerHTML = `<section class="sounds">${tabs(TABS, cur)}<div class="pane mt"></div></section>`;
      const pane = el.querySelector('.pane');
      const set = (k) => {
        cur = k;
        el.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === k));
        moveThumb(el);
        pane._key = null;
        pane.classList.remove('pane-in');
        void pane.offsetWidth;
        PANES[k](pane);
        pane.classList.add('pane-in');
        S.fx.reveal(pane);
        S.ui.animateRings(pane);
      };
      el.querySelectorAll('.tabs button').forEach((b) =>
        b.addEventListener('click', () => {
          S.audio.sfx.tap();
          set(b.dataset.tab);
        })
      );
      set(cur);
      requestAnimationFrame(() => moveThumb(el));
      const onKey = (e) => pane._key && !document.querySelector('#modals').children.length && pane._key(e);
      document.addEventListener('keydown', onKey);
      const onResize = () => moveThumb(el);
      window.addEventListener('resize', onResize);
      return () => {
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
      };
    },
  };
})();
