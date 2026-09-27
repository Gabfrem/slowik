/* Słowik — utilitaires partagés, bus d'événements. */
(function () {
  'use strict';
  const S = (window.S = window.S || {});
  S.data = S.data || {};
  S.views = S.views || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const sample = (arr, n) => shuffle(arr).slice(0, n);
  const uniq = (arr) => Array.from(new Set(arr));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const debounce = (fn, ms) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };

  /* Texte polonais : suppression des signes, normalisation pour comparer des réponses. */
  const PL_MAP = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
  const strip = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[ąćęłńóśźż]/g, (c) => PL_MAP[c])
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  const norm = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[’`´]/g, "'")
      .replace(/[.,!?;:¿¡«»"“”„…—–()\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const slug = (s) =>
    strip(s)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  /* Distance de Levenshtein (tolérance aux fautes de frappe). */
  function lev(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  /* Dates locales au format AAAA-MM-JJ. */
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const keyToDate = (k) => {
    const [y, m, d] = k.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const addDays = (k, n) => {
    const d = keyToDate(k);
    d.setDate(d.getDate() + n);
    return dayKey(d);
  };
  const diffDays = (a, b) => Math.round((keyToDate(b) - keyToDate(a)) / 864e5);

  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  /* Typographie française : espaces fines insécables avant ? ! : ; » */
  const frTypo = (s) =>
    String(s)
      .replace(/ ([?!:;»])/g, ' $1')
      .replace(/« /g, '« ');

  /* Mini-formatage : **gras**, __italique__, {mot polonais cliquable} */
  function fmt(s) {
    return frTypo(esc(s))
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<em>$1</em>')
      .replace(/\{(.+?)\}/g, (m, t) => `<button type="button" class="say-inline pl" data-say="${t}">${t}</button>`);
  }

  const plural = (n, one, many) => `${n} ${Math.abs(n) > 1 ? many : one}`;
  const fmtTime = (ms) => {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(s / 60)}:${pad(s % 60)}`;
  };
  const fmtInt = (n) => Math.round(n).toLocaleString('fr-FR');

  /* Bus d'événements minimaliste. */
  const bus = {
    h: {},
    on(e, f) {
      (this.h[e] = this.h[e] || []).push(f);
      return () => this.off(e, f);
    },
    off(e, f) {
      this.h[e] = (this.h[e] || []).filter((x) => x !== f);
    },
    emit(e, d) {
      (this.h[e] || []).slice().forEach((f) => {
        try {
          f(d);
        } catch (err) {
          console.error('[bus]', e, err);
        }
      });
    },
  };

  /* Couleur d'accent → variables CSS inline. */
  const COLORS = ['red', 'orange', 'yellow', 'green', 'pink', 'blue', 'teal', 'violet'];
  const cvars = (c) => `--c:var(--${c});--c-d:var(--${c}-d);--on:${c === 'yellow' ? '#1D1A2C' : '#fff'}`;

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  S.util = {
    $, $$, esc, clamp, lerp, rand, randi, pick, shuffle, sample, uniq, sleep, debounce,
    strip, norm, slug, lev, dayKey, keyToDate, addDays, diffDays, hash, frTypo, fmt,
    plural, fmtTime, fmtInt, COLORS, cvars, cssVar,
  };
  S.bus = bus;
})();
