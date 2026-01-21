-- =====================================================
-- Lingo Master Database Export
-- تصدير قاعدة بيانات تطبيق تعلم اللغة الإنجليزية
-- =====================================================
-- ⚠️ تنبيه: قم بتنفيذ هذا الملف في SQL Editor في Supabase Dashboard
-- =====================================================

-- =====================================================
-- الجزء 1: إنشاء الأنواع (ENUMS)
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.daily_goal AS ENUM ('5', '10', '15', '20');
CREATE TYPE public.user_level AS ENUM ('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced');
CREATE TYPE public.exercise_type AS ENUM ('mcq', 'fill_blank', 'reorder', 'listening', 'translation');

-- =====================================================
-- الجزء 2: إنشاء الجداول
-- =====================================================

-- جدول الملفات الشخصية
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    country_code TEXT,
    level user_level DEFAULT 'beginner',
    xp INTEGER DEFAULT 0,
    weekly_xp INTEGER DEFAULT 0,
    monthly_xp INTEGER DEFAULT 0,
    week_start DATE DEFAULT (date_trunc('week', now()))::date,
    month_start DATE DEFAULT (date_trunc('month', now()))::date,
    streak_count INTEGER DEFAULT 0,
    last_study_date DATE,
    user_level INTEGER DEFAULT 1,
    daily_goal daily_goal DEFAULT '10',
    interests TEXT[],
    is_premium BOOLEAN DEFAULT false,
    is_founder BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    has_taken_placement BOOLEAN DEFAULT false,
    placement_score INTEGER,
    placement_level TEXT,
    placement_taken_at TIMESTAMPTZ,
    current_level TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE(user_id, role)
);

-- جدول الوحدات
CREATE TABLE public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    icon TEXT DEFAULT 'book',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الدروس
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول التمارين
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    type exercise_type NOT NULL,
    prompt_ar TEXT,
    prompt_en TEXT,
    data_json JSONB NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول التقدم
CREATE TABLE public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    hearts_remaining INTEGER DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- جدول الإنجازات
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    icon TEXT DEFAULT 'trophy',
    xp_reward INTEGER DEFAULT 50,
    condition_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إنجازات المستخدمين
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- جدول التحديات
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    challenge_type TEXT NOT NULL DEFAULT 'weekly',
    target_value INTEGER NOT NULL DEFAULT 1,
    reward_xp INTEGER NOT NULL DEFAULT 50,
    reward_achievement_id UUID REFERENCES public.achievements(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول تحديات المستخدمين
CREATE TABLE public.user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    week_start DATE DEFAULT (date_trunc('week', now()))::date,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, challenge_id, week_start)
);

-- جدول الإشعارات
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL DEFAULT 'System',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_type TEXT NOT NULL DEFAULT 'all',
    target_value TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- جدول اختبارات تحديد المستوى
CREATE TABLE public.placement_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 30,
    suggested_level TEXT NOT NULL,
    answers_json JSONB NOT NULL DEFAULT '[]',
    breakdown_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- الجزء 3: إنشاء الدوال
-- =====================================================

-- دالة التحقق من الدور
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- دالة حساب مستوى المستخدم
CREATE OR REPLACE FUNCTION public.compute_user_level(total_xp integer, streak_count integer DEFAULT 0, lessons_completed integer DEFAULT 0)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  base_level integer;
  streak_bonus integer;
  lesson_bonus integer;
BEGIN
  base_level := GREATEST(1, (total_xp / 500) + 1);
  streak_bonus := LEAST(3, streak_count / 30);
  lesson_bonus := LEAST(2, lessons_completed / 50);
  RETURN base_level + streak_bonus + lesson_bonus;
END;
$$;

-- دالة تحديث الوقت
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- دالة إعادة تعيين XP الدوري
CREATE OR REPLACE FUNCTION public.reset_periodic_xp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_week_start date;
  current_month_start date;
BEGIN
  current_week_start := date_trunc('week', now())::date;
  current_month_start := date_trunc('month', now())::date;
  
  IF OLD.week_start IS DISTINCT FROM current_week_start THEN
    NEW.weekly_xp := 0;
    NEW.week_start := current_week_start;
  END IF;
  
  IF OLD.month_start IS DISTINCT FROM current_month_start THEN
    NEW.monthly_xp := 0;
    NEW.month_start := current_month_start;
  END IF;
  
  RETURN NEW;
END;
$$;

-- دالة إنشاء ملف شخصي للمستخدم الجديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- =====================================================
-- الجزء 4: إنشاء المحفزات (Triggers)
-- =====================================================

-- محفز للمستخدمين الجدد
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- الجزء 5: تفعيل RLS وإنشاء السياسات
-- =====================================================

-- تفعيل RLS لجميع الجداول
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_tests ENABLE ROW LEVEL SECURITY;

-- سياسات profiles
CREATE POLICY "Anyone can view profiles for leaderboard" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- سياسات user_roles
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- سياسات units
CREATE POLICY "Admins can manage units" ON public.units FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view units" ON public.units FOR SELECT USING (true);

-- سياسات lessons
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);

-- سياسات exercises
CREATE POLICY "Admins can manage exercises" ON public.exercises FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT USING (true);

-- سياسات progress
CREATE POLICY "Users can manage their own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own progress" ON public.progress FOR SELECT USING (auth.uid() = user_id);

-- سياسات achievements
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- سياسات user_achievements
CREATE POLICY "Users can manage their own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- سياسات challenges
CREATE POLICY "Admins can manage challenges" ON public.challenges FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view active challenges" ON public.challenges FOR SELECT USING (is_active = true);

-- سياسات user_challenges
CREATE POLICY "Users can manage their own challenges" ON public.user_challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own challenges" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);

-- سياسات notifications
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id) OR (target_type = 'all' AND user_id IS NULL));
CREATE POLICY "Users can mark their notifications as read" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id) OR (target_type = 'all' AND user_id IS NULL));

-- سياسات placement_tests
CREATE POLICY "Users can view their own placement tests" ON public.placement_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own placement tests" ON public.placement_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- الجزء 6: إدخال البيانات
-- =====================================================

-- إدخال الوحدات
INSERT INTO public.units (id, title_ar, title_en, description_ar, description_en, order_index, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'الأساسيات', 'Basics', 'تعلم الكلمات والعبارات الأساسية', 'Learn basic words and phrases', 1, 'book-open'),
('22222222-2222-2222-2222-222222222222', 'التحيات والتعارف', 'Greetings', 'كيف تحيي الآخرين وتقدم نفسك', 'How to greet others and introduce yourself', 2, 'hand-wave'),
('33333333-3333-3333-3333-333333333333', 'الأرقام والألوان', 'Numbers & Colors', 'تعلم الأرقام والألوان بالإنجليزية', 'Learn numbers and colors in English', 3, 'palette');

-- إدخال الدروس
INSERT INTO public.lessons (id, unit_id, title_ar, title_en, description_ar, description_en, order_index, xp_reward) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'الضمائر', 'Pronouns', 'تعلم ضمائر المتكلم والمخاطب والغائب', 'Learn personal pronouns', 1, 10),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'أفعال الكينونة', 'To Be Verbs', 'تعلم كيفية استخدام am, is, are', 'Learn how to use am, is, are', 2, 15),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'الأسئلة البسيطة', 'Simple Questions', 'تعلم كيفية طرح الأسئلة البسيطة', 'Learn how to ask simple questions', 3, 15);

-- إدخال التمارين
INSERT INTO public.exercises (id, lesson_id, type, prompt_ar, prompt_en, data_json, order_index) VALUES
('f40af6c3-eda5-44b3-94d0-d1c8d168677e', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'ما هو الضمير الصحيح للمتكلم؟', 'What is the correct pronoun for "أنا"?', '{"correct": 0, "hint_ar": "الضمير الأول للمتكلم", "hint_en": "First person singular", "options": ["I", "You", "He", "She"]}', 1),
('7376b244-7853-4f5b-b430-7d2fab611349', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mcq', 'ما معنى "They"؟', 'What does "They" mean?', '{"correct": 3, "hint_ar": "ضمير الجمع للغائب", "hint_en": "Third person plural", "options": ["أنت", "هو", "هي", "هم"]}', 2),
('a89a0c35-6b22-43c0-8a63-45de8aa86898', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fill_blank', 'أكمل الفراغ: ___ am a student', 'Fill in the blank: ___ am a student', '{"answer": "I", "alternatives": ["i"], "hint_ar": "ضمير المتكلم المفرد", "hint_en": "First person singular pronoun"}', 3),
('fed70467-5fdc-415c-827e-f7fd143e0b76', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'translation', 'ترجم إلى الإنجليزية: هي طالبة', 'Translate to English: هي طالبة', '{"answer": "She is a student", "alternatives": ["she is a student", "She''s a student", "she''s a student"], "hint_ar": "استخدم ضمير المؤنث الغائب", "hint_en": "Use the feminine third person pronoun"}', 4),
('8d29f76d-0b61-4118-80e0-bf247a662f9d', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'اختر الفعل الصحيح: I ___ a teacher', 'Choose the correct verb: I ___ a teacher', '{"correct": 0, "hint_ar": "استخدم مع ضمير المتكلم I", "hint_en": "Used with the pronoun I", "options": ["am", "is", "are", "be"]}', 1),
('cb9d8cbf-339d-49e1-9519-d364f085eb45', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'mcq', 'اختر الفعل الصحيح: She ___ beautiful', 'Choose the correct verb: She ___ beautiful', '{"correct": 1, "hint_ar": "استخدم مع ضمائر المفرد الغائب", "hint_en": "Used with third person singular", "options": ["am", "is", "are", "be"]}', 2),
('ac0c8679-6d67-4367-959e-381edd6a9ab9', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fill_blank', 'أكمل: They ___ my friends', 'Fill in: They ___ my friends', '{"answer": "are", "alternatives": ["Are"], "hint_ar": "استخدم مع ضمائر الجمع", "hint_en": "Used with plural pronouns"}', 3),
('6ff1fbb2-6593-427a-95ef-648563ad7688', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'translation', 'ترجم: نحن سعداء', 'Translate: نحن سعداء', '{"answer": "We are happy", "alternatives": ["we are happy", "We''re happy", "we''re happy"], "hint_ar": "استخدم We مع are", "hint_en": "Use We with are"}', 4),
('829bf72d-68da-4cbb-a834-75d216bc096f', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'كيف تسأل عن الاسم بالإنجليزية؟', 'How do you ask for someone''s name in English?', '{"correct": 0, "hint_ar": "استخدم What للسؤال عن الاسم", "hint_en": "Use What to ask about names", "options": ["What is your name?", "How is your name?", "Who is your name?", "Where is your name?"]}', 1),
('581defff-cec4-4fd3-b9f4-453e8ffd7037', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'ما معنى: How are you?', 'What does "How are you?" mean?', '{"correct": 1, "hint_ar": "سؤال عن الحالة", "hint_en": "Asking about condition", "options": ["من أنت؟", "كيف حالك؟", "أين أنت؟", "ماذا تفعل؟"]}', 2),
('ff60cf7f-8af0-4e77-a80a-f72d935335c0', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'reorder', 'رتب الكلمات لتكوين سؤال', 'Reorder to form a question', '{"answer": "Where are you from?", "correct_order": [1, 0, 2, 3, 4], "hint_ar": "ابدأ بكلمة الاستفهام", "hint_en": "Start with the question word", "words": ["are", "Where", "you", "from", "?"]}', 3),
('86ae3525-f965-46d2-8a18-d55066286ee2', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'translation', 'ترجم: ما اسمك؟', 'Translate: ما اسمك؟', '{"answer": "What is your name?", "alternatives": ["what is your name?", "What''s your name?", "what''s your name?"], "hint_ar": "استخدم What", "hint_en": "Use What"}', 4),
('4f0b9d6e-7c8a-4b3d-9e2f-1a5c7d8e9f0b', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'mcq', 'كيف تسأل عن المكان؟', 'How do you ask about a place?', '{"correct": 0, "hint_ar": "استخدم Where", "hint_en": "Use Where", "options": ["Where", "What", "Who", "When"]}', 5);

-- إدخال الإنجازات
INSERT INTO public.achievements (id, key, title_ar, title_en, description_ar, description_en, icon, xp_reward, condition_json) VALUES
('9d4a6ea6-502b-4534-b33c-6123731d2e04', 'first_lesson', 'الدرس الأول', 'First Lesson', 'أكملت درسك الأول!', 'You completed your first lesson!', 'star', 50, '{"type": "first_lesson", "value": 1}'),
('75bc6d47-79c0-4a9a-ae4a-d73d83d22424', 'perfect_lesson', 'درس مثالي', 'Perfect Score', 'أكمل درساً بدون أخطاء', 'Complete a lesson without mistakes', 'check-circle', 75, '{"type": "perfect_lesson", "value": 1}'),
('5a288d7f-4a08-442f-987d-27fda3aebc66', 'xp_100', '100 نقطة', 'XP Hunter', 'اجمع 100 نقطة خبرة', 'Earn 100 XP', 'zap', 50, '{"type": "xp_reached", "value": 100}'),
('d29abc53-5785-4e92-8686-3edc59282485', 'xp_500', '500 نقطة', 'XP Champion', 'اجمع 500 نقطة خبرة', 'Earn 500 XP', 'zap', 100, '{"type": "xp_reached", "value": 500}'),
('7ee7f970-7dc8-49de-a2a6-1668496e0d7d', 'xp_1000', 'ألف نقطة', '1000 XP', 'وصلت إلى 1000 نقطة خبرة', 'Reached 1000 XP', 'star', 100, '{"type": "xp_reached", "value": 1000}'),
('70520286-c54e-49a1-a1ad-36f103177be4', 'xp_5000', 'خمسة آلاف', '5000 XP', 'وصلت إلى 5000 نقطة خبرة', 'Reached 5000 XP', 'star', 200, '{"type": "xp_reached", "value": 5000}'),
('b2d7e1fb-e76c-4dc0-a251-d4b1eaf03dfa', 'streak_3', 'ثلاثة أيام متتالية', '3 Day Streak', 'تعلم لمدة 3 أيام متتالية', 'Learn for 3 consecutive days', 'flame', 100, '{"type": "streak_reached", "value": 3}'),
('a9e4f3e2-09a7-42bc-9327-1ba4e3109527', 'streak_7', 'أسبوع متواصل', 'Week Streak', 'حافظت على سلسلة 7 أيام', 'Maintained a 7-day streak', 'flame', 200, '{"type": "streak_reached", "value": 7}'),
('4357200d-0d7f-439d-8dad-a8d6f8ad8196', 'streak_30', 'شهر متواصل', 'Month Streak', 'حافظت على سلسلة 30 يوم', 'Maintained a 30-day streak', 'flame', 150, '{"type": "streak_reached", "value": 30}'),
('626a4625-81f1-4b02-9b19-22e8b8c7a0af', 'lessons_30', 'متعلم نشط', 'Active Learner', 'أكملت 30 درساً', 'Completed 30 lessons', 'graduation-cap', 100, '{"type": "lessons_completed", "value": 30}'),
('3adb30d6-24b8-4a90-89a8-6ec60ac985e8', 'unit_completed', 'وحدة كاملة', 'Unit Complete', 'أكملت وحدة كاملة', 'Completed a full unit', 'check-circle', 50, '{"type": "unit_completed", "value": 1}'),
('e980875c-f213-4155-9302-01a1a584dc58', 'complete_a1', 'إتمام A1', 'A1 Complete', 'أكملت مستوى A1 بالكامل', 'Completed the entire A1 level', 'award', 300, '{"type": "level_completed", "level": "A1"}');

-- إدخال التحديات
INSERT INTO public.challenges (id, key, name_ar, name_en, description_ar, description_en, challenge_type, target_value, reward_xp, is_active) VALUES
('ff648887-a7e4-434f-9fd3-31254d62fa70', 'streak_7_days', 'سلسلة 7 أيام', '7-Day Streak', 'حافظ على سلسلة تعلم لمدة 7 أيام متتالية', 'Maintain a learning streak for 7 consecutive days', 'weekly', 7, 100, true),
('cba9dd2e-44d0-4c0e-9579-27c8978bbe45', 'complete_5_lessons', 'أكمل 5 دروس', 'Complete 5 Lessons', 'أكمل 5 دروس هذا الأسبوع', 'Complete 5 lessons this week', 'weekly', 5, 75, true),
('a0326646-a1a9-40e4-8208-9351b0446565', 'earn_300_xp', 'اكسب 300 XP', 'Earn 300 XP', 'اكسب 300 نقطة خبرة هذا الأسبوع', 'Earn 300 XP this week', 'weekly', 300, 50, true),
('21c969ff-023e-4d9f-8f36-d961d0874e7d', 'daily_practice', 'تمرين يومي', 'Daily Practice', 'تدرب كل يوم لمدة 5 أيام', 'Practice every day for 5 days', 'weekly', 5, 80, true);

-- =====================================================
-- تم التصدير بنجاح! ✅
-- =====================================================
