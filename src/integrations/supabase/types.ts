export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description_ar: string
          description_en: string
          icon: string | null
          id: string
          key: string
          title_ar: string
          title_en: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description_ar: string
          description_en: string
          icon?: string | null
          id?: string
          key: string
          title_ar: string
          title_en: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string
          description_en?: string
          icon?: string | null
          id?: string
          key?: string
          title_ar?: string
          title_en?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          data_json: Json
          id: string
          lesson_id: string
          order_index: number
          prompt_ar: string | null
          prompt_en: string | null
          type: Database["public"]["Enums"]["exercise_type"]
        }
        Insert: {
          created_at?: string | null
          data_json: Json
          id?: string
          lesson_id: string
          order_index?: number
          prompt_ar?: string | null
          prompt_en?: string | null
          type: Database["public"]["Enums"]["exercise_type"]
        }
        Update: {
          created_at?: string | null
          data_json?: Json
          id?: string
          lesson_id?: string
          order_index?: number
          prompt_ar?: string | null
          prompt_en?: string | null
          type?: Database["public"]["Enums"]["exercise_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          order_index: number
          title_ar: string
          title_en: string
          unit_id: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          order_index?: number
          title_ar: string
          title_en: string
          unit_id: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          order_index?: number
          title_ar?: string
          title_en?: string
          unit_id?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_tests: {
        Row: {
          answers_json: Json
          breakdown_json: Json | null
          created_at: string
          id: string
          score: number
          suggested_level: string
          total_questions: number
          user_id: string
        }
        Insert: {
          answers_json?: Json
          breakdown_json?: Json | null
          created_at?: string
          id?: string
          score: number
          suggested_level: string
          total_questions?: number
          user_id: string
        }
        Update: {
          answers_json?: Json
          breakdown_json?: Json | null
          created_at?: string
          id?: string
          score?: number
          suggested_level?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          current_level: string | null
          daily_goal: Database["public"]["Enums"]["daily_goal"] | null
          email: string | null
          has_taken_placement: boolean | null
          id: string
          interests: string[] | null
          is_premium: boolean | null
          last_study_date: string | null
          level: Database["public"]["Enums"]["user_level"] | null
          name: string | null
          onboarding_completed: boolean | null
          placement_level: string | null
          placement_score: number | null
          placement_taken_at: string | null
          streak_count: number | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          created_at?: string | null
          current_level?: string | null
          daily_goal?: Database["public"]["Enums"]["daily_goal"] | null
          email?: string | null
          has_taken_placement?: boolean | null
          id: string
          interests?: string[] | null
          is_premium?: boolean | null
          last_study_date?: string | null
          level?: Database["public"]["Enums"]["user_level"] | null
          name?: string | null
          onboarding_completed?: boolean | null
          placement_level?: string | null
          placement_score?: number | null
          placement_taken_at?: string | null
          streak_count?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          created_at?: string | null
          current_level?: string | null
          daily_goal?: Database["public"]["Enums"]["daily_goal"] | null
          email?: string | null
          has_taken_placement?: boolean | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          last_study_date?: string | null
          level?: Database["public"]["Enums"]["user_level"] | null
          name?: string | null
          onboarding_completed?: boolean | null
          placement_level?: string | null
          placement_score?: number | null
          placement_taken_at?: string | null
          streak_count?: number | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed: boolean | null
          hearts_remaining: number | null
          id: string
          lesson_id: string
          score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          hearts_remaining?: number | null
          id?: string
          lesson_id: string
          score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          hearts_remaining?: number | null
          id?: string
          lesson_id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          icon: string | null
          id: string
          order_index: number
          title_ar: string
          title_en: string
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          title_ar: string
          title_en: string
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          order_index?: number
          title_ar?: string
          title_en?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin"
      daily_goal: "5" | "10" | "15"
      exercise_type:
        | "mcq"
        | "fill_blank"
        | "reorder"
        | "listening"
        | "translation"
      user_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
      daily_goal: ["5", "10", "15"],
      exercise_type: [
        "mcq",
        "fill_blank",
        "reorder",
        "listening",
        "translation",
      ],
      user_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
