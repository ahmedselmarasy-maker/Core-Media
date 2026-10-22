# إصلاح موقع Core Media الأساسي — 26 مشروعاً

## السبب المؤكد من ملفات main التي أرسلتها
- `script.js` يحاول تحميل `data/cms.json`، لكن GitHub عندك فيه `cms.json` في الجذر فقط.
- نفس خطأ رفع المجلدات: `auth.mjs`, `cms.mjs`, `playlist.mjs`, `upload.mjs` في جذر المستودع، بدلاً من `api/`، و`cms-server.mjs` في الجذر بدلاً من `lib/`.
- المستند الأساسي يحتوي بالفعل على 26 مشروعاً (23 قديماً + 3 قوائم يوتيوب)، بلا داعٍ لإعادة الاستيراد.

## للإصلاح الفوري للأقسام (خطوة واحدة)
على GitHub افتح `main` ثم **script.js** > Edit > استبدل الملف بنسخة `script.js` هنا، واعمل Commit.
النسخة المعدلة تحاول `data/cms.json` ثم `cms.json` الموجود بالفعل؛ وهذا يُظهر الـ23 مشروعاً حتى قبل نقل المجلدات. 
إذا رفعت `script.js` لوحده عبر Upload Files تأكد أنه استبدل الملف الجذري الصحيح، وليس أضافه تحت مجلد جديد.

## لتفعيل لوحة التحكم والمشغل الخلفي كلياً
استخدم GitHub Desktop أو git وليس رفع عدة ملفات عبر واجهة GitHub التي قد تفرد المجلدات. يجب أن يكون هيكل المستودع:

```text
index.html
script.js
admin.html
admin.js
vercel.json
data/cms.json
api/auth.mjs
api/cms.mjs
api/upload.mjs
api/playlist.mjs
lib/cms-server.mjs
```

افتح الفرع `main` على GitHub Desktop، انسخ محتوى حزمة الإصلاح **بالمجلدات** فوق المستودع ثم Commit + Push. لا ترفع ملف ZIP نفسه إلى GitHub.

Vercel > Settings > Environment Variables (Production):
`GITHUB_TOKEN` (Contents Read/Write), `GITHUB_REPOSITORY=ahmedselmarasy-maker/Core-Media`, `GITHUB_BRANCH=main`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` (12 حرفاً على الأقل), `SESSION_SECRET` (32 حرفاً على الأقل). لم يتم ضبط هذه القيم من داخل الأرشيف.
`YOUTUBE_API_KEY` مطلوب لجلب فيديوهات قوائم يوتيوب بشكل موثوق؛ عند غيابه يحاول الموقع التحميل عبر YouTube IFrame API لكنه قد يفشل.

## اختبر بعد نشر Vercel
- `https://core-media-eg.vercel.app/data/cms.json` يجب أن يعرض JSON فيه 26 brand.
- `https://core-media-eg.vercel.app/?category=medical` يجب أن يعرض المشروعات الطبية.
- `https://core-media-eg.vercel.app/api/auth` يجب أن يعرض JSON مثل `{"authenticated":false}` حتى قبل تسجيل الدخول، وليس 404.
- لوحة التحكم `https://core-media-eg.vercel.app/admin.html` لن تسمح بتسجيل الدخول إلا بعد ضبط المتغيرات أعلاه.

## تحذير: الوسائط القديمة
نقل metadata للمشروعات لا ينقل الملفات الأصلية. جزء من الوسائط يشير إلى روابط Supabase، وجزء من الملفات القديمة مجرد مؤشرات Git LFS (132 بايت) وليست ملفات حقيقة. بعض الفيديوهات ستفشل حتى بعد ظهور المشروعات، ولا يجوز حذف Supabase قبل نقل المحتوى فعلياً.
