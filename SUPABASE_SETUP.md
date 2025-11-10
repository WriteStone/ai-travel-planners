# 🚀 Supabase 云端模式配置指南

## 📋 配置概览

启用云端模式后,你将获得:
- ✅ **真实的用户注册/登录系统** (不再是演示模式)
- ✅ **云端数据持久化** (数据永久保存在云端)
- ✅ **多设备同步** (手机、电脑、平板随时访问)
- ✅ **数据安全** (Row Level Security 保护)
- ✅ **免费额度** (500MB 数据库 + 1GB 文件存储)

---

## 🎯 第一步:创建 Supabase 账号

### 1. 访问 Supabase 官网
```
https://supabase.com/
```

### 2. 点击 "Start your project" 或 "Sign up"

### 3. 选择注册方式
- **推荐**: 使用 GitHub 账号登录(最快速)
- 或使用邮箱注册

### 4. 完成注册
- 验证邮箱(如果使用邮箱注册)
- 登录到 Supabase Dashboard

---

## 🏗️ 第二步:创建项目

### 1. 在 Dashboard 点击 "New Project"

### 2. 填写项目信息
```
Organization: 选择你的组织(首次使用会自动创建)
Project Name: AI Travel Planner (或任意名称)
Database Password: 设置一个强密码(请务必记住!)
Region: 选择 Northeast Asia (Tokyo) - 离中国最近
Pricing Plan: Free (免费计划)
```

### 3. 点击 "Create new project"
- 等待 1-2 分钟,项目创建中...
- 看到 "Project is ready" 即可进入下一步

---

## 🔑 第三步:获取 API 凭证

### 1. 在项目 Dashboard 左侧菜单点击 "Settings" (设置图标)

### 2. 点击 "API" 标签

### 3. 找到以下信息:

#### Project URL
```
格式: https://xxxxxxxxx.supabase.co
复制这个完整 URL
```

#### Project API keys - anon public
```
格式: eyJhbGc... (一个很长的字符串)
复制 "anon" 或 "public" 标签下的 Key
```

---

## 🗄️ 第四步:创建数据库表

### 1. 在左侧菜单点击 "SQL Editor"

### 2. 点击 "+ New query"

### 3. 复制整个 `supabase/schema.sql` 文件内容并粘贴

**重要**: 文件位于 `f:\work\supabase\schema.sql`,包含:
- profiles 表(用户资料)
- trips 表(旅行计划)
- expenses 表(费用记录)
- Row Level Security 策略
- 索引和触发器

### 4. 点击 "Run" 执行 SQL

### 5. 确认创建成功
- 看到 "Success. No rows returned" 表示成功
- 在左侧菜单 "Table Editor" 中应该能看到 3 个表

---

## ⚙️ 第五步:配置环境变量

### 1. 打开项目根目录的 `.env.local` 文件

### 2. 替换以下两行:

**替换前:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**替换后:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...你的完整anon密钥
```

### 3. 保存文件

---

## 🔄 第六步:重启应用

### 1. 在终端按 `Ctrl + C` 停止当前运行

### 2. 重新启动开发服务器:
```bash
npm run dev
```

### 3. 访问 http://localhost:3000

---

## ✅ 第七步:验证云端模式

### 1. 测试注册功能
- 访问注册页面
- **注意**: 不再显示 "演示模式" 提示
- 使用真实邮箱注册
- 检查邮箱,点击验证链接(Supabase 会发送)

### 2. 验证数据存储
- 登录后创建一个旅行计划
- 在 Supabase Dashboard → Table Editor → trips 表中查看
- 应该能看到刚创建的记录!

### 3. 测试多设备同步
- 在另一个浏览器登录
- 应该能看到同样的旅行计划
- 任何修改都会实时同步

---

## 🎉 完成!你现在使用的是云端模式

### 功能对比

| 功能 | 演示模式 | 云端模式 |
|------|---------|---------|
| 数据存储位置 | 浏览器 LocalStorage | Supabase 云端 |
| 数据持久性 | 清除浏览器数据会丢失 | 永久保存 |
| 多设备访问 | ❌ 否 | ✅ 是 |
| 用户认证 | 模拟 | 真实邮箱验证 |
| 数据安全 | 基础 | RLS 行级安全 |
| 协作功能 | ❌ 否 | ✅ 可扩展 |
| 免费额度 | 无限 | 500MB 数据库 |

---

## 🔧 故障排除

### 问题 1: "Failed to fetch" 错误
**原因**: API URL 或 Key 配置错误
**解决**:
1. 检查 `.env.local` 中的 URL 是否正确(包含 https://)
2. 确认 ANON_KEY 完整复制(通常很长,以 eyJ 开头)
3. 重启开发服务器

### 问题 2: 注册后收不到验证邮件
**原因**: Supabase 免费计划邮件限制
**解决**:
1. 在 Supabase Dashboard → Authentication → Settings
2. 关闭 "Enable email confirmations"(开发测试时)
3. 或检查垃圾邮件文件夹

### 问题 3: "Row Level Security" 错误
**原因**: RLS 策略未正确创建
**解决**:
1. 在 SQL Editor 重新运行 `schema.sql`
2. 确认所有策略都已创建
3. 检查 Authentication → Policies

### 问题 4: 数据库密码忘记了
**原因**: 创建项目时设置的密码
**解决**:
- 密码只用于数据库直连(不影响应用使用)
- 应用只需要 URL 和 ANON_KEY
- 如需重置,在 Settings → Database 中操作

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase 中文教程](https://supabase.com/docs/zh-CN)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
- [免费额度说明](https://supabase.com/pricing)

---

## 🆘 需要帮助?

如果配置过程中遇到问题:
1. 检查 Supabase Dashboard 中的 Logs
2. 查看浏览器控制台错误信息
3. 确认所有步骤都已正确完成
4. 参考项目中的 `DEMO_MODE_GUIDE.md` 对比演示模式

---

**🎊 恭喜!现在你的 AI 旅行规划师已经是一个真正的云端应用了!**
