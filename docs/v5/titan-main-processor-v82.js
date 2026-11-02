/* ESKO V8.2 — TITAN Main Processor. Safe UI orchestration; no hardware overclocking. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'esko-v82-performance-mode';
  const ERROR_KEY = 'esko-v82-local-errors';
  const SAFE_BACKUP_KEYS = ['esko-v81-feature-flags', 'esko-v81-leveling-profile', KEY];
  const registry = new Map();
  const errorLog = [];
  let queueRunning = false;
  let installPrompt = null;
  let reducedMotion = false;
  let mode = 'auto';
  let errorMonitoring = false;
  const startTime = performance.now();
  const idle = fn => ('requestIdleCallback' in window) ? requestIdleCallback(fn, {timeout: 700}) : setTimeout(fn, 24);
  const yieldMain = () => new Promise(resolve => idle(resolve));
  const safeText = value => String(value ?? '').replace(/[\u0000-\u001f]/g, ' ').slice(0, 240);
  const setStatus = text => { const node=$('titanPerfStatus'); if(node) node.textContent=text; };
  const appendLog = text => { const node=$('titanProcessorLog'); if(!node) return; const lines=(node.textContent==='لم يتم تشغيل المعالج بعد.'?[]:node.textContent.split('\n')); lines.push('• '+safeText(text)); node.textContent=lines.slice(-24).join('\n'); };
  const setProgress = (value) => { const node=$('titanProcessorProgress'); if(node) node.style.width=Math.max(0,Math.min(100,value))+'%'; };
  const toast = text => { const node=$('toast'); if(node){node.textContent=text;node.classList.add('show');setTimeout(()=>node.classList.remove('show'),2200);} };
  function applyMode(next) {
    mode = ['auto','balanced','lite'].includes(next) ? next : 'auto';
    const root=document.documentElement;
    const deviceTier=window.ESKOPerformanceCore?.deviceTier?.() || 'balanced';
    const effective=mode==='auto' ? deviceTier : mode;
    root.dataset.eskoQuality = effective;
    try { localStorage.setItem(KEY, mode); } catch (_) {}
    const status=$('titanModeStatus');
    if(status) status.textContent='الوضع: '+({auto:'تلقائي ('+effective+')',balanced:'متوازن',lite:'خفيف للهاتف'}[mode]);
    const tier=$('titanDeviceTier'); if(tier) tier.textContent=effective;
    return effective;
  }
  function applyMotion(force) {
    if(typeof force==='boolean') reducedMotion=force;
    else reducedMotion=!reducedMotion;
    document.documentElement.dataset.eskoMotion = reducedMotion ? 'reduced' : 'normal';
    try { localStorage.setItem('esko-v82-reduced-motion', reducedMotion?'1':'0'); } catch (_) {}
    const status=$('titanModeStatus'); if(status) status.textContent += ' · الحركة '+(reducedMotion?'مخفّضة':'عادية');
    return reducedMotion;
  }
  function lazyImages() {
    const imgs=[...document.querySelectorAll('img')]; let changed=0;
    imgs.forEach((img,index)=>{
      if(!img.getAttribute('loading') && index>1){img.setAttribute('loading','lazy');changed++;}
      if(!img.getAttribute('decoding')) img.setAttribute('decoding','async');
    });
    return {total:imgs.length,changed};
  }
  function memorySweep() {
    const core=window.ESKOPerformanceCore;
    const before=core?.cacheStats?.() || {memoItems:0,cachedJSON:0};
    if((before.memoItems+before.cachedJSON)>80) core?.clearMemo?.();
    return {before,after:core?.cacheStats?.() || {memoItems:0,cachedJSON:0}};
  }
  function healthSnapshot() {
    const nav=navigator;
    const memory=performance.memory && Number.isFinite(performance.memory.usedJSHeapSize) ? Math.round(performance.memory.usedJSHeapSize/1048576)+' MB' : 'غير متاحة';
    return {
      online:!!nav.onLine,
      domNodes:document.getElementsByTagName('*').length,
      images:document.images?.length ?? document.querySelectorAll('img').length,
      scripts:document.scripts?.length ?? document.querySelectorAll('script').length,
      elapsedMs:Math.round(performance.now()-startTime),
      memory,
      cores:nav.hardwareConcurrency || 'غير معلومة',
      deviceMemory:nav.deviceMemory || 'غير معلومة',
      serviceWorker:!!nav.serviceWorker,
      performanceCore:!!window.ESKOPerformanceCore
    };
  }
  function addError(type,message) {
    const entry={type:safeText(type),message:safeText(message),at:new Date().toISOString()};
    errorLog.push(entry); if(errorLog.length>40) errorLog.shift();
    try { sessionStorage.setItem(ERROR_KEY,JSON.stringify(errorLog.slice(-20))); } catch (_) {}
  }
  function enableErrorMonitoring() {
    if(errorMonitoring) return false;
    errorMonitoring=true;
    window.addEventListener('error',event=>addError('error',event.message || 'خطأ في الصفحة'));
    window.addEventListener('unhandledrejection',event=>addError('promise',event.reason?.message || event.reason || 'رفض Promise غير معالج'));
    return true;
  }
  function openCommandPalette() {
    const modal=$('titanCommandPalette'),input=$('titanCommandInput'); if(!modal) return;
    modal.hidden=false; if(input){input.value='';renderCommands('');input.focus();}
  }
  function closeCommandPalette() { const modal=$('titanCommandPalette'); if(modal) modal.hidden=true; }
  function renderCommands(query) {
    const root=$('titanCommandResults'); if(!root) return;
    root.replaceChildren();
    const q=String(query||'').trim().toLowerCase();
    const items=[...document.querySelectorAll('.nav-item[data-page]')].filter(x=>!q || x.textContent.toLowerCase().includes(q));
    items.slice(0,24).forEach(item=>{
      const button=document.createElement('button'); button.type='button'; button.className='titan-command-result';
      button.textContent=item.textContent.trim();
      button.addEventListener('click',()=>{item.click();closeCommandPalette();}); root.append(button);
    });
    if(!items.length){const empty=document.createElement('p');empty.textContent='لا توجد أقسام مطابقة.';root.append(empty);}
  }
  function exportJSON(filename,data) {
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
  }
  function exportSafeBackup() {
    const values={};SAFE_BACKUP_KEYS.forEach(key=>{try{const value=localStorage.getItem(key);if(value!==null) values[key]=JSON.parse(value);}catch(_){}});
    exportJSON('esko-v82-safe-settings-backup.json',{format:'ESKO_SETTINGS_V1',createdAt:new Date().toISOString(),settings:values});
    return Object.keys(values).length;
  }
  function importSafeBackup(file) {
    if(!file || file.size>1024*1024) throw new Error('الملف غير صالح أو أكبر من 1MB');
    return file.text().then(text=>{
      const data=JSON.parse(text);
      if(data?.format!=='ESKO_SETTINGS_V1' || !data.settings || typeof data.settings!=='object') throw new Error('صيغة النسخة غير معروفة');
      let count=0;
      SAFE_BACKUP_KEYS.forEach(key=>{ if(Object.prototype.hasOwnProperty.call(data.settings,key)){
        const value=JSON.stringify(data.settings[key]); if(value.length<100000){localStorage.setItem(key,value);count++;}
      }});
      return count;
    });
  }
  async function checkOffline() {
    const state=navigator.onLine?'متصل':'غير متصل';
    let sw='غير متاح';
    try { if(navigator.serviceWorker){const reg=await navigator.serviceWorker.getRegistration();sw=reg?.active?'جاهز':reg?.installing?'قيد التثبيت':'غير نشط';} } catch (_) {sw='تعذر الفحص';}
    return {network:state,serviceWorker:sw};
  }
  async function installPWA() {
    if(!installPrompt){const status=$('titanInstallStatus');if(status)status.textContent='لا يوجد طلب تثبيت متاح الآن؛ قد يكون التطبيق مثبتًا أو المتصفح لا يدعم نافذة التثبيت.';return 'unavailable';}
    const prompt=installPrompt;installPrompt=null;await prompt.prompt();const choice=await prompt.userChoice;
    const status=$('titanInstallStatus');if(status)status.textContent=choice?.outcome==='accepted'?'تم قبول طلب التثبيت.':'تم إغلاق طلب التثبيت دون تثبيت.';
    return choice?.outcome || 'dismissed';
  }
  function setFocus(enabled) {
    document.body.classList.toggle('esko-focus-mode',!!enabled);
    const button=$('titanFocusToggle');if(button)button.textContent=enabled?'إيقاف وضع التركيز':'تفعيل وضع التركيز';
    return !!enabled;
  }
  function addAuditRow(label,ok,detail) {
    const root=$('titanAuditResults'); if(!root)return;
    const row=document.createElement('div');row.className='titan-audit-row';
    const state=document.createElement('b');state.textContent=ok?'✓':'!';state.className=ok?'audit-ok':'audit-warn';
    const title=document.createElement('strong');title.textContent=label;
    const desc=document.createElement('small');desc.textContent=detail;
    row.append(state,title,desc);root.append(row);
  }
  function runAudit() {
    const root=$('titanAuditResults');if(root)root.replaceChildren();
    const data=healthSnapshot();
    const refs=[...document.querySelectorAll('script[src],link[rel="stylesheet"][href]')];
    let missing=0;
    refs.forEach(node=>{const path=node.getAttribute('src')||node.getAttribute('href');if(!path || /^(https?:|data:|\/\/|#)/i.test(path))return;const anchor=document.createElement('a');anchor.href=path;if(anchor.origin===location.origin && !document.querySelector(`[src="${CSS.escape(path)}"],[href="${CSS.escape(path)}"]`))missing++;});
    addAuditRow('ملف الأداء الأساسي',data.performanceCore,'وجود وحدة الأداء المساعدة');
    addAuditRow('Service Worker',data.serviceWorker,'دعم التسجيل في هذا المتصفح');
    addAuditRow('الاتصال',data.online,data.online?'الاتصال متاح':'العمل قد يكون محدودًا دون شبكة');
    addAuditRow('تحميل الصور',data.images>=0,`${data.images} صورة · فحص lazy loading سيتم عند تشغيل المعالج`);
    addAuditRow('حجم الصفحة',data.domNodes<12000,`${data.domNodes} عنصر DOM`);
    addAuditRow('ذاكرة JavaScript',data.memory!=='غير متاحة',data.memory);
    addAuditRow('أخطاء محلية',errorLog.length===0,`${errorLog.length} خطأ مسجل في الذاكرة المؤقتة`);
    const set=(id,value)=>{const n=$(id);if(n)n.textContent=String(value);};
    set('titanLoadTime',data.elapsedMs+' ms');set('titanDomCount',data.domNodes);set('titanImageCount',data.images);set('titanMemoryUse',data.memory);
    return data;
  }
  function register(name,task) { if(typeof task!=='function')throw new TypeError('Processor must be a function');registry.set(name,task); }
  async function run(name) { const fn=registry.get(name);if(!fn)throw new Error('Unknown processor: '+name);await yieldMain();return fn(); }
  async function runAll(onProgress=()=>{}) {
    if(queueRunning) return {status:'busy'};
    queueRunning=true;setStatus('يعمل');setProgress(0);
    const names=[...registry.keys()],results=[];
    if($('titanTaskCount'))$('titanTaskCount').textContent=String(names.length);
    try {
      for(let i=0;i<names.length;i++){
        await yieldMain();
        try { const value=await registry.get(names[i])();results.push({name:names[i],ok:true,value});appendLog(names[i]+' اكتمل'); }
        catch(error){results.push({name:names[i],ok:false,error:safeText(error.message)});appendLog(names[i]+' تعثر: '+error.message);}
        const pct=Math.round(((i+1)/names.length)*100);setProgress(pct);onProgress(pct,names[i]);
      }
      setStatus('اكتمل');return {status:'complete',results};
    } finally {queueRunning=false;}
  }
  register('01 · images',lazyImages);
  register('02 · motion policy',()=>{const preferred=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;applyMotion(reducedMotion||preferred);return reducedMotion;});
  register('03 · adaptive quality',()=>applyMode(mode));
  register('04 · memory cache',memorySweep);
  register('05 · health report',healthSnapshot);
  register('06 · local error monitor',enableErrorMonitoring);
  register('07 · idle layout',()=>{document.querySelectorAll('.feature-card,.section-processor,.titan-v82-card').forEach(node=>{if('contentVisibility' in node.style){node.style.contentVisibility='auto';node.style.containIntrinsicSize='1px 92px';}});return 'تم تفعيل عرض العناصر عند الحاجة';});
  function boot() {
    try { mode=localStorage.getItem(KEY)||'auto'; } catch (_) { mode='auto'; }
    try { reducedMotion=localStorage.getItem('esko-v82-reduced-motion')==='1'; } catch (_) { reducedMotion=false; }
    applyMode(mode);applyMotion(reducedMotion || !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    enableErrorMonitoring();
    lazyImages();
    const online=()=>{const n=$('titanOnlineStatus');if(n)n.textContent=navigator.onLine?'متصل':'غير متصل';};
    window.addEventListener('online',online);window.addEventListener('offline',online);online();
    window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;const status=$('titanInstallStatus');if(status)status.textContent='التطبيق قابل للتثبيت من هذا المتصفح.';});
    window.addEventListener('appinstalled',()=>{installPrompt=null;const status=$('titanInstallStatus');if(status)status.textContent='تم تثبيت التطبيق.';});
    const input=$('titanCommandInput');input?.addEventListener('input',()=>renderCommands(input.value));
    $('titanCommandClose')?.addEventListener('click',closeCommandPalette);
    $('titanOpenCommand')?.addEventListener('click',openCommandPalette);
    $('titanCommandPalette')?.addEventListener('click',event=>{if(event.target.id==='titanCommandPalette')closeCommandPalette();});
    window.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openCommandPalette();}if(event.key==='Escape')closeCommandPalette();});
    $('titanMainRun')?.addEventListener('click',async()=>{if($('titanProcessorLog'))$('titanProcessorLog').textContent='بدء المعالج الرئيسي…';const result=await runAll();toast('اكتملت مهام المعالج الرئيسي');if(result.status==='complete')runAudit();});
    $('titanDiagnostics')?.addEventListener('click',()=>{const d=runAudit();appendLog('المراجعة الشاملة: '+d.domNodes+' عنصر DOM · '+d.images+' صورة');toast('اكتملت المراجعة المحلية');});
    $('titanExportReport')?.addEventListener('click',()=>exportJSON('esko-v82-performance-audit.json',{createdAt:new Date().toISOString(),health:healthSnapshot(),errors:errorLog,mode,reducedMotion,processors:[...registry.keys()]}));
    $('titanModeAuto')?.addEventListener('click',()=>applyMode('auto'));
    $('titanModeBalanced')?.addEventListener('click',()=>applyMode('balanced'));
    $('titanModeLite')?.addEventListener('click',()=>applyMode('lite'));
    $('titanMotionToggle')?.addEventListener('click',()=>{applyMotion();toast('تم تحديث إعداد الحركة');});
    $('titanFocusToggle')?.addEventListener('click',()=>setFocus(!document.body.classList.contains('esko-focus-mode')));
    $('titanOpenCommand')?.addEventListener('click',openCommandPalette);
    document.querySelectorAll('[data-titan-action]').forEach(button=>button.addEventListener('click',async()=>{
      const action=button.dataset.titanAction;
      try {
        if(action==='queue'){const a=await run('01 · images');const b=await run('05 · health report');appendLog('اختبار القائمة نجح · '+a.total+' صورة · '+b.domNodes+' عنصر');}
        else if(action==='images'){const r=lazyImages();appendLog('تحسين الصور: '+r.changed+' تغييرات من '+r.total);}
        else if(action==='motion'){const m=applyMotion();appendLog('تقليل الحركة: '+m);}
        else if(action==='quality'){appendLog('جودة الواجهة: '+applyMode(mode));}
        else if(action==='memory'){const r=memorySweep();appendLog('الذاكرة المؤقتة: '+JSON.stringify(r.after));}
        else if(action==='health'){const r=runAudit();appendLog('فحص الصفحة: '+r.domNodes+' عقدة');}
        else if(action==='errors'){appendLog('مراقبة الأخطاء المحلية '+(errorMonitoring?'مفعلة':'غير مفعلة')+' · '+errorLog.length+' خطأ');}
        else if(action==='offline'){const r=await checkOffline();appendLog('الاتصال '+r.network+' · Service Worker '+r.serviceWorker);}
        else if(action==='backup'){const n=exportSafeBackup();appendLog('تصدير '+n+' إعدادات آمنة؛ لا كلمات مرور أو مفاتيح.');}
        else if(action==='search'){openCommandPalette();}
        else if(action==='focus'){setFocus(!document.body.classList.contains('esko-focus-mode'));}
        else if(action==='install'){await installPWA();}
      } catch(error){appendLog('تعذر الإجراء: '+safeText(error.message));}
    }));
    $('titanBackupImportFile')?.addEventListener('change',async event=>{try{const count=await importSafeBackup(event.target.files?.[0]);appendLog('استيراد '+count+' إعدادات. أعد تحميل القسم لمزامنة الواجهة.');toast('تمت استعادة الإعدادات المسموحة');}catch(error){toast('فشل الاستيراد: '+safeText(error.message));}});
    $('titanInstallStatus')?.addEventListener('dblclick',()=>installPWA());
    if($('titanProcessorLog'))$('titanProcessorLog').textContent='المعالج جاهز · '+registry.size+' وحدات تشغيل آمنة.';
    runAudit();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.ESKOTitanProcessor=Object.freeze({register,run,runAll,healthSnapshot,runAudit,applyMode,applyMotion,lazyImages,memorySweep,openCommandPalette,closeCommandPalette,getStatus:()=>({mode,reducedMotion,queueRunning,processors:[...registry.keys()],errors:errorLog.length})});
})();
