#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
node --check "$ROOT/web/app.js"
node --check "$ROOT/web/sw.js"
node "$ROOT/tests/smoke.test.js"
python "$ROOT/tests/http_smoke.py"
python - "$ROOT" <<'PY'
import sys,json,os
root=sys.argv[1]
with open(os.path.join(root,'web','catalog.json'),encoding='utf-8') as f: c=json.load(f)
assert len(c['core']['command_families'])==700
assert len(c['core']['scenario_templates'])==60
assert len(c['core']['server_families'])==200
assert len(c['core']['processor_families'])==400
assert len(c['update02']['modules'])==25
assert c['counts']['core_commands']==700000
assert c['counts']['core_scenarios']==3000
assert c['counts']['update_commands']==1000
assert c['counts']['update_scenarios']==200
for rel in ['index.html','styles.css','app.js','catalog.json','sw.js','assets/warehouse-security.jpg','docs/IMPLEMENTATION-MATRIX-AR.md']:
    assert os.path.isfile(os.path.join(root,'web',rel)),rel
print('PASS: catalog counts and web assets')
PY
printf '\nAll static verification checks passed.\n'
