'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDemoMode, demoAuth, demoDb } from '@/lib/demo-mode'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { MapPin, Calendar, DollarSign, Users, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import map component (client-side only)
const TripMap = dynamic(() => import('@/components/TripMap'), { ssr: false })
const ExpenseTracker = dynamic(() => import('@/components/ExpenseTracker'), { ssr: false })

export default function TripDetail({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'expenses'>('itinerary')
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const demo = isDemoMode()
    setIsDemo(demo)
    loadTrip(demo)
  }, [params.id])

  const loadTrip = async (demo: boolean) => {
    try {
      if (demo) {
        const data = await demoDb.trips.getById(params.id)
        if (!data) throw new Error('行程不存在')
        setTrip(data)
      } else {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setTrip(data)
      }
    } catch (error: any) {
      toast.error('加载行程失败')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个行程吗？')) return

    try {
      if (isDemo) {
        await demoDb.trips.delete(params.id)
      } else {
        const { error } = await supabase
          .from('trips')
          .delete()
          .eq('id', params.id)

        if (error) throw error
      }

      toast.success('行程已删除')
      router.push('/dashboard')
    } catch (error) {
      toast.error('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!trip) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">目的地</p>
                <p className="font-semibold">{trip.destination}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">日期</p>
                <p className="font-semibold">{trip.start_date} 至 {trip.end_date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">预算</p>
                <p className="font-semibold">¥{trip.budget.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">人数</p>
                <p className="font-semibold">{trip.travelers} 人</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'itinerary'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                行程详情
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'map'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                地图视图
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'expenses'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                费用管理
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'itinerary' && trip.itinerary && (
              <div className="space-y-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">行程概述</h3>
                  <p className="text-gray-700">{trip.itinerary.overview}</p>
                </div>

                {trip.itinerary.days?.map((day: any, index: number) => (
                  <div key={index} className="border-l-4 border-primary-600 pl-4">
                    <h3 className="font-bold text-xl mb-4">
                      第 {day.day} 天 {day.date && `- ${day.date}`}
                    </h3>
                    
                    <div className="space-y-4">
                      {day.activities?.map((activity: any, actIndex: number) => (
                        <div key={actIndex} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-primary-600 font-semibold">{activity.time}</span>
                              <h4 className="font-semibold text-lg">{activity.name}</h4>
                            </div>
                            <span className="text-sm text-gray-600">¥{activity.cost}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            📍 {activity.location} | ⏱️ {activity.duration}
                          </p>
                        </div>
                      ))}

                      {day.meals && day.meals.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">🍽️ 餐饮推荐</h4>
                          <div className="grid md:grid-cols-3 gap-3">
                            {day.meals.map((meal: any, mealIndex: number) => (
                              <div key={mealIndex} className="bg-white p-3 rounded-lg border">
                                <p className="text-sm font-semibold text-primary-600">
                                  {meal.type === 'breakfast' ? '早餐' : meal.type === 'lunch' ? '午餐' : '晚餐'}
                                </p>
                                <p className="font-semibold">{meal.restaurant}</p>
                                <p className="text-sm text-gray-600">{meal.cuisine}</p>
                                <p className="text-sm text-gray-500">¥{meal.estimatedCost}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Cost Breakdown */}
                {trip.itinerary.estimatedCosts && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-xl mb-4">费用预估</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>住宿</span>
                        <span>¥{trip.itinerary.estimatedCosts.accommodation?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>交通</span>
                        <span>¥{trip.itinerary.estimatedCosts.transportation?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>餐饮</span>
                        <span>¥{trip.itinerary.estimatedCosts.meals?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>活动</span>
                        <span>¥{trip.itinerary.estimatedCosts.activities?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>其他</span>
                        <span>¥{trip.itinerary.estimatedCosts.miscellaneous?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>总计</span>
                        <span className="text-primary-600">¥{trip.itinerary.estimatedCosts.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'map' && (
              <TripMap itinerary={trip.itinerary} />
            )}

            {activeTab === 'expenses' && (
              <ExpenseTracker tripId={trip.id} budget={trip.budget} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
