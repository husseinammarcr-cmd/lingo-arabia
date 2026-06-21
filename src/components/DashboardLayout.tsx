import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowRight } from 'lucide-react';
import SidebarDashboard from '@/components/SidebarDashboard';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  /** Big English headline (first line) */
  titlePrimary: string;
  /** Big English headline (second line, gets gradient) */
  titleAccent: string;
  /** Gradient colors for accent line, default lime->purple */
  gradient?: string;
  /** Glow color #1 (top-right) */
  glow1?: string;
  /** Glow color #2 (middle) */
  glow2?: string;
  /** Show greeting "مرحباً، X" — default true */
  showGreeting?: boolean;
  /** Show back arrow button — default true */
  showBack?: boolean;
  /** data-testid for the page wrapper */
  testId?: string;
  /** Page contents */
  children: ReactNode;
}

const DashboardLayout = ({
  titlePrimary,
  titleAccent,
  gradient = 'linear-gradient(120deg, #cdff4f 0%, #a574ff 100%)',
  glow1 = 'rgba(186,243,58,0.20)',
  glow2 = 'rgba(165,116,255,0.16)',
  showGreeting = true,
  showBack = true,
  testId,
  children,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const ph = html.style.backgroundColor;
    const pb = body.style.backgroundColor;
    html.style.backgroundColor = '#141414';
    body.style.backgroundColor = '#141414';
    return () => {
      html.style.backgroundColor = ph;
      body.style.backgroundColor = pb;
    };
  }, []);

  const firstName =
    profile?.display_name?.split(' ')[0] ??
    profile?.name?.split(' ')[0] ??
    'بك';

  return (
    <>
      <SidebarDashboard />

      {/* Fixed Lottie background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[#141414]"
        style={{ zIndex: 0 }}
      >
        <Lottie
          animationData={dashboardBgAnimation}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.85,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20,20,20,0) 0%, rgba(20,20,20,0.55) 70%, rgba(20,20,20,0.8) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(205,255,79,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(205,255,79,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
          }}
        />
      </div>

      <div
        dir="rtl"
        data-testid={testId}
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif" }}
      >
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden">
          {/* Aurora glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-32 -right-24 rounded-full"
              style={{
                width: '70vw',
                height: '70vw',
                background: `radial-gradient(circle, ${glow1} 0%, transparent 60%)`,
                filter: 'blur(70px)',
              }}
            />
            <div
              className="absolute"
              style={{
                top: 80,
                right: '20vw',
                width: '55vw',
                height: '55vw',
                background: `radial-gradient(circle, ${glow2} 0%, transparent 50%)`,
                filter: 'blur(80px)',
                borderRadius: '50%',
              }}
            />
          </div>

          <div className="h-12" />

          <div className="relative z-10 mx-auto w-full max-w-[900px]">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                {showGreeting && (
                  <div
                    className="text-right text-base sm:text-lg font-bold text-white/70 mb-2"
                    style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
                  >
                    مرحباً، {firstName}
                    {isAdmin && (
                      <span className="mr-2 text-xs font-medium text-[#cdff4f]">
                        • وضع الأدمن
                      </span>
                    )}
                  </div>
                )}
                <h1
                  dir="ltr"
                  className="text-white font-bold leading-[1.05]"
                  style={{ fontSize: 'min(8.5vw, 56px)' }}
                >
                  {titlePrimary}
                  <br />
                  <span
                    style={{
                      background: gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {titleAccent}
                  </span>
                </h1>
              </div>
              {showBack && (
                <motion.button
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  data-testid="layout-back-btn"
                  className="h-11 w-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#cdff4f]/40 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
