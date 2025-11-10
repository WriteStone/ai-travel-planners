import { NextRequest, NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { destination, days, budget, travelers, preferences, additionalInfo } = body

    // 详细的字段验证
    const missingFields = []
    if (!destination) missingFields.push('目的地')
    if (!days || days <= 0) missingFields.push('天数')
    if (!budget || budget <= 0) missingFields.push('预算')
    if (!travelers || travelers <= 0) missingFields.push('人数')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必填字段: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const itinerary = await generateItinerary({
      destination,
      days,
      budget,
      travelers,
      preferences: preferences || [],
      additionalInfo,
    })

    return NextResponse.json({ itinerary })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}
