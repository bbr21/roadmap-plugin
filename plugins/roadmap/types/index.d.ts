declare module 'claude-code' {
  interface PluginState {
    'roadmap': {
      /** L'état qu'un clic change, écrit d'un coup : filtres, sections, tâche choisie, lancement. */
      view: View
      /** Le texte de la recherche, vide sans recherche. */
      search: string
      /** Empreinte des deux fichiers (somme des mtime) : un changement redessine le panneau. */
      stamp: number
      /** Monte à chaque écriture des titres courts : le panneau se redessine. */
      titlesVersion: number
      /** Pourquoi les titres courts manquent, vide quand tout va bien. */
      titleNote: string
      /** Monte quand le thème de Claude Code change : le panneau se redessine dans l'autre palette. */
      themeStamp: number
      /** Monte à chaque « Réessayer » d'une roadmap illisible : le panneau relit les fichiers. */
      retry: number
      /** Monte quand une session lancée change d'état : le panneau se redessine. */
      liveVersion: number
      /** Génération des zones de clic (suffixe `-g<N>` de leurs clés) : monte quand leur cadre n'a pas dit « prêt ». */
      zoneGen: number
      /** Pourquoi les autres sessions manquent (liste refusée ou illisible) ; vide quand la liste se lit. */
      scanNote: string
      /** Monte après chaque écriture des réglages de session (par le volet Réglages ou ailleurs) : le volet se redessine. */
      prefsStamp: number
      /**
       * Le bloc des réglages de session donné en dernier à la conversation (#116) : par le démarrage
       * classique, ou par un message quand sec-default saute ce démarrage. Vide après un `/clear` ou une
       * compaction, vue par `session.compact` ou, sous sec-default, par le contexte qui fond (#119). Un
       * bloc qui a changé depuis (le volet, la skill) se redonne au message suivant (#119).
       */
      prefsGivenText: string
      /** Maestro vient de se présenter sans scanner (#126) : un oui nu au message suivant demande le scan. */
      maestroIntro: boolean
      /** Le contexte du message précédent, en jetons (#119) : 0 quand rien n'est mesuré depuis le dernier `/clear` ou la dernière compaction vue. */
      contextSeen: number
      /** Les questions des boîtes de fin de Maestro depuis le dernier message de la personne (#133) : un réveil ne les repose pas. */
      pendingAsks: readonly string[]
      /** L'explication ouverte dans le volet Réglages (#118) : la clé de sa ligne (`pref:adhd`, `opt:theme`), vide sinon. */
      settingsInfo: string
    }
  }
}

/** L'état qu'un clic change, en une seule valeur (`view`) : un clic, une écriture, un dessin. */
export type View = {
  /** Axe affiché : `all` ou un axe (`mcp`, `produit`…). */
  axis: string
  /** Filtre « attend » : `all`, `mine` (moi ou personne), `others`, `late`, ou un tiers (`Martial`…). */
  attend: string
  /** Filtre « Qui » du mode Projet (#99) : `all`, ou une personne ; absent dans une vue d'avant, vaut `all`. */
  who?: string
  /** « Plus de filtres » déplié (#115) ; absent dans une vue d'avant, vaut replié. */
  moreFilters?: boolean
  /** Montrer les tasks faites (ROADMAP-fait.md). */
  showDone: boolean
  /**
   * Les tâches de toutes les vues rangées par jour (`day` : `ouvert:` d'une ouverte, `fait:` d'une faite)
   * ou par sujet (`subject`) ; `auto` : les ouvertes par sujet, les faites par jour.
   */
  groupBy: string
  /** Task ouverte en détail, par clé `<fichier>:<ligne>` ; vide = la liste. */
  selected: string
  /** Sections de sujet dépliées dans la vue d'ensemble (sans filtre). */
  openGroups: string[]
  /** Tâches dont le lancement a été demandé depuis ce panneau (clé `taskKey`) : leur bouton est grisé. */
  launched: string[]
  /** Ce que le dernier lancement a donné, affiché sous le bouton. */
  launchNote: string
  /** Ce qu'a donné la dernière ouverture de fichier, vide quand elle s'est faite dans Claude Code. */
  openNote: string
  /** Sections dépliées en entier, au-delà du budget de lignes d'un dessin ; vidé à chaque changement de filtre. */
  moreGroups: string[]
  /** Sections repliées sous un filtre, où tout est déplié par défaut ; vidé à chaque changement de filtre. */
  closedGroups: string[]
  /** Task faite dont la boîte « Conclusion » est dépliée (clé `<fichier>:<ligne>`) ; vide sinon. */
  conclusionOpen: string
  /** Tâche dont la clôture (faite ou annulée, selon `closeKind`) attend sa confirmation (clé `taskKey`) ; vide sinon. */
  cancelAsk: string
  /** La clôture que confirme l'encart de `cancelAsk` : « Marquer faite » ou « Annuler la tâche » (#73). */
  closeKind: 'done' | 'abandon'
  /** La clôture en cours (`…`), ou ce qu'elle a donné quand ce n'est pas un succès net ; vide sinon. */
  cancelNote: string
  /** La vue du panneau (#120) : `list` (la liste) ou `board` (le tableau des sessions) ; absente, la liste. */
  layout?: 'list' | 'board'
  /** La seule colonne montrée par le tableau (`ask`, `run`, `ready`, `todo`, `done`) ; vide ou absente, toutes. */
  boardFocus?: string
  /** Les colonnes du tableau dépliées en entier, au-delà de leur plafond de cartes. */
  boardMore?: string[]
}

/** Une session lancée depuis le panneau, gardée dans `$.store` par empreinte du libellé de sa task. */
export type LiveEntry = {
  sessionId?: string
  startedAt: number
  title: string
  link?: string
  /** `write` : déduite d'une ligne ajoutée par la session ; absente : lancée depuis le panneau. */
  via?: 'write'
}

/** Le titre court et le sujet d'une task, gardés dans `$.store` par empreinte du libellé. */
export type ShortTitle = { titre: string; sujet: string }
