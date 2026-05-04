import { useNavigate, useParams } from 'react-router-dom';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelByCode, getUnitById } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Star,
  Lock,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Headphones,
  MessageCircle,
  PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useUserProgress, isLessonUnlocked } from '@/hooks/useProgress';
import { usePrefersReducedMotion } from '@/hooks/useAnimations';
import { toast } from 'sonner';
import DashboardBackground from '@/components/DashboardBackground';
import SidebarDashboard from '@/components/SidebarDashboard';

const lessonIcons: Record<string, React.ElementType> = {
  'المفردات': BookOpen,
  'القواعد': PenLine,
  'الاستماع': Headphones,
  'المحادثة': MessageCircle,
  'التمارين': PlayCircle,
};

const LESSON_PALETTES = [
  { c1: '#cdff4f', c2: '#14b8a6', text: 'text-[#cdff4f]', glow: 'rgba(205,255,79,0.8)', bg: 'bg-[#cdff4f]/10', border: 'border-[#cdff4f]/20', shadow: 'shadow-[0_0_20px_rgba(205,255,79,0.3)]' },
  { c1: '#a574ff', c2: '#ff9dcb', text: 'text-[#a574ff]', glow: 'rgba(165,116,255,0.8)', bg: 'bg-[#a574ff]/10', border: 'border-[#a574ff]/20', shadow: 'shadow-[0_0_20px_rgba(165,116,255,0.3)]' },
  { c1: '#ff9dcb', c2: '#a574ff', text: 'text-[#ff9dcb]', glow: 'rgba(255,157,203,0.8)', bg: 'bg-[#ff9dcb]/10', border: 'border-[#ff9dcb]/20', shadow: 'shadow-[0_0_20px_rgba(255,157,203,0.3)]' },
];

const levelAccent: Record<string, { text: string; bg: string }> = {
  A1: { text: 'text-[#cdff4f]', bg: 'bg-[#cdff4f]/10' },
  A2: { text: 'text-[#a574ff]', bg: 'bg-[#a574ff]/10' },
  B1: { text: 'text-[#ff9dcb]', bg: 'bg-[#ff9dcb]/10' },
  B2: { text: 'text-[#cdff4f]', bg: 'bg-[#cdff4f]/10' },
  C1: { text: 'text-[#a574ff]', bg: 'bg-[#a574ff]/10' },
  C2: { text: 'text-[#ff9dcb]', bg: 'bg-[#ff9dcb]/10' },
};

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 },
};

const CourseUnit = () => {
  const navigate = useNavigate();
  const { level: levelParam, unit: unitParam } = useParams<{ level: string; unit: string }>();
  const { user, profile, isLoading, isAdmin } = useAuth();
  const { data: progressData } = useUserProgress();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shakingLessonId, setShakingLessonId] = useState<string | null>(null);

  const level = getLevelByCode(levelParam || '');
  const unit = level ? getUnitById(level.code, unitParam || '') : undefined;

  const completedLessons = useMemo(() => {
    if (!progressData) return [];
    return progressData.filter((p) => p.completed).map((p) => p.lesson_id);
  }, [progressData]);

  const unitProgress = useMemo(() => {
    if (!unit) return 0;
    const completed = unit.lessons.filter((l) => completedLessons.includes(l.id)).length;
    return Math.round((completed / unit.lessons.length) * 100);
  }, [unit, completedLessons]);

  useEffect(() => {
    if (!isLoading && !user) navigate('/auth');
  }, [user, isLoading, navigate]);

  const handleLockedClick = (lessonId: string) => {
    setShakingLessonId(lessonId);
    toast.info('أكمل الدرس السابق أولاً', { duration: 2000 });
    setTimeout(() => setShakingLessonId(null), 500);
  };

  if (isLoading) {
    return (
      <DashboardBackground>
        <div className="min-h-[100dvh] flex items-center justify-center text-[#cdff4f] text-xl animate-pulse">
          جاري التحميل...
        </div>
      </DashboardBackground>
    );
  }

  if (!level || !unit) {
    return (
      <DashboardBackground>
        <SidebarDashboard />
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4" dir="rtl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">الوحدة غير موجودة</h2>
            <p className="text-gray-400 mb-6">عذراً، لم نتمكن من العثور على هذه الوحدة</p>
            <Button onClick={() => navigate('/app/courses')} className="bg-[#cdff4f] text-black hover:brightness-110">
              <ChevronRight className="w-4 h-4 ml-2" />
              العودة للمستويات
            </Button>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  const accent = levelAccent[level.code] || levelAccent.A1;
  const accentGlow = accent.text.includes('cdff4f') ? 'rgba(205,255,79,0.3)'
                  : accent.text.includes('a574ff') ? 'rgba(165,116,255,0.3)'
                  : 'rgba(255,157,203,0.3)';

  return (
    <DashboardBackground>
      <SidebarDashboard />
      <div dir="rtl" className="min-h-[100dvh] text-white pb-24 selection:bg-[#cdff4f] selection:text-black" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
        <main className="container mx-auto px-4 pt-20 max-w-2xl">
          <button
            onClick={() => navigate(`/app/courses/${level.code.toLowerCase()}`)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#cdff4f] transition"
          >
            <ChevronRight className="w-4 h-4" />
            العودة للوحدات
          </button>

          {/* Unit Hero */}
          <section className="flex flex-col items-start mb-10 animate-slideRightIn" style={{ animationDelay: '0.1s' }}>
            <span className={cn('inline-block text-sm font-bold px-3 py-1 rounded-full mb-3 border border-white/10', accent.bg, accent.text)}>
              {level.code} · الوحدة
            </span>
            <h1
              className={cn('text-[2.25rem] leading-[1.15] sm:text-5xl font-black mb-3 text-right', accent.text)}
              style={{ filter: `drop-shadow(0 0 15px ${accentGlow})` }}
            >
              {unit.titleAr}
            </h1>
            <p className="text-gray-300 ltr-text font-inter">{unit.titleEn}</p>
            <p className="text-sm text-gray-400 mt-2 text-right">{unit.descriptionAr}</p>

            {/* Progress */}
            <div className="w-full mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className={cn('text-base font-black font-inter animate-pulseGlow', accent.text)} style={{ filter: `drop-shadow(0 0 8px ${accentGlow})` }}>
                  {unitProgress}%
                </span>
                <span className="text-xs font-bold text-gray-400">التقدم في الوحدة</span>
              </div>
              <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden relative border border-white/5">
                <div
                  className="absolute top-0 right-0 h-full rounded-full overflow-hidden"
                  style={{
                    width: `${unitProgress}%`,
                    background: `linear-gradient(to left, ${accent.text.includes('cdff4f') ? '#cdff4f' : accent.text.includes('a574ff') ? '#a574ff' : '#ff9dcb'}, transparent)`,
                    boxShadow: `0 0 15px ${accentGlow}`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 w-1/2 -skew-x-12 animate-shimmerBg" />
                </div>
              </div>
            </div>
          </section>

          {/* Lessons List */}
          <section className="flex flex-col gap-4">
            {unit.lessons.map((lesson, index) => {
              const IconComponent = lessonIcons[lesson.titleAr] || BookOpen;
              const isCompleted = completedLessons.includes(lesson.id);
              const isUnlocked = isLessonUnlocked(
                lesson.id,
                completedLessons,
                profile?.placement_level,
                profile?.current_level,
                isAdmin,
              );
              const hasExercises = lesson.hasRealExercises;
              const isLocked = !isUnlocked && !hasExercises;
              const isShaking = shakingLessonId === lesson.id;
              const palette = LESSON_PALETTES[index % LESSON_PALETTES.length];

              if (isLocked) {
                return (
                  <motion.div
                    key={lesson.id}
                    animate={isShaking && !prefersReducedMotion ? shakeAnimation : {}}
                    onClick={() => handleLockedClick(lesson.id)}
                    className="animate-slideUpIn cursor-not-allowed"
                    style={{ animationDelay: `${0.15 + index * 0.04}s` }}
                  >
                    <div className="glass-card bg-[#0f110f]/80 rounded-[22px] p-5 border border-white/5 opacity-60 flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/5 text-gray-600">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-bold tracking-wider">الدرس {index + 1}</span>
                        <h3 className="text-base font-bold text-gray-500 truncate">{lesson.titleAr}</h3>
                        <p className="text-xs text-gray-600 ltr-text truncate">{lesson.titleEn}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={lesson.id}
                  whileHover={!prefersReducedMotion ? { y: -3, scale: 1.01 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                  className="animate-slideUpIn animated-border rounded-[24px]"
                  style={{
                    animationDelay: `${0.15 + index * 0.04}s`,
                    ['--c1' as string]: palette.c1,
                    ['--c2' as string]: palette.c2,
                  } as React.CSSProperties}
                >
                  <div className="glass-card bg-[rgba(18,21,18,0.7)] rounded-[22px] p-5 relative overflow-hidden cursor-pointer flex items-center gap-4 group">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border animate-floatY group-hover:rotate-12 transition-transform', palette.bg, palette.border, palette.shadow)}>
                      {isCompleted ? (
                        <CheckCircle className={cn('w-5 h-5', palette.text)} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }} />
                      ) : (
                        <IconComponent className={cn('w-5 h-5', palette.text)} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn('text-xs font-bold tracking-wider', palette.text)}>الدرس {index + 1}</span>
                        {isCompleted && (
                          <span className="text-[10px] bg-[#cdff4f]/15 text-[#cdff4f] px-2 py-0.5 rounded-full">مكتمل</span>
                        )}
                        {hasExercises && !isCompleted && (
                          <span className={cn('text-[10px] px-2 py-0.5 rounded-full', palette.bg, palette.text)}>تمارين</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white truncate">{lesson.titleAr}</h3>
                      <p className="text-xs text-gray-400 ltr-text truncate">{lesson.titleEn}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[#cdff4f] text-sm font-bold shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      <span>+{lesson.xpReward}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </section>
        </main>
      </div>
    </DashboardBackground>
  );
};

export default CourseUnit;
