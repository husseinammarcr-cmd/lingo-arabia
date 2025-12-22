import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getLevelByCode, getUnitById } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  Moon, 
  Sun, 
  LogOut, 
  Star, 
  Crown,
  Lock,
  CheckCircle,
  PlayCircle,
  BookOpen,
  Headphones,
  MessageCircle,
  PenLine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const lessonIcons: Record<string, React.ElementType> = {
  'المفردات': BookOpen,
  'القواعد': PenLine,
  'الاستماع': Headphones,
  'المحادثة': MessageCircle,
  'التمارين': PlayCircle,
};

const levelColors: Record<string, { bg: string; text: string; accent: string }> = {
  'A1': { bg: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', accent: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'A2': { bg: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-400', accent: 'bg-sky-100 dark:bg-sky-900/30' },
  'B1': { bg: 'bg-violet-500', text: 'text-violet-700 dark:text-violet-400', accent: 'bg-violet-100 dark:bg-violet-900/30' },
  'B2': { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', accent: 'bg-amber-100 dark:bg-amber-900/30' },
};

const CourseUnit = () => {
  const navigate = useNavigate();
  const { level: levelParam, unit: unitParam } = useParams<{ level: string; unit: string }>();
  const { user, profile, signOut, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const level = getLevelByCode(levelParam || '');
  const unit = level ? getUnitById(level.code, unitParam || '') : undefined;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  // Unit not found - show friendly empty state
  if (!level || !unit) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">الوحدة غير موجودة</h2>
          <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذه الوحدة</p>
          <Button onClick={() => navigate('/courses')}>
            <ChevronRight className="w-4 h-4 ml-2" />
            العودة للمستويات
          </Button>
        </div>
      </div>
    );
  }

  const colors = levelColors[level.code] || levelColors['A1'];

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/courses/${level.code.toLowerCase()}`)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
              LingoArab
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-xp/10 text-xp px-3 py-1.5 rounded-full font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{profile?.xp || 0}</span>
            </div>
            {profile?.is_premium && <Crown className="w-5 h-5 text-accent fill-accent" />}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Unit Header */}
        <div className="mb-8 text-center">
          <span className={cn("inline-block text-sm font-bold px-3 py-1 rounded-full mb-3", colors.accent, colors.text)}>
            {level.code}
          </span>
          <h2 className="text-3xl font-bold text-foreground mb-2">{unit.titleAr}</h2>
          <p className="text-muted-foreground ltr-text">{unit.titleEn}</p>
          <p className="text-sm text-muted-foreground mt-2">{unit.descriptionAr}</p>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {unit.lessons.map((lesson, index) => {
            const IconComponent = lessonIcons[lesson.titleAr] || BookOpen;
            // First lesson unlocked, rest locked for placeholder
            const isLocked = index > 0 && !lesson.hasRealExercises;
            const isCompleted = false;
            const hasExercises = lesson.hasRealExercises;

            return (
              <Card
                key={lesson.id}
                onClick={!isLocked ? () => navigate(`/lesson/${lesson.id}`) : undefined}
                className={cn(
                  "relative overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
                  isLocked && "opacity-50 cursor-not-allowed",
                  isCompleted && "ring-2 ring-success",
                  hasExercises && "ring-2 ring-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                      isCompleted ? "bg-success/10 text-success" : 
                      hasExercises ? "bg-primary/10 text-primary" :
                      cn(colors.accent, colors.text)
                    )}>
                      {isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">الدرس {index + 1}</span>
                        {hasExercises && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            تمارين حقيقية
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-foreground truncate">
                        {lesson.titleAr}
                      </h3>
                      <p className="text-sm text-muted-foreground ltr-text truncate">
                        {lesson.titleEn}
                      </p>
                    </div>

                    {/* XP Badge */}
                    <div className="flex items-center gap-1 text-xp text-sm font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>+{lesson.xpReward}</span>
                    </div>

                    {/* Arrow */}
                    <ChevronLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CourseUnit;
