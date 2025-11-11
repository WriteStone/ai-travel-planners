import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
      : '未设置',
    DASHSCOPE_API_KEY: process.env.DASHSCOPE_API_KEY 
      ? `${process.env.DASHSCOPE_API_KEY.substring(0, 15)}...` 
      : '未设置',
    NODE_ENV: process.env.NODE_ENV,
  })
}
