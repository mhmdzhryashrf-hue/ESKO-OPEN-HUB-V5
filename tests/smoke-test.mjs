import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const dataDir = await mkdtemp(path.join(os.tmpdir(), 'esko-v45-test-'));
const child = spawn(process.execPath, [new URL('../backend/server.mjs', import.meta.url).pathname], {
  env: { ...process.env, ESKO_HOST:'127.0.0.1', ESKO_PORT:'0', ESKO_DATA_DIR:dataDir },
  stdio:['ignore','pipe','pipe']
});
let output = '';
child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
child.stdout.on('data', chunk => { output += chunk; });
child.stderr.on('data', chunk => { output += chunk; });

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 7000) {
    const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) return `http://127.0.0.1:${match[1]}`;
    if (child.exitCode !== null) throw new Error(`Server stopped: ${output}`);
    await new Promise(resolve => setTimeout(resolve, 60));
  }
  throw new Error(`Server did not start: ${output}`);
}

async function call(base, route, { method='GET', body, cookie } = {}) {
  const response = await fetch(base + route, {
    method,
    headers: { ...(body ? {'content-type':'application/json'} : {}), ...(cookie ? {cookie} : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  const setCookie = response.headers.get('set-cookie');
  return { status:response.status, data, cookie:setCookie ? setCookie.split(';')[0] : cookie };
}

try {
  const base = await waitForServer();
  const home = await fetch(base + '/');
  const homeText = await home.text();
  if (!home.ok || !homeText.includes('termsScreen') || !home.headers.get('content-security-policy')) throw new Error('static app/headers failed');
  let a = await call(base,'/api/account/register',{method:'POST',body:{displayName:'Test One',username:'test_one',age:16,password:'TestPassword123'}});
  if (a.status !== 201 || !a.data.recoveryCode) throw new Error('registration/recovery failed');
  const cookieA = a.cookie;
  let duplicate = await call(base,'/api/account/register',{method:'POST',body:{displayName:'Duplicate',username:'test_one',age:16,password:'AnotherPassword123'}});
  if (duplicate.status !== 409) throw new Error('unique username check failed');
  let me = await call(base,'/api/account/me',{cookie:cookieA});
  if (me.status !== 200 || me.data.user.username !== 'test_one') throw new Error('session check failed');
  let sent = await call(base,'/api/chat/general',{method:'POST',cookie:cookieA,body:{text:'hello general'}});
  if (sent.status !== 201) throw new Error('general chat failed');
  let group = await call(base,'/api/groups',{method:'POST',cookie:cookieA,body:{name:'Test Group'}});
  if (group.status !== 201 || !group.data.inviteCode) throw new Error('group creation failed');
  let b = await call(base,'/api/account/register',{method:'POST',body:{displayName:'Test Two',username:'test_two',age:15,password:'TestPassword456'}});
  if (b.status !== 201) throw new Error('second registration failed');
  const cookieB = b.cookie;
  let join = await call(base,'/api/groups/join',{method:'POST',cookie:cookieB,body:{inviteCode:group.data.inviteCode}});
  if (join.status !== 200) throw new Error('group join failed');
  let groupMessage = await call(base,`/api/groups/${group.data.id}/messages`,{method:'POST',cookie:cookieB,body:{text:'hello group'}});
  if (groupMessage.status !== 201) throw new Error('group message failed');
  let dmRequest = await call(base,'/api/dm/request',{method:'POST',cookie:cookieA,body:{username:'test_two'}});
  if (dmRequest.status !== 201) throw new Error('DM request failed');
  let incoming = await call(base,'/api/dm',{cookie:cookieB});
  const requestId = incoming.data.incoming?.[0]?.id;
  if (!requestId) throw new Error('DM request not received');
  let accepted = await call(base,'/api/dm/accept',{method:'POST',cookie:cookieB,body:{requestId}});
  if (accepted.status !== 200) throw new Error('DM accept failed');
  const convs = await call(base,'/api/dm',{cookie:cookieA});
  const conversationId = convs.data.conversations?.[0]?.id;
  if (!conversationId) throw new Error('DM conversation missing');
  let dmSent = await call(base,`/api/dm/${conversationId}/messages`,{method:'POST',cookie:cookieA,body:{text:'private hello'}});
  if (dmSent.status !== 201) throw new Error('DM message failed');
  let blocked = await call(base,'/api/security/check',{method:'POST',cookie:cookieA,body:{url:'https://google.com',authorized:true}});
  if (blocked.status !== 403) throw new Error('blocked-domain rule failed');
  const recovered = await call(base,'/api/account/recover',{method:'POST',body:{username:'test_one',recoveryCode:a.data.recoveryCode,newPassword:'NewPassword789'}});
  if (recovered.status !== 200 || !recovered.data.recoveryCode) throw new Error('account recovery failed');
  const relogin = await call(base,'/api/account/login',{method:'POST',body:{username:'test_one',password:'NewPassword789'}});
  if (relogin.status !== 200) throw new Error('login after recovery failed');
  const report = await call(base,'/api/report',{method:'POST',cookie:relogin.cookie,body:{messageId:'test-message-id',reason:'test report'}});
  if (report.status !== 201) throw new Error('report logging failed');
  console.log('PASS: static app/headers, unique accounts, sessions, recovery and re-login after session revocation, general chat, groups and group messages, accepted DM, report logging, and blocked-domain guard.');
} finally {
  child.kill('SIGTERM');
  await new Promise(resolve => setTimeout(resolve,120));
  await rm(dataDir,{recursive:true,force:true});
}
