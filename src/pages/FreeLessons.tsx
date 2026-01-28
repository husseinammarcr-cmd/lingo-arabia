import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Book, ChevronLeft, GraduationCap, Star, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CURRICULUM } from '@/lib/curriculum';
import { useAuth } from '@/contexts/AuthContext';
// Get first lesson of each unit for public preview
const getFreeLessons = () => {
  const freeLessons: Array<{
    levelCode: string;
    levelTitleAr: string;
    levelTitleEn: string;
    levelColor: string;
    units: Array<{
      unitId: string;
      unitTitleAr: string;
      unitTitleEn: string;
      lessonId: string;
      lessonTitleAr: string;
      lessonTitleEn: string;
      xpReward: number;
    }>;
  }> = [];

  for (const level of CURRICULUM) {
    const units = level.units.map(unit => ({
      unitId: unit.id,
      unitTitleAr: unit.titleAr,
      unitTitleEn: unit.titleEn,
      lessonId: unit.lessons[0].id,
      lessonTitleAr: unit.lessons[0].titleAr,
      lessonTitleEn: unit.lessons[0].titleEn,
      xpReward: unit.lessons[0].xpReward,
    }));

    freeLessons.push({
      levelCode: level.code,
      levelTitleAr: level.titleAr,
      levelTitleEn: level.titleEn,
      levelColor: level.color,
      units,
    });
  }

  return freeLessons;
};

const getLevelGradient = (color: string) => {
  const gradients: Record<string, string> = {
    emerald: 'from-emerald-500 to-emerald-600',
    sky: 'from-sky-500 to-sky-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    fuchsia: 'from-fuchsia-500 to-fuchsia-600',
  };
  return gradients[color] || 'from-primary to-primary/80';
};

const FreeLessons = () => {
  const { user } = useAuth();
  const freeLessons = getFreeLessons();
  const totalLessons = freeLessons.reduce((acc, level) => acc + level.units.length, 0);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دروس إنجليزية مجانية - LingoArab',
    description: 'تصفح دروس تعلم اللغة الإنجليزية المجانية للناطقين بالعربية. دروس تفاعلية من المستوى المبتدئ إلى المتقدم.',
    url: 'https://lingoarab.com/free-lessons',
    inLanguage: ['ar', 'en'],
    provider: {
      '@type': 'Organization',
      name: 'LingoArab',
      url: 'https://lingoarab.com',
    },
    hasPart: freeLessons.flatMap(level =>
      level.units.map(unit => ({
        '@type': 'Course',
        name: `${unit.lessonTitleEn} - ${level.levelCode}`,
        description: `${unit.unitTitleAr} - ${unit.lessonTitleAr}`,
        provider: {
          '@type': 'Organization',
          name: 'LingoArab',
        },
        educationalLevel: level.levelCode,
        inLanguage: ['ar', 'en'],
      }))
    ),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: 'https://lingoarab.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'دروس مجانية',
        item: 'https://lingoarab.com/free-lessons',
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>دروس إنجليزية مجانية | تعلم الإنجليزية للعرب - LingoArab</title>
        <meta 
          name="description" 
          content="استكشف دروسنا المجانية لتعلم اللغة الإنجليزية. دروس تفاعلية مصممة خصيصاً للناطقين بالعربية من المستوى A1 إلى C2." 
        />
        <meta name="keywords" content="دروس إنجليزية مجانية, تعلم الإنجليزية, تعليم اللغة الإنجليزية, دروس مجانية, LingoArab" />
        <link rel="canonical" href="https://lingoarab.com/free-lessons" />
        <meta property="og:title" content="دروس إنجليزية مجانية | LingoArab" />
        <meta property="og:description" content="استكشف دروسنا المجانية لتعلم اللغة الإنجليزية. دروس تفاعلية مصممة للناطقين بالعربية." />
        <meta property="og:url" content="https://lingoarab.com/free-lessons" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                <Book className="w-4 h-4 ml-2" />
                {totalLessons} درس مجاني
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
                دروس إنجليزية مجانية
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                استكشف عينة من دروسنا التفاعلية المصممة خصيصاً للناطقين بالعربية.
                ابدأ رحلتك في تعلم الإنجليزية اليوم!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={user ? "/app/courses" : "/auth"}>
                  <Button size="lg" className="gap-2">
                    <GraduationCap className="w-5 h-5" />
                    {user ? "استمر في التعلم" : "ابدأ التعلم مجاناً"}
                  </Button>
                </Link>
                <Link to="/placement-test">
                  <Button size="lg" variant="outline" className="gap-2">
                    حدد مستواك
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{CURRICULUM.length}</div>
                <div className="text-sm text-muted-foreground">مستويات CEFR</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{totalLessons}</div>
                <div className="text-sm text-muted-foreground">درس مجاني</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">مجاني</div>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons by Level */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {freeLessons.map((level) => (
                <div key={level.levelCode} className="space-y-6">
                  {/* Level Header */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getLevelGradient(level.levelColor)} flex items-center justify-center text-white font-bold text-lg`}>
                      {level.levelCode}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold">{level.levelTitleAr}</h2>
                      <p className="text-muted-foreground ltr-text">{level.levelTitleEn}</p>
                    </div>
                    <Badge variant="outline" className="mr-auto">
                      {level.units.length} درس
                    </Badge>
                  </div>

                  {/* Lessons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {level.units.map((unit) => (
                      <Link
                        key={unit.lessonId}
                        to={`/preview/lesson/${unit.lessonId}`}
                        className="block"
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                                {unit.unitTitleAr}
                              </CardTitle>
                              <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                                <Star className="w-3 h-3" />
                                {unit.xpReward}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground ltr-text mb-3">
                              {unit.unitTitleEn}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Book className="w-3 h-3" />
                              <span>{unit.lessonTitleAr}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center p-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">
                انضم إلى آلاف المتعلمين
              </h2>
              <p className="text-muted-foreground mb-6">
                سجّل الآن للوصول إلى جميع الدروس، تتبع تقدمك، واكسب نقاط XP!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={user ? "/app/courses" : "/auth"}>
                  <Button size="lg">{user ? "استمر في التعلم" : "إنشاء حساب مجاني"}</Button>
                </Link>
                <Link to={user ? "/app/courses" : "/courses"}>
                  <Button size="lg" variant="outline">
                    استكشف المنهج الكامل
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default FreeLessons;
