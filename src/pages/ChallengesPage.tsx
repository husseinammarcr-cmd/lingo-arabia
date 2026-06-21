import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import {
  ArrowRight,
  Target,
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  Crown,
  Zap,
  BookOpen,
  Loader2,
  Lock,
  ChevronLeft,
} from 'lucide-react';
import SidebarDashboard from '@/components/SidebarDashboard';
import SeoBreadcrumbs from '@/components/SeoBreadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import {
  useChallenges,
  useUserChallenges,
  useJoinChallenge,
  type Challenge,
  type UserChallenge,
} from '@/hooks/useChallenges';
import { useToast } from '@/hooks/use-toast';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';
import { cn } from '@/lib/utils';

type TabKey = 'daily' | 'weekly' | 'monthly';

const TAB_META: Record<
  TabKey,
  { label: string; icon: typeof Flame; theme: { grad: string; circle: string; text: string; accent: string } }
> = {
  daily: {
    label: 'يومية',
    icon: Flame,
    theme: {
      grad: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
      circle: '#ffb8da',
      text: '#111111',
      accent: '#ff9dcb',
    },
  },
  weekly: {
    label: 'أسبوعية',
    icon: Calendar,
    theme: {
      grad: 'linear-gradient(145deg, #a574ff, #753aeb)',
      circle: '#8b52ff',
      text: '#ffffff',
      accent: '#a574ff',
    },
  },
  monthly: {
    label: 'شهرية',
    icon: Crown,
    theme: {
      grad: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
      circle: '#dcff82',
      text: '#111111',
      accent: '#cdff4f',
    },
  },
};

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  streak: Flame,
  lessons: BookOpen,
  xp: Zap,
  challenge: Target,
};

const guessIcon = (challenge: Challenge) => {
  const key = (challenge.key || '').toLowerCase();
  if (key.includes('streak')) return TYPE_ICONS.streak;
  if (key.includes('xp')) return TYPE_ICONS.xp;
  if (key.includes('lesson')) return TYPE_ICONS.lessons;
  return TYPE_ICONS.challenge;
};

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();

  const { data: challenges, isLoading: loadingC } = useChallenges();
  const { data: userChallenges, isLoading: loadingUC } = useUserChallenges();
  const joinChallenge = useJoinChallenge();

  const [activeTab, setActiveTab] = useState<TabKey>('daily');

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

  const firstName =
    profile?.display_name?.split(' ')[0] ??
    profile?.name?.split(' ')[0] ??
    'بك';

  const ucByCid = useMemo(() => {
    const m = new Map<string, UserChallenge>();
    (userChallenges || []).forEach((uc) => m.set(uc.challenge_id, uc));
    return m;
  }, [userChallenges]);

  const grouped = useMemo(() => {
    const all = challenges || [];
    return {
      daily: all.filter((c) => c.challenge_type === 'daily'),
      weekly: all.filter((c) => c.challenge_type === 'weekly'),
      monthly: all.filter((c) => c.challenge_type === 'monthly'),
    } as Record<TabKey, Challenge[]>;
  }, [challenges]);

  const stats = useMemo(() => {
    const ucs = userChallenges || [];
    const completed = ucs.filter((uc) => uc.completed);
    const active = ucs.filter((uc) => !uc.completed);
    const earnedXP = completed.reduce(
      (sum, uc) => sum + (uc.challenge?.reward_xp || 0),
      0,
    );
    return {
      active: active.length,
      completed: completed.length,
      earnedXP,
    };
  }, [userChallenges]);

  // Pick featured challenge: highest reward_xp not-yet-completed
  const featured = useMemo<Challenge | null>(() => {
    const all = challenges || [];
    const candidates = all
      .filter((c) => {
        const uc = ucByCid.get(c.id);
        return !uc || !uc.completed;
      })
      .sort((a, b) => b.reward_xp - a.reward_xp);
    return candidates[0] ?? null;
  }, [challenges, ucByCid]);

  const handleJoin = async (challengeId: string) => {
    try {
      await joinChallenge.mutateAsync(challengeId);
      toast({
        title: 'تم الانضمام! 🎯',
        description: 'تم الانضمام للتحدي بنجاح',
      });
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء الانضمام للتحدي',
        variant: 'destructive',
      });
    }
  };

  const isLoading = loadingC || loadingUC;
  const activeList = grouped[activeTab];

  return (
    <>
      <SeoBreadcrumbs
        items={[{ name: 'التحديات', url: 'https://lingoarab.com/challenges' }]}
      />
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
              'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,0.5) 70%, rgba(20,20,20,0.75) 100%)',
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
        data-testid="challenges-page"
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif" }}
      >
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden">
          {/* Aurora */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-32 -right-24 rounded-full"
              style={{
                width: '70vw',
                height: '70vw',
                background:
                  'radial-gradient(circle, rgba(255,157,203,0.20) 0%, transparent 60%)',
                filter: 'blur(70px)',
              }}
            />
            <div
              className="absolute"
              style={{
                top: 80,
                right: '15vw',
                width: '55vw',
                height: '55vw',
                background:
                  'radial-gradient(circle, rgba(165,116,255,0.18) 0%, transparent 50%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
              }}
            />
          </div>

          <div className="h-12" />

          <div className="relative z-10 mx-auto w-full max-w-[900px]">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="text-right text-base sm:text-lg font-bold text-white/70 mb-2"
                  style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
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
                  Take on
                  <br />
                  <span
                    style={{
                      background:
                        'linear-gradient(120deg, #ff9dcb 0%, #a574ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    challenges.
                  </span>
                </h1>
              </div>
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                data-testid="challenges-back-btn"
                className="h-11 w-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#ff9dcb]/40 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5" data-testid="challenges-stats">
              {[
                { label: 'نشطة', value: stats.active, icon: Target, color: '#ff9dcb' },
                { label: 'مُكتملة', value: stats.completed, icon: CheckCircle2, color: '#cdff4f' },
                { label: 'XP محصّل', value: stats.earnedXP, icon: Sparkles, color: '#a574ff' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl p-3 sm:p-4 bg-white/[0.04] border border-white/8 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5 mb-2" style={{ color: s.color }} />
                    <div className="text-xl sm:text-2xl font-extrabold text-white">
                      {s.value.toLocaleString('ar-EG')}
                    </div>
                    <p className="text-[11px] text-white/55 font-medium mt-0.5">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Featured Challenge */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                style={{
                  background: 'linear-gradient(135deg, #ff9dcb 0%, #a574ff 60%, #753aeb 100%)',
                  color: '#fff',
                }}
                data-testid="featured-challenge"
              >
                {/* Decorative orbs */}
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    bottom: -80,
                    left: -80,
                    width: 240,
                    height: 240,
                    background: 'rgba(255,255,255,0.12)',
                    zIndex: 1,
                  }}
                />
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    background: 'rgba(255,255,255,0.08)',
                    zIndex: 1,
                  }}
                />

                <div className="relative z-[5]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/25 text-[10px] font-black tracking-wider uppercase">
                      ⭐ مميّز
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold">
                      {featured.challenge_type === 'daily'
                        ? 'يومي'
                        : featured.challenge_type === 'weekly'
                        ? 'أسبوعي'
                        : 'شهري'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                    {featured.name_ar}
                  </h3>
                  <p className="text-sm opacity-90 mb-5 max-w-md">
                    {featured.description_ar}
                  </p>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 rounded-xl bg-black/25 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-extrabold text-base">
                          +{featured.reward_xp} XP
                        </span>
                      </div>
                      <div className="px-3 py-2 rounded-xl bg-black/25 flex items-center gap-1.5">
                        <Target className="h-4 w-4" />
                        <span className="font-bold text-sm">
                          الهدف: {featured.target_value}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleJoin(featured.id)}
                      disabled={
                        joinChallenge.isPending ||
                        !!ucByCid.get(featured.id)
                      }
                      data-testid="featured-join-btn"
                      className="px-5 py-2.5 rounded-full bg-white text-[#111] font-extrabold text-sm shadow-lg flex items-center gap-2 disabled:opacity-60"
                    >
                      {ucByCid.get(featured.id) ? 'مُنضم' : 'ابدأ الآن'}
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tabs */}
            <div
              className="flex gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-5"
              data-testid="challenge-tabs"
            >
              {(Object.keys(TAB_META) as TabKey[]).map((k) => {
                const meta = TAB_META[k];
                const Icon = meta.icon;
                const active = activeTab === k;
                const count = grouped[k].length;
                return (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    data-testid={`tab-${k}`}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all',
                      active
                        ? 'text-[#111] shadow-[0_6px_20px_rgba(0,0,0,0.3)]'
                        : 'text-white/70 hover:text-white hover:bg-white/5',
                    )}
                    style={
                      active
                        ? { background: meta.theme.grad, color: meta.theme.text }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {meta.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          'text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                          active
                            ? 'bg-black/20'
                            : 'bg-white/10 text-white/80',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff9dcb]" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                  data-testid="challenges-list"
                >
                  {activeList.length === 0 ? (
                    <div className="rounded-2xl p-10 text-center bg-white/[0.03] border border-white/8">
                      <Target className="h-10 w-10 mx-auto mb-3 text-white/30" />
                      <p className="text-sm text-white/60">
                        لا توجد تحديات {TAB_META[activeTab].label} حالياً
                      </p>
                    </div>
                  ) : (
                    activeList.map((c, i) => {
                      const uc = ucByCid.get(c.id);
                      const progress = uc?.progress ?? 0;
                      const target = c.target_value || 1;
                      const pct = Math.min((progress / target) * 100, 100);
                      const Icon = guessIcon(c);
                      const isCompleted = uc?.completed;
                      const isActive = uc && !uc.completed;
                      const tabTheme = TAB_META[activeTab].theme;

                      return (
                        <motion.div
                          key={c.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.04, 0.3) }}
                          className={cn(
                            'relative rounded-2xl p-4 overflow-hidden border transition-colors',
                            isCompleted
                              ? 'bg-[#cdff4f]/8 border-[#cdff4f]/30'
                              : 'bg-white/[0.04] border-white/8 hover:border-white/20',
                          )}
                          data-testid={`challenge-card-${c.id}`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon tile */}
                            <div
                              className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: tabTheme.grad,
                                color: tabTheme.text,
                              }}
                            >
                              <Icon className="h-6 w-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                              {/* Title row */}
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                                    {c.name_ar}
                                  </h3>
                                  <p className="text-xs text-white/55 mt-1 line-clamp-2">
                                    {c.description_ar}
                                  </p>
                                </div>
                                <div
                                  className="px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 flex-shrink-0"
                                  style={{
                                    background: `${tabTheme.accent}20`,
                                    color: tabTheme.accent,
                                  }}
                                >
                                  <Sparkles className="h-3 w-3" />
                                  +{c.reward_xp}
                                </div>
                              </div>

                              {/* Progress */}
                              {(isActive || isCompleted) && (
                                <div className="mt-2.5">
                                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                                    <span className="text-white/55">
                                      {progress} / {target}
                                    </span>
                                    <span
                                      style={{
                                        color: isCompleted
                                          ? '#cdff4f'
                                          : tabTheme.accent,
                                      }}
                                    >
                                      {Math.round(pct)}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.7, ease: 'easeOut' }}
                                      className="h-full rounded-full"
                                      style={{
                                        background: isCompleted
                                          ? 'linear-gradient(90deg, #cdff4f, #a7e31b)'
                                          : tabTheme.grad,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Action */}
                              <div className="mt-3 flex items-center gap-2">
                                {isCompleted ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#cdff4f]/15 text-[#cdff4f] text-xs font-extrabold">
                                    <CheckCircle2 className="h-4 w-4" />
                                    تم الإنجاز
                                  </div>
                                ) : isActive ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold">
                                    <Flame
                                      className="h-3.5 w-3.5"
                                      style={{ color: tabTheme.accent }}
                                    />
                                    قيد التقدّم
                                  </div>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleJoin(c.id)}
                                    disabled={joinChallenge.isPending}
                                    data-testid={`join-${c.id}`}
                                    className="px-4 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5"
                                    style={{
                                      background: tabTheme.grad,
                                      color: tabTheme.text,
                                    }}
                                  >
                                    انضم
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                  </motion.button>
                                )}

                                <div className="ms-auto flex items-center gap-1 text-[10px] text-white/40 font-bold">
                                  <Trophy className="h-3 w-3" />
                                  هدف {c.target_value}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <div className="h-10" />
          </div>
        </main>
      </div>
    </>
  );
};

export default ChallengesPage;
