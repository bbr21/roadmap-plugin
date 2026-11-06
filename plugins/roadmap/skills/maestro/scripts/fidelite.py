#!/usr/bin/env python3
"""La preuve de fidélité d'un rendu (#357) : la capture du vrai rendu posée à côté de la maquette
validée, les écarts listés puis corrigés, avant de se dire « prête à fusionner ».

  python3 fidelite.py poser CHANTIER --maquette maquettes.html#a3 (--fenetre | --capture IMAGE) [--zone x,y,l,h]
  python3 fidelite.py verifier CHANTIER

CHANTIER est le dossier du chantier (`docs/plans/<type>-<slug>/`). `poser` y écrit `capture-panneau.png`
et `fidelite.html` : la capture à gauche, la maquette (son chemin relatif au chantier, avec son ancre)
à droite, puis la liste des écarts, `<ol id="ecarts">`, un `<li data-ecart="ouvert|corrige|aucun">` par
écart, que la session tient à la main. Relancé après les corrections, `poser` reprend la capture et
garde la liste.

`--fenetre` capture la plus grande fenêtre de Claude à l'écran (`screencapture`, qui demande que Claude
soit coché dans Réglages Système > Confidentialité et sécurité > Enregistrement de l'écran) ;
`--fenetre-id` en choisit une autre ; `--zone x,y,l,h`, en points de la fenêtre, recadre le panneau
(`sips`). `--capture` prend une image déjà faite (simulateur iOS, navigateur).

`verifier` rend 0 quand la preuve est complète : la page, l'image qu'elle cite, au moins un écart
listé (« aucun » si la capture est fidèle), aucun encore ouvert ; 1 sinon, avec ce qui manque.
Codes : 2 sur une entrée illisible, 3 quand la capture de la fenêtre est impossible.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import html as html_lib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

PAGE = "fidelite.html"
IMAGE = "capture-panneau.png"
ETATS = ("ouvert", "corrige", "aucun")
REGLAGE = ("Claude n'a pas le droit de capturer l'écran : coche Claude dans Réglages Système > "
           "Confidentialité et sécurité > Enregistrement de l'écran, puis relance.")

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


class CaptureImpossible(Exception):
    """La fenêtre de Claude ne se capture pas (code 3)."""


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


def fenetre_claude(fenetres):
    """La plus grande fenêtre de Claude au niveau normal : `(id, largeur en points)`, ou None."""
    cands = [w for w in fenetres if w.get("kCGWindowOwnerName") == "Claude" and w.get("kCGWindowLayer") == 0]
    if not cands:
        return None
    w = max(cands, key=lambda w: w["kCGWindowBounds"]["Width"] * w["kCGWindowBounds"]["Height"])
    return (w["kCGWindowNumber"], w["kCGWindowBounds"]["Width"])


def zone_en_pixels(zone, largeur_px, largeur_pt):
    k = largeur_px / float(largeur_pt)
    return tuple(int(round(v * k)) for v in zone)


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


def fenetres_a_l_ecran():
    script = ('ObjC.import("CoreGraphics"); JSON.stringify(ObjC.deepUnwrap(ObjC.castRefToObject('
              '$.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly, 0))))')
    r = subprocess.run(["osascript", "-l", "JavaScript", "-e", script], capture_output=True, text=True)
    if r.returncode != 0:
        raise CaptureImpossible("liste des fenêtres illisible : %s" % r.stderr.strip())
    return json.loads(r.stdout or "[]")


def largeur_px(chemin):
    r = subprocess.run(["sips", "-g", "pixelWidth", chemin], capture_output=True, text=True)
    m = re.search(r"pixelWidth:\s*(\d+)", r.stdout)
    if not m:
        raise Erreur("image illisible : %s" % chemin)
    return int(m.group(1))


def capturer(sortie, fenetre_id=None):
    """Capture la fenêtre de Claude dans `sortie` ; rend sa largeur en points (None si inconnue)."""
    largeur_pt = None
    if fenetre_id is None:
        trouvee = fenetre_claude(fenetres_a_l_ecran())
        if trouvee is None:
            raise CaptureImpossible("aucune fenêtre de Claude à l'écran")
        fenetre_id, largeur_pt = trouvee
    r = subprocess.run(["screencapture", "-x", "-o", "-l", str(fenetre_id), sortie], capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(sortie):
        raise CaptureImpossible(REGLAGE)
    return largeur_pt


def recadrer(chemin, zone, largeur_pt):
    px = largeur_px(chemin)
    x, y, l, h = zone_en_pixels(zone, px, largeur_pt or px)
    r = subprocess.run(["sips", "-c", str(h), str(l), "--cropOffset", str(y), str(x), chemin], capture_output=True, text=True)
    if r.returncode != 0:
        raise Erreur("recadrage impossible : %s" % r.stderr.strip())


def lire(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None


def poser(chantier, maquette, capture=None, fenetre=False, fenetre_id=None, zone=None):
    if not os.path.isdir(chantier):
        raise Erreur("dossier du chantier introuvable : %s" % chantier)
    if capture is not None and not os.path.isfile(capture):
        raise Erreur("capture introuvable : %s" % capture)
    zone = lire_zone(zone)
    with tempfile.TemporaryDirectory() as tmp:
        brut = os.path.join(tmp, IMAGE)
        largeur_pt = None
        if capture is not None:
            shutil.copyfile(capture, brut)
        elif fenetre or fenetre_id is not None:
            largeur_pt = capturer(brut, fenetre_id)
        else:
            raise Erreur("--capture ou --fenetre attendu")
        if zone is not None:
            recadrer(brut, zone, largeur_pt)
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
    po.add_argument("--fenetre", action="store_true")
    po.add_argument("--fenetre-id", type=int)
    po.add_argument("--zone")
    ve = sub.add_parser("verifier")
    ve.add_argument("chantier")
    a = p.parse_args(argv)
    try:
        if a.cmd == "poser":
            poser(a.chantier, a.maquette, a.capture, a.fenetre, a.fenetre_id, a.zone)
            print("Posée : %s. Liste les écarts (ouvert, puis corrige), corrige-les, relance poser, puis verifier."
                  % os.path.join(a.chantier, PAGE))
            return 0
        reste = verifier(a.chantier)
    except Erreur as e:
        print("fidelite : %s" % e, file=sys.stderr)
        return 2
    except CaptureImpossible as e:
        print("fidelite : %s" % e, file=sys.stderr)
        return 3
    if reste:
        print("Preuve de fidélité incomplète : %s." % " ; ".join(reste))
        return 1
    print("Preuve de fidélité complète : %s." % os.path.join(a.chantier, PAGE))
    return 0


if __name__ == "__main__":
    sys.exit(main())
