import { useNavigate, useParams } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelByCode } from '@/lib/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight,
  Lock,
  CheckCircle,
  BookOpen,
  Clock,
  HandMetal,
  Home,
  Briefcase,
  UtensilsCrossed,
  MapPin,
  Sunrise,
  Gamepad2,
  ShoppingCart,
  CircleCheck,
  History,
  Calendar,
  Plane,
  HeartPulse,
  Scale,
  Phone,
  Building,
  Globe,
  MessageCircle,
  GraduationCap,
  Lightbulb,
  Tv,
  Laptop,
  Leaf,
  Users,
  UserCheck,
  PenTool,
  MessageSquare,
  Presentation,
  FileText,
  Target,
  Puzzle,
  Layers,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import DashboardBackground from '@/components/DashboardBackground';
import SidebarDashboard from '@/components/SidebarDashboard';
import { useUserProgress, getUnitProgress } from '@/hooks/useProgress';


const SITE_URL = 'https://lingoarab.com';

const iconMap: Record<string, React.ElementType> = {
  'hand-wave': HandMetal,
  'clock': Clock,
  'home': Home,
  'briefcase': Briefcase,
  'utensils': UtensilsCrossed,
  'map': MapPin,
  'sun': Sunrise,
  'gamepad': Gamepad2,
  'shopping-cart': ShoppingCart,
  'check-circle': CircleCheck,
  'history': History,
  'calendar': Calendar,
  'plane': Plane,
  'heart-pulse': HeartPulse,
  'scale': Scale,
  'phone': Phone,
  'building': Building,
  'globe': Globe,
  'book-open': BookOpen,
  'message-circle': MessageCircle,
  'graduation-cap': GraduationCap,
  'lightbulb': Lightbulb,
  'tv': Tv,
  'laptop': Laptop,
  'leaf': Leaf,
  'users': Users,
  'user-check': UserCheck,
  'pen-tool': PenTool,
  'message-square': MessageSquare,
  'presentation': Presentation,
  'file-text': FileText,
  'target': Target,
  'puzzle': Puzzle,
  'layers': Layers,
  'clipboard-check': ClipboardCheck,
};

// Cycling palette inspired by the new dark dashboard
const UNIT_PALETTES = [
  { c1: '#cdff4f', c2: '#14b8a6', text: 'text-[#cdff4f]', glow: 'rgba(205,255,79,0.8)', bg: 'bg-[#cdff4f]/10', border: 'border-[#cdff4f]/20', shadow: 'shadow-[0_0_20px_rgba(205,255,79,0.3)]' },
  { c1: '#a574ff', c2: '#ff9dcb', text: 'text-[#a574ff]', glow: 'rgba(165,116,255,0.8)', bg: 'bg-[#a574ff]/10', border: 'border-[#a574ff]/20', shadow: 'shadow-[0_0_20px_rgba(165,116,255,0.3)]' },
  { c1: '#ff9dcb', c2: '#a574ff', text: 'text-[#ff9dcb]', glow: 'rgba(255,157,203,0.8)', bg: 'bg-[#ff9dcb]/10', border: 'border-[#ff9dcb]/20', shadow: 'shadow-[0_0_20px_rgba(255,157,203,0.3)]' },
];
const levelColors: Record<string, { bg: string; text: string; accent: string }> = {
  'A1': { bg: 'bg-[#cdff4f]', text: 'text-[#cdff4f]', accent: 'bg-[#cdff4f]/10' },
  'A2': { bg: 'bg-[#a574ff]', text: 'text-[#a574ff]', accent: 'bg-[#a574ff]/10' },
  'B1': { bg: 'bg-[#ff9dcb]', text: 'text-[#ff9dcb]', accent: 'bg-[#ff9dcb]/10' },
  'B2': { bg: 'bg-[#cdff4f]', text: 'text-[#cdff4f]', accent: 'bg-[#cdff4f]/10' },
};

// Level metadata for SEO
const levelMetadata: Record<string, { 
  titleAr: string; 
  titleEn: string; 
  descAr: string; 
  descEn: string;
  cefrLevel: string;
  duration: string;
}> = {
  'a1': {
    titleAr: 'المستوى المبتدئ A1',
    titleEn: 'Beginner Level A1',
    descAr: 'تعلم أساسيات اللغة الإنجليزية: التحيات، الأرقام، الألوان، والعبارات اليومية البسيطة',
    descEn: 'Learn English basics: greetings, numbers, colors, and simple daily phrases',
    cefrLevel: 'A1',
    duration: 'PT20H'
  },
  'a2': {
    titleAr: 'المستوى ما قبل المتوسط A2',
    titleEn: 'Elementary Level A2',
    descAr: 'طور مهاراتك في المحادثات اليومية، الطقس، الصحة، والسفر',
    descEn: 'Develop skills in daily conversations, weather, health, and travel',
    cefrLevel: 'A2',
    duration: 'PT25H'
  },
  'b1': {
    titleAr: 'المستوى المتوسط B1',
    titleEn: 'Intermediate Level B1',
    descAr: 'أتقن المحادثات المتقدمة، القواعد، والتعبير عن الآراء بثقة',
    descEn: 'Master advanced conversations, grammar, and express opinions confidently',
    cefrLevel: 'B1',
    duration: 'PT30H'
  },
  'b2': {
    titleAr: 'المستوى فوق المتوسط B2',
    titleEn: 'Upper-Intermediate Level B2',
    descAr: 'تعلم التواصل في بيئات العمل والأكاديمية بطلاقة',
    descEn: 'Learn to communicate fluently in work and academic environments',
    cefrLevel: 'B2',
    duration: 'PT35H'
  },
  'c1': {
    titleAr: 'المستوى المتقدم C1',
    titleEn: 'Advanced Level C1',
    descAr: 'أتقن التعبير الدقيق، البلاغة، والنقاشات المعقدة',
    descEn: 'Master nuanced expression, rhetoric, and complex discussions',
    cefrLevel: 'C1',
    duration: 'PT40H'
  },
  'c2': {
    titleAr: 'مستوى الإتقان C2',
    titleEn: 'Proficiency Level C2',
    descAr: 'حقق الإتقان الكامل في اللغة الإنجليزية على مستوى المتحدث الأصلي',
    descEn: 'Achieve complete mastery of English at native speaker level',
    cefrLevel: 'C2',
    duration: 'PT45H'
  }
};

const CourseLevel = () => {
  const navigate = useNavigate();
  const { level: levelParam } = useParams<{ level: string }>();
  const { user, profile, isLoading, isAdmin } = useAuth();
  const { data: progressData, isLoading: isProgressLoading } = useUserProgress();

  const level = getLevelByCode(levelParam || '');
  const levelKey = levelParam?.toLowerCase() || '';
  const meta = levelMetadata[levelKey];

  // JSON-LD Course schema (must be before any early returns)
  const courseSchema = useMemo(() => {
    if (!meta || !level) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": `${meta.titleEn} - Lingo Arab`,
      "alternateName": meta.titleAr,
      "description": meta.descEn,
      "provider": {
        "@type": "Organization",
        "name": "Lingo Arab",
        "url": SITE_URL
      },
      "educationalLevel": meta.cefrLevel,
      "inLanguage": ["en", "ar"],
      "isAccessibleForFree": true,
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": meta.duration
      },
      "numberOfCredits": level.units.length * 5,
      "teaches": level.units.map(u => u.titleEn).join(", "),
      "url": `${SITE_URL}/courses/${levelKey}`
    };
  }, [meta, level, levelKey]);

  // BreadcrumbList schema
  const breadcrumbSchema = useMemo(() => {
    if (!meta) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "الدورات",
          "item": `${SITE_URL}/courses`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": meta.titleAr,
          "item": `${SITE_URL}/courses/${levelKey}`
        }
      ]
    };
  }, [meta, levelKey]);

  // Compute completed lesson IDs from progress data
  const completedLessonIds = useMemo(() => {
    if (!progressData) return [];
    return progressData
      .filter(p => p.completed)
      .map(p => p.lesson_id);
  }, [progressData]);

  // Compute unit progress for this level with placement level awareness
  const unitProgressMap = useMemo(() => {
    if (!levelParam) return {};
    const progressList = getUnitProgress(
      levelParam, 
      completedLessonIds,
      profile?.placement_level,
      profile?.current_level,
      isAdmin
    );
    return progressList.reduce((acc, up) => {
      acc[up.unitId] = up;
      return acc;
    }, {} as Record<string, ReturnType<typeof getUnitProgress>[0]>);
  }, [levelParam, completedLessonIds, profile?.placement_level, profile?.current_level, isAdmin]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || isProgressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!level) {
    return (
      <DashboardBackground>
        <SidebarDashboard />
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4" dir="rtl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">المستوى غير موجود</h2>
            <p className="text-gray-400 mb-6">عذراً، لم نتمكن من العثور على هذا المستوى</p>
            <Button onClick={() => navigate('/app/courses')} className="bg-[#cdff4f] text-black hover:brightness-110">
              <ChevronRight className="w-4 h-4 ml-2" />
              العودة للمستويات
            </Button>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  const colors = levelColors[level.code] || levelColors['A1'];
  const levelGlow = colors.text.includes('cdff4f') ? 'rgba(205,255,79,0.3)'
                  : colors.text.includes('a574ff') ? 'rgba(165,116,255,0.3)'
                  : 'rgba(255,157,203,0.3)';

  return (
    <DashboardBackground>
      {meta && (
        <Helmet>
          <title>{meta.titleAr} | Lingo Arab – تعلم الإنجليزية مجانا</title>
          <meta name="description" content={meta.descAr} />
          <link rel="canonical" href={`${SITE_URL}/courses/${levelKey}`} />
          <meta property="og:title" content={`${meta.titleAr} | Lingo Arab`} />
          <meta property="og:description" content={meta.descAr} />
          <meta property="og:url" content={`${SITE_URL}/courses/${levelKey}`} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
          <meta property="og:site_name" content="Lingo Arab" />
          <meta property="og:locale" content="ar_SA" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${meta.titleAr} | Lingo Arab`} />
          <meta name="twitter:description" content={meta.descAr} />
          <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
          {courseSchema && <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>}
          {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
        </Helmet>
      )}
      <SidebarDashboard />
      <div dir="rtl" className="min-h-[100dvh] text-white pb-24 selection:bg-[#cdff4f] selection:text-black" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
        <main className="container mx-auto px-4 pt-20 max-w-2xl">
          <button
            onClick={() => navigate('/app/courses')}
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#cdff4f] transition"
          >
            <ChevronRight className="w-4 h-4" />
            العودة للمستويات
          </button>

          <section className="flex flex-col items-start mb-12 animate-slideRightIn" style={{ animationDelay: '0.1s' }}>
            <span className={cn('inline-block text-sm font-bold px-3 py-1 rounded-full mb-3 border border-white/10', colors.accent, colors.text)}>
              {level.code}
            </span>
            <h1
              className={cn('text-[2.5rem] leading-[1.1] sm:text-5xl sm:leading-[1.2] font-black mb-4 text-right', colors.text)}
              style={{ filter: `drop-shadow(0 0 15px ${levelGlow})` }}
            >
              {level.titleAr}
            </h1>
            <p className="text-gray-300 ltr-text font-inter">{level.titleEn}</p>
            <p className="text-sm text-gray-400 mt-2 text-right">{level.descriptionAr}</p>
          </section>

          <section className="flex flex-col gap-6">
            {level.units.map((unit, index) => {
              const IconComponent = iconMap[unit.icon] || BookOpen;
              const unitProgress = unitProgressMap[unit.id];
              const lessonsCount = unitProgress?.totalLessons ?? unit.lessons.length;
              const completedLessons = unitProgress?.completedLessons ?? 0;
              const isLocked = unitProgress ? !unitProgress.isUnlocked : index > 0;
              const progress = lessonsCount > 0 ? (completedLessons / lessonsCount) * 100 : 0;
              const isCompleted = unitProgress?.isCompleted ?? false;
              const palette = UNIT_PALETTES[index % UNIT_PALETTES.length];

              if (isLocked) {
                return (
                  <div key={unit.id} className="animate-slideUpIn" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                    <div className="glass-card bg-[#0f110f]/80 rounded-[24px] p-6 border border-white/5 opacity-60 flex items-center gap-5 cursor-not-allowed group transition-colors hover:bg-[#151815]/90">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 text-gray-600 group-hover:text-red-500 transition-colors duration-300">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="flex-1 flex flex-col py-1">
                        <span className="text-sm text-gray-500 font-bold tracking-wider mb-1">الوحدة {index + 1}</span>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-500 mb-1 leading-tight">{unit.titleAr}</h3>
                        <p className="text-sm font-inter text-gray-600 mb-3 ltr-text">{unit.titleEn}</p>
                        <div className="w-full h-3 bg-black/60 rounded-full border border-white/5" />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={unit.id}
                  className="animate-slideUpIn animated-border rounded-[26px]"
                  style={{
                    animationDelay: `${0.2 + index * 0.05}s`,
                    ['--c1' as string]: palette.c1,
                    ['--c2' as string]: palette.c2,
                  } as React.CSSProperties}
                  onClick={() => navigate(`/app/courses/${level.code.toLowerCase()}/${unit.id}`)}
                >
                  <div className="glass-card bg-[rgba(18,21,18,0.7)] rounded-[24px] p-6 relative overflow-hidden transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] flex items-center gap-5 group h-full">
                    <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 animate-floatY group-hover:rotate-12 transition-transform duration-500 border', palette.bg, palette.border, palette.shadow)}>
                      {isCompleted ? (
                        <CheckCircle className={cn('w-7 h-7', palette.text)} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }} />
                      ) : (
                        <IconComponent className={cn('w-7 h-7', palette.text)} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }} />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
                      <span className={cn('text-sm font-bold tracking-wider mb-1', palette.text)}>الوحدة {index + 1}</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight truncate">{unit.titleAr}</h3>
                      <p className="text-sm font-inter text-gray-400 mb-4 ltr-text truncate">{unit.titleEn}</p>

                      <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className={cn('text-base font-black font-inter animate-pulseGlow', palette.text)} style={{ filter: `drop-shadow(0 0 8px ${palette.glow})` }}>
                            {Math.round(progress)}%
                          </span>
                          <span className={cn('text-xs font-bold opacity-70', palette.text)}>
                            {completedLessons} / {lessonsCount} دروس
                          </span>
                        </div>
                        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden relative border border-white/5">
                          <div
                            className="absolute top-0 right-0 h-full rounded-full overflow-hidden"
                            style={{
                              width: `${progress}%`,
                              background: `linear-gradient(to left, ${palette.c1}, ${palette.c1}80)`,
                              boxShadow: `0 0 15px ${palette.glow}`,
                            }}
                          >
                            <div className="absolute inset-0 bg-white/30 w-1/2 -skew-x-12 animate-shimmerBg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </DashboardBackground>
  );
};

export default CourseLevel;
