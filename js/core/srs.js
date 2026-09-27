/* Słowik — répétition espacée, algorithme FSRS-5 (Free Spaced Repetition Scheduler, celui d'Anki moderne).
   Chaque carte garde une stabilité S (jours avant de tomber à 90 % de rappel) et une difficulté D (1–10). */
(function () {
  'use strict';
  const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const F = 19 / 81;
  const C = -0.5;
  const RETENTION = 0.9;
  const DAY = 864e5;
  const MIN = 6e4;

  const clampD = (d) => Math.min(10, Math.max(1, d));
  const retrievability = (t, s) => Math.pow(1 + (F * t) / s, C);
  const interval = (s) => Math.min(3650, Math.max(1, Math.round((s / F) * (Math.pow(RETENTION, 1 / C) - 1))));
  const S0 = (g) => W[g - 1];
  const D0 = (g) => clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1);
  const nextD = (d, g) => {
    const delta = -W[6] * (g - 3);
    const d1 = d + (delta * (10 - d)) / 9;
    return clampD(W[7] * D0(4) + (1 - W[7]) * d1);
  };
  const sRecall = (d, s, r, g) =>
    s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1));
  const sForget = (d, s, r) => Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  const sShortTerm = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18]));

  /* Nouvelle carte après une leçon : révision prévue dès le lendemain. */
  function newCard(grade, now) {
    return { d: D0(grade), s: S0(grade), due: now + (grade <= 1 ? 4 * 36e5 : DAY - 30 * MIN), last: now, reps: 1, lapses: 0 };
  }

  /* grade : 1 = À revoir, 2 = Difficile, 3 = Bien, 4 = Facile */
  function schedule(card, grade, now = Date.now()) {
    const c = Object.assign({}, card);
    const elapsed = Math.max(0, (now - (card.last || now)) / DAY);
    if (!card.s) {
      c.d = D0(grade);
      c.s = S0(grade);
    } else if (elapsed < 0.5) {
      c.s = Math.max(0.1, sShortTerm(card.s, grade));
      c.d = nextD(card.d, grade);
    } else {
      const r = retrievability(elapsed, card.s);
      c.d = nextD(card.d, grade);
      c.s = grade === 1 ? sForget(card.d, card.s, r) : sRecall(card.d, card.s, r, grade);
    }
    c.reps = (card.reps || 0) + 1;
    if (grade === 1) c.lapses = (card.lapses || 0) + 1;
    c.last = now;
    c.due = grade === 1 ? now + 10 * MIN : now + interval(c.s) * DAY;
    return c;
  }

  function preview(card, now = Date.now()) {
    const out = {};
    [1, 2, 3, 4].forEach((g) => {
      out[g] = schedule(card, g, now).due - now;
    });
    return out;
  }

  function fmtDelay(ms) {
    const m = Math.round(ms / MIN);
    if (m < 60) return `${Math.max(1, m)} min`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} h`;
    const d = Math.round(ms / DAY);
    if (d < 31) return `${d} j`;
    const mo = Math.round(d / 30.4);
    if (mo < 12) return `${mo} mois`;
    const y = Math.round((d / 365) * 10) / 10;
    return `${String(y).replace('.', ',')} an${y >= 2 ? 's' : ''}`;
  }

  /* Maîtrise 0–4 (pétales de la fleur). */
  function mastery(card) {
    if (!card) return 0;
    if (card.s < 4) return 1;
    if (card.s < 12) return 2;
    if (card.s < 30) return 3;
    return 4;
  }
  const MASTERY_LABELS = ['Pas encore vu', 'En germination', 'En bouton', 'En fleur', 'Épanoui'];

  function recallNow(card, now = Date.now()) {
    if (!card) return 0;
    return retrievability(Math.max(0, (now - card.last) / DAY), card.s);
  }

  S.srs = { newCard, schedule, preview, fmtDelay, mastery, MASTERY_LABELS, recallNow, DAY };
})();
