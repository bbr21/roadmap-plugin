#!/usr/bin/env python3
"""Impact map of a change (#305): what cites each changed file, what names each changed symbol.

Python 3.9, standard library only; reads the repository through `git` (diff, ls-files), writes nothing.

    python3 impact.py [--repo DIR] [--base REF] [--json]
        the working tree against REF (default HEAD, staged or not) plus untracked files
    python3 impact.py [--repo DIR] --files F [F ...] [--symbols S [S ...]] [--json]
        before coding: the files and symbols the session plans to touch

For each changed file: the tracked files that contain its name (`tokens.ts`) or import it by its stem
(`from '../hooks/tokens'`). For each changed symbol, read on the added or removed lines of the diff
(functions, types, constants, object keys, every name of a Swift `case` line; code files only, modified
files before new ones, 40 at most, the rest counted in `cut`): the files that contain
it as a whole word. Each list is sorted tests first, then code; docs (`docs/`, `.md`) are only counted; the code list is cut at 15, never the tests.

Exit 0 (map written, or nothing changed), 2 (not a git repository, or git failed).
JSON: {"base", "cut", "ranked": [{"path", "hits"}], "files": [{"path", "tests", "code", "docs"}], "symbols": [{"name", "tests", "code", "docs"}]}.
The report is in French, like the sessions that read it.
"""
import argparse
import json
import os
import re
import subprocess
import sys

MAX_SYMBOLS = 40
MAX_BYTES = 4 * 1024 * 1024
SHOWN = 15
RANKED = 10
MIN_LEN = 3

KEYWORDS = {
    "and", "any", "as", "async", "await", "break", "case", "catch", "class", "const", "continue",
    "def", "default", "defer", "del", "do", "elif", "else", "enum", "export", "extends", "extension",
    "false", "final", "for", "from", "func", "function", "get", "guard", "if", "import", "in", "init",
    "interface", "is", "let", "new", "nil", "none", "not", "null", "or", "override", "pass", "private",
    "protocol", "public", "return", "self", "set", "static", "struct", "super", "switch", "this",
    "throw", "throws", "true", "try", "type", "typealias", "undefined", "var", "void", "where",
    "while", "with", "yield", "string", "number", "boolean", "object", "true", "false",
}

DECLARATIONS = [
    # TS, JS, Swift, Python, Kotlin…: a keyword followed by the declared name.
    re.compile(r"\b(?:function|class|interface|type|enum|const|let|var|def|func|fun|fn|struct|trait|protocol|actor|typealias|extension)\s+([A-Za-z_]\w*)"),
    # An object key or a typed field: `  text3: '#94918A',` (start of line only).
    re.compile(r"^\s*([A-Za-z_]\w*)\??\s*:(?!:)"),
    # Python top-level assignment: `NAME = …`.
    re.compile(r"^([A-Za-z_]\w*)\s*=[^=]"),
]
SWIFT_CASE = re.compile(r"^\s*(?:indirect\s+)?case\s+(.+)$")

TEST_DIRS = {"tests", "test", "__tests__", "spec"}

# Files whose changed lines are prose, markup, style or data, not declarations: read as code, their
# words (« Objectif : », `status:`, `color:`) took the place of the real symbols under the cap (#310).
NOT_CODE_EXT = (".json", ".yaml", ".yml", ".toml", ".csv", ".tsv", ".html", ".htm", ".css", ".scss",
                ".svg", ".xml", ".plist", ".lock", ".ini", ".cfg", ".env", ".strings")
# A file name that many files share: it is looked for by its folder (`a/index`), not its name alone.
GENERIC_STEMS = {"index", "main", "utils", "util", "helpers", "mod", "__init__", "types", "constants",
                 "config", "app", "readme", "package", "setup", "test", "tests"}
# The ones a folder import stands for (`from '../src/a'` loads `src/a/index.ts`).
FOLDER_STEMS = {"index", "__init__", "mod"}


class GitError(Exception):
    pass


def run_git(repo, *args):
    try:
        out = subprocess.run(["git", "-C", repo, *args], capture_output=True, check=False)
    except OSError as e:
        raise GitError(str(e))
    if out.returncode != 0:
        raise GitError(out.stderr.decode("utf-8", "replace").strip())
    return out.stdout.decode("utf-8", "replace")


def split_z(text):
    return [p for p in text.split("\0") if p]


def changed_files(repo, base="HEAD"):
    """Files changed against base (tracked, staged or not, deleted included) plus untracked ones."""
    tracked = split_z(run_git(repo, "diff", "--name-only", "-z", base))
    untracked = split_z(run_git(repo, "ls-files", "--others", "--exclude-standard", "-z"))
    seen = []
    for p in tracked + untracked:
        if p not in seen:
            seen.append(p)
    return seen


def names_on_line(text):
    found = []
    m = SWIFT_CASE.match(text)
    if m:
        for part in top_level_parts(m.group(1)):
            n = re.match(r"\s*(?:let\s+|var\s+)?\.?([A-Za-z_]\w*)", part)
            if n:
                found.append(n.group(1))
        return found
    for rx in DECLARATIONS:
        found.extend(rx.findall(text))
    return found


def top_level_parts(body):
    """`a, .b(let c, let d), .e` split on the commas outside parentheses; stops at the case's `:`."""
    parts, depth, cur = [], 0, ""
    for ch in body:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        elif depth == 0 and ch == ",":
            parts.append(cur)
            cur = ""
            continue
        elif depth == 0 and ch == ":":
            break
        cur += ch
    parts.append(cur)
    return parts


def is_code(path):
    return not is_doc(path) and not path.lower().endswith(NOT_CODE_EXT)


def keep(name):
    return len(name) >= MIN_LEN and name.lower() not in KEYWORDS and not name.isdigit()


def changed_symbols(repo, base, files):
    """Names declared on the added or removed lines of the diff of the code files, then in each
    untracked code file; every name found, uncut (impact() cuts and counts)."""
    lines = []
    files = [f for f in files if is_code(f)]
    if files:
        # A modified file first: its callers already exist. A new file's declarations come after,
        # so that they do not fill the cap (the new impact.py did, on the diff of #305).
        added = set(split_z(run_git(repo, "diff", "--name-only", "--diff-filter=A", "-z", base, "--", *files)))
        for group in ([f for f in files if f not in added], [f for f in files if f in added]):
            if not group:
                continue
            diff = run_git(repo, "diff", "-U0", base, "--", *group)
            for line in diff.splitlines():
                if line.startswith(("+++", "---")):
                    continue
                if line.startswith(("+", "-")):
                    lines.append(line[1:])
        tracked = set(split_z(run_git(repo, "ls-files", "-z", "--", *files)))
        for f in files:
            if f not in tracked:
                text = read_text(os.path.join(repo, f))
                if text:
                    lines.extend(text.splitlines())
    names = []
    for text in lines:
        for n in names_on_line(text):
            if keep(n) and n not in names:
                names.append(n)
    return names


def read_text(path):
    try:
        if os.path.getsize(path) > MAX_BYTES:
            return None
        with open(path, "rb") as f:
            data = f.read()
    except OSError:
        return None
    if b"\0" in data:
        return None
    return data.decode("utf-8", "replace")


def corpus(repo):
    """Every tracked or untracked text file of the repository: {path: text}."""
    paths = split_z(run_git(repo, "ls-files", "-z", "--cached", "--others", "--exclude-standard"))
    texts = {}
    for p in paths:
        t = read_text(os.path.join(repo, p))
        if t is not None:
            texts[p] = t
    return texts


def is_test(path):
    parts = path.split("/")
    base = parts[-1]
    if any(d in TEST_DIRS or d.endswith("Tests") for d in parts[:-1]):
        return True
    return (base.startswith("test_") or ".test." in base or ".spec." in base
            or re.search(r"Tests?\.\w+$", base) is not None or base.endswith("_test.py"))


def is_doc(path):
    return path.startswith("docs/") or path.lower().endswith((".md", ".markdown", ".txt"))


def sort_hits(paths):
    hits = sorted(set(paths))
    return {
        "tests": [p for p in hits if is_test(p) and not is_doc(p)],
        "code": [p for p in hits if not is_test(p) and not is_doc(p)],
        "docs": sum(1 for p in hits if is_doc(p)),
    }


def citers(path, texts):
    """Files that name `path`: its file name, or an import of it (JS/TS with a `/` before the stem,
    Python by module); a generic name (`index.ts`) only with its folder (`a/index`, or `from '../a'`)."""
    base = os.path.basename(path)
    stem = os.path.splitext(base)[0]
    parent = os.path.basename(os.path.dirname(path))
    q = re.escape(stem)
    if stem.lower() in GENERIC_STEMS and parent:
        needles = ["%s/%s" % (parent, stem)]
        tests = [re.compile(r"""['"][^'"\n]*/%s/%s(?:\.\w+)?['"]""" % (re.escape(parent), q))]
        if stem in FOLDER_STEMS:
            tests.append(re.compile(r"""(?:from|import|require\(|import\()\s*['"][^'"\n]*/%s['"]""" % re.escape(parent)))
    else:
        needles = [base]
        tests = [re.compile(r"""(?:from|import|require\(|import\()\s*['"][^'"\n]*/%s(?:\.\w+)?['"]""" % q),
                 re.compile(r"^\s*(?:from|import)\s+(?:[\w.]*\.)?%s(?:\s|\.|,|$)" % q, re.M)]
    hits = []
    for p, t in texts.items():
        if p == path:
            continue
        if any(n in t for n in needles) or any(rx.search(t) for rx in tests):
            hits.append(p)
    return hits


def users(names, texts):
    """{name: [paths]} in a single pass over the corpus."""
    out = {n: [] for n in names}
    if not names:
        return out
    rx = re.compile(r"\b(%s)\b" % "|".join(re.escape(n) for n in sorted(names, key=len, reverse=True)))
    for p, t in texts.items():
        for n in set(rx.findall(t)):
            out[n].append(p)
    return out


def impact(repo, base="HEAD", files=None, symbols=None):
    planned = files is not None or symbols is not None
    files = list(files or []) if planned else changed_files(repo, base)
    found = list(symbols or []) if planned else changed_symbols(repo, base, files)
    names = found if planned else found[:MAX_SYMBOLS]
    texts = corpus(repo)
    by_name = users(names, texts)
    result = {
        "base": None if planned else base,
        "cut": len(found) - len(names),
        "files": [dict(path=f, **sort_hits(citers(f, texts))) for f in files],
        "symbols": [dict(name=n, **sort_hits(by_name.get(n, []))) for n in names],
    }
    result["ranked"] = ranked(result)
    return result


def ranked(result):
    """The tests hit by the most changed files and symbols, most hit first: the ones to read first."""
    count = {}
    for e in result["files"] + result["symbols"]:
        for t in e["tests"]:
            count[t] = count.get(t, 0) + 1
    order = sorted(count.items(), key=lambda kv: (-kv[1], kv[0]))
    return [{"path": p, "hits": n} for p, n in order[:RANKED]]


def listing(label, paths, cap=None):
    """A list of paths; the tests are never cut (the one forgotten may be the last), the code is."""
    if not paths:
        return []
    cut = paths if cap is None else paths[:cap]
    shown = ", ".join("`%s`" % p for p in cut)
    more = " … et %d autres" % (len(paths) - len(cut)) if len(cut) < len(paths) else ""
    return ["  - %s (%d) : %s%s" % (label, len(paths), shown, more)]


def block(title, entry):
    lines = [title]
    lines += listing("Tests", entry["tests"])
    lines += listing("Code", entry["code"], SHOWN)
    if entry["docs"]:
        lines.append("  - Docs : %d" % entry["docs"])
    if len(lines) == 1:
        lines.append("  - rien ne le cite")
    return lines


def render(result):
    if not result["files"] and not result["symbols"]:
        return "Carte d'impact : aucun changement (rien dans le diff ni hors suivi)."
    where = "contre %s" % result["base"] if result["base"] else "avant de coder"
    out = ["Carte d'impact (%s) : %d fichier(s), %d symbole(s)." % (where, len(result["files"]), len(result["symbols"]))]
    if result.get("cut"):
        out.append("Plafond de %d atteint : %d symboles non relevés ; nomme ceux qui comptent par `--symbols`."
                   % (MAX_SYMBOLS, result["cut"]))
    many = [r for r in result["ranked"] if r["hits"] > 1]
    if many:
        out += ["", "Tests à lire d'abord (touchés par plusieurs changements) :"]
        out += ["- `%s` (%d)" % (r["path"], r["hits"]) for r in many]
    if result["files"]:
        out += ["", "Fichiers changés, et ce qui les cite :"]
        for f in result["files"]:
            out += block("- `%s`" % f["path"], f)
    if result["symbols"]:
        out += ["", "Symboles changés, et ce qui les nomme :"]
        for s in result["symbols"]:
            out += block("- `%s`" % s["name"], s)
    out += ["", "À faire : chaque test nommé se lance (ou se met à jour), chaque fichier de code nommé se relit ; "
            "un symbole changé sans test en reçoit un ; puis toutes les suites du projet."]
    return "\n".join(out)


def main(argv):
    ap = argparse.ArgumentParser(description="Impact map of a change (#305).")
    ap.add_argument("--repo", default=".")
    ap.add_argument("--base", default="HEAD")
    ap.add_argument("--files", nargs="+")
    ap.add_argument("--symbols", nargs="+")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    repo = os.path.abspath(a.repo)
    try:
        top = run_git(repo, "rev-parse", "--show-toplevel").strip()
        result = impact(top, a.base, a.files, a.symbols)
    except GitError as e:
        print("impact.py : pas un dépôt git, ou git a échoué (%s) : %s" % (repo, e), file=sys.stderr)
        return 2
    if a.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(render(result))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
