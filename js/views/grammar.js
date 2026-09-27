/* Słowik — grammaire : fiches illustrées, tableaux interactifs, jeu de tri, quiz. */
(function () {
  'use strict';
  const { esc, frTypo, fmt, shuffle, cvars } = S.util;
  const { icon, say, mascot } = S.ui;
  const G = S.data.grammar;

  /* ───────────── Liste des fiches ───────────── */
  S.views.grammar = {
    title: 'Grammaire',
    pl: 'Gramatyka',
    mount(el) {
      const done = S.store.state.grammar;
      const n = G.filter((g) => done[g.id] && done[g.id].best >= 0.75).length;
      el.innerHTML = `
        <section class="grammar">
          <div class="gr-hero card paper rv" style="--layer:var(--violet)">
            <div class="grow">
              <h2>La grammaire, sans douleur</h2>
              <p class="muted">Des fiches courtes et visuelles. Chaque exemple est cliquable pour l’entendre, et un petit quiz clôt chaque fiche. Commence par le haut : l’ordre suit ta progression dans le parcours.</p>
              <div class="row"><span class="chip">${icon('check', 14)} ${n}/${G.length} fiches validées</span></div>
            </div>
            ${mascot('think', 130)}
          </div>
          <div class="gr-grid">
            ${G.map((g, i) => {
              const d = done[g.id];
              const ok = d && d.best >= 0.75;
              return `
              <a href="#/grammar/${g.id}" class="gr-card card hover rv ${ok ? 'ok' : ''}" style="${cvars(g.color)};--i:${i % 9}" data-tilt="6">
                <span class="gr-num display">${String(i + 1).padStart(2, '0')}</span>
                <span class="gr-ico emoji">${g.icon}</span>
                <span class="gr-txt"><b>${esc(g.title)}</b><span class="pl">${esc(g.pl)}</span></span>
                <span class="gr-meta"><span class="chip lvl">${g.level}</span>${ok ? `<span class="gr-ok">${icon('check', 16)}</span>` : d ? `<span class="chip">${Math.round(d.best * 100)} %</span>` : ''}</span>
              </a>`;
            }).join('')}
          </div>
        </section>`;
    },
  };

  /* ───────────── Widgets ───────────── */
  function declWidget() {
    const D = S.data.declensions;
    const CASES = S.data.cases;
    const hl = (base, form) => {
      let i = 0;
      while (i < base.length && i < form.length && base[i] === form[i]) i++;
      i = Math.min(i, form.length);
      return `${esc(form.slice(0, i))}<b class="end">${esc(form.slice(i))}</b>`;
    };
    const table = (d) => `
      <table class="decl-table">
        <thead><tr><th>Cas</th><th>Singulier</th><th>Pluriel</th></tr></thead>
        <tbody>${CASES.map((c, k) => `<tr style="--i:${k}"><th><b>${c.fr}</b><span class="pl">${c.pl}</span><small>${c.q}</small></th>
          <td><button type="button" class="dt-form" data-say="${esc(d.sg[k])}">${hl(d.n, d.sg[k])}</button></td>
          <td><button type="button" class="dt-form" data-say="${esc(d.pl[k])}">${hl(d.n, d.pl[k])}</button></td></tr>`).join('')}</tbody>
      </table>`;
    const html = `
      <div class="widget decl">
        <div class="w-head">${icon('puzzle', 18)}<b>Déclinaison interactive</b><span class="muted small">Choisis un nom, clique sur une forme pour l’entendre.</span></div>
        <div class="decl-picker">${D.map((d, i) => `<button type="button" class="chip chip-btn ${i ? '' : 'on'}" data-d="${i}"><span class="pl">${d.n}</span> <small>${d.fr}</small></button>`).join('')}</div>
        <div class="decl-meta"></div>
        <div class="decl-out"></div>
      </div>`;
    return {
      html,
      init(root) {
        const w = root.querySelector('.widget.decl');
        if (!w) return;
        const out = w.querySelector('.decl-out');
        const meta = w.querySelector('.decl-meta');
        const set = (i) => {
          const d = D[i];
          w.querySelectorAll('[data-d]').forEach((b) => b.classList.toggle('on', +b.dataset.d === i));
          meta.innerHTML = `<span class="chip">${esc(d.g)}</span> <span class="pl">${esc(d.n)}</span> — ${esc(d.fr)}`;
          out.innerHTML = table(d);
          out.querySelector('table').classList.add('in');
        };
        w.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => set(+b.dataset.d)));
        set(0);
      },
    };
  }

  function conjWidget(verbs) {
    const V = S.data.verbs.filter((v) => verbs.includes(v.inf));
    const P = S.data.persons;
    const html = `
      <div class="widget conj">
        <div class="w-head">${icon('refresh', 18)}<b>Conjugaison au présent</b><span class="muted small">Appuie sur une forme pour l’entendre.</span></div>
        ${V.length > 1 ? `<div class="decl-picker">${V.map((v, i) => `<button type="button" class="chip chip-btn ${i ? '' : 'on'}" data-v="${i}"><span class="pl">${v.inf}</span> <small>${v.fr}</small></button>`).join('')}</div>` : ''}
        <div class="conj-out"></div>
      </div>`;
    return {
      html,
      init(root) {
        const w = root.querySelector('.widget.conj');
        if (!w) return;
        const out = w.querySelector('.conj-out');
        const set = (i) => {
          const v = V[i];
          w.querySelectorAll('[data-v]').forEach((b) => b.classList.toggle('on', +b.dataset.v === i));
          out.innerHTML = `<div class="conj-grid">${P.map((p, k) => `<button type="button" class="conj-cell" style="--i:${k}" data-say="${esc(p.pl.split(' / ')[0] + ' ' + v.pres[k])}"><span class="cc-p">${esc(p.pl)}</span><span class="cc-f pl">${esc(v.pres[k])}</span><span class="cc-fr">${esc(p.fr)}</span></button>`).join('')}</div>`;
        };
        w.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => set(+b.dataset.v)));
        set(0);
      },
    };
  }

  function sortWidget() {
    const items = shuffle(S.data.genderSort).slice(0, 12);
    const html = `
      <div class="widget sortg">
        <div class="w-head">${icon('puzzle', 18)}<b>À toi de jouer : trie les mots par genre</b><span class="muted small">Appuie sur un mot, puis sur son panier (ou glisse-le).</span></div>
        <div class="sort-pool">${items.map(([w, g], i) => `<button type="button" class="tile pl-tile sort-w" draggable="true" data-g="${g}" data-w="${esc(w)}" style="--i:${i}">${esc(w)}</button>`).join('')}</div>
        <div class="sort-bins">
          ${[['m', 'Masculin', 'mój · ten'], ['f', 'Féminin', 'moja · ta'], ['n', 'Neutre', 'moje · to']].map(([g, l, h]) => `<div class="bin g-${g}" data-bin="${g}"><div class="bin-head"><b>${l}</b><span class="pl">${h}</span></div><div class="bin-body"></div></div>`).join('')}
        </div>
        <div class="sort-score muted small center"></div>
      </div>`;
    return {
      html,
      init(root) {
        const w = root.querySelector('.widget.sortg');
        if (!w) return;
        let selected = null;
        let ok = 0;
        let tries = 0;
        const place = (tile, bin) => {
          const g = tile.dataset.g;
          tries++;
          if (bin.dataset.bin === g) {
            ok++;
            S.audio.sfx.match();
            S.audio.speak(tile.dataset.w);
            const target = bin.querySelector('.bin-body');
            const clone = tile.cloneNode(true);
            clone.classList.add('in-bin');
            clone.draggable = false;
            clone.style.visibility = 'hidden';
            target.appendChild(clone);
            S.fx.fly(tile, clone).then(() => (clone.style.visibility = ''));
            tile.remove();
            S.fx.pop(bin, 1.04);
          } else {
            S.audio.sfx.wrong();
            S.fx.shake(tile);
            S.fx.shake(bin);
          }
          selected = null;
          w.querySelectorAll('.sort-w.sel').forEach((x) => x.classList.remove('sel'));
          const left = w.querySelectorAll('.sort-pool .sort-w').length;
          w.querySelector('.sort-score').textContent = left ? `${ok} bien placé(s) · ${tries - ok} erreur(s)` : '';
          if (!left) {
            w.querySelector('.sort-score').innerHTML = `<b>Bravo !</b> ${ok}/${tries} du premier coup.`;
            S.fx.burst(w, 50, 9);
            S.audio.sfx.complete();
          }
        };
        w.addEventListener('click', (e) => {
          const t = e.target.closest('.sort-pool .sort-w');
          if (t) {
            w.querySelectorAll('.sort-w.sel').forEach((x) => x.classList.remove('sel'));
            t.classList.add('sel');
            selected = t;
            S.audio.sfx.select();
            return;
          }
          const b = e.target.closest('.bin');
          if (b && selected) place(selected, b);
        });
        w.addEventListener('dragstart', (e) => {
          const t = e.target.closest('.sort-w');
          if (t) {
            selected = t;
            e.dataTransfer.setData('text/plain', t.dataset.w);
          }
        });
        w.querySelectorAll('.bin').forEach((b) => {
          b.addEventListener('dragover', (e) => {
            e.preventDefault();
            b.classList.add('over');
          });
          b.addEventListener('dragleave', () => b.classList.remove('over'));
          b.addEventListener('drop', (e) => {
            e.preventDefault();
            b.classList.remove('over');
            if (selected) place(selected, b);
          });
        });
      },
    };
  }

  function numWidget() {
    const html = `
      <div class="widget numform">
        <div class="w-head">${icon('hash', 18)}<b>Essaie : combien de złoty ?</b><span class="muted small">Déplace le curseur et observe la forme du nom.</span></div>
        <input type="range" min="1" max="100" value="23" class="nf-range" aria-label="Nombre">
        <div class="nf-out"></div>
      </div>`;
    return {
      html,
      init(root) {
        const w = root.querySelector('.widget.numform');
        if (!w) return;
        const r = w.querySelector('.nf-range');
        const out = w.querySelector('.nf-out');
        const upd = () => {
          const n = +r.value;
          r.style.setProperty('--val', ((n - 1) / 99) * 100 + '%');
          const form = S.content.plForm(n, 'złoty', 'złote', 'złotych');
          const txt = `${S.content.numberPl(n)} ${form}`;
          const rule = n === 1 ? 'nominatif singulier' : form === 'złote' ? 'nominatif pluriel (2–4)' : 'génitif pluriel (5+)';
          out.innerHTML = `<div class="nf-n display">${n}</div><div class="nf-txt"><button type="button" class="say-inline pl" data-say="${txt}">${txt}</button><span class="chip">${rule}</span></div>`;
        };
        r.addEventListener('input', upd);
        upd();
      },
    };
  }

  /* ───────────── Fiche ───────────── */
  function blockHTML(b, widgets) {
    switch (b.t) {
      case 'h': return `<h3 class="gb-h rv">${frTypo(esc(b.x))}</h3>`;
      case 'p': return `<p class="gb-p rv">${fmt(b.x)}</p>`;
      case 'tip': return `<div class="callout tip rv"><span class="emoji">💡</span><p>${fmt(b.x)}</p></div>`;
      case 'warn': return `<div class="callout warn rv"><span class="emoji">⚠️</span><p>${fmt(b.x)}</p></div>`;
      case 'list': return `<ul class="gb-list rv">${b.items.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul>`;
      case 'ex': return `<div class="gb-ex rv">${say(b.pl)}<div><div class="pl">${S.ui.glossy(b.pl)}</div><div class="small muted">${frTypo(esc(b.fr))}</div></div></div>`;
      case 'table': return `<div class="gb-table-wrap rv"><table class="gb-table"><thead><tr>${b.head.map((h) => `<th>${fmt(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'decl': { const w = declWidget(); widgets.push(w); return `<div class="rv">${w.html}</div>`; }
      case 'conj': { const w = conjWidget(b.verbs); widgets.push(w); return `<div class="rv">${w.html}</div>`; }
      case 'sort': { const w = sortWidget(); widgets.push(w); return `<div class="rv">${w.html}</div>`; }
      case 'numform': { const w = numWidget(); widgets.push(w); return `<div class="rv">${w.html}</div>`; }
      default: return '';
    }
  }

  function quiz(root, g) {
    const box = root.querySelector('.gr-quiz');
    const qs = shuffle(g.quiz).map((q) => {
      const opts = shuffle(q.o.map((o, i) => ({ o, ok: i === q.a })));
      return { q: q.q, opts };
    });
    let k = 0;
    let score = 0;
    const render = () => {
      if (k >= qs.length) {
        const pct = score / qs.length;
        const first = S.store.markGrammar(g.id, pct);
        const xp = pct >= 0.75 ? (first ? 10 : 3) : 2;
        S.store.addXP(xp, 'grammar');
        S.store.checkAchievements();
        box.innerHTML = `<div class="quiz-end a-pop">${mascot(pct >= 0.75 ? 'cheer' : 'happy', 120)}<h3 class="display">${score}/${qs.length}</h3>
          <p>${pct >= 0.75 ? 'Fiche validée ! Świetnie!' : 'Relis la fiche tranquillement et retente le quiz.'}</p>
          <div class="row wrap" style="justify-content:center"><button class="btn btn-soft q-again">${icon('refresh', 18)} Recommencer</button>${next(g) ? `<a class="btn btn-primary" href="#/grammar/${next(g).id}">Fiche suivante ${icon('arrowR', 18)}</a>` : ''}</div></div>`;
        if (pct >= 0.75) S.fx.burst(box, 60, 10), S.audio.sfx.complete();
        S.fx.floatText(`+${xp} XP`, box, 'xp');
        box.querySelector('.q-again').addEventListener('click', () => quiz(root, g));
        return;
      }
      const q = qs[k];
      box.innerHTML = `
        <div class="quiz-q a-zoom">
          <div class="quiz-top"><span class="chip">Question ${k + 1}/${qs.length}</span><span class="chip">${icon('star', 14)} ${score}</span></div>
          <h3 class="quiz-title">${fmt(q.q)}</h3>
          <div class="options stagger-pop">${q.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt">${fmt(o.o)}</span></button>`).join('')}</div>
        </div>`;
      box.querySelectorAll('.opt').forEach((b) =>
        b.addEventListener('click', () => {
          const o = q.opts[+b.dataset.i];
          box.querySelectorAll('.opt').forEach((x, j) => {
            x.disabled = true;
            if (q.opts[j].ok) x.classList.add('ok');
          });
          if (o.ok) {
            score++;
            S.audio.sfx.correct();
            S.fx.burst(b, 16, 6);
          } else {
            b.classList.add('ko');
            S.audio.sfx.wrong();
            S.fx.shake(b);
          }
          k++;
          setTimeout(render, o.ok ? 900 : 1600);
        })
      );
    };
    render();
  }
  const next = (g) => G[G.indexOf(g) + 1];

  S.views.grammarTopic = {
    title: (id) => (G.find((g) => g.id === id) || {}).title || 'Grammaire',
    pl: (id) => (G.find((g) => g.id === id) || {}).pl || 'Gramatyka',
    mount(el, id) {
      const g = G.find((x) => x.id === id);
      if (!g) {
        location.hash = '#/grammar';
        return;
      }
      const i = G.indexOf(g);
      const widgets = [];
      const body = g.blocks.map((b) => blockHTML(b, widgets)).join('');
      el.innerHTML = `
        <article class="topic" style="${cvars(g.color)}">
          <a href="#/grammar" class="back-link">${icon('arrowL', 18)} Toutes les fiches</a>
          <header class="topic-head rv">
            <span class="th-num display">${String(i + 1).padStart(2, '0')}</span>
            <span class="th-ico emoji">${g.icon}</span>
            <div class="grow"><div class="eyebrow">Fiche ${i + 1} · ${g.level}</div><h2>${esc(g.title)}</h2><div class="pl th-pl">${esc(g.pl)}</div></div>
          </header>
          <p class="topic-lead rv">${fmt(g.lead)}</p>
          <div class="topic-body">${body}</div>
          <section class="card gr-quiz-card rv">
            <div class="card-title">${icon('target', 20)}<h3>Quiz de la fiche</h3><span class="eyebrow">Sprawdź się</span></div>
            <div class="gr-quiz"></div>
          </section>
          <nav class="topic-nav">
            ${G[i - 1] ? `<a class="card hover tn prev" href="#/grammar/${G[i - 1].id}">${icon('arrowL', 20)}<span><small>Précédente</small><b>${esc(G[i - 1].title)}</b></span></a>` : '<span></span>'}
            ${G[i + 1] ? `<a class="card hover tn next" href="#/grammar/${G[i + 1].id}"><span><small>Suivante</small><b>${esc(G[i + 1].title)}</b></span>${icon('arrowR', 20)}</a>` : ''}
          </nav>
        </article>`;
      widgets.forEach((w) => w.init(el));
      quiz(el, g);
    },
  };
})();
