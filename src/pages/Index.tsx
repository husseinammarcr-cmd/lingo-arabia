import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PageBackground from '@/components/PageBackground';
import Header from '@/components/Header';

// Import feature illustrations
import featureLessons from '@/assets/feature-lessons.png';
import featureXp from '@/assets/feature-xp.png';
import featureStreaks from '@/assets/feature-streaks.png';
import featureAchievements from '@/assets/feature-achievements.png';

interface FeatureCardProps {
  image: string;
  titleAr: string;
  titleEn: string;
  delay: number;
}

const FeatureCard = ({ image, titleAr, titleEn, delay }: FeatureCardProps) => (
  <div 
    className="group relative bg-gradient-to-b from-[hsl(195_85%_97%)] to-[hsl(195_80%_92%)] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Card content */}
    <div className="p-6 pb-0">
      <h3 className="text-xl font-bold text-foreground mb-1">{titleAr}</h3>
      <p className="text-sm text-muted-foreground ltr-text">{titleEn}</p>
    </div>
    
    {/* Illustration container */}
    <div className="relative h-48 md:h-56 flex items-end justify-center overflow-hidden">
      <img 
        src={image} 
        alt={titleEn}
        className="w-full h-full object-contain object-bottom transform group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { 
      image: featureLessons, 
      titleAr: 'دروس تفاعلية', 
      titleEn: 'Interactive Lessons' 
    },
    { 
      image: featureXp, 
      titleAr: 'اكسب نقاط XP', 
      titleEn: 'Earn XP Points' 
    },
    { 
      image: featureStreaks, 
      titleAr: 'سلسلة يومية', 
      titleEn: 'Daily Streaks' 
    },
    { 
      image: featureAchievements, 
      titleAr: 'إنجازات', 
      titleEn: 'Achievements' 
    },
  ];

  return (
    <PageBackground>
      <div dir="rtl">
        {/* Header */}
        <Header showAuthButton />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
              تعلّم الإنجليزية
              <span className="block text-primary mt-2">بطريقة ممتعة وفعّالة</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              منصة تعليمية مصممة خصيصاً للناطقين بالعربية. دروس تفاعلية، تمارين متنوعة، وتتبع تقدمك يومياً.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => navigate(user ? '/courses' : '/auth')}
                className="text-lg shadow-lg hover:shadow-xl"
              >
                {user ? 'تابع التعلم' : 'ابدأ مجاناً'}
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate(user ? '/placement-test' : '/auth?returnUrl=/placement-test')}
                className="text-lg border-2"
              >
                اختبار تحديد المستوى
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              لماذا LingoArab؟
            </h2>
            <p className="text-muted-foreground">
              اكتشف مميزات التعلم معنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                image={feature.image}
                titleAr={feature.titleAr}
                titleEn={feature.titleEn}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="relative bg-gradient-to-br from-primary to-[hsl(180_70%_45%)] rounded-3xl overflow-hidden shadow-elevated">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                انضم إلى آلاف المتعلمين
              </h3>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
                ابدأ رحلتك في تعلم الإنجليزية اليوم واكتشف طريقة ممتعة وفعّالة للتعلم
              </p>
              <Button 
                variant="accent" 
                size="xl"
                onClick={() => navigate('/auth')}
                className="shadow-lg hover:shadow-xl"
              >
                سجّل الآن مجاناً
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2024 LingoArab. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </div>
    </PageBackground>
  );
};

export default Index;
