# Contributing to AI Travel Planner

感谢您考虑为 AI Travel Planner 做出贡献！

## 如何贡献

### 报告 Bug

如果您发现了 bug，请：

1. 检查是否已有相关 Issue
2. 如果没有，创建新的 Issue
3. 提供详细的复现步骤
4. 包含您的环境信息（浏览器、操作系统等）

### 功能建议

我们欢迎新功能建议！请：

1. 创建一个 Issue 描述您的想法
2. 说明为什么这个功能有用
3. 提供可能的实现方案

### 提交代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 编写清晰的注释
- 保持代码简洁

### Commit 信息规范

使用语义化的 commit 信息：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: add voice recognition for expense tracking
fix: resolve map rendering issue on mobile
docs: update API configuration guide
```

## 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动开发服务器
npm run dev
```

## 测试

在提交 PR 之前，请确保：

```bash
# 类型检查通过
npm run type-check

# 代码检查通过
npm run lint

# 构建成功
npm run build
```

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下发布。
