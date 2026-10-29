#!/bin/sh
# Accueil d'une session Claude Code (hook SessionStart, .claude/settings.json) : ce qui est pris avant de toucher à rien.
# Lit le ROADMAP du dossier principal s'il existe (la copie d'un worktree peut être en retard), sinon celui du dépôt courant.
# Rapide et sans réseau : aucun fetch. Ne fait jamais échouer le démarrage.
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
main="{{DOSSIER}}"
case "$main" in "~/"*) main="$HOME/${main#\~/}" ;; esac
roadmap="$main/{{RM}}ROADMAP.md"; [ -f "$roadmap" ] || roadmap="$root/{{RM}}ROADMAP.md"
[ -f "$roadmap" ] || exit 0

echo "{{NOM}} : chantiers en cours (ROADMAP, « En cours »), lus dans $roadmap"
awk '/^## En cours/{on=1; next} /^## /{on=0} on && /^- \[ \]/' "$roadmap" | while IFS= read -r line; do
  title=$(printf '%s' "$line" | sed -E 's/^- \[ \] //; s/ `\[.*//' | cut -c1-90)
  # Seuls les champs entre `[…]` comptent : une description peut citer un verrou sans le poser.
  block=$(printf '%s' "$line" | grep -oE '`\[[^]]*\]`' | tail -1)
  # Le champ id: seul, pas un « attend:id:12 » qui cite une autre tâche.
  id=$(printf '%s' "$block" | grep -oE '[[|] *id:[0-9]+' | grep -oE '[0-9]+$')
  fields=$(printf '%s' "$block" | grep -oE '(qui|branche|verrou):[^ |`]+' | tr '\n' ' ')
  echo "- ${id:+#$id }$title"
  [ -n "$fields" ] && echo "    $fields"
done

locks=$(grep -oE '`\[[^]]*\]`' "$roadmap" | grep -oE 'verrou:[a-z0-9/-]+@[0-9-]+' | sort -u | tr '\n' ' ')
echo "Verrous posés : ${locks:-aucun}"
last_id=$(cat "$roadmap" "$(dirname "$roadmap")/ROADMAP-fait.md" 2>/dev/null | grep -oE '`\[[^]]*\]`' | grep -oE '[[|] *id:[0-9]+' | grep -oE '[0-9]+$' | sort -n | tail -1)
echo "Prochain numéro de tâche (id:) : $(( ${last_id:-0} + 1 ))"
{{MIGRATIONS_SH}}
echo "Copies de travail :"
git -C "$root" worktree list 2>/dev/null | sed 's/^/  /'
echo "Rappels : une session = une branche = un worktree ; {{RM}}ROADMAP.md ne se modifie que dans $main, sur main ; poser le verrou avant de toucher une ressource unique."
echo "Fin de chantier (CLAUDE.md « Finir un chantier ») : {{RAPPEL_FIN}}"
exit 0
