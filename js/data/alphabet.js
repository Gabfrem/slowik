/* Słowik — sons du polonais : alphabet, chuintantes, paires minimales, virelangues. */
(function () {
  'use strict';
  const L = (l, ipa, fr, ex, x) => Object.assign({ l, ipa, fr, ex }, x || {});

  S.data.alphabet = {
    letters: [
      L('A', 'a', 'a, comme dans « chat »', [['mama', 'maman', '👩'], ['kawa', 'café', '☕']], { g: 'v' }),
      L('Ą', 'ɔ̃', 'on nasal, comme dans « bon »', [['są', 'ils sont', '👥'], ['wąż', 'serpent', '🐍']], { g: 'v', special: true, note: 'Jamais en début de mot. Devant p ou b : « om » (dąb, « domp »).' }),
      L('B', 'b', 'b', [['brat', 'frère', '👦'], ['babcia', 'grand-mère', '👵']]),
      L('C', 't͡s', 'ts, comme dans « tsar »', [['co', 'quoi', '❓'], ['noc', 'nuit', '🌙']], { g: 's' }),
      L('Ć', 't͡ɕ', 'tch doux, langue bombée', [['być', 'être', '🧍'], ['ciocia', 'tante', '👩‍🦰']], { g: 's', special: true, note: 'S’écrit « ci » devant une voyelle : ciocia, ciasto.' }),
      L('D', 'd', 'd', [['dom', 'maison', '🏠'], ['dobry', 'bon', '👍']]),
      L('E', 'ɛ', 'è ouvert, comme dans « mère »', [['ser', 'fromage', '🧀'], ['nie', 'non', '❌']], { g: 'v', note: 'Jamais muet, même en fin de mot !' }),
      L('Ę', 'ɛ̃', 'in nasal ; « è » en fin de mot', [['ręka', 'main', '✋'], ['proszę', 's’il vous plaît', '🙏']], { g: 'v', special: true }),
      L('F', 'f', 'f', [['film', 'film', '🎬'], ['telefon', 'téléphone', '📱']]),
      L('G', 'ɡ', 'g toujours dur, comme dans « gare »', [['góry', 'montagnes', '🏔️'], ['noga', 'jambe', '🦵']], { note: 'Même devant e et i : gitara se dit « guitara ».' }),
      L('H', 'x', 'h expiré, comme la jota espagnole', [['herbata', 'thé', '🍵'], ['hotel', 'hôtel', '🏨']], { note: 'Se prononce exactement comme « ch ».' }),
      L('I', 'i', 'i', [['igła', 'aiguille', '🪡'], ['miasto', 'ville', '🏙️']], { g: 'v', note: 'Entre une consonne et une voyelle, il sert souvent juste à « adoucir » la consonne.' }),
      L('J', 'j', 'y, comme dans « yeux »', [['ja', 'je', '🙋'], ['jajko', 'œuf', '🥚']]),
      L('K', 'k', 'k', [['kot', 'chat', '🐱'], ['kawa', 'café', '☕']]),
      L('L', 'l', 'l', [['lato', 'été', '🏖️'], ['lody', 'glace', '🍦']]),
      L('Ł', 'w', 'w anglais, comme dans « oui »', [['łóżko', 'lit', '🛏️'], ['mały', 'petit', '🐭']], { special: true, note: 'Autrefois un « l » dur ; aujourd’hui, c’est un « w » anglais.' }),
      L('M', 'm', 'm', [['mama', 'maman', '👩'], ['morze', 'mer', '🌊']]),
      L('N', 'n', 'n', [['nos', 'nez', '👃'], ['noga', 'jambe', '🦵']]),
      L('Ń', 'ɲ', 'gn, comme dans « agneau »', [['koń', 'cheval', '🐴'], ['dzień', 'jour', '🌞']], { g: 's', special: true, note: 'S’écrit « ni » devant une voyelle : nie, niebo.' }),
      L('O', 'ɔ', 'o ouvert, comme dans « porte »', [['okno', 'fenêtre', '🪟'], ['dom', 'maison', '🏠']], { g: 'v' }),
      L('Ó', 'u', 'ou, exactement comme « u »', [['mój', 'mon', '🔹'], ['góra', 'montagne', '⛰️']], { g: 'v', special: true, note: 'Ó et u se prononcent pareil ; seule l’orthographe change.' }),
      L('P', 'p', 'p', [['pies', 'chien', '🐶'], ['piwo', 'bière', '🍺']]),
      L('R', 'r', 'r roulé, comme en espagnol', [['ryba', 'poisson', '🐟'], ['rower', 'vélo', '🚲']]),
      L('S', 's', 's toujours sifflé, jamais « z »', [['sok', 'jus', '🧃'], ['nos', 'nez', '👃']], { g: 's', note: 'Même entre deux voyelles : « rosa » se dit « rossa ».' }),
      L('Ś', 'ɕ', 'ch doux, en souriant', [['świat', 'monde', '🌍'], ['coś', 'quelque chose', '🎁']], { g: 's', special: true, note: 'S’écrit « si » devant une voyelle : siostra, siedem.' }),
      L('T', 't', 't', [['tata', 'papa', '👨'], ['tak', 'oui', '✅']]),
      L('U', 'u', 'ou', [['ucho', 'oreille', '👂'], ['but', 'chaussure', '👞']], { g: 'v' }),
      L('W', 'v', 'v', [['woda', 'eau', '💧'], ['wino', 'vin', '🍷']], { note: 'Devient « f » en fin de mot et près d’une consonne sourde : Kraków, wtorek.' }),
      L('Y', 'ɨ', 'i « dur », entre i et eu', [['ryba', 'poisson', '🐟'], ['syn', 'fils', '🧑']], { g: 'v', note: 'Recule la langue en disant « i » : ty, my, syn.' }),
      L('Z', 'z', 'z', [['zupa', 'soupe', '🍲'], ['zero', 'zéro', '0️⃣']], { g: 's' }),
      L('Ź', 'ʑ', 'j doux, en souriant', [['źle', 'mal', '👎'], ['zima', 'hiver', '⛄']], { g: 's', special: true, note: 'S’écrit « zi » devant une voyelle : ziemia, zielony.' }),
      L('Ż', 'ʐ', 'j, comme dans « jour »', [['żaba', 'grenouille', '🐸'], ['żona', 'épouse', '👰']], { g: 's', special: true, note: 'Se prononce exactement comme « rz ».' }),
    ],
    digraphs: [
      L('Ch', 'x', 'h expiré (comme h)', [['chleb', 'pain', '🍞'], ['ucho', 'oreille', '👂']]),
      L('Cz', 't͡ʂ', 'tch dur, comme dans « tchèque »', [['czas', 'temps', '⏳'], ['czarny', 'noir', '⚫']], { g: 's' }),
      L('Dz', 'd͡z', 'dz', [['dzwon', 'cloche', '🔔'], ['bardzo', 'très', '‼️']], { g: 's' }),
      L('Dź', 'd͡ʑ', 'dj doux (s’écrit aussi « dzi »)', [['dziecko', 'enfant', '🧒'], ['dzień', 'jour', '🌞']], { g: 's' }),
      L('Dż', 'd͡ʐ', 'dj dur, comme dans « jean »', [['dżem', 'confiture', '🍓'], ['dżungla', 'jungle', '🌴']], { g: 's' }),
      L('Rz', 'ʐ', 'j, comme ż', [['rzeka', 'rivière', '🏞️'], ['morze', 'mer', '🌊']], { g: 's', note: 'Après p, t, k, ch, il devient « ch » : przepraszam, trzy.' }),
      L('Sz', 'ʂ', 'ch dur, comme dans « chat »', [['szkoła', 'école', '🏫'], ['kasza', 'gruau', '🥣']], { g: 's' }),
    ],

    /* Le fameux tableau des sifflantes : 3 rangées × 4 colonnes. */
    sibilants: {
      cols: ['Fricative sourde', 'Fricative sonore', 'Affriquée sourde', 'Affriquée sonore'],
      rows: [
        {
          name: 'Sifflantes', tag: 'dures « dentales »', color: 'blue',
          how: 'Pointe de la langue contre les dents du bas, comme en français.',
          cells: [['s', 'sok', 'jus', '🧃'], ['z', 'zupa', 'soupe', '🍲'], ['c', 'cebula', 'oignon', '🧅'], ['dz', 'dzwon', 'cloche', '🔔']],
        },
        {
          name: 'Chuintantes dures', tag: 'langue relevée', color: 'red',
          how: 'Pointe de la langue relevée vers le palais, lèvres légèrement arrondies. Son « sombre ».',
          cells: [['sz', 'szkoła', 'école', '🏫'], ['ż / rz', 'żaba', 'grenouille', '🐸'], ['cz', 'czekolada', 'chocolat', '🍫'], ['dż', 'dżem', 'confiture', '🍓']],
        },
        {
          name: 'Chuintantes douces', tag: 'langue bombée', color: 'green',
          how: 'Dos de la langue bombé contre le palais, lèvres étirées en sourire. Son « clair ».',
          cells: [['ś / si', 'śnieg', 'neige', '❄️'], ['ź / zi', 'źrebak', 'poulain', '🐴'], ['ć / ci', 'ćma', 'papillon de nuit', '🦋'], ['dź / dzi', 'dźwig', 'grue', '🏗️']],
        },
      ],
    },

    /* Paires minimales : un seul son change… et le sens aussi ! */
    pairs: [
      [['kasa', 'caisse'], ['kasza', 'gruau'], ['Kasia', 'Kasia (prénom)']],
      [['proszę', 's’il vous plaît'], ['prosię', 'porcelet']],
      [['czy', 'est-ce que'], ['ci', 'à toi']],
      [['wieś', 'village'], ['wiesz', 'tu sais']],
      [['los', 'destin'], ['łoś', 'élan']],
      [['lata', 'années'], ['łata', 'rustine']],
      [['był', 'il était'], ['bił', 'il battait']],
      [['być', 'être'], ['bić', 'battre']],
      [['cześć', 'salut'], ['część', 'partie']],
      [['sad', 'verger'], ['sąd', 'tribunal']],
      [['koza', 'chèvre'], ['kosa', 'faux']],
      [['czar', 'charme'], ['car', 'tsar']],
      [['rak', 'écrevisse'], ['rąk', 'des mains']],
      [['trzy', 'trois'], ['czy', 'est-ce que']],
      [['kosz', 'panier'], ['kos', 'merle']],
      [['mysz', 'souris'], ['miś', 'nounours']],
    ],

    twisters: [
      { pl: 'W Szczebrzeszynie chrząszcz brzmi w trzcinie.', fr: 'À Szczebrzeszyn, un hanneton bourdonne dans les roseaux.', note: 'Le virelangue le plus célèbre de Pologne, tiré d’un poème de Jan Brzechwa.' },
      { pl: 'Stół z powyłamywanymi nogami.', fr: 'Une table aux pieds cassés.', note: 'Idéal pour travailler le « ł » et le « y ».' },
      { pl: 'Król Karol kupił królowej Karolinie korale koloru koralowego.', fr: 'Le roi Charles a acheté à la reine Caroline des coraux couleur corail.', note: 'Un festival de « r » roulés et de « k ».' },
      { pl: 'Szedł Sasza suchą szosą.', fr: 'Sacha marchait sur la route sèche.', note: 'Pour distinguer « s » et « sz ».' },
      { pl: 'Chrząszcz brzmi w trzcinie.', fr: 'Le hanneton bourdonne dans les roseaux.', note: 'La version courte pour s’échauffer !' },
      { pl: 'Grzegorz Brzęczyszczykiewicz.', fr: 'Un nom de famille imprononçable…', note: 'Célèbre réplique d’une comédie polonaise de 1970.' },
    ],
  };
})();
