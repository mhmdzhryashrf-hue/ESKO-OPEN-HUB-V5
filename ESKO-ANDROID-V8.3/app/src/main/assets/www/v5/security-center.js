/* ESKO V5.6 — browser-side security monitor, advisory scanner and file encryption. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const events = [];
  const MAX_LOG = 40;
  const MAX_FILE_BYTES = 25 * 1024 * 1024;
  const KDF_ITERATIONS = 310000;
  let swRegistration = null;
  let lastFindings = [];

  function clean(value, limit=240) { return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, limit); }
  function logEvent(type, detail='') {
    events.unshift({ time: new Date().toLocaleTimeString('ar-EG'), type: clean(type,70), detail: clean(detail,160) });
    if (events.length > MAX_LOG) events.length = MAX_LOG;
    renderEvents();
  }
  function renderEvents() {
    const out = $('#securityEventLog');
    const count = $('#securityEventCount');
    if (count) count.textContent = String(events.length);
    if (!out) return;
    out.replaceChildren();
    if (!events.length) { out.textContent = 'لا توجد أحداث مسجلة منذ فتح الصفحة.'; return; }
    events.slice(0,12).forEach(item => {
      const row = document.createElement('div'); row.className = 'security-log-row';
      const when = document.createElement('time'); when.textContent = item.time;
      const label = document.createElement('b'); label.textContent = item.type;
      const detail = document.createElement('small'); detail.textContent = item.detail;
      row.append(when,label,detail); out.append(row);
    });
  }
  function renderRows(target, rows) {
    const root = $(target); if (!root) return;
    root.replaceChildren();
    rows.forEach(item => {
      const row = document.createElement('div'); row.className = 'security-result-row';
      const title = document.createElement('b'); title.textContent = clean(item.title,100);
      const status = document.createElement('span'); status.className = `security-status ${item.level || 'info'}`; status.textContent = clean(item.status || 'معلومة',50);
      const detail = document.createElement('small'); detail.textContent = clean(item.detail,500);
      row.append(title,status,detail); root.append(row);
    });
  }
  function applySafeClientFixes() {
    let fixed = 0;
    $$('a[target="_blank"]').forEach(a => {
      const before = a.rel;
      a.rel = 'noopener noreferrer';
      a.referrerPolicy = 'no-referrer';
      if (before !== a.rel) fixed++;
    });
    if (fixed) logEvent('تخفيف آمن تلقائي', `عزل ${fixed} رابط خارجي مفتوح في تبويب جديد.`);
    return fixed;
  }
  function monitorStart() {
    window.addEventListener('error', e => logEvent('خطأ واجهة', clean(e.message || 'خطأ JavaScript')));
    window.addEventListener('unhandledrejection', e => logEvent('رفض Promise غير معالج', clean(e.reason?.message || e.reason || 'سبب غير محدد')));
    window.addEventListener('securitypolicyviolation', e => logEvent('مخالفة سياسة أمان', `${clean(e.violatedDirective,60)} · ${clean(e.blockedURI,90)}`));
    window.addEventListener('online', () => logEvent('الشبكة', 'عاد الاتصال بالإنترنت.'));
    window.addEventListener('offline', () => logEvent('الشبكة', 'انقطع الاتصال بالإنترنت.'));
    document.addEventListener('visibilitychange', () => { if (document.hidden) logEvent('حالة الصفحة','انتقلت الصفحة إلى الخلفية.'); });
    applySafeClientFixes();
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('a[target="_blank"]')) applySafeClientFixes();
        if (node.querySelector?.('a[target="_blank"]')) applySafeClientFixes();
      }));
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
  function row(title,level,status,detail) { return {title,level,status,detail}; }
  async function readResponseHeaders() {
    try {
      const response = await fetch(location.href, {method:'HEAD',cache:'no-store',credentials:'same-origin'});
      const h = response.headers;
      return {
        csp: h.get('content-security-policy'),
        hsts: h.get('strict-transport-security'),
        nosniff: h.get('x-content-type-options'),
        referrer: h.get('referrer-policy'),
        permissions: h.get('permissions-policy'),
        frame: h.get('x-frame-options')
      };
    } catch (_) { return null; }
  }
  async function runAudit() {
    const status = $('#securityAuditStatus');
    if (status) status.textContent = 'جارٍ تنفيذ مراجعة سلبية لإعدادات الصفحة…';
    const findings = [];
    const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    findings.push(row('اتصال HTTPS', isHttps?'good':'warn', isHttps?'مفعل':'غير آمن', isHttps?'الصفحة تعمل في سياق آمن.':'استخدم HTTPS قبل إدخال أي بيانات حساب.'));
    findings.push(row('Web Crypto', !!crypto?.subtle?'good':'bad', !!crypto?.subtle?'متاح':'غير متاح', 'يلزم السياق الآمن لتشفير الملفات محليًا.'));
    const swReady=!!(swRegistration?.active || navigator.serviceWorker?.controller);
    findings.push(row('Service Worker', swReady?'good':('serviceWorker'in navigator?'warn':'bad'), swReady?'نشط':('serviceWorker'in navigator?'مدعوم ولم يبدأ بعد':'غير مدعوم'), 'يُستخدم للتخزين المؤقت وإشعارات التطبيق عند دعم المتصفح والاستضافة الآمنة.'));
    const active = [...document.querySelectorAll('script[src],link[rel="stylesheet"][href],img[src],iframe[src],source[src]')];
    const mixed = active.filter(el => /^http:/i.test(el.src || el.href || '')).length;
    findings.push(row('موارد HTTP داخل الصفحة', mixed?'bad':'good', mixed?`${mixed} مورد`:'لا يوجد', mixed?'حوّل الموارد إلى HTTPS أو احذف المورد غير الآمن.':'لم تُكتشف موارد HTTP نشطة في عناصر الصفحة الحالية.'));
    const externalScripts = $$('script[src]').filter(s => { try { return new URL(s.src,location.href).origin !== location.origin; } catch (_) { return false; } });
    const noIntegrity = externalScripts.filter(s => !s.integrity).length;
    findings.push(row('سلامة ملفات JavaScript الخارجية', noIntegrity?'warn':'good', noIntegrity?`${noIntegrity} بدون SRI`:'لا توجد ملفات خارجية بلا SRI', noIntegrity?'راجع مصدر كل مكتبة خارجية، وثبّت نسخة موثوقة أو أضف Subresource Integrity عند توفره.':'لم يُعثر على مورد خارجي بلا سمة integrity.'));
    const unsafeLinks = $$('a[target="_blank"]').filter(a => !/(^|\s)(noopener|noreferrer)(\s|$)/i.test(a.rel));
    const fixed = applySafeClientFixes();
    findings.push(row('عزل الروابط الخارجية', unsafeLinks.length?'good':'good', unsafeLinks.length?`تم تأمين ${fixed} رابط`:'سليم', 'تُضاف noopener وnoreferrer تلقائيًا للروابط التي تفتح تبويبًا جديدًا.'));
    const inlineHandlers = $$('[onclick],[onerror],[onload],[onmouseover]').length;
    findings.push(row('معالجات أحداث HTML المضمنة', inlineHandlers?'warn':'good', inlineHandlers?`${inlineHandlers} عنصر`:'لا يوجد', inlineHandlers?'يفضل نقل المعالجات إلى addEventListener لتسهيل تطبيق CSP.':'لا توجد معالجات أحداث inline في الصفحة المحملة.'));
    const header = await readResponseHeaders();
    if (header) {
      findings.push(row('Content-Security-Policy',header.csp?'good':'warn',header.csp?'موجود':'غير ظاهر',header.csp?'ترويسة CSP ظاهرة في استجابة الصفحة.':'أضف CSP من إعدادات خادم الاستضافة؛ JavaScript لا يستطيع فرض ترويسة HTTP بديلة.'));
      findings.push(row('Strict-Transport-Security',header.hsts?'good':'warn',header.hsts?'موجود':'غير ظاهر',header.hsts?'المتصفح تلقى HSTS.':'يُضبط على الخادم بعد التأكد من HTTPS والنطاقات الفرعية.'));
      findings.push(row('X-Content-Type-Options',/nosniff/i.test(header.nosniff||'')?'good':'warn',header.nosniff||'غير ظاهر','يفضل ضبط القيمة nosniff على استجابات الخادم.'));
      findings.push(row('Referrer-Policy',header.referrer?'good':'warn',header.referrer||'غير ظاهر','استخدم strict-origin-when-cross-origin أو no-referrer وفق الحاجة.'));
      findings.push(row('Permissions-Policy',header.permissions?'good':'warn',header.permissions?'موجود':'غير ظاهر','عطّل الكاميرا والميكروفون والموقع الجغرافي إذا لم تكن مطلوبة.'));
      findings.push(row('حماية الإطارات',header.frame||header.csp?.includes('frame-ancestors')?'good':'warn',header.frame|| (header.csp?.includes('frame-ancestors')?'CSP frame-ancestors':'غير ظاهر'),'استخدم frame-ancestors في CSP لمنع تضمين الموقع غير المرغوب.'));
    } else findings.push(row('ترويسات HTTP', 'info','تعذر القراءة','تعذر فحص ترويسات الاستجابة من المتصفح؛ راجع إعدادات الاستضافة مباشرة.'));
    findings.push(row('نطاق المراجعة','info','فحص سلبي فقط','هذه مراجعة للصفحة الحالية وإعدادات الاستجابة الظاهرة؛ ليست اختبار اختراق ولا تفحص الخادم أو نظام تشغيل الزائر.'));
    lastFindings = findings;
    renderRows('#securityAuditResults',findings);
    const warn = findings.filter(x=>x.level==='warn'||x.level==='bad').length;
    if (status) status.textContent = `اكتملت المراجعة: ${findings.length} مؤشرًا، ${warn} ملاحظة تحتاج مراجعة. لا تعني النتيجة خلو الموقع من الثغرات.`;
    logEvent('مراجعة أمنية', `${findings.length} مؤشرًا · ${warn} ملاحظة للمراجعة.`);
    const runAI = $('#securityAIButton'); if (runAI) runAI.disabled = false;
    return findings;
  }
  function visitorCheck() {
    const results = [];
    const secure = window.isSecureContext && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname));
    let storage = false; try { const key='__esko_secure_test__'; localStorage.setItem(key,'1');localStorage.removeItem(key);storage=true; } catch (_) {}
    const items = [
      ['سياق اتصال آمن',!!secure,'HTTPS مطلوب لإتاحة كثير من ميزات الحماية.'],
      ['تشفير المتصفح',!!crypto?.subtle,'يدعم Web Crypto للتشفير داخل الجهاز.'],
      ['التخزين المحلي',storage,'قد يكون التخزين محظورًا في وضع الخصوصية أو إعدادات المتصفح.'],
      ['ملفات Service Worker','serviceWorker'in navigator,'يدعم تحديثات التطبيق والتخزين المؤقت.'],
      ['ملفات تعريف الارتباط',navigator.cookieEnabled!==false,'هذه قراءة لإعداد المتصفح فقط ولا تكشف ملفات HttpOnly.'],
      ['الإشعارات','Notification'in window,'إتاحة الإشعارات لا تعني أن الموقع لديه صلاحية إرسالها.']
    ];
    const points = items.reduce((sum,x)=>sum+(x[1]?1:0),0);
    items.forEach(([title,ok,detail])=>results.push(row(title,ok?'good':'warn',ok?'متاح':'غير متاح',detail)));
    renderRows('#visitorCheckResults',results);
    const summary = $('#visitorCheckSummary');
    if(summary) summary.textContent=`توافق المتصفح: ${points} من ${items.length} مؤشرات متاحة. هذا لا يفحص الفيروسات أو اختراق الجهاز ولا يثبت أن الزائر آمن.`;
    logEvent('فحص متصفح زائر',`${points}/${items.length} مؤشرات توافق.`);
    return {points,total:items.length,items};
  }
  function localAIAdvice(findings) {
    const tips = [];
    const has = title => findings.some(x=>x.title===title && (x.level==='warn'||x.level==='bad'));
    if (has('Content-Security-Policy')) tips.push('أضف Content-Security-Policy من إعدادات خادم الاستضافة، وابدأ بوضع Report-Only لاختبار مصادر الموقع قبل فرضها.');
    if (has('Strict-Transport-Security')) tips.push('فعّل HSTS من الخادم بعد التأكد أن جميع الصفحات والنطاقات الفرعية تعمل عبر HTTPS.');
    if (has('X-Content-Type-Options')) tips.push('اضبط X-Content-Type-Options: nosniff في استجابات الخادم.');
    if (has('Referrer-Policy')) tips.push('اضبط Referrer-Policy لتقليل تسريب مسارات وروابط الصفحات إلى المواقع الخارجية.');
    if (has('Permissions-Policy')) tips.push('أوقف صلاحيات الكاميرا والميكروفون والموقع الجغرافي افتراضيًا إذا لم تكن مطلوبة.');
    if (has('سلامة ملفات JavaScript الخارجية')) tips.push('ثبّت إصدارات مكتبات JavaScript الخارجية، وراجعها قبل التحديث، وأضف SRI عند الإمكان.');
    if (has('موارد HTTP داخل الصفحة')) tips.push('حوّل كل الموارد المختلطة إلى HTTPS قبل نشر التحديث.');
    if (has('معالجات أحداث HTML المضمنة')) tips.push('انقل معالجات HTML المضمنة إلى addEventListener حتى يسهل تضييق سياسة CSP.');
    if (!tips.length) tips.push('لم تظهر مؤشرات إعداد واضحة في الفحص الحالي. احتفظ بمراجعة دورية، واختبر الخادم وقاعدة البيانات وأذونات الحسابات بأدوات تدقيق مصرح بها.');
    return tips;
  }
  async function analyzeResources() {
    const findings = [...lastFindings];
    const resources = performance.getEntriesByType('resource').map(x=>x.name).filter(url=>{try{return new URL(url).origin===location.origin && /\.js(?:\?|$)/i.test(new URL(url).pathname);}catch(_){return false;}});
    const unique = [...new Set(resources)].slice(0,16);
    const signatures = [
      {regex:/\beval\s*\(/,title:'استخدام eval()',level:'bad',detail:'تجنب تنفيذ نصوص JavaScript ديناميكيًا؛ استخدم دوال صريحة وبيانات محققة.'},
      {regex:/\bnew\s+Function\s*\(/,title:'إنشاء دوال من نص',level:'bad',detail:'تجنب new Function لأنها توسع سطح حقن الشيفرة.'},
      {regex:/\bdocument\.write\s*\(/,title:'document.write',level:'warn',detail:'استبدله بإنشاء عناصر DOM وtextContent.'},
      {regex:/ESKO_ACCESS_PIN\s*=\s*['"]\d{4,}/,title:'رمز دخول ثابت داخل الواجهة',level:'bad',detail:'أي رمز داخل JavaScript العام قابل للقراءة؛ تحقّق من الحساب على الخادم فقط.'},
      {regex:/(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['"][^'"]{12,}/i,title:'احتمال مفتاح ثابت في ملفات JavaScript',level:'bad',detail:'انقل المفاتيح إلى متغيرات بيئة الخادم وأبطل أي مفتاح نُشر سابقًا.'},
      {regex:/\blocalStorage\.setItem\s*\(\s*['"](?:token|accessToken|refreshToken|password)/i,title:'احتمال تخزين اعتماد دخول محليًا',level:'warn',detail:'لا تحفظ كلمات المرور أو رموز الجلسات في localStorage؛ استخدم كوكيز HttpOnly من الخادم.'}
    ];
    let scanned=0;
    for (const url of unique) {
      try {
        const res=await fetch(url,{credentials:'same-origin',cache:'no-store'});
        if(!res.ok)continue;
        const text=await res.text();
        if(text.length>600000)continue;
        scanned++;
        signatures.forEach(sig=>{if(sig.regex.test(text))findings.push(row(sig.title,sig.level,'مؤشر يحتاج مراجعة',`${sig.detail} المصدر: ${new URL(url).pathname}`));});
      } catch (_) { /* same-origin read may be unavailable; skip safely */ }
    }
    return {findings,scanned};
  }
  async function runAIReview() {
    const out=$('#securityAIOutput'); if(!out)return;
    out.textContent='المحلل يراجع المؤشرات المحلية وملفات JavaScript من نفس الموقع فقط…';
    const base=lastFindings.length?lastFindings:await runAudit();
    try {
      const review=await analyzeResources();
      const tips=localAIAdvice(review.findings);
      out.replaceChildren();
      const label=document.createElement('p');label.className='security-ai-label';label.textContent=`محلل محلي بالقواعد · تمت مراجعة ${review.scanned} ملفات JavaScript من نفس الموقع.`;out.append(label);
      review.findings.filter(x=>x.level==='bad').forEach(x=>{const p=document.createElement('p');p.textContent=`تنبيه مرتفع: ${x.title} — ${x.detail}`;out.append(p);});
      tips.forEach((tip,i)=>{const p=document.createElement('p');p.textContent=`${i+1}. ${tip}`;out.append(p);});
      const optional=window.ESKO_SECURITY_AI_ENDPOINT;
      if(typeof optional==='string'&&optional.trim()){
        try{
          const endpoint=new URL(optional,location.href);
          if(endpoint.origin!==location.origin)throw new Error('يجب أن يكون موائم الذكاء الاصطناعي على نفس المصدر.');
          const response=await fetch(endpoint.href,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({findings:review.findings.map(x=>({title:x.title,level:x.level,status:x.status,detail:x.detail}))})});
          if(!response.ok)throw new Error(`الخادم أعاد ${response.status}`);
          const data=await response.json();
          if(Array.isArray(data.recommendations))data.recommendations.slice(0,8).forEach(item=>{const p=document.createElement('p');p.textContent=`مقترح الخادم: ${clean(item,400)}`;out.append(p);});
        }catch(error){const p=document.createElement('small');p.textContent=`موائم الخادم غير متاح: ${clean(error.message,180)}. استُخدم المحلل المحلي فقط.`;out.append(p);}
      } else {
        const p=document.createElement('small');p.textContent='لا يوجد نموذج توليدي مربوط حاليًا؛ هذه توصيات آلية مبنية على قواعد محلية وليست نموذجًا عصبيًا أو إصلاحًا تلقائيًا لملفات الخادم.';out.append(p);
      }
      logEvent('تحليل المساعد الأمني',`تمت مراجعة ${review.scanned} ملفات JavaScript محلية.`);
    }catch(error){out.textContent=`تعذر إكمال التحليل: ${clean(error.message,200)}`;}
  }
  async function registerServiceWorker() {
    if(!('serviceWorker'in navigator)||!window.isSecureContext)return;
    try { swRegistration=await navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{scope:new URL('./',document.baseURI).pathname});await navigator.serviceWorker.ready;logEvent('تطبيق الويب','تم تسجيل Service Worker.'); }
    catch(error){logEvent('تطبيق الويب',`تعذر تسجيل Service Worker: ${clean(error.message,120)}`);}
  }
  function vapidKeyBytes(value) { const pad='='.repeat((4-value.length%4)%4); const raw=atob((value+pad).replace(/-/g,'+').replace(/_/g,'/')); return Uint8Array.from(raw,c=>c.charCodeAt(0)); }
  async function enableNotifications() {
    if(!('Notification'in window)){alert('هذا المتصفح لا يدعم إشعارات الويب.');return;}
    let permission=Notification.permission;
    if(permission==='default')permission=await Notification.requestPermission();
    if(permission!=='granted'){alert(permission==='denied'?'الإشعارات مرفوضة من إعدادات المتصفح. يمكنك تغييرها من إعدادات الموقع.':'لم يتم منح الإذن.');return;}
    try {
      swRegistration ||= await navigator.serviceWorker?.ready;
      if(swRegistration?.showNotification)await swRegistration.showNotification('ESKO OPEN HUB',{body:'تم تفعيل إشعارات الاختبار على هذا الجهاز.',icon:new URL('assets/esko-eagle-v5.webp',document.baseURI).href,tag:'esko-notification-test'});
      else new Notification('ESKO OPEN HUB',{body:'تم تفعيل إشعارات الاختبار على هذا الجهاز.'});
      const hint=$('#notificationServiceHint');
      const permissionState=$('#notificationState');if(permissionState)permissionState.textContent=Notification.permission;
      if(window.ESKO_VAPID_PUBLIC_KEY && swRegistration?.pushManager) {
        const subscription=await swRegistration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:vapidKeyBytes(window.ESKO_VAPID_PUBLIC_KEY)});
        const apiBase=String(window.ESKO_API_BASE||'/api').replace(/\/$/,'');
        const response=await fetch(`${apiBase}/notifications/subscribe`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(subscription)});
        if(!response.ok)throw new Error(`خادم الإشعارات غير متاح (${response.status})`);
        if(hint)hint.textContent='تم تسجيل هذا المتصفح لاستقبال إشعارات الخادم.';
      } else if(hint) hint.textContent='تم تفعيل الإشعار المحلي. لإشعارات الخادم: اضبط VAPID وخادم /api/notifications/subscribe.';
      logEvent('إشعارات التطبيق','تم إرسال إشعار اختبار محلي.');
    } catch(error){logEvent('الإشعارات',`تعذر عرض الإشعار: ${clean(error.message,100)}`);}
  }
  function b64(bytes) { let binary=''; const step=0x8000; for(let i=0;i<bytes.length;i+=step)binary+=String.fromCharCode(...bytes.subarray(i,i+step)); return btoa(binary); }
  function fromB64(value) { const binary=atob(value); const bytes=new Uint8Array(binary.length); for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes; }
  async function deriveKey(password,salt) {
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:KDF_ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  function downloadBlob(blob,name) {
    const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.hidden=true;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  function setFileStatus(id,message,error=false){const el=$(id);if(el){el.textContent=message;el.classList.toggle('error',!!error);}}
  async function encryptSelectedFile() {
    const file=$('#securePlainFile')?.files?.[0];const pass=$('#secureEncryptPass')?.value||'';const confirm=$('#secureEncryptConfirm')?.value||'';
    if(!file)return setFileStatus('#encryptFileStatus','اختر ملفًا أولًا.',true);
    if(file.size>MAX_FILE_BYTES)return setFileStatus('#encryptFileStatus','الحد الأقصى للملف 25MB في هذه النسخة.',true);
    if(pass.length<12)return setFileStatus('#encryptFileStatus','استخدم عبارة مرور من 12 حرفًا على الأقل.',true);
    if(pass!==confirm)return setFileStatus('#encryptFileStatus','عبارتا المرور غير متطابقتين.',true);
    if(!crypto?.subtle||!window.isSecureContext)return setFileStatus('#encryptFileStatus','التشفير يحتاج HTTPS أو localhost ومتصفحًا يدعم Web Crypto.',true);
    const btn=$('#encryptFileButton');if(btn)btn.disabled=true;
    try {
      setFileStatus('#encryptFileStatus','جارٍ التشفير محليًا… لا يتم رفع الملف إلى أي خادم.');
      const data=new Uint8Array(await file.arrayBuffer());
      const meta=new TextEncoder().encode(JSON.stringify({name:clean(file.name,180)||'file.bin',type:file.type||'application/octet-stream',size:file.size,createdAt:new Date().toISOString()}));
      const payload=new Uint8Array(4+meta.length+data.length);new DataView(payload.buffer).setUint32(0,meta.length,false);payload.set(meta,4);payload.set(data,4+meta.length);
      const salt=crypto.getRandomValues(new Uint8Array(16));const iv=crypto.getRandomValues(new Uint8Array(12));const key=await deriveKey(pass,salt);
      const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,payload));
      const envelope={format:'ESKO-AES-GCM-1',kdf:'PBKDF2-SHA256',iterations:KDF_ITERATIONS,salt:b64(salt),iv:b64(iv),ciphertext:b64(cipher)};
      downloadBlob(new Blob([JSON.stringify(envelope)],{type:'application/vnd.esko.encrypted+json'}),`ESKO-ENCRYPTED-${Date.now()}.esko.enc`);
      setFileStatus('#encryptFileStatus','تم التشفير والتنزيل بنجاح. احتفظ بعبارة المرور؛ لا توجد طريقة لاستعادة الملف بدونها.');
      $('#secureEncryptPass').value='';$('#secureEncryptConfirm').value='';logEvent('تشفير ملف','تشفير AES-256-GCM محلي دون رفع الملف.');
    } catch(error){setFileStatus('#encryptFileStatus',`فشل التشفير: ${clean(error.message,180)}`,true);} finally {if(btn)btn.disabled=false;}
  }
  async function decryptSelectedFile() {
    const file=$('#secureEncryptedFile')?.files?.[0];const pass=$('#secureDecryptPass')?.value||'';
    if(!file)return setFileStatus('#decryptFileStatus','اختر ملف ESKO المشفر أولًا.',true);
    if(file.size>40*1024*1024)return setFileStatus('#decryptFileStatus','حجم الملف المشفر أكبر من الحد المسموح 40MB.',true);
    if(!pass)return setFileStatus('#decryptFileStatus','اكتب عبارة المرور التي استُخدمت في التشفير.',true);
    if(!crypto?.subtle||!window.isSecureContext)return setFileStatus('#decryptFileStatus','فك التشفير يحتاج HTTPS أو localhost.',true);
    const btn=$('#decryptFileButton');if(btn)btn.disabled=true;
    try {
      setFileStatus('#decryptFileStatus','جارٍ فك التشفير محليًا…');
      const envelope=JSON.parse(await file.text());
      if(envelope?.format!=='ESKO-AES-GCM-1'||envelope?.kdf!=='PBKDF2-SHA256'||envelope.iterations!==KDF_ITERATIONS)throw new Error('صيغة الملف غير معروفة أو غير مدعومة.');
      const salt=fromB64(envelope.salt),iv=fromB64(envelope.iv),cipher=fromB64(envelope.ciphertext);
      if(salt.length!==16||iv.length!==12||cipher.length<20||cipher.length>40*1024*1024)throw new Error('بيانات التشفير غير سليمة.');
      const key=await deriveKey(pass,salt);const plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher));
      if(plain.length<4)throw new Error('الملف الناتج غير مكتمل.');
      const metaLength=new DataView(plain.buffer,plain.byteOffset,plain.byteLength).getUint32(0,false);
      if(metaLength<2||metaLength>4096||4+metaLength>plain.length)throw new Error('بيانات الملف الداخلية غير سليمة.');
      const meta=JSON.parse(new TextDecoder().decode(plain.subarray(4,4+metaLength)));const data=plain.slice(4+metaLength);
      if(data.length!==meta.size)throw new Error('حجم الملف لا يطابق بياناته الداخلية.');
      const name=clean(meta.name,180).replace(/[\\/:*?"<>|]/g,'_')||'decrypted-file.bin';
      downloadBlob(new Blob([data],{type:clean(meta.type,100)||'application/octet-stream'}),name);
      setFileStatus('#decryptFileStatus','تم فك التشفير وتنزيل الملف الأصلي.');$('#secureDecryptPass').value='';logEvent('فك تشفير ملف','تم فك التشفير محليًا بعد التحقق من AES-GCM.');
    } catch(error){setFileStatus('#decryptFileStatus',`تعذر فك الملف؛ تأكد من عبارة المرور وسلامة الملف. (${clean(error.message,100)})`,true);} finally {if(btn)btn.disabled=false;}
  }
  function passwordStrength() {
    const input=$('#registerForm input[name="password"]');const target=$('#passwordStrength');if(!input||!target)return;
    const v=input.value;let score=0;if(v.length>=12)score++;if(/[a-z]/.test(v)&&/[A-Z]/.test(v))score++;if(/\d/.test(v))score++;if(/[^A-Za-z0-9]/.test(v))score++;
    const labels=['ضعيفة جدًا','ضعيفة','متوسطة','جيدة','قوية'];target.textContent=v?`قوة كلمة المرور: ${labels[score]} · لا تستخدم كلمة مرور سبق استعمالها.`:'يفضل 12 حرفًا أو أكثر مع تنوع الأحرف والأرقام والرموز.';
    target.dataset.level=String(score);
  }
  function bind() {
    $('#runSecurityAudit')?.addEventListener('click',()=>runAudit().catch(e=>setFileStatus('#securityAuditStatus',clean(e.message,180),true)));
    $('#runVisitorCheck')?.addEventListener('click',visitorCheck);
    $('#securityAIButton')?.addEventListener('click',runAIReview);
    $('#enableAppNotifications')?.addEventListener('click',enableNotifications);
    $('#encryptFileButton')?.addEventListener('click',encryptSelectedFile);
    $('#decryptFileButton')?.addEventListener('click',decryptSelectedFile);
    $('#registerForm input[name="password"]')?.addEventListener('input',passwordStrength);
    const pass=$('#registerForm input[name="password"]');if(pass){pass.minLength=12;pass.autocomplete='new-password';}
    const recover=$('#recoverForm input[name="newPassword"]');if(recover){recover.minLength=12;recover.autocomplete='new-password';}
    $('#loginForm input[name="username"]')?.setAttribute('autocomplete','username');
    $('#loginForm input[name="password"]')?.setAttribute('autocomplete','current-password');
  }

  async function checkBackendStatus() {
    const target=$('#authSecurityState'); if(!target)return;
    const base=String(window.ESKO_API_BASE||'/api').replace(/\/$/,'');
    try {
      const response=await fetch(`${base}/security/health`,{credentials:'same-origin',headers:{Accept:'application/json'},cache:'no-store'});
      if(!response.ok)throw new Error('not-ready');
      const data=await response.json();
      const auth=data.auth||{};
      const ready=auth.ready===true && auth.passwordHash==='argon2id' && auth.secureCookies===true && auth.rateLimit===true && auth.csrf===true;
      target.textContent=ready?'الخادم يعلن تفعيل Argon2id وSecure HttpOnly cookies وRate Limit وCSRF. راجع إعدادات الخادم دوريًا.':'الخادم متصل، لكن تقريره لا يؤكد اكتمال جميع إعدادات الحماية المطلوبة.';
    } catch (_) { target.textContent='لم يتم العثور على فحص أمان خادم مكتمل. GitHub Pages لا يوفر API للحسابات؛ لا تعتبر الواجهة وحدها تسجيل دخول آمنًا.'; }
  }

  async function init() {
    monitorStart();bind();await registerServiceWorker();await checkBackendStatus();
    const sw=$('#serviceWorkerState');if(sw)sw.textContent=swRegistration?'جاهز':'يعتمد على المتصفح والاستضافة';
    const notify=$('#notificationState');if(notify)notify.textContent=('Notification'in window)?Notification.permission:'غير مدعوم';
    if(location.protocol!=='https:'&&location.hostname!=='localhost')logEvent('تنبيه سياق آمن','افتح الموقع عبر HTTPS لتفعيل التشفير والإشعارات.');
  }
  window.ESKOSecurityCenter=Object.freeze({runAudit,visitorCheck,runAIReview,encryptSelectedFile,decryptSelectedFile,getEvents:()=>events.slice(),getFindings:()=>lastFindings.slice()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().catch(e=>logEvent('تهيئة الحماية',clean(e.message,120))),{once:true});else init().catch(e=>logEvent('تهيئة الحماية',clean(e.message,120)));
})();
