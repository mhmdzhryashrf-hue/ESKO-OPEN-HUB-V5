const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'web','catalog.json'),'utf8'));
function assert(condition,message){if(!condition)throw new Error(message);}
assert(catalog.core.command_families.length===700,'expected 700 command families');
assert(catalog.core.command_families.every(f=>f.first.endsWith('V0001')&&f.last.endsWith('V1000')),'invalid command family range');
assert(catalog.core.scenario_templates.length===60,'expected 60 scenario templates');
assert(catalog.core.scenario_templates.reduce((n,s)=>n+s.variants,0)===3000,'expected 3000 core scenario IDs');
assert(catalog.core.server_families.length===200,'expected 200 logical server families');
assert(catalog.core.processor_families.length===400,'expected 400 processor families');
assert(catalog.update02.modules.length===25,'expected 25 update modules');
assert(catalog.update02.modules.reduce((n,m)=>n+m.commands,0)===1000,'expected 1000 update commands');
assert(catalog.update02.modules.reduce((n,m)=>n+m.scenarios,0)===200,'expected 200 update scenarios');
assert(catalog.update02.modules.reduce((n,m)=>n+m.logical_services,0)===100,'expected 100 update services');
assert(catalog.update02.modules.reduce((n,m)=>n+m.processors,0)===150,'expected 150 update processors');
assert(catalog.core.command_families.some(f=>f.source==='generated-gap-record'),'gap records must be clearly marked');
console.log('PASS: smoke.test.js - source catalog totals and ranges');
