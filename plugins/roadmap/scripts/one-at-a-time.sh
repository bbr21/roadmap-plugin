#!/bin/bash
# La file des tests lourds (#222, #323) : une seule file pour tout le Mac, avec N places (une par défaut),
# des voies de priorité et un renice ; les suites qui attendent le disent. Le hook Bash du plugin (queuedCommand, hooks/parse.ts) place ce script autour
# d'une commande lourde, dans le shell même de l'outil :
#
#   one-at-a-time.sh take <pid> [libellé]   attend son tour, puis prend la place pour <pid>
#   one-at-a-time.sh give <pid>             rend la place de <pid>
#
# <pid> est le shell de l'outil Bash ($$) : il vit tant que la commande tourne. Un verrou dont le PID
# n'existe plus, ou tenu depuis plus de 30 min, se lève seul. Détail : docs/plans/feat-tests-un-par-un/.
#
# Sa place prise, la suite attend encore que la charge du Mac retombe sous le seuil, 5 min au plus (#249) :
# la file ne sérialise que les suites d'un projet, et le délai de 5000 ms par test du kit tombe sous charge.
# Détail : docs/plans/fix-tests-sous-charge/.
# Elle attend de même que la mémoire se détende (#403) : moins de 5 % libres (memory_pressure -Q), ou swap
# à 90 % et plus avec moins de 10 % libres (le swap seul, qui reste haut des heures, ne retient rien) ; la
# raison dite et écrite (`why=` de <place>/load) est la vraie, jamais « charge » pour la mémoire.
# Une attente dont le shell n'a plus de session (ppid 1, #403) quitte la file et arrête ce shell.
#
# Une file pour le Mac (#323) : dossier heavy-tests/<ROADMAP_QUEUE_KEY>, `mac` par défaut. Places `lock`,
# `lock-2`… `lock-N` (ROADMAP_QUEUE_SLOTS, 1 par défaut). Voies : 0 prioritaire (branche `main` du dossier du
# shell), 1, 2 ordinaire ; ROADMAP_QUEUE_LANE force la voie. Un ticket s'appelle <voie>-<horodatage>-<pid> : la
# tête de la liste triée prend la première place libre, sans jamais en chasser un qui tourne. La suite prend
# un nice (ROADMAP_QUEUE_NICE, 10 par défaut, 0 le saute) dès que sa place est prise.
# Branche testée : ROADMAP_QUEUE_FOR, sinon la branche de ROADMAP_QUEUE_DIR, sinon celle du dossier du shell ;
# ROADMAP_QUEUE_BY=maestro marque la suite lancée par Maestro.
# Réglages (tests) : ROADMAP_QUEUE=off, ROADMAP_QUEUE_KEY, ROADMAP_LOCKS_DIR, ROADMAP_QUEUE_POLL (s),
# ROADMAP_QUEUE_SAY (s), ROADMAP_QUEUE_MAX_AGE (s), ROADMAP_QUEUE_MAX_LOAD (défaut 2 × cœurs),
# ROADMAP_QUEUE_LOAD_WAIT (s, défaut 300, 0 coupe l'attente, mémoire comprise), ROADMAP_QUEUE_LOAD_FILE (la charge lue
# dans un fichier, pour les tests), ROADMAP_QUEUE_MIN_FREE (%, défaut 5), ROADMAP_QUEUE_MEM_FILE (`free=` et `swap=`,
# en %, lus dans un fichier, pour les tests).
# Ce que le panneau lit (#321, #323) : <place>/owner (pid, since, branch, label, project, lane, by, run une fois
# la suite partie), <place>/load pendant l'attente de charge, queue/<voie>-<horodatage>-<pid>. Détail : docs/plans/feat-file-tests-visible/.
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

# La file du Mac : une clé unique, sauf réglage (tests).
key="$(printf '%s' "${ROADMAP_QUEUE_KEY:-mac}" | tr -c 'A-Za-z0-9._-' '_')"
dir="${ROADMAP_LOCKS_DIR:-$HOME/.claude/locks}/heavy-tests/$key"
queue="$dir/queue"
slots="${ROADMAP_QUEUE_SLOTS:-1}"
[[ "$slots" =~ ^[0-9]+$ ]] && (( slots >= 1 )) || slots=1
mkdir -p "$queue" || exit 0

# Les places : lock, lock-2, … lock-N.
place_path() { if (( $1 == 1 )); then echo "$dir/lock"; else echo "$dir/lock-$1"; fi; }

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

# Toutes les places présentes, quel que soit le nombre réglé : un réglage changé entre take et give ne perd pas la sienne.
all_places() { for p in "$dir"/lock "$dir"/lock-*; do [[ -d "$p" ]] && echo "$p"; done; }

if [[ "$action" == give ]]; then
  for p in $(all_places); do
    [[ "$(field "$p/owner" pid)" == "$pid" ]] && rm -rf "$p"
  done
  rm -f "$queue"/*-"$pid"
  exit 0
fi

# Déjà à ce shell : rien à attendre, sur aucune place.
for p in $(all_places); do
  [[ "$(field "$p/owner" pid)" == "$pid" ]] && exit 0
done

# La branche testée : celle qu'on dit, sinon celle du dossier à tester, sinon celle du dossier du shell.
shell_branch="$(git branch --show-current 2>/dev/null)"
branch="${ROADMAP_QUEUE_FOR:-}"
if [[ -z "$branch" && -n "${ROADMAP_QUEUE_DIR:-}" ]]; then
  # Le crochet passe le dossier tel que la commande l'écrit, quoté : un ~ en tête se développe ici.
  tested="${ROADMAP_QUEUE_DIR/#\~/$HOME}"
  branch="$(cd "$tested" 2>/dev/null && git branch --show-current 2>/dev/null)"
fi
[[ -n "$branch" ]] || branch="$shell_branch"
[[ -n "$branch" ]] || branch="$(basename "$PWD")"

# Le projet : le dossier principal du dépôt, partagé par toutes ses copies de travail.
project=""
common="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
[[ -n "$common" ]] && project="$(basename "$(dirname "$common")")"
[[ -n "$project" ]] || project="$(basename "$PWD")"

# La voie : 0 prioritaire pour main, 2 ordinaire ; ROADMAP_QUEUE_LANE la force.
lane="${ROADMAP_QUEUE_LANE:-}"
if [[ ! "$lane" =~ ^[012]$ ]]; then
  [[ "$shell_branch" == main ]] && lane=0 || lane=2
fi

ticket_name="$lane-$(perl -MTime::HiRes=time -e 'printf "%017.6f", time')-$pid"
ticket="$queue/$ticket_name"
{
  printf 'pid=%s\nsince=%s\nbranch=%s\nlabel=%s\nproject=%s\nlane=%s\n' "$pid" "$(now)" "$branch" "$label" "$project" "$lane"
  [[ "${ROADMAP_QUEUE_BY:-}" == maestro ]] && printf 'by=maestro\n'
} > "$ticket"
trap 'rm -f "$ticket"' EXIT
trap 'exit 143' TERM INT HUP

# Un verrou mort se lève : son PID n'existe plus, ou il est tenu depuis trop longtemps. Un verrou sans
# owner est en train d'être pris ; vieux de plus de 10 s, il est abandonné.
lift_stale() {
  local lock="$1"
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

# La charge du Mac sur 1 min, arrondie ; vide si illisible.
load_now() {
  local raw=""
  if [[ -n "${ROADMAP_QUEUE_LOAD_FILE:-}" ]]; then
    raw="$(awk '{ print $1; exit }' "$ROADMAP_QUEUE_LOAD_FILE" 2>/dev/null)"
  elif raw="$(sysctl -n vm.loadavg 2>/dev/null)" && [[ -n "$raw" ]]; then
    raw="$(printf '%s' "$raw" | tr -d '{}' | awk '{ print $1 }')"
  elif [[ -r /proc/loadavg ]]; then
    raw="$(awk '{ print $1 }' /proc/loadavg)"
  fi
  [[ "$raw" =~ ^[0-9]+([.][0-9]+)?$ ]] && awk -v l="$raw" 'BEGIN { printf "%d", l + 0.5 }'
}

cores() {
  local n
  n="$(sysctl -n hw.ncpu 2>/dev/null || getconf _NPROCESSORS_ONLN 2>/dev/null)"
  [[ "$n" =~ ^[0-9]+$ && "$n" -gt 0 ]] && echo "$n" || echo 4
}

# La mémoire du Mac (#403) : « <libre %> <swap %> », arrondis ; vide si illisible (rien n'attend alors la mémoire).
mem_now() {
  local free="" swap=""
  if [[ -n "${ROADMAP_QUEUE_MEM_FILE:-}" ]]; then
    free="$(field "$ROADMAP_QUEUE_MEM_FILE" free)"
    swap="$(field "$ROADMAP_QUEUE_MEM_FILE" swap)"
  else
    free="$(memory_pressure -Q 2>/dev/null | sed -n 's/.*free percentage: *\([0-9][0-9]*\)%.*/\1/p' | head -1)"
    # « total = 8192.00M  used = 7105.44M  free = 1086.56M  (encrypted) »
    swap="$(sysctl -n vm.swapusage 2>/dev/null | awk '{ t = $3; u = $6; sub(/[A-Za-z]+$/, "", t); sub(/[A-Za-z]+$/, "", u); if (t + 0 > 0) printf "%d", u * 100 / t + 0.5; else print 0 }')"
  fi
  [[ "$free" =~ ^[0-9]+$ ]] || return 0
  [[ "$swap" =~ ^[0-9]+$ ]] || swap=0
  echo "$free $swap"
}

# Tendue (#403) : moins de min_free % libres, ou swap à 90 % et plus avec moins de 10 % libres.
mem_tense() {
  local min_free="${ROADMAP_QUEUE_MIN_FREE:-5}"
  [[ "$min_free" =~ ^[0-9]+$ ]] || min_free=5
  (( $1 < min_free || ($2 >= 90 && $1 < 10) ))
}

# Ce que le panneau lit pendant l'attente (#321, #403) : lock/load, réécrit à chaque relevé, ôté au départ ;
# `why=load` ou `why=memory` (avec `free=` et `swap=`). Écriture atomique (.tmp puis mv) : le panneau ne lit
# jamais un fichier à moitié écrit.
put_load() {
  { printf 'load=%s\ncores=%s\nmax=%s\nsince=%s\nwhy=%s\n' "$1" "$2" "$3" "$4" "$5"
    if [[ "$5" == memory ]]; then printf 'free=%s\nswap=%s\n' "$6" "$7"; fi
  } > "$lock/load.tmp" 2>/dev/null && mv -f "$lock/load.tmp" "$lock/load" 2>/dev/null
}

# Le shell de l'outil n'a plus de session (#403) : son parent est mort, launchd (1) l'a recueilli.
orphaned() { [[ "$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')" == 1 ]]; }

# La suite part (#321) : `run=` s'ajoute au propriétaire, que le panneau lit pour dire depuis quand elle tourne.
mark_run() {
  rm -f "$lock/load"
  local owner
  owner="$(< "$lock/owner")" 2>/dev/null || return 0
  printf '%s\nrun=%s\n' "$owner" "$(now)" > "$lock/owner.tmp" 2>/dev/null && mv -f "$lock/owner.tmp" "$lock/owner" 2>/dev/null
  return 0
}

# Place prise : attendre que la mémoire se détende (#403) et que la charge passe sous le seuil (#249), au plus
# load_wait secondes en tout, en disant la vraie raison ; la mémoire passe devant la charge.
wait_for_calm() {
  local ncpu max wait_max load mem free swap why began polls=0 said=""
  ncpu="$(cores)"
  max="${ROADMAP_QUEUE_MAX_LOAD:-}"
  [[ "$max" =~ ^[0-9]+$ ]] || max=$(( 2 * ncpu ))
  wait_max="${ROADMAP_QUEUE_LOAD_WAIT:-300}"
  [[ "$wait_max" =~ ^[0-9]+$ ]] || wait_max=300
  (( wait_max > 0 )) || return 0
  began="$(now)"
  while :; do
    load="$(load_now)"
    mem="$(mem_now)"
    free="${mem%% *}" swap="${mem##* }"
    why=""
    if [[ -n "$mem" ]] && mem_tense "$free" "$swap"; then why=memory
    elif [[ -n "$load" ]] && (( load > max )); then why=load
    fi
    [[ -n "$why" ]] || break
    put_load "${load:-0}" "$ncpu" "$max" "$began" "$why" "$free" "$swap"
    if (( $(now) - began >= wait_max )); then
      if [[ "$why" == memory ]]; then
        echo "roadmap : la mémoire du Mac reste tendue ($free % libres, swap $swap %) après $(span $(( $(now) - began ))) : tests lourds lancés quand même."
      else
        echo "roadmap : le Mac reste chargé (charge $load) après $(span $(( $(now) - began ))) : tests lourds lancés quand même ; un « timed out after 5000 ms » vient sans doute de la charge, le test se rejoue seul."
      fi
      return 0
    fi
    if (( polls % say_polls == 0 )) || [[ "$why" != "$said" ]]; then
      if [[ "$why" == memory ]]; then
        echo "roadmap : la mémoire du Mac est tendue ($free % libres, swap $swap %), tests lourds en attente depuis $(span $(( $(now) - began )))."
      else
        echo "roadmap : le Mac est chargé (charge $load pour $ncpu cœurs, seuil $max), tests lourds en attente depuis $(span $(( $(now) - began )))."
      fi
      said="$why"
    fi
    polls=$(( polls + 1 ))
    sleep "$poll"
  done
  if [[ "$said" == memory ]]; then
    echo "roadmap : la mémoire s'est détendue (${free:-?} % libres), tests lourds lancés après $(span $(( $(now) - began )))."
  elif [[ "$said" == load ]]; then
    echo "roadmap : la charge est retombée (${load:-?}), tests lourds lancés après $(span $(( $(now) - began )))."
  fi
  return 0
}

lock=""  # la place prise, posée dans la boucle
start="$(now)"
say_polls="$(awk -v s="$say_every" -v p="$poll" 'BEGIN { n = int(s / p + 0.999); print (n < 1 ? 1 : n) }')"
polls=0
said=0
while :; do
  # Plus de session derrière ce shell (#403) : son attente quitte la file, et le shell s'arrête avant de lancer la suite.
  if orphaned; then
    echo "roadmap : le shell $pid n'a plus de session (ppid 1) : son attente quitte la file des tests lourds, et il s'arrête."
    rm -f "$ticket"
    kill -TERM "$pid" 2>/dev/null
    exit 0
  fi
  # Les tickets des sessions mortes s'effacent ; la tête de file seule lève un verrou mort et prend la place.
  for t in "$queue"/*; do
    [[ -f "$t" && "$t" != "$ticket" ]] || continue
    alive "$(field "$t" pid)" || rm -f "$t"
  done
  head_name="$(ls "$queue" 2>/dev/null | sort | head -1)"
  if [[ "$head_name" == "$ticket_name" ]]; then
    for i in $(seq 1 "$slots"); do
      lock="$(place_path "$i")"
      lift_stale "$lock"
      if mkdir "$lock" 2>/dev/null; then
        cp "$ticket" "$lock/owner.tmp" && sed -i '' "s/^since=.*/since=$(now)/" "$lock/owner.tmp" 2>/dev/null
        mv "$lock/owner.tmp" "$lock/owner"
        rm -f "$ticket"
        trap - EXIT
        (( said )) && echo "roadmap : tests lourds, à ton tour après $(span $(( $(now) - start )))."
        # Le nice de la suite (#323) : elle cède le processeur aux sessions qui travaillent.
        nice="${ROADMAP_QUEUE_NICE:-10}"
        [[ "$nice" =~ ^[0-9]+$ ]] || nice=10
        (( nice > 0 )) && renice -n "$nice" -p "$pid" >/dev/null 2>&1
        wait_for_calm
        mark_run
        exit 0
      fi
    done
    lock=""
  fi
  if (( polls % say_polls == 0 )); then
    ahead="$(ls "$queue" 2>/dev/null | sort | awk -v me="$ticket_name" '$0 < me' | wc -l | tr -d ' ')"
    # Le titulaire à nommer : la première place occupée.
    obranch="" olabel="" osince="" oproject=""
    for i in $(seq 1 "$slots"); do
      op="$(place_path "$i")/owner"
      [[ -f "$op" ]] || continue
      obranch="$(field "$op" branch)"; olabel="$(field "$op" label)"
      osince="$(field "$op" since)"; oproject="$(field "$op" project)"
      break
    done
    if [[ -n "$obranch" ]]; then
      [[ -n "$oproject" && "$oproject" != "$project" ]] && obranch="$oproject · $obranch"
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
