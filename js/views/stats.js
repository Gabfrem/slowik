/* Słowik — progrès : niveau, chiffres clés, XP sur 14 jours, calendrier d'activité, maîtrise, succès. */
(function () {
  'use strict';
  const { esc, fmtInt, dayKey, addDays, keyToDate, cvars } = S.util;
  const { icon, mascot, bar } = S.ui;
  const C = S.content;

  const DOW = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const DOW_PL = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const fmtDate = (k) => {
    const d = keyToDate(k);
    return `${DOW[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };
  const niceMax = (v) => {
    if (v <= 10) return 10;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    const step = n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * p;
  };

  /* Infobulle de graphique : la valeur d'abord, l'étiquette ensuite. */
  function chartTip(host) {
    const tip = document.createElement('div');
    tip.className = 'chart-tip';
    const v = document.createElement('b');
    const l = document.createElement('span');
    tip.append(v, l);
    host.appendChild(tip);
    return {
      show(target, value, label) {
        v.textContent = value;
        l.textContent = label;
        const hr = host.getBoundingClientRect();
        const r = target.getBoundingClientRect();
        tip.classList.add('show');
        const tw = tip.offsetWidth;
        let x = r.left + r.width / 2 - hr.left - tw / 2;
        x = Math.max(0, Math.min(hr.width - tw, x));
        tip.style.transform = `translate(${x}px, ${r.top - hr.top - tip.offsetHeight - 8}px)`;
      },
      hide() {
        tip.classList.remove('show');
      },
    };
  }

  /* Colonnes : XP des 14 derniers jours (une seule série, aujourd'hui mis en avant). */
  function xpChart(host) {
    const data = S.store.lastDays(14);
    const goal = S.store.state.goal;
    const W = Math.max(300, host.clientWidth);
    const H = 210;
    const pl = 34;
    const pr = 8;
    const pt = 18;
    const pb = 30;
    const iw = W - pl - pr;
    const ih = H - pt - pb;
    const max = niceMax(Math.max(goal, ...data.map((d) => d.xp)));
    const y = (v) => pt + ih - (v / max) * ih;
    const slot = iw / data.length;
    const bw = Math.min(24, slot * 0.62);
    const today = dayKey();
    const ticks = [0, max / 2, max];
    const top = Math.max(...data.map((d) => d.xp));
    let s = `<svg class="xp-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="XP gagnés sur les 14 derniers jours">`;
    ticks.forEach((t) => {
      s += `<line class="grid" x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}"/><text class="tick" x="${pl - 8}" y="${y(t) + 4}" text-anchor="end">${fmtInt(t)}</text>`;
    });
    s += `<line class="goal-line" x1="${pl}" x2="${W - pr}" y1="${y(goal)}" y2="${y(goal)}"/><text class="goal-lbl" x="${pl + 6}" y="${y(goal) - 6}" text-anchor="start">objectif ${goal} XP</text>`;
    data.forEach((d, i) => {
      const cx = pl + slot * i + slot / 2;
      const h = (d.xp / max) * ih;
      const x0 = cx - bw / 2;
      const yb = pt + ih;
      const isT = d.k === today;
      if (h > 0) {
        const r = Math.min(4, h, bw / 2);
        s += `<path class="col ${isT ? 'today' : ''}" style="--i:${i}" d="M${x0} ${yb}V${yb - h + r}Q${x0} ${yb - h} ${x0 + r} ${yb - h}H${x0 + bw - r}Q${x0 + bw} ${yb - h} ${x0 + bw} ${yb - h + r}V${yb}Z"/>`;
      }
      if (d.xp && (isT || d.xp === top)) s += `<text class="cap" x="${cx}" y="${yb - h - 6}" text-anchor="middle">${d.xp}</text>`;
      s += `<text class="xl ${isT ? 'today' : ''}" x="${cx}" y="${H - 10}" text-anchor="middle">${DOW_PL[keyToDate(d.k).getDay()]}</text>`;
      s += `<rect class="hit" x="${pl + slot * i}" y="${pt}" width="${slot}" height="${ih}" tabindex="0" data-i="${i}" aria-label="${fmtDate(d.k)} : ${d.xp} XP"/>`;
    });
    s += `<line class="axis" x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}"/></svg>`;
    host.innerHTML = s + `<table class="sr-table" hidden><thead><tr><th>Jour</th><th>XP</th></tr></thead><tbody>${data.map((d) => `<tr><td>${fmtDate(d.k)}</td><td>${d.xp}</td></tr>`).join('')}</tbody></table>`;
    const tip = chartTip(host);
    host.querySelectorAll('.hit').forEach((h) => {
      const d = data[+h.dataset.i];
      const show = () => {
        h.classList.add('on');
        tip.show(h, `${d.xp} XP`, fmtDate(d.k) + (d.k === today ? ' · aujourd’hui' : ''));
      };
      const hide = () => {
        h.classList.remove('on');
        tip.hide();
      };
      h.addEventListener('pointerenter', show);
      h.addEventListener('pointerleave', hide);
      h.addEventListener('focus', show);
      h.addEventListener('blur', hide);
    });
  }

  /* Calendrier d'activité : une teinte, du clair au foncé. */
  function heatmap(host) {
    const weeks = 18;
    const goal = S.store.state.goal;
    const days = S.store.state.days;
    const today = new Date();
    const end = dayKey(today);
    const startOffset = (today.getDay() + 6) % 7; // lundi = 0
    const first = addDays(end, -(weeks - 1) * 7 - startOffset);
    const lvl = (xp) => (!xp ? 0 : xp < goal / 2 ? 1 : xp < goal ? 2 : xp < goal * 2 ? 3 : 4);
    let cols = '';
    let months = '';
    let lastM = -1;
    for (let w = 0; w < weeks; w++) {
      let cells = '';
      for (let d = 0; d < 7; d++) {
        const k = addDays(first, w * 7 + d);
        const future = k > end;
        const xp = (days[k] && days[k].xp) || 0;
        cells += future
          ? '<span class="hm-cell future"></span>'
          : `<span class="hm-cell l${lvl(xp)} ${k === end ? 'today' : ''}" tabindex="0" data-k="${k}" data-xp="${xp}" style="--i:${w}" aria-label="${fmtDate(k)} : ${xp} XP"></span>`;
      }
      const m = keyToDate(addDays(first, w * 7)).getMonth();
      const soon = w === 0 && keyToDate(addDays(first, 14)).getMonth() !== m;
      months += `<span class="hm-m">${m !== lastM && !soon ? MONTHS[m] : ''}</span>`;
      lastM = m;
      cols += `<div class="hm-col">${cells}</div>`;
    }
    host.innerHTML = `
      <div class="hm-wrap">
        <div class="hm-days"><span>lun.</span><span></span><span>mer.</span><span></span><span>ven.</span><span></span><span>dim.</span></div>
        <div class="hm-main"><div class="hm-months">${months}</div><div class="hm-grid">${cols}</div></div>
      </div>
      <div class="hm-legend"><span class="small muted">Moins</span>${[0, 1, 2, 3, 4].map((l) => `<span class="hm-cell l${l}"></span>`).join('')}<span class="small muted">Plus</span><span class="small muted hm-note">· niveaux relatifs à ton objectif de ${goal} XP</span></div>`;
    /* Sur petit écran, la frise défile : on montre d'abord les semaines récentes. */
    const hw = host.querySelector('.hm-wrap');
    requestAnimationFrame(() => { hw.scrollLeft = hw.scrollWidth; });
    const tip = chartTip(host);
    host.querySelectorAll('.hm-cell[data-k]').forEach((c) => {
      const show = () => tip.show(c, `${c.dataset.xp} XP`, fmtDate(c.dataset.k));
      c.addEventListener('pointerenter', show);
      c.addEventListener('focus', show);
      c.addEventListener('pointerleave', tip.hide);
      c.addEventListener('blur', tip.hide);
    });
  }

  /* Maîtrise : barre empilée ordinale (rampe d'une seule teinte). */
  function mastery(host) {
    const cards = S.store.state.cards;
    const m = [0, 0, 0, 0, 0];
    C.words.forEach((w) => m[S.srs.mastery(cards[w.id])]++);
    const total = C.words.length;
    host.innerHTML = `
      <div class="mstack">${m.map((n, k) => (n ? `<div class="mseg m${k}" style="flex:${n}" tabindex="0" data-k="${k}"><span>${n}</span></div>` : '')).join('')}</div>
      <div class="mlegend">${S.srs.MASTERY_LABELS.map((l, k) => `<span class="mleg"><i class="m${k}"></i>${esc(l)} <b>${m[k]}</b></span>`).join('')}</div>`;
    host.querySelectorAll('.mseg').forEach((seg) => {
      const lbl = seg.querySelector('span');
      if (seg.offsetWidth < lbl.offsetWidth + 16) lbl.hidden = true;
    });
    const tip = chartTip(host);
    host.querySelectorAll('.mseg').forEach((seg) => {
      const k = +seg.dataset.k;
      const show = () => tip.show(seg, `${m[k]} mot${m[k] > 1 ? 's' : ''} (${Math.round((m[k] / total) * 100)} %)`, S.srs.MASTERY_LABELS[k]);
      seg.addEventListener('pointerenter', show);
      seg.addEventListener('focus', show);
      seg.addEventListener('pointerleave', tip.hide);
      seg.addEventListener('blur', tip.hide);
    });
  }

  S.views.stats = {
    title: 'Progrès',
    pl: 'Twoje postępy',
    mount(el) {
      const st = S.store.state;
      const lv = S.store.level();
      const acc = st.stats.answers ? st.stats.correct / st.stats.answers : 0;
      const learned = Object.keys(st.cards).filter((id) => C.wordById[id]).length;
      const ov = C.overall();
      const mins = Math.round(st.stats.timeMs / 60000);
      const tiles = [
        ['flame', 'Série actuelle', `${S.store.streakNow()} j`, 'orange'],
        ['trophy', 'Meilleure série', `${st.streak.best} j`, 'yellow'],
        ['tulip', 'Mots appris', `${learned}`, 'green'],
        ['target', 'Précision', `${Math.round(acc * 100)} %`, 'blue'],
        ['path', 'Étapes du parcours', `${ov.done}/${ov.total}`, 'red'],
        ['clock', 'Temps en leçon', mins >= 60 ? `${Math.floor(mins / 60)} h ${String(mins % 60).padStart(2, '0')}` : `${mins} min`, 'violet'],
      ];
      const ach = S.data.achievements;
      const nAch = ach.filter((a) => st.ach[a.id]).length;
      el.innerHTML = `
        <section class="stats">
          <div class="lv-card card paper rv" style="--layer:var(--red)">
            <div class="lv-badge">${S.ui.orn.rosette({ petals: 12, colors: ['var(--red)', 'var(--yellow)', 'var(--green)'], cls: 'lv-rosette' })}<span class="emoji">${lv.e}</span></div>
            <div class="grow">
              <div class="eyebrow">Niveau ${lv.n}</div>
              <h2><span class="pl">${esc(lv.pl)}</span> · ${esc(lv.fr)}</h2>
              <div class="lv-xp"><span class="lv-hero">${fmtInt(st.xp)}</span><span class="muted">XP au total</span></div>
              ${bar(lv.pct, { color: 'var(--red)' })}
              <p class="small muted">${fmtInt(lv.to - st.xp)} XP avant le niveau ${lv.n + 1}${S.data.levels[lv.n] ? ` : <span class="pl">${esc(S.data.levels[Math.min(lv.n, S.data.levels.length - 1)].pl)}</span>` : ''}.</p>
            </div>
          </div>

          <div class="tiles">
            ${tiles.map(([ic, l, v, c], i) => `<div class="tile-stat card rv" style="${cvars(c)};--i:${i}"><span class="ts-ico">${icon(ic, 20)}</span><span class="ts-l">${l}</span><b class="ts-v">${v}</b></div>`).join('')}
          </div>

          <div class="grid g2 mt">
            <div class="card rv chart-card">
              <div class="card-title">${icon('chart', 20)}<h3>XP des 14 derniers jours</h3><button type="button" class="chip chip-btn tbl-toggle" aria-pressed="false">Tableau</button></div>
              <div class="xp-chart"></div>
            </div>
            <div class="card rv chart-card">
              <div class="card-title">${icon('tulip', 20)}<h3>Maîtrise du vocabulaire</h3><span class="eyebrow">${C.words.length} mots</span></div>
              <div class="mastery-chart"></div>
              <p class="small muted mt">Chaque mot « fleurit » au fil des révisions réussies : une fleur épanouie tient en mémoire plus d’un mois.</p>
            </div>
          </div>

          <div class="card mt rv chart-card">
            <div class="card-title">${icon('calendar', 20)}<h3>Calendrier d’activité</h3><span class="eyebrow">18 semaines</span></div>
            <div class="heatmap"></div>
          </div>

          <div class="section-head rv"><h2>Succès</h2><span class="pl">Osiągnięcia</span><span class="more chip">${nAch}/${ach.length}</span></div>
          <div class="ach-grid">
            ${ach
              .map((a, i) => {
                const t = st.ach[a.id];
                return `<div class="ach ${t ? 'on' : ''} rv" style="--i:${i % 8}" title="${esc(a.d)}">
                  <div class="ach-medal"><span class="emoji">${t ? a.e : '🔒'}</span></div>
                  <b class="pl">${esc(a.pl)}</b><span class="small">${esc(a.fr)}</span><small class="muted">${esc(a.d)}</small>
                  ${t ? `<small class="ach-date">${new Date(t).toLocaleDateString('fr-FR')}</small>` : ''}
                </div>`;
              })
              .join('')}
          </div>
        </section>`;

      const xpHost = el.querySelector('.xp-chart');
      const mHost = el.querySelector('.mastery-chart');
      const draw = () => {
        if (!xpHost.isConnected) return; // page déjà quittée
        xpChart(xpHost);
        mastery(mHost);
      };
      requestAnimationFrame(draw);
      heatmap(el.querySelector('.heatmap'));
      const tbl = el.querySelector('.tbl-toggle');
      tbl.addEventListener('click', () => {
        const on = tbl.getAttribute('aria-pressed') !== 'true';
        tbl.setAttribute('aria-pressed', on);
        tbl.classList.toggle('on', on);
        const t = xpHost.querySelector('.sr-table');
        const svg = xpHost.querySelector('svg');
        if (t) t.hidden = !on;
        if (svg) svg.style.display = on ? 'none' : '';
      });
      let rt;
      const onResize = () => {
        clearTimeout(rt);
        rt = setTimeout(draw, 150);
      };
      window.addEventListener('resize', onResize);
      return () => {
        clearTimeout(rt);
        window.removeEventListener('resize', onResize);
      };
    },
  };
})();
