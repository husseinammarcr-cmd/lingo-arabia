import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthBackground from '@/components/animations/AuthBackground';

const VerifyEmail = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  const isEmailVerified = user?.email_confirmed_at != null;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Redirect to onboarding if email is verified
  useEffect(() => {
    if (!isLoading && user && isEmailVerified) {
      if (profile?.onboarding_completed) {
        navigate('/courses');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, isEmailVerified, profile, isLoading, navigate]);

  const handleResend = async () => {
    if (!user?.email) return;
    
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        }
      });
      
      if (error) {
        // Handle rate limit
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          throw new Error('يرجى الانتظار بضع دقائق قبل إعادة المحاولة');
        }
        throw error;
      }
      
      toast({
        title: 'تم إرسال رسالة التحقق! 📧',
        description: 'يرجى التحقق من بريدك الإلكتروني',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  const checkVerificationStatus = async () => {
    setCheckingVerification(true);
    try {
      // Refresh the session to get updated user data
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.user?.email_confirmed_at) {
        toast({
          title: 'تم تأكيد البريد! ✅',
          description: 'جاري توجيهك لاختبار تحديد المستوى...',
        });
        // The useEffect will handle navigation
      } else {
        toast({
          title: 'لم يتم التأكيد بعد',
          description: 'يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCheckingVerification(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <AuthBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
          <CardHeader className="text-center">
            <Link to="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CardTitle className="text-2xl font-bold text-primary">LingoArab</CardTitle>
              </motion.div>
            </Link>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Mail className="w-10 h-10 text-primary" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">تأكيد البريد الإلكتروني</h2>
              <p className="text-muted-foreground">
                لقد أرسلنا رابط تأكيد إلى
              </p>
              <p className="font-medium text-primary" dir="ltr">
                {user?.email}
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p>يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد للمتابعة إلى اختبار تحديد المستوى.</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={checkVerificationStatus}
                variant="hero"
                size="lg"
                className="w-full"
                disabled={checkingVerification}
              >
                {checkingVerification ? (
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 ml-2" />
                )}
                لقد أكدت بريدي
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleResend}
                disabled={resending}
                className="w-full"
              >
                {resending ? (
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 ml-2" />
                )}
                إعادة إرسال رابط التأكيد
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
