import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mic, Sparkles, Globe2, Clock, ShieldCheck, GraduationCap, Headphones } from 'lucide-react';
import Header from '@/components/Header';

const SCENARIOS = [
  { emoji: '🍽️', title: 'في المطعم', desc: 'تدرّب على طلب الطعام، السؤال عن المكونات، ودفع الفاتورة بالإنجليزية بطلاقة.' },
  { emoji: '✈️', title: 'في المطار', desc: 'تشيك إن، تسليم الحقائب، الجوازات، والترانزيت — كل المواقف اللي تحتاجها في السفر.' },
  { emoji: '🏨', title: 'في الفندق', desc: 'الحجز، تسجيل الدخول، طلب خدمة الغرف، والاستفسار عن المرافق بثقة.' },
  { emoji: '🛍️', title: 'التسوّق', desc: 'السؤال عن المقاسات، المقارنة بين المنتجات، والتفاوض على السعر باللغة الإنجليزية.' },
];

const FEATURES = [
  { icon: Mic, title: 'صوت طبيعي 100%', desc: 'ذكاء اصطناعي يتحدث ويسمعك بصوت بشري واقعي، مع كشف تلقائي للصمت ومحادثة سلسة بدون أزرار.' },
  { icon: Sparkles, title: 'تصحيح فوري للأخطاء', desc: 'يصحّح نطقك وقواعدك لحظة بلحظة، ويعطيك نصائح ذكية لتحسين لغتك في كل جملة.' },
  { icon: Globe2, title: '4 سيناريوهات واقعية', desc: 'مطعم، مطار، فندق، تسوق — تدرّب على المواقف اللي تواجهك فعلاً في الحياة والسفر.' },
  { icon: Clock, title: 'متاحة 24/7', desc: 'تدرّب أي وقت بدون مواعيد ولا انتظار. معلّمك الذكي جاهز دائماً متى احتجته.' },
  { icon: ShieldCheck, title: 'بدون إحراج', desc: 'تكلّم وأخطئ بحرية — لا أحد يحكم عليك. أفضل بيئة للتدرّب على المحادثة بدون خوف.' },
  { icon: GraduationCap, title: 'مناسبة لكل المستويات', desc: 'من المبتدئ A1 حتى المتقدم C2 — المعلّم الذكي يتكيّف مع مستواك تلقائياً.' },
];

const FAQS = [
  { q: 'ما هي المكالمة الصوتية مع الذكاء الاصطناعي في Lingo Arab؟', a: 'هي ميزة جديدة تتيح لك إجراء محادثة صوتية حقيقية باللغة الإنجليزية مع معلم ذكاء اصطناعي، مع تصحيح فوري للأخطاء ونصائح لتحسين النطق والقواعد.' },
  { q: 'هل المكالمة الصوتية مجانية؟', a: 'نعم، يمكنك تجربة المكالمة الصوتية مع المعلم الذكي مجاناً بعد إنشاء حساب على Lingo Arab.' },
  { q: 'هل تدعم المكالمة اللغة العربية؟', a: 'حالياً المكالمة الصوتية تدعم اللغة الإنجليزية فقط، لأن هدفها تقوية مهارة المحادثة والاستماع بالإنجليزية.' },
  { q: 'ما المستوى المطلوب لاستخدام المكالمة الصوتية؟', a: 'الميزة مناسبة لكل المستويات من المبتدئ A1 إلى المتقدم C2. المعلّم الذكي يتكيف تلقائياً مع مستواك.' },
  { q: 'كيف تختلف عن تطبيقات تعلم الإنجليزية الأخرى؟', a: 'معظم التطبيقات تعتمد على تمارين مكتوبة، أما Lingo Arab فيوفر مكالمة صوتية حقيقية تشبه التحدث مع شخص فعلي، مع سيناريوهات حياتية واقعية.' },
  { q: 'هل أحتاج معدات خاصة؟', a: 'لا، تحتاج فقط متصفح حديث (Chrome أو Safari) وميكروفون عادي — حتى ميكروفون الهاتف يكفي.' },
];

const STEPS = [
  { n: 1, title: 'أنشئ حساباً مجانياً', desc: 'سجّل في Lingo Arab خلال 30 ثانية باستخدام بريدك أو حساب Google.' },
  { n: 2, title: 'افتح صفحة المعلم الذكي', desc: 'ادخل قسم AI Tutor واختر السيناريو اللي يناسبك (مطعم، مطار، فندق، تسوق).' },
  { n: 3, title: 'اضغط على زر المكالمة', desc: 'سمح للموقع باستخدام الميكروفون، وابدأ المحادثة فوراً بصوتك.' },
  { n: 4, title: 'تكلّم وتعلّم', desc: 'تحدّث بشكل طبيعي — الذكاء الاصطناعي يرد عليك، يصحّح أخطاءك، ويعطيك نصائح للتحسين.' },
];

const CANONICAL = 'https://lingoarab.com/ai-voice-chat';

const AiVoiceChat = () => {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'المكالمة الصوتية مع الذكاء الاصطناعي - Lingo Arab',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description: 'محادثة صوتية حية باللغة الإنجليزية مع معلّم ذكاء اصطناعي، مع تصحيح فوري للنطق والقواعد، و4 سيناريوهات حياتية واقعية.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1280' },
      inLanguage: ['ar', 'en'],
      url: CANONICAL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'كيف تبدأ مكالمة صوتية مع المعلم الذكي في Lingo Arab',
      step: STEPS.map((s) => ({ '@type': 'HowToStep', name: s.title, text: s.desc, position: s.n })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Lingo Arab', item: 'https://lingoarab.com/' },
        { '@type': 'ListItem', position: 2, name: 'المكالمة الصوتية مع AI', item: CANONICAL },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>محادثة صوتية بالإنجليزية مع ذكاء اصطناعي مجاناً | Lingo Arab</title>
        <meta
          name="description"
          content="جرّب أول مكالمة صوتية حية بالإنجليزية مع معلم ذكاء اصطناعي يصحّح نطقك وقواعدك فوراً. 4 سيناريوهات واقعية: مطعم، مطار، فندق، تسوق. مجاناً 24/7."
        />
        <meta
          name="keywords"
          content="محادثة صوتية بالانجليزي, تعلم الانجليزية بالصوت, ذكاء اصطناعي لتعلم الانجليزية, ai tutor عربي, محادثة مع AI, تطبيق محادثة انجليزي, تعلم المحادثة الانجليزية, voice ai english, lingo arab"
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content="محادثة صوتية بالإنجليزية مع ذكاء اصطناعي | Lingo Arab" />
        <meta
          property="og:description"
          content="تكلّم مع معلم AI بصوتك — تصحيح فوري، 4 سيناريوهات حياتية، ومجاناً لكل المستويات."
        />
        <meta property="og:locale" content="ar_AR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="محادثة صوتية بالإنجليزية مع ذكاء اصطناعي | Lingo Arab" />
        <meta
          name="twitter:description"
          content="تكلّم مع معلم AI بصوتك — تصحيح فوري، 4 سيناريوهات، مجاناً 24/7."
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] text-white">
        <Header />

        {/* Hero */}
        <section className="relative overflow-hidden pt-24 pb-16 px-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_60%)]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              ميزة جديدة 2026 — حصرياً في Lingo Arab
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-l from-cyan-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
              محادثة صوتية بالإنجليزية مع ذكاء اصطناعي — مجاناً
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              تكلّم مع معلم ذكاء اصطناعي بصوتك الحقيقي، واحصل على تصحيح فوري لنطقك وقواعدك. 
              4 سيناريوهات حياتية واقعية، متاحة 24/7، بدون إحراج وبدون مواعيد.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/ai-tutor"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-[#0a1628] font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
              >
                <Phone className="w-5 h-5" />
                ابدأ مكالمة مجانية الآن
              </Link>
              <Link
                to="/free-lessons"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/90 hover:bg-white/5 transition"
              >
                <Headphones className="w-4 h-4" />
                جرّب دروساً مجانية
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/60 text-sm">
              <span>⭐ تقييم 4.9/5</span>
              <span>👥 +1,280 متعلم نشط</span>
              <span>🌍 محتوى عربي بالكامل</span>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-16 px-5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              ليش المكالمة الصوتية مع AI هي مستقبل تعلّم الإنجليزية؟
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              مش مجرد تطبيق تمارين — هي تجربة محادثة حقيقية تشبه التحدث مع معلم خاص.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/30 transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scenarios */}
        <section className="py-16 px-5 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              4 سيناريوهات حياتية واقعية للتدرّب
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              مواقف حقيقية تواجهها في الحياة والسفر — تدرّب عليها قبل ما تحتاجها.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {SCENARIOS.map((s) => (
                <article key={s.title} className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-4xl mb-3">{s.emoji}</div>
                  <h3 className="text-xl font-bold mb-2 text-cyan-200">{s.title}</h3>
                  <p className="text-white/70 leading-relaxed">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              كيف تبدأ مكالمتك الأولى في 4 خطوات؟
            </h2>
            <ol className="space-y-5">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-[#0a1628] font-bold flex items-center justify-center text-lg">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                    <p className="text-white/70">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              أسئلة شائعة عن المكالمة الصوتية مع AI
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group p-5 rounded-xl bg-white/[0.03] border border-white/10 [&_summary]:cursor-pointer">
                  <summary className="font-bold text-white/90 flex justify-between items-center gap-3">
                    <span>{f.q}</span>
                    <span className="text-cyan-300 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-5">
          <div className="max-w-3xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-cyan-500/15 to-sky-500/10 border border-cyan-400/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز تتكلم إنجليزي بثقة؟
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              ابدأ مكالمتك الأولى الآن — مجاناً، بدون بطاقة ائتمان، وبدون التزامات.
            </p>
            <Link
              to="/ai-tutor"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-[#0a1628] font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
            >
              <Phone className="w-5 h-5" />
              ابدأ المكالمة المجانية
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AiVoiceChat;
