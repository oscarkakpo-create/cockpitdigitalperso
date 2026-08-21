#!/usr/bin/env node
/**
 * Contrôle d'accessibilité statique pour les pages monofichier du cockpit.
 *
 * Pourquoi un outil maison plutôt qu'axe-core ou pa11y :
 * ces outils n'évaluent que les éléments *visibles*. Le cockpit est une SPA
 * où 24 panneaux sur 25 sont en `display:none` à tout instant — axe n'a donc
 * inspecté qu'un seul des 83 champs de saisie de index.html. Ce script lit le
 * DOM complet, panneaux cachés inclus.
 *
 * Usage : node check.mjs <fichier.html> [...]
 * Sortie : code 1 si au moins une erreur.
 */
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const INTERACTIVE = new Set(['a', 'button', 'input', 'select', 'textarea', 'summary', 'details']);

/** Retrouve le n-ième numéro de ligne où apparaît un fragment, pour un message actionnable. */
function lineFinder(source) {
  const lines = source.split('\n');
  const used = new Map();
  return (needle) => {
    const key = needle;
    const from = used.get(key) ?? 0;
    for (let i = from; i < lines.length; i++) {
      if (lines[i].includes(needle)) {
        used.set(key, i + 1);
        return i + 1;
      }
    }
    return null;
  };
}

function accessibleName(el, doc) {
  if (el.getAttribute('aria-label')?.trim()) return true;
  const labelledby = el.getAttribute('aria-labelledby');
  if (labelledby && labelledby.split(/\s+/).some((id) => doc.getElementById(id))) return true;
  if (el.closest('label')) return true;
  const id = el.id;
  if (id && [...doc.querySelectorAll('label[for]')].some((l) => l.getAttribute('for') === id)) return true;
  return false;
}

function auditFile(file) {
  const source = readFileSync(file, 'utf8');
  const { window } = new JSDOM(source);
  const doc = window.document;
  const at = lineFinder(source);
  const findings = [];
  const add = (rule, level, el, msg) => {
    const snippet = el ? el.outerHTML.split('\n')[0].slice(0, 60) : null;
    findings.push({ rule, level, line: snippet ? at(snippet.slice(0, 45)) : null, msg });
  };

  // 1. Champs de saisie sans nom accessible. Un placeholder ne compte pas :
  //    il disparaît à la saisie et n'est pas lu de façon fiable.
  for (const el of doc.querySelectorAll('input, select, textarea')) {
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'button') continue;
    if (!accessibleName(el, doc)) {
      const hint = el.id ? `#${el.id}` : `.${el.className || '?'}`;
      add('form-label', 'error', el, `champ sans label ni aria-label (${hint})`);
    }
  }

  // 2. Éléments cliquables inatteignables au clavier.
  //    Deux exclusions légitimes : les gardes de propagation (`stopPropagation`),
  //    qui n'exposent aucune action, et les fonds de modale marqués
  //    role="presentation" — leur équivalent clavier est la touche Échap,
  //    pas un tabindex.
  for (const el of doc.querySelectorAll('[onclick]')) {
    const tag = el.tagName.toLowerCase();
    if (INTERACTIVE.has(tag)) continue;
    const handler = el.getAttribute('onclick') || '';
    if (/^\s*event\.stopPropagation\(\)\s*;?\s*$/.test(handler)) continue;
    if (el.getAttribute('role') === 'presentation') continue;
    const focusable = el.hasAttribute('tabindex') && el.getAttribute('tabindex') !== '-1';
    const hasRole = ['button', 'link', 'menuitem', 'tab', 'option'].includes(el.getAttribute('role'));
    if (!focusable || !hasRole) {
      add('keyboard-access', 'error', el, `<${tag} onclick> sans role+tabindex — inatteignable au clavier`);
    }
  }

  // 3. Identifiants dupliqués — fréquent dans un gros fichier unique,
  //    et casse silencieusement getElementById et label[for].
  const seen = new Map();
  for (const el of doc.querySelectorAll('[id]')) {
    const id = el.id;
    if (seen.has(id)) add('duplicate-id', 'error', el, `id dupliqué : "${id}"`);
    else seen.set(id, el);
  }

  // 4. Images sans alternative textuelle.
  for (const el of doc.querySelectorAll('img')) {
    if (!el.hasAttribute('alt')) add('img-alt', 'error', el, 'img sans attribut alt');
  }

  // 5. Boutons sans texte lisible (icône seule sans aria-label).
  for (const el of doc.querySelectorAll('button')) {
    const text = (el.textContent || '').replace(/[\s​]/g, '');
    if (!text && !el.getAttribute('aria-label')?.trim() && !el.getAttribute('title')?.trim()) {
      add('button-name', 'error', el, 'bouton sans texte ni aria-label');
    }
  }

  // 6. Indicateur de focus supprimé. Heuristique sur la source CSS :
  //    on signale outline:none sans remplacement visible dans la même règle.
  const cssRules = source.match(/[^{}]*:focus[^{}]*\{[^}]*\}/g) || [];
  for (const rule of cssRules) {
    if (/outline:\s*(none|0)/.test(rule) && !/(box-shadow|border-color|outline-offset|background)/.test(rule)) {
      findings.push({
        rule: 'focus-visible',
        level: 'error',
        line: at(rule.slice(0, 40)),
        msg: 'outline:none sur :focus sans indicateur de remplacement',
      });
    }
  }

  // 7. Contrôles créés en JavaScript. Le DOM statique ne les contient pas :
  //    on inspecte donc le texte des blocs <script> à la recherche de champs
  //    écrits dans des gabarits de chaîne. Sans ça, un <select> généré à
  //    l'exécution échappe entièrement au contrôle.
  const scripts = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/g) || [];
  for (const block of scripts) {
    const controls = block.match(/<(input|select|textarea)\b[^>]*>/g) || [];
    for (const ctrl of controls) {
      const type = ctrl.match(/\btype="([^"]+)"/)?.[1]?.toLowerCase();
      if (type === 'hidden' || type === 'submit' || type === 'button') continue;
      if (/\baria-label(ledby)?=/.test(ctrl)) continue;
      // un id fixe peut être relié par un <label for> ailleurs dans la page
      const id = ctrl.match(/\bid="([^"$]+)"/)?.[1];
      if (id && source.includes(`for="${id}"`)) continue;
      findings.push({
        rule: 'form-label-js',
        level: 'error',
        line: at(ctrl.slice(0, 45)),
        msg: `champ généré en JS sans nom accessible : ${ctrl.slice(0, 60)}`,
      });
    }
  }

  // 8. Animations sans échappatoire pour les utilisateurs sensibles au mouvement.
  const transitions = (source.match(/transition\s*:/g) || []).length;
  if (transitions > 0 && !source.includes('prefers-reduced-motion')) {
    findings.push({
      rule: 'reduced-motion',
      level: 'warn',
      line: null,
      msg: `${transitions} transitions CSS et aucun bloc @media (prefers-reduced-motion: reduce)`,
    });
  }

  return findings;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node check.mjs <fichier.html> [...]');
  process.exit(2);
}

let errors = 0;
let warns = 0;

for (const file of files) {
  const findings = auditFile(file);
  const byRule = new Map();
  for (const f of findings) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule).push(f);
  }

  console.log(`\n${file}`);
  if (findings.length === 0) {
    console.log('  ✓ aucun problème');
    continue;
  }

  for (const [rule, list] of [...byRule].sort((a, b) => b[1].length - a[1].length)) {
    const level = list[0].level;
    console.log(`\n  [${level}] ${rule} — ${list.length}`);
    for (const f of list.slice(0, 8)) {
      console.log(`    ${f.line ? `${file}:${f.line}` : '(global)'}  ${f.msg}`);
    }
    if (list.length > 8) console.log(`    … et ${list.length - 8} autres`);
  }

  errors += findings.filter((f) => f.level === 'error').length;
  warns += findings.filter((f) => f.level === 'warn').length;
}

console.log(`\n${errors} erreur(s), ${warns} avertissement(s)`);
process.exit(errors > 0 ? 1 : 0);
