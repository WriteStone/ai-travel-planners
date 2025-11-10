# 快速开始指南

本指南帮助您在 5 分钟内启动 AI Travel Planner。

## 🚀 快速启动（Docker）

### 前提条件
- 安装 Docker 和 Docker Compose
- 获取必要的 API 密钥

### 步骤

1. **克隆并进入项目目录**
```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

2. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# Windows: notepad .env
# Mac/Linux: nano .env
```

最小配置（必需）：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_AMAP_KEY=xxxxx
```

3. **启动应用**
```bash
docker-compose up -d
```

4. **访问应用**

打开浏览器访问: http://localhost:3000

5. **注册账户**

- 点击"注册"按钮
- 填写邮箱和密码
- 验证邮箱（检查收件箱）

6. **开始使用**

- 登录后点击"开始规划旅行"
- 使用语音或文字输入旅行需求
- 等待 AI 生成行程
- 查看地图和费用管理

## 🖥️ 本地开发启动

如果您想进行开发：

```bash
# 安装依赖
npm install

# 配置 .env 文件
cp .env.example .env

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 📱 使用示例

### 语音输入示例

点击麦克风按钮，说出：
> "我想去日本东京，5天，预算1万元，喜欢美食和动漫，2个人"

### 手动输入示例

- **目的地**: 日本东京
- **开始日期**: 2025-12-01
- **结束日期**: 2025-12-05
- **预算**: 10000 元
- **同行人数**: 2 人
- **旅行偏好**: 美食、文化、动漫

点击"生成旅行计划"，AI 将自动生成详细行程。

## 🔧 常见问题

### Q: Docker 启动失败？
A: 检查端口 3000 是否被占用，或查看日志：
```bash
docker-compose logs
```

### Q: 无法连接 Supabase？
A: 确认 URL 和密钥正确，并检查网络连接

### Q: AI 生成失败？
A: 检查 OpenAI API Key 是否有效且有余额

### Q: 地图不显示？
A: 确认高德地图 API Key 正确且已开通 Web 服务

## 📚 更多文档

- [完整 README](README.md)
- [部署指南](DEPLOYMENT.md)
- [提交文档](SUBMISSION.md)

## 🆘 获取帮助

如遇到问题：
1. 查看项目 README.md
2. 检查 GitHub Issues
3. 联系开发者

---

祝您使用愉快！ 🎉
