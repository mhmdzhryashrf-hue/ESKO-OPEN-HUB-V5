# دمج V8.3 في Android

لو كان التطبيق يعرض نفس ملفات الويب داخل WebView، يمكن نسخ ملفات `docs/` إلى مصدر أصول الويب بعد مراجعة المسارات. لم يتم تعديل APK أو Android source في هذه الحزمة لعدم توفر ملفات Android الأصلية. اختبر WebView على الهاتف؛ Service Worker وPWA install قد لا يتاحان في `file://` أو بعض WebView.
