import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Users, UserCheck, CalendarDays, BarChart3 } from 'lucide-react';
import { format, subDays, eachDayOfInterval, startOfDay, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const chartConfig: ChartConfig = {
  activeUsers: {
    label: 'مستخدمين نشطين',
    color: 'hsl(var(--primary))',
  },
  newUsers: {
    label: 'مستخدمين جدد',
    color: 'hsl(var(--chart-2, 160 60% 45%))',
  },
  returningUsers: {
    label: 'مستخدمين عائدين',
    color: 'hsl(var(--chart-3, 30 80% 55%))',
  },
};

const UserActivityStats = () => {
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('14');
  const days = parseInt(timeRange);

  // Fetch activity logs
  const { data: activityLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['admin_activity_logs', days],
    queryFn: async () => {
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('user_id, activity_date, visit_count')
        .gte('activity_date', startDate)
        .order('activity_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Fetch user creation dates for new vs returning
  const { data: userProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['admin_user_profiles_activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, created_at, last_active_at');

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  const isLoading = logsLoading || profilesLoading;

  // Compute analytics
  const analytics = useMemo(() => {
    if (!activityLogs || !userProfiles) return null;

    const today = startOfDay(new Date());
    const dateRange = eachDayOfInterval({
      start: subDays(today, days - 1),
      end: today,
    });

    // Create a map of user creation dates
    const userCreatedMap = new Map<string, Date>();
    userProfiles.forEach((p) => {
      if (p.created_at) {
        userCreatedMap.set(p.id, startOfDay(new Date(p.created_at)));
      }
    });

    // Group activity by date
    const activityByDate = new Map<string, Set<string>>();
    activityLogs.forEach((log) => {
      const dateKey = log.activity_date;
      if (!activityByDate.has(dateKey)) {
        activityByDate.set(dateKey, new Set());
      }
      activityByDate.get(dateKey)!.add(log.user_id);
    });

    // Build daily chart data
    const dailyData = dateRange.map((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const activeUserIds = activityByDate.get(dateKey) || new Set();
      
      let newCount = 0;
      let returningCount = 0;
      
      activeUserIds.forEach((uid) => {
        const createdAt = userCreatedMap.get(uid);
        if (createdAt && differenceInDays(date, createdAt) <= 1) {
          newCount++;
        } else {
          returningCount++;
        }
      });

      return {
        date: format(date, 'MM/dd'),
        dateLabel: format(date, 'dd MMM', { locale: ar }),
        activeUsers: activeUserIds.size,
        newUsers: newCount,
        returningUsers: returningCount,
      };
    });

    // Compute summary stats
    const totalActiveUsers = new Set(activityLogs.map((l) => l.user_id)).size;
    const todayKey = format(today, 'yyyy-MM-dd');
    const todayActive = activityByDate.get(todayKey)?.size || 0;
    const yesterdayKey = format(subDays(today, 1), 'yyyy-MM-dd');
    const yesterdayActive = activityByDate.get(yesterdayKey)?.size || 0;

    // Avg daily active users
    const totalDailyActive = dailyData.reduce((sum, d) => sum + d.activeUsers, 0);
    const avgDailyActive = Math.round(totalDailyActive / days);

    // Activity frequency: how many days each user was active
    const userDaysActive = new Map<string, number>();
    activityLogs.forEach((log) => {
      userDaysActive.set(log.user_id, (userDaysActive.get(log.user_id) || 0) + 1);
    });

    // Retention buckets
    let oneDay = 0, twoDays = 0, threePlus = 0, fivePlus = 0, sevenPlus = 0;
    userDaysActive.forEach((daysCount) => {
      if (daysCount >= 7) sevenPlus++;
      if (daysCount >= 5) fivePlus++;
      if (daysCount >= 3) threePlus++;
      if (daysCount >= 2) twoDays++;
      oneDay++;
    });

    const retentionData = [
      { label: 'يوم واحد', count: oneDay, percentage: 100 },
      { label: 'يومين+', count: twoDays, percentage: Math.round((twoDays / Math.max(oneDay, 1)) * 100) },
      { label: '3 أيام+', count: threePlus, percentage: Math.round((threePlus / Math.max(oneDay, 1)) * 100) },
      { label: '5 أيام+', count: fivePlus, percentage: Math.round((fivePlus / Math.max(oneDay, 1)) * 100) },
      { label: '7 أيام+', count: sevenPlus, percentage: Math.round((sevenPlus / Math.max(oneDay, 1)) * 100) },
    ];

    // Top active users
    const topUsers = Array.from(userDaysActive.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, daysCount]) => {
        const profile = userProfiles.find((p) => p.id === userId);
        return { userId, daysCount, profile };
      });

    // DAU change trend
    const trend = todayActive - yesterdayActive;

    return {
      dailyData,
      totalActiveUsers,
      todayActive,
      yesterdayActive,
      avgDailyActive,
      retentionData,
      topUsers,
      trend,
      totalUsers: userProfiles.length,
    };
  }, [activityLogs, userProfiles, days]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>لا توجد بيانات نشاط حتى الآن</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحليلات نشاط المستخدمين</h3>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">آخر 7 أيام</SelectItem>
            <SelectItem value="14">آخر 14 يوم</SelectItem>
            <SelectItem value="30">آخر 30 يوم</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">نشطين اليوم</p>
                <p className="text-2xl font-bold">{analytics.todayActive}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${analytics.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {analytics.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {analytics.trend >= 0 ? '+' : ''}{analytics.trend}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">معدل النشاط اليومي</p>
                <p className="text-2xl font-bold">{analytics.avgDailyActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">مستخدمين نشطين ({days} يوم)</p>
                <p className="text-2xl font-bold">{analytics.totalActiveUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-accent-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">نسبة النشاط</p>
                <p className="text-2xl font-bold">
                  {Math.round((analytics.totalActiveUsers / Math.max(analytics.totalUsers, 1)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">المستخدمين النشطين يومياً</CardTitle>
            <CardDescription>عدد المستخدمين الذين زاروا الموقع كل يوم</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="var(--color-activeUsers)"
                  fill="var(--color-activeUsers)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* New vs Returning Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">جدد مقابل عائدين</CardTitle>
            <CardDescription>مقارنة بين المستخدمين الجدد والعائدين يومياً</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="newUsers" fill="var(--color-newUsers)" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="returningUsers" fill="var(--color-returningUsers)" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Retention & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">معدل الاحتفاظ بالمستخدمين</CardTitle>
            <CardDescription>كم مرة يعود المستخدمون خلال الفترة المحددة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.retentionData.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.count} مستخدم</span>
                      <Badge variant={item.percentage >= 50 ? 'default' : item.percentage >= 25 ? 'secondary' : 'outline'}>
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">أكثر المستخدمين نشاطاً</CardTitle>
            <CardDescription>المستخدمون الذين يعودون أكثر خلال {days} يوم</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topUsers.length > 0 ? (
              <div className="space-y-2">
                {analytics.topUsers.map((u, i) => (
                  <div key={u.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? 'bg-primary text-primary-foreground' : i === 1 ? 'bg-muted-foreground text-background' : i === 2 ? 'bg-accent-foreground text-accent' : 'bg-muted text-muted-foreground'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.userId.substring(0, 8)}...
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {u.daysCount} {u.daysCount === 1 ? 'يوم' : 'أيام'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">لا توجد بيانات كافية</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserActivityStats;
