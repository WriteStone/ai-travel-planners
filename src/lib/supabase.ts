import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          travelers: number
          preferences: string[]
          itinerary: any
          status: 'planning' | 'confirmed' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          travelers: number
          preferences?: string[]
          itinerary?: any
          status?: 'planning' | 'confirmed' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number
          travelers?: number
          preferences?: string[]
          itinerary?: any
          status?: 'planning' | 'confirmed' | 'completed'
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          category: string
          amount: number
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          category: string
          amount: number
          description: string
          date: string
          created_at?: string
        }
        Update: {
          category?: string
          amount?: number
          description?: string
          date?: string
        }
      }
    }
  }
}
