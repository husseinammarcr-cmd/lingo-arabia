import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAchievements } from '@/hooks/useAchievements';
import { StreakWidget } from '@/components/StreakWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trophy, ArrowRight, Crown, Settings } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { data: achievements } = useUserAchievements();

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/learn')}><ArrowRight className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">الملف الشخصي</h1>
          <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mb-4">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-2xl font-bold">{profile?.name || 'متعلم'}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xp font-bold text-xl"><Star className="w-5 h-5 fill-current" />{profile?.xp || 0}</div>
                <p className="text-xs text-muted-foreground">نقاط XP</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{achievements?.length || 0}</div>
                <p className="text-xs text-muted-foreground">إنجازات</p>
              </div>
            </div>
            {!profile?.is_premium && <Button variant="accent" className="mt-4" onClick={() => navigate('/premium')}><Crown className="w-4 h-4" /> ترقية إلى Premium</Button>}
          </CardContent>
        </Card>

        <StreakWidget currentStreak={profile?.streak_count || 0} lastStudyDate={profile?.last_study_date} />

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-accent" /> الإنجازات</CardTitle></CardHeader>
          <CardContent>
            {achievements?.length ? (
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((a) => (
                  <div key={a.id} className="text-center p-3 bg-secondary rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto text-accent mb-2" />
                    <p className="text-xs font-medium">{a.achievement?.title_ar}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-center">لم تحصل على إنجازات بعد</p>}
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={signOut}>تسجيل الخروج</Button>
      </main>
    </div>
  );
};

export default Profile;
