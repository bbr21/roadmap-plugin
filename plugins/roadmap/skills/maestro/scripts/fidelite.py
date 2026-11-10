#!/usr/bin/env python3
"""La preuve de fidélité d'un rendu (#357) : la capture du vrai rendu posée à côté de la maquette
validée, les écarts listés puis corrigés, avant de se dire « prête à fusionner ».

  python3 fidelite.py poser CHANTIER --maquette maquettes.html#a3 --capture IMAGE [--zone x,y,l,h]
  python3 fidelite.py verifier CHANTIER

CHANTIER est le dossier du chantier (`docs/plans/<type>-<slug>/`). `poser` y écrit `capture-panneau.png`
et `fidelite.html` : la capture à gauche, la maquette (son chemin relatif au chantier, avec son ancre)
à droite, puis la liste des écarts, `<ol id="ecarts">`, un `<li data-ecart="ouvert|corrige|aucun">` par
écart, que la session tient à la main. Relancé après les corrections, `poser` reprend la capture et
garde la liste.

La capture, c'est l'utilisateur qui la prend (#377), jamais la session : après la publication, elle
lui écrit la consigne au gabarit `references/consigne-capture.md` de cette skill (#406), une seule
liste numérotée : la version que doit dire le pied du panneau, les gestes qui mettent l'état à
l'écran, une étape par capture (sa zone, « Tu dois y voir : … »), « Colle-les ici. », et quoi faire
si ce qu'on voit diffère ; jamais le mode d'emploi d'une capture. Une image collée arrive avec son chemin sur le disque
(`[Image: source: /private/tmp/…/images/1.png]`) : `--capture` prend ce chemin et copie l'image dans
le chantier. `--zone x,y,l,h`, en pixels de l'image, recadre une capture trop large (`sips`).
`--fenetre` (l'ancienne capture de la fenêtre de Claude par la session) est refusé, code 2.

`verifier` rend 0 quand la preuve est complète : la page, l'image qu'elle cite, au moins un écart
listé (« aucun » si la capture est fidèle), aucun encore ouvert ; 1 sinon, avec ce qui manque.
Code 2 sur une entrée illisible ou sans `--capture`.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import html as html_lib
import os
import re
import shutil
import subprocess
import sys
import tempfile

PAGE = "fidelite.html"
IMAGE = "capture-panneau.png"
ETATS = ("ouvert", "corrige", "aucun")
CONSIGNE = ("la capture se prend par l'utilisateur, plus par la session (#377) : après la publication, écris-lui "
            "la consigne au gabarit references/consigne-capture.md de cette skill (#406 : la version du pied du "
            "panneau, les gestes, une étape par capture et ce qu'il doit y voir), qu'il colle dans le chat, puis "
            "relance poser avec --capture <chemin de l'image collée>.")

# Les mêmes règles que le panneau (`isRenderFile`, `isMockupPage`, hooks/parse.ts) : un fichier
# d'interface, ni test ni page du dossier d'un chantier.
UI_FILE = re.compile(r"\.(tsx|jsx|swift|css|scss|sass|less|html?|vue|svelte)$")
TEST_FILE = re.compile(r"(^|/)(tests?|__tests__|e2e|spec)/|\.(test|spec)\.[^/]+$|(^|/)test_[^/]+\.py$|_test\.(go|py)$|Tests?/|Tests?\.swift$")
MOCKUP_PAGE = re.compile(r"(^|/)maquettes?[^/]*\.html?$", re.I)
PLANS = re.compile(r"(^|/)docs/plans/")

LI = re.compile(r"<li\b([^>]*)>(.*?)</li>", re.S | re.I)
ETAT = re.compile(r"""data-ecart\s*=\s*["']([^"']*)["']""", re.I)
LISTE = re.compile(r'<ol id="ecarts">.*?</ol>', re.S)
IMG = re.compile(r'<img[^>]*\bclass="capture"[^>]*\bsrc="([^"]+)"|<img[^>]*\bsrc="([^"]+)"[^>]*\bclass="capture"')


class Erreur(Exception):
    """Une entrée illisible (code 2)."""


# ---------------------------------------------------------------- analyse (pure)


def est_rendu(chemin):
    return bool(UI_FILE.search(chemin)) and not TEST_FILE.search(chemin) and not PLANS.search(chemin)


def requise(fichiers):
    """Une branche porte un rendu tiré d'une maquette : une page de maquettes et un fichier de rendu."""
    return any(MOCKUP_PAGE.search(f) for f in fichiers) and any(est_rendu(f) for f in fichiers)


def ecarts(html):
    """Les écarts de la liste, `(etat, texte)` ; un état inconnu compte comme ouvert."""
    m = LISTE.search(html or "")
    if not m:
        return []
    out = []
    for attrs, corps in LI.findall(m.group(0)):
        e = ETAT.search(attrs)
        if not e:
            continue
        etat = e.group(1).strip().lower()
        out.append((etat if etat in ETATS else "ouvert", re.sub(r"<[^>]+>", "", corps).strip()))
    return out


def image_de(html):
    m = IMG.search(html or "")
    return (m.group(1) or m.group(2)) if m else None


def manques(html, image_existe):
    """Ce qui manque à la preuve ; vide quand elle est complète."""
    if html is None:
        return ["pas de %s" % PAGE]
    out = []
    if not image_existe:
        out.append("capture absente (%s)" % (image_de(html) or IMAGE))
    liste = ecarts(html)
    if not liste:
        out.append("aucun écart listé (« aucun » si la capture est fidèle)")
    ouverts = sum(1 for e, _ in liste if e == "ouvert")
    if ouverts:
        out.append("%d écart%s encore ouvert%s" % (ouverts, "s" if ouverts > 1 else "", "s" if ouverts > 1 else ""))
    return out


def page(maquette, image, liste_html, quand):
    """La page côte à côte : la capture, la maquette, puis la liste des écarts."""
    m, i = html_lib.escape(maquette, quote=True), html_lib.escape(image, quote=True)
    return """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fidélité à la maquette</title>
<style>
  :root { color-scheme: light dark; font-family: -apple-system, system-ui, sans-serif; }
  body { margin: 16px; }
  .paire { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  figure { margin: 0; }
  figcaption { font-weight: 600; margin-bottom: 8px; }
  img.capture { max-width: 100%%; border: 1px solid #8884; }
  iframe { width: 100%%; height: 80vh; border: 1px solid #8884; }
  li[data-ecart="ouvert"] { color: #c0392b; }
  li[data-ecart="corrige"] { text-decoration: line-through; }
</style>
</head>
<body>
<h1>Fidélité à la maquette</h1>
<p>Capture du <time>%s</time>. Chaque écart : <code>data-ecart="ouvert"</code>, puis <code>"corrige"</code> une fois corrigé et la capture reprise ; <code>"aucun"</code> si la capture est fidèle.</p>
<div class="paire">
<figure><figcaption>Le rendu codé</figcaption><img class="capture" src="%s" alt="Capture du rendu codé"></figure>
<figure><figcaption>La maquette validée</figcaption><iframe src="%s" title="Maquette validée"></iframe></figure>
</div>
<h2>Écarts</h2>
%s
</body>
</html>
""" % (html_lib.escape(quand), i, m, liste_html)


# ---------------------------------------------------------------- effets


def lire_zone(texte):
    if texte is None:
        return None
    try:
        zone = tuple(float(v) for v in texte.split(","))
    except ValueError:
        raise Erreur("zone illisible : %s (attendu x,y,l,h)" % texte)
    if len(zone) != 4 or zone[2] <= 0 or zone[3] <= 0:
        raise Erreur("zone illisible : %s (attendu x,y,l,h)" % texte)
    return zone


def recadrer(chemin, zone):
    """Recadre l'image sur `zone` (x, y, largeur, hauteur), en pixels de l'image."""
    x, y, l, h = (int(round(v)) for v in zone)
    r = subprocess.run(["sips", "-c", str(h), str(l), "--cropOffset", str(y), str(x), chemin], capture_output=True, text=True)
    if r.returncode != 0:
        raise Erreur("recadrage impossible : %s" % r.stderr.strip())


def lire(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None


def poser(chantier, maquette, capture, zone=None):
    if capture is None:
        raise Erreur(CONSIGNE)
    if not os.path.isdir(chantier):
        raise Erreur("dossier du chantier introuvable : %s" % chantier)
    if not os.path.isfile(capture):
        raise Erreur("capture introuvable : %s" % capture)
    zone = lire_zone(zone)
    with tempfile.TemporaryDirectory() as tmp:
        brut = os.path.join(tmp, IMAGE)
        shutil.copyfile(capture, brut)
        if zone is not None:
            recadrer(brut, zone)
        shutil.copyfile(brut, os.path.join(chantier, IMAGE))
    ancienne = lire(os.path.join(chantier, PAGE))
    m = LISTE.search(ancienne or "")
    liste = m.group(0) if m else '<ol id="ecarts">\n</ol>'
    quand = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    with open(os.path.join(chantier, PAGE), "w", encoding="utf-8") as f:
        f.write(page(maquette, IMAGE, liste, quand))


def verifier(chantier):
    html = lire(os.path.join(chantier, PAGE))
    image = image_de(html) if html is not None else None
    return manques(html, image is not None and os.path.isfile(os.path.join(chantier, image)))


def main(argv=None):
    p = argparse.ArgumentParser(description="La preuve de fidélité d'un rendu à sa maquette (#357).")
    sub = p.add_subparsers(dest="cmd", required=True)
    po = sub.add_parser("poser")
    po.add_argument("chantier")
    po.add_argument("--maquette", required=True)
    po.add_argument("--capture")
    # Refusés (#377) : la session ne capture plus l'écran, l'utilisateur prend la capture.
    po.add_argument("--fenetre", action="store_true", help=argparse.SUPPRESS)
    po.add_argument("--fenetre-id", help=argparse.SUPPRESS)
    po.add_argument("--zone")
    ve = sub.add_parser("verifier")
    ve.add_argument("chantier")
    a = p.parse_args(argv)
    try:
        if a.cmd == "poser":
            if a.fenetre or a.fenetre_id is not None:
                raise Erreur("--fenetre refusé : " + CONSIGNE)
            poser(a.chantier, a.maquette, a.capture, a.zone)
            print("Posée : %s. Liste les écarts (ouvert, puis corrige), corrige-les, relance poser, puis verifier."
                  % os.path.join(a.chantier, PAGE))
            return 0
        reste = verifier(a.chantier)
    except Erreur as e:
        print("fidelite : %s" % e, file=sys.stderr)
        return 2
    if reste:
        print("Preuve de fidélité incomplète : %s." % " ; ".join(reste))
        return 1
    print("Preuve de fidélité complète : %s." % os.path.join(a.chantier, PAGE))
    return 0


if __name__ == "__main__":
    sys.exit(main())
