import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  BookOpen,
  Sparkles,
  ChevronLeft,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import SeoBreadcrumbs from '@/components/SeoBreadcrumbs';
import DashboardLayout from '@/components/DashboardLayout';

interface FeatureCardProps {
  icon: typeof BookOpen;
  title: string;
  description: string;
  theme: { grad: string; circle: string; text: string };
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, theme, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="relative rounded-3xl p-5 overflow-hidden bg-[#161618] border border-white/8 hover:border-white/20 transition-colors"
  >
    <div
      className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-30 pointer-events-none"
      style={{ background: theme.grad, filter: 'blur(30px)' }}
    />
    <div
      className="relative h-12 w-12 rounded-2xl flex items-center justify-center mb-3"
      style={{ background: theme.grad, color: theme.text }}
    >
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="relative font-extrabold text-white text-base mb-1.5">
      {title}
    </h3>
    <p className="relative text-sm text-white/55 leading-relaxed">{description}</p>
  </motion.div>
);

interface StatItem {
  icon: typeof Eye;
  title: string;
  desc: string;
  accent: string;
}

const PillarRow = ({ items }: { items: StatItem[] }) => (
  <div className="space-y-3 mb-8">
    {items.map((it, i) => {
      const Icon = it.icon;
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/8"
        >
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${it.accent}20`,
              color: it.accent,
            }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-white text-base mb-1">
              {it.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">{it.desc}</p>
          </div>
        </motion.div>
      );
    })}
  </div>
);

const About = () => {
  const pillars: StatItem[] = [
    {
      icon: Users,
      title: 'من نحن',
      desc: 'فريق من المتخصصين في تعليم اللغات والتكنولوجيا التعليمية، نؤمن بأن تعلم الإنجليزية يجب أن يكون متاحاً للجميع بطريقة سهلة وفعّالة.',
      accent: '#cdff4f',
    },
    {
      icon: Eye,
      title: 'رؤيتنا',
      desc: 'أن نكون المنصة الأولى والأكثر موثوقية لتعليم اللغة الإنجليزية للناطقين بالعربية في العالم العربي.',
      accent: '#a574ff',
    },
    {
      icon: Target,
      title: 'مهمتنا',
      desc: 'تمكين الملايين من المتعلمين العرب من إتقان الإنجليزية وفتح آفاق جديدة في التعليم والعمل والتواصل مع العالم.',
      accent: '#ff9dcb',
    },
  ];

  const audience = [
    'الطلاب الراغبين في تحسين مستواهم الأكاديمي في اللغة الإنجليزية',
    'المهنيون الباحثون عن فرص عمل أفضل تتطلب إتقان الإنجليزية',
    'المبتدئون الذين يرغبون في بدء رحلة تعلم الإنجليزية من الصفر',
    'أي شخص يسعى لتطوير مهاراته اللغوية بطريقة ممتعة ومنظمة',
  ];

  return (
    <>
      <SeoBreadcrumbs
        items={[{ name: 'من نحن', url: 'https://lingoarab.com/about' }]}
      />
      <DashboardLayout
        titlePrimary="Who we are."
        titleAccent="Why we care."
        gradient="linear-gradient(120deg, #cdff4f 0%, #ff9dcb 100%)"
        glow1="rgba(186,243,58,0.18)"
        glow2="rgba(255,157,203,0.16)"
        showGreeting={false}
        testId="about-page"
      >
        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(205,255,79,0.10) 0%, rgba(255,157,203,0.10) 60%, rgba(20,20,20,0.7) 100%)',
          }}
          data-testid="about-intro"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#cdff4f]" />
            <span className="text-[11px] font-extrabold text-[#cdff4f] tracking-wider uppercase">
              Lingo Arab Story
            </span>
          </div>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed font-medium">
            منصة تعليمية متكاملة تهدف إلى تمكين الناطقين بالعربية من إتقان اللغة
            الإنجليزية بأسلوب سهل وممتع — بأساليب تعليمية حديثة، محتوى تفاعلي،
            ونظام مكافآت يحفّز على الاستمرار.
          </p>
        </motion.div>

        {/* Pillars */}
        <h2 className="text-lg font-extrabold text-white mb-3">
          ركائزنا الثلاث
        </h2>
        <PillarRow items={pillars} />

        {/* Why us */}
        <h2 className="text-lg font-extrabold text-white mb-3">لماذا تختارنا؟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <FeatureCard
            icon={BookOpen}
            title="محتوى مخصص للعرب"
            description="دروس مصممة خصيصاً للناطقين بالعربية، تراعي التحديات اللغوية الشائعة وتقدم شروحات واضحة."
            theme={{
              grad: 'linear-gradient(145deg, #cdff4f, #a7e31b)',
              circle: '#dcff82',
              text: '#111',
            }}
            delay={0}
          />
          <FeatureCard
            icon={Target}
            title="تعلم تفاعلي"
            description="تمارين متنوعة وألعاب تعليمية تجعل التعلم ممتعاً وفعالاً، مع تتبع تقدمك خطوة بخطوة."
            theme={{
              grad: 'linear-gradient(145deg, #a574ff, #753aeb)',
              circle: '#8b52ff',
              text: '#fff',
            }}
            delay={0.05}
          />
          <FeatureCard
            icon={Award}
            title="نظام مكافآت محفز"
            description="اكسب نقاط XP وشارات إنجاز مع كل درس تكمله، وتنافس مع متعلمين آخرين على لوحة المتصدرين."
            theme={{
              grad: 'linear-gradient(145deg, #ff9dcb, #ed5f9f)',
              circle: '#ffb8da',
              text: '#111',
            }}
            delay={0.1}
          />
          <FeatureCard
            icon={Heart}
            title="مجاني ومتاح للجميع"
            description="نؤمن بأن التعليم حق للجميع، لذلك نوفر معظم محتوانا مجاناً لجميع المتعلمين."
            theme={{
              grad: 'linear-gradient(145deg, #ffae3a, #ff6a13)',
              circle: '#ffce8a',
              text: '#111',
            }}
            delay={0.15}
          />
        </div>

        {/* Who is this for */}
        <h2 className="text-lg font-extrabold text-white mb-3">
          لمن هذه المنصة؟
        </h2>
        <div className="rounded-3xl p-5 bg-[#161618] border border-white/8 mb-8">
          <div className="space-y-3">
            {audience.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div className="h-6 w-6 rounded-full bg-[#cdff4f]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#cdff4f]" />
                </div>
                <span className="text-sm text-white/80 leading-relaxed">
                  {a}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-6 sm:p-8 overflow-hidden mb-10 text-center"
          style={{
            background:
              'linear-gradient(135deg, #cdff4f 0%, #a574ff 100%)',
            color: '#111',
          }}
          data-testid="about-cta"
        >
          <span
            className="absolute rounded-full pointer-events-none"
            style={{
              bottom: -80,
              left: -80,
              width: 240,
              height: 240,
              background: 'rgba(255,255,255,0.15)',
            }}
          />
          <div className="relative">
            <Globe className="w-10 h-10 mx-auto mb-3" />
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              ابدأ رحلتك اليوم
            </h2>
            <p className="text-sm font-bold opacity-85 mb-5 max-w-md mx-auto">
              انضم إلى آلاف المتعلمين الذين يطورون مهاراتهم في الإنجليزية معنا
              كل يوم
            </p>
            <Link to="/auth">
              <span className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111] text-white font-extrabold text-sm">
                سجّل الآن مجاناً
                <ChevronLeft className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
};

export default About;
