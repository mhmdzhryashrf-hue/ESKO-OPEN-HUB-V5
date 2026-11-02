/* ESKO V5.6 feature layer. Kept separate from the original application. */
(function(){
  'use strict';
  if (window.__ESKO_V5_LOADED__) return;
  window.__ESKO_V5_LOADED__ = true;

  const GAMES = [{"id":"esko-sky-dash","name":"ESKO Sky Dash","category":"أركيد","engine":"skydash","ready":true},{"id":"2048","name":"2048","category":"ألغاز","engine":"2048","ready":true},{"id":"sudoku","name":"Sudoku","category":"ألغاز","engine":"sudoku","ready":true},{"id":"minesweeper","name":"Minesweeper","category":"ألغاز","engine":"minesweeper","ready":true},{"id":"solitaire","name":"Solitaire","category":"أوراق","engine":"","ready":false},{"id":"mahjong","name":"Mahjong Solitaire","category":"ألغاز","engine":"","ready":false},{"id":"nonogram","name":"Nonogram","category":"ألغاز","engine":"","ready":false},{"id":"block-puzzle","name":"Block Puzzle","category":"ألغاز","engine":"","ready":false},{"id":"bubble-shooter","name":"Bubble Shooter","category":"أركيد","engine":"","ready":false},{"id":"word-search","name":"Word Search","category":"كلمات","engine":"wordsearch","ready":true},{"id":"crossword","name":"Crossword","category":"كلمات","engine":"","ready":false},{"id":"snake","name":"Snake","category":"أركيد","engine":"snake","ready":true},{"id":"pacman","name":"Pac-Man","category":"أركيد","engine":"","ready":false},{"id":"tetris","name":"Tetris","category":"أركيد","engine":"tetris","ready":true},{"id":"doodle-jump","name":"Doodle Jump","category":"أركيد","engine":"","ready":false},{"id":"flappy-bird","name":"Flappy Bird","category":"أركيد","engine":"flappy","ready":true},{"id":"helix-jump","name":"Helix Jump","category":"أركيد","engine":"","ready":false},{"id":"stack","name":"Stack","category":"أركيد","engine":"","ready":false},{"id":"color-switch","name":"Color Switch","category":"أركيد","engine":"","ready":false},{"id":"fruit-ninja","name":"Fruit Ninja","category":"أركيد","engine":"","ready":false},{"id":"crossy-road","name":"Crossy Road","category":"أركيد","engine":"","ready":false},{"id":"subway-surfers","name":"Subway Surfers","category":"مغامرات","engine":"","ready":false},{"id":"temple-run-2","name":"Temple Run 2","category":"مغامرات","engine":"","ready":false},{"id":"jetpack-joyride","name":"Jetpack Joyride","category":"أركيد","engine":"","ready":false},{"id":"geometry-dash","name":"Geometry Dash","category":"مهارة","engine":"","ready":false},{"id":"angry-birds","name":"Angry Birds","category":"ألغاز","engine":"","ready":false},{"id":"little-alchemy-2","name":"Little Alchemy 2","category":"ألغاز","engine":"","ready":false},{"id":"cut-the-rope","name":"Cut the Rope","category":"ألغاز","engine":"","ready":false},{"id":"tiny-fishing","name":"Tiny Fishing","category":"أركيد","engine":"","ready":false},{"id":"merge-fruit","name":"Merge Fruit","category":"ألغاز","engine":"","ready":false},{"id":"flow-free","name":"Flow Free","category":"ألغاز","engine":"","ready":false},{"id":"8-ball-pool","name":"8 Ball Pool","category":"رياضة","engine":"","ready":false},{"id":"basketball-stars","name":"Basketball Stars","category":"رياضة","engine":"","ready":false},{"id":"basketball-legends","name":"Basketball Legends","category":"رياضة","engine":"","ready":false},{"id":"soccer-skills","name":"Soccer Skills World Cup","category":"رياضة","engine":"","ready":false},{"id":"penalty-shooters","name":"Penalty Shooters 2","category":"رياضة","engine":"","ready":false},{"id":"football-legends","name":"Football Legends","category":"رياضة","engine":"","ready":false},{"id":"mini-golf","name":"Mini Golf Club","category":"رياضة","engine":"","ready":false},{"id":"bowling-stars","name":"Bowling Stars","category":"رياضة","engine":"","ready":false},{"id":"tennis-open","name":"Tennis Open","category":"رياضة","engine":"","ready":false},{"id":"drift-hunters","name":"Drift Hunters","category":"سباقات","engine":"","ready":false},{"id":"moto-x3m","name":"Moto X3M","category":"سباقات","engine":"","ready":false},{"id":"hill-climb","name":"Hill Climb Racing","category":"سباقات","engine":"","ready":false},{"id":"agar-io","name":"Agar.io","category":"متعددة اللاعبين","engine":"","ready":false},{"id":"slither-io","name":"Slither.io","category":"متعددة اللاعبين","engine":"","ready":false},{"id":"paper-io-2","name":"Paper.io 2","category":"متعددة اللاعبين","engine":"","ready":false},{"id":"chess","name":"Chess","category":"ألعاب لوحية","engine":"","ready":false},{"id":"checkers","name":"Checkers","category":"ألعاب لوحية","engine":"","ready":false},{"id":"tic-tac-toe","name":"Tic Tac Toe","category":"ألعاب لوحية","engine":"tictactoe","ready":true},{"id":"reversi","name":"Reversi","category":"ألعاب لوحية","engine":"reversi","ready":true},{"id":"memory-match","name":"Memory Match","category":"ألغاز","engine":"memory","ready":true}];
  GAMES.unshift({id:'esko-survival-arena',name:'ESKO Survival Arena',category:'بقاء ومغامرة',engine:'survival',ready:true});

  const BOTS = [{"id":1,"name":"ESKO HelpDesk","group":"المساعدة والردود الذكية","desc":"استقبال طلبات الدعم وتصنيفها وتوجيهها."},{"id":2,"name":"Study Coach","group":"المساعدة والردود الذكية","desc":"مساعد مذاكرة ومتابعة أهداف الدراسة."},{"id":3,"name":"Translator","group":"المساعدة والردود الذكية","desc":"ترجمة النصوص مع تحديد اللغة والاتجاه."},{"id":4,"name":"Text Summarizer","group":"المساعدة والردود الذكية","desc":"تلخيص النصوص الطويلة إلى نقاط واضحة."},{"id":5,"name":"Reminder","group":"المساعدة والردود الذكية","desc":"تذكيرات ومواعيد مع تأكيد حالة الإرسال."},{"id":6,"name":"Poll Maker","group":"المساعدة والردود الذكية","desc":"إنشاء استطلاعات وجمع النتائج."},{"id":7,"name":"Feedback","group":"المساعدة والردود الذكية","desc":"جمع تقييمات المستخدمين وتحليلها."},{"id":8,"name":"Support Tickets","group":"المساعدة والردود الذكية","desc":"نظام تذاكر دعم ومتابعة الحالات."},{"id":9,"name":"Knowledge Library","group":"المساعدة والردود الذكية","desc":"بحث وإدارة قاعدة معرفة منظمة."},{"id":10,"name":"Command Assistant","group":"المساعدة والردود الذكية","desc":"شرح الأوامر وإدارة أوامر مسموحة."},{"id":11,"name":"Telegram Guardian","group":"إدارة المجتمعات والمجموعات","desc":"إدارة مجتمع Telegram وفق صلاحيات المنصة."},{"id":12,"name":"Discord Guardian","group":"إدارة المجتمعات والمجموعات","desc":"إدارة خادم Discord والأدوار والقنوات."},{"id":13,"name":"Welcome Bot","group":"إدارة المجتمعات والمجموعات","desc":"رسائل ترحيب وقواعد المجتمع."},{"id":14,"name":"Role Request","group":"إدارة المجتمعات والمجموعات","desc":"طلبات أدوار بموافقة المشرفين."},{"id":15,"name":"Event RSVP","group":"إدارة المجتمعات والمجموعات","desc":"تسجيل حضور الفعاليات وتأكيده."},{"id":16,"name":"Suggestions","group":"إدارة المجتمعات والمجموعات","desc":"صندوق اقتراحات مع التصويت والمتابعة."},{"id":17,"name":"Anti-Spam","group":"إدارة المجتمعات والمجموعات","desc":"كشف الرسائل المكررة والمزعجة وفق قواعد معتدلة."},{"id":18,"name":"Group FAQ","group":"إدارة المجتمعات والمجموعات","desc":"إجابات للأسئلة الشائعة داخل المجموعة."},{"id":19,"name":"Moderation Cases","group":"إدارة المجتمعات والمجموعات","desc":"سجل قرارات الإشراف والمراجعة."},{"id":20,"name":"Community Digest","group":"إدارة المجتمعات والمجموعات","desc":"ملخص دوري للنقاشات والإعلانات."},{"id":21,"name":"Uptime Monitor","group":"خدمات المواقع","desc":"متابعة توافر الخدمات المصرح بمراقبتها."},{"id":22,"name":"Live Chat","group":"خدمات المواقع","desc":"واجهة دعم فوري مرتبطة بخادم موثوق."},{"id":23,"name":"Contact Assistant","group":"خدمات المواقع","desc":"تنظيم رسائل التواصل والطلبات."},{"id":24,"name":"Webhook Assistant","group":"خدمات المواقع","desc":"استقبال Webhooks والتحقق من توقيعها."},{"id":25,"name":"RSS Reader","group":"خدمات المواقع","desc":"متابعة خلاصات RSS المسموح بها."},{"id":26,"name":"Link Inspector","group":"خدمات المواقع","desc":"فحص تنسيق الروابط ومؤشرات الأمان الأساسية."},{"id":27,"name":"Content Watcher","group":"خدمات المواقع","desc":"مراقبة تغيّر محتوى صفحات عامة مصرح بها."},{"id":28,"name":"Domain Alert","group":"خدمات المواقع","desc":"تنبيهات انتهاء النطاقات التي يملكها المستخدم."},{"id":29,"name":"Deploy Notifier","group":"خدمات المواقع","desc":"إشعار بحالة نشر الموقع ونتيجة البناء."},{"id":30,"name":"Accessibility Checker","group":"خدمات المواقع","desc":"تقارير إتاحة الواجهة وفق معايير معروفة."},{"id":31,"name":"Task Manager","group":"الإنتاجية والتنظيم","desc":"قوائم مهام ومواعيد وأولويات."},{"id":32,"name":"Study Scheduler","group":"الإنتاجية والتنظيم","desc":"تنظيم جدول الدراسة وتذكير بالمواعيد."},{"id":33,"name":"Notes Librarian","group":"الإنتاجية والتنظيم","desc":"تصنيف الملاحظات والبحث فيها."},{"id":34,"name":"File Inventory","group":"الإنتاجية والتنظيم","desc":"جرد الملفات التي يختار المستخدم مشاركتها."},{"id":35,"name":"Backup Auditor","group":"الإنتاجية والتنظيم","desc":"التحقق من وجود نسخ احتياطية وسلامة بصماتها."},{"id":36,"name":"Duplicate Finder","group":"الإنتاجية والتنظيم","desc":"اكتشاف الملفات المتكررة دون حذف تلقائي."},{"id":37,"name":"Download Tracker","group":"الإنتاجية والتنظيم","desc":"تنظيم قائمة التنزيلات وحالاتها."},{"id":38,"name":"Calendar Assistant","group":"الإنتاجية والتنظيم","desc":"إدارة أحداث التقويم والتذكيرات."},{"id":39,"name":"Weather Alert","group":"الإنتاجية والتنظيم","desc":"ملخصات طقس عبر مزود بيانات موثوق."},{"id":40,"name":"Converter","group":"الإنتاجية والتنظيم","desc":"تحويل وحدات وصيغ بيانات شائعة."},{"id":41,"name":"GitHub Watcher","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"متابعة مستودعات GitHub التي يملك المستخدم صلاحية الوصول إليها."},{"id":42,"name":"Issue Triage","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"تصنيف القضايا وفق قواعد المشروع."},{"id":43,"name":"Changelog Maker","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"إنشاء سجل تغييرات من الإصدارات."},{"id":44,"name":"Release Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"تجهيز قوائم إصدار ومراجعة قبل النشر."},{"id":45,"name":"Code Inspector","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"فحص تنسيق وأخطاء برمجية أولية."},{"id":46,"name":"Test Runner","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"تشغيل اختبارات المشروع المصرح به وتلخيصها."},{"id":47,"name":"Log Analyzer","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"تحليل السجلات مع إخفاء الأسرار."},{"id":48,"name":"Dependency Auditor","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مراجعة التبعيات والتنبيهات الأمنية."},{"id":49,"name":"Database Inspector","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"عرض بنية قواعد البيانات دون تعديل تلقائي."},{"id":50,"name":"API Monitor","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مراقبة صحة واجهات API المصرح بها."},{"id":51,"name":"Accessibility Guide","group":"المساعدة والردود الذكية","desc":"اقتراح تحسينات للقراءة والتباين والتنقل بلوحة المفاتيح."},{"id":52,"name":"Flashcard Maker","group":"التعليم والإنتاجية","desc":"تحويل الملاحظات إلى بطاقات مراجعة وأسئلة قصيرة."},{"id":53,"name":"Project Changelog","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"تنظيم ملخصات الإصدارات والتغييرات من ملاحظات المطور."},{"id":54,"name":"README Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"إنشاء هيكل توثيق للمشروع مع توضيح المتطلبات وطريقة التشغيل."},{"id":55,"name":"Image Size Helper","group":"خدمات الملفات والوسائط","desc":"اقتراح أبعاد وصيغ صور مناسبة للويب قبل الرفع."},{"id":56,"name":"Data Export Planner","group":"خدمات الملفات والوسائط","desc":"تنظيم خطة تصدير نسخة احتياطية مع تذكير بحماية الملفات."},{"id":57,"name":"Meeting Notes","group":"التعليم والإنتاجية","desc":"ترتيب محاضر الاجتماعات إلى قرارات ومهام ومسؤوليات."},{"id":58,"name":"Language Practice","group":"التعليم والإنتاجية","desc":"تدريبات مفردات وجمل قصيرة لممارسة اللغة."},{"id":59,"name":"Release Checklist","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قائمة مراجعة للنشر تشمل الروابط والملفات والاختبارات."},{"id":60,"name":"Privacy Reminder","group":"إدارة المجتمعات والمجموعات","desc":"تنبيه المستخدم قبل مشاركة معلومات شخصية أو ملفات حساسة."},{"id":61,"name":"Site FAQ Bot","group":"المساعدة والردود الذكية","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":62,"name":"Arabic Writing Helper","group":"خدمات المواقع","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":63,"name":"Customer Care Queue","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":64,"name":"Product Guide Bot","group":"التعليم والإنتاجية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":65,"name":"Appointment Coordinator","group":"الإنتاجية والتنظيم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":66,"name":"Order Status Assistant","group":"خدمات الملفات والوسائط","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":67,"name":"Community Welcome Desk","group":"التصميم وتجربة المستخدم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":68,"name":"Content Calendar Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":69,"name":"Newsletter Helper","group":"خدمات المواقع","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":70,"name":"Survey Collector","group":"المساعدة والردود الذكية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":71,"name":"Website Feedback Bot","group":"المساعدة والردود الذكية","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":72,"name":"Knowledge Search Bot","group":"خدمات المواقع","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":73,"name":"Documentation Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":74,"name":"Code Review Helper","group":"التعليم والإنتاجية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":75,"name":"Bug Report Organizer","group":"الإنتاجية والتنظيم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":76,"name":"Build Status Bot","group":"خدمات الملفات والوسائط","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":77,"name":"Release Notes Bot","group":"التصميم وتجربة المستخدم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":78,"name":"API Documentation Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":79,"name":"Database Backup Reminder","group":"خدمات المواقع","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":80,"name":"Cloud Status Watcher","group":"المساعدة والردود الذكية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":81,"name":"Study Notes Assistant","group":"المساعدة والردود الذكية","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":82,"name":"Vocabulary Practice Bot","group":"خدمات المواقع","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":83,"name":"Math Practice Coach","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":84,"name":"Science Explainer Bot","group":"التعليم والإنتاجية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":85,"name":"Reading Companion","group":"الإنتاجية والتنظيم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":86,"name":"Quiz Generator Bot","group":"خدمات الملفات والوسائط","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":87,"name":"Homework Planner","group":"التصميم وتجربة المستخدم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":88,"name":"Classroom Announcement Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":89,"name":"Research Organizer","group":"خدمات المواقع","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":90,"name":"Citation Checklist Bot","group":"المساعدة والردود الذكية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":91,"name":"Translation Review Bot","group":"المساعدة والردود الذكية","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":92,"name":"Meeting Summary Bot","group":"خدمات المواقع","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":93,"name":"Task Prioritizer","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":94,"name":"Habit Tracker Bot","group":"التعليم والإنتاجية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":95,"name":"Personal Journal Organizer","group":"الإنتاجية والتنظيم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":96,"name":"Calendar Digest Bot","group":"خدمات الملفات والوسائط","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":97,"name":"Expense Category Helper","group":"التصميم وتجربة المستخدم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":98,"name":"Inventory Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":99,"name":"File Naming Helper","group":"خدمات المواقع","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":100,"name":"Image Alt Text Bot","group":"المساعدة والردود الذكية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":101,"name":"Accessibility Review Bot","group":"المساعدة والردود الذكية","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":102,"name":"SEO Checklist Bot","group":"خدمات المواقع","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":103,"name":"Page Speed Reporter","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":104,"name":"Broken Link Reporter","group":"التعليم والإنتاجية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":105,"name":"Website Content Auditor","group":"الإنتاجية والتنظيم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":106,"name":"Form Validation Helper","group":"خدمات الملفات والوسائط","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":107,"name":"CSS Component Assistant","group":"التصميم وتجربة المستخدم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":108,"name":"Design Token Organizer","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":109,"name":"Color Contrast Helper","group":"خدمات المواقع","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":110,"name":"Responsive Layout Guide","group":"المساعدة والردود الذكية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":111,"name":"Git Commit Helper","group":"المساعدة والردود الذكية","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":112,"name":"Pull Request Summary Bot","group":"خدمات المواقع","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":113,"name":"Issue Label Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":114,"name":"Repository README Bot","group":"التعليم والإنتاجية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":115,"name":"Dependency Update Reminder","group":"الإنتاجية والتنظيم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":116,"name":"Test Coverage Reporter","group":"خدمات الملفات والوسائط","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":117,"name":"Log Summary Assistant","group":"التصميم وتجربة المستخدم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":118,"name":"Error Message Explainer","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":119,"name":"JSON Schema Helper","group":"خدمات المواقع","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":120,"name":"CSV Cleanup Assistant","group":"المساعدة والردود الذكية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":121,"name":"Data Quality Monitor","group":"المساعدة والردود الذكية","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":122,"name":"Spreadsheet Formula Helper","group":"خدمات المواقع","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":123,"name":"Chart Caption Assistant","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":124,"name":"Metrics Digest Bot","group":"التعليم والإنتاجية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":125,"name":"Report Formatter","group":"الإنتاجية والتنظيم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":126,"name":"Data Dictionary Bot","group":"خدمات الملفات والوسائط","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":127,"name":"Privacy Checklist Bot","group":"التصميم وتجربة المستخدم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":128,"name":"Consent Notice Helper","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":129,"name":"Security Policy Explainer","group":"خدمات المواقع","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":130,"name":"Safe Link Checker","group":"المساعدة والردود الذكية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":131,"name":"Telegram Community FAQ","group":"المساعدة والردود الذكية","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":132,"name":"Discord Server Guide","group":"خدمات المواقع","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":133,"name":"Event Registration Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":134,"name":"Volunteer Coordinator","group":"التعليم والإنتاجية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":135,"name":"Club Announcement Bot","group":"الإنتاجية والتنظيم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":136,"name":"Moderation Queue Helper","group":"خدمات الملفات والوسائط","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":137,"name":"Rule Reminder Bot","group":"التصميم وتجربة المستخدم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":138,"name":"Feedback Triage Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":139,"name":"Community Poll Assistant","group":"خدمات المواقع","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":140,"name":"Member Onboarding Bot","group":"المساعدة والردود الذكية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":141,"name":"Shop Product FAQ","group":"المساعدة والردود الذكية","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":142,"name":"Catalog Description Helper","group":"خدمات المواقع","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":143,"name":"Shipping Policy Bot","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":144,"name":"Return Policy Assistant","group":"التعليم والإنتاجية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":145,"name":"Storefront Content Helper","group":"الإنتاجية والتنظيم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":146,"name":"Price List Organizer","group":"خدمات الملفات والوسائط","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":147,"name":"Product Comparison Guide","group":"التصميم وتجربة المستخدم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":148,"name":"Customer Review Summarizer","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":149,"name":"Shopping List Assistant","group":"خدمات المواقع","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":150,"name":"Store Maintenance Reminder","group":"المساعدة والردود الذكية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":151,"name":"Podcast Notes Bot","group":"المساعدة والردود الذكية","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":152,"name":"Video Caption Organizer","group":"خدمات المواقع","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":153,"name":"Audio Transcript Formatter","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":154,"name":"Media Library Assistant","group":"التعليم والإنتاجية","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":155,"name":"Photo Metadata Helper","group":"الإنتاجية والتنظيم","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":156,"name":"Presentation Outline Bot","group":"خدمات الملفات والوسائط","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."},{"id":157,"name":"Social Post Planner","group":"التصميم وتجربة المستخدم","desc":"قالب قابل للتخصيص مع إعدادات واضحة ومراجعة بشرية قبل التنفيذ."},{"id":158,"name":"Brand Voice Checklist","group":"المطورون والأتمتة والذكاء الاصطناعي","desc":"ينظم البيانات التي يختار المستخدم مشاركتها ولا ينفذ إجراءات تلقائية حساسة."},{"id":159,"name":"Campaign Report Helper","group":"خدمات المواقع","desc":"يقدم إرشادات ومخرجات أولية، ويحتاج اختبارًا وربطًا رسميًا قبل التشغيل."},{"id":160,"name":"Creator Support Bot","group":"المساعدة والردود الذكية","desc":"مساعد قالب لتنظيم المهام والردود ضمن صلاحيات المنصة."}];
  const CHANNEL = 'https://whatsapp.com/channel/0029VbE7vGO4tRrwmz95M73S';
  const BACKUP = 'https://whatsapp.com/channel/0029VbEH9N2LY6d4aZ8FRW0I';
  const SUPPORT = 'https://wa.me/963993825873';
  const API_BASE = String(window.ESKO_API_BASE || '/api').replace(/\/$/, '');
  const $ = (s, root=document) => root.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rand = n => Math.floor(Math.random()*n);
  const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
  const EAGLE_EFFECT_NAMES = Array.from({length:30},(_,i)=>`eagle-${String(i+1).padStart(2,'0')}`);
  function showEagleEffect(){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    let overlay=document.getElementById('esko-eagle-effect');
    if(!overlay){
      overlay=document.createElement('div');overlay.id='esko-eagle-effect';overlay.setAttribute('aria-hidden','true');
      overlay.innerHTML='<img alt="" src="'+new URL('assets/esko-eagle-v5.webp',document.baseURI).href+'">';
      document.body.appendChild(overlay);
    }
    const variant=rand(EAGLE_EFFECT_NAMES.length);
    overlay.dataset.effect=EAGLE_EFFECT_NAMES[variant];
    overlay.style.setProperty('--eagle-tilt',`${rand(41)-20}deg`);
    overlay.style.setProperty('--eagle-scale',`${0.65+rand(70)/100}`);
    overlay.style.setProperty('--eagle-hue',`${rand(61)-30}deg`);
    overlay.classList.remove('run');void overlay.offsetWidth;overlay.classList.add('run');
    clearTimeout(overlay._hideTimer);overlay._hideTimer=setTimeout(()=>overlay.classList.remove('run'),1500);
  }
  async function loadAIReplyBank(){
    try{AI_REPLY_BANK=await loadLibraryFile(new URL('v5/ai-auto-replies.json',document.baseURI));}
    catch(_){AI_REPLY_BANK=[];}
  }
  function findAutoReply(query){
    const q=query.toLowerCase();
    const scored=AI_REPLY_BANK.map(item=>({...item,score:(item.keywords||[]).reduce((n,k)=>n+(q.includes(String(k).toLowerCase())?1:0),0)}))
      .filter(item=>item.score>0).sort((a,b)=>b.score-a.score);
    return scored.length?scored[rand(Math.min(5,scored.length))]:null;
  }


  const root = document.createElement('div'); root.id='esko-v5-root';
  root.innerHTML = `
    <button id="esko-v5-launcher" type="button" aria-label="فتح مركز ESKO V5">♛ ESKO V5</button>
    <a id="esko-v5-support" href="${SUPPORT}" data-random-support target="_blank" rel="noopener noreferrer" aria-label="الدعم الفني عبر واتساب">🟢 قناة الدعم</a>
    <div id="esko-v5-shell" aria-hidden="true">
      <div class="ev5-wrap">
        <header class="ev5-head"><div class="ev5-brand">♛ ESKO JOKER <small>V5.6 FEATURE CENTER</small></div><button class="ev5-close" type="button" aria-label="إغلاق">×</button></header>
        <nav class="ev5-nav" aria-label="أقسام ESKO V5">
          <button class="ev5-tab active" data-view="home">الرئيسية</button>
          <button class="ev5-tab" data-view="games">الألعاب 52</button>
          <button class="ev5-tab" data-view="tools">الأدوات 1600</button>
          <button class="ev5-tab" data-view="bots">البوتات 160</button><button class="ev5-tab" data-view="bot-builder">بناء ونسخ الهيكل</button>
          <button class="ev5-tab" data-view="talk">المناقشات</button>
          <button class="ev5-tab" data-view="search">البحث</button>
          <button class="ev5-tab" data-view="ai">🤖 ذكاء ESKO</button>
          <button class="ev5-tab" data-view="store">المتجر الإلكتروني</button>
          <button class="ev5-tab" data-view="developer">المطور</button>
        </nav>
        <main>
          <section class="ev5-view active" id="ev5-home">
            <div class="ev5-hero"><span class="ev5-status">JOKER SYSTEM</span><h1>مركز ESKO V5.6</h1><p>بوابة إضافات مستقلة للموقع والتطبيق: الألعاب، أدوات بناء المواقع والهندسة، قوالب البوتات، المناقشات، البحث والدعم.</p><div class="ev5-actions"><button class="ev5-btn primary" data-go="games">افتح الألعاب</button><button class="ev5-btn" data-go="tools">مكتبة الأدوات</button><button class="ev5-btn" data-go="bots">قوالب البوتات</button></div></div>
            <div class="ev5-grid">
              <article class="ev5-card"><div class="ev5-icon">🎮</div><h3>ESKO GAMES</h3><p>فهرس 52 لعبة، منها 12 لعبة محلية قابلة للتشغيل داخل الموقع.</p><span class="ev5-status ready" id="ev5-game-ready-count">جارٍ الفحص</span><button class="ev5-btn" data-go="games">فتح القسم</button></article>
              <article class="ev5-card"><div class="ev5-icon">📐</div><h3>أدوات المواقع والهندسة</h3><p>50 أداة لبناء المواقع و50 أداة للأشكال والحسابات الهندسية.</p><span class="ev5-status ready">100 أداة في الفهرس</span><button class="ev5-btn" data-go="tools">فتح المكتبة</button></article>
              <article class="ev5-card"><div class="ev5-icon">🤖</div><h3>ESKO BOTS</h3><p>160 قالب مشروع مستقل مع طبقة روابط رسمية تلقائية لكل رسالة صادرة.</p><span class="ev5-status ready">160 قالبًا</span><button class="ev5-btn" data-go="bots">عرض البوتات</button></article>
              <article class="ev5-card"><div class="ev5-icon">💬</div><h3>المناقشات</h3><p>واجهة ربط للدردشة العامة والخاصة والمجموعات. يلزم خادم دائم قبل تفعيل الرسائل.</p><span class="ev5-status">الخادم غير مضبوط</span><button class="ev5-btn" data-go="talk">حالة المناقشات</button></article>
              <article class="ev5-card"><div class="ev5-icon">🔎</div><h3>ESKO SEARCH</h3><p>محرك Google المدمج عبر Programmable Search Engine داخل مساحة ESKO.</p><span class="ev5-status">يحتاج معرّف CX</span><button class="ev5-btn" data-go="search">إعداد البحث</button></article>
              <article class="ev5-card"><div class="ev5-icon">🟢</div><h3>الدعم الفني</h3><p>روابط القناة الرسمية والاحتياطية والتواصل مع الدعم الفني.</p><a class="ev5-green-link" href="${SUPPORT}" data-random-support target="_blank" rel="noopener">محادثة فريق الدعم</a></article>
            </div>
            <div class="ev5-warning">هذه طبقة إضافات V5 منفصلة؛ لا تستبدل ملفات الموقع أو التطبيق القديمة. الدردشة الحية ونتائج Google الفعلية تحتاج إعدادات خادم وCX موثّقين.</div>
          </section>
          <section class="ev5-view" id="ev5-games"><div class="ev5-hero"><h1>♛ ESKO GAMES ♛</h1><p>52 لعبة في الفهرس؛ 12 محركًا محليًا جاهزًا للعب والبقية تظهر بوضوح كعناصر غير مفعّلة. لا نستخدم تضمينًا عشوائيًا أو نعد بتشغيل لعبة خارجية قبل التأكد من الترخيص ودعم الهاتف.</p></div><input class="ev5-search" id="ev5-game-filter" placeholder="ابحث عن لعبة..." aria-label="البحث عن لعبة"><div class="ev5-actions" id="ev5-game-cats"></div><div class="ev5-grid" id="ev5-game-grid"></div><div class="ev5-stage" id="ev5-game-stage" hidden></div></section>
          <section class="ev5-view" id="ev5-tools"><div class="ev5-hero"><h1>مكتبة الأدوات الهندسية والبرمجية</h1><p>1600 بطاقة أدوات موزعة على 10 أقسام. بطاقات الكتالوج توضح الوظائف؛ لا تُعرض كأدوات تنفيذية قبل إضافة محركاتها واختبارها.</p></div><input class="ev5-search" id="ev5-tool-filter" placeholder="ابحث داخل 1600 أداة..." aria-label="البحث في مكتبة الأدوات"><div class="ev5-actions ev5-tool-groups" id="ev5-tool-groups"></div><p class="ev5-small" id="ev5-tool-count">1600 بطاقة كتالوج · 10 أقسام</p><div class="ev5-grid" id="ev5-tool-grid"></div><div id="ev5-tool-detail" class="ev5-stage" hidden></div></section>
          <section class="ev5-view" id="ev5-bots"><div class="ev5-hero"><h1>♛ ESKO BOTS — 160</h1><p>اختر أي قالب لفتح صفحة بناء مستقلة ونسخ الوصف والملفات البرمجية الجاهزة. الهيكل موحّد وقابل لتوصيله عبر موائمات رسمية للمنصات.</p></div><input class="ev5-search" id="ev5-bot-filter" placeholder="ابحث عن بوت..."><div class="ev5-grid" id="ev5-bot-grid"></div><div class="ev5-card"><h3>90 معالج أداء للواجهة</h3><p>دوال خفيفة لتخفيف التحميل وتنظيم البحث والذاكرة والصور والحركة والشبكة وإمكانية الوصول، دون ادعاء زيادة قدرة CPU الفعلية.</p><div class="ev5-processor-grid" id="ev5-bot-processors"></div><p class="ev5-small" id="ev5-perf-summary">جارٍ فحص محركات الأداء...</p></div><div class="ev5-warning">الاتصال الفعلي يحتاج استضافة HTTPS ومفاتيح رسمية محفوظة في الخادم. لا تُستخدم مكتبات واتساب غير رسمية أو إرسال جماعي أو حذف جهات اتصال.</div></section>
          <section class="ev5-view" id="ev5-bot-builder"><div class="ev5-hero"><span class="ev5-status ready">BOT BLUEPRINT BUILDER</span><h1 id="ev5-builder-title">مولّد هيكل البوت</h1><p id="ev5-builder-summary">اختر قالبًا من قسم البوتات لعرض ملفاته القابلة للنسخ.</p><button class="ev5-btn" id="ev5-builder-back">العودة إلى قائمة البوتات</button></div><div class="ev5-cards3" id="ev5-bot-action-cards"></div><div class="ev5-stage" id="ev5-bot-info" hidden></div><div class="ev5-row" id="ev5-bot-file-tabs"></div><div class="ev5-stage"><div class="ev5-row"><strong id="ev5-bot-file-name">اختر ملفًا</strong><button class="ev5-btn primary" id="ev5-bot-copy">نسخ الملف</button></div><details class="ev5-code-details"><summary>عرض الكود (اختياري)</summary><pre class="ev5-code-box" id="ev5-bot-code" tabindex="0">لم يتم اختيار قالب بعد.</pre></details><p class="ev5-small" id="ev5-copy-status" aria-live="polite"></p></div><p class="ev5-warning">ملاحظة: القالب يستخدم واجهات رسمية فقط. مفاتيح الاتصال توضع في ملف .env على خادم خاص ولا توضع داخل الموقع أو GitHub. لا يوجد حذف تلقائي لجهات الاتصال أو رسائل غير مطلوبة.</p></section>
          <section class="ev5-view" id="ev5-talk"><div class="ev5-hero"><h1>المناقشات والمحادثات</h1><p>هذا القسم يستخدم خدمة الحسابات والمناقشات المشتركة على نفس نطاق الموقع والتطبيق عند فتحهما على عنوان النشر نفسه.</p></div><div class="ev5-ok">تسجيل الدخول والجلسات والمحادثة العامة والمجموعات والرسائل الخاصة بعد القبول تعمل من خلال واجهة الخادم المشتركة. الرسائل مؤقتة وتحذف تلقائيًا بعد 7 ساعات.</div><div class="ev5-card"><h3>مركز المناقشات</h3><p>القراءة والإرسال تتطلب تسجيل الدخول. لا تُحفَظ الرسائل في localStorage؛ يحفظها الخادم ثم يعيدها للأعضاء المخوّلين.</p><button class="ev5-btn primary" id="ev5-open-discussions">فتح قسم المناقشات</button></div><div class="ev5-card"><h3>حالة الخادم</h3><p id="ev5-chat-state">لم يتم فحص الخدمة بعد.</p><button class="ev5-btn" id="ev5-chat-check">فحص اتصال الحسابات والمناقشات</button></div></section>
          <section class="ev5-view" id="ev5-search"><div class="ev5-hero"><h1>♛ ESKO SEARCH</h1><p>بحث فوري داخل الألعاب والأدوات والبوتات والعناصر المضافة للمنظومة. ويمكن تفعيل Google Programmable Search عند ضبط CX.</p></div><form id="ev5-search-form" class="ev5-actions"><input id="ev5-google-query" class="ev5-input" placeholder="ابحث في المنظومة..." aria-label="عبارة البحث" required><button class="ev5-btn primary" type="submit">بحث داخلي</button><button class="ev5-btn" type="button" id="ev5-search-clear">مسح</button></form><div id="ev5-google-results" class="ev5-stage" aria-live="polite"></div><div class="ev5-actions"><button class="ev5-btn" type="button" id="ev5-google-search">بحث Google داخل الصفحة (يتطلب CX)</button><button class="ev5-btn primary" type="button" id="ev5-open-google">فتح نتائج Google في المتصفح</button></div><p class="ev5-small" id="ev5-cx-help">البحث الداخلي يعمل دون مفتاح. بحث Google الخارجي يحتاج Programmable Search Engine CX.</p></section>
          <section class="ev5-view" id="ev5-developer"><div class="ev5-hero"><h1>قسم المطور والدعم</h1><p>روابط ESKO الرسمية مثبتة داخل هذا القسم وتظهر كذلك في قوالب البوتات عند إرسال ردودها.</p></div><div class="ev5-cards3"><article class="ev5-card"><h3>القناة الرسمية</h3><p>آخر الأخبار والتحديثات الرسمية.</p><a class="ev5-green-link" href="${CHANNEL}" target="_blank" rel="noopener">فتح القناة الرسمية</a></article><article class="ev5-card"><h3>القناة الاحتياطية</h3><p>القناة البديلة لمتابعة التحديثات.</p><a class="ev5-green-link" href="${BACKUP}" target="_blank" rel="noopener">فتح القناة الاحتياطية</a></article><article class="ev5-card"><h3>الدعم الفني</h3><p>للمساعدة والإبلاغ عن مشكلة.</p><a class="ev5-green-link" href="${SUPPORT}" data-random-support target="_blank" rel="noopener">محادثة الدعم</a></article></div></section>
          <section class="ev5-view" id="ev5-ai">
            <div class="ev5-hero"><span class="ev5-status ready">ESKO SITE AI · 600 LOCAL REPLIES</span><h1>🤖 ذكاء ESKO الاصطناعي</h1>
              <p>مساعد محلي مع قاعدة 600 رد تلقائي عن ESKO، وتحليل نصوص وبحث في الفهرس. لا يدّعي اتصالًا بنموذج عالمي أو إرسال بيانات إلى خدمة خارجية.</p></div>
            <div class="ev5-grid">
              <article class="ev5-card"><h3>1 · إجابات الموقع</h3><p>بحث في الألعاب والبوتات والأدوات وأقسام ESKO.</p>
                <textarea id="ev5-ai-question" class="ev5-search" rows="3" placeholder="اسأل عن ميزة أو قسم داخل ESKO..."></textarea>
                <button class="ev5-btn primary" id="ev5-ai-answer">إجابة من فهرس الموقع</button>
                <div class="ev5-stage" id="ev5-ai-answer-output" aria-live="polite"></div>
              </article>
              <article class="ev5-card"><h3>2 · تحليل الكلام والنص</h3><p>الصق تفريغًا نصيًا للكلام؛ هذه النسخة لا تسجل الصوت أو ترفعه.</p>
                <textarea id="ev5-ai-transcript" class="ev5-search" rows="4" placeholder="الصق النص المراد تحليله..."></textarea>
                <button class="ev5-btn" id="ev5-ai-analyze">تحليل النص</button>
                <div class="ev5-stage" id="ev5-ai-analysis-output"></div>
              </article>
              <article class="ev5-card"><h3>3 · البحث داخل الموقع</h3><p>يعرض نتائج محلية من كتالوج ESKO.</p>
                <input id="ev5-ai-site-query" class="ev5-search" placeholder="كلمة البحث داخل الموقع">
                <button class="ev5-btn" id="ev5-ai-site-search">ابحث في الموقع</button>
                <div class="ev5-stage" id="ev5-ai-site-results"></div>
              </article>
              <article class="ev5-card"><h3>4–7 · المعالجة والإرسال</h3><p>معالجة محلية سريعة، تجهيز الرد، وفحص نطاق السؤال. لا يتم إرسال شيء تلقائيًا.</p>
                <span class="ev5-processor-chip">معالج محلي · استجابة عادةً فورية</span>
                <span class="ev5-processor-chip">مراجعة قبل النسخ أو الإرسال</span>
                <span class="ev5-processor-chip">لا يوجد API عالمي مجاني مدمج دون خادم ومزود</span>
              </article>
            </div>
            <div class="ev5-warning" id="ev5-ai-scope-note">المساعد خاص بالموقع فقط. إذا كان السؤال خارج نطاق ESKO سيعرض: «هذا خارج نطاق الموقع أو لم يتم إضافته في التحديثات، اتصل بقسم الدعم».</div>
            <button class="ev5-btn primary" id="ev5-ai-support" data-random-support data-support-message="اريد تحديثا من المطور ارجو اخباره&#10;اتمني الدعم السريع والتحديث">طلب تحديث من المطور عبر الدعم</button>
          </section>
          <section class="ev5-view" id="ev5-store">
            <div class="ev5-store-hero"><span class="ev5-status">JOKER STORE · UNDER DEVELOPMENT</span><h1>🛍️ المتجر الإلكتروني</h1>
              <p>2000 إضافة وأداة تجريبية، بالإضافة إلى 500 قالب بوت و100 لعبة و300 منظر هندسي. المتجر منفصل عن APK؛ الإضافة تحفظ محليًا، والمزامنة بالحساب تحتاج خادمًا رسميًا.</p></div>
            <div class="ev5-card"><h3>🔎 كتالوج 2000 إضافة</h3>
              <input id="ev5-store-search" class="ev5-search" placeholder="ابحث في إضافات المتجر..." aria-label="بحث المتجر">
              <div class="ev5-actions" id="ev5-store-categories"></div>
              <p class="ev5-small" id="ev5-store-count">جارٍ تحميل الكتالوج...</p>
              <div class="ev5-grid" id="ev5-store-grid"></div>
              <div class="ev5-actions"><button class="ev5-btn" id="ev5-store-prev">السابق</button><span class="ev5-status" id="ev5-store-page">صفحة 1</span><button class="ev5-btn" id="ev5-store-next">التالي</button></div>
            </div>
            <div class="ev5-card"><h3>📦 إضافاتي المحفوظة على هذا الجهاز</h3><p class="ev5-small">هذه القائمة محلية للمتصفح وليست مزامنة حساب أو تثبيتًا داخل APK.</p><div id="ev5-store-added"></div><button class="ev5-btn" id="ev5-store-clear">مسح القائمة المحلية</button></div>
            <div class="ev5-card"><h3>30 معالجًا وأداة للمتجر</h3><div class="ev5-processor-grid" id="ev5-store-processors"></div>
              <p class="ev5-warning">تحت التطوير · لا يوجد دفع أو تثبيت APK تلقائي. ربط الحساب يحتاج endpoint آمنًا وموافقة المستخدم.</p></div>
            <div class="ev5-store-collection"><div class="ev5-hero"><h2>🤖 متجر هياكل البوتات — 500 قالب</h2><p>قوالب منظمة حسب الاستخدام مع أيقونة ووصف ومولد ملفات. كل قالب يحتاج إعداد بيانات المنصة الرسمية واختبار Webhook قبل اعتباره متصلًا.</p></div>
              <input id="ev5-store-bot-search" class="ev5-search" placeholder="ابحث في 500 هيكل بوت..." aria-label="بحث هياكل البوتات">
              <div class="ev5-actions" id="ev5-store-bot-categories"></div><p class="ev5-small" id="ev5-store-bot-count">جارٍ تحميل هياكل البوتات...</p>
              <div class="ev5-grid" id="ev5-store-bot-grid"></div><div class="ev5-actions"><button class="ev5-btn" id="ev5-store-bot-prev">السابق</button><span class="ev5-status" id="ev5-store-bot-page">صفحة 1</span><button class="ev5-btn" id="ev5-store-bot-next">التالي</button></div>
            </div>
            <div class="ev5-store-collection"><div class="ev5-hero"><h2>🎮 متجر الألعاب — 100 لعبة</h2><p>12 لعبة لها محركات محلية موجودة ويمكن تشغيلها بعد الإضافة. بقية الألعاب أفكار أصلية في الكتالوج وتظهر تحت التطوير حتى يتوفر محركها.</p></div>
              <input id="ev5-store-game-search" class="ev5-search" placeholder="ابحث في 100 لعبة..." aria-label="بحث الألعاب">
              <div class="ev5-actions" id="ev5-store-game-categories"></div><p class="ev5-small" id="ev5-store-game-count">جارٍ تحميل الألعاب...</p>
              <div class="ev5-grid" id="ev5-store-game-grid"></div><div class="ev5-actions"><button class="ev5-btn" id="ev5-store-game-prev">السابق</button><span class="ev5-status" id="ev5-store-game-page">صفحة 1</span><button class="ev5-btn" id="ev5-store-game-next">التالي</button></div><div id="ev5-store-game-preview" class="ev5-stage" hidden></div>
            </div>
            <div class="ev5-store-collection"><div class="ev5-hero"><h2>📐 300 منظرًا هندسيًا للموقع</h2><p>عاين كل منظر قبل إضافته. بعد الإضافة يتحول الزر إلى «تشغيل» لتطبيق المشهد على الموقع الحالي. يدعم كل عنصر معاينة ومساعدة.</p></div>
              <input id="ev5-geometry-search" class="ev5-search" placeholder="ابحث في 300 منظر هندسي..." aria-label="بحث المناظر الهندسية">
              <div class="ev5-actions" id="ev5-geometry-categories"></div><p class="ev5-small" id="ev5-geometry-count">جارٍ تحميل المناظر...</p>
              <div class="ev5-grid" id="ev5-geometry-grid"></div><div class="ev5-actions"><button class="ev5-btn" id="ev5-geometry-prev">السابق</button><span class="ev5-status" id="ev5-geometry-page">صفحة 1</span><button class="ev5-btn" id="ev5-geometry-next">التالي</button></div><div id="ev5-geometry-preview" class="ev5-stage" hidden></div>
              <p class="ev5-warning">حفظ المنظر يتم على هذا المتصفح. مزامنته بحسابك أو تطبيق Android يحتاج API وجسر Android لم يتم ربطهما بعد.</p>
            </div>
          </section>
        </main>
        <div class="ev5-footer">🛡🛠 نازلنا بالبدايه والتطوير 🛠🛡 · ESKO OPEN HUB V5.6</div>
      </div>
    </div>`;
  document.body.appendChild(root);
  const shell = $('#esko-v5-shell', root);
  const stage = $('#ev5-game-stage', root);
  let gameTimer = null;
  let gameCleanup = null;
  let selectedToolGroup = 'siteBuilder';
  const TOOL_LABELS = {"siteBuilder":{"label":"بناء المواقع","icon":"🧩"},"geometry":{"label":"الهندسة والرياضيات","icon":"📐"},"design":{"label":"التصميم وتجربة المستخدم","icon":"🎨"},"media":{"label":"الصور والصوت والفيديو","icon":"🖼️"},"developer":{"label":"البرمجة والمطورون","icon":"💻"},"data":{"label":"البيانات والتحليل","icon":"📊"},"productivity":{"label":"الإنتاجية وإدارة المهام","icon":"🗂️"},"education":{"label":"التعليم والتعلم","icon":"📚"},"network":{"label":"الشبكات والاتصال","icon":"🌐"},"automation":{"label":"الأتمتة وسير العمل","icon":"⚙️"}};
  let TOOLS = Object.create(null);
  let AI_REPLY_BANK = [];
  let STORE_ADDONS = [];
  let STORE_BOT_CATALOG = {categories:[],items:[]};
  let STORE_GAMES = [];
  let GEOMETRY_THEMES = [];
  let storeBotCategory = 'الكل';
  let storeBotPage = 0;
  let storeGameCategory = 'الكل';
  let storeGamePage = 0;
  let geometryCategory = 'الكل';
  let geometryPage = 0;
  let storeCategory = 'الكل';
  let storePage = 0;
  let storeQuery = '';
  let botTemplates = Object.create(null);
  let selectedBot = null;
  let selectedBotFile = 'README.md';
  const BOT_FILE_LABELS = [
    ['README.md','1 · وصف البوت'],['package.json','2 · تجهيز المشروع'],['.env.example','3 · الإعدادات'],['src/core.js','4 · محرك البوت والذكاء'],
    ['src/security.js','5 · الحماية والإنذارات'],['src/whatsapp-cloud.js','6 · اتصال WhatsApp الرسمي'],
    ['src/telegram.js','7 · اتصال Telegram الرسمي'],['src/discord.js','8 · اتصال Discord الرسمي'],['src/server.js','9 · التشغيل والربط'],
    ['src/ai/site-knowledge.js','10 · قاعدة معرفة البوت'],['src/ai/text-analysis.js','11 · محلل النصوص'],['src/ai/provider-adapter.js','12 · موائم مزود الذكاء الاختياري']
  ];
  const PERF_NAMES = window.ESKOPerformance90?.entries?.map(item => item.label) || [];

  function stopGame(){ if(gameTimer){clearInterval(gameTimer);gameTimer=null;} if(gameCleanup){gameCleanup();gameCleanup=null;} }
  function go(view){
    stopGame();
    root.querySelectorAll('.ev5-view').forEach(x=>x.classList.toggle('active',x.id==='ev5-'+view));
    root.querySelectorAll('.ev5-tab').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
    if(view==='games') renderGames();
    if(view==='tools') renderTools();
    if(view==='bots') renderBots();
    if(view==='bot-builder' && selectedBot) selectBotFile(selectedBotFile);
    if(view==='talk') $('#ev5-chat-check',root).click();
    if(view==='ai')showEagleEffect();
    if(view==='store')renderStoreCatalog();
    shell.scrollTop=0;
  }
  function open(){shell.classList.add('open');shell.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';document.dispatchEvent(new Event('esko:ui-open'));}
  function close(){stopGame();shell.classList.remove('open');shell.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';}
  $('#esko-v5-launcher',root).addEventListener('click',open);
  $('.ev5-close',root).addEventListener('click',close);
  shell.addEventListener('click',e=>{const t=e.target.closest('[data-view]');if(t)go(t.dataset.view);const g=e.target.closest('[data-go]');if(g)go(g.dataset.go);});

  function card(title,desc,icon,action,status=''){return `<article class="ev5-card"><div class="ev5-icon">${icon}</div><h3>${esc(title)}</h3><p>${esc(desc)}</p>${status?`<span class="ev5-status ${status==='جاهزة محليًا'?'ready':''}">${esc(status)}</span>`:''}<div class="ev5-actions">${action}</div></article>`;}
  function renderGames(filter=''){
    const grid=$('#ev5-game-grid',root); if(!grid)return;
    const q=filter.trim().toLowerCase();
    const arr=GAMES.filter(x=>(x.name+' '+x.category).toLowerCase().includes(q));
    grid.innerHTML=arr.map(g=>card(g.name,g.category+' · '+(g.ready?'لعبة محلية تعمل داخل ESKO':'يتطلب مصدر تشغيل مرخصًا ومختبرًا'),'🎮',g.ready?`<button class="ev5-btn primary" data-play="${g.id}">العب الآن</button>`:`<button class="ev5-btn" disabled title="لا يوجد مصدر موثوق مهيأ بعد">مصدر التشغيل غير مضبوط</button>`,g.ready?'جاهزة محليًا':'ضمن القائمة')).join('')||'<p class="ev5-muted">لا توجد نتيجة مطابقة.</p>';
    $('#ev5-game-ready-count',root).textContent=GAMES.filter(g=>g.ready).length+' ألعاب محلية جاهزة';
    grid.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>launchGame(b.dataset.play)));
  }
  $('#ev5-game-filter',root).addEventListener('input',e=>renderGames(e.target.value));

  function gameHeader(title,help){return `<div class="ev5-row"><button class="ev5-btn" id="ev5-game-back">رجوع للألعاب</button><strong>${esc(title)}</strong></div><p class="ev5-muted">${esc(help||'')}</p>`;}
  function launchGame(id){
    stopGame(); stage.hidden=false;
    const g=GAMES.find(x=>x.id===id); if(!g||!g.ready){stage.innerHTML='<p>اللعبة غير متاحة محليًا بعد.</p>';return;}
    switch(g.engine){
      case 'survival': gameSurvivalArena(); break;
      case 'skydash': gameSkyDash(); break;
      case '2048': game2048(); break;
      case 'sudoku': gameSudoku(); break;
      case 'tetris': gameTetris(); break;
      case 'flappy': gameFlappy(); break;
      case 'snake': gameSnake(); break;
      case 'minesweeper': gameMines(); break;
      case 'tictactoe': gameTtt(); break;
      case 'memory': gameMemory(); break;
      case 'reversi': gameReversi(); break;
      case 'wordsearch': gameWordSearch(); break;
      default: stage.innerHTML='<p>المحرك غير مضاف لهذه اللعبة بعد.</p>';
    }
    const back=$('#ev5-game-back',stage); if(back)back.addEventListener('click',()=>{stopGame();stage.hidden=true;renderGames($('#ev5-game-filter',root).value);});
    stage.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  function gameSurvivalArena(){
    const W=520,H=390;let player={x:W/2,y:H/2},items=[],score=0,energy=100,elapsed=0,last=0,raf=0,alive=true,keys=new Set(),safe=178;
    const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
    function spawn(){items=[];for(let i=0;i<12;i++)items.push({x:30+Math.random()*(W-60),y:30+Math.random()*(H-60),r:7+Math.random()*4});}
    stage.innerHTML=gameHeader('ESKO Survival Arena','تحدّي بقاء خيالي: اجمع البلورات، تحرك داخل المنطقة الآمنة، وابتعد عن العاصفة. لا توجد أسلحة أو قتال.')+
      `<div class="ev5-row"><div class="ev5-kpi">البلورات<strong id="surv-score">0 / 12</strong></div><div class="ev5-kpi">الطاقة<strong id="surv-energy">100%</strong></div><div class="ev5-kpi">الوقت<strong id="surv-time">60</strong></div><button class="ev5-btn" id="surv-reset">إعادة</button></div>`+
      `<canvas id="surv-canvas" class="ev5-canvas" width="520" height="390" aria-label="ساحة بقاء خيالية"></canvas>`+
      `<div class="ev5-dpad"><button class="ev5-btn" data-surv-dir="up">↑</button><div><button class="ev5-btn" data-surv-dir="left">←</button><button class="ev5-btn" data-surv-dir="down">↓</button><button class="ev5-btn" data-surv-dir="right">→</button></div></div>`+
      `<p id="surv-msg" class="ev5-muted" aria-live="polite">استخدم الأسهم أو أزرار اللمس. اجمع كل البلورات وابقَ داخل الدائرة.</p>`;
    const canvas=$('#surv-canvas',stage),ctx=canvas.getContext('2d');if(!ctx){stage.innerHTML+='<p class="ev5-warning">Canvas غير مدعوم على هذا المتصفح.</p>';return;}
    spawn();
    const keydown=e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};const dir=map[e.key];if(dir){e.preventDefault();keys.add(dir);}};
    const keyup=e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};if(map[e.key])keys.delete(map[e.key]);};
    window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
    stage.querySelectorAll('[data-surv-dir]').forEach(btn=>{const d=btn.dataset.survDir;btn.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(d);});['pointerup','pointerleave','pointercancel'].forEach(type=>btn.addEventListener(type,()=>keys.delete(d)));});
    function reset(){cancelAnimationFrame(raf);player={x:W/2,y:H/2};score=0;energy=100;elapsed=0;last=0;alive=true;safe=178;keys.clear();spawn();$('#surv-msg',stage).textContent='اجمع البلورات وابقَ داخل الدائرة.';raf=requestAnimationFrame(tick);}
    function draw(){
      const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#0a2032');bg.addColorStop(1,'#11132c');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      ctx.globalAlpha=.17;ctx.strokeStyle='#55dff2';for(let x=0;x<W;x+=28){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.globalAlpha=1;
      ctx.fillStyle='rgba(255,74,105,.13)';ctx.fillRect(0,0,W,H);
      ctx.save();ctx.beginPath();ctx.arc(W/2,H/2,safe,0,Math.PI*2);ctx.clip();ctx.fillStyle='rgba(36,170,137,.18)';ctx.fillRect(0,0,W,H);ctx.restore();
      ctx.beginPath();ctx.arc(W/2,H/2,safe,0,Math.PI*2);ctx.strokeStyle='#52edc3';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);
      items.forEach(it=>{ctx.save();ctx.shadowColor='#70f4dc';ctx.shadowBlur=16;ctx.fillStyle='#8fffe5';ctx.beginPath();ctx.moveTo(it.x,it.y-it.r);ctx.lineTo(it.x+it.r,it.y);ctx.lineTo(it.x,it.y+it.r);ctx.lineTo(it.x-it.r,it.y);ctx.closePath();ctx.fill();ctx.restore();});
      ctx.save();ctx.shadowColor='#68eaff';ctx.shadowBlur=20;ctx.fillStyle='#72eaff';ctx.beginPath();ctx.arc(player.x,player.y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#061b2b';ctx.beginPath();ctx.arc(player.x+3,player.y-2,2.3,0,Math.PI*2);ctx.fill();ctx.restore();
      if(!alive){ctx.fillStyle='#050914bb';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 28px system-ui';ctx.fillText(energy<=0?'انتهت الطاقة':'اكتمل تحدّي البقاء',W/2,H/2-6);ctx.font='15px system-ui';ctx.fillText('اضغط إعادة لبدء جولة جديدة',W/2,H/2+22);}
      $('#surv-score',stage).textContent=score+' / 12';$('#surv-energy',stage).textContent=Math.max(0,Math.round(energy))+'%';$('#surv-time',stage).textContent=Math.max(0,Math.ceil(60-elapsed));
    }
    function tick(now){if(!stage.isConnected)return;const dt=Math.min((now-last)/1000||0,.04);last=now;if(alive){elapsed+=dt;safe=Math.max(72,178-elapsed*1.65);let dx=0,dy=0;for(const k of keys){dx+=dirs[k][0];dy+=dirs[k][1];}const len=Math.hypot(dx,dy)||1;player.x=Math.max(12,Math.min(W-12,player.x+dx/len*165*dt));player.y=Math.max(12,Math.min(H-12,player.y+dy/len*165*dt));items=items.filter(it=>{if(Math.hypot(player.x-it.x,player.y-it.y)<18){score++;return false;}return true;});const dist=Math.hypot(player.x-W/2,player.y-H/2);if(dist>safe-8)energy-=dt*13;else energy=Math.min(100,energy+dt*2.2);if(energy<=0){alive=false;$('#surv-msg',stage).textContent='خرجت من المنطقة الآمنة لفترة طويلة.';}else if(score>=12&&elapsed>=20){alive=false;$('#surv-msg',stage).textContent='أحسنت! جمعت البلورات ونجحت في تحدي البقاء.';}else if(elapsed>=60){alive=false;$('#surv-msg',stage).textContent='انتهى الوقت. جمعت '+score+' من 12 بلورة.';}}draw();if(alive)raf=requestAnimationFrame(tick);}
    $('#surv-reset',stage).onclick=reset;gameCleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);};draw();raf=requestAnimationFrame(tick);
  }

  function gameSkyDash(){
    const width=760,height=280,ground=228;
    let raf=0,last=0,elapsed=0,score=0,best=0,alive=true,started=false,spawn=0;try{best=Number(localStorage.getItem('esko-sky-dash-best')||0)||0;}catch(_){}
    let player={x:112,y:ground-24,vy:0},obstacles=[];
    stage.innerHTML=gameHeader('ESKO Sky Dash','لعبة أصلية خفيفة: المس الشاشة أو زر القفز لتجاوز العوائق وجمع النقاط.')+`<div class="ev5-row"><div class="ev5-kpi">النقاط<strong id="skyScore">0</strong></div><div class="ev5-kpi">الأفضل<strong id="skyBest">${best}</strong></div><button class="ev5-btn" id="skyReset">إعادة</button></div><canvas class="ev5-canvas" id="skyCanvas" width="760" height="280" aria-label="ساحة لعبة Sky Dash"></canvas><div class="ev5-row" style="justify-content:center"><button class="ev5-btn primary" id="skyJump">قفز</button></div><p id="skyMessage" class="ev5-muted" aria-live="polite">اضغط قفز لبدء الجولة.</p>`;
    const canvas=$('#skyCanvas',stage),ctx=canvas.getContext('2d');
    if(!ctx){stage.innerHTML+='<p class="ev5-warning">الرسم غير مدعوم في هذا المتصفح.</p>';return;}
    const jump=()=>{if(!alive){reset();return;}if(player.y>=ground-25){player.vy=-505;started=true;$('#skyMessage',stage).textContent='استمر في تفادي العوائق!';}};
    function reset(){cancelAnimationFrame(raf);player={x:112,y:ground-24,vy:0};obstacles=[];elapsed=0;score=0;spawn=.8;alive=true;started=false;last=0;$('#skyMessage',stage).textContent='اضغط قفز لبدء الجولة.';draw();raf=requestAnimationFrame(tick);}
    function draw(){
      const g=ctx.createLinearGradient(0,0,0,height);g.addColorStop(0,'#111d42');g.addColorStop(1,'#071426');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
      ctx.globalAlpha=.6;for(let i=0;i<28;i++){const x=(i*97+(elapsed*13))%width,y=(i*47)%170;ctx.fillStyle=i%3?'#9feaff':'#d4c4ff';ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
      ctx.fillStyle='#142e43';ctx.fillRect(0,ground,width,height-ground);ctx.fillStyle='#50e9ff';ctx.fillRect(0,ground,width,3);
      ctx.fillStyle='#173b5b';for(let i=0;i<7;i++){const x=((i*143-(elapsed*75))%(width+160)+width+160)%(width+160)-70;ctx.beginPath();ctx.arc(x,ground+48,30,Math.PI,0);ctx.fill();}
      ctx.save();ctx.translate(player.x,player.y);ctx.shadowColor='#50e9ff';ctx.shadowBlur=18;ctx.fillStyle='#70eeff';ctx.beginPath();ctx.arc(0,-8,17,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#0a2439';ctx.beginPath();ctx.arc(7,-9,3,0,Math.PI*2);ctx.fill();ctx.restore();
      obstacles.forEach(o=>{ctx.save();ctx.translate(o.x,ground);ctx.shadowColor='#bc8aff';ctx.shadowBlur=13;ctx.fillStyle='#9b79ee';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(o.w/2,-o.h);ctx.lineTo(o.w,-0);ctx.closePath();ctx.fill();ctx.restore();});
      if(!alive){ctx.fillStyle='#050b18bb';ctx.fillRect(0,0,width,height);ctx.fillStyle='#fff';ctx.font='bold 34px system-ui';ctx.textAlign='center';ctx.fillText('انتهت الجولة',width/2,height/2-10);ctx.font='18px system-ui';ctx.fillText('اضغط إعادة أو المس الشاشة للمحاولة من جديد',width/2,height/2+25);}
      $('#skyScore',stage).textContent=Math.floor(score);$('#skyBest',stage).textContent=best;
    }
    function tick(now){
      if(!stage.isConnected)return;
      const dt=Math.min((now-last)/1000||0,.032);last=now;elapsed+=dt;
      if(alive&&started){
        score+=dt*10;player.vy+=1320*dt;player.y=Math.min(ground-24,player.y+player.vy*dt);if(player.y>=ground-24)player.vy=0;
        spawn-=dt;if(spawn<=0){obstacles.push({x:width+24,w:24+Math.random()*14,h:28+Math.random()*27});spawn=1.05+Math.random()*.55;}
        const speed=270+Math.min(score*1.2,180);obstacles.forEach(o=>o.x-=speed*dt);obstacles=obstacles.filter(o=>o.x+o.w>0);
        if(obstacles.some(o=>o.x<player.x+13&&o.x+o.w>player.x-13&&player.y+13>ground-o.h)){
          alive=false;best=Math.max(best,Math.floor(score));try{localStorage.setItem('esko-sky-dash-best',String(best));}catch(_){}$('#skyMessage',stage).textContent='انتهت الجولة. اضغط إعادة أو المس الساحة للمحاولة.';
        }
      }
      draw();raf=requestAnimationFrame(tick);
    }
    const onKey=e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump();}};
    canvas.addEventListener('pointerdown',jump);$('#skyJump',stage).addEventListener('click',jump);$('#skyReset',stage).addEventListener('click',reset);window.addEventListener('keydown',onKey);
    gameCleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',onKey);canvas.removeEventListener('pointerdown',jump);};
    draw();raf=requestAnimationFrame(tick);
  }

  function game2048(){
    let b=Array(16).fill(0),score=0,done=false; const spawn=()=>{const e=b.map((v,i)=>v? -1:i).filter(i=>i>=0);if(e.length)b[e[rand(e.length)]]=Math.random()<.9?2:4;};spawn();spawn();
    stage.innerHTML=gameHeader('2048','استخدم الأسهم أو الأزرار لتحريك البلاطات ودمج الأرقام المتشابهة.')+`<div class="ev5-row"><div class="ev5-kpi">النقاط<strong id="ev5-score">0</strong></div><button class="ev5-btn" id="ev5-reset">إعادة</button></div><div class="ev5-board" id="ev5-2048" style="grid-template-columns:repeat(4,1fr)"></div><div class="ev5-row" style="justify-content:center"><button class="ev5-btn" data-dir="up">↑</button></div><div class="ev5-row" style="justify-content:center"><button class="ev5-btn" data-dir="left">←</button><button class="ev5-btn" data-dir="down">↓</button><button class="ev5-btn" data-dir="right">→</button></div><p id="ev5-msg" class="ev5-muted"></p>`;
    const draw=()=>{$('#ev5-2048',stage).innerHTML=b.map(v=>`<div class="ev5-cell" style="background:${v?'#'+({2:'26314a',4:'314968',8:'73502e',16:'875032',32:'a64c3c',64:'b43b51',128:'7253a8',256:'6949b7',512:'5b3eab',1024:'3e5ba6',2048:'176d74'}[v]||'30506c'):'#15192b'}">${v||''}</div>`).join('');$('#ev5-score',stage).textContent=score;};
    const move=dir=>{if(done)return;let changed=false;for(let line=0;line<4;line++){let ids=[];for(let k=0;k<4;k++){let r=dir==='up'?k:dir==='down'?3-k:line;let c=dir==='left'?k:dir==='right'?3-k:line;ids.push(r*4+c);}let vals=ids.map(i=>b[i]).filter(Boolean);for(let j=0;j<vals.length-1;j++)if(vals[j]===vals[j+1]){vals[j]*=2;score+=vals[j];vals.splice(j+1,1);}while(vals.length<4)vals.push(0);ids.forEach((i,j)=>{if(b[i]!==vals[j])changed=true;b[i]=vals[j];});}if(changed){spawn();draw();if(b.includes(2048)){done=true;$('#ev5-msg',stage).textContent='ممتاز! وصلت إلى 2048.';}else if(!canMove()){done=true;$('#ev5-msg',stage).textContent='انتهت الحركات. أعد اللعبة للمحاولة.';}}};
    const canMove=()=>{for(let r=0;r<4;r++)for(let c=0;c<4;c++){let i=r*4+c;if(!b[i]||(c<3&&b[i]===b[i+1])||(r<3&&b[i]===b[i+4]))return true;}return false;};
    stage.querySelectorAll('[data-dir]').forEach(x=>x.addEventListener('click',()=>move(x.dataset.dir)));const swipeBoard=$('#ev5-2048',stage);let sx=0,sy=0;swipeBoard.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;});swipeBoard.addEventListener('pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));});const key=e=>{const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(d&&stage.isConnected){e.preventDefault();move(d);}};window.addEventListener('keydown',key);gameCleanup=()=>window.removeEventListener('keydown',key);$('#ev5-reset',stage).onclick=()=>{b=Array(16).fill(0);score=0;done=false;spawn();spawn();draw();$('#ev5-msg',stage).textContent='';};draw();
  }
  function gameSnake(){
    let body=[{x:5,y:5},{x:4,y:5},{x:3,y:5}],dir={x:1,y:0},next=dir,food={x:8,y:5},score=0,over=false;const n=12;
    stage.innerHTML=gameHeader('Snake','تحكم بالأسهم أو أزرار اللمس. لا تصطدم بالحواف أو بجسم الثعبان.')+`<div class="ev5-row"><div class="ev5-kpi">النقاط<strong id="ev5-s-score">0</strong></div><button class="ev5-btn" id="ev5-s-reset">إعادة</button></div><div class="ev5-board" id="ev5-s-board" style="grid-template-columns:repeat(12,1fr)"></div><div class="ev5-row" style="justify-content:center"><button class="ev5-btn" data-sdir="0,-1">↑</button></div><div class="ev5-row" style="justify-content:center"><button class="ev5-btn" data-sdir="-1,0">←</button><button class="ev5-btn" data-sdir="0,1">↓</button><button class="ev5-btn" data-sdir="1,0">→</button></div><p id="ev5-s-msg" class="ev5-muted"></p>`;
    const same=(a,b)=>a.x===b.x&&a.y===b.y;const draw=()=>{$('#ev5-s-board',stage).innerHTML=Array.from({length:n*n},(_,i)=>{let p={x:i%n,y:Math.floor(i/n)};return `<div class="ev5-cell" style="font-size:12px;background:${body.some(x=>same(x,p))?'#2f9d83':same(food,p)?'#cb6b42':'#15192b'}">${same(food,p)?'●':''}</div>`;}).join('');$('#ev5-s-score',stage).textContent=score;};
    const tick=()=>{if(over)return;dir=next;let h={x:body[0].x+dir.x,y:body[0].y+dir.y};if(h.x<0||h.y<0||h.x>=n||h.y>=n||body.some(p=>same(p,h))){over=true;$('#ev5-s-msg',stage).textContent='انتهت الجولة. اضغط إعادة للمحاولة.';clearInterval(gameTimer);return;}body.unshift(h);if(same(h,food)){score++;do{food={x:rand(n),y:rand(n)}}while(body.some(p=>same(p,food)));}else body.pop();draw();};
    const setDir=d=>{const [x,y]=d.split(',').map(Number);if(x!==-dir.x||y!==-dir.y)next={x,y};};stage.querySelectorAll('[data-sdir]').forEach(x=>x.onclick=()=>setDir(x.dataset.sdir));const key=e=>{const m={ArrowUp:'0,-1',ArrowDown:'0,1',ArrowLeft:'-1,0',ArrowRight:'1,0'};if(m[e.key]){e.preventDefault();setDir(m[e.key]);}};window.addEventListener('keydown',key);gameCleanup=()=>window.removeEventListener('keydown',key);$('#ev5-s-reset',stage).onclick=()=>{stopGame();gameSnake();};draw();gameTimer=setInterval(tick,170);
  }
  function gameMines(){
    const n=8,total=10;let mines=new Set(),open=new Set(),flags=new Set(),lost=false,won=false,flagMode=false;const make=()=>{mines=new Set();open=new Set();flags=new Set();lost=false;won=false;while(mines.size<total){let i=rand(n*n);mines.add(i);}draw();};
    stage.innerHTML=gameHeader('Minesweeper','افتح الخانات وتجنب الألغام. فعّل وضع العلم قبل الضغط على خانة لوضع علامة.')+`<div class="ev5-row"><button class="ev5-btn" id="ev5-m-flag">وضع العلم: متوقف</button><button class="ev5-btn" id="ev5-m-reset">إعادة</button><span id="ev5-m-msg" class="ev5-muted"></span></div><div class="ev5-board" id="ev5-m-board" style="grid-template-columns:repeat(8,1fr)"></div>`;
    const neighbors=i=>{let r=Math.floor(i/n),c=i%n,a=[];for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++){let R=r+y,C=c+x;if(R>=0&&R<n&&C>=0&&C<n&&(x||y))a.push(R*n+C);}return a;};const count=i=>neighbors(i).filter(x=>mines.has(x)).length;
    const reveal=i=>{if(open.has(i)||flags.has(i)||lost||won)return;if(mines.has(i)){lost=true;$('#ev5-m-msg',stage).textContent='انتهت الجولة؛ حاول مرة أخرى.';mines.forEach(x=>open.add(x));draw();return;}open.add(i);if(count(i)===0)neighbors(i).forEach(x=>{if(!mines.has(x))reveal(x);});if(open.size===n*n-total){won=true;$('#ev5-m-msg',stage).textContent='أحسنت! أنهيت اللوحة.';}draw();};
    function draw(){const b=$('#ev5-m-board',stage);if(!b)return;b.innerHTML=Array.from({length:n*n},(_,i)=>`<button type="button" class="ev5-cell ${open.has(i)?'open':''} ${flags.has(i)?'flag':''}" data-mi="${i}" ${open.has(i)||lost||won?'disabled':''}>${flags.has(i)?'⚑':open.has(i)?(mines.has(i)?'✹':count(i)||''):' '}</button>`).join('');b.querySelectorAll('[data-mi]').forEach(x=>x.onclick=()=>{let i=+x.dataset.mi;if(flagMode){if(!open.has(i)){if(flags.has(i))flags.delete(i);else flags.add(i);draw();}}else reveal(i);});}
    $('#ev5-m-flag',stage).onclick=()=>{flagMode=!flagMode;$('#ev5-m-flag',stage).textContent='وضع العلم: '+(flagMode?'مفعل':'متوقف');};$('#ev5-m-reset',stage).onclick=make;make();
  }
  function gameTtt(){
    let b=Array(9).fill(''),done=false;stage.innerHTML=gameHeader('Tic Tac Toe','أنت X والخصم O. العب بالتناوب على لوحة 3×3.')+`<div class="ev5-board" id="ev5-ttt" style="grid-template-columns:repeat(3,1fr);max-width:300px"></div><div class="ev5-row"><button class="ev5-btn" id="ev5-ttt-reset">إعادة</button><span id="ev5-ttt-msg" class="ev5-muted">دورك الآن.</span></div>`;
    const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];const win=p=>wins.some(a=>a.every(i=>b[i]===p));const draw=()=>{$('#ev5-ttt',stage).innerHTML=b.map((x,i)=>`<button class="ev5-cell" data-tt="${i}">${x}</button>`).join('');$('#ev5-ttt',stage).querySelectorAll('[data-tt]').forEach(x=>x.onclick=()=>play(+x.dataset.tt));};function finish(){if(win('X')){done=true;$('#ev5-ttt-msg',stage).textContent='فزت بالجولة!';}else if(win('O')){done=true;$('#ev5-ttt-msg',stage).textContent='فاز الخصم. حاول مجددًا.';}else if(b.every(Boolean)){done=true;$('#ev5-ttt-msg',stage).textContent='تعادل.';}}
    function play(i){if(done||b[i])return;b[i]='X';finish();draw();if(done)return;const opts=b.map((v,j)=>v? -1:j).filter(j=>j>=0);let move=opts.find(i=>{b[i]='O';let w=win('O');b[i]='';return w;});if(move===undefined)move=opts.find(i=>{b[i]='X';let w=win('X');b[i]='';return w;});if(move===undefined)move=opts[rand(opts.length)];if(move!==undefined)b[move]='O';finish();draw();}
    $('#ev5-ttt-reset',stage).onclick=()=>{b=Array(9).fill('');done=false;$('#ev5-ttt-msg',stage).textContent='دورك الآن.';draw();};draw();
  }
  function gameMemory(){
    const symbols=shuffle(['◆','●','▲','★','☾','✦','⬟','♥'].flatMap(x=>[x,x]));let open=[],matched=new Set(),lock=false,moves=0;stage.innerHTML=gameHeader('Memory Match','افتح بطاقتين في كل مرة وابحث عن الأزواج المتطابقة.')+`<div class="ev5-row"><div class="ev5-kpi">المحاولات<strong id="ev5-mm-moves">0</strong></div><button class="ev5-btn" id="ev5-mm-reset">إعادة</button></div><div class="ev5-board" id="ev5-mm-board" style="grid-template-columns:repeat(4,1fr)"></div><p id="ev5-mm-msg" class="ev5-muted"></p>`;const draw=()=>{$('#ev5-mm-board',stage).innerHTML=symbols.map((v,i)=>`<button class="ev5-cell" data-mm="${i}">${matched.has(i)||open.includes(i)?v:'?'}</button>`).join('');$('#ev5-mm-moves',stage).textContent=moves;$('#ev5-mm-board',stage).querySelectorAll('[data-mm]').forEach(x=>x.onclick=()=>flip(+x.dataset.mm));};function flip(i){if(lock||matched.has(i)||open.includes(i))return;open.push(i);draw();if(open.length===2){moves++;if(symbols[open[0]]===symbols[open[1]]){open.forEach(x=>matched.add(x));open=[];draw();if(matched.size===16)$('#ev5-mm-msg',stage).textContent='أكملت جميع الأزواج!';}else{lock=true;gameTimer=setTimeout(()=>{open=[];lock=false;gameTimer=null;draw();},700);}}}$('#ev5-mm-reset',stage).onclick=()=>{stopGame();gameMemory();};draw();
  }
  function gameReversi(){
    const n=8;let b=Array(64).fill(0),turn=1,done=false;b[27]=-1;b[28]=1;b[35]=1;b[36]=-1;stage.innerHTML=gameHeader('Reversi','أنت الأزرق، والخصم الأبيض. ضع حجرًا يحاصر أحجار الخصم بين حجرين.')+`<div class="ev5-row"><span id="ev5-r-msg" class="ev5-muted">دورك.</span><button class="ev5-btn" id="ev5-r-reset">إعادة</button></div><div class="ev5-board" id="ev5-r-board" style="grid-template-columns:repeat(8,1fr)"></div>`;
    const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];function captures(i,p){let r=i>>3,c=i&7,all=[];for(const [dr,dc] of dirs){let rr=r+dr,cc=c+dc,line=[];while(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===-p){line.push(rr*8+cc);rr+=dr;cc+=dc;}if(line.length&&rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===p)all.push(...line);}return all;}function moves(p){return b.map((v,i)=>!v&&captures(i,p).length?i:-1).filter(i=>i>=0);}function place(i,p){let c=captures(i,p);if(!c.length)return false;b[i]=p;c.forEach(x=>b[x]=p);return true;}function draw(){let ms=moves(turn);$('#ev5-r-board',stage).innerHTML=b.map((v,i)=>`<button class="ev5-cell" data-r="${i}" style="background:${v===1?'#246c92':v===-1?'#d5d9df':ms.includes(i)?'#1f674f':'#17332e'};border-radius:50%">${v===1?'●':v===-1?'○':ms.includes(i)?'·':''}</button>`).join('');$('#ev5-r-board',stage).querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>play(+x.dataset.r));}function finish(){done=true;let a=b.filter(x=>x===1).length,c=b.filter(x=>x===-1).length;$('#ev5-r-msg',stage).textContent=`انتهت الجولة: أنت ${a} — الخصم ${c}.`;}
    function play(i){if(done||!place(i,turn))return;turn=-turn;let ms=moves(turn);if(!ms.length){turn=-turn;if(!moves(turn).length){finish();draw();return;}}draw();if(turn===-1&&!done){gameTimer=setTimeout(()=>{let opts=moves(-1);if(opts.length)place(opts[rand(opts.length)],-1);turn=1;if(!moves(1).length){turn=-1;if(!moves(-1).length)finish();else $('#ev5-r-msg',stage).textContent='لا توجد حركة لك؛ انتقل الدور إلى الخصم.';}draw();gameTimer=null;},450);}}
    $('#ev5-r-reset',stage).onclick=()=>{stopGame();gameReversi();};draw();
  }
  function gameWordSearch(){
    const words=['CODE','ESKO','WEB','MATH','GRID'];const n=8;let grid=Array.from({length:n},()=>Array.from({length:n},()=>String.fromCharCode(65+rand(26))));const placements=[];words.forEach((w,k)=>{let r=k,c=rand(n-w.length);for(let j=0;j<w.length;j++)grid[r][c+j]=w[j];placements.push(w);});let selected='';stage.innerHTML=gameHeader('Word Search','ابحث عن الكلمات الإنجليزية الظاهرة ثم اضغط أحرفها بالترتيب الأفقي.')+`<p class="ev5-muted">الكلمات: ${words.join(' · ')}</p><div class="ev5-board" id="ev5-ws-board" style="grid-template-columns:repeat(8,1fr)"></div><p id="ev5-ws-selected" class="ev5-muted"></p><button class="ev5-btn" id="ev5-ws-clear">مسح التحديد</button>`;$('#ev5-ws-board',stage).innerHTML=grid.flat().map((v,i)=>`<button class="ev5-cell" data-ws="${i}">${v}</button>`).join('');$('#ev5-ws-board',stage).querySelectorAll('[data-ws]').forEach(x=>x.onclick=()=>{selected+=x.textContent;$('#ev5-ws-selected',stage).textContent='التحديد: '+selected;if(words.includes(selected)){$('#ev5-ws-selected',stage).textContent='أحسنت! وجدت '+selected;selected='';}});$('#ev5-ws-clear',stage).onclick=()=>{selected='';$('#ev5-ws-selected',stage).textContent='';};
  }


  function gameSudoku(){
    const puzzle='530070000600195000098000060800060003400803001700020006060000280000419005000080079'.split('').map(Number);
    const solution='534678912672195348198342567859761423426853791713924856961537284287419635345286179'.split('').map(Number);
    let values=puzzle.slice(),selected=-1,done=false;
    stage.innerHTML=gameHeader('Sudoku','اختر خانة فارغة ثم الرقم المناسب. اضغط تحقق لمراجعة الحل.')+`<div class="ev5-board" id="ev5-su-board" style="grid-template-columns:repeat(9,1fr);max-width:420px"></div><div class="ev5-row" style="justify-content:center;flex-wrap:wrap">${Array.from({length:9},(_,i)=>`<button class="ev5-btn" data-su-num="${i+1}">${i+1}</button>`).join('')}<button class="ev5-btn" id="ev5-su-erase">مسح</button><button class="ev5-btn primary" id="ev5-su-check">تحقق</button><button class="ev5-btn" id="ev5-su-reset">إعادة</button></div><p id="ev5-su-msg" class="ev5-muted"></p>`;
    function draw(){const b=$('#ev5-su-board',stage);b.innerHTML=values.map((v,i)=>`<button class="ev5-cell" data-su-cell="${i}" style="border-radius:4px;border-width:${(i%9===2||i%9===5?'2px':'1px')} ${(Math.floor(i/9)===2||Math.floor(i/9)===5?'2px':'1px')} ${i%9===0?'2px':'1px'} 1px;background:${selected===i?'#31516d':puzzle[i]?'#202942':'#11182a'};color:${puzzle[i]?'#b3d8ff':'#fff'}">${v||''}</button>`).join('');b.querySelectorAll('[data-su-cell]').forEach(x=>x.onclick=()=>{let i=+x.dataset.suCell;if(!puzzle[i]){selected=i;draw();}});}
    function put(n){if(selected<0||done)return;values[selected]=n;draw();}
    stage.querySelectorAll('[data-su-num]').forEach(x=>x.onclick=()=>put(+x.dataset.suNum));$('#ev5-su-erase',stage).onclick=()=>put(0);$('#ev5-su-reset',stage).onclick=()=>{values=puzzle.slice();selected=-1;done=false;$('#ev5-su-msg',stage).textContent='';draw();};$('#ev5-su-check',stage).onclick=()=>{const ok=values.every((v,i)=>v===solution[i]);const filled=values.every(Boolean);$('#ev5-su-msg',stage).textContent=ok?'أحسنت! حللت السودوكو.':filled?'هناك خانات تحتاج مراجعة.':'أكمل الخانات الفارغة أولًا.';done=ok;};draw();
  }
  function gameTetris(){
    const W=10,H=18,shapes=[[[1,0],[1,1],[1,2],[1,3]],[[0,0],[1,0],[1,1],[1,2]],[[0,2],[1,0],[1,1],[1,2]],[[0,0],[0,1],[1,0],[1,1]],[[0,1],[0,2],[1,0],[1,1]],[[0,1],[1,0],[1,1],[1,2]],[[0,0],[0,1],[1,1],[1,2]]];let board=Array.from({length:H},()=>Array(W).fill(0)),piece=null,score=0,over=false;
    stage.innerHTML=gameHeader('Tetris','حرّك القطع يمينًا ويسارًا ودوّرها لتكوين صفوف كاملة.')+`<div class="ev5-row"><div class="ev5-kpi">النقاط<strong id="ev5-te-score">0</strong></div><button class="ev5-btn" id="ev5-te-reset">إعادة</button></div><div class="ev5-board" id="ev5-te-board" style="grid-template-columns:repeat(10,1fr);max-width:320px"></div><div class="ev5-row" style="justify-content:center"><button class="ev5-btn" data-te="left">←</button><button class="ev5-btn" data-te="rotate">↻ تدوير</button><button class="ev5-btn" data-te="right">→</button><button class="ev5-btn" data-te="down">↓</button></div><p id="ev5-te-msg" class="ev5-muted"></p>`;
    function spawn(){const s=shapes[rand(shapes.length)];piece={cells:s.map(([y,x])=>[y,x+3]),color:1};if(!valid(piece.cells)){over=true;$('#ev5-te-msg',stage).textContent='انتهت الجولة. اضغط إعادة.';clearInterval(gameTimer);}}
    function valid(cells){return cells.every(([y,x])=>y>=0&&y<H&&x>=0&&x<W&&!board[y][x]);}
    function draw(){const b=$('#ev5-te-board',stage);if(!b)return;let cur=new Set((piece?.cells||[]).map(([y,x])=>y*W+x));b.innerHTML=Array.from({length:W*H},(_,i)=>`<div class="ev5-cell" style="aspect-ratio:1;border-radius:3px;background:${cur.has(i)?'#50b9cf':board[Math.floor(i/W)][i%W]?'#7852a8':'#15192b'}"></div>`).join('');$('#ev5-te-score',stage).textContent=score;}
    function lock(){piece.cells.forEach(([y,x])=>board[y][x]=1);let kept=board.filter(row=>row.some(v=>!v));let cleared=H-kept.length;if(cleared){score+=cleared*cleared*100;while(kept.length<H)kept.unshift(Array(W).fill(0));board=kept;}spawn();draw();}
    function drop(){if(over)return;const c=piece.cells.map(([y,x])=>[y+1,x]);if(valid(c)){piece.cells=c;draw();}else lock();}
    function act(a){if(over)return;if(a==='left'||a==='right'){let dx=a==='left'?-1:1,c=piece.cells.map(([y,x])=>[y,x+dx]);if(valid(c))piece.cells=c;}else if(a==='down'){drop();return;}else if(a==='rotate'){let pivot=piece.cells[1],c=piece.cells.map(([y,x])=>{let dy=y-pivot[0],dx=x-pivot[1];return [pivot[0]+dx,pivot[1]-dy];});if(valid(c))piece.cells=c;}draw();}
    const key=e=>{const a={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'rotate'}[e.key];if(a){e.preventDefault();act(a);}};window.addEventListener('keydown',key);gameCleanup=()=>window.removeEventListener('keydown',key);stage.querySelectorAll('[data-te]').forEach(x=>x.onclick=()=>act(x.dataset.te));$('#ev5-te-reset',stage).onclick=()=>{stopGame();gameTetris();};spawn();draw();gameTimer=setInterval(drop,550);
  }
  function gameFlappy(){
    let y=190,vy=0,pipeX=410,gap=145,score=0,over=false;const W=360,H=420;stage.innerHTML=gameHeader('Flappy Challenge','اضغط على مساحة اللعب أو زر القفز لتجاوز الحواجز.')+`<canvas id="ev5-flappy" class="ev5-canvas" width="360" height="420" aria-label="منطقة لعبة الطيران"></canvas><div class="ev5-row" style="justify-content:center"><button class="ev5-btn primary" id="ev5-flap">اقفز</button><button class="ev5-btn" id="ev5-flap-reset">إعادة</button><span id="ev5-flap-score" class="ev5-muted">النقاط: 0</span></div><p id="ev5-flap-msg" class="ev5-muted"></p>`;const c=$('#ev5-flappy',stage),ctx=c.getContext('2d');
    function paint(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#101a32';ctx.fillRect(0,0,W,H);ctx.fillStyle='#50e9ff';ctx.beginPath();ctx.arc(82,y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#20c879';ctx.fillRect(pipeX,0,44,gap);ctx.fillRect(pipeX,gap+125,44,H-gap-125);ctx.fillStyle='#fff';ctx.font='16px system-ui';ctx.fillText('Score '+score,12,24);}
    function flap(){if(over)return;vy=-7.5;}function tick(){if(over)return;vy+=.42;y+=vy;pipeX-=3.1;if(pipeX<35&&pipeX>25)score++;if(pipeX<-48){pipeX=W+10;gap=70+rand(120);}if(y<10||y>H-10||(82+13>pipeX&&82-13<pipeX+44&&(y-13<gap||y+13>gap+125))){over=true;clearInterval(gameTimer);$('#ev5-flap-msg',stage).textContent='انتهت الجولة؛ اضغط إعادة للمحاولة.';}$('#ev5-flap-score',stage).textContent='النقاط: '+score;paint();}
    $('#ev5-flap',stage).onclick=flap;c.onclick=flap;const key=e=>{if(e.code==='Space'){e.preventDefault();flap();}};window.addEventListener('keydown',key);gameCleanup=()=>window.removeEventListener('keydown',key);$('#ev5-flap-reset',stage).onclick=()=>{stopGame();gameFlappy();};paint();gameTimer=setInterval(tick,30);
  }

  function loadLibraryFile(path){const loader=window.ESKOPerformanceCore?.cachedJSON;return loader?loader(path):fetch(path,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});}
  async function loadToolLibrary(){
    try{const raw=await loadLibraryFile(new URL('v5/tools.json',document.baseURI));TOOLS=Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,Array.isArray(value)?value:(value.items||[])]));renderToolGroups();renderTools();}
    catch(error){$('#ev5-tool-count',root).textContent='تعذر تحميل ملف المكتبة: '+error.message;$('#ev5-tool-grid',root).innerHTML='<p class="ev5-warning">لم يتم تحميل tools.json. راجع مسار الملف في النشر.</p>';}
  }
  async function loadBotTemplates(){try{botTemplates=await loadLibraryFile(new URL('v5/bot-templates.json',document.baseURI));}catch(error){$('#ev5-copy-status',root).textContent='تعذر تحميل قوالب الأكواد: '+error.message;}}
  function showSupportForBot(bot){
    const message='✍🏻لقد واجهتني مشكله\nفي هيكل هذا البوت\n♕معلومات البوت\nالاسم: '+bot.name+'\nالمعرّف: '+bot.id+'\nالقسم: '+bot.group+'\nالوصف: '+bot.desc+'\nاتمني من المطور حل المشكله واشكر فريق الدعم\nمعا تحياتي';
    if(window.ESKORandomSupport?.open)window.ESKORandomSupport.open(message);else location.href='https://wa.me/963993825873?text='+encodeURIComponent(message);
  }
  async function renderBotBuilder(bot){
    if(!bot)return;
    if(!Object.keys(botTemplates).length)await loadBotTemplates();
    selectedBot=bot;selectedBotFile='README.md';
    $('#ev5-builder-title',root).textContent=getBotIcon(bot)+' '+bot.name;
    $('#ev5-builder-summary',root).textContent=bot.desc+' · '+bot.group+(bot.task?' · المهمة: '+bot.task:'');
    $('#ev5-bot-action-cards',root).innerHTML=
      `<article class="ev5-card ev5-green-card"><h3>🟩 قناة المطور</h3><p>آخر أخبار وتحديثات ESKO.</p><a class="ev5-green-link" href="${CHANNEL}" target="_blank" rel="noopener">فتح القناة</a></article>`+
      `<article class="ev5-card ev5-green-card"><h3>🟩 وصف البوت</h3><p>عرض وصف ووظيفة القالب.</p><button class="ev5-btn primary" data-bot-action="description">عرض الوصف</button></article>`+
      `<article class="ev5-card ev5-green-card"><h3>🟩 زر الدعم</h3><p>إرسال بلاغ جاهز بمعلومات هذا البوت.</p><button class="ev5-btn primary" data-bot-action="support">فتح شات الدعم</button></article>`+
      `<article class="ev5-card ev5-green-card"><h3>🟩 كيفية الاستخدام</h3><p>خطوات التثبيت والاتصال الآمن.</p><button class="ev5-btn primary" data-bot-action="usage">عرض الاستخدام</button></article>`;
    $('#ev5-bot-info',root).hidden=true;
    $('#ev5-bot-action-cards',root).querySelectorAll('[data-bot-action]').forEach(button=>button.onclick=()=>{
      const panel=$('#ev5-bot-info',root);panel.hidden=false;
      if(button.dataset.botAction==='support'){showSupportForBot(bot);return;}
      if(button.dataset.botAction==='description')panel.innerHTML=`<h3>${esc(bot.name)}</h3><p>${esc(bot.desc)}</p><p>القسم: ${esc(bot.group)}</p><p>هذا القالب نقطة بداية قابلة للتخصيص؛ ربط المنصة والذكاء الاصطناعي يتطلب إعدادًا رسميًا على الخادم.</p>`;
      if(button.dataset.botAction==='usage')panel.innerHTML='<h3>كيفية الاستخدام</h3><ol><li>انسخ الملفات واحدًا واحدًا.</li><li>أنشئ مشروع Node.js 20+ على خادم HTTPS.</li><li>انسخ .env.example إلى .env وأدخل بيانات المنصة الرسمية على الخادم فقط.</li><li>اضبط Webhook الرسمي واختبر برسالة واردة بموافقة صاحبها.</li><li>فعّل مزود الذكاء الاصطناعي اختياريًا بعد مراجعة سياسة الخصوصية.</li></ol>';
    });
    renderBotFileTabs();selectBotFile('README.md');go('bot-builder');
  }
  function renderBotFileTabs(){const holder=$('#ev5-bot-file-tabs',root);holder.innerHTML=BOT_FILE_LABELS.map(([path,label])=>`<button type="button" class="ev5-btn ${path===selectedBotFile?'primary':''}" data-bot-file="${esc(path)}">${esc(label)}</button>`).join('');holder.querySelectorAll('[data-bot-file]').forEach(button=>button.onclick=()=>selectBotFile(button.dataset.botFile));}
  function selectBotFile(path){
    if(!selectedBot)return;selectedBotFile=path;renderBotFileTabs();const details=$('#ev5-bot-code',root).closest('details');if(details)details.open=false;const template=botTemplates[path];
    if(!template){$('#ev5-bot-code',root).textContent='ملف القالب غير متاح. أعد تحميل الصفحة أو تحقق من bot-templates.json.';return;}
    const behavior=selectedBot.behavior||{};const replacements={BOT_NAME:selectedBot.name,BOT_DESC:selectedBot.desc,BOT_ID:String(selectedBot.id),BOT_GROUP:selectedBot.group,BOT_DESC_JSON:JSON.stringify(selectedBot.desc||''),BOT_GROUP_JSON:JSON.stringify(selectedBot.group||''),BOT_TASK_JSON:JSON.stringify(selectedBot.task||selectedBot.name||'مساعد عام'),BOT_KEYWORDS_JSON:JSON.stringify(behavior.keywords||[selectedBot.name,selectedBot.group].filter(Boolean)),BOT_PRIMARY_REPLY_JSON:JSON.stringify(behavior.primaryReply||('وصل طلبك إلى '+selectedBot.name+'. راجع التفاصيل قبل أي إجراء.')),BOT_PLATFORMS_JSON:JSON.stringify(selectedBot.platforms||['WhatsApp Business Cloud API','Telegram Bot API','Discord API'])};let output=template;
    for(const [key,value] of Object.entries(replacements))output=output.replaceAll('{{'+key+'}}',value);
    $('#ev5-bot-file-name',root).textContent=path;$('#ev5-bot-code',root).textContent=output;$('#ev5-copy-status',root).textContent='الملف جاهز للنسخ. راجع الإعدادات قبل التشغيل.';
  }
  async function copySelectedBotFile(){const text=$('#ev5-bot-code',root).textContent;try{await navigator.clipboard.writeText(text);$('#ev5-copy-status',root).textContent='تم نسخ '+selectedBotFile+' إلى الحافظة.';showEagleEffect();}catch(_){const range=document.createRange();range.selectNodeContents($('#ev5-bot-code',root));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);$('#ev5-copy-status',root).textContent='حدد النص وانسخه يدويًا؛ المتصفح لم يسمح بالنسخ المباشر.';}}
  function renderPerformanceProcessors(){const grid=$('#ev5-bot-processors',root);if(!grid)return;grid.innerHTML=PERF_NAMES.map((name,index)=>`<span class="ev5-processor-chip"><b>${String(index+1).padStart(2,'0')}</b> ${esc(name)}</span>`).join('');const info=window.ESKOPerformanceCore?.diagnostics?.();$('#ev5-perf-summary',root).textContent=window.ESKOPerformance90?'90 دالة مساعدة موزعة على الموقع · '+(info?.cores||'؟')+' أنوية يعلنها المتصفح · لا يتم رفع بيانات الجهاز.':'ملف معالجات الأداء غير محمّل.';}

  function renderToolGroups(){
    const holder=$('#ev5-tool-groups',root);if(!holder)return;
    holder.innerHTML=Object.entries(TOOL_LABELS).map(([key,meta])=>`<button type="button" class="ev5-btn ${key===selectedToolGroup?'primary':''}" data-tool-group="${key}">${meta.icon} ${esc(meta.label)} (${(TOOLS[key]||[]).length})</button>`).join('');
    holder.querySelectorAll('[data-tool-group]').forEach(b=>b.addEventListener('click',()=>{selectedToolGroup=b.dataset.toolGroup;renderToolGroups();renderTools();}));
  }
  function renderTools(){
    const group=selectedToolGroup;const q=($('#ev5-tool-filter',root).value||'').trim().toLowerCase();
    const arr=(TOOLS[group]||[]).filter(x=>x.toLowerCase().includes(q));
    if(!Object.keys(TOOLS).length){$('#ev5-tool-grid',root).innerHTML='<p class="ev5-muted">جارٍ تحميل مكتبة الأدوات...</p>';return;}
    $('#ev5-tool-grid',root).innerHTML=arr.map(x=>card(x,TOOL_LABELS[group].label+' · بطاقة تعريف في الكتالوج',TOOL_LABELS[group].icon,`<button class="ev5-btn" data-tool="${esc(x)}">التفاصيل</button>`,'كتالوج · ليست أداة تنفيذية')).join('')||'<p class="ev5-muted">لا توجد نتيجة مطابقة في هذا القسم.</p>';
    $('#ev5-tool-count',root).textContent=`${arr.length} نتيجة في ${TOOL_LABELS[group].label} · إجمالي المكتبة ${Object.values(TOOLS).reduce((n,a)=>n+a.length,0)} بطاقة`;
    $('#ev5-tool-grid',root).querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{const d=$('#ev5-tool-detail',root);d.hidden=false;d.innerHTML=`<h3>${esc(b.dataset.tool)}</h3><p>هذه بطاقة مواصفات/تعريف ضمن كتالوج ESKO. ليست وظيفة برمجية منفذة بعد. لا تُفعّل بوصفها أداة حقيقية إلا بعد بناء محركها واختباره وإضافة صلاحياته وحدوده.</p><button class="ev5-btn" id="ev5-tool-copy">نسخ اسم البطاقة</button>`;$('#ev5-tool-copy',root).onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.tool);showEagleEffect();}catch(_){$('#ev5-tool-detail',root).textContent='تعذر النسخ المباشر؛ حدد اسم الأداة وانسخه يدويًا.';}};});
  }
  renderToolGroups();
  $('#ev5-tool-filter',root).addEventListener('input',(window.ESKOPerformanceCore?.debounce || (fn=>fn))(renderTools,140));

  function getBotIcon(bot){
    const name=String(bot?.name||'').toLowerCase();
    const task=String(bot?.task||'').toLowerCase();
    const group=String(bot?.group||bot?.category||'').toLowerCase();
    const detail=name+' '+task+' '+String(bot?.desc||'').toLowerCase();
    // Prefer the bot's actual job, then fall back to its category.
    const rules=[
      [/translator|translate|ترجم|ترجمة|لغة|language/,'🌐'],
      [/study|school|teacher|lesson|course|flashcard|quiz|تعليم|دراسة|مدرسة|درس|اختبار|مذاكرة/,'🎓'],
      [/support|helpdesk|ticket|customer|complaint|خدمة|دعم|عملاء|شكوى|تذكرة/,'🛟'],
      [/moder|guardian|anti.?spam|filter|report|ban|إشراف|حماية|إبلاغ|مكافحة|حظر/,'🛡️'],
      [/telegram|discord|whatsapp|webhook|messenger|رسائل|مراسلة|اتصال/,'📡'],
      [/calendar|reminder|schedule|planner|task|todo|تذكير|تقويم|جدول|مهام/,'🗓️'],
      [/analytics|report|dashboard|metric|data|database|تحليل|بيانات|تقرير|إحصاء/,'📊'],
      [/github|developer|code|test|deploy|release|api|برمجة|مطور|كود|نشر|اختبار/,'💻'],
      [/shop|store|cart|order|product|commerce|متجر|سلة|طلب|منتج|تجارة/,'🛒'],
      [/event|booking|reservation|appointment|حجز|فعالية|موعد|حضور/,'🎟️'],
      [/image|photo|video|audio|media|صورة|تصوير|فيديو|صوت|وسائط/,'🎬'],
      [/design|color|brand|logo|ui|ux|تصميم|هوية|شعار|واجهة/,'🎨'],
      [/file|backup|archive|document|upload|download|ملف|نسخ احتياطي|مستند|أرشيف/,'🗃️'],
      [/finance|invoice|billing|payment|budget|مال|فاتورة|دفع|ميزانية/,'💳'],
      [/news|rss|content|publish|writer|article|محتوى|نشر|مقال|أخبار/,'📰'],
      [/weather|climate|طقس|مناخ/,'🌦️'],
      [/map|location|route|navigation|خريطة|موقع|مسار|تنقل/,'🧭'],
      [/security|privacy|audit|secure|أمان|خصوصية|تدقيق|سلامة/,'🔐'],
      [/ai|assistant|summar|answer|knowledge|ذكاء|مساعد|تلخيص|إجابة|معرفة/,'🧠'],
      [/poll|vote|survey|تصويت|استطلاع/,'📮'],
      [/community|group|social|مجتمع|مجموعة|تواصل/,'👥']
    ];
    for(const [pattern,icon] of rules) if(pattern.test(detail)) return icon;
    if(/المساعدة والردود الذكية/.test(group))return '🧠';
    if(/خدمات المواقع/.test(group))return '🌐';
    if(/الإنتاجية والتنظيم|الإنتاجية والمهام/.test(group))return '🗂️';
    if(/التعليم والإنتاجية|التعليم والتدريب/.test(group))return '🎓';
    if(/خدمات الملفات والوسائط/.test(group))return '🗃️';
    if(/إدارة المجتمعات والمجموعات|إدارة المجتمعات/.test(group))return '👥';
    return '🤖';
  }

  function renderBots(){
    const q=($('#ev5-bot-filter',root).value||'').toLowerCase();const arr=BOTS.filter(x=>(x.name+' '+x.group+' '+x.desc).toLowerCase().includes(q));
    $('#ev5-bot-grid',root).innerHTML=arr.map(b=>card(String(b.id).padStart(2,'0')+' · '+b.name,b.desc,getBotIcon(b),`<button class="ev5-btn primary" data-bot="${b.id}">بناء ونسخ الهيكل</button>`,'ملفات قابلة للنسخ')).join('');
    $('#ev5-bot-grid',root).querySelectorAll('[data-bot]').forEach(btn=>btn.onclick=()=>{void renderBotBuilder(BOTS.find(x=>x.id===+btn.dataset.bot));});renderPerformanceProcessors();
  }
  $('#ev5-bot-filter',root).addEventListener('input',(window.ESKOPerformanceCore?.debounce || (fn=>fn))(renderBots,140));
  $('#ev5-builder-back',root).addEventListener('click',()=>go('bots'));
  $('#ev5-bot-copy',root).addEventListener('click',copySelectedBotFile);
  $('#ev5-chat-check',root).addEventListener('click',async()=>{try{const url=new URL(`${API_BASE}/health`,location.href);const r=await fetch(url.href,{credentials:url.origin===location.origin?'same-origin':'include',cache:'no-store',headers:{'Accept':'application/json'}});const data=await r.json().catch(()=>({}));$('#ev5-chat-state',root).textContent=r.ok&&data.ok?'الخادم متصل · الحسابات والمناقشات تستخدمان قاعدة الخدمة نفسها · انتهاء الرسائل بعد 7 ساعات.':(r.status===404&&/github\.io$/i.test(location.hostname)?'GitHub Pages لا يشغّل API؛ انشر خادم Node.js واضبط ESKO_API_BASE.':'الخادم لا يؤكد الجاهزية: HTTP '+r.status);}catch(e){$('#ev5-chat-state',root).textContent='تعذر الوصول إلى خادم API: '+e.message;}});
  $('#ev5-open-discussions',root).addEventListener('click',()=>{close();document.querySelector('[data-page=discussions]')?.click();});

  let cseLoaded=false;
  $('#ev5-search-form',root).addEventListener('submit',e=>{
    e.preventDefault();const q=$('#ev5-google-query',root).value.trim().toLowerCase();const out=$('#ev5-google-results',root);if(!q){out.textContent='اكتب كلمة للبحث أولًا.';return;}
    const results=[];
    for(const [key,arr] of Object.entries(TOOLS)) for(const name of arr) if(name.toLowerCase().includes(q)) results.push({type:'أداة',name,view:'tools',group:key});
    for(const game of GAMES) if((game.name+' '+game.category).toLowerCase().includes(q)) results.push({type:game.ready?'لعبة قابلة للتشغيل':'لعبة في الفهرس',name:game.name,view:'games'});
    for(const bot of BOTS) if((bot.name+' '+bot.group+' '+bot.desc).toLowerCase().includes(q)) results.push({type:'قالب بوت',name:bot.name,view:'bots',icon:getBotIcon(bot)});
    const safe=results.slice(0,60);out.innerHTML=safe.length?safe.map(x=>`<article class="ev5-card"><h3>${esc(x.name)}</h3><p>${esc(x.type)}</p><button class="ev5-btn" data-result-view="${esc(x.view)}" data-result-group="${esc(x.group||'')}">فتح القسم</button></article>`).join(''):`<p class="ev5-muted">لا توجد نتائج داخل فهرس ESKO. جرّب كلمة أخرى.</p>`;
    out.querySelectorAll('[data-result-view]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.resultGroup)selectedToolGroup=b.dataset.resultGroup;go(b.dataset.resultView);}));
    const help=$('#ev5-cx-help',root);help.textContent=`تم البحث في الفهرس المحلي: ${results.length} نتيجة قبل الحد المعروض.`;
  });
  $('#ev5-google-search',root).addEventListener('click',()=>{
    const cx=window.ESKO_GOOGLE_CX;const q=$('#ev5-google-query',root).value.trim();const out=$('#ev5-google-results',root);
    if(!q){out.textContent='اكتب عبارة البحث أولًا.';return;}if(!cx){$('#ev5-cx-help',root).textContent='البحث الداخلي يعمل. لتفعيل Google أنشئ Programmable Search Engine وضع CX في window.ESKO_GOOGLE_CX.';return;}
    out.innerHTML='<div class="gcse-search"></div>';if(!cseLoaded){const s=document.createElement('script');s.async=true;s.src='https://cse.google.com/cse.js?cx='+encodeURIComponent(cx);document.head.appendChild(s);cseLoaded=true;}
    window.__gcse=window.__gcse||{};const execute=()=>{try{window.google?.search?.cse?.element?.getElement('search')?.execute(q);}catch(_){out.textContent='تعذر تهيئة بحث Google؛ استخدم البحث الداخلي.';}};if(window.google?.search?.cse?.element)execute();else setTimeout(execute,1400);
  });
  $('#ev5-search-clear',root).addEventListener('click',()=>{$('#ev5-google-query',root).value='';$('#ev5-google-results',root).innerHTML='';});

  // ESKO site-scoped assistant. It searches only local catalog data and does not claim to be a remote LLM.
  const ESKO_OUT_OF_SCOPE = 'هذا خارج نطاق الموقع أو لم يتم إضافته في التحديثات، اتصل بقسم الدعم';
  const siteCorpus = () => [
    ...BOTS.map(x=>({type:'بوت',name:x.name,desc:x.desc,group:x.group})),
    ...GAMES.map(x=>({type:'لعبة',name:x.name,desc:x.category})),
    ...Object.entries(TOOLS).flatMap(([group,arr])=>arr.map(name=>({type:'أداة كتالوج',name,desc:TOOL_LABELS[group]?.label||group}))),
    {type:'قسم',name:'الدعم',desc:'الدعم عبر واتساب وأرقام فريق الدعم العشوائية'},
    {type:'قسم',name:'البحث',desc:'بحث داخل الفهرس وفتح نتائج Google في المتصفح'},
    {type:'قسم',name:'المتجر الإلكتروني',desc:'المتجر تحت التطوير حاليًا'}
  ];
  function siteMatches(query,limit=8){
    const terms=query.toLowerCase().split(/\s+/).filter(x=>x.length>1);
    return siteCorpus().map(item=>({...item,score:terms.reduce((n,t)=>n+((item.name+' '+item.desc+' '+item.group).toLowerCase().includes(t)?1:0),0)}))
      .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
  }
  $('#ev5-ai-answer',root).addEventListener('click',()=>{
    const q=$('#ev5-ai-question',root).value.trim(),out=$('#ev5-ai-answer-output',root);
    if(!q){out.textContent='اكتب سؤالًا عن الموقع أولًا.';return;}
    const matches=siteMatches(q,5);
    const siteTerms=/esko|الموقع|البوت|الأداة|الأدوات|اللعبة|الألعاب|الدعم|المتجر|البحث|الإصدار|القسم|تحديث|المقدمة|القفل|المساعد|الذكاء|النسخ|الأمان|الحساب|المناقشات|الواجهة/i.test(q);
    if(!siteTerms){out.textContent=ESKO_OUT_OF_SCOPE;return;}
    const automatic=findAutoReply(q);
    if(automatic){
      out.innerHTML='<h3>رد تلقائي من قاعدة ESKO · #'+automatic.id+'</h3><p>'+esc(automatic.response)+'</p><small>رد محلي محفوظ؛ ليس نموذجًا عالميًا.</small>';
      return;
    }
    if(!matches.length&&!siteTerms){out.textContent=ESKO_OUT_OF_SCOPE;return;}
    if(!matches.length){out.textContent='لم أجد معلومة مطابقة في فهرس الموقع. '+ESKO_OUT_OF_SCOPE;return;}
    out.innerHTML='<h3>نتائج من فهرس ESKO</h3>'+matches.map(x=>`<p><b>${esc(x.type)}: ${esc(x.name)}</b><br>${esc(x.desc||'')}</p>`).join('')+'<small>هذه إجابة بحث محلي وليست توليدًا من نموذج عالمي.</small>';
  });
  $('#ev5-ai-analyze',root).addEventListener('click',()=>{
    const text=$('#ev5-ai-transcript',root).value.trim(),out=$('#ev5-ai-analysis-output',root);
    if(!text){out.textContent='الصق نصًا للتحليل.';return;}
    const words=text.split(/\s+/).filter(Boolean),sentences=text.split(/[.!؟?]+/).filter(x=>x.trim());
    const freq={};words.forEach(w=>{const t=w.replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();if(t.length>3)freq[t]=(freq[t]||0)+1;});
    const top=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([w,n])=>`${w} (${n})`);
    out.innerHTML=`<p>عدد الكلمات: <b>${words.length}</b></p><p>عدد الجمل التقريبي: <b>${sentences.length}</b></p><p>أكثر الكلمات تكرارًا: ${esc(top.join('، ')||'لا توجد كلمات متكررة واضحة')}</p><p>المعالجة محلية داخل المتصفح.</p>`;
  });
  $('#ev5-ai-site-search',root).addEventListener('click',()=>{
    const q=$('#ev5-ai-site-query',root).value.trim(),out=$('#ev5-ai-site-results',root);
    if(!q){out.textContent='اكتب كلمة البحث.';return;}
    const matches=siteMatches(q,15);
    out.innerHTML=matches.length?matches.map(x=>`<p><b>${esc(x.type)} · ${esc(x.name)}</b><br>${esc(x.desc||'')}</p>`).join(''):`<p>${ESKO_OUT_OF_SCOPE}</p>`;
  });

  async function loadStoreAddons(){
    try{
      STORE_ADDONS=await loadLibraryFile(new URL('v5/store-addons.json',document.baseURI));
      renderStoreCategories();renderStoreCatalog();
    }catch(error){
      $('#ev5-store-count',root).textContent='تعذر تحميل كتالوج المتجر: '+error.message;
    }
  }
  function renderStoreCategories(){
    const cats=['الكل',...new Set(STORE_ADDONS.map(x=>x.category))];
    const holder=$('#ev5-store-categories',root);if(!holder)return;
    holder.innerHTML=cats.map(c=>`<button class="ev5-btn ${c===storeCategory?'primary':''}" data-store-category="${esc(c)}">${esc(c)}</button>`).join('');
    holder.querySelectorAll('[data-store-category]').forEach(btn=>btn.onclick=()=>{storeCategory=btn.dataset.storeCategory;storePage=0;renderStoreCategories();renderStoreCatalog();});
  }
  function getSavedAddons(){
    try{return JSON.parse(localStorage.getItem('eskoStoreAddons')||'[]');}catch(_){return [];}
  }
  function renderSavedAddons(){
    const holder=$('#ev5-store-added',root);if(!holder)return;
    const saved=getSavedAddons();
    holder.innerHTML=saved.length?saved.map(x=>`<p class="ev5-small">🟩 ${esc(x.name)} <button class="ev5-btn" data-remove-addon="${esc(x.id)}">إزالة</button></p>`).join(''):'<p class="ev5-small">لم تضف أي عنصر بعد.</p>';
    holder.querySelectorAll('[data-remove-addon]').forEach(btn=>btn.onclick=()=>{
      const next=getSavedAddons().filter(x=>x.id!==btn.dataset.removeAddon);
      localStorage.setItem('eskoStoreAddons',JSON.stringify(next));renderSavedAddons();
    });
  }
  function renderStoreCatalog(){
    const holder=$('#ev5-store-grid',root);if(!holder)return;
    storeQuery=($('#ev5-store-search',root)?.value||storeQuery||'').trim().toLowerCase();
    const filtered=STORE_ADDONS.filter(x=>(storeCategory==='الكل'||x.category===storeCategory)&&
      (x.name+' '+x.category+' '+x.description).toLowerCase().includes(storeQuery));
    const pageSize=30,maxPage=Math.max(0,Math.ceil(filtered.length/pageSize)-1);
    storePage=Math.min(storePage,maxPage);
    const pageItems=filtered.slice(storePage*pageSize,(storePage+1)*pageSize);
    $('#ev5-store-count',root).textContent=`${filtered.length} إضافة مطابقة من أصل ${STORE_ADDONS.length} · ${pageItems.length} في الصفحة`;
    $('#ev5-store-page',root).textContent=`صفحة ${storePage+1} / ${maxPage+1}`;
    holder.innerHTML=pageItems.map(item=>card(item.name,item.category+' · '+item.description,'🧩',
      `<button class="ev5-btn primary" data-add-addon="${esc(item.id)}">إضافة للتطبيق</button>`,'تحت التطوير')).join('')||'<p class="ev5-muted">لا توجد نتائج مطابقة.</p>';
    holder.querySelectorAll('[data-add-addon]').forEach(btn=>btn.onclick=()=>{
      const item=STORE_ADDONS.find(x=>x.id===btn.dataset.addAddon);if(!item)return;
      const saved=getSavedAddons();
      if(!saved.some(x=>x.id===item.id)){saved.push({id:item.id,name:item.name,category:item.category});localStorage.setItem('eskoStoreAddons',JSON.stringify(saved));}
      renderSavedAddons();
      toast('تمت إضافته لقائمة ESKO المحلية. مزامنة APK تحتاج خادم الحساب.');
    });
    $('#ev5-store-prev',root).disabled=storePage===0;
    $('#ev5-store-next',root).disabled=storePage>=maxPage;
  }
  $('#ev5-store-search',root)?.addEventListener('input',(window.ESKOPerformanceCore?.debounce || (fn=>fn))(function(){storePage=0;renderStoreCatalog();},180));
  $('#ev5-store-prev',root)?.addEventListener('click',()=>{storePage=Math.max(0,storePage-1);renderStoreCatalog();});
  $('#ev5-store-next',root)?.addEventListener('click',()=>{storePage++;renderStoreCatalog();});
  $('#ev5-store-clear',root)?.addEventListener('click',()=>{localStorage.removeItem('eskoStoreAddons');renderSavedAddons();});


  const STORE_GAME_ICONS={'أركيد':'🕹️','ألغاز':'🧩','ألغاز منطقية':'🧠','استراتيجية':'♟️','رياضة':'🏅','سباقات':'🏁','مغامرات':'🧭','تعليم':'📚','إبداع':'🎨','استرخاء':'🌙','تحديات يومية':'⚡','ذاكرة':'🧠','ألعاب لوحية':'🎲'};
  const STORE_BOT_ICONS={'customer-support':'🛟','community':'👥','education':'🎓','productivity':'🗓️','commerce':'🛒','content':'✍️','analytics':'📊','developer':'💻','events':'🎟️','personal':'🤖'};
  function storeBotIcon(item){return getBotIcon({name:item.name,task:item.task,desc:item.desc,group:item.category,category:item.category})||STORE_BOT_ICONS[item.categoryId]||'🤖';}
  async function loadStoreBotCatalog(){
    try{STORE_BOT_CATALOG=await loadLibraryFile(new URL('v5/store-bot-catalog.json',document.baseURI));renderStoreBotCategories();renderStoreBotCatalog();}
    catch(error){$('#ev5-store-bot-count',root).textContent='تعذر تحميل كتالوج البوتات: '+error.message;}
  }
  function renderStoreBotCategories(){
    const holder=$('#ev5-store-bot-categories',root);if(!holder)return;
    const labels=['الكل',...(STORE_BOT_CATALOG.categories||[]).map(x=>x.label)];
    holder.innerHTML=labels.map(c=>`<button class="ev5-btn ${c===storeBotCategory?'primary':''}" data-store-bot-category="${esc(c)}">${esc(c)}</button>`).join('');
    holder.querySelectorAll('[data-store-bot-category]').forEach(b=>b.onclick=()=>{storeBotCategory=b.dataset.storeBotCategory;storeBotPage=0;renderStoreBotCategories();renderStoreBotCatalog();});
  }
  function renderStoreBotCatalog(){
    const holder=$('#ev5-store-bot-grid',root);if(!holder)return;
    const q=($('#ev5-store-bot-search',root).value||'').trim().toLowerCase();
    const items=(STORE_BOT_CATALOG.items||[]).filter(x=>(storeBotCategory==='الكل'||x.category===storeBotCategory)&&(x.name+' '+x.desc+' '+x.task+' '+x.category).toLowerCase().includes(q));
    const size=20,max=Math.max(0,Math.ceil(items.length/size)-1);storeBotPage=Math.min(storeBotPage,max);const page=items.slice(storeBotPage*size,(storeBotPage+1)*size);
    $('#ev5-store-bot-count',root).textContent=`${items.length} نتيجة من أصل ${(STORE_BOT_CATALOG.items||[]).length} قالب · هذه قوالب بداية وليست بوتات مستضافة`;
    $('#ev5-store-bot-page',root).textContent=`صفحة ${storeBotPage+1} / ${max+1}`;
    holder.innerHTML=page.map((b,i)=>card(b.name,b.desc,storeBotIcon(b),`<button class="ev5-btn primary" data-store-bot="${esc(b.id)}">فتح وبناء القالب</button>`,'قالب قابل للتخصيص')).join('')||'<p class="ev5-muted">لا توجد نتائج.</p>';
    holder.querySelectorAll('[data-store-bot]').forEach(btn=>btn.onclick=()=>{const b=STORE_BOT_CATALOG.items.find(x=>x.id===btn.dataset.storeBot);if(!b)return;showEagleEffect();void renderBotBuilder({id:b.id,name:b.name,desc:b.desc,group:b.category,task:b.task,platforms:b.platforms});});
    $('#ev5-store-bot-prev',root).disabled=storeBotPage===0;$('#ev5-store-bot-next',root).disabled=storeBotPage>=max;
  }
  $('#ev5-store-bot-search',root)?.addEventListener('input',(window.ESKOPerformanceCore?.debounce||((fn)=>fn()))(()=>{storeBotPage=0;renderStoreBotCatalog();},150));
  $('#ev5-store-bot-prev',root)?.addEventListener('click',()=>{storeBotPage=Math.max(0,storeBotPage-1);renderStoreBotCatalog();});
  $('#ev5-store-bot-next',root)?.addEventListener('click',()=>{storeBotPage++;renderStoreBotCatalog();});

  async function loadStoreGames(){
    try{const data=await loadLibraryFile(new URL('v5/store-games.json',document.baseURI));STORE_GAMES=data.items||[];renderStoreGameCategories();renderStoreGameCatalog();}
    catch(error){$('#ev5-store-game-count',root).textContent='تعذر تحميل الألعاب: '+error.message;}
  }
  function savedStoreGames(){try{return JSON.parse(localStorage.getItem('eskoStoreGames')||'[]');}catch(_){return [];}}
  function renderStoreGameCategories(){
    const holder=$('#ev5-store-game-categories',root);if(!holder)return;
    const cats=['الكل',...new Set(STORE_GAMES.map(x=>x.category))];
    holder.innerHTML=cats.map(c=>`<button class="ev5-btn ${c===storeGameCategory?'primary':''}" data-store-game-category="${esc(c)}">${esc(c)}</button>`).join('');
    holder.querySelectorAll('[data-store-game-category]').forEach(b=>b.onclick=()=>{storeGameCategory=b.dataset.storeGameCategory;storeGamePage=0;renderStoreGameCategories();renderStoreGameCatalog();});
  }
  function renderStoreGameCatalog(){
    const holder=$('#ev5-store-game-grid',root);if(!holder)return;
    const q=($('#ev5-store-game-search',root).value||'').trim().toLowerCase();
    const items=STORE_GAMES.filter(x=>(storeGameCategory==='الكل'||x.category===storeGameCategory)&&(x.name+' '+x.category+' '+x.description).toLowerCase().includes(q));
    const size=20,max=Math.max(0,Math.ceil(items.length/size)-1);storeGamePage=Math.min(storeGamePage,max);const page=items.slice(storeGamePage*size,(storeGamePage+1)*size);const saved=savedStoreGames();
    $('#ev5-store-game-count',root).textContent=`${items.length} نتيجة من أصل ${STORE_GAMES.length} لعبة · ${STORE_GAMES.filter(x=>x.ready).length} بمحركات محلية جاهزة`;
    $('#ev5-store-game-page',root).textContent=`صفحة ${storeGamePage+1} / ${max+1}`;
    holder.innerHTML=page.map(g=>{const installed=saved.some(x=>x.id===g.id);const action=g.ready?(installed?`<button class="ev5-btn primary" data-run-store-game="${g.id}">تشغيل</button>`:`<button class="ev5-btn primary" data-add-store-game="${g.id}">إضافة</button>`):`<button class="ev5-btn" data-add-store-game="${g.id}">${installed?'مضاف · تحت التطوير':'إضافة للقائمة'}</button>`;return card(g.name,g.description,STORE_GAME_ICONS[g.category]||'🎮',`<button class="ev5-btn" data-preview-store-game="${g.id}">معاينة</button>${action}` ,g.ready?'محرك محلي جاهز':'تحت التطوير');}).join('')||'<p class="ev5-muted">لا توجد نتائج.</p>';
    holder.querySelectorAll('[data-add-store-game]').forEach(b=>b.onclick=()=>{const g=STORE_GAMES.find(x=>x.id===b.dataset.addStoreGame);if(!g)return;const now=savedStoreGames();if(!now.some(x=>x.id===g.id)){now.push({id:g.id,name:g.name,ready:g.ready,engine:g.engine});localStorage.setItem('eskoStoreGames',JSON.stringify(now));}renderStoreGameCatalog();toast(g.ready?'تمت الإضافة. زر التشغيل أصبح جاهزًا.':'تمت الإضافة للقائمة؛ محرك اللعبة ما زال تحت التطوير.');});
    holder.querySelectorAll('[data-run-store-game]').forEach(b=>b.onclick=()=>{const g=STORE_GAMES.find(x=>x.id===b.dataset.runStoreGame);if(g?.ready&&g.engine){go('games');launchGame(g.engine);}});
    holder.querySelectorAll('[data-preview-store-game]').forEach(b=>b.onclick=()=>{const g=STORE_GAMES.find(x=>x.id===b.dataset.previewStoreGame);const p=$('#ev5-store-game-preview',root);if(!g||!p)return;p.hidden=false;p.innerHTML=`<h3>${esc(g.name)}</h3><p>${esc(g.description)}</p><p>التصنيف: ${esc(g.category)} · الحالة: ${g.ready?'يمكن تشغيل محرك محلي موجود':'تحت التطوير'}</p><p class="ev5-small">الترخيص: ${esc(g.license)}</p><button class="ev5-btn" data-random-support data-support-message="أريد معلومات عن لعبة ${esc(g.name)} في متجر ESKO.">الدعم</button>`;showEagleEffect();});
    $('#ev5-store-game-prev',root).disabled=storeGamePage===0;$('#ev5-store-game-next',root).disabled=storeGamePage>=max;
  }
  $('#ev5-store-game-search',root)?.addEventListener('input',(window.ESKOPerformanceCore?.debounce||((fn)=>fn()))(()=>{storeGamePage=0;renderStoreGameCatalog();},150));
  $('#ev5-store-game-prev',root)?.addEventListener('click',()=>{storeGamePage=Math.max(0,storeGamePage-1);renderStoreGameCatalog();});
  $('#ev5-store-game-next',root)?.addEventListener('click',()=>{storeGamePage++;renderStoreGameCatalog();});

  async function loadGeometryThemes(){
    try{const data=await loadLibraryFile(new URL('v5/geometric-themes.json',document.baseURI));GEOMETRY_THEMES=data.items||[];renderGeometryCategories();renderGeometryCatalog();const active=localStorage.getItem('eskoGeometryActive');if(active){const saved=GEOMETRY_THEMES.find(x=>x.id===active);if(saved)applyGeometryTheme(saved,true);}}
    catch(error){$('#ev5-geometry-count',root).textContent='تعذر تحميل المناظر الهندسية: '+error.message;}
  }
  function savedGeometry(){try{return JSON.parse(localStorage.getItem('eskoGeometryPresets')||'[]');}catch(_){return [];}}
  function geometrySample(theme){return `<div class="ev5-geometry-sample" data-geom-shape="${esc(theme.shape)}" data-geom-pattern="${esc(theme.pattern)}" style="--geom-primary:${theme.primary};--geom-secondary:${theme.secondary};--geom-accent:${theme.accent}"><i></i><b></b></div>`;}
  function renderGeometryCategories(){
    const holder=$('#ev5-geometry-categories',root);if(!holder)return;
    const cats=['الكل',...new Set(GEOMETRY_THEMES.map(x=>x.category))];
    holder.innerHTML=cats.map(c=>`<button class="ev5-btn ${c===geometryCategory?'primary':''}" data-geometry-category="${esc(c)}">${esc(c)}</button>`).join('');
    holder.querySelectorAll('[data-geometry-category]').forEach(b=>b.onclick=()=>{geometryCategory=b.dataset.geometryCategory;geometryPage=0;renderGeometryCategories();renderGeometryCatalog();});
  }
  function applyGeometryTheme(theme,silent=false){
    let overlay=document.getElementById('esko-geometry-skin');
    if(!overlay){overlay=document.createElement('div');overlay.id='esko-geometry-skin';overlay.setAttribute('aria-hidden','true');document.body.appendChild(overlay);}
    overlay.dataset.shape=theme.shape;overlay.dataset.pattern=theme.pattern;overlay.dataset.motion=theme.motion;
    overlay.style.setProperty('--geom-primary',theme.primary);overlay.style.setProperty('--geom-secondary',theme.secondary);overlay.style.setProperty('--geom-accent',theme.accent);overlay.style.setProperty('--geom-speed',theme.speed+'s');
    overlay.classList.remove('geom-active');void overlay.offsetWidth;overlay.classList.add('geom-active');
    localStorage.setItem('eskoGeometryActive',theme.id);if(!silent){toast('تم تشغيل المنظر الهندسي: '+theme.name);showEagleEffect();}
  }
  function addGeometryTheme(theme){const items=savedGeometry();if(!items.some(x=>x.id===theme.id)){items.push({id:theme.id,name:theme.name,shape:theme.shape,pattern:theme.pattern,motion:theme.motion,primary:theme.primary,secondary:theme.secondary,accent:theme.accent,speed:theme.speed});localStorage.setItem('eskoGeometryPresets',JSON.stringify(items));}renderGeometryCatalog();toast('تمت إضافة المنظر للموقع. اضغط تشغيل لتطبيقه.');}
  function renderGeometryCatalog(){
    const holder=$('#ev5-geometry-grid',root);if(!holder)return;
    const q=($('#ev5-geometry-search',root).value||'').trim().toLowerCase();
    const items=GEOMETRY_THEMES.filter(x=>(geometryCategory==='الكل'||x.category===geometryCategory)&&(x.name+' '+x.category+' '+x.description).toLowerCase().includes(q));
    const size=20,max=Math.max(0,Math.ceil(items.length/size)-1);geometryPage=Math.min(geometryPage,max);const page=items.slice(geometryPage*size,(geometryPage+1)*size);const saved=savedGeometry();
    $('#ev5-geometry-count',root).textContent=`${items.length} نتيجة من أصل ${GEOMETRY_THEMES.length} منظرًا · ${saved.length} محفوظة على هذا الجهاز`;
    $('#ev5-geometry-page',root).textContent=`صفحة ${geometryPage+1} / ${max+1}`;
    holder.innerHTML=page.map(t=>{const installed=saved.some(x=>x.id===t.id);return `<article class="ev5-card ev5-geometry-card">${geometrySample(t)}<h3>${esc(t.name)}</h3><p>${esc(t.category)} · ${esc(t.description)}</p><div class="ev5-actions"><button class="ev5-btn" data-preview-geometry="${t.id}">👁️ معاينة</button><button class="ev5-btn primary" data-add-geometry="${t.id}">${installed?'تشغيل':'إضافة للموقع'}</button><a class="ev5-green-link" href="https://wa.me/963993825873" data-random-support data-support-message="أحتاج مساعدة في المنظر الهندسي ${esc(t.id)} — ${esc(t.name)}">الدعم</a></div></article>`;}).join('')||'<p class="ev5-muted">لا توجد نتائج.</p>';
    holder.querySelectorAll('[data-preview-geometry]').forEach(b=>b.onclick=()=>{const t=GEOMETRY_THEMES.find(x=>x.id===b.dataset.previewGeometry);const panel=$('#ev5-geometry-preview',root);if(!t||!panel)return;panel.hidden=false;panel.innerHTML=geometrySample(t)+`<h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><div class="ev5-actions"><button class="ev5-btn primary" id="ev5-geometry-apply-preview">تشغيل المنظر</button><button class="ev5-btn" id="ev5-geometry-add-preview">إضافة للموقع</button><a class="ev5-green-link" href="https://wa.me/963993825873" data-random-support data-support-message="أحتاج مساعدة في المنظر ${esc(t.id)}">الدعم</a></div>`;$('#ev5-geometry-apply-preview',panel).onclick=()=>applyGeometryTheme(t);$('#ev5-geometry-add-preview',panel).onclick=()=>addGeometryTheme(t);panel.scrollIntoView({behavior:window.ESKOPerformanceCore?.reducedMotion?.()?'auto':'smooth',block:'nearest'});});
    holder.querySelectorAll('[data-add-geometry]').forEach(b=>b.onclick=()=>{const t=GEOMETRY_THEMES.find(x=>x.id===b.dataset.addGeometry);if(!t)return;if(savedGeometry().some(x=>x.id===t.id))applyGeometryTheme(t);else addGeometryTheme(t);});
    $('#ev5-geometry-prev',root).disabled=geometryPage===0;$('#ev5-geometry-next',root).disabled=geometryPage>=max;
  }
  $('#ev5-geometry-search',root)?.addEventListener('input',(window.ESKOPerformanceCore?.debounce||((fn)=>fn()))(()=>{geometryPage=0;renderGeometryCatalog();},150));
  $('#ev5-geometry-prev',root)?.addEventListener('click',()=>{geometryPage=Math.max(0,geometryPage-1);renderGeometryCatalog();});
  $('#ev5-geometry-next',root)?.addEventListener('click',()=>{geometryPage++;renderGeometryCatalog();});

  const storeProcessors=[
    'بحث المنتجات','تحميل كسول للصور','ضغط الصور','تخزين مؤقت للكتالوج','ترتيب المنتجات','فلترة الفئات','بحث مؤجل','إدارة حالة السلة','مراجعة الأسعار','تنسيق العملات',
    'تحديث المخزون','مراقبة التوفر','تحسين عرض الهاتف','تحسين عرض الكمبيوتر','تحسين الصور','حماية نموذج الطلب','التحقق من الحقول','منع النقر المتكرر','رسائل حالة الطلب','تتبع أخطاء الواجهة',
    'تجميع الطلبات','حفظ المسودة محليًا','مراجعة الخصوصية','تحقق رابط المنتج','تحسين التنقل','إدارة قوائم الأمنيات','عرض تفاصيل المنتج','مقارنة المنتجات','قائمة صيانة المتجر','اختبار قبل الإطلاق'
  ];
  const storeGrid=$('#ev5-store-processors',root);
  if(storeGrid)storeGrid.innerHTML=storeProcessors.map((x,i)=>`<span class="ev5-processor-chip"><b>${String(i+1).padStart(2,'0')}</b> ${esc(x)}</span>`).join('');
  $('#ev5-open-google',root)?.addEventListener('click',()=>{
    const q=$('#ev5-google-query',root).value.trim();
    if(!q){$('#ev5-google-results',root).textContent='اكتب كلمة البحث أولًا.';return;}
    window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener');
  });
  renderGames();
  renderSavedAddons();
  void loadAIReplyBank();
  void loadStoreAddons();
  void loadStoreBotCatalog();
  void loadStoreGames();
  void loadGeometryThemes();
  void loadToolLibrary();
  void loadBotTemplates();
  renderPerformanceProcessors();
})();
