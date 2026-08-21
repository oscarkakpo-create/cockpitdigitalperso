#!/usr/bin/env node
/**
 * Hook Stop : empêche de conclure un tour sur une régression d'accessibilité.
 *
 * Ne tourne que si des fichiers HTML suivis ont changé — sinon il coûterait
 * 1,4 s à chaque tour sans rien vérifier d'utile.
 *
 * Sortie 2 + stderr = Claude reçoit le détail et doit corriger avant de finir.
 * Toute autre situation (pas un dépôt git, rien de modifié) sort en 0 : un
 * garde-fou qui bloque sur ses propres pannes est pire que pas de garde-fou.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  payload = {};
}

// Le hook s'est déjà déclenché sur ce tour : ne pas boucler.
if (payload.stop_hook_active) process.exit(0);

let changed = [];
try {
  const out = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', '*.html'], {
    cwd: repo,
    encoding: 'utf8',
  });
  changed = out.split('\n').map((s) => s.trim()).filter(Boolean);
} catch {
  process.exit(0);
}

const files = changed.map((f) => join(repo, f)).filter((f) => existsSync(f));
if (files.length === 0) process.exit(0);

try {
  execFileSync(process.execPath, [join(here, 'check.mjs'), ...files], {
    cwd: here,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  process.exit(0);
} catch (err) {
  const report = `${err.stdout || ''}${err.stderr || ''}`.trim();
  process.stderr.write(
    `Régression d'accessibilité dans les fichiers HTML modifiés.\n\n${report}\n\n` +
      `Corrige ces points avant de conclure. Règles : tools/a11y-check/check.mjs\n`
  );
  process.exit(2);
}
