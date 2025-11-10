# AI Travel Planner - 部署指南

本文档详细说明如何部署 AI Travel Planner 项目。

## 📋 部署前准备

### 1. 准备 API 密钥

在部署之前，需要准备以下 API 密钥：

#### 必需的密钥：
- **Supabase**: 项目 URL 和 API 密钥
- **AI 服务**: OpenAI API Key 或阿里云百炼 API Key
- **高德地图**: Web 端 API Key

#### 可选的密钥：
- **科大讯飞**: 用于更好的中文语音识别

### 2. 创建 Supabase 项目

1. 访问 https://supabase.com 并创建账户
2. 创建新项目
3. 在 SQL Editor 中执行 `supabase/schema.sql` 中的 SQL 语句
4. 在项目设置中获取：
   - Project URL
   - Anon/Public Key
   - Service Role Key (仅用于服务端)

## 🚀 部署方式

### 方式一：使用 Docker Compose（推荐）

这是最简单的部署方式，适合快速测试和小规模部署。

#### 步骤：

1. **克隆项目**
```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

2. **创建环境变量文件**
```bash
cp .env.example .env
```

3. **编辑 .env 文件，填入您的 API 密钥**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_AMAP_KEY=xxxxx
```

4. **启动服务**
```bash
docker-compose up -d
```

5. **访问应用**
打开浏览器访问 http://localhost:3000

6. **查看日志**
```bash
docker-compose logs -f
```

7. **停止服务**
```bash
docker-compose down
```

### 方式二：使用预构建的 Docker 镜像

如果已经通过 GitHub Actions 构建了镜像并推送到阿里云镜像仓库：

1. **拉取镜像**
```bash
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

2. **运行容器**
```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  -e NEXT_PUBLIC_AMAP_KEY=your_key \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

或者使用 env 文件：
```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

### 方式三：本地开发部署

适合开发测试。

1. **安装依赖**
```bash
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件填入密钥
```

3. **运行开发服务器**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
npm start
```

### 方式四：部署到云平台

#### Vercel（推荐用于前端）

1. 在 Vercel 导入 GitHub 仓库
2. 在项目设置中添加环境变量
3. 自动部署

#### Railway

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

#### 阿里云 ECS

1. 购买 ECS 实例
2. 安装 Docker 和 Docker Compose
3. 使用 Docker Compose 部署
4. 配置 Nginx 反向代理（可选）

## 🔧 高级配置

### 配置 Nginx 反向代理

如果需要使用自定义域名和 HTTPS：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 配置 SSL/HTTPS

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

### 环境变量完整列表

```env
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI 模型配置（二选一，必需）
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
# 或
DASHSCOPE_API_KEY=

# 地图服务（必需）
NEXT_PUBLIC_AMAP_KEY=

# 语音识别（可选）
IFLYTEK_APP_ID=
IFLYTEK_API_KEY=
IFLYTEK_API_SECRET=

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production
```

## 🔍 故障排查

### 问题：容器启动失败

**解决方案：**
1. 检查环境变量是否正确配置
2. 查看容器日志：`docker logs ai-travel-planner`
3. 确保端口 3000 未被占用

### 问题：无法连接 Supabase

**解决方案：**
1. 检查 Supabase URL 和密钥是否正确
2. 确认 Supabase 项目状态正常
3. 检查数据库表是否已创建

### 问题：AI 生成失败

**解决方案：**
1. 检查 OpenAI/百炼 API Key 是否有效
2. 确认 API 账户有足够余额
3. 查看 API 调用日志

### 问题：地图无法显示

**解决方案：**
1. 检查高德地图 API Key 是否正确
2. 确认 API Key 已开通 Web 服务
3. 检查浏览器控制台错误信息

### 问题：语音识别不工作

**解决方案：**
1. 使用 HTTPS 或 localhost（浏览器安全要求）
2. 允许浏览器麦克风权限
3. 检查浏览器是否支持 Web Speech API

## 📊 性能优化

### 1. 启用缓存

在 Nginx 中配置静态资源缓存：

```nginx
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. 使用 CDN

将静态资源上传到 CDN 以提升加载速度。

### 3. 数据库优化

- 定期清理过期数据
- 为常用查询添加索引
- 使用 Supabase 的连接池

## 🔒 安全建议

1. **不要在代码中硬编码密钥**
2. **使用环境变量管理敏感信息**
3. **定期更新依赖包**
4. **启用 HTTPS**
5. **配置 CORS 策略**
6. **实施速率限制**
7. **定期备份数据库**

## 📈 监控和日志

### 查看应用日志

```bash
# Docker Compose
docker-compose logs -f app

# Docker
docker logs -f ai-travel-planner
```

### 监控资源使用

```bash
docker stats ai-travel-planner
```

## 🆘 获取帮助

如果遇到问题：

1. 查看本文档的故障排查部分
2. 检查 GitHub Issues
3. 提交新的 Issue 描述问题

## 📝 更新应用

### 使用 Docker Compose

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### 使用 Docker

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
docker stop ai-travel-planner
docker rm ai-travel-planner
docker run -d --name ai-travel-planner -p 3000:3000 --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

---

**祝部署顺利！** 🎉
