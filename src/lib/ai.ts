import OpenAI from 'openai'

// 检查是否配置了 API Key
function hasOpenAIKey(): boolean {
  const key = process.env.OPENAI_API_KEY || ''
  return key.length > 0 && !key.includes('your-') && key.startsWith('sk-')
}

function hasDashScopeKey(): boolean {
  const key = process.env.DASHSCOPE_API_KEY || ''
  const isValid = key.length > 20 && key.startsWith('sk-') && !key.includes('your-')
  console.log('DashScope Key check:', {
    exists: !!key,
    length: key.length,
    startsWithSk: key.startsWith('sk-'),
    includesYour: key.includes('your-'),
    isValid,
    preview: key.substring(0, 15) + '...'
  })
  return isValid
}

function hasApiKey(): boolean {
  return hasOpenAIKey() || hasDashScopeKey()
}

// 配置 OpenAI 或阿里云百炼
const openai = new OpenAI({
  apiKey: hasOpenAIKey() 
    ? process.env.OPENAI_API_KEY! 
    : (hasDashScopeKey() ? process.env.DASHSCOPE_API_KEY! : 'dummy-key'),
  baseURL: hasDashScopeKey() 
    ? 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'),
})

export interface TripRequest {
  destination: string
  days: number
  budget: number
  travelers: number
  preferences: string[]
  additionalInfo?: string
}

export interface Itinerary {
  overview: string
  days: DayPlan[]
  accommodation: AccommodationSuggestion[]
  transportation: TransportationInfo
  estimatedCosts: CostBreakdown
}

export interface DayPlan {
  day: number
  date: string
  activities: Activity[]
  meals: MealSuggestion[]
}

export interface Activity {
  time: string
  name: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  duration: string
  cost: number
}

export interface MealSuggestion {
  type: 'breakfast' | 'lunch' | 'dinner'
  restaurant: string
  cuisine: string
  location: string
  estimatedCost: number
  time?: string
  specialties?: string[]
  description?: string
}

export interface AccommodationSuggestion {
  name: string
  type: string
  location: string
  pricePerNight: number
  amenities: string[]
  totalNights?: number
  totalCost?: number
  rating?: number
  description?: string
}

export interface TransportationInfo {
  arrival: {
    method: string
    details: string
    estimatedCost?: number
  }
  departure: {
    method: string
    details: string
    estimatedCost?: number
  }
  localTransport: Array<{
    type: string
    description: string
    dailyCost?: number
    estimatedCost?: number
  }>
}

export interface CostBreakdown {
  accommodation: number
  transportation: number
  meals: number
  activities: number
  miscellaneous: number
  total: number
  breakdown?: string
}

export async function generateItinerary(request: TripRequest): Promise<Itinerary> {
  // 如果没有配置 API Key，使用模拟数据
  if (!hasApiKey()) {
    console.log('使用模拟数据生成行程（未配置 API Key）')
    return generateMockItinerary(request)
  }

  const prompt = `你是专业的旅行规划师。请为以下旅行需求生成详细完整的旅行计划：

【旅行需求】
目的地：${request.destination}
旅行天数：${request.days} 天
总预算：${request.budget} 元
同行人数：${request.travelers} 人
旅行偏好：${request.preferences.join('、') || '无特殊偏好'}
${request.additionalInfo ? `补充信息：${request.additionalInfo}` : ''}

【输出要求】
请生成包含以下完整信息的旅行计划，以 JSON 格式返回：

1. **行程概述** (overview)：简要介绍这次旅行的亮点和特色

2. **每日详细安排** (days)：
   - 上午活动（09:00-12:00）：景点名称、详细描述、具体地址、停留时长、门票费用
   - 午餐推荐：餐厅名称、菜系特色、人均消费、具体位置
   - 下午活动（14:00-18:00）：景点名称、详细描述、具体地址、停留时长、门票费用
   - 晚餐推荐：餐厅名称、菜系特色、人均消费、具体位置
   - 晚间活动（19:00-21:00）：夜游景点或娱乐活动

3. **住宿方案** (accommodation)：
   - 推荐3个不同档次的酒店（经济型/舒适型/豪华型）
   - 包含酒店名称、类型、位置、每晚价格、设施（WiFi/早餐/停车等）

4. **交通安排** (transportation)：
   - 如何到达${request.destination}（飞机/高铁/自驾）
   - 市内交通方式（地铁/公交/出租车/租车）
   - 景点间交通建议
   - 返程交通

5. **详细费用预算** (estimatedCosts)：
   - 住宿费用明细（${request.days}晚 × 每晚价格）
   - 往返交通费用
   - 餐饮费用（早中晚餐 × ${request.days}天 × ${request.travelers}人）
   - 景点门票费用总计
   - 市内交通费用
   - 购物/娱乐预留金
   - 总计

请确保：
✓ 所有景点、餐厅都是${request.destination}的真实地点
✓ 时间安排合理，考虑交通时间和休息
✓ 费用估算准确，符合${request.budget}元预算
✓ 考虑${request.preferences.join('、')}等偏好
✓ 适合${request.travelers}人同行
✓ 包含早中晚三餐的详细推荐
✓ 提供具体地址和坐标

JSON 格式示例：
{
  "overview": "这是一次充满文化与美食的${request.destination} ${request.days}日游...",
  "days": [
    {
      "day": 1,
      "date": "2025-01-01",
      "theme": "历史文化探索",
      "activities": [
        {
          "time": "09:00",
          "name": "具体景点名称",
          "description": "详细介绍景点特色、历史、看点等",
          "location": "完整地址（区+街道+门牌号）",
          "coordinates": {"lat": 32.0665, "lng": 118.8481},
          "duration": "2.5小时",
          "cost": 50,
          "tips": "游玩建议和注意事项"
        }
      ],
      "meals": [
        {
          "type": "breakfast",
          "time": "08:00",
          "restaurant": "餐厅全称",
          "cuisine": "菜系类型",
          "location": "具体地址",
          "specialties": ["招牌菜1", "招牌菜2"],
          "estimatedCost": 40,
          "description": "餐厅特色介绍"
        },
        {
          "type": "lunch",
          "time": "12:30",
          "restaurant": "餐厅全称",
          "cuisine": "菜系类型",
          "location": "具体地址",
          "specialties": ["招牌菜1", "招牌菜2"],
          "estimatedCost": 100,
          "description": "餐厅特色介绍"
        },
        {
          "type": "dinner",
          "time": "18:30",
          "restaurant": "餐厅全称",
          "cuisine": "菜系类型",
          "location": "具体地址",
          "specialties": ["招牌菜1", "招牌菜2"],
          "estimatedCost": 150,
          "description": "餐厅特色介绍"
        }
      ]
    }
  ],
  "accommodation": [
    {
      "name": "酒店全称",
      "type": "四星级酒店",
      "location": "具体地址",
      "pricePerNight": 500,
      "totalNights": ${request.days - 1},
      "totalCost": ${(request.days - 1) * 500},
      "amenities": ["免费WiFi", "含早餐", "健身房", "免费停车"],
      "rating": 4.5,
      "description": "酒店特色介绍"
    }
  ],
  "transportation": {
    "arrival": {
      "method": "高铁",
      "details": "从出发地到${request.destination}，约2小时",
      "estimatedCost": 300
    },
    "departure": {
      "method": "高铁",
      "details": "从${request.destination}返回，约2小时",
      "estimatedCost": 300
    },
    "localTransport": [
      {
        "type": "地铁",
        "description": "市内主要景点都有地铁直达",
        "dailyCost": 20
      },
      {
        "type": "出租车",
        "description": "偏远景点或夜间使用",
        "estimatedCost": 100
      }
    ]
  },
  "estimatedCosts": {
    "accommodation": ${(request.days - 1) * 500},
    "transportation": 800,
    "meals": ${request.days * 300 * request.travelers},
    "activities": 500,
    "shopping": 500,
    "miscellaneous": 400,
    "total": ${request.budget},
    "breakdown": "详细费用说明..."
  },
  "tips": [
    "最佳旅游季节建议",
    "当地天气注意事项",
    "必带物品清单",
    "安全和健康提示"
  ]
}`

  try {
    // 选择合适的模型 - 使用更快的 qwen-turbo
    const model = hasDashScopeKey() 
      ? 'qwen-turbo'  // 阿里云百炼的快速模型(免费)
      : 'gpt-3.5-turbo'  // OpenAI 快速模型
    
    console.log(`🤖 使用 ${model} 生成行程，预计 5-15 秒...`)
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是专业的旅行规划师,擅长制定详细完整的旅行计划。请生成包含交通、住宿、景点、餐厅等所有必要信息的完整行程,以 JSON 格式返回。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,  // 增加限制以支持详细内容
      // 注意：阿里云百炼可能不支持 response_format，所以加个条件判断
      ...(hasOpenAIKey() && { response_format: { type: 'json_object' } }),
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No response from AI')
    }

    console.log('AI response length:', content.length)
    
    // 尝试提取 JSON（如果 AI 返回了额外文本）
    let jsonContent = content.trim()
    
    // 如果包含 markdown 代码块,提取出来
    if (jsonContent.includes('```json')) {
      const match = jsonContent.match(/```json\s*([\s\S]*?)\s*```/)
      if (match) {
        jsonContent = match[1].trim()
      }
    } else if (jsonContent.includes('```')) {
      const match = jsonContent.match(/```\s*([\s\S]*?)\s*```/)
      if (match) {
        jsonContent = match[1].trim()
      }
    }
    
    // 找到第一个 { 和最后一个 }
    const firstBrace = jsonContent.indexOf('{')
    const lastBrace = jsonContent.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)
    }

    let itinerary: Itinerary
    try {
      itinerary = JSON.parse(jsonContent) as Itinerary
    } catch (parseError: any) {
      console.error('JSON parse failed, trying to fix common issues...')
      console.error('Parse error:', parseError.message)
      
      // 尝试修复常见的JSON问题
      let fixedJson = jsonContent
        // 修复尾部逗号
        .replace(/,(\s*[}\]])/g, '$1')
        // 修复单引号
        .replace(/'/g, '"')
        // 修复未转义的换行符
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '')
      
      try {
        itinerary = JSON.parse(fixedJson) as Itinerary
        console.log('✅ JSON修复成功')
      } catch (fixError) {
        console.error('❌ JSON修复失败,使用模拟数据')
        return generateMockItinerary(request)
      }
    }

    return itinerary
  } catch (error: any) {
    console.error('Error generating itinerary:', error)
    console.error('Error details:', error.message, error.code, error.status)
    
    // 如果是 API Key 错误,提供更明确的错误信息
    if (error.status === 401 || error.code === 'invalid_api_key') {
      console.log('❌ API Key 认证失败,自动回退到模拟数据')
      return generateMockItinerary(request)
    }
    
    // 其他错误也回退到模拟数据
    console.log('⚠️ API 调用失败,使用模拟数据')
    return generateMockItinerary(request)
  }
}

export async function analyzeBudget(expenses: Array<{ category: string; amount: number }>, totalBudget: number) {
  const prompt = `请分析以下旅行开销，并提供预算建议：

总预算：${totalBudget} 元
已花费：${expenses.map(e => `${e.category}: ${e.amount}元`).join(', ')}

请提供：
1. 预算使用分析
2. 各类别开销占比
3. 剩余预算建议
4. 省钱建议

以 JSON 格式返回：
{
  "analysis": "总体分析",
  "categoryBreakdown": [{"category": "类别", "amount": 100, "percentage": 10}],
  "remaining": 5000,
  "suggestions": ["建议1", "建议2"]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的旅行预算顾问，能够分析开销并提供实用的预算建议。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No response from AI')
    }

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing budget:', error)
    throw new Error('Failed to analyze budget')
  }
}

// 真实景点数据库
const ATTRACTIONS: Record<string, Array<{name: string, desc: string, location: string, cost: number, duration: string, coords: {lat: number, lng: number}}>> = {
  '南京': [
    { name: '中山陵', desc: '参观孙中山先生陵寝,感受民国历史', location: '玄武区石象路7号', cost: 0, duration: '2.5小时', coords: {lat: 32.0665, lng: 118.8481} },
    { name: '夫子庙', desc: '游览秦淮河畔古建筑群,品尝秦淮小吃', location: '秦淮区贡院街152号', cost: 40, duration: '3小时', coords: {lat: 32.0245, lng: 118.7946} },
    { name: '玄武湖', desc: '漫步江南皇家园林,欣赏湖光山色', location: '玄武区玄武巷1号', cost: 0, duration: '2小时', coords: {lat: 32.0743, lng: 118.7936} },
    { name: '总统府', desc: '探访民国时期总统府,了解近代史', location: '玄武区长江路292号', cost: 40, duration: '2小时', coords: {lat: 32.0467, lng: 118.7965} },
    { name: '侵华日军南京大屠杀遇难同胞纪念馆', desc: '铭记历史,缅怀同胞', location: '建邺区水西门大街418号', cost: 0, duration: '1.5小时', coords: {lat: 32.0347, lng: 118.7472} },
    { name: '鸡鸣寺', desc: '登古寺赏樱花,俯瞰玄武湖', location: '玄武区鸡鸣寺路1号', cost: 10, duration: '1.5小时', coords: {lat: 32.0694, lng: 118.7900} },
    { name: '秦淮河画舫', desc: '夜游秦淮河,欣赏两岸夜景', location: '秦淮区夫子庙码头', cost: 80, duration: '1小时', coords: {lat: 32.0237, lng: 118.7960} },
  ],
  '武汉': [
    { name: '黄鹤楼', desc: '登临江南三大名楼之首,俯瞰长江美景', location: '武昌区蛇山西坡特1号', cost: 70, duration: '2小时', coords: {lat: 30.5451, lng: 114.2973} },
    { name: '东湖', desc: '中国最大的城中湖,骑行环湖绿道', location: '武昌区沿湖大道16号', cost: 0, duration: '3小时', coords: {lat: 30.5511, lng: 114.3756} },
    { name: '户部巷', desc: '武汉著名美食街,品尝热干面等小吃', location: '武昌区户部巷', cost: 0, duration: '2小时', coords: {lat: 30.5510, lng: 114.2892} },
    { name: '武汉长江大桥', desc: '新中国第一座长江大桥,历史地标', location: '武昌区临江大道19号', cost: 0, duration: '1小时', coords: {lat: 30.5506, lng: 114.2832} },
    { name: '湖北省博物馆', desc: '参观编钟等国宝级文物', location: '武昌区东湖路160号', cost: 0, duration: '2.5小时', coords: {lat: 30.5563, lng: 114.3733} },
    { name: '汉口江滩', desc: '漫步长江边,欣赏江景夜景', location: '江岸区沿江大道', cost: 0, duration: '1.5小时', coords: {lat: 30.5973, lng: 114.2779} },
    { name: '武汉大学', desc: '参观百年名校,春季赏樱花胜地', location: '武昌区珞珈山路16号', cost: 0, duration: '2小时', coords: {lat: 30.5333, lng: 114.3667} },
  ],
  '北京': [
    { name: '故宫', desc: '探访皇家宫殿,感受紫禁城威严', location: '东城区景山前街4号', cost: 60, duration: '4小时', coords: {lat: 39.9167, lng: 116.3972} },
    { name: '长城', desc: '登八达岭长城,领略长城雄伟', location: '延庆区八达岭', cost: 40, duration: '5小时', coords: {lat: 40.3593, lng: 116.0087} },
    { name: '颐和园', desc: '游览皇家园林,欣赏昆明湖', location: '海淀区新建宫门路19号', cost: 30, duration: '3小时', coords: {lat: 39.9998, lng: 116.2755} },
    { name: '天安门广场', desc: '参观世界最大城市广场', location: '东城区东长安街', cost: 0, duration: '1.5小时', coords: {lat: 39.9055, lng: 116.3976} },
    { name: '天坛', desc: '明清皇帝祭天之所', location: '东城区天坛东里甲1号', cost: 15, duration: '2小时', coords: {lat: 39.8826, lng: 116.4068} },
  ],
  '上海': [
    { name: '外滩', desc: '漫步万国建筑博览群,欣赏浦江夜景', location: '黄浦区中山东一路', cost: 0, duration: '2小时', coords: {lat: 31.2397, lng: 121.4903} },
    { name: '东方明珠', desc: '登塔俯瞰上海全景', location: '浦东新区世纪大道1号', cost: 180, duration: '2小时', coords: {lat: 31.2397, lng: 121.4999} },
    { name: '城隍庙', desc: '品尝上海小吃,体验老城厢风情', location: '黄浦区方浜中路249号', cost: 10, duration: '2.5小时', coords: {lat: 31.2269, lng: 121.4932} },
    { name: '南京路步行街', desc: '中华商业第一街购物', location: '黄浦区南京东路', cost: 0, duration: '2小时', coords: {lat: 31.2354, lng: 121.4802} },
  ],
  '杭州': [
    { name: '西湖', desc: '游览西湖十景,体验人间天堂', location: '西湖区龙井路1号', cost: 0, duration: '4小时', coords: {lat: 30.2590, lng: 120.1319} },
    { name: '灵隐寺', desc: '参访江南名刹,祈福许愿', location: '西湖区灵隐路法云弄1号', cost: 45, duration: '2小时', coords: {lat: 30.2419, lng: 120.0972} },
    { name: '宋城', desc: '大型宋文化主题公园,观看千古情演出', location: '西湖区之江路148号', cost: 310, duration: '4小时', coords: {lat: 30.2103, lng: 120.0894} },
  ],
  '西安': [
    { name: '兵马俑', desc: '世界第八大奇迹,秦始皇陵兵马俑', location: '临潼区秦陵路', cost: 120, duration: '3小时', coords: {lat: 34.3848, lng: 109.2789} },
    { name: '大雁塔', desc: '唐代古塔,欣赏音乐喷泉', location: '雁塔区雁塔路', cost: 50, duration: '2小时', coords: {lat: 34.2203, lng: 108.9647} },
    { name: '回民街', desc: '品尝西安特色美食', location: '莲湖区北院门', cost: 0, duration: '2.5小时', coords: {lat: 34.2640, lng: 108.9403} },
    { name: '西安城墙', desc: '骑行明代古城墙,俯瞰古城', location: '碑林区南门', cost: 54, duration: '2小时', coords: {lat: 34.2584, lng: 108.9456} },
  ],
  '成都': [
    { name: '大熊猫繁育研究基地', desc: '近距离观赏国宝大熊猫', location: '成华区熊猫大道1375号', cost: 55, duration: '3小时', coords: {lat: 30.7329, lng: 104.1502} },
    { name: '宽窄巷子', desc: '体验成都老街文化,品茗休闲', location: '青羊区同仁路以东', cost: 0, duration: '2小时', coords: {lat: 30.6733, lng: 104.0553} },
    { name: '锦里', desc: '三国文化主题商业街', location: '武侯区武侯祠大街231号', cost: 0, duration: '2小时', coords: {lat: 30.6458, lng: 104.0491} },
    { name: '武侯祠', desc: '三国遗迹博物馆', location: '武侯区武侯祠大街231号', cost: 50, duration: '2小时', coords: {lat: 30.6440, lng: 104.0490} },
  ],
}

const RESTAURANTS: Record<string, Array<{name: string, cuisine: string, location: string, specialties: string[], avgCost: number, description: string}>> = {
  '南京': [
    { name: '南京大牌档', cuisine: '南京本帮菜', location: '新街口德基广场6楼', specialties: ['金陵盐水鸭', '桂花糖芋苗', '美龄粥', '鸭血粉丝汤'], avgCost: 80, description: '地道南京特色菜,环境古色古香' },
    { name: '鸭德堡', cuisine: '盐水鸭专门店', location: '夫子庙贡院街45号', specialties: ['招牌盐水鸭', '烤鸭', '鸭胗'], avgCost: 60, description: '南京老字号,鸭肉鲜嫩入味' },
    { name: '老南京小吃', cuisine: '秦淮小吃', location: '夫子庙美食街', specialties: ['鸭血粉丝汤', '小笼包', '锅贴', '糖芋苗'], avgCost: 40, description: '汇集南京各类传统小吃' },
    { name: '绿柳居素菜馆', cuisine: '素菜', location: '太平南路248号', specialties: ['素鸡', '素鸭', '罗汉斋'], avgCost: 70, description: '百年素菜老店,菜品精致' },
    { name: '狮子楼', cuisine: '淮扬菜', location: '湖南路狮子桥美食街', specialties: ['狮子头', '蟹黄汤包', '水晶肴蹄'], avgCost: 100, description: '传统淮扬风味,口味清淡鲜美' },
    { name: '金陵饭店旋转餐厅', cuisine: '中西自助', location: '汉中路2号36楼', specialties: ['自助餐', '海鲜', '甜品'], avgCost: 200, description: '可360度观赏南京全景' },
  ],
  '武汉': [
    { name: '蔡林记', cuisine: '武汉小吃', location: '户部巷', specialties: ['热干面', '豆皮', '糊汤粉'], avgCost: 30, description: '武汉热干面老字号' },
    { name: '老通城', cuisine: '湖北菜', location: '江汉路步行街', specialties: ['三鲜豆皮', '排骨藕汤', '鱼糊粉'], avgCost: 50, description: '百年老店,地道武汉味道' },
    { name: '靓靓蒸虾', cuisine: '湖北菜', location: '粮道街', specialties: ['油焖大虾', '蒸虾', '藕带'], avgCost: 100, description: '武汉特色小龙虾' },
    { name: '四季美汤包馆', cuisine: '小吃', location: '汉口中山大道', specialties: ['汤包', '糊汤粉'], avgCost: 35, description: '武汉四大名小吃之一' },
  ],
  '北京': [
    { name: '全聚德', cuisine: '北京烤鸭', location: '前门大街30号', specialties: ['挂炉烤鸭', '鸭架汤'], avgCost: 150, description: '百年烤鸭老字号' },
    { name: '老北京炸酱面', cuisine: '老北京小吃', location: '簋街', specialties: ['炸酱面', '卤煮', '豆汁儿'], avgCost: 50, description: '地道北京风味' },
    { name: '东来顺', cuisine: '涮羊肉', location: '王府井大街', specialties: ['涮羊肉', '手切羊肉'], avgCost: 120, description: '百年涮肉老店' },
  ],
  '上海': [
    { name: '小杨生煎', cuisine: '生煎包', location: '城隍庙', specialties: ['鲜肉生煎', '虾仁生煎'], avgCost: 30, description: '上海特色小吃' },
    { name: '南翔馒头店', cuisine: '小笼包', location: '城隍庙', specialties: ['蟹粉小笼', '鲜肉小笼'], avgCost: 40, description: '百年小笼包老店' },
    { name: '老正兴', cuisine: '本帮菜', location: '福州路', specialties: ['红烧肉', '糖醋小排', '油爆虾'], avgCost: 120, description: '上海本帮菜代表' },
  ],
  '杭州': [
    { name: '楼外楼', cuisine: '杭帮菜', location: '孤山路30号', specialties: ['西湖醋鱼', '东坡肉', '龙井虾仁'], avgCost: 150, description: '西湖边百年名店' },
    { name: '知味观', cuisine: '杭州小吃', location: '湖滨路', specialties: ['猫耳朵', '小笼包', '片儿川'], avgCost: 60, description: '杭州老字号小吃店' },
  ],
  '西安': [
    { name: '老孙家泡馍', cuisine: '陕西菜', location: '东大街', specialties: ['牛羊肉泡馍', '肉夹馍'], avgCost: 40, description: '西安泡馍老字号' },
    { name: '德发长饺子馆', cuisine: '饺子', location: '钟楼', specialties: ['饺子宴', '各式饺子'], avgCost: 80, description: '西安饺子名店' },
    { name: '回民街小吃', cuisine: '清真小吃', location: '回民街', specialties: ['肉夹馍', '凉皮', '羊肉串'], avgCost: 35, description: '汇集西安特色小吃' },
  ],
  '成都': [
    { name: '陈麻婆豆腐', cuisine: '川菜', location: '西玉龙街', specialties: ['麻婆豆腐', '回锅肉'], avgCost: 70, description: '川菜老字号,麻婆豆腐发源地' },
    { name: '龙抄手', cuisine: '成都小吃', location: '春熙路', specialties: ['龙抄手', '钟水饺', '担担面'], avgCost: 40, description: '成都著名小吃店' },
    { name: '小龙翻大江火锅', cuisine: '火锅', location: '科华北路', specialties: ['九宫格火锅', '毛肚', '鸭肠'], avgCost: 100, description: '成都火锅代表' },
  ],
}

// 改进的模拟数据生成函数
function generateMockItinerary(request: TripRequest): Itinerary {
  const { destination, days, budget, travelers, preferences } = request
  
  const attractions = ATTRACTIONS[destination] || []
  const restaurants = RESTAURANTS[destination] || []
  const today = new Date()
  
  const dayPlans: DayPlan[] = []
  
  // 生成每日计划
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // 为每天选择不同的景点
    const dayAttractions = attractions.length > 0 
      ? [
          attractions[i % attractions.length],
          attractions.length > 1 ? attractions[(i + 1) % attractions.length] : attractions[0],
          attractions.length > 2 ? attractions[(i + 2) % attractions.length] : attractions[0],
        ]
      : [
          { name: `${destination}景点${i+1}-上午`, desc: `探索${destination}`, location: destination, cost: 50, duration: '2小时', coords: {lat: 0, lng: 0} },
          { name: `${destination}景点${i+1}-下午`, desc: `继续游览${destination}`, location: destination, cost: 30, duration: '2小时', coords: {lat: 0, lng: 0} },
          { name: `${destination}景点${i+1}-晚上`, desc: `夜游${destination}`, location: destination, cost: 20, duration: '1.5小时', coords: {lat: 0, lng: 0} },
        ]
    
    const dayRestaurants = restaurants.length > 0 
      ? [
          restaurants[i % restaurants.length],
          restaurants.length > 1 ? restaurants[(i + 1) % restaurants.length] : restaurants[0],
          restaurants.length > 2 ? restaurants[(i + 2) % restaurants.length] : restaurants[0],
        ]
      : [
          { name: `${destination}早餐店`, cuisine: '本地早餐', location: destination },
          { name: `${destination}餐厅`, cuisine: '本地菜', location: destination },
          { name: `${destination}美食街`, cuisine: '特色小吃', location: destination },
        ]
    
    dayPlans.push({
      day: i + 1,
      date: date.toISOString().split('T')[0],
      activities: [
        {
          time: '09:00',
          name: dayAttractions[0].name,
          description: dayAttractions[0].desc,
          location: dayAttractions[0].location,
          coordinates: dayAttractions[0].coords,
          duration: dayAttractions[0].duration,
          cost: dayAttractions[0].cost * travelers,
        },
        {
          time: '14:00',
          name: dayAttractions[1].name,
          description: dayAttractions[1].desc,
          location: dayAttractions[1].location,
          coordinates: dayAttractions[1].coords,
          duration: dayAttractions[1].duration,
          cost: dayAttractions[1].cost * travelers,
        },
        {
          time: '18:00',
          name: dayAttractions[2].name,
          description: dayAttractions[2].desc,
          location: dayAttractions[2].location,
          coordinates: dayAttractions[2].coords,
          duration: dayAttractions[2].duration,
          cost: dayAttractions[2].cost * travelers,
        },
      ],
      meals: [
        {
          type: 'breakfast',
          time: '08:00',
          restaurant: dayRestaurants[0].name,
          cuisine: dayRestaurants[0].cuisine,
          location: dayRestaurants[0].location,
          specialties: (dayRestaurants[0] as any).specialties ?? [],
          estimatedCost: ((dayRestaurants[0] as any).avgCost ?? 0) * travelers,
          description: (dayRestaurants[0] as any).description ?? ''
        },
        {
          type: 'lunch',
          time: '12:30',
          restaurant: dayRestaurants[1].name,
          cuisine: dayRestaurants[1].cuisine,
          location: dayRestaurants[1].location,
          specialties: (dayRestaurants[1] as any).specialties ?? [],
          estimatedCost: ((dayRestaurants[1] as any).avgCost ?? 0) * travelers,
          description: (dayRestaurants[1] as any).description ?? ''
        },
        {
          type: 'dinner',
          time: '18:30',
          restaurant: dayRestaurants[2].name,
          cuisine: dayRestaurants[2].cuisine,
          location: dayRestaurants[2].location,
          specialties: (dayRestaurants[2] as any).specialties ?? [],
          estimatedCost: ((dayRestaurants[2] as any).avgCost ?? 0) * travelers,
          description: (dayRestaurants[2] as any).description ?? ''
        },
      ],
    })
  }
  
  // 计算费用
  const pricePerNight = Math.round(budget * 0.3 / (days - 1))
  const accommodationCost = pricePerNight * (days - 1)
  const transportationCost = Math.round(budget * 0.2)
  const mealsCost = Math.round(budget * 0.3)
  const activitiesCost = Math.round(budget * 0.15)
  const miscellaneousCost = budget - accommodationCost - transportationCost - mealsCost - activitiesCost
  
  return {
    overview: `🌟 这是一个精心设计的${destination} ${days}天${days-1}晚深度游。行程涵盖${destination}最具代表性的景点、地道美食和特色体验，${preferences.length > 0 ? `特别安排了${preferences.join('、')}等主题活动，` : ''}适合${travelers}人同行。预算控制在${budget}元，包含交通、住宿、餐饮、门票等所有费用。行程节奏适中，既充实又不失悠闲，让您充分感受${destination}的独特魅力。`,
    days: dayPlans,
    accommodation: [
      {
        name: `${destination}市中心精品酒店`,
        type: budget > 8000 ? '四星级酒店' : budget > 5000 ? '舒适型酒店' : '经济型酒店',
        location: `${destination}市中心,靠近地铁站`,
        pricePerNight: pricePerNight,
        totalNights: days - 1,
        totalCost: accommodationCost,
        amenities: ['免费WiFi', '含早餐', '24小时热水', '空调', '电视', '独立卫浴'],
        rating: 4.2,
        description: `位于市中心交通便利区域,步行可达多个景点,周边餐饮购物齐全。酒店设施齐全,服务周到,性价比高。`
      },
      {
        name: `${destination}商务连锁酒店`,
        type: '经济型酒店',
        location: `${destination}交通枢纽附近`,
        pricePerNight: Math.round(pricePerNight * 0.7),
        totalNights: days - 1,
        totalCost: Math.round(accommodationCost * 0.7),
        amenities: ['免费WiFi', '24小时前台', '空调'],
        rating: 3.8,
        description: `经济实惠的选择,基础设施完善,位置优越。`
      },
    ],
    transportation: {
      arrival: {
        method: '高铁',
        details: `从主要城市乘高铁前往${destination},车程约2-3小时,舒适便捷。建议提前订票以获得更优惠的价格。`,
        estimatedCost: Math.round(transportationCost * 0.4)
      },
      departure: {
        method: '高铁',
        details: `返程同样建议乘坐高铁,预留充足时间前往车站,避免误车。`,
        estimatedCost: Math.round(transportationCost * 0.4)
      },
      localTransport: [
        {
          type: '地铁',
          description: `${destination}地铁网络发达,主要景点都有地铁直达,推荐购买日票或周票更划算。`,
          dailyCost: 15
        },
        {
          type: '公交车',
          description: '可使用移动支付,方便快捷,适合短途出行。',
          dailyCost: 10
        },
        {
          type: '出租车/网约车',
          description: '偏远景点或携带大件行李时使用,建议使用打车软件。',
          estimatedCost: Math.round(transportationCost * 0.2)
        },
      ]
    },
    estimatedCosts: {
      accommodation: accommodationCost,
      transportation: transportationCost,
      meals: mealsCost,
      activities: activitiesCost,
      miscellaneous: miscellaneousCost,
      total: budget,
      breakdown: `💰 详细费用说明：
      
📌 住宿费用：${accommodationCost}元
   - ${days-1}晚 × ${pricePerNight}元/晚 × ${travelers}间

📌 交通费用：${transportationCost}元
   - 往返大交通：${Math.round(transportationCost * 0.8)}元
   - 市内交通：${Math.round(transportationCost * 0.2)}元

📌 餐饮费用：${mealsCost}元
   - ${days}天 × 3餐 × 约${Math.round(mealsCost / days / 3)}元/人/餐 × ${travelers}人

📌 景点门票：${activitiesCost}元
   - 包含主要景点门票费用

📌 其他费用：${miscellaneousCost}元
   - 购物、小吃、应急备用金

💡 省钱建议：
   - 提前预订交通和住宿可节省20-30%
   - 选择套票或团购更优惠
   - 避开节假日高峰期
   - 使用移动支付享受更多优惠`
    },
    tips: [
      `🌤️ 最佳旅游季节：春秋两季天气宜人，建议携带雨具`,
      `📱 下载${destination}地铁APP，查询路线更方便`,
      `🎫 主要景点建议提前网上预约，避免现场排队`,
      `🏥 随身携带常用药品，记住酒店地址和联系方式`,
      `📸 ${destination}特色景点拍照打卡点：` + (attractions.length > 0 ? attractions.slice(0, 3).map(a => a.name).join('、') : '各大景点'),
      `🍜 必吃美食：` + (restaurants.length > 0 ? restaurants.slice(0, 3).map(r => r.specialties[0]).join('、') : '当地特色'),
      `💳 大部分地方支持移动支付，少量现金备用即可`,
      `👕 根据天气准备衣物，${days > 3 ? '建议带可洗快干的衣服' : '轻装出行'}`,
    ]
  }
}
