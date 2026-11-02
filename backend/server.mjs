import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { randomBytes, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = process.env.ESKO_DATA_DIR ? path.resolve(process.env.ESKO_DATA_DIR) : path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const HOST = process.env.ESKO_HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
const PORT = Number(process.env.PORT || process.env.ESKO_PORT || 8788);
const PRODUCTION = process.env.NODE_ENV === 'production';
const MAX_BODY = 500 * 1024;
const MESSAGE_TTL_MS = 7 * 60 * 60 * 1000;
const SESSION_MS = 12 * 60 * 60 * 1000;
const PUBLICLY_BLOCKED = [
  'google.com','youtube.com','facebook.com','instagram.com','whatsapp.com','github.com',
  'microsoft.com','apple.com','amazon.com','tiktok.com','x.com','twitter.com','telegram.org',
  'openai.com','cloudflare.com','wikipedia.org','reddit.com','netflix.com','linkedin.com'
];
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp' };

const emptyDB = () => ({ users: [], sessions: [], general: [], groups: [], dmRequests: [], conversations: [], blocks: [], reports: [] });
let database = emptyDB();
const sessions = new Map();
const rate = new Map();
let writeQueue = Promise.resolve();

function json(res, status, value, headers = {}) {
  const body = Buffer.from(JSON.stringify(value));
  res.writeHead(status, { ...securityHeaders(), 'Content-Type':'application/json; charset=utf-8', 'Content-Length':body.length, 'Cache-Control':'no-store', ...headers });
  res.end(body);
}
function securityHeaders() {
  const headers = {
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'X-Frame-Options':'DENY',
    'Cross-Origin-Opener-Policy':'same-origin',
    'Cross-Origin-Resource-Policy':'same-origin',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy':"default-src 'self'; script-src 'self' https://cse.google.com https://www.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.gstatic.com; connect-src 'self' https://cse.google.com https://www.google.com; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  };
  if (PRODUCTION) headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  return headers;
}
function randomToken(bytes = 32) { return randomBytes(bytes).toString('base64url'); }
function sessionKey(token) { return createHash('sha256').update(String(token)).digest('hex'); }
function cookieMap(req) {
  const out = {};
  for (const item of (req.headers.cookie || '').split(';')) {
    const index = item.indexOf('=');
    if (index > 0) out[item.slice(0,index).trim()] = decodeURIComponent(item.slice(index+1).trim());
  }
  return out;
}
function getUser(req) {
  const token = cookieMap(req).esko_session;
  const key = token ? sessionKey(token) : null;
  const session = key ? sessions.get(key) : null;
  if (!session || session.expiresAt < Date.now()) { if (key) sessions.delete(key); return null; }
  return database.users.find(user => user.id === session.userId) || null;
}
function publicUser(user) { return { username:user.username, displayName:user.displayName, createdAt:user.createdAt, hasAvatar:Boolean(user.avatarData) }; }
function requireUser(req, res) {
  const user = getUser(req);
  if (!user) { json(res, 401, { error:'سجّل الدخول أولًا.' }); return null; }
  return user;
}
function blockedBetween(a, b) {
  return database.blocks.some(item => (item.owner === a && item.target === b) || (item.owner === b && item.target === a));
}
function rateLimit(req, res, bucket, max = 60, windowMs = 60_000) {
  const ip = req.socket.remoteAddress || 'local';
  const key = `${ip}:${bucket}`;
  const now = Date.now();
  const record = rate.get(key) || { start:now, count:0 };
  if (now - record.start > windowMs) { record.start = now; record.count = 0; }
  record.count += 1; rate.set(key, record);
  if (record.count > max) { json(res, 429, { error:'طلبات كثيرة بسرعة. انتظر دقيقة ثم حاول.' }, { 'Retry-After':'60' }); return false; }
  return true;
}
async function readBody(req) {
  const chunks = []; let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > MAX_BODY) throw Object.assign(new Error('حجم الطلب أكبر من المسموح.'), { status:413 });
    chunks.push(chunk);
  }
  if (!length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw Object.assign(new Error('بيانات الطلب غير صالحة.'), { status:400 }); }
}
async function persist() {
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    const temp = `${DB_FILE}.tmp`;
    await fs.writeFile(temp, JSON.stringify(database), { mode:0o600 });
    await fs.rename(temp, DB_FILE);
    try { await fs.chmod(DB_FILE, 0o600); } catch {}
  });
  return writeQueue;
}
function validateOrigin(req) {
  const origin = req.headers.origin;
  const mutating = !['GET','HEAD','OPTIONS'].includes(req.method || 'GET');
  if (!origin) return !PRODUCTION || !mutating;
  try {
    const parsed = new URL(origin);
    return parsed.host === req.headers.host && (PRODUCTION ? parsed.protocol === 'https:' : ['https:','http:'].includes(parsed.protocol));
  } catch { return false; }
}

function pruneExpiredMessages() {
  const cutoff = Date.now() - MESSAGE_TTL_MS;
  let changed = false;
  const keep = message => {
    const time = Date.parse(message?.createdAt || '');
    return Number.isFinite(time) && time >= cutoff;
  };
  const trim = list => { const next = list.filter(keep); if (next.length !== list.length) changed = true; return next; };
  database.general = trim(database.general || []);
  for (const group of database.groups || []) group.messages = trim(group.messages || []);
  for (const conversation of database.conversations || []) conversation.messages = trim(conversation.messages || []);
  return changed;
}
function sessionCookie(token) {
  return `esko_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(SESSION_MS/1000)}${PRODUCTION ? '; Secure' : ''}`;
}
async function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  const result = await scrypt(password, salt, 64);
  return { salt, hash:Buffer.from(result).toString('hex') };
}
async function passwordMatches(password, salt, storedHash) {
  const candidate = await scrypt(password, salt, 64);
  const expected = Buffer.from(storedHash, 'hex');
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function normalizeUsername(value) { return String(value || '').trim().toLowerCase(); }
function validateUsername(value) { return /^[a-z0-9_]{3,20}$/.test(value); }
function validatePassword(value) { return typeof value === 'string' && value.length >= 10 && value.length <= 128; }
function textValue(value, max = 1000) { return typeof value === 'string' ? value.trim().slice(0,max) : ''; }
function messageRecord(user, text) { return { id:randomToken(12), username:user.username, displayName:user.displayName, text, createdAt:new Date().toISOString() }; }
async function routeAPI(req, res, url) {
  if (!validateOrigin(req)) return json(res, 403, { error:'مصدر الطلب غير مسموح.' });
  const method = req.method;
  const p = url.pathname;
  if (method === 'GET' && p === '/api/health') return json(res, 200, { ok:true, version:'5.0', storage:'persistent-json-volume', messagingTtlHours:7, realtime:'5s-polling' });

  if (method === 'POST' && p === '/api/account/register') {
    if (!rateLimit(req,res,'register',5)) return;
    const body = await readBody(req);
    const username = normalizeUsername(body.username);
    const displayName = textValue(body.displayName,40);
    const age = Number(body.age);
    if (!validateUsername(username)) return json(res,400,{error:'اسم المستخدم لازم يكون 3–20 حرف إنجليزي أو رقم أو _.'});
    if (displayName.length < 2) return json(res,400,{error:'اكتب اسمًا ظاهرًا من حرفين على الأقل.'});
    if (!Number.isInteger(age) || age < 13 || age > 17) return json(res,400,{error:'هذا الإصدار التجريبي مخصص للأعمار من 13 إلى 17 سنة.'});
    if (!validatePassword(body.password)) return json(res,400,{error:'كلمة المرور يجب أن تكون من 10 أحرف على الأقل.'});
    if (database.users.some(user => user.username === username)) return json(res,409,{error:'اسم المستخدم مسجل بالفعل؛ اختر اسمًا مختلفًا.'});
    const pass = await passwordHash(body.password);
    const recoveryCode = randomToken(12).toUpperCase();
    const recovery = await passwordHash(recoveryCode);
    const user = { id:randomToken(16), username, displayName, age, passwordSalt:pass.salt, passwordHash:pass.hash, recoverySalt:recovery.salt, recoveryHash:recovery.hash, createdAt:new Date().toISOString() };
    database.users.push(user); await persist();
    const token = randomToken(); const expiresAt=Date.now()+SESSION_MS; const key=sessionKey(token); sessions.set(key,{userId:user.id,expiresAt}); database.sessions.push({key,userId:user.id,expiresAt}); await persist();
    return json(res,201,{user:publicUser(user),recoveryCode},{'Set-Cookie':sessionCookie(token)});
  }

  if (method === 'POST' && p === '/api/account/login') {
    if (!rateLimit(req,res,'login',8)) return;
    const body = await readBody(req); const username = normalizeUsername(body.username);
    const user = database.users.find(item => item.username === username);
    if (!user || typeof body.password !== 'string' || !await passwordMatches(body.password,user.passwordSalt,user.passwordHash)) return json(res,401,{error:'اسم المستخدم أو كلمة المرور غير صحيحة.'});
    const token = randomToken(); const expiresAt=Date.now()+SESSION_MS; const key=sessionKey(token); sessions.set(key,{userId:user.id,expiresAt}); database.sessions.push({key,userId:user.id,expiresAt}); await persist();
    return json(res,200,{user:publicUser(user)},{'Set-Cookie':sessionCookie(token)});
  }

  if (method === 'POST' && p === '/api/account/recover') {
    if (!rateLimit(req,res,'recover',5)) return;
    const body = await readBody(req); const username = normalizeUsername(body.username);
    const user = database.users.find(item => item.username === username);
    if (!user || typeof body.recoveryCode !== 'string' || !await passwordMatches(body.recoveryCode.trim().toUpperCase(),user.recoverySalt,user.recoveryHash)) return json(res,401,{error:'بيانات الاسترجاع غير صحيحة.'});
    if (!validatePassword(body.newPassword)) return json(res,400,{error:'كلمة المرور الجديدة يجب أن تكون 10 أحرف على الأقل.'});
    const pass = await passwordHash(body.newPassword); const recoveryCode = randomToken(12).toUpperCase(); const recovery = await passwordHash(recoveryCode);
    user.passwordSalt=pass.salt; user.passwordHash=pass.hash; user.recoverySalt=recovery.salt; user.recoveryHash=recovery.hash;
    for (const [key, session] of sessions) if (session.userId === user.id) sessions.delete(key);
    database.sessions = database.sessions.filter(session => session.userId !== user.id);
    await persist();
    return json(res,200,{ok:true,recoveryCode});
  }

  if (method === 'GET' && p === '/api/account/me') {
    const user = requireUser(req,res); if (!user) return;
    return json(res,200,{user:publicUser(user)});
  }

  if (p === '/api/account/avatar' && (method === 'GET' || method === 'POST')) {
    const user = requireUser(req,res); if (!user) return;
    if (method === 'GET') return json(res,200,{avatarData:user.avatarData || null});
    const body = await readBody(req);
    const data = typeof body.data === 'string' ? body.data : '';
    if (!/^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(data) || data.length > 410_000) return json(res,400,{error:'الصورة يجب أن تكون WebP مضغوطة وبحجم أقصى 300KB.'});
    const imageBytes=Buffer.from(data.slice('data:image/webp;base64,'.length),'base64');
    if(imageBytes.length>300*1024 || imageBytes.toString('ascii',0,4)!=='RIFF' || imageBytes.toString('ascii',8,12)!=='WEBP') return json(res,400,{error:'ملف الصورة غير صالح أو يتجاوز 300KB.'});
    user.avatarData = data; await persist();
    return json(res,200,{ok:true});
  }

  if (method === 'POST' && p === '/api/account/logout') {
    const token = cookieMap(req).esko_session; if (token) { const key=sessionKey(token); sessions.delete(key); database.sessions=database.sessions.filter(session=>session.key!==key); await persist(); }
    return json(res,200,{ok:true},{'Set-Cookie':'esko_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});
  }

  if (method === 'GET' && p === '/api/chat/general') {
    const user = requireUser(req,res); if (!user) return;
    return json(res,200,{messages:database.general.slice(-120)});
  }
  if (method === 'POST' && p === '/api/chat/general') {
    const user = requireUser(req,res); if (!user) return;
    if (!rateLimit(req,res,`msg:${user.id}`,18,60_000)) return;
    const body = await readBody(req); const text = textValue(body.text,1000);
    if (text.length < 1) return json(res,400,{error:'الرسالة فارغة.'});
    database.general.push(messageRecord(user,text)); database.general=database.general.slice(-250); await persist();
    return json(res,201,{ok:true});
  }

  if (method === 'POST' && p === '/api/groups') {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const name = textValue(body.name,40);
    if (name.length < 2) return json(res,400,{error:'اسم المجموعة قصير.'});
    const group = { id:randomToken(12), name, owner:user.id, members:[user.id], inviteCode:randomToken(12), messages:[], createdAt:new Date().toISOString() };
    database.groups.push(group); await persist();
    return json(res,201,{id:group.id,inviteCode:group.inviteCode,name:group.name});
  }
  if (method === 'GET' && p === '/api/groups') {
    const user = requireUser(req,res); if (!user) return;
    const groups = database.groups.filter(g => g.members.includes(user.id)).map(g => ({id:g.id,name:g.name,memberCount:g.members.length,isOwner:g.owner===user.id,inviteCode:g.inviteCode}));
    return json(res,200,{groups});
  }
  if (method === 'POST' && p === '/api/groups/join') {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const code = textValue(body.inviteCode,80);
    const group = database.groups.find(g => g.inviteCode === code);
    if (!group) return json(res,404,{error:'رابط أو كود الدعوة غير صالح.'});
    if (!group.members.includes(user.id)) group.members.push(user.id);
    await persist(); return json(res,200,{ok:true,groupId:group.id});
  }
  const groupMatch = p.match(/^\/api\/groups\/([A-Za-z0-9_-]+)\/messages$/);
  if (groupMatch && (method === 'GET' || method === 'POST')) {
    const user = requireUser(req,res); if (!user) return;
    const group = database.groups.find(g => g.id === groupMatch[1]);
    if (!group || !group.members.includes(user.id)) return json(res,404,{error:'المجموعة غير موجودة أو لست عضوًا بها.'});
    if (method === 'GET') return json(res,200,{messages:group.messages.slice(-120)});
    if (!rateLimit(req,res,`group:${user.id}`,20,60_000)) return;
    const body = await readBody(req); const text = textValue(body.text,1000);
    if (!text) return json(res,400,{error:'الرسالة فارغة.'});
    group.messages.push(messageRecord(user,text)); group.messages=group.messages.slice(-200); await persist();
    return json(res,201,{ok:true});
  }

  if (method === 'POST' && p === '/api/dm/request') {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const username = normalizeUsername(body.username);
    const target = database.users.find(u => u.username === username);
    if (!target || target.id === user.id) return json(res,404,{error:'الحساب غير موجود.'});
    if (blockedBetween(user.id,target.id)) return json(res,403,{error:'لا يمكن إنشاء طلب بسبب إعدادات الحظر.'});
    const exists = database.conversations.find(c => c.members.includes(user.id) && c.members.includes(target.id));
    if (exists) return json(res,409,{error:'المحادثة موجودة بالفعل.'});
    const pending = database.dmRequests.find(r => r.from === user.id && r.to === target.id && r.status === 'pending');
    if (pending) return json(res,200,{ok:true,pending:true});
    database.dmRequests.push({id:randomToken(12),from:user.id,to:target.id,status:'pending',createdAt:new Date().toISOString()}); await persist();
    return json(res,201,{ok:true});
  }
  if (method === 'GET' && p === '/api/dm') {
    const user = requireUser(req,res); if (!user) return;
    const incoming = database.dmRequests.filter(r => r.to===user.id && r.status==='pending').map(r => ({id:r.id,username:database.users.find(u=>u.id===r.from)?.username || 'unknown'}));
    const conversations = database.conversations.filter(c=>c.members.includes(user.id)).map(c=>({id:c.id,username:database.users.find(u=>u.id===c.members.find(id=>id!==user.id))?.username || 'unknown'}));
    return json(res,200,{incoming,conversations});
  }
  if (method === 'POST' && (p === '/api/dm/accept' || p === '/api/dm/decline')) {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const request = database.dmRequests.find(r => r.id===body.requestId && r.to===user.id && r.status==='pending');
    if (!request) return json(res,404,{error:'الطلب غير موجود.'});
    request.status = p.endsWith('accept') ? 'accepted' : 'declined';
    if (request.status==='accepted' && !blockedBetween(user.id,request.from)) database.conversations.push({id:randomToken(12),members:[request.from,user.id],messages:[],createdAt:new Date().toISOString()});
    await persist(); return json(res,200,{ok:true});
  }
  const dmMatch = p.match(/^\/api\/dm\/([A-Za-z0-9_-]+)\/messages$/);
  if (dmMatch && (method === 'GET' || method === 'POST')) {
    const user = requireUser(req,res); if (!user) return;
    const conversation = database.conversations.find(c=>c.id===dmMatch[1] && c.members.includes(user.id));
    if (!conversation || blockedBetween(...conversation.members)) return json(res,404,{error:'المحادثة غير متاحة.'});
    if (method === 'GET') return json(res,200,{messages:conversation.messages.slice(-120)});
    if (!rateLimit(req,res,`dm:${user.id}`,18,60_000)) return;
    const body = await readBody(req); const text = textValue(body.text,1000);
    if (!text) return json(res,400,{error:'الرسالة فارغة.'});
    conversation.messages.push(messageRecord(user,text)); conversation.messages=conversation.messages.slice(-200); await persist();
    return json(res,201,{ok:true});
  }
  if (method === 'POST' && p === '/api/block') {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const username = normalizeUsername(body.username); const target=database.users.find(u=>u.username===username);
    if (!target || target.id===user.id) return json(res,404,{error:'الحساب غير موجود.'});
    if (!database.blocks.some(b=>b.owner===user.id&&b.target===target.id)) database.blocks.push({owner:user.id,target:target.id,createdAt:new Date().toISOString()});
    await persist(); return json(res,200,{ok:true});
  }
  if (method === 'POST' && p === '/api/report') {
    const user = requireUser(req,res); if (!user) return;
    const body = await readBody(req); const reason = textValue(body.reason,300); const messageId=textValue(body.messageId,80);
    if (!reason || !messageId) return json(res,400,{error:'اكتب سبب الإبلاغ وحدد الرسالة.'});
    database.reports.push({id:randomToken(12),reporter:user.id,messageId,reason,createdAt:new Date().toISOString(),status:'open'}); await persist();
    return json(res,201,{ok:true});
  }

  if (method === 'POST' && p === '/api/security/check') {
    const user = requireUser(req,res); if (!user) return;
    if (!rateLimit(req,res,`scan:${user.id}`,3,10*60_000)) return;
    const body = await readBody(req);
    if (body.authorized !== true) return json(res,403,{error:'أكد التصريح قبل الفحص.'});
    let target;
    try { target = new URL(String(body.url || '')); } catch { return json(res,400,{error:'عنوان الموقع غير صالح.'}); }
    if (target.protocol !== 'https:' || target.username || target.password || (target.port && target.port !== '443') || (target.pathname !== '/' && target.pathname !== '') || target.search || target.hash) return json(res,400,{error:'يُسمح بعنوان HTTPS للجذر فقط، بدون مسارات أو منافذ خاصة.'});
    const host = target.hostname.toLowerCase().replace(/^www\./,'');
    if (!host.includes('.') || net.isIP(host) || host === 'localhost' || host.endsWith('.local') || PUBLICLY_BLOCKED.some(domain => host===domain || host.endsWith(`.${domain}`))) return json(res,403,{error:'هذا النطاق محظور في قائمة الحماية أو ليس اسم نطاق عامًا.'});
    try {
      const records = await dns.lookup(host,{all:true,verbatim:true});
      if (!records.length || records.some(record => !isPublicAddress(record.address))) return json(res,403,{error:'تم رفض النطاق: عنوان DNS ليس عامًا وآمنًا للفحص.'});
      const response = await fetchSafeRoot(host, records);
      const h = response.headers;
      const setCookies = h['set-cookie'] || [];
      const cookieString = setCookies.join(';').toLowerCase();
      const csp = String(h['content-security-policy'] || '');
      const checks = [
        {label:'1 · استخدام HTTPS',status:'good',result:'HTTPS مفروض'},
        {label:'2 · صلاحية اتصال TLS',status:'good',result:'الاتصال المشفر تم دون خطأ شهادة'},
        {label:'3 · HSTS',status:h['strict-transport-security']?'good':'warn',result:h['strict-transport-security']?'موجود':'غير ظاهر'},
        {label:'4 · Content-Security-Policy',status:csp?'good':'warn',result:csp?'موجود':'غير ظاهر'},
        {label:'5 · X-Content-Type-Options',status:/nosniff/i.test(h['x-content-type-options']||'')?'good':'warn',result:/nosniff/i.test(h['x-content-type-options']||'')?'nosniff موجود':'غير مضبوط كما هو متوقع'},
        {label:'6 · منع تضمين الصفحة',status:(/frame-ancestors/i.test(csp)||/deny|sameorigin/i.test(h['x-frame-options']||''))?'good':'warn',result:(/frame-ancestors/i.test(csp)||/deny|sameorigin/i.test(h['x-frame-options']||''))?'سياسة منع/تقييد الإطارات ظاهرة':'لم تظهر سياسة واضحة'},
        {label:'7 · Referrer-Policy',status:h['referrer-policy']?'good':'warn',result:h['referrer-policy']?'موجود':'غير ظاهر'},
        {label:'8 · Permissions-Policy',status:h['permissions-policy']?'good':'warn',result:h['permissions-policy']?'موجود':'غير ظاهر'},
        {label:'9 · خصائص Secure للكوكيز',status:!setCookies.length?'info':setCookies.every(x=>/;\s*secure/i.test(x))?'good':'warn',result:!setCookies.length?'لا توجد كوكيز في الرد':setCookies.every(x=>/;\s*secure/i.test(x))?'كل الكوكيز الظاهرة Secure':'بعض الكوكيز تفتقد Secure'},
        {label:'10 · خصائص HttpOnly',status:!setCookies.length?'info':setCookies.every(x=>/;\s*httponly/i.test(x))?'good':'warn',result:!setCookies.length?'لا توجد كوكيز في الرد':setCookies.every(x=>/;\s*httponly/i.test(x))?'كل الكوكيز الظاهرة HttpOnly':'بعض الكوكيز تفتقد HttpOnly'},
        {label:'11 · SameSite للكوكيز',status:!setCookies.length?'info':setCookies.every(x=>/;\s*samesite=/i.test(x))?'good':'warn',result:!setCookies.length?'لا توجد كوكيز في الرد':setCookies.every(x=>/;\s*samesite=/i.test(x))?'SameSite ظاهر':'بعض الكوكيز بلا SameSite'},
        {label:'12 · تقليل كشف نوع الخادم',status:h.server?'warn':'good',result:h.server?'ترويسة Server تكشف معلومة':'لا توجد ترويسة Server'},
        {label:'13 · تقليل كشف X-Powered-By',status:h['x-powered-by']?'warn':'good',result:h['x-powered-by']?'الترويسة ظاهرة':'غير ظاهرة'}
      ];
      return json(res,200,{host,statusCode:response.statusCode,checks,disclaimer:'فحص إعدادات استجابة سلبي فقط؛ ليس فحص ثغرات شاملًا ولا يثبت أمان الموقع.'});
    } catch (error) {
      return json(res,502,{error:`تعذر إكمال الفحص الآمن: ${error.message}`});
    }
  }

  return json(res,404,{error:'المسار غير موجود.'});
}

function isPublicAddress(address) {
  const family = net.isIP(address);
  if (family === 4) {
    const nums = address.split('.').map(Number); const [a,b] = nums;
    if (a===0 || a===10 || a===127 || a>=224) return false;
    if (a===100 && b>=64 && b<=127) return false;
    if (a===169 && b===254) return false;
    if (a===172 && b>=16 && b<=31) return false;
    if (a===192 && (b===0 || b===168)) return false;
    if (a===198 && (b===18 || b===19 || b===51)) return false;
    if (a===203 && b===0) return false;
    return true;
  }
  if (family === 6) {
    const value = address.toLowerCase();
    if (value==='::1' || value==='::' || value.startsWith('fc') || value.startsWith('fd') || /^fe[89ab]/.test(value) || value.startsWith('::ffff:') || value.startsWith('2001:db8:')) return false;
    return /^2[0-9a-f]{3}:/.test(value);
  }
  return false;
}

function fetchSafeRoot(host, records) {
  return new Promise((resolve,reject) => {
    const timer = setTimeout(() => req.destroy(new Error('انتهت مهلة الفحص.')),8000);
    const lookup = (_hostname, options, callback) => {
      if (options?.all) callback(null,records);
      else callback(null,records[0].address,records[0].family);
    };
    const req = https.request({hostname:host,servername:host,path:'/',method:'GET',headers:{'User-Agent':'ESKO-V4.5-Passive-Audit/1.0','Accept':'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1','Connection':'close'},lookup,timeout:7500,agent:false},res => {
      const headers = res.headers; const statusCode = res.statusCode || 0;
      let received = 0;
      res.on('data', chunk => { received += chunk.length; if (received > 256 * 1024) req.destroy(new Error('حجم استجابة الموقع تجاوز الحد الآمن 256KB.')); });
      res.on('end',()=>{clearTimeout(timer);resolve({headers,statusCode});});
    });
    req.on('socket',socket=>{socket.on('secureConnect',()=>{if(!socket.authorized){clearTimeout(timer);req.destroy(new Error('شهادة TLS غير موثوقة.'));}});});
    req.on('timeout',()=>req.destroy(new Error('انتهت مهلة الفحص.')));
    req.on('error',error=>{clearTimeout(timer);reject(error);});
    req.end();
  });
}

async function serveStatic(req,res,url) {
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return json(res,400,{error:'مسار غير صالح.'}); }
  if (pathname === '/') pathname = '/index.html';
  const resolved = path.resolve(PUBLIC_DIR, `.${pathname}`);
  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== path.join(PUBLIC_DIR,'index.html')) return json(res,403,{error:'ممنوع.'});
  let data;
  try { data = await fs.readFile(resolved); } catch { return json(res,404,{error:'الملف غير موجود.'}); }
  const type = MIME[path.extname(resolved).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200,{...securityHeaders(),'Content-Type':type,'Content-Length':data.length,'Cache-Control':type.includes('text/html')?'no-store':'public, max-age=300'});
  res.end(req.method === 'HEAD' ? undefined : data);
}

async function handler(req,res) {
  const url = new URL(req.url,'http://127.0.0.1');
  try {
    if (url.pathname.startsWith('/api/')) {
      if (!rateLimit(req,res,'api',180,60_000)) return;
      await routeAPI(req,res,url);
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      await serveStatic(req,res,url);
    } else json(res,405,{error:'الطريقة غير مدعومة.'});
  } catch (error) {
    console.error('[ESKO V4.5]',error);
    if (!res.headersSent) json(res,error.status || 500,{error:error.status ? error.message : 'حدث خطأ داخلي.'});
    else res.destroy();
  }
}

await fs.mkdir(DATA_DIR,{recursive:true,mode:0o700});
try { database = { ...emptyDB(), ...JSON.parse(await fs.readFile(DB_FILE,'utf8')) }; }
catch (error) { if (error.code !== 'ENOENT') throw error; await persist(); }
for (const key of Object.keys(emptyDB())) if (!Array.isArray(database[key])) database[key] = [];
for (const session of database.sessions) if(session.key && session.userId && session.expiresAt>Date.now()) sessions.set(session.key,{userId:session.userId,expiresAt:session.expiresAt});
database.sessions=database.sessions.filter(session=>session.expiresAt>Date.now());
const didPrune = pruneExpiredMessages();
if (didPrune) await persist();
try { await fs.chmod(DATA_DIR,0o700); } catch {}
const maintenance = setInterval(() => {
  const now = Date.now();
  for (const [key, session] of sessions) if (session.expiresAt < now) sessions.delete(key);
  database.sessions=database.sessions.filter(session=>session.expiresAt>=now);
  for (const [key, record] of rate) if (now - record.start > 20 * 60 * 1000) rate.delete(key);
  if (pruneExpiredMessages()) persist().catch(error => console.error('[ESKO TTL]', error));
}, 60_000);
maintenance.unref();
const server = http.createServer(handler);
server.listen(PORT,HOST,()=>{ const address=server.address(); console.log(`ESKO OPEN HUB V5.0: http://${HOST}:${address.port}`); });
server.on('error',error=>{console.error(error);process.exitCode=1;});
process.on('SIGINT',()=>{clearInterval(maintenance); server.close(()=>process.exit(0));});
process.on('SIGTERM',()=>{clearInterval(maintenance); server.close(()=>process.exit(0));});
