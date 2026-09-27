/* Słowik — lexique : recherche instantanée, filtres, fiche détaillée de chaque mot. */
(function () {
  'use strict';
  const { esc, frTypo, strip, norm, debounce, cvars } = S.util;
  const { icon, say, plWord, hint, genderChip, flower } = S.ui;
  const C = S.content;

  function wordModal(w) {
    const card = S.store.state.cards[w.id];
    const m = S.srs.mastery(card);
    const due = card ? card.due - Date.now() : 0;
    S.ui.modal({
      cls: 'word-modal',
      art: `<div class="medallion" style="--sz:104px;--c:var(--${w.unit.color})"><span class="emoji">${w.e}</span></div>`,
      title: '',
      body: `
        <div class="wm-word">${plWord(w)}</div>
        <div class="center">${hint(w)}</div>
        <div class="wm-fr">${frTypo(esc(w.fr))} ${genderChip(w.g)}</div>
        <div class="row" style="justify-content:center">${say(w.pl, { big: true })}${say(w.pl, { big: true, slow: true })}</div>
        ${w.ex ? `<div class="intro-ex wm-ex">${say(w.ex[0])}<div><div class="pl">${S.ui.glossy(w.ex[0])}</div><div class="small muted">${frTypo(esc(w.ex[1]))}</div></div></div>` : ''}
        ${w.note ? `<div class="callout tip mt"><span class="emoji">💡</span><p>${S.util.fmt(w.note)}</p></div>` : ''}
        <div class="wm-meta">
          <span class="chip">${icon('path', 14)} Unité ${w.unit.num} · ${esc(w.lesson.fr)}</span>
          <span class="chip">${flower(m, 18)} ${S.srs.MASTERY_LABELS[m]}</span>
          ${card ? `<span class="chip">${icon('clock', 14)} ${due <= 0 ? 'À réviser maintenant' : 'Révision dans ' + S.srs.fmtDelay(due)}</span>` : ''}
        </div>`,
      actions: card ? [{ label: 'Fermer', value: true, cls: 'btn-primary' }] : [{ label: 'Fermer', value: false }, { label: 'Ajouter aux révisions', value: 'add', cls: 'btn-primary', icon: 'plus' }],
    }).then((v) => {
      if (v === 'add') {
        S.store.addCard(w.id);
        S.ui.toast({ emoji: '🌱', tone: 'ok', title: 'Ajouté à tes révisions', text: `${w.pl} — ${w.fr}` });
        S.updateHUD();
        S.router.refresh();
      }
    });
    setTimeout(() => S.store.state.settings.autoplay && S.audio.speak(w.pl), 300);
  }
  S.ui.wordModal = wordModal;

  S.views.lexicon = {
    title: 'Lexique',
    pl: 'Słownik',
    mount(el) {
      let filter = 'all';
      let unit = 'all';
      let q = '';
      const cards = S.store.state.cards;
      const nLearned = C.words.filter((w) => cards[w.id]).length;
      el.innerHTML = `
        <section class="lexicon">
          <div class="lx-head card paper rv" style="--layer:var(--teal)">
            <div class="grow">
              <h2>${C.words.length} mots, ${nLearned} dans ton jardin</h2>
              <p class="muted">Cherche en polonais ou en français (les accents sont facultatifs). Appuie sur un mot pour sa fiche complète.</p>
            </div>
            <div class="lx-count">${S.ui.ring(nLearned / C.words.length, { size: 92, stroke: 9, color: 'var(--teal)' })}<b class="display">${Math.round((nLearned / C.words.length) * 100)}%</b></div>
          </div>
          <div class="lx-tools rv">
            <label class="search grow">${icon('search', 20)}<input class="input lx-q" type="search" placeholder="Rechercher : kot, maison, dzien…" aria-label="Rechercher un mot"></label>
            <select class="input lx-unit" aria-label="Unité"><option value="all">Toutes les unités</option>${C.units.map((u) => `<option value="${u.id}">${u.num}. ${esc(u.fr)}</option>`).join('')}</select>
          </div>
          <div class="lx-filters row wrap rv">
            ${[['all', 'Tous'], ['learned', 'Appris'], ['due', 'À réviser'], ['new', 'Pas encore vus']].map(([k, l], i) => `<button type="button" class="chip chip-btn ${i ? '' : 'on'}" data-f="${k}">${l}</button>`).join('')}
            <span class="lx-n small muted"></span>
          </div>
          <div class="lx-list"></div>
        </section>`;
      const list = el.querySelector('.lx-list');
      const nEl = el.querySelector('.lx-n');
      const render = () => {
        const now = Date.now();
        const qq = strip(norm(q));
        const rows = C.words.filter((w) => {
          const c = cards[w.id];
          if (filter === 'learned' && !c) return false;
          if (filter === 'due' && !(c && c.due <= now)) return false;
          if (filter === 'new' && c) return false;
          if (unit !== 'all' && w.unit.id !== unit) return false;
          if (qq && !strip(norm(w.pl)).includes(qq) && !strip(norm(w.fr)).includes(qq)) return false;
          return true;
        });
        nEl.textContent = `${rows.length} mot${rows.length > 1 ? 's' : ''}`;
        if (!rows.length) {
          list.innerHTML = `<div class="empty">${S.ui.mascot('think', 130)}<h3>Aucun mot trouvé</h3><p class="muted">Essaie une autre recherche ou un autre filtre.</p></div>`;
          return;
        }
        let lastU = null;
        list.innerHTML = rows
          .map((w, i) => {
            const c = cards[w.id];
            const headHTML = w.unit !== lastU && !qq ? `<div class="lx-unit-head" style="${cvars(w.unit.color)}"><span class="display">${String(w.unit.num).padStart(2, '0')}</span><b>${esc(w.unit.fr)}</b><span class="pl">${esc(w.unit.pl)}</span></div>` : '';
            lastU = w.unit;
            return `${headHTML}<div class="lx-row" data-id="${w.id}" style="--i:${Math.min(i, 20)}" tabindex="0" role="button">
              ${say(w.pl)}
              <span class="emoji lx-e">${w.e}</span>
              <span class="lx-pl">${plWord(w)}</span>
              <span class="lx-fr">${frTypo(esc(w.fr))}</span>
              ${genderChip(w.g)}
              <span class="lx-m" title="${S.srs.MASTERY_LABELS[S.srs.mastery(c)]}">${flower(S.srs.mastery(c), 24)}</span>
            </div>`;
          })
          .join('');
        list.classList.remove('in');
        void list.offsetWidth;
        list.classList.add('in');
      };
      el.querySelector('.lx-q').addEventListener('input', debounce((e) => {
        q = e.target.value;
        render();
      }, 120));
      el.querySelector('.lx-unit').addEventListener('change', (e) => {
        unit = e.target.value;
        render();
      });
      el.querySelectorAll('[data-f]').forEach((b) =>
        b.addEventListener('click', () => {
          filter = b.dataset.f;
          el.querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('on', x === b));
          render();
        })
      );
      list.addEventListener('click', (e) => {
        if (e.target.closest('[data-say]')) return;
        const r = e.target.closest('.lx-row');
        if (r) wordModal(C.wordById[r.dataset.id]);
      });
      list.addEventListener('keydown', (e) => {
        const r = e.target.closest('.lx-row');
        if (r && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          wordModal(C.wordById[r.dataset.id]);
        }
      });
      const onSlash = (e) => {
        if (e.key === '/' && !e.target.matches('input')) {
          e.preventDefault();
          el.querySelector('.lx-q').focus();
        }
      };
      document.addEventListener('keydown', onSlash);
      render();
      return () => document.removeEventListener('keydown', onSlash);
    },
  };
})();
