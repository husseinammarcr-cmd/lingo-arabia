import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Loader2, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CertificateRequestCard from '@/components/CertificateRequestCard';
import DashboardLayout from '@/components/DashboardLayout';

const Certificate = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?returnUrl=/certificate');
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <DashboardLayout
        titlePrimary="Your"
        titleAccent="certificate."
        gradient="linear-gradient(120deg, #ffe27a 0%, #cdff4f 100%)"
        glow1="rgba(255,226,122,0.22)"
        glow2="rgba(186,243,58,0.18)"
        testId="certificate-page"
      >
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#ffe27a]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      titlePrimary="Your"
      titleAccent="certificate."
      gradient="linear-gradient(120deg, #ffe27a 0%, #cdff4f 100%)"
      glow1="rgba(255,226,122,0.22)"
      glow2="rgba(186,243,58,0.18)"
      testId="certificate-page"
    >
      {/* Hero Certificate banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-7 overflow-hidden mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        style={{
          background:
            'linear-gradient(135deg, #ffe27a 0%, #f1b733 60%, #c9870e 100%)',
          color: '#3a2400',
        }}
        data-testid="certificate-hero"
      >
        {/* Decorative orbs */}
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: -80,
            left: -80,
            width: 240,
            height: 240,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            background: 'rgba(255,255,255,0.12)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-black/15 flex items-center justify-center">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-70">
                Lingo Arab
              </p>
              <p className="text-xs font-bold opacity-80">
                Official C2 Certificate
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-1">
            شهادة إتمام معتمدة
          </h2>
          <p className="text-sm font-bold opacity-80 max-w-sm">
            احصل على شهادة موثّقة عند إكمال المستوى C2 — جاهزة للمشاركة على
            LinkedIn و السيرة الذاتية
          </p>

          {/* Mini features */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { icon: Trophy, label: 'معتمد رسمياً' },
              { icon: ShieldCheck, label: 'قابل للتحقق' },
              { icon: Sparkles, label: 'PDF عالي الجودة' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-black/15 flex items-center gap-1.5 text-[11px] font-extrabold"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {f.label}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Certificate Request Card (existing functionality) */}
      <div className="mb-5" data-testid="certificate-request-section">
        <CertificateRequestCard />
      </div>

      {/* Verification CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 bg-[#161618] border border-white/8 mb-5"
        data-testid="verify-cert-section"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#cdff4f]/12 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-[#cdff4f]" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-white text-base">
              التحقق من الشهادات
            </h3>
            <p className="text-xs text-white/55 mt-1">
              يمكنك التحقق من صحة أي شهادة صادرة من LingoArab باستخدام رمز
              الشهادة الفريد
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/verify-certificate')}
          data-testid="verify-cert-btn"
          className="w-full rounded-xl py-3 px-4 bg-white/[0.04] border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.07] hover:border-[#cdff4f]/40 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-[#cdff4f]" />
          التحقق من شهادة
        </motion.button>
      </motion.div>

      {/* Info */}
      <p className="text-center text-xs text-white/45 leading-relaxed">
        شهادات LingoArab معتمدة ومسجلة في نظامنا الإلكتروني. للاستفسارات تواصل
        معنا عبر صفحة{' '}
        <Link
          to="/contact"
          className="text-[#cdff4f] hover:underline font-bold"
        >
          التواصل
        </Link>
        .
      </p>

      <div className="h-10" />
    </DashboardLayout>
  );
};

export default Certificate;
