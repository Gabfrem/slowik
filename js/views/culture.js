/* Słowik — culture : cartes à retourner, proverbes, fêtes et personnalités. */
(function () {
  'use strict';
  const { esc, frTypo, fmt, cvars, COLORS } = S.util;
  const { icon, say, mascot } = S.ui;

  S.views.culture = {
    title: 'Culture',
    pl: 'Kultura polska',
    mount(el) {
      const facts = S.data.culture;
      const provs = S.data.proverbs;
      el.innerHTML = `
        <section class="culture">
          <div class="cu-hero card paper rv" style="--layer:var(--pink)">
            <div class="grow">
              <h2>Une langue, un pays, une âme</h2>
              <p class="muted">Apprendre le polonais, c’est aussi découvrir les <span class="pl">imieniny</span>, les <span class="pl">pierogi</span> de grand-mère et un humour bien particulier. Retourne les cartes pour en savoir plus !</p>
            </div>
            <div class="cu-hero-art">${S.ui.orn.tulip()}${S.ui.orn.rosette({ petals: 10, colors: ['var(--pink)', 'var(--yellow)', 'var(--green)'] })}</div>
          </div>

          <div class="section-head rv"><h2>Le saviez-vous ?</h2><span class="pl">Ciekawostki</span></div>
          <div class="cu-grid">
            ${facts
              .map(
                (f, i) => `
              <button type="button" class="cu-card rv" style="${cvars(COLORS[i % COLORS.length])};--i:${i % 8}" aria-label="${esc(f.t)} — retourner la carte">
                <span class="cu-inner">
                  <span class="cu-face cu-front"><span class="emoji cu-emoji">${f.icon}</span><b class="pl">${esc(f.t)}</b><small>${icon('refresh', 14)} Retourner</small></span>
                  <span class="cu-face cu-back"><b class="pl">${esc(f.t)}</b><span class="cu-txt">${fmt(f.x)}</span></span>
                </span>
              </button>`
              )
              .join('')}
          </div>

          <div class="section-head rv"><h2>Proverbes</h2><span class="pl">Przysłowia</span></div>
          <div class="prov-list">
            ${provs
              .map(
                (p, i) => `
              <div class="prov card rv" style="${cvars(COLORS[(i + 3) % COLORS.length])};--i:${i % 6}">
                <div class="prov-top">${say(p.pl)}<blockquote class="pl">${S.ui.glossy(p.pl)}</blockquote></div>
                <p class="small muted">Mot à mot : ${frTypo(esc(p.lit))}</p>
                <p class="prov-eq">≈ ${frTypo(esc(p.fr))}</p>
              </div>`
              )
              .join('')}
          </div>

          <div class="cu-end rv">${mascot('happy', 140)}<p class="pl">Polska jest piękna!</p><p class="small muted">La Pologne est belle !</p></div>
        </section>`;
      el.querySelectorAll('.cu-card').forEach((c) =>
        c.addEventListener('click', () => {
          c.classList.toggle('flipped');
          S.audio.sfx.flip();
        })
      );
    },
  };
})();
