/* ESKO OPEN HUB V5.7 — education, programming resources and safe static code analysis. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const PROGRESS_KEY = 'esko-education-progress-v1';
  const RESOURCES = [
    {name:'ChatGPT',type:'ai',kind:'مساعد AI',desc:'شرح المفاهيم، توليد أمثلة، ومراجعة الكود بالحوار.',url:'https://chatgpt.com/',tags:'ai coding explanation programming'},
    {name:'Claude',type:'ai',kind:'مساعد AI',desc:'تحليل النصوص البرمجية وشرح الملفات والمفاهيم.',url:'https://claude.ai/',tags:'ai code analysis'},
    {name:'Gemini',type:'ai',kind:'مساعد AI',desc:'مساعد Google لفهم الأكواد والتعلم والبحث.',url:'https://gemini.google.com/',tags:'ai google coding'},
    {name:'GitHub Copilot',type:'ai',kind:'مساعد برمجة',desc:'اقتراحات برمجية ومساعدة داخل بيئة التطوير.',url:'https://github.com/features/copilot',tags:'ai coding ide github'},
    {name:'Microsoft Copilot',type:'ai',kind:'مساعد AI',desc:'مساعدة عامة في الشرح والبحث وكتابة الأكواد.',url:'https://copilot.microsoft.com/',tags:'ai microsoft coding'},
    {name:'Perplexity',type:'ai',kind:'بحث بإجابات AI',desc:'بحث ويب بإجابات مدعومة بمصادر وروابط.',url:'https://www.perplexity.ai/',tags:'ai search research sources'},
    {name:'DeepSeek',type:'ai',kind:'مساعد برمجي',desc:'مساعد للمفاهيم البرمجية والتحليل النصي للكود.',url:'https://chat.deepseek.com/',tags:'ai code reasoning'},
    {name:'Qwen Chat',type:'ai',kind:'مساعد AI',desc:'محادثة ومساعدة في البرمجة والشرح.',url:'https://chat.qwen.ai/',tags:'ai code learning'},
    {name:'Mistral Le Chat',type:'ai',kind:'مساعد AI',desc:'مساعد محادثة للبحث والتفسير وصياغة الحلول.',url:'https://chat.mistral.ai/',tags:'ai coding'},
    {name:'Cursor',type:'ai',kind:'محرر برمجي بالـ AI',desc:'بيئة تحرير كود مزودة بميزات مساعدة ذكية.',url:'https://www.cursor.com/',tags:'ai ide editor coding'},
    {name:'Google Search',type:'search',kind:'محرك بحث',desc:'ابحث عن أمثلة وأخطاء ورسائل توثيق باللغة التي اخترتها.',url:'https://www.google.com/search?q=',query:true,tags:'search web google'},
    {name:'Bing Search',type:'search',kind:'محرك بحث',desc:'بحث عام عن الشروحات والأخطاء والحلول البرمجية.',url:'https://www.bing.com/search?q=',query:true,tags:'search web microsoft'},
    {name:'Stack Overflow',type:'search',kind:'أسئلة المطورين',desc:'أسئلة وأجوبة تقنية وتجارب مجتمعية للمطورين.',url:'https://stackoverflow.com/search?q=',query:true,tags:'search questions answers community'},
    {name:'GitHub Code Search',type:'search',kind:'بحث في الأكواد',desc:'ابحث في مستودعات الكود العامة عن أمثلة ومشروعات.',url:'https://github.com/search?q=',suffix:'&type=code',query:true,tags:'search code github repositories'},
    {name:'MDN Web Docs',type:'learn',kind:'توثيق ويب',desc:'مرجع تعليمي موثوق لـ JavaScript وHTML وCSS وواجهات الويب.',url:'https://developer.mozilla.org/en-US/search?q=',query:true,tags:'learn docs javascript html css'},
    {name:'JavaScript.info',type:'learn',kind:'دورة JavaScript',desc:'دروس متدرجة من الأساسيات حتى الموضوعات المتقدمة.',url:'https://javascript.info/',tags:'learn javascript tutorial'},
    {name:'W3Schools',type:'learn',kind:'تعلم تفاعلي',desc:'دروس وأمثلة عملية لعدد كبير من اللغات والتقنيات.',url:'https://www.w3schools.com/',tags:'learn tutorials practice'},
    {name:'freeCodeCamp',type:'learn',kind:'مسارات ومشروعات',desc:'تعلم بالممارسة من خلال تحديات ومشروعات ومسارات.',url:'https://www.freecodecamp.org/learn/',tags:'learn projects exercises'},
    {name:'DevDocs',type:'learn',kind:'مكتبة توثيق',desc:'واجهة بحث موحدة لتوثيق لغات ومكتبات وأدوات كثيرة.',url:'https://devdocs.io/',tags:'learn docs reference'},
    {name:'Exercism',type:'learn',kind:'تدريبات برمجية',desc:'تدريبات عملية في لغات كثيرة مع مسارات تعلم.',url:'https://exercism.org/tracks',tags:'learn exercises practice'}
  ];
  const LANGUAGES = {
    javascript:{name:'JavaScript',start:'ابدأ بالمتغيرات والأنواع والشروط والحلقات، ثم الدوال والمصفوفات والكائنات، وبعدها DOM وواجهات API والبرمجة غير المتزامنة.',source:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',next:'نفّذ مشروع قائمة مهام صغيرة تحفظ عناصرها محليًا.'},
    python:{name:'Python',start:'ابدأ بالطباعة والمتغيرات والأنواع والقوائم والقواميس والشروط والحلقات، ثم الدوال والملفات والوحدات.',source:'https://docs.python.org/3/tutorial/',next:'أنشئ برنامجًا بسيطًا لتنظيم قائمة مهام.'},
    typescript:{name:'TypeScript',start:'تعلم أساسيات JavaScript أولًا، ثم الأنواع البدائية وواجهات البيانات والاتحادات والأنواع العامة.',source:'https://www.typescriptlang.org/docs/',next:'حوّل مشروع JavaScript صغيرًا إلى TypeScript.'},
    html:{name:'HTML',start:'تعلم بنية الصفحة والعناوين والفقرات والروابط والصور والنماذج والعناصر الدلالية وإمكانية الوصول.',source:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',next:'أنشئ صفحة تعريف شخصية بعناوين وروابط وصورة بديلة.'},
    css:{name:'CSS',start:'ابدأ بالمحددات والألوان والمسافات والصندوق، ثم Flexbox وGrid والتجاوب والحركة مع مراعاة تقليل الحركة.',source:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics',next:'صمّم بطاقة متجاوبة تعمل على الهاتف والكمبيوتر.'},
    sql:{name:'SQL',start:'تعلم SELECT وWHERE وORDER BY وGROUP BY، ثم JOIN والإدخال والتحديث والمعاملات.',source:'https://www.w3schools.com/sql/',next:'صمّم قاعدة مهام واكتب استعلامات قراءة وتجميع.'},
    java:{name:'Java',start:'ابدأ بالمتغيرات والأنواع والشروط والحلقات والدوال، ثم الأصناف والكائنات والمجموعات والاستثناءات.',source:'https://dev.java/learn/',next:'أنشئ برنامجًا لإدارة مجموعة كتب باستخدام الأصناف.'},
    csharp:{name:'C#',start:'تعلم الأنواع والشروط والحلقات والدوال، ثم الأصناف وLINQ والاستثناءات والبرمجة غير المتزامنة.',source:'https://learn.microsoft.com/en-us/dotnet/csharp/',next:'أنشئ تطبيق Console بسيطًا لإدارة درجات.'},
    cpp:{name:'C / C++',start:'ابدأ بالمتغيرات والتحكم والدوال، ثم المصفوفات والمؤشرات وإدارة الذاكرة وهياكل البيانات.',source:'https://www.learncpp.com/',next:'نفّذ برنامجًا يقرأ أرقامًا ويحسب المتوسط.'},
    c:{name:'C',start:'تعلم الأنواع والتحكم والدوال والمصفوفات والمؤشرات والذاكرة والملفات.',source:'https://en.cppreference.com/w/c',next:'اكتب برنامجًا يقرأ قائمة أعداد ويتعامل معها.'},
    go:{name:'Go',start:'ابدأ بالمتغيرات والدوال والحزم والهياكل والواجهات ومعالجة الأخطاء والتزامن.',source:'https://go.dev/learn/',next:'أنشئ خدمة HTTP صغيرة محلية للتعلم.'},
    php:{name:'PHP',start:'تعلم المتغيرات والمصفوفات والدوال، ثم النماذج والجلسات وPDO ومبادئ أمان الويب.',source:'https://www.php.net/manual/en/getting-started.php',next:'أنشئ نموذجًا يتحقق من المدخلات دون تخزين بيانات حساسة.'},
    rust:{name:'Rust',start:'ابدأ بالملكية والاستعارة والأنواع والتحكم، ثم Traits وEnums وResult وإدارة الحزم.',source:'https://doc.rust-lang.org/book/',next:'نفّذ برنامجًا صغيرًا لمعالجة نص مع معالجة أخطاء واضحة.'},
    kotlin:{name:'Kotlin',start:'تعلم المتغيرات والدوال والـ null safety والأصناف والمجموعات وCoroutines.',source:'https://kotlinlang.org/docs/home.html',next:'أنشئ تطبيق Console لإدارة قائمة أسماء.'},
    swift:{name:'Swift',start:'تعلم الثوابت والمتغيرات والأنواع والدوال والـ Optionals والبنى والبروتوكولات.',source:'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/',next:'أنشئ نموذج بيانات بسيطًا مع دوال واضحة.'},
    ruby:{name:'Ruby',start:'تعلم المتغيرات والسلاسل والمصفوفات والـ Hashes والكتل والدوال والأصناف.',source:'https://www.ruby-lang.org/en/documentation/',next:'اكتب برنامجًا بسيطًا لترتيب قائمة مهام.'},
    dart:{name:'Dart',start:'تعلم الأنواع والمتغيرات والدوال والقوائم والأصناف وFuture وStream.',source:'https://dart.dev/language',next:'اكتب تطبيق Console يعرض بيانات منظمة.'},
    bash:{name:'Bash / Shell',start:'تعلم الأوامر الأساسية والمتغيرات والاقتباس والشروط والحلقات والدوال والتعامل الآمن مع الملفات.',source:'https://www.gnu.org/software/bash/manual/',next:'اكتب سكربتًا تعليميًا يعرض معلومات مجلد يختاره المستخدم.'},
    powershell:{name:'PowerShell',start:'تعلم الأوامر والـ Pipeline والمتغيرات والكائنات والشروط والدوال ومعالجة الأخطاء.',source:'https://learn.microsoft.com/en-us/powershell/',next:'اكتب سكربتًا يعرض ملفات مجلد تجريبي.'},
    r:{name:'R',start:'ابدأ بالمتغيرات والمتجهات وإطارات البيانات والدوال والرسوم والتحليل الإحصائي.',source:'https://cran.r-project.org/manuals.html',next:'حلّل مجموعة بيانات صغيرة واحسب ملخصاتها.'},
    lua:{name:'Lua',start:'تعلم القيم والجداول والدوال والشروط والحلقات والوحدات.',source:'https://www.lua.org/manual/5.4/',next:'اكتب برنامجًا بسيطًا لإدارة درجات مجموعة طلاب.'}
  };
  const LESSONS = [
    {title:'1 · أول برنامج',goal:'فهم طريقة تنفيذ تعليمة بسيطة.',explain:'JavaScript لغة برمجة تُستخدم في المتصفح وخارج المتصفح. تبدأ التعليمة غالبًا باستدعاء دالة جاهزة مثل console.log لعرض نتيجة في وحدة المطور.',code:'console.log("مرحبًا بك في JavaScript");',task:'اكتب تعليمة تعرض اسمك أو كلمة ترحيب باستخدام console.log.',answer:'console.log("أهلًا");',keywords:['console.log','log(']},
    {title:'2 · المتغيرات والثوابت',goal:'تخزين القيم واختيار const أو let.',explain:'استخدم const عندما لا تعيد إسناد قيمة المتغير. استخدم let عندما تحتاج تغيير القيمة. تجنب var في الأكواد الجديدة بسبب نطاقه وسلوكه المختلف.',code:'const siteName = "ESKO";\nlet visits = 1;\nvisits = visits + 1;\nconsole.log(siteName, visits);',task:'أنشئ ثابتًا باسم language وضع فيه JavaScript، ومتغيرًا باسم level يبدأ بـ 1.',answer:'const language = "JavaScript";\nlet level = 1;',keywords:['const','let','language']},
    {title:'3 · أنواع البيانات',goal:'تمييز النصوص والأرقام والقيم المنطقية.',explain:'من الأنواع الشائعة String للنص، Number للأرقام، Boolean لقيم true أو false، وundefined وnull لتمثيل غياب القيمة بطرق مختلفة.',code:'const user = "Sara";\nconst score = 95;\nconst isReady = true;\nconsole.log(typeof score);',task:'اكتب متغيرًا نصيًا وآخر رقميًا وثالثًا منطقيًا.',answer:'const name = "Ali";\nconst age = 16;\nconst active = true;',keywords:['const','true']},
    {title:'4 · العمليات والمقارنة',goal:'إجراء العمليات ومقارنة القيم.',explain:'تستخدم + للجمع أو دمج النصوص، و- و* و/ للحساب. يفضّل استخدام === للمقارنة الصارمة لأنه يقارن القيمة والنوع، بدلًا من == التي قد تحول الأنواع تلقائيًا.',code:'const total = 12 + 8;\nconst isEqual = total === 20;\nconsole.log(isEqual);',task:'احسب ناتج 7 × 6، ثم تحقق هل يساوي 42 باستخدام ===.',answer:'const result = 7 * 6;\nconsole.log(result === 42);',keywords:['===','*']},
    {title:'5 · الشروط',goal:'اختيار مسار مختلف حسب تحقق شرط.',explain:'تسمح if وelse بتنفيذ تعليمات مختلفة وفق نتيجة شرط منطقي. يمكن استخدام else if عند وجود أكثر من حالة.',code:'const grade = 82;\nif (grade >= 50) {\n  console.log("ناجح");\n} else {\n  console.log("حاول مرة أخرى");\n}',task:'اكتب شرطًا يفحص هل age أكبر من أو يساوي 18.',answer:'if (age >= 18) {\n  console.log("بالغ");\n} else {\n  console.log("أقل من 18");\n}',keywords:['if','else','age']},
    {title:'6 · الحلقات',goal:'تكرار التعليمات بطريقة منظمة.',explain:'تكرر for مجموعة تعليمات عددًا معلومًا أو يمكن التحكم فيه من خلال عداد. while مناسبة عندما يعتمد التكرار على شرط يستمر تحققه.',code:'for (let i = 1; i <= 3; i++) {\n  console.log("المحاولة", i);\n}',task:'اكتب حلقة for تعرض الأرقام من 1 إلى 5.',answer:'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',keywords:['for','console.log']},
    {title:'7 · المصفوفات',goal:'تجميع عدة قيم في قائمة واحدة.',explain:'المصفوفة Array تحفظ عدة عناصر بترتيب. يبدأ الفهرس من صفر. يمكن إضافة عنصر باستخدام push والوصول إليه عن طريق رقم الفهرس.',code:'const languages = ["JavaScript", "Python"];\nlanguages.push("Java");\nconsole.log(languages[0]);',task:'أنشئ مصفوفة فيها ثلاثة أسماء لغات واعرض العنصر الثاني.',answer:'const langs = ["JavaScript", "Python", "Java"];\nconsole.log(langs[1]);',keywords:['[',']','push']},
    {title:'8 · الكائنات',goal:'تمثيل كيان له خصائص وقيم.',explain:'الكائن Object يجمع خصائص مرتبطة ببعضها. كل خاصية لها اسم وقيمة، ويمكن قراءة القيمة باستخدام النقطة أو الأقواس.',code:'const student = {\n  name: "Mona",\n  level: 1\n};\nconsole.log(student.name);',task:'أنشئ كائنًا اسمه book فيه title وpages.',answer:'const book = { title: "My Book", pages: 120 };',keywords:['{','title','pages']},
    {title:'9 · الدوال',goal:'إعادة استخدام منطق برمجي.',explain:'الدالة Function كتلة تعليمات يمكن استدعاؤها أكثر من مرة. تستقبل معاملات Parameters وقد تعيد نتيجة باستخدام return.',code:'function add(a, b) {\n  return a + b;\n}\nconst result = add(4, 5);\nconsole.log(result);',task:'اكتب دالة square تستقبل رقمًا وتعيد مربعه.',answer:'function square(number) {\n  return number * number;\n}',keywords:['function','return']},
    {title:'10 · DOM والأحداث',goal:'التفاعل مع عناصر صفحة الويب.',explain:'DOM يمثل مستند HTML كعناصر يمكن الوصول إليها وتعديلها. استمع إلى أحداث المستخدم مثل click باستخدام addEventListener بدلًا من ربط منطق طويل داخل HTML.',code:'const button = document.querySelector("button");\nbutton.addEventListener("click", () => {\n  console.log("تم الضغط");\n});',task:'اكتب استدعاء addEventListener لحدث click على زر.',answer:'button.addEventListener("click", () => {\n  console.log("Clicked");\n});',keywords:['querySelector','addEventListener']},
    {title:'11 · async و await',goal:'فهم العمليات التي تنتظر نتيجة لاحقًا.',explain:'Promise تمثل نتيجة عملية قد تكتمل لاحقًا. async تجعل الدالة تعيد Promise، وawait تنتظر النتيجة داخل دالة async. تعامل مع الأخطاء باستخدام try وcatch.',code:'async function loadData() {\n  try {\n    const response = await fetch("/api/items");\n    if (!response.ok) throw new Error("Request failed");\n    return await response.json();\n  } catch (error) {\n    console.error(error);\n  }\n}',task:'اكتب عنوان دالة async تحتوي على await داخل try.',answer:'async function run() {\n  try {\n    const result = await Promise.resolve("done");\n  } catch (error) {\n    console.error(error);\n  }\n}',keywords:['async','await','try']},
    {title:'12 · الوحدات وتنظيم المشروع',goal:'تقسيم البرنامج إلى ملفات قابلة لإعادة الاستخدام.',explain:'تسمح export بإتاحة دوال أو قيم من ملف، وتسمح import باستيرادها في ملف آخر. تنظيم المشروع إلى وحدات يسهل الفهم والاختبار والصيانة.',code:'// math.js\nexport function double(value) {\n  return value * 2;\n}\n\n// app.js\nimport { double } from "./math.js";\nconsole.log(double(5));',task:'اكتب صيغة export لدالة اسمها greet.',answer:'export function greet(name) {\n  return `Hello ${name}`;\n}',keywords:['export','import']}
  ];
  let currentLesson = 0;
  let completed = new Set();
  let selectedLanguage = 'javascript';

  function safeStorageRead() { try { const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); completed = new Set(Array.isArray(data.completed) ? data.completed.filter(n => Number.isInteger(n) && n >= 0 && n < LESSONS.length) : []); currentLesson = Number.isInteger(data.current) ? Math.min(Math.max(data.current,0),LESSONS.length-1) : 0; } catch (_) { completed = new Set(); currentLesson = 0; } }
  function safeStorageWrite() { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({completed:[...completed],current:currentLesson})); } catch (_) {} }
  function addText(parent, tag, text, className) { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; parent.append(node); return node; }
  function makeResourceUrl(resource) {
    const query = `${selectedLanguage === 'javascript' ? 'JavaScript' : LANGUAGES[selectedLanguage]?.name || selectedLanguage} ${$('eduResourceSearch')?.value.trim() || 'تعلم الأساسيات tutorial examples'}`;
    return resource.query ? `${resource.url}${encodeURIComponent(query)}${resource.suffix || ''}` : resource.url;
  }
  function renderResources() {
    const grid = $('eduResourceGrid'); if (!grid) return;
    const query = $('eduResourceSearch').value.trim().toLowerCase(); const type = $('eduResourceType').value;
    const items = RESOURCES.filter(item => (type === 'all' || item.type === type) && (!query || `${item.name} ${item.desc} ${item.tags}`.toLowerCase().includes(query)));
    grid.replaceChildren();
    items.forEach(item => {
      const card = document.createElement('article'); card.className = 'education-resource-card';
      const top = document.createElement('div'); top.className = 'education-resource-top';
      addText(top,'span',item.type === 'ai' ? 'AI' : item.type === 'search' ? 'SEARCH' : 'LEARN','education-resource-type '+item.type);
      addText(top,'span',item.kind,'education-resource-kind'); card.append(top);
      addText(card,'h4',item.name); addText(card,'p',item.desc);
      const link = document.createElement('a'); link.className = 'small-button education-resource-link'; link.href = makeResourceUrl(item); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.query ? 'ابحث بهذا المصدر ↗' : 'فتح المصدر ↗'; card.append(link);
      grid.append(card);
    });
    $('eduResourceStatus').textContent = `عرض ${items.length} من أصل ${RESOURCES.length} مصدرًا. منصات AI تعمل في مواقعها الخارجية وليست متصلة تلقائيًا بخادم ESKO.`;
  }
  function renderLanguages() {
    const select = $('eduLanguage'); if (!select) return;
    select.replaceChildren();
    Object.entries(LANGUAGES).forEach(([key,lang]) => { const option = document.createElement('option'); option.value = key; option.textContent = lang.name; select.append(option); });
    select.value = selectedLanguage;
    updateLanguageInfo();
  }
  function updateLanguageInfo() {
    selectedLanguage = $('eduLanguage')?.value || selectedLanguage;
    const lang = LANGUAGES[selectedLanguage]; if (!lang) return;
    const info = $('eduLanguageInfo'); info.replaceChildren();
    addText(info,'h4',lang.name); addText(info,'p',lang.start); addText(info,'p',`مشروع تدريبي مقترح: ${lang.next}`);
    const link = document.createElement('a'); link.href = lang.source; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'فتح الدليل أو المرجع التعليمي ↗'; info.append(link);
    const analyzer = $('eduAnalyzerLanguage'); if (analyzer && ['javascript','typescript','python','html','css','sql','java','cpp','csharp','go','php','rust'].includes(selectedLanguage)) analyzer.value = selectedLanguage;
    renderResources();
  }
  function renderLessons() {
    const list = $('eduLessonList'); const content = $('eduLessonContent'); if (!list || !content) return;
    list.replaceChildren();
    LESSONS.forEach((lesson,index) => {
      const button = document.createElement('button'); button.type='button'; button.className='education-lesson-item'+(index===currentLesson?' active':'')+(completed.has(index)?' done':'');
      button.textContent = `${completed.has(index)?'✓ ':''}${lesson.title}`; button.addEventListener('click',()=>{currentLesson=index;safeStorageWrite();renderLessons();}); list.append(button);
    });
    const lesson = LESSONS[currentLesson]; content.replaceChildren();
    addText(content,'span',`الدرس ${currentLesson+1} من ${LESSONS.length}`,'eyebrow');
    addText(content,'h3',lesson.title); addText(content,'p',`هدف الدرس: ${lesson.goal}`,'education-lesson-goal'); addText(content,'p',lesson.explain);
    addText(content,'h4','مثال عملي'); const code = document.createElement('pre'); const codeNode = document.createElement('code'); codeNode.textContent=lesson.code; code.append(codeNode); content.append(code);
    addText(content,'h4','تدريبك'); addText(content,'p',lesson.task);
    const reveal = document.createElement('button'); reveal.type='button'; reveal.className='small-button'; reveal.textContent='إظهار حل مقترح';
    const answer = document.createElement('pre'); answer.className='education-answer-code hidden'; answer.textContent=lesson.answer;
    reveal.addEventListener('click',()=>{answer.classList.toggle('hidden');reveal.textContent=answer.classList.contains('hidden')?'إظهار حل مقترح':'إخفاء الحل';}); content.append(reveal,answer);
    $('eduPrevLesson').disabled=currentLesson===0; $('eduNextLesson').disabled=currentLesson===LESSONS.length-1;
    $('eduCompleteLesson').textContent=completed.has(currentLesson)?'إلغاء إكمال الدرس':'علّمت الدرس كمكتمل';
    $('eduProgressCount').textContent=`${completed.size} / ${LESSONS.length}`;
    $('eduProgressBar').style.width=`${completed.size/LESSONS.length*100}%`;
    $('eduLessonStatus').textContent=`أكملت ${completed.size} من ${LESSONS.length} دروس. يتم حفظ تقدمك على هذا المتصفح فقط.`;
  }
  function localTutor(question) {
    const q=question.toLowerCase(); const language=LANGUAGES[selectedLanguage]?.name || selectedLanguage;
    const answers=[
      {re:/\b(const|let|var)\b|متغير|ثابت/,text:'المتغير اسم يشير إلى قيمة. استخدم const إذا لن تعيد إسناد المتغير، واستخدم let إذا ستغيّر قيمته. مثال:\nconst site = "ESKO";\nlet counter = 0;\ncounter += 1;\nفي الكود الجديد تجنب var غالبًا.'},
      {re:/function|دال[هة]|وظيف[هة]|arrow|سهم/,text:'الدالة تجمع تعليمات قابلة لإعادة الاستخدام. يمكنها استقبال معاملات وإرجاع نتيجة:\nfunction add(a, b) {\n  return a + b;\n}\nconst result = add(2, 3);\nالدالة السهمية تكتب هكذا: const add = (a, b) => a + b;'},
      {re:/array|مصفوف[هة]|قائم[هة]/,text:'المصفوفة Array تحفظ عناصر بترتيب، ويبدأ الفهرس من 0. مثال:\nconst colors = ["red", "blue"];\ncolors.push("green");\nconsole.log(colors[0]);'},
      {re:/object|كائن/,text:'الكائن Object يجمع خصائص في بنية واحدة:\nconst user = { name: "Ali", level: 1 };\nconsole.log(user.name);\nيمكنك الوصول للخاصية بالنقطة أو الأقواس.'},
      {re:/if|شرط|else|مقارن/,text:'تستخدم if لاتخاذ قرار حسب شرط. مثال:\nconst score = 75;\nif (score >= 50) {\n  console.log("نجاح");\n} else {\n  console.log("حاول مرة أخرى");\n}\nاستخدم === للمقارنة الصارمة.'},
      {re:/loop|for|while|حلق[هة]|تكرار/,text:'الحلقة تكرر التعليمات. مثال:\nfor (let i = 0; i < 3; i++) {\n  console.log(i);\n}\nتأكد أن شرط الحلقة يتغير حتى لا تستمر بلا نهاية.'},
      {re:/async|await|promise|fetch|غير متزامن/,text:'تستخدم async وawait للتعامل مع عمليات نتيجتها تصل لاحقًا مثل fetch. مثال:\nasync function load() {\n  try {\n    const res = await fetch("/api/items");\n    if (!res.ok) throw new Error("Request failed");\n    return await res.json();\n  } catch (error) {\n    console.error(error);\n  }\n}\nتحقق من الاستجابة وتعامل مع الأخطاء.'},
      {re:/dom|document|html|زر|click|حدث/,text:'DOM هو تمثيل عناصر صفحة HTML كعناصر يمكن التعامل معها باستخدام JavaScript. مثال:\nconst button = document.querySelector("button");\nbutton.addEventListener("click", () => {\n  console.log("تم الضغط");\n});\nافصل السلوك عن بنية HTML.'},
      {re:/===|==|مساو|مقارن[هة]/,text:'في JavaScript، === يقارن القيمة والنوع دون تحويل تلقائي، أما == فقد يحوّل الأنواع قبل المقارنة. الأفضل غالبًا استخدام === لتكون النتيجة أوضح.'}
    ];
    const match=answers.find(item=>item.re.test(q));
    if(match) return `${match.text}\n\nجرّب كتابة مثال بنفسك، ثم استخدم محلل الكود لمراجعة بعض الأنماط.`;
    return `سؤالك عن ${language} مهم. يمكنني حاليًا شرح الأساسيات الشائعة محليًا، لكن هذا الرد ليس ناتجًا من نموذج AI متصل.\n\nابدأ بتحديد الجزء الذي تريد فهمه: المفهوم، سطر الكود، أو رسالة الخطأ. جرّب أيضًا مصادر ${language} في مكتبة البحث. للحصول على إجابة توليدية متقدمة، افتح إحدى منصات AI العشر وأرسل لها السؤال مع حذف أي كلمات مرور أو مفاتيح سرية.`;
  }
  async function askTutor() {
    const question=$('eduTutorQuestion').value.trim(); if(!question){$('eduTutorAnswer').textContent='اكتب سؤالًا أولًا.';return;}
    const output=$('eduTutorAnswer'); output.textContent='جارٍ إعداد الشرح…';
    // Optional server integration. The endpoint must keep provider API keys server-side.
    const endpoint=window.ESKO_EDUCATION_API;
    if(typeof endpoint==='string' && endpoint.startsWith('/') && !endpoint.startsWith('//')) {
      try {
        const response=await fetch(endpoint,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,language:selectedLanguage})});
        if(response.ok){const data=await response.json();if(typeof data.answer==='string' && data.answer.length<12000){output.textContent=data.answer;return;}}
      } catch (_) { /* Local learning fallback remains available. */ }
    }
    output.textContent=localTutor(question);
  }
  function analyzeCode(source,language) {
    const lines=source.split(/\r?\n/); const findings=[];
    const add=(level,title,detail)=>findings.push({level,title,detail});
    if(!source.trim()) return {lines:0,findings:[{level:'info',title:'لا يوجد كود',detail:'الصق مثالًا برمجيًا ثم أعد التحليل.'}]};
    if(/\beval\s*\(/.test(source)) add('high','استخدام eval','eval ينفذ نصًا ككود وقد يسبب مخاطر حقن. تجنبه مع المدخلات، واستخدم بديلًا محددًا وآمنًا.');
    if(/document\s*\.\s*write\s*\(/.test(source)) add('warn','استخدام document.write','قد يستبدل محتوى الصفحة أو يسبب سلوكًا غير متوقع بعد تحميلها. استخدم DOM APIs المناسبة.');
    if(/innerHTML\s*=/.test(source)) add('warn','إسناد innerHTML','تأكد من عدم إدخال نص غير موثوق دون تنقية مناسبة؛ استخدم textContent عندما تريد عرض نص فقط.');
    if(['javascript','typescript'].includes(language)) {
      if(/\bvar\s+[A-Za-z_$]/.test(source)) add('info','استخدام var','يفضّل const أو let في JavaScript الحديثة لتوضيح نطاق المتغير وسلوك إعادة الإسناد.');
      if(/(^|[^=!])==(?!=)/.test(source)) add('info','مقارنة غير صارمة ==','راجع استخدام === لتجنب تحويل الأنواع غير المتوقع.');
      if(/\basync\s+function|=\s*async\s*\(/.test(source) && !/\btry\s*\{/.test(source)) add('warn','دالة async دون try/catch واضح','راجع كيفية عرض أخطاء الوعود أو أضف معالجة أخطاء مناسبة حسب وظيفة الدالة.');
      if(/setTimeout\s*\(\s*['"`]/.test(source)) add('warn','تمرير نص إلى setTimeout','استخدم دالة callback بدلًا من نص؛ ذلك أوضح وأكثر أمانًا.');
      if(/for\s*\([^)]*\bin\b/.test(source)) add('info','استخدام for…in','مع المصفوفات غالبًا استخدم for…of أو forEach حتى تمر على القيم لا مفاتيح الخصائص.');
    }
    const opens=(source.match(/[({[]/g)||[]).length; const closes=(source.match(/[)}\]]/g)||[]).length;
    if(opens!==closes) add('warn','احتمال عدم توازن الأقواس',`عدد رموز الفتح (${opens}) لا يساوي عدد رموز الإغلاق (${closes}). هذا فحص تقريبي ولا يحلل النصوص أو التعليقات بالكامل.`);
    const longLines=lines.filter(line=>line.length>140).length;
    if(longLines) add('info','أسطر طويلة',`يوجد ${longLines} سطرًا يتجاوز 140 حرفًا؛ تقسيمها قد يحسن القراءة.`);
    if(!findings.length) add('good','لم تظهر مؤشرات شائعة','لم يجد الفاحص الأنماط المحددة في هذا الإصدار. هذا لا يعني أن الكود خالٍ من الأخطاء أو الثغرات.');
    return {lines:lines.length,chars:source.length,findings};
  }
  function renderAnalysis(result) {
    const output=$('eduAnalysisOutput'); output.replaceChildren();
    addText(output,'b',`الملخص: ${result.lines} سطر · ${result.chars || 0} حرف`);
    result.findings.forEach(item=>{
      const box=document.createElement('div'); box.className='education-finding '+item.level;
      addText(box,'b',`${item.level==='high'?'تنبيه مهم':item.level==='warn'?'راجع هذا':'معلومة'} · ${item.title}`);
      addText(box,'p',item.detail); output.append(box);
    });
    addText(output,'small','الفاحص ساكن وتقريبي؛ لم يشغّل الكود أو يتصل بالإنترنت أو يرفع النص. راجع النتائج يدويًا واختبر مشروعك في بيئة آمنة.');
  }
  function init() {
    if(!$('eduResourceGrid')) return;
    safeStorageRead(); renderResources(); renderLanguages(); renderLessons();
    $('eduResourceSearch').addEventListener('input',renderResources);
    $('eduResourceType').addEventListener('change',renderResources);
    $('eduLanguage').addEventListener('change',updateLanguageInfo);
    $('eduPrevLesson').addEventListener('click',()=>{currentLesson=Math.max(0,currentLesson-1);safeStorageWrite();renderLessons();});
    $('eduNextLesson').addEventListener('click',()=>{currentLesson=Math.min(LESSONS.length-1,currentLesson+1);safeStorageWrite();renderLessons();});
    $('eduCompleteLesson').addEventListener('click',()=>{if(completed.has(currentLesson))completed.delete(currentLesson);else completed.add(currentLesson);safeStorageWrite();renderLessons();});
    $('eduAskTutor').addEventListener('click',askTutor);
    $('eduTutorQuestion').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter')askTutor();});
    $('eduCopyTutorPrompt').addEventListener('click',async()=>{
      const question=$('eduTutorQuestion').value.trim()||'اشرح لي أساسيات البرمجة بمثال بسيط.';
      const prompt=`أنت مدرس برمجة صبور. اشرح باللغة العربية وبخطوات مناسبة للمبتدئ. اللغة: ${LANGUAGES[selectedLanguage]?.name}. السؤال: ${question}. أعط مثالًا واضحًا وتدريبًا قصيرًا، ولا تفترض أنني خبير.`;
      try{await navigator.clipboard.writeText(prompt);$('eduTutorAnswer').textContent='تم نسخ صيغة السؤال. افتح منصة AI من القائمة وألصقها هناك.';}catch(_){$('eduTutorAnswer').textContent=prompt;}
    });
    $('eduAnalyzeCode').addEventListener('click',()=>renderAnalysis(analyzeCode($('eduCodeInput').value,$('eduAnalyzerLanguage').value)));
    $('eduClearCode').addEventListener('click',()=>{$('eduCodeInput').value='';$('eduAnalysisOutput').textContent='تم مسح المحرر.';});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
