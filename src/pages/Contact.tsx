import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  MessageSquare,
  Loader2,
  Sparkles,
} from 'lucide-react';
import SeoBreadcrumbs from '@/components/SeoBreadcrumbs';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' })
    .max(100, { message: 'الاسم يجب أن يكون أقل من 100 حرف' }),
  email: z
    .string()
    .trim()
    .email({ message: 'يرجى إدخال بريد إلكتروني صحيح' })
    .max(255, { message: 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف' }),
  subject: z
    .string()
    .trim()
    .min(5, { message: 'الموضوع يجب أن يكون 5 أحرف على الأقل' })
    .max(200, { message: 'الموضوع يجب أن يكون أقل من 200 حرف' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' })
    .max(2000, { message: 'الرسالة يجب أن تكون أقل من 2000 حرف' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ===== Dark themed primitives ===== */
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-white/65 mb-2 tracking-wide">
    {children}
  </label>
);

const TextInput = ({
  className,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => (
  <input
    {...props}
    className={cn(
      'w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:bg-white/[0.06] focus:ring-2 transition-all',
      error
        ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
        : 'border-white/10 focus:border-[#cdff4f]/60 focus:ring-[#cdff4f]/20',
      className,
    )}
  />
);

const TextArea = ({
  className,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) => (
  <textarea
    {...props}
    className={cn(
      'w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none focus:bg-white/[0.06] focus:ring-2 transition-all resize-none min-h-[140px]',
      error
        ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
        : 'border-white/10 focus:border-[#cdff4f]/60 focus:ring-[#cdff4f]/20',
      className,
    )}
  />
);

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success('تم إرسال رسالتك بنجاح!');
    } catch (e) {
      console.error('Error sending message:', e);
      toast.error('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    reset();
  };

  return (
    <>
      <SeoBreadcrumbs
        items={[{ name: 'اتصل بنا', url: 'https://lingoarab.com/contact' }]}
      />
      <DashboardLayout
        titlePrimary="Let's"
        titleAccent="talk."
        gradient="linear-gradient(120deg, #a574ff 0%, #ff9dcb 100%)"
        glow1="rgba(165,116,255,0.20)"
        glow2="rgba(255,157,203,0.16)"
        showGreeting={false}
        testId="contact-page"
      >
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 sm:p-6 overflow-hidden mb-6 border border-white/10 backdrop-blur-md"
          style={{
            background:
              'linear-gradient(135deg, rgba(165,116,255,0.12) 0%, rgba(255,157,203,0.10) 60%, rgba(20,20,20,0.7) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(145deg, #a574ff, #753aeb)' }}
            >
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-[#cdff4f]" />
                <span className="text-[10px] font-extrabold text-[#cdff4f] tracking-wider uppercase">
                  We're listening
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                نسعد بتواصلك معنا!
              </h2>
              <p className="text-xs text-white/55 mt-0.5">
                أرسل لنا رسالتك وسنرد عليك خلال 24-48 ساعة
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-3xl bg-[#161618] border border-white/8 p-5 sm:p-6"
            data-testid="contact-form-card"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                  data-testid="contact-success"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 shadow-[0_0_40px_rgba(205,255,79,0.3)]"
                       style={{ background: 'linear-gradient(145deg, #cdff4f, #a7e31b)' }}>
                    <CheckCircle2 className="w-10 h-10 text-[#111]" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h2>
                  <p className="text-sm text-white/55 mb-6 max-w-sm mx-auto">
                    شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                  <button
                    onClick={handleSendAnother}
                    data-testid="send-another-btn"
                    className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white font-bold text-sm hover:border-[#cdff4f]/40 transition-colors"
                  >
                    إرسال رسالة أخرى
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>الاسم الكامل</FieldLabel>
                      <TextInput
                        {...register('name')}
                        placeholder="أدخل اسمك"
                        error={!!errors.name}
                        data-testid="contact-name"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 mt-1.5 font-bold">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <FieldLabel>البريد الإلكتروني</FieldLabel>
                      <TextInput
                        {...register('email')}
                        type="email"
                        placeholder="example@email.com"
                        dir="ltr"
                        className="text-left"
                        error={!!errors.email}
                        data-testid="contact-email"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-400 mt-1.5 font-bold">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>الموضوع</FieldLabel>
                    <TextInput
                      {...register('subject')}
                      placeholder="موضوع الرسالة"
                      error={!!errors.subject}
                      data-testid="contact-subject"
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-red-400 mt-1.5 font-bold">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>الرسالة</FieldLabel>
                    <TextArea
                      {...register('message')}
                      placeholder="اكتب رسالتك هنا..."
                      error={!!errors.message}
                      data-testid="contact-message"
                    />
                    {errors.message && (
                      <p className="text-[11px] text-red-400 mt-1.5 font-bold">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="contact-submit"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#cdff4f] text-[#111] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-[0_4px_20px_rgba(205,255,79,0.25)] disabled:opacity-50 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        إرسال الرسالة
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar info cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="rounded-3xl p-5 bg-[#161618] border border-white/8">
              <div className="h-10 w-10 rounded-xl bg-[#cdff4f]/15 flex items-center justify-center mb-3">
                <Mail className="h-5 w-5 text-[#cdff4f]" />
              </div>
              <h3 className="font-extrabold text-white text-sm mb-1">
                البريد الإلكتروني
              </h3>
              <p className="text-xs text-white/55 mb-2">للاستفسارات والدعم الفني</p>
              <a
                href="mailto:support@lingoarab.com"
                className="text-xs text-[#cdff4f] hover:underline font-bold block"
                dir="ltr"
                data-testid="contact-email-link"
              >
                support@lingoarab.com
              </a>
            </div>

            <div className="rounded-3xl p-5 bg-[#161618] border border-white/8">
              <div className="h-10 w-10 rounded-xl bg-[#a574ff]/15 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5 text-[#a574ff]" />
              </div>
              <h3 className="font-extrabold text-white text-sm mb-1">
                وقت الاستجابة
              </h3>
              <p className="text-xs text-white/55">
                نرد على جميع الرسائل خلال 24-48 ساعة عمل
              </p>
            </div>

            <div className="rounded-3xl p-4 border border-[#cdff4f]/20 bg-[#cdff4f]/5">
              <p className="text-[11px] text-white/70 leading-relaxed">
                💡 للحصول على رد أسرع، يرجى تضمين تفاصيل واضحة عن استفسارك أو
                المشكلة التي تواجهها.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="h-10" />
      </DashboardLayout>
    </>
  );
};

export default Contact;
