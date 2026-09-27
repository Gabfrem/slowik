/* Słowik — routeur par ancre (#/vue/param) avec transitions de pages animées. */
(function () {
  'use strict';
  const { $, $$ } = S.util;

  const NAV = [
    { r: 'home', fr: 'Accueil', pl: 'Start', ic: 'home', c: 'red', tab: true },
    { r: 'path', fr: 'Parcours', pl: 'Ścieżka', ic: 'path', c: 'orange', tab: true },
    { r: 'review', fr: 'Révisions', pl: 'Powtórki', ic: 'cards', c: 'blue', tab: true },
    { r: 'sounds', fr: 'Sons', pl: 'Dźwięki', ic: 'wave', c: 'blue' },
    { r: 'grammar', fr: 'Grammaire', pl: 'Gramatyka', ic: 'book', c: 'violet' },
    { r: 'dialogues', fr: 'Dialogues', pl: 'Rozmowy', ic: 'chat', c: 'orange' },
    { r: 'gym', fr: 'Entraînement', pl: 'Trening', ic: 'gym', c: 'green', tab: true },
    { r: 'lexicon', fr: 'Lexique', pl: 'Słownik', ic: 'lexicon', c: 'teal' },
    { r: 'culture', fr: 'Culture', pl: 'Kultura', ic: 'tulip', c: 'pink' },
    { r: 'stats', fr: 'Progrès', pl: 'Postępy', ic: 'chart', c: 'red' },
    { r: 'settings', fr: 'Réglages', pl: 'Ustawienia', ic: 'sliders', c: 'green' },
  ];
  /* Vue parente dans la navigation pour les sous-pages. */
  const PARENT = { grammarTopic: 'grammar', dialogue: 'dialogues' };

  let current = null;
  let cleanup = null;
  let first = true;

  function parse() {
    const h = (location.hash || '').replace(/^#\/?/, '');
    const [name, ...rest] = h.split('/').filter(Boolean);
    const route = { name: name || 'home', params: rest.map(decodeURIComponent) };
    if (route.name === 'grammar' && route.params[0]) route.name = 'grammarTopic';
    if (route.name === 'dialogues' && route.params[0]) route.name = 'dialogue';
    if (!S.views[route.name]) route.name = 'home';
    return route;
  }

  function setActive(name) {
    const key = PARENT[name] || name;
    $$('.sb-item, .tab[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === key));
    // Sur mobile, les sections hors onglets allument le bouton « Plus »
    const more = $('.tab[data-action="more"]');
    if (more) more.classList.toggle('active', !NAV.some((n) => n.tab && n.r === key));
    movePill();
  }
  function movePill() {
    const nav = $('.sb-nav');
    const pill = $('.sb-pill');
    const act = $('.sb-item.active');
    if (nav && pill) {
      if (act) {
        pill.style.opacity = 1;
        pill.style.transform = `translateY(${act.offsetTop}px)`;
        pill.style.height = act.offsetHeight + 'px';
      } else pill.style.opacity = 0;
    }
    const tp = $('.tab-pill');
    const tabs = $$('.tab');
    const ti = tabs.findIndex((t) => t.classList.contains('active'));
    if (tp) {
      tp.style.opacity = ti >= 0 ? 1 : 0;
      if (ti >= 0) tp.style.transform = `translateX(${ti * 100}%)`;
    }
  }

  function setTitle(view, params) {
    const t = typeof view.title === 'function' ? view.title(...params) : view.title;
    const pl = typeof view.pl === 'function' ? view.pl(...params) : view.pl;
    const el = $('.tb-title');
    if (el) el.innerHTML = `<span class="eyebrow">${S.util.esc(pl || '')}</span><h1>${S.util.frTypo(S.util.esc(t || ''))}</h1>`;
    document.title = `${t ? t + ' · ' : ''}Słowik`;
  }

  function render() {
    const route = parse();
    const view = S.views[route.name];
    const viewEl = $('#view');
    const swap = () => {
      if (cleanup) {
        try {
          cleanup();
        } catch (e) {
          console.error(e);
        }
      }
      cleanup = null;
      S.audio.stop();
      viewEl.innerHTML = '';
      window.scrollTo(0, 0);
      setTitle(view, route.params);
      setActive(route.name);
      try {
        cleanup = view.mount(viewEl, ...route.params) || null;
      } catch (e) {
        console.error(e);
        viewEl.innerHTML = `<div class="empty">${S.ui.mascot('sad', 150)}<h3>Oups, un souci d’affichage</h3><p class="muted">${S.util.esc(e.message)}</p><button class="btn btn-primary" data-go="home">Retour à l’accueil</button></div>`;
      }
      S.fx.reveal(viewEl);
      S.ui.animateRings(viewEl);
      current = route;
      S.bus.emit('route', route);
    };
    const canVT = document.startViewTransition && !S.fx.reduced() && !first && !document.hidden;
    first = false;
    if (canVT) {
      try {
        const vt = document.startViewTransition(swap);
        [vt.ready, vt.finished, vt.updateCallbackDone].forEach((p) => p && p.catch(() => {}));
      } catch (e) {
        swap();
      }
    } else {
      swap();
      if (!S.fx.reduced()) {
        viewEl.classList.remove('enter');
        void viewEl.offsetWidth;
        viewEl.classList.add('enter');
      }
    }
  }

  function go(path) {
    const h = '#/' + path;
    if (location.hash === h) render();
    else location.hash = h;
  }
  const refresh = () => render();

  function init() {
    const tb = $('#topbar');
    const onScroll = () => tb && tb.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    S.bus.on('route', onScroll);
    window.addEventListener('hashchange', render);
    window.addEventListener('resize', movePill);
    render();
  }

  S.router = { NAV, init, go, refresh, movePill, get current() { return current; } };
})();
