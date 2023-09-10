export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          county: string | null
          created_at: string | null
          id: number
          state: string | null
          street_address: string | null
          street_address_line_2: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          county?: string | null
          created_at?: string | null
          id?: number
          state?: string | null
          street_address?: string | null
          street_address_line_2?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          county?: string | null
          created_at?: string | null
          id?: number
          state?: string | null
          street_address?: string | null
          street_address_line_2?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      productions: {
        Row: {
          composers: string[] | null
          cost_range: string | null
          created_at: string | null
          directors: string[] | null
          duration_minutes: number | null
          end_date: string | null
          id: number
          kid_friendly: boolean | null
          name: string | null
          notes: string | null
          poster_id: string | null
          stage_id: number | null
          start_date: string | null
          summary: string | null
          theater_id: number | null
          type: string | null
          updated_at: string | null
          url: string | null
          writers: string[] | null
        }
        Insert: {
          composers?: string[] | null
          cost_range?: string | null
          created_at?: string | null
          directors?: string[] | null
          duration_minutes?: number | null
          end_date?: string | null
          id?: number
          kid_friendly?: boolean | null
          name?: string | null
          notes?: string | null
          poster_id?: string | null
          stage_id?: number | null
          start_date?: string | null
          summary?: string | null
          theater_id?: number | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          writers?: string[] | null
        }
        Update: {
          composers?: string[] | null
          cost_range?: string | null
          created_at?: string | null
          directors?: string[] | null
          duration_minutes?: number | null
          end_date?: string | null
          id?: number
          kid_friendly?: boolean | null
          name?: string | null
          notes?: string | null
          poster_id?: string | null
          stage_id?: number | null
          start_date?: string | null
          summary?: string | null
          theater_id?: number | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
          writers?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "productions_poster_id_fkey"
            columns: ["poster_id"]
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productions_stage_id_fkey"
            columns: ["stage_id"]
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productions_theater_id_fkey"
            columns: ["theater_id"]
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          address_id: number | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          address_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stages: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          notes: string | null
          seating_capacity: number | null
          theater_id: number | null
          type: string | null
          updated_at: string | null
          wheelchair_accessible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          seating_capacity?: number | null
          theater_id?: number | null
          type?: string | null
          updated_at?: string | null
          wheelchair_accessible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          seating_capacity?: number | null
          theater_id?: number | null
          type?: string | null
          updated_at?: string | null
          wheelchair_accessible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "stages_theater_id_fkey"
            columns: ["theater_id"]
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          }
        ]
      }
      theater_managers: {
        Row: {
          created_at: string | null
          id: number
          theater_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          theater_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          theater_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theater_managers_theater_id_fkey"
            columns: ["theater_id"]
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_managers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      theaters: {
        Row: {
          address_id: number | null
          concessions: string | null
          created_at: string | null
          id: number
          name: string | null
          notes: string | null
          parking_instructions: string | null
          phone: string | null
          referred: string | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          address_id?: number | null
          concessions?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          parking_instructions?: string | null
          phone?: string | null
          referred?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          address_id?: number | null
          concessions?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          parking_instructions?: string | null
          phone?: string | null
          referred?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theaters_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          }
        ]
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
