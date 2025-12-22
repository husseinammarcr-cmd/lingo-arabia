import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Target, Sparkles, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dailyGoal, setDailyGoal] = useState<'5' | '10' | '15'>('10');

  const levels = [
    { value: 'beginner' as const, titleAr: 'مبتدئ', titleEn: 'Beginner', desc: 'أتعلم الإنجليزية لأول مرة' },
    { value: 'intermediate' as const, titleAr: 'متوسط', titleEn: 'Intermediate', desc: 'أعرف بعض الأساسيات' },
    { value: 'advanced' as const, titleAr: 'متقدم', titleEn: 'Advanced', desc: 'أريد تحسين مستواي' },
  ];

  const goals = [
    { value: '5' as const, titleAr: '5 دقائق', desc: 'مشغول جداً' },
    { value: '10' as const, titleAr: '10 دقائق', desc: 'توازن مثالي' },
    { value: '15' as const, titleAr: '15 دقائق', desc: 'جاد في التعلم' },
  ];

  const handleFinish = async () => {
    await updateProfile({ level, daily_goal: dailyGoal, onboarding_completed: true });
    navigate('/learn');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="text-center space-y-6">
              <BookOpen className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">ما هو مستواك؟</h2>
              <div className="space-y-3">
                {levels.map((l) => (
                  <Button key={l.value} variant={level === l.value ? 'default' : 'outline'} className="w-full h-auto py-4 flex-col" onClick={() => setLevel(l.value)}>
                    <span className="font-bold">{l.titleAr}</span>
                    <span className="text-sm opacity-70">{l.desc}</span>
                  </Button>
                ))}
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={() => setStep(1)}>التالي <ArrowLeft className="w-4 h-4" /></Button>
            </div>
          )}
          {step === 1 && (
            <div className="text-center space-y-6">
              <Target className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">هدفك اليومي</h2>
              <div className="space-y-3">
                {goals.map((g) => (
                  <Button key={g.value} variant={dailyGoal === g.value ? 'default' : 'outline'} className="w-full h-auto py-4 flex-col" onClick={() => setDailyGoal(g.value)}>
                    <span className="font-bold">{g.titleAr}</span>
                    <span className="text-sm opacity-70">{g.desc}</span>
                  </Button>
                ))}
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={handleFinish}><Sparkles className="w-4 h-4" /> ابدأ التعلم</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
