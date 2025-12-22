import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  hearts_remaining: number;
  updated_at: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Progress[];
    },
    enabled: !!user
  });
};

export const useLessonProgress = (lessonId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['progress', user?.id, lessonId],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) throw error;
      return data as Progress | null;
    },
    enabled: !!user && !!lessonId
  });
};

export const useUpdateProgress = () => {
  const { user, updateProfile, profile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      completed,
      score,
      heartsRemaining,
      xpEarned
    }: {
      lessonId: string;
      completed: boolean;
      score: number;
      heartsRemaining: number;
      xpEarned: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Upsert progress
      const { error: progressError } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed,
          score,
          hearts_remaining: heartsRemaining,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (progressError) throw progressError;

      // Update user XP and streak if lesson completed
      if (completed && profile) {
        const today = new Date().toISOString().split('T')[0];
        const lastStudyDate = profile.last_study_date;
        
        let newStreakCount = profile.streak_count;
        
        if (lastStudyDate) {
          const lastDate = new Date(lastStudyDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreakCount = profile.streak_count + 1;
          } else if (diffDays > 1) {
            newStreakCount = 1;
          }
        } else {
          newStreakCount = 1;
        }

        await updateProfile({
          xp: profile.xp + xpEarned,
          streak_count: newStreakCount,
          last_study_date: today
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
};
