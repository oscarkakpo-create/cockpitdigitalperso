# CESAG Digital Cockpit

**Cockpit de commande unifié pour la coordination FOAD du CESAG.**  
Outil 100% local, zéro dépendance, un seul fichier HTML.

---

## Présentation

CESAG Digital Cockpit est une application web autonome conçue pour les équipes de coordination pédagogique et administrative du CESAG (Centre Africain d'Études Supérieures en Gestion, Dakar). Elle centralise en un seul endroit tous les outils du quotidien : mails de support, planification FOAD, quiz Moodle, gestion des comptes et bien plus.

---

## Fonctionnalités

### Support & Mails
| Outil | Description |
|---|---|
| **Accès numériques** | Génère le mail d'activation Office 365 + Moodle + Hub Digital |
| **Reset Moodle** | Mail de réinitialisation de compte avec mot de passe temporaire |
| **Mail enseignant** | Invitation formelle à animer un module |
| **Réponse apprenant** | Réponse personnalisée à un étudiant ou participant |
| **Consignes examen** | Convocation officielle à un examen en ligne |

### FOAD / Moodle
| Outil | Description |
|---|---|
| **Générateur ICS** | Crée et télécharge un fichier `.ics` d'invitation agenda |
| **Annonce HTML** | Génère une annonce HTML formatée prête à coller dans Moodle |
| **Quiz GIFT** | Génère des questions Moodle au format GIFT (5 types) avec accumulation |
| **Syllabus rapide** | Génère un prompt structuré pour produire un syllabus FOAD complet (13 sections CESAG/AACSB) |
| **HTML Live Editor** | Éditeur HTML avec prévisualisation en temps réel |

### Administration
| Outil | Description |
|---|---|
| **Comptes Microsoft 365** | Saisie manuelle ou import par liste, export CSV UTF-8 BOM prêt pour le portail Admin M365 |
| **Mails sauvegardés** | Historique local de tous les messages générés |

### EPE — Planning FOAD
Générateur de blocs de planification hebdomadaire à coller dans une IA :
- Séances configurables (Cours / Examen / TPE)
- Liste complète des modules par programme (MBA AG, MBA GP, MBA MSCH, LP, DECOFI…)
- Duplication de séances, détection de conflits, compteur d'heures
- Vue semaine visuelle, mode mémorisé IA, historique des blocs
- Export `.txt`, copie en un clic, FAB flottant

### Dev / GitHub
5 prompts Codex prêts à l'emploi :
- Modifier un fichier GitHub
- Ajouter une page HTML
- Mettre à jour le Hub Digital CESAG
- Déployer GitHub Pages
- Créer un nouveau projet

---

## Fonctionnalités transversales

- **Thème clair / sombre** — toggle en topbar, préférence mémorisée
- **Ouvrir dans mail** — mailto: pré-rempli (destinataire + objet + corps)
- **Export PDF** — impression propre avec en-tête CESAG depuis n'importe quel résultat
- **Sauvegarde locale** — tous les mails générés conservés en localStorage
- **Formules de salutation professionnelles** — "Madame, Monsieur," par défaut, civilité configurable

---

## Programmes couverts

- MBA Audit et Gestion (AG) — Classique & AUF
- MBA Gestion des Projets (GP) — Classique & AUF
- MBA Management des Stratégies et du Capital Humain (MSCH)
- LP MIAGE, LP Banque Finance, LP Comptabilité Contrôle Audit
- DECOFI, Formation Continue CESAG

---

## Utilisation

```bash
# Aucune installation requise
# Ouvrir directement dans un navigateur
open CESAG_COCKPIT_V3.html
```

Ou déployer sur GitHub Pages pour un accès en ligne depuis n'importe quel appareil.

---

## Structure du fichier

```
CESAG_COCKPIT_V3.html
├── CSS (thème clair/sombre, sidebar, panels, dark mode variables)
├── HTML (sidebar navigation, 15 panels)
└── JavaScript
    ├── Navigation & thème
    ├── Générateurs de mails (5 outils)
    ├── ICS, GIFT, Syllabus, HTML Editor
    ├── Microsoft 365 CSV (import + export)
    ├── Sauvegarde locale (localStorage)
    ├── Mailto & PDF print
    └── EPE Planning (modules, séances, historique)
```

---

## Déploiement GitHub Pages

1. Pousser `CESAG_COCKPIT_V3.html` (ou renommer en `index.html`) dans le repo
2. Aller dans **Settings → Pages**
3. Source : branche `main`, dossier `/root`
4. URL générée : `https://oscarkakpo-create.github.io/cesag-digital-cockpit/`

---

## Auteur

Développé par **Oscar Kakpo**  
Technopédagogue & Coordinateur FOAD — CESAG, Dakar  
[K'NEL Communication](https://oscarkakpo-create.github.io/hubdigitalcesag/)

---

*CESAG Digital Cockpit — v3.0 — 2026*
