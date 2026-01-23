import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelByCode } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight,
  Lock,
  CheckCircle,
  BookOpen,
  Clock,
  HandMetal,
  Home,
  Briefcase,
  UtensilsCrossed,
  MapPin,
  Sunrise,
  Gamepad2,
  ShoppingCart,
  CircleCheck,
  History,
  Calendar,
  Plane,
  HeartPulse,
  Scale,
  Phone,
  Building,
  Globe,
  MessageCircle,
  GraduationCap,
  Lightbulb,
  Tv,
  Laptop,
  Leaf,
  Users,
  UserCheck,
  PenTool,
  MessageSquare,
  Presentation,
  FileText,
  Target,
  Puzzle,
  Layers,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import PageBackground from '@/components/PageBackground';
import Header from '@/components/Header';
import { useUserProgress, getUnitProgress } from '@/hooks/useProgress';

const iconMap: Record<string, React.ElementType> = {
  'hand-wave': HandMetal,
  'clock': Clock,
  'home': Home,
  'briefcase': Briefcase,
  'utensils': UtensilsCrossed,
  'map': MapPin,
  'sun': Sunrise,
  'gamepad': Gamepad2,
  'shopping-cart': ShoppingCart,
  'check-circle': CircleCheck,
  'history': History,
  'calendar': Calendar,
  'plane': Plane,
  'heart-pulse': HeartPulse,
  'scale': Scale,
  'phone': Phone,
  'building': Building,
  'globe': Globe,
  'book-open': BookOpen,
  'message-circle': MessageCircle,
  'graduation-cap': GraduationCap,
  'lightbulb': Lightbulb,
  'tv': Tv,
  'laptop': Laptop,
  'leaf': Leaf,
  'users': Users,
  'user-check': UserCheck,
  'pen-tool': PenTool,
  'message-square': MessageSquare,
  'presentation': Presentation,
  'file-text': FileText,
  'target': Target,
  'puzzle': Puzzle,
  'layers': Layers,
  'clipboard-check': ClipboardCheck,
};

const levelColors: Record<string, { bg: string; text: string; accent: string }> = {
  'A1': { bg: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', accent: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'A2': { bg: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-400', accent: 'bg-sky-100 dark:bg-sky-900/30' },
  'B1': { bg: 'bg-violet-500', text: 'text-violet-700 dark:text-violet-400', accent: 'bg-violet-100 dark:bg-violet-900/30' },
  'B2': { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', accent: 'bg-amber-100 dark:bg-amber-900/30' },
};

const CourseLevel = () => {
  const navigate = useNavigate();
  const { level: levelParam } = useParams<{ level: string }>();
  const { user, profile, isLoading } = useAuth();
  const { data: progressData, isLoading: isProgressLoading } = useUserProgress();

  const level = getLevelByCode(levelParam || '');

  // Compute completed lesson IDs from progress data
  const completedLessonIds = useMemo(() => {
    if (!progressData) return [];
    return progressData
      .filter(p => p.completed)
      .map(p => p.lesson_id);
  }, [progressData]);

  // Compute unit progress for this level with placement level awareness
  const unitProgressMap = useMemo(() => {
    if (!levelParam) return {};
    const progressList = getUnitProgress(
      levelParam, 
      completedLessonIds,
      profile?.placement_level,
      profile?.current_level
    );
    return progressList.reduce((acc, up) => {
      acc[up.unitId] = up;
      return acc;
    }, {} as Record<string, ReturnType<typeof getUnitProgress>[0]>);
  }, [levelParam, completedLessonIds, profile?.placement_level, profile?.current_level]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || isProgressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  // Level not found - show friendly empty state
  if (!level) {
    return (
      <PageBackground>
        <div className="min-h-screen flex flex-col items-center justify-center" dir="rtl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">المستوى غير موجود</h2>
            <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على هذا المستوى</p>
            <Button onClick={() => navigate('/app/courses')}>
              <ChevronRight className="w-4 h-4 ml-2" />
              العودة للمستويات
            </Button>
          </div>
        </div>
      </PageBackground>
    );
  }

  const colors = levelColors[level.code] || levelColors['A1'];

  return (
    <PageBackground>
      <div dir="rtl">
      {/* Header */}
      <Header showBack showUserInfo />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Level Header */}
        <div className="mb-8 text-center">
          <span className={cn("inline-block text-sm font-bold px-3 py-1 rounded-full mb-3", colors.accent, colors.text)}>
            {level.code}
          </span>
          <h2 className="text-3xl font-bold text-foreground mb-2">{level.titleAr}</h2>
          <p className="text-muted-foreground ltr-text">{level.titleEn}</p>
          <p className="text-sm text-muted-foreground mt-2">{level.descriptionAr}</p>
        </div>

        {/* Units List */}
        <div className="space-y-4">
        {level.units.map((unit, index) => {
            const IconComponent = iconMap[unit.icon] || BookOpen;
            const unitProgress = unitProgressMap[unit.id];
            const lessonsCount = unitProgress?.totalLessons ?? unit.lessons.length;
            const completedLessons = unitProgress?.completedLessons ?? 0;
            const isLocked = unitProgress ? !unitProgress.isUnlocked : index > 0;
            const progress = lessonsCount > 0 ? (completedLessons / lessonsCount) * 100 : 0;
            const isCompleted = unitProgress?.isCompleted ?? false;

            return (
              <Card
                key={unit.id}
                onClick={!isLocked ? () => navigate(`/app/courses/${level.code.toLowerCase()}/${unit.id}`) : undefined}
                className={cn(
                  "relative overflow-hidden cursor-pointer hover:shadow-elevated hover:-translate-y-1 transition-all duration-300",
                  isLocked && "opacity-60 cursor-not-allowed",
                  isCompleted && "ring-2 ring-success"
                )}
              >
                {/* Gradient accent bar */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1",
                  isCompleted ? "bg-gradient-success" : colors.bg
                )} />

                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                      isCompleted ? "bg-success/10 text-success" : cn(colors.accent, colors.text)
                    )}>
                      {isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">الوحدة {index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                        {unit.titleAr}
                      </h3>
                      <p className="text-sm text-muted-foreground ltr-text truncate mb-3">
                        {unit.titleEn}
                      </p>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">
                            {completedLessons} / {lessonsCount} دروس
                          </span>
                          <span className={cn("font-semibold", colors.text)}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronLeft className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      </div>
    </PageBackground>
  );
};

export default CourseLevel;
