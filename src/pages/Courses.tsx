import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CURRICULUM, getTotalLessonsCount } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  BookOpen,
  GraduationCap,
  Lock,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import PageBackground from '@/components/PageBackground';
import Header from '@/components/Header';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/animations/AnimatedContainers';
import { TiltCard } from '@/components/animations/TiltCard';
import { AnimatedProgress } from '@/components/animations/AnimatedProgress';
import { usePrefersReducedMotion } from '@/hooks/useAnimations';
import { useUserProgress, isLevelUnlocked, getLevelIndex } from '@/hooks/useProgress';

// Import level illustrations
import levelA1Books from '@/assets/level-a1-books.jpeg';
import levelA2Books from '@/assets/level-a2-books.jpeg';
import levelB1Books from '@/assets/level-b1-books.jpeg';
import levelB2Books from '@/assets/level-b2-books.jpeg';

const levelColors: Record<string, string> = {
  'A1': 'from-emerald-500 to-emerald-600',
  'A2': 'from-sky-500 to-sky-600',
  'B1': 'from-violet-500 to-violet-600',
  'B2': 'from-amber-500 to-amber-600',
};

const levelImages: Record<string, string> = {
  'A1': levelA1Books,
  'A2': levelA2Books,
  'B1': levelB1Books,
  'B2': levelB2Books,
};

const Courses = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data: progressData } = useUserProgress();

  // Get completed lesson IDs
  const completedLessonIds = useMemo(() => {
    if (!progressData) return [];
    return progressData
      .filter(p => p.completed)
      .map(p => p.lesson_id);
  }, [progressData]);

  // Calculate progress for each level
  const levelProgressMap = useMemo(() => {
    const map: Record<string, { completed: number; total: number; progress: number }> = {};
    
    for (const level of CURRICULUM) {
      let completed = 0;
      let total = 0;
      
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          total++;
          if (completedLessonIds.includes(lesson.id)) {
            completed++;
          }
        }
      }
      
      map[level.code] = {
        completed,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }
    
    return map;
  }, [completedLessonIds]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          className="text-primary text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          جاري التحميل...
        </motion.div>
      </div>
    );
  }

  const totalLessons = getTotalLessonsCount();

  return (
    <PageBackground>
      <div dir="rtl">
      {/* Header */}
      <Header showUserInfo />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Placement Test Banner */}
        {!profile?.has_taken_placement && (
          <FadeUp>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <Card 
                className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => navigate('/placement-test')}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
                      animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div>
                      <div className="font-bold text-foreground">اختبار تحديد المستوى</div>
                      <div className="text-sm text-muted-foreground">اكتشف مستواك وابدأ من المكان المناسب</div>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-primary" />
                </CardContent>
              </Card>
            </motion.div>
          </FadeUp>
        )}

        {/* Page Title */}
        <FadeUp delay={0.1}>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">مستويات التعلم</h2>
            <p className="text-muted-foreground">
              {totalLessons} درس في 4 مستويات - من المبتدئ إلى المتقدم
            </p>
          </div>
        </FadeUp>

        {/* Levels Grid */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {CURRICULUM.map((level, index) => {
            const totalUnits = level.units.length;
            const totalLevelLessons = level.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
            const levelProgress = levelProgressMap[level.code];
            const progress = levelProgress?.progress ?? 0;
            const isUnlocked = isLevelUnlocked(level.code, profile?.placement_level, profile?.current_level);
            const levelImage = levelImages[level.code];
            const isCompleted = levelProgress?.completed === levelProgress?.total && levelProgress?.total > 0;

            return (
              <StaggerItem key={level.id}>
                <TiltCard
                  onClick={isUnlocked ? () => navigate(`/courses/${level.code.toLowerCase()}`) : undefined}
                  className={cn("h-full", !isUnlocked && "opacity-60 cursor-not-allowed")}
                >
                  <Card className={cn(
                    "group overflow-hidden transition-all duration-300 h-full",
                    isUnlocked && "cursor-pointer hover:shadow-elevated",
                    isCompleted && "ring-2 ring-success"
                  )}>
                    {/* Gradient Header with Illustration */}
                    <div className={cn("h-28 sm:h-32 bg-gradient-to-br relative overflow-hidden", levelColors[level.code])}>
                      {/* Background Image */}
                      <img 
                        src={levelImage} 
                        alt={`${level.code} illustration`}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover",
                          isUnlocked ? "opacity-90" : "opacity-50 grayscale"
                        )}
                      />
                      
                      {/* Overlay for better blending */}
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/10 to-transparent")} />
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/90 text-foreground shadow-sm">
                          {level.code}
                        </span>
                        {!isUnlocked && (
                          <span className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </span>
                        )}
                        {isCompleted && (
                          <span className="w-8 h-8 rounded-full bg-success/90 flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </span>
                        )}
                      </div>
                      
                      {/* Shine effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={prefersReducedMotion ? {} : { x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-foreground">{level.titleAr}</h3>
                            {!isUnlocked && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                مقفل
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                                مكتمل
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground ltr-text">{level.titleEn}</p>
                        </div>
                        <motion.div
                          whileHover={isUnlocked && !prefersReducedMotion ? { x: -4 } : {}}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ChevronLeft className={cn(
                            "w-5 h-5 transition-colors",
                            isUnlocked ? "text-muted-foreground group-hover:text-primary" : "text-muted-foreground/50"
                          )} />
                        </motion.div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{level.descriptionAr}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{totalUnits} وحدات</span>
                        <span>{levelProgress?.completed ?? 0} / {totalLevelLessons} درس</span>
                      </div>

                      <AnimatedProgress value={progress} />
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </main>
      </div>
    </PageBackground>
  );
};

export default Courses;
