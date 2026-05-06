import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CURRICULUM, getTotalLessonsCount, getLessonById } from '@/lib/curriculum';
import {
  Home,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Settings as SettingsIcon,
  HelpCircle,
  BookMarked,
  Mic2,
  ScrollText,
  Lock,
  Target,
  Sparkles,
  GraduationCap,
  Trophy,
  ChevronLeft,
  Menu as MenuIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import WelcomeBackOverlay from '@/components/WelcomeBackOverlay';
import { useUserProgress, isLevelUnlocked } from '@/hooks/useProgress';
import SidebarDashboard from '@/components/SidebarDashboard';
import Lottie from 'lottie-react';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';

// ============= Course JSON-LD =============
const COURSE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Learn English for Arabic Speakers',
  description:
    'Interactive English courses designed for Arabic speakers from A1 to C2 levels. 300 lessons covering vocabulary, grammar, listening, and conversation skills.',
  provider: {
    '@type': 'Organization',
    name: 'Lingo Arab',
    sameAs: 'https://lingoarab.com',
    url: 'https://lingoarab.com',
  },
  inLanguage: ['en', 'ar'],
  isAccessibleForFree: true,
};

// Sidebar nav items mapped to existing app routes
const NAV_ITEMS = [
  { icon: Home, labelAr: 'الرئيسية', labelEn: 'Home', path: '/app/courses', active: true },
  { icon: BookOpen, labelAr: 'الدروس', labelEn: 'Lessons', path: '/app/courses', active: false },
  { icon: CheckCircle2, labelAr: 'التحديات', labelEn: 'Practice', path: '/challenges', active: false },
  { icon: BarChart3, labelAr: 'التقدم', labelEn: 'Progress', path: '/leaderboard', active: false },
  { icon: SettingsIcon, labelAr: 'الإعدادات', labelEn: 'Settings', path: '/settings', active: false },
];

// Level → vibrant card color (cycles through 3 colors from the requested design)
const LEVEL_CARD_THEME: Record<
  string,
  { gradient: string; circle: string; textColor: string; trackFill: string; accent: string }
> = {
  A1: {
    gradient: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
    circle: '#dcff82',
    textColor: '#111111',
    trackFill: '#cdff4f',
    accent: 'text-[#cdff4f]',
  },
  A2: {
    gradient: 'linear-gradient(145deg, #a574ff, #753aeb)',
    circle: '#8b52ff',
    textColor: '#ffffff',
    trackFill: '#a574ff',
    accent: 'text-[#a574ff]',
  },
  B1: {
    gradient: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
    circle: '#ffb8da',
    textColor: '#111111',
    trackFill: '#ff9dcb',
    accent: 'text-[#ff9dcb]',
  },
  B2: {
    gradient: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
    circle: '#dcff82',
    textColor: '#111111',
    trackFill: '#cdff4f',
    accent: 'text-[#cdff4f]',
  },
  C1: {
    gradient: 'linear-gradient(145deg, #a574ff, #753aeb)',
    circle: '#8b52ff',
    textColor: '#ffffff',
    trackFill: '#a574ff',
    accent: 'text-[#a574ff]',
  },
  C2: {
    gradient: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
    circle: '#ffb8da',
    textColor: '#111111',
    trackFill: '#ff9dcb',
    accent: 'text-[#ff9dcb]',
  },
};

const ACTION_CARDS = [
  {
    titleAr: 'ابدأ\nدرسًا جديدًا',
    icon: BookMarked,
    style: {
      gradient: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
      circle: '#dcff82',
      textColor: '#111111',
    },
    action: 'lesson' as const,
  },
  {
    titleAr: 'تدرّب على\nالمحادثة',
    icon: Mic2,
    style: {
      gradient: 'linear-gradient(145deg, #a574ff, #753aeb)',
      circle: '#8b52ff',
      textColor: '#ffffff',
    },
    action: 'tutor' as const,
  },
  {
    titleAr: 'مراجعة\nالقواعد',
    icon: ScrollText,
    style: {
      gradient: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
      circle: '#ffb8da',
      textColor: '#111111',
    },
    action: 'placement' as const,
  },
];

const AppCourses = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const { data: progressData } = useUserProgress();
  

  const [showWelcome, setShowWelcome] = useState(() => {
    const lastShown = localStorage.getItem('welcome_back_date');
    const today = new Date().toDateString();
    return lastShown !== today;
  });

  const handleWelcomeContinue = () => {
    localStorage.setItem('welcome_back_date', new Date().toDateString());
    setShowWelcome(false);
  };

  const hasTakenPlacement = profile?.has_taken_placement ?? false;

  const completedLessonIds = useMemo(() => {
    if (!progressData) return [];
    return progressData.filter((p) => p.completed).map((p) => p.lesson_id);
  }, [progressData]);

  // Per-level progress
  const levelProgressMap = useMemo(() => {
    const map: Record<string, { completed: number; total: number; progress: number }> = {};
    for (const level of CURRICULUM) {
      let completed = 0;
      let total = 0;
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          total++;
          if (completedLessonIds.includes(lesson.id)) completed++;
        }
      }
      map[level.code] = {
        completed,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    }
    return map;
  }, [completedLessonIds]);

  // Recent activity = last completed lessons (max 3) — uses curriculum lookup for titles
  const recentActivity = useMemo(() => {
    if (!progressData) return [];
    return [...progressData]
      .filter((p) => p.completed)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 3)
      .map((p, i) => {
        const found = getLessonById(p.lesson_id);
        const themeColors = ['#cdff4f', '#a574ff', '#ff9dcb'];
        return {
          id: p.id,
          title: found?.lesson.titleAr ?? p.lesson_id,
          percent: p.score ?? 100,
          color: themeColors[i % 3],
        };
      });
  }, [progressData]);

  useEffect(() => {
    if (!isLoading && !user) navigate('/auth');
  }, [user, isLoading, navigate]);

  // Force dark background on html/body so iOS overscroll & rubber-band areas don't show white
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = '#141414';
    body.style.backgroundColor = '#141414';
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, []);

  const handleActionCard = (action: 'lesson' | 'tutor' | 'placement') => {
    if (action === 'lesson') {
      // Jump to first level user can access
      const firstUnlocked =
        CURRICULUM.find((lvl) =>
          isAdmin
            ? true
            : isLevelUnlocked(lvl.code, profile?.placement_level, profile?.current_level),
        ) ?? CURRICULUM[0];
      navigate(`/app/courses/${firstUnlocked.code.toLowerCase()}`);
    } else if (action === 'tutor') {
      navigate('/ai-tutor');
    } else if (action === 'placement') {
      navigate('/placement-test');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161618] text-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          جاري التحميل...
        </motion.div>
      </div>
    );
  }

  const totalLessons = getTotalLessonsCount();
  const firstName = profile?.name?.split(' ')[0] ?? 'بك';

  return (
    <>
      <Helmet>
        <title>لوحة التعلم | Lingo Arab</title>
        <meta
          name="description"
          content="لوحة التعلم الخاصة بك - تابع دروسك، تدرب على المحادثة، وراجع القواعد في Lingo Arab."
        />
        <script type="application/ld+json">{JSON.stringify(COURSE_SCHEMA)}</script>
      </Helmet>

      {showWelcome && <WelcomeBackOverlay onContinue={handleWelcomeContinue} />}

      {/* Collapsible icon sidebar (toggled via floating button) */}
      <SidebarDashboard />

      {/* ===== Fixed Lottie background (behind everything) ===== */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[#141414]"
        style={{ zIndex: 0 }}
      >
        <Lottie
          animationData={dashboardBgAnimation}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.85,
          }}
        />
        {/* Subtle vignette only — keeps Lottie clearly visible on mobile */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,0.35) 70%, rgba(20,20,20,0.6) 100%)',
          }}
        />
        {/* Light grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(205,255,79,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(205,255,79,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* Force a dark surface only for this page (does NOT toggle the global theme) */}
      <div
        dir="rtl"
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', sans-serif" }}
      >
        {/* ============= Main content ============= */}
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden">
          {/* Aurora glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-24 -right-12 rounded-full"
              style={{
                width: '60vw',
                height: '60vw',
                background:
                  'radial-gradient(circle, rgba(186,243,58,0.22) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />
            <div
              className="absolute"
              style={{
                top: 50,
                right: '25vw',
                width: '50vw',
                height: '50vw',
                background:
                  'radial-gradient(circle, rgba(138,78,255,0.18) 0%, transparent 50%)',
                filter: 'blur(70px)',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Spacer for floating sidebar toggle button */}
          <div className="h-12" />

          {/* Content wrapper */}
          <div className="relative z-10 mx-auto w-full max-w-[900px]">
            {/* Greeting */}
            <div
              className="text-right text-lg sm:text-xl font-bold text-white mb-3"
              style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
            >
              مرحباً، {firstName}
              {isAdmin && (
                <span className="mr-2 text-xs font-medium text-[#cdff4f]">• وضع الأدمن</span>
              )}
            </div>
            <h1
              dir="ltr"
              className="text-white font-bold leading-[1.1] mb-8 sm:mb-10"
              style={{ fontSize: 'min(7vw, 48px)' }}
            >
              How may I help
              <br />
              you today?
            </h1>

            {/* ============= Action cards ============= */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
              {ACTION_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleActionCard(card.action)}
                    className="relative h-[160px] sm:h-[200px] rounded-3xl p-4 sm:p-5 flex flex-col text-right overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                    style={{
                      background: card.style.gradient,
                      color: card.style.textColor,
                    }}
                  >
                    {/* Decorative circle */}
                    <span
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        bottom: -30,
                        left: -30,
                        width: 130,
                        height: 130,
                        backgroundColor: card.style.circle,
                        zIndex: 1,
                      }}
                    />
                    <h3 className="relative z-[5] text-[15px] sm:text-[18px] font-bold leading-[1.25] whitespace-pre-line">
                      {card.titleAr}
                    </h3>
                    <Icon
                      className="absolute z-[5] h-6 w-6 sm:h-7 sm:w-7"
                      style={{ bottom: 20, left: 20 }}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* ============= Placement Test prompt (kept) ============= */}
            {!hasTakenPlacement && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 rounded-2xl p-5 sm:p-6 border border-[#cdff4f]/30 bg-gradient-to-br from-[#cdff4f]/10 via-[#a574ff]/5 to-transparent"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#cdff4f]/20 flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6 text-[#cdff4f]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">حدّد مستواك أولاً</h3>
                    <p className="text-sm text-[#bdbdbd] mb-3">
                      اختبار سريع (5-7 دقائق) لفتح الدروس المناسبة لك.
                    </p>
                    <button
                      onClick={() => navigate('/placement-test')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#cdff4f] text-[#111] font-bold text-sm hover:brightness-110 transition"
                    >
                      <Sparkles className="h-4 w-4" />
                      ابدأ الاختبار
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============= Levels grid ============= */}
            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xl font-semibold text-white">مستويات التعلم</h2>
                <span className="text-xs text-[#8a8a8a]">
                  {totalLessons} درس · 6 مستويات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {CURRICULUM.map((level) => {
                  const theme = LEVEL_CARD_THEME[level.code];
                  const levelProgress = levelProgressMap[level.code];
                  const progress = levelProgress?.progress ?? 0;
                  const totalLevelLessons = level.units.reduce(
                    (s, u) => s + u.lessons.length,
                    0,
                  );
                  const unlocked =
                    isAdmin ||
                    (hasTakenPlacement &&
                      isLevelUnlocked(
                        level.code,
                        profile?.placement_level,
                        profile?.current_level,
                      ));
                  const isCompleted =
                    levelProgress &&
                    levelProgress.completed === levelProgress.total &&
                    levelProgress.total > 0;

                  return (
                    <motion.button
                      key={level.id}
                      whileHover={unlocked ? { y: -3 } : {}}
                      whileTap={unlocked ? { scale: 0.98 } : {}}
                      onClick={() =>
                        unlocked && navigate(`/app/courses/${level.code.toLowerCase()}`)
                      }
                      disabled={!unlocked}
                      className={cn(
                        'relative text-right rounded-2xl p-5 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition',
                        !unlocked && 'opacity-60 cursor-not-allowed',
                      )}
                      style={{
                        background: theme.gradient,
                        color: theme.textColor,
                      }}
                    >
                      {/* Decorative circle */}
                      <span
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          bottom: -40,
                          left: -40,
                          width: 140,
                          height: 140,
                          backgroundColor: theme.circle,
                          zIndex: 1,
                        }}
                      />

                      <div className="relative z-[5] flex items-start justify-between mb-2">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm"
                          style={{ color: theme.textColor }}
                        >
                          {level.code}
                        </span>
                        {!unlocked && <Lock className="h-4 w-4 opacity-80" />}
                        {isCompleted && <CheckCircle2 className="h-5 w-5" />}
                      </div>

                      <h3 className="relative z-[5] text-base sm:text-lg font-bold mb-1">
                        {level.titleAr}
                      </h3>
                      <p
                        dir="ltr"
                        className="relative z-[5] text-xs opacity-80 mb-4"
                        style={{ unicodeBidi: 'isolate' }}
                      >
                        {level.titleEn}
                      </p>

                      <div className="relative z-[5] flex items-center justify-between text-[11px] font-semibold mb-2 opacity-90">
                        <span>{level.units.length} وحدات</span>
                        <span>
                          {levelProgress?.completed ?? 0} / {totalLevelLessons}
                        </span>
                      </div>

                      <div className="relative z-[5] w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-black/60 transition-all"
                          style={{ width: `${unlocked ? progress : 0}%` }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* ============= Recent activity ============= */}
            <section className="pb-10">
              <h2 className="text-xl font-semibold text-white mb-5">النشاط الأخير</h2>

              {recentActivity.length === 0 ? (
                <div className="rounded-2xl p-6 text-center text-[#8a8a8a] bg-[#242424]">
                  <Trophy className="h-8 w-8 mx-auto mb-2 opacity-60" />
                  <p className="text-sm">لم تُكمل أي درس بعد. ابدأ الآن!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentActivity.map((a) => (
                    <div
                      key={a.id}
                      className="bg-[#242424] rounded-2xl px-5 py-4 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#e0e0e0]">{a.title}</span>
                        <span
                          className="font-semibold text-sm"
                          style={{ color: a.color }}
                        >
                          {a.percent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#383838] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${a.percent}%`, backgroundColor: a.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Footer breadcrumbs / quick links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#8a8a8a] pb-8">
              <button onClick={() => navigate('/about')} className="hover:text-white">
                من نحن
              </button>
              <span>·</span>
              <button onClick={() => navigate('/contact')} className="hover:text-white">
                تواصل
              </button>
              <span>·</span>
              <button onClick={() => navigate('/profile')} className="hover:text-white">
                الملف الشخصي
              </button>
              <span>·</span>
              <button onClick={() => signOut()} className="hover:text-white">
                تسجيل الخروج
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AppCourses;
