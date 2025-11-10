# AI Travel Planner - 智能旅行规划助手

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)

一个基于 AI 的智能旅行规划 Web 应用，通过语音或文字输入旅行需求，自动生成个性化的旅行路线、预算分析和费用管理。

## 🌟 核心功能

### 1. 智能行程规划
- **语音输入**: 支持使用语音描述旅行需求（例如："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"）
- **AI 生成**: 自动生成详细的旅行路线，包括：
  - 每日行程安排
  - 交通方式推荐
  - 住宿建议
  - 景点介绍和时间安排
  - 餐厅推荐
  - 详细费用预估

### 2. 地图可视化
- 基于高德地图展示行程路线
- 景点标记和详细信息
- 路线规划和导航
- 交互式地图操作

### 3. 费用预算与管理
- AI 智能预算分析
- 实时费用追踪
- 语音记账功能
- 分类支出统计
- 预算警告提醒

### 4. 用户管理与云端同步
- 完整的注册登录系统
- 多设备实时同步
- 保存和管理多份旅行计划
- 云端数据存储

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: Lucide React Icons
- **状态管理**: Zustand
- **通知**: React Hot Toast

### 后端
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **实时同步**: Supabase Realtime

### AI 服务
- **大语言模型**: OpenAI GPT-4 / 阿里云百炼平台
- **语音识别**: Web Speech API / 科大讯飞
- **地图服务**: 高德地图 API

### 部署
- **容器化**: Docker
- **CI/CD**: GitHub Actions
- **镜像仓库**: 阿里云容器镜像服务

## 📦 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (可选，用于容器化部署)

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写相关配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI 模型配置（二选一）
# 选项 1: OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1

# 选项 2: 阿里云百炼平台
# DASHSCOPE_API_KEY=your_dashscope_api_key

# 高德地图 API
NEXT_PUBLIC_AMAP_KEY=your_amap_api_key

# 科大讯飞语音识别（可选）
IFLYTEK_APP_ID=your_iflytek_app_id
IFLYTEK_API_KEY=your_iflytek_api_key
IFLYTEK_API_SECRET=your_iflytek_api_secret

# 应用 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 设置 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL Editor 中执行 `supabase/schema.sql` 文件中的 SQL 语句
3. 复制项目的 URL 和 anon key 到 `.env` 文件

### 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🐳 Docker 部署

### 使用 Docker Compose（推荐）

1. 确保已安装 Docker 和 Docker Compose

2. 创建 `.env` 文件并配置环境变量

3. 构建并启动容器：

```bash
docker-compose up -d
```

4. 访问 [http://localhost:3000](http://localhost:3000)

5. 停止服务：

```bash
docker-compose down
```

### 使用 Docker 直接运行

1. 构建镜像：

```bash
docker build -t ai-travel-planner .
```

2. 运行容器：

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  -e NEXT_PUBLIC_AMAP_KEY=your_key \
  ai-travel-planner
```

### 从阿里云镜像仓库拉取

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 运行容器（需要创建 .env 文件）
docker run -p 3000:3000 --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

## 🔑 API 密钥获取指南

### 1. Supabase

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 在项目设置中找到 API 密钥

### 2. OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的 API Key
3. 复制密钥到配置文件

**注意**: OpenAI API 需要付费使用，请确保账户有足够余额。

### 3. 阿里云百炼平台（可选）

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 开通服务并创建 API Key
3. 使用 `DASHSCOPE_API_KEY` 环境变量配置

**助教批改说明**: 如果您使用阿里云百炼平台的 API Key 进行测试，密钥保证 3 个月内有效。

### 4. 高德地图 API Key

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册并创建应用
3. 申请 Web 端（JS API）服务
4. 复制 Key 到配置文件

### 5. 科大讯飞语音识别（可选）

1. 访问 [科大讯飞开放平台](https://www.xfyun.cn/)
2. 创建应用
3. 开通语音识别服务
4. 获取 App ID、API Key 和 API Secret

**注意**: 如不配置科大讯飞，系统将使用浏览器内置的 Web Speech API（仅支持 Chrome 等现代浏览器）。

## 📖 使用说明

### 创建旅行计划

1. **注册/登录**: 首次使用需要注册账户
2. **开始规划**: 点击"开始规划旅行"或"创建新行程"
3. **输入需求**: 
   - 使用语音描述（点击麦克风图标）
   - 或手动填写表单
4. **生成行程**: AI 将自动生成详细的旅行计划
5. **查看详情**: 在行程详情页查看完整规划

### 查看地图

1. 在行程详情页切换到"地图视图"标签
2. 查看景点标记和路线规划
3. 点击标记查看景点详细信息
4. 使用缩放和拖拽功能浏览地图

### 费用管理

1. 切换到"费用管理"标签
2. 点击"语音"或"添加"按钮记录开销
3. 查看预算使用情况和分类统计
4. 实时追踪剩余预算

### 设置 API 密钥

1. 访问"设置"页面
2. 在"API 密钥配置"部分输入各项密钥
3. 点击"保存密钥"
4. 密钥将安全存储在浏览器本地

**重要**: 密钥仅存储在浏览器本地存储中，不会上传到服务器，确保安全性。

## 🏗️ 项目结构

```
ai-travel-planner/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/               # API 路由
│   │   ├── auth/              # 认证页面
│   │   ├── dashboard/         # 仪表盘
│   │   ├── planner/           # 行程规划器
│   │   ├── trip/[id]/         # 行程详情
│   │   ├── settings/          # 设置页面
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── TripMap.tsx       # 地图组件
│   │   └── ExpenseTracker.tsx # 费用追踪组件
│   └── lib/                   # 工具库
│       ├── supabase.ts       # Supabase 客户端
│       ├── ai.ts             # AI 服务
│       └── voice.ts          # 语音识别
├── supabase/
│   └── schema.sql            # 数据库架构
├── .github/
│   └── workflows/
│       └── docker-build.yml  # CI/CD 配置
├── Dockerfile                # Docker 配置
├── docker-compose.yml        # Docker Compose 配置
├── next.config.js            # Next.js 配置
├── tailwind.config.ts        # TailwindCSS 配置
├── package.json              # 项目依赖
└── README.md                 # 项目文档
```

## 🚀 GitHub Actions CI/CD

项目配置了自动化 CI/CD 流程，在推送代码到主分支时自动构建 Docker 镜像并推送到阿里云容器镜像服务。

### 配置步骤

1. 在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下密钥：
   - `ALI_REGISTRY_USERNAME`: 阿里云容器镜像服务用户名
   - `ALI_REGISTRY_PASSWORD`: 阿里云容器镜像服务密码
   - `ALI_REGISTRY_NAMESPACE`: 阿里云镜像命名空间

2. 推送代码到主分支即可触发自动构建

3. 构建完成后可以从阿里云镜像仓库拉取镜像

## 📝 开发指南

### 添加新功能

1. 在 `src/app` 中创建新页面
2. 在 `src/components` 中创建复用组件
3. 在 `src/lib` 中添加工具函数
4. 更新 Supabase 数据库架构（如需要）

### 代码规范

- 使用 TypeScript 编写类型安全的代码
- 遵循 Next.js 13+ App Router 最佳实践
- 组件使用 'use client' 指令标记客户端组件
- 使用 TailwindCSS 进行样式管理

### 测试

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建测试
npm run build
```

## ⚠️ 重要提示

### API 密钥安全

- **切勿将 API 密钥提交到 Git 仓库**
- 使用 `.env` 文件管理密钥（已在 `.gitignore` 中）
- 在生产环境使用环境变量或密钥管理服务
- 客户端密钥存储在 localStorage，仅用于浏览器端调用

### 数据隐私

- 用户数据存储在 Supabase，启用了行级安全策略（RLS）
- 用户只能访问自己的数据
- API 密钥不会上传到服务器

### 成本控制

- OpenAI API 按使用量计费，请注意控制调用频率
- 高德地图 API 有免费额度，超出后按量计费
- Supabase 有免费套餐，适合开发和小规模使用

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- GitHub: [yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 开源 Firebase 替代方案
- [OpenAI](https://openai.com/) - AI 模型服务
- [高德地图](https://lbs.amap.com/) - 地图服务
- [科大讯飞](https://www.xfyun.cn/) - 语音识别服务
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

---

**注意**: 本项目为教育/演示目的开发，在生产环境使用前请进行充分测试和安全审查。
