'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDemoMode, demoAuth, demoDb, DemoTrip } from '@/lib/demo-mode'
import Link from 'next/link'
import { MapPin, Plus, Calendar, DollarSign, LogOut, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Trip {
  id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  status: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const demo = isDemoMode()
    setIsDemo(demo)
    
    // 超时保护: 8秒后如果还在加载,强制停止
    const timeout = setTimeout(() => {
      setLoading(false)
      toast.error('加载超时,请刷新页面重试')
    }, 8000)
    
    checkUser(demo).finally(() => {
      clearTimeout(timeout)
    })
    
    return () => clearTimeout(timeout)
  }, [])

  const checkUser = async (demo: boolean) => {
    try {
      if (demo) {
        const { user } = await demoAuth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }
        setUser(user)
        await loadTrips(demo, user.id)
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }
        setUser(user)
        await loadTrips(demo, user.id)
      }
    } catch (error) {
      console.error('Check user error:', error)
      setLoading(false)
    }
  }

  const loadTrips = async (demo: boolean, userId: string) => {
    try {
      console.log('Loading trips...', { demo, userId })
      if (demo) {
        const data = await demoDb.trips.getAll(userId)
        console.log('Demo trips loaded:', data)
        setTrips(data as Trip[])
      } else {
        console.log('Fetching trips from Supabase...')
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('Supabase response:', { data, error })
        
        if (error) {
          console.error('Supabase error:', error)
          // 即使出错也要停止加载
          setLoading(false)
          toast.error('加载行程失败: ' + error.message)
          return
        }
        setTrips(data || [])
      }
    } catch (error: any) {
      console.error('Load trips error:', error)
      toast.error('加载行程失败')
    } finally {
      console.log('Loading complete')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (isDemo) {
      await demoAuth.signOut()
    } else {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return '规划中'
      case 'confirmed': return '已确认'
      case 'completed': return '已完成'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">我的行程</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/planner" className="text-gray-700 hover:text-primary-600">
              创建行程
            </Link>
            <Link href="/settings" className="text-gray-700 hover:text-primary-600">
              设置
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
            >
              <LogOut className="w-5 h-5" />
              <span>登出</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isDemo && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">演示模式运行中</p>
              <p>数据保存在浏览器本地存储。要使用完整功能，请在设置中配置 Supabase。</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">我的旅行计划</h2>
          <Link
            href="/planner"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>创建新行程</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有行程</h3>
            <p className="text-gray-600 mb-6">创建您的第一个旅行计划吧！</p>
            <Link
              href="/planner"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              <span>开始规划</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trip/${trip.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                      {getStatusText(trip.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{trip.destination}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{trip.start_date} 至 {trip.end_date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>预算: ¥{trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
