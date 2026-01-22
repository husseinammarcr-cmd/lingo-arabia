import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { CURRICULUM, getTotalLessonsCount } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import PageBackground from '@/components/PageBackground';
import Header from '@/components/Header';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/animations/AnimatedContainers';
import { TiltCard } from '@/components/animations/TiltCard';
import { AnimatedProgress } from '@/components/animations/AnimatedProgress';
import { usePrefersReducedMotion } from '@/hooks/useAnimations';

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
            // Placeholder progress - would come from user data
            const progress = 0;
            const levelImage = levelImages[level.code];

            return (
              <StaggerItem key={level.id}>
                <TiltCard
                  onClick={() => navigate(`/courses/${level.code.toLowerCase()}`)}
                  className="h-full"
                >
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-elevated transition-all duration-300 h-full">
                    {/* Gradient Header with Illustration */}
                    <div className={cn("h-28 sm:h-32 bg-gradient-to-br relative overflow-hidden", levelColors[level.code])}>
                      {/* Background Image */}
                      <img 
                        src={levelImage} 
                        alt={`${level.code} illustration`}
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                      />
                      
                      {/* Overlay for better blending */}
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/10 to-transparent")} />
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="text-sm font-bold px-3 py-1 rounded-full bg-white/90 text-foreground shadow-sm">
                          {level.code}
                        </span>
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
                          </div>
                          <p className="text-sm text-muted-foreground ltr-text">{level.titleEn}</p>
                        </div>
                        <motion.div
                          whileHover={prefersReducedMotion ? {} : { x: -4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{level.descriptionAr}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{totalUnits} وحدات</span>
                        <span>{totalLevelLessons} درس</span>
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
