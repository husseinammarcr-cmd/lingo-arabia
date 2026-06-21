import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  Star,
  Users,
  BookOpen,
  Mic,
  PenTool,
  MessageCircle,
  Globe,
  Award,
  Sparkles,
  Target,
} from 'lucide-react';
import { CURRICULUM } from '@/lib/curriculum';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';

interface LessonUnit {
  unitId: string;
  unitTitleAr: string;
  unitTitleEn: string;
  lessonId: string;
  lessonTitleAr: string;
  lessonTitleEn: string;
  xpReward: number;
}

interface LevelGroup {
  levelCode: string;
  levelTitleAr: string;
  levelTitleEn: string;
  units: LessonUnit[];
}

const getFreeLessons = (): LevelGroup[] => {
  return CURRICULUM.map((level) => ({
    levelCode: level.code,
    levelTitleAr: level.titleAr,
    levelTitleEn: level.titleEn,
    units: level.units.map((unit) => ({
      unitId: unit.id,
      unitTitleAr: unit.titleAr,
      unitTitleEn: unit.titleEn,
      lessonId: unit.lessons[0].id,
      lessonTitleAr: unit.lessons[0].titleAr,
      lessonTitleEn: unit.lessons[0].titleEn,
      xpReward: unit.lessons[0].xpReward,
    })),
  }));
};

const LEVEL_THEME: Record<string, { grad: string; circle: string; text: string; icon: typeof BookOpen }> = {
  A1: { grad: 'linear-gradient(145deg, #cdff4f, #a7e31b)', circle: '#dcff82', text: '#111', icon: BookOpen },
  A2: { grad: 'linear-gradient(145deg, #a574ff, #753aeb)', circle: '#8b52ff', text: '#fff', icon: Mic },
  B1: { grad: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)', circle: '#ffb8da', text: '#111', icon: PenTool },
  B2: { grad: 'linear-gradient(145deg, #5cdcff, #2196f3)', circle: '#86e4ff', text: '#111', icon: MessageCircle },
  C1: { grad: 'linear-gradient(145deg, #ffae3a, #ff6a13)', circle: '#ffce8a', text: '#111', icon: Globe },
  C2: { grad: 'linear-gradient(145deg, #ffe27a, #f1b733)', circle: '#ffea8a', text: '#111', icon: Award },
};

const LEVEL_DESC: Record<string, string> = {
  A1: 'الأساسيات والتحيات اليومية',
  A2: 'المحادثات البسيطة والمواقف اليومية',
  B1: 'التعبير عن الآراء والمواضيع المألوفة',
  B2: 'النقاشات المتقدمة والنصوص المعقدة',
  C1: 'الطلاقة والاستخدام الأكاديمي',
  C2: 'الإتقان والتعبير الاحترافي',
};

const FreeLessons = () => {
  const { user } = useAuth();
  const freeLessons = getFreeLessons();
  const totalLessons = freeLessons.reduce((acc, l) => acc + l.units.length, 0);
  const [expanded, setExpanded] = useState<string | null>(freeLessons[0]?.levelCode ?? null);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دروس إنجليزية مجانية - LingoArab',
    url: 'https://lingoarab.com/free-lessons',
    inLanguage: ['ar', 'en'],
    hasPart: freeLessons.flatMap((level) =>
      level.units.map((u) => ({
        '@type': 'Course',
        name: `${u.lessonTitleEn} - ${level.levelCode}`,
        educationalLevel: level.levelCode,
      })),
    ),
  };

  return (
    <>
      <Helmet>
        <title>دروس إنجليزية مجانية | LingoArab</title>
        <meta
          name="description"
          content="استكشف دروسنا المجانية لتعلم اللغة الإنجليزية. دروس تفاعلية مصممة خصيصاً للناطقين بالعربية من المستوى A1 إلى C2."
        />
        <link rel="canonical" href="https://lingoarab.com/free-lessons" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <DashboardLayout
        titlePrimary="Free"
        titleAccent="lessons."
        gradient="linear-gradient(120deg, #cdff4f 0%, #5cdcff 100%)"
        glow1="rgba(186,243,58,0.20)"
        glow2="rgba(92,220,255,0.18)"
        showGreeting={!!user}
        testId="free-lessons-page"
      >
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
          style={{
            background:
              'linear-gradient(135deg, #cdff4f 0%, #a7e31b 60%, #5cdcff 100%)',
            color: '#111',
          }}
          data-testid="free-hero"
        >
          <span
            className="absolute rounded-full pointer-events-none"
            style={{
              bottom: -80,
              left: -80,
              width: 240,
              height: 240,
              background: 'rgba(255,255,255,0.15)',
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-black/15 flex items-center justify-center flex-shrink-0">
              <Book className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-[0.18em] uppercase opacity-75 mb-1">
                Free Forever
              </p>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
                {totalLessons} درس مجاني للجميع
              </h2>
              <p className="text-sm font-bold opacity-85">
                ابدأ رحلتك في تعلم الإنجليزية من المستوى المبتدئ إلى الإتقان
              </p>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-2 mt-5">
            <Link to={user ? '/app/courses' : '/auth'}>
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 rounded-full bg-[#111] text-[#cdff4f] font-extrabold text-sm flex items-center gap-2 shadow-lg"
                data-testid="cta-start"
              >
                <GraduationCap className="w-4 h-4" />
                {user ? 'استمر في التعلم' : 'ابدأ التعلم مجاناً'}
              </motion.span>
            </Link>
            <Link to="/placement-test">
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 rounded-full bg-black/15 text-[#111] font-extrabold text-sm flex items-center gap-2"
                data-testid="cta-placement"
              >
                <Target className="w-4 h-4" />
                حدد مستواك
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6" data-testid="free-stats">
          {[
            { label: 'مستويات CEFR', value: CURRICULUM.length, accent: '#cdff4f' },
            { label: 'درس مجاني', value: totalLessons, accent: '#a574ff' },
            { label: 'مجاني', value: '100%', accent: '#ff9dcb' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-3 sm:p-4 bg-white/[0.04] border border-white/8 backdrop-blur-sm"
            >
              <div
                className="text-2xl sm:text-3xl font-black"
                style={{ color: s.accent }}
              >
                {s.value}
              </div>
              <p className="text-[11px] text-white/55 font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Section title */}
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-3">
          تصفح الدروس حسب المستوى
        </h2>

        {/* Levels accordion */}
        <div className="space-y-3 mb-8">
          {freeLessons.map((level, idx) => {
            const theme = LEVEL_THEME[level.levelCode] || LEVEL_THEME.A1;
            const LevelIcon = theme.icon;
            const isOpen = expanded === level.levelCode;
            return (
              <motion.div
                key={level.levelCode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
                className="rounded-3xl overflow-hidden bg-[#161618] border border-white/8"
                data-testid={`level-${level.levelCode}`}
              >
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : level.levelCode)
                  }
                  data-testid={`level-toggle-${level.levelCode}`}
                  className="w-full px-4 py-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: theme.grad, color: theme.text }}
                  >
                    <LevelIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center gap-2 justify-end">
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${theme.grad}`,
                          color: theme.text,
                        }}
                      >
                        {level.levelCode}
                      </span>
                      <p className="font-extrabold text-white text-sm">
                        {level.levelTitleAr}
                      </p>
                    </div>
                    <p className="text-[11px] text-white/45 mt-0.5">
                      {LEVEL_DESC[level.levelCode]}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-white/50 px-2 py-1 rounded-md bg-white/5 flex-shrink-0">
                    {level.units.length} درس
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-white/50 transition-transform flex-shrink-0',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {level.units.map((unit) => (
                          <Link
                            key={unit.lessonId}
                            to={`/preview/lesson/${unit.lessonId}`}
                            className="block"
                            data-testid={`lesson-${unit.lessonId}`}
                          >
                            <motion.div
                              whileHover={{ y: -2 }}
                              className="rounded-xl p-3 flex items-center gap-3 bg-white/[0.04] border border-white/8 hover:border-white/20 transition-colors"
                            >
                              <div
                                className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: theme.grad,
                                  color: theme.text,
                                }}
                              >
                                <Book className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0 text-right">
                                <p className="font-bold text-white text-xs truncate">
                                  {unit.unitTitleAr}
                                </p>
                                <p
                                  dir="ltr"
                                  className="text-[10px] text-white/45 truncate"
                                >
                                  {unit.lessonTitleEn}
                                </p>
                              </div>
                              <span
                                className="flex items-center gap-0.5 text-[10px] font-extrabold flex-shrink-0 px-1.5 py-0.5 rounded-md bg-white/8 text-[#cdff4f]"
                              >
                                <Star className="h-2.5 w-2.5 fill-[#cdff4f]" />
                                {unit.xpReward}
                              </span>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 overflow-hidden text-center mb-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(205,255,79,0.10) 0%, rgba(165,116,255,0.12) 60%, rgba(20,20,20,0.7) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Users className="w-10 h-10 mx-auto mb-3 text-[#cdff4f]" />
          <h2 className="text-xl font-extrabold text-white mb-2">
            انضم إلى آلاف المتعلمين
          </h2>
          <p className="text-sm text-white/60 mb-5 max-w-md mx-auto">
            سجّل الآن للوصول إلى جميع الدروس، تتبع تقدمك، واكسب نقاط XP!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to={user ? '/app/courses' : '/auth'}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#cdff4f] text-[#111] font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                {user ? 'استمر في التعلم' : 'إنشاء حساب مجاني'}
              </span>
            </Link>
            <Link to={user ? '/app/courses' : '/courses'}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white border border-white/15 font-bold text-sm">
                <ChevronLeft className="w-4 h-4" />
                استكشف المنهج
              </span>
            </Link>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
};

export default FreeLessons;
