import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WeakPoint {
  id: string;
  user_id: string;
  lesson_id: string;
  item_type: 'word' | 'exercise';
  item_key: string;
  item_data: {
    english?: string;
    arabic?: string;
    promptAr?: string;
    answer?: string;
    type?: string;
    lessonTitle?: string;
  };
  mistakes_count: number;
  correct_streak: number;
  mastered: boolean;
  mastered_at: string | null;
  last_mistake_at: string;
  created_at: string;
  updated_at: string;
}

export const useWeakPoints = (onlyActive = true) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['weak_points', user?.id, onlyActive],
    queryFn: async (): Promise<WeakPoint[]> => {
      if (!user) return [];
      let q = supabase
        .from('weak_points' as never)
        .select('*')
        .eq('user_id', user.id)
        .order('last_mistake_at', { ascending: false });
      if (onlyActive) q = q.eq('mastered', false);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as WeakPoint[];
    },
    enabled: !!user,
  });
};

export const useRecordMistake = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      lessonId: string;
      itemType: 'word' | 'exercise';
      itemKey: string;
      itemData: WeakPoint['item_data'];
    }) => {
      if (!user) return;
      // Try update existing first
      const { data: existing } = await supabase
        .from('weak_points' as never)
        .select('id, mistakes_count')
        .eq('user_id', user.id)
        .eq('lesson_id', input.lessonId)
        .eq('item_key', input.itemKey)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('weak_points' as never)
          .update({
            mistakes_count: ((existing as { mistakes_count: number }).mistakes_count || 0) + 1,
            correct_streak: 0,
            mastered: false,
            mastered_at: null,
            last_mistake_at: new Date().toISOString(),
            item_data: input.itemData,
          })
          .eq('id', (existing as { id: string }).id);
      } else {
        await supabase.from('weak_points' as never).insert({
          user_id: user.id,
          lesson_id: input.lessonId,
          item_type: input.itemType,
          item_key: input.itemKey,
          item_data: input.itemData,
        });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weak_points'] }),
  });
};

export const useRecordReviewResult = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, correct }: { id: string; correct: boolean }) => {
      if (!user) return;
      const { data: existing } = await supabase
        .from('weak_points' as never)
        .select('correct_streak')
        .eq('id', id)
        .maybeSingle();
      const streak = ((existing as { correct_streak?: number } | null)?.correct_streak ?? 0);
      if (correct) {
        const next = streak + 1;
        const mastered = next >= 3;
        await supabase
          .from('weak_points' as never)
          .update({
            correct_streak: next,
            mastered,
            mastered_at: mastered ? new Date().toISOString() : null,
          })
          .eq('id', id);
      } else {
        await supabase
          .from('weak_points' as never)
          .update({
            correct_streak: 0,
            mistakes_count: 0, // reset display count after retry attempt
            last_mistake_at: new Date().toISOString(),
          })
          .eq('id', id);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weak_points'] }),
  });
};
