'use strict';
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('./catalog.json');
const commonLinks = fs.readFileSync(path.join(__dirname, 'auto-links.cjs'), 'utf8');
const outRoot = path.resolve(process.argv[2] || path.join(process.env.HOME || process.cwd(), 'ESKO-BOTS-V5-TEMPLATES'));

function safeName(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content, { flag: 'wx' }); }
fs.mkdirSync(outRoot, { recursive: true });
let created=0, skipped=0;
for (const bot of catalog) {
  const folder = path.join(outRoot, `ESKO-BOT-${String(bot.id).padStart(2,'0')}-${safeName(bot.name)}`);
  if (fs.existsSync(folder)) { skipped++; continue; }
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, '.esko-bot-template'), `ESKO BOT ${bot.id}\n`, { flag:'wx' });
  write(path.join(folder, 'package.json'), JSON.stringify({name:`esko-bot-${String(bot.id).padStart(2,'0')}-${safeName(bot.name)}`,version:'1.0.0',private:true,description:bot.desc,main:'src/index.js',scripts:{start:'node src/index.js',test:'node tests/smoke.test.js'},engines:{node: '>=20'}},null,2)+'\n');
  write(path.join(folder, '.env.example'), 'BOT_TOKEN=\nPUBLIC_BASE_URL=\nLOG_LEVEL=info\n');
  write(path.join(folder, '.gitignore'), '.env\nnode_modules/\nlogs/\n*.log\n');
  write(path.join(folder, 'src/auto-links.js'), commonLinks);
  write(path.join(folder, 'src/index.js'), `\n'use strict';\nconst { createAutoLinkSender } = require('./auto-links');\nconst BOT = Object.freeze(${JSON.stringify(bot,null,2)});\n\nfunction createBot(transport) {\n  if (!transport || typeof transport.send !== 'function') throw new TypeError('Provide a platform transport with send(destination, payload)');\n  const send = createAutoLinkSender(transport.send.bind(transport));\n  async function handle(input) {\n    const text = String(input && input.text || '').trim();\n    if (!text) return 'اكتب رسالة أو أمرًا صالحًا.';\n    return 'مرحبًا بك في ' + BOT.name + '. هذا قالب أولي مستقل؛ اربط منطق ' + BOT.desc.replace(/'/g, '') + ' بمحوّل منصتك بعد مراجعة الصلاحيات.';\n  }\n  return Object.freeze({ profile: BOT, handle, send });\n}\n\nif (require.main === module) {\n  console.log(BOT.name + ' — قالب ESKO جاهز للتخصيص.');\n  console.log('أضف محوّل المنصة ومفاتيحها محليًا؛ لا تضع الرموز داخل الكود.');\n}\nmodule.exports = { BOT, createBot };\n`);
  write(path.join(folder, 'tests/smoke.test.js'), `\n'use strict';\nconst assert = require('node:assert/strict');\nconst { createAutoLinkSender, OFFICIAL_LINK_CARDS } = require('../src/auto-links');\nassert.equal(OFFICIAL_LINK_CARDS.length, 3);\nlet sent;\nconst sender = createAutoLinkSender(async (to, payload) => { sent = {to,payload}; return true; });\nsender('test-user', 'رسالة اختبار').then(() => {\n  assert.equal(sent.to, 'test-user');\n  for (const card of OFFICIAL_LINK_CARDS) assert.ok(sent.payload.text.includes(card.url));\n  console.log('PASS: official links are added to outbound messages');\n}).catch(err => { console.error(err); process.exitCode = 1; });\n`);
  write(path.join(folder, 'README.md'), `# ${bot.name}\n\n- **ESKO Bot ID:** ${bot.id}\n- **المجموعة:** ${bot.group}\n- **الوصف:** ${bot.desc}\n\n## التشغيل الأولي\n\n1. راجع ` + '`src/index.js`' + ` واربط منصة البوت بمحوّل ` + '`transport.send`' + `.\n2. انسخ ` + '`.env.example`' + ` إلى ` + '`.env`' + ` واملأ القيم محليًا.\n3. نفّذ ` + '`npm test`' + ` ثم ` + '`npm start`' + `.\n\n## بطاقات ESKO التلقائية\n\nكل إرسال يجب أن يمر عبر ` + '`createAutoLinkSender`' + ` من ` + '`src/auto-links.js`' + `. الوحدة تضيف القناة الرسمية والاحتياطية والدعم الفني تلقائيًا.\n\n**تنبيه:** هذا قالب مشروع، وليس اتصالًا حيًا بمنصة خارجية. لا تضع رموز الوصول في المستودع ولا تمنح البوت صلاحيات لا يحتاجها.\n`);
  created++;
}
console.log(JSON.stringify({output:outRoot,created,skipped,total:catalog.length},null,2));
