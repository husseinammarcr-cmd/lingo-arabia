import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AuthBackground from '@/components/animations/AuthBackground';
import { motion } from 'framer-motion';

const EmailVerification = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  // Check if email is verified
  const isEmailVerified = user?.email_confirmed_at != null;

  // Redirect verified users to onboarding or courses
  React.useEffect(() => {
    if (!isLoading && user && isEmailVerified) {
      if (profile && !profile.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate('/courses');
      }
    }
  }, [user, profile, isLoading, isEmailVerified, navigate]);

  // Redirect non-authenticated users to auth page
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleResend = async () => {
    if (!user?.email) return;
    
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
      
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

  const handleContinueWithoutVerification = () => {
    if (profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    } else {
      navigate('/courses');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <AuthBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-xl bg-card/90 border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Mail className="w-10 h-10 text-primary" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold">تأكيد البريد الإلكتروني</CardTitle>
            <CardDescription className="text-base">
              لقد أرسلنا رسالة تحقق إلى
              <br />
              <span className="font-semibold text-foreground">{user?.email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  افتح بريدك الإلكتروني وابحث عن رسالة من LingoArab
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  اضغط على رابط التأكيد في الرسالة
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  سيتم توجيهك تلقائياً لاختبار تحديد المستوى
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? (
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 ml-2" />
                )}
                إعادة إرسال رسالة التحقق
              </Button>

              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={handleContinueWithoutVerification}
              >
                المتابعة بدون تأكيد
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
