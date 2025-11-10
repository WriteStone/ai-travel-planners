'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isDemoMode, demoAuth, demoDb } from '@/lib/demo-mode'
import { VoiceRecognition } from '@/lib/voice'
import toast from 'react-hot-toast'
import { Mic, MicOff, Sparkles, Loader } from 'lucide-react'

export default function Planner() {
  const [user, setUser] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceInput, setVoiceInput] = useState('')
  const [isDemo, setIsDemo] = useState(false)
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null)
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    preferences: [] as string[],
  })
  const [generating, setGenerating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize voice recognition only in browser
    setVoiceRecognition(new VoiceRecognition())
    
    const demo = isDemoMode()
    setIsDemo(demo)
    checkUser(demo)
  }, [])

  const checkUser = async (demo: boolean) => {
    if (demo) {
      const { user } = await demoAuth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
    }
  }

  const handleVoiceInput = () => {
    if (!voiceRecognition || !voiceRecognition.isAvailable()) {
      toast.error('您的浏览器不支持语音识别')
      return
    }

    if (isRecording) {
      voiceRecognition.stop()
      setIsRecording(false)
      toast('语音识别已停止', { icon: '⏹️' })
    } else {
      setIsRecording(true)
      toast('🎤 正在监听...请说话', { duration: 10000, icon: '👂' })
      
      voiceRecognition.start(
        (text) => {
          console.log('收到识别结果:', text)
          setVoiceInput(text)
          setIsRecording(false)
          parseVoiceInput(text)
        },
        (error) => {
          console.error('识别错误:', error)
          const errorMsg = typeof error === 'string' ? error : error?.message || '语音识别失败，请重试'
          toast.error(errorMsg)
          setIsRecording(false)
        }
      )
    }
  }

  const parseVoiceInput = (text: string) => {
    console.log('解析语音输入:', text)
    const lowerText = text.toLowerCase()
    let fieldsRecognized: string[] = []
    
    // 1. 提取目的地 - 支持多种表达方式
    const destPatterns = [
      /(?:我想去|去|到|前往)([^，,。！]+?)(?:[，,。！]|预算|开始|结束|天|人|$)/,
      /目的地(?:是|为|：|:)\s*([^，,。！]+?)(?:[，,。！]|预算|开始|结束|$)/
    ]
    
    for (const pattern of destPatterns) {
      const destMatch = text.match(pattern)
      if (destMatch) {
        const dest = destMatch[1].trim()
        if (dest && dest.length > 0 && dest.length < 20) {
          setFormData(prev => ({ ...prev, destination: dest }))
          fieldsRecognized.push('目的地')
          console.log('识别到目的地:', dest)
          break
        }
      }
    }

    // 2. 提取预算 - 支持千、万等中文数字
    const budgetPatterns = [
      /预算\s*(?:是|为|：|:)?\s*([0-9一二三四五六七八九十百千万亿]+)\s*(?:元|块|rmb)?/i,
      /([0-9一二三四五六七八九十百千万亿]+)\s*(?:元|块|rmb)/i
    ]
    
    for (const pattern of budgetPatterns) {
      const budgetMatch = text.match(pattern)
      if (budgetMatch) {
        let budgetStr = budgetMatch[1]
        // 转换中文数字
        budgetStr = budgetStr
          .replace(/五千/g, '5000')
          .replace(/一万/g, '10000')
          .replace(/两万/g, '20000')
          .replace(/三万/g, '30000')
        
        const budget = budgetStr.replace(/[^0-9]/g, '')
        if (budget && parseInt(budget) > 0) {
          setFormData(prev => ({ ...prev, budget }))
          fieldsRecognized.push('预算')
          console.log('识别到预算:', budget)
          break
        }
      }
    }

    // 3. 提取开始日期 - 支持多种日期格式
    const startDatePatterns = [
      /开始日期(?:是|为|：|:)?\s*(\d{4})年(\d{1,2})月(\d{1,2})日/,
      /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日号]?(?:开始|出发)/,
      /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日号]?[，,到至～~]/
    ]
    
    for (const pattern of startDatePatterns) {
      const startMatch = text.match(pattern)
      if (startMatch) {
        const year = startMatch[1]
        const month = startMatch[2].padStart(2, '0')
        const day = startMatch[3].padStart(2, '0')
        const startDate = `${year}-${month}-${day}`
        setFormData(prev => ({ ...prev, startDate }))
        fieldsRecognized.push('开始日期')
        console.log('识别到开始日期:', startDate)
        break
      }
    }

    // 4. 提取结束日期
    const endDatePatterns = [
      /结束日期(?:是|为|：|:)?\s*(\d{4})年(\d{1,2})月(\d{1,2})日/,
      /[到至～~](?:|结束于)?\s*(\d{4})年(\d{1,2})月(\d{1,2})日/,
      /(\d{4})[年\-\/](\d{1,2})[月\-\/](\d{1,2})[日号]?(?:结束|返回)/
    ]
    
    for (const pattern of endDatePatterns) {
      const endMatch = text.match(pattern)
      if (endMatch) {
        const year = endMatch[1]
        const month = endMatch[2].padStart(2, '0')
        const day = endMatch[3].padStart(2, '0')
        const endDate = `${year}-${month}-${day}`
        setFormData(prev => ({ ...prev, endDate }))
        fieldsRecognized.push('结束日期')
        console.log('识别到结束日期:', endDate)
        break
      }
    }

    // 如果没有明确日期,尝试提取天数
    if (fieldsRecognized.indexOf('开始日期') === -1 || fieldsRecognized.indexOf('结束日期') === -1) {
      const daysMatch = text.match(/(\d+)\s*天/)
      if (daysMatch) {
        const days = parseInt(daysMatch[1])
        const today = new Date()
        const endDate = new Date(today)
        endDate.setDate(today.getDate() + days)
        setFormData(prev => ({
          ...prev,
          startDate: today.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }))
        fieldsRecognized.push('旅行天数')
        console.log('识别到天数:', days)
      }
    }

    // 5. 提取同行人数
    const travelersPatterns = [
      /(?:同行|一共|共|总共)?\s*(\d+)\s*(?:人|个人)/,
      /人数(?:是|为|：|:)?\s*(\d+)/
    ]
    
    for (const pattern of travelersPatterns) {
      const travelersMatch = text.match(pattern)
      if (travelersMatch) {
        const travelers = travelersMatch[1]
        setFormData(prev => ({ ...prev, travelers }))
        fieldsRecognized.push('同行人数')
        console.log('识别到人数:', travelers)
        break
      }
    }

    // 6. 提取旅行偏好
    const preferences: string[] = []
    const preferenceMap = {
      '美食': ['美食', '吃货', '品尝', '特色菜', '小吃'],
      '文化': ['文化', '历史', '古迹', '博物馆', '人文'],
      '自然': ['自然', '风景', '山水', '海滩', '户外'],
      '购物': ['购物', '商场', '买买买', '扫货'],
      '休闲': ['休闲', '放松', '度假', '慢节奏'],
      '冒险': ['冒险', '刺激', '极限', '挑战'],
      '动漫': ['动漫', '二次元', 'ACG']
    }
    
    for (const [key, keywords] of Object.entries(preferenceMap)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        preferences.push(key)
      }
    }
    
    if (preferences.length > 0) {
      setFormData(prev => ({ ...prev, preferences }))
      fieldsRecognized.push('旅行偏好')
      console.log('识别到偏好:', preferences)
    }

    // 显示识别结果
    if (fieldsRecognized.length > 0) {
      toast.success(`✅ 已识别: ${fieldsRecognized.join('、')}`)
    } else {
      toast('未能识别到有效信息，请检查语音输入', { icon: '⚠️' })
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error('请填写完整信息')
      return
    }

    setGenerating(true)
    
    // 显示加载提示
    const loadingToast = toast.loading('🤖 AI 正在生成旅行计划，预计 10-20 秒...')

    try {
      const days = Math.ceil(
        (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)
      )

      // 调用 API 生成行程
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          days,
          budget: parseFloat(formData.budget),
          travelers: parseInt(formData.travelers),
          preferences: formData.preferences,
          additionalInfo: voiceInput,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.dismiss(loadingToast)
        throw new Error(error.error || '生成行程失败')
      }

      const { itinerary } = await response.json()
      toast.dismiss(loadingToast)

      // Save trip to database
      if (isDemo) {
        const tripData = await demoDb.trips.create({
          user_id: user.id,
          title: `${formData.destination} ${days}日游`,
          destination: formData.destination,
          start_date: formData.startDate,
          end_date: formData.endDate,
          budget: parseFloat(formData.budget),
          travelers: parseInt(formData.travelers),
          preferences: formData.preferences,
          itinerary,
          status: 'planning',
        })

        toast.success('行程生成成功！（演示模式）')
        router.push(`/trip/${tripData.id}`)
      } else {
        const { data: tripData, error } = await supabase
          .from('trips')
          .insert({
            user_id: user.id,
            title: `${formData.destination} ${days}日游`,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate,
            budget: parseFloat(formData.budget),
            travelers: parseInt(formData.travelers),
            preferences: formData.preferences,
            itinerary,
            status: 'planning',
          })
          .select()
          .single()

        if (error) throw error

        toast.success('行程生成成功！')
        router.push(`/trip/${tripData.id}`)
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || '生成行程失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref],
    }))
  }

  const preferences = ['美食', '文化', '自然', '购物', '休闲', '冒险', '动漫', '亲子']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">创建旅行计划</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Voice Input Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎤 语音输入（推荐）
            </h2>
            <p className="text-gray-600 mb-4">
              说出您的旅行需求，例如："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"
            </p>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isRecording ? '停止录音' : '开始录音'}</span>
              </button>
              {isRecording && (
                <span className="text-red-500 font-semibold animate-pulse">
                  正在录音...
                </span>
              )}
            </div>
            {voiceInput && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-500 mb-1">识别结果：</p>
                <p className="text-gray-900">{voiceInput}</p>
              </div>
            )}
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目的地 *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="例如：日本东京"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预算（元）*
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期 *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  结束日期 *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  同行人数
                </label>
                <input
                  type="number"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                旅行偏好
              </label>
              <div className="flex flex-wrap gap-2">
                {preferences.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.preferences.includes(pref)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>AI 正在生成行程...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>生成旅行计划</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
