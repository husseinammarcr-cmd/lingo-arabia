import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, BookOpen, Sparkles, CheckCircle2, XCircle, Volume2, RotateCcw } from 'lucide-react';
import DashboardBackground from '@/components/DashboardBackground';
import SidebarDashboard from '@/components/SidebarDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useWeakPoints, useRecordReviewResult, type WeakPoint } from '@/hooks/useWeakPoints';

const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

function FlashcardReview({ items, onClose }: { items: WeakPoint[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const recordResult = useRecordReviewResult();
  const item = items[idx];

  if (!item) {
    return (
      <Card className="bg-card/60 backdrop-blur border-white/10">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-[#cdff4f] mx-auto" />
          <h3 className="text-xl font-bold">أحسنت! انتهت المراجعة</h3>
          <Button onClick={onClose}>عودة</Button>
        </CardContent>
      </Card>
    );
  }

  const english = item.item_data?.english || item.item_data?.answer || item.item_key;
  const arabic = item.item_data?.arabic || item.item_data?.promptAr || '';

  const handle = (correct: boolean) => {
    recordResult.mutate({ id: item.id, correct });
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        {idx + 1} / {items.length}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="bg-card/60 backdrop-blur border-white/10">
            <CardContent className="p-8 text-center space-y-6 min-h-[280px] flex flex-col justify-center">
              <div dir="ltr" className="text-4xl font-bold flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => speak(english)}
                  className="rounded-full p-2 hover:bg-white/10"
                  aria-label="استمع"
                >
                  <Volume2 className="w-6 h-6 text-[#cdff4f]" />
                </button>
                <span>{english}</span>
              </div>
              {revealed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl text-[#cdff4f]"
                >
                  {arabic}
                </motion.div>
              ) : (
                <Button variant="outline" onClick={() => setRevealed(true)}>
                  اظهر المعنى
                </Button>
              )}
              {revealed && (
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => handle(false)}
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" /> ما زلت أنسى
                  </Button>
                  <Button
                    onClick={() => handle(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> أتقنتها
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function WeakPoints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: weakPoints = [], isLoading } = useWeakPoints(true);
  const [reviewing, setReviewing] = useState(false);

  const words = useMemo(() => weakPoints.filter((w) => w.item_type === 'word'), [weakPoints]);
  const exercises = useMemo(() => weakPoints.filter((w) => w.item_type === 'exercise'), [weakPoints]);

  if (!user) {
    if (typeof window !== 'undefined') navigate('/auth');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>نقاط الضعف | راجع كلماتك الصعبة - Lingo Arab</title>
        <meta
          name="description"
          content="راجع الكلمات والتمارين التي أخطأت فيها بنظام البطاقات التفاعلية للحفظ السريع."
        />
      </Helmet>
      <DashboardBackground>
        <SidebarDashboard />
        <div dir="rtl" className="min-h-[100dvh] px-4 py-8 sm:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </Button>
              {!reviewing && weakPoints.length > 0 && (
                <Button
                  onClick={() => setReviewing(true)}
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> راجع الآن
                </Button>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold">نقاط الضعف</h1>
              </div>
              <p className="text-muted-foreground">
                هنا نجمع لك تلقائياً الكلمات والتمارين التي أخطأت فيها — راجعها لتتحول إلى نقاط قوة.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center text-muted-foreground py-12">جاري التحميل...</div>
            ) : reviewing ? (
              <FlashcardReview items={weakPoints} onClose={() => setReviewing(false)} />
            ) : weakPoints.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur border-white/10">
                <CardContent className="p-12 text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-[#cdff4f] mx-auto" />
                  <h3 className="text-xl font-bold">ممتاز! لا توجد نقاط ضعف حالياً</h3>
                  <p className="text-muted-foreground">
                    استمر في الدروس وسنجمع لك أي كلمة تواجه فيها صعوبة.
                  </p>
                  <Button onClick={() => navigate('/app/courses')}>اذهب للدروس</Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="words">
                <TabsList className="mb-4">
                  <TabsTrigger value="words">
                    <BookOpen className="w-4 h-4 ml-1" />
                    الكلمات ({words.length})
                  </TabsTrigger>
                  <TabsTrigger value="exercises">
                    التمارين ({exercises.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="words" className="space-y-2">
                  {words.map((w) => (
                    <Card key={w.id} className="bg-card/60 backdrop-blur border-white/10">
                      <CardContent className="p-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => speak(w.item_data.english || w.item_key)}
                          className="rounded-full p-2 hover:bg-white/10"
                          aria-label="استمع"
                        >
                          <Volume2 className="w-5 h-5 text-[#cdff4f]" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div dir="ltr" className="font-bold text-lg">
                            {w.item_data.english || w.item_key}
                          </div>
                          <div className="text-sm text-muted-foreground">{w.item_data.arabic}</div>
                        </div>
                        <div className="text-xs text-red-400 font-bold whitespace-nowrap">
                          {w.mistakes_count} خطأ
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {words.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">لا توجد كلمات</p>
                  )}
                </TabsContent>
                <TabsContent value="exercises" className="space-y-2">
                  {exercises.map((w) => (
                    <Card key={w.id} className="bg-card/60 backdrop-blur border-white/10">
                      <CardContent className="p-4">
                        <div className="font-medium mb-1">{w.item_data.promptAr || w.item_key}</div>
                        {w.item_data.answer && (
                          <div dir="ltr" className="text-sm text-[#cdff4f]">
                            ✓ {w.item_data.answer}
                          </div>
                        )}
                        <div className="text-xs text-red-400 mt-1">{w.mistakes_count} خطأ</div>
                      </CardContent>
                    </Card>
                  ))}
                  {exercises.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">لا توجد تمارين</p>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </DashboardBackground>
    </>
  );
}
