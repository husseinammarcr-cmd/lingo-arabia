import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Flame, Trophy, ChevronLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const features = [
    { icon: BookOpen, titleAr: 'دروس تفاعلية', titleEn: 'Interactive Lessons' },
    { icon: Star, titleAr: 'اكسب نقاط XP', titleEn: 'Earn XP Points' },
    { icon: Flame, titleAr: 'سلسلة يومية', titleEn: 'Daily Streaks' },
    { icon: Trophy, titleAr: 'إنجازات', titleEn: 'Achievements' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">LingoArab</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {user ? (
              <Button variant="default" onClick={() => navigate('/courses')}>
                تابع التعلم
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')}>
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            تعلّم الإنجليزية
            <span className="block text-primary">بطريقة ممتعة وفعّالة</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            منصة تعليمية مصممة خصيصاً للناطقين بالعربية. دروس تفاعلية، تمارين متنوعة، وتتبع تقدمك يومياً.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => navigate(user ? '/courses' : '/auth')}
              className="text-lg"
            >
              {user ? 'تابع التعلم' : 'ابدأ مجاناً'}
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="text-lg"
            >
              اختبار تحديد المستوى
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{feature.titleAr}</h3>
                <p className="text-sm text-muted-foreground ltr-text">{feature.titleEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              انضم إلى آلاف المتعلمين
            </h3>
            <p className="text-lg opacity-90 mb-6">
              ابدأ رحلتك في تعلم الإنجليزية اليوم
            </p>
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => navigate('/auth')}
            >
              سجّل الآن مجاناً
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 LingoArab. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
