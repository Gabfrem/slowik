/* Słowik — audio : synthèse vocale polonaise, reconnaissance vocale, effets sonores (Web Audio, sans fichier). */
(function () {
  'use strict';
  const { norm, strip, lev } = S.util;

  /* ───────────── Synthèse vocale ───────────── */
  const synth = window.speechSynthesis || null;
  let plVoices = [];
  let chosen = null;
  let current = null;

  const score = (v) => {
    const n = v.name.toLowerCase();
    let s = 0;
    if (/natural|neural/.test(n)) s += 60;
    if (/online/.test(n)) s += 20;
    if (/google/.test(n)) s += 30;
    if (/zofia|marek|agnieszka|paulina|ewa|maja/.test(n)) s += 4;
    if (v.localService) s += 1;
    return s;
  };

  function refresh() {
    if (!synth) return;
    const all = synth.getVoices() || [];
    const list = all.filter((v) => /^pl([-_]|$)/i.test(v.lang));
    list.sort((a, b) => score(b) - score(a));
    const changed = list.length !== plVoices.length;
    plVoices = list;
    pickVoice();
    if (changed) S.bus.emit('voices', plVoices);
  }
  function pickVoice() {
    const want = S.store.state.settings.voice;
    chosen = plVoices.find((v) => v.voiceURI === want) || plVoices[0] || null;
  }
  const maleRe = /marek|krzysztof|adam|jacek|jan\b|piotr|male|męż/i;
  const femaleRe = /zofia|paulina|agnieszka|ewa|maja|female|kobiet/i;
  function voiceFor(g) {
    if (plVoices.length < 2) return chosen;
    if (g === 'm') return plVoices.find((v) => maleRe.test(v.name)) || chosen;
    if (g === 'f') return plVoices.find((v) => femaleRe.test(v.name)) || chosen;
    return chosen;
  }

  const clean = (t) =>
    String(t)
      .replace(/\s*\/\s*/g, ', ')
      .replace(/___/g, '…')
      .replace(/[«»"“”„—–]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  function speak(text, opts = {}) {
    return new Promise((resolve) => {
      if (!synth || !text) return resolve(false);
      if (!plVoices.length) refresh();
      // Sans voix polonaise, mieux vaut se taire qu'entendre le polonais lu avec un accent français.
      if (!chosen) return resolve(false);
      try {
        synth.cancel();
      } catch (e) {}
      const u = new SpeechSynthesisUtterance(clean(text));
      u.lang = 'pl-PL';
      const v = opts.g ? voiceFor(opts.g) : chosen;
      if (v) u.voice = v;
      const base = S.store.state.settings.rate || 0.9;
      u.rate = Math.max(0.3, Math.min(1.6, base * (opts.slow ? 0.62 : 1) * (opts.rate || 1)));
      u.pitch = opts.pitch || 1;
      u.volume = 1;
      current = u;
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        if (current === u) current = null;
        S.bus.emit('speak:end', { text });
        resolve(ok);
      };
      u.onend = () => done(true);
      u.onerror = () => done(false);
      S.bus.emit('speak:start', { text });
      synth.speak(u);
      setTimeout(() => {
        if (!synth.speaking && !synth.pending) done(false);
      }, 2500);
      setTimeout(() => done(true), 15000);
    });
  }
  function stop() {
    try {
      if (synth) synth.cancel();
    } catch (e) {}
  }

  if (synth) {
    refresh();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', refresh);
    else synth.onvoiceschanged = refresh;
    [250, 800, 2000, 4000].forEach((t) => setTimeout(refresh, t));
  }

  /* ───────────── Reconnaissance vocale ───────────── */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let rec = null;

  function listen(opts = {}) {
    return new Promise((resolve) => {
      if (!SR) return resolve({ ok: false, error: 'unsupported' });
      stop();
      try {
        if (rec) rec.abort();
      } catch (e) {}
      rec = new SR();
      rec.lang = 'pl-PL';
      rec.interimResults = true;
      rec.maxAlternatives = 5;
      rec.continuous = false;
      let finalText = '';
      let alts = [];
      let settled = false;
      const finish = (r) => {
        if (settled) return;
        settled = true;
        clearTimeout(guard);
        resolve(r);
      };
      rec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
            alts = Array.from(res).map((a) => a.transcript);
          } else interim += res[0].transcript;
        }
        if (opts.onInterim) opts.onInterim(finalText + interim);
      };
      rec.onerror = (e) => finish({ ok: false, error: e.error || 'error' });
      rec.onend = () => finish({ ok: !!finalText, text: finalText, alts: alts.length ? alts : [finalText] });
      const guard = setTimeout(() => {
        try {
          rec.stop();
        } catch (e) {}
      }, opts.timeout || 8000);
      try {
        rec.start();
      } catch (e) {
        finish({ ok: false, error: 'start' });
      }
    });
  }
  function stopListening() {
    try {
      if (rec) rec.stop();
    } catch (e) {}
  }

  /* Compare la phrase attendue à ce qui a été entendu : score global + mots reconnus. */
  function compare(target, heard) {
    const tw = norm(target).split(' ').filter(Boolean);
    const hw = norm(heard).split(' ').filter(Boolean);
    const hs = hw.map(strip);
    const used = new Set();
    const wordsRes = tw.map((w) => {
      const sw = strip(w);
      let best = -1;
      let bestD = 99;
      hs.forEach((h, i) => {
        if (used.has(i)) return;
        const d = lev(sw, h);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      const ok = best >= 0 && bestD <= Math.max(1, Math.floor(sw.length / 4));
      if (ok) used.add(best);
      return { w, ok };
    });
    const a = strip(norm(target)).replace(/ /g, '');
    const b = strip(norm(heard)).replace(/ /g, '');
    const sim = a.length ? 1 - lev(a, b) / Math.max(a.length, b.length) : 0;
    const ratio = wordsRes.filter((x) => x.ok).length / Math.max(1, wordsRes.length);
    return { score: Math.max(0, Math.min(1, (sim + ratio) / 2)), words: wordsRes };
  }
  function bestCompare(target, alts) {
    let best = { score: 0, words: [] };
    let text = alts[0] || '';
    alts.forEach((a) => {
      const r = compare(target, a);
      if (r.score > best.score) {
        best = r;
        text = a;
      }
    });
    return Object.assign(best, { text });
  }

  /* ───────────── Effets sonores synthétisés ───────────── */
  let ctx = null;
  let master = null;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
    }
    master.gain.value = S.store.state.settings.volume != null ? S.store.state.settings.volume : 0.6;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, t0, dur, o = {}) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + t0;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const peak = o.gain || 0.2;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (o.release || 0.15));
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur + (o.release || 0.15) + 0.05);
  }
  function noise(t0, dur, o = {}) {
    const c = ac();
    if (!c) return;
    const t = c.currentTime + t0;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.from || 800, t);
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    f.Q.value = o.q || 1.2;
    const g = c.createGain();
    g.gain.setValueAtTime(o.gain || 0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(master);
    src.start(t);
  }
  const on = () => S.store.state.settings.sound;
  const sfx = {
    tap() { if (on()) tone(740, 0, 0.025, { type: 'triangle', gain: 0.07, release: 0.05 }); },
    select() { if (on()) { tone(520, 0, 0.05, { type: 'triangle', gain: 0.1, to: 780 }); } },
    correct() {
      if (!on()) return;
      tone(659.25, 0, 0.09, { type: 'triangle', gain: 0.2 });
      tone(987.77, 0.085, 0.2, { type: 'triangle', gain: 0.2 });
      tone(1975.5, 0.085, 0.18, { type: 'sine', gain: 0.04 });
    },
    wrong() {
      if (!on()) return;
      tone(233, 0, 0.12, { type: 'triangle', gain: 0.16, to: 190 });
      tone(185, 0.11, 0.2, { type: 'triangle', gain: 0.14, to: 150 });
    },
    match() { if (on()) { tone(880, 0, 0.06, { type: 'sine', gain: 0.14 }); tone(1320, 0.05, 0.1, { type: 'sine', gain: 0.1 }); } },
    flip() { if (on()) noise(0, 0.18, { from: 400, to: 2400, gain: 0.08 }); },
    whoosh() { if (on()) noise(0, 0.3, { from: 1800, to: 300, gain: 0.07, q: 0.8 }); },
    pop() { if (on()) tone(420, 0, 0.07, { type: 'sine', gain: 0.16, to: 900 }); },
    star(i = 0) { if (on()) { const f = 784 * Math.pow(1.26, i); tone(f, 0, 0.1, { type: 'triangle', gain: 0.18 }); tone(f * 2, 0.02, 0.2, { gain: 0.05 }); } },
    complete() {
      if (!on()) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.22, { type: 'triangle', gain: 0.17 }));
      tone(1567.98, 0.42, 0.5, { type: 'sine', gain: 0.07 });
    },
    levelup() {
      if (!on()) return;
      [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.08, 0.25, { type: 'triangle', gain: 0.15 }));
      noise(0.45, 0.6, { from: 3000, to: 8000, gain: 0.05, type: 'highpass' });
    },
    tick() { if (on()) tone(1400, 0, 0.012, { type: 'square', gain: 0.03, release: 0.02 }); },
    combo(n = 3) { if (on()) { const f = 660 + n * 40; tone(f, 0, 0.07, { type: 'square', gain: 0.05 }); tone(f * 1.5, 0.06, 0.12, { type: 'triangle', gain: 0.12 }); } },
  };

  /* Débloque l'audio au premier geste (politique des navigateurs). */
  const unlock = () => {
    ac();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);

  S.audio = {
    speak, stop, refresh, pickVoice, voiceFor,
    get voices() { return plVoices; },
    get voice() { return chosen; },
    hasTTS: () => !!synth,
    hasVoice: () => plVoices.length > 0,
    canListen: () => !!SR,
    listen, stopListening, compare, bestCompare,
    sfx,
  };
})();
