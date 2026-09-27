/* Słowik — fiches de grammaire (explications en français, exemples cliquables {…}). */
(function () {
  'use strict';
  S.data.grammar = [
    {
      id: 'lecture', icon: '🔤', level: 'A1', color: 'red',
      title: 'Lire le polonais', pl: 'Czytanie',
      lead: 'Le polonais se lit presque exactement comme il s’écrit. Une fois les règles connues, tu peux lire n’importe quel mot !',
      blocks: [
        { t: 'h', x: 'Les lettres qui changent tout' },
        { t: 'table', head: ['Lettre', 'Se prononce', 'Exemple'], rows: [
          ['w', 'v', '{woda}'], ['ł', 'w anglais (« oui »)', '{mały}'], ['j', 'y (« yeux »)', '{jestem}'], ['c', 'ts', '{co}'],
          ['ch / h', 'h expiré (jota espagnole)', '{chleb}'], ['ó / u', 'ou', '{mój}'], ['y', 'i « dur »', '{ty}'], ['e', 'è (jamais muet)', '{nie}'],
          ['ą', 'on (nasal)', '{są}'], ['ę', 'in (nasal) ; è en fin de mot', '{ręka}, {proszę}'],
        ] },
        { t: 'h', x: 'Les groupes de lettres' },
        { t: 'table', head: ['Groupe', 'Se prononce', 'Exemple'], rows: [
          ['sz', 'ch (« chat »)', '{szkoła}'], ['cz', 'tch (« tchèque »)', '{czas}'], ['rz / ż', 'j (« jour »)', '{rzeka}, {żaba}'],
          ['dż', 'dj (« jean »)', '{dżem}'], ['dz', 'dz', '{bardzo}'], ['ch', 'h expiré', '{chleb}'],
        ] },
        { t: 'tip', x: '**rz** et **ż** se prononcent exactement pareil ! Seule l’orthographe les distingue.' },
        { t: 'h', x: 'Les consonnes « douces »' },
        { t: 'p', x: 'Un accent (ś, ć, ź, ń, dź) ou un **i** qui suit (si, ci, zi, ni, dzi) rend la consonne douce : on la prononce langue bombée, en souriant.' },
        { t: 'table', head: ['Douce', 'Devant voyelle', 'Exemples'], rows: [
          ['ś', 'si', '{świat}, {siostra}'], ['ć', 'ci', '{być}, {ciocia}'], ['ź', 'zi', '{źle}, {zima}'], ['ń', 'ni', '{koń}, {nie}'], ['dź', 'dzi', '{dziecko}, {dzień}'],
        ] },
        { t: 'tip', x: 'Quand **i** se trouve entre s, c, z, n, dz et une voyelle, il ne se prononce pas : il sert juste à adoucir. {się} se dit « chiè ».' },
        { t: 'h', x: 'L’accent tonique' },
        { t: 'p', x: 'L’accent tombe presque toujours sur l’**avant-dernière syllabe** : dzię-**KU**-ję, **POL**-ska, War-**SZA**-wa.' },
        { t: 'warn', x: 'Exceptions : les mots savants en -yka / -ika (**MU**-zy-ka) et le passé au pluriel (**BY**-li-śmy).' },
        { t: 'h', x: 'L’assourdissement' },
        { t: 'p', x: 'En fin de mot, les consonnes sonores deviennent sourdes : {chleb} se dit « hlèp », {Kraków} « krakouf », {mąż} « monch ».' },
      ],
      quiz: [
        { q: 'Comment se prononce « w » ?', o: ['v', 'ou', 'w anglais', 'f'], a: 0 },
        { q: 'Quelles deux graphies se prononcent de la même façon ?', o: ['rz et ż', 'sz et ś', 'cz et c', 'ł et l'], a: 0 },
        { q: 'Où tombe l’accent dans « Warszawa » ?', o: ['war-SZA-wa', 'WAR-sza-wa', 'war-sza-WA'], a: 0 },
        { q: 'Dans « się », le i…', o: ['ne se prononce pas, il adoucit le s', 'se prononce comme en français', 'transforme le s en z'], a: 0 },
        { q: '« Chleb » se prononce…', o: ['hlèp', 'chlèb', 'klèb', 'chlèp'], a: 0 },
      ],
    },
    {
      id: 'genre', icon: '⚥', level: 'A1', color: 'orange',
      title: 'Le genre des noms', pl: 'Rodzaj',
      lead: 'Chaque nom est masculin, féminin ou neutre. Pas d’article pour t’aider : c’est la terminaison qui parle !',
      blocks: [
        { t: 'table', head: ['Genre', 'Terminaison typique', 'Exemples'], rows: [
          ['**Masculin**', 'consonne', '{dom}, {kot}, {stół}'],
          ['**Féminin**', '-a', '{kawa}, {mama}, {zupa}'],
          ['**Neutre**', '-o, -e, -ę, -um', '{okno}, {morze}, {imię}, {muzeum}'],
        ] },
        { t: 'warn', x: 'Exceptions à connaître : {tata}, {kolega} et {mężczyzna} sont masculins malgré le -a ; {noc} (nuit), {podróż} (voyage) et {jesień} (automne) sont féminins malgré la consonne.' },
        { t: 'h', x: 'Le genre commande l’accord' },
        { t: 'table', head: ['', 'Masculin', 'Féminin', 'Neutre'], rows: [
          ['mon / ma', '{mój}', '{moja}', '{moje}'], ['ce / cette', '{ten}', '{ta}', '{to}'], ['bon', '{dobry}', '{dobra}', '{dobre}'], ['grand', '{duży}', '{duża}', '{duże}'],
        ] },
        { t: 'tip', x: 'Le genre ne correspond pas toujours au français : {samochód} (voiture) et {klucz} (clé) sont masculins !' },
        { t: 'sort' },
      ],
      quiz: [
        { q: 'Quel est le genre de « okno » ?', o: ['neutre', 'masculin', 'féminin'], a: 0 },
        { q: '« Tata » est…', o: ['masculin', 'féminin', 'neutre'], a: 0 },
        { q: 'Complète : ___ kawa', o: ['moja', 'mój', 'moje'], a: 0 },
        { q: 'Complète : ___ dziecko', o: ['moje', 'moja', 'mój'], a: 0 },
        { q: '« Podróż » (voyage) est…', o: ['féminin', 'masculin', 'neutre'], a: 0 },
      ],
    },
    {
      id: 'pronoms', icon: '👥', level: 'A1', color: 'yellow',
      title: 'Pronoms & vouvoiement', pl: 'Zaimki',
      lead: 'Les pronoms sujets existent… mais on les omet souvent, car la terminaison du verbe suffit.',
      blocks: [
        { t: 'table', head: ['Singulier', '', 'Pluriel', ''], rows: [
          ['{ja}', 'je', '{my}', 'nous'], ['{ty}', 'tu', '{wy}', 'vous'], ['{on}', 'il', '{oni}', 'ils (au moins un homme)'], ['{ona}', 'elle', '{one}', 'elles / autres groupes'], ['{ono}', 'il/elle (neutre)', '', ''],
        ] },
        { t: 'h', x: 'Le vouvoiement : Pan, Pani, Państwo' },
        { t: 'p', x: 'Pour vouvoyer, on n’utilise pas « wy » mais **Pan** (monsieur), **Pani** (madame) ou **Państwo** (mesdames et messieurs), avec le verbe à la 3e personne.' },
        { t: 'ex', pl: 'Czy pan mówi po francusku?', fr: 'Parlez-vous français (monsieur) ?' },
        { t: 'ex', pl: 'Jak się pani ma?', fr: 'Comment allez-vous (madame) ?' },
        { t: 'h', x: 'Formes très fréquentes' },
        { t: 'list', items: ['{mnie} = me / moi : {Boli mnie głowa.}', '{cię} = te : {Kocham cię!}', '{mi} = me / à moi : {Miło mi.}', '{się} = se (réfléchi) : {Jak się masz?}'] },
      ],
      quiz: [
        { q: '« Nous » se dit…', o: ['my', 'wy', 'oni'], a: 0 },
        { q: 'Un groupe de femmes : ', o: ['one', 'oni', 'ono'], a: 0 },
        { q: 'Pour vouvoyer un homme :', o: ['Pan + 3e personne', 'Wy + 2e personne du pluriel', 'Ty + 2e personne'], a: 0 },
        { q: '« Kocham cię » signifie…', o: ['je t’aime', 'je m’aime', 'tu m’aimes'], a: 0 },
      ],
    },
    {
      id: 'byc', icon: '🧍', level: 'A1', color: 'green',
      title: 'Être : być', pl: 'Czasownik „być”',
      lead: 'Le verbe le plus utile… et le plus irrégulier. À connaître par cœur !',
      blocks: [
        { t: 'conj', verbs: ['być'] },
        { t: 'tip', x: 'Les pronoms sont souvent omis : {Jestem zmęczony.} = je suis fatigué.' },
        { t: 'h', x: 'Être + nom = instrumental' },
        { t: 'p', x: 'Quand « être » est suivi d’un nom (profession, nationalité…), ce nom se met à l’**instrumental** :' },
        { t: 'ex', pl: 'Jestem studentem.', fr: 'Je suis étudiant.' },
        { t: 'ex', pl: 'Ona jest lekarką.', fr: 'Elle est médecin.' },
        { t: 'p', x: 'Mais avec **to** (c’est), on garde le nominatif :' },
        { t: 'ex', pl: 'To jest student.', fr: 'C’est un étudiant.' },
        { t: 'h', x: 'Au passé et au futur' },
        { t: 'table', head: ['', 'Passé (homme)', 'Passé (femme)', 'Futur'], rows: [
          ['ja', '{byłem}', '{byłam}', '{będę}'], ['ty', '{byłeś}', '{byłaś}', '{będziesz}'], ['on / ona', '{był}', '{była}', '{będzie}'],
          ['my', '{byliśmy}', '{byłyśmy}', '{będziemy}'], ['wy', '{byliście}', '{byłyście}', '{będziecie}'], ['oni / one', '{byli}', '{były}', '{będą}'],
        ] },
      ],
      quiz: [
        { q: 'My ___ z Francji.', o: ['jesteśmy', 'jesteście', 'są', 'jest'], a: 0 },
        { q: 'Oni ___ w domu.', o: ['są', 'jest', 'jesteśmy'], a: 0 },
        { q: 'Jestem ___ (student).', o: ['studentem', 'student', 'studenta'], a: 0 },
        { q: 'Demain je serai… ', o: ['Jutro będę…', 'Jutro byłem…', 'Jutro jestem…'], a: 0 },
      ],
    },
    {
      id: 'present', icon: '🔁', level: 'A1', color: 'pink',
      title: 'Le présent : 3 modèles', pl: 'Czas teraźniejszy',
      lead: 'Bonne nouvelle : un seul présent, pas de subjonctif ! Trois grands modèles couvrent la plupart des verbes.',
      blocks: [
        { t: 'table', head: ['', 'czytać (lire)', 'mówić (parler)', 'pisać (écrire)'], rows: [
          ['ja', 'czyt**am**', 'mów**ię**', 'pisz**ę**'], ['ty', 'czyt**asz**', 'mów**isz**', 'pisz**esz**'], ['on / ona', 'czyt**a**', 'mów**i**', 'pisz**e**'],
          ['my', 'czyt**amy**', 'mów**imy**', 'pisz**emy**'], ['wy', 'czyt**acie**', 'mów**icie**', 'pisz**ecie**'], ['oni / one', 'czyt**ają**', 'mów**ią**', 'pisz**ą**'],
        ] },
        { t: 'tip', x: 'Astuce : connais la forme **ja** et la forme **ty**, et tu devines tout le reste !' },
        { t: 'h', x: 'Les verbes en -ować → -uję' },
        { t: 'p', x: 'Très fréquents : {pracować} (travailler), {gotować} (cuisiner), {kupować} (acheter)…' },
        { t: 'conj', verbs: ['pracować', 'mieć', 'iść', 'jeść', 'chcieć'] },
      ],
      quiz: [
        { q: 'ja ___ (czytać)', o: ['czytam', 'czytę', 'czyta'], a: 0 },
        { q: 'oni ___ (mówić)', o: ['mówią', 'mówiją', 'mówę'], a: 0 },
        { q: 'ty ___ (pracować)', o: ['pracujesz', 'pracowasz', 'pracujisz'], a: 0 },
        { q: 'my ___ (pisać)', o: ['piszemy', 'pisamy', 'piszymy'], a: 0 },
      ],
    },
    {
      id: 'adjectifs', icon: '🎨', level: 'A1', color: 'blue',
      title: 'Les adjectifs', pl: 'Przymiotniki',
      lead: 'L’adjectif s’accorde en genre et en nombre, et se place généralement avant le nom : {czerwony samochód}.',
      blocks: [
        { t: 'table', head: ['', 'Masculin', 'Féminin', 'Neutre', 'Pluriel*'], rows: [
          ['Modèle dur', '{dobry}', '{dobra}', '{dobre}', '{dobre}'],
          ['Après k / g', '{polski}', '{polska}', '{polskie}', '{polskie}'],
          ['Modèle doux', '{tani}', '{tania}', '{tanie}', '{tanie}'],
        ] },
        { t: 'p', x: '* Pour un groupe comprenant des hommes, la forme change : {dobrzy ludzie} (de bonnes personnes).' },
        { t: 'tip', x: 'Après **k** et **g**, on écrit **-i** au lieu de **-y** : {polski}, {drogi}, {niebieski}.' },
        { t: 'h', x: 'Place de l’adjectif' },
        { t: 'p', x: 'Avant le nom en général : {nowy dom}. Après le nom pour une catégorie fixe : {język polski} (la langue polonaise), {kuchnia francuska} (la cuisine française).' },
        { t: 'h', x: 'À l’accusatif féminin : -ą' },
        { t: 'ex', pl: 'Mam nową kurtkę.', fr: 'J’ai une nouvelle veste.' },
      ],
      quiz: [
        { q: 'To jest ___ dom. (duży)', o: ['duży', 'duża', 'duże'], a: 0 },
        { q: 'Ta kawa jest ___ (dobry)', o: ['dobra', 'dobry', 'dobre'], a: 0 },
        { q: 'Niebo jest ___ (niebieski)', o: ['niebieskie', 'niebieska', 'niebieski'], a: 0 },
        { q: 'kuchnia ___ (polski)', o: ['polska', 'polski', 'polskie'], a: 0 },
      ],
    },
    {
      id: 'cas', icon: '🧩', level: 'A1', color: 'teal',
      title: 'Les 7 cas : vue d’ensemble', pl: 'Przypadki',
      lead: 'La fin des noms change selon leur rôle dans la phrase : c’est la déclinaison. Pas de panique : chaque cas a des déclencheurs faciles à repérer.',
      blocks: [
        { t: 'table', head: ['Cas', 'Question', 'Emploi principal', 'Exemple'], rows: [
          ['**Mianownik** — nominatif', 'kto? co?', 'le sujet', '{To jest kawa.}'],
          ['**Dopełniacz** — génitif', 'kogo? czego?', 'négation, quantité, « de », après do / z / bez', '{Nie piję kawy.}'],
          ['**Celownik** — datif', 'komu? czemu?', 'à qui ? (attribution)', '{Daję kawę mamie.}'],
          ['**Biernik** — accusatif', 'kogo? co?', 'complément d’objet direct', '{Piję kawę.}'],
          ['**Narzędnik** — instrumental', 'z kim? z czym?', 'avec, moyen, być + nom', '{Kawa z mlekiem.}'],
          ['**Miejscownik** — locatif', 'o kim? o czym?', 'le lieu, après w / na / o', '{Jestem w kawiarni.}'],
          ['**Wołacz** — vocatif', 'o!', 'interpeller quelqu’un', '{Mamo!}'],
        ] },
        { t: 'decl' },
        { t: 'tip', x: 'Stratégie : commence par l’**accusatif** (l’objet) et le **locatif** (le lieu), puis le **génitif**. Ce sont les plus fréquents !' },
      ],
      quiz: [
        { q: 'Quel cas après une négation ?', o: ['génitif', 'accusatif', 'nominatif', 'locatif'], a: 0 },
        { q: 'Quel cas pour le lieu après « w » ?', o: ['locatif', 'génitif', 'datif'], a: 0 },
        { q: '« Jadę autobusem » : autobusem est à l’…', o: ['instrumental', 'locatif', 'accusatif'], a: 0 },
        { q: '« Mamo! » est au…', o: ['vocatif', 'nominatif', 'génitif'], a: 0 },
      ],
    },
    {
      id: 'accusatif', icon: '🎯', level: 'A1', color: 'violet',
      title: 'L’accusatif', pl: 'Biernik',
      lead: 'Le cas du complément d’objet direct : ce que tu manges, bois, vois, aimes, as…',
      blocks: [
        { t: 'table', head: ['Genre', 'Nominatif', 'Accusatif', 'Règle'], rows: [
          ['Féminin', '{kawa}', '{kawę}', '**-a → -ę**'],
          ['Masculin inanimé', '{sok}', '{sok}', 'identique'],
          ['Masculin animé', '{brat}', '{brata}', '**+ -a**'],
          ['Neutre', '{mleko}', '{mleko}', 'identique'],
        ] },
        { t: 'tip', x: 'Seuls les **féminins** et les **masculins animés** (personnes, animaux) changent. Facile !' },
        { t: 'p', x: 'Déclencheurs : mieć (avoir), lubić, jeść, pić, widzieć, kochać, poproszę… et **w + jour** : {w sobotę}.' },
        { t: 'ex', pl: 'Lubię kawę i herbatę.', fr: 'J’aime le café et le thé.' },
        { t: 'ex', pl: 'Mam psa i kota.', fr: 'J’ai un chien et un chat.' },
      ],
      quiz: [
        { q: 'Poproszę ___ (herbata)', o: ['herbatę', 'herbata', 'herbaty'], a: 0 },
        { q: 'Mam ___ (kot)', o: ['kota', 'kot', 'kotem'], a: 0 },
        { q: 'Lubię ___ (ser)', o: ['ser', 'sera', 'serem'], a: 0 },
        { q: 'Kocham ___ (mama)', o: ['mamę', 'mama', 'mamy'], a: 0 },
      ],
    },
    {
      id: 'genitif', icon: '🔗', level: 'A2', color: 'red',
      title: 'Le génitif', pl: 'Dopełniacz',
      lead: 'Le cas le plus fréquent après le nominatif ! Il répond à « de qui ? de quoi ? ».',
      blocks: [
        { t: 'h', x: 'Quand l’utiliser ?' },
        { t: 'list', items: [
          'Après une **négation** : {Nie mam czasu.} (je n’ai pas le temps)',
          'Pour une **quantité** : {kilogram jabłek}, {dużo wody}',
          'Pour la **possession** : {dom mamy} (la maison de maman)',
          'Après **do, z, bez, od, dla** : {do Krakowa}, {z Polski}, {bez cukru}',
        ] },
        { t: 'table', head: ['Genre', 'Nominatif', 'Génitif'], rows: [
          ['Masculin', '{dom}, {kot}', '{domu}, {kota}'], ['Féminin', '{kawa}', '{kawy}'], ['Féminin après k / g', '{Polska}', '{Polski}'], ['Neutre', '{mleko}', '{mleka}'],
        ] },
        { t: 'tip', x: 'Au masculin : **-a** pour les animés et beaucoup d’objets ({chleba}, {sera}), **-u** pour d’autres ({domu}, {czasu}, {soku}). On les apprend au fil de l’eau.' },
      ],
      quiz: [
        { q: 'Nie mam ___ (brat)', o: ['brata', 'brat', 'bratem'], a: 0 },
        { q: 'Jadę do ___ (Warszawa)', o: ['Warszawy', 'Warszawa', 'Warszawie'], a: 0 },
        { q: 'Kawa bez ___ (cukier)', o: ['cukru', 'cukier', 'cukrem'], a: 0 },
        { q: 'Nie piję ___ (mleko)', o: ['mleka', 'mleko', 'mlekiem'], a: 0 },
      ],
    },
    {
      id: 'locatif', icon: '📍', level: 'A2', color: 'orange',
      title: 'Le locatif', pl: 'Miejscownik',
      lead: 'Le cas du lieu ! Toujours après une préposition : w (dans), na (sur / à), o (à propos de), przy (près de).',
      blocks: [
        { t: 'table', head: ['Nominatif', 'Locatif', 'Exemple'], rows: [
          ['{Kraków}', '{Krakowie}', '{Mieszkam w Krakowie.}'], ['{sklep}', '{sklepie}', '{Jestem w sklepie.}'], ['{Polska}', '{Polsce}', '{Mieszkam w Polsce.}'],
          ['{kuchnia}', '{kuchni}', '{Jestem w kuchni.}'], ['{dom}', '{domu}', '{Jestem w domu.}'], ['{stół}', '{stole}', '{Kot jest na stole.}'],
        ] },
        { t: 'p', x: 'La terminaison la plus courante est **-e**, qui adoucit la consonne : t → ci ({student} → {studencie}), k → c ({Polska} → {Polsce}), r → rz ({teatr} → {teatrze}).' },
        { t: 'tip', x: '**W ou na ?** Na pour les surfaces, les événements et certains lieux : {na poczcie}, {na dworcu}, {na koncercie}. W pour l’intérieur : {w sklepie}, {w domu}.' },
      ],
      quiz: [
        { q: 'Mieszkam w ___ (Warszawa)', o: ['Warszawie', 'Warszawa', 'Warszawy'], a: 0 },
        { q: 'Jestem na ___ (dworzec)', o: ['dworcu', 'dworzec', 'dworca'], a: 0 },
        { q: 'Mówimy o ___ (film)', o: ['filmie', 'film', 'filmu'], a: 0 },
        { q: 'Kot jest na ___ (stół)', o: ['stole', 'stół', 'stołu'], a: 0 },
      ],
    },
    {
      id: 'instrumental', icon: '🛠️', level: 'A2', color: 'yellow',
      title: 'L’instrumental', pl: 'Narzędnik',
      lead: 'Le cas « avec » : l’outil, le moyen, la compagnie. Il est aussi obligatoire après być + nom.',
      blocks: [
        { t: 'table', head: ['Genre', 'Nominatif', 'Instrumental'], rows: [
          ['Masculin', '{autobus}', '{autobusem}'], ['Neutre', '{mleko}', '{mlekiem}'], ['Féminin', '{kawa}', '{kawą}'], ['Pluriel', '{koty}', '{kotami}'],
        ] },
        { t: 'list', items: [
          '**z** + instrumental = avec : {kawa z mlekiem}, {z mamą}',
          'Moyen de transport : {Jadę pociągiem.}',
          'Profession, identité : {Jestem nauczycielem.}',
          'Saisons : {latem} (en été), {zimą} (en hiver)',
        ] },
        { t: 'tip', x: 'Après **k** et **g**, on ajoute un i : {mlekiem}.' },
      ],
      quiz: [
        { q: 'Kawa z ___ (cukier)', o: ['cukrem', 'cukru', 'cukier'], a: 0 },
        { q: 'Jadę ___ (samochód)', o: ['samochodem', 'samochód', 'samochodu'], a: 0 },
        { q: 'Ona jest ___ (lekarka)', o: ['lekarką', 'lekarka', 'lekarkę'], a: 0 },
        { q: 'Idę do kina z ___ (mama)', o: ['mamą', 'mamę', 'mamy'], a: 0 },
      ],
    },
    {
      id: 'datif', icon: '🎁', level: 'A2', color: 'green',
      title: 'Datif & vocatif', pl: 'Celownik i wołacz',
      lead: 'Le datif répond à « à qui ? ». Le vocatif sert à interpeller quelqu’un.',
      blocks: [
        { t: 'table', head: ['Nominatif', 'Datif', 'Exemple'], rows: [
          ['{brat}', '{bratu}', '{Daję książkę bratu.}'], ['{mama}', '{mamie}', '{Daję kwiaty mamie.}'], ['{Kasia}', '{Kasi}', '{Pomagam Kasi.}'], ['{dziecko}', '{dziecku}', '{Daję zabawkę dziecku.}'],
        ] },
        { t: 'p', x: 'Expressions très courantes : {Miło mi.} (enchanté), {Zimno mi.} (j’ai froid), {Dziękuję ci.} (je te remercie).' },
        { t: 'h', x: 'Le vocatif' },
        { t: 'table', head: ['Nom', 'Vocatif'], rows: [
          ['mama', '{Mamo!}'], ['tata', '{Tato!}'], ['Kasia', '{Kasiu!}'], ['Anna', '{Anno!}'], ['Marek', '{Marku!}'], ['pan', '{Panie!}'],
        ] },
        { t: 'tip', x: 'Pour interpeller poliment : {Panie Marku!} (Monsieur Marek !), {Pani Ewo!} (Madame Ewa !).' },
      ],
      quiz: [
        { q: 'Daję kwiaty ___ (mama)', o: ['mamie', 'mamę', 'mamy'], a: 0 },
        { q: 'Le vocatif de « Kasia » :', o: ['Kasiu!', 'Kasio!', 'Kasią!'], a: 0 },
        { q: '« J’ai froid » :', o: ['Zimno mi.', 'Zimno ja.', 'Jestem zimno.'], a: 0 },
      ],
    },
    {
      id: 'passe', icon: '⏳', level: 'A2', color: 'pink',
      title: 'Le passé', pl: 'Czas przeszły',
      lead: 'Un seul temps du passé ! On enlève le -ć de l’infinitif, on ajoute -ł-, puis une terminaison qui dépend du genre.',
      blocks: [
        { t: 'table', head: ['', 'Homme', 'Femme'], rows: [
          ['ja', 'czyta**łem**', 'czyta**łam**'], ['ty', 'czyta**łeś**', 'czyta**łaś**'], ['on / ona', 'czyta**ł**', 'czyta**ła**'],
          ['my', 'czyta**liśmy**', 'czyta**łyśmy**'], ['wy', 'czyta**liście**', 'czyta**łyście**'], ['oni / one', 'czyta**li**', 'czyta**ły**'],
        ] },
        { t: 'tip', x: '**Oni** (groupe avec au moins un homme) → **-li**. **One** (femmes, choses, animaux) → **-ły**.' },
        { t: 'h', x: 'Les verbes en -eć' },
        { t: 'p', x: 'Le e devient a, sauf au pluriel « oni » : {mieć} → {miałem}, {miała}… mais {mieli}.' },
        { t: 'h', x: 'Irréguliers fréquents' },
        { t: 'table', head: ['Infinitif', 'Il', 'Elle', 'Ils'], rows: [
          ['być', '{był}', '{była}', '{byli}'], ['mieć', '{miał}', '{miała}', '{mieli}'], ['iść', '{szedł}', '{szła}', '{szli}'],
          ['jeść', '{jadł}', '{jadła}', '{jedli}'], ['móc', '{mógł}', '{mogła}', '{mogli}'], ['chcieć', '{chciał}', '{chciała}', '{chcieli}'],
        ] },
      ],
      quiz: [
        { q: 'Ewa ___ w kinie (być).', o: ['była', 'był', 'byłam'], a: 0 },
        { q: 'Ja (Tomek) ___ książkę (czytać).', o: ['czytałem', 'czytałam', 'czytał'], a: 0 },
        { q: 'Oni ___ w domu (być).', o: ['byli', 'były', 'był'], a: 0 },
        { q: 'Ona ___ do sklepu (iść).', o: ['szła', 'szedł', 'iśła'], a: 0 },
      ],
    },
    {
      id: 'aspect', icon: '♾️', level: 'A2', color: 'blue',
      title: 'L’aspect du verbe', pl: 'Aspekt',
      lead: 'La plupart des verbes vont par paires : un imperfectif (action en cours, répétée) et un perfectif (action unique, terminée, avec un résultat).',
      blocks: [
        { t: 'table', head: ['Imperfectif', 'Perfectif', 'Sens'], rows: [
          ['{robić}', '{zrobić}', 'faire'], ['{pisać}', '{napisać}', 'écrire'], ['{czytać}', '{przeczytać}', 'lire'], ['{jeść}', '{zjeść}', 'manger'],
          ['{pić}', '{wypić}', 'boire'], ['{kupować}', '{kupić}', 'acheter'], ['{mówić}', '{powiedzieć}', 'dire'],
        ] },
        { t: 'ex', pl: 'Czytałem książkę.', fr: 'Je lisais / j’ai lu (un moment) un livre.' },
        { t: 'ex', pl: 'Przeczytałem książkę.', fr: 'J’ai lu le livre (en entier).' },
        { t: 'p', x: 'Le perfectif n’a pas de présent : sa forme « présente » exprime le **futur** ! {Zrobię to jutro.} = je le ferai demain.' },
        { t: 'tip', x: 'Les perfectifs se forment souvent avec un préfixe : **z-**, **na-**, **prze-**, **wy-**, **po-**.' },
      ],
      quiz: [
        { q: '« Zjem obiad » signifie…', o: ['je mangerai le déjeuner', 'je mange le déjeuner', 'j’ai mangé le déjeuner'], a: 0 },
        { q: 'Pour une habitude (« tous les jours »), on utilise…', o: ['l’imperfectif', 'le perfectif'], a: 0 },
        { q: 'Le perfectif de « pisać » est…', o: ['napisać', 'zpisać', 'popisać'], a: 0 },
      ],
    },
    {
      id: 'futur', icon: '🔮', level: 'A2', color: 'violet',
      title: 'Le futur', pl: 'Czas przyszły',
      lead: 'Deux façons de parler du futur, selon l’aspect du verbe.',
      blocks: [
        { t: 'list', items: [
          '**Imperfectif** : będę + infinitif → {Będę pracować.} (je travaillerai, je serai en train de travailler)',
          '**Perfectif** : le « présent » du verbe perfectif → {Zrobię to jutro.} (je le ferai demain)',
        ] },
        { t: 'table', head: ['', 'być au futur'], rows: [
          ['ja', '{będę}'], ['ty', '{będziesz}'], ['on / ona', '{będzie}'], ['my', '{będziemy}'], ['wy', '{będziecie}'], ['oni / one', '{będą}'],
        ] },
        { t: 'ex', pl: 'Jutro będę w domu.', fr: 'Demain, je serai à la maison.' },
      ],
      quiz: [
        { q: 'Jutro ___ w domu.', o: ['będę', 'jestem', 'byłem'], a: 0 },
        { q: '« Zrobię » =', o: ['je ferai', 'je fais', 'j’ai fait'], a: 0 },
        { q: 'Oni ___ pracować.', o: ['będą', 'będzie', 'będziemy'], a: 0 },
      ],
    },
    {
      id: 'nombres', icon: '🔢', level: 'A1', color: 'teal',
      title: 'Nombres et accord', pl: 'Liczebniki',
      lead: 'Après un nombre, la forme du nom change ! Une particularité fascinante du polonais.',
      blocks: [
        { t: 'table', head: ['Nombre', 'Forme du nom', 'Exemple'], rows: [
          ['1', 'nominatif singulier', '{jeden złoty}'], ['2, 3, 4 (22, 23, 24…)', 'nominatif pluriel', '{dwa złote}'], ['5 à 21 (25 à 31…)', 'génitif pluriel', '{pięć złotych}'],
        ] },
        { t: 'numform' },
        { t: 'tip', x: '12, 13 et 14 suivent la règle de 5+ : {dwanaście złotych}. Mais 22, 23, 24 reviennent à la règle de 2–4 : {dwadzieścia dwa złote}.' },
      ],
      quiz: [
        { q: 'dwadzieścia trzy ___', o: ['złote', 'złotych', 'złoty'], a: 0 },
        { q: 'jedenaście ___', o: ['złotych', 'złote', 'złoty'], a: 0 },
        { q: 'Mam trzydzieści ___', o: ['lat', 'lata', 'roku'], a: 0 },
      ],
    },
    {
      id: 'questions', icon: '❓', level: 'A1', color: 'red',
      title: 'Poser des questions', pl: 'Pytania',
      lead: 'Quelques petits mots suffisent pour poser presque toutes les questions.',
      blocks: [
        { t: 'table', head: ['Mot', 'Sens', 'Exemple'], rows: [
          ['{czy}', 'est-ce que', '{Czy mówisz po polsku?}'], ['{co}', 'quoi / que', '{Co to jest?}'], ['{kto}', 'qui', '{Kto to jest?}'],
          ['{gdzie}', 'où', '{Gdzie jest dworzec?}'], ['{kiedy}', 'quand', '{Kiedy jest koncert?}'], ['{jak}', 'comment', '{Jak się masz?}'],
          ['{ile}', 'combien', '{Ile to kosztuje?}'], ['{dlaczego}', 'pourquoi', '{Dlaczego nie?}'], ['{skąd}', 'd’où', '{Skąd jesteś?}'], ['{dokąd}', 'où (direction)', '{Dokąd idziesz?}'],
        ] },
        { t: 'tip', x: 'À l’oral, une intonation montante suffit souvent : {Masz czas?} (Tu as le temps ?)' },
      ],
      quiz: [
        { q: '___ jest dworzec?', o: ['Gdzie', 'Kiedy', 'Kto'], a: 0 },
        { q: '___ to kosztuje?', o: ['Ile', 'Jak', 'Co'], a: 0 },
        { q: '___ mówisz po polsku?', o: ['Czy', 'Co', 'Kto'], a: 0 },
      ],
    },
  ];

  /* Déclinaisons modèles pour le tableau interactif. */
  S.data.declensions = [
    { n: 'kot', fr: 'chat', g: 'm. animé', sg: ['kot', 'kota', 'kotu', 'kota', 'kotem', 'kocie', 'kocie'], pl: ['koty', 'kotów', 'kotom', 'koty', 'kotami', 'kotach', 'koty'] },
    { n: 'pies', fr: 'chien', g: 'm. animé', sg: ['pies', 'psa', 'psu', 'psa', 'psem', 'psie', 'psie'], pl: ['psy', 'psów', 'psom', 'psy', 'psami', 'psach', 'psy'] },
    { n: 'student', fr: 'étudiant', g: 'm. personnel', sg: ['student', 'studenta', 'studentowi', 'studenta', 'studentem', 'studencie', 'studencie'], pl: ['studenci', 'studentów', 'studentom', 'studentów', 'studentami', 'studentach', 'studenci'] },
    { n: 'dom', fr: 'maison', g: 'm. inanimé', sg: ['dom', 'domu', 'domowi', 'dom', 'domem', 'domu', 'domu'], pl: ['domy', 'domów', 'domom', 'domy', 'domami', 'domach', 'domy'] },
    { n: 'kawa', fr: 'café', g: 'féminin', sg: ['kawa', 'kawy', 'kawie', 'kawę', 'kawą', 'kawie', 'kawo'], pl: ['kawy', 'kaw', 'kawom', 'kawy', 'kawami', 'kawach', 'kawy'] },
    { n: 'mama', fr: 'maman', g: 'féminin', sg: ['mama', 'mamy', 'mamie', 'mamę', 'mamą', 'mamie', 'mamo'], pl: ['mamy', 'mam', 'mamom', 'mamy', 'mamami', 'mamach', 'mamy'] },
    { n: 'noc', fr: 'nuit', g: 'féminin', sg: ['noc', 'nocy', 'nocy', 'noc', 'nocą', 'nocy', 'nocy'], pl: ['noce', 'nocy', 'nocom', 'noce', 'nocami', 'nocach', 'noce'] },
    { n: 'okno', fr: 'fenêtre', g: 'neutre', sg: ['okno', 'okna', 'oknu', 'okno', 'oknem', 'oknie', 'okno'], pl: ['okna', 'okien', 'oknom', 'okna', 'oknami', 'oknach', 'okna'] },
    { n: 'miasto', fr: 'ville', g: 'neutre', sg: ['miasto', 'miasta', 'miastu', 'miasto', 'miastem', 'mieście', 'miasto'], pl: ['miasta', 'miast', 'miastom', 'miasta', 'miastami', 'miastach', 'miasta'] },
    { n: 'morze', fr: 'mer', g: 'neutre', sg: ['morze', 'morza', 'morzu', 'morze', 'morzem', 'morzu', 'morze'], pl: ['morza', 'mórz', 'morzom', 'morza', 'morzami', 'morzach', 'morza'] },
  ];
  S.data.cases = [
    { pl: 'Mianownik', fr: 'Nominatif', q: 'kto? co?' },
    { pl: 'Dopełniacz', fr: 'Génitif', q: 'kogo? czego?' },
    { pl: 'Celownik', fr: 'Datif', q: 'komu? czemu?' },
    { pl: 'Biernik', fr: 'Accusatif', q: 'kogo? co?' },
    { pl: 'Narzędnik', fr: 'Instrumental', q: 'z kim? z czym?' },
    { pl: 'Miejscownik', fr: 'Locatif', q: 'o kim? o czym?' },
    { pl: 'Wołacz', fr: 'Vocatif', q: 'o!' },
  ];

  /* Mots à trier par genre (jeu dans la fiche « genre »). */
  S.data.genderSort = [
    ['kot', 'm'], ['kawa', 'f'], ['okno', 'n'], ['dom', 'm'], ['woda', 'f'], ['mleko', 'n'], ['stół', 'm'], ['zupa', 'f'],
    ['jabłko', 'n'], ['tata', 'm'], ['noc', 'f'], ['morze', 'n'], ['samochód', 'm'], ['książka', 'f'], ['dziecko', 'n'], ['podróż', 'f'],
  ];
})();
