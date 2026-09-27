/* Słowik — conjugaisons, culture, proverbes, succès, niveaux. */
(function () {
  'use strict';

  /* Présent complet (ja, ty, on/ona, my, wy, oni/one). past: 'irr' → formes explicites. */
  const V = (inf, fr, pres, x) => Object.assign({ inf, fr, pres }, x || {});
  S.data.verbs = [
    V('być', 'être', ['jestem', 'jesteś', 'jest', 'jesteśmy', 'jesteście', 'są']),
    V('mieć', 'avoir', ['mam', 'masz', 'ma', 'mamy', 'macie', 'mają']),
    V('robić', 'faire', ['robię', 'robisz', 'robi', 'robimy', 'robicie', 'robią']),
    V('mówić', 'parler', ['mówię', 'mówisz', 'mówi', 'mówimy', 'mówicie', 'mówią']),
    V('czytać', 'lire', ['czytam', 'czytasz', 'czyta', 'czytamy', 'czytacie', 'czytają']),
    V('pisać', 'écrire', ['piszę', 'piszesz', 'pisze', 'piszemy', 'piszecie', 'piszą']),
    V('pracować', 'travailler', ['pracuję', 'pracujesz', 'pracuje', 'pracujemy', 'pracujecie', 'pracują']),
    V('mieszkać', 'habiter', ['mieszkam', 'mieszkasz', 'mieszka', 'mieszkamy', 'mieszkacie', 'mieszkają']),
    V('iść', 'aller (à pied)', ['idę', 'idziesz', 'idzie', 'idziemy', 'idziecie', 'idą'], {
      past: { m: ['szedłem', 'szedłeś', 'szedł', 'szliśmy', 'szliście', 'szli'], f: ['szłam', 'szłaś', 'szła', 'szłyśmy', 'szłyście', 'szły'] },
    }),
    V('jechać', 'aller (en véhicule)', ['jadę', 'jedziesz', 'jedzie', 'jedziemy', 'jedziecie', 'jadą']),
    V('jeść', 'manger', ['jem', 'jesz', 'je', 'jemy', 'jecie', 'jedzą'], {
      past: { m: ['jadłem', 'jadłeś', 'jadł', 'jedliśmy', 'jedliście', 'jedli'], f: ['jadłam', 'jadłaś', 'jadła', 'jadłyśmy', 'jadłyście', 'jadły'] },
    }),
    V('pić', 'boire', ['piję', 'pijesz', 'pije', 'pijemy', 'pijecie', 'piją']),
    V('rozumieć', 'comprendre', ['rozumiem', 'rozumiesz', 'rozumie', 'rozumiemy', 'rozumiecie', 'rozumieją']),
    V('wiedzieć', 'savoir', ['wiem', 'wiesz', 'wie', 'wiemy', 'wiecie', 'wiedzą']),
    V('lubić', 'aimer (bien)', ['lubię', 'lubisz', 'lubi', 'lubimy', 'lubicie', 'lubią']),
    V('kochać', 'aimer (d’amour)', ['kocham', 'kochasz', 'kocha', 'kochamy', 'kochacie', 'kochają']),
    V('spać', 'dormir', ['śpię', 'śpisz', 'śpi', 'śpimy', 'śpicie', 'śpią']),
    V('widzieć', 'voir', ['widzę', 'widzisz', 'widzi', 'widzimy', 'widzicie', 'widzą']),
    V('chcieć', 'vouloir', ['chcę', 'chcesz', 'chce', 'chcemy', 'chcecie', 'chcą']),
    V('móc', 'pouvoir', ['mogę', 'możesz', 'może', 'możemy', 'możecie', 'mogą'], {
      past: { m: ['mogłem', 'mogłeś', 'mógł', 'mogliśmy', 'mogliście', 'mogli'], f: ['mogłam', 'mogłaś', 'mogła', 'mogłyśmy', 'mogłyście', 'mogły'] },
    }),
    V('musieć', 'devoir', ['muszę', 'musisz', 'musi', 'musimy', 'musicie', 'muszą']),
    V('uczyć się', 'apprendre', ['uczę się', 'uczysz się', 'uczy się', 'uczymy się', 'uczycie się', 'uczą się']),
    V('słuchać', 'écouter', ['słucham', 'słuchasz', 'słucha', 'słuchamy', 'słuchacie', 'słuchają']),
    V('gotować', 'cuisiner', ['gotuję', 'gotujesz', 'gotuje', 'gotujemy', 'gotujecie', 'gotują']),
    V('znać', 'connaître', ['znam', 'znasz', 'zna', 'znamy', 'znacie', 'znają']),
    V('grać', 'jouer', ['gram', 'grasz', 'gra', 'gramy', 'gracie', 'grają']),
    V('brać', 'prendre', ['biorę', 'bierzesz', 'bierze', 'bierzemy', 'bierzecie', 'biorą']),
    V('myśleć', 'penser', ['myślę', 'myślisz', 'myśli', 'myślimy', 'myślicie', 'myślą']),
    V('płacić', 'payer', ['płacę', 'płacisz', 'płaci', 'płacimy', 'płacicie', 'płacą']),
    V('tańczyć', 'danser', ['tańczę', 'tańczysz', 'tańczy', 'tańczymy', 'tańczycie', 'tańczą']),
    V('pływać', 'nager', ['pływam', 'pływasz', 'pływa', 'pływamy', 'pływacie', 'pływają']),
    V('wracać', 'rentrer', ['wracam', 'wracasz', 'wraca', 'wracamy', 'wracacie', 'wracają']),
    V('oglądać', 'regarder', ['oglądam', 'oglądasz', 'ogląda', 'oglądamy', 'oglądacie', 'oglądają']),
    V('kupować', 'acheter', ['kupuję', 'kupujesz', 'kupuje', 'kupujemy', 'kupujecie', 'kupują']),
    V('wstawać', 'se lever', ['wstaję', 'wstajesz', 'wstaje', 'wstajemy', 'wstajecie', 'wstają']),
    V('śpiewać', 'chanter', ['śpiewam', 'śpiewasz', 'śpiewa', 'śpiewamy', 'śpiewacie', 'śpiewają']),
    V('biegać', 'courir', ['biegam', 'biegasz', 'biega', 'biegamy', 'biegacie', 'biegają']),
    V('potrzebować', 'avoir besoin', ['potrzebuję', 'potrzebujesz', 'potrzebuje', 'potrzebujemy', 'potrzebujecie', 'potrzebują']),
  ];
  S.data.persons = [
    { pl: 'ja', fr: 'je' }, { pl: 'ty', fr: 'tu' }, { pl: 'on / ona', fr: 'il / elle' },
    { pl: 'my', fr: 'nous' }, { pl: 'wy', fr: 'vous' }, { pl: 'oni / one', fr: 'ils / elles' },
  ];

  /* Le saviez-vous ? */
  S.data.culture = [
    { icon: '🎂', t: 'Imieniny', x: 'En Pologne, on fête son prénom (les **imieniny**) presque autant que son anniversaire. Chaque jour du calendrier correspond à plusieurs prénoms.' },
    { icon: '🎄', t: 'Wigilia', x: 'Le soir du 24 décembre, on partage l’**opłatek** (fine hostie) et l’on sert traditionnellement **douze plats sans viande**. Une assiette reste libre pour un invité inattendu.' },
    { icon: '💦', t: 'Śmigus-dyngus', x: 'Le lundi de Pâques, tout le monde s’asperge d’eau dans la rue ! C’est le « lany poniedziałek », le lundi mouillé.' },
    { icon: '🍩', t: 'Tłusty czwartek', x: 'Le « jeudi gras », les Polonais dévorent des millions de **pączki**, des beignets souvent fourrés à la confiture de rose.' },
    { icon: '🎶', t: 'Sto lat!', x: 'Pour un anniversaire, on chante « **Sto lat** » — « cent ans » — pour souhaiter une longue vie.' },
    { icon: '🎩', t: 'Pan & Pani', x: 'Pour vouvoyer, on dit **Pan** (monsieur) ou **Pani** (madame) avec le verbe à la 3e personne : « Czy pan mówi po francusku? »' },
    { icon: '💕', t: 'Diminutifs', x: 'Les Polonais adorent les diminutifs : Katarzyna → **Kasia**, Aleksandra → **Ola**, Piotr → **Piotrek**, Małgorzata → **Gosia**.' },
    { icon: '⚛️', t: 'Maria Skłodowska-Curie', x: 'Née à Varsovie en 1867, elle reste la seule personne récompensée par deux prix Nobel dans deux sciences différentes : physique et chimie.' },
    { icon: '🎹', t: 'Chopin', x: 'Fryderyk Chopin, né en 1810 près de Varsovie d’un père français, a vécu à Paris. Son cœur repose dans l’église Sainte-Croix de Varsovie.' },
    { icon: '🌍', t: 'Kopernik', x: 'Mikołaj Kopernik (Copernic), né à Toruń, a placé le Soleil au centre du système planétaire.' },
    { icon: '✂️', t: 'Wycinanki', x: 'L’art du papier découpé, né dans les campagnes (Łowicz, Kurpie), a inspiré toute l’esthétique de cette application.' },
    { icon: '🌼', t: 'Zalipie', x: 'Dans ce village du sud de la Pologne, les habitantes peignent des fleurs sur les maisons, les puits… et même les niches à chien !' },
    { icon: '🐉', t: 'Smok Wawelski', x: 'Selon la légende, un dragon vivait sous le château du Wawel à Cracovie. Aujourd’hui, sa statue crache du feu au bord de la Vistule.' },
    { icon: '🔤', t: '9 lettres spéciales', x: 'Le polonais utilise l’alphabet latin avec neuf lettres à signes : **ą, ć, ę, ł, ń, ó, ś, ź, ż**.' },
    { icon: '🦬', t: 'Żubr', x: 'Le bison d’Europe (**żubr**) vit encore à l’état sauvage dans la forêt primaire de Białowieża.' },
    { icon: '🍲', t: 'Bigos', x: 'Le « plat du chasseur », mijoté de choucroute, de viandes et de champignons, est réputé meilleur réchauffé plusieurs jours de suite !' },
    { icon: '📜', t: 'Szymborska', x: 'La poétesse Wisława Szymborska a reçu le prix Nobel de littérature en 1996.' },
    { icon: '🎖️', t: 'Napoléon dans l’hymne', x: 'L’hymne national polonais, « Mazurek Dąbrowskiego », mentionne… **Bonaparte** ! Il est né dans les légions polonaises d’Italie en 1797.' },
    { icon: '🌾', t: 'Polska', x: 'Le nom « Polska » viendrait de la tribu des **Polanie**, « les gens des champs » (pole = champ).' },
    { icon: '🥟', t: 'Pierogi ruskie', x: '« Ruskie » ne veut pas dire « russes » : le nom vient de la Ruthénie. Ils sont farcis de pomme de terre et de fromage blanc.' },
    { icon: '🏰', t: 'Cracovie, ancienne capitale', x: 'Cracovie fut la capitale jusqu’à la fin du XVIe siècle, avant que le roi Sigismond III Vasa ne s’installe à Varsovie.' },
    { icon: '🧱', t: 'Varsovie reconstruite', x: 'Détruite à plus de 80 % pendant la guerre, la vieille ville de Varsovie a été reconstruite à l’identique ; elle est inscrite à l’UNESCO.' },
    { icon: '🕯️', t: 'Andrzejki', x: 'Le soir du 29 novembre, on verse de la cire chaude dans l’eau froide à travers le trou d’une clé : l’ombre de la forme prédit l’avenir.' },
    { icon: '🧩', t: '7 cas', x: 'Le polonais a **7 cas**. Mais pas d’articles, un seul passé et une orthographe très régulière : tout n’est pas si difficile !' },
  ];

  /* Proverbes (przysłowia) avec leur équivalent français. */
  S.data.proverbs = [
    { pl: 'Nie mój cyrk, nie moje małpy.', lit: 'Pas mon cirque, pas mes singes.', fr: 'Ce n’est pas mon problème.' },
    { pl: 'Gdzie kucharek sześć, tam nie ma co jeść.', lit: 'Là où il y a six cuisinières, il n’y a rien à manger.', fr: 'Trop de cuisiniers gâtent la sauce.' },
    { pl: 'Lepszy wróbel w garści niż gołąb na dachu.', lit: 'Mieux vaut un moineau dans la main qu’un pigeon sur le toit.', fr: 'Un tiens vaut mieux que deux tu l’auras.' },
    { pl: 'Co nagle, to po diable.', lit: 'Ce qui est fait à la hâte appartient au diable.', fr: 'Hâte-toi lentement.' },
    { pl: 'Kto rano wstaje, temu Pan Bóg daje.', lit: 'À qui se lève tôt, le Bon Dieu donne.', fr: 'Le monde appartient à ceux qui se lèvent tôt.' },
    { pl: 'Nie chwal dnia przed zachodem słońca.', lit: 'Ne loue pas le jour avant le coucher du soleil.', fr: 'Il ne faut pas vendre la peau de l’ours avant de l’avoir tué.' },
    { pl: 'Darowanemu koniowi nie zagląda się w zęby.', lit: 'On ne regarde pas les dents d’un cheval offert.', fr: 'À cheval donné, on ne regarde pas la bride.' },
    { pl: 'Apetyt rośnie w miarę jedzenia.', lit: 'L’appétit grandit en mangeant.', fr: 'L’appétit vient en mangeant.' },
    { pl: 'Gość w dom, Bóg w dom.', lit: 'Un invité à la maison, c’est Dieu à la maison.', fr: 'L’hospitalité est sacrée.' },
    { pl: 'Mądry Polak po szkodzie.', lit: 'Le Polonais est sage après le dommage.', fr: 'Il est facile d’être sage après coup.' },
    { pl: 'Bez pracy nie ma kołaczy.', lit: 'Sans travail, pas de gâteaux.', fr: 'On n’a rien sans rien.' },
    { pl: 'Kto pyta, nie błądzi.', lit: 'Qui demande ne s’égare pas.', fr: 'Il n’y a pas de question bête.' },
  ];

  /* Niveaux : de l’œuf à l’aigle blanc. */
  S.data.levels = [
    { pl: 'Jajko', fr: 'Œuf', e: '🥚' },
    { pl: 'Pisklę', fr: 'Oisillon', e: '🐣' },
    { pl: 'Wróbel', fr: 'Moineau', e: '🐤' },
    { pl: 'Szpak', fr: 'Étourneau', e: '🐦' },
    { pl: 'Skowronek', fr: 'Alouette', e: '🎶' },
    { pl: 'Słowik', fr: 'Rossignol', e: '🎵' },
    { pl: 'Bocian', fr: 'Cigogne', e: '🪶' },
    { pl: 'Sokół', fr: 'Faucon', e: '⚡' },
    { pl: 'Orzeł', fr: 'Aigle', e: '🦅' },
    { pl: 'Biały Orzeł', fr: 'Aigle blanc', e: '👑' },
  ];

  /* Succès. test(state, ctx) → booléen. */
  const T = (s) => s.stats;
  S.data.achievements = [
    { id: 'first', e: '🐣', pl: 'Pierwszy krok', fr: 'Premier pas', d: 'Termine ta première leçon.', test: (s) => T(s).lessons >= 1 },
    { id: 'lessons10', e: '📚', pl: 'Pilny uczeń', fr: 'Élève assidu', d: 'Termine 10 leçons.', test: (s) => T(s).lessons >= 10 },
    { id: 'unit1', e: '🏅', pl: 'Pierwszy rozdział', fr: 'Premier chapitre', d: 'Réussis le défi d’une unité.', test: (s) => Object.keys(s.lessons).some((k) => /c$/.test(k)) },
    { id: 'perfect', e: '💎', pl: 'Perfekcjonista', fr: 'Perfectionniste', d: 'Termine une leçon sans aucune erreur.', test: (s) => T(s).perfect >= 1 },
    { id: 'streak3', e: '✨', pl: 'Iskra', fr: 'Étincelle', d: 'Apprends 3 jours d’affilée.', test: (s) => s.streak.best >= 3 },
    { id: 'streak7', e: '🔥', pl: 'Płomień', fr: 'Flamme', d: 'Apprends 7 jours d’affilée.', test: (s) => s.streak.best >= 7 },
    { id: 'streak30', e: '🏕️', pl: 'Ognisko', fr: 'Feu de camp', d: 'Apprends 30 jours d’affilée.', test: (s) => s.streak.best >= 30 },
    { id: 'words50', e: '🌱', pl: 'Słówka', fr: 'Petits mots', d: 'Apprends 50 mots.', test: (s) => Object.keys(s.cards).length >= 50 },
    { id: 'words150', e: '🌳', pl: 'Słownik', fr: 'Dictionnaire vivant', d: 'Apprends 150 mots.', test: (s) => Object.keys(s.cards).length >= 150 },
    { id: 'reviews100', e: '🐘', pl: 'Pamięć słonia', fr: 'Mémoire d’éléphant', d: 'Fais 100 révisions.', test: (s) => T(s).reviews >= 100 },
    { id: 'night', e: '🦉', pl: 'Nocny marek', fr: 'Oiseau de nuit', d: 'Étudie après 23 h.', test: (s, c) => c && c.hour >= 23 },
    { id: 'early', e: '🐓', pl: 'Ranny ptaszek', fr: 'Lève-tôt', d: 'Étudie avant 7 h.', test: (s, c) => c && c.hour < 7 && c.hour >= 4 },
    { id: 'talk5', e: '💬', pl: 'Gaduła', fr: 'Bavard', d: 'Termine 5 dialogues ou histoires.', test: (s) => Object.keys(s.dialogues).length >= 5 },
    { id: 'letters', e: '🪲', pl: 'Chrząszcz', fr: 'Oreille fine', d: 'Écoute toutes les lettres de l’alphabet.', test: (s) => (s.heard || []).length >= 39 },
    { id: 'numbers', e: '🔢', pl: 'Matematyk', fr: 'Mathématicien', d: '50 bonnes réponses aux jeux de nombres.', test: (s) => T(s).numbersOk >= 50 },
    { id: 'grammar5', e: '📐', pl: 'Gramatyk', fr: 'Grammairien', d: 'Réussis 5 quiz de grammaire.', test: (s) => Object.values(s.grammar).filter((g) => g.best >= 0.75).length >= 5 },
    { id: 'sprint20', e: '⚡', pl: 'Błyskawica', fr: 'Éclair', d: 'Marque 20 points au Sprint.', test: (s) => T(s).sprintBest >= 20 },
    { id: 'speak10', e: '🎤', pl: 'Złotousty', fr: 'Bouche d’or', d: 'Réussis 10 exercices de prononciation.', test: (s) => T(s).speakOk >= 10 },
    { id: 'xp1000', e: '👑', pl: 'Mistrz', fr: 'Maître', d: 'Gagne 1 000 points d’expérience.', test: (s) => s.xp >= 1000 },
  ];

  /* Heures : ordinaux féminins (nominatif / génitif-locatif). */
  S.data.hours = {
    nom: ['dwunasta', 'pierwsza', 'druga', 'trzecia', 'czwarta', 'piąta', 'szósta', 'siódma', 'ósma', 'dziewiąta', 'dziesiąta', 'jedenasta', 'dwunasta'],
    gen: ['dwunastej', 'pierwszej', 'drugiej', 'trzeciej', 'czwartej', 'piątej', 'szóstej', 'siódmej', 'ósmej', 'dziewiątej', 'dziesiątej', 'jedenastej', 'dwunastej'],
  };

  /* Mascotte : petites phrases d'encouragement. */
  S.data.cheers = {
    ok: ['Świetnie!', 'Brawo!', 'Super!', 'Doskonale!', 'Pięknie!', 'Tak jest!', 'Znakomicie!', 'Rewelacja!'],
    okFr: ['Excellent !', 'Bravo !', 'Super !', 'Parfait !', 'Magnifique !', 'Exactement !', 'Remarquable !', 'Génial !'],
    ko: ['Prawie!', 'Nic nie szkodzi!', 'Spróbuj jeszcze raz!', 'Głowa do góry!'],
    koFr: ['Presque !', 'Ce n’est pas grave !', 'Tu y arriveras !', 'Garde le moral !'],
  };
})();
