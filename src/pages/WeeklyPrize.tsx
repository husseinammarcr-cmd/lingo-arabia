import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Award, Calendar, DollarSign, Star, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PrizeTicker from '@/components/PrizeTicker';

const WeeklyPrize = () => {
  const navigate = useNavigate();
  const { data: weeklyLeaders, isLoading } = useLeaderboard('global', 'weekly', undefined, undefined, 10);

  // Filter out founder (rank 0) for display
  const topUsers = (weeklyLeaders || []).filter(u => !u.is_founder).slice(0, 3);

  const rules = [
    'يتم احتساب النقاط الأسبوعية (Weekly XP) فقط وليس المجموع الكلي.',
    'تبدأ فترة الاحتساب من يوم السبت وتنتهي يوم الجمعة.',
    'يتم إعلان الفائز كل يوم جمعة بناءً على أعلى نقاط أسبوعية.',
    'الجائزة 25 دولار أمريكي تُرسل عبر وسيلة الدفع المتفق عليها.',
    'يجب أن يكون الحساب حقيقياً وغير مكرر للتأهل.',
    'يحق للإدارة إلغاء أي فوز في حال اكتشاف غش أو تلاعب.',
  ];

  const medalColors = [
    'from-yellow-400 to-amber-500',
    'from-gray-300 to-gray-400',
    'from-orange-400 to-orange-600',
  ];

  const medalLabels = ['🥇', '🥈', '🥉'];

  return (
    <>
      <Helmet>
        <title>الجائزة الأسبوعية | LingoArab</title>
        <meta name="description" content="تنافس أسبوعياً واربح 25 دولار كل يوم جمعة! تعرف على شروط المسابقة والفائزين." />
      </Helmet>

      <div dir="rtl" className="min-h-screen bg-background">
        <Header showBack showAuthButton />
        <PrizeTicker />

        <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg mx-auto">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              🏆 الجائزة الأسبوعية
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              تنافس مع المتعلمين الآخرين واحصل على <span className="font-bold text-primary">25$</span> كل يوم جمعة!
            </p>
          </div>

          {/* Prize Card */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
              <div className="text-center sm:text-right space-y-2 flex-1">
                <h2 className="text-2xl font-bold text-foreground">25 دولار أمريكي</h2>
                <p className="text-muted-foreground">تُمنح للمركز الأول في قائمة المتصدرين الأسبوعية كل يوم جمعة</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">كل يوم جمعة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Weekly Top 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                المتصدرون هذا الأسبوع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">جارٍ التحميل...</div>
              ) : topUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">لا توجد بيانات بعد لهذا الأسبوع</div>
              ) : (
                topUsers.map((user, i) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/10' : 'border-border'}`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${medalColors[i]} flex items-center justify-center text-white font-bold text-lg shadow`}>
                      {medalLabels[i]}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url || `/avatars/avatar-${(i % 10) + 1}.png`} />
                      <AvatarFallback>{(user.display_name || user.name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{user.display_name || user.name || 'متعلم'}</p>
                      {user.current_level && (
                        <Badge variant="secondary" className="text-xs">{user.current_level}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{user.weekly_xp || 0}</span>
                    </div>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/leaderboard')}>
                عرض قائمة المتصدرين الكاملة
              </Button>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                شروط المسابقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                كيف تفوز؟
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'تعلّم يومياً', desc: 'أكمل الدروس واكسب نقاط XP' },
                  { step: '2', title: 'تصدّر القائمة', desc: 'اجمع أعلى نقاط أسبوعية' },
                  { step: '3', title: 'اربح الجائزة', desc: 'احصل على 25$ كل جمعة' },
                ].map((item) => (
                  <div key={item.step} className="text-center p-4 rounded-xl bg-muted/50 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center pb-8">
            <Button variant="hero" size="xl" onClick={() => navigate('/app/courses')}>
              ابدأ التعلم وتنافس الآن! 🚀
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default WeeklyPrize;
