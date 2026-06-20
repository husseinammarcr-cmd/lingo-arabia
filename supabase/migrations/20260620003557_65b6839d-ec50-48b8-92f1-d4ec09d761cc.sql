
-- 1) weak_points table
CREATE TABLE public.weak_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('word','exercise')),
  item_key text NOT NULL,
  item_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  mistakes_count integer NOT NULL DEFAULT 1,
  correct_streak integer NOT NULL DEFAULT 0,
  mastered boolean NOT NULL DEFAULT false,
  mastered_at timestamptz,
  last_mistake_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id, item_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.weak_points TO authenticated;
GRANT ALL ON public.weak_points TO service_role;

ALTER TABLE public.weak_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weak points"
  ON public.weak_points FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weak points"
  ON public.weak_points FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weak points"
  ON public.weak_points FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weak points"
  ON public.weak_points FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX weak_points_user_idx ON public.weak_points(user_id, mastered);
CREATE INDEX weak_points_lesson_idx ON public.weak_points(user_id, lesson_id);

CREATE TRIGGER weak_points_set_updated_at
  BEFORE UPDATE ON public.weak_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) progress.needs_review
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;
