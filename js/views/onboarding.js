/* Słowik — premier lancement : bienvenue, prénom, objectif, test de la voix. */
(function () {
  'use strict';
  const { $, esc } = S.util;
  const { icon, mascot, say } = S.ui;

  function open() {
    const st = S.store.state;
    const root = document.createElement('div');
    root.className = 'onboard';
    root.innerHTML = `
      <div class="ob-card">
        <div class="ob-dots">${[0, 1, 2, 3].map((i) => `<span data-d="${i}"></span>`).join('')}</div>
        <div class="ob-stage"></div>
      </div>`;
    $('#overlay').appendChild(root);
    document.body.classList.add('in-session');
    requestAnimationFrame(() => root.classList.add('open'));
    const stage = root.querySelector('.ob-stage');
    let step = 0;

    const steps = [
      () => `
        <div class="ob-step ob-welcome">
          <div class="ob-art">${S.ui.orn.rosette({ petals: 14, colors: ['var(--red)', 'var(--yellow)', 'var(--green)'], cls: 'bloom' })}${mascot('cheer', 180)}</div>
          <h1 class="display ob-hello">${S.fx.letters('Cześć!')}</h1>
          <p class="ob-lead">Je suis <strong class="pl">Słowik</strong>, le rossignol. Je vais t’apprendre le polonais, <em>mot à mot</em>&nbsp;: des leçons courtes, la bonne prononciation, et des révisions au moment idéal.</p>
          <div class="ob-actions">
            <button type="button" class="btn btn-primary btn-lg" data-next data-magnet>C’est parti ! ${icon('arrowR', 20)}</button>
            ${S.cloud.available ? `<button type="button" class="btn btn-soft btn-lg" data-login>${icon('user', 18)} J’ai déjà un compte</button>` : ''}
          </div>
          <label class="btn btn-ghost btn-sm ob-import">${icon('upload', 16)} Importer un fichier de sauvegarde<input type="file" accept=".json,application/json" data-import hidden></label>
        </div>`,
      () => `
        <div class="ob-step">
          <div class="ob-mini">${mascot('talk', 110)}</div>
          <h2>Comment t’appelles-tu ?</h2>
          <p class="muted">En polonais, on dirait : <span class="pl">Jak masz na imię?</span></p>
          <input class="input ob-name" maxlength="24" placeholder="Ton prénom" value="${esc(st.name)}" aria-label="Ton prénom">
          <div class="ob-preview"><span class="pl"></span><span class="ob-prev-say"></span></div>
          <div class="ob-actions"><button type="button" class="btn btn-ghost" data-prev>${icon('arrowL', 18)} Retour</button><button type="button" class="btn btn-primary btn-lg" data-next>Continuer ${icon('arrowR', 20)}</button></div>
        </div>`,
      () => `
        <div class="ob-step">
          <h2>Ton objectif quotidien</h2>
          <p class="muted">Mieux vaut 10 minutes chaque jour qu’une heure le dimanche. Tu pourras le changer à tout moment.</p>
          <div class="goal-opts ob-goals stagger-pop">${S.data.GOALS.map(([v, l, e], i) => `<button type="button" class="goal-opt ${st.goal === v ? 'on' : ''}" data-goal="${v}" style="--i:${i}"><span class="emoji">${e}</span><b>${l}</b><small>${v} XP / jour</small><small class="muted">≈ ${Math.round(v / 2)} min</small></button>`).join('')}</div>
          <div class="ob-actions"><button type="button" class="btn btn-ghost" data-prev>${icon('arrowL', 18)} Retour</button><button type="button" class="btn btn-primary btn-lg" data-next>Continuer ${icon('arrowR', 20)}</button></div>
        </div>`,
      () => `
        <div class="ob-step">
          <h2>Écoute ta première phrase</h2>
          <p class="muted">Appuie sur le haut-parleur :</p>
          <div class="ob-voice">
            ${say('Dzień dobry! Miło mi cię poznać.', { big: true })}
            <div><div class="pl ob-voice-pl">Dzień dobry! Miło mi cię poznać.</div><div class="muted">Bonjour ! Ravi de te connaître.</div><div class="small">${S.ui.hint('Dzień dobry! Miło mi cię poznać.')}</div></div>
          </div>
          <div class="ob-voice-status"></div>
          <div class="ob-actions"><button type="button" class="btn btn-ghost" data-prev>${icon('arrowL', 18)} Retour</button><button type="button" class="btn btn-green btn-lg" data-finish data-magnet>${icon('play', 18)} Ma première leçon</button></div>
          <button type="button" class="btn btn-ghost btn-sm ob-explore" data-explore>Explorer d’abord l’application</button>
        </div>`,
    ];

    function voiceStatus() {
      const box = root.querySelector('.ob-voice-status');
      if (!box) return;
      const v = S.audio.voice;
      box.innerHTML = v
        ? `<div class="callout tip a-pop"><span class="emoji">✅</span><p>Voix polonaise trouvée : <strong>${esc(v.name)}</strong>.${/natural|online/i.test(v.name) ? ' Une voix naturelle, excellente !' : ''}</p></div>`
        : `<div class="callout warn a-pop"><span class="emoji">🔇</span><p>Aucune voix polonaise détectée pour l’instant. <button type="button" class="say-inline" data-help>Comment en activer une ?</button> Tu peux continuer : tout le reste fonctionne.</p></div>`;
      const h = box.querySelector('[data-help]');
      if (h) h.addEventListener('click', () => S.ui.noVoiceHelp(true));
    }

    function render(dir = 1) {
      root.querySelectorAll('.ob-dots span').forEach((d, i) => d.classList.toggle('on', i <= step));
      const old = stage.firstElementChild;
      if (old && old._off) old._off();
      const put = () => {
        stage.innerHTML = steps[step]();
        const el = stage.firstElementChild;
        el.classList.add(dir > 0 ? 'in-r' : 'in-l');
        wire(el);
      };
      if (old && !S.fx.reduced()) {
        old.classList.add(dir > 0 ? 'out-l' : 'out-r');
        setTimeout(put, 220);
      } else put();
    }

    function wire(el) {
      el.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => go(1)));
      el.querySelectorAll('[data-login]').forEach((b) => b.addEventListener('click', () => S.account.open('login')));
      el.querySelectorAll('[data-prev]').forEach((b) => b.addEventListener('click', () => go(-1)));
      const name = el.querySelector('.ob-name');
      if (name) {
        const prev = el.querySelector('.ob-preview .pl');
        const ps = el.querySelector('.ob-prev-say');
        const upd = () => {
          st.name = name.value.trim();
          const txt = st.name ? `Cześć, ${st.name}! Miło mi!` : 'Cześć! Miło mi!';
          prev.textContent = txt;
          ps.innerHTML = say(txt);
        };
        name.addEventListener('input', upd);
        name.addEventListener('keydown', (e) => e.key === 'Enter' && go(1));
        upd();
        setTimeout(() => name.focus(), 350);
      }
      el.querySelectorAll('[data-goal]').forEach((b) =>
        b.addEventListener('click', () => {
          st.goal = +b.dataset.goal;
          el.querySelectorAll('[data-goal]').forEach((x) => x.classList.toggle('on', x === b));
          S.fx.jelly(b);
          S.audio.sfx.pop();
        })
      );
      const imp = el.querySelector('[data-import]');
      if (imp)
        imp.addEventListener('change', async (e) => {
          const f = e.target.files[0];
          if (!f) return;
          try {
            S.store.importJSON(await f.text());
            S.store.state.onboarded = true;
            S.store.save();
            S.applySettings();
            S.updateHUD();
            close();
            S.router.refresh();
            S.ui.toast({ icon: 'upload', tone: 'ok', title: 'Sauvegarde importée', text: 'Witaj z powrotem !' });
          } catch (err) {
            S.ui.toast({ icon: 'info', tone: 'warn', title: 'Import impossible', text: err.message });
          }
        });
      if (el.querySelector('.ob-voice')) {
        voiceStatus();
        const off = S.bus.on('voices', voiceStatus);
        el._off = off;
      }
      const fin = el.querySelector('[data-finish]');
      if (fin) fin.addEventListener('click', () => finish(true, fin));
      const ex = el.querySelector('[data-explore]');
      if (ex) ex.addEventListener('click', () => finish(false));
    }

    function go(d) {
      S.audio.sfx.tap();
      step = Math.max(0, Math.min(steps.length - 1, step + d));
      render(d);
    }

    function finish(startLesson, from) {
      st.onboarded = true;
      S.store.save();
      S.updateHUD();
      S.fx.cannons(70);
      S.audio.sfx.complete();
      close();
      const rect = from ? from.getBoundingClientRect() : null;
      const origin = rect ? { getBoundingClientRect: () => rect } : null;
      if (startLesson) setTimeout(() => S.session.startNode(S.content.nodeById.u1l1, origin), 600);
      else S.router.go('home');
    }

    function close() {
      root.classList.remove('open');
      root.classList.add('closing');
      document.body.classList.remove('in-session');
      setTimeout(() => root.remove(), 500);
      S.router.refresh();
    }

    const offSync = S.bus.on('cloud:synced', () => {
      offSync();
      if (!root.isConnected) return;
      S.store.state.onboarded = true;
      S.store.save();
      S.updateHUD();
      close();
      S.ui.toast({ emoji: '👋', tone: 'ok', title: 'Witaj z powrotem !', text: 'Ta progression a été récupérée.' });
    });

    render();
  }

  S.onboarding = { open };
})();
