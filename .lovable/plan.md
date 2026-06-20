
# خطة التحديث الشامل للدروس

## 1. تعديل قاعدة البيانات (migration واحد)

سأرسل migration بهذه التغييرات:

- جدول `weak_points` جديد لتخزين الكلمات/التمارين الخاطئة لكل مستخدم:
  - `user_id`, `lesson_id`, `item_type` (word/exercise), `item_key` (الكلمة الإنجليزية أو معرّف التمرين), `item_data` (jsonb: الترجمة، النوع، آخر إجابة خاطئة)، `mistakes_count`, `last_mistake_at`, `mastered` (boolean), `mastered_at`
  - UNIQUE على `(user_id, lesson_id, item_key)` للتجميع التلقائي
- إضافة عمود `needs_review boolean` على جدول `progress` للدلالة على الدروس اللي عبرها بأقل من 50%
- GRANTs + RLS كاملة (المستخدم يقرأ/يكتب صفّه فقط، service_role كامل)

## 2. تقصير محتوى الدروس (frontend فقط - بدون تغيير قاعدة البيانات)

كل ملفات `src/lib/{a1,a2,b1,b2,c1,c2}-lessons-unit*.ts` فيها 300 درس. بدل ما أعيد كتابة 300 درس يدوياً (مستحيل عملياً وبكلفة هائلة)، الحل العملي:

- إنشاء `src/lib/lessonTransform.ts` - دالة `compactLesson()` تأخذ `LessonContent` الأصلي وترجع نسخة مختصرة على الطاير:
  - `vocab`: أول 4 كلمات فقط
  - `exercises`: أول 3 تمارين فقط
  - `quiz`: أول 2 أسئلة فقط
  - `sentences`: أول 2 فقط
- تطبيقها داخل `getLessonContent()` في `a1-lessons.ts` وبقية المستويات
- النتيجة: كل الدروس تصير فورياً أقصر بدون لمس 300 ملف، وتقدر تتراجع بسهولة

## 3. تمرين تكلّم جديد (Speaking)

- نوع تمرين جديد `'speaking'` في `ExerciseRenderer.tsx`
- يعتمد على `window.SpeechRecognition` / `webkitSpeechRecognition` (مجاني، en-US)
- يعرض جملة بالإنجليزية + زر مايك دائري + موجة بصرية بسيطة
- يقارن النص المنطوق مع الجملة المطلوبة (Levenshtein tolerance ~80%)
- يُحقن تلقائياً كتمرين إضافي في `compactLesson()` (تمرين رابع: انطق الجملة الأولى)

## 4. منطق العبور المفتوح

في `LessonPlayer.tsx`:
- إزالة الحاجز عند `score < passingScore` - يقدر يضغط "التالي" دائماً
- إذا `score < 50`: عرض مودال نهائي ينصحه بإعادة الدرس + يحفظ `needs_review = true` في `progress`
- **يحصل كامل XP في كل الحالات** (حسب اختيارك)
- بادج أصفر "يحتاج مراجعة" على بطاقة الدرس في `CourseUnit.tsx` لما `needs_review = true`

## 5. تتبع نقاط الضعف تلقائياً

- في `ExerciseRenderer.tsx` و `LessonPlayer.tsx`: عند كل إجابة خاطئة، استدعاء `recordWeakPoint(lesson_id, item_key, item_data)`
- hook جديد `src/hooks/useWeakPoints.ts` بـ:
  - `recordMistake()` - upsert يزيد `mistakes_count`
  - `markMastered()` - يضع `mastered = true` بعد 3 إجابات صحيحة متتالية بالمراجعة
  - `useWeakPoints()` - query لجلب كل النقاط غير المتقنة

## 6. واجهة نقاط الضعف (مكانين)

- **صفحة مستقلة** `src/pages/WeakPoints.tsx` على `/app/weak-points`:
  - قائمة الكلمات الخاطئة مع الترجمة + عدد الأخطاء
  - زر "راجع الآن" يفتح وضع flash-cards تفاعلي
  - تبويبين: كلمات / تمارين
  - رابط بـ `SidebarDashboard.tsx`
- **بطاقة بالـ Dashboard الرئيسي** (`SidebarDashboard.tsx`): widget مدمج يعرض أعلى 3 نقاط ضعف + زر "عرض الكل"

## 7. تفاصيل تقنية

```text
Frontend stack:
- Web Speech API (zero cost)
- Framer Motion (موجود) للانتقالات
- React Query لتحديث نقاط الضعف

Files to create:
- src/lib/lessonTransform.ts
- src/hooks/useWeakPoints.ts
- src/pages/WeakPoints.tsx
- src/components/SpeakingExercise.tsx
- src/components/WeakPointsWidget.tsx

Files to edit:
- src/lib/a1-lessons.ts ... c2-lessons.ts (تمرير عبر compactLesson)
- src/components/ExerciseRenderer.tsx (إضافة speaking + تسجيل الأخطاء)
- src/pages/LessonPlayer.tsx (عبور مفتوح + needs_review)
- src/pages/CourseUnit.tsx (بادج المراجعة)
- src/components/SidebarDashboard.tsx (widget + رابط)
- src/App.tsx (route جديد)
```

ملاحظة: SpeechRecognition ما يشتغل على Safari/iOS بشكل كامل - راح أعرض زر "تخطي" للمتصفحات غير المدعومة.

أوافق وأبدأ التنفيذ؟
