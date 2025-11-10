'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { isDemoMode, demoAuth, demoDb } from '@/lib/demo-mode'
import toast from 'react-hot-toast'
import { Plus, Mic, MicOff, TrendingUp } from 'lucide-react'
import { VoiceRecognition } from '@/lib/voice'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
  created_at: string
}

interface ExpenseTrackerProps {
  tripId: string
  budget: number
}

export default function ExpenseTracker({ tripId, budget }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null)
  const [formData, setFormData] = useState({
    category: '交通',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const categories = ['交通', '住宿', '餐饮', '景点', '购物', '其他']

  useEffect(() => {
    setVoiceRecognition(new VoiceRecognition())
    const demo = isDemoMode()
    setIsDemo(demo)
    loadExpenses(demo)
  }, [tripId])

  const loadExpenses = async (demo: boolean) => {
    try {
      if (demo) {
        const data = await demoDb.expenses.getByTrip(tripId)
        setExpenses(data as Expense[])
      } else {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('trip_id', tripId)
          .order('date', { ascending: false })

        if (error) throw error
        setExpenses(data || [])
      }
    } catch (error) {
      toast.error('加载费用记录失败')
    } finally {
      setLoading(false)
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
    } else {
      setIsRecording(true)
      voiceRecognition.start(
        (text) => {
          parseExpenseVoiceInput(text)
          setIsRecording(false)
        },
        (error) => {
          toast.error('语音识别失败')
          setIsRecording(false)
        }
      )
    }
  }

  const parseExpenseVoiceInput = (text: string) => {
    // Simple parsing - extract amount and category
    const amountMatch = text.match(/(\d+\.?\d*)\s*元/)
    if (amountMatch) {
      setFormData(prev => ({ ...prev, amount: amountMatch[1], description: text }))
    }

    // Try to identify category
    const lowerText = text.toLowerCase()
    for (const cat of categories) {
      if (lowerText.includes(cat)) {
        setFormData(prev => ({ ...prev, category: cat }))
        break
      }
    }

    setShowForm(true)
    toast.success('已识别语音输入！')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isDemo) {
        const { user } = await demoAuth.getUser()
        if (!user) throw new Error('Not authenticated')

        const data = await demoDb.expenses.create({
          trip_id: tripId,
          user_id: user.id,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
        })

        setExpenses([data as Expense, ...expenses])
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
          .from('expenses')
          .insert({
            trip_id: tripId,
            user_id: user.id,
            category: formData.category,
            amount: parseFloat(formData.amount),
            description: formData.description,
            date: formData.date,
          })
          .select()
          .single()

        if (error) throw error

        setExpenses([data, ...expenses])
      }

      setFormData({
        category: '交通',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      })
      setShowForm(false)
      toast.success('费用记录已添加')
    } catch (error: any) {
      toast.error(error.message || '添加失败')
    }
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const remaining = budget - totalSpent
  const spentPercentage = (totalSpent / budget) * 100

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">预算概览</h3>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              ¥{totalSpent.toLocaleString()} / ¥{budget.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">剩余预算</p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              spentPercentage > 100 ? 'bg-red-500' : spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{spentPercentage.toFixed(1)}% 已使用</p>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">📊 分类支出</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category}</span>
                  <span className="font-semibold">¥{amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(amount / totalSpent) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Expense Section */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">💰 记录开销</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleVoiceInput}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold ${
                isRecording ? 'bg-red-500 text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? '停止' : '语音'}</span>
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span>添加</span>
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">类别</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">金额（元）</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="简要描述"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              保存
            </button>
          </form>
        )}
      </div>

      {/* Expense List */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">📝 费用记录</h3>
        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">还没有费用记录</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    {expense.category} • {expense.date}
                  </p>
                </div>
                <p className="font-bold text-lg text-primary-600">
                  ¥{expense.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
