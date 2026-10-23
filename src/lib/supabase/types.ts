/**
 * Auto-generated Supabase database types.
 * Regenerate with: pnpm supabase gen types typescript --local > src/lib/supabase/types.ts
 *
 * For now this is a hand-written stub that matches our migration schema.
 * Replace with the generated version after running `supabase gen types`.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          plan: "demo" | "monthly" | "lifetime";
          credits: number;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          plan?: "demo" | "monthly" | "lifetime";
          credits?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          plan?: "demo" | "monthly" | "lifetime";
          credits?: number;
          created_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          status: "queued" | "reading" | "done" | "failed";
          market_pack: string | null;
          instrument: string | null;
          timeframe: string | null;
          input_type: "image" | "tv_link";
          created_at: string;
          completed_at: string | null;
          result: Json | null;
          model: string | null;
          latency_ms: number | null;
          cost_usd: number | null;
          error: string | null;
          prompt_version: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "queued" | "reading" | "done" | "failed";
          market_pack?: string | null;
          instrument?: string | null;
          timeframe?: string | null;
          input_type?: "image" | "tv_link";
          created_at?: string;
          completed_at?: string | null;
          result?: Json | null;
          model?: string | null;
          latency_ms?: number | null;
          cost_usd?: number | null;
          error?: string | null;
          prompt_version?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      analysis_images: {
        Row: {
          id: string;
          analysis_id: string;
          storage_path: string;
          timeframe_label: string | null;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          storage_path: string;
          timeframe_label?: string | null;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analysis_images"]["Insert"]>;
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          analysis_id: string | null;
          outcome: "win" | "loss" | "breakeven" | "skipped";
          r_multiple: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          analysis_id?: string | null;
          outcome: "win" | "loss" | "breakeven" | "skipped";
          r_multiple?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["journal_entries"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          slug: string;
          title: string;
          body_md: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          body_md: string;
          order: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          props: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          props?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: "demo" | "monthly" | "lifetime";
      analysis_status: "queued" | "reading" | "done" | "failed";
      input_type: "image" | "tv_link";
      journal_outcome: "win" | "loss" | "breakeven" | "skipped";
    };
  };
}
