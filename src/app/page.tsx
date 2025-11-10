'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MapPin, Sparkles, TrendingUp, Users } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">AI Travel Planner</h1>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                  我的行程
                </Link>
                <Link href="/settings" className="text-gray-700 hover:text-primary-600">
                  设置
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            AI 智能旅行规划助手
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            语音输入旅行需求，AI 自动生成个性化路线，智能预算管理让旅行更轻松
          </p>
          <Link
            href={user ? '/planner' : '/auth/register'}
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span>开始规划旅行</span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">智能行程规划</h3>
            <p className="text-gray-600">
              通过语音或文字输入旅行需求，AI 自动生成包含交通、住宿、景点、餐厅的详细路线
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">费用预算管理</h3>
            <p className="text-gray-600">
              AI 智能预算分析，语音记账，实时追踪开销，让每一笔费用清晰可见
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">云端同步</h3>
            <p className="text-gray-600">
              多设备实时同步，随时随地查看和修改行程，与同行者共享计划
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">如何使用</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">输入旅行需求</h4>
                <p className="text-gray-600">
                  使用语音或文字描述："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI 生成行程</h4>
                <p className="text-gray-600">
                  系统自动生成个性化路线，包含每日行程、交通方式、住宿推荐、景点介绍
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">地图可视化</h4>
                <p className="text-gray-600">
                  在地图上查看路线、景点位置，获取导航信息，实时调整计划
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">费用管理</h4>
                <p className="text-gray-600">
                  语音记录开销，AI 分析预算，实时查看花费统计和剩余预算
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>&copy; 2025 AI Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
