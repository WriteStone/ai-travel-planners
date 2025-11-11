# AI Travel Planner - 智能旅行规划助手

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Docker](https://img.shields.io/badge/docker-ready-blue)

一个基于 AI 的智能旅行规划 Web 应用，通过语音或文字输入旅行需求，自动生成个性化的旅行路线、预算分析和费用管理。

---

## 🚀 5分钟快速部署指南（Docker）

### 📋 准备工作

在开始之前，请确保：
1. ✅ 已安装 [Docker Desktop](https://www.docker.com/get-started)（Windows/Mac）或 Docker Engine（Linux）
2. ✅ 使用 **Microsoft Edge** 或 **Google Chrome** 浏览器（语音识别必需）
3. ✅ 准备好两个 API 密钥（下面有详细获取教程）

> ⚠️ **重要**：如果你是第一次使用，请完整按照本教程操作，每一步都很重要！

---

### 📝 第一步：获取 API 密钥（约5分钟）

#### 1.1 获取 Supabase 密钥（免费，必需）

**Supabase 是什么？** 一个免费的云数据库服务，用于存储你的旅行计划和用户信息。

**获取步骤：**

1. **访问并注册**
   - 打开 https://supabase.com
   - 点击 "Start your project" 
   - 使用 GitHub 账号登录（或邮箱注册）

2. **创建项目**
   - 点击 "New Project"（新建项目）
   - 填写信息：
     - Name（名称）: `travel-planner`（随意填写）
     - Database Password（数据库密码）: 随便设置一个强密码（记住它）
     - Region（地区）: 选择 `Southeast Asia (Singapore)` 或 `Northeast Asia (Tokyo)`（亚洲节点速度快）
   - 点击 "Create new project"
   - **等待 2 分钟**，项目创建完成

3. **配置数据库**
   - 项目创建完成后，点击左侧菜单的 **SQL Editor**（SQL 编辑器）
   - 点击 "+ New query"
   - 复制粘贴以下 SQL 代码到编辑器：

   ```sql
   -- 创建用户配置表
   create table if not exists public.profiles (
     id uuid references auth.users on delete cascade primary key,
     email text,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- 启用 RLS（行级安全）
   alter table public.profiles enable row level security;

   -- 用户只能查看和修改自己的数据
   create policy "Users can view own profile" on public.profiles
     for select using (auth.uid() = id);

   create policy "Users can update own profile" on public.profiles
     for update using (auth.uid() = id);

   -- 创建旅行计划表
   create table if not exists public.trips (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users on delete cascade not null,
     destination text not null,
     start_date date,
     end_date date,
     budget numeric,
     travelers integer,
     preferences text[],
     itinerary jsonb,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   alter table public.trips enable row level security;

   create policy "Users can view own trips" on public.trips
     for select using (auth.uid() = user_id);

   create policy "Users can insert own trips" on public.trips
     for insert with check (auth.uid() = user_id);

   create policy "Users can update own trips" on public.trips
     for update using (auth.uid() = user_id);

   create policy "Users can delete own trips" on public.trips
     for delete using (auth.uid() = user_id);

   -- 自动创建用户配置的触发器
   create or replace function public.handle_new_user()
   returns trigger as $$
   begin
     insert into public.profiles (id, email, full_name)
     values (new.id, new.email, new.raw_user_meta_data->>'full_name');
     return new;
   end;
   $$ language plpgsql security definer;

   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure public.handle_new_user();
   ```

   - 点击右下角 **Run**（运行）按钮
   - 看到 "Success. No rows returned" 表示成功

4. **获取密钥**
   - 点击左侧菜单的 **Settings**（设置）→ **API**
   - 找到并复制以下两项（**非常重要！**）：
     - **Project URL**：类似 `https://xxxxx.supabase.co`
     - **anon public**（公开匿名密钥）：以 `eyJ` 开头的一长串字符

   > 💡 提示：可以点击密钥右侧的复制按钮，直接复制到记事本保存。

---

#### 1.2 获取阿里云百炼 API Key（免费额度，必需）

**阿里云百炼是什么？** 阿里云的 AI 大模型服务，用于生成智能旅行规划。

**获取步骤：**

1. **访问并登录**
   - 打开 https://dashscope.aliyun.com/
   - 点击右上角 "登录"
   - 使用阿里云账号登录（没有账号先注册，支持手机号注册）

2. **开通服务**
   - 登录后会自动进入控制台
   - 如果提示开通服务，点击 "立即开通"（免费）
   - 阅读并同意服务协议

3. **创建 API Key**
   - 在控制台页面，点击右上角头像
   - 选择 "API-KEY 管理"
   - 点击 "创建新的 API-KEY"
   - 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
   - **重要**：密钥只显示一次，请立即保存到记事本！

   > 💰 费用说明：新用户有免费额度（约 100 万 tokens），足够生成几百个旅行计划。

---

### 🐳 第二步：运行 Docker 容器（约2分钟）

#### 2.1 创建配置文件

**Windows 用户：**

1. 在任意位置创建一个文件夹，例如 `C:\ai-travel-planner`
2. 在该文件夹中，右键点击空白处 → 新建 → 文本文档
3. 命名为 `.env`（注意：没有文件名，只有扩展名）
   - 如果 Windows 不显示扩展名：打开文件夹选项 → 查看 → 取消勾选"隐藏已知文件类型的扩展名"
4. 用记事本打开 `.env` 文件，粘贴以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=在这里粘贴你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=在这里粘贴你的Supabase匿名密钥
DASHSCOPE_API_KEY=在这里粘贴你的阿里云百炼APIKey
```

5. 将上面三行中的中文替换成你在第一步获取的真实密钥
6. 保存文件（Ctrl+S）

**示例（仅供参考，请使用你自己的密钥）：**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
DASHSCOPE_API_KEY=sk-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Mac/Linux 用户：**

```bash
# 创建文件夹
mkdir ~/ai-travel-planner
cd ~/ai-travel-planner

# 创建 .env 文件
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=在这里粘贴你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=在这里粘贴你的Supabase匿名密钥
DASHSCOPE_API_KEY=在这里粘贴你的阿里云百炼APIKey
EOF

# 用文本编辑器打开并修改
nano .env
```

---

#### 2.2 启动容器

**Windows 用户（PowerShell 或 CMD）：**

1. 打开 PowerShell（Win+X → Windows PowerShell）
2. 切换到你刚才创建的文件夹：
   ```powershell
   cd C:\ai-travel-planner
   ```

3. 运行以下命令：

```powershell
# 拉取最新镜像
docker pull ghcr.io/writestone/ai-travel-planners:latest

# 启动容器
docker run -d `
  --name ai-travel-planner `
  -p 3000:3000 `
  --env-file .env `
  --restart unless-stopped `
  ghcr.io/writestone/ai-travel-planners:latest
```

**Mac/Linux 用户（Terminal）：**

```bash
# 拉取最新镜像
docker pull ghcr.io/writestone/ai-travel-planners:latest

# 启动容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ghcr.io/writestone/ai-travel-planners:latest
```

#### 2.3 验证运行状态

运行以下命令检查容器是否正常启动：

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs ai-travel-planner
```

**成功的标志：**
- `docker ps` 显示容器状态为 `Up`
- 日志中显示 `Ready started server on 0.0.0.0:3000`

---

### 🎉 第三步：开始使用（约1分钟）

#### 3.1 访问应用

1. 打开 **Microsoft Edge** 或 **Google Chrome** 浏览器
2. 访问：http://localhost:3000
3. 看到欢迎页面说明部署成功！

#### 3.2 注册账号

1. 点击页面上的 **"注册"** 按钮
2. 输入邮箱和密码（密码至少 6 位）
3. 点击 "注册" 完成
4. 系统会自动登录并跳转到仪表板

#### 3.3 创建第一个旅行计划

1. 点击 **"创建计划"** 或 **"开始规划旅行"**
2. 两种输入方式：

   **方式A：语音输入（推荐）**
   - 点击麦克风图标 🎤
   - 允许浏览器使用麦克风（首次会提示）
   - 说出你的旅行需求，例如：
     > "我想去成都玩5天，预算8000元，喜欢美食和文化，两个人"
   - AI 会自动识别并填充表单

   **方式B：手动填写**
   - 目的地：例如 "成都"
   - 出发日期和返回日期：选择日期
   - 预算：例如 "8000"
   - 同行人数：例如 "2"
   - 旅行偏好：勾选 "美食"、"文化" 等

3. 点击 **"生成计划"** 按钮
4. 等待 10-30 秒，AI 会生成详细的旅行规划，包括：
   - 每日行程安排
   - 景点推荐和时间
   - 餐厅推荐（早中晚）
   - 交通方式和费用
   - 住宿建议
   - 详细预算分析

5. 查看地图和费用管理
   - 切换到 "地图视图" 查看景点分布
   - 切换到 "费用管理" 记录实际花费

---

### ✅ 功能验证清单

完成以上步骤后，请验证以下功能：

- [ ] ✅ 可以注册新账号
- [ ] ✅ 可以登录/登出
- [ ] ✅ 可以创建旅行计划
- [ ] ✅ 语音识别功能正常（Edge/Chrome）
- [ ] ✅ AI 能生成详细的旅行计划
- [ ] ✅ 可以在地图上查看景点（如果配置了高德地图 key）
- [ ] ✅ 可以记录和管理费用
- [ ] ✅ 计划可以保存并在仪表板查看

---

### 🔧 常见问题解决

#### Q1: 访问 localhost:3000 显示无法访问

**解决方案：**
```bash
# 检查容器是否运行
docker ps

# 如果没有显示容器，查看所有容器（包括停止的）
docker ps -a

# 查看容器日志找错误
docker logs ai-travel-planner

# 重启容器
docker restart ai-travel-planner
```

#### Q2: 注册时提示 "Failed to fetch" 或 404 错误

**原因：** 环境变量配置错误

**解决方案：**
1. 停止并删除容器：
   ```bash
   docker stop ai-travel-planner
   docker rm ai-travel-planner
   ```

2. 检查 `.env` 文件：
   - 确保没有多余的空格
   - 确保没有引号（不要加 `"` 或 `'`）
   - 确保密钥完整（特别是 Supabase Anon Key 很长）

3. 重新运行容器（使用上面的命令）

4. 清除浏览器缓存：
   - 按 `Ctrl + Shift + Delete`
   - 选择 "缓存的图像和文件"
   - 清除后刷新页面

#### Q3: AI 生成失败或返回错误

**解决方案：**
- 检查阿里云百炼 API Key 是否正确
- 登录阿里云百炼控制台查看是否还有免费额度
- 查看容器日志：`docker logs ai-travel-planner`

#### Q4: 语音识别不工作

**解决方案：**
- 确认使用 Edge 或 Chrome 浏览器
- 检查浏览器是否允许麦克风权限
- 确认系统麦克风设备正常工作
- Firefox 和 Safari 不支持语音功能

#### Q5: 端口 3000 被占用

**解决方案：**
使用其他端口（例如 3001）：
```bash
# Windows PowerShell
docker run -d `
  --name ai-travel-planner `
  -p 3001:3000 `
  --env-file .env `
  ghcr.io/writestone/ai-travel-planners:latest

# Mac/Linux
docker run -d \
  --name ai-travel-planner \
  -p 3001:3000 \
  --env-file .env \
  ghcr.io/writestone/ai-travel-planners:latest
```
然后访问：http://localhost:3001

---

### 🛑 停止和管理容器

```bash
# 停止容器
docker stop ai-travel-planner

# 启动容器
docker start ai-travel-planner

# 重启容器
docker restart ai-travel-planner

# 查看日志
docker logs ai-travel-planner

# 查看最新 50 行日志
docker logs ai-travel-planner --tail 50

# 实时查看日志
docker logs -f ai-travel-planner

# 删除容器（数据会丢失）
docker stop ai-travel-planner
docker rm ai-travel-planner

# 更新到最新版本
docker pull ghcr.io/writestone/ai-travel-planners:latest
docker stop ai-travel-planner
docker rm ai-travel-planner
# 然后重新运行上面的 docker run 命令
```

---

### 💡 高级配置（可选）

#### 添加高德地图支持（可选）

如果你想启用地图可视化功能：

1. 访问 https://console.amap.com/
2. 注册并创建应用
3. 获取 Web 端 JS API Key
   ```
5. 重新启动容器

---

---

### 🎯 主要功能介绍

#### 🗣️ 语音识别
- 支持中文语音输入
- 自动识别目的地、预算、日期、人数等信息
- 实时转换为文字并填充表单

#### 🤖 AI 行程生成
- 基于阿里云百炼大模型（通义千问）
- 智能推荐景点、餐厅、交通
- 生成详细的每日行程安排
- 提供合理的预算分配建议

#### 🗺️ 地图可视化
- 集成高德地图
- 标记所有景点位置
- 显示路线规划
- 支持地图交互

#### 💰 预算追踪
- 实时费用记录
- 分类统计（交通、住宿、餐饮、门票等）
- 预算超支提醒
- 图表可视化

#### ☁️ 云端同步
- 所有数据存储在 Supabase
- 多设备自动同步
- 安全的用户认证
- 历史计划保存

## 🎯 使用场景

- **家庭旅行**: 规划亲子游、家庭度假
- **情侣出行**: 浪漫旅行路线推荐
- **商务差旅**: 高效的行程安排和费用管理
- **背包旅行**: 预算控制和路线优化
- **团队建设**: 多人出行的统筹规划

## 💡 使用技巧

1. **语音输入时尽量详细**：说明目的地、时间、预算、偏好，AI 会生成更精准的计划
2. **及时记录花费**：使用语音记账功能，旅行中随时记录，避免遗忘
3. **保存多个方案**：可以为同一目的地生成多个计划进行对比
4. **参考但不拘泥**：AI 建议可作参考，根据实际情况灵活调整

## 🔧 故障排除

### 应用无法访问
- 检查 Docker 容器是否运行：`docker ps`
- 检查端口 3000 是否被占用
- 查看容器日志：`docker logs ai-travel-planner`

### AI 无法生成行程
- 确认 DASHSCOPE_API_KEY 配置正确
- 检查 API 密钥是否有效且有余额
- 查看浏览器控制台错误信息

### 无法注册或登录
- 确认 SUPABASE_URL 和 SUPABASE_ANON_KEY 配置正确
- 检查网络连接
- 确认 Supabase 项目状态正常

### 语音识别不工作
- **首先确认浏览器**：必须使用 **Microsoft Edge** 或 **Google Chrome** 浏览器
- 确保浏览器允许麦克风权限（浏览器地址栏会有提示）
- 检查系统麦克风设备是否正常工作
- Firefox 和 Safari 不支持 Web Speech API，无法使用语音功能
- 如果使用的是 HTTPS 环境，确保证书有效

## 📦 其他部署方式

### 本地开发运行

如果你想在本地进行开发或修改：

```bash
# 1. 克隆仓库
git clone https://github.com/WriteStone/ai-travel-planners.git
cd ai-travel-planners

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 复制 .env.example 为 .env.local 并填写密钥
cp .env.example .env.local

# 4. 运行开发服务器
npm run dev

# 5. 访问 http://localhost:3000
```

### 生产环境构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 云平台部署

**Docker 镜像可以直接部署到：**

- **阿里云容器服务 ACK**
- **腾讯云容器服务 TKE**
- **AWS ECS / Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Railway / Render / Fly.io**

部署时只需要配置好环境变量即可。

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

如果你不想使用 Docker Compose，可以直接运行容器：

**拉取镜像并运行：**

```bash
# 拉取最新镜像
docker pull ghcr.io/writestone/ai-travel-planners:latest

# 使用 .env 文件运行（推荐）
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/writestone/ai-travel-planners:latest

# 或者使用命令行环境变量（需要引号）
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e "NEXT_PUBLIC_SUPABASE_URL=your_url" \
  -e "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" \
  -e "DASHSCOPE_API_KEY=your_key" \
  ghcr.io/writestone/ai-travel-planners:latest
```

**本地构建并运行：**

```bash
# 构建镜像
docker build -t ai-travel-planner .

# 运行容器（推荐使用 .env 文件）
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ai-travel-planner
```

## 🔑 API 密钥获取指南

### 1. Supabase（必需）

**获取步骤：**
1. 访问 [Supabase](https://supabase.com) 并注册账号
2. 点击 "New Project" 创建新项目
3. 等待项目创建完成（约 2 分钟）
4. 进入项目设置 (Settings) → API
5. 复制以下信息：
   - **Project URL**（例如：`https://xxxxx.supabase.co`）
   - **anon public key**（以 `eyJ` 开头的长字符串）

**配置数据库：**
1. 在项目中点击 SQL Editor
2. 复制本项目中 `supabase/schema.sql` 的内容
3. 粘贴并执行 SQL 语句

**费用：** 免费套餐足够个人使用

### 2. 阿里云百炼 DashScope（必需）

**获取步骤：**
1. 访问 [阿里云百炼平台](https://dashscope.aliyun.com/)
2. 使用阿里云账号登录（没有则先注册）
3. 进入控制台，点击 "开通 DashScope"
4. 创建应用，选择 "通用文本生成"
5. 在 API-KEY 管理中创建新密钥
6. 复制 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

**费用：** 
- 新用户有免费额度
- qwen-turbo 模型性价比高，适合本项目

### 3. 高德地图 API（可选，推荐配置）

**获取步骤：**
1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册并完成开发者认证
3. 进入控制台 → 应用管理 → 我的应用
4. 点击 "创建新应用"
5. 添加 Key：
   - 服务平台：选择 "Web端(JS API)"
   - Key 名称：任意填写
6. 复制生成的 Key

**费用：** 免费额度（每天 30 万次调用）足够使用

### 4. 科大讯飞语音识别（可选）

**获取步骤：**
1. 访问 [科大讯飞开放平台](https://www.xfyun.cn/)
2. 注册并登录
3. 创建应用，选择 "语音听写（流式版）"
4. 在应用详情中获取：
   - APPID
   - APISecret
   - APIKey

**注意：** 
- 不配置此项将使用浏览器内置语音识别（Web Speech API）
- 仅 Chrome/Edge 浏览器支持 Web Speech API

**费用：** 每日 500 次免费调用

## 📝 环境变量配置说明

创建 `.env` 文件（Docker 部署时）：

```env
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ开头的长字符串

# 阿里云百炼 API（必需）
DASHSCOPE_API_KEY=sk-开头的密钥

# 高德地图 API（可选，推荐）
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key

# 科大讯飞语音（可选）
IFLYTEK_APP_ID=你的APPID
IFLYTEK_API_KEY=你的APIKey
IFLYTEK_API_SECRET=你的APISecret
```

**最小配置：** 只需配置前两项（Supabase + DashScope）即可运行

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

项目已配置自动化 CI/CD 流程。每次推送代码到 `main` 分支时，GitHub Actions 会自动：
1. 构建 Docker 镜像（支持 linux/amd64 和 linux/arm64）
2. 推送到 GitHub Container Registry (GHCR)
3. 自动打标签（latest、分支名、commit SHA）

**镜像地址：** `ghcr.io/writestone/ai-travel-planners:latest`

**手动触发构建：**
1. 进入仓库的 Actions 页面
2. 选择 "Build and Push Docker Image" 工作流
3. 点击 "Run workflow" 按钮

## 📝 快速测试指南

**最快 5 分钟体验应用：**

**步骤 1：创建 .env 文件**

创建一个名为 `.env` 的文件，内容如下（替换为你的真实密钥）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
DASHSCOPE_API_KEY=sk-你的密钥
```

**步骤 2：拉取并运行镜像**

```bash
# 拉取镜像
docker pull ghcr.io/writestone/ai-travel-planners:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/writestone/ai-travel-planners:latest
```

Windows PowerShell:
```powershell
docker pull ghcr.io/writestone/ai-travel-planners:latest

docker run -d `
  --name ai-travel-planner `
  -p 3000:3000 `
  --env-file .env `
  ghcr.io/writestone/ai-travel-planners:latest
```

**步骤 3：访问应用**

使用 Edge 或 Chrome 浏览器访问：`http://localhost:3000`

**测试流程：**
1. **打开浏览器**：使用 Microsoft Edge 或 Google Chrome（必需，语音功能依赖）
2. 注册一个测试账号
3. 创建新的旅行计划
4. 点击麦克风图标说："我想去成都玩3天，预算5000元，喜欢美食"
5. 点击生成计划，查看 AI 生成的详细行程
6. 切换到地图视图查看路线
7. 在费用管理中记录开销

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

- GitHub: [WriteStone](https://github.com/WriteStone)
- 项目地址: [ai-travel-planners](https://github.com/WriteStone/ai-travel-planners)
- Docker 镜像: [ghcr.io/writestone/ai-travel-planners](https://github.com/WriteStone/ai-travel-planners/pkgs/container/ai-travel-planners)

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 开源后端服务平台
- [阿里云百炼](https://dashscope.aliyun.com/) - AI 大模型服务
- [高德地图](https://lbs.amap.com/) - 地图服务
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

## ⚡ 性能优化建议

- **生产环境**：使用 Docker 镜像部署，已优化打包大小和启动速度
- **API 调用**：合理控制 AI 生成频率，避免频繁调用
- **地图加载**：按需加载地图组件，减少初始加载时间
- **数据库查询**：Supabase 启用了 RLS，确保数据安全的同时保持性能

## 🐛 已知问题

- 语音识别在某些浏览器（如 Firefox）可能不稳定，建议使用 Chrome/Edge
- 地图在移动端可能需要优化交互体验
- AI 生成的行程可能需要根据实际情况调整

## 🔮 后续计划

- [ ] 支持多语言国际化
- [ ] 移动端 App（React Native）
- [ ] 社交分享功能
- [ ] 协作规划（多人共同编辑）
- [ ] 更多 AI 模型支持
- [ ] 行程模板库

---

**注意**: 本项目为学习交流目的开发。在生产环境使用前，请进行充分的安全审查和性能测试。
