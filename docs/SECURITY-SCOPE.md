# نطاق الحماية في V4.5

## فحص الموقع

الفحص محدود إلى HTTPS root response وترويساته/كوكيزه. النطاق يجب أن يكون HTTPS عامًا، والجذر فقط، بلا منفذ أو مسار مخصص. هناك حظر مبدئي لنطاقات خدمات مشهورة. يجري التحقق من DNS ورفض عناوين الشبكات الخاصة قبل الاتصال، مع تثبيت عنوان DNS المستخدم في طلب HTTPS لتقليل مخاطر SSRF وإعادة ربط DNS.

المؤشرات الثلاثة عشر: HTTPS، TLS، HSTS، CSP، X-Content-Type-Options، سياسة الإطارات، Referrer-Policy، Permissions-Policy، Secure cookies، HttpOnly cookies، SameSite cookies، كشف Server، كشف X-Powered-By.

هذه مراجعة إعدادات وليست اختبار اختراق. بعض المواقع لا تستخدم cookies أو لا تحتاج كل ترويسة بنفس الشكل، ولذلك تظهر بعض البنود على أنها «لا توجد كوكيز» أو «غير ظاهر» بدل إعلان ثغرة مؤكدة.

## حماية المحادثات

- الرسائل نصية فقط في هذه النسخة.
- قبول الطرف الآخر مطلوب قبل إنشاء محادثة خاصة.
- هناك حد لطول الرسالة وتحديد لمعدل الإرسال.
- الحظر متبادل الأثر على المحادثة الخاصة.
- البلاغات تحفظ محليًا للمراجعة؛ لا توجد لوحة إشراف/فريق مراجعة متصل بعد.
- لا تنشر الخدمة قبل إضافة إشراف فعلي، سياسة خصوصية، شروط استخدام، نسخ احتياطي، وحماية من الإساءة.

## مرجع التصميم

- OWASP Secure Headers Project: https://owasp.org/projects/secure-headers-project
- OWASP response headers: https://secure-headers-project.owasp.org/response-headers/
- MDN IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN Web Crypto: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
