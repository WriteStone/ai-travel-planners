# 🎁 免费 API 获取完整指南

## 🌟 推荐方案：阿里云百炼（DashScope）

**为什么推荐？**
- ✅ **完全免费** - 新用户有大量免费调用额度
- ✅ **无需绑卡** - 实名认证即可
- ✅ **国内访问快** - 服务器在国内，速度快
- ✅ **中文支持好** - 通义千问模型，中文理解优秀
- ✅ **兼容 OpenAI** - 使用相同的 API 格式

---

## 📝 获取阿里云百炼 API Key（5分钟）

### 第 1 步：注册阿里云账号

1. **访问官网**：https://dashscope.aliyun.com/
2. **点击「免费开通」**
3. **使用手机号注册**（或使用已有阿里云账号登录）
4. **完成实名认证**（需要身份证照片，自动审核，1分钟完成）

### 第 2 步：开通 DashScope 服务

1. 登录后，点击「控制台」
2. 在左侧菜单找到「API-KEY 管理」
3. 点击「创建新的 API-KEY」
4. **复制生成的 API Key**（格式：`sk-xxxxxxxxxx`）

⚠️ **重要**：API Key 只显示一次，请立即保存！

### 第 3 步：配置到项目

打开 `f:\work\.env.local` 文件，找到这一行：

```bash
DASHSCOPE_API_KEY=your-dashscope-api-key
```

替换为您的真实 API Key：

```bash
DASHSCOPE_API_KEY=sk-你复制的真实key
```

### 第 4 步：重启开发服务器

在终端按 **Ctrl+C** 停止服务器，然后重新运行：

```powershell
npm run dev
```

### 第 5 步：测试 AI 功能

1. 访问：http://localhost:3000/planner
2. **蓝色提示框消失了** = 配置成功！
3. 填写行程信息，点击「生成智能行程」
4. 等待 5-10 秒，看到真实的 AI 生成结果 🎉

---

## 🎯 免费额度说明

### 阿里云百炼免费额度

| 模型 | 免费额度 | 有效期 |
|------|---------|--------|
| qwen-turbo | 100万 tokens | 长期有效 |
| qwen-plus | 100万 tokens | 长期有效 |
| qwen-max | 10万 tokens | 首月免费 |

**1次行程生成大约消耗：**
- 输入：约 500 tokens
- 输出：约 2000 tokens
- 合计：约 2500 tokens

**免费额度可以生成：**
- qwen-turbo：约 **400 次**行程
- qwen-plus：约 **400 次**行程

完全够用！🎊

---

## 📸 图文教程

### 步骤 1：访问官网并注册

![](https://dashscope.aliyun.com/)

1. 点击右上角「登录/注册」
2. 使用手机号注册
3. 设置密码

### 步骤 2：实名认证

1. 登录后会提示完成实名认证
2. 上传身份证正反面照片
3. 等待自动审核（通常1分钟内完成）

### 步骤 3：创建 API Key

1. 进入控制台
2. 左侧菜单 → API-KEY 管理
3. 点击「创建新的 API-KEY」
4. 输入备注名称：`AI Travel Planner`
5. 点击确定
6. **立即复制 API Key**（只显示一次！）

### 步骤 4：查看免费额度

1. 在控制台首页可以看到「资源包」
2. 显示剩余调用次数
3. 每次调用后会实时更新

---

## 🎁 其他免费 API 选项

### 方案 2：DeepSeek（极低成本）

**特点：**
- ✅ 价格超便宜（0.001元/千tokens）
- ✅ 性能不错
- ❌ 需要充值（最低10元）

**获取方式：**
1. 访问：https://platform.deepseek.com/
2. 注册并充值 10 元
3. 创建 API Key
4. 配置到 `.env.local`：
   ```bash
   OPENAI_API_KEY=sk-your-deepseek-key
   OPENAI_BASE_URL=https://api.deepseek.com/v1
   ```

### 方案 3：智谱 AI（GLM-4）

**特点：**
- ✅ 新用户赠送免费额度
- ✅ 中文能力强
- ❌ 需要实名认证

**获取方式：**
1. 访问：https://open.bigmodel.cn/
2. 注册并实名认证
3. 创建 API Key
4. 配置：
   ```bash
   OPENAI_API_KEY=your-zhipu-key
   OPENAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4/
   ```

### 方案 4：Kimi（月之暗面）

**特点：**
- ✅ 长上下文（支持20万字）
- ✅ 新用户有免费额度
- ❌ API 申请需要审核

**获取方式：**
1. 访问：https://platform.moonshot.cn/
2. 申请 API 访问权限
3. 等待审核通过

---

## 🚀 配置完成后的效果

### 使用模拟数据 vs 真实 AI

| 对比项 | 模拟数据 | 真实 AI（百炼） |
|--------|---------|----------------|
| 响应速度 | 即时 | 5-10秒 |
| 行程质量 | 模板化 | 个性化、详细 |
| 景点真实性 | 通用描述 | 真实景点推荐 |
| 餐厅推荐 | 通用名称 | 真实餐厅名称 |
| 费用估算 | 基于预算分配 | 基于真实价格 |
| 适应偏好 | 基础适应 | 深度理解需求 |

### 真实 AI 生成示例

**输入：**
```
目的地：成都
天数：3天
预算：3000元
人数：2人
偏好：美食、文化
```

**AI 生成（节选）：**
```json
{
  "overview": "这是一趟专为美食爱好者打造的成都3日深度游...",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "09:00",
          "name": "武侯祠",
          "description": "参观三国文化圣地，了解诸葛亮的传奇一生...",
          "location": "武侯祠大街231号",
          "cost": 60
        },
        {
          "time": "12:00",
          "name": "午餐：陈麻婆豆腐",
          "description": "品尝正宗的陈麻婆豆腐，这是成都最具代表性的川菜...",
          "location": "骡马市",
          "cost": 80
        }
      ]
    }
  ]
}
```

看到了吗？**真实的地点名称、详细的描述、准确的费用！**

---

## ⚙️ 配置验证

### 如何知道配置成功？

1. **访问规划页面**
   - http://localhost:3000/planner
   
2. **检查提示信息**
   - ❌ 显示蓝色框"使用模拟行程生成" = 未配置
   - ✅ 没有蓝色提示框 = 配置成功！

3. **查看终端日志**
   ```
   使用模拟数据生成行程（未配置 API Key）  ← 未配置
   （无此日志）                              ← 配置成功
   ```

4. **生成一个行程**
   - 模拟数据：瞬间生成，内容通用
   - 真实 AI：需要5-10秒，内容详细真实

---

## 🐛 常见问题

### Q1: API Key 复制错了怎么办？
A: 重新在阿里云控制台创建一个新的 API Key，然后替换到 `.env.local`

### Q2: 配置后还是显示"模拟行程生成"？
A: 检查：
1. API Key 格式是否正确（以 `sk-` 开头）
2. 是否重启了开发服务器（Ctrl+C 后重新 `npm run dev`）
3. `.env.local` 文件是否保存

### Q3: 报错 "API Key is invalid"？
A: 
1. 检查 API Key 是否完整复制（不要有空格）
2. 确认在阿里云控制台 API Key 是否启用状态
3. 检查账号是否完成实名认证

### Q4: 生成很慢或超时？
A: 
1. 检查网络连接
2. 阿里云服务器可能繁忙，稍后重试
3. 可以尝试 qwen-turbo 模型（更快但稍简单）

### Q5: 免费额度用完了怎么办？
A: 
1. 充值后按量付费（非常便宜，0.002元/千tokens）
2. 或切换回模拟数据模式（注释掉 DASHSCOPE_API_KEY）

---

## 📞 需要帮助？

### 遇到问题？

1. **检查配置**
   ```powershell
   # 在项目根目录打开 PowerShell
   cat .env.local
   ```

2. **查看日志**
   - 开发服务器的终端会显示详细错误信息

3. **测试 API**
   ```javascript
   // 在浏览器控制台测试
   fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer sk-你的key',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       model: 'qwen-turbo',
       messages: [{role: 'user', content: '你好'}]
     })
   }).then(r => r.json()).then(console.log)
   ```

---

## 🎉 开始使用！

### 完整流程回顾

1. ✅ 注册阿里云账号
2. ✅ 完成实名认证
3. ✅ 创建 API Key
4. ✅ 配置到 `.env.local`
5. ✅ 重启开发服务器
6. ✅ 测试生成行程

**只需 5 分钟，您就能体验到真实的 AI 智能行程规划！**

---

## 📚 相关文档

- [阿里云百炼官方文档](https://help.aliyun.com/zh/dashscope/)
- [API 使用教程](https://dashscope.aliyuncs.com/docs)
- [价格说明](https://dashscope.aliyun.com/pricing)

---

**祝您配置顺利！** 🚀

如有任何问题，随时问我！
