# تطبيق ESKO Titan V8.3 — مشروع Android

هذا المشروع يحوّل ملفات الموقع الموجودة في `docs/` إلى تطبيق Android باستخدام WebView محلي.

## البناء
1. افتح مجلد `ESKO-ANDROID-V8.3` في Android Studio.
2. انتظر Gradle Sync وثبّت Android SDK Platform 35 إذا طلبه Android Studio.
3. من Build اختر **Build APK(s)**.
4. ملف APK التجريبي يظهر عادةً في:
   `app/build/outputs/apk/debug/app-debug.apk`

## ملاحظات مهمة
- التطبيق يعرض نسخة الموقع المضمنة داخل APK؛ عند تعديل الموقع يجب إعادة تشغيل هذا السكريبت في مجلد مشروع جديد أو نسخ ملفات `docs/` إلى `app/src/main/assets/www/` ثم إعادة البناء.
- الميزات التي تعتمد على API أو خادم أو تسجيل دخول حقيقي لن تعمل بمجرد تغليف الموقع؛ تحتاج Backend واتصالًا فعليًا به.
- هذا مشروع WebView أولي، وليس اختبارًا نهائيًا على كل أجهزة Android.
- لا يحتوي على مفاتيح API أو كلمات مرور.
