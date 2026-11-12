#!/usr/bin/env python3
"""Serve the static PWA on an ephemeral localhost port and verify key assets."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.request import urlopen, Request
import functools

ROOT = Path(__file__).resolve().parents[1] / "web"
PATHS = [
    "/", "/styles.css", "/app.js", "/catalog.json", "/sw.js",
    "/manifest.webmanifest", "/assets/warehouse-security.jpg",
    "/docs/IMPLEMENTATION-MATRIX-AR.md",
    "/academy/ESKO_CPP_Book_80_Pages.pdf",
    "/academy/ESKO_JavaScript_Book_80_Pages.pdf",
]

handler = functools.partial(SimpleHTTPRequestHandler, directory=str(ROOT))
server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
try:
    base = f"http://127.0.0.1:{server.server_port}"
    for path in PATHS:
        request = Request(base + path, method="HEAD")
        with urlopen(request, timeout=5) as response:
            assert response.status == 200, f"{path}: HTTP {response.status}"
            assert int(response.headers.get("Content-Length", "0")) > 0, f"{path}: empty resource"
        print(f"PASS HTTP 200: {path}")
finally:
    server.shutdown()
    server.server_close()
    thread.join(timeout=2)
