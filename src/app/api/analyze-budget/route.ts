import { NextRequest, NextResponse } from 'next/server'
import { analyzeBudget } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { expenses, totalBudget } = body

    if (!expenses || !totalBudget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const analysis = await analyzeBudget(expenses, totalBudget)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze budget' },
      { status: 500 }
    )
  }
}
