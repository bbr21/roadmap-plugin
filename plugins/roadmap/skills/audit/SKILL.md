---
name: audit
description: "Audite le contenu de la roadmap d'un projet du plugin roadmap, en mode Code ou Projet : Claude lit toutes les tâches et propose de découper les paquets en un parent et ses enfants datés (parent:, deux niveaux), les dépendances (après:), les regroupements et doublons, et de combler les trous (sans échéance, en retard, sans responsable, attente à relancer, parent aux enfants faits). La personne valide paquet par paquet ; un script écrit tout ou rien, après sauvegarde, avec un bilan qui retrouve chaque fragment du texte d'origine. Lancé en fin d'onboarding. Déclenche sur « audite ma roadmap », « fais le doctor de ma roadmap », « fais le ménage dans ma roadmap », « découpe mes tâches », « mes tâches sont des paquets », « cherche les doublons dans ma roadmap ». Pas pour la structure du projet (doctor), ni pour importer une roadmap (onboarding), ni pour ajouter ou cocher une tâche nommée (skill tasks), ni pour prouver qu'une tâche est faite par les traces d'un dossier."
---

# Auditer la roadmap

## Ce que la skill garantit

Le doctor dit si le projet est **branché**. L'audit dit si sa roadmap est **pilotable** : une tâche
par action, datée, avec son responsable, ses dépendances, et un seul exemplaire de chaque sujet.

- **Rien ne s'écrit sans validation.** Claude propose, la personne tranche, paquet par paquet.
- **Aucun mot ne se perd.** Le script refuse d'écrire si un fragment du libellé d'origine ne se
  retrouve pas, mot pour mot (hors mots vides), dans la tâche qui le reçoit ou dans sa mère.
- **Tout ou rien, avec sauvegarde.** Les fichiers se préparent en mémoire, se vérifient, se
  copient dans `sauvegarde-audit-…/`, puis s'écrivent d'un coup.

**Le modèle** (#125) : une tâche est **seule**, **parent** (d'autres la citent en `parent:`) ou
**enfant** (elle porte `parent:`), sur **deux niveaux au plus** : un enfant n'a pas d'enfant, et le
script refuse d'en créer un troisième. Un parent porte un nom de sujet, pas une action ; ses
enfants sont des étapes de travail (2 à 6 par parent), pas des gestes. `après:` relie deux enfants
d'un même parent, ou deux parents (un sujet après un autre), jamais l'enfant d'un sujet à celui
d'un autre.

Si `.claude/roadmap.json` déclare `regles` (#158), lis ce fichier en entier avant de proposer :
ses règles l'emportent sur celles de cette skill.

Le script est `scripts/audit.py`, lancé depuis le dossier de cette skill (le chemin donné au
chargement de la skill). Il lit la grammaire avec l'import de la skill `onboarding`.

## 1. Le relevé

```bash
python3 "<dossier de la skill>/scripts/audit.py" releve <dossier du projet> > <scratchpad>/releve.json
```

Il refuse une roadmap dont une tâche n'a pas d'`id:` : lancer d'abord l'import (skill
`onboarding`, « Importer une roadmap existante »). En mode Code, il lit la roadmap du dossier
principal, sur `main`.

Il rend : chaque tâche ouverte avec ses `fragments` (le libellé coupé aux « ; » hors parenthèses),
les `paquets` (deux fragments ou plus), les `trous` par type, les `doublons_possibles` (paires de
tâches au vocabulaire ou au sujet proche, seuil 0,3 : une piste, pas un verdict) et l'`heritage`
proposé (les clés qu'une sous-tâche reprend de sa mère : `fiche:` et les clés déclarées qui
servent de catégorie, comme `projet:` ou `dept:`).

## 2. Les propositions

Claude lit **toutes** les tâches du relevé, pas seulement les paires calculées, et écrit
`<scratchpad>/propositions.json` :

```json
{
  "releve": "<scratchpad>/releve.json",
  "heritage": ["fiche", "projet", "dept"],
  "decoupages": [{
    "id": "30",
    "mere": {"libelle": "Vendor agreement de Little Zoo", "note": "(regroupement validé par Caroline, 27/10)", "champs": {}},
    "fragments_mere": [],
    "enfants": [
      {"cle": "n1", "libelle": "Plan envoyé à Jason", "fragments": [0]},
      {"cle": "n2", "libelle": "Attendre leur bid et les payment milestones", "fragments": [1], "champs": {"attend": "Little Zoo"}},
      {"cle": "n3", "libelle": "Puis envoyer la Deal Request à Linda et le vendor agreement", "fragments": [2]}
    ]
  }],
  "regroupements": [{"mere": "20", "enfants": ["21", "23"]}],
  "fusions": [{"garde": "12", "part": "31", "libelle": null}],
  "fermetures": [{"id": "7"}],
  "apres": [{"id": "n3", "apres": ["n2"]}],
  "valeurs": [{"id": "18", "champ": "due", "valeur": "2026-11-05"}]
}
```

Une tâche existante se désigne par son `id:`, une tâche créée par l'audit par sa `cle` (`n1`,
`n2`…, unique dans le fichier). Une clé inconnue du fichier est refusée, comme un mauvais type
(`"apres": "12"` au lieu de `["12"]`). Une tâche fusionnée ou fermée par l'audit ne se vise plus :
vise la tâche gardée.

Les `champs` proposés se contrôlent comme le panneau les contrôle : dates en AAAA-MM-JJ, `prio` 1,
2 ou 3, clés de la grammaire ou déclarées dans `roadmap.json`. Ils ne portent jamais `id`, `qui`,
`branche`, `verrou`, `fait`, `parent` ni `après` : l'audit pose `parent:` lui-même (découpage,
regroupement) et `après:` passe par `apres`.

**Découper un paquet** :

- **Un enfant par étape de travail**, 2 à 6 par parent : une étape qu'on coche (« Analyser la
  data et checker l'EFC »), pas chaque geste. Le sujet commun (souvent le texte avant le premier
  « : ») devient le libellé du parent : un nom de sujet, sans action.
- **Un enfant ne se découpe pas** : ses morceaux deviennent des sœurs sous son parent (le script
  refuse un troisième niveau).
- **Chaque fragment a une seule cible** : un enfant (`fragments`) ou la mère (`fragments_mere`).
  Ses mots restent : reformule (ordre, verbe à l'infinitif ajouté), ne retranche pas. Un mot peut
  passer dans un champ (« Thierry : envoyer… » → `attend:Thierry`), mais un jour de la semaine
  passé en `due:` reste dans le libellé (« lundi » n'est pas dans `2026-11-02`).
- **Une date entre parenthèses avec un nom** (« (Caroline, 28/10) ») dit qui a parlé et quand :
  ce n'est pas une échéance. Un enfant n'a sa propre `due:` que si son fragment nomme une vraie
  échéance (« lundi 02/11 », « d'ici le 05/11 », « la semaine du 09/11 » → le lundi) ; sinon il
  hérite de la `due:` de la mère. Ne propose pas de `due:` au parent : sa date se calcule sur son
  enfant ouvert le plus proche ; une `due:` posée sur lui reste l'échéance finale du sujet.
- **Le contexte** (« (regroupement validé par Caroline, 27/10) », une attribution) va dans la note
  ou le libellé de la mère ; un fragment qui n'est qu'un état (« accès ShotGrid confirmé ») va
  dans la note de la tâche qu'il éclaire.
- Les sous-tâches reprennent de leur mère `ouvert:`, l'axe, les champs exigés qui leur manquent
  (`après:-` sinon) et les clés de `heritage` ; jamais `ref:`.

**Dépendances** : celles que le texte dit (« puis », « après », « une fois… », « attendre … avant »),
entre sœurs (1 puis 2 ; deux sœurs sans `après:` se font en parallèle) ou entre parents.

**Regroupements et doublons** : deux tâches ouvertes sur le même sujet → une **fusion** (on garde
le libellé le plus précis, l'autre se ferme « (fusionnée dans #N) ») ; des tâches distinctes d'un
même chantier → un **regroupement** sous une mère, existante ou nouvelle (`{"cle", "libelle",
"axe", "champs"}`). Deux tâches parallèles de projets différents (ROB et DET) ne sont pas des
doublons.

**Trous** : une valeur proposée par tâche, tirée du texte (`due`, `resp`, `relance`, `attend`,
`ouvert`, `parent`) ; jamais une `prio` à poser : la priorité ne s'affiche plus (#130) ; une mère dont tous les enfants sont faits se propose en `fermetures`
(refusée si l'audit vient de lui fusionner une tâche ou de lui donner un enfant ouvert). Une
boucle de `parent:` ou d'`après:` est refusée.

## 3. Valider

Formulaire à choix, recommandation en premier, quatre questions par envoi ; jamais une question
posée en texte libre, mais la personne peut toujours répondre par écrit, et sa réponse corrige la
proposition :

1. **L'héritage**, une question : « Les sous-tâches reprennent de leur mère : fiche, projet,
   dept ? ».
2. **Un paquet par question.** L'aperçu (`preview`) montre la mère et ses enfants, une ligne
   chacun avec `due:`, `resp:`, `attend:` et ses `après:`. Options : « Découper ainsi
   (recommandé) », « Laisser tel quel ». Une réponse écrite corrige la proposition.
3. **Une question par fusion et par regroupement**, les deux libellés en aperçu.
4. **Les dépendances** hors paquets, par groupe.
5. **Les trous**, une question par type, la valeur proposée pour chaque tâche (« Poser ces
   échéances », « Les laisser vides »).

Sur une grande roadmap (plus de 40 paquets ou de 60 tâches), propose d'abord un périmètre (un
axe, les paquets les plus longs, les tâches en retard) ; le périmètre nommé par la personne
l'emporte. Retire du JSON ce qui est refusé, corrige ce qui est changé.

## 4. Appliquer

```bash
python3 "<dossier de la skill>/scripts/audit.py" appliquer <dossier du projet> --propositions <scratchpad>/propositions.json
```

Un refus (« Refusé : … ») ne laisse rien écrit et nomme l'écart : un fragment sans cible, un mot
perdu, la roadmap changée depuis le relevé (relance le relevé et refais les propositions), une
ligne prise par une session (`qui:` et `branche:`), un numéro inconnu, une boucle d'`après:`, une
date fausse. Corrige la proposition et relance.

Sinon le script montre le bilan : paquets découpés et sous-tâches créées, fragments retrouvés
(n sur n), regroupements, fusions, fermetures, dépendances, valeurs, comptes avant et après par
fichier, numéros créés, chemin de la sauvegarde. Montre-le tel quel.

## 5. Vérifier et rendre compte

1. `python3 "<dossier de la skill onboarding>/scripts/onboarding.py" verifier <dossier>`
   (« Conforme au format. »).
2. Dans un dépôt : un commit des seuls fichiers de la roadmap (`ROADMAP.md`, `ROADMAP-fait.md`,
   `ROADMAP-bilans.csv`), sur `main` dans le dossier principal en mode Code. La sauvegarde ne se
   committe pas ; propose de la supprimer une fois la roadmap relue dans le panneau.
3. Compte rendu court : ce qui a été écrit (le bilan), ce qui a été refusé et reste en trou, et
   les tâches en retard qui restent à replanifier.

## Ce que la skill ne fait pas

- Elle ne prouve pas qu'une tâche est faite : seule une mère dont tous les enfants sont faits se
  ferme. La preuve par les traces d'un dossier (emails envoyés, livrables) appartient au dossier
  (pour AAFES : `aafes-roadmap-audit`).
- Elle ne rouvre, ne renumérote ni ne réécrit aucune tâche close.
- Elle ne touche pas à une ligne prise par une session, sauf ses valeurs et ses dépendances.
