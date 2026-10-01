/* Słowik — état persistant (localStorage), XP, série, niveaux, succès. */
(function () {
  'use strict';
  const { dayKey, diffDays, addDays } = S.util;
  const KEY = 'slowik.v1';

  const defaults = () => ({
    v: 1,
    created: Date.now(),
    onboarded: false,
    name: '',
    goal: 20,
    settings: {
      theme: 'auto', motion: 'full', sound: true, volume: 0.6, voice: '', rate: 0.9,
      speech: true, autoplay: true, hints: true, stress: true, unlockAll: false,
      noListenUntil: 0, noSpeakUntil: 0, // « Je ne peux pas écouter / parler maintenant » (pause de 10 min)
    },
    xp: 0,
    days: {},
    streak: { cur: 0, best: 0, last: null, freezes: 0 },
    lessons: {},
    cards: {},
    grammar: {},
    dialogues: {},
    ach: {},
    heard: [],
    stats: { lessons: 0, perfect: 0, answers: 0, correct: 0, reviews: 0, speakOk: 0, numbersOk: 0, sprintBest: 0, timeMs: 0 },
    last: { lesson: null },
    owner: null,
    savedAt: 0,
  });

  let state = defaults();

  function mergeDeep(base, obj) {
    if (!obj || typeof obj !== 'object') return base;
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      const b = base[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)) base[k] = mergeDeep(b, v);
      else base[k] = v;
    });
    return base;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = mergeDeep(defaults(), JSON.parse(raw));
    } catch (e) {
      console.warn('[store] sauvegarde illisible, nouveau départ', e);
      state = defaults();
    }
    return state;
  }

  let timer = null;
  let dirty = false;
  function persist() {
    clearTimeout(timer);
    const changed = dirty;
    if (changed) state.savedAt = Date.now();
    dirty = false;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[store] impossible de sauvegarder', e);
    }
    if (changed) S.bus.emit('saved');
  }
  const save = () => {
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(persist, 180);
  };
  window.addEventListener('pagehide', persist);
  window.addEventListener('beforeunload', persist);

  /* ── Série (streak) avec « gel » : 1 gel offert tous les 7 jours, 2 max. ── */
  function touchStreak() {
    const k = dayKey();
    const s = state.streak;
    if (s.last === k) return;
    if (!s.last) s.cur = 1;
    else {
      const gap = diffDays(s.last, k);
      if (gap === 1) s.cur += 1;
      else if (gap > 1 && s.freezes >= gap - 1) {
        s.freezes -= gap - 1;
        s.cur += 1;
        S.bus.emit('freeze:used', gap - 1);
      } else s.cur = 1;
    }
    s.last = k;
    if (s.cur > s.best) s.best = s.cur;
    if (s.cur % 7 === 0 && s.freezes < 2) {
      s.freezes += 1;
      S.bus.emit('freeze:earned', s.freezes);
    }
    S.bus.emit('streak', s.cur);
  }

  function streakNow() {
    const s = state.streak;
    if (!s.last) return 0;
    const gap = diffDays(s.last, dayKey());
    if (gap <= 1) return s.cur;
    if (gap - 1 <= s.freezes) return s.cur;
    return 0;
  }
  const doneToday = () => state.streak.last === dayKey();

  /* ── Niveaux : seuils 0, 50, 150, 300, 500… ── */
  const threshold = (n) => 25 * n * (n - 1);
  function level(xp = state.xp) {
    let n = 1;
    while (xp >= threshold(n + 1)) n++;
    const from = threshold(n);
    const to = threshold(n + 1);
    const L = S.data.levels;
    const info = L[Math.min(n - 1, L.length - 1)];
    return Object.assign({ n, from, to, pct: (xp - from) / (to - from) }, info);
  }

  /* ── XP ── */
  function todayXP() {
    const d = state.days[dayKey()];
    return d ? d.xp : 0;
  }
  function addXP(n, src) {
    n = Math.round(n);
    if (!(n > 0)) return;
    const k = dayKey();
    const before = todayXP();
    const lvBefore = level().n;
    state.days[k] = state.days[k] || { xp: 0, n: 0 };
    state.days[k].xp += n;
    state.days[k].n += 1;
    state.xp += n;
    touchStreak();
    save();
    S.bus.emit('xp', { n, src, total: state.xp, today: state.days[k].xp });
    if (before < state.goal && state.days[k].xp >= state.goal) S.bus.emit('goal', state.days[k].xp);
    const lv = level().n;
    if (lv > lvBefore) S.bus.emit('levelup', level());
  }
  function lastDays(n) {
    const out = [];
    const today = dayKey();
    for (let i = n - 1; i >= 0; i--) {
      const k = addDays(today, -i);
      out.push({ k, xp: (state.days[k] && state.days[k].xp) || 0 });
    }
    return out;
  }

  /* ── Leçons ── */
  function lessonInfo(id) {
    return state.lessons[id] || null;
  }
  function completeLesson(id, r) {
    const L = state.lessons[id] || { stars: 0, best: 0, n: 0 };
    const stars = r.acc >= 0.95 ? 3 : r.acc >= 0.75 ? 2 : 1;
    const first = !L.n;
    L.stars = Math.max(L.stars, stars);
    L.best = Math.max(L.best, r.acc);
    L.n += 1;
    L.t = Date.now();
    state.lessons[id] = L;
    state.stats.lessons += 1;
    if (r.mistakes === 0) state.stats.perfect += 1;
    state.stats.timeMs += r.time || 0;
    if (id && !/c$/.test(id)) state.last.lesson = id;
    const now = Date.now();
    const weak = new Set(r.weak || []);
    (r.words || []).forEach((wid) => {
      if (!state.cards[wid]) state.cards[wid] = S.srs.newCard(weak.has(wid) ? 2 : 3, now);
    });
    save();
    addXP(r.xp, 'lesson');
    checkAchievements();
    S.bus.emit('lesson:done', { id, stars, first });
    return { stars, first };
  }
  function recordAnswer(ok) {
    state.stats.answers += 1;
    if (ok) state.stats.correct += 1;
    save();
  }

  /* ── Cartes (répétition espacée) ── */
  function reviewCard(wid, grade) {
    const c = state.cards[wid] || S.srs.newCard(grade, Date.now());
    state.cards[wid] = S.srs.schedule(c, grade, Date.now());
    state.stats.reviews += 1;
    save();
  }
  function addCard(wid) {
    if (!state.cards[wid]) {
      state.cards[wid] = S.srs.newCard(2, Date.now());
      save();
      return true;
    }
    return false;
  }
  function dueIds(now = Date.now()) {
    return Object.keys(state.cards)
      .filter((id) => state.cards[id].due <= now && S.content.wordById[id])
      .sort((a, b) => state.cards[a].due - state.cards[b].due);
  }

  /* ── Divers ── */
  function markGrammar(id, score) {
    const g = state.grammar[id] || { best: 0, n: 0 };
    const first = !g.n;
    g.best = Math.max(g.best, score);
    g.n += 1;
    state.grammar[id] = g;
    save();
    return first;
  }
  function markDialogue(id, score) {
    const d = state.dialogues[id] || { best: 0, n: 0 };
    const first = !d.n;
    d.best = Math.max(d.best, score);
    d.n += 1;
    state.dialogues[id] = d;
    save();
    return first;
  }
  function heard(letter) {
    if (!state.heard.includes(letter)) {
      state.heard.push(letter);
      save();
      checkAchievements();
    }
  }
  function bumpStat(key, n = 1) {
    state.stats[key] = (state.stats[key] || 0) + n;
    save();
  }
  function setStatMax(key, v) {
    if (v > (state.stats[key] || 0)) {
      state.stats[key] = v;
      save();
    }
  }

  function checkAchievements(ctx) {
    ctx = ctx || { hour: new Date().getHours() };
    const fresh = [];
    S.data.achievements.forEach((a) => {
      if (state.ach[a.id]) return;
      let ok = false;
      try {
        ok = a.test(state, ctx);
      } catch (e) {
        ok = false;
      }
      if (ok) {
        state.ach[a.id] = Date.now();
        fresh.push(a);
      }
    });
    if (fresh.length) {
      save();
      fresh.forEach((a, i) => setTimeout(() => S.bus.emit('achievement', a), 400 + i * 1400));
    }
    return fresh;
  }

  /* ── Synchronisation : copie, remplacement et fusion de deux sauvegardes ── */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const snapshot = () => clone(state);
  function replace(next, opts = {}) {
    const settings = state.settings;
    state = mergeDeep(defaults(), clone(next));
    if (opts.keepSettings !== false) state.settings = settings;
    dirty = false;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    S.bus.emit('store:replaced');
  }
  /* Fusion « au mieux » : on garde le meilleur de chaque appareil (étoiles, cartes les plus récentes, XP…). */
  function mergeStates(a, b) {
    a = a || {};
    b = b || {};
    const newer = (b.savedAt || 0) > (a.savedAt || 0) ? b : a;
    const out = mergeDeep(defaults(), clone(newer));
    const keys = (x, y) => Array.from(new Set(Object.keys(x || {}).concat(Object.keys(y || {}))));
    out.settings = clone(a.settings || out.settings);
    out.onboarded = !!(a.onboarded || b.onboarded);
    out.created = Math.min(a.created || Date.now(), b.created || Date.now());
    out.xp = Math.max(a.xp || 0, b.xp || 0);
    out.days = {};
    keys(a.days, b.days).forEach((k) => {
      const x = (a.days || {})[k] || {};
      const y = (b.days || {})[k] || {};
      out.days[k] = { xp: Math.max(x.xp || 0, y.xp || 0), n: Math.max(x.n || 0, y.n || 0) };
    });
    const sa = a.streak || {};
    const sb = b.streak || {};
    out.streak = clone((sa.last || '') >= (sb.last || '') ? sa : sb);
    out.streak.best = Math.max(sa.best || 0, sb.best || 0, out.streak.cur || 0);
    out.lessons = {};
    keys(a.lessons, b.lessons).forEach((k) => {
      const x = (a.lessons || {})[k] || {};
      const y = (b.lessons || {})[k] || {};
      out.lessons[k] = { stars: Math.max(x.stars || 0, y.stars || 0), best: Math.max(x.best || 0, y.best || 0), n: Math.max(x.n || 0, y.n || 0), t: Math.max(x.t || 0, y.t || 0) };
    });
    out.cards = {};
    keys(a.cards, b.cards).forEach((k) => {
      const x = (a.cards || {})[k];
      const y = (b.cards || {})[k];
      out.cards[k] = clone(!x ? y : !y ? x : (y.last || 0) > (x.last || 0) ? y : x);
    });
    ['grammar', 'dialogues'].forEach((f) => {
      out[f] = {};
      keys(a[f], b[f]).forEach((k) => {
        const x = (a[f] || {})[k] || {};
        const y = (b[f] || {})[k] || {};
        out[f][k] = { best: Math.max(x.best || 0, y.best || 0), n: Math.max(x.n || 0, y.n || 0) };
      });
    });
    out.ach = {};
    keys(a.ach, b.ach).forEach((k) => {
      const x = (a.ach || {})[k];
      const y = (b.ach || {})[k];
      out.ach[k] = x && y ? Math.min(x, y) : x || y;
    });
    out.heard = Array.from(new Set((a.heard || []).concat(b.heard || [])));
    out.stats = {};
    keys(a.stats, b.stats).forEach((k) => (out.stats[k] = Math.max((a.stats || {})[k] || 0, (b.stats || {})[k] || 0)));
    out.owner = a.owner || b.owner || null;
    out.savedAt = Math.max(a.savedAt || 0, b.savedAt || 0);
    return out;
  }
  const isBlank = (st) => !st.xp && !Object.keys(st.lessons || {}).length && !Object.keys(st.cards || {}).length;
  const blank = () => Object.assign(defaults(), { onboarded: true });

  function exportJSON() {
    return JSON.stringify(Object.assign({ app: 'slowik', exported: new Date().toISOString() }, state), null, 2);
  }
  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !data.settings || !('xp' in data)) throw new Error('Fichier de sauvegarde invalide');
    delete data.app;
    delete data.exported;
    state = mergeDeep(defaults(), data);
    persist();
  }
  function reset() {
    state = defaults();
    persist();
  }

  S.store = {
    get state() {
      return state;
    },
    load, save, persist, reset, exportJSON, importJSON, snapshot, replace, mergeStates, isBlank, blank,
    addXP, todayXP, lastDays, level, streakNow, doneToday,
    lessonInfo, completeLesson, recordAnswer, reviewCard, addCard, dueIds,
    markGrammar, markDialogue, heard, bumpStat, setStatMax, checkAchievements,
  };
})();
