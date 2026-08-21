# CESAG Digital Cockpit — règles projet

Standards distillés depuis ECC (`.claude/rules/`) et **adaptés à la réalité de ce dépôt** :
application web autonome, HTML monofichier, vanilla JS, zéro dépendance, zéro build,
publiée via GitHub Pages.

## Contraintes d'architecture (non négociables)

- **Un seul fichier par outil.** `index.html` (~2900 lignes) embarque son CSS et son JS.
  C'est un choix produit — l'outil doit fonctionner hors ligne, sans serveur ni npm.
  La règle ECC « fichiers < 800 lignes » **ne s'applique pas ici** : ne propose jamais
  d'éclater le fichier en modules ni d'introduire un bundler.
- **Zéro dépendance externe.** Pas de CDN, pas de framework, pas de police distante.
  Toute ressource doit être inline ou en `data:` URI.
- **Vanilla only.** Pas de React/Vue/TS. Les skills ECC `frontend-patterns`,
  `motion-*` et `frontend-a11y` sont écrites pour React — n'en reprends que les
  principes, jamais la syntaxe JSX.
- **Persistance = `localStorage`.** Aucune donnée ne sort du navigateur.

## Style de code

- Fonctions ciblées (< 50 lignes), retours anticipés plutôt qu'imbrication > 4 niveaux.
- Nommage : `camelCase` pour variables/fonctions, `UPPER_SNAKE_CASE` pour constantes,
  préfixes `is` / `has` / `should` pour les booléens.
- Pas de nombres magiques : constante nommée pour tout seuil, délai ou limite.
- Pas de `console.log` résiduel dans le code livré.
- Erreurs traitées explicitement, jamais avalées en silence. Message utilisateur clair
  côté UI (en français), détail technique en console uniquement pendant le debug.
- Toute entrée utilisateur est validée avant usage — y compris les imports par liste
  (comptes M365) et les collages dans l'éditeur HTML.

## Qualité visuelle

Le cockpit a déjà un système : variables CSS (`--bg`, `--text`, `--g`, `--r`,
`--topbar-bg`, `--sidebar-bg`, `--input-bg`, `--shadow`, `--red`) et un thème
clair/sombre mémorisé.

- **Toujours passer par les variables CSS existantes.** Jamais de couleur en dur.
- Les deux thèmes doivent rester intentionnels — vérifie clair *et* sombre après
  chaque changement visuel.
- États `hover`, `focus`, `active` explicitement dessinés sur tout élément cliquable.
- Hiérarchie par contraste d'échelle, pas par emphase uniforme.
- Rythme d'espacement intentionnel — pas le même padding partout.
- Cibles tactiles ≥ 44 px sur mobile.

Détail complet : skill `make-interfaces-feel-better`, règles `.claude/rules/web/design-quality.md`.

## Accessibilité (WCAG 2.2 AA)

- HTML sémantique d'abord ; `<div onclick>` seulement en dernier recours, et alors
  avec `role`, `tabindex` et gestion clavier.
- Tout champ de formulaire a un `<label>` associé.
- Contraste ≥ 4.5:1 pour le texte courant, dans les deux thèmes.
- Navigation clavier complète, focus visible, focus piégé dans les modales.
- `prefers-reduced-motion` respecté sur toute animation.

Détail : skills `accessibility` et `frontend-a11y`.

## Performance

- Animer uniquement `transform` et `opacity`.
- `IntersectionObserver` plutôt que des handlers de scroll.
- Images : `width`/`height` explicites, `loading="lazy"` hors du premier écran.
- Pas de reflow en boucle — batcher les écritures DOM.
- Le poids du fichier compte : il est servi d'un bloc. Toute addition significative
  doit justifier son coût.

## Git & déploiement

- Branches `feat/`, `fix/`, `ci/`, `docs/` ; commits en Conventional Commits.
- Branche principale : `main`. GitHub Pages sert depuis le workflow `.github/`.
- `.nojekyll` est requis à la racine — ne pas le supprimer.
- Ne jamais committer ni pousser sans demande explicite.

## Garde-fou automatique

```bash
cd tools/a11y-check && npm run check
```

Contrôle statique des 4 pages : champs sans label, éléments cliquables
inatteignables au clavier, identifiants dupliqués, images sans `alt`, boutons
sans nom, focus supprimé, absence de `prefers-reduced-motion`. Code de sortie 1
si une erreur subsiste. Tourne aussi en CI (`.github/workflows/qa.yml`) sur
chaque push, avec `html-validate` pour la validité structurelle.

**Cet outil existe parce qu'axe-core et pa11y sont aveugles ici** : ils
n'inspectent que les éléments visibles, or 24 panneaux sur 25 sont en
`display:none`. Sur `index.html`, axe n'avait examiné qu'**un seul** des 83
champs de saisie. Le contrôle maison lit le DOM complet.

C'est un outil de développement : il vit dans `tools/`, avec ses propres
dépendances, et n'est jamais embarqué dans les pages livrées.

## Revue avant de dire « c'est fait »

- [ ] Testé dans le navigateur (pas seulement lu) — thème clair **et** sombre
- [ ] Navigation clavier vérifiée sur ce qui a changé
- [ ] Aucune dépendance externe introduite
- [ ] Aucun `console.log` ni code mort laissé
- [ ] Aucune couleur en dur ajoutée
- [ ] Les données `localStorage` existantes restent lisibles (pas de rupture de schéma)

Agents utiles : `code-reviewer`, `a11y-architect`, `code-simplifier`,
`silent-failure-hunter`, `performance-optimizer`.
