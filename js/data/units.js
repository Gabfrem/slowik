/* Słowik — curriculum : 15 unités (A1 → A2), 3 leçons + 1 défi par unité.
   Mot : W(polonais, français, emoji, { g: genre m/f/n/pl, ex: [pl, fr], note, pr: prononciation forcée, st: syllabe accentuée, plAlt })
   Phrase : Z(polonais, français, { plAlt, frAlt, note })
   Exercice à trous : { s: phrase avec ___, a: réponse, o: [distracteurs], fr, hint, why } */
(function () {
  'use strict';
  const W = (pl, fr, e, x) => Object.assign({ pl, fr, e }, x || {});
  const Z = (pl, fr, x) => Object.assign({ pl, fr }, x || {});

  S.data.units = [
    /* ───────────────────────── 1 ───────────────────────── */
    {
      id: 'u1', icon: '👋', level: 'A1',
      pl: 'Pierwsze słowa', fr: 'Premiers mots',
      desc: 'Saluer, remercier, s’excuser : les mots magiques du quotidien.',
      tips: [
        '**Dzień dobry** s’utilise toute la journée, jusqu’au soir. Le soir, on passe à **dobry wieczór**.',
        '**Cześć** est informel : il sert à la fois pour « salut » et « au revoir ».',
        '**Proszę** est un mot couteau suisse : s’il vous plaît, voilà, je vous en prie… et « pardon ? » pour faire répéter.',
      ],
      lessons: [
        {
          id: 'u1l1', pl: 'Powitania', fr: 'Salutations', icon: '☀️',
          words: [
            W('cześć', 'salut', '👋', { ex: ['Cześć, Ania!', 'Salut, Ania !'], note: 'Informel : entre amis et en famille. Sert aussi à dire au revoir.' }),
            W('dzień dobry', 'bonjour', '😃', { ex: ['Dzień dobry, jestem Marek.', 'Bonjour, je suis Marek.'], note: 'Littéralement « bon jour ». Formel, on l’utilise jusqu’au soir.' }),
            W('dobry wieczór', 'bonsoir', '🌆', { ex: ['Dobry wieczór, proszę pana.', 'Bonsoir, monsieur.'] }),
            W('do widzenia', 'au revoir', '🖐️', { ex: ['Do widzenia i dziękuję!', 'Au revoir et merci !'], note: 'Littéralement « jusqu’à se revoir ». Formel.' }),
            W('do zobaczenia', 'à bientôt', '🔜', { ex: ['Do zobaczenia jutro!', 'À demain !'], note: 'Littéralement « jusqu’à se voir » : on compte bien se revoir.' }),
            W('dobranoc', 'bonne nuit', '🌙', { ex: ['Dobranoc, kochanie!', 'Bonne nuit, mon cœur !'] }),
          ],
          sentences: [
            Z('Cześć, jak się masz?', 'Salut, comment vas-tu ?', { frAlt: ['Salut, comment ça va ?'] }),
            Z('Dzień dobry!', 'Bonjour !'),
            Z('Dobranoc, mamo!', 'Bonne nuit, maman !', { note: '« Mamo » : on interpelle quelqu’un avec le vocatif (mama → mamo).' }),
            Z('Do widzenia, do zobaczenia!', 'Au revoir, à bientôt !'),
          ],
        },
        {
          id: 'u1l2', pl: 'Grzeczność', fr: 'Politesse', icon: '🙏',
          words: [
            W('tak', 'oui', '✅', { ex: ['Tak, oczywiście.', 'Oui, bien sûr.'] }),
            W('nie', 'non', '❌', { ex: ['Nie, dziękuję.', 'Non, merci.'], note: '« Nie » sert aussi à la négation : nie wiem = je ne sais pas.' }),
            W('proszę', 's’il vous plaît', '🙏', { ex: ['Kawę, proszę.', 'Un café, s’il vous plaît.'], note: 'Veut aussi dire « voilà », « je vous en prie » et « pardon ? ».' }),
            W('dziękuję', 'merci', '💐', { ex: ['Dziękuję bardzo!', 'Merci beaucoup !'], note: 'Littéralement « je remercie ». Plus familier : dzięki.' }),
            W('przepraszam', 'pardon', '🙇', { ex: ['Przepraszam, gdzie jest dworzec?', 'Excusez-moi, où est la gare ?'], note: 'Pour s’excuser… ou pour interpeller poliment quelqu’un.' }),
            W('nie ma za co', 'de rien', '🤗', { ex: ['— Dziękuję! — Nie ma za co.', '— Merci ! — De rien.'], note: 'Littéralement « il n’y a pas de quoi ».' }),
          ],
          sentences: [
            Z('Dziękuję bardzo!', 'Merci beaucoup !'),
            Z('Nie ma za co.', 'De rien.', { frAlt: ['Il n’y a pas de quoi.'] }),
            Z('Przepraszam, nie rozumiem.', 'Pardon, je ne comprends pas.', { frAlt: ['Excusez-moi, je ne comprends pas.'] }),
            Z('Tak, proszę.', 'Oui, s’il vous plaît.', { frAlt: ['Oui, s’il te plaît.'] }),
            Z('Nie, dziękuję.', 'Non, merci.'),
          ],
        },
        {
          id: 'u1l3', pl: 'Jak się masz?', fr: 'Comment ça va ?', icon: '🙂',
          words: [
            W('jak się masz?', 'comment vas-tu ?', '🙂', { ex: ['Cześć! Jak się masz?', 'Salut ! Comment vas-tu ?'], note: 'Au vouvoiement : Jak się pan ma? (à un homme), Jak się pani ma? (à une femme).' }),
            W('dobrze', 'bien', '👍', { ex: ['Wszystko dobrze.', 'Tout va bien.'] }),
            W('bardzo', 'très', '‼️', { ex: ['Bardzo dobrze!', 'Très bien !'], note: 'Signifie « très » et « beaucoup » : bardzo dobrze, dziękuję bardzo.' }),
            W('źle', 'mal', '👎', { ex: ['Czuję się źle.', 'Je me sens mal.'] }),
            W('świetnie', 'super', '🤩', { ex: ['Świetnie, dziękuję!', 'Super, merci !'] }),
            W('a ty?', 'et toi ?', '👉', { ex: ['Dobrze. A ty?', 'Bien. Et toi ?'] }),
          ],
          sentences: [
            Z('Jak się masz?', 'Comment vas-tu ?', { frAlt: ['Comment ça va ?'] }),
            Z('Dobrze, dziękuję. A ty?', 'Bien, merci. Et toi ?'),
            Z('Bardzo dobrze!', 'Très bien !'),
            Z('Świetnie, dziękuję!', 'Super, merci !'),
            Z('Nie najgorzej.', 'Pas trop mal.'),
          ],
        },
      ],
      cloze: [
        { s: 'Dziękuję ___!', a: 'bardzo', o: ['dobrze', 'tak', 'źle'], fr: 'Merci beaucoup !' },
        { s: 'Nie ma za ___.', a: 'co', o: ['to', 'tak', 'nie'], fr: 'De rien.' },
        { s: 'Jak się ___?', a: 'masz', o: ['mam', 'jest', 'ty'], fr: 'Comment vas-tu ?', why: 'Mieć (avoir) : ja mam, ty masz. Littéralement « comment t’as-tu ? ».' },
        { s: 'Do ___!', a: 'widzenia', o: ['wieczór', 'dobry', 'proszę'], fr: 'Au revoir !' },
      ],
    },

    /* ───────────────────────── 2 ───────────────────────── */
    {
      id: 'u2', icon: '🙋', level: 'A1',
      pl: 'Kim jesteś?', fr: 'Qui es-tu ?',
      desc: 'Te présenter, dire d’où tu viens et quelles langues tu parles.',
      tips: [
        'Pas d’article en polonais : ni « le », ni « un ». **Kot** = le chat, un chat.',
        'Le pronom sujet est souvent omis : **jestem** = je suis. « Ja jestem » insiste sur « moi ».',
        'Après **jestem** + nom, on utilise l’instrumental : **Jestem Francuzem** (je suis français).',
      ],
      lessons: [
        {
          id: 'u2l1', pl: 'Mam na imię…', fr: 'Je m’appelle…', icon: '🏷️',
          words: [
            W('ja', 'je / moi', '🙋', { ex: ['Ja też!', 'Moi aussi !'] }),
            W('ty', 'tu / toi', '😉', { ex: ['Ty jesteś Marek?', 'Tu es Marek ?'] }),
            W('on', 'il', '🙎‍♂️', { ex: ['On ma na imię Piotr.', 'Il s’appelle Piotr.'] }),
            W('ona', 'elle', '🙎‍♀️', { ex: ['Ona jest z Polski.', 'Elle est de Pologne.'] }),
            W('mam na imię', 'je m’appelle', '🏷️', { ex: ['Mam na imię Anna.', 'Je m’appelle Anna.'], note: 'Littéralement « j’ai pour prénom ». Pour le nom de famille : nazywam się…' }),
            W('miło mi', 'enchanté', '🤝', { ex: ['Miło mi cię poznać.', 'Ravi de te connaître.'], note: 'Littéralement « ça m’est agréable ». Valable pour un homme comme pour une femme.' }),
          ],
          sentences: [
            Z('Mam na imię Anna.', 'Je m’appelle Anna.'),
            Z('Jak masz na imię?', 'Comment t’appelles-tu ?', { frAlt: ['Comment tu t’appelles ?'] }),
            Z('Miło mi!', 'Enchanté !', { frAlt: ['Enchantée !'] }),
            Z('On ma na imię Marek.', 'Il s’appelle Marek.'),
            Z('Ona ma na imię Ola.', 'Elle s’appelle Ola.'),
          ],
        },
        {
          id: 'u2l2', pl: 'Skąd jesteś?', fr: 'D’où viens-tu ?', icon: '🌍',
          words: [
            W('to jest', 'c’est', '👈', { ex: ['To jest Marek.', 'C’est Marek.'], note: 'Sert aussi à présenter : « voici ».' }),
            W('jestem', 'je suis', '🧍', { ex: ['Jestem z Francji.', 'Je suis de France.'] }),
            W('jesteś', 'tu es', '👤', { ex: ['Jesteś z Polski?', 'Tu es de Pologne ?'] }),
            W('skąd?', 'd’où ?', '🌍', { ex: ['Skąd jesteś?', 'D’où viens-tu ?'] }),
            W('z Francji', 'de France', '🥖', { ex: ['Jestem z Francji.', 'Je viens de France.'], note: 'Après « z » (de), le nom se met au génitif : Francja → z Francji. De Pologne : z Polski.' }),
            W('Francuz', 'Français', '🥐', { g: 'm', ex: ['On jest Francuzem.', 'Il est français.'], note: 'Une Française : Francuzka. Un Polonais : Polak, une Polonaise : Polka.' }),
          ],
          sentences: [
            Z('To jest Marek.', 'C’est Marek.', { frAlt: ['Voici Marek.'] }),
            Z('Jestem z Francji.', 'Je suis de France.', { frAlt: ['Je viens de France.'] }),
            Z('Skąd jesteś?', 'D’où viens-tu ?', { frAlt: ['D’où es-tu ?', 'Tu viens d’où ?'] }),
            Z('Anna jest z Polski.', 'Anna est de Pologne.', { frAlt: ['Anna vient de Pologne.'] }),
            Z('Jestem Francuzem.', 'Je suis français.'),
            Z('Jestem Francuzką.', 'Je suis française.'),
          ],
        },
        {
          id: 'u2l3', pl: 'Mówisz po polsku?', fr: 'Tu parles polonais ?', icon: '🗣️',
          words: [
            W('mówię', 'je parle', '🗣️', { ex: ['Mówię po francusku.', 'Je parle français.'] }),
            W('po polsku', 'en polonais', '🦅', { ex: ['Mówię trochę po polsku.', 'Je parle un peu polonais.'], note: 'Mówić po polsku = parler polonais. L’aigle blanc est l’emblème de la Pologne.' }),
            W('po francusku', 'en français', '🗨️', { ex: ['Czy mówisz po francusku?', 'Parles-tu français ?'] }),
            W('trochę', 'un peu', '🤏', { ex: ['Trochę rozumiem.', 'Je comprends un peu.'] }),
            W('rozumiem', 'je comprends', '💡', { ex: ['Nie rozumiem.', 'Je ne comprends pas.'] }),
            W('czy', 'est-ce que', '❔', { ex: ['Czy to jest kawa?', 'Est-ce que c’est du café ?'], note: 'Petit mot qui transforme une phrase en question fermée (oui/non).' }),
          ],
          sentences: [
            Z('Mówię trochę po polsku.', 'Je parle un peu polonais.', { frAlt: ['Je parle un peu le polonais.'] }),
            Z('Czy mówisz po francusku?', 'Est-ce que tu parles français ?', { frAlt: ['Parles-tu français ?', 'Tu parles français ?'] }),
            Z('Nie rozumiem.', 'Je ne comprends pas.'),
            Z('Rozumiem trochę.', 'Je comprends un peu.', { plAlt: ['Trochę rozumiem.'] }),
          ],
        },
      ],
      cloze: [
        { s: 'Ja ___ z Francji.', a: 'jestem', o: ['jesteś', 'jest', 'są'], fr: 'Je suis de France.', why: 'Być (être) : ja jestem, ty jesteś, on jest.' },
        { s: 'Ty ___ z Polski?', a: 'jesteś', o: ['jestem', 'jest', 'jesteśmy'], fr: 'Tu es de Pologne ?', why: 'Ty → jesteś.' },
        { s: 'Mam na ___ Anna.', a: 'imię', o: ['imiona', 'imienia', 'nazwisko'], fr: 'Je m’appelle Anna.' },
        { s: 'Mówię po ___.', a: 'polsku', o: ['polski', 'polska', 'Polsce'], fr: 'Je parle polonais.', why: 'Parler une langue : po + forme en -u (po polsku, po francusku).' },
        { s: 'Jestem ___.', hint: 'Francuz', a: 'Francuzem', o: ['Francuz', 'Francuza', 'Francuzie'], fr: 'Je suis français.', why: 'Być + nom → instrumental (-em pour le masculin).' },
      ],
    },

    /* ───────────────────────── 3 ───────────────────────── */
    {
      id: 'u3', icon: '🔢', level: 'A1',
      pl: 'Liczby', fr: 'Les nombres',
      desc: 'Compter, donner ton âge et demander un prix.',
      tips: [
        'Après 2, 3, 4 : **złote**, **lata**… Après 5 et plus : **złotych**, **lat** (génitif pluriel).',
        '12, 13 et 14 se comportent comme 5+ : **dwanaście złotych**.',
        'L’âge se dit avec « avoir » : **Mam dwadzieścia lat** (j’ai vingt ans).',
      ],
      lessons: [
        {
          id: 'u3l1', pl: 'Od zera do pięciu', fr: 'De 0 à 5', icon: '✋',
          words: [
            W('zero', 'zéro', '0️⃣'),
            W('jeden', 'un', '1️⃣', { ex: ['Jeden bilet, proszę.', 'Un billet, s’il vous plaît.'] }),
            W('dwa', 'deux', '2️⃣', { ex: ['Dwa piwa, proszę.', 'Deux bières, s’il vous plaît.'], note: 'Avec un nom féminin : dwie (dwie kawy).' }),
            W('trzy', 'trois', '3️⃣', { ex: ['Trzy kawy, proszę.', 'Trois cafés, s’il vous plaît.'] }),
            W('cztery', 'quatre', '4️⃣'),
            W('pięć', 'cinq', '5️⃣', { ex: ['Pięć minut!', 'Cinq minutes !'] }),
          ],
          sentences: [
            Z('Jeden, dwa, trzy, cztery, pięć.', 'Un, deux, trois, quatre, cinq.'),
            Z('Trzy kawy, proszę.', 'Trois cafés, s’il vous plaît.'),
            Z('Dwa piwa, proszę.', 'Deux bières, s’il vous plaît.'),
            Z('Pięć minut.', 'Cinq minutes.'),
          ],
        },
        {
          id: 'u3l2', pl: 'Od sześciu do dziesięciu', fr: 'De 6 à 10', icon: '🔟',
          words: [
            W('sześć', 'six', '6️⃣'),
            W('siedem', 'sept', '7️⃣'),
            W('osiem', 'huit', '8️⃣'),
            W('dziewięć', 'neuf', '9️⃣'),
            W('dziesięć', 'dix', '🔟'),
            W('ile?', 'combien ?', '🤔', { ex: ['Ile to kosztuje?', 'Combien ça coûte ?'] }),
          ],
          sentences: [
            Z('Ile to kosztuje?', 'Combien ça coûte ?', { frAlt: ['Ça coûte combien ?'] }),
            Z('Ile masz lat?', 'Quel âge as-tu ?', { note: 'Littéralement « combien as-tu d’années ? ».' }),
            Z('Mam dziesięć lat.', 'J’ai dix ans.'),
            Z('Mam siedem lat.', 'J’ai sept ans.'),
          ],
        },
        {
          id: 'u3l3', pl: 'Duże liczby', fr: 'Grands nombres', icon: '💰',
          words: [
            W('jedenaście', 'onze', '🕚'),
            W('dwanaście', 'douze', '🕛'),
            W('dwadzieścia', 'vingt', '🔢'),
            W('sto', 'cent', '💯', { note: '« Sto lat! » (cent ans !) : la chanson d’anniversaire polonaise.' }),
            W('tysiąc', 'mille', '🎆'),
            W('złoty', 'zloty', '🪙', { g: 'm', note: 'La monnaie polonaise. 1 złoty = 100 groszy. 2 złote, 5 złotych.' }),
          ],
          sentences: [
            Z('To kosztuje dwadzieścia złotych.', 'Ça coûte vingt zlotys.'),
            Z('Sto lat!', 'Joyeux anniversaire !', { frAlt: ['Cent ans !'], note: 'Littéralement « cent ans ! » : on souhaite une longue vie.' }),
            Z('Mam dwanaście lat.', 'J’ai douze ans.'),
            Z('Tysiąc złotych?', 'Mille zlotys ?'),
          ],
        },
      ],
      cloze: [
        { s: 'Mam dziesięć ___.', a: 'lat', o: ['lata', 'rok', 'roku'], fr: 'J’ai dix ans.', why: 'Après 5 et plus : génitif pluriel (lat).' },
        { s: 'Mam dwa ___.', a: 'lata', o: ['lat', 'rok', 'roku'], fr: 'J’ai deux ans.', why: 'Après 2, 3, 4 : nominatif pluriel (lata).' },
        { s: 'To kosztuje pięć ___.', a: 'złotych', o: ['złote', 'złoty', 'złotym'], fr: 'Ça coûte cinq zlotys.', why: '5 et plus → złotych.' },
        { s: 'To kosztuje trzy ___.', a: 'złote', o: ['złotych', 'złoty', 'złotego'], fr: 'Ça coûte trois zlotys.', why: '2, 3, 4 → złote.' },
        { s: '___ kawy, proszę.', a: 'Dwie', o: ['Dwa', 'Dwoje', 'Dwóch'], fr: 'Deux cafés, s’il vous plaît.', why: 'Avec un nom féminin (kawa), « deux » se dit dwie.' },
      ],
    },

    /* ───────────────────────── 4 ───────────────────────── */
    {
      id: 'u4', icon: '👨‍👩‍👧', level: 'A1',
      pl: 'Rodzina', fr: 'La famille',
      desc: 'Présenter ta famille et découvrir le genre des mots.',
      tips: [
        'Trois genres : masculin (souvent une consonne finale), féminin (souvent **-a**), neutre (**-o**, **-e**).',
        'Mon / ma : **mój** brat, **moja** siostra, **moje** dziecko.',
        'Après une négation, l’objet passe au génitif : Mam siostrę → **Nie mam siostry**.',
      ],
      lessons: [
        {
          id: 'u4l1', pl: 'Mama i tata', fr: 'Maman et papa', icon: '👪',
          words: [
            W('rodzina', 'famille', '👨‍👩‍👧', { g: 'f', ex: ['To jest moja rodzina.', 'C’est ma famille.'] }),
            W('mama', 'maman', '👩', { g: 'f', ex: ['Moja mama jest miła.', 'Ma maman est gentille.'] }),
            W('tata', 'papa', '👨', { g: 'm', ex: ['Mój tata pracuje w banku.', 'Mon papa travaille à la banque.'], note: 'Masculin, même s’il finit par -a !' }),
            W('brat', 'frère', '👦', { g: 'm', ex: ['Mam brata.', 'J’ai un frère.'] }),
            W('siostra', 'sœur', '👧', { g: 'f', ex: ['Moja siostra ma na imię Ola.', 'Ma sœur s’appelle Ola.'] }),
            W('mój', 'mon', '🔹', { ex: ['To jest mój brat.', 'C’est mon frère.'], note: 'Devant un nom masculin.' }),
            W('moja', 'ma', '🔸', { ex: ['To jest moja mama.', 'C’est ma maman.'], note: 'Devant un nom féminin.' }),
          ],
          sentences: [
            Z('To jest moja mama.', 'C’est ma maman.', { frAlt: ['C’est ma mère.', 'Voici ma maman.'] }),
            Z('To jest mój brat.', 'C’est mon frère.', { frAlt: ['Voici mon frère.'] }),
            Z('Moja siostra ma na imię Ola.', 'Ma sœur s’appelle Ola.'),
            Z('To jest moja rodzina.', 'C’est ma famille.', { frAlt: ['Voici ma famille.'] }),
          ],
        },
        {
          id: 'u4l2', pl: 'Dziadkowie', fr: 'Grands-parents', icon: '👵',
          words: [
            W('babcia', 'grand-mère', '👵', { g: 'f', ex: ['Babcia robi pierogi.', 'Mamie fait des pierogi.'] }),
            W('dziadek', 'grand-père', '👴', { g: 'm', ex: ['Dziadek ma sto lat!', 'Grand-père a cent ans !'] }),
            W('syn', 'fils', '🧑', { g: 'm', ex: ['Mam syna.', 'J’ai un fils.'] }),
            W('córka', 'fille', '🎀', { g: 'f', ex: ['To moja córka.', 'C’est ma fille.'], note: 'La fille (enfant de…). Une jeune fille : dziewczyna.' }),
            W('dziecko', 'enfant', '🧒', { g: 'n', ex: ['To jest moje dziecko.', 'C’est mon enfant.'], note: 'Pluriel irrégulier : dzieci.' }),
            W('moje', 'mon (neutre)', '🔘', { ex: ['Moje dziecko ma pięć lat.', 'Mon enfant a cinq ans.'], note: 'Devant un nom neutre : moje dziecko, moje okno.' }),
          ],
          sentences: [
            Z('Moja babcia jest bardzo miła.', 'Ma grand-mère est très gentille.'),
            Z('Mam syna i córkę.', 'J’ai un fils et une fille.'),
            Z('Dziadek ma sto lat!', 'Grand-père a cent ans !'),
            Z('To jest moje dziecko.', 'C’est mon enfant.'),
          ],
        },
        {
          id: 'u4l3', pl: 'Miłość', fr: 'L’amour', icon: '❤️',
          words: [
            W('mąż', 'mari', '💍', { g: 'm', ex: ['Mój mąż jest Polakiem.', 'Mon mari est polonais.'] }),
            W('żona', 'épouse', '👰', { g: 'f', ex: ['Moja żona jest z Polski.', 'Ma femme est de Pologne.'] }),
            W('przyjaciel', 'ami', '🫂', { g: 'm', note: 'Au féminin : przyjaciółka. Un simple copain : kolega.' }),
            W('przyjaciółka', 'amie', '👭', { g: 'f' }),
            W('kocham', 'j’aime (d’amour)', '❤️', { ex: ['Kocham cię!', 'Je t’aime !'], note: 'Kochać = aimer d’amour. Pour les goûts : lubić.' }),
            W('mam', 'j’ai', '🎒', { ex: ['Mam kota.', 'J’ai un chat.'], note: 'Verbe mieć (avoir) : mam, masz, ma…' }),
          ],
          sentences: [
            Z('Kocham moją rodzinę.', 'J’aime ma famille.'),
            Z('To jest mój mąż.', 'C’est mon mari.', { frAlt: ['Voici mon mari.'] }),
            Z('Mam brata.', 'J’ai un frère.'),
            Z('Nie mam siostry.', 'Je n’ai pas de sœur.', { note: 'Négation → génitif : siostra → siostry.' }),
            Z('Kocham cię!', 'Je t’aime !'),
          ],
        },
      ],
      cloze: [
        { s: 'To jest ___ mama.', a: 'moja', o: ['mój', 'moje', 'moją'], fr: 'C’est ma maman.', why: 'Mama est féminin → moja.' },
        { s: 'To jest ___ brat.', a: 'mój', o: ['moja', 'moje', 'mojego'], fr: 'C’est mon frère.', why: 'Brat est masculin → mój.' },
        { s: 'To jest ___ dziecko.', a: 'moje', o: ['mój', 'moja', 'moją'], fr: 'C’est mon enfant.', why: 'Dziecko est neutre → moje.' },
        { s: 'Nie mam ___.', hint: 'siostra', a: 'siostry', o: ['siostra', 'siostrę', 'siostrą'], fr: 'Je n’ai pas de sœur.', why: 'Négation → génitif : -a → -y.' },
        { s: 'Mam ___.', hint: 'siostra', a: 'siostrę', o: ['siostra', 'siostry', 'siostrze'], fr: 'J’ai une sœur.', why: 'Complément d’objet → accusatif : -a → -ę.' },
        { s: 'Kocham ___ rodzinę.', a: 'moją', o: ['moja', 'mój', 'moje'], fr: 'J’aime ma famille.', why: 'À l’accusatif, moja → moją.' },
      ],
    },

    /* ───────────────────────── 5 ───────────────────────── */
    {
      id: 'u5', icon: '🥟', level: 'A1',
      pl: 'Jedzenie', fr: 'À table !',
      desc: 'Commander au café, dire ce que tu manges et ce que tu bois.',
      tips: [
        '**Poproszę…** est la façon polie de commander : Poproszę kawę.',
        'Complément d’objet féminin : **-a devient -ę** (kawa → kawę, woda → wodę).',
        '**Z + instrumental** = avec : kawa z mlekiem, chleb z masłem.',
      ],
      lessons: [
        {
          id: 'u5l1', pl: 'W kawiarni', fr: 'Au café', icon: '☕',
          words: [
            W('kawa', 'café', '☕', { g: 'f', ex: ['Poproszę kawę.', 'Un café, s’il vous plaît.'] }),
            W('herbata', 'thé', '🍵', { g: 'f', ex: ['Herbata z cytryną.', 'Thé au citron.'] }),
            W('woda', 'eau', '💧', { g: 'f', ex: ['Piję wodę.', 'Je bois de l’eau.'] }),
            W('mleko', 'lait', '🥛', { g: 'n', ex: ['Kawa z mlekiem.', 'Café au lait.'] }),
            W('sok', 'jus', '🧃', { g: 'm', ex: ['Sok pomarańczowy, proszę.', 'Un jus d’orange, s’il vous plaît.'] }),
            W('poproszę', 'je voudrais', '🛎️', { ex: ['Poproszę herbatę.', 'Un thé, s’il vous plaît.'], note: 'Forme polie pour commander, suivie de l’accusatif.' }),
          ],
          sentences: [
            Z('Poproszę kawę.', 'Un café, s’il vous plaît.', { frAlt: ['Je voudrais un café.'] }),
            Z('Kawa czy herbata?', 'Café ou thé ?', { note: 'Dans une alternative, « czy » veut dire « ou ».' }),
            Z('Poproszę herbatę z mlekiem.', 'Un thé au lait, s’il vous plaît.', { frAlt: ['Je voudrais un thé au lait.'] }),
            Z('Poproszę wodę.', 'De l’eau, s’il vous plaît.', { frAlt: ['Je voudrais de l’eau.'] }),
          ],
        },
        {
          id: 'u5l2', pl: 'Jem i piję', fr: 'Je mange, je bois', icon: '🍴',
          words: [
            W('jem', 'je mange', '🍴', { ex: ['Jem śniadanie.', 'Je prends le petit-déjeuner.'] }),
            W('piję', 'je bois', '🥤', { ex: ['Piję sok.', 'Je bois du jus.'] }),
            W('lubię', 'j’aime bien', '🥰', { ex: ['Lubię kawę.', 'J’aime le café.'], note: 'Lubić = aimer (les goûts). Kochać = aimer d’amour.' }),
            W('chleb', 'pain', '🍞', { g: 'm', ex: ['Świeży chleb.', 'Du pain frais.'] }),
            W('ser', 'fromage', '🧀', { g: 'm' }),
            W('mięso', 'viande', '🥩', { g: 'n' }),
          ],
          sentences: [
            Z('Jem chleb z serem.', 'Je mange du pain avec du fromage.', { frAlt: ['Je mange du pain au fromage.'] }),
            Z('Nie jem mięsa.', 'Je ne mange pas de viande.'),
            Z('Piję wodę.', 'Je bois de l’eau.'),
            Z('Lubię ser.', 'J’aime le fromage.'),
            Z('Nie piję kawy.', 'Je ne bois pas de café.', { note: 'Négation → génitif : kawa → kawy.' }),
          ],
        },
        {
          id: 'u5l3', pl: 'Kuchnia polska', fr: 'Cuisine polonaise', icon: '🥟',
          words: [
            W('pierogi', 'raviolis polonais', '🥟', { g: 'pl', note: 'Raviolis farcis : viande, chou et champignons, ou « ruskie » (pomme de terre et fromage blanc).' }),
            W('barszcz', 'bortsch', '🥣', { g: 'm', note: 'Soupe de betterave rouge, servie à Noël avec des uszka (petits raviolis).' }),
            W('zupa', 'soupe', '🍲', { g: 'f' }),
            W('ryba', 'poisson', '🐟', { g: 'f' }),
            W('jabłko', 'pomme', '🍎', { g: 'n', pr: 'yApko', note: 'Le ł se fait presque muet : « yapko ».' }),
            W('smacznego!', 'bon appétit !', '🍽️', { note: 'Se dit avant de manger… ou à quelqu’un qui mange.' }),
          ],
          sentences: [
            Z('Lubię pierogi.', 'J’aime les pierogi.'),
            Z('To jest dobra zupa.', 'C’est une bonne soupe.'),
            Z('Smacznego!', 'Bon appétit !'),
            Z('Jem jabłko.', 'Je mange une pomme.'),
            Z('Barszcz jest czerwony.', 'Le bortsch est rouge.'),
          ],
        },
      ],
      cloze: [
        { s: 'Poproszę ___.', hint: 'kawa', a: 'kawę', o: ['kawa', 'kawy', 'kawą'], fr: 'Un café, s’il vous plaît.', why: 'Accusatif féminin : -a → -ę.' },
        { s: 'Nie piję ___.', hint: 'kawa', a: 'kawy', o: ['kawę', 'kawa', 'kawie'], fr: 'Je ne bois pas de café.', why: 'Négation → génitif : kawa → kawy.' },
        { s: 'Herbata z ___.', hint: 'mleko', a: 'mlekiem', o: ['mleko', 'mleka', 'mleku'], fr: 'Thé au lait.', why: 'Z (avec) + instrumental : -o → -iem après k.' },
        { s: 'Jem chleb z ___.', hint: 'ser', a: 'serem', o: ['ser', 'sera', 'serze'], fr: 'Je mange du pain avec du fromage.', why: 'Z (avec) + instrumental : -em.' },
        { s: 'Piję ___.', hint: 'woda', a: 'wodę', o: ['woda', 'wody', 'wodą'], fr: 'Je bois de l’eau.', why: 'Accusatif féminin : -a → -ę.' },
        { s: 'Nie jem ___.', hint: 'mięso', a: 'mięsa', o: ['mięso', 'mięsem', 'mięsie'], fr: 'Je ne mange pas de viande.', why: 'Négation → génitif : -o → -a.' },
      ],
    },

    /* ───────────────────────── 6 ───────────────────────── */
    {
      id: 'u6', icon: '🏙️', level: 'A1',
      pl: 'W mieście', fr: 'En ville',
      desc: 'Te repérer, demander ton chemin et prendre les transports.',
      tips: [
        'Où se trouve quelque chose ? **w / na + locatif** : w sklepie, na dworcu.',
        'Aller à pied = **iść** (idę) ; aller en véhicule = **jechać** (jadę).',
        'Le moyen de transport se met à l’instrumental : **jadę autobusem**, **tramwajem**.',
      ],
      lessons: [
        {
          id: 'u6l1', pl: 'Miejsca', fr: 'Les lieux', icon: '📍',
          words: [
            W('miasto', 'ville', '🏙️', { g: 'n', ex: ['To jest duże miasto.', 'C’est une grande ville.'] }),
            W('ulica', 'rue', '🛣️', { g: 'f' }),
            W('sklep', 'magasin', '🏪', { g: 'm' }),
            W('dworzec', 'gare', '🚉', { g: 'm', ex: ['Gdzie jest dworzec?', 'Où est la gare ?'], note: 'Masculin en polonais. À la gare : na dworcu.' }),
            W('apteka', 'pharmacie', '⚕️', { g: 'f' }),
            W('gdzie?', 'où ?', '📍', { ex: ['Gdzie jest apteka?', 'Où est la pharmacie ?'] }),
          ],
          sentences: [
            Z('Gdzie jest dworzec?', 'Où est la gare ?'),
            Z('To jest duże miasto.', 'C’est une grande ville.'),
            Z('Gdzie jest sklep?', 'Où est le magasin ?'),
            Z('Przepraszam, gdzie jest apteka?', 'Excusez-moi, où est la pharmacie ?', { frAlt: ['Pardon, où est la pharmacie ?'] }),
          ],
        },
        {
          id: 'u6l2', pl: 'Kierunki', fr: 'Les directions', icon: '🧭',
          words: [
            W('prosto', 'tout droit', '⬆️'),
            W('w lewo', 'à gauche', '⬅️'),
            W('w prawo', 'à droite', '➡️'),
            W('daleko', 'loin', '🔭'),
            W('blisko', 'près', '📌'),
            W('tutaj', 'ici', '👇', { note: 'Aussi : tu.' }),
          ],
          sentences: [
            Z('Idź prosto, potem w prawo.', 'Va tout droit, puis à droite.'),
            Z('Czy to daleko?', 'Est-ce que c’est loin ?', { frAlt: ['C’est loin ?'] }),
            Z('Hotel jest blisko.', 'L’hôtel est tout près.', { frAlt: ['L’hôtel est près.', 'L’hôtel est proche.'] }),
            Z('Apteka jest tutaj.', 'La pharmacie est ici.'),
            Z('Proszę skręcić w lewo.', 'Tournez à gauche, s’il vous plaît.'),
          ],
        },
        {
          id: 'u6l3', pl: 'Transport', fr: 'Les transports', icon: '🚋',
          words: [
            W('autobus', 'bus', '🚌', { g: 'm' }),
            W('tramwaj', 'tramway', '🚋', { g: 'm' }),
            W('pociąg', 'train', '🚆', { g: 'm' }),
            W('samochód', 'voiture', '🚗', { g: 'm', note: 'Masculin en polonais !' }),
            W('bilet', 'billet', '🎫', { g: 'm' }),
            W('jadę', 'je vais (en véhicule)', '🏎️', { note: 'Jechać = aller en véhicule. À pied : idę.' }),
          ],
          sentences: [
            Z('Jadę tramwajem.', 'Je prends le tramway.', { frAlt: ['Je vais en tramway.'] }),
            Z('Poproszę bilet do Krakowa.', 'Un billet pour Cracovie, s’il vous plaît.'),
            Z('Mam bilet.', 'J’ai un billet.'),
            Z('Jadę do Warszawy pociągiem.', 'Je vais à Varsovie en train.', { plAlt: ['Jadę pociągiem do Warszawy.'] }),
          ],
        },
      ],
      cloze: [
        { s: 'Jadę ___.', hint: 'tramwaj', a: 'tramwajem', o: ['tramwaj', 'tramwaju', 'tramwaja'], fr: 'Je prends le tramway.', why: 'Moyen de transport → instrumental (-em).' },
        { s: 'Poproszę bilet do ___.', hint: 'Kraków', a: 'Krakowa', o: ['Kraków', 'Krakowie', 'Krakowem'], fr: 'Un billet pour Cracovie.', why: 'Do (vers) + génitif.' },
        { s: 'Mieszkam w ___.', hint: 'Kraków', a: 'Krakowie', o: ['Kraków', 'Krakowa', 'Krakowem'], fr: 'J’habite à Cracovie.', why: 'W (à / dans) + locatif.' },
        { s: 'Jestem w ___.', hint: 'sklep', a: 'sklepie', o: ['sklep', 'sklepu', 'sklepem'], fr: 'Je suis au magasin.', why: 'W + locatif : sklep → sklepie.' },
        { s: 'Jadę ___.', hint: 'autobus', a: 'autobusem', o: ['autobus', 'autobusu', 'autobusie'], fr: 'Je prends le bus.', why: 'Instrumental pour le moyen de transport.' },
      ],
    },

    /* ───────────────────────── 7 ───────────────────────── */
    {
      id: 'u7', icon: '🏠', level: 'A1',
      pl: 'Dom', fr: 'La maison',
      desc: 'Décrire ton logement et les objets du quotidien.',
      tips: [
        '**Drzwi** (porte) n’existe qu’au pluriel : drzwi **są** otwarte.',
        'Sur / dans + locatif : **na stole** (sur la table), **w kuchni** (dans la cuisine).',
        'Les animaux sont « animés » : à l’accusatif, ils prennent **-a** → mam psa, mam kota.',
      ],
      lessons: [
        {
          id: 'u7l1', pl: 'Mieszkanie', fr: 'Le logement', icon: '🏠',
          words: [
            W('dom', 'maison', '🏠', { g: 'm', note: 'Do domu = à la maison (direction). W domu = à la maison (lieu).' }),
            W('mieszkanie', 'appartement', '🏢', { g: 'n' }),
            W('pokój', 'chambre', '🛋️', { g: 'm', note: 'Désigne aussi une pièce. Signifie également « la paix » !' }),
            W('kuchnia', 'cuisine', '🍳', { g: 'f' }),
            W('łazienka', 'salle de bain', '🛁', { g: 'f' }),
            W('mieszkam', 'j’habite', '📮', { ex: ['Mieszkam w Paryżu.', 'J’habite à Paris.'] }),
          ],
          sentences: [
            Z('Mieszkam w Paryżu.', 'J’habite à Paris.'),
            Z('Mam małe mieszkanie.', 'J’ai un petit appartement.'),
            Z('Kuchnia jest duża.', 'La cuisine est grande.'),
            Z('Gdzie jest łazienka?', 'Où est la salle de bain ?'),
          ],
        },
        {
          id: 'u7l2', pl: 'Meble', fr: 'Les meubles', icon: '🪑',
          words: [
            W('stół', 'table', '🪵', { g: 'm', note: 'Sur la table : na stole (ó devient o).' }),
            W('krzesło', 'chaise', '🪑', { g: 'n' }),
            W('łóżko', 'lit', '🛏️', { g: 'n' }),
            W('okno', 'fenêtre', '🪟', { g: 'n' }),
            W('drzwi', 'porte', '🚪', { g: 'pl', note: 'Toujours au pluriel : drzwi są zamknięte.' }),
            W('lampa', 'lampe', '🏮', { g: 'f' }),
          ],
          sentences: [
            Z('Kot jest na stole.', 'Le chat est sur la table.'),
            Z('Otwórz okno, proszę.', 'Ouvre la fenêtre, s’il te plaît.', { plAlt: ['Proszę, otwórz okno.'] }),
            Z('To jest moje łóżko.', 'C’est mon lit.'),
            Z('Drzwi są zamknięte.', 'La porte est fermée.'),
          ],
        },
        {
          id: 'u7l3', pl: 'Rzeczy', fr: 'Les objets', icon: '🔑',
          words: [
            W('kot', 'chat', '🐱', { g: 'm' }),
            W('pies', 'chien', '🐶', { g: 'm', note: 'Voyelle mobile : pies → psa, psy.' }),
            W('klucz', 'clé', '🔑', { g: 'm', note: 'Masculin en polonais : mój klucz.' }),
            W('książka', 'livre', '📖', { g: 'f' }),
            W('duży', 'grand', '🐘', { note: 'Duży (m), duża (f), duże (n).' }),
            W('mały', 'petit', '🐭', { note: 'Mały (m), mała (f), małe (n).' }),
          ],
          sentences: [
            Z('Mam psa i kota.', 'J’ai un chien et un chat.', { plAlt: ['Mam kota i psa.'] }),
            Z('Gdzie jest mój klucz?', 'Où est ma clé ?'),
            Z('To jest duży dom.', 'C’est une grande maison.'),
            Z('Czytam książkę.', 'Je lis un livre.'),
            Z('Mój kot jest mały.', 'Mon chat est petit.'),
          ],
        },
      ],
      cloze: [
        { s: 'Kot jest na ___.', hint: 'stół', a: 'stole', o: ['stół', 'stołu', 'stołem'], fr: 'Le chat est sur la table.', why: 'Na + locatif ; ó devient o : stół → stole.' },
        { s: 'Mieszkam w ___.', hint: 'Paryż', a: 'Paryżu', o: ['Paryż', 'Paryża', 'Paryżem'], fr: 'J’habite à Paris.', why: 'W + locatif : Paryż → Paryżu.' },
        { s: 'Mam ___ i kota.', hint: 'pies', a: 'psa', o: ['pies', 'psem', 'psie'], fr: 'J’ai un chien et un chat.', why: 'Masculin animé à l’accusatif : psa.' },
        { s: 'To jest ___ łóżko.', a: 'moje', o: ['mój', 'moja', 'moją'], fr: 'C’est mon lit.', why: 'Łóżko est neutre → moje.' },
        { s: 'Drzwi ___ zamknięte.', a: 'są', o: ['jest', 'jestem', 'jesteś'], fr: 'La porte est fermée.', why: 'Drzwi est toujours pluriel → są.' },
        { s: 'Czytam ___.', hint: 'książka', a: 'książkę', o: ['książka', 'książki', 'książką'], fr: 'Je lis un livre.', why: 'Accusatif féminin : -a → -ę.' },
      ],
    },

    /* ───────────────────────── 8 ───────────────────────── */
    {
      id: 'u8', icon: '📅', level: 'A1',
      pl: 'Czas', fr: 'Le temps qui passe',
      desc: 'Les jours de la semaine, l’heure et la fréquence.',
      tips: [
        'Les jours ne prennent pas de majuscule : poniedziałek, wtorek…',
        '« Samedi », « le dimanche » : **w + accusatif** → w sobotę, w niedzielę.',
        'Double négation obligatoire : **Nigdy nie** jem mięsa (je ne mange jamais de viande).',
      ],
      lessons: [
        {
          id: 'u8l1', pl: 'Dzisiaj', fr: 'Aujourd’hui', icon: '🗓️',
          words: [
            W('dzisiaj', 'aujourd’hui', '📅', { note: 'Aussi : dziś.' }),
            W('jutro', 'demain', '⏭️', { ex: ['Do jutra!', 'À demain !'] }),
            W('wczoraj', 'hier', '⏮️'),
            W('teraz', 'maintenant', '⏱️'),
            W('dzień', 'jour', '🌞', { g: 'm', note: 'Pluriel : dni.' }),
            W('tydzień', 'semaine', '🗓️', { g: 'm', note: 'Masculin. Pluriel : tygodnie.' }),
          ],
          sentences: [
            Z('Dzisiaj jest ładny dzień.', 'Aujourd’hui, c’est une belle journée.'),
            Z('Do jutra!', 'À demain !'),
            Z('Teraz nie mam czasu.', 'Maintenant, je n’ai pas le temps.', { plAlt: ['Nie mam teraz czasu.'] }),
            Z('Tydzień ma siedem dni.', 'Une semaine a sept jours.'),
          ],
        },
        {
          id: 'u8l2', pl: 'Dni tygodnia', fr: 'Les jours', icon: '📆',
          words: [
            W('poniedziałek', 'lundi', '😩', { g: 'm', note: 'De « po niedzieli » : après le dimanche.' }),
            W('wtorek', 'mardi', '✌️', { g: 'm', note: 'De « wtóry » : le deuxième (jour).' }),
            W('środa', 'mercredi', '🐪', { g: 'f', note: 'De « środek » : le milieu de la semaine.' }),
            W('czwartek', 'jeudi', '🍩', { g: 'm', note: 'De « cztery » : le quatrième jour.' }),
            W('piątek', 'vendredi', '🥳', { g: 'm', note: 'De « pięć » : le cinquième jour.' }),
            W('sobota', 'samedi', '🛍️', { g: 'f' }),
            W('niedziela', 'dimanche', '⛪', { g: 'f', note: 'De « nie działać » : le jour où l’on ne travaille pas.' }),
          ],
          sentences: [
            Z('Dzisiaj jest środa.', 'Aujourd’hui, c’est mercredi.', { plAlt: ['Dziś jest środa.'] }),
            Z('Jutro jest piątek.', 'Demain, c’est vendredi.'),
            Z('W sobotę idę do kina.', 'Samedi, je vais au cinéma.'),
            Z('W niedzielę odpoczywam.', 'Le dimanche, je me repose.'),
          ],
        },
        {
          id: 'u8l3', pl: 'Która godzina?', fr: 'Quelle heure ?', icon: '⏰',
          words: [
            W('godzina', 'heure', '⏰', { g: 'f' }),
            W('minuta', 'minute', '⏳', { g: 'f' }),
            W('rano', 'le matin', '🌅'),
            W('wieczorem', 'le soir', '🌃'),
            W('zawsze', 'toujours', '♾️'),
            W('nigdy', 'jamais', '🚫', { note: 'Toujours accompagné de « nie » : nigdy nie…' }),
          ],
          sentences: [
            Z('Która jest godzina?', 'Quelle heure est-il ?', { plAlt: ['Która godzina?'] }),
            Z('Rano piję kawę.', 'Le matin, je bois du café.'),
            Z('Nigdy nie jem mięsa.', 'Je ne mange jamais de viande.'),
            Z('Wieczorem czytam.', 'Le soir, je lis.'),
            Z('Zawsze mam czas dla ciebie.', 'J’ai toujours du temps pour toi.'),
          ],
        },
      ],
      cloze: [
        { s: 'W ___ idę do kina.', hint: 'sobota', a: 'sobotę', o: ['sobota', 'soboty', 'sobocie'], fr: 'Samedi, je vais au cinéma.', why: 'W + jour de la semaine → accusatif.' },
        { s: 'Do ___!', hint: 'jutro', a: 'jutra', o: ['jutro', 'jutrze', 'jutrem'], fr: 'À demain !', why: 'Do + génitif.' },
        { s: 'Nigdy ___ jem mięsa.', a: 'nie', o: ['tak', 'nic', 'już'], fr: 'Je ne mange jamais de viande.', why: 'Double négation obligatoire : nigdy nie.' },
        { s: 'Teraz nie mam ___.', hint: 'czas', a: 'czasu', o: ['czas', 'czasem', 'czasie'], fr: 'Maintenant, je n’ai pas le temps.', why: 'Négation → génitif : czas → czasu.' },
        { s: 'Dzisiaj ___ poniedziałek.', a: 'jest', o: ['są', 'jestem', 'ma'], fr: 'Aujourd’hui, c’est lundi.' },
      ],
    },

    /* ───────────────────────── 9 ───────────────────────── */
    {
      id: 'u9', icon: '🎨', level: 'A1',
      pl: 'Kolory i ubrania', fr: 'Couleurs & vêtements',
      desc: 'Décrire les couleurs et les vêtements : l’accord des adjectifs.',
      tips: [
        'L’adjectif s’accorde : **czerwony** (m), **czerwona** (f), **czerwone** (n).',
        'Après **k** et **g**, on écrit **-i** : niebieski, niebieska, niebieskie.',
        '**Spodnie** (pantalon) n’existe qu’au pluriel, comme drzwi.',
      ],
      lessons: [
        {
          id: 'u9l1', pl: 'Kolory', fr: 'Les couleurs', icon: '🎨',
          words: [
            W('czerwony', 'rouge', '🔴'),
            W('biały', 'blanc', '⚪'),
            W('czarny', 'noir', '⚫'),
            W('zielony', 'vert', '🟢'),
            W('niebieski', 'bleu', '🔵'),
            W('żółty', 'jaune', '🟡'),
          ],
          sentences: [
            Z('Flaga Polski jest biało-czerwona.', 'Le drapeau polonais est blanc et rouge.'),
            Z('Niebo jest niebieskie.', 'Le ciel est bleu.'),
            Z('Lubię kolor zielony.', 'J’aime la couleur verte.', { frAlt: ['J’aime le vert.'] }),
            Z('Mój samochód jest czarny.', 'Ma voiture est noire.'),
          ],
        },
        {
          id: 'u9l2', pl: 'Ubrania', fr: 'Les vêtements', icon: '👕',
          words: [
            W('koszula', 'chemise', '👔', { g: 'f' }),
            W('spodnie', 'pantalon', '👖', { g: 'pl', note: 'Toujours au pluriel : moje spodnie są…' }),
            W('sukienka', 'robe', '👗', { g: 'f' }),
            W('buty', 'chaussures', '👟', { g: 'pl' }),
            W('kurtka', 'veste', '🧥', { g: 'f' }),
            W('czapka', 'bonnet', '🧢', { g: 'f', note: 'Désigne aussi la casquette.' }),
          ],
          sentences: [
            Z('Ta sukienka jest piękna.', 'Cette robe est belle.'),
            Z('Mam nowe buty.', 'J’ai de nouvelles chaussures.'),
            Z('Gdzie są moje spodnie?', 'Où est mon pantalon ?'),
            Z('Biała koszula jest ładna.', 'La chemise blanche est jolie.'),
          ],
        },
        {
          id: 'u9l3', pl: 'Opisy', fr: 'Décrire', icon: '🏷️',
          words: [
            W('nowy', 'nouveau', '✨', { note: 'Signifie aussi « neuf » : nowe buty, des chaussures neuves.' }),
            W('stary', 'vieux', '🕰️'),
            W('ładny', 'joli', '🌸'),
            W('drogi', 'cher', '💎', { note: 'Signifie aussi « chemin » (droga) et « cher » dans une lettre : Drogi Marku !' }),
            W('tani', 'bon marché', '📉'),
            W('ten / ta / to', 'ce / cette', '☝️', { note: 'Ten (m), ta (f), to (n).' }),
          ],
          sentences: [
            Z('Ta kurtka jest za droga.', 'Cette veste est trop chère.'),
            Z('Ten sweter jest tani.', 'Ce pull est bon marché.'),
            Z('To jest ładna czapka.', 'C’est un joli bonnet.'),
            Z('Mój samochód jest stary.', 'Ma voiture est vieille.'),
          ],
        },
      ],
      cloze: [
        { s: 'Niebo jest ___.', a: 'niebieskie', o: ['niebieski', 'niebieska', 'niebieską'], fr: 'Le ciel est bleu.', why: 'Niebo est neutre → -ie.' },
        { s: 'Ta sukienka jest ___.', a: 'piękna', o: ['piękny', 'piękne', 'pięknie'], fr: 'Cette robe est belle.', why: 'Sukienka est féminin → -a.' },
        { s: '___ sweter jest tani.', a: 'Ten', o: ['Ta', 'To', 'Te'], fr: 'Ce pull est bon marché.', why: 'Sweter est masculin → ten.' },
        { s: 'Moje spodnie ___ czarne.', a: 'są', o: ['jest', 'jestem', 'jesteś'], fr: 'Mon pantalon est noir.', why: 'Spodnie est pluriel → są.' },
        { s: 'Mój samochód jest ___.', a: 'czerwony', o: ['czerwona', 'czerwone', 'czerwoną'], fr: 'Ma voiture est rouge.', why: 'Samochód est masculin → -y.' },
      ],
    },

    /* ───────────────────────── 10 ───────────────────────── */
    {
      id: 'u10', icon: '⏰', level: 'A2',
      pl: 'Codzienność', fr: 'Le quotidien',
      desc: 'Raconter ta journée : les verbes essentiels au présent.',
      tips: [
        'Trois grands modèles au présent : **-am / -asz** (czytam), **-ę / -esz** (piszę), **-ę / -isz** (mówię).',
        '**Uczyć się + génitif** : uczę się polskiego (j’apprends le polonais).',
        '**Słuchać** (écouter) est suivi du génitif : słucham muzyki.',
      ],
      lessons: [
        {
          id: 'u10l1', pl: 'Mój dzień', fr: 'Ma journée', icon: '☀️',
          words: [
            W('pracuję', 'je travaille', '💼', { ex: ['Pracuję w biurze.', 'Je travaille au bureau.'] }),
            W('uczę się', 'j’apprends', '📚', { ex: ['Uczę się polskiego.', 'J’apprends le polonais.'], note: 'Verbe pronominal : uczyć się (+ génitif).' }),
            W('czytam', 'je lis', '👓'),
            W('piszę', 'j’écris', '✍️'),
            W('słucham', 'j’écoute', '🎧', { note: 'Słuchać + génitif : słucham muzyki, słucham radia.' }),
            W('oglądam', 'je regarde', '📺', { note: 'Pour un film, la télé, un match…' }),
          ],
          sentences: [
            Z('Pracuję w biurze.', 'Je travaille au bureau.'),
            Z('Uczę się polskiego.', 'J’apprends le polonais.'),
            Z('Słucham muzyki.', 'J’écoute de la musique.'),
            Z('Wieczorem oglądam film.', 'Le soir, je regarde un film.'),
            Z('Piszę list.', 'J’écris une lettre.'),
          ],
        },
        {
          id: 'u10l2', pl: 'Rutyna', fr: 'La routine', icon: '🔁',
          words: [
            W('wstaję', 'je me lève', '🌄'),
            W('idę', 'je vais (à pied)', '🚶', { note: 'Iść = aller à pied, maintenant. En véhicule : jadę.' }),
            W('wracam', 'je rentre', '🏡'),
            W('śpię', 'je dors', '😴'),
            W('gotuję', 'je cuisine', '👩‍🍳'),
            W('robię', 'je fais', '🛠️'),
          ],
          sentences: [
            Z('Wstaję o siódmej.', 'Je me lève à sept heures.'),
            Z('Idę do pracy.', 'Je vais au travail.'),
            Z('Co robisz?', 'Que fais-tu ?', { frAlt: ['Qu’est-ce que tu fais ?', 'Tu fais quoi ?'] }),
            Z('Wracam do domu.', 'Je rentre à la maison.'),
            Z('Gotuję obiad.', 'Je prépare le déjeuner.'),
          ],
        },
        {
          id: 'u10l3', pl: 'Chcę i mogę', fr: 'Vouloir et pouvoir', icon: '💪',
          words: [
            W('chcę', 'je veux', '🎯'),
            W('mogę', 'je peux', '🔓'),
            W('muszę', 'je dois', '❗'),
            W('wiem', 'je sais', '🧠'),
            W('znam', 'je connais', '🗺️', { note: 'Znać : connaître (une personne, un lieu). Wiedzieć : savoir (une information).' }),
            W('potrzebuję', 'j’ai besoin', '🤲', { note: 'Potrzebować + génitif : potrzebuję pomocy.' }),
          ],
          sentences: [
            Z('Chcę spać.', 'Je veux dormir.'),
            Z('Nie wiem.', 'Je ne sais pas.'),
            Z('Czy mogę zapłacić kartą?', 'Puis-je payer par carte ?', { frAlt: ['Est-ce que je peux payer par carte ?'] }),
            Z('Muszę iść.', 'Je dois y aller.', { frAlt: ['Je dois partir.'] }),
            Z('Znam Warszawę.', 'Je connais Varsovie.'),
          ],
        },
      ],
      cloze: [
        { s: 'Uczę się ___.', hint: 'polski', a: 'polskiego', o: ['polski', 'polsku', 'polskim'], fr: 'J’apprends le polonais.', why: 'Uczyć się + génitif.' },
        { s: 'Słucham ___.', hint: 'muzyka', a: 'muzyki', o: ['muzyka', 'muzykę', 'muzyką'], fr: 'J’écoute de la musique.', why: 'Słuchać + génitif : -a → -i après k.' },
        { s: 'Idę do ___.', hint: 'praca', a: 'pracy', o: ['praca', 'pracę', 'pracą'], fr: 'Je vais au travail.', why: 'Do + génitif.' },
        { s: 'Ty ___ po polsku?', hint: 'mówić', a: 'mówisz', o: ['mówię', 'mówi', 'mówimy'], fr: 'Tu parles polonais ?', why: 'Mówić : ja mówię, ty mówisz, on mówi.' },
        { s: 'My ___ w Paryżu.', hint: 'mieszkać', a: 'mieszkamy', o: ['mieszkam', 'mieszkacie', 'mieszkają'], fr: 'Nous habitons à Paris.', why: 'Modèle -am : my → -amy.' },
        { s: 'Oni ___ polskiego.', hint: 'uczyć się', a: 'uczą się', o: ['uczy się', 'uczę się', 'uczymy się'], fr: 'Ils apprennent le polonais.', why: 'Oni → -ą.' },
      ],
    },

    /* ───────────────────────── 11 ───────────────────────── */
    {
      id: 'u11', icon: '🩺', level: 'A2',
      pl: 'Zdrowie i emocje', fr: 'Santé & émotions',
      desc: 'Dire où tu as mal, aller chez le médecin, exprimer tes émotions.',
      tips: [
        'J’ai mal à… : **Boli mnie** + nominatif (Boli mnie głowa).',
        'L’adjectif s’accorde avec toi : **jestem zmęczony** (homme) / **zmęczona** (femme).',
        '**Oko → oczy**, **ucho → uszy** : deux pluriels irréguliers.',
      ],
      lessons: [
        {
          id: 'u11l1', pl: 'Ciało', fr: 'Le corps', icon: '🧍',
          words: [
            W('głowa', 'tête', '🙆', { g: 'f' }),
            W('ręka', 'main', '✋', { g: 'f', note: 'Désigne la main et tout le bras. Pluriel : ręce.' }),
            W('noga', 'jambe', '🦵', { g: 'f', note: 'Désigne aussi le pied au quotidien.' }),
            W('oko', 'œil', '👁️', { g: 'n', note: 'Pluriel irrégulier : oczy.' }),
            W('ucho', 'oreille', '👂', { g: 'n', note: 'Pluriel irrégulier : uszy.' }),
            W('brzuch', 'ventre', '🤰', { g: 'm' }),
          ],
          sentences: [
            Z('Boli mnie głowa.', 'J’ai mal à la tête.', { note: 'Littéralement « la tête me fait mal ».' }),
            Z('Mam niebieskie oczy.', 'J’ai les yeux bleus.'),
            Z('Boli mnie brzuch.', 'J’ai mal au ventre.'),
            Z('Myję ręce.', 'Je me lave les mains.'),
          ],
        },
        {
          id: 'u11l2', pl: 'U lekarza', fr: 'Chez le médecin', icon: '🩺',
          words: [
            W('lekarz', 'médecin', '🧑‍⚕️', { g: 'm', note: 'Une femme médecin : lekarka.' }),
            W('chory', 'malade', '🤒', { note: 'Au féminin : chora.' }),
            W('gorączka', 'fièvre', '🌡️', { g: 'f' }),
            W('tabletka', 'comprimé', '💊', { g: 'f' }),
            W('szpital', 'hôpital', '🏥', { g: 'm' }),
            W('pomocy!', 'au secours !', '🆘'),
          ],
          sentences: [
            Z('Jestem chory.', 'Je suis malade.', { plAlt: ['Jestem chora.'] }),
            Z('Mam gorączkę.', 'J’ai de la fièvre.'),
            Z('Potrzebuję lekarza.', 'J’ai besoin d’un médecin.'),
            Z('Gdzie jest szpital?', 'Où est l’hôpital ?'),
            Z('Pomocy!', 'Au secours !'),
          ],
        },
        {
          id: 'u11l3', pl: 'Emocje', fr: 'Les émotions', icon: '🎭',
          words: [
            W('szczęśliwy', 'heureux', '😊', { note: 'Au féminin : szczęśliwa.' }),
            W('zmęczony', 'fatigué', '🥱', { note: 'Au féminin : zmęczona.' }),
            W('głodny', 'affamé', '🍕', { note: 'Jestem głodny = j’ai faim.' }),
            W('smutny', 'triste', '😢'),
            W('zły', 'en colère', '😠', { note: 'Signifie aussi « mauvais ».' }),
            W('wesoły', 'joyeux', '😄'),
          ],
          sentences: [
            Z('Jestem zmęczony.', 'Je suis fatigué.', { plAlt: ['Jestem zmęczona.'], frAlt: ['Je suis fatiguée.'] }),
            Z('Jestem głodna.', 'J’ai faim.', { plAlt: ['Jestem głodny.'] }),
            Z('Dlaczego jesteś smutny?', 'Pourquoi es-tu triste ?', { plAlt: ['Dlaczego jesteś smutna?'] }),
            Z('Jestem bardzo szczęśliwa!', 'Je suis très heureuse !', { plAlt: ['Jestem bardzo szczęśliwy!'], frAlt: ['Je suis très heureux !'] }),
          ],
        },
      ],
      cloze: [
        { s: 'Boli mnie ___.', hint: 'głowa', a: 'głowa', o: ['głowę', 'głowy', 'głową'], fr: 'J’ai mal à la tête.', why: 'Piège ! Głowa est le sujet → nominatif.' },
        { s: 'Potrzebuję ___.', hint: 'lekarz', a: 'lekarza', o: ['lekarz', 'lekarzem', 'lekarzu'], fr: 'J’ai besoin d’un médecin.', why: 'Potrzebować + génitif.' },
        { s: 'Ona jest ___.', hint: 'chory', a: 'chora', o: ['chory', 'chore', 'chorzy'], fr: 'Elle est malade.', why: 'Accord au féminin : -a.' },
        { s: 'Mam ___.', hint: 'gorączka', a: 'gorączkę', o: ['gorączka', 'gorączki', 'gorączką'], fr: 'J’ai de la fièvre.', why: 'Accusatif féminin : -a → -ę.' },
        { s: 'Mam niebieskie ___.', hint: 'oko', a: 'oczy', o: ['oka', 'oki', 'okna'], fr: 'J’ai les yeux bleus.', why: 'Pluriel irrégulier : oko → oczy.' },
      ],
    },

    /* ───────────────────────── 12 ───────────────────────── */
    {
      id: 'u12', icon: '🌦️', level: 'A2',
      pl: 'Pogoda i podróże', fr: 'Météo & voyages',
      desc: 'Parler du temps qu’il fait, des saisons et partir en voyage.',
      tips: [
        'Il pleut = **pada deszcz** (« la pluie tombe »), il neige = **pada śnieg**.',
        'Les saisons à l’instrumental signifient « en » : **latem** (en été), **zimą** (en hiver).',
        '**Nad morze** (à la mer), **w góry** (à la montagne) : direction → accusatif.',
      ],
      lessons: [
        {
          id: 'u12l1', pl: 'Pogoda', fr: 'La météo', icon: '🌦️',
          words: [
            W('pogoda', 'météo', '🌦️', { g: 'f', note: 'Le temps qu’il fait. Ładna pogoda = beau temps.' }),
            W('słońce', 'soleil', '☀️', { g: 'n' }),
            W('deszcz', 'pluie', '🌧️', { g: 'm' }),
            W('śnieg', 'neige', '❄️', { g: 'm' }),
            W('zimno', 'il fait froid', '🥶', { note: 'Jest zimno = il fait froid. Zimno mi = j’ai froid.' }),
            W('ciepło', 'il fait chaud', '♨️', { note: 'Chaud et agréable. Très chaud : gorąco.' }),
          ],
          sentences: [
            Z('Jaka jest dzisiaj pogoda?', 'Quel temps fait-il aujourd’hui ?'),
            Z('Pada deszcz.', 'Il pleut.'),
            Z('Pada śnieg.', 'Il neige.'),
            Z('Jest zimno.', 'Il fait froid.'),
            Z('Świeci słońce.', 'Le soleil brille.'),
          ],
        },
        {
          id: 'u12l2', pl: 'Pory roku', fr: 'Les saisons', icon: '🍂',
          words: [
            W('wiosna', 'printemps', '🌷', { g: 'f' }),
            W('lato', 'été', '🏖️', { g: 'n' }),
            W('jesień', 'automne', '🍂', { g: 'f', note: 'Féminin malgré la consonne finale.' }),
            W('zima', 'hiver', '⛄', { g: 'f' }),
            W('morze', 'mer', '🌊', { g: 'n', note: 'La mer Baltique : Morze Bałtyckie.' }),
            W('góry', 'montagnes', '🏔️', { g: 'pl', note: 'Les Tatras (Tatry) sont les plus hautes montagnes de Pologne.' }),
          ],
          sentences: [
            Z('Latem jadę nad morze.', 'En été, je vais à la mer.'),
            Z('Zimą jadę w góry.', 'En hiver, je vais à la montagne.'),
            Z('Wiosna jest piękna.', 'Le printemps est beau.'),
            Z('Jesienią często pada deszcz.', 'En automne, il pleut souvent.'),
          ],
        },
        {
          id: 'u12l3', pl: 'Podróż', fr: 'Le voyage', icon: '✈️',
          words: [
            W('wakacje', 'vacances', '🌴', { g: 'pl' }),
            W('walizka', 'valise', '🧳', { g: 'f' }),
            W('paszport', 'passeport', '🛂', { g: 'm' }),
            W('lotnisko', 'aéroport', '✈️', { g: 'n' }),
            W('podróż', 'voyage', '🧭', { g: 'f', note: 'Féminin malgré la consonne finale !' }),
            W('zwiedzam', 'je visite', '📸', { note: 'Zwiedzać : visiter un lieu. Rendre visite à quelqu’un : odwiedzać.' }),
          ],
          sentences: [
            Z('Jadę na wakacje do Polski.', 'Je pars en vacances en Pologne.'),
            Z('Gdzie jest mój paszport?', 'Où est mon passeport ?'),
            Z('Zwiedzam Kraków.', 'Je visite Cracovie.'),
            Z('Szczęśliwej podróży!', 'Bon voyage !'),
          ],
        },
      ],
      cloze: [
        { s: 'Pada ___.', hint: 'deszcz', a: 'deszcz', o: ['deszczu', 'deszczem', 'deszcze'], fr: 'Il pleut.', why: 'Deszcz est le sujet → nominatif.' },
        { s: 'Latem jadę nad ___.', hint: 'morze', a: 'morze', o: ['morza', 'morzu', 'morzem'], fr: 'En été, je vais à la mer.', why: 'Nad + accusatif pour la direction (neutre : forme identique).' },
        { s: 'Jadę na wakacje do ___.', hint: 'Polska', a: 'Polski', o: ['Polska', 'Polskę', 'Polsce'], fr: 'Je pars en vacances en Pologne.', why: 'Do + génitif : Polska → Polski.' },
        { s: 'Mieszkam w ___.', hint: 'Polska', a: 'Polsce', o: ['Polska', 'Polski', 'Polskę'], fr: 'J’habite en Pologne.', why: 'W + locatif : Polska → Polsce.' },
        { s: '___ jest zimno.', hint: 'zima', a: 'Zimą', o: ['Zima', 'Zimę', 'Zimy'], fr: 'En hiver, il fait froid.', why: 'Saison + instrumental = « en ».' },
      ],
    },

    /* ───────────────────────── 13 ───────────────────────── */
    {
      id: 'u13', icon: '⏳', level: 'A2',
      pl: 'Przeszłość i przyszłość', fr: 'Passé & futur',
      desc: 'Raconter ce que tu as fait… et ce que tu feras.',
      tips: [
        'Le passé s’accorde en genre : **byłem** (homme), **byłam** (femme).',
        'Formation : radical + **ł** + terminaison : czyta-**ł**-em, czyta-**ł**-am.',
        'Futur : **będę** + infinitif (będę pracować) ou verbe perfectif (**zrobię**).',
      ],
      lessons: [
        {
          id: 'u13l1', pl: 'Byłem, byłam', fr: 'J’étais', icon: '🕰️',
          words: [
            W('byłem', 'j’étais (homme)', '🧔', { note: 'Une femme dit : byłam.' }),
            W('byłam', 'j’étais (femme)', '👩‍🦱'),
            W('był', 'il était', '👨‍🦳'),
            W('była', 'elle était', '👩‍🦳'),
            W('w zeszłym tygodniu', 'la semaine dernière', '⏪'),
            W('kiedyś', 'autrefois', '📜', { note: 'Signifie aussi « un jour » (passé ou futur).' }),
          ],
          sentences: [
            Z('Wczoraj byłem w kinie.', 'Hier, j’étais au cinéma.', { frAlt: ['Hier, je suis allé au cinéma.'] }),
            Z('Byłam w Polsce.', 'J’étais en Pologne.', { frAlt: ['Je suis allée en Pologne.'] }),
            Z('Gdzie byłeś?', 'Où étais-tu ?'),
            Z('Kiedyś byłem w Krakowie.', 'Je suis déjà allé à Cracovie.'),
          ],
        },
        {
          id: 'u13l2', pl: 'Co robiłeś?', fr: 'Qu’as-tu fait ?', icon: '🎬',
          words: [
            W('robiłem / robiłam', 'j’ai fait', '🧹', { note: 'Homme : robiłem. Femme : robiłam.' }),
            W('jadłem / jadłam', 'j’ai mangé', '🍝'),
            W('piłem / piłam', 'j’ai bu', '🍷'),
            W('widziałem / widziałam', 'j’ai vu', '👀'),
            W('miałem / miałam', 'j’avais', '🎁'),
            W('poszedłem / poszłam', 'je suis allé', '🚶‍♀️', { note: 'Passé de pójść (aller, perfectif). Forme irrégulière.' }),
          ],
          sentences: [
            Z('Co robiłeś wczoraj?', 'Qu’as-tu fait hier ?', { plAlt: ['Co robiłaś wczoraj?'], frAlt: ['Qu’est-ce que tu as fait hier ?'] }),
            Z('Jadłam pierogi.', 'J’ai mangé des pierogi.', { plAlt: ['Jadłem pierogi.'] }),
            Z('Widziałem ten film.', 'J’ai vu ce film.', { plAlt: ['Widziałam ten film.'] }),
            Z('Poszłam do sklepu.', 'Je suis allée au magasin.', { plAlt: ['Poszedłem do sklepu.'] }),
          ],
        },
        {
          id: 'u13l3', pl: 'Przyszłość', fr: 'Le futur', icon: '🔮',
          words: [
            W('będę', 'je serai', '🔮'),
            W('będziesz', 'tu seras', '🌠'),
            W('zrobię', 'je ferai', '✔️', { note: 'Verbe perfectif : sa forme « présente » exprime le futur.' }),
            W('pojadę', 'j’irai', '🚀', { note: 'En véhicule.' }),
            W('zobaczymy', 'on verra', '🤞'),
            W('za tydzień', 'dans une semaine', '📆'),
          ],
          sentences: [
            Z('Jutro będę w domu.', 'Demain, je serai à la maison.'),
            Z('Zobaczymy!', 'On verra !'),
            Z('Pojadę do Polski latem.', 'J’irai en Pologne en été.', { plAlt: ['Latem pojadę do Polski.'] }),
            Z('Zrobię to jutro.', 'Je le ferai demain.'),
            Z('Za tydzień będę w Krakowie.', 'Dans une semaine, je serai à Cracovie.'),
          ],
        },
      ],
      cloze: [
        { s: 'Wczoraj Marek ___ w kinie.', a: 'był', o: ['była', 'było', 'byli'], fr: 'Hier, Marek était au cinéma.', why: 'Sujet masculin → był.' },
        { s: 'Anna ___ w Polsce.', a: 'była', o: ['był', 'byłem', 'byli'], fr: 'Anna était en Pologne.', why: 'Sujet féminin → była.' },
        { s: 'Ja (Ewa) ___ pierogi.', a: 'jadłam', o: ['jadłem', 'jadła', 'jadł'], fr: 'Moi (Ewa), j’ai mangé des pierogi.', why: 'Une femme parle d’elle : -łam.' },
        { s: 'Jutro ___ w domu.', a: 'będę', o: ['byłem', 'jestem', 'będzie'], fr: 'Demain, je serai à la maison.', why: 'Futur de być : będę.' },
        { s: 'Tomek, gdzie ___?', a: 'byłeś', o: ['byłaś', 'byłem', 'był'], fr: 'Tomek, où étais-tu ?', why: 'Tu (homme) → byłeś.' },
      ],
    },

    /* ───────────────────────── 14 ───────────────────────── */
    {
      id: 'u14', icon: '🛒', level: 'A2',
      pl: 'Zakupy i restauracja', fr: 'Courses & restaurant',
      desc: 'Faire tes courses, payer et commander au restaurant.',
      tips: [
        'Payer par carte / en espèces : **płacić kartą / gotówką** (instrumental).',
        'Un kilo de… : **kilogram + génitif pluriel** (kilogram jabłek).',
        'Au restaurant, on interpelle poliment le serveur avec « **Przepraszam!** ».',
      ],
      lessons: [
        {
          id: 'u14l1', pl: 'Na targu', fr: 'Au marché', icon: '🧺',
          words: [
            W('kosztuje', 'coûte', '💰', { note: 'Ile kosztuje…? = Combien coûte… ? Pluriel : kosztują.' }),
            W('kilogram', 'kilo', '⚖️', { g: 'm', note: 'Familier : kilo.' }),
            W('płacę', 'je paie', '💸'),
            W('gotówka', 'espèces', '💵', { g: 'f' }),
            W('karta', 'carte', '💳', { g: 'f', note: 'Carte bancaire… et aussi le menu : karta dań.' }),
            W('reszta', 'monnaie', '👛', { g: 'f', note: 'La monnaie rendue. Signifie aussi « le reste ».' }),
          ],
          sentences: [
            Z('Ile kosztuje kilogram jabłek?', 'Combien coûte un kilo de pommes ?'),
            Z('Płacę kartą.', 'Je paie par carte.'),
            Z('Płacę gotówką.', 'Je paie en espèces.'),
            Z('Reszty nie trzeba.', 'Gardez la monnaie.'),
          ],
        },
        {
          id: 'u14l2', pl: 'W restauracji', fr: 'Au restaurant', icon: '🍽️',
          words: [
            W('stolik', 'table (au restaurant)', '🕯️', { g: 'm', note: 'Une table de restaurant (petite table). Le meuble : stół.' }),
            W('menu', 'menu', '📋', { g: 'n', note: 'Neutre et invariable.' }),
            W('rachunek', 'addition', '🧾', { g: 'm' }),
            W('kelner', 'serveur', '🤵', { g: 'm', note: 'Une serveuse : kelnerka.' }),
            W('deser', 'dessert', '🍰', { g: 'm' }),
            W('napiwek', 'pourboire', '💶', { g: 'm' }),
          ],
          sentences: [
            Z('Poproszę rachunek.', 'L’addition, s’il vous plaît.'),
            Z('Czy jest wolny stolik?', 'Y a-t-il une table libre ?', { frAlt: ['Est-ce qu’il y a une table libre ?'] }),
            Z('Dla mnie pierogi.', 'Pour moi, des pierogi.'),
            Z('Poproszę menu.', 'Le menu, s’il vous plaît.'),
          ],
        },
        {
          id: 'u14l3', pl: 'Smaki', fr: 'Les saveurs', icon: '👅',
          words: [
            W('pyszny', 'délicieux', '😋'),
            W('słodki', 'sucré', '🍭'),
            W('ostry', 'épicé', '🌶️', { note: 'Signifie aussi « tranchant ».' }),
            W('słony', 'salé', '🧂'),
            W('gorący', 'brûlant', '🔥'),
            W('zimny', 'froid', '🧊', { note: 'Pour un objet : zimna woda. « Il fait froid » : jest zimno.' }),
          ],
          sentences: [
            Z('Ta zupa jest pyszna!', 'Cette soupe est délicieuse !'),
            Z('Kawa jest za gorąca.', 'Le café est trop chaud.'),
            Z('Czy to jest ostre?', 'Est-ce que c’est épicé ?', { frAlt: ['C’est épicé ?'] }),
            Z('Lubię słodkie desery.', 'J’aime les desserts sucrés.'),
          ],
        },
      ],
      cloze: [
        { s: 'Płacę ___.', hint: 'karta', a: 'kartą', o: ['karta', 'kartę', 'karty'], fr: 'Je paie par carte.', why: 'Moyen → instrumental : -a → -ą.' },
        { s: 'Poproszę ___.', hint: 'rachunek', a: 'rachunek', o: ['rachunku', 'rachunkiem', 'rachunki'], fr: 'L’addition, s’il vous plaît.', why: 'Masculin inanimé : accusatif = nominatif.' },
        { s: 'Kilogram ___, proszę.', hint: 'jabłka', a: 'jabłek', o: ['jabłka', 'jabłko', 'jabłkami'], fr: 'Un kilo de pommes, s’il vous plaît.', why: 'Quantité → génitif pluriel.' },
        { s: 'Ta zupa jest ___!', a: 'pyszna', o: ['pyszny', 'pyszne', 'pysznie'], fr: 'Cette soupe est délicieuse !', why: 'Zupa est féminin → -a.' },
      ],
    },

    /* ───────────────────────── 15 ───────────────────────── */
    {
      id: 'u15', icon: '⚽', level: 'A2',
      pl: 'Czas wolny', fr: 'Loisirs',
      desc: 'Parler de tes loisirs, proposer une sortie, accepter ou refuser.',
      tips: [
        '**Grać w** + accusatif pour un jeu (grać w piłkę), **grać na** + locatif pour un instrument (grać na gitarze).',
        '**Idziemy…?** est une façon naturelle de proposer : Idziemy do kina?',
        '**Chętnie!** = volontiers ; **Niestety…** = malheureusement…',
      ],
      lessons: [
        {
          id: 'u15l1', pl: 'Hobby', fr: 'Les loisirs', icon: '🎸',
          words: [
            W('sport', 'sport', '🏅', { g: 'm' }),
            W('muzyka', 'musique', '🎵', { g: 'f', st: 0, note: 'Exception : l’accent tombe sur MU-zy-ka.' }),
            W('kino', 'cinéma', '🍿', { g: 'n' }),
            W('teatr', 'théâtre', '🎭', { g: 'm' }),
            W('piłka nożna', 'football', '⚽', { g: 'f', note: 'Littéralement « ballon de pied ».' }),
            W('gitara', 'guitare', '🎸', { g: 'f' }),
          ],
          sentences: [
            Z('Lubię muzykę.', 'J’aime la musique.'),
            Z('Idziemy do kina?', 'On va au cinéma ?', { frAlt: ['Nous allons au cinéma ?'] }),
            Z('Gram na gitarze.', 'Je joue de la guitare.'),
            Z('Gram w piłkę nożną.', 'Je joue au football.', { frAlt: ['Je joue au foot.'] }),
          ],
        },
        {
          id: 'u15l2', pl: 'Aktywności', fr: 'Activités', icon: '🏊',
          words: [
            W('gram', 'je joue', '🎮'),
            W('pływam', 'je nage', '🏊'),
            W('tańczę', 'je danse', '💃'),
            W('śpiewam', 'je chante', '🎤'),
            W('biegam', 'je cours', '🏃'),
            W('podróżuję', 'je voyage', '🌐'),
          ],
          sentences: [
            Z('Latem pływam w morzu.', 'En été, je nage dans la mer.'),
            Z('Ona pięknie śpiewa.', 'Elle chante magnifiquement.', { frAlt: ['Elle chante très bien.'] }),
            Z('Czy tańczysz?', 'Est-ce que tu danses ?', { frAlt: ['Tu danses ?', 'Danses-tu ?'] }),
            Z('Biegam rano.', 'Je cours le matin.', { plAlt: ['Rano biegam.'] }),
          ],
        },
        {
          id: 'u15l3', pl: 'Zaproszenie', fr: 'L’invitation', icon: '💌',
          words: [
            W('masz czas?', 'tu as le temps ?', '⌚'),
            W('chętnie', 'volontiers', '🙌'),
            W('może', 'peut-être', '🤷', { note: 'Signifie aussi « il/elle peut ».' }),
            W('razem', 'ensemble', '👫'),
            W('weekend', 'week-end', '🎉', { g: 'm', pr: 'wIkènt', note: 'Se prononce « ouikènt ».' }),
            W('niestety', 'malheureusement', '😕'),
          ],
          sentences: [
            Z('Masz czas w sobotę?', 'Tu as le temps samedi ?', { frAlt: ['As-tu le temps samedi ?'] }),
            Z('Chętnie!', 'Volontiers !', { frAlt: ['Avec plaisir !'] }),
            Z('Może jutro?', 'Peut-être demain ?'),
            Z('Niestety nie mam czasu.', 'Malheureusement, je n’ai pas le temps.'),
            Z('Idziemy razem?', 'On y va ensemble ?'),
          ],
        },
      ],
      cloze: [
        { s: 'Gram na ___.', hint: 'gitara', a: 'gitarze', o: ['gitara', 'gitarę', 'gitary'], fr: 'Je joue de la guitare.', why: 'Grać na + locatif pour un instrument.' },
        { s: 'Gram w ___ nożną.', hint: 'piłka', a: 'piłkę', o: ['piłka', 'piłce', 'piłki'], fr: 'Je joue au football.', why: 'Grać w + accusatif pour un jeu.' },
        { s: 'Idziemy do ___?', hint: 'kino', a: 'kina', o: ['kino', 'kinie', 'kinem'], fr: 'On va au cinéma ?', why: 'Do + génitif : kino → kina.' },
        { s: 'Lubię ___.', hint: 'muzyka', a: 'muzykę', o: ['muzyka', 'muzyki', 'muzyką'], fr: 'J’aime la musique.', why: 'Lubić + accusatif.' },
      ],
    },
  ];

  /* Dictionnaire des formes fléchies rencontrées dans les phrases (info-bulles au survol). */
  S.data.gloss = {
    a: 'et / alors', ale: 'mais', i: 'et', z: 'avec / de', w: 'dans / à', na: 'sur / à', do: 'vers / à / jusqu’à', o: 'à (heure) / de (sujet)', dla: 'pour', za: 'trop / dans (temps)', nad: 'au bord de',
    jest: 'est', są: 'sont', ma: 'a', masz: 'tu as', się: '(pronom réfléchi)', to: 'ce / c’est', te: 'ces', też: 'aussi', potem: 'puis', już: 'déjà',
    mamo: 'maman ! (vocatif)', mnie: 'me / moi', cię: 'te', ciebie: 'toi', mi: 'me / à moi',
    wszystko: 'tout', najgorzej: 'le pire', oczywiście: 'bien sûr', jak: 'comment', co: 'quoi / que', kto: 'qui', która: 'quelle', jaka: 'quelle', dlaczego: 'pourquoi',
    kawę: 'café (accusatif)', kawy: 'café (génitif) / cafés', herbatę: 'thé (accusatif)', wodę: 'eau (accusatif)', mlekiem: 'lait (instrumental)', serem: 'fromage (instrumental)', mięsa: 'viande (génitif)',
    cytryną: 'citron (instrumental)', pomarańczowy: 'd’orange', śniadanie: 'petit-déjeuner', świeży: 'frais', dobra: 'bonne', dobry: 'bon', czerwony: 'rouge',
    piwa: 'bières', minut: 'minutes (génitif pl.)', lat: 'ans (génitif pl.)', lata: 'ans', złotych: 'zlotys (génitif pl.)', złote: 'zlotys', kosztuje: 'coûte',
    miła: 'gentille', miły: 'gentil', brata: 'frère (accusatif)', siostry: 'sœur (génitif)', siostrę: 'sœur (accusatif)', syna: 'fils (accusatif)', córkę: 'fille (accusatif)', rodzinę: 'famille (accusatif)', moją: 'ma (accusatif)', kota: 'chat (accusatif)', psa: 'chien (accusatif)',
    francuzem: 'Français (instrumental)', francuzką: 'Française (instrumental)', polakiem: 'Polonais (instrumental)', polski: 'de Pologne / polonais', francji: 'France (génitif)', polsce: 'Pologne (locatif)',
    krakowa: 'Cracovie (génitif)', krakowie: 'Cracovie (locatif)', kraków: 'Cracovie', warszawy: 'Varsovie (génitif)', warszawę: 'Varsovie (accusatif)', paryżu: 'Paris (locatif)',
    tramwajem: 'en tramway (instrumental)', pociągiem: 'en train (instrumental)', hotel: 'hôtel', idź: 'va ! (impératif)', skręcić: 'tourner', duże: 'grand (neutre)', duża: 'grande', małe: 'petit (neutre)',
    stole: 'table (locatif)', otwórz: 'ouvre !', zamknięte: 'fermé(e)s', książkę: 'livre (accusatif)', ładny: 'joli', czasu: 'temps (génitif)', dni: 'jours', siedem: 'sept',
    sobotę: 'samedi (accusatif)', niedzielę: 'dimanche (accusatif)', idę: 'je vais', kina: 'cinéma (génitif)', odpoczywam: 'je me repose', czas: 'temps', jutra: 'demain (génitif)',
    flaga: 'drapeau', 'biało-czerwona': 'blanc et rouge', niebo: 'ciel', niebieskie: 'bleu (neutre)', kolor: 'couleur', ta: 'cette', ten: 'ce', piękna: 'belle', nowe: 'neuves', moje: 'mes / mon', biała: 'blanche', ładna: 'jolie', droga: 'chère', sweter: 'pull',
    biurze: 'bureau (locatif)', polskiego: 'polonais (génitif)', muzyki: 'musique (génitif)', film: 'film', list: 'lettre', siódmej: 'sept heures', pracy: 'travail (génitif)', domu: 'maison (génitif)', obiad: 'déjeuner', robisz: 'tu fais', spać: 'dormir', zapłacić: 'payer', kartą: 'par carte (instrumental)', iść: 'aller (à pied)',
    boli: 'fait mal', oczy: 'yeux', myję: 'je lave', ręce: 'mains', gorączkę: 'fièvre (accusatif)', lekarza: 'médecin (génitif)', jestem: 'je suis', jesteś: 'tu es', smutny: 'triste', głodna: 'affamée', zmęczona: 'fatiguée', szczęśliwa: 'heureuse', chora: 'malade (f.)',
    pada: 'tombe', świeci: 'brille', latem: 'en été', zimą: 'en hiver', jesienią: 'en automne', często: 'souvent', morze: 'mer', morzu: 'mer (locatif)', wakacje: 'vacances', szczęśliwej: 'heureux (génitif)', podróży: 'voyage (génitif)', mój: 'mon',
    wczoraj: 'hier', kinie: 'cinéma (locatif)', byłeś: 'tu étais', robiłeś: 'tu as fait', sklepu: 'magasin (génitif)', jadłam: 'j’ai mangé (f.)', widziałem: 'j’ai vu (m.)', poszłam: 'je suis allée',
    jabłek: 'pommes (génitif pl.)', reszty: 'monnaie (génitif)', trzeba: 'il faut', wolny: 'libre', desery: 'desserts', słodkie: 'sucrés', ostre: 'épicé', gorąca: 'chaude', pyszna: 'délicieuse',
    muzykę: 'musique (accusatif)', gitarze: 'guitare (locatif)', piłkę: 'ballon (accusatif)', nożną: 'de pied', pięknie: 'magnifiquement', śpiewa: 'chante', tańczysz: 'tu danses', idziemy: 'nous allons', najlepsze: 'les meilleurs',
    bardzo: 'très / beaucoup', dobrze: 'bien', proszę: 's’il vous plaît', dziękuję: 'merci', pana: 'monsieur', kochanie: 'mon cœur', ania: 'Ania (prénom)',
  };
})();
