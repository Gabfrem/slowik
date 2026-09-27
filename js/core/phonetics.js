/* Słowik — phonétique : prononciation figurée « à la française » et accent tonique.
   Le polonais s'écrit comme il se prononce : on découpe en phonèmes, on applique
   l'assimilation de sonorité (chleb → « hlèp », wtorek → « ftorèk », przez → « pchès »),
   puis on transcrit avec des conventions lisibles pour un francophone. */
(function () {
  'use strict';
  const { esc } = S.util;

  const VOWELS = new Set(['a', 'ą', 'e', 'ę', 'i', 'o', 'u', 'y']);
  const VOWEL_LETTERS = 'aąeęioóuy';
  const DEVOICE = { b: 'p', d: 't', g: 'k', w: 'f', z: 's', ź: 'ś', ż: 'sz', rz: 'sz', dz: 'c', dź: 'ć', dż: 'cz' };
  const VOICE = { p: 'b', t: 'd', k: 'g', f: 'w', s: 'z', ś: 'ź', sz: 'ż', c: 'dz', ć: 'dź', cz: 'dż', h: 'h' };
  const SOFT = { c: 'ć', s: 'ś', z: 'ź', n: 'ń' };
  const SOFT_SET = new Set(['ć', 'dź', 'ś', 'ź']);

  const isV = (p) => VOWELS.has(p);
  const isObs = (p) => p in DEVOICE || p in VOICE;
  const isVoiceless = (p) => p in VOICE;

  /* Découpe un mot en phonèmes. « I » = i de palatalisation (glide), « W » = u de la diphtongue au. */
  function tokenize(word) {
    const w = word.toLowerCase();
    const out = [];
    const vowelAt = (k) => k < w.length && VOWEL_LETTERS.includes(w[k]);
    let i = 0;
    while (i < w.length) {
      const c = w[i];
      const two = w.substr(i, 2);
      if (w.substr(i, 3) === 'dzi') {
        out.push('dź');
        i += 3;
        if (!vowelAt(i)) out.push('i');
        continue;
      }
      if (two === 'dż' || two === 'dź' || two === 'dz') { out.push(two); i += 2; continue; }
      if (two === 'ch') { out.push('h'); i += 2; continue; }
      if (two === 'cz' || two === 'sz' || two === 'rz') { out.push(two); i += 2; continue; }
      if (SOFT[c] && w[i + 1] === 'i') {
        out.push(SOFT[c]);
        i += 2;
        if (!vowelAt(i)) out.push('i');
        continue;
      }
      if (c === 'i') {
        const prev = out[out.length - 1];
        if (prev && !isV(prev) && prev !== 'j' && prev !== 'I' && vowelAt(i + 1)) out.push('I');
        else out.push('i');
        i++;
        continue;
      }
      if (c === 'u' && out[out.length - 1] === 'a') { out.push('W'); i++; continue; }
      if (c === 'ó') { out.push('u'); i++; continue; }
      if (c === 'x') { out.push('k', 's'); i++; continue; }
      if (c === 'v') { out.push('w'); i++; continue; }
      if (c === 'q') { out.push('k'); i++; continue; }
      if (/[a-ząćęłńśźż]/.test(c)) out.push(c);
      i++;
    }
    return out;
  }

  /* Assimilation régressive + assourdissement final + dévoisement progressif de w / rz. */
  function assimilate(ph) {
    const out = ph.slice();
    let next = 'end';
    for (let k = out.length - 1; k >= 0; k--) {
      const p = out[k];
      if (p === ' ') continue;
      if (isObs(p)) {
        let q = p;
        if (next === 'end' || next === 'vl') q = isVoiceless(p) ? p : DEVOICE[p];
        else if (next === 'vd') q = isVoiceless(p) ? VOICE[p] : p;
        out[k] = q;
        if ((ph[k] === 'w' || ph[k] === 'rz') && !isVoiceless(q)) next = 'son';
        else next = isVoiceless(q) ? 'vl' : 'vd';
      } else {
        next = 'son';
      }
    }
    for (let k = 1; k < out.length; k++) {
      if ((ph[k] === 'w' || ph[k] === 'rz') && out[k] === ph[k]) {
        let j = k - 1;
        if (out[j] === ' ') j--;
        if (j >= 0 && isObs(out[j]) && isVoiceless(out[j])) out[k] = DEVOICE[ph[k]];
      }
    }
    return out;
  }

  const BASE = {
    a: 'a', e: 'è', i: 'i', o: 'o', u: 'ou', y: 'y', I: 'i', W: 'ou',
    b: 'b', c: 'ts', ć: 'tch', cz: 'tch', d: 'd', dz: 'dz', dź: 'dj', dż: 'dj', f: 'f', g: 'g', h: 'h', j: 'y', k: 'k',
    l: 'l', ł: 'w', m: 'm', n: 'n', ń: 'gn', p: 'p', r: 'r', rz: 'j', s: 's', ś: 'ch', sz: 'ch', t: 't', w: 'v', z: 'z', ź: 'j', ż: 'j',
  };

  /* Transcrit une suite de phonèmes ; la voyelle accentuée est encadrée par \u0001…\u0002. */
  function spell(ph, stressIdx) {
    let s = '';
    let nucleus = -1;
    for (let k = 0; k < ph.length; k++) {
      const p = ph[k];
      const nx = ph[k + 1];
      if (p === ' ') { s += ' '; continue; }
      let h;
      const endish = !nx || nx === ' ';
      if (p === 'ą') h = endish ? 'on' : nx === 'p' || nx === 'b' ? 'om' : nx === 'l' || nx === 'ł' ? 'o' : 'on';
      else if (p === 'ę') h = endish ? 'è' : nx === 'p' || nx === 'b' ? 'èm' : nx === 'l' || nx === 'ł' ? 'è' : 'èn';
      else if (SOFT_SET.has(p)) {
        const base = BASE[p];
        if (nx && isV(nx)) h = nx === 'i' ? base : base + 'i';
        else h = base + '’';
      } else if (p === 'g' && nx && (nx === 'e' || nx === 'ę' || nx === 'i' || nx === 'I' || nx === 'y')) h = 'gu';
      else if (p === 's' && k > 0 && isV(ph[k - 1]) && ph[k - 1] !== 'ą' && ph[k - 1] !== 'ę' && nx && isV(nx)) h = 'ss';
      else h = BASE[p] || p;
      if (isV(p)) {
        nucleus++;
        if (nucleus === stressIdx) h = '\u0001' + h + '\u0002';
      }
      if (s && h && /y$/.test(s) && /^y/.test(h)) s += '-';
      s += h;
    }
    return s;
  }

  const splitWords = (text) =>
    String(text)
      .toLowerCase()
      .replace(/[^a-ząćęłńóśźżxvq\s-]/g, ' ')
      .split(/[\s-]+/)
      .filter(Boolean);

  /* Prononciation figurée d'un texte (mot ou phrase). opts.st : index de syllabe accentuée forcé. */
  function hint(text, opts = {}) {
    if (opts.pr) return opts.pr.replace(/([A-ZÀ-ÖØ-Þ]+)/g, (m) => '\u0001' + m.toLowerCase() + '\u0002');
    return String(text)
      .split('/')
      .map((part) => {
        const words = splitWords(part);
        const groups = [];
        for (let i = 0; i < words.length; i++) {
          if ((words[i] === 'w' || words[i] === 'z') && i + 1 < words.length) {
            groups.push([words[i], words[i + 1]]);
            i++;
          } else groups.push([words[i]]);
        }
        const single = groups.length === 1 && text.indexOf('/') < 0;
        return groups
          .map((g) => {
            const ph = g.length === 2 ? tokenize(g[0]).concat([' '], tokenize(g[1])) : tokenize(g[0]);
            const as = assimilate(ph);
            const n = as.filter(isV).length;
            const st = single && opts.st != null ? opts.st : n >= 2 ? n - 2 : -1;
            return spell(as, st);
          })
          .join(' ');
      })
      .join(' / ');
  }

  const hintHTML = (text, opts) => esc(hint(text, opts)).replace(/\u0001/g, '<b>').replace(/\u0002/g, '</b>');

  /* Souligne la voyelle accentuée (avant-dernière syllabe) dans l'orthographe polonaise. */
  function stressHTML(text, st) {
    const parts = String(text).split(/(\s+|\/|-)/);
    const wordsCount = parts.filter((p) => /[a-ząćęłńóśźż]/i.test(p)).length;
    return parts
      .map((part) => {
        if (!/[a-ząćęłńóśźż]/i.test(part)) return esc(part);
        const low = part.toLowerCase();
        const pos = [];
        for (let i = 0; i < low.length; i++) {
          const c = low[i];
          if (!VOWEL_LETTERS.includes(c)) continue;
          if (c === 'i' && i > 0 && !VOWEL_LETTERS.includes(low[i - 1]) && i + 1 < low.length && VOWEL_LETTERS.includes(low[i + 1])) continue;
          if (c === 'u' && i > 0 && low[i - 1] === 'a') continue;
          pos.push(i);
        }
        if (pos.length < 2) return esc(part);
        const k = wordsCount === 1 && st != null ? st : pos.length - 2;
        const at = pos[Math.max(0, Math.min(pos.length - 1, k))];
        return esc(part.slice(0, at)) + '<u class="stress">' + esc(part[at]) + '</u>' + esc(part.slice(at + 1));
      })
      .join('');
  }

  S.phon = { tokenize, assimilate, hint, hintHTML, stressHTML };
})();
