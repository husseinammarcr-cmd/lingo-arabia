import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { StreakWidget } from '@/components/StreakWidget';
import { UserLevelBadge } from '@/components/UserLevelBadge';
import { AchievementsGrid } from '@/components/AchievementsGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Star, Flame, BookOpen, Settings } from 'lucide-react';
import Header from '@/components/Header';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/animations/AnimatedContainers';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { MagneticButton, BouncingIcon } from '@/components/animations/MagneticButton';
import { usePrefersReducedMotion } from '@/hooks/useAnimations';
import { LottieAnimation } from '@/components/animations/LottieAnimation';
import level1Banner from '@/assets/level1-banner.json';

const getFlagEmoji = (countryCode: string | null) => {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Header showBack />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Profile Card */}
        <FadeUp delay={0}>
          <Card className="overflow-hidden relative">
            {/* Level 1 Banner Animation */}
            {(profile?.user_level || 1) === 1 && (
              <div className="relative z-10 w-full h-12 overflow-hidden bg-gradient-to-l from-primary/10 via-accent/10 to-primary/10">
                <LottieAnimation 
                  animationData={level1Banner}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                  style={{ background: 'transparent' }}
                />
              </div>
            )}
            {/* Subtle gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-0" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                {/* Avatar with animation */}
                <motion.div
                  className="relative flex-shrink-0"
                  initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <Avatar className="w-20 h-20 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ''} alt="صورة المستخدم" />
                    <AvatarFallback className="bg-gradient-primary text-3xl font-bold text-primary-foreground">
                      {profile?.display_name?.charAt(0) || profile?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 text-2xl">
                    {getFlagEmoji(profile?.country_code || null)}
                  </span>
                </motion.div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{profile?.display_name || profile?.name || 'متعلم'}</h2>
                  <p className="text-muted-foreground text-sm">{profile?.email}</p>
                  
                  {/* Level badge */}
                  <div className="mt-3">
                    <UserLevelBadge 
                      level={profile?.user_level || 1} 
                      xp={profile?.xp || 0} 
                      size="sm"
                    />
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        </FadeUp>

        {/* Stats Cards */}
        <FadeUp delay={0.1}>
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center p-4">
              <BouncingIcon>
                <Star className="w-6 h-6 text-xp mx-auto mb-2" />
              </BouncingIcon>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={profile?.xp || 0} />
              </div>
              <p className="text-xs text-muted-foreground">إجمالي XP</p>
            </Card>
            <Card className="text-center p-4">
              <BouncingIcon>
                <Flame className="w-6 h-6 text-streak mx-auto mb-2" />
              </BouncingIcon>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={profile?.streak_count || 0} />
              </div>
              <p className="text-xs text-muted-foreground">أيام متتالية</p>
            </Card>
            <Card className="text-center p-4">
              <BouncingIcon>
                <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
              </BouncingIcon>
              <div className="text-2xl font-bold">
                <AnimatedCounter value={profile?.weekly_xp || 0} />
              </div>
              <p className="text-xs text-muted-foreground">XP الأسبوع</p>
            </Card>
          </div>
        </FadeUp>

        {/* Quick Actions */}
        <FadeUp delay={0.15}>
          <StaggerContainer className="grid grid-cols-3 gap-3">
            <StaggerItem>
              <MagneticButton className="w-full">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 w-full"
                  onClick={() => navigate('/leaderboard')}
                >
                  <BouncingIcon>
                    <Trophy className="w-6 h-6 text-xp" />
                  </BouncingIcon>
                  <span className="text-xs">المتصدرين</span>
                </Button>
              </MagneticButton>
            </StaggerItem>
            <StaggerItem>
              <MagneticButton className="w-full">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 w-full"
                  onClick={() => navigate('/challenges')}
                >
                  <BouncingIcon>
                    <Target className="w-6 h-6 text-primary" />
                  </BouncingIcon>
                  <span className="text-xs">التحديات</span>
                </Button>
              </MagneticButton>
            </StaggerItem>
            <StaggerItem>
              <MagneticButton className="w-full">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 w-full"
                  onClick={() => navigate('/settings')}
                >
                  <BouncingIcon>
                    <Settings className="w-6 h-6 text-muted-foreground" />
                  </BouncingIcon>
                  <span className="text-xs">الإعدادات</span>
                </Button>
              </MagneticButton>
            </StaggerItem>
          </StaggerContainer>
        </FadeUp>

        {/* Streak Widget */}
        <FadeUp delay={0.2}>
          <StreakWidget 
            currentStreak={profile?.streak_count || 0} 
            lastStudyDate={profile?.last_study_date || null} 
          />
        </FadeUp>

        {/* Achievements */}
        <FadeUp delay={0.25}>
          <AchievementsGrid />
        </FadeUp>

        {/* Sign out */}
        <FadeUp delay={0.3}>
          <Button variant="outline" className="w-full" onClick={signOut}>
            تسجيل الخروج
          </Button>
        </FadeUp>
      </main>
    </div>
  );
};

export default Profile;
