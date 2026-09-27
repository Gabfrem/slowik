/* Słowik — composants d'interface : icônes, mascotte, ornements folkloriques, fenêtres, notifications. */
(function () {
  'use strict';
  const { esc, $, clamp, frTypo } = S.util;

  /* ───────────── Icônes (trait 2 px, 24 × 24) ───────────── */
  const P = {
    home: '<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.6V20h12.4V9.6"/><path d="M10 20v-5.2h4V20"/>',
    path: '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.6"/>',
    cards: '<rect x="3" y="7.5" width="12.5" height="13.5" rx="2.4"/><path d="M8 3.5h10.2A2.3 2.3 0 0 1 20.5 5.8v10.7"/>',
    wave: '<path d="M4 10v4M8 6.5v11M12 3.5v17M16 7.5v9M20 10.5v3"/>',
    book: '<path d="M12 6.6C10 5 7 4.5 3 5v13.2c4-.5 7 0 9 1.6 2-1.6 5-2.1 9-1.6V5c-4-.5-7 0-9 1.6z"/><path d="M12 6.6v13.2"/>',
    chat: '<path d="M20 11.5a7.5 7.5 0 0 1-11.3 6.5L4 19.6l1.5-4.2A7.5 7.5 0 1 1 20 11.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
    gym: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.2v5.6M20.5 9.2v5.6M6.5 12h11"/>',
    lexicon: '<path d="M4.5 4.5h4v15h-4zM10 4.5h4v15h-4z"/><path d="m15.4 5.6 3.8-1 3.3 14.4-3.8 1z"/>',
    tulip: '<path d="M12 21v-8.2"/><path d="M12 12.8c-3.4 0-5.9-2.4-5.9-6.3 2 0 3.4.8 4.2 2L12 4l1.7 4.5c.8-1.2 2.2-2 4.2-2 0 3.9-2.5 6.3-5.9 6.3z"/><path d="M12 18.2c-1.7-2.2-4.4-2.8-6.6-2.4M12 18.2c1.7-2.2 4.4-2.8 6.6-2.4"/>',
    chart: '<path d="M3.5 20.5h17"/><path d="M6.5 16.5v-5M11 16.5V6M15.5 16.5v-8M20 16.5v-3"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    speaker: '<path d="M11 5.2 6.4 9H3.5v6h2.9l4.6 3.8z"/><path d="M15.3 8.7a4.8 4.8 0 0 1 0 6.6M18.2 5.8a9 9 0 0 1 0 12.4"/>',
    mic: '<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11.2a6.5 6.5 0 0 0 13 0M12 17.8V21"/>',
    check: '<path d="m4.5 12.8 4.8 4.7L19.5 7"/>',
    x: '<path d="M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8"/>',
    flame: '<path d="M12 21.2c-3.9 0-6.9-2.7-6.9-6.5 0-3.3 2.2-5.1 3.5-7.2.3 1.6 1.2 2.5 2.2 2.9 0-3.1 1.6-5.7 4.1-6.9-.4 2.6.6 4.4 2.3 6.2 1.2 1.3 1.7 2.8 1.7 4.9 0 3.9-3 6.6-6.9 6.6z"/>',
    star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    arrowR: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    arrowL: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
    chevR: '<path d="m9.5 6 6 6-6 6"/>',
    chevL: '<path d="m14.5 6-6 6 6 6"/>',
    chevD: '<path d="m6 9.5 6 6 6-6"/>',
    play: '<path d="M7.5 5v14l11-7z" fill="currentColor"/>',
    pause: '<path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" fill="currentColor"/>',
    refresh: '<path d="M20 11.5a8 8 0 1 0-2.4 5.8"/><path d="M20.5 4.5v6.5H14"/>',
    eye: '<path d="M2.5 12S6 5.2 12 5.2 21.5 12 21.5 12 18 18.8 12 18.8 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M4 4l16 16"/><path d="M9.9 5.5A9 9 0 0 1 12 5.2c6 0 9.5 6.8 9.5 6.8a16 16 0 0 1-2.8 3.6M6.4 7.2A16 16 0 0 0 2.5 12S6 18.8 12 18.8c1.6 0 3-.5 4.3-1.1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.2A3 3 0 0 0 7 10M17 6h2.8A3 3 0 0 1 17 10M12 14v3.5M8.5 21h7M9.5 17.5h5V21h-5z"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7.2V12l3.2 2.1"/>',
    bolt: '<path d="M13.2 2.5 4.8 13.6H12l-1.2 7.9 8.4-11.1H12z"/>',
    heart: '<path d="M12 20.2S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8C20.5 15 12 20.2 12 20.2z"/>',
    sparkles: '<path d="M11 3.5 12.6 8 17 9.6 12.6 11.2 11 15.7 9.4 11.2 5 9.6 9.4 8z"/><path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7.5 14h9"/>',
    bulb: '<path d="M9.2 18h5.6M10.3 21h3.4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/>',
    info: '<circle cx="12" cy="12" r="8.8"/><path d="M12 11v5.2M12 7.8h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6z"/>',
    download: '<path d="M12 4v11M7 10.2l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 13.8l5-5 5 5M5 4h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    shuffle: '<path d="M3 7h3.4c2 0 3.2 1 4.2 2.6l2.7 4.8c.9 1.6 2.2 2.6 4.2 2.6H21M3 17h3.4c1.4 0 2.4-.5 3.2-1.4M14.3 8.4c.8-.9 1.8-1.4 3.2-1.4H21M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    target: '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    search: '<circle cx="11" cy="11" r="6.8"/><path d="m20 20-4.1-4.1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    hash: '<path d="M5 9h15M4 15h15M10 4 8 20M16 4l-2 16"/>',
    type: '<path d="M4 7V5h16v2M12 5v14M9 19h6"/>',
    ear: '<path d="M7 9a5 5 0 0 1 10 0c0 3-2.5 3.5-3 6s-1.3 5-4 5a3 3 0 0 1-3-3"/><path d="M10 10.5a2 2 0 0 1 4 0"/>',
    puzzle: '<path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z"/>',
    snow: '<path d="M12 2.5v19M4.2 7l15.6 10M4.2 17 19.8 7"/><path d="m9.5 4 2.5 2 2.5-2M9.5 20l2.5-2 2.5 2"/>',
    feather: '<path d="M20 4c-6 0-11 3.5-12.5 10L6 20"/><path d="M20 4c0 7-4.5 11.5-11 12M12 8.5l-2 7.5"/>',
    globe: '<circle cx="12" cy="12" r="8.8"/><path d="M3.2 12h17.6M12 3.2c2.4 2.6 3.6 5.5 3.6 8.8S14.4 18.2 12 20.8C9.6 18.2 8.4 15.3 8.4 12S9.6 5.8 12 3.2z"/>',
    turtle: '<path d="M4 15.5c0-4 3.6-7.5 8-7.5s8 3.5 8 7.5z"/><path d="M20 15.5h1.5a1.5 1.5 0 0 0 0-3H20M7 15.5 6 18M17 15.5l1 2.5M9 8.8l1.5 6.7M15 8.8l-1.5 6.7"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.8 4.2-5.8 7.5-5.8s6.3 2 7.5 5.8"/>',
    cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.6 9.1 4.7 4.7 0 0 0 7 18.5z"/>',
    logout: '<path d="M14 4.5h4.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  };
  function icon(name, size = 22, cls = '') {
    return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  }

  /* ───────────── Ornements wycinanki ───────────── */
  const petal = (l, w) => `M0 0C${w} ${-l * 0.35} ${w * 0.7} ${-l * 0.85} 0 ${-l}C${-w * 0.7} ${-l * 0.85} ${-w} ${-l * 0.35} 0 0Z`;
  const orn = {
    rosette(o = {}) {
      const n = o.petals || 8;
      const [c1, c2, c3] = o.colors || ['var(--red)', 'var(--yellow)', 'var(--green)'];
      let s = `<svg class="rosette ${o.cls || ''}" viewBox="-50 -50 100 100" aria-hidden="true">`;
      s += `<g class="ro-outer">`;
      for (let i = 0; i < n; i++) s += `<path d="${petal(47, 11)}" fill="${c1}" transform="rotate(${(i * 360) / n})" style="--i:${i};--rot:rotate(${(i * 360) / n}deg)"/>`;
      s += `</g><g class="ro-mid">`;
      for (let i = 0; i < n; i++) s += `<path d="${petal(31, 8)}" fill="${c2}" transform="rotate(${((i + 0.5) * 360) / n})" style="--i:${i};--rot:rotate(${((i + 0.5) * 360) / n}deg)"/>`;
      s += `</g><circle r="13" fill="${c3}"/>`;
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        s += `<circle cx="${(Math.cos(a) * 8.5).toFixed(2)}" cy="${(Math.sin(a) * 8.5).toFixed(2)}" r="1.6" fill="var(--surface)"/>`;
      }
      s += `<circle r="4" fill="${c1}"/></svg>`;
      return s;
    },
    sprig(stem = 'var(--green)', flower = 'var(--red)') {
      let s = `<svg class="sprig" viewBox="0 0 60 140" aria-hidden="true"><path d="M30 138C30 100 28 60 30 26" stroke="${stem}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      [[110, -1], [92, 1], [74, -1], [56, 1]].forEach(([y, d], i) => {
        s += `<path d="${petal(24 - i * 2, 7)}" fill="${stem}" transform="translate(30 ${y}) rotate(${d * 58})"/>`;
      });
      s += `<g transform="translate(30 22)">`;
      for (let i = 0; i < 6; i++) s += `<path d="${petal(18, 7)}" fill="${flower}" transform="rotate(${i * 60})"/>`;
      s += `<circle r="5" fill="var(--yellow)"/><circle r="2" fill="var(--surface)"/></g></svg>`;
      return s;
    },
    tulip() {
      return `<svg class="tulip" viewBox="0 0 80 120" aria-hidden="true">
        <path d="M40 118V58" stroke="var(--green)" stroke-width="3.5" stroke-linecap="round"/>
        <path d="${petal(30, 9)}" fill="var(--green)" transform="translate(40 100) rotate(-55)"/>
        <path d="${petal(30, 9)}" fill="var(--green)" transform="translate(40 100) rotate(55)"/>
        <path d="M18 22c0 22 9 36 22 36s22-14 22-36c-6 2-10 7-12 12-2-9-6-16-10-22-4 6-8 13-10 22-2-5-6-10-12-12z" fill="var(--red)"/>
        <path d="M30 34c2 10 5 18 10 18s8-8 10-18c-4 3-7 7-10 12-3-5-6-9-10-12z" fill="var(--yellow)"/>
        <circle cx="40" cy="50" r="3" fill="var(--blue)"/></svg>`;
    },
    /* Frise décorative (papier dentelé). */
    frieze(color = 'var(--red)', n = 18) {
      let s = `<svg class="frieze" viewBox="0 0 ${n * 20} 20" preserveAspectRatio="none" aria-hidden="true">`;
      for (let i = 0; i < n; i++) {
        const x = i * 20 + 10;
        s += `<path d="M${x} 2 L${x + 7} 10 L${x} 18 L${x - 7} 10Z" fill="${color}" opacity="${i % 2 ? 0.55 : 1}"/>`;
      }
      return s + '</svg>';
    },
  };

  /* ───────────── Mascotte : Słowik le rossignol ───────────── */
  function mascot(mood = 'idle', size = 140, extra = '') {
    return `<svg class="bird mood-${mood} ${extra}" width="${size}" height="${size}" viewBox="0 0 200 200" aria-hidden="true">
      <ellipse class="b-shadow" cx="104" cy="188" rx="44" ry="6"/>
      <g class="b-all">
        <g class="b-legs" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" fill="none">
          <path d="M98 148 95 176M95 176l-8 4M95 176l1 6M95 176l8 3"/>
          <path d="M118 146l2 30M120 176l-7 4M120 176l2 6M120 176l8 2"/>
        </g>
        <g class="b-tail">
          <g transform="translate(66 126) rotate(-34)"><path d="${petal(70, 17)}" transform="rotate(-90)" fill="var(--teal)"/><path d="${petal(48, 10)}" transform="translate(-10 0) rotate(-90)" fill="var(--yellow)"/><circle cx="-60" r="5" fill="var(--red)"/></g>
          <g transform="translate(64 130) rotate(-8)"><path d="${petal(76, 17)}" transform="rotate(-90)" fill="var(--blue)"/><path d="${petal(52, 10)}" transform="translate(-10 0) rotate(-90)" fill="var(--orange)"/><circle cx="-66" r="5" fill="var(--yellow)"/></g>
          <g transform="translate(66 134) rotate(18)"><path d="${petal(66, 16)}" transform="rotate(-90)" fill="var(--violet)"/><path d="${petal(44, 9)}" transform="translate(-10 0) rotate(-90)" fill="var(--pink)"/><circle cx="-56" r="5" fill="var(--green)"/></g>
        </g>
        <g class="b-body">
          <ellipse cx="104" cy="122" rx="47" ry="36" transform="rotate(-16 104 122)" fill="var(--red)"/>
          <ellipse cx="124" cy="134" rx="25" ry="16" transform="rotate(-24 124 134)" fill="var(--yellow)"/>
          <g fill="var(--surface)"><circle cx="112" cy="140" r="2.6"/><circle cx="121" cy="136" r="2.6"/><circle cx="130" cy="131" r="2.6"/><circle cx="139" cy="125" r="2.6"/><circle cx="118" cy="146" r="2"/><circle cx="128" cy="142" r="2"/><circle cx="137" cy="136" r="2"/></g>
        </g>
        <g class="b-wing">
          <path d="M140 104C120 83 80 90 60 119C88 128 122 127 140 104Z" fill="var(--green)"/>
          <path d="M135 106C119 92 91 97 76 117C97 122 121 121 135 106Z" fill="var(--yellow)"/>
          <path d="M130 108C118 100 100 102 90 114C104 117 120 116 130 108Z" fill="var(--blue)"/>
          <g fill="var(--surface)"><circle cx="72" cy="117" r="2.2"/><circle cx="84" cy="104" r="2.2"/><circle cx="100" cy="96" r="2.2"/><circle cx="118" cy="94" r="2.2"/></g>
        </g>
        <g class="b-head">
          <circle cx="146" cy="84" r="28" fill="var(--red)"/>
          <g class="b-crest">
            <path d="${petal(20, 6)}" transform="translate(140 60) rotate(-35)" fill="var(--green)"/>
            <path d="${petal(24, 6)}" transform="translate(143 59) rotate(-8)" fill="var(--yellow)"/>
            <path d="${petal(19, 6)}" transform="translate(147 60) rotate(20)" fill="var(--blue)"/>
          </g>
          <circle cx="161" cy="96" r="5.5" fill="var(--pink)" opacity=".75"/>
          <g class="b-beak">
            <path class="b-beak-top" d="M170 80 190 87.5 170 92Z" fill="var(--orange)"/>
            <path class="b-beak-bot" d="M170 89 186 91 170 95Z" fill="var(--yellow-d)"/>
          </g>
          <g class="b-eye">
            <circle cx="153" cy="79" r="9" fill="var(--surface)"/>
            <circle class="b-pupil" cx="155" cy="80" r="4.8" fill="var(--ink)"/>
            <circle cx="156.6" cy="78" r="1.6" fill="#fff"/>
            <ellipse class="b-lid" cx="153" cy="79" rx="10" ry="10" fill="var(--red)"/>
          </g>
        </g>
      </g>
      <g class="b-zzz"><text x="170" y="52">z</text><text x="182" y="36">z</text><text x="192" y="22">z</text></g>
      <g class="b-notes"><text x="178" y="50">♪</text><text x="30" y="70">♫</text></g>
    </svg>`;
  }
  function setMood(el, mood) {
    const svg = el && (el.matches && el.matches('svg.bird') ? el : el.querySelector('svg.bird'));
    if (!svg) return;
    svg.setAttribute('class', svg.getAttribute('class').replace(/mood-\w+/, 'mood-' + mood));
  }

  /* ───────────── Petits composants ───────────── */
  function say(text, o = {}) {
    const cls = ['say', o.big ? 'say-big' : '', o.cls || ''].join(' ');
    const attrs = `data-say="${esc(text)}"${o.slow ? ' data-slow="1"' : ''}${o.g ? ` data-g="${o.g}"` : ''}`;
    const label = o.slow ? 'Écouter lentement' : 'Écouter';
    const inner = o.slow ? icon('turtle', o.big ? 28 : 18) : icon('speaker', o.big ? 30 : 18);
    return `<button type="button" class="${cls}" ${attrs} aria-label="${label}" title="${label}">${inner}<span class="say-wave"><i></i><i></i><i></i></span></button>`;
  }
  function ring(pct, o = {}) {
    const size = o.size || 56;
    const sw = o.stroke || 6;
    const r = (size - sw) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - clamp(pct, 0, 1));
    return `<svg class="ring ${o.cls || ''}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="--c-ring:${o.color || 'var(--green)'}">
      <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}"/>
      <circle class="ring-fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${c.toFixed(2)}" data-off="${off.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg>`;
  }
  /* Déclenche l'animation des anneaux fraîchement insérés. */
  function animateRings(root = document) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        root.querySelectorAll('.ring-fill[data-off]').forEach((c) => {
          c.style.strokeDashoffset = c.dataset.off;
          c.removeAttribute('data-off');
        });
        root.querySelectorAll('.bar-fill[data-w]').forEach((b) => {
          b.style.width = b.dataset.w;
          b.removeAttribute('data-w');
        });
      })
    );
  }
  function bar(pct, o = {}) {
    return `<div class="bar ${o.cls || ''}" style="${o.color ? `--c-bar:${o.color}` : ''}"><div class="bar-fill" style="width:0" data-w="${(clamp(pct, 0, 1) * 100).toFixed(1)}%"></div></div>`;
  }
  /* Rampe ordinale d'une seule teinte (vert clair → vert profond) pour la maîtrise 0–4. */
  const MASTERY_COLORS = [
    'var(--line-2)',
    'color-mix(in srgb, var(--green) 40%, var(--surface-3))',
    'color-mix(in srgb, var(--green) 65%, var(--surface-3))',
    'var(--green)',
    'var(--green-d)',
  ];
  function flower(level, size = 26) {
    const col = MASTERY_COLORS[level];
    let s = `<svg class="flower lv${level}" width="${size}" height="${size}" viewBox="-12 -12 24 24" role="img" aria-label="Maîtrise ${level}/4">`;
    for (let i = 0; i < 4; i++) {
      const on = i < level;
      s += `<path d="${petal(10.5, 4.2)}" transform="rotate(${i * 90 + 45})" style="fill:${on ? col : 'none'};stroke:${on ? col : 'var(--line-2)'}" stroke-width="1.4"/>`;
    }
    return s + `<circle r="2.6" style="fill:${level ? 'var(--yellow)' : 'var(--line-2)'}"/></svg>`;
  }
  const GENDER = { m: ['m', 'masculin'], f: ['f', 'féminin'], n: ['n', 'neutre'], pl: ['pl', 'pluriel'] };
  const genderChip = (g) => (g && GENDER[g] ? `<span class="chip g-${g}" title="${GENDER[g][1]}">${GENDER[g][1]}</span>` : '');
  function plWord(w, cls = '') {
    const txt = typeof w === 'string' ? w : w.pl;
    const stressOn = S.store.state.settings.stress;
    const html = stressOn ? S.phon.stressHTML(txt, w && w.st) : esc(txt);
    return `<span class="pl ${cls}">${html}</span>`;
  }
  function hint(w) {
    if (!S.store.state.settings.hints) return '';
    const txt = typeof w === 'string' ? w : w.pl;
    return `<span class="hint" title="Prononciation figurée">[ ${S.phon.hintHTML(txt, typeof w === 'string' ? {} : { st: w.st, pr: w.pr })} ]</span>`;
  }
  /* Phrase polonaise dont chaque mot révèle sa traduction au survol. */
  function glossy(text, extra) {
    return String(text)
      .split(/(\s+)/)
      .map((tok) => {
        if (/^\s+$/.test(tok)) return tok;
        const g = S.content.gloss(tok, extra);
        return g ? `<span class="gw" data-gloss="${esc(g)}" tabindex="0">${esc(tok)}</span>` : `<span class="gw nog">${esc(tok)}</span>`;
      })
      .join('');
  }

  function placeSeg(seg) {
    const on = seg && seg.querySelector('button.on');
    const th = seg && seg.querySelector('.seg-thumb');
    if (!on || !th) return;
    th.style.width = on.offsetWidth + 'px';
    th.style.transform = `translateX(${on.offsetLeft}px)`;
  }

  /* ───────────── Panneau glissant depuis le bas (mobile) ───────────── */
  function sheet(o) {
    const wrap = document.createElement('div');
    wrap.className = 'sheet-back';
    wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(o.title || '')}">
        <div class="sheet-grip" aria-hidden="true"></div>
        ${o.title ? `<div class="sheet-head"><h3>${esc(o.title)}</h3><button type="button" class="icon-btn flat sheet-x" aria-label="Fermer">${icon('x', 20)}</button></div>` : ''}
        <div class="sheet-body">${o.body || ''}</div>
      </div>`;
    $('#modals').appendChild(wrap);
    const panel = wrap.querySelector('.sheet');
    requestAnimationFrame(() => wrap.classList.add('open'));
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      wrap.classList.remove('open');
      wrap.classList.add('closing');
      document.removeEventListener('keydown', onKey, true);
      setTimeout(() => wrap.remove(), 320);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKey, true);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.closest('.sheet-x')) close();
    });
    // Glisser vers le bas pour fermer
    let y0 = null;
    let dy = 0;
    const grip = wrap.querySelector('.sheet-grip');
    const head = wrap.querySelector('.sheet-head');
    [grip, head].filter(Boolean).forEach((h) =>
      h.addEventListener('pointerdown', (e) => {
        y0 = e.clientY;
        dy = 0;
        panel.style.transition = 'none';
        h.setPointerCapture(e.pointerId);
      })
    );
    wrap.addEventListener('pointermove', (e) => {
      if (y0 == null) return;
      dy = Math.max(0, e.clientY - y0);
      panel.style.transform = `translateY(${dy}px)`;
    });
    const end = () => {
      if (y0 == null) return;
      y0 = null;
      panel.style.transition = '';
      panel.style.transform = '';
      if (dy > 90) close();
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', end);
    if (o.onMount) o.onMount(panel, close);
    return close;
  }

  /* ───────────── Fenêtres modales ───────────── */
  function modal(o) {
    return new Promise((resolve) => {
      const root = $('#modals');
      const wrap = document.createElement('div');
      wrap.className = 'modal-back';
      const actions = (o.actions || [{ label: 'OK', value: true, cls: 'btn-primary' }])
        .map((a, i) => `<button type="button" class="btn ${a.cls || 'btn-soft'}" data-i="${i}">${a.icon ? icon(a.icon, 18) : ''}<span>${esc(a.label)}</span></button>`)
        .join('');
      wrap.innerHTML = `<div class="modal ${o.cls || ''}" role="dialog" aria-modal="true" aria-label="${esc(o.title || '')}">
          ${o.dismissible === false ? '' : `<button type="button" class="modal-x icon-btn" aria-label="Fermer">${icon('x', 20)}</button>`}
          ${o.art ? `<div class="modal-art">${o.art}</div>` : ''}
          ${o.title ? `<h2 class="modal-title">${frTypo(esc(o.title))}</h2>` : ''}
          <div class="modal-body">${o.body || ''}</div>
          <div class="modal-actions">${actions}</div>
        </div>`;
      root.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('open'));
      const close = (v) => {
        wrap.classList.remove('open');
        wrap.classList.add('closing');
        document.removeEventListener('keydown', onKey, true);
        setTimeout(() => wrap.remove(), 320);
        resolve(v);
      };
      const onKey = (e) => {
        if (e.key === 'Escape' && o.dismissible !== false) {
          e.stopPropagation();
          close(undefined);
        }
      };
      document.addEventListener('keydown', onKey, true);
      wrap.addEventListener('click', (e) => {
        const b = e.target.closest('[data-i]');
        if (b) return close((o.actions || [{ value: true }])[+b.dataset.i].value);
        if (e.target.closest('.modal-x') || (e.target === wrap && o.dismissible !== false)) close(undefined);
      });
      if (o.onMount) o.onMount(wrap.querySelector('.modal'), close);
      animateRings(wrap);
      const first = wrap.querySelector('.modal-actions .btn-primary, .modal-actions .btn');
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    });
  }
  const confirm = (title, body, ok = 'Confirmer', danger = false) =>
    modal({ title, body: `<p>${body}</p>`, actions: [{ label: 'Annuler', value: false }, { label: ok, value: true, cls: danger ? 'btn-danger' : 'btn-primary' }] });

  /* ───────────── Notifications ───────────── */
  function toast(o) {
    const root = $('#toasts');
    const el = document.createElement('div');
    el.className = `toast t-${o.tone || 'info'}`;
    el.innerHTML = `<div class="toast-ico">${o.emoji ? `<span class="emoji">${o.emoji}</span>` : icon(o.icon || 'info', 20)}</div>
      <div class="toast-txt"><strong>${frTypo(esc(o.title || ''))}</strong>${o.text ? `<span>${frTypo(esc(o.text))}</span>` : ''}</div>`;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add('in'));
    const kill = () => {
      el.classList.remove('in');
      el.classList.add('out');
      setTimeout(() => el.remove(), 420);
    };
    el.addEventListener('click', kill);
    setTimeout(kill, o.ms || 3600);
  }

  /* ───────────── Info-bulles de traduction ───────────── */
  const tip = $('#tip');
  let tipFor = null;
  function showTip(el) {
    const g = el.getAttribute('data-gloss');
    if (!g) return;
    tipFor = el;
    tip.textContent = g;
    tip.classList.add('show');
    const r = el.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    let x = r.left + r.width / 2 - tr.width / 2;
    x = clamp(x, 8, innerWidth - tr.width - 8);
    let y = r.top - tr.height - 10;
    if (y < 8) y = r.bottom + 10;
    tip.style.transform = `translate(${x}px, ${y}px)`;
  }
  function hideTip() {
    tipFor = null;
    tip.classList.remove('show');
  }
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('[data-gloss]');
    if (el && e.pointerType === 'mouse') showTip(el);
  });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest && e.target.closest('[data-gloss]');
    if (el && el === tipFor && e.pointerType === 'mouse') hideTip();
  });
  document.addEventListener('focusin', (e) => {
    if (e.target.matches && e.target.matches('[data-gloss]')) showTip(e.target);
  });
  document.addEventListener('focusout', hideTip);
  window.addEventListener('scroll', hideTip, true);

  /* ───────────── Clics délégués : prononciation, navigation, traduction tactile ───────────── */
  document.addEventListener('click', (e) => {
    const gl = e.target.closest('[data-gloss]');
    if (gl && !gl.closest('[data-say]')) {
      if (tipFor === gl) hideTip();
      else showTip(gl);
    }
    const sb = e.target.closest('[data-say]');
    if (sb) {
      e.preventDefault();
      const text = sb.getAttribute('data-say');
      document.querySelectorAll('.speaking').forEach((x) => x.classList.remove('speaking'));
      sb.classList.add('speaking');
      document.querySelectorAll('svg.bird.mood-idle').forEach((b) => b.classList.add('talking'));
      S.audio.speak(text, { slow: sb.hasAttribute('data-slow'), g: sb.getAttribute('data-g') || undefined }).then((ok) => {
        sb.classList.remove('speaking');
        document.querySelectorAll('svg.bird.talking').forEach((b) => b.classList.remove('talking'));
        if (!ok && !S.audio.hasVoice()) noVoiceHelp();
      });
      S.bus.emit('said', text);
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go) {
      e.preventDefault();
      S.audio.sfx.tap();
      location.hash = '#/' + go.getAttribute('data-go');
    }
  });

  let helpShown = false;
  function noVoiceHelp(force) {
    if (helpShown && !force) return;
    helpShown = true;
    modal({
      title: 'Aucune voix polonaise trouvée',
      art: `<div class="emoji" style="font-size:54px">🔇</div>`,
      body: `<p>Pour entendre la prononciation, il faut une voix polonaise :</p>
        <ul class="list-tight">
          <li><strong>Le plus simple :</strong> ouvre Słowik avec <strong>Microsoft Edge</strong> (le lanceur le fait pour toi) : ses voix naturelles « Zofia » et « Marek » sont excellentes (connexion internet requise).</li>
          <li><strong>Hors-ligne :</strong> Paramètres Windows → Heure et langue → Voix → Ajouter des voix → <em>Polski</em>.</li>
          <li><strong>Chrome</strong> propose aussi la voix « Google polski ».</li>
        </ul>`,
      actions: [{ label: 'Compris', value: true, cls: 'btn-primary' }],
    });
  }

  S.ui = {
    icon, orn, mascot, setMood, say, ring, bar, animateRings, flower, MASTERY_COLORS, genderChip, plWord, hint, glossy,
    modal, confirm, toast, noVoiceHelp, petal, placeSeg, sheet,
  };
})();
