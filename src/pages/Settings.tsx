import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  User,
  Shield,
  Bell,
  Lock,
  Trash2,
  LogOut,
  Save,
  Eye,
  EyeOff,
  Monitor,
  Mail,
  BookOpen,
  Trophy,
  Megaphone,
  Globe,
  ChartBar,
  AlertTriangle,
  Check,
  Loader2,
  ArrowRight,
  Camera,
  Sparkles,
} from 'lucide-react';
import SidebarDashboard from '@/components/SidebarDashboard';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CARTOON_AVATARS = [
  { id: 1, src: '/avatars/avatar-1.png', name: 'طالب' },
  { id: 2, src: '/avatars/avatar-2.png', name: 'بومة' },
  { id: 3, src: '/avatars/avatar-3.png', name: 'قطة' },
  { id: 4, src: '/avatars/avatar-4.png', name: 'روبوت' },
  { id: 5, src: '/avatars/avatar-5.png', name: 'شمس' },
  { id: 6, src: '/avatars/avatar-6.png', name: 'باندا' },
  { id: 7, src: '/avatars/avatar-7.png', name: 'ثعلب' },
  { id: 8, src: '/avatars/avatar-8.png', name: 'بطريق' },
  { id: 9, src: '/avatars/avatar-9.png', name: 'رائد فضاء' },
  { id: 10, src: '/avatars/avatar-10.png', name: 'أسد' },
];

type TabKey = 'account' | 'security' | 'notifications' | 'privacy' | 'danger';

const TAB_META: Record<
  TabKey,
  { label: string; icon: typeof User; accent: string }
> = {
  account: { label: 'الحساب', icon: User, accent: '#cdff4f' },
  security: { label: 'الأمان', icon: Shield, accent: '#ffe27a' },
  notifications: { label: 'الإشعارات', icon: Bell, accent: '#a574ff' },
  privacy: { label: 'الخصوصية', icon: Lock, accent: '#ff9dcb' },
  danger: { label: 'منطقة الخطر', icon: AlertTriangle, accent: '#f87171' },
};

/* ===== Custom themed primitives ===== */
const FieldLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-xs font-bold text-white/60 mb-2 tracking-wide">
    {children}
  </label>
);

const TextInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#cdff4f]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#cdff4f]/20 transition-all disabled:opacity-50',
      className,
    )}
  />
);

const Toggle = ({
  checked,
  onChange,
  testId,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  testId?: string;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    data-testid={testId}
    role="switch"
    aria-checked={checked}
    className={cn(
      'relative h-7 w-12 rounded-full transition-colors flex-shrink-0',
      checked ? 'bg-[#cdff4f]' : 'bg-white/15',
    )}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md',
        checked ? 'left-0.5' : 'right-0.5',
      )}
    />
  </button>
);

const ToggleRow = ({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
  testId,
}: {
  icon: typeof User;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  testId?: string;
}) => (
  <div className="flex items-center justify-between gap-3 py-3.5">
    <div className="flex items-start gap-3 min-w-0 flex-1">
      <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-white/70" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm leading-tight">{title}</p>
        <p className="text-xs text-white/50 mt-0.5">{desc}</p>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} testId={testId} />
  </div>
);

const PrimaryButton = ({
  loading,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={cn(
      'w-full px-4 py-3 rounded-xl bg-[#cdff4f] text-[#111] font-extrabold text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(205,255,79,0.25)]',
      className,
    )}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
  </button>
);

const GhostButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={cn(
      'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.07] hover:border-white/20 active:scale-[0.98] transition disabled:opacity-50',
      className,
    )}
  >
    {children}
  </button>
);

const PanelCard = ({
  title,
  icon: Icon,
  accent,
  children,
  testId,
}: {
  title: string;
  icon: typeof User;
  accent: string;
  children: React.ReactNode;
  testId?: string;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="rounded-3xl bg-[#161618] border border-white/8 overflow-hidden mb-4"
    data-testid={testId}
  >
    <header className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}1f`, color: accent }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-base font-extrabold text-white">{title}</h3>
    </header>
    <div className="p-5">{children}</div>
  </motion.section>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const tabsRef = useRef<HTMLDivElement>(null);

  /* === State (preserved from original) === */
  const [displayName, setDisplayName] = useState(profile?.display_name || profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    profile?.avatar_url || CARTOON_AVATARS[0].src,
  );
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [notifyCourseUpdates, setNotifyCourseUpdates] = useState(profile?.notify_course_updates ?? true);
  const [notifyReminders, setNotifyReminders] = useState(profile?.notify_reminders ?? true);
  const [notifyAchievements, setNotifyAchievements] = useState(profile?.notify_achievements ?? true);
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(profile?.notify_announcements ?? true);

  const [privacyShowProfile, setPrivacyShowProfile] = useState(profile?.privacy_show_profile ?? true);
  const [privacyShowProgress, setPrivacyShowProgress] = useState(profile?.privacy_show_progress ?? true);
  const [privacyMarketingEmails, setPrivacyMarketingEmails] = useState(profile?.privacy_marketing_emails ?? false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('account');

  /* === Effects === */
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || profile.name || '');
      setUsername(profile.username || '');
      const isCartoon = CARTOON_AVATARS.some((a) => profile.avatar_url === a.src);
      setSelectedAvatar(isCartoon ? (profile.avatar_url as string) : CARTOON_AVATARS[0].src);
      setNotifyCourseUpdates(profile.notify_course_updates ?? true);
      setNotifyReminders(profile.notify_reminders ?? true);
      setNotifyAchievements(profile.notify_achievements ?? true);
      setNotifyAnnouncements(profile.notify_announcements ?? true);
      setPrivacyShowProfile(profile.privacy_show_profile ?? true);
      setPrivacyShowProgress(profile.privacy_show_progress ?? true);
      setPrivacyMarketingEmails(profile.privacy_marketing_emails ?? false);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

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

  /* === Handlers === */
  const handleSaveAccountInfo = async () => {
    setIsSavingAccount(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          username: username || null,
          avatar_url: selectedAvatar,
        })
        .eq('id', user?.id);

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'خطأ', description: 'اسم المستخدم مستخدم بالفعل', variant: 'destructive' });
          return;
        }
        throw error;
      }
      await refreshProfile?.();
      toast({ title: 'تم الحفظ', description: 'تم حفظ معلومات الحساب بنجاح' });
    } catch (e) {
      console.error(e);
      toast({ title: 'خطأ', description: 'فشل حفظ المعلومات', variant: 'destructive' });
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'خطأ', description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'خطأ', description: 'كلمات المرور غير متطابقة', variant: 'destructive' });
      return;
    }
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'تم التغيير', description: 'تم تغيير كلمة المرور بنجاح' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'فشل تغيير كلمة المرور';
      toast({ title: 'خطأ', description: msg, variant: 'destructive' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({ title: 'تم', description: 'تم تسجيل الخروج من جميع الأجهزة' });
      navigate('/auth');
    } catch {
      toast({ title: 'خطأ', description: 'فشل تسجيل الخروج', variant: 'destructive' });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notify_course_updates: notifyCourseUpdates,
          notify_reminders: notifyReminders,
          notify_achievements: notifyAchievements,
          notify_announcements: notifyAnnouncements,
        })
        .eq('id', user?.id);
      if (error) throw error;
      toast({ title: 'تم الحفظ', description: 'تم حفظ إعدادات الإشعارات' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل حفظ الإعدادات', variant: 'destructive' });
    }
  };

  const handleSavePrivacy = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_show_profile: privacyShowProfile,
          privacy_show_progress: privacyShowProgress,
          privacy_marketing_emails: privacyMarketingEmails,
        })
        .eq('id', user?.id);
      if (error) throw error;
      toast({ title: 'تم الحفظ', description: 'تم حفظ إعدادات الخصوصية' });
    } catch {
      toast({ title: 'خطأ', description: 'فشل حفظ الإعدادات', variant: 'destructive' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'حذف حسابي') {
      toast({ title: 'خطأ', description: 'يرجى كتابة "حذف حسابي" للتأكيد', variant: 'destructive' });
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', user?.id);
      if (error) throw error;
      await signOut();
      toast({ title: 'تم الحذف', description: 'تم حذف حسابك بنجاح' });
      navigate('/');
    } catch (e) {
      console.error(e);
      toast({ title: 'خطأ', description: 'فشل حذف الحساب', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatLastLogin = (date: string | null) => {
    if (!date) return 'غير متوفر';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  const firstName =
    profile?.display_name?.split(' ')[0] ??
    profile?.name?.split(' ')[0] ??
    'بك';

  return (
    <>
      <SidebarDashboard />

      {/* Lottie background */}
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
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.85 }}
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
        data-testid="settings-page"
        className="relative z-10 flex min-h-[100dvh] w-full text-white"
        style={{ fontFamily: "'Inter', 'Cairo', 'Tajawal', sans-serif" }}
      >
        <main className="flex-1 relative px-4 sm:px-8 lg:px-[4vw] py-6 sm:py-8 overflow-x-hidden">
          {/* Aurora */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div
              className="absolute -top-32 -right-24 rounded-full"
              style={{
                width: '70vw',
                height: '70vw',
                background:
                  'radial-gradient(circle, rgba(186,243,58,0.18) 0%, transparent 60%)',
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
                background:
                  'radial-gradient(circle, rgba(165,116,255,0.15) 0%, transparent 50%)',
                filter: 'blur(80px)',
                borderRadius: '50%',
              }}
            />
          </div>

          <div className="h-12" />

          <div className="relative z-10 mx-auto w-full max-w-[900px]">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="text-right text-base sm:text-lg font-bold text-white/70 mb-2"
                  style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
                >
                  مرحباً، {firstName}
                </div>
                <h1
                  dir="ltr"
                  className="text-white font-bold leading-[1.05]"
                  style={{ fontSize: 'min(8.5vw, 56px)' }}
                >
                  Your
                  <br />
                  <span
                    style={{
                      background:
                        'linear-gradient(120deg, #cdff4f 0%, #a574ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    settings.
                  </span>
                </h1>
              </div>
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                data-testid="settings-back-btn"
                className="h-11 w-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#cdff4f]/40 flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Profile preview strip */}
            <div
              className="rounded-3xl p-4 mb-5 flex items-center gap-4 border border-white/10 backdrop-blur-md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(205,255,79,0.10) 0%, rgba(20,20,20,0.55) 60%)',
              }}
              data-testid="settings-profile-preview"
            >
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-[#cdff4f]/40 bg-white/5">
                  {selectedAvatar ? (
                    <img src={selectedAvatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl font-bold">
                      {displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full bg-[#cdff4f] flex items-center justify-center shadow-md">
                  <Camera className="h-3 w-3 text-[#111]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-white truncate">
                  {displayName || profile?.name || 'بدون اسم'}
                </p>
                <p className="text-xs text-white/55 truncate">{profile?.email}</p>
                {username && (
                  <p className="text-[11px] text-[#cdff4f] font-bold mt-0.5">@{username}</p>
                )}
              </div>
            </div>

            {/* Tab navigation - horizontal scroll pills */}
            <div
              ref={tabsRef}
              className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-3 mb-4 sticky top-0 z-10"
              data-testid="settings-tabs"
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              {(Object.keys(TAB_META) as TabKey[]).map((k) => {
                const meta = TAB_META[k];
                const Icon = meta.icon;
                const active = activeTab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setActiveTab(k)}
                    data-testid={`tab-${k}`}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border',
                      active
                        ? 'text-[#111] border-transparent shadow-[0_4px_18px_rgba(0,0,0,0.3)]'
                        : 'bg-white/[0.04] text-white/70 border-white/8 hover:border-white/20',
                    )}
                    style={active ? { background: meta.accent } : {}}
                  >
                    <Icon className="h-4 w-4" />
                    {meta.label}
                  </button>
                );
              })}
            </div>

            {/* Panels */}
            <AnimatePresence mode="wait">
              {/* === ACCOUNT === */}
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <PanelCard
                    title="اختر صورة رمزية"
                    icon={Camera}
                    accent="#cdff4f"
                    testId="panel-avatar"
                  >
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                      {CARTOON_AVATARS.map((avatar) => {
                        const active = selectedAvatar === avatar.src;
                        return (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setSelectedAvatar(avatar.src)}
                            data-testid={`avatar-option-${avatar.id}`}
                            className={cn(
                              'relative flex-shrink-0 h-16 w-16 rounded-2xl overflow-hidden border-2 transition-colors',
                              active
                                ? 'border-[#cdff4f] shadow-[0_0_18px_rgba(205,255,79,0.4)]'
                                : 'border-white/10 hover:border-white/25',
                            )}
                          >
                            <img src={avatar.src} alt={avatar.name} className="h-full w-full object-cover" />
                            {active && (
                              <div className="absolute inset-0 bg-[#cdff4f]/20 flex items-center justify-center">
                                <Check className="h-6 w-6 text-[#cdff4f]" strokeWidth={3} />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="معلومات الحساب"
                    icon={User}
                    accent="#cdff4f"
                    testId="panel-account-info"
                  >
                    <div className="space-y-4">
                      <div>
                        <FieldLabel htmlFor="displayName">الاسم الكامل</FieldLabel>
                        <TextInput
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="أدخل اسمك"
                          data-testid="input-display-name"
                        />
                      </div>
                      <div>
                        <FieldLabel htmlFor="username">اسم المستخدم (اختياري)</FieldLabel>
                        <TextInput
                          id="username"
                          value={username}
                          onChange={(e) =>
                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                          }
                          placeholder="username"
                          dir="ltr"
                          className="text-left"
                          data-testid="input-username"
                        />
                        <p className="text-[11px] text-white/40 mt-1.5">
                          أحرف إنجليزية صغيرة وأرقام وشرطة سفلية فقط
                        </p>
                      </div>
                      <div>
                        <FieldLabel>البريد الإلكتروني</FieldLabel>
                        <TextInput
                          value={profile?.email || ''}
                          disabled
                          dir="ltr"
                          className="text-left"
                        />
                      </div>
                      <PrimaryButton
                        onClick={handleSaveAccountInfo}
                        loading={isSavingAccount}
                        data-testid="save-account-btn"
                      >
                        <Save className="w-4 h-4" />
                        حفظ التغييرات
                      </PrimaryButton>
                    </div>
                  </PanelCard>
                </motion.div>
              )}

              {/* === SECURITY === */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <PanelCard
                    title="تغيير كلمة المرور"
                    icon={Lock}
                    accent="#ffe27a"
                    testId="panel-password"
                  >
                    <div className="space-y-4">
                      <div>
                        <FieldLabel htmlFor="cp">كلمة المرور الحالية</FieldLabel>
                        <div className="relative">
                          <TextInput
                            id="cp"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            data-testid="input-current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword((v) => !v)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="np">كلمة المرور الجديدة</FieldLabel>
                        <div className="relative">
                          <TextInput
                            id="np"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            data-testid="input-new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="cnp">تأكيد كلمة المرور الجديدة</FieldLabel>
                        <TextInput
                          id="cnp"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          data-testid="input-confirm-password"
                        />
                      </div>
                      <PrimaryButton
                        onClick={handleChangePassword}
                        loading={isChangingPassword}
                        disabled={!newPassword || !confirmPassword}
                        data-testid="change-password-btn"
                      >
                        <Lock className="w-4 h-4" />
                        تغيير كلمة المرور
                      </PrimaryButton>
                    </div>
                  </PanelCard>

                  <PanelCard
                    title="الأجهزة المتصلة"
                    icon={Monitor}
                    accent="#ffe27a"
                    testId="panel-devices"
                  >
                    <p className="text-sm text-white/60 mb-4">
                      سيتم تسجيل خروجك من جميع الأجهزة المتصلة بحسابك.
                    </p>
                    <GhostButton onClick={handleLogoutAllDevices} data-testid="logout-all-btn">
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج من جميع الأجهزة
                    </GhostButton>
                  </PanelCard>

                  <PanelCard
                    title="آخر نشاط"
                    icon={Sparkles}
                    accent="#ffe27a"
                    testId="panel-last-login"
                  >
                    <div className="rounded-xl bg-white/[0.04] border border-white/8 p-4">
                      <p className="text-xs text-white/50 mb-1">آخر تسجيل دخول</p>
                      <p className="font-bold text-white text-sm">
                        {formatLastLogin(profile?.last_login_at || null)}
                      </p>
                    </div>
                  </PanelCard>
                </motion.div>
              )}

              {/* === NOTIFICATIONS === */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <PanelCard
                    title="تفضيلات الإشعارات"
                    icon={Bell}
                    accent="#a574ff"
                    testId="panel-notifications"
                  >
                    <div className="divide-y divide-white/5">
                      <ToggleRow
                        icon={BookOpen}
                        title="تحديثات الدورات"
                        desc="إشعارات عند إضافة دروس جديدة"
                        checked={notifyCourseUpdates}
                        onChange={setNotifyCourseUpdates}
                        testId="toggle-course-updates"
                      />
                      <ToggleRow
                        icon={Bell}
                        title="تذكيرات التعلم"
                        desc="تذكيرات يومية للدراسة"
                        checked={notifyReminders}
                        onChange={setNotifyReminders}
                        testId="toggle-reminders"
                      />
                      <ToggleRow
                        icon={Trophy}
                        title="إشعارات الإنجازات"
                        desc="عند حصولك على شارة جديدة"
                        checked={notifyAchievements}
                        onChange={setNotifyAchievements}
                        testId="toggle-achievements"
                      />
                      <ToggleRow
                        icon={Megaphone}
                        title="إعلانات المنصة"
                        desc="أخبار وتحديثات المنصة"
                        checked={notifyAnnouncements}
                        onChange={setNotifyAnnouncements}
                        testId="toggle-announcements"
                      />
                    </div>
                    <div className="mt-4">
                      <PrimaryButton
                        onClick={handleSaveNotifications}
                        data-testid="save-notifications-btn"
                      >
                        <Save className="w-4 h-4" />
                        حفظ إعدادات الإشعارات
                      </PrimaryButton>
                    </div>
                  </PanelCard>
                </motion.div>
              )}

              {/* === PRIVACY === */}
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <PanelCard
                    title="خيارات الخصوصية"
                    icon={Lock}
                    accent="#ff9dcb"
                    testId="panel-privacy"
                  >
                    <div className="divide-y divide-white/5">
                      <ToggleRow
                        icon={Globe}
                        title="إظهار الملف الشخصي علنياً"
                        desc="يمكن للآخرين رؤية ملفك الشخصي"
                        checked={privacyShowProfile}
                        onChange={setPrivacyShowProfile}
                        testId="toggle-show-profile"
                      />
                      <ToggleRow
                        icon={ChartBar}
                        title="الظهور في قائمة المتصدرين"
                        desc="إظهار تقدمك في لوحة المتصدرين"
                        checked={privacyShowProgress}
                        onChange={setPrivacyShowProgress}
                        testId="toggle-show-progress"
                      />
                      <ToggleRow
                        icon={Mail}
                        title="رسائل التسويق والتعليم"
                        desc="استلام عروض ونصائح تعليمية"
                        checked={privacyMarketingEmails}
                        onChange={setPrivacyMarketingEmails}
                        testId="toggle-marketing"
                      />
                    </div>
                    <div className="mt-4">
                      <PrimaryButton
                        onClick={handleSavePrivacy}
                        data-testid="save-privacy-btn"
                      >
                        <Save className="w-4 h-4" />
                        حفظ إعدادات الخصوصية
                      </PrimaryButton>
                    </div>
                  </PanelCard>
                </motion.div>
              )}

              {/* === DANGER === */}
              {activeTab === 'danger' && (
                <motion.div
                  key="danger"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <PanelCard
                    title="إجراءات الحساب"
                    icon={AlertTriangle}
                    accent="#f87171"
                    testId="panel-danger"
                  >
                    <div className="space-y-3">
                      <GhostButton
                        onClick={signOut}
                        data-testid="signout-btn"
                        className="hover:border-orange-400/40 hover:text-orange-300"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </GhostButton>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            data-testid="delete-account-trigger"
                            className="w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98] transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف الحساب نهائياً
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          dir="rtl"
                          className="bg-[#1a1a1c] border-white/10 text-white"
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
                              <AlertTriangle className="w-5 h-5" />
                              تأكيد حذف الحساب
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-right space-y-3 text-white/70">
                              <span className="block">
                                هل أنت متأكد من حذف حسابك نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>سيتم حذف جميع بياناتك الشخصية</li>
                                <li>سيتم فقدان جميع تقدمك في الدورات</li>
                                <li>سيتم إلغاء جميع إنجازاتك وشاراتك</li>
                                <li>لا يمكن استعادة الحساب بعد الحذف</li>
                              </ul>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="pt-3">
                            <FieldLabel htmlFor="deleteConfirm">
                              اكتب &quot;حذف حسابي&quot; للتأكيد
                            </FieldLabel>
                            <TextInput
                              id="deleteConfirm"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="حذف حسابي"
                              data-testid="delete-confirm-input"
                            />
                          </div>
                          <AlertDialogFooter className="gap-2 flex-row-reverse">
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                              إلغاء
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              disabled={isDeleting || deleteConfirmText !== 'حذف حسابي'}
                              className="bg-red-500 text-white hover:bg-red-600"
                              data-testid="confirm-delete-btn"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                              ) : (
                                <Trash2 className="w-4 h-4 ml-2" />
                              )}
                              حذف الحساب
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <p className="text-[11px] text-white/40 text-center pt-2">
                        حذف الحساب نهائي ولا يمكن التراجع عنه
                      </p>
                    </div>
                  </PanelCard>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-12" />
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;
