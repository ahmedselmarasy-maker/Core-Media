## إعداد Supabase (مرة واحدة)

### 1) ضع مفاتيح Supabase في المشروع

- افتح ملف `supabase-config.js`
- تأكد أن:
  - `window.CM_SUPABASE_URL` مضبوط
  - الصق **Publishable / anon key** داخل:
    - `window.CM_SUPABASE_ANON_KEY`

### 2) أنشئ الجداول والسياسات (SQL)

- افتح Supabase Dashboard → **SQL Editor**
- افتح ملف `supabase-setup.sql` وانسخه بالكامل ثم **Run**
- هذا ينشئ:
  - `cm_brands` (البراندات + التصاميم + القاطعات + صورة الغلاف)
  - `cm_site_settings` (نصوص الموقع، الفيديو التعريفي، الخدمات، التواصل)
  - `cm_admins`
  - سياسات Storage لـ `cm-portfolio`

> لو كنت شغّلت SQL قديم من قبل: شغّل الملف مرة تانية بأمان (فيه `add column if not exists` وجدول الإعدادات الجديد).

### 3) أنشئ Storage bucket للميديا

- Storage → New bucket
- الاسم: `cm-portfolio`
- اجعله **Public**

### 4) أنشئ مستخدم الأدمن (Email/Password)

- Authentication → Users → Add user
- انسخ **User UID**
- في SQL Editor شغّل:

```sql
insert into public.cm_admins (user_id)
values ('PUT-YOUR-USER-UID-HERE')
on conflict (user_id) do nothing;
```

## التشغيل المحلي

- شغّل `run-server.bat`
- الموقع: `http://localhost:8000/`
- لوحة الإدارة: `http://localhost:8000/admin.html`

## ماذا تتحكم فيه من لوحة الإدارة؟

- البراندات: الاسم، القطاع، التصنيف، صورة الغلاف
- التصاميم والقاطعات: رفع / رابط / عنوان / ترتيب / حذف (ورفع متعدد)
- الصفحة الرئيسية: النصوص، الأرقام، الفيديو التعريفي
- من نحن + عنوان قسم الأعمال
- الخدمات (إضافة/تعديل/حذف)
- التواصل: البريد، واتساب، فيسبوك

