# Python Quest (Python-Quest_Claude)

Jeu-aventure pédagogique Python en HTML/CSS/JS pur, sans dépendance, jouable sur mobile et bureau.
Dépôt : https://github.com/Rokai-Jibe/Python-Quest_Claude — site : https://rokai-jibe.github.io/Python-Quest_Claude/

## Jouer
- Déplacement : flèches / ZQSD / WASD · Action et dialogues : A ou Entrée ou Espace.
- Combat : répondre juste à une question Python inflige des dégâts à l'ennemi.
- Le Grimoire conserve les sortilèges (snippets Python) appris auprès des PNJ.
- Progression sauvegardée automatiquement dans le navigateur (localStorage).

## Contenu
- Cartes : village (4 bâtiments : maison du mage, boutique, maison du forgeron), forêt des Boucles, donjon de l'Indentation.
- PNJ : mage mentor, forgeron, marchande, marchand ambulant, chat, panneaux.
- Boutique : épée (+5 dégâts, 20 or), potion (+20 PV, 8 or).
- Ennemis : serpent indenteur, slime de mémoire, gardien des deux-points.
- 30 questions Python (niveaux 1 et 2) avec explication après chaque réponse.
- i18n : français (repli), anglais, allemand.

## Vérifier
```bash
node scripts/validate.js
```
Le validateur contrôle : présence des fichiers, JSON valides, scripts d'index.html existants, clés i18n complètes, cohérence des cartes (portes, PNJ, ennemis).

## Déployer sur GitHub Pages
1. `Settings` > `Pages`.
2. Source : `Deploy from a branch` — branche `main`, dossier `/ (root)`.
3. Ouvrir https://rokai-jibe.github.io/Python-Quest_Claude/ (2 min de délai).

## Avertissement
Fichiers écrits par un assistant IA : vérifie le rendu réel dans ton navigateur ; toute erreur JS s'affiche en bas d'écran (`#error`) — copie le message pour la corriger ensemble.
