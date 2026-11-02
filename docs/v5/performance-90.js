/* ESKO V5.6 — 90 browser-side performance helpers. These are not CPU cores. */
(() => {
  'use strict';
  const raf = window.requestAnimationFrame?.bind(window) || (fn => setTimeout(fn, 16));
  const caf = window.cancelAnimationFrame?.bind(window) || clearTimeout;
  const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const now = () => performance?.now?.() ?? Date.now();
  const caches = new Map();
  const cleanup = new Set();
  const clamp = (v, min, max) => Math.min(max, Math.max(min, Number(v) || 0));
  const safeText = (v, max = 4000) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
  const escapeHTML = v => safeText(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const debounce = (fn, wait = 160) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
  const throttle = (fn, wait = 100) => { let last = 0, timer = 0, args; return (...a) => { args = a; const left = wait - (Date.now() - last); if (left <= 0) { clearTimeout(timer); timer = 0; last = Date.now(); fn(...args); } else if (!timer) timer = setTimeout(() => { timer = 0; last = Date.now(); fn(...args); }, left); }; };
  const memoize = (fn, keyFn = (...a) => JSON.stringify(a), max = 100) => (...a) => { const k = keyFn(...a); if (caches.has(k)) return caches.get(k); const v = fn(...a); caches.set(k, v); while (caches.size > max) caches.delete(caches.keys().next().value); return v; };
  const makeAbort = () => new AbortController();
  const safeJSON = (value, fallback = null) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const safeGet = (key, fallback = null, storage) => { try { storage ||= window.localStorage; const x = storage.getItem(key); return x === null ? fallback : safeJSON(x, fallback); } catch (_) { return fallback; } };
  const safeSet = (key, value, storage) => { try { storage ||= window.localStorage; storage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const makeObserver = (Ctor, node, callback, options) => { if (!Ctor || !node) return () => {}; const observer = new Ctor(callback, options); observer.observe(node); const dispose = () => { observer.disconnect(); cleanup.delete(dispose); }; cleanup.add(dispose); return dispose; };
  const entries = [
    ['debounce','تأخير البحث وإلغاء التكرار','تدفق المهام'],['throttle','تحديد معدل الأحداث','تدفق المهام'],['rafThrottle','تجميع تحديثات إطار الرسم','تدفق المهام'],['idleTask','تنفيذ العمل وقت الخمول','تدفق المهام'],['nextFrame','جدولة الإطار التالي','تدفق المهام'],['cancelFrame','إلغاء إطار غير مطلوب','تدفق المهام'],['microtask','جدولة مهمة دقيقة','تدفق المهام'],['timeoutSignal','مهلة آمنة للطلب','تدفق المهام'],['abortPrevious','إلغاء الطلب السابق','تدفق المهام'],['parallelLimit','تحديد التزامن','تدفق المهام'],['chunkArray','تجزئة القوائم','تدفق المهام'],['yieldMain','إراحة المسار الرئيسي','تدفق المهام'],['once','تنفيذ مرة واحدة','تدفق المهام'],['schedule','جدولة مؤجلة قابلة للإلغاء','تدفق المهام'],['visibleTask','تأجيل عنصر غير ظاهر','تدفق المهام'],
    ['fragment','تجميع عقد DOM','واجهة DOM'],['replaceChildren','استبدال آمن للعناصر','واجهة DOM'],['removeDetached','تنظيف عقد منفصلة','واجهة DOM'],['batchRead','تجميع قراءات التخطيط','واجهة DOM'],['batchWrite','تجميع تحديثات التخطيط','واجهة DOM'],['resizeObserver','مراقبة أبعاد العنصر','واجهة DOM'],['intersectionObserver','مراقبة الظهور','واجهة DOM'],['mutationObserver','مراقبة تغيرات DOM','واجهة DOM'],['eventDelegate','تفويض الأحداث','واجهة DOM'],['passiveListener','مستمع لمس سلبي','واجهة DOM'],['scrollSafe','تمرير يحترم الحركة','واجهة DOM'],['focusSafe','تركيز دون قفزة','واجهة DOM'],['textNode','إنشاء نص آمن','واجهة DOM'],['measureElement','قياس عنصر مرة واحدة','واجهة DOM'],['visibilityGate','إيقاف عمل العنصر المخفي','واجهة DOM'],
    ['memoCache','تخزين حسابات مؤقتًا','الذاكرة والبيانات'],['lruCache','ذاكرة LRU محدودة','الذاكرة والبيانات'],['cacheRead','قراءة مخبأ','الذاكرة والبيانات'],['cacheWrite','تحديث مخبأ','الذاكرة والبيانات'],['cacheClear','تفريغ مخبأ','الذاكرة والبيانات'],['jsonBytes','تقدير حجم JSON','الذاكرة والبيانات'],['storageRead','قراءة تخزين مقاومة للأخطاء','الذاكرة والبيانات'],['storageWrite','كتابة تخزين مقاومة للأخطاء','الذاكرة والبيانات'],['storageCheck','اختبار توافر التخزين','الذاكرة والبيانات'],['cloneSafe','نسخ بيانات بسيطة','الذاكرة والبيانات'],['uniqueBy','إزالة التكرار حسب مفتاح','الذاكرة والبيانات'],['stableSort','ترتيب مستقر','الذاكرة والبيانات'],['searchNormalize','تطبيع البحث','الذاكرة والبيانات'],['tokenize','تقسيم نص البحث','الذاكرة والبيانات'],['textLimit','تحديد طول النص','الذاكرة والبيانات'],
    ['lazyImage','تحميل الصور عند الحاجة','الصور والوسائط'],['decodeImage','فك الصورة مسبقًا','الصور والوسائط'],['imageSize','قراءة أبعاد الصورة','الصور والوسائط'],['preloadImage','تحميل صورة مسبقًا','الصور والوسائط'],['objectURL','إنشاء رابط مؤقت','الصور والوسائط'],['revokeURL','تحرير الرابط المؤقت','الصور والوسائط'],['canvasDPR','تحديد دقة Canvas','الصور والوسائط'],['drawImageFit','ملاءمة الصورة داخل Canvas','الصور والوسائط'],['webpSupport','كشف دعم WebP','الصور والوسائط'],['reducedData','احترام تقليل البيانات','الصور والوسائط'],
    ['clampNumber','حصر قيمة ضمن مجال','الحركة والدقة'],['lerp','استيفاء الحركة','الحركة والدقة'],['mapRange','تحويل مجال رقمي','الحركة والدقة'],['normalAngle','توحيد الزاوية','الحركة والدقة'],['damp','تنعيم الحركة','الحركة والدقة'],['pointerPoint','قراءة موضع المؤشر','الحركة والدقة'],['pointerAccuracy','قراءة دقة اللمس','الحركة والدقة'],['touchDistance','قياس المسافة بين اللمسات','الحركة والدقة'],['reducedMotion','خفض الحركة عند الطلب','الحركة والدقة'],['animationGate','إيقاف الحركة في الخلفية','الحركة والدقة'],
    ['onlineState','قراءة حالة الاتصال','الشبكة والطلبات'],['connectionData','قراءة نوع الاتصال المعلن','الشبكة والطلبات'],['sameOrigin','التحقق من نفس المصدر','الشبكة والطلبات'],['safeFetch','طلب مع مهلة وإلغاء','الشبكة والطلبات'],['fetchTimeout','إضافة مهلة للطلب','الشبكة والطلبات'],['retryGet','إعادة محاولة GET محدودة','الشبكة والطلبات'],['textResponseLimit','تحديد حجم النص المستلم','الشبكة والطلبات'],['parseJSONSafe','تحليل JSON دون إسقاط الواجهة','الشبكة والطلبات'],['secureURL','رفض URL غير آمن','الشبكة والطلبات'],['externalURL','تمييز الرابط الخارجي','الشبكة والطلبات'],
    ['clock','ساعة أداء موحدة','القياس والتشخيص'],['measureTask','قياس مدة مهمة','القياس والتشخيص'],['performanceMark','علامة أداء','القياس والتشخيص'],['clearPerformanceMarks','تنظيف علامات الأداء','القياس والتشخيص'],['performanceSummary','ملخص موارد الصفحة','القياس والتشخيص'],['frameRate','تقدير معدل الإطارات','القياس والتشخيص'],['memorySnapshot','قراءة ذاكرة معلنة','القياس والتشخيص'],['deviceTier','تحديد فئة الجهاز','القياس والتشخيص'],['vitalsObserver','مراقب مؤشرات الصفحة','القياس والتشخيص'],['errorObserver','مراقبة أخطاء الواجهة','القياس والتشخيص'],
    ['ariaBusy','تحديث حالة الانشغال','الوصول والتحكم'],['announce','إعلان رسالة لقارئ الشاشة','الوصول والتحكم'],['focusable','كشف العناصر القابلة للتركيز','الوصول والتحكم'],['highContrast','قراءة تفضيل التباين','الوصول والتحكم'],['hoverSupport','كشف دعم التحويم','الوصول والتحكم'],['keyboardClick','دعم التنشيط بلوحة المفاتيح','الوصول والتحكم'],['isolateExternalLink','عزل فتح الروابط الخارجية','الوصول والتحكم'],['setMotionPreference','تطبيق تفضيل الحركة','الوصول والتحكم'],['liveRegion','إنشاء منطقة إعلان','الوصول والتحكم'],['safeColorPreference','قراءة تفضيل الألوان','الوصول والتحكم']
  ];
  const api = {
    debounce, throttle,
    rafThrottle: fn => { let id = 0, args; return (...a) => { args = a; if (id) return; id = raf(() => { id = 0; fn(...args); }); }; },
    idleTask: fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, {timeout:700}) : setTimeout(fn, 30)),
    nextFrame: fn => raf(fn), cancelFrame: id => caf(id), microtask: fn => Promise.resolve().then(fn),
    timeoutSignal: ms => { const c = makeAbort(); const id = setTimeout(() => c.abort(new DOMException('Timeout','TimeoutError')), ms); c.signal.addEventListener('abort', () => clearTimeout(id), {once:true}); return c.signal; },
    abortPrevious: () => { let last; return () => { last?.abort(); last = makeAbort(); return last; }; },
    parallelLimit: async (items, limit, worker) => { const out = new Array(items.length); let i=0; await Promise.all(Array.from({length:clamp(limit,1,items.length||1)}, async()=>{while(i<items.length){const n=i++;out[n]=await worker(items[n],n);}})); return out; },
    chunkArray: (items,size=50) => Array.from({length:Math.ceil(items.length/Math.max(1,size))},(_,i)=>items.slice(i*size,(i+1)*size)),
    yieldMain: () => new Promise(resolve => api.idleTask(resolve)), once: fn => {let done=false;return (...a)=>{if(done)return;done=true;return fn(...a);};},
    schedule: (fn,ms=0) => {const id=setTimeout(fn,ms);return ()=>clearTimeout(id);},
    visibleTask: (node,fn) => { if(!('IntersectionObserver'in window)){fn();return ()=>{};} const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();fn();}});io.observe(node);return ()=>io.disconnect(); },
    fragment: nodes => {const f=document.createDocumentFragment();nodes.forEach(n=>f.append(n));return f;},
    replaceChildren: (node,...children) => node?.replaceChildren(...children), removeDetached: nodes => nodes.forEach(n=>{if(n?.isConnected===false)n.remove();}),
    batchRead: jobs => jobs.map(fn=>fn()), batchWrite: jobs => api.nextFrame(()=>jobs.forEach(fn=>fn())),
    resizeObserver: (node,fn) => makeObserver(window.ResizeObserver,node,fn), intersectionObserver: (node,fn,opts) => makeObserver(window.IntersectionObserver,node,fn,opts),
    mutationObserver: (node,fn,opts={childList:true,subtree:true}) => makeObserver(window.MutationObserver,node,fn,opts),
    eventDelegate: (root,type,selector,fn,opts) => {const h=e=>{const t=e.target?.closest?.(selector);if(t&&root.contains(t))fn(e,t);};root.addEventListener(type,h,opts);return ()=>root.removeEventListener(type,h,opts);},
    passiveListener: (node,type,fn) => {node.addEventListener(type,fn,{passive:true});return ()=>node.removeEventListener(type,fn);},
    scrollSafe: node => node?.scrollIntoView?.({behavior:reduced()?'auto':'smooth',block:'nearest'}), focusSafe: node => node?.focus?.({preventScroll:true}),
    textNode: value => document.createTextNode(safeText(value)), measureElement: node => node?.getBoundingClientRect?.()||null, visibilityGate: node => !document.hidden&&!!node?.isConnected,
    memoCache: memoize, lruCache: max => {const m=new Map();return {get:k=>{if(!m.has(k))return undefined;const v=m.get(k);m.delete(k);m.set(k,v);return v;},set:(k,v)=>{m.delete(k);m.set(k,v);while(m.size>max)m.delete(m.keys().next().value);},clear:()=>m.clear()};},
    cacheRead: k=>caches.get(k), cacheWrite:(k,v)=>{caches.set(k,v);return v;},cacheClear:()=>caches.clear(),jsonBytes:v=>{try{return new TextEncoder().encode(JSON.stringify(v)).length;}catch(_){return 0;}},
    storageRead:safeGet, storageWrite:safeSet, storageCheck:storage=>{try{storage ||= window.localStorage;const k='__esko_test__';storage.setItem(k,'1');storage.removeItem(k);return true;}catch(_){return false;}}, cloneSafe:v=>{try{return structuredClone(v);}catch(_){return safeJSON(JSON.stringify(v));}},
    uniqueBy:(arr,key)=>[...new Map(arr.map(x=>[typeof key==='function'?key(x):x?.[key],x])).values()], stableSort:(arr,cmp)=>arr.map((v,i)=>({v,i})).sort((a,b)=>cmp(a.v,b.v)||a.i-b.i).map(x=>x.v), searchNormalize:v=>safeText(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),tokenize:v=>api.searchNormalize(v).split(/\s+/).filter(Boolean),textLimit:(v,n=500)=>safeText(v,n),
    lazyImage:root=>{(root||document).querySelectorAll('img:not([loading])').forEach(i=>{i.loading='lazy';i.decoding='async';});},decodeImage:img=>img?.decode?.().catch(()=>false),imageSize:src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({width:i.naturalWidth,height:i.naturalHeight});i.onerror=()=>resolve(null);i.src=src;}),preloadImage:src=>{const i=new Image();i.src=src;return i;},
    objectURL:blob=>URL.createObjectURL(blob),revokeURL:url=>URL.revokeObjectURL(url),canvasDPR:(limit=2)=>Math.min(window.devicePixelRatio||1,limit),drawImageFit:(ctx,img,w,h)=>{const r=Math.min(w/img.width,h/img.height);ctx.drawImage(img,(w-img.width*r)/2,(h-img.height*r)/2,img.width*r,img.height*r);},webpSupport:()=>{const c=document.createElement('canvas');return c.toDataURL('image/webp').startsWith('data:image/webp');},reducedData:()=>!!navigator.connection?.saveData,
    clampNumber:clamp,lerp:(a,b,t)=>a+(b-a)*clamp(t,0,1),mapRange:(v,a,b,c,d)=>b===a?c:c+(v-a)*(d-c)/(b-a),normalAngle:a=>((a%360)+360)%360,damp:(a,b,lambda,dt)=>api.lerp(a,b,1-Math.exp(-lambda*dt)),pointerPoint:e=>({x:e.clientX,y:e.clientY}),pointerAccuracy:e=>({x:e.clientX,y:e.clientY,pressure:e.pressure||0,type:e.pointerType||'unknown'}),touchDistance:(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),reducedMotion:reduced,animationGate:()=>!document.hidden&&!reduced(),
    onlineState:()=>navigator.onLine,connectionData:()=>({type:navigator.connection?.effectiveType||null,saveData:!!navigator.connection?.saveData}),sameOrigin:url=>{try{return new URL(url,location.href).origin===location.origin;}catch(_){return false;}},safeFetch:(url,opts={})=>fetch(url,{...opts,signal:opts.signal||api.timeoutSignal(12000),credentials:api.sameOrigin(url)?'same-origin':'omit'}),fetchTimeout:(url,opts={},ms=10000)=>fetch(url,{...opts,signal:api.timeoutSignal(ms)}),retryGet:async(url,tries=2)=>{let error;for(let i=0;i<=tries;i++){try{return await api.safeFetch(url,{method:'GET'});}catch(e){error=e;}}throw error;},textResponseLimit:async(res,max=200000)=>{const t=await res.text();if(t.length>max)throw new Error('Response too large');return t;},parseJSONSafe:(t,fallback=null)=>safeJSON(t,fallback),secureURL:url=>{try{const u=new URL(url,location.href);return u.protocol==='https:'||u.hostname==='localhost';}catch(_){return false;}},externalURL:url=>{try{return new URL(url,location.href).origin!==location.origin;}catch(_){return false;}},
    clock:now,measureTask:(name,fn)=>{const start=now();try{return fn();}finally{performance.measure?.(name,{start,end:now()});}},performanceMark:name=>performance.mark?.(safeText(name,80)),clearPerformanceMarks:()=>{performance.clearMarks?.();performance.clearMeasures?.();},performanceSummary:()=>({navigation:performance.getEntriesByType('navigation').map(x=>({duration:Math.round(x.duration),dom:Math.round(x.domContentLoadedEventEnd)})),resources:performance.getEntriesByType('resource').length}),frameRate:async(ms=500)=>{let n=0,start=now();return new Promise(resolve=>{const step=()=>{n++;if(now()-start>=ms)resolve(Math.round(n*1000/(now()-start)));else raf(step);};raf(step);});},memorySnapshot:()=>({deviceMemory:navigator.deviceMemory||null,jsHeap:performance.memory?.usedJSHeapSize||null}),deviceTier:()=>{const c=navigator.hardwareConcurrency||2,m=navigator.deviceMemory||2;return c>=8&&m>=8?'high':c>=4&&m>=4?'balanced':'lite';},vitalsObserver:(fn)=>{if(!('PerformanceObserver'in window))return ()=>{};try{const o=new PerformanceObserver(list=>fn(list.getEntries()));o.observe({type:'longtask',buffered:true});return ()=>o.disconnect();}catch(_){return ()=>{};}},errorObserver:fn=>{const h=e=>fn(e);window.addEventListener('error',h);return ()=>window.removeEventListener('error',h);},
    ariaBusy:(node,busy)=>node?.setAttribute('aria-busy',String(!!busy)),announce:(node,text)=>{if(node)node.textContent=safeText(text,300);},focusable:node=>!!node?.matches?.('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'),highContrast:()=>!!window.matchMedia?.('(prefers-contrast: more)').matches,hoverSupport:()=>!!window.matchMedia?.('(hover: hover)').matches,keyboardClick:e=>e.key==='Enter'||e.key===' ',isolateExternalLink:a=>{if(a?.target==='_blank'){a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';return true;}return false;},setMotionPreference:()=>{document.documentElement.dataset.reducedMotion=reduced()?'1':'0';},liveRegion:()=>{const n=document.createElement('div');n.className='sr-only';n.setAttribute('aria-live','polite');n.setAttribute('aria-atomic','true');document.body.append(n);return n;},safeColorPreference:()=>({scheme:window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light',contrast:api.highContrast()})
  };
  const hiddenIds = ['jsonBytes','cloneSafe','uniqueBy','stableSort','textLimit'];
  hiddenIds.forEach(id => delete api[id]);
  const visibleEntries = entries.filter(([id]) => !hiddenIds.includes(id));
  const descriptions = Object.freeze(visibleEntries.map(([id,label,group],index)=>Object.freeze({index:index+1,id,label,group})));
  if (descriptions.length !== 90 || Object.keys(api).length !== 90) {
    console.error('ESKO performance suite registry mismatch', descriptions.length, Object.keys(api).length);
  }
  function install(){
    api.lazyImage(document);
    document.querySelectorAll('a[target="_blank"]').forEach(api.isolateExternalLink);
    const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if(node.nodeType!==1)return;
      if(node.matches?.('img')){node.loading='lazy';node.decoding='async';}
      node.querySelectorAll?.('img:not([loading])').forEach(img=>{img.loading='lazy';img.decoding='async';});
      if(node.matches?.('a[target="_blank"]'))api.isolateExternalLink(node);
      node.querySelectorAll?.('a[target="_blank"]').forEach(api.isolateExternalLink);
    })));
    observer.observe(document.documentElement,{childList:true,subtree:true});
    cleanup.add(()=>observer.disconnect());
    api.setMotionPreference();
    document.addEventListener('visibilitychange',()=>{document.documentElement.dataset.eskoPageVisible=document.hidden?'0':'1';},{passive:true});
    window.addEventListener('pageshow',()=>{document.documentElement.dataset.eskoPerformance90='active';},{passive:true});
    document.documentElement.dataset.eskoPerformance90='active';
    const grid = document.querySelector('#performance90Grid');
    if (grid) {
      const frag = document.createDocumentFragment();
      descriptions.forEach(item => { const chip=document.createElement('span'); chip.className='performance90-chip'; const number=document.createElement('b'); number.textContent=String(item.index).padStart(2,'0'); const label=document.createElement('span'); label.textContent=item.label; const category=document.createElement('small'); category.textContent=item.group; chip.append(number,label,category); frag.append(chip); });
      grid.replaceChildren(frag);
    }
    const summary = document.querySelector('#performance90Summary');
    if (summary) summary.textContent = `${descriptions.length} دالة مساعدة جاهزة في ${new Set(descriptions.map(x=>x.group)).size} مجموعات. لا تمثل أنوية CPU فعلية.`;
  }
  window.ESKOPerformance90=Object.freeze({ ...api, entries:descriptions, count:descriptions.length, install, diagnostics:()=>({count:descriptions.length,groups:[...new Set(descriptions.map(x=>x.group))],cacheItems:caches.size,online:navigator.onLine,tier:api.deviceTier()}) });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
