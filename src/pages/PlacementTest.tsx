import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  Target,
  Award,
  CheckCircle,
  BookOpen,
  Sparkles,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SeoBreadcrumbs from '@/components/SeoBreadcrumbs';
import DashboardLayout from '@/components/DashboardLayout';

const PlacementTest = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();
  const [lastTestDate, setLastTestDate] = useState<Date | null>(null);
  const [canRetake, setCanRetake] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) navigate('/auth?returnUrl=/placement-test');
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const checkLastTest = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('placement_tests')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const testDate = new Date(data.created_at);
        setLastTestDate(testDate);
        const days = (Date.now() - testDate.getTime()) / 86400000;
        setCanRetake(days >= 7);
      }
    };
    checkLastTest();
  }, [user]);

  if (isLoading) {
    return (
      <DashboardLayout
        titlePrimary="Placement"
        titleAccent="test."
        gradient="linear-gradient(120deg, #cdff4f 0%, #a574ff 100%)"
        showGreeting={false}
        testId="placement-page"
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#cdff4f]" />
        </div>
      </DashboardLayout>
    );
  }

  const features = [
    {
      icon: Clock,
      title: '5-7 دقائق',
      desc: 'مدة الاختبار',
      grad: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
      text: '#111',
      circle: '#dcff82',
    },
    {
      icon: Target,
      title: '21 سؤال',
      desc: 'متدرّجة',
      grad: 'linear-gradient(145deg, #a574ff, #753aeb)',
      text: '#fff',
      circle: '#8b52ff',
    },
    {
      icon: Award,
      title: 'A1 → C2',
      desc: 'تحديد دقيق',
      grad: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
      text: '#111',
      circle: '#ffb8da',
    },
  ];

  const instructions = [
    'الاختبار يحتوي على 21 سؤال متنوع بين المفردات والقواعد والفهم',
    'الأسئلة متدرجة الصعوبة من المستوى المبتدئ (A1) إلى المتقدم (C2)',
    'أجب بصدق للحصول على نتيجة دقيقة تناسب مستواك الحقيقي',
    'يمكنك إعادة الاختبار مرة كل 7 أيام',
  ];

  return (
    <>
      <SeoBreadcrumbs
        items={[
          { name: 'اختبار تحديد المستوى', url: 'https://lingoarab.com/placement-test' },
        ]}
      />
      <DashboardLayout
        titlePrimary="Placement"
        titleAccent="test."
        gradient="linear-gradient(120deg, #cdff4f 0%, #a574ff 100%)"
        glow1="rgba(186,243,58,0.18)"
        glow2="rgba(165,116,255,0.18)"
        testId="placement-page"
      >
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-5 border border-white/10 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(205,255,79,0.12) 0%, rgba(165,116,255,0.10) 60%, rgba(20,20,20,0.7) 100%)',
          }}
          data-testid="placement-hero"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, #cdff4f, #a574ff)',
                color: '#111',
              }}
            >
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#cdff4f]" />
                <span className="text-[10px] font-extrabold text-[#cdff4f] tracking-wider uppercase">
                  CEFR Test
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                اكتشف مستواك الحقيقي
              </h2>
              <p className="text-xs text-white/55 mt-0.5">
                ابدأ من المكان المناسب لمستواك في الإنجليزية
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature tiles */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="relative h-[130px] sm:h-[150px] rounded-3xl p-3 sm:p-4 flex flex-col justify-between text-right overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                style={{ background: f.grad, color: f.text }}
                data-testid={`feature-${i}`}
              >
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    bottom: -30,
                    left: -30,
                    width: 110,
                    height: 110,
                    backgroundColor: f.circle,
                    zIndex: 1,
                  }}
                />
                <div className="relative z-[5]">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="relative z-[5]">
                  <div className="text-lg sm:text-xl font-black leading-tight">
                    {f.title}
                  </div>
                  <p className="text-[10px] sm:text-[11px] font-bold opacity-85 mt-1">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Previous test result */}
        {profile?.has_taken_placement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 mb-5 border border-[#cdff4f]/30 bg-[#cdff4f]/8 backdrop-blur-sm"
            data-testid="previous-result"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#cdff4f]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-[#cdff4f]" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-white/55 font-medium">
                    مستواك الحالي:
                  </span>
                  <span className="text-lg font-extrabold text-[#cdff4f]">
                    {profile.placement_level}
                  </span>
                </div>
                <div className="text-[11px] text-white/45 mt-0.5">
                  النتيجة: {profile.placement_score}/15
                  {lastTestDate && ` · ${lastTestDate.toLocaleDateString('ar-EG')}`}
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-[#cdff4f]" />
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="rounded-3xl bg-[#161618] border border-white/8 p-5 mb-6" data-testid="instructions">
          <h3 className="font-extrabold text-white text-base mb-4">
            تعليمات الاختبار
          </h3>
          <ul className="space-y-3">
            {instructions.map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i }}
                className="flex items-start gap-3"
              >
                <span
                  className="h-6 w-6 rounded-full bg-[#cdff4f]/15 text-[#cdff4f] flex items-center justify-center text-[11px] font-black flex-shrink-0"
                >
                  {i + 1}
                </span>
                <span className="text-sm text-white/75 leading-relaxed">
                  {line}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-10" data-testid="actions">
          {canRetake ? (
            <>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/placement-test/start')}
                data-testid="start-btn"
                className="w-full px-5 py-4 rounded-2xl bg-[#cdff4f] text-[#111] font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(205,255,79,0.3)] hover:brightness-110 transition"
              >
                {profile?.has_taken_placement ? 'إعادة الاختبار' : 'ابدأ الاختبار'}
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {!profile?.has_taken_placement && (
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-white/55 text-center mb-3">
                    لا تعرف الإنجليزية؟ لا تقلق!
                  </p>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="beginner-btn"
                    onClick={async () => {
                      if (!user) return;
                      await supabase
                        .from('profiles')
                        .update({
                          has_taken_placement: true,
                          placement_level: 'A1',
                          placement_score: 0,
                          current_level: 'A1',
                          placement_taken_at: new Date().toISOString(),
                        })
                        .eq('id', user.id);
                      navigate('/app/courses/a1');
                    }}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:border-[#cdff4f]/40 transition"
                  >
                    <BookOpen className="w-4 h-4 text-[#cdff4f]" />
                    أنا مبتدئ تماماً - ابدأ من الصفر
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="w-full px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white/60 font-bold text-sm text-center" data-testid="cooldown">
                يمكنك إعادة الاختبار بعد 7 أيام
              </div>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate(`/app/courses/${profile?.placement_level?.toLowerCase()}`)
                }
                data-testid="continue-btn"
                className="w-full px-5 py-3.5 rounded-2xl bg-[#cdff4f] text-[#111] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(205,255,79,0.25)]"
              >
                تابع التعلم من مستوى {profile?.placement_level}
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default PlacementTest;
