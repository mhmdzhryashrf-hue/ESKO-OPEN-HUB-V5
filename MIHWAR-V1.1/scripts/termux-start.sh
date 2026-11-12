#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
command -v python >/dev/null 2>&1 || { echo 'Install Python first: pkg install python'; exit 1; }
echo 'MIHWAR local web server: http://127.0.0.1:8080'
echo 'Stop with CTRL+C'
exec python -m http.server 8080 --directory "$ROOT/web"
