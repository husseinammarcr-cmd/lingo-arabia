import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import {
  Trophy,
  Target,
  Star,
  Flame,
  BookOpen,
  Settings as SettingsIcon,
  TrendingUp,
  LogOut,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Award,
  Crown,
  Medal,
  Heart,
  Zap,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import SidebarDashboard from '@/components/SidebarDashboard';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useAuth } from '@/contexts/AuthContext';
import {
  useAchievements,
  useUserAchievements,
  type Achievement,
} from '@/hooks/useAchievements';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';
import { cn } from '@/lib/utils';

/* ===== Achievement icon mapping ===== */
const ACH_ICONS: Record<string, typeof Trophy> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  target: Target,
  book: BookOpen,
  zap: Zap,
  award: Award,
  crown: Crown,
  medal: Medal,
  heart: Heart,
};

/* ===== Helpers ===== */
const getFlagEmoji = (cc?: string | null) => {
  if (!cc) return '🌍';
  return String.fromCodePoint(
    ...cc.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)),
  );
};

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/* ===== Custom XP Ring ===== */
const XpRing = ({
  percent,
  level,
}: {
  percent: number;
  level: number;
}) => {
  const size = 120;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
      data-testid="xp-ring"
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="xpRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cdff4f" />
            <stop offset="100%" stopColor="#a574ff" />
          </linearGradient>
        </defs>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#xpRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      {/* center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-white/55 tracking-wider">
          LEVEL
        </span>
        <span className="text-3xl font-black text-white leading-none">
          {level}
        </span>
        <span className="mt-1 text-[10px] font-extrabold text-[#cdff4f]">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, signOut, isAdmin } = useAuth();
  const [showLevelDialog, setShowLevelDialog] = useState(false);

  const { data: achievements, isLoading: loadingA } = useAchievements();
  const { data: userAchievements, isLoading: loadingUA } = useUserAchievements();

  const showVerifiedBadge =
    profile?.is_verified || profile?.is_founder || isAdmin;

  const currentLevel = profile?.user_level || 1;
  const currentXP = profile?.xp || 0;
  const xpPerLevel = 500;
  const xpForCurrentLevel = (currentLevel - 1) * xpPerLevel;
  const xpForNextLevel = currentLevel * xpPerLevel;
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const progressPercent = Math.min((xpInCurrentLevel / xpPerLevel) * 100, 100);
  const xpNeeded = xpForNextLevel - currentXP;

  const firstName =
    profile?.display_name?.split(' ')[0] ??
    profile?.name?.split(' ')[0] ??
    'بك';

  /* ===== Week calendar derivation ===== */
  const weekDays = useMemo(() => {
    const today = new Date();
    const last = profile?.last_study_date;
    const streak = profile?.streak_count ?? 0;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const iso = d.toISOString().split('T')[0];
      const isToday = i === 6;
      // Mark last `streak` days (ending today if last==today) as active
      const lastIsToday = last === iso || (isToday && last === iso);
      const activeWindow = lastIsToday ? streak : Math.max(0, streak - 1);
      const isActive = i >= 7 - activeWindow;
      return {
        dayIdx: d.getDay(),
        date: iso,
        dayLabel: ARABIC_DAYS[d.getDay()].slice(0, 3),
        dayNum: d.getDate(),
        isToday,
        isActive,
      };
    });
  }, [profile?.streak_count, profile?.last_study_date]);

  const todayActive = profile?.last_study_date === new Date().toISOString().split('T')[0];

  /* ===== Achievements derivation ===== */
  const { earned, earnedIds, total } = useMemo(() => {
    const ids = new Set((userAchievements ?? []).map((ua) => ua.achievement_id));
    return {
      earnedIds: ids,
      earned: ids.size,
      total: achievements?.length ?? 0,
    };
  }, [achievements, userAchievements]);

  const earnedByAchId = useMemo(() => {
    const m = new Map<string, string>();
    (userAchievements ?? []).forEach((ua) => {
      if (ua.earned_at) m.set(ua.achievement_id, ua.earned_at);
    });
    return m;
  }, [userAchievements]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const ph = html.style.backgroundColor;
    const pb = body.style.backgroundColor;
    html.style.backgroundColor = '#141414';
    body.style.backgroundColor = '#141414';
    return () => {
      html.style.backgroundColor = ph;
      body.style.backgroundColor = pb;
    };
  }, []);

  return (
    <>
      <SidebarDashboard />

      {/* Lottie background */}
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
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,0.55) 70%, rgba(20,20,20,0.8) 100%)',
          }}
        />
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

      <div
        dir="rtl"
        data-testid="profile-page"
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif" }}
      >
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden">
          {/* Aurora glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-32 -right-24 rounded-full"
              style={{
                width: '70vw',
                height: '70vw',
                background:
                  'radial-gradient(circle, rgba(186,243,58,0.20) 0%, transparent 60%)',
                filter: 'blur(70px)',
              }}
            />
            <div
              className="absolute"
              style={{
                top: 80,
                right: '20vw',
                width: '55vw',
                height: '55vw',
                background:
                  'radial-gradient(circle, rgba(165,116,255,0.16) 0%, transparent 50%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
              }}
            />
          </div>

          <div className="h-12" />

          <div className="relative z-10 mx-auto w-full max-w-[900px]">
            {/* ===== Header ===== */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="text-right text-base sm:text-lg font-bold text-white/70 mb-2"
                  style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
                  data-testid="profile-greeting"
                >
                  مرحباً، {firstName}
                  {isAdmin && (
                    <span className="mr-2 text-xs font-medium text-[#cdff4f]">
                      • وضع الأدمن
                    </span>
                  )}
                </div>
                <h1
                  dir="ltr"
                  className="text-white font-bold leading-[1.05]"
                  style={{ fontSize: 'min(8.5vw, 56px)' }}
                >
                  Your profile
                  <br />
                  <span
                    style={{
                      background:
                        'linear-gradient(120deg, #cdff4f 0%, #a574ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    at a glance.
                  </span>
                </h1>
              </div>
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                data-testid="profile-back-btn"
                className="h-11 w-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#cdff4f]/40 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ===== Hero card: glassmorphic with XP ring ===== */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowLevelDialog(true)}
              data-testid="profile-hero-card"
              className="relative w-full text-right rounded-3xl p-5 sm:p-6 overflow-hidden border border-white/10 backdrop-blur-md mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(205,255,79,0.12) 0%, rgba(165,116,255,0.10) 50%, rgba(20,20,20,0.7) 100%)',
              }}
            >
              <div className="flex items-center gap-4 sm:gap-5">
                {/* XP Ring on the left */}
                <XpRing percent={progressPercent} level={currentLevel} />

                {/* Profile info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center gap-2 justify-end flex-wrap">
                    {showVerifiedBadge && <VerifiedBadge size="md" />}
                    <h2
                      className="text-xl sm:text-2xl font-extrabold text-white truncate"
                      data-testid="profile-display-name"
                    >
                      {profile?.display_name || profile?.name || 'متعلم'}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-white/55 truncate mt-0.5">
                    {profile?.email}
                  </p>

                  {/* Country + level chips */}
                  <div className="mt-3 flex items-center justify-end gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-white/8 text-[11px] font-bold text-white/80 flex items-center gap-1">
                      <span>{getFlagEmoji(profile?.country_code || null)}</span>
                      <span>{profile?.country_code || 'EARTH'}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#cdff4f]/15 text-[11px] font-extrabold text-[#cdff4f] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {currentXP.toLocaleString('ar-EG')} XP
                    </span>
                  </div>

                  {/* Inline progress hint */}
                  <p className="mt-2.5 text-[11px] text-white/45">
                    {xpNeeded > 0 ? (
                      <>
                        <span className="text-[#cdff4f] font-bold">{xpNeeded}</span> XP
                        للوصول إلى المستوى {currentLevel + 1}
                      </>
                    ) : (
                      <span className="text-[#cdff4f] font-bold">جاهز للترقية للمستوى التالي! 🎉</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Decorative dot pattern */}
              <div
                className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20"
                style={{
                  background:
                    'radial-gradient(circle, #cdff4f 0%, transparent 70%)',
                }}
              />
            </motion.button>

            {/* ===== Stat tiles row ===== */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6" data-testid="stats-row">
              {[
                {
                  label: 'إجمالي XP',
                  value: profile?.xp || 0,
                  icon: Star,
                  grad: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
                  circle: '#dcff82',
                  text: '#111',
                  testid: 'stat-total-xp',
                },
                {
                  label: 'أيام متتالية',
                  value: profile?.streak_count || 0,
                  icon: Flame,
                  grad: 'linear-gradient(145deg, #a574ff, #753aeb)',
                  circle: '#8b52ff',
                  text: '#fff',
                  testid: 'stat-streak',
                },
                {
                  label: 'XP الأسبوع',
                  value: profile?.weekly_xp || 0,
                  icon: TrendingUp,
                  grad: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
                  circle: '#ffb8da',
                  text: '#111',
                  testid: 'stat-weekly-xp',
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="relative h-[120px] sm:h-[140px] rounded-3xl p-3 sm:p-4 flex flex-col justify-between text-right overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    style={{ background: s.grad, color: s.text }}
                    data-testid={s.testid}
                  >
                    <span
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        bottom: -30,
                        left: -30,
                        width: 110,
                        height: 110,
                        backgroundColor: s.circle,
                        zIndex: 1,
                      }}
                    />
                    <div className="relative z-[5] flex items-start justify-between">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="relative z-[5]">
                      <div className="text-2xl sm:text-3xl font-black leading-none">
                        {s.value.toLocaleString('ar-EG')}
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-bold mt-1 opacity-85">
                        {s.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ===== Custom Streak Calendar ===== */}
            <section className="mb-6" data-testid="streak-section">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  سلسلة الدراسة
                </h2>
                <span className="text-xs font-bold text-white/50">آخر 7 أيام</span>
              </div>

              <div
                className="rounded-3xl p-5 border border-white/8 backdrop-blur-md"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,165,0,0.10) 0%, rgba(20,20,20,0.6) 60%)',
                }}
              >
                {/* Streak header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0',
                        (profile?.streak_count ?? 0) > 0
                          ? 'shadow-[0_0_24px_rgba(255,140,40,0.4)]'
                          : '',
                      )}
                      style={{
                        background:
                          (profile?.streak_count ?? 0) > 0
                            ? 'linear-gradient(145deg, #ffae3a, #ff6a13)'
                            : 'rgba(255,255,255,0.06)',
                      }}
                    >
                      <Flame
                        className={cn(
                          'h-7 w-7',
                          (profile?.streak_count ?? 0) > 0
                            ? 'text-white'
                            : 'text-white/40',
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">
                          {profile?.streak_count ?? 0}
                        </span>
                        <span className="text-sm font-bold text-white/60">
                          يوم متتالي
                        </span>
                      </div>
                      <p className="text-[11px] text-white/45 font-medium mt-0.5">
                        {todayActive
                          ? 'أحسنت! تم تسجيل اليوم'
                          : (profile?.streak_count ?? 0) > 0
                          ? 'تعلّم اليوم للحفاظ على السلسلة'
                          : 'ابدأ سلسلة جديدة اليوم'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7-day cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDays.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i }}
                      className="flex flex-col items-center gap-1.5"
                      data-testid={`streak-day-${i}`}
                    >
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          d.isToday ? 'text-[#cdff4f]' : 'text-white/40',
                        )}
                      >
                        {d.dayLabel}
                      </span>
                      <div
                        className={cn(
                          'relative h-11 w-full max-w-[42px] rounded-xl flex items-center justify-center transition-all',
                          d.isActive
                            ? 'shadow-[0_4px_18px_rgba(255,140,40,0.35)]'
                            : '',
                          !d.isActive && d.isToday
                            ? 'border-2 border-[#cdff4f] bg-[#cdff4f]/8'
                            : '',
                          !d.isActive && !d.isToday
                            ? 'bg-white/[0.04] border border-white/8'
                            : '',
                        )}
                        style={
                          d.isActive
                            ? {
                                background:
                                  'linear-gradient(145deg, #ffae3a, #ff6a13)',
                              }
                            : {}
                        }
                      >
                        {d.isActive ? (
                          <Flame className="h-4 w-4 text-white" />
                        ) : (
                          <span
                            className={cn(
                              'text-[11px] font-extrabold',
                              d.isToday ? 'text-[#cdff4f]' : 'text-white/35',
                            )}
                          >
                            {d.dayNum}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== Quick Actions strip ===== */}
            <section className="mb-6" data-testid="quick-actions">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  {
                    label: 'المتصدرين',
                    icon: Trophy,
                    path: '/leaderboard',
                    accent: '#ffe27a',
                    testid: 'quick-leaderboard',
                  },
                  {
                    label: 'التحديات',
                    icon: Target,
                    path: '/challenges',
                    accent: '#ff9dcb',
                    testid: 'quick-challenges',
                  },
                  {
                    label: 'الإعدادات',
                    icon: SettingsIcon,
                    path: '/settings',
                    accent: '#a574ff',
                    testid: 'quick-settings',
                  },
                ].map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(q.path)}
                      data-testid={q.testid}
                      className="relative rounded-2xl px-3 py-4 flex flex-col items-center gap-2 bg-white/[0.04] border border-white/8 hover:border-white/20 transition-colors overflow-hidden group"
                    >
                      <div
                        className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity"
                        style={{
                          background: `radial-gradient(circle, ${q.accent} 0%, transparent 70%)`,
                        }}
                      />
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${q.accent}1f`, color: q.accent }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white/85">
                        {q.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* ===== Custom Achievements Grid ===== */}
            <section className="mb-6" data-testid="achievements-section">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  إنجازاتك
                </h2>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-extrabold text-[#cdff4f]">{earned}</span>
                  <span className="text-white/40 font-bold">/ {total}</span>
                </div>
              </div>

              <div className="rounded-3xl p-4 sm:p-5 bg-[#161618] border border-white/8">
                {loadingA || loadingUA ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-7 w-7 animate-spin text-[#cdff4f]" />
                  </div>
                ) : (achievements?.length ?? 0) === 0 ? (
                  <div className="text-center py-8 text-white/50 text-sm">
                    لا توجد إنجازات متاحة حالياً
                  </div>
                ) : (
                  <>
                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-white/55">التقدّم العام</span>
                        <span className="text-[#cdff4f]">
                          {total > 0 ? Math.round((earned / total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: total > 0 ? `${(earned / total) * 100}%` : '0%',
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              'linear-gradient(90deg, #cdff4f, #a574ff)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Achievement chips */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {achievements?.map((ach: Achievement, i) => {
                        const isEarned = earnedIds.has(ach.id);
                        const earnedAt = earnedByAchId.get(ach.id);
                        const Icon = ACH_ICONS[ach.icon] || Trophy;
                        return (
                          <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.03 * i }}
                            whileHover={{ y: -2 }}
                            className={cn(
                              'relative rounded-2xl p-3 flex flex-col items-center text-center overflow-hidden border transition-all',
                              isEarned
                                ? 'bg-[#cdff4f]/8 border-[#cdff4f]/35'
                                : 'bg-white/[0.03] border-white/8',
                            )}
                            data-testid={`achievement-${ach.id}`}
                          >
                            {/* Glow on earned */}
                            {isEarned && (
                              <div
                                className="absolute inset-0 opacity-50 pointer-events-none"
                                style={{
                                  background:
                                    'radial-gradient(circle at 50% 0%, rgba(205,255,79,0.2) 0%, transparent 60%)',
                                }}
                              />
                            )}

                            {/* Icon tile */}
                            <div
                              className={cn(
                                'relative h-12 w-12 rounded-2xl flex items-center justify-center mb-2',
                              )}
                              style={
                                isEarned
                                  ? {
                                      background:
                                        'linear-gradient(145deg, #ffe27a 0%, #f1b733 100%)',
                                      boxShadow:
                                        '0 6px 22px rgba(255,226,122,0.4)',
                                    }
                                  : { background: 'rgba(255,255,255,0.05)' }
                              }
                            >
                              <Icon
                                className={cn(
                                  'h-6 w-6',
                                  isEarned ? 'text-[#3a2400]' : 'text-white/30',
                                )}
                              />
                              {!isEarned && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                  <Lock className="h-3.5 w-3.5 text-white/40" />
                                </div>
                              )}
                              {isEarned && (
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#cdff4f] flex items-center justify-center">
                                  <CheckCircle2
                                    className="h-3.5 w-3.5 text-[#111]"
                                    strokeWidth={3}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Title */}
                            <p
                              className={cn(
                                'relative text-[11px] sm:text-xs font-extrabold leading-tight line-clamp-2',
                                isEarned ? 'text-white' : 'text-white/45',
                              )}
                            >
                              {ach.title_ar}
                            </p>

                            {/* XP reward chip */}
                            <div
                              className={cn(
                                'relative mt-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold',
                                isEarned
                                  ? 'bg-[#cdff4f]/15 text-[#cdff4f]'
                                  : 'bg-white/5 text-white/30',
                              )}
                            >
                              <Star
                                className={cn(
                                  'h-2.5 w-2.5',
                                  isEarned ? 'fill-[#cdff4f]' : '',
                                )}
                              />
                              +{ach.xp_reward}
                            </div>

                            {/* Earned date */}
                            {isEarned && earnedAt && (
                              <p className="relative text-[9px] text-white/40 mt-1 font-bold">
                                {new Date(earnedAt).toLocaleDateString('ar-EG', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* ===== Sign out ===== */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              data-testid="profile-signout-btn"
              className="w-full rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2 bg-white/[0.04] border border-white/10 text-white/80 hover:border-red-500/40 hover:text-red-300 transition-colors mb-6"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-bold text-sm">تسجيل الخروج</span>
            </motion.button>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#8a8a8a] pb-8">
              <button
                onClick={() => navigate('/app/courses')}
                className="hover:text-white transition-colors"
              >
                الدروس
              </button>
              <span>·</span>
              <button
                onClick={() => navigate('/about')}
                className="hover:text-white transition-colors"
              >
                من نحن
              </button>
              <span>·</span>
              <button
                onClick={() => navigate('/contact')}
                className="hover:text-white transition-colors"
              >
                تواصل
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ===== Level dialog ===== */}
      <AnimatePresence>
        {showLevelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLevelDialog(false)}
            data-testid="level-dialog"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
              className="relative w-full max-w-sm rounded-3xl p-6 overflow-hidden border border-white/10"
              style={{
                background:
                  'linear-gradient(135deg, rgba(205,255,79,0.10) 0%, rgba(165,116,255,0.12) 50%, #1a1a1c 100%)',
                fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif",
              }}
            >
              <button
                onClick={() => setShowLevelDialog(false)}
                className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
                aria-label="إغلاق"
              >
                <ChevronLeft className="h-4 w-4 rotate-90" />
              </button>

              <div className="text-center">
                <div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full text-5xl font-black mb-3 shadow-[0_10px_40px_rgba(205,255,79,0.4)]"
                  style={{
                    background:
                      'linear-gradient(145deg, #cdff4f 0%, #a574ff 100%)',
                    color: '#111',
                  }}
                >
                  {currentLevel}
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  المستوى {currentLevel}
                </h3>
                <p className="text-sm text-white/55 font-medium">
                  {currentLevel === 1
                    ? 'مبتدئ'
                    : currentLevel <= 3
                    ? 'متوسط'
                    : currentLevel <= 5
                    ? 'متقدم'
                    : 'خبير'}
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/55">التقدّم للمستوى التالي</span>
                  <span className="text-[#cdff4f]">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #cdff4f, #a574ff)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 font-bold">
                  <span>{xpForCurrentLevel} XP</span>
                  <span>{xpForNextLevel} XP</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3 text-center">
                  <Star className="w-5 h-5 text-[#cdff4f] mx-auto mb-1 fill-[#cdff4f]" />
                  <div className="text-xl font-extrabold text-white">
                    {currentXP.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-[10px] text-white/55 font-bold">
                    إجمالي XP
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-[#a574ff] mx-auto mb-1" />
                  <div className="text-xl font-extrabold text-white">
                    {xpNeeded.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-[10px] text-white/55 font-bold">
                    XP للمستوى التالي
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-white/55 mt-5 font-medium">
                {xpNeeded <= 100
                  ? '🔥 أنت قريب جداً من المستوى التالي!'
                  : xpNeeded <= 250
                  ? '💪 استمر! نصف الطريق للمستوى التالي'
                  : '📚 أكمل المزيد من الدروس لكسب XP'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
