/* Słowik — index du contenu : mots, leçons, déblocage, glossaire, nombres. */
(function () {
  'use strict';
  const { slug, COLORS, hash, dayKey, norm } = S.util;

  const units = S.data.units;
  const words = [];
  const wordById = {};
  const wordByPl = {};
  const lessons = [];
  const nodes = [];
  const nodeById = {};

  units.forEach((u, ui) => {
    u.index = ui;
    u.num = ui + 1;
    u.color = u.color || COLORS[ui % COLORS.length];
    u.words = [];
    u.sentences = [];
    u.lessons.forEach((l, li) => {
      l.unit = u;
      l.index = li;
      l.kind = 'lesson';
      l.words.forEach((w) => {
        w.id = slug(w.pl);
        w.lesson = l;
        w.unit = u;
        if (wordById[w.id]) console.warn('[content] mot en double :', w.id);
        wordById[w.id] = w;
        wordByPl[norm(w.pl)] = w;
        words.push(w);
        u.words.push(w);
      });
      l.sentences.forEach((s, si) => {
        s.id = `${l.id}.s${si}`;
        s.lesson = l;
        s.unit = u;
        u.sentences.push(s);
      });
      lessons.push(l);
      nodes.push(l);
      nodeById[l.id] = l;
    });
    const ch = {
      id: `${u.id}c`, kind: 'challenge', unit: u, index: u.lessons.length,
      pl: 'Wyzwanie', fr: 'Défi de l’unité', icon: '👑', words: u.words, sentences: u.sentences,
    };
    u.challenge = ch;
    nodes.push(ch);
    nodeById[ch.id] = ch;
    (u.cloze || []).forEach((c, ci) => {
      c.id = `${u.id}.c${ci}`;
      c.unit = u;
    });
  });
  nodes.forEach((n, i) => (n.order = i));

  const st = () => S.store.state;
  const isDone = (id) => !!(st().lessons[id] && st().lessons[id].n);
  function isUnlocked(node) {
    if (st().settings.unlockAll) return true;
    if (node.order === 0) return true;
    return isDone(nodes[node.order - 1].id);
  }
  const nextNode = () => nodes.find((n) => !isDone(n.id) && isUnlocked(n)) || null;
  function unitProgress(u) {
    const ns = u.lessons.concat([u.challenge]);
    const done = ns.filter((n) => isDone(n.id)).length;
    return { done, total: ns.length, pct: done / ns.length };
  }
  const unitUnlocked = (u) => isUnlocked(u.lessons[0]);
  function overall() {
    const done = nodes.filter((n) => isDone(n.id)).length;
    return { done, total: nodes.length, pct: done / nodes.length };
  }
  const learnedWords = () => words.filter((w) => st().cards[w.id]);
  const unlockedUnits = () => units.filter((u) => unitUnlocked(u));
  /* Unités « vues » : au moins une leçon faite (ou toutes si tout est débloqué). */
  function studiedUnits() {
    const list = units.filter((u) => u.lessons.some((l) => isDone(l.id)));
    return list.length ? list : [units[0]];
  }

  /* Glossaire : mot du lexique ou forme fléchie connue. */
  function gloss(token, extra) {
    const t = norm(token);
    if (!t) return null;
    const raw = String(token).toLowerCase().replace(/[.,!?;:«»"“”„…()]/g, '');
    if (extra && (extra[t] || extra[raw])) return extra[t] || extra[raw];
    const w = wordByPl[t];
    if (w) return w.fr;
    return S.data.gloss[t] || S.data.gloss[raw] || null;
  }

  /* Mot du jour, stable pour la journée. */
  const wordOfDay = () => words[hash(dayKey() + 'słowik') % words.length];
  const factOfDay = () => S.data.culture[hash(dayKey() + 'fakt') % S.data.culture.length];
  const proverbOfDay = () => S.data.proverbs[hash(dayKey() + 'przysłowie') % S.data.proverbs.length];

  /* ── Nombres en toutes lettres (0 → 999 999) ── */
  const UNITS = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'];
  const TEENS = ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
  const TENS = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
  const HUNDREDS = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
  function plForm(n, one, few, many) {
    if (n === 1) return one;
    const u = n % 10;
    const t = n % 100;
    if (u >= 2 && u <= 4 && !(t >= 12 && t <= 14)) return few;
    return many;
  }
  function below1000(n) {
    const parts = [];
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h) parts.push(HUNDREDS[h]);
    if (r >= 10 && r < 20) parts.push(TEENS[r - 10]);
    else {
      const t = Math.floor(r / 10);
      const u = r % 10;
      if (t) parts.push(TENS[t]);
      if (u) parts.push(UNITS[u]);
    }
    return parts.join(' ');
  }
  function numberPl(n) {
    n = Math.floor(n);
    if (n === 0) return 'zero';
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    const parts = [];
    if (th) parts.push(th === 1 ? 'tysiąc' : `${below1000(th)} ${plForm(th, 'tysiąc', 'tysiące', 'tysięcy')}`);
    if (rest) parts.push(below1000(rest));
    return parts.join(' ');
  }

  /* Tokenisation pour les exercices à construire. */
  const tokens = (text) =>
    String(text)
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .map((t) => t.replace(/^[«»"“”„(¿¡]+|[.,!?;:«»"“”)…]+$/g, ''))
      .filter((t) => t && !/^[?!.,:;…]+$/.test(t));

  S.content = {
    units, words, wordById, lessons, nodes, nodeById,
    isDone, isUnlocked, nextNode, unitProgress, unitUnlocked, overall, learnedWords, unlockedUnits, studiedUnits,
    gloss, wordOfDay, factOfDay, proverbOfDay, numberPl, plForm, tokens,
  };
})();
