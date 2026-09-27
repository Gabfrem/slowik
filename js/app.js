/* Słowik — démarrage : coquille, écran d'ouverture, écouteurs globaux. */
(function () {
  'use strict';
  const { $, $$, esc, frTypo } = S.util;
  const { icon, mascot, ring } = S.ui;

  S.store.load();

  /* ───────────── Réglages appliqués ───────────── */
  S.applySettings = function () {
    const st = S.store.state.settings;
    const root = document.documentElement;
    if (st.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', st.theme);
    const reduce = st.motion === 'reduced' || (st.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (reduce) root.setAttribute('data-motion', 'reduced');
    else root.removeAttribute('data-motion');
    S.audio.pickVoice();
  };
  S.applySettings();

  /* ───────────── Coquille ───────────── */
  function buildShell() {
    const NAV = S.router.NAV;
    $('#sidebar').innerHTML = `
      <a class="sb-brand" href="#/home" aria-label="Słowik — accueil">
        ${mascot('idle', 56)}
        <div><div class="sb-name">Sł<span>o</span>wik</div><div class="sb-tag">Polski · mot à mot</div></div>
      </a>
      <nav class="sb-nav">
        <span class="sb-pill"></span>
        ${NAV.map((n) => `
          <a class="sb-item" href="#/${n.r}" data-route="${n.r}" title="${n.fr} — ${n.pl}">
            <span class="sb-ico">${icon(n.ic, 22)}</span>
            <span class="sb-txt"><b>${n.fr}</b><i class="pl">${n.pl}</i></span>
            ${n.r === 'review' ? '<span class="sb-badge" data-badge="review"></span>' : ''}
          </a>`).join('')}
      </nav>
      <div class="sb-foot">
        <button type="button" class="sb-account" data-action="account"></button>
        <button type="button" class="sb-level" data-go="stats" aria-label="Voir ma progression"></button>
        <div class="sb-tools">
          <button type="button" class="icon-btn" data-action="theme" title="Changer de thème" aria-label="Changer de thème">${icon('moon', 20)}</button>
          <button type="button" class="icon-btn" data-action="sound" title="Sons" aria-label="Activer / couper les sons">${icon('speaker', 20)}</button>
        </div>
      </div>`;
    $('#topbar').innerHTML = `
      <a class="tb-brand" href="#/home" aria-label="Accueil">${mascot('idle', 40)}</a>
      <div class="tb-title"></div>
      <div class="tb-right">
        <button type="button" class="pill streak" data-go="stats" title="Série de jours"></button>
        <button type="button" class="pill goal" data-go="stats" title="Objectif du jour"></button>
        <button type="button" class="pill level" data-go="stats" title="Niveau"></button>
      </div>`;
    const tabs = NAV.filter((n) => n.tab);
    $('#tabbar').innerHTML = `<span class="tab-pill"></span>${tabs
      .map((n) => `<a class="tab" href="#/${n.r}" data-route="${n.r}"><span class="sb-ico">${icon(n.ic, 22)}</span><span>${n.fr}</span>${n.r === 'review' ? '<span class="sb-badge" data-badge="review"></span>' : ''}</a>`)
      .join('')}<button type="button" class="tab" data-action="more"><span class="sb-ico">${icon('menu', 22)}</span><span>Plus</span></button>`;
    updateHUD();
    updateAccount();
  }

  /* Pastille du compte (barre latérale). */
  function updateAccount() {
    const el = $('.sb-account');
    if (!el) return;
    const c = S.cloud;
    const st = S.account.statusText();
    el.hidden = !c.available;
    el.className = `sb-account ${c.user ? 'in' : 'out'} s-${st.cls}`;
    el.title = c.user ? `${c.email} — ${st.txt}` : 'Se connecter pour sauvegarder ta progression en ligne';
    el.innerHTML = c.user
      ? `<span class="avatar-s">${esc((c.email || '?')[0].toUpperCase())}</span><span class="sb-acc-txt"><b>${esc(c.email)}</b><span>${esc(st.txt)}</span></span><i class="sync-dot"></i>`
      : `<span class="avatar-s">${icon('user', 16)}</span><span class="sb-acc-txt"><b>Se connecter</b><span>Sauvegarde en ligne</span></span>`;
  }
  S.updateAccount = updateAccount;

  /* Menu « Plus » (mobile) : panneau glissant depuis le bas. */
  function openMoreSheet() {
    const cur = S.router.current ? S.router.current.name : '';
    const c = S.cloud;
    const tiles = S.router.NAV.filter((n) => !n.tab)
      .map((n) => `<a class="nav-tile ${cur === n.r || (cur === 'grammarTopic' && n.r === 'grammar') || (cur === 'dialogue' && n.r === 'dialogues') ? 'active' : ''}" href="#/${n.r}" style="${S.util.cvars(n.c)}">
          <span class="nt-ico">${icon(n.ic, 22)}</span><span class="nt-txt"><b>${n.fr}</b><span class="pl">${n.pl}</span></span></a>`)
      .join('');
    const acc = !c.available
      ? ''
      : c.user
        ? `<a class="nav-acc" href="#/settings"><span class="avatar-s">${esc((c.email || '?')[0].toUpperCase())}</span><span class="grow"><b>${esc(c.email)}</b><span class="small muted">${esc(S.account.statusText().txt)}</span></span>${icon('chevR', 18)}</a>`
        : `<button type="button" class="nav-acc" data-acct="login"><span class="avatar-s">${icon('user', 18)}</span><span class="grow"><b>Se connecter</b><span class="small muted">Sauvegarde ta progression en ligne</span></span>${icon('chevR', 18)}</button>`;
    S.ui.sheet({
      title: 'Menu',
      body: `${acc}<div class="nav-grid">${tiles}</div>
        <div class="sheet-tools">
          <button type="button" class="btn btn-soft btn-sm" data-action="theme">${icon(isDark() ? 'sun' : 'moon', 18)} ${isDark() ? 'Thème clair' : 'Thème sombre'}</button>
          <button type="button" class="btn btn-soft btn-sm" data-action="sound">${icon('speaker', 18)} ${S.store.state.settings.sound ? 'Couper les sons' : 'Activer les sons'}</button>
        </div>`,
      onMount: (panel, close) => panel.addEventListener('click', (ev) => ev.target.closest('a, [data-acct], [data-action]') && setTimeout(close, 40)),
    });
  }

  /* Indicateurs : série, objectif du jour, niveau, révisions dues. */
  function updateHUD(bump) {
    const st = S.store.state;
    const streak = S.store.streakNow();
    const alive = S.store.doneToday();
    const sEl = $('.pill.streak');
    if (sEl) {
      sEl.classList.toggle('alive', alive);
      sEl.innerHTML = `<span class="flame">${icon('flame', 22)}</span><span class="tnum ${bump === 'streak' ? 'bump' : ''}">${streak}</span>`;
      sEl.title = alive ? `Série de ${streak} jour(s) — bravo !` : streak ? `Série de ${streak} jour(s) : apprends aujourd’hui pour la prolonger !` : 'Commence une série aujourd’hui !';
    }
    const tx = S.store.todayXP();
    const gEl = $('.pill.goal');
    if (gEl) {
      gEl.classList.toggle('done', tx >= st.goal);
      gEl.innerHTML = `${ring(tx / st.goal, { size: 34, stroke: 5, color: tx >= st.goal ? 'var(--green)' : 'var(--orange)' })}<span class="tnum ${bump === 'xp' ? 'bump' : ''}">${tx}<span class="muted">/${st.goal}</span></span>`;
    }
    const lv = S.store.level();
    const lEl = $('.pill.level');
    if (lEl) lEl.innerHTML = `<span class="emoji">${lv.e}</span><span>Poziom ${lv.n}</span>`;
    const sb = $('.sb-level');
    if (sb) {
      sb.innerHTML = `<span class="ring-wrap">${ring(lv.pct, { size: 46, stroke: 5, color: 'var(--red)' })}<span class="emoji">${lv.e}</span></span>
        <span class="sb-level-txt"><b>Poziom ${lv.n} · <span class="pl">${esc(lv.pl)}</span></b><span>${S.util.fmtInt(st.xp)} XP · ${lv.to - st.xp} avant le suivant</span></span>`;
    }
    const due = S.store.dueIds().length;
    $$('[data-badge="review"]').forEach((b) => {
      b.textContent = due > 99 ? '99+' : due;
      b.classList.toggle('on', due > 0);
    });
    const th = $('[data-action="theme"]');
    if (th) th.innerHTML = icon(isDark() ? 'sun' : 'moon', 20);
    const so = $('[data-action="sound"]');
    if (so) {
      so.innerHTML = icon('speaker', 20);
      so.style.opacity = st.settings.sound ? 1 : 0.45;
    }
    S.ui.animateRings(document);
  }
  S.updateHUD = updateHUD;
  const isDark = () => {
    const t = document.documentElement.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  };

  /* ───────────── Actions globales ───────────── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    if (!a) return;
    const act = a.dataset.action;
    const st = S.store.state;
    if (act === 'theme') {
      const next = isDark() ? 'light' : 'dark';
      const apply = () => {
        st.settings.theme = next;
        S.store.save();
        S.applySettings();
        updateHUD();
      };
      if (document.startViewTransition && !S.fx.reduced()) {
        const r = a.getBoundingClientRect();
        document.documentElement.style.setProperty('--tx', r.left + r.width / 2 + 'px');
        document.documentElement.style.setProperty('--ty', r.top + r.height / 2 + 'px');
        document.documentElement.classList.add('theme-anim');
        const vt = document.startViewTransition(apply);
        vt.ready.catch(() => {});
        vt.finished.catch(() => {}).finally(() => document.documentElement.classList.remove('theme-anim'));
      } else apply();
    } else if (act === 'sound') {
      st.settings.sound = !st.settings.sound;
      S.store.save();
      updateHUD();
      S.audio.sfx.pop();
      S.ui.toast({ icon: 'speaker', title: st.settings.sound ? 'Sons activés' : 'Sons coupés' });
    } else if (act === 'more') {
      S.audio.sfx.tap();
      openMoreSheet();
    } else if (act === 'account') {
      if (S.cloud.user) S.router.go('settings');
      else S.account.open('login');
    }
  });

  /* Raccourcis clavier globaux (hors séance) */
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || $('#overlay').children.length || $('#modals').children.length) return;
    if (e.target.matches && e.target.matches('input, textarea, select')) return;
    const keys = { h: 'home', p: 'path', r: 'review', s: 'sounds', g: 'grammar', d: 'dialogues', e: 'gym', l: 'lexicon' };
    if (!e.ctrlKey && !e.metaKey && !e.altKey && keys[e.key]) S.router.go(keys[e.key]);
  });

  /* ───────────── Réactions aux événements ───────────── */
  S.bus.on('xp', (d) => updateHUD('xp'));
  S.bus.on('streak', () => updateHUD('streak'));
  S.bus.on('goal', () => {
    S.audio.sfx.complete();
    S.fx.cannons(50);
    S.ui.toast({ emoji: '🎯', tone: 'ok', title: 'Objectif du jour atteint !', text: 'Świetnie! Ta série continue.' });
  });
  S.bus.on('levelup', (lv) => {
    setTimeout(() => {
      S.audio.sfx.levelup();
      S.fx.rain(160);
      S.ui.modal({
        title: `Poziom ${lv.n} !`,
        art: `<div class="levelup-art"><span class="emoji">${lv.e}</span></div>`,
        body: `<p class="center">Tu passes au niveau <strong>${lv.n}</strong> : <span class="pl">${esc(lv.pl)}</span> — ${esc(lv.fr)}.</p><p class="center muted small">Continue comme ça, jusqu’à devenir un aigle blanc !</p>`,
        actions: [{ label: 'Super !', value: true, cls: 'btn-primary' }],
      });
    }, 900);
  });
  S.bus.on('achievement', (a) => {
    S.audio.sfx.star(2);
    S.ui.toast({ emoji: a.e, tone: 'ach', title: `Succès : ${a.pl}`, text: `${a.fr} — ${a.d}`, ms: 5200 });
  });
  S.bus.on('freeze:earned', () => S.ui.toast({ emoji: '🧊', tone: 'info', title: 'Gel de série gagné !', text: 'Il protégera ta série si tu manques un jour.' }));
  S.bus.on('freeze:used', (n) => S.ui.toast({ emoji: '🧊', tone: 'info', title: 'Série sauvée !', text: `${n} gel(s) utilisé(s) pour protéger ta série.` }));
  S.bus.on('voices', () => S.bus.emit('voices:ready'));

  /* Compte et synchronisation */
  S.bus.on('auth', updateAccount);
  S.bus.on('cloud', updateAccount);
  setInterval(updateAccount, 30000);
  S.bus.on('store:replaced', () => {
    updateHUD();
    if (!S.session.active && !$('#overlay .onboard')) S.router.refresh();
  });
  S.bus.on('cloud:synced', (d) => {
    if (d.changed && d.reason !== 'démarrage') S.ui.toast({ icon: 'cloud', tone: 'ok', title: 'Progression synchronisée', text: 'Ta progression a été mise à jour depuis ton compte.' });
  });

  /* ───────────── Écran d'ouverture ───────────── */
  function splash(short) {
    return new Promise((resolve) => {
      const el = $('#splash');
      if (S.fx.reduced()) {
        el.classList.add('out');
        return setTimeout(() => {
          el.innerHTML = '';
          el.classList.remove('out');
          resolve();
        }, 300);
      }
      el.innerHTML = `
        <div class="splash-inner">
          <div class="splash-art">
            ${S.ui.orn.rosette({ petals: 16, colors: ['var(--red)', 'var(--yellow)', 'var(--green)'], cls: 'bloom' })}
            ${S.ui.orn.rosette({ petals: 10, colors: ['var(--blue)', 'var(--pink)', 'var(--orange)'], cls: 'bloom r2' })}
            <div class="halo"></div>
            ${mascot('happy', 200)}
          </div>
          <div class="splash-title display">${S.fx.letters('Słowik')}</div>
          <svg class="splash-stitch" viewBox="0 0 180 12"><path d="M4 6 C 40 -2, 70 14, 90 6 S 150 -2, 176 6" pathLength="100" style="stroke-dasharray:100;stroke-dashoffset:100;animation:draw 1.1s var(--ease-out) 1.2s forwards"/></svg>
          <div class="splash-tag">Le polonais, mot à mot</div>
        </div>
        <div class="splash-skip">Appuyer pour passer</div>`;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.classList.add('out');
        S.audio.sfx.whoosh();
        setTimeout(() => {
          el.classList.remove('out');
          el.innerHTML = '';
          resolve();
        }, 1000);
      };
      el.addEventListener('click', finish, { once: true });
      window.addEventListener('keydown', finish, { once: true });
      setTimeout(finish, short ? 1900 : 2600);
    });
  }

  /* ───────────── C'est parti ───────────── */
  S.fx.initBackground();
  buildShell();
  S.router.init();
  S.cloud.init();

  /* Téléphone : comme une vraie app, pas de zoom par pincement (iOS ignore « user-scalable=no »). */
  ['gesturestart', 'gesturechange'].forEach((t) => document.addEventListener(t, (e) => e.preventDefault(), { passive: false }));
  setTimeout(() => S.router.movePill(), 60);
  window.addEventListener('load', () => S.router.movePill());
  document.fonts && document.fonts.ready.then(() => S.router.movePill());

  // Mise à jour horaire (révisions dues, changement de jour)
  setInterval(updateHUD, 60000);
  document.addEventListener('visibilitychange', () => !document.hidden && updateHUD());

  // Installation en application (PWA) et fonctionnement hors-ligne, uniquement sur un site web (https)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch((e) => console.warn('[sw]', e)));
  }

  splash(S.store.state.onboarded).then(() => {
    if (!S.store.state.onboarded) S.onboarding.open();
    else S.store.checkAchievements();
  });
})();
