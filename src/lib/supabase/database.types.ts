export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null;
          county: string | null;
          created_at: string | null;
          id: number;
          latitude: number | null;
          longitude: number | null;
          state: string | null;
          street_address: string | null;
          street_address_line_2: string | null;
          updated_at: string | null;
        };
        Insert: {
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          state?: string | null;
          street_address?: string | null;
          street_address_line_2?: string | null;
          updated_at?: string | null;
        };
        Update: {
          city?: string | null;
          county?: string | null;
          created_at?: string | null;
          id?: number;
          latitude?: number | null;
          longitude?: number | null;
          state?: string | null;
          street_address?: string | null;
          street_address_line_2?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      productions: {
        Row: {
          composers: string[] | null;
          cost_range: string | null;
          created_at: string | null;
          directors: string[] | null;
          duration_minutes: number | null;
          end_date: string | null;
          id: number;
          kid_friendly: boolean | null;
          name: string | null;
          notes: string | null;
          poster_id: string | null;
          stage_id: number | null;
          start_date: string | null;
          summary: string | null;
          theater_id: number | null;
          type: string | null;
          updated_at: string | null;
          url: string | null;
          writers: string[] | null;
        };
        Insert: {
          composers?: string[] | null;
          cost_range?: string | null;
          created_at?: string | null;
          directors?: string[] | null;
          duration_minutes?: number | null;
          end_date?: string | null;
          id?: number;
          kid_friendly?: boolean | null;
          name?: string | null;
          notes?: string | null;
          poster_id?: string | null;
          stage_id?: number | null;
          start_date?: string | null;
          summary?: string | null;
          theater_id?: number | null;
          type?: string | null;
          updated_at?: string | null;
          url?: string | null;
          writers?: string[] | null;
        };
        Update: {
          composers?: string[] | null;
          cost_range?: string | null;
          created_at?: string | null;
          directors?: string[] | null;
          duration_minutes?: number | null;
          end_date?: string | null;
          id?: number;
          kid_friendly?: boolean | null;
          name?: string | null;
          notes?: string | null;
          poster_id?: string | null;
          stage_id?: number | null;
          start_date?: string | null;
          summary?: string | null;
          theater_id?: number | null;
          type?: string | null;
          updated_at?: string | null;
          url?: string | null;
          writers?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "productions_poster_id_fkey";
            columns: ["poster_id"];
            referencedRelation: "objects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "productions_stage_id_fkey";
            columns: ["stage_id"];
            referencedRelation: "stages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "productions_theater_id_fkey";
            columns: ["theater_id"];
            referencedRelation: "theaters";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          address_id: number | null;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          address_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address_id?: number | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_address_id_fkey";
            columns: ["address_id"];
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      stages: {
        Row: {
          created_at: string | null;
          id: number;
          name: string | null;
          notes: string | null;
          seating_capacity: number | null;
          theater_id: number | null;
          type: string | null;
          updated_at: string | null;
          wheelchair_accessible: boolean | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name?: string | null;
          notes?: string | null;
          seating_capacity?: number | null;
          theater_id?: number | null;
          type?: string | null;
          updated_at?: string | null;
          wheelchair_accessible?: boolean | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string | null;
          notes?: string | null;
          seating_capacity?: number | null;
          theater_id?: number | null;
          type?: string | null;
          updated_at?: string | null;
          wheelchair_accessible?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "stages_theater_id_fkey";
            columns: ["theater_id"];
            referencedRelation: "theaters";
            referencedColumns: ["id"];
          },
        ];
      };
      theater_managers: {
        Row: {
          created_at: string | null;
          id: number;
          theater_id: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          theater_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          theater_id?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "theater_managers_theater_id_fkey";
            columns: ["theater_id"];
            referencedRelation: "theaters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "theater_managers_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      theaters: {
        Row: {
          address_id: number | null;
          concessions: string | null;
          created_at: string | null;
          id: number;
          name: string | null;
          notes: string | null;
          parking_instructions: string | null;
          phone: string | null;
          referred: string | null;
          type: string | null;
          updated_at: string | null;
          url: string | null;
        };
        Insert: {
          address_id?: number | null;
          concessions?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          notes?: string | null;
          parking_instructions?: string | null;
          phone?: string | null;
          referred?: string | null;
          type?: string | null;
          updated_at?: string | null;
          url?: string | null;
        };
        Update: {
          address_id?: number | null;
          concessions?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string | null;
          notes?: string | null;
          parking_instructions?: string | null;
          phone?: string | null;
          referred?: string | null;
          type?: string | null;
          updated_at?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "theaters_address_id_fkey";
            columns: ["address_id"];
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
