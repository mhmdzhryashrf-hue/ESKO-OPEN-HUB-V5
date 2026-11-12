(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const KEY = 'mihwar-v1-local-state';
  const DB_NAME = 'mihwar-local-files-v1';
  const navPages = {
    home: ['البيت', 'المحتوى والبحث والاكتشاف في مكان واحد.'],
    settings: ['الإعدادات', 'تحكم في الخصوصية والمظهر والإشعارات وإمكانية الوصول.'],
    discussions: ['المناقشات', 'مساحات محلية لتنظيم الرسائل والملاحظات على هذا الجهاز.'],
    repositories: ['المستودعات', 'مكتبتك الشخصية للملفات والروابط والمحفوظات.'],
    store: ['المتجر الإلكتروني', 'كتالوج منتجات محلي وسلة معاينة دون تحصيل أموال.'],
    account: ['الحساب', 'إدارة هويتك ومسوداتك ونشاطك ومحتواك.']
  };
  const freshState = () => ({
    profile: { name: 'مستخدم مِحور', bio: 'مساحتي في مِحور', private: false },
    posts: [], drafts: [], saved: [], hidden: [], reports: [],
    rooms: [{ id: 'personal', name: 'ملاحظاتي الخاصة', kind: 'خاص' }],
    messages: [], folders: ['ملفاتي', 'المشاريع', 'التعلم'],
    products: [], cart: [], orders: [],
    settings: { theme: 'dark', reduceMotion: false, notifications: true, showOnline: true, language: 'ar', assistantMemory: false },
    studioDrafts: [], activity: []
  });
  let state = loadState();
  let catalog = null;
  let currentPage = 'home';
  let currentRoom = 'personal';
  let currentCatalogTab = 'core';
  let confirmAction = null;
  let toastTimer = null;

  function loadState() {
    try { return { ...freshState(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { return freshState(); }
  }
  function persist() { localStorage.setItem(KEY, JSON.stringify(state)); updateSavedCount(); }
  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
  function id(prefix = 'x') { return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`; }
  function date(value = new Date()) { return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(value); }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }
  function logActivity(action, detail = '') { state.activity.unshift({ action, detail, at: new Date().toISOString() }); state.activity = state.activity.slice(0, 100); persist(); }
  function updateSavedCount() { const n = state.saved.length + state.folders.length; $('#saved-count').textContent = `${n} عنصر محفوظ`; }
  function applySettings() {
    document.body.classList.toggle('light', state.settings.theme === 'light');
    document.body.classList.toggle('reduce-motion', !!state.settings.reduceMotion);
    document.documentElement.lang = state.settings.language || 'ar';
    document.documentElement.dir = state.settings.language === 'en' ? 'ltr' : 'rtl';
  }
  function confirmDialog(title, message, actionLabel = 'تأكيد') {
    return new Promise(resolve => {
      const dialog = $('#confirm-dialog');
      $('#confirm-title').textContent = title;
      $('#confirm-message').textContent = message;
      $('#confirm-yes').textContent = actionLabel;
      confirmAction = () => { dialog.close(); resolve(true); confirmAction = null; };
      $('#confirm-cancel').onclick = () => { dialog.close(); resolve(false); confirmAction = null; };
      $('#confirm-yes').onclick = () => confirmAction && confirmAction();
      dialog.showModal();
    });
  }
  function setPage(page) {
    currentPage = navPages[page] ? page : 'home';
    $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.page === currentPage));
    $('#view-title').textContent = navPages[currentPage][0];
    $('#view-subtitle').textContent = navPages[currentPage][1];
    render();
    window.scrollTo({ top: 0, behavior: state.settings.reduceMotion ? 'auto' : 'smooth' });
  }
  function empty(title, detail) { return `<div class="empty"><b>${esc(title)}</b>${esc(detail)}</div>`; }
  function button(label, action, attrs = '') { return `<button type="button" class="secondary-btn" data-action="${esc(action)}" ${attrs}>${esc(label)}</button>`; }
  function render() {
    applySettings();
    const view = $('#view');
    const methods = { home: renderHome, settings: renderSettings, discussions: renderDiscussions, repositories: renderRepositories, store: renderStore, account: renderAccount };
    view.innerHTML = methods[currentPage]();
    if (currentPage === 'discussions') renderMessages();
    if (currentPage === 'repositories') refreshFiles();
  }

  function renderHome() {
    const visible = state.posts.filter(p => !state.hidden.includes(p.id)).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    return `<div class="stack">
      <section class="panel">
        <div class="panel-head"><div><h2>موجز المنشورات</h2><span class="subtle">لك · أتابع · الأحدث</span></div><span class="pill">${visible.length} منشور</span></div>
        <form id="post-form">
          <div class="field"><label for="post-text">شارك فكرة أو تحديثاً</label><textarea id="post-text" maxlength="5000" placeholder="ما الذي تريد أن يعرفه مجتمعك؟" required></textarea></div>
          <div class="button-row"><button class="primary-btn" type="submit">معاينة ثم نشر</button><span class="subtle">لن يُنشر المحتوى دون موافقتك.</span></div>
        </form>
      </section>
      <section class="feed" id="feed">${visible.length ? visible.map(postCard).join('') : empty('لا توجد منشورات بعد','أنشئ أول منشور ليظهر هنا. يمكنك حفظه كمسودة من صفحة الحساب.')}</section>
    </div>`;
  }
  function postCard(p) {
    return `<article class="post-card" data-post="${esc(p.id)}"><div class="post-meta"><span class="post-avatar">${esc((p.author || state.profile.name).slice(0,1))}</span><div><strong>${esc(p.author || state.profile.name)}</strong><small>${esc(date(new Date(p.createdAt)))}</small></div><span class="pill muted-pill">${esc(p.audience || 'عام')}</span></div><p class="post-body">${esc(p.text)}</p><div class="post-actions"><button data-action="like">♥ إعجاب · ${Number(p.likes || 0)}</button><button data-action="comment">تعليق</button><button data-action="save">حفظ</button><button data-action="share">نسخ النص</button><button data-action="hide">غير مهتم</button><button data-action="report">إبلاغ</button></div>${(p.comments || []).length ? `<div class="subtle" style="margin-top:10px">${p.comments.map(c=>`<p>↳ ${esc(c.text)} <small>· ${esc(c.author)}</small></p>`).join('')}</div>` : ''}</article>`;
  }
  function renderSettings() {
    const s=state.settings;
    return `<div class="stack"><section class="panel"><div class="panel-head"><h2>المظهر وإمكانية الوصول</h2><span class="pill">محلي على الجهاز</span></div>
      <div class="setting-row"><div><strong>الوضع الفاتح</strong><small>تغيير ألوان الواجهة دون إعادة تحميل.</small></div><input class="switch" type="checkbox" data-setting="theme" ${s.theme==='light'?'checked':''}></div>
      <div class="setting-row"><div><strong>تقليل الحركة</strong><small>إيقاف الانتقالات والحركات غير الضرورية.</small></div><input class="switch" type="checkbox" data-setting="reduceMotion" ${s.reduceMotion?'checked':''}></div>
      <div class="setting-row"><div><strong>الإشعارات المحلية</strong><small>تفضيل واجهة فقط؛ الإشعارات الخادمة غير مفعلة.</small></div><input class="switch" type="checkbox" data-setting="notifications" ${s.notifications?'checked':''}></div>
      <div class="setting-row"><div><strong>إظهار حالة الاتصال</strong><small>إعداد ظهور محلي غير مرتبط بمستخدمين آخرين.</small></div><input class="switch" type="checkbox" data-setting="showOnline" ${s.showOnline?'checked':''}></div>
      <div class="field"><label for="language-select">لغة الواجهة</label><select id="language-select"><option value="ar" selected>العربية</option><option value="en" disabled>لغات أخرى — قيد الإعداد</option></select></div>
      </section>
      <section class="panel"><div class="panel-head"><h2>الخصوصية والبيانات</h2></div>
      <div class="setting-row"><div><strong>حفظ سياق المساعد</strong><small>مغلق افتراضياً؛ لن أحفظ سجل المساعد ما لم تفعّله.</small></div><input class="switch" type="checkbox" data-setting="assistantMemory" ${s.assistantMemory?'checked':''}></div>
      <div class="button-row"><button class="secondary-btn" data-action="export-data">تصدير بياناتي</button><button class="danger-btn" data-action="clear-data">مسح البيانات المحلية</button></div>
      <p class="subtle">إدارة الجلسات والمصادقة الثنائية والحذف السحابي تحتاج خادم هوية مؤمناً، لذلك لا تظهر كخدمة متصلة هنا.</p></section></div>`;
  }
  function renderDiscussions() {
    return `<section class="panel"><div class="panel-head"><div><h2>المناقشات</h2><span class="subtle">محادثات محلية خاصة بهذا المتصفح</span></div><button class="secondary-btn" data-action="new-room">+ مساحة جديدة</button></div>
      <div class="room-layout"><aside class="room-list">${state.rooms.map(r=>`<button class="room-choice ${r.id===currentRoom?'active':''}" data-room="${esc(r.id)}"><span>${esc(r.name)}</span><small>${esc(r.kind)}</small></button>`).join('')}</aside>
      <section class="room-chat"><div class="subtle">${esc(state.rooms.find(r=>r.id===currentRoom)?.name || 'محادثة')}</div><div class="messages" id="messages"></div><form class="chat-form" id="message-form"><input class="input" id="message-text" placeholder="اكتب رسالة محلية…" maxlength="2000" required><button class="primary-btn">إرسال</button></form><small class="subtle">لا يتم إرسال هذه الرسائل إلى الإنترنت أو إلى حساب آخر.</small></section></div></section>`;
  }
  function renderMessages() {
    const target=$('#messages'); if(!target)return;
    const messages=state.messages.filter(m=>m.roomId===currentRoom).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
    target.innerHTML=messages.length?messages.map(m=>`<div class="message mine">${esc(m.text)}<small>${esc(date(new Date(m.createdAt)))}</small></div>`).join(''):empty('هذه المساحة فارغة','اكتب أول رسالة أو ملاحظة محلية.');
    target.scrollTop=target.scrollHeight;
  }
  function renderRepositories() {
    return `<section class="panel repository-panel"><div class="panel-head"><div><h2>المستودعات</h2><span class="subtle">مكتبة شخصية · الملفات لا تُرفع إلى خادم خارجي</span></div><span class="pill">تخزين المتصفح</span></div>
      <div class="grid-two"><div class="stat-card"><strong id="repo-file-count">—</strong><span>ملفات محفوظة على هذا الجهاز</span></div><div class="stat-card"><strong>${state.folders.length}</strong><span>مجلدات</span></div></div>
      <div class="repo-toolbar" style="margin-top:15px"><input class="input" id="repo-search" placeholder="ابحث في ملفاتك…"><button class="secondary-btn" data-action="new-folder">إنشاء مجلد</button><label class="primary-btn" for="repo-upload" style="cursor:pointer">+ إضافة ملفات</label><input id="repo-upload" type="file" multiple hidden></div>
      <div class="field"><label for="repo-folder">حفظ داخل المجلد</label><select id="repo-folder">${state.folders.map(f=>`<option>${esc(f)}</option>`).join('')}</select></div>
      <div id="file-list" class="file-list">${empty('تحميل المستودع','جارٍ قراءة الملفات المحلية…')}</div>
      <div class="panel-head" style="margin-top:18px"><h2>المنشورات المحفوظة</h2><span class="pill">${state.saved.length}</span></div>
      <div class="list">${state.saved.length?state.saved.map(x=>`<div class="list-row"><div><strong>${esc(x.text.slice(0,90))}</strong><small>${esc(date(new Date(x.at)))}</small></div><button class="chip-button" data-action="remove-saved" data-id="${esc(x.postId)}">إزالة</button></div>`).join(''):empty('لا توجد عناصر محفوظة','استخدم زر حفظ داخل بطاقة منشور لإضافته هنا.')}</div>
      <div class="subtle" style="margin-top:12px">الخلفية الأمنية المرفقة ظاهرة بتعتيم شديد حتى تبقى أسماء الملفات والأزرار واضحة.</div>
    </section>`;
  }
  function renderStore() {
    return `<div class="stack"><section class="panel"><div class="panel-head"><div><h2>سوق مِحور</h2><span class="subtle">منتجات محلية قابلة للإضافة والمعاينة</span></div><button class="secondary-btn" data-action="new-product">+ إضافة منتج</button></div><div class="repo-toolbar"><input class="input" id="product-search" placeholder="ابحث في المنتجات…"><button class="secondary-btn" data-action="view-cart">السلة (${state.cart.length})</button></div></section>
      <section id="product-grid" class="grid-three">${state.products.length?state.products.map(productCard).join(''):empty('لا توجد منتجات','أضف منتجاً محلياً لتجربة الكتالوج. الدفع والطلبات الحقيقية غير متصلين.')}</section>
      <section class="panel"><div class="panel-head"><h2>طلبات المعاينة</h2><span class="pill muted-pill">ليست مدفوعة</span></div>${state.orders.length?`<div class="list">${state.orders.map(o=>`<div class="list-row"><div><strong>طلب محلي #${esc(o.id.slice(-6))}</strong><small>${esc(o.items.join('، '))} · ${esc(date(new Date(o.createdAt)))}</small></div><span class="pill muted-pill">${esc(o.status)}</span></div>`).join('')}</div>`:empty('لا توجد طلبات','تستطيع تجربة إعداد ملخص طلب دون تحصيل أموال.')}</section></div>`;
  }
  function productCard(p) { return `<article class="product-card" data-product="${esc(p.id)}"><div class="product-art">◇</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="product-price">${Number(p.price).toLocaleString('ar-EG')} ${esc(p.currency||'جنيه')}</div><div class="button-row"><button class="primary-btn" data-action="add-cart">أضف للسلة</button><span class="pill muted-pill">${esc(p.owner||state.profile.name)}</span></div></article>`; }
  function renderAccount() {
    return `<div class="stack"><section class="panel"><div class="panel-head"><div><h2>الملف الشخصي</h2><span class="subtle">الهوية والنشر في مكان واحد</span></div><span class="pill">${state.posts.length} منشور</span></div>
      <form id="profile-form"><div class="field"><label for="profile-name">اسم العرض</label><input id="profile-name" maxlength="60" value="${esc(state.profile.name)}" required></div><div class="field"><label for="profile-bio">نبذة</label><textarea id="profile-bio" maxlength="500">${esc(state.profile.bio)}</textarea></div><div class="setting-row"><div><strong>حساب خاص</strong><small>تفضيل محلي فقط؛ لا يغيّر ظهوراً على خادم.</small></div><input type="checkbox" class="switch" id="profile-private" ${state.profile.private?'checked':''}></div><button class="primary-btn" type="submit">حفظ الملف</button></form></section>
      <section class="panel"><div class="panel-head"><h2>المسودات</h2><span class="pill">${state.drafts.length}</span></div><form id="draft-form"><div class="field"><label for="draft-text">مسودة منشور</label><textarea id="draft-text" maxlength="5000" placeholder="اكتب واحفظ دون نشر…" required></textarea></div><button class="secondary-btn">حفظ المسودة</button></form><div class="list" style="margin-top:12px">${state.drafts.length?state.drafts.map(d=>`<div class="list-row"><div><strong>${esc(d.text.slice(0,70))}</strong><small>${esc(date(new Date(d.createdAt)))}</small></div><div class="button-row"><button class="chip-button" data-action="publish-draft" data-id="${esc(d.id)}">معاينة النشر</button><button class="chip-button" data-action="delete-draft" data-id="${esc(d.id)}">حذف</button></div></div>`).join(''):empty('لا توجد مسودات','المسودات تبقى على جهازك حتى تنشرها بنفسك.')}</div></section>
      <section class="panel"><div class="panel-head"><h2>سجل النشاط المحلي</h2></div>${state.activity.length?`<div class="list">${state.activity.slice(0,10).map(a=>`<div class="list-row"><div><strong>${esc(a.action)}</strong><small>${esc(a.detail)} · ${esc(date(new Date(a.at)))}</small></div></div>`).join('')}</div>`:empty('لا يوجد نشاط','ستظهر هنا الإجراءات التي تنفذها في هذه النسخة.')}</section></div>`;
  }

  // IndexedDB provides file blobs without filling localStorage with binary data.
  function openFileDB() {
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)) return reject(new Error('هذا المتصفح لا يدعم التخزين المحلي للملفات.'));
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('files'))db.createObjectStore('files',{keyPath:'id'});};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('تعذر فتح تخزين الملفات.'));
    });
  }
  async function fileDB(method, value) {
    const db=await openFileDB();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('files',method==='getAll'?'readonly':'readwrite');const store=tx.objectStore('files');
      let req=method==='getAll'?store.getAll():method==='put'?store.put(value):store.delete(value);
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();tx.onerror=()=>reject(tx.error);
    });
  }
  async function refreshFiles() {
    const list=$('#file-list');if(!list)return;
    try {
      const files=await fileDB('getAll');
      $('#repo-file-count').textContent=files.length;
      const query=($('#repo-search')?.value||'').trim().toLowerCase();
      const filtered=files.filter(f=>(f.name+' '+f.folder).toLowerCase().includes(query));
      list.innerHTML=filtered.length?filtered.map(f=>`<div class="file-row" data-file="${esc(f.id)}"><span class="file-icon">▧</span><div><strong>${esc(f.name)}</strong><small>${esc(f.folder)} · ${formatBytes(f.size)} · ${esc(date(new Date(f.createdAt)))}</small></div><div class="file-actions"><button data-action="download-file">تنزيل</button><button data-action="delete-file">حذف</button></div></div>`).join(''):empty('لا توجد ملفات مطابقة','أضف ملفاً أو جرّب كلمة بحث أخرى.');
    } catch(e) { list.innerHTML=empty('تعذر فتح مخزن الملفات',e.message); }
  }
  function formatBytes(bytes){if(bytes<1024)return `${bytes} B`;if(bytes<1048576)return `${(bytes/1024).toFixed(1)} KB`;return `${(bytes/1048576).toFixed(1)} MB`;}
  async function addFiles(fileList) {
    const folder=$('#repo-folder')?.value||'ملفاتي';
    for(const file of [...fileList]) {
      if(file.size>50*1024*1024){toast(`تم تجاوز الحد المحلي (50MB): ${file.name}`);continue;}
      const rec={id:id('file'),name:file.name,type:file.type,size:file.size,folder,createdAt:new Date().toISOString(),blob:file};
      try{await fileDB('put',rec);}catch(e){toast(`تعذر حفظ ${file.name}: ${e.message}`);}
    }
    logActivity('إضافة ملفات',`${fileList.length} ملف/ملفات`);await refreshFiles();toast('تم حفظ الملفات محلياً على هذا الجهاز.');
  }
  async function downloadFile(fileId) {const files=await fileDB('getAll');const f=files.find(x=>x.id===fileId);if(!f)return;const url=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=url;a.download=f.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);}

  function renderModules() {
    if(!catalog)return;
    $('#core-centers').innerHTML=[['MIHWAR STUDIO','مصنع الأقسام والأدوات والسيناريوهات والواجهات.'],['MIHWAR AI','مساعد عام ومساعدون متخصصون وتحليل ملفات مع صلاحيات.'],['MIHWAR CLOUD','الهوية والجلسات والملفات والبيانات والمهام الخلفية.'],['MIHWAR MARKET','كتالوج البائعين والمنتجات والطلبات والدفع.'],['MIHWAR WORLD','المجتمعات والغرف والنوادي والفعاليات والعوالم.'],['MIHWAR ADMIN','الإدارة والإشراف والبلاغات والتدقيق والإصدارات.']].map(x=>`<article class="center-card"><strong>${esc(x[0])}</strong><p>${esc(x[1])}</p></article>`).join('');
    const grid=$('#module-grid');const q=($('#module-search').value||'').toLowerCase();
    const ms=catalog.update02.modules.filter(m=>(m.name+' '+m.description).toLowerCase().includes(q));
    $('#module-count').textContent=`${ms.length} / 25 وحدة`;
    grid.innerHTML=ms.map(m=>`<article class="module-card"><strong>${esc(m.id)} · ${esc(m.name)}</strong><p>${esc(m.description)}</p><div class="module-meta"><span>40 أمر · 8 سيناريوهات</span><span>كتالوج تخطيطي</span></div></article>`).join('');
  }
  function renderCatalog() {
    if(!catalog)return;
    $('#catalog-stats').innerHTML=`<div><strong>700,000</strong><small>معرّف أمر أساسي</small></div><div><strong>3,000</strong><small>سيناريو أساسي</small></div><div><strong>2,000</strong><small>نسخة خدمة منطقية</small></div><div><strong>4,000</strong><small>وحدة معالجة منطقية</small></div>`;
    const list=$('#catalog-list');
    if(currentCatalogTab==='core') {
      list.innerHTML=catalog.core.command_families.slice(0,120).map(f=>`<div class="list-row"><div><strong>${esc(f.code)} · ${esc(f.function)}</strong><small>${esc(f.section)} · ${esc(f.first)} … ${esc(f.last)}</small></div><span class="pill muted-pill">فهرس فقط</span></div>`).join('')+`<div class="subtle">يعرض أول 120 عائلة. ابحث عن أي معرّف في الحقل أعلاه لتحديد حالته.</div>`;
    } else if(currentCatalogTab==='update') {
      list.innerHTML=catalog.update02.modules.map(m=>`<div class="list-row"><div><strong>${esc(m.id)} · ${esc(m.name)}</strong><small>${m.commands} أمر · ${m.scenarios} سيناريو · ${m.logical_services} خدمات · ${m.processors} معالجات</small></div><span class="pill muted-pill">قالب أوامر</span></div>`).join('');
    } else {
      list.innerHTML=catalog.core.scenario_templates.map(s=>`<div class="list-row"><div><strong>${esc(s.code)} · ${esc(s.title)}</strong><small>${esc(s.expected)} · ${s.first} … ${s.last}</small></div><span class="pill muted-pill">50 تنويعاً</span></div>`).join('')+catalog.update02.modules.map(m=>`<div class="list-row"><div><strong>${esc(m.id)} · 8 سيناريوهات تحديث</strong><small>${esc(m.name)}</small></div><span class="pill muted-pill">UPD2-SCN-1…8</span></div>`).join('');
    }
  }
  function lookupCommand(query) {
    const q=query.trim().toUpperCase();
    let m=q.match(/^([HSDRMA])-F(\d{3})-V(\d{4})$/);
    if(m){const f=catalog.core.command_families.find(x=>x.code===`${m[1]}-F${m[2]}`);const v=Number(m[3]);if(!f||v<1||v>1000)return null;return {id:q,title:f.function,section:f.section,status:f.executable?'مرتبط بتنفيذ':'فهرس فقط - لم يربط بعقد API واختبار إنتاجي',source:f.source,range:`${f.first} إلى ${f.last}`};}
    m=q.match(/^UPD2-(\d{2})-CMD-(\d{2})$/);
    if(m){const mod=catalog.update02.modules.find(x=>x.id===`UPD2-${m[1]}`);const n=Number(m[2]);if(!mod||n<1||n>40)return null;return {id:q,title:`${actionsFor(n)} · ${mod.name}`,section:'تحديث المواصفات 02',status:'قالب أمر قابل للتخصيص - ليس وظيفة إنتاجية مستقلة',source:'Mihwar_App_Blueprint_Update_02.pdf',range:`UPD2-${m[1]}-CMD-01 إلى UPD2-${m[1]}-CMD-40`};}
    m=q.match(/^([HSDRMA])-SC(\d{2})-V(\d{3})$/);
    if(m){const s=catalog.core.scenario_templates.find(x=>x.code===`${m[1]}-SC${m[2]}`);const v=Number(m[3]);if(!s||v<1||v>50)return null;return {id:q,title:s.title,section:s.section,status:'سيناريو اختبار مولّد - يلزم تشغيله وتسجيل نتيجة حقيقية',source:'Mihwar_App_Blueprint_Arabic.pdf',expected:s.expected};}
    m=q.match(/^UPD2-(\d{2})-SCN-([1-8])$/);
    if(m){const mod=catalog.update02.modules.find(x=>x.id===`UPD2-${m[1]}`);if(!mod)return null;return {id:q,title:mod.name,section:'تحديث المواصفات 02',status:'سيناريو قالب غير منفذ آلياً بعد',expected:catalog.update02.scenario_templates_per_module[Number(m[2])-1]};}
    m=q.match(/^([HSDRMAX])-SRV(\d{3})-N(\d{2})$/);
    if(m){const family=catalog.core.server_families.find(x=>x.code===`${m[1]}-SRV${m[2]}`);const n=Number(m[3]);if(!family||n<1||n>10)return null;return {id:q,title:family.role||'خدمة منطقية',section:'خدمات البنية',status:family.source==='pdf-extracted'?'نسخة منطقية ضمن الكتالوج - ليست خادماً فعلياً':'سجل فجوة مضاف لاستكمال العدد المعلن - غير مفصل بالمصدر',range:`${family.code}-N01 إلى ${family.code}-N10`};}
    m=q.match(/^([HSDRMAX])-PRC(\d{3})-W(\d{2})$/);
    if(m){const family=catalog.core.processor_families.find(x=>x.code===`${m[1]}-PRC${m[2]}`);const n=Number(m[3]);if(!family||n<1||n>10)return null;return {id:q,title:family.task||'وحدة معالجة برمجية',section:'وحدات المعالجة البرمجية',status:family.source==='pdf-extracted'?'وحدة منطقية في الكتالوج - ليست نواة CPU فعلية':'سجل فجوة مضاف لاستكمال العدد المعلن - غير مفصل بالمصدر',range:`${family.code}-W01 إلى ${family.code}-W10`};}
    m=q.match(/^UPD2-(\d{2})-SRV-([1-4])$/);
    if(m){const mod=catalog.update02.modules.find(x=>x.id===`UPD2-${m[1]}`);if(!mod)return null;return {id:q,title:mod.name,section:'خدمات التحديث الثاني',status:'وصف خدمة منطقية في الوثيقة؛ لا يوجد خادم مستقل قيد التشغيل'};}
    m=q.match(/^UPD2-(\d{2})-PRC-([1-6])$/);
    if(m){const mod=catalog.update02.modules.find(x=>x.id===`UPD2-${m[1]}`);if(!mod)return null;return {id:q,title:mod.name,section:'معالجات التحديث الثاني',status:'وحدة عمل برمجية تخطيطية؛ لا تمثل معالجاً مادياً'};}
    return null;
  }
  function actionsFor(n){return catalog.update02.modules[0].command_verbs[n-1]||'نفّذ';}

  function exportData() {
    const payload={app:'MIHWAR',version:'local-v1',exportedAt:new Date().toISOString(),state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`mihwar-data-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast('تم تجهيز نسخة البيانات المحلية.');
  }
  async function assistantReply(text) {
    const q=text.trim(); const lower=q.toLowerCase();
    let answer='أستطيع في هذه النسخة التعامل مع البيانات المحلية فقط. جرّب طلب تلخيص المنشورات أو البحث عن كلمة أو صياغة مسودة.';
    if(/لخص|تلخيص|ملخص/.test(q)) {
      const posts=state.posts.filter(p=>!state.hidden.includes(p.id));
      answer=posts.length?`لديك ${posts.length} منشوراً محلياً. أحدثها: ${posts.slice(0,3).map(p=>p.text.slice(0,90)).join(' | ')}`:'لا توجد منشورات محلية حتى الآن لألخصها.';
    } else if(/ابحث|بحث/.test(q)) {
      const terms=q.replace(/ابحث|بحث|عن|في|المنشورات|المحتوى/g,' ').trim().split(/\s+/).filter(Boolean);
      const found=state.posts.filter(p=>terms.some(t=>p.text.includes(t)));
      answer=found.length?`وجدت ${found.length} نتيجة محلية:\n${found.slice(0,5).map(p=>'• '+p.text.slice(0,130)).join('\n')}`:'لم أجد تطابقاً في منشوراتك المحلية. لا أبحث في الرسائل الخاصة أو الإنترنت.';
    } else if(/اكتب|صياغة|مسودة/.test(q)) {
      const subject=q.replace(/اكتب|صياغة|مسودة|منشور|عن/g,'').trim()||'فكرة جديدة';
      const draft=`أشارككم اليوم ${subject}.\n\nما رأيكم؟ يسعدني قراءة اقتراحاتكم وتجاربكم.`;
      state.drafts.unshift({id:id('draft'),text:draft,createdAt:new Date().toISOString()});persist();
      answer=`جهزت مسودة قابلة للمراجعة وحفظتها في الحساب:\n\n${draft}\n\nلم يتم نشرها.`;
    } else if(/مساعد|حدود|صلاحيات/.test(q)) {
      answer='حدود المساعد حسب المواصفات: القراءة ضمن صلاحيات المستخدم وبطلب منه؛ الاقتراح لا يغيّر بيانات الحساب؛ التنفيذ الحساس يحتاج معاينة وتأكيداً مستقلاً؛ ويُمنع تجاوز الخصوصية أو الحظر أو الوصول لحساب آخر.';
    } else if(/أوامر|كتالوج|700/.test(q)) {
      answer='الكتالوج يولّد 700,000 معرّف من 700 عائلة. المعرف لا يعني وظيفة مكتملة؛ افتح مراكز مِحور ثم كتالوج الأوامر للتحقق من أي معرّف وحالة ربطه.';
    } else if(/مرحبا|السلام/.test(q)) answer='أهلاً بك في مِحور. أستطيع تلخيص منشورات هذا الجهاز والبحث فيها أو حفظ مسودة دون نشرها.';
    return answer;
  }
  function assistantAdd(who,text){const box=$('#assistant-log');const el=document.createElement('div');el.className=`assistant-message ${who}`;el.textContent=text;box.append(el);box.scrollTop=box.scrollHeight;}

  // Event delegation for all dynamic sections.
  document.addEventListener('click', async event => {
    const nav=event.target.closest('[data-page]');if(nav){setPage(nav.dataset.page);return;}
    const room=event.target.closest('[data-room]');if(room){currentRoom=room.dataset.room;render();return;}
    const cmdTab=event.target.closest('[data-catalog-tab]');if(cmdTab){currentCatalogTab=cmdTab.dataset.catalogTab;$$('[data-catalog-tab]').forEach(b=>b.classList.toggle('active',b===cmdTab));renderCatalog();return;}
    const actionButton=event.target.closest('[data-action]');if(!actionButton)return;
    const action=actionButton.dataset.action;const card=actionButton.closest('[data-post]');const product=actionButton.closest('[data-product]');const fileRow=actionButton.closest('[data-file]');
    try {
      if(action==='like'&&card){const p=state.posts.find(x=>x.id===card.dataset.post);if(p){p.likedByMe=!p.likedByMe;p.likes=Math.max(0,(p.likes||0)+(p.likedByMe?1:-1));persist();render();}}
      if(action==='save'&&card){const p=state.posts.find(x=>x.id===card.dataset.post);if(p&&!state.saved.some(x=>x.postId===p.id)){state.saved.push({postId:p.id,text:p.text,at:new Date().toISOString()});persist();toast('تم حفظ المنشور في المستودعات.');}else toast('المنشور محفوظ بالفعل.');}
      if(action==='remove-saved'){state.saved=state.saved.filter(x=>x.postId!==actionButton.dataset.id);persist();render();toast('تمت إزالة العنصر من المحفوظات.');}
      if(action==='comment'&&card){const text=prompt('اكتب تعليقك:');if(text?.trim()){const p=state.posts.find(x=>x.id===card.dataset.post);p.comments=p.comments||[];p.comments.push({text:text.trim(),author:state.profile.name});persist();render();}}
      if(action==='share'&&card){const p=state.posts.find(x=>x.id===card.dataset.post);if(p&&navigator.clipboard){await navigator.clipboard.writeText(p.text);toast('تم نسخ نص المنشور.');}else toast('تعذر الوصول إلى الحافظة.');}
      if(action==='hide'&&card){state.hidden.push(card.dataset.post);persist();render();toast('تم إخفاء المنشور من موجزك المحلي.');}
      if(action==='report'&&card){const reason=prompt('اكتب سبب الإبلاغ:');if(reason?.trim()){state.reports.push({postId:card.dataset.post,reason:reason.trim(),at:new Date().toISOString()});persist();toast('تم تسجيل البلاغ محلياً للمراجعة؛ البلاغ وحده لا يثبت مخالفة.');}}
      if(action==='new-studio-draft'){const name=prompt('اسم القسم أو الأداة المقترحة:');if(name?.trim()){const description=prompt('صف الغرض والمدخلات والمخرجات والصلاحيات:')||'';const draft={id:id('studio'),name:name.trim(),description,createdAt:new Date().toISOString(),status:'معاينة فقط - تحتاج مراجعة صلاحيات وموافقة'};state.studioDrafts.unshift(draft);persist();logActivity('إنشاء مخطط Studio',draft.name);toast('تم حفظ المخطط كمسودة معاينة فقط، ولم يتم نشر أو تشغيل أي أداة.');}}
      if(action==='new-room'){const name=prompt('اسم المساحة الجديدة:');if(name?.trim()){const r={id:id('room'),name:name.trim(),kind:'محلية'};state.rooms.push(r);currentRoom=r.id;persist();render();}}
      if(action==='new-folder'){const name=prompt('اسم المجلد:');if(name?.trim()&&!state.folders.includes(name.trim())){state.folders.push(name.trim());persist();render();toast('تم إنشاء المجلد.');}}
      if(action==='download-file'&&fileRow)await downloadFile(fileRow.dataset.file);
      if(action==='delete-file'&&fileRow){const ok=await confirmDialog('حذف ملف محلي','سيُحذف الملف من مساحة هذا المتصفح. لا يمكن التراجع عن الحذف.','حذف الملف');if(ok){await fileDB('delete',fileRow.dataset.file);await refreshFiles();toast('تم حذف الملف المحلي.');}}
      if(action==='new-product'){const name=prompt('اسم المنتج:');if(!name?.trim())return;const price=Number(prompt('السعر بالجنيه المصري (رقم فقط):','0'));if(!Number.isFinite(price)||price<0){toast('السعر غير صحيح.');return;}const description=prompt('وصف مختصر:')||'';state.products.push({id:id('product'),name:name.trim(),price,description,owner:state.profile.name,currency:'جنيه'});persist();render();}
      if(action==='add-cart'&&product){const p=state.products.find(x=>x.id===product.dataset.product);if(p){state.cart.push(p.id);persist();toast('تمت الإضافة إلى السلة.');}}
      if(action==='view-cart'){const names=state.cart.map(cid=>state.products.find(p=>p.id===cid)?.name).filter(Boolean);if(!names.length){toast('السلة فارغة.');return;}const ok=await confirmDialog('معاينة طلب محلي',`العناصر: ${names.join('، ')}. هذا طلب معاينة فقط، دون دفع أو إرسال بيانات. هل تريد حفظ ملخص الطلب؟`,'حفظ الملخص');if(ok){state.orders.unshift({id:id('order'),items:names,status:'مسودة محلية - غير مدفوعة',createdAt:new Date().toISOString()});state.cart=[];persist();render();toast('تم حفظ ملخص الطلب المحلي.');}}
      if(action==='publish-draft'){const d=state.drafts.find(x=>x.id===actionButton.dataset.id);if(d){const ok=await confirmDialog('معاينة المنشور',`سيظهر المنشور باسم ${state.profile.name}:\n\n${d.text}`,'نشر محلي');if(ok){state.posts.push({id:id('post'),text:d.text,author:state.profile.name,createdAt:new Date().toISOString(),likes:0,comments:[],audience:'محلي'});state.drafts=state.drafts.filter(x=>x.id!==d.id);persist();setPage('home');toast('تم إنشاء المنشور في موجز هذا الجهاز.');}}}
      if(action==='delete-draft'){const ok=await confirmDialog('حذف المسودة','هل تريد حذف المسودة نهائياً من هذا الجهاز؟','حذف');if(ok){state.drafts=state.drafts.filter(d=>d.id!==actionButton.dataset.id);persist();render();}}
      if(action==='export-data')exportData();
      if(action==='clear-data'){const ok=await confirmDialog('مسح البيانات المحلية','سيتم مسح منشوراتك ومسوداتك وإعداداتك ومحادثاتك المحلية. تأكد من تصدير نسخة أولاً.','مسح البيانات');if(ok){localStorage.removeItem(KEY);state=freshState();const files=await fileDB('getAll');for(const f of files)await fileDB('delete',f.id);render();toast('تم مسح البيانات المحلية.');}}
    } catch(error){toast(error.message||'تعذر تنفيذ العملية.');}
  });
  document.addEventListener('submit', async event=>{
    if(event.target.id==='post-form'){event.preventDefault();const text=$('#post-text').value.trim();if(!text)return;const ok=await confirmDialog('معاينة قبل النشر',`سيظهر باسم ${state.profile.name}:\n\n${text}`,'تأكيد النشر المحلي');if(ok){state.posts.push({id:id('post'),text,author:state.profile.name,createdAt:new Date().toISOString(),likes:0,comments:[],audience:'محلي'});logActivity('نشر محلي','تم إنشاء منشور بعد المعاينة');setPage('home');toast('تم إنشاء المنشور على هذا الجهاز.');}}
    if(event.target.id==='message-form'){event.preventDefault();const text=$('#message-text').value.trim();if(!text)return;state.messages.push({id:id('msg'),roomId:currentRoom,text,createdAt:new Date().toISOString()});logActivity('رسالة محلية',state.rooms.find(r=>r.id===currentRoom)?.name||'');renderMessages();$('#message-text').value='';}
    if(event.target.id==='profile-form'){event.preventDefault();state.profile.name=$('#profile-name').value.trim();state.profile.bio=$('#profile-bio').value.trim();state.profile.private=$('#profile-private').checked;persist();logActivity('تحديث الملف','حفظ بيانات الملف محلياً');toast('تم حفظ الملف الشخصي.');}
    if(event.target.id==='draft-form'){event.preventDefault();const text=$('#draft-text').value.trim();if(text){state.drafts.unshift({id:id('draft'),text,createdAt:new Date().toISOString()});persist();logActivity('حفظ مسودة','مسودة منشور');render();toast('تم حفظ المسودة.');}}
    if(event.target.id==='assistant-form'){event.preventDefault();const text=$('#assistant-input').value.trim();if(!text)return;assistantAdd('user',text);$('#assistant-input').value='';const answer=await assistantReply(text);assistantAdd('bot',answer);}
  });
  document.addEventListener('change', async event=>{
    const setting=event.target.dataset.setting;
    if(setting){if(setting==='theme')state.settings.theme=event.target.checked?'light':'dark';else state.settings[setting]=event.target.checked;persist();applySettings();toast('تم تحديث التفضيل المحلي.');}
    if(event.target.id==='language-select'){state.settings.language='ar';persist();applySettings();render();toast('العربية هي لغة هذه النسخة.');}
    if(event.target.id==='repo-upload'&&event.target.files?.length){await addFiles(event.target.files);event.target.value='';}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='repo-search')refreshFiles();
    if(event.target.id==='product-search'){const q=event.target.value.toLowerCase();const grid=$('#product-grid');if(grid)grid.innerHTML=state.products.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q)).map(productCard).join('')||empty('لا توجد نتائج','غيّر كلمات البحث.');}
    if(event.target.id==='module-search')renderModules();
  });
  $('#global-search').addEventListener('keydown',async event=>{if(event.key==='Enter'){const q=event.target.value.trim().toLowerCase();if(!q)return;const postHits=state.posts.filter(p=>p.text.toLowerCase().includes(q));const productHits=state.products.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q));let fileHits=[];try{fileHits=(await fileDB('getAll')).filter(f=>(f.name+' '+f.folder).toLowerCase().includes(q));}catch{}setPage('home');const box=document.createElement('section');box.className='panel';box.innerHTML=`<div class="panel-head"><h2>نتائج البحث المحلي عن: ${esc(q)}</h2><span class="pill">${postHits.length+productHits.length+fileHits.length} نتيجة</span></div><div class="list">${[...postHits.map(p=>({kind:'منشور',name:p.text.slice(0,100)})),...productHits.map(p=>({kind:'منتج',name:p.name})),...fileHits.map(f=>({kind:'ملف',name:f.name}))].map(r=>`<div class="list-row"><strong>${esc(r.name)}</strong><span class="pill muted-pill">${esc(r.kind)}</span></div>`).join('')||empty('لا توجد نتائج','جرّب كلمة أخرى.')}</div>`;$('#view').prepend(box);}});
  $('#assistant-open').addEventListener('click',()=>$('#assistant-dialog').showModal());
  $('#modules-open').addEventListener('click',()=>{$('#modules-dialog').showModal();renderModules();});
  $('#commands-open').addEventListener('click',()=>{$('#modules-dialog').close();$('#commands-dialog').showModal();renderCatalog();});
  $('#command-search-btn').addEventListener('click',()=>{const result=lookupCommand($('#command-query').value);$('#command-result').innerHTML=result?`<strong>${esc(result.id)} · ${esc(result.title)}</strong><br>القسم: ${esc(result.section)}<br>الحالة: ${esc(result.status)}${result.expected?`<br>النتيجة المتوقعة: ${esc(result.expected)}`:''}${result.range?`<br>النطاق: ${esc(result.range)}`:''}<br><small>المصدر: ${esc(result.source||'وثائق مِحور')}</small>`:'لم يتم العثور على معرّف مطابق ضمن النطاقات المعروفة.';});
  $('#command-query').addEventListener('keydown',e=>{if(e.key==='Enter')$('#command-search-btn').click();});
  $$('.quick-prompts button').forEach(btn=>btn.addEventListener('click',()=>{$('#assistant-input').value=btn.dataset.prompt;$('#assistant-input').focus();}));
  async function init(){
    try{const response=await fetch('catalog.json');if(!response.ok)throw new Error('catalog');catalog=await response.json();}catch{toast('تعذر تحميل كتالوج المواصفات. افتح التطبيق عبر خادم محلي، لا عبر file://');}
    updateSavedCount();applySettings();render();
    if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  init();
})();
