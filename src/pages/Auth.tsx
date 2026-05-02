import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import AuthBackground from '@/components/animations/AuthBackground';

const emailSchema = z.string().email('البريد الإلكتروني غير صالح');
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');

type AuthView = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const returnUrl = searchParams.get('returnUrl') || '/courses';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      if (view !== 'forgot-password') passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: 'خطأ', description: err.errors[0].message, variant: 'destructive' });
        return;
      }
    }

    setLoading(true);
    try {
      if (view === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(returnUrl);
      } else if (view === 'signup') {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        if (typeof window !== 'undefined' && (window as any).trackSignupConversion) {
          (window as any).trackSignupConversion();
        }
        sessionStorage.setItem('pendingVerificationEmail', email);
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: 'تم إرسال رابط إعادة التعيين! 📧',
          description: 'يرجى التحقق من بريدك الإلكتروني',
        });
        setView('login');
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes('User already registered')) msg = 'هذا البريد مسجل بالفعل. حاول تسجيل الدخول.';
      else if (msg.includes('Invalid login credentials')) msg = 'بيانات الدخول غير صحيحة.';
      toast({ title: 'خطأ', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (typeof window !== 'undefined' && (window as any).trackSignupConversion) {
      (window as any).trackSignupConversion();
    }
    const { error } = await signInWithGoogle();
    if (error) toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#0d0d0d] text-white relative overflow-hidden"
      dir="rtl"
    >
      <AuthBackground />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-16 pb-8 md:pt-24">
          <Link to="/" className="contents">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <bdi dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                Welcome to
                <br />
                LingoArab
              </bdi>
            </motion.h1>
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-base md:text-lg text-white/60"
          >
            <bdi dir="ltr" style={{ unicodeBidi: 'isolate' }}>
              Start Your English Journey.
            </bdi>
          </motion.p>
        </div>

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto px-6 pb-8"
        >
          <div
            className="rounded-3xl p-6 md:p-7 border border-white/5"
            style={{
              background: 'rgba(20, 20, 20, 0.85)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {view !== 'forgot-password' ? (
              <>
                {/* Tab toggle: Log In / Sign Up */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className={`h-12 rounded-full font-semibold text-base transition-all ${
                      view === 'login'
                        ? 'text-white'
                        : 'bg-transparent text-white/70 border border-white/15 hover:border-white/30'
                    }`}
                    style={
                      view === 'login'
                        ? {
                            backgroundColor: '#8B2FF8',
                            boxShadow: '0 8px 24px rgba(139,47,248,0.45)',
                          }
                        : undefined
                    }
                  >
                    <bdi dir="ltr" style={{ unicodeBidi: 'isolate' }}>Log In</bdi>
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className={`h-12 rounded-full font-semibold text-base transition-all ${
                      view === 'signup'
                        ? ''
                        : 'bg-transparent text-white/70 border border-white/15 hover:border-white/30'
                    }`}
                    style={
                      view === 'signup'
                        ? {
                            backgroundColor: '#D3F34B',
                            color: '#0d0d0d',
                            boxShadow: '0 8px 24px rgba(211,243,75,0.35)',
                          }
                        : undefined
                    }
                  >
                    <bdi dir="ltr" style={{ unicodeBidi: 'isolate' }}>Sign Up</bdi>
                  </button>
                </div>

                {/* Divider with "أو" */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/50 text-sm">أو</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 rounded-full bg-white text-[#0d0d0d] font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-all"
                  style={{
                    boxShadow:
                      '0 0 20px rgba(255,255,255,0.12), 0 0 40px rgba(139,47,248,0.25), 0 0 40px rgba(211,243,75,0.18)',
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <bdi dir="ltr" style={{ unicodeBidi: 'isolate' }}>Continue with Google</bdi>
                </button>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <AnimatePresence mode="wait">
                    {view === 'signup' && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="الاسم"
                          className="w-full h-12 rounded-full bg-transparent border border-white/15 px-5 text-white placeholder:text-white/40 outline-none focus:border-[#8B2FF8] focus:shadow-[0_0_0_1px_#8B2FF8] transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    dir="ltr"
                    className="w-full h-12 rounded-full bg-transparent border border-[#8B2FF8]/60 px-5 text-white placeholder:text-white/40 outline-none focus:border-[#8B2FF8] focus:shadow-[0_0_0_1px_#8B2FF8] transition-all"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    dir="ltr"
                    className="w-full h-12 rounded-full bg-transparent border border-[#D3F34B]/60 px-5 text-white placeholder:text-white/40 outline-none focus:border-[#D3F34B] focus:shadow-[0_0_0_1px_#D3F34B] transition-all"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full font-semibold text-base transition-all disabled:opacity-60"
                    style={
                      view === 'login'
                        ? {
                            backgroundColor: '#8B2FF8',
                            color: '#fff',
                            boxShadow: '0 8px 24px rgba(139,47,248,0.45)',
                          }
                        : {
                            backgroundColor: '#D3F34B',
                            color: '#0d0d0d',
                            boxShadow: '0 8px 24px rgba(211,243,75,0.35)',
                          }
                    }
                  >
                    {loading ? '...' : view === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              // Forgot password view
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold text-center">إعادة تعيين كلمة المرور</h2>
                <p className="text-sm text-white/60 text-center">
                  أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  dir="ltr"
                  className="w-full h-12 rounded-full bg-transparent border border-[#8B2FF8]/60 px-5 text-white placeholder:text-white/40 outline-none focus:border-[#8B2FF8] focus:shadow-[0_0_0_1px_#8B2FF8] transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full font-semibold transition-all disabled:opacity-60"
                  style={{
                    backgroundColor: '#8B2FF8',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(139,47,248,0.45)',
                  }}
                >
                  {loading ? '...' : 'إرسال الرابط'}
                </button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-sm text-white/60 hover:text-white transition-colors"
                >
                  العودة لتسجيل الدخول
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-white/50 mt-5 px-4">
            بالمتابعة، أنت توافق على{' '}
            <Link to="/terms" className="text-white/80 hover:text-white underline">
              الشروط
            </Link>{' '}
            و{' '}
            <Link to="/privacy" className="text-white/80 hover:text-white underline">
              سياسة الخصوصية
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
