# API 密钥配置指南

本文档详细说明如何获取和配置所需的 API 密钥。

---

## 🔑 必需的 API 密钥

### 1. Supabase（数据库和认证）⭐ 必需

#### 获取步骤：

1. **访问 Supabase**
   - 网址：https://supabase.com
   - 点击 "Start your project"

2. **创建账户**
   - 使用 GitHub 账户登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   - 点击 "New Project"
   - 输入项目名称（例如：ai-travel-planner）
   - 设置数据库密码（请记住此密码）
   - 选择区域（推荐：新加坡或日本）
   - 点击 "Create new project"
   - 等待项目初始化（约 2 分钟）

4. **获取 API 密钥**
   - 在左侧菜单点击 "Settings" → "API"
   - 复制以下信息：
     ```
     Project URL: https://xxxxx.supabase.co
     anon public key: eyJhbGc...
     service_role key: eyJhbGc...（小心保管）
     ```

5. **创建数据库表**
   - 在左侧菜单点击 "SQL Editor"
   - 点击 "New query"
   - 复制 `supabase/schema.sql` 文件的全部内容
   - 粘贴到编辑器
   - 点击 "Run" 执行
   - 确认所有表创建成功

#### 配置到 .env：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...（服务端使用）
```

**💰 费用**: 免费（500MB 数据库，无限 API 请求）

---

### 2. OpenAI API Key（AI 行程生成）⭐ 必需（或使用阿里云百炼）

#### 获取步骤：

1. **访问 OpenAI Platform**
   - 网址：https://platform.openai.com

2. **创建账户**
   - 点击 "Sign Up"
   - 使用邮箱注册
   - 验证邮箱地址

3. **添加支付方式**
   - 点击右上角头像 → "Billing"
   - 点击 "Add payment method"
   - 输入信用卡信息
   - 充值至少 $5（推荐 $10-20）

4. **创建 API Key**
   - 点击左侧 "API keys"
   - 点击 "Create new secret key"
   - 输入名称（例如：travel-planner）
   - 复制生成的密钥（只显示一次！）
   - 密钥格式：sk-...

#### 配置到 .env：
```env
OPENAI_API_KEY=sk-proj-...
OPENAI_BASE_URL=https://api.openai.com/v1
```

**💰 费用**: 
- GPT-4 Turbo: ~$0.01/千 token（一次行程生成约 $0.05-0.10）
- 建议预算：$10-20 可用于测试和演示

**⚠️ 重要提示**:
- 请妥善保管 API Key
- 不要分享给他人
- 监控使用量
- 设置使用限制

---

### 3. 阿里云百炼 API Key（OpenAI 的替代方案）⭐ 可选

**适用于**：助教批改作业时可以使用

#### 获取步骤：

1. **访问阿里云百炼平台**
   - 网址：https://bailian.console.aliyun.com/

2. **开通服务**
   - 登录阿里云账户
   - 开通百炼服务
   - 同意服务协议

3. **创建 API Key**
   - 在控制台点击 "API-KEY 管理"
   - 点击 "创建新的 API-KEY"
   - 复制生成的密钥

#### 配置到 .env：
```env
DASHSCOPE_API_KEY=sk-...
```

**💰 费用**: 有免费额度，具体查看阿里云定价

**📝 助教注意**：
- 如果提供了百炼 API Key，保证 3 个月内有效
- 在 README 中提供密钥
- 标注使用期限

---

### 4. 高德地图 API Key（地图显示）⭐ 必需

#### 获取步骤：

1. **访问高德开放平台**
   - 网址：https://console.amap.com/

2. **注册账户**
   - 点击右上角 "注册"
   - 填写手机号和验证码
   - 完成实名认证（需要身份证）

3. **创建应用**
   - 点击 "应用管理" → "我的应用"
   - 点击 "创建新应用"
   - 应用名称：AI Travel Planner
   - 应用类型：Web服务

4. **添加 Key**
   - 在应用下点击 "添加"
   - Key 名称：web-key
   - 服务平台：Web端（JS API）
   - 白名单：* （测试用，生产环境需要具体域名）
   - 点击 "提交"
   - 复制生成的 Key

#### 配置到 .env：
```env
NEXT_PUBLIC_AMAP_KEY=xxxxx...
```

**💰 费用**: 免费（每天 30 万次调用）

**⚠️ 注意**:
- Key 需要开通 "Web 服务（JS API）"
- 生产环境需要配置白名单
- 测试时可以设置为 *

---

### 5. 科大讯飞语音识别（可选）

**默认使用浏览器的 Web Speech API（免费），以下为高级选项**

#### 获取步骤：

1. **访问科大讯飞开放平台**
   - 网址：https://www.xfyun.cn/

2. **注册账户**
   - 点击 "注册"
   - 填写手机号和验证码

3. **创建应用**
   - 点击 "控制台" → "我的应用"
   - 点击 "创建新应用"
   - 应用名称：AI Travel Planner
   - 应用平台：WebAPI

4. **开通语音听写服务**
   - 在应用详情中点击 "语音听写"
   - 点击 "开通"
   - 选择免费版本

5. **获取密钥**
   - 在应用详情中找到：
     - APPID
     - APIKey
     - APISecret

#### 配置到 .env：
```env
IFLYTEK_APP_ID=xxxxx
IFLYTEK_API_KEY=xxxxx
IFLYTEK_API_SECRET=xxxxx
```

**💰 费用**: 免费（每天 500 次调用）

**📝 说明**：
- 如果不配置，系统自动使用浏览器 Web Speech API
- Web Speech API 在 Chrome 浏览器中效果很好
- 只有需要更好的中文支持时才需要配置科大讯飞

---

## ⚙️ 配置步骤

### 1. 创建环境变量文件

```bash
# 复制模板文件
cp .env.example .env
```

### 2. 编辑 .env 文件

**Windows**:
```bash
notepad .env
```

**Mac/Linux**:
```bash
nano .env
# 或
vim .env
```

### 3. 填入获取的密钥

最小配置（必需）：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI 服务（二选一）
OPENAI_API_KEY=sk-...
# 或
# DASHSCOPE_API_KEY=sk-...

# 地图
NEXT_PUBLIC_AMAP_KEY=xxxxx
```

完整配置（推荐）：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# 地图
NEXT_PUBLIC_AMAP_KEY=xxxxx

# 科大讯飞（可选）
IFLYTEK_APP_ID=xxxxx
IFLYTEK_API_KEY=xxxxx
IFLYTEK_API_SECRET=xxxxx

# 应用
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 保存文件

确保文件保存为 `.env`（不是 .env.txt）

---

## ✅ 验证配置

### 方法 1：启动应用验证

```bash
# 使用 Docker
docker-compose up -d

# 或本地开发
npm run dev
```

访问 http://localhost:3000，尝试：
1. 注册账户 → 验证 Supabase
2. 创建行程 → 验证 OpenAI
3. 查看地图 → 验证高德地图
4. 语音输入 → 验证语音服务

### 方法 2：检查日志

```bash
# Docker
docker-compose logs -f

# 本地
# 查看浏览器控制台
```

---

## 🔒 安全注意事项

### ✅ 要做的事：
- 使用环境变量存储密钥
- 将 .env 添加到 .gitignore
- 定期轮换 API 密钥
- 监控 API 使用量
- 设置使用限制

### ❌ 不要做的事：
- 不要将 .env 提交到 Git
- 不要在代码中硬编码密钥
- 不要分享密钥给他人
- 不要在公开场合展示密钥
- 不要使用弱密码

---

## 💰 费用总览

| 服务 | 免费额度 | 付费价格 | 测试成本 |
|------|---------|---------|----------|
| Supabase | 500MB 数据库 | $25/月起 | $0 |
| OpenAI GPT-4 | $5 赠金（新用户） | ~$0.01/1K token | $10-20 |
| 阿里云百炼 | 有免费额度 | 按量计费 | $0-10 |
| 高德地图 | 30万次/天 | 超出部分收费 | $0 |
| 科大讯飞 | 500次/天 | 超出部分收费 | $0 |

**总计**: 测试和演示成本约 $10-20（主要是 OpenAI）

---

## 🆘 常见问题

### Q: 我没有信用卡，无法使用 OpenAI？
A: 可以使用阿里云百炼平台，支持支付宝充值。

### Q: 高德地图 Key 获取需要企业认证吗？
A: 不需要，个人实名认证即可。

### Q: 可以使用免费的 AI 服务吗？
A: 可以考虑使用 Groq（免费但有限额）或本地运行的 LLM。

### Q: 语音识别必须配置科大讯飞吗？
A: 不需要，浏览器自带的 Web Speech API 已经很好用了。

### Q: API Key 会过期吗？
A: OpenAI 和高德地图的 Key 不会过期，除非手动删除。Supabase 项目会一直保留（免费套餐）。

---

## 📚 参考链接

- [Supabase 文档](https://supabase.com/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [阿里云百炼文档](https://help.aliyun.com/zh/dashscope/)
- [高德地图 API 文档](https://lbs.amap.com/api/javascript-api/summary)
- [科大讯飞文档](https://www.xfyun.cn/doc/)

---

**配置指南版本**: 1.0
**最后更新**: 2025年11月10日
