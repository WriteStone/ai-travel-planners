import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 验证环境变量
if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 未正确配置！')
  console.error('当前值:', supabaseUrl)
  console.error('请在 .env.local 文件中配置正确的 Supabase URL')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY 未正确配置！')
  console.error('当前值:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '(空)')
  console.error('请在 .env.local 文件中配置正确的 Supabase Anon Key')
}

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
