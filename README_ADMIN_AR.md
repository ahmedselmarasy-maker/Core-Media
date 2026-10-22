# إصلاح لوحة تحكم Core Media — فرع main

هذه الحزمة تصحح لوحة التحكم فقط؛ لا تحتوي على cms.json أو أي بيانات مشاريع؛ **لا تغير ترتيب البلاي ليست أو حذف أي مشروع**.

## 1. رفع الملفات إلى GitHub
- افتح المستودع `ahmedselmarasy-maker/Core-Media` على `main`.
- باستخدام GitHub Desktop (أو git)، انسخ محتويات هذه الحزمة إلى جذر المستودع مع الحفاظ على المجلدات.
- لا ترفع ملف ZIP ذاته، ولا تضع الملفات `auth.mjs` و `cms.mjs` في الجذر.
- الهيكل المطلوب:
```
admin.js
api/auth.mjs
api/cms.mjs
api/upload.mjs
api/playlist.mjs
api/health.mjs
lib/cms-server.mjs
```
- نفذ Commit وPush، وتأكد من نشر Production في Vercel.

## 2. ضبط Vercel > Project > Settings > Environment Variables
تأكد من وجود المتغيرات التالية في **Production** (بالأسماء حرفيًا):
```
ADMIN_USERNAME=<اسم مستخدم تختاره>
ADMIN_PASSWORD=<كلمة مرور قوية 12 حرفاً على الأقل>
SESSION_SECRET=<قيمة عشوائية سرية 32 حرفاً على الأقل>
GITHUB_TOKEN=<GitHub fine-grained token بصلاحية Contents Read and write>
GITHUB_REPOSITORY=ahmedselmarasy-maker/Core-Media
GITHUB_BRANCH=main
```
لا تشارك القيم السرية في الشات أو ترفعها داخل ملفات المشروع.
بعد أي إضافة أو تعديل في متغيرات Vercel لازم تعمل **Redeploy Production**.

## 3. فحص مباشر بعد النشر
- افتح `https://core-media-eg.vercel.app/api/health`.
  - `404`: لم تُنشر ملفات مجلد api (أو إعداد Root Directory غلط).
  - `{"api":"ok","loginReady":false,...}`: المتغيرات الخاصة بالدخول ناقصة أو قصيرة.
  - `{"api":"ok","loginReady":true,"githubReady":false}`: متغيرات GitHub ناقصة.
  - `{"api":"ok","loginReady":true,"githubReady":true}`: التهيئة الشكلية سليمة؛ لا يعني أن GitHub token لديه الصلاحيات الصحيحة.
- افتح `https://core-media-eg.vercel.app/admin.html` وسجّل ببيانات `ADMIN_USERNAME` و`ADMIN_PASSWORD` الموجودة في Production.
- في حال ظهور خطأ GitHub بعد الدخول: تأكد من صلاحية Contents: Read and write ووجود الملف `data/cms.json` أو `cms.json` في `main`.
- حساب Supabase القديم لن يعمل تلقائيًا؛ لا يوجد ربط دخول به.

### هام
هذه الحزمة لا تعدّل صور أو فيديوهات أو مشروعات ولا تعيد بيانات Supabase القديمة.
