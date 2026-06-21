import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';

const SITE_URL = 'https://lingoarab.com';

interface FAQItem {
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category: 'general' | 'account' | 'learning';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is LingoArab free to use?',
    questionAr: 'هل LingoArab مجاني؟',
    answer:
      'Yes! LingoArab offers free access to all learning content. We believe quality education should be accessible to everyone. Premium features are available for those who want an ad-free experience.',
    answerAr:
      'نعم! يوفر LingoArab وصولاً مجانياً لجميع المحتوى التعليمي. نحن نؤمن بأن التعليم الجيد يجب أن يكون متاحاً للجميع. تتوفر ميزات مميزة لمن يرغب في تجربة خالية من الإعلانات.',
    category: 'general',
  },
  {
    question: 'Do I need an account to start learning?',
    questionAr: 'هل أحتاج إلى حساب للبدء في التعلم؟',
    answer:
      'While you can explore some content without an account, creating a free account allows you to track your progress, earn achievements, maintain streaks, and compete on leaderboards.',
    answerAr:
      'بينما يمكنك استكشاف بعض المحتوى بدون حساب، فإن إنشاء حساب مجاني يتيح لك تتبع تقدمك، وكسب الإنجازات، والحفاظ على سلسلة التعلم اليومية، والتنافس في لوحة المتصدرين.',
    category: 'account',
  },
  {
    question: 'What learning levels are available?',
    questionAr: 'ما هي مستويات التعلم المتاحة؟',
    answer:
      'We offer courses from complete beginner (A1) to upper-intermediate (B2) levels. Each level is structured into units and lessons that progressively build your English skills.',
    answerAr:
      'نقدم دورات من مستوى المبتدئين (A1) إلى المستوى المتوسط المتقدم (B2). كل مستوى منظم في وحدات ودروس تبني مهاراتك في اللغة الإنجليزية بشكل تدريجي.',
    category: 'learning',
  },
  {
    question: 'Can I learn at my own pace?',
    questionAr: 'هل يمكنني التعلم بالسرعة التي تناسبني؟',
    answer:
      'Absolutely! LingoArab is designed for self-paced learning. Set your daily goals (5, 10, or 15 minutes), and learn whenever it suits you. Your progress is saved automatically.',
    answerAr:
      'بالتأكيد! تم تصميم LingoArab للتعلم الذاتي. حدد أهدافك اليومية (5، 10، أو 15 دقيقة)، وتعلم في الوقت الذي يناسبك. يتم حفظ تقدمك تلقائياً.',
    category: 'learning',
  },
  {
    question: 'Is this platform suitable for beginners?',
    questionAr: 'هل هذه المنصة مناسبة للمبتدئين؟',
    answer:
      'Yes! Our platform is perfect for beginners. We start from the basics with Arabic explanations, making it easy for Arabic speakers to understand English concepts from scratch.',
    answerAr:
      'نعم! منصتنا مثالية للمبتدئين. نبدأ من الأساسيات مع شروحات بالعربية، مما يسهل على الناطقين بالعربية فهم مفاهيم اللغة الإنجليزية من الصفر.',
    category: 'learning',
  },
  {
    question: 'Will more courses be added in the future?',
    questionAr: 'هل سيتم إضافة المزيد من الدورات في المستقبل؟',
    answer:
      'Yes! We are constantly working on new content. More lessons, exercises, and advanced levels are being developed. Stay tuned for updates!',
    answerAr:
      'نعم! نحن نعمل باستمرار على محتوى جديد. يتم تطوير المزيد من الدروس والتمارين والمستويات المتقدمة. ترقبوا التحديثات!',
    category: 'general',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'الكل', accent: '#cdff4f' },
  { key: 'general', label: 'عام', accent: '#a574ff' },
  { key: 'account', label: 'الحساب', accent: '#ff9dcb' },
  { key: 'learning', label: 'التعلم', accent: '#ffe27a' },
] as const;

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((it) => ({
        '@type': 'Question',
        name: it.questionAr,
        acceptedAnswer: { '@type': 'Answer', text: it.answerAr },
      })),
    }),
    [],
  );

  const filtered = useMemo(() => {
    return FAQ_ITEMS.filter((it) => {
      const matchesCat = category === 'all' || it.category === category;
      const q = query.trim();
      const matchesQuery =
        !q ||
        it.questionAr.includes(q) ||
        it.answerAr.includes(q) ||
        it.question.toLowerCase().includes(q.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [category, query]);

  return (
    <>
      <Helmet>
        <title>الأسئلة الشائعة - LingoArab</title>
        <meta
          name="description"
          content="إجابات على الأسئلة الأكثر شيوعاً حول منصة LingoArab لتعلم اللغة الإنجليزية."
        />
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <DashboardLayout
        titlePrimary="Frequently"
        titleAccent="asked."
        gradient="linear-gradient(120deg, #cdff4f 0%, #ffe27a 100%)"
        glow1="rgba(186,243,58,0.18)"
        glow2="rgba(255,226,122,0.18)"
        showGreeting={false}
        testId="faq-page"
      >
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-5 border border-white/10 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(205,255,79,0.12) 0%, rgba(255,226,122,0.10) 60%, rgba(20,20,20,0.7) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(145deg, #cdff4f, #ffe27a)', color: '#111' }}
            >
              <HelpCircle className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#cdff4f]" />
                <span className="text-[10px] font-extrabold text-[#cdff4f] tracking-wider uppercase">
                  Help center
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                لديك سؤال؟ نحن هنا للمساعدة
              </h2>
              <p className="text-xs text-white/55 mt-0.5">
                إجابات على الأسئلة الأكثر شيوعاً عن LingoArab
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن سؤال..."
            data-testid="faq-search"
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#cdff4f]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#cdff4f]/20 transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto mb-5 scrollbar-none" data-testid="faq-categories">
          {CATEGORIES.map((cat) => {
            const active = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                data-testid={`category-${cat.key}`}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                  active
                    ? 'text-[#111] border-transparent shadow-[0_4px_18px_rgba(0,0,0,0.3)]'
                    : 'bg-white/[0.04] text-white/70 border-white/8 hover:border-white/20',
                )}
                style={active ? { background: cat.accent } : {}}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="space-y-2.5 mb-8" data-testid="faq-list">
          {filtered.length === 0 ? (
            <div className="rounded-3xl p-12 text-center bg-white/[0.03] border border-white/8">
              <HelpCircle className="h-10 w-10 mx-auto mb-3 text-white/30" />
              <p className="text-sm text-white/60">لم يتم العثور على أسئلة</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <motion.div
                  key={item.questionAr}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * idx }}
                  className="rounded-2xl bg-[#161618] border border-white/8 overflow-hidden"
                  data-testid={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    data-testid={`faq-toggle-${idx}`}
                    className="w-full px-5 py-4 flex items-center gap-3 text-right hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-white font-bold text-sm flex-1 leading-snug">
                      {item.questionAr}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-white/50 transition-transform flex-shrink-0',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1">
                          <p className="text-sm text-white/65 leading-relaxed">
                            {item.answerAr}
                          </p>
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <p
                              dir="ltr"
                              className="text-xs text-white/40 leading-relaxed"
                            >
                              <span className="font-extrabold text-white/55">
                                EN:
                              </span>{' '}
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-6 text-center mb-10 border border-white/10 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(165,116,255,0.10) 0%, rgba(20,20,20,0.55) 60%)',
          }}
        >
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#a574ff]/20 mb-3">
            <MessageSquare className="h-6 w-6 text-[#a574ff]" />
          </div>
          <h3 className="text-base font-extrabold text-white mb-1">
            لم تجد إجابة لسؤالك؟
          </h3>
          <p className="text-xs text-white/55 mb-4">
            تواصل معنا وسنكون سعداء بمساعدتك
          </p>
          <Link to="/contact">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#cdff4f] text-[#111] font-extrabold text-sm">
              تواصل معنا
            </span>
          </Link>
        </motion.div>
      </DashboardLayout>
    </>
  );
};

export default FAQ;
