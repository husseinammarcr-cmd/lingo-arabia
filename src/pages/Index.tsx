import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import bgAnimation from '@/assets/lottie-bg.json';
import { supabase } from '@/integrations/supabase/client';
import '@/styles/LingoArab.css';

const SITE_URL = 'https://lingoarab.com';

const LottieBackground = () => (
  <div className="lottie-bg" data-testid="lottie-bg" aria-hidden="true">
    <Lottie
      animationData={bgAnimation}
      loop
      autoplay
      rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
    />
  </div>
);

const Header: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <header data-testid="site-header">
    <a href="#home" className="logo" data-testid="site-logo" aria-label="Lingo Arab">
      <img src="/assets/lingoarab-logo.png" alt="Lingo Arab" />
    </a>
    <ul className="nav-links" data-testid="nav-links">
      <li><a href="#home" data-testid="nav-home">الرئيسية</a></li>
      <li><a href="#lessons" data-testid="nav-lessons">الدروس</a></li>
      <li><a href="#about" data-testid="nav-about">من نحن</a></li>
      <li><a href="#news" data-testid="nav-news">ما الجديد؟</a></li>
    </ul>
    <button onClick={onStart} className="btn-primary" data-testid="header-cta-btn">ابدأ الآن</button>
  </header>
);

const HeroVisual = () => (
  <div className="hero-visual" data-testid="hero-visual">
    <div className="hero-bg-text">LEARN</div>
    <div className="hero-ground-glow"></div>

    <svg className="curve-svg" viewBox="0 0 500 600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.1"/>
          <stop offset="50%" stopColor="#CCFF00" stopOpacity="1"/>
          <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="lg2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.2"/>
          <stop offset="50%" stopColor="#CCFF00" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <path
        d="M 60 80 C 10 180, 60 280, 180 240 S 420 260, 460 140 S 380 20, 260 60"
        fill="none" stroke="url(#lg1)" strokeWidth="1.6" strokeLinecap="round"
      />
      <path
        d="M 40 520 C 140 580, 260 520, 280 420 S 420 340, 460 440 S 380 560, 260 540"
        fill="none" stroke="url(#lg2)" strokeWidth="1.6" strokeLinecap="round"
      />
      <path
        d="M 80 360 C 40 420, 140 500, 240 460 S 340 340, 260 300 S 120 300, 80 360 Z"
        fill="none" stroke="#CCFF00" strokeOpacity="0.35" strokeWidth="1.2"
      />
    </svg>

    <div className="glow-dot" style={{ top: '10%', left: '52%' }}></div>
    <div className="glow-dot" style={{ bottom: '6%', left: '8%' }}></div>
    <div className="glow-dot" style={{ top: '38%', right: '2%' }}></div>

    <div className="phones-stack">
      <div className="phone phone-1" data-testid="phone-1">
        <div className="phone-screen-1">
          <div className="coin c1">En</div>
          <div className="coin c2">B1</div>
          <div className="coin c3">A+</div>
          <h4>Join to <em>learning</em> the future.</h4>
          <div className="screen-sub">Master English with interactive lessons curated for every level.</div>
          <div className="mini-btn">Sign in</div>
        </div>
      </div>

      <div className="phone phone-2" data-testid="phone-2">
        <div className="phone-screen-2">
          <div className="top-row">
            <div className="back">‹</div>
            <div className="lesson-title"><span className="dot"></span> Lesson 12</div>
            <span>•••</span>
          </div>
          <div style={{ color: '#888', fontSize: '9px', marginTop: '4px' }}>Present Perfect</div>
          <div className="big-num">9.87 / 10 XP</div>
          <div className="addr">unit_b7f2•verb•tense•practice•speaking</div>

          <div className="chart-mini">
            <svg viewBox="0 0 180 60" fill="none">
              <path d="M0,45 Q20,35 40,38 T80,25 T120,30 T160,15 L180,12"
                stroke="#CCFF00" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <path d="M0,45 Q20,35 40,38 T80,25 T120,30 T160,15 L180,12 L180,60 L0,60 Z"
                fill="#CCFF00" fillOpacity="0.08"/>
            </svg>
          </div>

          <div className="action-row">
            <div className="a-btn">Start</div>
            <div className="a-btn ghost">Review</div>
          </div>

          <div className="meta-list">
            <div className="row"><span>Accuracy</span><strong>94%</strong></div>
            <div className="row"><span>Words learned</span><strong>1,324</strong></div>
            <div className="row"><span>Streak</span><strong>27 days</strong></div>
          </div>

          <div className="bottom-cta">Continue →</div>
        </div>
      </div>
    </div>
  </div>
);

const BRAND_LOGOS = [
  <svg viewBox="0 0 40 40" key="cam"><path d="M20 4 L34 10 V22 C34 30 27 35 20 38 C13 35 6 30 6 22 V10 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M14 18 H26 M14 24 H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  <svg viewBox="0 0 50 40" key="ox"><path d="M4 10 C12 6 20 6 25 10 C30 6 38 6 46 10 V32 C38 28 30 28 25 32 C20 28 12 28 4 32 Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M25 10 V32" stroke="currentColor" strokeWidth="2"/></svg>,
  <svg viewBox="0 0 70 24" key="bbc"><rect x="2" y="2" width="20" height="20" fill="currentColor"/><rect x="25" y="2" width="20" height="20" fill="currentColor"/><rect x="48" y="2" width="20" height="20" fill="currentColor"/><text x="12" y="18" fontSize="14" fontWeight="900" fill="#0a0a0a" textAnchor="middle">B</text><text x="35" y="18" fontSize="14" fontWeight="900" fill="#0a0a0a" textAnchor="middle">B</text><text x="58" y="18" fontSize="14" fontWeight="900" fill="#0a0a0a" textAnchor="middle">C</text></svg>,
  <svg viewBox="0 0 60 30" key="ted"><rect x="2" y="6" width="56" height="18" rx="2" fill="currentColor"/><text x="30" y="20" fontSize="14" fontWeight="900" fill="#0a0a0a" textAnchor="middle" letterSpacing="2">TED</text></svg>,
  <svg viewBox="0 0 40 40" key="cou"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="60 30" transform="rotate(40 20 20)"/><polygon points="32,12 36,16 30,18" fill="currentColor"/></svg>,
  <svg viewBox="0 0 40 40" key="bc"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M5 20 H35 M20 5 V35 M9 11 Q20 18 31 11 M9 29 Q20 22 31 29" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  <svg viewBox="0 0 40 40" key="ielts"><rect x="4" y="4" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><polyline points="12,21 18,27 28,15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg viewBox="0 0 40 40" key="toefl"><polygon points="20,3 37,20 20,37 3,20" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="20,12 22,18 28,18 23,22 25,28 20,24 15,28 17,22 12,18 18,18" fill="currentColor"/></svg>,
  <svg viewBox="0 0 50 30" key="edx"><rect x="2" y="6" width="20" height="6" fill="currentColor"/><rect x="10" y="14" width="20" height="6" fill="currentColor"/><rect x="18" y="22" width="20" height="6" fill="currentColor"/></svg>,
  <svg viewBox="0 0 40 40" key="duo"><ellipse cx="20" cy="22" rx="14" ry="15" fill="currentColor"/><circle cx="14" cy="18" r="4" fill="#0a0a0a"/><circle cx="26" cy="18" r="4" fill="#0a0a0a"/><circle cx="14" cy="18" r="1.6" fill="currentColor"/><circle cx="26" cy="18" r="1.6" fill="currentColor"/><polygon points="20,22 17,26 23,26" fill="#0a0a0a"/></svg>,
];

const BrandsStrip = () => (
  <div className="brands-strip" data-testid="brands-strip" aria-label="brands">
    <div className="brands-track">
      {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
        <div className="brand-logo" key={i} data-testid={`brand-${i}`}>{logo}</div>
      ))}
    </div>
  </div>
);

const HeroSection: React.FC = () => (
  <section className="hero" data-testid="hero-section">
    <div className="hero-content">
      <span className="hero-subtitle">! تعلم بثقة</span>
      <h1 className="hero-title" data-testid="hero-title">
        <span className="highlight">أفضل منصة لتعلم الإنجليزية</span>
        <span className="sub-highlight">لمستقبلك.</span>
      </h1>

      <div className="stats-box" data-testid="hero-stats">
        <div className="avatars">
          <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/80?img=12)' }}></div>
          <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/80?img=32)' }}></div>
          <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/80?img=47)' }}></div>
          <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/80?img=56)' }}></div>
          <div className="avatar" style={{ backgroundImage: 'url(https://i.pravatar.cc/80?img=68)' }}></div>
        </div>
        <div className="stats-text">
          <strong>50K +</strong>
          <span>متعلم نشط</span>
        </div>
      </div>

      <div className="hero-desc">
        <div className="circle-icon">↗</div>
        <p>منصة لينجو عرب توفر لك بيئة تعليمية متكاملة لتعلم اللغة الإنجليزية بأساليب حديثة ومتطورة لتطوير مهاراتك اليوم.</p>
      </div>

      <BrandsStrip />
    </div>

    <HeroVisual />
  </section>
);

const FeaturesSection = () => (
  <section className="cards-section" data-testid="features-section">
    <div className="section-header">
      <h2 className="section-title">
        شريكك <span className="highlight">الموثوق</span><br />
        <span className="gray-text">في تعلم اللغات.</span>
      </h2>
      <p className="section-desc">
        لينجو عرب تجمع بين التكنولوجيا المتقدمة والمناهج المعتمدة لتوفير تجربة تعليمية فريدة تناسب جميع المستويات والأهداف.
      </p>
    </div>

    <div className="cards-grid">
      <div className="card" data-testid="feature-card-1">
        <span className="card-number">01.</span>
        <h3>دروس تفاعلية<br/>لكل المستويات.</h3>
        <p>محتوى تعليمي متجدد مصمم بعناية ليناسب جميع المستويات والأعمار بطريقة تضمن لك الاستيعاب الكامل.</p>
      </div>

      <div className="card active" data-testid="feature-card-2">
        <span className="card-number">02.</span>
        <h3>تعلم بطريقة<br />ممتعة وفعّالة.</h3>
        <p>نظام مكافآت وتحديات يومية تجعل من رحلة تعلمك تجربة ممتعة وتحفزك على الاستمرار وتطوير لغتك.</p>
        <a href="#learn-more" className="learn-more" data-testid="feature-learn-more">اعرف المزيد &larr;</a>
      </div>

      <div className="card" data-testid="feature-card-3">
        <span className="card-number">03.</span>
        <h3>تتبع تقدمك<br/>لحظة بلحظة.</h3>
        <p>لوحة تحكم ذكية تتيح لك متابعة تطورك يومياً وفي الوقت الفعلي مع تقارير أداء مفصلة.</p>
      </div>
    </div>
  </section>
);

const BottomSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <section className="bottom-section" data-testid="bottom-section">
    <div className="graph-area">
      <svg className="svg-graph" viewBox="0 0 500 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="area-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#CCFF00" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,200 Q50,200 100,140 T200,170 T300,70 T400,110 T500,40 L500,260 L0,260 Z"
              fill="url(#area-g)" />
        <path d="M0,200 Q50,200 100,140 T200,170 T300,70 T400,110 T500,40"
              stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>

      <div className="graph-coin" style={{ top: '55%', left: '15%' }}>A</div>
      <div className="graph-coin" style={{ top: '25%', left: '40%' }}>B</div>
      <div className="graph-coin" style={{ top: '45%', left: '60%' }}>C</div>

      <div className="graph-box top">
        <span>+ 1,250 درس</span>
        <p>منهج تعليمي شامل يغطي المحادثة، القواعد، والاستماع.</p>
      </div>

      <div className="graph-box bottom">
        <span>95% نسبة نجاح</span>
        <p>تطور ملحوظ في مستوى الطلاب خلال الأشهر الأولى.</p>
      </div>

      <div className="graph-box rate">
        <span>Average Rate</span>
        <div style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>4,528 كلمة</div>
        <div className="rate-change">↗ +45.66%</div>
      </div>
    </div>

    <div className="bottom-text">
      <h2 className="section-title">
        منصة <span className="highlight">موثوقة</span><br />
        <span className="gray-text">في أي وقت وأي مكان.</span>
      </h2>
      <div className="stars">★ ★ ★ ★ ★</div>
      <p>تعتبر لينجو عرب المنصة الرائدة في العالم العربي، حيث نعتمد على أحدث أساليب التعليم الذاتي و<strong>الذكاء الاصطناعي</strong> لتخصيص خطة دراسية تناسب مستواك وسرعة تعلمك.</p>
      <p>سواء كنت <strong>مبتدئاً</strong> أو تبحث عن اتقان الأعمال، نوفر لك الأدوات اللازمة لتحقيق هدفك بمرونة عالية.</p>

      <div className="action-buttons">
        <button onClick={onStart} className="btn-primary" style={{ padding: '14px 32px' }} data-testid="bottom-learn-more-btn">اعرف المزيد &larr;</button>
        <a href="/contact" className="btn-text" data-testid="bottom-ask-link">اسأل سؤال؟</a>
      </div>
    </div>
  </section>
);

export default function Index() {
  const navigate = useNavigate();
  const goStart = () => navigate('/auth?mode=signup');

  return (
    <div className="lingo-arab-wrapper" dir="rtl" data-testid="lingo-arab-landing">
      <Helmet>
        <title>لينجو عرب — أفضل منصة لتعلم الإنجليزية للناطقين بالعربية</title>
        <meta name="description" content="منصة لينجو عرب لتعلم اللغة الإنجليزية بأساليب تفاعلية حديثة، دروس لكل المستويات وذكاء اصطناعي لتخصيص خطة دراستك." />
        <link rel="canonical" href={`${SITE_URL}/`} />
      </Helmet>
      <LottieBackground />
      <div className="container">
        <Header onStart={goStart} />
        <HeroSection />
        <FeaturesSection />
        <BottomSection onStart={goStart} />
      </div>
    </div>
  );
}
