export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          industry: string | null
          name: string | null
          project_description: string | null
          required_services: string | null
          services_needed: string[] | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          project_description?: string | null
          required_services?: string | null
          services_needed?: string[] | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          project_description?: string | null
          required_services?: string | null
          services_needed?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          id: string
          recipient: string | null
          sender: string | null
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          id?: string
          recipient?: string | null
          sender?: string | null
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          id?: string
          recipient?: string | null
          sender?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          client_name: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          impact_results: string | null
          project_date: string | null
          project_name: string
          technologies: string[] | null
          user_id: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          impact_results?: string | null
          project_date?: string | null
          project_name: string
          technologies?: string[] | null
          user_id?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          impact_results?: string | null
          project_date?: string | null
          project_name?: string
          technologies?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          client_id: string | null
          created_at: string | null
          estimated_rate: string | null
          id: string
          proposal_text: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          estimated_rate?: string | null
          id?: string
          proposal_text?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          estimated_rate?: string | null
          id?: string
          proposal_text?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          status: string | null
          task_title: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          task_title?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          task_title?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio_output: string | null
          certifications: string | null
          communication_tone: string | null
          company_summary: string | null
          cover_letter: string | null
          created_at: string | null
          cv_bullets: string | null
          cv_full_text: string | null
          education: string | null
          email: string | null
          freelance_services: string | null
          full_name: string | null
          goal: string | null
          id: string
          intro_email: string | null
          job_suggestions: string | null
          job_title: string | null
          matched_client: string | null
          name: string | null
          phone: string | null
          phone_number: string | null
          portfolio_summary: string | null
          post_ideas: string | null
          professional_goal: string | null
          proposal_text: string | null
          rate_estimate: string | null
          services_offered: string | null
          skills: string | null
          task_list: string | null
          tone: string | null
          user_type: string | null
          work_history: string | null
        }
        Insert: {
          bio_output?: string | null
          certifications?: string | null
          communication_tone?: string | null
          company_summary?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_bullets?: string | null
          cv_full_text?: string | null
          education?: string | null
          email?: string | null
          freelance_services?: string | null
          full_name?: string | null
          goal?: string | null
          id?: string
          intro_email?: string | null
          job_suggestions?: string | null
          job_title?: string | null
          matched_client?: string | null
          name?: string | null
          phone?: string | null
          phone_number?: string | null
          portfolio_summary?: string | null
          post_ideas?: string | null
          professional_goal?: string | null
          proposal_text?: string | null
          rate_estimate?: string | null
          services_offered?: string | null
          skills?: string | null
          task_list?: string | null
          tone?: string | null
          user_type?: string | null
          work_history?: string | null
        }
        Update: {
          bio_output?: string | null
          certifications?: string | null
          communication_tone?: string | null
          company_summary?: string | null
          cover_letter?: string | null
          created_at?: string | null
          cv_bullets?: string | null
          cv_full_text?: string | null
          education?: string | null
          email?: string | null
          freelance_services?: string | null
          full_name?: string | null
          goal?: string | null
          id?: string
          intro_email?: string | null
          job_suggestions?: string | null
          job_title?: string | null
          matched_client?: string | null
          name?: string | null
          phone?: string | null
          phone_number?: string | null
          portfolio_summary?: string | null
          post_ideas?: string | null
          professional_goal?: string | null
          proposal_text?: string | null
          rate_estimate?: string | null
          services_offered?: string | null
          skills?: string | null
          task_list?: string | null
          tone?: string | null
          user_type?: string | null
          work_history?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
