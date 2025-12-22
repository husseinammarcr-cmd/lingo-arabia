import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById } from '@/lib/curriculum';
import { getLessonContent, LessonContent, VocabItem, SentenceItem, ExerciseItem, QuizItem } from '@/lib/a1-lessons';
import { ExerciseRenderer } from '@/components/ExerciseRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, Star, ChevronRight, Trophy, Loader2, BookOpen, Dumbbell, ClipboardCheck, Volume2, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateProgress, getNextLesson } from '@/hooks/useProgress';

type LessonSection = 'learn' | 'practice' | 'quiz';

const LessonPlayer = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, isLoading } = useAuth();
  const updateProgress = useUpdateProgress();
  
  const [section, setSection] = useState<LessonSection>('learn');
  const [learnIndex, setLearnIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const lessonData = getLessonById(lessonId || '');
  const lessonContent = getLessonContent(lessonId || '');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (isComplete && lessonId && lessonData && !isSaving) {
      setIsSaving(true);
      const totalXp = xpEarned + lessonData.lesson.xpReward;
      
      updateProgress.mutate({
        lessonId,
        completed: true,
        score: lessonContent ? Math.round((quizScore / quizTotal) * 100) : 100,
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

  // If no lesson content available, show coming soon
  if (!lessonContent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Star className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{lessonData.lesson.titleAr}</h2>
          <p className="text-muted-foreground mb-6">هذا الدرس قيد الإعداد. سيتم إضافة المحتوى قريباً!</p>
          <Button onClick={() => navigate(`/courses/${lessonData.level.code.toLowerCase()}/${lessonData.unit.id}`)}>
            <ChevronRight className="w-4 h-4 ml-2" />
            العودة للوحدة
          </Button>
        </div>
      </div>
    );
  }

  const getSectionProgress = () => {
    switch (section) {
      case 'learn':
        return ((learnIndex + 1) / (lessonContent.vocab.length + lessonContent.sentences.length)) * 33;
      case 'practice':
        return 33 + ((practiceIndex + 1) / lessonContent.exercises.length) * 33;
      case 'quiz':
        return 66 + ((quizIndex + 1) / lessonContent.quiz.length) * 34;
    }
  };

  const handleContinue = () => {
    const nextLessonId = getNextLesson(lessonId || '');
    if (nextLessonId) {
      navigate(`/lesson/${nextLessonId}`);
    } else {
      navigate(`/courses/${lessonData.level.code.toLowerCase()}/${lessonData.unit.id}`);
    }
  };

  const handleLearnNext = () => {
    const totalLearnItems = lessonContent.vocab.length + lessonContent.sentences.length;
    if (learnIndex < totalLearnItems - 1) {
      setLearnIndex(prev => prev + 1);
      setXpEarned(prev => prev + 1);
    } else {
      setSection('practice');
      setXpEarned(prev => prev + 5);
    }
  };

  const handlePracticeAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setXpEarned(prev => prev + 3);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }

    setTimeout(() => {
      if (practiceIndex < lessonContent.exercises.length - 1) {
        setPracticeIndex(prev => prev + 1);
      } else {
        setSection('quiz');
        setQuizTotal(lessonContent.quiz.reduce((acc, q) => acc + q.points, 0));
      }
    }, 1500);
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    const currentQuiz = lessonContent.quiz[quizIndex];
    if (isCorrect) {
      setQuizScore(prev => prev + currentQuiz.points);
      setXpEarned(prev => prev + 5);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }

    setTimeout(() => {
      if (quizIndex < lessonContent.quiz.length - 1) {
        setQuizIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    }, 1500);
  };

  // Completion screen
  if (isComplete) {
    const totalXp = xpEarned + lessonData.lesson.xpReward;
    const passed = lessonContent ? (quizScore / quizTotal) * 100 >= lessonContent.passingScore : true;
    
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-4">
          <div className={cn(
            "w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce-in",
            passed ? "bg-gradient-primary" : "bg-destructive/20"
          )}>
            <Trophy className={cn("w-12 h-12", passed ? "text-primary-foreground" : "text-destructive")} />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {passed ? 'أحسنت!' : 'حاول مرة أخرى'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {passed ? 'لقد أكملت الدرس بنجاح' : `تحتاج ${lessonContent.passingScore}% للنجاح`}
          </p>
          
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
                  <div className="flex items-center justify-center gap-1 text-primary text-2xl font-bold">
                    <ClipboardCheck className="w-6 h-6" />
                    <span>{Math.round((quizScore / quizTotal) * 100)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">نتيجة الاختبار</p>
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

  // Section tabs
  const renderSectionTabs = () => (
    <div className="flex gap-2 mb-4 justify-center">
      <div className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        section === 'learn' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <BookOpen className="w-4 h-4" />
        <span>تعلم</span>
      </div>
      <div className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        section === 'practice' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <Dumbbell className="w-4 h-4" />
        <span>تدريب</span>
      </div>
      <div className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
        section === 'quiz' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <ClipboardCheck className="w-4 h-4" />
        <span>اختبار</span>
      </div>
    </div>
  );

  // Learn section content
  const renderLearnSection = () => {
    const isVocab = learnIndex < lessonContent.vocab.length;
    const item = isVocab 
      ? lessonContent.vocab[learnIndex] 
      : lessonContent.sentences[learnIndex - lessonContent.vocab.length];

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            {isVocab ? (
              <>
                <p className="text-4xl font-bold text-primary mb-4 ltr-text">
                  {(item as VocabItem).english}
                </p>
                <p className="text-2xl text-foreground mb-4">{(item as VocabItem).arabic}</p>
                {(item as VocabItem).example && (
                  <div className="mt-6 p-4 bg-background/50 rounded-lg">
                    <p className="text-lg text-muted-foreground ltr-text">{(item as VocabItem).example}</p>
                    <p className="text-sm text-muted-foreground mt-1">{(item as VocabItem).exampleAr}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-primary mb-4 ltr-text">
                  {(item as SentenceItem).english}
                </p>
                <p className="text-xl text-foreground">{(item as SentenceItem).arabic}</p>
              </>
            )}
            <Button variant="ghost" size="icon" className="mt-4">
              <Volume2 className="w-6 h-6" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          {learnIndex + 1} / {lessonContent.vocab.length + lessonContent.sentences.length}
        </div>

        <Button variant="hero" size="xl" className="w-full" onClick={handleLearnNext}>
          {learnIndex < lessonContent.vocab.length + lessonContent.sentences.length - 1 ? 'التالي' : 'ابدأ التدريب'}
          <ChevronLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    );
  };

  // Practice section
  const renderPracticeSection = () => {
    const exercise = lessonContent.exercises[practiceIndex];
    return (
      <ExerciseRenderer
        type={exercise.type as 'mcq' | 'fill_blank' | 'reorder' | 'listening' | 'translation' | 'matching'}
        promptAr={exercise.promptAr}
        promptEn={exercise.promptEn}
        data={{
          options: exercise.data.options,
          correct: exercise.data.correct,
          answer: exercise.data.answer,
          alternatives: exercise.data.alternatives,
          words: exercise.data.words,
          correct_order: exercise.data.correctOrder,
          hint_ar: exercise.data.hint,
          pairs: exercise.data.pairs,
        }}
        onAnswer={handlePracticeAnswer}
      />
    );
  };

  // Quiz section
  const renderQuizSection = () => {
    const quiz = lessonContent.quiz[quizIndex];
    return (
      <ExerciseRenderer
        type={quiz.type as 'mcq' | 'fill_blank' | 'reorder' | 'listening' | 'translation' | 'matching'}
        promptAr={quiz.promptAr}
        promptEn={quiz.promptEn}
        data={{
          options: quiz.data.options,
          correct: quiz.data.correct,
          answer: quiz.data.answer,
          alternatives: quiz.data.alternatives,
          words: quiz.data.words,
          correct_order: quiz.data.correctOrder,
          hint_ar: quiz.data.hint,
          pairs: quiz.data.pairs,
        }}
        onAnswer={handleQuizAnswer}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <X className="w-5 h-5" />
          </Button>
          
          <Progress value={getSectionProgress()} className="flex-1 h-3" />
          
          <div className="flex items-center gap-1 text-hearts font-bold">
            <Heart className={cn("w-5 h-5", hearts > 0 && "fill-current")} />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
        {renderSectionTabs()}
        
        {section === 'learn' && renderLearnSection()}
        {section === 'practice' && renderPracticeSection()}
        {section === 'quiz' && renderQuizSection()}
      </main>
    </div>
  );
};

export default LessonPlayer;
