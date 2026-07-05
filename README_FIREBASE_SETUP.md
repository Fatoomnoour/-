# حل مشكلة تسجيل الدخول بجوجل وصلاحيات قاعدة البيانات

يبدو أنك تستخدم مشروع Firebase خاص بك. لحل هذه الأخطاء، يرجى اتباع الخطوات التالية في لوحة تحكم Firebase:

## 1. حل مشكلة تسجيل الدخول بجوجل (auth/unauthorized-domain)
مشكلة النطاق غير المصرح به تظهر لأن روابط التطبيق الحالية غير مضافة لقائمة النطاقات المسموح بها في Firebase.
1. اذهب إلى منصة [Firebase Console](https://console.firebase.google.com/).
2. اختر مشروعك.
3. من القائمة الجانبية، اذهب إلى **Authentication** ثم اختر علامة التبويب **Settings** (أو الإعدادات).
4. اختر **Authorized domains** (النطاقات المعتمدة).
5. اضغط على **Add domain** (إضافة نطاق) وأضف الرابطين التاليين (بدون `https://`):
   - `ais-dev-mvv2mliomvjnbesyuqtmod-537973475124.europe-west1.run.app`
   - `ais-pre-mvv2mliomvjnbesyuqtmod-537973475124.europe-west1.run.app`

## 2. حل مشكلة صلاحيات قاعدة البيانات (Missing or insufficient permissions)
تظهر هذه المشكلة لأن قواعد حماية قاعدة البيانات (Firestore Rules) تمنع إضافة بيانات جديدة مثل مجموعات وحلقات التدبر.
1. في لوحة تحكم Firebase، اذهب إلى **Firestore Database**.
2. اختر علامة التبويب **Rules** (القواعد).
3. استبدل القواعد الموجودة بالقواعد التالية للسماح للمستخدمين المسجلين بالقراءة والكتابة:
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`
4. اضغط على **Publish** (نشر).

بمجرد تطبيق هذه التعديلات في Firebase Console، سيعمل تسجيل الدخول عبر جوجل وكذلك حفظ البيانات وحلقات التدبر بنجاح!
