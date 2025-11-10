# Docker 部署指南

## 📦 GitHub Container Registry

本项目的Docker镜像自动构建并发布到GitHub Container Registry (GHCR)。

### 镜像地址

```
ghcr.io/writestone/ai-travel-planners:latest
```

### 自动构建

每次推送到`main`分支时,GitHub Actions会自动:
1. 构建Docker镜像
2. 推送到GitHub Container Registry
3. 打上多个标签(latest, sha, branch等)

### 镜像标签

- `latest` - 最新的主分支版本
- `main` - 主分支最新版本
- `main-<sha>` - 特定commit的版本

## 🚀 使用Docker镜像

### 1. 拉取镜像

```bash
docker pull ghcr.io/writestone/ai-travel-planners:latest
```

### 2. 运行容器

#### 基本运行

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_supabase_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key \
  -e DASHSCOPE_API_KEY=your_dashscope_key \
  ghcr.io/writestone/ai-travel-planners:latest
```

#### 使用环境变量文件

创建`.env`文件:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DASHSCOPE_API_KEY=sk-xxxxxx
NEXT_PUBLIC_AMAP_KEY=your_amap_key
```

运行容器:
```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/writestone/ai-travel-planners:latest
```

### 3. 使用Docker Compose

创建`docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/writestone/ai-travel-planners:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
      - NEXT_PUBLIC_AMAP_KEY=${NEXT_PUBLIC_AMAP_KEY}
    restart: unless-stopped
```

启动:
```bash
docker-compose up -d
```

## 🔧 本地构建Docker镜像

### 1. 构建镜像

```bash
docker build -t ai-travel-planner:local .
```

### 2. 运行本地镜像

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env.local \
  ai-travel-planner:local
```

## 📊 查看镜像

访问GitHub仓库的Packages页面:
https://github.com/WriteStone/ai-travel-planners/pkgs/container/ai-travel-planners

## 🔐 配置GitHub Actions

GitHub Actions会自动使用`GITHUB_TOKEN`进行认证,无需额外配置。

镜像构建状态可以在仓库的Actions标签页查看。

## 📝 环境变量说明

### 必需的环境变量

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase项目URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase匿名密钥
- `DASHSCOPE_API_KEY` - 阿里云百炼API密钥

### 可选的环境变量

- `NEXT_PUBLIC_AMAP_KEY` - 高德地图API密钥
- `NEXT_PUBLIC_APP_URL` - 应用URL (默认: http://localhost:3000)
- `NODE_ENV` - 环境 (默认: production)

## 🐛 故障排查

### 查看容器日志

```bash
docker logs ai-travel-planner
```

### 进入容器调试

```bash
docker exec -it ai-travel-planner sh
```

### 检查容器状态

```bash
docker ps -a | grep ai-travel-planner
```

## 🔄 更新镜像

```bash
# 停止并删除旧容器
docker stop ai-travel-planner
docker rm ai-travel-planner

# 拉取最新镜像
docker pull ghcr.io/writestone/ai-travel-planners:latest

# 运行新容器
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/writestone/ai-travel-planners:latest
```

## 📚 更多信息

- [Docker官方文档](https://docs.docker.com/)
- [GitHub Container Registry文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [项目README](./README.md)
