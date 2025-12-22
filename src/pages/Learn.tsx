import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUnits, useLessons } from '@/hooks/useUnits';
import { useUserProgress } from '@/hooks/useProgress';
import { UnitCard } from '@/components/UnitCard';
import { StreakWidget } from '@/components/StreakWidget';
import { AdSlot } from '@/components/AdSlot';
import { Button } from '@/components/ui/button';
import { Star, Crown, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Learn = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: units, isLoading: unitsLoading } = useUnits();
  const { data: lessons } = useLessons();
  const { data: progress } = useUserProgress();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (!authLoading && user && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [user, profile, authLoading, navigate]);

  const getCompletedLessonsForUnit = (unitId: string) => {
    if (!lessons || !progress) return 0;
    const unitLessons = lessons.filter(l => l.unit_id === unitId);
    return unitLessons.filter(l => progress.some(p => p.lesson_id === l.id && p.completed)).length;
  };

  const getLessonsCountForUnit = (unitId: string) => {
    if (!lessons) return 0;
    return lessons.filter(l => l.unit_id === unitId).length;
  };

  if (authLoading || unitsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>LingoArab</h1>
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

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Streak Widget */}
        <StreakWidget 
          currentStreak={profile?.streak_count || 0} 
          lastStudyDate={profile?.last_study_date}
          className="mb-6"
        />

        {/* Ad Slot */}
        {!profile?.is_premium && <AdSlot variant="banner" className="mb-6" />}

        {/* Units List */}
        <h2 className="text-xl font-bold mb-4">وحدات التعلم</h2>
        <div className="space-y-4">
          {units?.map((unit, index) => (
            <UnitCard
              key={unit.id}
              id={unit.id}
              titleAr={unit.title_ar}
              titleEn={unit.title_en}
              descriptionAr={unit.description_ar || undefined}
              icon={unit.icon}
              lessonsCount={getLessonsCountForUnit(unit.id)}
              completedLessons={getCompletedLessonsForUnit(unit.id)}
              isLocked={index > 0 && getCompletedLessonsForUnit(units[index - 1].id) === 0}
              onClick={() => navigate(`/learn/unit/${unit.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Learn;
