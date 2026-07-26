# DEPLOYMENT_STATUS

## الهدف
هذا الملف هو المصدر الوحيد لِمعرفة حالة النشر الحالية للمشروع وأين هو موجود على Render.

## أين المشروع منشور
- المنصة: Render
- ملف التكوين: `render.yaml`
- الخدمات المُعرّفة:
  - `jobmap-backend` (Backend service)
  - `jobmap-frontend` (Static frontend site)
  - `jobmap-db` (Managed PostgreSQL database)

## تفاصيل الخدمة
### Backend
- اسم الخدمة على Render: `jobmap-backend`
- نوع الخدمة: web / Node.js
- بيئة التشغيل: `production`
- أمر البناء: `cd backend && rm -rf node_modules && npm ci && npm run build`
- أمر التشغيل: `node dist/main.js`
- أمر ما قبل النشر: `cd backend && npm run typeorm migration:run`
- يعتمد الواجهة الأمامية عليه عن طريق:
  - `REACT_APP_API_URL=https://jobmap-backend-57v5.onrender.com/api`

### Frontend
- اسم الخدمة على Render: `jobmap-frontend`
- نوع الخدمة: static_site
- مسار النشر: `web/dashboard/build`
- أمر البناء: `cd web/dashboard && npm install && npm run build`
- يستخدم إعادة التوجيه فقط إلى `/index.html` لكل المسارات.

### قاعدة البيانات
- اسم قاعدة البيانات: `jobmap-db`
- اسم قاعدة البيانات في Render: `jobmap_ssqr`
- المستخدم: `jobmap_user`
- بيئة الاتصال موجودة في `.env.render.local`
- تُستخدم قيمة `DB_HOST` الداخلية الخاصة بـ Render

## ما يجب معرفته الآن
- أي مطور أو وكيل يحتاج يعرف هذا المشروع منشور على Render، ويجب فتح لوحة Render لرؤية المجال النهائي لكل خدمة.
- الواجهة الأمامية تعتمد على متغير البيئة `REACT_APP_API_URL` لقراءة الرابط الصحيح للـ Backend.
- الملف الوحيد الذي يحتوي هذا الملخص هو `DEPLOYMENT_STATUS.md`.

## توصية
إذا كنت تريد أن يعرف أي مطور أو وكيل حالة النشر بسرعة، فابدأ من هذا الملف فقط.
