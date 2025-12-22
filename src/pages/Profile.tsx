import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { StreakWidget } from '@/components/StreakWidget';
import { UserLevelBadge } from '@/components/UserLevelBadge';
import { AchievementsGrid } from '@/components/AchievementsGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Target, Settings } from 'lucide-react';
import Header from '@/components/Header';

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

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <Header showBack />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {profile?.display_name?.charAt(0) || profile?.name?.charAt(0) || 'U'}
                </div>
                <span className="absolute -bottom-1 -right-1 text-2xl">
                  {getFlagEmoji(profile?.country_code || null)}
                </span>
              </div>

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

            {!profile?.is_premium && (
              <Button 
                variant="default" 
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                onClick={() => navigate('/premium')}
              >
                <Crown className="w-4 h-4 ml-2" /> 
                ترقية إلى Premium
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/leaderboard')}
          >
            <Trophy className="w-6 h-6 text-xp" />
            <span>لوحة المتصدرين</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate('/challenges')}
          >
            <Target className="w-6 h-6 text-primary" />
            <span>التحديات</span>
          </Button>
        </div>

        {/* Streak Widget */}
        <StreakWidget 
          currentStreak={profile?.streak_count || 0} 
          lastStudyDate={profile?.last_study_date || null} 
        />

        {/* Achievements */}
        <AchievementsGrid />

        {/* Sign out */}
        <Button variant="outline" className="w-full" onClick={signOut}>
          تسجيل الخروج
        </Button>
      </main>
    </div>
  );
};

export default Profile;