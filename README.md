# Plugin roadmap

Le système roadmap de Claude Code : le panneau de la roadmap du projet, Maestro, l'onboarding et le
doctor, pour un projet de code (mode Code) ou de gestion de projet sans code (mode Projet).

## Installer

Dans l'app Claude (onglet Code) : claude.ai › Customize › Plugins › Add › Add marketplace, l'adresse
`bbr21/roadmap-plugin`, puis installer le plugin roadmap. Dans un terminal :

```
claude plugin marketplace add bbr21/roadmap-plugin
claude plugin install roadmap@roadmap
```

Puis, dans une session ouverte sur le dossier du projet : « onboarding ».

## Est-il sûr de l'installer ?

Ce que fait le plugin (hooks, programmes lancés, fichiers écrits, ce qui sort de la machine) :
[plugins/roadmap/SECURITE.md](plugins/roadmap/SECURITE.md), vérifiée à chaque version. L'empreinte
SHA-256 de chaque fichier installé : [CHECKSUMS.txt](CHECKSUMS.txt).

Ce dépôt est une copie : il se met à jour à chaque version du plugin, et ne reçoit pas de modification.
