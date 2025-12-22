import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  name: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  weekly_xp: number;
  monthly_xp: number;
  user_level: number;
  streak_count: number;
  country_code: string | null;
  current_level: string | null;
  rank?: number;
}

type TimeFrame = 'all_time' | 'weekly' | 'monthly';
type LeaderboardType = 'global' | 'local' | 'level';

export const useLeaderboard = (
  type: LeaderboardType = 'global',
  timeFrame: TimeFrame = 'all_time',
  countryCode?: string,
  courseLevel?: string,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['leaderboard', type, timeFrame, countryCode, courseLevel, limit],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, name, display_name, avatar_url, xp, weekly_xp, monthly_xp, user_level, streak_count, country_code, current_level');

      // Filter by country for local leaderboard
      if (type === 'local' && countryCode) {
        query = query.eq('country_code', countryCode);
      }

      // Filter by course level
      if (type === 'level' && courseLevel) {
        query = query.eq('current_level', courseLevel);
      }

      // Order by appropriate XP field based on timeframe
      const orderField = timeFrame === 'weekly' ? 'weekly_xp' : timeFrame === 'monthly' ? 'monthly_xp' : 'xp';
      query = query.order(orderField, { ascending: false }).limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      // Add rank to each entry
      return (data || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      })) as LeaderboardEntry[];
    }
  });
};

export const useUserRank = (userId: string | undefined, type: LeaderboardType = 'global', timeFrame: TimeFrame = 'all_time', countryCode?: string) => {
  return useQuery({
    queryKey: ['user_rank', userId, type, timeFrame, countryCode],
    queryFn: async () => {
      if (!userId) return null;

      // Get user's XP
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('xp, weekly_xp, monthly_xp, country_code')
        .eq('id', userId)
        .single();

      if (userError || !userProfile) return null;

      const xpField = timeFrame === 'weekly' ? 'weekly_xp' : timeFrame === 'monthly' ? 'monthly_xp' : 'xp';
      const userXp = userProfile[xpField] || 0;

      // Count users with more XP
      let query = supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (type === 'local' && (countryCode || userProfile.country_code)) {
        query = query.eq('country_code', countryCode || userProfile.country_code);
      }

      query = query.gt(xpField, userXp);

      const { count, error } = await query;

      if (error) return null;

      return (count || 0) + 1;
    },
    enabled: !!userId
  });
};
