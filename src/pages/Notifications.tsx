import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Loader2, ExternalLink, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import DashboardLayout from '@/components/DashboardLayout';

const Notifications = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth?returnUrl=/notifications');
  }, [user, authLoading, navigate]);

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  const totalCount = notifications?.length || 0;

  return (
    <DashboardLayout
      titlePrimary="Stay in"
      titleAccent="the loop."
      gradient="linear-gradient(120deg, #a574ff 0%, #cdff4f 100%)"
      glow1="rgba(165,116,255,0.20)"
      glow2="rgba(186,243,58,0.18)"
      testId="notifications-page"
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl p-4 bg-white/[0.04] border border-white/8 backdrop-blur-sm">
          <Inbox className="h-5 w-5 mb-2 text-[#cdff4f]" />
          <div className="text-2xl font-extrabold text-white">
            {totalCount}
          </div>
          <p className="text-[11px] text-white/55 font-medium mt-0.5">إجمالي الإشعارات</p>
        </div>
        <div
          className={cn(
            'rounded-2xl p-4 border backdrop-blur-sm relative overflow-hidden',
            unreadCount > 0
              ? 'bg-[#cdff4f]/10 border-[#cdff4f]/30'
              : 'bg-white/[0.04] border-white/8',
          )}
        >
          <Bell className={cn('h-5 w-5 mb-2', unreadCount > 0 ? 'text-[#cdff4f]' : 'text-white/40')} />
          <div className="text-2xl font-extrabold text-white">{unreadCount}</div>
          <p className="text-[11px] text-white/55 font-medium mt-0.5">غير مقروءة</p>
        </div>
      </div>

      {/* Mark all */}
      {unreadCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => markAllAsRead.mutate()}
          disabled={markAllAsRead.isPending}
          data-testid="mark-all-read"
          className="w-full mb-4 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 bg-[#cdff4f] text-[#111] font-extrabold text-sm shadow-[0_4px_20px_rgba(205,255,79,0.25)] disabled:opacity-50"
        >
          {markAllAsRead.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCheck className="w-4 h-4" />
          )}
          اقرأ الكل ({unreadCount})
        </motion.button>
      )}

      {/* List */}
      {authLoading || isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#cdff4f]" />
        </div>
      ) : notifications?.length === 0 ? (
        <div className="rounded-3xl p-12 text-center bg-white/[0.03] border border-white/8">
          <div
            className="w-16 h-16 rounded-full bg-[#cdff4f]/10 flex items-center justify-center mx-auto mb-3"
          >
            <Bell className="h-7 w-7 text-[#cdff4f]" />
          </div>
          <p className="text-white font-bold text-base">صندوقك فارغ</p>
          <p className="text-sm text-white/50 mt-1">سيظهر هنا كل جديد قريباً</p>
        </div>
      ) : (
        <div className="space-y-2.5" data-testid="notifications-list">
          {notifications?.map((n, i) => {
            const isFounder = n.sender_name === 'Founder' || n.sender_name === 'المؤسس';
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className={cn(
                  'relative rounded-2xl p-4 border overflow-hidden transition-colors',
                  n.is_read
                    ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.05]'
                    : 'bg-[#cdff4f]/8 border-[#cdff4f]/30 shadow-[0_0_20px_rgba(205,255,79,0.12)]',
                )}
                data-testid={`notification-${n.id}`}
              >
                {/* Unread dot */}
                {!n.is_read && (
                  <span className="absolute top-4 left-4 h-2.5 w-2.5 rounded-full bg-[#cdff4f] shadow-[0_0_10px_rgba(205,255,79,0.6)]" />
                )}

                <div className="flex items-start gap-3 pr-2">
                  {/* Sender avatar tile */}
                  <div
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm',
                      isFounder
                        ? 'text-white'
                        : 'bg-white/8 text-white/70',
                    )}
                    style={
                      isFounder
                        ? { background: 'linear-gradient(145deg, #a574ff, #753aeb)' }
                        : undefined
                    }
                  >
                    {(n.sender_name || 'L').charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="font-bold text-xs text-white/80 flex items-center gap-1">
                        {n.sender_name}
                        {isFounder && <VerifiedBadge size="sm" />}
                      </span>
                      <span className="text-[10px] text-white/40 font-medium">
                        ·{' '}
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: ar,
                        })}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-white text-sm leading-tight">
                      {n.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {n.target_type === 'link' && n.target_value && (
                      <Link
                        to={n.target_value}
                        className="inline-flex items-center gap-1 text-xs text-[#cdff4f] hover:underline mt-2 font-bold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        فتح الرابط
                      </Link>
                    )}
                  </div>

                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead.mutate(n.id)}
                      disabled={markAsRead.isPending}
                      data-testid={`mark-read-${n.id}`}
                      className="h-8 w-8 rounded-lg bg-white/5 hover:bg-[#cdff4f]/20 text-white/60 hover:text-[#cdff4f] flex items-center justify-center transition-colors flex-shrink-0 border border-white/10 hover:border-[#cdff4f]/40"
                      title="تعيين كمقروء"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="h-10" />
    </DashboardLayout>
  );
};

export default Notifications;
