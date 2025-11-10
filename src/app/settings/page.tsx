'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  })
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    amap: '',
    iflytek_app_id: '',
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setUser(user)

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile({
        full_name: profileData.full_name || '',
        email: profileData.email || '',
      })
    }

    // Load API keys from localStorage (never store in database)
    const savedKeys = localStorage.getItem('apiKeys')
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }

    setLoading(false)
  }

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('个人信息已更新')
    } catch (error: any) {
      toast.error(error.message || '更新失败')
    }
  }

  const handleSaveApiKeys = () => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys))
    toast.success('API 密钥已保存到本地')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">设置</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">个人信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              <Save className="w-4 h-4" />
              <span>保存</span>
            </button>
          </div>
        </div>

        {/* API Keys Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">API 密钥配置</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              ⚠️ 密钥仅存储在浏览器本地，不会上传到服务器。请妥善保管您的 API 密钥。
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key (用于 AI 行程规划)
              </label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500 mt-1">
                可选：如使用阿里云百炼平台，请在环境变量中配置
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                高德地图 API Key
              </label>
              <input
                type="text"
                value={apiKeys.amap}
                onChange={(e) => setApiKeys({ ...apiKeys, amap: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="请输入高德地图 API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                科大讯飞 App ID (可选，用于语音识别)
              </label>
              <input
                type="text"
                value={apiKeys.iflytek_app_id}
                onChange={(e) => setApiKeys({ ...apiKeys, iflytek_app_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="可选，默认使用浏览器语音识别"
              />
            </div>

            <button
              onClick={handleSaveApiKeys}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              <Save className="w-4 h-4" />
              <span>保存密钥</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">使用说明</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-1">获取 OpenAI API Key:</h3>
              <p>访问 <a href="https://platform.openai.com/api-keys" target="_blank" className="text-primary-600 hover:underline">OpenAI 平台</a> 创建 API Key</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">获取高德地图 API Key:</h3>
              <p>访问 <a href="https://console.amap.com/" target="_blank" className="text-primary-600 hover:underline">高德开放平台</a> 申请 Web 端 API Key</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">使用阿里云百炼平台:</h3>
              <p>如果您有阿里云百炼平台的 API Key，请通过环境变量 DASHSCOPE_API_KEY 配置</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
