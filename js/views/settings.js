/* Słowik — réglages : profil, objectif, apparence, voix, apprentissage, sauvegarde. */
(function () {
  'use strict';
  const { esc, cvars } = S.util;
  const { icon, mascot } = S.ui;

  const GOALS = [[10, 'Détente', '🐢'], [20, 'Normal', '🐦'], [30, 'Sérieux', '🦊'], [50, 'Intense', '🐉']];
  S.data.GOALS = GOALS;

  function seg(name, opts, val) {
    return `<div class="seg" data-seg="${name}"><span class="seg-thumb"></span>${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${String(v) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  }
  const placeSeg = (seg) => S.ui.placeSeg(seg);
  const toggle = (name, on, disabled) => `<label class="toggle"><input type="checkbox" data-t="${name}" ${on ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span></span></label>`;
  const row = (title, desc, control) => `<div class="set-row"><div class="grow"><b>${title}</b>${desc ? `<p class="small muted">${desc}</p>` : ''}</div>${control}</div>`;

  S.views.settings = {
    title: 'Réglages',
    pl: 'Ustawienia',
    mount(el) {
      const st = S.store.state;
      const s = st.settings;
      const voices = S.audio.voices;
      el.innerHTML = `
        <section class="settings">
          ${S.cloud.available ? `<div class="card set-card acct-card rv" id="account">
            <div class="card-title">${icon('cloud', 20)}<h3>Compte & sauvegarde en ligne</h3></div>
            <div class="acct-slot">${S.account.panelHTML()}</div>
          </div>` : ''}
          <div class="set-grid">
            <div class="card set-card rv" style="--i:0">
              <div class="card-title">${icon('heart', 20)}<h3>Profil</h3></div>
              <div class="field"><label for="set-name">Ton prénom</label><input id="set-name" class="input" maxlength="24" value="${esc(st.name)}" placeholder="Comment dois-je t’appeler ?"></div>
              <div class="field mt"><label>Objectif quotidien</label>
                <div class="goal-opts">${GOALS.map(([v, l, e]) => `<button type="button" class="goal-opt ${st.goal === v ? 'on' : ''}" data-goal="${v}"><span class="emoji">${e}</span><b>${l}</b><small>${v} XP / jour</small></button>`).join('')}</div>
              </div>
            </div>

            <div class="card set-card rv" style="--i:1">
              <div class="card-title">${icon('sun', 20)}<h3>Apparence</h3></div>
              ${row('Thème', 'Papier clair ou encre sombre.', seg('theme', [['auto', 'Auto'], ['light', 'Clair'], ['dark', 'Sombre']], s.theme))}
              ${row('Animations', '« Auto » suit le réglage de Windows.', seg('motion', [['full', 'Toutes'], ['auto', 'Auto'], ['reduced', 'Réduites']], s.motion))}
              ${row('Accent tonique souligné', 'Souligne la voyelle accentuée des mots polonais.', toggle('stress', s.stress))}
              ${row('Prononciation figurée', 'Affiche [ djièn kouyè ] sous les mots.', toggle('hints', s.hints))}
            </div>

            <div class="card set-card rv" style="--i:2">
              <div class="card-title">${icon('speaker', 20)}<h3>Son & voix</h3></div>
              ${row('Effets sonores', '', toggle('sound', s.sound))}
              ${row('Volume des effets', '', `<input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-r="volume" style="max-width:180px">`)}
              <div class="field mt"><label for="set-voice">Voix polonaise</label>
                ${voices.length ? `<div class="row"><select id="set-voice" class="input grow">${voices.map((v) => `<option value="${esc(v.voiceURI)}" ${S.audio.voice && S.audio.voice.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select><button type="button" class="btn btn-blue btn-sm" data-test>${icon('play', 16)} Tester</button></div>` : `<div class="callout warn"><span class="emoji">🔇</span><p>Aucune voix polonaise détectée. <button type="button" class="say-inline" data-help>Comment en installer une ?</button></p></div>`}
              </div>
              ${row('Vitesse de lecture', '', `<input type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}" data-r="rate" style="max-width:180px">`)}
              ${row('Lecture automatique', 'Prononcer les mots dès qu’ils apparaissent.', toggle('autoplay', s.autoplay))}
            </div>

            <div class="card set-card rv" style="--i:3">
              <div class="card-title">${icon('mic', 20)}<h3>Apprentissage</h3></div>
              ${row('Exercices de prononciation', S.audio.canListen() ? 'Utilise le micro (reconnaissance vocale en ligne).' : 'Non disponible dans ce navigateur (utilise Edge ou Chrome).', toggle('speech', s.speech && S.audio.canListen(), !S.audio.canListen()))}
              ${row('Débloquer tout le parcours', 'Accès libre à toutes les leçons, sans suivre l’ordre.', toggle('unlockAll', s.unlockAll))}
            </div>

            <div class="card set-card rv" style="--i:4">
              <div class="card-title">${icon('download', 20)}<h3>Sauvegarde</h3></div>
              <p class="small muted">Ta progression est enregistrée automatiquement sur cet ordinateur. Exporte-la pour la garder en lieu sûr ou la transférer.</p>
              <div class="row wrap">
                <button type="button" class="btn btn-soft btn-sm" data-export>${icon('download', 16)} Exporter</button>
                <label class="btn btn-soft btn-sm">${icon('upload', 16)} Importer<input type="file" accept="application/json,.json" data-import hidden></label>
                <button type="button" class="btn btn-danger btn-sm" data-reset>${icon('trash', 16)} Tout effacer</button>
              </div>
            </div>

            <div class="card set-card rv" style="--i:5">
              <div class="card-title">${icon('keyboard', 20)}<h3>Raccourcis clavier</h3></div>
              <div class="keys">
                <span><span class="kbd">Entrée</span> Vérifier / continuer</span>
                <span><span class="kbd">1</span>–<span class="kbd">4</span> Choisir une réponse</span>
                <span><span class="kbd">Espace</span> Retourner une carte / réécouter</span>
                <span><span class="kbd">Tab</span> Réécouter (dictée) · <span class="kbd">⇧</span>+<span class="kbd">Tab</span> lentement</span>
                <span><span class="kbd">Échap</span> Quitter la séance</span>
                <span><span class="kbd">H</span> <span class="kbd">P</span> <span class="kbd">R</span> <span class="kbd">S</span> <span class="kbd">G</span> <span class="kbd">D</span> <span class="kbd">E</span> <span class="kbd">L</span> Naviguer</span>
              </div>
            </div>
          </div>

          <div class="card about rv mt">
            <div class="about-art">${mascot('happy', 120)}</div>
            <div class="grow">
              <h3>La méthode Słowik</h3>
              <ul class="about-list">
                <li><b>Répétition espacée (FSRS)</b> : chaque mot revient juste avant d’être oublié — le même algorithme que la version moderne d’Anki.</li>
                <li><b>Rappel actif</b> : on progresse de la reconnaissance (QCM) vers la production (écrire, construire, prononcer), bien plus efficace que relire.</li>
                <li><b>Input compréhensible</b> : dialogues et histoires légèrement au-dessus de ton niveau, avec traduction au survol.</li>
                <li><b>Les sons d’abord</b> : le polonais se lit comme il s’écrit ; la prononciation figurée et l’accent tonique sont affichés partout.</li>
                <li><b>Grammaire en contexte</b> : les cas arrivent un par un, avec des déclencheurs concrets (négation → génitif, lieu → locatif…).</li>
                <li><b>Petites séances quotidiennes</b> : un objectif modeste et une série de jours valent mieux qu’un marathon.</li>
              </ul>
              <p class="tiny muted">Słowik 1.0 · fonctionne hors-ligne · voix par la synthèse vocale de ton navigateur.</p>
            </div>
          </div>
        </section>`;

      el.querySelectorAll('.seg').forEach((sg) => {
        placeSeg(sg);
        sg.addEventListener('click', (e) => {
          const b = e.target.closest('button');
          if (!b) return;
          sg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
          placeSeg(sg);
          s[sg.dataset.seg] = b.dataset.v;
          S.store.save();
          S.audio.sfx.select();
          const apply = () => {
            S.applySettings();
            S.updateHUD();
          };
          if (sg.dataset.seg === 'theme' && document.startViewTransition && !S.fx.reduced()) {
            const r = b.getBoundingClientRect();
            document.documentElement.style.setProperty('--tx', r.left + r.width / 2 + 'px');
            document.documentElement.style.setProperty('--ty', r.top + r.height / 2 + 'px');
            document.documentElement.classList.add('theme-anim');
            const vt = document.startViewTransition(apply);
            vt.ready.catch(() => {});
            vt.finished.catch(() => {}).finally(() => document.documentElement.classList.remove('theme-anim'));
          } else apply();
        });
      });
      requestAnimationFrame(() => el.querySelectorAll('.seg').forEach(placeSeg));
      el.querySelectorAll('[data-t]').forEach((t) =>
        t.addEventListener('change', () => {
          s[t.dataset.t] = t.checked;
          S.store.save();
          S.audio.sfx.select();
          S.updateHUD();
        })
      );
      el.querySelectorAll('[data-r]').forEach((r) => {
        const upd = () => r.style.setProperty('--val', ((r.value - r.min) / (r.max - r.min)) * 100 + '%');
        upd();
        r.addEventListener('input', () => {
          upd();
          s[r.dataset.r] = +r.value;
          S.store.save();
        });
        r.addEventListener('change', () => (r.dataset.r === 'rate' ? S.audio.speak('Dzień dobry! Jak się masz?') : S.audio.sfx.correct()));
      });
      const name = el.querySelector('#set-name');
      name.addEventListener('input', S.util.debounce(() => {
        st.name = name.value.trim();
        S.store.save();
      }, 300));
      el.querySelectorAll('[data-goal]').forEach((b) =>
        b.addEventListener('click', () => {
          st.goal = +b.dataset.goal;
          S.store.save();
          el.querySelectorAll('[data-goal]').forEach((x) => x.classList.toggle('on', x === b));
          S.fx.jelly(b);
          S.audio.sfx.pop();
          S.updateHUD();
        })
      );
      const vs = el.querySelector('#set-voice');
      if (vs)
        vs.addEventListener('change', () => {
          s.voice = vs.value;
          S.store.save();
          S.audio.pickVoice();
          S.audio.speak('Cześć! Mam na imię Słowik.');
        });
      const test = el.querySelector('[data-test]');
      if (test) test.addEventListener('click', () => S.audio.speak('Cześć! Mam na imię Słowik. Miło mi cię poznać!'));
      const help = el.querySelector('[data-help]');
      if (help) help.addEventListener('click', () => S.ui.noVoiceHelp(true));

      el.querySelector('[data-export]').addEventListener('click', () => {
        const blob = new Blob([S.store.exportJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `slowik-sauvegarde-${S.util.dayKey()}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 500);
        S.ui.toast({ icon: 'download', tone: 'ok', title: 'Sauvegarde exportée' });
      });
      el.querySelector('[data-import]').addEventListener('change', async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
          S.store.importJSON(await f.text());
          S.applySettings();
          S.updateHUD();
          S.router.refresh();
          S.ui.toast({ icon: 'upload', tone: 'ok', title: 'Sauvegarde importée', text: 'Witaj z powrotem !' });
        } catch (err) {
          S.ui.toast({ icon: 'info', tone: 'warn', title: 'Import impossible', text: err.message });
        }
      });
      el.querySelector('[data-reset]').addEventListener('click', async () => {
        const inAccount = S.cloud.user ? ' Comme tu es connecté, la sauvegarde de ton compte sera aussi remise à zéro.' : '';
        const ok = await S.ui.confirm('Tout effacer ?', `Ta progression, tes cartes et tes succès seront supprimés définitivement. Pense à exporter une sauvegarde avant.${inAccount}`, 'Tout effacer', true);
        if (!ok) return;
        const owner = S.store.state.owner;
        S.store.reset();
        if (S.cloud.user) {
          S.store.state.owner = owner;
          S.store.persist();
          S.cloud.push();
        }
        S.applySettings();
        S.updateHUD();
        location.hash = '#/home';
        S.router.refresh();
        setTimeout(() => S.onboarding.open(), 400);
      });
      const onResize = () => el.querySelectorAll('.seg').forEach(placeSeg);
      window.addEventListener('resize', onResize);
      // Carte du compte mise à jour en direct
      const slot = el.querySelector('.acct-slot');
      const refreshAcct = () => slot && (slot.innerHTML = S.account.panelHTML());
      const offs = [S.bus.on('auth', refreshAcct), S.bus.on('cloud', refreshAcct)];
      const tick = setInterval(refreshAcct, 30000);
      return () => {
        window.removeEventListener('resize', onResize);
        offs.forEach((off) => off());
        clearInterval(tick);
      };
    },
  };
})();
