import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = await mkdtemp(path.join(os.tmpdir(), 'esko-v5-integration-'));
const dbPath = path.join(dataDir, 'database.json');
let child;
let output='';
let base='';

function launch(){
  output='';
  child=spawn(process.execPath,[path.join(root,'backend/server.mjs')],{
    env:{...process.env,PORT:'',ESKO_HOST:'127.0.0.1',ESKO_PORT:'0',ESKO_DATA_DIR:dataDir,NODE_ENV:'test'},
    stdio:['ignore','pipe','pipe']
  });
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  child.stdout.on('data',chunk=>output+=chunk); child.stderr.on('data',chunk=>output+=chunk);
  return waitForServer();
}
async function waitForServer(){
  const start=Date.now();
  while(Date.now()-start<8000){
    const match=output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if(match)return `http://127.0.0.1:${match[1]}`;
    if(child.exitCode!==null)throw new Error(`server failed: ${output}`);
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  throw new Error(`server timeout: ${output}`);
}
async function stop(){
  if(!child || child.exitCode!==null)return;
  child.kill('SIGTERM');
  await new Promise(resolve=>{child.once('exit',resolve);setTimeout(resolve,800).unref();});
}
async function call(route,{method='GET',body,cookie,origin}={}){
  const response=await fetch(base+route,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(cookie?{cookie}:{}),...(origin?{origin}:{})},body:body?JSON.stringify(body):undefined});
  const data=await response.json().catch(()=>({}));
  const setCookie=response.headers.get('set-cookie');
  return {status:response.status,data,cookie:setCookie?setCookie.split(';')[0]:cookie,response};
}

try{
  base=await launch();
  const health=await call('/api/health');
  assert.equal(health.status,200);assert.equal(health.data.version,'5.0');assert.equal(health.data.messagingTtlHours,7);
  const probe=await fetch(base+'/network-probe.bin');assert.equal(probe.status,200);assert.equal((await probe.arrayBuffer()).byteLength,8192);
  const home=await fetch(base+'/');const html=await home.text();assert.ok(html.includes('V5.0'));assert.ok(home.headers.get('content-security-policy'));
  const reg=await call('/api/account/register',{method:'POST',body:{displayName:'V5 Tester',username:'v5_tester',age:16,password:'V5StrongPass987'}});
  assert.equal(reg.status,201);assert.ok(reg.data.recoveryCode);const cookie=reg.cookie;
  const me=await call('/api/account/me',{cookie});assert.equal(me.status,200);
  const image=await readFile(path.join(root,'public/assets/sea-horizon-v5.webp'));
  assert.ok(image.length<=300*1024);assert.equal(image.toString('ascii',0,4),'RIFF');assert.equal(image.toString('ascii',8,12),'WEBP');
  const data=`data:image/webp;base64,${image.toString('base64')}`;
  const avatar=await call('/api/account/avatar',{method:'POST',cookie,body:{data}});assert.equal(avatar.status,200);
  const avatarGet=await call('/api/account/avatar',{cookie});assert.equal(avatarGet.status,200);assert.equal(avatarGet.data.avatarData,data);
  const tooLarge=await call('/api/account/avatar',{method:'POST',cookie,body:{data:'data:image/webp;base64,'+'A'.repeat(410001)}});assert.equal(tooLarge.status,400);
  const badOrigin=await call('/api/chat/general',{method:'POST',cookie,origin:'https://attacker.invalid',body:{text:'nope'}});assert.equal(badOrigin.status,403);
  const msg=await call('/api/chat/general',{method:'POST',cookie,body:{text:'مرحبًا V5 · temporary'}});assert.equal(msg.status,201);
  const saved=JSON.parse(await readFile(dbPath,'utf8'));
  assert.ok(saved.sessions.length===1 && saved.sessions[0].key!=='');
  assert.ok(!JSON.stringify(saved).includes(cookie.split('=')[1]),'raw session token must not be stored');
  await stop();
  // Persisted, hashed sessions remain valid across a server restart.
  base=await launch();
  const reloaded=await call('/api/account/me',{cookie});assert.equal(reloaded.status,200);
  // Simulate stale chat rows on disk, then verify startup TTL cleanup prunes them.
  const db=JSON.parse(await readFile(dbPath,'utf8'));
  db.general.push({id:'expired',username:'v5_tester',displayName:'V5 Tester',text:'old',createdAt:new Date(Date.now()-8*60*60*1000).toISOString()});
  db.general.push({id:'recent',username:'v5_tester',displayName:'V5 Tester',text:'recent',createdAt:new Date().toISOString()});
  await stop();await writeFile(dbPath,JSON.stringify(db));base=await launch();
  const afterTtl=await call('/api/chat/general',{cookie});assert.equal(afterTtl.status,200);
  assert.ok(!afterTtl.data.messages.some(x=>x.id==='expired'));assert.ok(afterTtl.data.messages.some(x=>x.id==='recent'));
  // Password recovery must invalidate every old session and require a new login.
  const recovered=await call('/api/account/recover',{method:'POST',body:{username:'v5_tester',recoveryCode:reg.data.recoveryCode,newPassword:'V5NewStrongPass765'}});
  assert.equal(recovered.status,200);
  const oldSession=await call('/api/account/me',{cookie});assert.equal(oldSession.status,401);
  const newLogin=await call('/api/account/login',{method:'POST',body:{username:'v5_tester',password:'V5NewStrongPass765'}});assert.equal(newLogin.status,200);
  console.log('PASS: shared health/probe, V5 static shell, account session persistence, hashed session storage, 300KB WebP validation and sync, same-origin protection, 7-hour chat TTL pruning, and session revocation after recovery.');
}finally{await stop();await rm(dataDir,{recursive:true,force:true});}
