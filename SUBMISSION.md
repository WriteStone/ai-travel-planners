# AI Travel Planner - 项目提交文档

## 项目信息

**项目名称**: AI Travel Planner - 智能旅行规划助手

**GitHub 仓库**: https://github.com/yourusername/ai-travel-planner

**演示地址**: http://your-demo-url.com (如果已部署)

**提交日期**: 2025年11月10日

---

## 项目概述

AI Travel Planner 是一个基于人工智能的智能旅行规划 Web 应用，旨在简化旅行规划过程。用户可以通过语音或文字输入旅行需求，系统将自动生成详细的个性化旅行路线，包括交通、住宿、景点、餐厅等完整信息，并提供实时的费用预算管理功能。

---

## 核心功能实现

### ✅ 1. 智能行程规划

- **语音输入**: 集成 Web Speech API 和科大讯飞语音识别
  - 支持中文语音识别
  - 自动解析旅行需求（目的地、天数、预算、人数、偏好）
  - 语音输入示例："我想去日本，5天，预算1万元，喜欢美食和动漫，带孩子"

- **AI 生成行程**: 使用 OpenAI GPT-4 / 阿里云百炼平台
  - 生成每日详细行程安排
  - 推荐交通方式和路线
  - 提供住宿建议和价格
  - 推荐景点及游览时间
  - 餐厅推荐（早中晚餐）
  - 详细费用预估和分解

### ✅ 2. 费用预算与管理

- **预算分析**: AI 智能分析预算使用情况
- **费用记录**: 
  - 支持手动输入
  - 支持语音记账
  - 分类管理（交通、住宿、餐饮、景点、购物等）
- **实时追踪**: 
  - 可视化预算使用进度
  - 分类支出统计图表
  - 剩余预算提醒
  - 超支警告

### ✅ 3. 用户管理与数据存储

- **注册登录系统**: 
  - 邮箱注册登录
  - Supabase Auth 认证
  - 用户资料管理

- **云端同步**: 
  - 基于 Supabase 的云端存储
  - 实时数据同步
  - 多设备访问
  - 数据安全（行级安全策略）

- **行程管理**:
  - 保存多份旅行计划
  - 查看历史行程
  - 编辑和删除行程
  - 行程状态管理（规划中/已确认/已完成）

### ✅ 4. 地图导航功能

- **地图可视化**: 集成高德地图 API
  - 显示所有景点位置
  - 行程路线规划
  - 景点标记和信息窗口
  - 交互式地图操作（缩放、拖动）

---

## 技术栈

### 前端技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: Lucide React Icons
- **状态管理**: React Hooks, Zustand
- **通知系统**: React Hot Toast

### 后端技术
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Authentication
- **存储**: Supabase Storage
- **API**: Next.js API Routes

### AI 与外部服务
- **大语言模型**: OpenAI GPT-4 / 阿里云百炼
- **语音识别**: Web Speech API / 科大讯飞
- **地图服务**: 高德地图 Web API

### 部署技术
- **容器化**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: 阿里云容器镜像服务

---

## Docker 部署说明

### 1. 使用 Docker Compose 运行（推荐）

```bash
# 克隆项目
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入您的 API 密钥

# 启动服务
docker-compose up -d

# 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 2. 从阿里云镜像仓库拉取

```bash
# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

### 3. Docker 镜像信息

- **镜像仓库**: 阿里云容器镜像服务（杭州）
- **镜像地址**: registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner
- **标签**: latest, main-{commit-sha}
- **构建方式**: GitHub Actions 自动构建

---

## API 密钥配置

### 必需的 API 密钥

1. **Supabase**
   - 获取方式: https://supabase.com 创建项目
   - 配置项:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

2. **OpenAI / 阿里云百炼（二选一）**
   - OpenAI: https://platform.openai.com/api-keys
   - 阿里云百炼: https://bailian.console.aliyun.com/
   - 配置项:
     - `OPENAI_API_KEY` 或 `DASHSCOPE_API_KEY`

3. **高德地图**
   - 获取方式: https://console.amap.com/
   - 配置项: `NEXT_PUBLIC_AMAP_KEY`

### 可选的 API 密钥

- **科大讯飞语音识别**
  - 获取方式: https://www.xfyun.cn/
  - 配置项: `IFLYTEK_APP_ID`, `IFLYTEK_API_KEY`, `IFLYTEK_API_SECRET`
  - 备注: 如不配置，系统将使用浏览器 Web Speech API

### 密钥配置方式

**方式一：环境变量文件（推荐）**
```bash
# 创建 .env 文件
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=your_key
NEXT_PUBLIC_AMAP_KEY=your_key
```

**方式二：应用内设置**
- 登录后访问"设置"页面
- 在"API 密钥配置"部分输入密钥
- 密钥安全存储在浏览器本地

---

## GitHub 仓库说明

### 仓库结构
```
ai-travel-planner/
├── src/                    # 源代码
│   ├── app/               # Next.js 页面和 API
│   ├── components/        # React 组件
│   └── lib/              # 工具库
├── supabase/             # 数据库架构
├── .github/workflows/    # CI/CD 配置
├── Dockerfile            # Docker 配置
├── docker-compose.yml    # Docker Compose 配置
├── README.md            # 项目文档
├── DEPLOYMENT.md        # 部署指南
└── package.json         # 依赖配置
```

### 提交记录

本项目保留了完整的 Git 提交历史，包括：
- 项目初始化和配置
- 核心功能实现
- UI/UX 设计和优化
- Docker 容器化配置
- CI/CD 流程设置
- 文档编写

可通过 `git log` 查看详细提交记录。

---

## 功能演示截图

（请在此处插入应用截图）

### 1. 首页
- 功能介绍
- 快速开始

### 2. 语音输入行程规划
- 语音识别界面
- 自动填充表单

### 3. AI 生成的行程详情
- 每日行程安排
- 景点介绍
- 餐饮推荐
- 费用预估

### 4. 地图视图
- 景点标记
- 路线规划
- 交互式地图

### 5. 费用管理
- 预算概览
- 分类支出
- 语音记账

---

## 安全性说明

### API 密钥安全

✅ **严格遵守**: 所有 API 密钥均未提交到 GitHub 仓库

- 使用 `.env` 文件管理密钥（已在 `.gitignore` 中）
- 提供 `.env.example` 模板文件
- 在应用中支持运行时配置
- 客户端密钥存储在浏览器 localStorage

### 数据安全

- 使用 Supabase 行级安全策略（RLS）
- 用户数据隔离
- 密码加密存储
- HTTPS 传输（生产环境）

---

## 测试账户（供评审使用）

如果您已部署测试环境，可以提供测试账户：

- **邮箱**: test@example.com
- **密码**: test123456

**或者** 评审老师可以直接注册新账户进行测试。

---

## 已知限制和改进方向

### 当前限制
1. OpenAI API 需要付费使用
2. 语音识别在某些浏览器中可能不可用
3. 地图功能需要稳定的网络连接

### 未来改进方向
1. 支持更多 AI 模型
2. 添加行程分享功能
3. 实现离线模式
4. 增加更多语言支持
5. 优化移动端体验

---

## 开发者信息

**姓名**: [您的姓名]

**学号**: [您的学号]

**联系方式**: 
- Email: your.email@example.com
- GitHub: https://github.com/yourusername

---

## 致谢

感谢以下开源项目和服务：
- Next.js - React 应用框架
- Supabase - 开源后端服务
- OpenAI - AI 模型服务
- 高德地图 - 地图服务
- TailwindCSS - CSS 框架

---

## 附录

### A. 完整的环境变量列表

参见 `.env.example` 文件

### B. 数据库架构

参见 `supabase/schema.sql` 文件

### C. API 文档

参见 README.md 中的 API 使用说明

---

**声明**: 本项目为课程作业，仅用于学习和演示目的。

---

**提交日期**: 2025年11月10日

**文档版本**: 1.0
