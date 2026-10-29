#!/usr/bin/env bash
# Prépare la copie de travail d'une session parallèle (règles : CLAUDE.md, « Travailler en parallèle »).
#
#   scripts/new-session.sh [--plan] feat/export "Export CSV"
#       crée le worktree ../<Projet>-feat-export sur la branche feat/export, partie de main,
#       et y relie le .env du dossier principal s'il en a un.
#   scripts/new-session.sh --here [--plan] feat/export "Export CSV"
#       pour une session déjà lancée dans un worktree créé par l'app : relie .env (et crée le plan).
#       La branche de l'app garde son nom ; c'est elle qui va dans {{RM}}ROADMAP.md.
#
#   --plan : crée aussi docs/plans/<type>-<slug>/spec.md et plan.md à partir du modèle.
set -euo pipefail

usage() {
  echo "Usage : scripts/new-session.sh [--here] [--plan] <feat|fix|spike|docs>/<slug> \"<titre>\"" >&2
  exit 2
}

here=0
plan=0
while [[ "${1:-}" == --* ]]; do
  case "$1" in
    --here) here=1 ;;
    --plan) plan=1 ;;
    *) usage ;;
  esac
  shift
done

branch="${1:-}"
title="${2:-}"
[[ -n "$branch" && -n "$title" ]] || usage
[[ "$branch" =~ ^(feat|fix|spike|docs)/[a-z0-9][a-z0-9-]*$ ]] || {
  echo "Branche invalide : « $branch ». Préfixe feat/, fix/, spike/ ou docs/, puis minuscules, chiffres et tirets." >&2
  exit 2
}
[[ "$title" != *'"'* ]] || { echo "Le titre ne doit pas contenir de guillemet droit (\")." >&2; exit 2; }

type="${branch%%/*}"
slug="${branch#*/}"
plan_slug="${type}-${slug}"

# Toujours le dépôt de ce script, quel que soit le dossier d'où il est lancé.
cd "$(dirname "$0")/.."
# Le dossier principal est le premier worktree listé.
main_dir="$(git worktree list --porcelain | awk 'NR==1 && $1=="worktree" { sub(/^worktree /, ""); print; exit }')"
[[ -n "$main_dir" && -d "$main_dir" ]] || { echo "Dossier principal introuvable." >&2; exit 1; }

if (( ! here )) && git -C "$main_dir" show-ref --verify --quiet "refs/heads/$branch"; then
  echo "La branche $branch existe déjà. Son worktree : git worktree list" >&2
  exit 1
fi

if (( plan )); then
  if (( here )); then
    [[ -f docs/plans/_template/spec.md ]] || { echo "Modèle docs/plans/_template absent de ce worktree : faire git rebase main d'abord." >&2; exit 1; }
  else
    git -C "$main_dir" cat-file -e main:docs/plans/_template/spec.md 2>/dev/null \
      || { echo "Modèle docs/plans/_template absent de main." >&2; exit 1; }
  fi
fi

if (( here )); then
  dir="$(git rev-parse --show-toplevel)"
  [[ "$dir" != "$main_dir" ]] || { echo "--here sert dans un worktree, pas dans le dossier principal." >&2; exit 1; }
  # Ne pas renommer la branche : l'app suit son worktree par ce nom.
  branch="$(git branch --show-current)"
else
  dir="$(dirname "$main_dir")/$(basename "$main_dir")-${plan_slug}"
  [[ ! -e "$dir" ]] || { echo "Le dossier $dir existe déjà." >&2; exit 1; }
  git -C "$main_dir" worktree add --quiet "$dir" -b "$branch" main
  # En cas d'échec plus loin, ne rien laisser derrière soi.
  trap 'git -C "$main_dir" worktree remove --force "$dir" 2>/dev/null; git -C "$main_dir" branch -D "$branch" >/dev/null 2>&1; echo "Échec : worktree et branche retirés." >&2' ERR
fi

# Le .env n'est pas versionné : sans ce lien, les tests qui en ont besoin n'ont pas leurs variables.
if [[ -e "$dir/.env" ]]; then
  :
elif [[ -f "$main_dir/.env" ]]; then
  ln -s "$main_dir/.env" "$dir/.env"
elif [[ -f "$main_dir/.env.example" ]]; then
  echo "Attention : pas de .env dans $main_dir (voir .env.example)." >&2
fi

plan_dir="$dir/docs/plans/$plan_slug"
if (( plan )); then
  if [[ -d "$plan_dir" ]]; then
    echo "docs/plans/$plan_slug existe déjà : gardé tel quel."
  else
    mkdir -p "$plan_dir"
    for f in spec.md plan.md; do
      TITLE="$title" BRANCH="$branch" TODAY="$(date +%F)" perl -pe '
        s{^branch: .*}{branch: $ENV{BRANCH}};
        s{^created: .*}{created: $ENV{TODAY}};
        s{<Titre>}{$ENV{TITLE}}g;
      ' "$dir/docs/plans/_template/$f" > "$plan_dir/$f"
    done
  fi
fi
trap - ERR

cat <<EOF
Prêt : $dir, branche $branch.
$( (( plan )) && echo "Plan : docs/plans/$plan_slug/spec.md et plan.md, à committer ou à supprimer s'ils ne servent pas." )

1. Si ce n'est pas déjà fait : dans $main_dir/{{RM}}ROADMAP.md, mettre la ligne dans « En cours »
   avec qui:$branch et branche:$branch, puis git -C "$main_dir" commit {{RM}}ROADMAP.md -m "roadmap: take $slug"
2. Travailler uniquement dans $dir (chemins absolus, ou changer le dossier de la session).
3. Fusionner : git rebase main, tests, puis git -C "$main_dir" merge --ff-only $branch
   Puis fermer la ligne dans $main_dir ({{RM}}ROADMAP.md vers ROADMAP-fait.md, fait:AAAA-MM-JJ, bilan dans ROADMAP-bilans.csv) et la committer.
EOF
if (( here )); then
  echo "4. Ce worktree appartient à l'app : ne pas le supprimer soi-même."
else
  echo "4. Nettoyer : git -C \"$main_dir\" worktree remove \"$dir\" && git -C \"$main_dir\" branch -d $branch"
fi
