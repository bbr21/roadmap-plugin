#!/usr/bin/env node
// Contrôle avant commit : liens relatifs des docs, grammaire de ROADMAP, taille de CLAUDE.md, fichiers secrets suivis.
// Sans réseau, sans dépendance. Code de retour 1 s'il trouve une erreur.
//   node scripts/check.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fichiers qui ne doivent jamais être suivis par git (motifs sur le nom du fichier, * pour n'importe quoi).
// `.env.example` reste permis : il ne porte que des noms de variables.
const SECRET_FILES = {{SECRETS_JSON}};

// Dossiers dont les liens ne se contrôlent pas : des modèles Markdown, dont les liens visent le projet
// qu'ils serviront à poser, pas celui-ci.
const IGNORE = {{IGNORE_JSON}};
const ignored = (file) => IGNORE.some((p) => file === p || file.startsWith(p.endsWith('/') ? p : `${p}/`));

// Le dossier de la roadmap, relatif à la racine du dépôt (vide : à la racine), comme le dit .claude/roadmap.json.
const RM = '{{RM}}';
const OPEN = `${RM}ROADMAP.md`;
const DONE = `${RM}ROADMAP-fait.md`;

const here = dirname(fileURLToPath(import.meta.url));
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: here, encoding: 'utf8' }).trim();
// Les fichiers suivis et ceux qui vont l'être (pas encore ajoutés, non ignorés).
const tracked = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter((f) => f && existsSync(join(root, f)));
const read = (file) => readFileSync(join(root, file), 'utf8');

const results = [];
function check(title, run) {
  const errors = [];
  run((where, msg) => errors.push(`${where}: ${msg}`));
  results.push({ title, errors });
}

// Lignes hors blocs de code, avec leur numéro.
function proseLines(text) {
  const out = [];
  let fence = null;
  text.split('\n').forEach((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})/);
    if (m) {
      if (!fence) fence = m[1][0];
      else if (m[1][0] === fence) fence = null;
      return;
    }
    if (!fence) out.push({ line, n: i + 1 });
  });
  return out;
}

// Ancres d'un fichier Markdown, à la manière de GitHub.
const anchorCache = new Map();
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const anchors = new Set();
  const seen = new Map();
  for (const { line } of proseLines(read(file))) {
    for (const m of line.matchAll(/<a\s+(?:id|name)="([^"]+)"/g)) anchors.add(m[1]);
    const h = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
    if (!h) continue;
    const text = h[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*]/g, '');
    const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    anchors.add(count ? `${base}-${count}` : base);
  }
  anchorCache.set(file, anchors);
  return anchors;
}

check('Liens relatifs des docs', (err) => {
  for (const file of tracked.filter((f) => f.endsWith('.md') && !ignored(f))) {
    for (const { line, n } of proseLines(read(file))) {
      const clean = line.replace(/`[^`]*`/g, '');
      const targets = [
        ...[...clean.matchAll(/\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\s*\)/g)].map((m) => m[1]),
        ...[...clean.matchAll(/^\s*\[[^\]]+\]:\s+(\S+)/g)].map((m) => m[1]),
      ];
      for (let target of targets) {
        target = target.replace(/^<|>$/g, '');
        if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue;
        const [rawPath, anchor] = target.split('#');
        let path;
        try { path = decodeURIComponent(rawPath); } catch { path = rawPath; }
        if (path.startsWith('~') || path.startsWith('/')) continue;
        const dest = path ? posix.normalize(posix.join(posix.dirname(file), path)) : file;
        const abs = resolve(root, dest);
        if (!existsSync(abs)) { err(`${file}:${n}`, `lien vers ${target} : fichier absent`); continue; }
        if (anchor && dest.endsWith('.md') && statSync(abs).isFile() && !anchorsOf(relative(root, abs)).has(decodeURIComponent(anchor))) {
          err(`${file}:${n}`, `lien vers ${target} : ancre #${anchor} absente de ${relative(root, abs)}`);
        }
      }
    }
  }
});

// Verrous connus : la première colonne du tableau « ### Verrous » de CLAUDE.md (aucun tableau : aucun verrou).
function knownLocks() {
  const locks = new Set();
  const section = read('CLAUDE.md').split(/^### Verrous$/m)[1]?.split(/^#{2,3} /m)[0] ?? '';
  for (const row of section.split('\n').filter((l) => l.startsWith('| `'))) {
    for (const m of row.split('|')[1].matchAll(/`([^`]+)`/g)) locks.add(m[1]);
  }
  return locks;
}

// Axes connus : la puce « axe » de la grammaire dans ROADMAP.md.
function knownAxes() {
  const line = read(OPEN).split('\n').find((l) => l.startsWith('- **axe**')) ?? '';
  return new Set([...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]));
}

const isDate = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
// fait: porte la date de clôture, et son heure quand elle est connue.
const isDone = (s) => {
  const m = s.match(/^(\S+)(?: ([01]\d|2[0-3]):[0-5]\d)?$/);
  return Boolean(m) && isDate(m[1]);
};
// Aujourd'hui à l'heure locale du poste, jamais en UTC (#201) : le soir à New York, l'UTC est déjà demain.
const now = new Date();
const TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

// Les clés que le projet déclare dans .claude/roadmap.json (`cles` : clé → valeurs admises, liste vide : libre).
function declaredKeys() {
  const file = '.claude/roadmap.json';
  if (!existsSync(join(root, file))) return new Map();
  try {
    const cles = JSON.parse(read(file)).cles ?? {};
    return new Map(Object.entries(cles).filter(([, v]) => Array.isArray(v)));
  } catch {
    return new Map();
  }
}

check('Grammaire de ROADMAP.md et ROADMAP-fait.md', (err) => {
  const locks = knownLocks();
  const axes = knownAxes();
  if (!axes.size) err(OPEN, 'liste des axes introuvable (puce « - **axe** »)');
  // Les clés que lit et contrôle le panneau Roadmap (plugin roadmap).
  const keys = new Set(['id', 'qui', 'attend', 'resp', 'branche', 'verrou', 'ouvert', 'due', 'parent', 'après', 'prio', 'feedback', 'fait', 'spec', 'fiche', 'src', 'tous', 'relance']);
  const declared = declaredKeys();
  // id: unique sur les deux fichiers, gardé quand la ligne descend dans ROADMAP-fait.
  const ids = new Map();
  const nextId = 1 + Math.max(0, ...[OPEN, DONE]
    .flatMap((f) => [...read(f).matchAll(/[[|]\s*id:(\d+)\s*[|\]]/g)].map((m) => Number(m[1]))));
  // Les lignes ouvertes, pour comparer une sous-tâche à sa mère (#190).
  const open = [];

  for (const file of [OPEN, DONE]) {
    const inDone = file === DONE;
    let section = '';
    for (const { line, n } of proseLines(read(file))) {
      if (line.startsWith('## ')) section = line.slice(3).trim();
      const box = line.match(/^- \[( |x)\] /);
      if (!box) continue;
      const at = `${file}:${n}`;
      if (inDone && box[1] !== 'x') err(at, 'une ligne de ROADMAP-fait se coche [x]');
      if (!inDone && box[1] !== ' ') err(at, 'une ligne cochée [x] part en tête de ROADMAP-fait');

      const blocks = [...line.matchAll(/`\[([^`]*)\]`/g)];
      if (blocks.length !== 1) { err(at, `il faut un seul bloc de champs \`[…]\`, trouvé ${blocks.length}`); continue; }
      const label = line.slice(box[0].length, blocks[0].index).trim();
      if (!label) err(at, 'libellé absent avant les champs');

      const fields = blocks[0][1].split('|').map((f) => f.trim());
      const axeAt = fields.findIndex((f) => !f.includes(':'));
      if (axeAt === -1) err(at, 'axe absent (premier champ, sans clé)');
      else if (!axes.has(fields[axeAt])) err(at, `axe « ${fields[axeAt]} » inconnu (${[...axes].join(', ')})`);
      else if (axeAt > 0) err(at, `l'axe « ${fields[axeAt]} » doit être le premier champ`);
      const found = new Map();
      const docs = [];
      for (const [i, field] of fields.entries()) {
        if (i === axeAt) continue;
        // Une clé : celle de la grammaire, ou déclarée avec chiffres et tirets, comme le panneau la lit.
        const m = field.match(/^([a-zà-ÿ][a-zà-ÿ0-9-]*):(.+)$/);
        if (!m) { err(at, `champ « ${field} » : forme clé:valeur attendue`); continue; }
        const [, key, value] = m;
        if (declared.has(key) && !keys.has(key)) {
          const allowed = declared.get(key);
          for (const v of value.split(',').map((x) => x.trim()).filter(Boolean)) {
            if (allowed.length && !allowed.includes(v)) err(at, `${key}:${v} : valeur hors de la liste (${allowed.join(', ')})`);
          }
          if (found.has(key)) err(at, `clé « ${key} » en double`);
          found.set(key, value.trim());
          continue;
        }
        if (!keys.has(key)) { err(at, `clé inconnue « ${key} » (${[...keys, ...declared.keys()].join(', ')})`); continue; }
        if (found.has(key)) err(at, `clé « ${key} » en double`);
        found.set(key, value.trim());
        if ((key === 'ouvert' || key === 'due' || key === 'relance') && !isDate(value)) err(at, `${key}:${value} : date AAAA-MM-JJ attendue`);
        if (key === 'fait' && !isDone(value)) err(at, `fait:${value} : date AAAA-MM-JJ (et heure HH:MM) attendue`);
        // Une date de clôture ou d'ouverture n'est jamais après aujourd'hui (#201).
        if ((key === 'ouvert' || key === 'fait') && value.trim().slice(0, 10) > TODAY && isDone(value.trim())) err(at, `${key}:${value.trim()} : date dans le futur (aujourd'hui : ${TODAY}, heure locale)`);
        if (key === 'prio' && !/^[123]$/.test(value.trim())) err(at, `prio:${value} : 1, 2 ou 3 attendu`);
        if (key === 'tous' && !['semaine', '2semaines', 'mois', 'trimestre', 'an'].includes(value.trim())) err(at, `tous:${value} : semaine, 2semaines, mois, trimestre ou an attendu`);
        // parent: le numéro de la tâche mère (#12 compris), ou - ; après: un libellé, ou des numéros séparés par des virgules, ou -.
        if (key === 'parent' && !/^(#?[1-9]\d*|-)$/.test(value.trim())) err(at, `parent:${value} : numéro de tâche, ou -, attendu`);
        // - ne dit « aucun » que pour parent: et après: ; un responsable est un nom.
        if (key === 'resp' && value.trim() === '-') err(at, 'resp:- : un nom attendu (- ne vaut que pour parent: et après:)');
        if (key === 'après' && value.includes(',') && !/^\s*#?[1-9]\d*(\s*,\s*#?[1-9]\d*)*\s*$/.test(value)) {
          err(at, `après:${value} : numéros séparés par des virgules, ou -, attendus`);
        }
        if (key === 'feedback' && !/^\d+(,\d+)*$/.test(value.trim())) err(at, `feedback:${value} : numéros séparés par des virgules attendus`);
        if (key === 'id') {
          if (!/^[1-9]\d*$/.test(value)) err(at, `id:${value} : nombre entier attendu`);
          else if (ids.has(value)) err(at, `id:${value} déjà porté par ${ids.get(value)} : une ligne neuve prend id:${nextId}`);
          else ids.set(value, at);
        }
        if (key === 'verrou') {
          for (const lock of value.split(',').map((v) => v.trim())) {
            const lm = lock.match(/^([a-z0-9-]+)(?:\/[^@]*)?@(.+)$/);
            if (!lm) { err(at, `verrou:${lock} : forme <verrou>@AAAA-MM-JJ attendue`); continue; }
            if (!locks.has(lm[1])) err(at, `verrou « ${lm[1]} » inconnu du tableau « ### Verrous » de CLAUDE.md (${[...locks].join(', ') || 'aucun'})`);
            if (!isDate(lm[2])) err(at, `verrou:${lock} : date AAAA-MM-JJ attendue`);
          }
        }
        if (key === 'spec' || (key === 'fiche' && value.startsWith('docs/'))) docs.push([key, value]);
      }
      // Le dossier d'une ligne prise (branche:) ne vit que sur sa branche jusqu'à la fusion : exigé sur main
      // pour une ligne libre et pour toute ligne close (#92).
      if (inDone || !found.has('branche')) {
        for (const [key, value] of docs) {
          if (!existsSync(join(root, value.split('#')[0]))) err(at, `${key}:${value} : chemin absent`);
        }
      }
      if (!inDone && axeAt === 0) open.push({ at, axis: fields[0], id: found.get('id'), parent: (found.get('parent') ?? '').replace(/^#/, '') });
      if (!found.has('id')) err(at, `champ id: absent : une ligne neuve prend id:${nextId}, juste après l'axe`);
      if (inDone && !found.has('fait')) err(at, 'champ fait:AAAA-MM-JJ absent');
      if (!inDone && found.has('fait')) err(at, 'champ fait: dans ROADMAP.md : la ligne part dans ROADMAP-fait');
      if (!inDone && found.has('qui') && found.has('branche') && section !== 'En cours') {
        err(at, `ligne prise (qui: et branche:) hors de « En cours » (section « ${section} »)`);
      }
    }
  }
  // Une sous-tâche n'a pas d'axe à elle : elle prend celui de sa mère ouverte (#190).
  const openById = new Map();
  for (const row of open) if (row.id && !openById.has(row.id)) openById.set(row.id, row);
  for (const row of open) {
    const mother = openById.get(row.parent);
    if (mother && mother.axis !== row.axis) {
      err(row.at, `axe « ${row.axis} » différent de celui de sa mère #${row.parent} (« ${mother.axis} ») : une sous-tâche prend l'axe de sa tâche parente`);
    }
  }
});

check('CLAUDE.md sous 150 lignes', (err) => {
  const lines = read('CLAUDE.md').replace(/\n$/, '').split('\n').length;
  if (lines > 150) err('CLAUDE.md', `${lines} lignes, plafond 150`);
});

check('Aucun fichier secret suivi', (err) => {
  const patterns = SECRET_FILES.map((g) => new RegExp(`^${g.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`));
  for (const file of tracked) {
    const base = posix.basename(file);
    if (base === '.env.example') continue;
    if (patterns.some((p) => p.test(base))) err(file, 'fichier secret suivi par git : le retirer (git rm --cached) et l\'ajouter à .gitignore');
  }
});

let total = 0;
for (const { title, errors } of results) {
  total += errors.length;
  console.log(`${errors.length ? '✗' : '✓'} ${title}${errors.length ? ` : ${errors.length} erreur${errors.length > 1 ? 's' : ''}` : ''}`);
  for (const e of errors) console.log(`    ${e}`);
}
console.log(total ? `\n${total} erreur${total > 1 ? 's' : ''}.` : '\nTout est en ordre.');
process.exit(total ? 1 : 0);
