# تركيب تحديث ESKO V5.8 على Termux

1. احتفظ بنسخة احتياطية من مجلد المشروع الحالي.
2. نزّل ملف `ESKO-OPEN-HUB-V5.8-DEVELOPER-STUDIO-WEB-PATCH.zip` إلى مجلد Downloads.
3. ادخل إلى مجلد المشروع الذي يحتوي مجلد `docs`، مثلًا:

```sh
cd ~/storage/downloads/ESKO-OPEN-HUB-V5.0
```

4. ادمج التحديث فوق المشروع:

```sh
unzip -o ~/storage/downloads/ESKO-OPEN-HUB-V5.8-DEVELOPER-STUDIO-WEB-PATCH.zip
```

5. افحص الملفات المتغيرة:

```sh
git status --short
```

هذه الحزمة تحديث ويب لمجلد `docs/` وليست APK أو تحديثًا مباشرًا لتطبيق Android. لا تنشرها إلى GitHub إلا بعد مراجعة التغييرات والموافقة على النشر.
