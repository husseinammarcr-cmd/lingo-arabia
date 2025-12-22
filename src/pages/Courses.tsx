import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CURRICULUM, getTotalLessonsCount } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  Moon, 
  Sun, 
  LogOut, 
  Star, 
  Crown,
  BookOpen,
  Trophy,
  GraduationCap,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const levelIcons: Record<string, React.ElementType> = {
  'A1': BookOpen,
  'A2': Trophy,
  'B1': GraduationCap,
  'B2': Rocket,
};

const levelColors: Record<string, string> = {
  'A1': 'from-emerald-500 to-emerald-600',
  'A2': 'from-sky-500 to-sky-600',
  'B1': 'from-violet-500 to-violet-600',
  'B2': 'from-amber-500 to-amber-600',
};

const Courses = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const totalLessons = getTotalLessonsCount();

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
            LingoArab
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-xp/10 text-xp px-3 py-1.5 rounded-full font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{profile?.xp || 0}</span>
            </div>
            {profile?.is_premium && <Crown className="w-5 h-5 text-accent fill-accent" />}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {profile?.name?.charAt(0) || 'U'}
              </div>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">مستويات التعلم</h2>
          <p className="text-muted-foreground">
            {totalLessons} درس في 4 مستويات - من المبتدئ إلى المتقدم
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {CURRICULUM.map((level) => {
            const IconComponent = levelIcons[level.code] || BookOpen;
            const totalUnits = level.units.length;
            const totalLevelLessons = level.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
            // Placeholder progress - would come from user data
            const progress = 0;

            return (
              <Card
                key={level.id}
                onClick={() => navigate(`/courses/${level.code.toLowerCase()}`)}
                className="group cursor-pointer overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient Header */}
                <div className={cn("h-24 bg-gradient-to-br flex items-center justify-center", levelColors[level.code])}>
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          level.code === 'A1' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                          level.code === 'A2' && "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
                          level.code === 'B1' && "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                          level.code === 'B2' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        )}>
                          {level.code}
                        </span>
                        <h3 className="text-lg font-bold text-foreground">{level.titleAr}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ltr-text">{level.titleEn}</p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{level.descriptionAr}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{totalUnits} وحدات</span>
                    <span>{totalLevelLessons} درس</span>
                  </div>

                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Courses;
