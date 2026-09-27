/* Słowik — compte et synchronisation dans Supabase.
   La progression reste d'abord enregistrée sur l'appareil (l'app fonctionne hors-ligne) ;
   une fois connecté, elle est fusionnée avec celle du compte puis envoyée après chaque changement. */
(function () {
  'use strict';
  const CFG = S.config || {};
  const TABLE = 'progress';
  const lib = window.supabase;
  let client = null;
  try {
    if (lib && lib.createClient && CFG.supabaseUrl && CFG.supabaseAnonKey) {
      client = lib.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'slowik.auth' },
      });
    }
  } catch (e) {
    console.warn('[cloud] client indisponible', e);
  }

  const cloud = { available: !!client, user: null, status: client ? 'idle' : 'off', error: null, lastSync: 0, ready: false };
  const setStatus = (status, error) => {
    cloud.status = status;
    cloud.error = error || null;
    S.bus.emit('cloud', cloud);
  };

  /* Messages d'erreur compréhensibles. */
  function explain(err) {
    if (!err) return '';
    const code = err.code || '';
    const msg = String(err.message || err);
    if (code === 'PGRST205' || /schema cache|does not exist/i.test(msg)) return 'La base en ligne n’est pas encore prête (table « progress » absente).';
    if (code === 'invalid_credentials' || /invalid login credentials/i.test(msg)) return 'E-mail ou mot de passe incorrect.';
    if (code === 'email_not_confirmed' || /email not confirmed/i.test(msg)) return 'Confirme d’abord ton adresse e-mail : clique sur le lien reçu par e-mail.';
    if (code === 'user_already_exists' || /already registered/i.test(msg)) return 'Un compte existe déjà avec cette adresse e-mail.';
    if (code === 'weak_password' || /password should be/i.test(msg)) return 'Mot de passe trop faible : 6 caractères minimum.';
    if (/rate limit|too many/i.test(msg) || code.includes('rate_limit')) return 'Trop de tentatives. Réessaie dans quelques minutes.';
    if (code === 'validation_failed' || /invalid.*email|email.*invalid/i.test(msg)) return 'Adresse e-mail invalide.';
    if (code === 'same_password') return 'Le nouveau mot de passe doit être différent de l’ancien.';
    if (/failed to fetch|network|load failed/i.test(msg)) return 'Impossible de joindre le serveur. Vérifie ta connexion internet.';
    return msg;
  }
  const fail = (err) => {
    const e = new Error(explain(err));
    e.raw = err;
    return e;
  };

  const redirectUrl = () => (/^https?:$/.test(location.protocol) ? location.origin + location.pathname : CFG.siteUrl || undefined);

  /* ───────────── Synchronisation ───────────── */
  let syncing = null;
  let pushTimer = null;

  async function upload() {
    const payload = S.store.snapshot();
    const { error } = await client.from(TABLE).upsert({ user_id: cloud.user.id, data: payload });
    if (error) throw error;
  }

  /* Récupère la sauvegarde du compte, la fusionne avec celle de l'appareil, puis renvoie le résultat. */
  function sync(reason) {
    if (!client || !cloud.user) return Promise.resolve();
    if (syncing) return syncing;
    const uid = cloud.user.id;
    syncing = (async () => {
      setStatus('syncing');
      const { data, error } = await client.from(TABLE).select('data, updated_at').eq('user_id', uid).maybeSingle();
      if (error) throw error;
      const local = S.store.state;
      const otherAccount = local.owner && local.owner !== uid; // progression d'un autre compte : on ne mélange pas
      let next;
      if (data && data.data) next = otherAccount ? data.data : S.store.mergeStates(local, data.data);
      else next = otherAccount ? S.store.blank() : S.store.snapshot();
      next.owner = uid;
      const before = JSON.stringify(Object.assign({}, local, { settings: null, savedAt: 0 }));
      S.store.replace(next);
      const after = JSON.stringify(Object.assign({}, S.store.state, { settings: null, savedAt: 0 }));
      await upload();
      cloud.lastSync = Date.now();
      setStatus('synced');
      S.bus.emit('cloud:synced', { reason, changed: before !== after });
    })()
      .catch((err) => {
        console.warn('[cloud] synchronisation', err);
        setStatus('error', explain(err));
      })
      .finally(() => {
        syncing = null;
      });
    return syncing;
  }

  async function push() {
    clearTimeout(pushTimer);
    pushTimer = null;
    if (!client || !cloud.user) return;
    if (syncing) {
      await syncing;
      return push();
    }
    try {
      setStatus('syncing');
      await upload();
      cloud.lastSync = Date.now();
      setStatus('synced');
    } catch (err) {
      console.warn('[cloud] envoi', err);
      setStatus('error', explain(err));
    }
  }
  const pushSoon = () => {
    if (!cloud.user) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, 2500);
  };

  S.bus.on('saved', pushSoon);
  document.addEventListener('visibilitychange', () => {
    if (!cloud.user) return;
    if (document.hidden) {
      if (pushTimer) push();
    } else if (Date.now() - cloud.lastSync > 60000) sync('retour');
  });
  window.addEventListener('online', () => cloud.user && sync('reconnexion'));

  /* ───────────── Compte ───────────── */
  async function init() {
    if (!client) {
      S.bus.emit('auth', { event: 'OFF', user: null });
      return;
    }
    client.auth.onAuthStateChange((event, session) => {
      const prev = cloud.user && cloud.user.id;
      cloud.user = session ? session.user : null;
      if (event === 'PASSWORD_RECOVERY') setTimeout(() => S.account && S.account.recovery(), 700);
      if (cloud.ready && cloud.user && cloud.user.id !== prev) setTimeout(() => sync('connexion'), 0);
      if (!cloud.user && prev) setStatus('idle');
      S.bus.emit('auth', { event, user: cloud.user });
    });
    try {
      const { data } = await client.auth.getSession();
      cloud.user = data.session ? data.session.user : null;
    } catch (e) {
      cloud.user = null;
    }
    cloud.ready = true;
    S.bus.emit('auth', { event: 'READY', user: cloud.user });
    if (cloud.user) sync('démarrage');
  }

  async function signUp(email, password) {
    if (!client) throw new Error('Service en ligne indisponible.');
    const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl() } });
    if (error) throw fail(error);
    // Supabase ne renvoie pas d'erreur si l'adresse existe déjà : l'identité est alors vide.
    if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) throw fail({ code: 'user_already_exists' });
    return { needsConfirm: !data.session };
  }
  async function signIn(email, password) {
    if (!client) throw new Error('Service en ligne indisponible.');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw fail(error);
  }
  async function signOut() {
    if (!client) return;
    if (cloud.user) {
      try {
        await upload();
      } catch (e) {}
    }
    await client.auth.signOut();
    cloud.user = null;
    setStatus('idle');
  }
  async function resetPassword(email) {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl() });
    if (error) throw fail(error);
  }
  async function updatePassword(password) {
    const { error } = await client.auth.updateUser({ password });
    if (error) throw fail(error);
  }
  /* Efface la sauvegarde en ligne (le compte reste). */
  async function deleteCloudData() {
    const { error } = await client.from(TABLE).delete().eq('user_id', cloud.user.id);
    if (error) throw fail(error);
  }
  /* Supprime définitivement le compte (fonction SQL « delete_my_account »). */
  async function deleteAccount() {
    const { error } = await client.rpc('delete_my_account');
    if (error) throw fail(error);
    await client.auth.signOut();
    cloud.user = null;
    setStatus('idle');
  }

  S.cloud = Object.assign(cloud, { init, sync, push, signUp, signIn, signOut, resetPassword, updatePassword, deleteCloudData, deleteAccount, explain });
  Object.defineProperty(S.cloud, 'email', { get: () => (cloud.user ? cloud.user.email : '') });
})();
