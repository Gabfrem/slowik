/* Słowik — dialogues & histoires : lecture en bulles animées, lecture automatique, quiz de compréhension. */
(function () {
  'use strict';
  const { esc, frTypo, shuffle, cvars, sleep } = S.util;
  const { icon, say, mascot } = S.ui;
  const D = S.data.dialogues;

  S.views.dialogues = {
    title: 'Dialogues & histoires',
    pl: 'Rozmowy',
    mount(el) {
      const done = S.store.state.dialogues;
      el.innerHTML = `
        <section class="dialogues">
          <div class="dl-hero card paper rv" style="--layer:var(--orange)">
            <div class="grow">
              <h2>Écouter pour comprendre</h2>
              <p class="muted">Des scènes de la vie quotidienne, juste un peu au-dessus de ton niveau : c’est l’« input compréhensible ». Survole un mot pour sa traduction, écoute chaque réplique, puis vérifie ta compréhension.</p>
            </div>
            <div class="dl-hero-art">${mascot('talk', 120)}<div class="dl-bubbles"><span>Cześć!</span><span>Co słychać?</span></div></div>
          </div>
          <div class="dl-grid">
            ${D.map((d, i) => {
              const st = done[d.id];
              return `
              <a href="#/dialogues/${d.id}" class="dl-card card hover rv" style="${cvars(d.color)};--i:${i % 6}" data-tilt="6">
                <div class="dl-scene"><span class="emoji">${d.icon}</span>${S.ui.orn.rosette({ petals: 8, colors: ['rgba(255,255,255,.28)', 'rgba(255,255,255,.18)', 'rgba(255,255,255,.35)'] })}</div>
                <div class="dl-info">
                  <div class="row gap-s"><span class="chip lvl">${d.level}</span><span class="chip">${d.type === 'story' ? 'Histoire' : 'Dialogue'}</span>${st ? `<span class="chip g-n">${icon('check', 12)} ${Math.round(st.best * 100)} %</span>` : ''}</div>
                  <h3 class="pl">${esc(d.pl)}</h3>
                  <b>${esc(d.fr)}</b>
                  <p class="small muted">${esc(d.scene)}</p>
                </div>
              </a>`;
            }).join('')}
          </div>
        </section>`;
    },
  };

  S.views.dialogue = {
    title: (id) => (D.find((d) => d.id === id) || {}).fr || 'Dialogue',
    pl: (id) => (D.find((d) => d.id === id) || {}).pl || 'Rozmowa',
    mount(el, id) {
      const d = D.find((x) => x.id === id);
      if (!d) {
        location.hash = '#/dialogues';
        return;
      }
      let showFr = false;
      let playing = false;
      let stop = false;
      const who = (k) => d.people[k];
      const isStory = d.type === 'story';
      el.innerHTML = `
        <article class="reader" style="${cvars(d.color)}">
          <a href="#/dialogues" class="back-link">${icon('arrowL', 18)} Tous les dialogues</a>
          <header class="rd-head card paper rv" style="--layer:var(--c)">
            <span class="rd-emoji emoji">${d.icon}</span>
            <div class="grow"><div class="eyebrow">${isStory ? 'Histoire' : 'Dialogue'} · ${d.level}</div><h2 class="pl">${esc(d.pl)}</h2><p class="muted">${esc(d.scene)}</p></div>
          </header>
          <div class="rd-tools rv">
            <button type="button" class="btn btn-accent rd-play" style="${cvars(d.color)}">${icon('play', 18)}<span>Tout écouter</span></button>
            <button type="button" class="btn btn-soft rd-fr">${icon('eye', 18)}<span>Traduction</span></button>
            <span class="small muted">Survole ou touche un mot pour le traduire.</span>
          </div>
          <div class="rd-lines ${isStory ? 'story' : ''}">
            ${d.lines
              .map(([k, pl, fr], i) => {
                const p = who(k);
                const side = isStory ? 'story' : Object.keys(d.people).indexOf(k) % 2 ? 'right' : 'left';
                return `
                <div class="line ${side} rv" style="--i:${i};${cvars(p.color)}" data-i="${i}">
                  ${isStory ? '' : `<div class="avatar"><span>${esc(p.name[0])}</span></div>`}
                  <div class="line-bubble">
                    ${isStory ? '' : `<div class="line-who">${esc(p.name)}</div>`}
                    <div class="line-pl pl">${S.ui.glossy(pl, d.gloss)}</div>
                    <div class="line-fr">${frTypo(esc(fr))}</div>
                  </div>
                  ${say(pl, { g: p.g })}
                </div>`;
              })
              .join('')}
          </div>
          <section class="card rd-quiz rv">
            <div class="card-title">${icon('target', 20)}<h3>As-tu compris ?</h3><span class="eyebrow">Zrozumiałeś?</span></div>
            <div class="rdq"></div>
          </section>
        </article>`;

      const lines = el.querySelectorAll('.line');
      const frBtn = el.querySelector('.rd-fr');
      frBtn.addEventListener('click', () => {
        showFr = !showFr;
        el.querySelector('.rd-lines').classList.toggle('show-fr', showFr);
        frBtn.innerHTML = `${icon(showFr ? 'eyeOff' : 'eye', 18)}<span>${showFr ? 'Masquer' : 'Traduction'}</span>`;
      });
      const playBtn = el.querySelector('.rd-play');
      playBtn.addEventListener('click', async () => {
        if (playing) {
          stop = true;
          S.audio.stop();
          return;
        }
        playing = true;
        stop = false;
        playBtn.innerHTML = `${icon('pause', 18)}<span>Arrêter</span>`;
        for (let i = 0; i < d.lines.length && !stop; i++) {
          const ln = lines[i];
          lines.forEach((x) => x.classList.toggle('active', x === ln));
          ln.scrollIntoView({ behavior: S.fx.reduced() ? 'auto' : 'smooth', block: 'center' });
          const b = ln.querySelector('.say');
          b.classList.add('speaking');
          await S.audio.speak(d.lines[i][1], { g: who(d.lines[i][0]).g });
          b.classList.remove('speaking');
          if (!stop) await sleep(420);
        }
        lines.forEach((x) => x.classList.remove('active'));
        playing = false;
        playBtn.innerHTML = `${icon('play', 18)}<span>Tout écouter</span>`;
      });
      lines.forEach((ln) =>
        ln.querySelector('.line-bubble').addEventListener('click', (e) => {
          if (e.target.closest('[data-gloss]')) return;
          ln.classList.toggle('reveal');
        })
      );

      // Quiz
      const box = el.querySelector('.rdq');
      const qs = shuffle(d.quiz).map((q) => ({ q: q.q, opts: shuffle(q.o.map((o, i) => ({ o, ok: i === q.a }))) }));
      let k = 0;
      let score = 0;
      const render = () => {
        if (k >= qs.length) {
          const pct = score / qs.length;
          const first = S.store.markDialogue(d.id, pct);
          const xp = first ? 10 : 4;
          S.store.addXP(xp, 'dialogue');
          S.store.checkAchievements();
          box.innerHTML = `<div class="quiz-end a-pop">${mascot(pct >= 0.75 ? 'cheer' : 'happy', 120)}<h3 class="display">${score}/${qs.length}</h3><p>${pct === 1 ? 'Tout compris ! Doskonale!' : pct >= 0.5 ? 'Bien compris dans l’ensemble !' : 'Réécoute le dialogue avec la traduction, puis réessaie.'}</p>
            <div class="row wrap" style="justify-content:center"><button class="btn btn-soft q-again">${icon('refresh', 18)} Recommencer</button><a class="btn btn-primary" href="#/dialogues">Autres dialogues ${icon('arrowR', 18)}</a></div></div>`;
          if (pct >= 0.75) S.fx.burst(box, 60, 10), S.audio.sfx.complete();
          S.fx.floatText(`+${xp} XP`, box, 'xp');
          box.querySelector('.q-again').addEventListener('click', () => {
            k = 0;
            score = 0;
            render();
          });
          return;
        }
        const q = qs[k];
        box.innerHTML = `
          <div class="quiz-q a-zoom">
            <div class="quiz-top"><span class="chip">Question ${k + 1}/${qs.length}</span></div>
            <h3 class="quiz-title">${frTypo(esc(q.q))}</h3>
            <div class="options stagger-pop">${q.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}" style="--i:${i}"><span class="kbd">${i + 1}</span><span class="opt-txt">${frTypo(esc(o.o))}</span></button>`).join('')}</div>
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
            } else {
              b.classList.add('ko');
              S.audio.sfx.wrong();
              S.fx.shake(b);
            }
            k++;
            setTimeout(render, o.ok ? 850 : 1500);
          })
        );
      };
      render();
      return () => {
        stop = true;
        S.audio.stop();
      };
    },
  };
})();
