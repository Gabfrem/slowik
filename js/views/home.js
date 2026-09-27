/* Słowik — accueil : salutation, prochaine leçon, objectif, révisions, mot du jour, culture. */
(function () {
  'use strict';
  const { esc, frTypo, fmt, dayKey, addDays, keyToDate, pick, cvars } = S.util;
  const { icon, mascot, say, ring, plWord, hint, genderChip, bar } = S.ui;
  const C = S.content;

  const DAYS_PL = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  const DAYS_SHORT = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  const MONTHS_GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  const PEP = [
    ['Do dzieła!', 'Au travail !'],
    ['Powodzenia!', 'Bonne chance !'],
    ['Uczymy się razem!', 'Apprenons ensemble !'],
    ['Mówisz coraz lepiej!', 'Tu parles de mieux en mieux !'],
    ['Jeszcze jedna lekcja?', 'Encore une leçon ?'],
    ['Nie poddawaj się!', 'N’abandonne pas !'],
    ['Krok po kroku!', 'Pas à pas !'],
  ];

  function greeting() {
    const h = new Date().getHours();
    if (h >= 4 && h < 11) return ['Dzień dobry', 'Bonjour'];
    if (h >= 11 && h < 18) return ['Cześć', 'Salut'];
    return ['Dobry wieczór', 'Bonsoir'];
  }

  S.views.home = {
    title: 'Accueil',
    pl: 'Witaj z powrotem',
    mount(el) {
      const st = S.store.state;
      const now = new Date();
      const [g, gfr] = greeting();
      const name = st.name ? `, ${st.name}` : '';
      const next = C.nextNode();
      const pep = pick(PEP);
      const due = S.store.dueIds();
      const wod = C.wordOfDay();
      const fact = C.factOfDay();
      const prov = C.proverbOfDay();
      const tx = S.store.todayXP();
      const streak = S.store.streakNow();
      const ov = C.overall();
      const learned = Object.keys(st.cards).length;

      // Semaine en cours (7 derniers jours)
      const days = S.store.lastDays(7);
      const week = days
        .map((d, i) => {
          const dd = keyToDate(d.k);
          const today = d.k === dayKey();
          return `<div class="wk-day ${d.xp ? 'on' : ''} ${today ? 'today' : ''}" style="--i:${i}"><span class="wk-dot">${d.xp ? icon('check', 14) : ''}</span><span class="wk-lbl">${DAYS_SHORT[dd.getDay()]}</span></div>`;
        })
        .join('');

      // Carte « continuer »
      let cont;
      if (next) {
        const u = next.unit;
        const up = C.unitProgress(u);
        const isCh = next.kind === 'challenge';
        const chips = (isCh ? [] : next.words.slice(0, 5))
          .map((w, i) => `<span class="chip" style="--i:${i}"><span class="emoji">${w.e}</span><span class="pl">${esc(w.pl)}</span></span>`)
          .join('');
        cont = `
          <div class="card continue-card rv" style="${cvars(u.color)}" data-tilt="4">
            <div class="cc-top">
              <span class="cc-num display">${String(u.num).padStart(2, '0')}</span>
              <div class="grow">
                <div class="eyebrow cc-eyebrow">Unité ${u.num} · ${esc(u.fr)}</div>
                <h3 class="cc-title">${isCh ? 'Défi de l’unité 👑' : `${esc(next.fr)}`}</h3>
                <div class="pl cc-pl">${esc(isCh ? 'Wyzwanie' : next.pl)}</div>
              </div>
              <div class="cc-icon medallion" style="--sz:74px;--c:#fff"><span class="emoji">${isCh ? '👑' : next.icon}</span></div>
            </div>
            ${chips ? `<div class="cc-chips stagger-pop">${chips}</div>` : `<p class="cc-desc">Un test qui mélange tout le vocabulaire et les phrases de l’unité.</p>`}
            <div class="cc-bottom">
              <div class="grow"><div class="cc-prog-lbl">${up.done}/${up.total} étapes de l’unité</div>${bar(up.pct, { color: 'var(--on, #fff)' })}</div>
              <button type="button" class="btn btn-lg cc-go" data-magnet data-start="${next.id}">${icon('play', 18)}<span>${C.isDone(next.id) ? 'Rejouer' : 'Commencer'}</span></button>
            </div>
          </div>`;
      } else {
        cont = `
          <div class="card continue-card rv" style="${cvars('green')}">
            <div class="cc-top"><span class="cc-num display">★</span><div class="grow"><h3 class="cc-title">Parcours terminé !</h3><div class="pl cc-pl">Gratulacje!</div></div></div>
            <p class="cc-desc">Tu as bouclé les 15 unités. Continue avec les révisions, l’entraînement ciblé et les dialogues.</p>
            <div class="cc-bottom"><div class="grow"></div><button type="button" class="btn btn-lg cc-go" data-practice>${icon('gym', 18)}<span>S’entraîner</span></button></div>
          </div>`;
      }

      el.innerHTML = `
        <section class="home">
          <div class="hero card paper rv" style="--layer: var(--red)">
            <div class="hero-txt">
              <div class="hero-date"><button type="button" class="say-inline pl" data-say="${DAYS_PL[now.getDay()]}">${DAYS_PL[now.getDay()]}</button>, ${now.getDate()} ${MONTHS_GEN[now.getMonth()]} ${now.getFullYear()}</div>
              <h1 class="hero-title"><span class="pl">${S.fx.letters(g + name + '!')}</span></h1>
              <p class="hero-sub">${esc(gfr)} ! ${learned ? `Tu connais déjà <strong>${learned}</strong> mot${learned > 1 ? 's' : ''} polonais.` : 'Prêt·e à prononcer tes premiers mots polonais ?'} ${streak ? `Série de <strong>${streak}</strong> jour${streak > 1 ? 's' : ''} 🔥` : ''}</p>
              <div class="hero-actions">
                ${next ? `<button type="button" class="btn btn-primary btn-lg" data-magnet data-start="${next.id}">${icon('play', 18)}<span>${next.kind === 'challenge' ? 'Relever le défi' : C.isDone(next.id) ? 'Continuer' : learned ? 'Continuer' : 'Première leçon'}</span></button>` : ''}
                <button type="button" class="btn btn-soft btn-lg" data-go="review">${icon('cards', 18)}<span>Réviser</span>${due.length ? `<span class="count-badge">${due.length}</span>` : ''}</button>
              </div>
              <div class="hero-progress">
                <span class="eyebrow">Parcours</span>
                ${bar(ov.pct, { color: 'var(--red)' })}
                <span class="tnum strong small">${Math.round(ov.pct * 100)} %</span>
              </div>
            </div>
            <div class="hero-art">
              ${S.ui.orn.rosette({ petals: 12, colors: ['var(--red)', 'var(--yellow)', 'var(--green)'], cls: 'hero-rosette' })}
              <div class="hero-bird" data-say="${esc(pep[0])}" role="button" tabindex="0" aria-label="Écouter Słowik">${mascot('idle', 190)}</div>
              <div class="hero-bubble"><span class="pl">${esc(pep[0])}</span><span class="small muted">${esc(pep[1])}</span></div>
            </div>
          </div>

          ${S.cloud.available && !S.cloud.user && st.settings.cloudTip !== false && learned ? `
          <div class="cloud-tip card rv">
            <span class="ct-ico">${icon('cloud', 26)}</span>
            <div class="grow"><b>Sauvegarde ta progression en ligne</b><p class="small muted">Crée un compte gratuit pour ne rien perdre et continuer sur ton téléphone.</p></div>
            <button type="button" class="btn btn-primary btn-sm" data-acct="signup">Créer un compte</button>
            <button type="button" class="icon-btn flat ct-x" aria-label="Masquer">${icon('x', 18)}</button>
          </div>` : ''}

          <div class="home-grid">
            ${cont}

            <div class="card goal-card rv" style="--i:1">
              <div class="card-title">${icon('target', 20)}<h3>Objectif du jour</h3></div>
              <div class="goal-body">
                <div class="goal-ring">${ring(tx / st.goal, { size: 128, stroke: 12, color: tx >= st.goal ? 'var(--green)' : 'var(--orange)' })}
                  <div class="goal-num"><b class="display tnum" data-count="${tx}">0</b><span>/ ${st.goal} XP</span></div>
                </div>
                <div class="goal-side">
                  <div class="goal-streak ${S.store.doneToday() ? 'alive' : ''}"><span class="flame">${icon('flame', 30)}</span><div><b class="display">${streak}</b><span>jour${streak > 1 ? 's' : ''} de série</span></div></div>
                  <p class="small muted">${tx >= st.goal ? 'Objectif atteint, bravo ! Tout le reste est du bonus.' : `Encore <strong>${st.goal - tx} XP</strong> pour valider ta journée.`}</p>
                  ${st.streak.freezes ? `<p class="tiny muted">🧊 ${st.streak.freezes} gel${st.streak.freezes > 1 ? 's' : ''} de série en réserve</p>` : ''}
                </div>
              </div>
              <div class="week stagger">${week}</div>
            </div>

            <div class="card review-card rv" style="--i:2">
              <div class="card-title">${icon('cards', 20)}<h3>Révisions</h3><span class="eyebrow">FSRS</span></div>
              <div class="rc-body">
                <div class="rc-stack ${due.length ? 'has' : ''}" data-go="review"><span></span><span></span><span class="rc-top"><b class="display">${due.length}</b><small>à revoir</small></span></div>
                <div class="grow">
                  <p class="small">${due.length ? `<strong>${due.length} carte${due.length > 1 ? 's' : ''}</strong> t’attend${due.length > 1 ? 'ent' : ''}. Réviser au bon moment ancre les mots pour de bon.` : learned ? 'Tout est à jour ! Ta mémoire te remercie.' : 'Les mots de tes leçons arriveront ici, au moment idéal pour les réviser.'}</p>
                  <button type="button" class="btn btn-blue btn-sm" data-go="review">${due.length ? 'Commencer' : 'Voir mes cartes'} ${icon('arrowR', 16)}</button>
                </div>
              </div>
            </div>

            <div class="card wod-card rv" style="--i:3" data-tilt="5">
              <div class="card-title">${icon('sparkles', 20)}<h3>Mot du jour</h3><span class="eyebrow">Słowo dnia</span></div>
              <div class="wod-body">
                <div class="medallion" style="--sz:84px;--c:var(--${wod.unit.color})"><span class="emoji">${wod.e}</span></div>
                <div class="grow">
                  <div class="wod-word">${plWord(wod)} ${say(wod.pl)}</div>
                  <div>${hint(wod)}</div>
                  <div class="wod-fr">${frTypo(esc(wod.fr))} ${genderChip(wod.g)}</div>
                </div>
              </div>
              ${wod.ex ? `<div class="wod-ex"><span class="pl">${S.ui.glossy(wod.ex[0])}</span> ${say(wod.ex[0])}<div class="small muted">${frTypo(esc(wod.ex[1]))}</div></div>` : ''}
              ${st.cards[wod.id] ? `<div class="tiny muted wod-state">${S.ui.flower(S.srs.mastery(st.cards[wod.id]), 20)} Déjà dans tes révisions</div>` : `<button type="button" class="btn btn-soft btn-sm wod-add" data-add="${wod.id}">${icon('plus', 16)} Ajouter à mes révisions</button>`}
            </div>

            <div class="card fact-card rv" style="--i:4">
              <div class="card-title"><span class="emoji fact-emoji">${fact.icon}</span><h3>Le saviez-vous ?</h3></div>
              <h4 class="pl">${esc(fact.t)}</h4>
              <p>${fmt(fact.x)}</p>
              <a href="#/culture" class="link-more">Plus de culture ${icon('arrowR', 16)}</a>
            </div>

            <div class="card proverb-card rv" style="--i:5">
              <div class="card-title">${icon('feather', 20)}<h3>Przysłowie</h3><span class="eyebrow">Proverbe</span></div>
              <blockquote class="pl prov-pl">« ${esc(prov.pl)} » ${say(prov.pl)}</blockquote>
              <p class="small muted">Mot à mot : ${esc(prov.lit)}</p>
              <p class="prov-fr">≈ ${frTypo(esc(prov.fr))}</p>
            </div>
          </div>

          <div class="section-head rv"><h2>Explorer</h2><span class="pl">Odkrywaj</span></div>
          <div class="quick-grid">
            ${[
              ['sounds', 'wave', 'blue', 'Les sons', 'Dźwięki', 'Alphabet, chuintantes, paires minimales, virelangues.'],
              ['grammar', 'book', 'violet', 'Grammaire', 'Gramatyka', 'Genres, cas, conjugaisons : des fiches claires et des quiz.'],
              ['dialogues', 'chat', 'orange', 'Dialogues', 'Rozmowy', 'Des scènes de la vie quotidienne à écouter et comprendre.'],
              ['gym', 'gym', 'green', 'Entraînement', 'Trening', 'Nombres, heure, conjugaison, sprint chronométré…'],
              ['lexicon', 'lexicon', 'teal', 'Lexique', 'Słownik', 'Tous les mots, leur prononciation et ta maîtrise.'],
              ['culture', 'tulip', 'pink', 'Culture', 'Kultura', 'Traditions, proverbes et histoires de Pologne.'],
            ]
              .map(
                ([r, ic, c, t, p, d], i) => `
              <a href="#/${r}" class="quick card hover rv" style="${cvars(c)};--i:${i}" data-tilt="8">
                <span class="q-ico">${icon(ic, 26)}</span>
                <span class="q-txt"><b>${t}</b><span class="pl">${p}</span><small>${d}</small></span>
                <span class="q-arrow">${icon('arrowR', 20)}</span>
              </a>`
              )
              .join('')}
          </div>
        </section>`;

      // Interactions
      el.querySelectorAll('[data-start]').forEach((b) => b.addEventListener('click', () => S.session.startNode(C.nodeById[b.dataset.start], b)));
      el.querySelectorAll('[data-practice]').forEach((b) => b.addEventListener('click', () => S.session.startPractice(b)));
      const add = el.querySelector('[data-add]');
      if (add)
        add.addEventListener('click', () => {
          S.store.addCard(add.dataset.add);
          S.audio.sfx.pop();
          S.fx.burst(add, 24, 7);
          add.outerHTML = `<div class="tiny muted wod-state a-pop">${S.ui.flower(1, 20)} Ajouté à tes révisions !</div>`;
          S.updateHUD();
        });
      const ctx = el.querySelector('.ct-x');
      if (ctx)
        ctx.addEventListener('click', () => {
          st.settings.cloudTip = false;
          S.store.save();
          const tip = ctx.closest('.cloud-tip');
          tip.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px) scale(.97)' }], { duration: 260, easing: 'ease-in' }).onfinish = () => tip.remove();
        });
      const hb = el.querySelector('.hero-bird');
      hb.addEventListener('click', () => {
        S.ui.setMood(hb, 'happy');
        setTimeout(() => S.ui.setMood(hb, 'idle'), 1600);
      });
      el.querySelectorAll('[data-count]').forEach((n) => S.fx.countUp(n, +n.dataset.count, 1200));
    },
  };
})();
