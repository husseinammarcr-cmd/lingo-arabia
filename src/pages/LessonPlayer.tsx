import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, A1_UNIT1_LESSON1_EXERCISES } from '@/lib/curriculum';
import { ExerciseRenderer } from '@/components/ExerciseRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, Star, ChevronRight, Trophy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateProgress, getNextLesson } from '@/hooks/useProgress';

const LessonPlayer = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, isLoading } = useAuth();
  const updateProgress = useUpdateProgress();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const lessonData = getLessonById(lessonId || '');
  const exercises = lessonData?.lesson.hasRealExercises ? A1_UNIT1_LESSON1_EXERCISES : [];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Save progress when lesson completes
  useEffect(() => {
    if (isComplete && lessonId && lessonData && !isSaving) {
      setIsSaving(true);
      const totalXp = xpEarned + lessonData.lesson.xpReward;
      
      updateProgress.mutate({
        lessonId,
        completed: true,
        score: Math.round((xpEarned / (exercises.length * 5)) * 100),
        heartsRemaining: hearts,
        xpEarned: totalXp
      }, {
        onSettled: () => setIsSaving(false)
      });
    }
  }, [isComplete]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">الدرس غير موجود</h2>
          <Button onClick={() => navigate('/courses')}>
            <ChevronRight className="w-4 h-4 ml-2" />
            العودة للمستويات
          </Button>
        </div>
      </div>
    );
  }

  // Placeholder for lessons without exercises
  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{lessonData.lesson.titleAr}</h2>
          <p className="text-muted-foreground mb-6">هذا الدرس قيد الإعداد. سيتم إضافة التمارين قريباً!</p>
          <Button onClick={() => navigate(`/courses/${lessonData.level.code.toLowerCase()}/${lessonData.unit.id}`)}>
            <ChevronRight className="w-4 h-4 ml-2" />
            العودة للوحدة
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
  const currentExercise = exercises[currentExerciseIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setXpEarned(prev => prev + 5);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }

    setTimeout(() => {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  const handleContinue = () => {
    const nextLessonId = getNextLesson(lessonId || '');
    if (nextLessonId) {
      navigate(`/lesson/${nextLessonId}`);
    } else {
      navigate(`/courses/${lessonData.level.code.toLowerCase()}/${lessonData.unit.id}`);
    }
  };

  if (isComplete) {
    const totalXp = xpEarned + lessonData.lesson.xpReward;
    
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center animate-bounce-in">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">أحسنت!</h2>
          <p className="text-muted-foreground mb-6">لقد أكملت الدرس بنجاح</p>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xp text-2xl font-bold">
                    <Star className="w-6 h-6 fill-current" />
                    <span>+{totalXp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">نقاط XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-hearts text-2xl font-bold">
                    <Heart className="w-6 h-6 fill-current" />
                    <span>{hearts}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">قلوب متبقية</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            variant="hero" 
            size="xl" 
            onClick={handleContinue}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              'متابعة'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="w-5 h-5" />
          </Button>
          
          <Progress value={progress} className="flex-1 h-3" />
          
          <div className="flex items-center gap-1 text-hearts font-bold">
            <Heart className={cn("w-5 h-5", hearts > 0 && "fill-current")} />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Exercise */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        <ExerciseRenderer
          type={currentExercise.type}
          promptAr={currentExercise.promptAr}
          promptEn={currentExercise.promptEn}
          data={{
            options: currentExercise.data_json.options as string[] | undefined,
            correct: currentExercise.data_json.correctIndex as number | undefined,
            answer: currentExercise.data_json.answer as string | undefined,
            words: currentExercise.data_json.words as string[] | undefined,
            correct_order: currentExercise.data_json.correctOrder as number[] | undefined,
            hint_ar: currentExercise.data_json.hint as string | undefined,
            alternatives: currentExercise.data_json.correctAnswers as string[] | undefined,
          }}
          onAnswer={handleAnswer}
        />
      </main>
    </div>
  );
};

export default LessonPlayer;
