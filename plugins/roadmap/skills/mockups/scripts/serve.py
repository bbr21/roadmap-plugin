#!/usr/bin/env python3
"""Serve a mockup page over local http for the browser pane (#369).

Usage:
  python3 serve.py <page.html> [--root DIR] [--idle SECONDS]
  python3 serve.py --stop [--root DIR | <page.html>]

Prints one line, http://127.0.0.1:<port>/<token>/<percent-encoded path of the
page relative to the root>, and exits 0. Exit 2 (message on stderr) when the page
is missing, is not .html/.htm, or lies outside the root.

One server per project root, reused while it runs. It listens on 127.0.0.1
only, serves the root read-only, and only under a random per-server token
(first path segment; anything else is 404). It serves an allowlist of web
extensions only, answers 404 to any dot-path (.env, .git...) and to directory
listings, 403 to a foreign Host header, and stops by itself after --idle
seconds (default 7200) without a request.
State file: $TMPDIR/roadmap-maquettes/<sha1(realpath root)[:12]>.json
{"root","port","pid","token"}, in a private (0700, owned, non-symlink) dir,
written atomically via mkstemp. The state is trusted only when the server
answers GET /<token>/__roadmap-maquettes with the token and its pid; a pid is
never signalled otherwise.
Python 3.9, standard library only.
"""
import hashlib
import http.client
import http.server
import json
import hmac
import mimetypes
import os
import secrets
import signal
import stat
import subprocess
import sys
import tempfile
import threading
import time
import urllib.parse

DEFAULT_IDLE = 7200
PROBE = "__roadmap-maquettes"
ALLOWED_EXT = (".html", ".htm", ".css", ".js", ".mjs", ".json", ".svg", ".png", ".jpg", ".jpeg",
               ".gif", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".txt", ".csv")


def project_root(page):
    """Nearest ancestor holding .git (file or dir) or .claude/roadmap.json, else the page's folder."""
    start = os.path.dirname(os.path.realpath(page))
    cur = start
    while True:
        if os.path.exists(os.path.join(cur, ".git")) or os.path.isfile(
                os.path.join(cur, ".claude", "roadmap.json")):
            return cur
        parent = os.path.dirname(cur)
        if parent == cur:
            return start
        cur = parent


def state_path(root):
    key = hashlib.sha1(os.path.realpath(root).encode("utf-8")).hexdigest()[:12]
    return os.path.join(tempfile.gettempdir(), "roadmap-maquettes", key + ".json")


def page_url(root, page, port, token=None):
    token = token or server_token(root)
    rel = os.path.relpath(os.path.realpath(page), os.path.realpath(root))
    return "http://127.0.0.1:%d/%s/%s" % (port, token, urllib.parse.quote(rel.replace(os.sep, "/")))


def _check_dir(create):
    """The private state dir, refusing one that is not ours, a symlink, or group/world-writable."""
    d = os.path.dirname(state_path("/"))
    try:
        st = os.lstat(d)
    except FileNotFoundError:
        if not create:
            return None
        os.makedirs(d, mode=0o700, exist_ok=True)
        st = os.lstat(d)
    if stat.S_ISLNK(st.st_mode) or not stat.S_ISDIR(st.st_mode) or st.st_uid != os.getuid() \
            or st.st_mode & 0o022:
        raise RuntimeError("le dossier d'état %s n'est pas privé (propriétaire, droits ou lien) : "
                           "supprime-le ou corrige-le" % d)
    return d


def _read_state(root):
    if _check_dir(False) is None:
        return None
    try:
        with open(state_path(root), encoding="utf-8") as f:
            st = json.load(f)
        return int(st["port"]), int(st["pid"]), str(st["token"])
    except (OSError, ValueError, KeyError, TypeError):
        return None


def server_token(root):
    st = _read_state(os.path.realpath(root))
    return st[2] if st else None


def _remove_state(root):
    try:
        os.remove(state_path(root))
    except OSError:
        pass


def _verified(st):
    """True when the server on st's port proves it holds st's token and pid."""
    port, pid, token = st
    try:
        conn = http.client.HTTPConnection("127.0.0.1", port, timeout=2)
        conn.request("GET", "/%s/%s" % (token, PROBE), headers={"Host": "127.0.0.1:%d" % port})
        r = conn.getresponse()
        body = r.read(200).decode("utf-8", "replace")
        header_pid = r.getheader("X-Roadmap-Pid")
        conn.close()
    except (OSError, http.client.HTTPException):
        return False
    return r.status == 200 and hmac.compare_digest(body, token) and header_pid == str(pid) \
        and _pid_alive(pid)


def _pid_alive(pid):
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def ensure_server(root, idle):
    """Return the port of the root's server, starting it detached when needed."""
    root = os.path.realpath(root)
    _check_dir(True)
    st = _read_state(root)
    if st and _verified(st):
        return st[0]
    _remove_state(root)
    proc = subprocess.Popen(
        [sys.executable, "-I", os.path.abspath(__file__), "--serve", root, "--idle", str(idle)],
        start_new_session=True, stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    deadline = time.time() + 5
    while time.time() < deadline:
        st = _read_state(root)
        if st and st[1] == proc.pid:
            return st[0]
        if proc.poll() is not None:
            break
        time.sleep(0.05)
    raise RuntimeError("le serveur de maquettes n'a pas démarré")


def stop_server(root):
    """Stop the root's server. True when one was running (and proved to be ours)."""
    root = os.path.realpath(root)
    st = _read_state(root)
    if not st:
        return False
    verified = _verified(st)
    _remove_state(root)
    if not verified:
        return False
    try:
        os.kill(st[1], signal.SIGTERM)
    except OSError:
        return False
    for _ in range(50):
        try:
            done, _status = os.waitpid(st[1], os.WNOHANG)  # reap when it is our child
            if done:
                break
        except ChildProcessError:
            if not _pid_alive(st[1]):
                break
        time.sleep(0.05)
    return True


class Handler(http.server.BaseHTTPRequestHandler):
    server_version = "roadmap-maquettes"

    def log_message(self, *args):
        pass

    def _send(self, code, body=b"", ctype="text/plain; charset=utf-8", head=False):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if not head:
            self.wfile.write(body)

    def _handle(self, head):
        self.server.touch()
        port = self.server.server_address[1]
        if self.headers.get("Host") not in ("127.0.0.1:%d" % port, "localhost:%d" % port):
            return self._send(403, b"forbidden", head=head)
        path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
        parts = [p for p in path.split("/") if p]
        if not parts or not hmac.compare_digest(parts[0], self.server.token):
            return self._send(404, b"not found", head=head)
        parts = parts[1:]
        if parts == [PROBE]:
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(self.server.token)))
            self.send_header("X-Roadmap-Pid", str(os.getpid()))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if not head:
                self.wfile.write(self.server.token.encode("utf-8"))
            return
        if not parts or parts[-1].lower().endswith(".") or not parts[-1].lower().endswith(ALLOWED_EXT):
            return self._send(404, b"not found", head=head)
        if any(p.startswith(".") or "\x00" in p for p in parts):
            return self._send(404, b"not found", head=head)
        root = self.server.root
        full = os.path.realpath(os.path.join(root, *parts))
        if full != root and not full.startswith(root + os.sep):
            return self._send(404, b"not found", head=head)
        if not os.path.isfile(full):
            return self._send(404, b"not found", head=head)
        try:
            with open(full, "rb") as f:
                data = f.read()
        except OSError:
            return self._send(404, b"not found", head=head)
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        self._send(200, data, ctype, head)

    def do_GET(self):
        self._handle(False)

    def do_HEAD(self):
        self._handle(True)


class Server(http.server.ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, root):
        super().__init__(("127.0.0.1", 0), Handler)
        self.root = root
        self.token = secrets.token_urlsafe(16)
        self.last = time.time()

    def touch(self):
        self.last = time.time()


def serve_forever(root, idle):
    root = os.path.realpath(root)
    srv = Server(root)
    path = state_path(root)
    d = _check_dir(True)
    fd, tmp = tempfile.mkstemp(dir=d, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump({"root": root, "port": srv.server_address[1], "pid": os.getpid(),
                   "token": srv.token}, f)
    os.replace(tmp, path)
    stopping = threading.Event()
    signal.signal(signal.SIGTERM, lambda *_: stopping.set())
    threading.Thread(target=srv.serve_forever, kwargs={"poll_interval": 0.2}, daemon=True).start()
    try:
        while time.time() - srv.last < idle and not stopping.wait(0.2):
            pass
    finally:
        st = _read_state(root)
        if st and st[1] == os.getpid():
            try:
                os.remove(path)
            except OSError:
                pass
        srv.shutdown()
    return 0


def _fail(msg):
    sys.stderr.write(msg + "\n")
    return 2


def main(argv):
    args = list(argv)
    root = idle = serve_root = None
    stop = False
    pages = []
    i = 0
    try:
        while i < len(args):
            a = args[i]
            if a == "--root":
                root = args[i + 1]; i += 2
            elif a == "--idle":
                idle = int(args[i + 1]); i += 2
            elif a == "--serve":
                serve_root = args[i + 1]; i += 2
            elif a == "--stop":
                stop = True; i += 1
            elif a.startswith("--"):
                return _fail("option inconnue : %s" % a)
            else:
                pages.append(a); i += 1
    except (IndexError, ValueError):
        return _fail("usage : serve.py <page.html> [--root DIR] [--idle SECONDS] | --stop [--root DIR | <page.html>]")
    if serve_root is not None:
        return serve_forever(serve_root, idle or DEFAULT_IDLE)
    if stop:
        if root is None and pages:
            root = project_root(pages[0])
        if root is None:
            return _fail("--stop demande --root DIR ou une page")
        try:
            stop_server(root)
        except RuntimeError as e:
            return _fail(str(e))
        return 0
    if len(pages) != 1:
        return _fail("usage : serve.py <page.html> [--root DIR] [--idle SECONDS]")
    page = os.path.realpath(pages[0])
    if not os.path.isfile(page):
        return _fail("page introuvable : %s" % pages[0])
    if not page.lower().endswith((".html", ".htm")):
        return _fail("la page doit être un fichier .html ou .htm : %s" % pages[0])
    root = os.path.realpath(root) if root else project_root(page)
    if not page.startswith(root + os.sep):
        return _fail("la page est hors du dossier servi (%s) : %s" % (root, pages[0]))
    try:
        port = ensure_server(root, idle or DEFAULT_IDLE)
    except RuntimeError as e:
        return _fail(str(e))
    print(page_url(root, page, port))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
