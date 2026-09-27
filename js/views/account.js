/* Słowik — interface du compte : connexion, inscription, mot de passe, panneau de synchronisation. */
(function () {
  'use strict';
  const { esc } = S.util;
  const { icon, mascot } = S.ui;

  const TITLES = { login: 'Se connecter', signup: 'Créer un compte', forgot: 'Mot de passe oublié', sent: 'Vérifie ta boîte mail' };

  function unavailable() {
    S.ui.toast({ icon: 'cloud', tone: 'warn', title: 'Service en ligne indisponible', text: 'Vérifie ta connexion internet puis réessaie.' });
  }

  /* Fenêtre de connexion / inscription. */
  function open(mode = 'login') {
    if (!S.cloud.available) return unavailable();
    let current = mode;
    let sentTo = '';
    let sentKind = 'signup';
    S.ui.modal({
      cls: 'acct-modal',
      art: `<div class="acct-art">${mascot('happy', 96)}</div>`,
      title: '',
      body: '<div class="acct"></div>',
      actions: [],
      onMount(m, close) {
        const box = m.querySelector('.acct');
        const render = () => {
          if (current === 'sent') {
            box.innerHTML = `
              <h2 class="acct-title">${TITLES.sent}</h2>
              <div class="acct-sent a-pop">
                <span class="acct-mail">${icon('mail', 34)}</span>
                <p>${sentKind === 'signup' ? 'Presque fini ! Un lien de confirmation a été envoyé à' : 'Un lien pour choisir un nouveau mot de passe a été envoyé à'} <strong>${esc(sentTo)}</strong>.</p>
                <p class="small muted">${sentKind === 'signup' ? 'Clique sur le lien reçu, puis reviens te connecter ici.' : 'Ouvre le lien reçu pour définir ton nouveau mot de passe.'} Pense à regarder dans les indésirables.</p>
              </div>
              <button type="button" class="btn btn-primary btn-block btn-lg" data-mode="login">J’ai confirmé, me connecter</button>`;
          } else {
            const pwField =
              current === 'forgot'
                ? ''
                : `<label class="field"><span>Mot de passe</span>
                    <span class="pw"><input class="input" type="password" name="password" minlength="6" required autocomplete="${current === 'signup' ? 'new-password' : 'current-password'}" placeholder="${current === 'signup' ? '6 caractères minimum' : '••••••••'}">
                    <button type="button" class="icon-btn flat pw-toggle" aria-label="Afficher le mot de passe">${icon('eye', 18)}</button></span></label>`;
            box.innerHTML = `
              <h2 class="acct-title">${TITLES[current]}</h2>
              ${current !== 'forgot' ? `<div class="seg acct-seg"><span class="seg-thumb"></span><button type="button" data-mode="login" class="${current === 'login' ? 'on' : ''}">Connexion</button><button type="button" data-mode="signup" class="${current === 'signup' ? 'on' : ''}">Inscription</button></div>` : '<p class="small muted center">Indique ton adresse : tu recevras un lien pour choisir un nouveau mot de passe.</p>'}
              <form class="acct-form" novalidate>
                <label class="field"><span>Adresse e-mail</span><input class="input" type="email" name="email" required autocomplete="email" placeholder="toi@exemple.fr" value="${esc(sentTo)}"></label>
                ${pwField}
                <div class="acct-err" role="alert"></div>
                <button type="submit" class="btn btn-primary btn-block btn-lg acct-submit">${current === 'login' ? `${icon('arrowR', 18)} Se connecter` : current === 'signup' ? `${icon('sparkles', 18)} Créer mon compte` : `${icon('mail', 18)} Envoyer le lien`}</button>
              </form>
              ${current === 'login' ? '<button type="button" class="link-btn" data-mode="forgot">Mot de passe oublié ?</button>' : ''}
              ${current === 'forgot' ? '<button type="button" class="link-btn" data-mode="login">← Retour à la connexion</button>' : ''}
              <p class="tiny muted center acct-note">${icon('cloud', 14)} Ta progression est sauvegardée dans ton compte et synchronisée entre tes appareils.</p>`;
            const seg = box.querySelector('.acct-seg');
            if (seg) requestAnimationFrame(() => S.ui.placeSeg(seg));
            const f = box.querySelector('form');
            f.addEventListener('submit', (e) => {
              e.preventDefault();
              submit(f);
            });
            const t = box.querySelector('.pw-toggle');
            if (t)
              t.addEventListener('click', () => {
                const inp = box.querySelector('input[name=password]');
                inp.type = inp.type === 'password' ? 'text' : 'password';
                t.innerHTML = icon(inp.type === 'password' ? 'eye' : 'eyeOff', 18);
              });
            setTimeout(() => {
              const first = box.querySelector('input[name=email]');
              if (first) first.focus();
            }, 80);
          }
          box.querySelectorAll('[data-mode]').forEach((b) =>
            b.addEventListener('click', () => {
              const email = box.querySelector('input[name=email]');
              if (email && email.value) sentTo = email.value.trim();
              current = b.dataset.mode;
              S.audio.sfx.tap();
              render();
            })
          );
        };

        async function submit(f) {
          const err = f.querySelector('.acct-err');
          const btn = f.querySelector('.acct-submit');
          const email = f.email.value.trim();
          const password = f.password ? f.password.value : '';
          err.textContent = '';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr(err, 'Adresse e-mail invalide.');
          if (current !== 'forgot' && password.length < 6) return showErr(err, 'Le mot de passe doit contenir au moins 6 caractères.');
          const label = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner"></span> Un instant…';
          try {
            if (current === 'login') {
              await S.cloud.signIn(email, password);
              close(true);
              S.ui.toast({ icon: 'cloud', tone: 'ok', title: 'Connecté !', text: 'Synchronisation de ta progression…' });
              return;
            }
            if (current === 'signup') {
              const r = await S.cloud.signUp(email, password);
              if (!r.needsConfirm) {
                close(true);
                S.ui.toast({ icon: 'cloud', tone: 'ok', title: 'Compte créé !', text: 'Ta progression est maintenant sauvegardée en ligne.' });
                return;
              }
              sentKind = 'signup';
            } else {
              await S.cloud.resetPassword(email);
              sentKind = 'reset';
            }
            sentTo = email;
            current = 'sent';
            render();
          } catch (e) {
            btn.disabled = false;
            btn.innerHTML = label;
            showErr(err, e.message);
          }
        }
        render();
      },
    });
  }
  function showErr(el, msg) {
    el.textContent = msg;
    S.fx.shake(el.closest('form'));
    S.audio.sfx.wrong();
  }

  /* Après un lien « mot de passe oublié » : choisir le nouveau mot de passe. */
  function recovery() {
    S.ui.modal({
      cls: 'acct-modal',
      title: 'Nouveau mot de passe',
      body: `<form class="acct-form" novalidate>
          <label class="field"><span>Nouveau mot de passe</span><input class="input" type="password" name="password" minlength="6" autocomplete="new-password" placeholder="6 caractères minimum"></label>
          <div class="acct-err" role="alert"></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg acct-submit">${icon('check', 18)} Enregistrer</button>
        </form>`,
      actions: [],
      onMount(m, close) {
        const f = m.querySelector('form');
        f.addEventListener('submit', async (e) => {
          e.preventDefault();
          const err = f.querySelector('.acct-err');
          if (f.password.value.length < 6) return showErr(err, 'Le mot de passe doit contenir au moins 6 caractères.');
          const btn = f.querySelector('.acct-submit');
          btn.disabled = true;
          try {
            await S.cloud.updatePassword(f.password.value);
            close(true);
            S.ui.toast({ icon: 'check', tone: 'ok', title: 'Mot de passe modifié' });
          } catch (ex) {
            btn.disabled = false;
            showErr(err, ex.message);
          }
        });
        setTimeout(() => f.password.focus(), 80);
      },
    });
  }

  /* Texte d'état de la synchronisation. */
  function statusText() {
    const c = S.cloud;
    if (!c.available) return { cls: 'off', txt: 'Service en ligne indisponible' };
    if (!c.user) return { cls: 'off', txt: 'Non connecté · progression enregistrée sur cet appareil' };
    if (c.status === 'syncing') return { cls: 'busy', txt: 'Synchronisation…' };
    if (c.status === 'error') return { cls: 'err', txt: c.error || 'Erreur de synchronisation' };
    if (c.lastSync) {
      const s = Math.round((Date.now() - c.lastSync) / 1000);
      return { cls: 'ok', txt: s < 60 ? 'Synchronisé à l’instant' : `Synchronisé il y a ${Math.round(s / 60)} min` };
    }
    return { cls: 'busy', txt: 'Connexion…' };
  }

  /* Carte « Compte » des réglages. */
  function panelHTML() {
    const c = S.cloud;
    const st = statusText();
    if (!c.user) {
      return `
        <div class="acct-panel">
          <p class="small muted">Crée un compte gratuit pour sauvegarder ta progression en ligne et la retrouver sur tous tes appareils (ordinateur, téléphone…).</p>
          <div class="sync-line ${st.cls}"><i></i><span>${esc(st.txt)}</span></div>
          <div class="row wrap">
            <button type="button" class="btn btn-primary btn-sm" data-acct="signup">${icon('sparkles', 16)} Créer un compte</button>
            <button type="button" class="btn btn-soft btn-sm" data-acct="login">${icon('user', 16)} Se connecter</button>
          </div>
        </div>`;
    }
    return `
      <div class="acct-panel">
        <div class="acct-who"><span class="avatar-s">${esc((c.email || '?')[0].toUpperCase())}</span><div class="grow"><b>${esc(c.email)}</b><div class="sync-line ${st.cls}"><i></i><span>${esc(st.txt)}</span></div></div></div>
        <div class="row wrap">
          <button type="button" class="btn btn-soft btn-sm" data-acct="sync">${icon('refresh', 16)} Synchroniser</button>
          <button type="button" class="btn btn-soft btn-sm" data-acct="password">${icon('lock', 16)} Mot de passe</button>
          <button type="button" class="btn btn-soft btn-sm" data-acct="logout">${icon('logout', 16)} Se déconnecter</button>
        </div>
        <details class="acct-danger"><summary>Zone sensible</summary>
          <div class="row wrap">
            <button type="button" class="btn btn-danger btn-sm" data-acct="wipe">${icon('trash', 16)} Effacer mes données en ligne</button>
            <button type="button" class="btn btn-danger btn-sm" data-acct="delete">${icon('x', 16)} Supprimer mon compte</button>
          </div>
        </details>
      </div>`;
  }

  async function action(kind) {
    const c = S.cloud;
    if (kind === 'login' || kind === 'signup') return open(kind);
    if (kind === 'sync') return c.sync('manuel');
    if (kind === 'password') return recovery();
    if (kind === 'logout') {
      const ok = await S.ui.confirm('Se déconnecter ?', 'Ta progression reste enregistrée dans ton compte et sur cet appareil.', 'Se déconnecter');
      if (!ok) return;
      await c.signOut();
      S.ui.toast({ icon: 'logout', title: 'Déconnecté', text: 'À bientôt ! Do zobaczenia!' });
      return;
    }
    if (kind === 'wipe') {
      const ok = await S.ui.confirm('Effacer tes données en ligne ?', 'La sauvegarde de ton compte sera supprimée. La progression de cet appareil est conservée et sera renvoyée à la prochaine synchronisation, sauf si tu te déconnectes.', 'Effacer', true);
      if (!ok) return;
      try {
        await c.deleteCloudData();
        S.ui.toast({ icon: 'trash', title: 'Données en ligne effacées' });
      } catch (e) {
        S.ui.toast({ icon: 'info', tone: 'warn', title: 'Impossible d’effacer', text: e.message });
      }
      return;
    }
    if (kind === 'delete') {
      const ok = await S.ui.confirm('Supprimer ton compte ?', 'Ton compte et ta sauvegarde en ligne seront supprimés définitivement. La progression de cet appareil est conservée.', 'Supprimer définitivement', true);
      if (!ok) return;
      try {
        await c.deleteAccount();
        S.store.state.owner = null;
        S.store.save();
        S.ui.toast({ icon: 'check', title: 'Compte supprimé' });
      } catch (e) {
        S.ui.toast({ icon: 'info', tone: 'warn', title: 'Suppression impossible', text: e.message });
      }
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-acct]');
    if (b) action(b.dataset.acct);
  });

  S.account = { open, recovery, panelHTML, statusText, action };
})();
