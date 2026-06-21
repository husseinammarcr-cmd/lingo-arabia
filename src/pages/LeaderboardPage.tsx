import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import {
  ArrowRight,
  Globe,
  MapPin,
  BookOpen,
  Crown,
  Medal,
  TrendingUp,
  Flame,
  Sparkles,
  Loader2,
  Trophy,
} from 'lucide-react';
import SidebarDashboard from '@/components/SidebarDashboard';
import SeoBreadcrumbs from '@/components/SeoBreadcrumbs';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard, useUserRank } from '@/hooks/useLeaderboard';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';
import { cn } from '@/lib/utils';

type TimeFrame = 'weekly' | 'monthly' | 'all_time';
type Scope = 'global' | 'local' | 'level';

const TIMEFRAME_OPTS: { key: TimeFrame; label: string }[] = [
  { key: 'weekly', label: 'الأسبوع' },
  { key: 'monthly', label: 'الشهر' },
  { key: 'all_time', label: 'كل الأوقات' },
];

const SCOPE_OPTS: { key: Scope; label: string; icon: typeof Globe }[] = [
  { key: 'global', label: 'عالمي', icon: Globe },
  { key: 'local', label: 'محلي', icon: MapPin },
  { key: 'level', label: 'المستوى', icon: BookOpen },
];

const COURSE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const flagEmoji = (cc?: string | null) => {
  if (!cc) return '🌍';
  return String.fromCodePoint(
    ...cc.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)),
  );
};

const PODIUM_THEME = [
  {
    // Gold (#1)
    grad: 'linear-gradient(160deg, #ffe27a 0%, #f1b733 60%, #c9870e 100%)',
    ring: '#ffe27a',
    text: '#3a2400',
    icon: Crown,
    label: 'الأول',
  },
  {
    // Silver (#2)
    grad: 'linear-gradient(160deg, #f0f0f5 0%, #c2c6d0 60%, #888c97 100%)',
    ring: '#e7e9ef',
    text: '#1f2330',
    icon: Medal,
    label: 'الثاني',
  },
  {
    // Bronze (#3)
    grad: 'linear-gradient(160deg, #f4a774 0%, #d27a3a 60%, #8a4316 100%)',
    ring: '#f4a774',
    text: '#36180a',
    icon: Medal,
    label: 'الثالث',
  },
] as const;

const xpFor = (entry: { xp: number; weekly_xp: number; monthly_xp: number }, tf: TimeFrame) =>
  tf === 'weekly' ? entry.weekly_xp : tf === 'monthly' ? entry.monthly_xp : entry.xp;

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const [scope, setScope] = useState<Scope>('global');
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');

  const { data: entries, isLoading } = useLeaderboard(
    scope,
    timeFrame,
    profile?.country_code || undefined,
    scope === 'level' ? selectedLevel : undefined,
    50,
  );
  const { data: myRank } = useUserRank(
    user?.id,
    scope,
    timeFrame,
    profile?.country_code || undefined,
  );

  // Force dark surface
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

  // Split into podium (top 3 non-founder) and rest
  const { podium, rest, founder } = useMemo(() => {
    const all = entries ?? [];
    const founder = all.find((e) => e.is_founder);
    const regular = all.filter((e) => !e.is_founder);
    return {
      founder,
      podium: regular.slice(0, 3),
      rest: regular.slice(3),
    };
  }, [entries]);

  const myXP = profile ? xpFor(profile, timeFrame) : 0;

  return (
    <>
      <SeoBreadcrumbs
        items={[{ name: 'المتصدرون', url: 'https://lingoarab.com/leaderboard' }]}
      />
      <SidebarDashboard />

      {/* Fixed Lottie background */}
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
        data-testid="leaderboard-page"
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif" }}
      >
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden pb-32">
          {/* Aurora */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-32 -right-24 rounded-full"
              style={{
                width: '70vw',
                height: '70vw',
                background:
                  'radial-gradient(circle, rgba(255,226,122,0.22) 0%, transparent 60%)',
                filter: 'blur(70px)',
              }}
            />
            <div
              className="absolute"
              style={{
                top: 100,
                right: '20vw',
                width: '55vw',
                height: '55vw',
                background:
                  'radial-gradient(circle, rgba(186,243,58,0.18) 0%, transparent 50%)',
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
                  Climb the
                  <br />
                  <span
                    style={{
                      background:
                        'linear-gradient(120deg, #ffe27a 0%, #cdff4f 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    leaderboard.
                  </span>
                </h1>
              </div>
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                data-testid="leaderboard-back-btn"
                className="h-11 w-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#cdff4f]/40 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* My Rank Hero */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-6 shadow-[0_10px_40px_rgba(205,255,79,0.15)] border border-white/10"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,226,122,0.12) 0%, rgba(205,255,79,0.08) 50%, rgba(20,20,20,0.85) 100%)',
                backdropFilter: 'blur(20px)',
              }}
              data-testid="my-rank-card"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        'linear-gradient(145deg, #ffe27a, #f1b733)',
                    }}
                  >
                    <Trophy className="h-8 w-8 text-[#3a2400]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-white/60 font-medium">
                      ترتيبك الحالي
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        #{myRank ?? '—'}
                      </span>
                      <span className="text-sm text-[#cdff4f] font-bold">
                        من {(entries?.length ?? 0).toLocaleString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/60 font-medium">XP {TIMEFRAME_OPTS.find((t) => t.key === timeFrame)?.label}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <Sparkles className="h-4 w-4 text-[#cdff4f]" />
                    <span className="text-2xl sm:text-3xl font-black text-[#cdff4f]">
                      {myXP.toLocaleString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scope tabs (segmented pills) */}
            <div
              className="flex gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mb-3"
              data-testid="scope-tabs"
            >
              {SCOPE_OPTS.map((opt) => {
                const Icon = opt.icon;
                const active = scope === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setScope(opt.key)}
                    data-testid={`scope-${opt.key}`}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      active
                        ? 'bg-[#cdff4f] text-[#111] shadow-[0_4px_20px_rgba(205,255,79,0.4)]'
                        : 'text-white/70 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Timeframe tabs (smaller chips) */}
            <div
              className="flex gap-2 mb-4 overflow-x-auto scrollbar-none"
              data-testid="timeframe-tabs"
            >
              {TIMEFRAME_OPTS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTimeFrame(opt.key)}
                  data-testid={`timeframe-${opt.key}`}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                    timeFrame === opt.key
                      ? 'bg-white text-[#111] border-white'
                      : 'bg-transparent text-white/60 border-white/15 hover:border-white/30',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Course level filter (visible when scope === 'level') */}
            <AnimatePresence>
              {scope === 'level' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 overflow-x-auto pb-2 mb-2"
                >
                  {COURSE_LEVELS.map((lv) => (
                    <button
                      key={lv}
                      onClick={() => setSelectedLevel(lv)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all',
                        selectedLevel === lv
                          ? 'bg-[#a574ff] text-white shadow-[0_4px_16px_rgba(165,116,255,0.4)]'
                          : 'bg-white/5 text-white/70 border border-white/10',
                      )}
                    >
                      {lv}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#cdff4f]" />
              </div>
            ) : (
              <>
                {/* Founder pinned card */}
                {founder && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl p-4 mb-4 overflow-hidden border border-[#a574ff]/40 shadow-[0_0_24px_rgba(165,116,255,0.25)]"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(165,116,255,0.18) 0%, rgba(20,20,20,0.6) 100%)',
                    }}
                    data-testid="founder-pinned"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div
                          className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-extrabold"
                          style={{
                            background:
                              'linear-gradient(145deg, #a574ff, #753aeb)',
                            color: '#fff',
                          }}
                        >
                          {founder.avatar_url ? (
                            <img
                              src={founder.avatar_url}
                              alt=""
                              className="h-full w-full rounded-2xl object-cover"
                            />
                          ) : (
                            (founder.display_name || founder.name || 'F').charAt(0)
                          )}
                        </div>
                        <span className="absolute -top-1 -right-1 text-base">
                          {flagEmoji(founder.country_code)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white truncate">
                            {founder.display_name || founder.name}
                          </p>
                          <VerifiedBadge size="sm" />
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a574ff]/25 text-[#cfb6ff] font-bold">
                            FOUNDER
                          </span>
                        </div>
                        <p className="text-xs text-white/50">
                          المؤسس · مثبّت دائماً
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-white/50">XP</p>
                        <p className="text-lg font-extrabold text-[#cdff4f]">
                          {xpFor(founder, timeFrame).toLocaleString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Podium (Top 3) */}
                {podium.length > 0 && (
                  <div
                    className="grid grid-cols-3 gap-2 sm:gap-3 mb-5"
                    data-testid="podium"
                  >
                    {/* Order: 2nd, 1st, 3rd */}
                    {[1, 0, 2].map((idx) => {
                      const entry = podium[idx];
                      if (!entry) return <div key={idx} />;
                      const theme = PODIUM_THEME[idx];
                      const Icon = theme.icon;
                      const isFirst = idx === 0;
                      const isMe = entry.id === user?.id;
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={cn(
                            'relative rounded-3xl p-3 sm:p-4 flex flex-col items-center text-center overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)]',
                            isFirst ? 'pt-5 -mt-2' : 'pt-4',
                          )}
                          style={{
                            background: theme.grad,
                            color: theme.text,
                            border: isMe
                              ? '2px solid #cdff4f'
                              : '1px solid rgba(255,255,255,0.15)',
                          }}
                          data-testid={`podium-rank-${idx + 1}`}
                        >
                          <Icon
                            className={cn(
                              'absolute opacity-25',
                              isFirst
                                ? 'h-24 w-24 -top-3 -left-3'
                                : 'h-16 w-16 -top-2 -left-2',
                            )}
                            style={{ color: theme.text }}
                          />
                          <div
                            className={cn(
                              'rounded-full flex items-center justify-center font-extrabold mb-2 relative overflow-hidden border-[3px]',
                              isFirst ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg',
                            )}
                            style={{
                              background: 'rgba(0,0,0,0.15)',
                              borderColor: theme.ring,
                              color: theme.text,
                            }}
                          >
                            {entry.avatar_url ? (
                              <img
                                src={entry.avatar_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (entry.display_name || entry.name || '?').charAt(0)
                            )}
                          </div>
                          <div
                            className={cn(
                              'font-extrabold leading-tight truncate w-full',
                              isFirst ? 'text-sm sm:text-base' : 'text-xs sm:text-sm',
                            )}
                          >
                            {entry.display_name || entry.name}
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-0.5 text-[10px] opacity-80">
                            <span>{flagEmoji(entry.country_code)}</span>
                            <span>Lv.{entry.user_level}</span>
                          </div>
                          <div
                            className={cn(
                              'mt-2 px-2.5 py-1 rounded-full font-extrabold text-[11px]',
                              'bg-black/25',
                            )}
                          >
                            {xpFor(entry, timeFrame).toLocaleString('ar-EG')} XP
                          </div>
                          <div
                            className={cn(
                              'absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-t-lg text-[10px] font-black',
                              'bg-black/30',
                            )}
                          >
                            #{idx + 1}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Rest of the list */}
                <div
                  className="space-y-2"
                  data-testid="leaderboard-list"
                >
                  {rest.map((entry, i) => {
                    const isMe = entry.id === user?.id;
                    const rank = i + 4;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.5) }}
                        className={cn(
                          'relative rounded-2xl px-3 py-3 flex items-center gap-3 overflow-hidden border transition-colors',
                          isMe
                            ? 'bg-[#cdff4f]/10 border-[#cdff4f]/40 shadow-[0_0_20px_rgba(205,255,79,0.18)]'
                            : 'bg-white/[0.03] border-white/8 hover:bg-white/5 hover:border-white/15',
                        )}
                        data-testid={isMe ? 'leaderboard-row-self' : `leaderboard-row-${rank}`}
                      >
                        {/* Rank */}
                        <div
                          className={cn(
                            'h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0',
                            isMe
                              ? 'bg-[#cdff4f] text-[#111]'
                              : 'bg-white/8 text-white/70',
                          )}
                        >
                          {rank}
                        </div>

                        {/* Avatar */}
                        <div className="relative h-11 w-11 flex-shrink-0">
                          <div className="h-full w-full rounded-xl bg-white/8 overflow-hidden flex items-center justify-center text-base font-bold text-white/70">
                            {entry.avatar_url ? (
                              <img
                                src={entry.avatar_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (entry.display_name || entry.name || '?').charAt(0)
                            )}
                          </div>
                          <span className="absolute -bottom-1 -right-1 text-sm">
                            {flagEmoji(entry.country_code)}
                          </span>
                        </div>

                        {/* Name & level */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-white truncate text-sm">
                              {entry.display_name || entry.name}
                              {isMe && (
                                <span className="ms-1.5 text-[10px] text-[#cdff4f] font-black">
                                  أنت
                                </span>
                              )}
                            </p>
                            {entry.is_verified && <VerifiedBadge size="sm" />}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/8 text-white/60 font-bold">
                              Lv.{entry.user_level}
                            </span>
                            {entry.streak_count > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-orange-400 font-bold">
                                <Flame className="h-3 w-3" />
                                {entry.streak_count}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* XP */}
                        <div className="text-left flex-shrink-0">
                          <div className="text-base font-extrabold text-white">
                            {xpFor(entry, timeFrame).toLocaleString('ar-EG')}
                          </div>
                          <div className="text-[10px] text-white/40 font-bold">
                            XP
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {entries?.length === 0 && (
                    <div className="rounded-2xl p-10 text-center bg-white/[0.03] border border-white/8">
                      <Trophy className="h-10 w-10 mx-auto mb-3 text-white/30" />
                      <p className="text-sm text-white/60">
                        لا توجد بيانات متاحة في هذه الفئة
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        {/* Sticky "Your Position" floating bar */}
        {myRank && profile && !isLoading && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[680px] z-20"
            data-testid="floating-self-bar"
          >
            <div
              className="rounded-2xl px-3 py-3 flex items-center gap-3 border border-[#cdff4f]/40 backdrop-blur-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(205,255,79,0.18) 0%, rgba(20,20,20,0.85) 100%)',
                boxShadow:
                  '0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(205,255,79,0.15)',
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-[#cdff4f] text-[#111] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                #{myRank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 font-medium">مركزك الآن</p>
                <p className="text-sm font-bold text-white truncate">
                  {profile.display_name || profile.name || 'أنت'} · {myXP.toLocaleString('ar-EG')} XP
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-[#cdff4f] flex-shrink-0" />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage;
