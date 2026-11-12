# مشروع Android لمِحور

هذا مصدر تطبيق Android بسيط عبر WebViewAssetLoader يعرض نسخة الويب المضمّنة. يدعم JavaScript وDOM Storage واختيار الملفات من منتقي Android، ويمنع الوصول المباشر إلى ملفات الجهاز من WebView.

## البناء

1. افتح مجلد `android` في Android Studio حديث.
2. اسمح بتنزيل Android Gradle Plugin وAndroidX WebKit وAndroid SDK 35 إذا طُلب ذلك.
3. نفذ `Build > Build APK(s)` أو `./gradlew :app:assembleDebug` إذا كان Gradle Wrapper متوفراً في مشروعك.
4. ملف APK المتوقع بعد نجاح البناء: `app/build/outputs/apk/debug/app-debug.apk`.

لم يتم إخراج APK في بيئة هذه الجلسة لأنها لا تحتوي على Android SDK أو Gradle. ملفات Android هنا هي مصدر بناء، وليست APK مثبتاً.
