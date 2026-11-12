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
# Sa place prise, la suite attend encore que la charge du Mac retombe sous le seuil, 3 min au plus (#249, #521) :
# la file ne sérialise que les suites d'un projet, et le délai de 5000 ms par test du kit tombe sous charge.
# Détail : docs/plans/fix-tests-sous-charge/.
# Elle attend de même que la mémoire se détende (#403) : moins de 5 % libres (memory_pressure -Q), ou swap
# à 90 % et plus avec moins de 10 % libres (le swap seul, qui reste haut des heures, ne retient rien) ; la
# raison dite et écrite (`why=` de <place>/load) est la vraie, jamais « charge » pour la mémoire.
# Une attente dont le shell n'a plus de session (ppid 1, #403) quitte la file et arrête ce shell ; un shell
# mort (PID absent) quitte la file de même, et rend sa place s'il l'a déjà prise (#521).
# Plafond de 180 s ; et si la charge est trop haute mais ne baisse plus (1 min >= 5 min), la suite part tout
# de suite en le disant. Charge sur 5 min illisible : attente jusqu'au plafond, comme avant.
#
# Une file pour le Mac (#323) : dossier heavy-tests/<ROADMAP_QUEUE_KEY>, `mac` par défaut. Places `lock`,
# `lock-2`… `lock-N` (ROADMAP_QUEUE_SLOTS, 1 par défaut). Voies : 0 prioritaire (branche `main` du dossier du
# shell), 1, 2 ordinaire ; ROADMAP_QUEUE_LANE force la voie. Un ticket s'appelle <voie>-<horodatage>-<pid> : la
# tête de la liste triée prend la première place libre, sans jamais en chasser un qui tourne. Place rapide
# `lock-0` (#521) : réservée à la voie 1 (tests ciblés), que prend le premier ticket de voie 1 même s'il n'est
# pas en tête, pour qu'il parte pendant une suite entière ; ROADMAP_QUEUE_FAST=0 la coupe. La suite prend
# un nice (ROADMAP_QUEUE_NICE, 10 par défaut, 0 le saute) dès que sa place est prise.
# Branche testée : ROADMAP_QUEUE_FOR, sinon la branche de ROADMAP_QUEUE_DIR, sinon celle du dossier du shell ;
# ROADMAP_QUEUE_BY=maestro marque la suite lancée par Maestro.
# Réglages (tests) : ROADMAP_QUEUE=off, ROADMAP_QUEUE_KEY, ROADMAP_LOCKS_DIR, ROADMAP_QUEUE_POLL (s),
# ROADMAP_QUEUE_SAY (s), ROADMAP_QUEUE_MAX_AGE (s), ROADMAP_QUEUE_MAX_LOAD (défaut 2 × cœurs),
# ROADMAP_QUEUE_IDLE_POLL (s, défaut 5 : sondage d'un ticket qui ne peut prendre aucune place),
# ROADMAP_QUEUE_LOAD_WAIT (s, défaut 180, 0 coupe l'attente, mémoire comprise), ROADMAP_QUEUE_LOAD_FILE (la charge lue
# dans un fichier, pour les tests), ROADMAP_QUEUE_MIN_FREE (%, défaut 5), ROADMAP_QUEUE_MEM_FILE (`free=` et `swap=`,
# en %, lus dans un fichier, pour les tests).
# Ce que le panneau lit (#321, #323) : <place>/owner (pid, since, branch, label, project, lane, by, run une fois
# la suite partie), <place>/load pendant l'attente de charge (avec `cap=`, le plafond), queue/<voie>-<horodatage>-<pid>. Détail : docs/plans/feat-file-tests-visible/.
# Historique (#521) : give ajoute une ligne par suite à <file>/history.tsv (en-tête écrit à la création, 4000
# dernières lignes gardées au-delà de 5000) ; owner porte wait= et calm= avec run=. Au take, les dossiers de
# file d'avant #323 sans suite vivante ni history.tsv sont ôtés. Détail : docs/plans/feat-perf-voie-rapide-des-tests/.
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
idle_poll="${ROADMAP_QUEUE_IDLE_POLL:-5}"
say_every="${ROADMAP_QUEUE_SAY:-30}"
max_age="${ROADMAP_QUEUE_MAX_AGE:-1800}"

# La file du Mac : une clé unique, sauf réglage (tests).
key="$(printf '%s' "${ROADMAP_QUEUE_KEY:-mac}" | tr -c 'A-Za-z0-9._-' '_')"
dir="${ROADMAP_LOCKS_DIR:-$HOME/.claude/locks}/heavy-tests/$key"
queue="$dir/queue"
fast_place="$dir/lock-0"
fast=1
[[ "${ROADMAP_QUEUE_FAST:-}" == 0 ]] && fast=0
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

# Un champ de l'historique tient sur une ligne et sans tabulation.
clean() { local v="$1"; v="${v//$'\t'/ }"; v="${v//$'\r'/ }"; v="${v//$'\n'/ }"; printf '%s' "$v"; }

# Une ligne par suite dans history.tsv (#521) : fin attente calme duree voie place branche projet commande.
history_add() {
  local p="$1" hist="$dir/history.tsv" n t run since wait calm lane_h dur
  t="$(now)"
  run="$(field "$p/owner" run)"; since="$(field "$p/owner" since)"
  wait="$(field "$p/owner" wait)"; calm="$(field "$p/owner" calm)"; lane_h="$(field "$p/owner" lane)"
  [[ "$wait" =~ ^[0-9]+$ ]] || wait=0
  [[ "$calm" =~ ^[0-9]+$ ]] || calm=0
  [[ "$run" =~ ^[0-9]+$ ]] || run="$since"
  [[ "$run" =~ ^[0-9]+$ ]] || run="$t"
  dur=$(( t - run )); (( dur < 0 )) && dur=0
  [[ -f "$hist" ]] || printf 'fin\tattente\tcalme\tduree\tvoie\tplace\tbranche\tprojet\tcommande\n' > "$hist" 2>/dev/null || return 0
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$t" "$wait" "$calm" "$dur" "$(clean "$lane_h")" "$(basename "$p")" \
    "$(clean "$(field "$p/owner" branch)")" "$(clean "$(field "$p/owner" project)")" "$(clean "$(field "$p/owner" label)")" >> "$hist" 2>/dev/null
  n="$(wc -l < "$hist" 2>/dev/null | tr -d ' ')"
  if [[ "$n" =~ ^[0-9]+$ ]] && (( n > 5001 )); then
    awk -v keep=4000 'NR == 1 { h = $0; next } { buf[NR] = $0 } END { print h; s = NR - keep + 1; if (s < 2) s = 2; for (i = s; i <= NR; i++) print buf[i] }' "$hist" > "$hist.tmp" 2>/dev/null \
      && mv -f "$hist.tmp" "$hist" 2>/dev/null
  fi
  return 0
}

if [[ "$action" == give ]]; then
  for p in $(all_places); do
    if [[ "$(field "$p/owner" pid)" == "$pid" ]]; then
      history_add "$p"
      rm -rf "$p"
    fi
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

# Le ménage d'avant #323 (#521) : un dossier frère sans history.tsv, sans place ni ticket d'un PID vivant, s'ôte.
sweep_old_queues() {
  local d p t o keep
  for d in "$(dirname "$dir")"/*/; do
    d="${d%/}"
    [[ -d "$d" && "$d" != "$dir" && ! -f "$d/history.tsv" ]] || continue
    keep=0
    for p in "$d"/lock "$d"/lock-*; do
      [[ -f "$p/owner" ]] || continue
      o="$(field "$p/owner" pid)"
      [[ -n "$o" ]] && alive "$o" && keep=1
    done
    for t in "$d"/queue/*; do
      [[ -f "$t" ]] || continue
      o="$(field "$t" pid)"
      [[ -n "$o" ]] && alive "$o" && keep=1
    done
    (( keep )) || rm -rf "$d"
  done
  return 0
}
sweep_old_queues

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
    # GNU d'abord : sous Linux, `stat -f` lit le système de fichiers et rend « File: … » (CI #407).
    made="$(stat -c %Y "$lock" 2>/dev/null || stat -f %m "$lock" 2>/dev/null || now)"
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

# La charge du Mac (#521) : pose `load` (1 min, arrondie ; vide si illisible) et `falling` (1 si la charge sur
# 5 min est lisible et la 1 min en dessous, 0 si lisible et 1 min >= 5 min, vide si illisible), en un awk.
load=""
falling=""
read_load() {
  local raw="" out=""
  if [[ -n "${ROADMAP_QUEUE_LOAD_FILE:-}" ]]; then
    raw="$(awk 'NR == 1 { print $1, $2; exit }' "$ROADMAP_QUEUE_LOAD_FILE" 2>/dev/null)"
  elif raw="$(sysctl -n vm.loadavg 2>/dev/null)" && [[ -n "$raw" ]]; then
    raw="$(printf '%s' "$raw" | tr -d '{}' | awk '{ print $1, $2 }')"
  elif [[ -r /proc/loadavg ]]; then
    raw="$(awk '{ print $1, $2 }' /proc/loadavg)"
  fi
  out="$(printf '%s\n' "$raw" | awk '{
    if ($1 !~ /^[0-9]+([.][0-9]+)?$/) exit
    printf "%d ", $1 + 0.5
    if ($2 ~ /^[0-9]+([.][0-9]+)?$/) printf "%d", ($1 + 0 < $2 + 0) ? 1 : 0
  }')"
  load="${out%% *}"
  falling="${out#* }"
  [[ "$out" == *" "* ]] || falling=""
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
    printf 'cap=%s\n' "$8"
  } > "$lock/load.tmp" 2>/dev/null && mv -f "$lock/load.tmp" "$lock/load" 2>/dev/null
}

# Le shell de l'outil n'a plus de session (#403) : son parent est mort, launchd (1) l'a recueilli.
orphaned() { [[ "$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ')" == 1 ]]; }

# La suite part (#321) : `run=` s'ajoute au propriétaire, que le panneau lit pour dire depuis quand elle tourne.
mark_run() {
  rm -f "$lock/load"
  local owner
  owner="$(< "$lock/owner")" 2>/dev/null || return 0
  printf '%s\nrun=%s\nwait=%s\ncalm=%s\n' "$owner" "$(now)" "$(( taken_at - start ))" "$calm_secs" > "$lock/owner.tmp" 2>/dev/null && mv -f "$lock/owner.tmp" "$lock/owner" 2>/dev/null
  return 0
}

# Place prise : attendre que la mémoire se détende (#403) et que la charge passe sous le seuil (#249), au plus
# load_wait secondes en tout, en disant la vraie raison ; la mémoire passe devant la charge.
wait_for_calm() {
  local ncpu max wait_max mem free swap why began polls=0 said=""
  calm_secs=0
  ncpu="$(cores)"
  max="${ROADMAP_QUEUE_MAX_LOAD:-}"
  [[ "$max" =~ ^[0-9]+$ ]] || max=$(( 2 * ncpu ))
  wait_max="${ROADMAP_QUEUE_LOAD_WAIT:-180}"
  [[ "$wait_max" =~ ^[0-9]+$ ]] || wait_max=180
  (( wait_max > 0 )) || return 0
  began="$(now)"
  while :; do
    read_load
    mem="$(mem_now)"
    free="${mem%% *}" swap="${mem##* }"
    why=""
    if [[ -n "$mem" ]] && mem_tense "$free" "$swap"; then why=memory
    elif [[ -n "$load" ]] && (( load > max )); then why=load
    fi
    [[ -n "$why" ]] || break
    put_load "${load:-0}" "$ncpu" "$max" "$began" "$why" "$free" "$swap" "$wait_max"
    if [[ "$why" == load && "$falling" == 0 ]]; then
      echo "roadmap : la charge du Mac ne baisse plus (charge $load) : tests lourds lancés sans attendre davantage."
      calm_secs=$(( $(now) - began ))
      return 0
    fi
    if (( $(now) - began >= wait_max )); then
      if [[ "$why" == memory ]]; then
        echo "roadmap : la mémoire du Mac reste tendue ($free % libres, swap $swap %) après $(span $(( $(now) - began ))) : tests lourds lancés quand même."
      else
        echo "roadmap : le Mac reste chargé (charge $load) après $(span $(( $(now) - began ))) : tests lourds lancés quand même ; un « timed out after 5000 ms » vient sans doute de la charge, le test se rejoue seul."
      fi
      calm_secs=$(( $(now) - began ))
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
    # Le shell est mort pendant l'attente : sa place est rendue, sans ligne d'historique (#521).
    if ! alive "$pid"; then
      rm -rf "$lock"
      exit 0
    fi
    sleep "$poll"
  done
  calm_secs=$(( $(now) - began ))
  if [[ "$said" == memory ]]; then
    echo "roadmap : la mémoire s'est détendue (${free:-?} % libres), tests lourds lancés après $(span $(( $(now) - began )))."
  elif [[ "$said" == load ]]; then
    echo "roadmap : la charge est retombée (${load:-?}), tests lourds lancés après $(span $(( $(now) - began )))."
  fi
  return 0
}

lock=""  # la place prise, posée dans take_place
calm_secs=0
taken_at=0
start="$(now)"
say_polls="$(awk -v s="$say_every" -v p="$poll" 'BEGIN { n = int(s / p + 0.999); print (n < 1 ? 1 : n) }')"
# Le sondage et la ligne « en file depuis… » se comptent en temps dormi (ms entières), plus en tours.
read -r poll_ms idle_ms say_ms <<< "$(awk -v p="$poll" -v i="$idle_poll" -v s="$say_every" 'BEGIN { printf "%d %d %d", p * 1000 + 0.5, i * 1000 + 0.5, s * 1000 + 0.5 }')"
slept_ms=0
next_say_ms=0
said=0

# Prendre la place <chemin> si elle est libre : le propriétaire est posé, le ticket ôté, la suite attend le calme et part.
take_place() {
  lock="$1"
  lift_stale "$lock"
  mkdir "$lock" 2>/dev/null || { lock=""; return 1; }
  sed "s/^since=.*/since=$(now)/" "$ticket" > "$lock/owner.tmp"
  mv "$lock/owner.tmp" "$lock/owner"
  rm -f "$ticket"
  trap - EXIT
  taken_at="$(now)"
  (( said )) && echo "roadmap : tests lourds, à ton tour après $(span $(( taken_at - start )))."
  # Le nice de la suite (#323) : elle cède le processeur aux sessions qui travaillent.
  nice="${ROADMAP_QUEUE_NICE:-10}"
  [[ "$nice" =~ ^[0-9]+$ ]] || nice=10
  (( nice > 0 )) && renice -n "$nice" -p "$pid" >/dev/null 2>&1
  wait_for_calm
  mark_run
  exit 0
}

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
  # En un passage : la tête de la liste triée, et (voie 1, place rapide) son premier ticket de voie 1.
  want_fast=0
  (( fast && lane == 1 )) && want_fast=1
  { IFS= read -r head_name; IFS= read -r first_fast; } <<< "$(ls "$queue" 2>/dev/null | sort | awk -v w="$want_fast" 'NR == 1 { h = $0 } w == 1 && f == "" && $0 ~ /^1-/ { f = $0 } END { print h; print f }')"
  candidate=0
  if [[ "$head_name" == "$ticket_name" ]]; then
    candidate=1
    for i in $(seq 1 "$slots"); do
      take_place "$(place_path "$i")"
    done
    (( want_fast )) && take_place "$fast_place"
    lock=""
  elif (( want_fast )) && [[ "$first_fast" == "$ticket_name" ]]; then
    candidate=1
    take_place "$fast_place"
    lock=""
  fi
  if (( slept_ms >= next_say_ms )); then
    ahead="$(ls "$queue" 2>/dev/null | sort | awk -v me="$ticket_name" '$0 < me' | wc -l | tr -d ' ')"
    # Le titulaire à nommer : la première place occupée, la place rapide d'abord pour un test ciblé (#521).
    obranch="" olabel="" osince="" oproject=""
    for op in $( (( want_fast )) && echo "$fast_place"; for i in $(seq 1 "$slots"); do place_path "$i"; done ); do
      op="$op/owner"
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
    next_say_ms=$(( slept_ms + say_ms ))
  fi
  # Un shell mort quitte la file, le piège EXIT ôte le ticket (#521) ; après l'essai de place, pour qu'un
  # shell déjà mort au premier tour prenne encore une place libre, comme avant.
  alive "$pid" || exit 0
  # Un candidat sonde vite ; qui ne peut prendre aucune place dort plus longtemps.
  if (( candidate )); then
    sleep "$poll"; slept_ms=$(( slept_ms + poll_ms ))
  else
    sleep "$idle_poll"; slept_ms=$(( slept_ms + idle_ms ))
  fi
done
