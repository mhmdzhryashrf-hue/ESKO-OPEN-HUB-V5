# استيراد ESKO V5.0 إلى مستودع GitHub جديد

تم تجهيز مصدر Git محلي نظيف باسم `ESKO-OPEN-HUB-V5.0` في ملف bundle بجانب حزمة ZIP.

1. أنشئ مستودعًا فارغًا على حساب GitHub الصحيح، ولا تضف README أو License من الموقع حتى لا يحدث تعارض أول push.
2. استورد ملف bundle:

```bash
git clone ESKO-OPEN-HUB-V5.0.bundle ESKO-OPEN-HUB-V5.0
cd ESKO-OPEN-HUB-V5.0
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

استبدل `OWNER/REPOSITORY` بعنوان المستودع الذي أنشأته بنفسك. لا تضع رمز دخول أو Personal Access Token في الملفات أو المحادثات؛ استخدم Git Credential Manager أو تسجيل الدخول الرسمي من GitHub CLI.

بعد رفع المشروع، اربطه بخدمة استضافة Docker، وأرفق وحدة تخزين دائمة في `/data`، ثم اتبع `DEPLOYMENT-AR.md`.
