// 演示模式 - 使用本地存储模拟数据库
// 当 Supabase 未配置时自动启用

export const DEMO_MODE_KEY = 'ai-travel-planner-demo-mode'
export const DEMO_USER_KEY = 'ai-travel-planner-demo-user'
export const DEMO_TRIPS_KEY = 'ai-travel-planner-demo-trips'
export const DEMO_EXPENSES_KEY = 'ai-travel-planner-demo-expenses'

export interface DemoUser {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface DemoTrip {
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

export interface DemoExpense {
  id: string
  trip_id: string
  user_id: string
  category: string
  amount: number
  description: string
  date: string
  created_at: string
}

// 检查是否启用演示模式
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const isConfigured = supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co'
  
  return !isConfigured
}

// 生成 UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 演示模式认证
export const demoAuth = {
  // 注册
  async signUp(email: string, password: string, fullName: string) {
    const user: DemoUser = {
      id: generateId(),
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    }
    
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
    localStorage.setItem(DEMO_MODE_KEY, 'true')
    
    return { user, error: null }
  },

  // 登录
  async signIn(email: string, password: string) {
    const storedUser = localStorage.getItem(DEMO_USER_KEY)
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.email === email) {
        return { user, error: null }
      }
    }
    
    // 如果没有用户，创建演示用户
    const user: DemoUser = {
      id: 'demo-user-id',
      email,
      full_name: '演示用户',
      created_at: new Date().toISOString(),
    }
    
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user))
    localStorage.setItem(DEMO_MODE_KEY, 'true')
    
    return { user, error: null }
  },

  // 登出
  async signOut() {
    // 不清除数据，只是标记登出
    return { error: null }
  },

  // 获取当前用户
  async getUser() {
    const storedUser = localStorage.getItem(DEMO_USER_KEY)
    if (storedUser) {
      return { user: JSON.parse(storedUser), error: null }
    }
    return { user: null, error: null }
  },
}

// 演示模式数据库操作
export const demoDb = {
  // 行程相关
  trips: {
    async getAll(userId: string): Promise<DemoTrip[]> {
      const stored = localStorage.getItem(DEMO_TRIPS_KEY)
      if (!stored) return []
      
      const allTrips = JSON.parse(stored)
      return allTrips.filter((trip: DemoTrip) => trip.user_id === userId)
    },

    async getById(id: string): Promise<DemoTrip | null> {
      const stored = localStorage.getItem(DEMO_TRIPS_KEY)
      if (!stored) return null
      
      const allTrips = JSON.parse(stored)
      return allTrips.find((trip: DemoTrip) => trip.id === id) || null
    },

    async create(trip: Omit<DemoTrip, 'id' | 'created_at' | 'updated_at'>): Promise<DemoTrip> {
      const newTrip: DemoTrip = {
        ...trip,
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const stored = localStorage.getItem(DEMO_TRIPS_KEY)
      const allTrips = stored ? JSON.parse(stored) : []
      allTrips.push(newTrip)
      localStorage.setItem(DEMO_TRIPS_KEY, JSON.stringify(allTrips))

      return newTrip
    },

    async update(id: string, updates: Partial<DemoTrip>): Promise<DemoTrip | null> {
      const stored = localStorage.getItem(DEMO_TRIPS_KEY)
      if (!stored) return null

      const allTrips = JSON.parse(stored)
      const index = allTrips.findIndex((trip: DemoTrip) => trip.id === id)
      
      if (index === -1) return null

      allTrips[index] = {
        ...allTrips[index],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem(DEMO_TRIPS_KEY, JSON.stringify(allTrips))
      return allTrips[index]
    },

    async delete(id: string): Promise<boolean> {
      const stored = localStorage.getItem(DEMO_TRIPS_KEY)
      if (!stored) return false

      const allTrips = JSON.parse(stored)
      const filtered = allTrips.filter((trip: DemoTrip) => trip.id !== id)
      localStorage.setItem(DEMO_TRIPS_KEY, JSON.stringify(filtered))
      return true
    },
  },

  // 费用相关
  expenses: {
    async getByTrip(tripId: string): Promise<DemoExpense[]> {
      const stored = localStorage.getItem(DEMO_EXPENSES_KEY)
      if (!stored) return []
      
      const allExpenses = JSON.parse(stored)
      return allExpenses.filter((expense: DemoExpense) => expense.trip_id === tripId)
    },

    async create(expense: Omit<DemoExpense, 'id' | 'created_at'>): Promise<DemoExpense> {
      const newExpense: DemoExpense = {
        ...expense,
        id: generateId(),
        created_at: new Date().toISOString(),
      }

      const stored = localStorage.getItem(DEMO_EXPENSES_KEY)
      const allExpenses = stored ? JSON.parse(stored) : []
      allExpenses.push(newExpense)
      localStorage.setItem(DEMO_EXPENSES_KEY, JSON.stringify(allExpenses))

      return newExpense
    },

    async delete(id: string): Promise<boolean> {
      const stored = localStorage.getItem(DEMO_EXPENSES_KEY)
      if (!stored) return false

      const allExpenses = JSON.parse(stored)
      const filtered = allExpenses.filter((expense: DemoExpense) => expense.id !== id)
      localStorage.setItem(DEMO_EXPENSES_KEY, JSON.stringify(filtered))
      return true
    },
  },
}
