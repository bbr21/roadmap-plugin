#!/bin/bash
# La file des tests lourds (#222) : une seule suite lourde à la fois par projet, les autres attendent
# leur tour en le disant. Le hook Bash du plugin (queuedCommand, hooks/parse.ts) place ce script autour
# d'une commande lourde, dans le shell même de l'outil :
#
#   one-at-a-time.sh take <pid> [libellé]   attend son tour, puis prend la place pour <pid>
#   one-at-a-time.sh give <pid>             rend la place de <pid>
#
# <pid> est le shell de l'outil Bash ($$) : il vit tant que la commande tourne. Un verrou dont le PID
# n'existe plus, ou tenu depuis plus de 30 min, se lève seul. Détail : docs/plans/feat-tests-un-par-un/.
# Réglages (tests) : ROADMAP_QUEUE=off, ROADMAP_QUEUE_KEY, ROADMAP_LOCKS_DIR, ROADMAP_QUEUE_POLL (s),
# ROADMAP_QUEUE_SAY (s), ROADMAP_QUEUE_MAX_AGE (s).
set -u

usage() {
  echo "Usage : one-at-a-time.sh take <pid> [libellé] | give <pid>" >&2
  exit 2
}

action="${1:-}"
pid="${2:-}"
label="${3:-}"
[[ "${ROADMAP_QUEUE:-}" == off ]] && exit 0
[[ "$action" == take || "$action" == give ]] || usage
[[ "$pid" =~ ^[0-9]+$ ]] || usage

poll="${ROADMAP_QUEUE_POLL:-2}"
say_every="${ROADMAP_QUEUE_SAY:-30}"
max_age="${ROADMAP_QUEUE_MAX_AGE:-1800}"

# Le projet : le dossier commun du dépôt, partagé par toutes ses copies de travail.
key="${ROADMAP_QUEUE_KEY:-}"
[[ -n "$key" ]] || key="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
[[ -n "$key" ]] || key="$PWD"
dir="${ROADMAP_LOCKS_DIR:-$HOME/.claude/locks}/heavy-tests/$(printf '%s' "$key" | tr -c 'A-Za-z0-9._-' '_')"
lock="$dir/lock"
queue="$dir/queue"
mkdir -p "$queue" || exit 0

alive() { ps -p "$1" >/dev/null 2>&1; }
field() { [[ -f "$1" ]] && sed -n "s/^$2=//p" "$1" | head -1; }
now() { date +%s; }

# « 45 s », « 3 min », « 1 min 30 »
span() {
  local s=$1
  if (( s < 60 )); then echo "$s s"
  elif (( s % 60 == 0 || s >= 600 )); then echo "$(( s / 60 )) min"
  else echo "$(( s / 60 )) min $(( s % 60 ))"
  fi
}

if [[ "$action" == give ]]; then
  [[ "$(field "$lock/owner" pid)" == "$pid" ]] && rm -rf "$lock"
  rm -f "$queue"/*-"$pid"
  exit 0
fi

# Déjà à ce shell : rien à attendre.
[[ "$(field "$lock/owner" pid)" == "$pid" ]] && exit 0

branch="$(git branch --show-current 2>/dev/null)"
[[ -n "$branch" ]] || branch="$(basename "$PWD")"
ticket_name="$(perl -MTime::HiRes=time -e 'printf "%017.6f", time')-$pid"
ticket="$queue/$ticket_name"
printf 'pid=%s\nsince=%s\nbranch=%s\nlabel=%s\n' "$pid" "$(now)" "$branch" "$label" > "$ticket"
trap 'rm -f "$ticket"' EXIT
trap 'exit 143' TERM INT HUP

# Un verrou mort se lève : son PID n'existe plus, ou il est tenu depuis trop longtemps. Un verrou sans
# owner est en train d'être pris ; vieux de plus de 10 s, il est abandonné.
lift_stale() {
  [[ -d "$lock" ]] || return 0
  local opid since reason=""
  opid="$(field "$lock/owner" pid)"
  since="$(field "$lock/owner" since)"
  if [[ -z "$opid" ]]; then
    local made
    made="$(stat -f %m "$lock" 2>/dev/null || stat -c %Y "$lock" 2>/dev/null || now)"
    (( $(now) - made > 10 )) && reason="pris sans propriétaire"
  elif ! alive "$opid"; then
    reason="PID $opid absent"
  elif (( $(now) - ${since:-0} > max_age )); then
    reason="tenu depuis plus de $(span "$max_age")"
  fi
  [[ -n "$reason" ]] || return 0
  rm -rf "$lock"
  echo "roadmap : verrou des tests lourds levé ($reason)."
}

start="$(now)"
say_polls="$(awk -v s="$say_every" -v p="$poll" 'BEGIN { n = int(s / p + 0.999); print (n < 1 ? 1 : n) }')"
polls=0
said=0
while :; do
  # Les tickets des sessions mortes s'effacent ; la tête de file seule lève un verrou mort et prend la place.
  for t in "$queue"/*; do
    [[ -f "$t" && "$t" != "$ticket" ]] || continue
    alive "$(field "$t" pid)" || rm -f "$t"
  done
  head_name="$(ls "$queue" 2>/dev/null | sort | head -1)"
  if [[ "$head_name" == "$ticket_name" ]]; then
    lift_stale
    if mkdir "$lock" 2>/dev/null; then
      cp "$ticket" "$lock/owner.tmp" && sed -i '' "s/^since=.*/since=$(now)/" "$lock/owner.tmp" 2>/dev/null
      mv "$lock/owner.tmp" "$lock/owner"
      rm -f "$ticket"
      trap - EXIT
      (( said )) && echo "roadmap : tests lourds, à ton tour après $(span $(( $(now) - start )))."
      exit 0
    fi
  fi
  if (( polls % say_polls == 0 )); then
    ahead="$(ls "$queue" 2>/dev/null | sort | awk -v me="$ticket_name" '$0 < me' | wc -l | tr -d ' ')"
    obranch="$(field "$lock/owner" branch)"
    olabel="$(field "$lock/owner" label)"
    osince="$(field "$lock/owner" since)"
    if [[ -n "$obranch" ]]; then
      behind="derrière $obranch${olabel:+ ($olabel)} depuis $(span $(( $(now) - ${osince:-$(now)} )))"
    else
      behind="derrière une autre session"
    fi
    echo "roadmap : tests lourds en file depuis $(span $(( $(now) - start ))), $behind, $ahead devant."
    said=1
  fi
  polls=$(( polls + 1 ))
  sleep "$poll"
done
