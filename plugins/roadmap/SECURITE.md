# Est-il sûr de l'installer ?

Version décrite : roadmap 0.176.0
Un plugin de Claude Code fait tourner du code sur ta machine, donc la question se pose. Certains plugins
malveillants ont l'air inoffensifs quand on les installe, puis téléchargent et lancent autre chose plus
tard. Cette page dit tout ce que fait roadmap. Un test vérifie à chaque version qu'elle dit vrai, et tu
peux tout vérifier toi-même.

## Ce que le plugin ne fait jamais

- **Aucun serveur MCP.** Il ne démarre jamais de serveur qui irait chercher sa dernière version avec `npx`.
- **Aucune dépendance, aucun script d'installation.** Rien ne vient de npm ni de pip, ni à l'installation ni
  après : le plugin n'a pas de `package.json`.
- **Il ne télécharge jamais de code et ne lance jamais de code venu d'internet.** Pas d'`eval`, pas de
  `new Function`, pas d'`import()` dynamique, pas d'`exec` en Python, pas de longue chaîne encodée.
- **Aucun shell.** Chaque programme est lancé directement avec ses arguments, jamais comme une ligne de
  commande qu'un shell interpréterait (pas de `shell=True`, pas d'`os.system`). Le seul script shell est
  celui de la file des tests lourds, détaillé plus bas.
- **Aucune mesure d'audience, aucun pistage.**

## Ce qu'il fait

Le plugin a deux parties.

- **Le module de hooks** (`hooks/register.tsx` et ses voisins) tourne dans le moteur de mods de Claude Code.
  Il ne touche la machine que par l'interface `$` que le moteur lui donne : lire et écrire un fichier,
  lancer un programme, appeler un outil de l'app. `hooks/hooks.json` ne déclare que ce module : aucun hook
  `command` qui lancerait une commande à chaque événement.
- **Les skills** (`skills/`) sont des consignes que Claude suit dans ta session, avec tes réglages de
  permission habituels, et des scripts Python qu'il lance par l'outil Bash, qui te demande donc ton accord
  selon ces réglages.

## Les hooks

Le module s'enregistre sur ces événements. Sur un compte Team ou Enterprise, le moteur saute ceux qu'il
réserve (`session.*`, `turn.*`, `skill.prompt`) ; le plugin a alors un secours par message.

| Événement | Ce qu'il fait |
|---|---|
| `session.start` | ouvre le panneau Roadmap dans un projet qui a une roadmap, enregistre les commandes `/roadmap` et `/reglages` |
| `session.end`, `session.compact`, `session.measure` | garde l'état du panneau à la fin, à la compaction et au calcul de l'usage |
| `prompt.submit` | à ton message : rouvre le panneau, ajoute en contexte les rappels de la roadmap (ligne d'une idée, règles de session) |
| `turn.start`, `turn.complete` | début et fin d'un tour : note les fichiers changés, rappelle d'inscrire le travail dans la roadmap |
| `tool.call` | observe les outils que Claude appelle (Edit, Write, Bash, Skill, la liste d'étapes, la boîte de fin, le lancement de session) ; sur Bash, refuse une commande git interdite dans le dossier principal et place une suite de tests lourde dans la file (voir plus bas) |
| `skill.prompt` | ajoute ses consignes quand une de ses skills se lance |
| `command.run` | répond aux commandes `/roadmap`, `/reglages` et à celles des skills du plugin |
| `config.set` | redessine le panneau quand tu changes son thème |
| `ui.render`, `ui.press`, `ui.select`, `ui.focus`, `ui.scroll`, `ui.message`, `ui.close`, `ui.fault` | dessine le panneau, la bande au-dessus de la saisie et le volet Réglages, et répond à tes clics |

## Les programmes lancés

| Programme | Lancé par | Quand et pourquoi |
|---|---|---|
| `git` | `hooks/register.tsx`, `hooks/reglages.tsx`, `scripts/one-at-a-time.sh`, `skills/doctor/scripts/doctor.py`, `skills/maestro/scripts/etat_maestro.py`, `skills/onboarding/scripts/onboarding.py` | lire l'état du dépôt du projet (branche, commits, fichiers changés, copies de travail) ; et, quand tu coches, rouvres ou édites une tâche dans le panneau, committer et pousser les seuls fichiers de la roadmap vers le dépôt distant du projet |
| `curl` | `hooks/register.tsx` | quand tu cliques sur Rafraîchir dans le panneau : lire la dernière version publiée du plugin, pour te dire qu'une mise à jour existe |
| `gh` | `hooks/register.tsx`, `skills/doctor/scripts/doctor.py`, `skills/onboarding/scripts/onboarding.py` | la même lecture de version quand `curl` manque ; dans le doctor, vérifier que GitHub CLI est connecté (voir plus bas) ; à l'onboarding, lire les pull requests du projet pour en tirer la roadmap |
| `python3` | `hooks/register.tsx` | cocher une tâche dans un dossier Cowork qui déclare son propre outil d'écriture (voir plus bas), isolé par `-I` |
| `open` | `hooks/register.tsx` | ouvrir un lien ou un fichier que tu as cliqué dans le panneau, avec l'app par défaut du Mac |
| `sips`, `mktemp`, `rm` | `hooks/register.tsx` | faire la vignette d'une pièce jointe dans un dossier privé de `$TMPDIR`, puis la retirer |
| `claude` | `skills/doctor/scripts/doctor.py` | `claude plugin list --json`, pour voir quelles copies du plugin sont installées |
| `node` | `skills/doctor/scripts/doctor.py` | lancer le contrôle du projet lui-même, `scripts/check.mjs` |
| `rm` | `scripts/one-at-a-time.sh` | rendre la place dans la file des tests lourds |
| `awk`, `basename`, `cp`, `date`, `getconf`, `head`, `ls`, `mkdir`, `mv`, `perl`, `ps`, `sed`, `sleep`, `sort`, `stat`, `sysctl`, `tr`, `wc` | `scripts/one-at-a-time.sh` | tenir la file des tests lourds : un verrou par projet, l'âge et le PID de qui le tient, la charge du Mac (`perl` ne sert qu'à lire l'heure à la microseconde) |

## Les outils de l'app

Le module appelle ces outils de l'app de bureau, seulement quand tu cliques dans le panneau ou pour
lire l'état des sessions :

| Outil | Pourquoi |
|---|---|
| `mcp__ccd_session__start_session` | lancer une session sur une tâche (bouton ▶) |
| `mcp__ccd_session_mgmt__list_sessions`, `mcp__ccd_session_mgmt__get_session` | lire les sessions liées et leur état, pour Maestro et la fiche d'une tâche |
| `mcp__ccd_session_mgmt__send_message` | envoyer un message à une session que tu choisis dans le panneau |
| `mcp__ccd_session_mgmt__set_session_permission_mode` | passer une session lancée en bypass, si tu as allumé le réglage « Lancer en bypass » |
| `mcp__ccd_session_mgmt__archive_session`, `mcp__ccd_session_mgmt__unarchive_session` | archiver ou désarchiver une session, à ton clic |
| `mcp__ccd_window__open_session_in` | ouvrir une session à côté, à ton clic |
| `mcp__ccd_view__show_pane` | ouvrir un fichier dans le volet Fichiers de l'app |

## Ce qui sort de la machine

| Vers | Quand | Ce qui part |
|---|---|---|
| `raw.githubusercontent.com` | quand tu cliques sur Rafraîchir dans le panneau, par `curl` | une simple lecture du `plugin.json` publié dans le dépôt public `bbr21/roadmap-plugin` ; rien de toi n'est envoyé |
| `api.github.com` | la même lecture par `gh`, quand `curl` manque ; et à l'onboarding, la liste des pull requests du projet | ta connexion GitHub CLI, comme pour toute commande `gh` |
| le dépôt distant de ton projet | quand tu coches, rouvres ou édites une tâche dans le panneau | un commit des seuls fichiers de la roadmap, poussé par `git push` vers le `origin` que ton projet a déjà |
| `$.model.complete` | une fois par tâche nouvelle | le libellé de la tâche part à Claude, sur ton compte et par l'app, pour en tirer un titre court ; modèle réglable (« Modèle des titres courts ») |
| `claude.ai` | jamais par le plugin | une adresse affichée dans un message (la page des plugins), que tu ouvres si tu veux |
| `github.com` | jamais par le plugin | le doctor lit l'adresse du dépôt de ton projet pour l'afficher sans `https://github.com/` |

Les autres gestes du module restent dans l'app : `$.prompt.submit` envoie dans ta session le message
d'un bouton du panneau (le brief d'une tâche lancée), `$.prompt.fill` pré-remplit ta saisie sans
l'envoyer, `$.command.run` lance `/compact` quand tu le demandes, `$.ui.copy` copie un texte dans le
presse-papiers à ton clic, `$.config.set` règle une option du plugin (le compte, passé seul en Team quand
le moteur saute les hooks).

## Les fichiers écrits

| Fichier | Écrit par | Quand |
|---|---|---|
| la roadmap du projet : `ROADMAP.md`, `ROADMAP-fait.md`, `ROADMAP-bilans.csv` | `hooks/register.tsx` | quand tu coches, rouvres ou édites une tâche dans le panneau |
| l'état du panneau, dans le stockage du plugin que tient l'app | `hooks/register.tsx` | en continu |
| les vignettes des pièces jointes, dans un dossier privé de `$TMPDIR` | `hooks/register.tsx` | quand une fiche montre une image |
| `~/.claude/reglages-session.json` | `hooks/reglages.tsx` | quand tu changes un réglage de session dans le volet Réglages |
| `~/.claude/locks/heavy-tests/` | `scripts/one-at-a-time.sh` | autour d'une suite de tests lourde |
| la roadmap du projet, après une copie de sauvegarde à côté d'elle | `skills/audit/scripts/audit.py` | quand tu valides un audit, ou une écriture de la skill tasks, qui passe par lui |
| les fichiers que pose l'onboarding dans le projet (`CLAUDE.md`, `docs/`, `roadmap/`, `scripts/`, `.claude/roadmap.json`…) | `skills/onboarding/scripts/onboarding.py` | quand tu lances l'onboarding et valides son plan |
| la roadmap importée, après une copie de sauvegarde | `skills/onboarding/scripts/importer.py` | quand l'onboarding reprend une roadmap existante |

Le module ne modifie jamais ton code : il n'écrit que la roadmap, ses propres réglages et son état.

## Ce que l'onboarding pose dans ton projet

L'onboarding copie des modèles dans ton projet. Ils ne tournent pas dans le plugin : une fois copiés, ce
sont des fichiers de ton projet, que tu lis avant de les committer. Trois sont du code :

- `skills/onboarding/references/modeles/scripts/check.mjs` : le contrôle du projet (liens des docs,
  grammaire de la roadmap, aucun secret suivi), lancé par toi avant un commit ;
- `skills/onboarding/references/modeles/scripts/session-start.sh` : le hook de début de session du projet,
  qui affiche les chantiers en cours ;
- `skills/onboarding/references/modeles/scripts/new-session.sh` : crée la copie de travail d'une session.

Les mêmes interdits valent pour eux : le test les vérifie aussi.

## Trois choses à expliquer

- **Le doctor demande à `gh` son jeton** (`gh auth token`), pour savoir si GitHub CLI est connecté. Il ne
  lit que le code de retour : le jeton n'est ni affiché, ni gardé, ni envoyé.
- **Un dossier Cowork peut déclarer son propre outil d'écriture** (`_cowork/cowork.py`). Le panneau le
  lance alors pour cocher une tâche, avec `python3 -I`. C'est un script de ton dossier, pas du plugin : le
  plugin n'en lance aucun autre.
- **La file des tests lourds modifie certaines commandes Bash.** Quand Claude lance une suite de tests
  lourde (`claude plugin test`, `npm test`, `xcodebuild test`…), le hook place `scripts/one-at-a-time.sh`
  devant et derrière, dans la même commande, pour qu'une seule suite tourne à la fois par projet.
  `ROADMAP_QUEUE=off` le court-circuite.

## Vérifié à chaque version

`tools/securite.py`, lancé par `python3 tools/release.py check` avant chaque publication, lit le code
installé du plugin et le compare à cette page. La publication est refusée si :

- un hook, un programme, un outil de l'app, une adresse, un fichier qui écrit ou un geste sensible manque
  sur la page, ou si la page en annonce un que le code n'a pas ;
- un programme est lancé par un autre fichier que celui que la page nomme, ou d'une façon que le test ne
  sait pas lire ;
- le code utilise `eval`, `new Function`, un `import()` dynamique, `exec`, `os.system`, `shell=True`, ou
  cache une longue chaîne encodée ;
- le plugin gagne un `package.json`, un serveur MCP ou un hook `command`.

`tools/test_securite.py` plante chacun de ces écarts dans un plugin jetable et vérifie qu'il est vu. Un
changement de l'un d'eux doit donc changer le code et cette page ensemble.

## Vérifier que ta copie est une vraie version

Chaque version publie `CHECKSUMS.txt` à la racine du dépôt public : l'empreinte SHA-256 de chaque fichier
installé du plugin. Pour comparer ta copie à la dernière version publiée :

```bash
cd ~/.claude/plugins/cache/roadmap/roadmap/<version>
curl -fsSL https://raw.githubusercontent.com/bbr21/roadmap-plugin/main/CHECKSUMS.txt | grep -v '^#' | shasum -a 256 -c --quiet
```

`<version>` est celle que tu as (`claude plugin list`). Rien ne s'affiche si tout est identique ; sinon,
la commande nomme chaque fichier changé ou manquant. Pour une version plus ancienne, prends le
`CHECKSUMS.txt` du commit « roadmap <version> » du dépôt public. Depuis le dépôt du plugin,
`python3 tools/release.py empreintes <dossier installé>` signale aussi les fichiers en trop.

## Les limites honnêtes

- Claude Code installe un plugin depuis son dépôt, et une mise à jour apporte ce que contient la nouvelle
  version, pour ce plugin comme pour tout autre. Les versions ne sont publiées que par son auteur. Avant
  de mettre à jour, tu peux lire les changements dans l'historique du README du plugin et vérifier la
  nouvelle version par ses empreintes.
- Les skills sont des consignes que suit Claude : ce qu'il fait en les suivant passe par tes réglages de
  permission, comme toute autre tâche. Le texte de ta roadmap part à Claude quand il la lit, sur ton
  compte, comme le reste de ta session.
