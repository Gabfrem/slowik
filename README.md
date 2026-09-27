# Słowik — apprendre le polonais, mot à mot

Application complète d'apprentissage du polonais pour francophones, dans l'esprit des *wycinanki* (papiers découpés folkloriques polonais). Elle fonctionne hors-ligne et sans installation ; un compte gratuit (facultatif) sauvegarde la progression en ligne et la synchronise entre appareils.

## Lancer l'application

Double-clique sur **`Lancer Slowik.bat`** : Słowik s'ouvre dans sa propre fenêtre (mode application de Microsoft Edge, ou de Chrome à défaut).

Tu peux aussi ouvrir directement `index.html` dans Edge ou Chrome (la progression est propre à chaque navigateur : utilise toujours le même, ou passe par l'export/import des réglages).

> **Pour entendre le polonais**, il faut une voix polonaise :
> - **Microsoft Edge** (recommandé) : voix naturelles « Zofia » et « Marek », avec une connexion internet.
> - **Hors-ligne** : Paramètres Windows → Heure et langue → Voix → Ajouter des voix → *Polski*.
> - **Chrome** : voix « Google polski ».
>
> Sans voix polonaise, tout fonctionne, sauf les exercices d'écoute (ils sont alors remplacés automatiquement).

## Ce qu'il y a dedans

| Section | Contenu |
|---|---|
| **Parcours** | 15 unités (A1 → A2), 45 leçons et 15 défis, 272 mots, 198 phrases |
| **Révisions** | Cartes recto-verso et répétition espacée **FSRS** (l'algorithme d'Anki moderne) |
| **Sons** | Alphabet interactif, tableau des chuintantes (s/sz/ś…), paires minimales, accent tonique, virelangues |
| **Grammaire** | 17 fiches illustrées : genres, 7 cas, conjugaisons, passé, aspect, futur, nombres… avec quiz |
| **Dialogues** | 10 dialogues et 2 histoires, traduction au survol de chaque mot, lecture audio, quiz |
| **Entraînement** | Pratique ciblée, sprint de 60 s, nombres, heure, conjugaison (38 verbes), cas, dictée, genres |
| **Lexique** | Recherche instantanée (accents facultatifs), fiche détaillée et maîtrise de chaque mot |
| **Culture** | Traditions, personnalités et proverbes polonais |
| **Progrès** | Niveaux, série de jours, graphiques d'XP, calendrier d'activité, 19 succès |

Chaque mot affiche sa **prononciation figurée « à la française »** (ex. *dziękuję* → [ djiènk**ou**yè ]) et son **accent tonique** souligné.

## La méthode

- **Rappel actif** : on passe de la reconnaissance (QCM, écoute) à la production (construire, écrire, prononcer).
- **Répétition espacée** : chaque mot revient juste avant d'être oublié.
- **Input compréhensible** : des dialogues légèrement au-dessus de ton niveau.
- **Les sons d'abord** : le polonais se lit comme il s'écrit.
- **Grammaire en contexte** : les cas arrivent un par un, avec des déclencheurs concrets.
- **Petites séances quotidiennes** : objectif du jour, série de jours et « gels » de série.

## Raccourcis clavier

`Entrée` vérifier / continuer · `1`–`4` choisir une réponse · `Espace` retourner une carte · `Tab` réécouter une dictée · `Échap` quitter une séance · `H` `P` `R` `S` `G` `D` `E` `L` naviguer entre les sections.

## Sauvegarde et compte

La progression est enregistrée automatiquement sur l'appareil. Avec un **compte** (Réglages → Compte), elle est aussi sauvegardée en ligne (Supabase) et fusionnée entre tes appareils : on garde le meilleur de chacun (étoiles, cartes les plus récentes, succès…).

Sans compte, **Réglages → Sauvegarde** permet d'**exporter** la progression en fichier `.json` et de la réimporter ailleurs.

## Version en ligne et installation sur téléphone

Le site est publié avec **GitHub Pages** : https://gabfrem.github.io/slowik/ — pour publier des modifications, double-clique sur `Publier sur GitHub.bat`. Sur téléphone, ouvre-le puis « Ajouter à l'écran d'accueil » : Słowik s'installe comme une application (plein écran, fonctionne hors-ligne).

### Mise en place de la base (une seule fois)

1. Supabase → **SQL Editor** → coller le contenu de `supabase/schema.sql` → **Run**.
2. Supabase → **Authentication → URL Configuration** : *Site URL* = l'adresse GitHub Pages du site, et l'ajouter aussi dans *Redirect URLs*.
3. Reporter cette même adresse dans `siteUrl` du fichier `js/config.js`.

La clé `anon` de `js/config.js` est publique par conception ; la sécurité repose sur les règles RLS du script SQL (chacun n'accède qu'à ses propres données). Ne jamais publier la clé `service_role`.

## Organisation des fichiers

```
index.html           page de l'application
manifest.webmanifest et sw.js   installation sur téléphone et mode hors-ligne
Lancer Slowik.bat    lanceur Windows (appelle outils/lancer.ps1)
outils/              script du lanceur (gère les accents du chemin)
supabase/schema.sql  base de données : table de progression et règles de sécurité
assets/              icônes, polices (Fraunces, Manrope), client Supabase embarqué
css/                 styles : base, animations, coquille, composants, écrans, séances
js/config.js         adresse et clé publique du projet Supabase
js/core/             moteurs : sauvegarde, synchronisation, FSRS, audio, phonétique, effets, interface, routeur
js/data/             contenu pédagogique (curriculum, sons, grammaire, dialogues, culture)
js/engine/           exercices et déroulé des séances
js/views/            écrans de l'application
```
