import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, Users, Send, Loader2, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSendNotification } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Header from '@/components/Header';
import BlogManager from '@/components/admin/BlogManager';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const sendNotification = useSendNotification();

  // Notification form state
  const [senderName, setSenderName] = useState('Founder');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific' | 'level' | 'country'>('all');
  const [targetValue, setTargetValue] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch users for admin
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, display_name, current_level, country_code, xp, user_level, last_active_at, created_at')
        .order('last_active_at', { ascending: false, nullsFirst: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: usersCount || 0,
        notificationsCount: notificationsCount || 0
      };
    },
    enabled: isAdmin
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      toast.error('ليس لديك صلاحية الوصول لهذه الصفحة');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await sendNotification.mutateAsync({
        sender_name: senderName,
        title,
        message,
        target_type: targetType,
        target_value: targetType !== 'all' && targetType !== 'specific' ? targetValue : undefined,
        user_ids: targetType === 'specific' ? selectedUsers : undefined
      });

      toast.success('تم إرسال الإشعار بنجاح');
      setTitle('');
      setMessage('');
      setSelectedUsers([]);
    } catch (error) {
      toast.error('فشل في إرسال الإشعار');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack showUserInfo />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.usersCount || 0}</p>
                  <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Bell className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats?.notificationsCount || 0}</p>
                  <p className="text-sm text-muted-foreground">إجمالي الإشعارات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              المدونة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>إرسال إشعار</CardTitle>
                <CardDescription>أرسل إشعارات للمستخدمين</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم المرسل</Label>
                    <Select value={senderName} onValueChange={setSenderName}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Founder">Founder (المؤسس)</SelectItem>
                        <SelectItem value="System">System (النظام)</SelectItem>
                        <SelectItem value="Support">Support (الدعم)</SelectItem>
                        <SelectItem value="LingoArab">LingoArab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>الجمهور المستهدف</Label>
                    <Select value={targetType} onValueChange={(v) => setTargetType(v as typeof targetType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المستخدمين</SelectItem>
                        <SelectItem value="specific">مستخدمين محددين</SelectItem>
                        <SelectItem value="level">حسب المستوى</SelectItem>
                        <SelectItem value="country">حسب البلد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {targetType === 'level' && (
                  <div className="space-y-2">
                    <Label>المستوى</Label>
                    <Select value={targetValue} onValueChange={setTargetValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {targetType === 'country' && (
                  <div className="space-y-2">
                    <Label>رمز البلد (مثال: SA, EG, US)</Label>
                    <Input 
                      value={targetValue} 
                      onChange={(e) => setTargetValue(e.target.value.toUpperCase())}
                      maxLength={2}
                      placeholder="SA"
                    />
                  </div>
                )}

                {targetType === 'specific' && (
                  <div className="space-y-2">
                    <Label>اختر المستخدمين ({selectedUsers.length} محدد)</Label>
                    <div className="max-h-48 overflow-y-auto border rounded-lg p-2 space-y-1">
                      {users?.map((u) => (
                        <label key={u.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, u.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                              }
                            }}
                            className="rounded"
                          />
                          <span>{u.display_name || u.name || u.email || 'مستخدم'}</span>
                          <span className="text-xs text-muted-foreground">({u.xp} XP)</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>عنوان الإشعار *</Label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="أدخل عنوان الإشعار"
                  />
                </div>

                <div className="space-y-2">
                  <Label>نص الإشعار *</Label>
                  <Textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="أدخل نص الإشعار"
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleSendNotification}
                  disabled={sendNotification.isPending || !title.trim() || !message.trim()}
                  className="w-full"
                >
                  {sendNotification.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : (
                    <Send className="w-4 h-4 ml-2" />
                  )}
                  إرسال الإشعار
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
                <CardDescription>عرض وإدارة المستخدمين المسجلين</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">المستخدم</th>
                          <th className="text-right p-3">البريد</th>
                          <th className="text-right p-3">المستوى</th>
                          <th className="text-right p-3">XP</th>
                          <th className="text-right p-3">البلد</th>
                          <th className="text-right p-3">آخر نشاط</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((u) => {
                          const lastActive = u.last_active_at ? new Date(u.last_active_at) : null;
                          const isOnlineNow = lastActive && (Date.now() - lastActive.getTime()) < 5 * 60 * 1000; // 5 minutes
                          const isRecentlyActive = lastActive && (Date.now() - lastActive.getTime()) < 60 * 60 * 1000; // 1 hour
                          
                          return (
                            <tr key={u.id} className="border-b hover:bg-muted/50">
                              <td className="p-3 font-medium">{u.display_name || u.name || 'مستخدم'}</td>
                              <td className="p-3 text-muted-foreground">{u.email || '-'}</td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                                  Lv.{u.user_level} ({u.current_level || 'A1'})
                                </span>
                              </td>
                              <td className="p-3 font-bold">{u.xp?.toLocaleString()}</td>
                              <td className="p-3">{u.country_code || '-'}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {isOnlineNow ? (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                      متصل الآن
                                    </span>
                                  ) : isRecentlyActive ? (
                                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                      <Clock className="w-3 h-3" />
                                      {lastActive ? formatDistanceToNow(lastActive, { addSuffix: true, locale: ar }) : '-'}
                                    </span>
                                  ) : lastActive ? (
                                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                      <Clock className="w-3 h-3" />
                                      {formatDistanceToNow(lastActive, { addSuffix: true, locale: ar })}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
